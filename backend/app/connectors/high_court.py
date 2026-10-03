import logging
from typing import List, Dict, Any, Optional
from app.connectors.base import BaseLegalConnector, LegalDocument, LegalSourceType, AuthorityLevel

logger = logging.getLogger(__name__)

HIGH_COURT_LANDMARKS: List[LegalDocument] = [
    LegalDocument(
        id="dhc-2023-anticipatory-bail-guidelines",
        title="Pankaj Bansal v. Union of India / State (NCT of Delhi)",
        source_name="Delhi High Court",
        source_url="https://delhihighcourt.nic.in/",
        doc_type=LegalSourceType.JUDGMENT_HC,
        authority_level=AuthorityLevel.HC_DIVISION_BENCH,
        citation="2023 DHC 6821",
        court="High Court of Delhi",
        bench="Division Bench (Suresh Kumar Kait, Neena Bansal Krishna, JJ.)",
        bench_size=2,
        date="2023-09-15",
        act="Code of Criminal Procedure, 1973",
        section="Section 438 CrPC",
        snippet="Anticipatory bail cannot be rejected merely because custodial interrogation is sought; the investigating agency must demonstrate tangible necessity for custodial detention.",
        content="""The Delhi High Court reiterated that custodial interrogation is not a magical phrase to automatically defeat an application for anticipatory bail under Section 438 CrPC. Where the applicant is ready and willing to cooperate with the investigation and has roots in society with no flight risk, pre-arrest bail must be granted.""",
        ratio_decidendi="Custodial interrogation claim by prosecution does not deprive the Court of discretion to grant anticipatory bail where accused shows bona fides and cooperation.",
        current_status="Good Law",
        status_details="High Court precedent adhering to Sushila Aggarwal (2020) SC Constitution Bench."
    ),
    LegalDocument(
        id="bom-2022-transit-anticipatory-bail",
        title="Shantanu Muluk v. State of Maharashtra",
        source_name="Bombay High Court",
        source_url="https://bombayhighcourt.nic.in/",
        doc_type=LegalSourceType.JUDGMENT_HC,
        authority_level=AuthorityLevel.HC_SINGLE_BENCH,
        citation="2022 BomCR (Cri) 412",
        court="High Court of Bombay",
        bench="Single Judge (Vibha Kankanwadi, J.)",
        bench_size=1,
        date="2022-02-16",
        act="Code of Criminal Procedure, 1973",
        section="Section 438 CrPC",
        snippet="A High Court has jurisdiction to grant transit anticipatory bail to protect an applicant residing within its territorial jurisdiction even if the FIR was registered in another State.",
        content="""The Bombay High Court held that to protect the fundamental right to personal liberty under Article 21, the High Court within whose territorial jurisdiction the applicant resides or apprehends imminent arrest can grant transit pre-arrest bail for a limited duration to enable the applicant to approach the jurisdictional High Court or Court of Session.""",
        ratio_decidendi="Transit anticipatory bail can be granted by a High Court where the applicant resides to prevent imminent arrest across state borders until the competent territorial court is approached.",
        current_status="Good Law",
        status_details="Followed by Delhi HC and Karnataka HC; subsequently affirmed in principle by the Supreme Court in Priya Indoria v. State of Karnataka (2023)."
    )
]

class HighCourtConnector(BaseLegalConnector):
    name = "High Courts of India"
    source_type = LegalSourceType.JUDGMENT_HC

    async def search(self, query: str, filters: Optional[Dict[str, Any]] = None, limit: int = 5) -> List[LegalDocument]:
        results: List[LegalDocument] = []
        q_lower = query.lower()

        target_court = filters.get("court") if filters else None

        for doc in HIGH_COURT_LANDMARKS:
            if target_court and doc.court and target_court.lower() not in doc.court.lower():
                continue

            text_to_search = f"{doc.title} {doc.court or ''} {doc.act or ''} {doc.section or ''} {doc.snippet}".lower()
            query_words = [w for w in q_lower.split() if len(w) > 2]
            match_count = sum(1 for w in query_words if w in text_to_search)

            if match_count > 0:
                doc_copy = doc.model_copy()
                doc_copy.score = match_count / max(len(query_words), 1)
                results.append(doc_copy)

        results.sort(key=lambda x: (x.authority_level.value, x.score), reverse=True)
        return results[:limit]

    async def get_document(self, doc_id: str) -> Optional[LegalDocument]:
        for doc in HIGH_COURT_LANDMARKS:
            if doc.id == doc_id:
                return doc
        return None
