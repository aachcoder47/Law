import re
from typing import Dict, Any, List
from pydantic import BaseModel

class LegalResearchPlan(BaseModel):
    original_query: str
    legal_domain: str
    target_statutes: List[Dict[str, str]]
    core_legal_issues: List[str]
    search_queries: List[str]
    planned_steps: List[str]

class LegalQueryPlanner:
    """
    Understands the user's natural language legal question, decomposes it into
    sub-issues, identifies relevant Acts/Sections, and formulates search vectors.
    """
    async def create_plan(self, query: str) -> LegalResearchPlan:
        q_lower = query.lower()

        domain = "General Indian Law"
        target_statutes = []
        core_issues = []
        search_queries = [query]

        # Domain & statutory detection
        if any(w in q_lower for w in ["bail", "anticipatory", "arrest", "custody", "fir", "police", "non-bailable", "crpc", "bnss"]):
            domain = "Criminal Procedure & Constitutional Liberty"
            target_statutes.append({"act": "Code of Criminal Procedure, 1973", "section": "Section 438"})
            target_statutes.append({"act": "Bharatiya Nagarik Suraksha Sanhita, 2023", "section": "Section 482"})
            core_issues.append("Whether High Court or Sessions Court possesses discretionary jurisdiction to grant pre-arrest protection.")
            core_issues.append("Whether anticipatory bail should be restricted in duration or enure till conclusion of trial.")
            core_issues.append("Impact of the 2024 Criminal Law reforms (transition from Section 438 CrPC to Section 482 BNSS).")
            search_queries.extend([
                "anticipatory bail High Court Section 438 CrPC Section 482 BNSS",
                "Sushila Aggarwal v. State NCT Delhi Constitution bench life of anticipatory bail",
                "Gurbaksh Singh Sibbia Section 438 CrPC discretion personal liberty"
            ])
        elif any(w in q_lower for w in ["privacy", "fundamental right", "article 21", "surveillance", "biometric", "aadhaar"]):
            domain = "Constitutional Law & Fundamental Rights"
            target_statutes.append({"act": "Constitution of India", "section": "Article 21 read with Articles 14 and 19"})
            core_issues.append("Scope and contours of the Fundamental Right to Privacy under Part III.")
            core_issues.append("Constitutional proportionality standard for state actions infringing privacy.")
            search_queries.extend([
                "Puttaswamy v Union of India right to privacy Article 21",
                "proportionality test privacy fundamental right Supreme Court"
            ])
        elif any(w in q_lower for w in ["cheque", "dishonour", "138", "139", "negotiable", "debt"]):
            domain = "Commercial & Negotiable Instruments Law"
            target_statutes.append({"act": "Negotiable Instruments Act, 1881", "section": "Section 138 & Section 139"})
            core_issues.append("Statutory presumption of legally enforceable debt under Section 139.")
            core_issues.append("Standard of proof required by accused to rebut statutory presumption.")
            search_queries.extend([
                "Section 138 139 Negotiable Instruments Act statutory presumption debt",
                "Rangappa v Sri Mohan presumption rebuttal standard"
            ])
        elif any(w in q_lower for w in ["arbitration", "award", "non-signatory", "group of companies", "section 34", "section 11"]):
            domain = "Arbitration and Commercial Dispute Resolution"
            target_statutes.append({"act": "Arbitration and Conciliation Act, 1996", "section": "Section 7, 8, 11, 34"})
            core_issues.append("Application and validity of the Group of Companies doctrine under Indian law.")
            core_issues.append("Grounds for setting aside arbitral awards under Section 34.")
            search_queries.extend([
                "Cox and Kings v SAP India Group of Companies doctrine arbitration",
                "Section 34 Arbitration Conciliation Act patent illegality public policy"
            ])
        else:
            domain = "Indian Substantive / Procedural Law"
            core_issues.append("Ascertain governing statutory framework and applicable judicial precedents.")
            search_queries.append(f"{query} Supreme Court of India ratio decidendi")

        planned_steps = [
            f"1. Deconstruct legal proposition: Analyze '{query}' in {domain}.",
            "2. Retrieve statutory provisions from India Code and verify current-law status (including 2024 Sanhita transitions).",
            "3. Search judicial precedents on Indian Kanoon, Supreme Court e-SCR, and High Court portals.",
            "4. Cross-verify judicial hierarchy (Constitution Benches vs Division Benches vs Overruled authorities).",
            "5. Synthesize grounded legal research memorandum with traceable citations."
        ]

        return LegalResearchPlan(
            original_query=query,
            legal_domain=domain,
            target_statutes=target_statutes,
            core_legal_issues=core_issues,
            search_queries=search_queries,
            planned_steps=planned_steps
        )

legal_planner = LegalQueryPlanner()
