import logging
from typing import List, Dict, Any, Optional
from app.connectors.base import BaseLegalConnector, LegalDocument, LegalSourceType, AuthorityLevel
from app.engine.corpus import AUTHORITATIVE_DOCUMENTS, TRANSITION_MAP

logger = logging.getLogger(__name__)

class IndiaCodeConnector(BaseLegalConnector):
    """
    Connector for India Code (Official Legislative Department, Ministry of Law and Justice).
    Retrieves Central Acts, Sections, Amendments, and Sanhita Transition mappings.
    """
    name = "India Code (Legislative Department)"
    source_type = LegalSourceType.STATUTE

    async def search(self, query: str, filters: Optional[Dict[str, Any]] = None, limit: int = 5) -> List[LegalDocument]:
        results: List[LegalDocument] = []
        q_lower = query.lower()

        # Check for statute documents in authoritative corpus
        for doc in AUTHORITATIVE_DOCUMENTS:
            if doc.doc_type == LegalSourceType.STATUTE:
                combined_text = f"{doc.title} {doc.act or ''} {doc.section or ''} {doc.content}".lower()
                query_words = [w for w in q_lower.split() if len(w) > 2]
                match_count = sum(1 for w in query_words if w in combined_text)
                if match_count > 0:
                    doc_copy = doc.model_copy()
                    doc_copy.score = match_count / max(len(query_words), 1)
                    results.append(doc_copy)

        # Check if the query asks about criminal provisions, automatically link the new Sanhitas!
        if ("anticipatory bail" in q_lower or "438" in q_lower or "482" in q_lower or "bail" in q_lower) and not any("bnss" in d.id for d in results):
            for doc in AUTHORITATIVE_DOCUMENTS:
                if doc.id == "ic-statute-bnss-482" and doc not in results:
                    doc_copy = doc.model_copy()
                    doc_copy.score = 0.95
                    results.append(doc_copy)

        results.sort(key=lambda x: x.score, reverse=True)
        return results[:limit]

    async def get_document(self, doc_id: str) -> Optional[LegalDocument]:
        for doc in AUTHORITATIVE_DOCUMENTS:
            if doc.id == doc_id:
                return doc
        return None

    def get_transition_details(self, key: str) -> Optional[Dict[str, Any]]:
        return TRANSITION_MAP.get(key)
