import logging
from typing import List, Dict, Any, Optional
from app.connectors.base import BaseLegalConnector, LegalDocument, LegalSourceType, AuthorityLevel
from app.engine.corpus import AUTHORITATIVE_DOCUMENTS

logger = logging.getLogger(__name__)

class LawCommissionConnector(BaseLegalConnector):
    name = "Law Commission of India"
    source_type = LegalSourceType.LAW_COMMISSION

    async def search(self, query: str, filters: Optional[Dict[str, Any]] = None, limit: int = 3) -> List[LegalDocument]:
        results: List[LegalDocument] = []
        q_lower = query.lower()

        for doc in AUTHORITATIVE_DOCUMENTS:
            if doc.doc_type == LegalSourceType.LAW_COMMISSION:
                text_to_search = f"{doc.title} {doc.snippet} {doc.content}".lower()
                query_words = [w for w in q_lower.split() if len(w) > 2]
                match_count = sum(1 for w in query_words if w in text_to_search)

                if match_count > 0 or "bail" in q_lower or "reform" in q_lower:
                    doc_copy = doc.model_copy()
                    doc_copy.score = (match_count + 1) / (len(query_words) + 1)
                    results.append(doc_copy)

        return results[:limit]

    async def get_document(self, doc_id: str) -> Optional[LegalDocument]:
        for doc in AUTHORITATIVE_DOCUMENTS:
            if doc.id == doc_id and doc.doc_type == LegalSourceType.LAW_COMMISSION:
                return doc
        return None
