import logging
from typing import List, Dict, Any, Optional
import httpx
from app.connectors.base import BaseLegalConnector, LegalDocument, LegalSourceType, AuthorityLevel
from app.core.config import settings
from app.engine.corpus import AUTHORITATIVE_DOCUMENTS

logger = logging.getLogger(__name__)

class IndianKanoonConnector(BaseLegalConnector):
    name = "Indian Kanoon"
    source_type = LegalSourceType.JUDGMENT_SC

    def __init__(self):
        self.api_key = settings.INDIAN_KANOON_API_KEY
        self.base_url = "https://api.indiankanoon.org"

    async def search(self, query: str, filters: Optional[Dict[str, Any]] = None, limit: int = 5) -> List[LegalDocument]:
        """
        Searches Indian Kanoon API if API key is provided, or queries the curated
        authoritative judicial corpus matching keywords and citations.
        """
        results: List[LegalDocument] = []
        
        # If API key is present, attempt live query
        if self.api_key:
            try:
                async with httpx.AsyncClient(timeout=10.0) as client:
                    headers = {"Authorization": f"Token {self.api_key}"}
                    data_payload = {"formInput": query, "pagenum": 0}
                    resp = await client.post(f"{self.base_url}/search/", headers=headers, data=data_payload)
                    if resp.status_code == 200:
                        data = resp.json()
                        for doc in data.get("docs", [])[:limit]:
                            clean_headline = (doc.get("headline") or "").replace("<b>", "").replace("</b>", "").strip()
                            results.append(LegalDocument(
                                id=f"ik-{doc.get('tid')}",
                                title=doc.get("title", "Untitled Document"),
                                source_name="Indian Kanoon (Live API)",
                                source_url=f"https://indiankanoon.org/doc/{doc.get('tid')}/",
                                doc_type=LegalSourceType.JUDGMENT_SC,
                                authority_level=AuthorityLevel.SC_DIVISION_BENCH,
                                citation=f"Indian Kanoon TID: {doc.get('tid')}",
                                snippet=clean_headline,
                                content=clean_headline,
                                ratio_decidendi=clean_headline,
                                score=doc.get("score", 0.0)
                            ))
                        if results:
                            return results
            except Exception as e:
                logger.warning(f"Indian Kanoon live search failed: {e}. Falling back to authoritative repository.")

        # Authoritative corpus match
        query_terms = [t.lower() for t in query.replace("?", "").replace(",", "").split() if len(t) > 2]
        for doc in AUTHORITATIVE_DOCUMENTS:
            text_to_search = f"{doc.title} {doc.act or ''} {doc.section or ''} {doc.snippet} {doc.ratio_decidendi or ''} {doc.citation}".lower()
            matches = sum(1 for term in query_terms if term in text_to_search)
            if matches > 0:
                score = matches / max(len(query_terms), 1)
                doc_copy = doc.model_copy()
                doc_copy.score = score
                results.append(doc_copy)

        results.sort(key=lambda x: (x.authority_level.value, x.score), reverse=True)
        return results[:limit]

    async def get_document(self, doc_id: str) -> Optional[LegalDocument]:
        for doc in AUTHORITATIVE_DOCUMENTS:
            if doc.id == doc_id:
                return doc
        return None
