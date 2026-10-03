import asyncio
import logging
import math
from typing import List, Dict, Any, Optional
from app.connectors.base import BaseLegalConnector, LegalDocument
from app.connectors.indian_kanoon import IndianKanoonConnector
from app.connectors.india_code import IndiaCodeConnector
from app.connectors.supreme_court import SupremeCourtConnector
from app.connectors.high_court import HighCourtConnector
from app.connectors.law_commission import LawCommissionConnector
from app.connectors.commercial_adapters import SCCOnlineAdapter, ManupatraAdapter
from app.connectors.user_documents import user_document_connector
from app.engine.hierarchy_reranker import rerank_by_authority

logger = logging.getLogger(__name__)

class HybridSearchEngine:
    def __init__(self):
        self.connectors: List[BaseLegalConnector] = [
            user_document_connector,
            IndianKanoonConnector(),
            IndiaCodeConnector(),
            SupremeCourtConnector(),
            HighCourtConnector(),
            LawCommissionConnector(),
            SCCOnlineAdapter(),
            ManupatraAdapter(),
        ]

    async def search(
        self,
        query: str,
        active_sources: Optional[List[str]] = None,
        filters: Optional[Dict[str, Any]] = None,
        limit: int = 10
    ) -> List[LegalDocument]:
        """
        Orchestrates parallel search across all selected legal connectors,
        fuses results with Reciprocal Rank Fusion (RRF), and reranks according to
        the Indian legal hierarchy.
        """
        tasks = []
        for conn in self.connectors:
            if active_sources and conn.name not in active_sources:
                continue
            tasks.append(conn.search(query, filters=filters, limit=limit))

        results_by_source = await asyncio.gather(*tasks, return_exceptions=True)

        # Reciprocal Rank Fusion (RRF)
        rrf_scores: Dict[str, float] = {}
        doc_store: Dict[str, LegalDocument] = {}
        k = 60 # RRF smoothing parameter

        for source_res in results_by_source:
            if isinstance(source_res, Exception):
                logger.error(f"Search connector error: {source_res}")
                continue
            if not isinstance(source_res, list):
                continue

            for rank, doc in enumerate(source_res):
                doc_store[doc.id] = doc
                rrf_score = 1.0 / (k + (rank + 1))
                rrf_scores[doc.id] = rrf_scores.get(doc.id, 0.0) + rrf_score

        # Assign calculated fused score
        merged_docs: List[LegalDocument] = []
        for doc_id, doc in doc_store.items():
            doc_copy = doc.model_copy()
            doc_copy.score = round(rrf_scores.get(doc_id, 0.0) * 100, 2)
            merged_docs.append(doc_copy)

        # Apply judicial authority reranker
        reranked = rerank_by_authority(merged_docs)
        return reranked[:limit]

hybrid_search_engine = HybridSearchEngine()
