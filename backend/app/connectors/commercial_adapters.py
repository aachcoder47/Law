"""
Permitted Commercial Legal Database Adapters (SCC Online, Manupatra).
These adapters adhere strictly to authorized, licensed API contracts and
explicitly refuse scraping, paywall circumvention, or unauthorized access.
"""

import logging
from typing import List, Dict, Any, Optional
import httpx
from app.connectors.base import BaseLegalConnector, LegalDocument, LegalSourceType, AuthorityLevel
from app.core.config import settings

logger = logging.getLogger(__name__)

class SCCOnlineAdapter(BaseLegalConnector):
    """
    Adapter for SCC Online's permitted enterprise/institutional API.
    Requires official API key or licensed token.
    """
    name = "SCC Online (Licensed API)"
    source_type = LegalSourceType.JUDGMENT_SC

    def __init__(self):
        self.api_key = settings.SCC_ONLINE_API_KEY
        self.api_endpoint = "https://api.scconline.com/v1"

    async def search(self, query: str, filters: Optional[Dict[str, Any]] = None, limit: int = 5) -> List[LegalDocument]:
        if not self.api_key:
            # Strictly adhering to terms: No unauthorized scraping or bypassing paywalls.
            logger.info("SCC Online API key not configured. Adapter ready for licensed access.")
            return []

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                headers = {
                    "Authorization": f"Bearer {self.api_key}",
                    "Accept": "application/json"
                }
                payload = {
                    "query": query,
                    "limit": limit,
                    "jurisdiction": filters.get("court", "SC") if filters else "SC"
                }
                resp = await client.post(f"{self.api_endpoint}/search", headers=headers, json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    docs = []
                    for item in data.get("results", []):
                        docs.append(LegalDocument(
                            id=f"scc-{item.get('id')}",
                            title=item.get("title", ""),
                            source_name=self.name,
                            source_url=item.get("url", "https://www.scconline.com"),
                            doc_type=LegalSourceType.JUDGMENT_SC,
                            authority_level=AuthorityLevel.SC_DIVISION_BENCH,
                            citation=item.get("citation", ""),
                            court=item.get("court", "Supreme Court of India"),
                            bench=item.get("bench", ""),
                            date=item.get("judgment_date", ""),
                            snippet=item.get("summary", ""),
                            content=item.get("text", ""),
                            current_status=item.get("status", "Good Law")
                        ))
                    return docs
        except Exception as e:
            logger.warning(f"SCC Online permitted API error: {e}")
        return []

    async def get_document(self, doc_id: str) -> Optional[LegalDocument]:
        return None


class ManupatraAdapter(BaseLegalConnector):
    """
    Adapter for Manupatra's official REST API for licensed subscribers.
    """
    name = "Manupatra (Licensed API)"
    source_type = LegalSourceType.JUDGMENT_SC

    def __init__(self):
        self.api_key = settings.MANUPATRA_API_KEY
        self.api_endpoint = "https://api.manupatra.com/v1"

    async def search(self, query: str, filters: Optional[Dict[str, Any]] = None, limit: int = 5) -> List[LegalDocument]:
        if not self.api_key:
            logger.info("Manupatra API key not configured. Adapter ready for licensed access.")
            return []

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                headers = {
                    "X-Manupatra-Auth": self.api_key,
                    "Content-Type": "application/json"
                }
                resp = await client.get(
                    f"{self.api_endpoint}/search",
                    headers=headers,
                    params={"term": query, "rows": limit}
                )
                if resp.status_code == 200:
                    data = resp.json()
                    docs = []
                    for item in data.get("docs", []):
                        docs.append(LegalDocument(
                            id=f"manu-{item.get('manu_id')}",
                            title=item.get("case_name", ""),
                            source_name=self.name,
                            source_url=f"https://www.manupatrafast.in/?manu={item.get('manu_id')}",
                            doc_type=LegalSourceType.JUDGMENT_SC,
                            authority_level=AuthorityLevel.SC_DIVISION_BENCH,
                            citation=item.get("citation", ""),
                            court=item.get("court", ""),
                            snippet=item.get("catchwords", ""),
                            content=item.get("judgment_text", "")
                        ))
                    return docs
        except Exception as e:
            logger.warning(f"Manupatra permitted API error: {e}")
        return []

    async def get_document(self, doc_id: str) -> Optional[LegalDocument]:
        return None
