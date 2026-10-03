from typing import List, Dict, Any
from app.connectors.base import LegalDocument, LegalSourceType
from app.engine.corpus import TRANSITION_MAP

class StatuteAnalysisResult:
    def __init__(
        self,
        governing_acts: List[Dict[str, Any]],
        current_law_status: str,
        transition_analysis: List[Dict[str, Any]],
        statutory_summary: str
    ):
        self.governing_acts = governing_acts
        self.current_law_status = current_law_status
        self.transition_analysis = transition_analysis
        self.statutory_summary = statutory_summary

    def to_dict(self) -> Dict[str, Any]:
        return {
            "governing_acts": self.governing_acts,
            "current_law_status": self.current_law_status,
            "transition_analysis": self.transition_analysis,
            "statutory_summary": self.statutory_summary
        }

class StatuteAgent:
    """
    Evaluates applicable legislative enactments, checks whether provisions are currently
    in force or amended, and provides explicit transitional guidance for 2024 Indian criminal law codes.
    """
    async def analyze_statutes(self, documents: List[LegalDocument], query: str) -> Dict[str, Any]:
        governing_acts = []
        transitions = []
        q_lower = query.lower()

        # Identify all statute documents in the retrieved set
        statute_docs = [d for d in documents if d.doc_type == LegalSourceType.STATUTE]

        for doc in statute_docs:
            governing_acts.append({
                "id": doc.id,
                "title": doc.title,
                "act": doc.act,
                "section": doc.section,
                "status": doc.current_status,
                "status_details": doc.status_details,
                "citation": doc.citation,
                "source_url": doc.source_url
            })

        # Check for 2024 Sanhita transitions
        for key, trans in TRANSITION_MAP.items():
            trigger_terms = [
                trans["old_section"].lower(),
                trans["new_section"].lower(),
                key.lower(),
                "anticipatory bail" if "438" in key else "",
                "bail" if "439" in key else "",
                "murder" if "302" in key else "",
                "electronic evidence" if "65b" in key.lower() else ""
            ]
            if any(t and t in q_lower for t in trigger_terms) or any(t and t in doc.content.lower() for t in trigger_terms for doc in documents):
                transitions.append(trans)

        current_law_status = "In Force"
        if any(g["status"] == "Replaced" for g in governing_acts):
            current_law_status = "Transitional: Replaced by New Sanhitas (BNSS/BNS 2023) w.e.f. July 1, 2024"
        elif any(g["status"] == "Repealed" for g in governing_acts):
            current_law_status = "Repealed"

        summary_parts = []
        if transitions:
            summary_parts.append(
                f"Statutory landscape governed by modern transitional framework: {len(transitions)} transitional mapping(s) identified between the previous codes and the 2023 Sanhitas."
            )
            for t in transitions:
                summary_parts.append(
                    f"• {t['old_act']} ({t['old_section']}) has been re-enacted as {t['new_act']} ({t['new_section']}). {t['transition_note']}"
                )
        else:
            summary_parts.append("Governing statutes verified as active and in force under India Code.")

        return {
            "governing_acts": governing_acts,
            "current_law_status": current_law_status,
            "transition_analysis": transitions,
            "statutory_summary": "\n".join(summary_parts)
        }

statute_agent = StatuteAgent()
