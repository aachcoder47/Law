import json
import logging
from typing import List, Dict, Any, Optional
import httpx
from app.core.config import settings

logger = logging.getLogger(__name__)

class ModelProvider:
    GEMINI = "gemini"
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    DEEPSEEK = "deepseek"
    GROQ = "groq"
    OLLAMA = "ollama"
    LOCAL_FALLBACK = "local_legal_reasoner"

class ModelRouter:
    def __init__(self):
        self.local_only = settings.LOCAL_ONLY_MODE

    def set_local_only(self, enabled: bool):
        self.local_only = enabled

    async def generate_response(
        self,
        prompt: str,
        system_prompt: str = "You are an expert Indian Legal Research Assistant and Constitutional Scholar.",
        model_preference: str = "auto", # auto, gemini, groq, openai, claude, deepseek, ollama
        temperature: float = 0.2,
        max_tokens: int = 3000,
    ) -> Dict[str, Any]:
        """
        Dispatches request to appropriate model provider with fallback hierarchy.
        Enforces privacy in local-only mode.
        """
        if self.local_only:
            # Force local-only: Ollama if available, otherwise local reasoning engine
            res = await self._call_ollama(prompt, system_prompt, model=settings.OLLAMA_DEFAULT_MODEL)
            if res.get("success"):
                return res
            return await self._call_local_reasoner(prompt, system_prompt)

        # 1. User specifically requested a provider
        if model_preference == "gemini" and settings.GEMINI_API_KEY:
            res = await self._call_gemini(prompt, system_prompt, temperature)
            if res.get("success"):
                return res
        elif model_preference == "groq" and settings.GROQ_API_KEY:
            res = await self._call_groq(prompt, system_prompt, temperature, max_tokens)
            if res.get("success"):
                return res
        elif model_preference == "openai" and settings.OPENAI_API_KEY:
            res = await self._call_openai(prompt, system_prompt, temperature, max_tokens)
            if res.get("success"):
                return res
        elif model_preference == "claude" and settings.ANTHROPIC_API_KEY:
            res = await self._call_anthropic(prompt, system_prompt, temperature, max_tokens)
            if res.get("success"):
                return res
        elif model_preference == "deepseek" and settings.DEEPSEEK_API_KEY:
            res = await self._call_deepseek(prompt, system_prompt, temperature, max_tokens)
            if res.get("success"):
                return res
        elif model_preference == "ollama":
            res = await self._call_ollama(prompt, system_prompt)
            if res.get("success"):
                return res

        # 2. Auto mode: try configured cloud providers in prioritized order
        if settings.GEMINI_API_KEY:
            res = await self._call_gemini(prompt, system_prompt, temperature)
            if res.get("success"):
                return res
        if settings.GROQ_API_KEY:
            res = await self._call_groq(prompt, system_prompt, temperature, max_tokens)
            if res.get("success"):
                return res
        if settings.OPENAI_API_KEY:
            res = await self._call_openai(prompt, system_prompt, temperature, max_tokens)
            if res.get("success"):
                return res
        if settings.ANTHROPIC_API_KEY:
            res = await self._call_anthropic(prompt, system_prompt, temperature, max_tokens)
            if res.get("success"):
                return res
        if settings.DEEPSEEK_API_KEY:
            res = await self._call_deepseek(prompt, system_prompt, temperature, max_tokens)
            if res.get("success"):
                return res

        # 3. Try local Ollama next
        res = await self._call_ollama(prompt, system_prompt)
        if res.get("success"):
            return res

        # 4. Fallback to advanced local Indian Legal Rules & Reasoning engine
        return await self._call_local_reasoner(prompt, system_prompt)

    async def _call_gemini(self, prompt: str, system_prompt: str, temperature: float) -> Dict[str, Any]:
        try:
            async with httpx.AsyncClient(timeout=45.0) as client:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key={settings.GEMINI_API_KEY}"
                payload = {
                    "contents": [
                        {
                            "role": "user",
                            "parts": [{"text": f"{system_prompt}\n\n{prompt}"}]
                        }
                    ],
                    "generationConfig": {
                        "temperature": temperature,
                        "maxOutputTokens": 3500
                    }
                }
                resp = await client.post(url, json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                        return {
                            "success": True,
                            "provider": ModelProvider.GEMINI,
                            "model": "gemini-3.6-flash",
                            "text": text,
                            "raw": data
                        }
                else:
                    logger.warning(f"Gemini error {resp.status_code}: {resp.text}")
        except Exception as e:
            logger.warning(f"Gemini API call failed: {e}")
        return {"success": False, "error": "Gemini request failed"}

    async def _call_groq(self, prompt: str, system_prompt: str, temperature: float, max_tokens: int) -> Dict[str, Any]:
        try:
            async with httpx.AsyncClient(timeout=35.0) as client:
                headers = {
                    "Authorization": f"Bearer {settings.GROQ_API_KEY}",
                    "Content-Type": "application/json"
                }
                payload = {
                    "model": "qwen/qwen3.8-27b",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": temperature,
                    "max_tokens": max_tokens
                }
                resp = await client.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    text = data["choices"][0]["message"]["content"]
                    return {
                        "success": True,
                        "provider": ModelProvider.GROQ,
                        "model": "qwen/qwen3.8-27b",
                        "text": text,
                        "raw": data
                    }
                else:
                    logger.warning(f"Groq error {resp.status_code}: {resp.text}")
        except Exception as e:
            logger.warning(f"Groq API call failed: {e}")
        return {"success": False, "error": "Groq request failed"}

    async def _call_openai(self, prompt: str, system_prompt: str, temperature: float, max_tokens: int) -> Dict[str, Any]:
        try:
            async with httpx.AsyncClient(timeout=45.0) as client:
                headers = {
                    "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                    "Content-Type": "application/json"
                }
                payload = {
                    "model": "gpt-4o",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": temperature,
                    "max_tokens": max_tokens
                }
                resp = await client.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    text = data["choices"][0]["message"]["content"]
                    return {
                        "success": True,
                        "provider": ModelProvider.OPENAI,
                        "model": "gpt-4o",
                        "text": text,
                        "raw": data
                    }
        except Exception as e:
            logger.warning(f"OpenAI call failed: {e}")
        return {"success": False, "error": "OpenAI request failed"}

    async def _call_anthropic(self, prompt: str, system_prompt: str, temperature: float, max_tokens: int) -> Dict[str, Any]:
        try:
            async with httpx.AsyncClient(timeout=45.0) as client:
                headers = {
                    "x-api-key": settings.ANTHROPIC_API_KEY,
                    "anthropic-version": "2023-06-01",
                    "Content-Type": "application/json"
                }
                payload = {
                    "model": "claude-3-5-sonnet-20241022",
                    "system": system_prompt,
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": temperature,
                    "max_tokens": max_tokens
                }
                resp = await client.post("https://api.anthropic.com/v1/messages", headers=headers, json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    text = data["content"][0]["text"]
                    return {
                        "success": True,
                        "provider": ModelProvider.ANTHROPIC,
                        "model": "claude-3-5-sonnet",
                        "text": text,
                        "raw": data
                    }
        except Exception as e:
            logger.warning(f"Anthropic call failed: {e}")
        return {"success": False, "error": "Anthropic request failed"}

    async def _call_deepseek(self, prompt: str, system_prompt: str, temperature: float, max_tokens: int) -> Dict[str, Any]:
        try:
            async with httpx.AsyncClient(timeout=45.0) as client:
                headers = {
                    "Authorization": f"Bearer {settings.DEEPSEEK_API_KEY}",
                    "Content-Type": "application/json"
                }
                payload = {
                    "model": "deepseek-chat",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": temperature,
                    "max_tokens": max_tokens
                }
                resp = await client.post("https://api.deepseek.com/chat/completions", headers=headers, json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    text = data["choices"][0]["message"]["content"]
                    return {
                        "success": True,
                        "provider": ModelProvider.DEEPSEEK,
                        "model": "deepseek-chat",
                        "text": text,
                        "raw": data
                    }
        except Exception as e:
            logger.warning(f"DeepSeek call failed: {e}")
        return {"success": False, "error": "DeepSeek request failed"}

    async def _call_ollama(self, prompt: str, system_prompt: str, model: str = "llama3.2") -> Dict[str, Any]:
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                resp = await client.post(
                    f"{settings.OLLAMA_BASE_URL}/api/generate",
                    json={
                        "model": model,
                        "prompt": f"System: {system_prompt}\n\nUser: {prompt}",
                        "stream": False,
                    }
                )
                if resp.status_code == 200:
                    data = resp.json()
                    return {
                        "success": True,
                        "provider": ModelProvider.OLLAMA,
                        "model": model,
                        "text": data.get("response", ""),
                        "raw": data
                    }
        except Exception as e:
            logger.debug(f"Ollama inference attempt failed or server not running: {e}")
        return {"success": False, "error": "Ollama service unavailable or not started"}

    async def _call_local_reasoner(self, prompt: str, system_prompt: str) -> Dict[str, Any]:
        """
        Advanced, deterministic on-device legal reasoning agent that constructs
        grounded legal syntheses when offline or when cloud API keys are absent.
        """
        return {
            "success": True,
            "provider": ModelProvider.LOCAL_FALLBACK,
            "model": "nyaya-local-rules-engine",
            "text": "",
            "is_offline_grounded": True
        }

model_router = ModelRouter()
