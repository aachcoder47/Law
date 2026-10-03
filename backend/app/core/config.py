import os
from pydantic import BaseModel
from dotenv import load_dotenv, set_key

load_dotenv()

ENV_FILE_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env")

class Settings(BaseModel):
    APP_NAME: str = "NyayaAI - Indian Legal Research Agent"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api/v1"
    
    # Privacy Settings
    LOCAL_ONLY_MODE: bool = os.getenv("LOCAL_ONLY_MODE", "false").lower() in ("true", "1", "yes")
    
    # Ollama Local Inference
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_DEFAULT_MODEL: str = os.getenv("OLLAMA_DEFAULT_MODEL", "llama3.2")
    
    # Cloud LLM API Keys
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    DEEPSEEK_API_KEY: str = os.getenv("DEEPSEEK_API_KEY", "")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    
    # Legal API Keys
    INDIAN_KANOON_API_KEY: str = os.getenv("INDIAN_KANOON_API_KEY", "")
    SCC_ONLINE_API_KEY: str = os.getenv("SCC_ONLINE_API_KEY", "")
    MANUPATRA_API_KEY: str = os.getenv("MANUPATRA_API_KEY", "")

    # Storage & Cache
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./legal_research.db")
    CACHE_DIR: str = os.getenv("CACHE_DIR", "./cache")

    def update_key(self, key_name: str, key_value: str):
        setattr(self, key_name, key_value)
        os.environ[key_name] = key_value
        try:
            if not os.path.exists(ENV_FILE_PATH):
                with open(ENV_FILE_PATH, "w") as f:
                    f.write(f"{key_name}={key_value}\n")
            else:
                set_key(ENV_FILE_PATH, key_name, key_value)
        except Exception as e:
            pass

settings = Settings()
