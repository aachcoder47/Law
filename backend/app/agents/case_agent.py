from typing import List, Dict, Any
from app.connectors.base import LegalDocument, LegalSourceType

class CaseLawAgent:
    """
    Extracts judicial holdings, ratio decidendi, court compositions,
    and classifies precedents by authority and status (Good Law vs Overruled).
    """
    async def analyze_cases(self, documents: List[LegalDocument]) -> Dict[str, Any]:
        judicial_docs = [
            d for d in documents 
            if d.doc_type in (LegalSourceType.JUDGMENT_SC, LegalSourceType.JUDGMENT_HC)
        ]

        precedents = []
        overruled_cases = []
        constitution_benches = []

        for doc in judicial_docs:
            case_entry = {
                "id": doc.id,
                "title": doc.title,
                "court": doc.court,
                "citation": doc.citation,
                "bench": doc.bench,
                "bench_size": doc.bench_size,
                "date": doc.date,
                "ratio_decidendi": doc.ratio_decidendi or doc.snippet,
                "current_status": doc.current_status,
                "status_details": doc.status_details,
                "source_url": doc.source_url,
                "doc_type": doc.doc_type.value
            }

            if doc.current_status == "Overruled":
                overruled_cases.append(case_entry)
            else:
                precedents.append(case_entry)
                if (doc.bench_size or 0) >= 5:
                    constitution_benches.append(case_entry)

        return {
            "total_precedents_analyzed": len(judicial_docs),
            "binding_precedents": precedents,
            "constitution_benches": constitution_benches,
            "overruled_cases": overruled_cases,
            "highest_bench": (
                max((d.bench_size or 1) for d in judicial_docs) 
                if judicial_docs else 0
            )
        }

case_agent = CaseLawAgent()
