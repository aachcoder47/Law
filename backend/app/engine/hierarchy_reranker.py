from typing import List
from app.connectors.base import LegalDocument

def rerank_by_authority(documents: List[LegalDocument]) -> List[LegalDocument]:
    """
    Reranks legal documents based on the Indian judicial hierarchy and doctrine of precedent:
    1. Constitution and Statutory Central Acts (India Code)
    2. Supreme Court Constitution Benches (5+ Judges)
    3. Supreme Court 3-Judge Benches
    4. Supreme Court 2-Judge Division Benches
    5. High Court Full Benches & Division Benches
    6. High Court Single Judge Benches
    7. Law Commission of India Reports / Commentary
    
    Penalizes overruled precedents while keeping them visible with explicit warnings.
    """
    def compute_composite_score(doc: LegalDocument) -> float:
        base_authority = float(doc.authority_level.value)
        
        # Penalize overruled decisions heavily so they don't lead the memo,
        # but remain tagged in cross-verification
        if doc.current_status == "Overruled":
            base_authority -= 40.0
            
        # Bonus for Constitution Benches
        if (doc.bench_size or 0) >= 5:
            base_authority += 10.0

        # Blend with retrieval relevance score
        composite = (base_authority * 0.6) + (doc.score * 40.0)
        return composite

    # Sort descending by composite score
    sorted_docs = sorted(documents, key=compute_composite_score, reverse=True)
    return sorted_docs
