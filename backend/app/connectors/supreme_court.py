import logging
from typing import List, Dict, Any, Optional
from app.connectors.base import BaseLegalConnector, LegalDocument, LegalSourceType, AuthorityLevel
from app.engine.corpus import AUTHORITATIVE_DOCUMENTS

logger = logging.getLogger(__name__)

class SupremeCourtConnector(BaseLegalConnector):
    """
    Connector for Supreme Court of India official judgments repository (e-SCR / SCI Portal).
    Filters and ranks judgments by Constitution Bench composition and precedent seniority.
    """
    name = "Supreme Court of India (e-SCR Portal)"
    source_type = LegalSourceType.JUDGMENT_SC

    async def search(self, query: str, filters: Optional[Dict[str, Any]] = None, limit: int = 5) -> List[LegalDocument]:
        results: List[LegalDocument] = []
        q_lower = query.lower()

        for doc in AUTHORITATIVE_DOCUMENTS:
            if doc.doc_type == LegalSourceType.JUDGMENT_SC:
                # Calculate relevance
                text_to_search = f"{doc.title} {doc.bench or ''} {doc.act or ''} {doc.section or ''} {doc.snippet} {doc.ratio_decidendi or ''}".lower()
                query_words = [w for w in q_lower.split() if len(w) > 2]
                match_count = sum(1 for w in query_words if w in text_to_search)

                # Filter by bench strength if specified in filters
                if filters and "min_bench_size" in filters:
                    if (doc.bench_size or 1) < filters["min_bench_size"]:
                        continue

                if match_count > 0:
                    doc_copy = doc.model_copy()
                    # Constitution benches get higher authority baseline
                    base_score = 0.5 + (0.1 * min(doc.bench_size or 1, 5))
                    doc_copy.score = base_score * (match_count / max(len(query_words), 1))
                    results.append(doc_copy)

        results.sort(key=lambda x: (x.authority_level.value, x.score), reverse=True)
        return results[:limit]

    async def get_document(self, doc_id: str) -> Optional[LegalDocument]:
        for doc in AUTHORITATIVE_DOCUMENTS:
            if doc.id == doc_id:
                return doc
        return None
