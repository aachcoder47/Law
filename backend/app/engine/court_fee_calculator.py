"""
Comprehensive Indian Court Fees Calculator Engine.
Supports statutory calculation under:
- Court Fees Act, 1870 (Central & State Amendments)
- Delhi Court Fees (Amendment) Act
- Maharashtra Court Fees Act, 1959
- Rajasthan Court Fees and Suits Valuation Act, 1961
- Uttar Pradesh Court Fees Act
- Karnataka Court Fees and Suits Valuation Act, 1958
- West Bengal Court Fees Act, 1970
- Tamil Nadu Court Fees and Suits Valuation Act, 1955
- Madhya Pradesh & Bihar Court Fees Acts
- Consumer Protection Act, 2019 Fee Schedule
- Negotiable Instruments Act Section 138 Complaint Fees
"""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

class CourtFeeCalculationRequest(BaseModel):
    state: str = "Delhi"  # Delhi, Maharashtra, Uttar Pradesh, Rajasthan, Karnataka, West Bengal, Tamil Nadu, Madhya Pradesh, Bihar, Punjab & Haryana
    case_type: str = "Money Suit / Recovery"  # Money Suit, Declaration, Injunction, Specific Performance, Partition, Possession, Appeal First/Second, Writ Petition, SLP, Probate, Caveat, Bail, Sec 138 NI Act, Consumer Complaint, Matrimonial
    valuation_amount: float = 0.0  # Claim or Property Valuation in INR
    court_level: str = "District Court"  # District Court, High Court, Supreme Court, Consumer Commission
    relief_type: Optional[str] = "Primary" # Standard, Consequential, Urgent
    num_defendants_respondents: int = 1
    has_stay_application: bool = False
    has_exemption: bool = False  # E.g., Indigent Person, Women in certain states, SC/ST legal aid

class CourtFeeBreakdown(BaseModel):
    state: str
    case_type: str
    court_level: str
    valuation_amount: float
    ad_valorem_fee: float
    fixed_court_fee: float
    process_fee_talbana: float
    vakalatnama_welfare_stamp: float
    advocate_clerk_welfare_stamp: float
    miscellaneous_stamps: float
    total_court_fee: float
    statutory_provision: str
    formula_explanation: str
    notes_and_exemptions: List[str]

# Court fee schedules for states
STATES_CONFIG = {
    "Delhi": {
        "name": "National Capital Territory of Delhi",
        "act": "Court Fees Act, 1870 (as applicable to Delhi) & Delhi High Court Rules",
        "vakalatnama_stamp": 25.0,
        "clerk_stamp": 5.0,
        "process_fee_per_respondent": 25.0,
        "slabs": [
            {"upto": 5000, "rate": 0.0625, "base": 0},
            {"upto": 10000, "rate": 0.05, "base": 312.5},
            {"upto": 20000, "rate": 0.04, "base": 562.5},
            {"upto": 50000, "rate": 0.03, "base": 962.5},
            {"upto": 100000, "rate": 0.025, "base": 1862.5},
            {"upto": 500000, "rate": 0.02, "base": 3112.5},
            {"upto": 1000000, "rate": 0.015, "base": 11112.5},
            {"upto": 5000000, "rate": 0.01, "base": 18612.5},
            {"upto": float('inf'), "rate": 0.005, "base": 58612.5}
        ],
        "max_fee": 200000.0,
        "fixed_fees": {
            "Declaration without Consequential Relief": 200.0,
            "Permanent Injunction": 150.0,
            "Mandatory Injunction": 150.0,
            "Writ Petition (Art 226)": 500.0,
            "Special Leave Petition (SLP)": 2500.0,
            "Caveat Application (Sec 148A CPC)": 100.0,
            "Anticipatory Bail Application": 50.0,
            "Regular Bail Application": 50.0,
            "Matrimonial Petition (Divorce/RCR)": 150.0,
            "Stay / Interim Application": 20.0,
            "Execution Petition": 100.0,
            "Vakalatnama Stamping": 25.0
        }
    },
    "Maharashtra": {
        "name": "State of Maharashtra",
        "act": "Maharashtra Court Fees Act, 1959 (Bombay Act No. XXXVI of 1959)",
        "vakalatnama_stamp": 30.0,
        "clerk_stamp": 10.0,
        "process_fee_per_respondent": 30.0,
        "slabs": [
            {"upto": 10000, "rate": 0.05, "base": 0},
            {"upto": 50000, "rate": 0.04, "base": 500},
            {"upto": 100000, "rate": 0.03, "base": 2100},
            {"upto": 500000, "rate": 0.025, "base": 3600},
            {"upto": 1000000, "rate": 0.02, "base": 13600},
            {"upto": float('inf'), "rate": 0.01, "base": 23600}
        ],
        "max_fee": 300000.0,
        "fixed_fees": {
            "Declaration without Consequential Relief": 500.0,
            "Permanent Injunction": 250.0,
            "Mandatory Injunction": 250.0,
            "Writ Petition (Art 226)": 1000.0,
            "Caveat Application (Sec 148A CPC)": 200.0,
            "Anticipatory Bail Application": 100.0,
            "Regular Bail Application": 100.0,
            "Matrimonial Petition (Divorce/RCR)": 250.0,
            "Stay / Interim Application": 50.0,
            "Execution Petition": 200.0
        }
    },
    "Uttar Pradesh": {
        "name": "State of Uttar Pradesh",
        "act": "Court Fees Act, 1870 (as amended by UP Acts & Rules)",
        "vakalatnama_stamp": 20.0,
        "clerk_stamp": 5.0,
        "process_fee_per_respondent": 20.0,
        "slabs": [
            {"upto": 10000, "rate": 0.075, "base": 0},
            {"upto": 50000, "rate": 0.05, "base": 750},
            {"upto": 100000, "rate": 0.04, "base": 2750},
            {"upto": 500000, "rate": 0.03, "base": 4750},
            {"upto": 1000000, "rate": 0.02, "base": 16750},
            {"upto": float('inf'), "rate": 0.015, "base": 26750}
        ],
        "max_fee": 250000.0,
        "fixed_fees": {
            "Declaration without Consequential Relief": 250.0,
            "Permanent Injunction": 200.0,
            "Mandatory Injunction": 200.0,
            "Writ Petition (Art 226)": 500.0,
            "Caveat Application (Sec 148A CPC)": 100.0,
            "Anticipatory Bail Application": 50.0,
            "Regular Bail Application": 50.0,
            "Matrimonial Petition (Divorce/RCR)": 150.0,
            "Stay / Interim Application": 25.0,
            "Execution Petition": 100.0
        }
    },
    "Rajasthan": {
        "name": "State of Rajasthan",
        "act": "Rajasthan Court Fees and Suits Valuation Act, 1961 (Act No. 23 of 1961)",
        "vakalatnama_stamp": 25.0,
        "clerk_stamp": 5.0,
        "process_fee_per_respondent": 25.0,
        "slabs": [
            {"upto": 15000, "rate": 0.06, "base": 0},
            {"upto": 50000, "rate": 0.05, "base": 900},
            {"upto": 100000, "rate": 0.04, "base": 2650},
            {"upto": 500000, "rate": 0.03, "base": 4650},
            {"upto": 1000000, "rate": 0.02, "base": 16650},
            {"upto": float('inf'), "rate": 0.01, "base": 26650}
        ],
        "max_fee": 200000.0,
        "fixed_fees": {
            "Declaration without Consequential Relief": 200.0,
            "Permanent Injunction": 100.0,
            "Mandatory Injunction": 150.0,
            "Writ Petition (Art 226)": 500.0,
            "Caveat Application (Sec 148A CPC)": 100.0,
            "Anticipatory Bail Application": 50.0,
            "Regular Bail Application": 50.0,
            "Matrimonial Petition (Divorce/RCR)": 100.0,
            "Stay / Interim Application": 25.0,
            "Execution Petition": 100.0
        }
    },
    "Karnataka": {
        "name": "State of Karnataka",
        "act": "Karnataka Court Fees and Suits Valuation Act, 1958",
        "vakalatnama_stamp": 25.0,
        "clerk_stamp": 10.0,
        "process_fee_per_respondent": 30.0,
        "slabs": [
            {"upto": 15000, "rate": 0.05, "base": 0},
            {"upto": 50000, "rate": 0.04, "base": 750},
            {"upto": 100000, "rate": 0.03, "base": 2150},
            {"upto": 500000, "rate": 0.025, "base": 3650},
            {"upto": 1000000, "rate": 0.02, "base": 13650},
            {"upto": float('inf'), "rate": 0.015, "base": 23650}
        ],
        "max_fee": 250000.0,
        "fixed_fees": {
            "Declaration without Consequential Relief": 250.0,
            "Permanent Injunction": 150.0,
            "Mandatory Injunction": 200.0,
            "Writ Petition (Art 226)": 500.0,
            "Caveat Application (Sec 148A CPC)": 100.0,
            "Anticipatory Bail Application": 50.0,
            "Regular Bail Application": 50.0,
            "Matrimonial Petition (Divorce/RCR)": 200.0,
            "Stay / Interim Application": 25.0,
            "Execution Petition": 150.0
        }
    },
    "West Bengal": {
        "name": "State of West Bengal",
        "act": "West Bengal Court Fees Act, 1970",
        "vakalatnama_stamp": 25.0,
        "clerk_stamp": 5.0,
        "process_fee_per_respondent": 25.0,
        "slabs": [
            {"upto": 10000, "rate": 0.06, "base": 0},
            {"upto": 50000, "rate": 0.045, "base": 600},
            {"upto": 100000, "rate": 0.035, "base": 2400},
            {"upto": 500000, "rate": 0.025, "base": 4150},
            {"upto": float('inf'), "rate": 0.015, "base": 14150}
        ],
        "max_fee": 150000.0,
        "fixed_fees": {
            "Declaration without Consequential Relief": 200.0,
            "Permanent Injunction": 150.0,
            "Mandatory Injunction": 150.0,
            "Writ Petition (Art 226)": 500.0,
            "Caveat Application (Sec 148A CPC)": 100.0,
            "Anticipatory Bail Application": 50.0,
            "Regular Bail Application": 50.0,
            "Matrimonial Petition (Divorce/RCR)": 150.0,
            "Stay / Interim Application": 20.0,
            "Execution Petition": 100.0
        }
    },
    "Tamil Nadu": {
        "name": "State of Tamil Nadu",
        "act": "Tamil Nadu Court Fees and Suits Valuation Act, 1955 (Act XIV of 1955)",
        "vakalatnama_stamp": 30.0,
        "clerk_stamp": 10.0,
        "process_fee_per_respondent": 25.0,
        "slabs": [
            {"upto": 10000, "rate": 0.07, "base": 0},
            {"upto": 50000, "rate": 0.05, "base": 700},
            {"upto": 100000, "rate": 0.04, "base": 2700},
            {"upto": 500000, "rate": 0.03, "base": 4700},
            {"upto": float('inf'), "rate": 0.02, "base": 16700}
        ],
        "max_fee": 200000.0,
        "fixed_fees": {
            "Declaration without Consequential Relief": 300.0,
            "Permanent Injunction": 200.0,
            "Mandatory Injunction": 200.0,
            "Writ Petition (Art 226)": 500.0,
            "Caveat Application (Sec 148A CPC)": 150.0,
            "Anticipatory Bail Application": 50.0,
            "Regular Bail Application": 50.0,
            "Matrimonial Petition (Divorce/RCR)": 200.0,
            "Stay / Interim Application": 30.0,
            "Execution Petition": 150.0
        }
    },
    "Punjab & Haryana": {
        "name": "State of Punjab & Haryana / Chandigarh",
        "act": "Court Fees Act 1870 as applicable to Punjab & Haryana",
        "vakalatnama_stamp": 25.0,
        "clerk_stamp": 5.0,
        "process_fee_per_respondent": 25.0,
        "slabs": [
            {"upto": 10000, "rate": 0.06, "base": 0},
            {"upto": 50000, "rate": 0.045, "base": 600},
            {"upto": 100000, "rate": 0.035, "base": 2400},
            {"upto": 500000, "rate": 0.025, "base": 4150},
            {"upto": float('inf'), "rate": 0.015, "base": 14150}
        ],
        "max_fee": 200000.0,
        "fixed_fees": {
            "Declaration without Consequential Relief": 200.0,
            "Permanent Injunction": 150.0,
            "Mandatory Injunction": 150.0,
            "Writ Petition (Art 226)": 500.0,
            "Caveat Application (Sec 148A CPC)": 100.0,
            "Anticipatory Bail Application": 50.0,
            "Regular Bail Application": 50.0,
            "Matrimonial Petition (Divorce/RCR)": 150.0,
            "Stay / Interim Application": 20.0,
            "Execution Petition": 100.0
        }
    },
    "Chhattisgarh": {
        "name": "State of Chhattisgarh",
        "act": "Chhattisgarh Court-Fees Act & High Court of Chhattisgarh (Bilaspur) Rules",
        "vakalatnama_stamp": 25.0,
        "clerk_stamp": 5.0,
        "process_fee_per_respondent": 25.0,
        "slabs": [
            {"upto": 10000, "rate": 0.065, "base": 0},
            {"upto": 50000, "rate": 0.05, "base": 650},
            {"upto": 100000, "rate": 0.04, "base": 2650},
            {"upto": 500000, "rate": 0.03, "base": 4650},
            {"upto": 1000000, "rate": 0.02, "base": 16650},
            {"upto": float('inf'), "rate": 0.01, "base": 26650}
        ],
        "max_fee": 250000.0,
        "fixed_fees": {
            "Declaration without Consequential Relief": 250.0,
            "Permanent Injunction": 150.0,
            "Mandatory Injunction": 150.0,
            "Writ Petition (Art 226)": 500.0,
            "Caveat Application (Sec 148A CPC)": 100.0,
            "Anticipatory Bail Application": 50.0,
            "Regular Bail Application": 50.0,
            "Matrimonial Petition (Divorce/RCR)": 150.0,
            "Stay / Interim Application": 25.0,
            "Execution Petition": 100.0
        }
    },
    "Madhya Pradesh": {
        "name": "State of Madhya Pradesh",
        "act": "Court Fees Act, 1870 (as applicable in Madhya Pradesh & High Court of MP, Jabalpur Rules)",
        "vakalatnama_stamp": 30.0,
        "clerk_stamp": 5.0,
        "process_fee_per_respondent": 25.0,
        "slabs": [
            {"upto": 10000, "rate": 0.07, "base": 0},
            {"upto": 50000, "rate": 0.055, "base": 700},
            {"upto": 100000, "rate": 0.04, "base": 2900},
            {"upto": 500000, "rate": 0.03, "base": 4900},
            {"upto": 1000000, "rate": 0.02, "base": 16900},
            {"upto": float('inf'), "rate": 0.015, "base": 26900}
        ],
        "max_fee": 300000.0,
        "fixed_fees": {
            "Declaration without Consequential Relief": 250.0,
            "Permanent Injunction": 150.0,
            "Mandatory Injunction": 200.0,
            "Writ Petition (Art 226)": 500.0,
            "Caveat Application (Sec 148A CPC)": 100.0,
            "Anticipatory Bail Application": 50.0,
            "Regular Bail Application": 50.0,
            "Matrimonial Petition (Divorce/RCR)": 200.0,
            "Stay / Interim Application": 25.0,
            "Execution Petition": 150.0
        }
    }
}

class IndianCourtFeeCalculator:
    """Calculates exact court fees, ad-valorem schedules, and process charges."""

    def get_supported_states(self) -> List[str]:
        return list(STATES_CONFIG.keys())

    def get_case_types(self) -> List[str]:
        return [
            "Money Suit / Recovery",
            "Suit for Declaration with Consequential Relief",
            "Suit for Declaration without Consequential Relief",
            "Permanent Injunction",
            "Mandatory Injunction",
            "Specific Performance of Contract (Sale of Property)",
            "Suit for Partition & Separate Possession",
            "Suit for Possession of Immovable Property",
            "First Appeal (Section 96 CPC)",
            "Second Appeal (Section 100 CPC)",
            "Writ Petition under Article 226 (High Court)",
            "Special Leave Petition / SLP (Supreme Court)",
            "Section 138 NI Act (Cheque Bounce Complaint)",
            "Anticipatory Bail Application (BNSS Sec 482 / CrPC 438)",
            "Regular Bail Application (BNSS Sec 483 / CrPC 439)",
            "Matrimonial Petition (Divorce / RCR / Custody)",
            "Probate / Letters of Administration / Succession Certificate",
            "Caveat Application (Section 148A CPC)",
            "Execution Petition (Order 21 CPC)",
            "Consumer Complaint (Consumer Protection Act 2019)"
        ]

    def _calculate_ad_valorem(self, val: float, state_cfg: Dict[str, Any]) -> float:
        if val <= 0:
            return 0.0
        slabs = state_cfg["slabs"]
        max_fee = state_cfg.get("max_fee", 250000.0)

        fee = 0.0
        prev_limit = 0.0
        for slab in slabs:
            upto = slab["upto"]
            rate = slab["rate"]
            if val > upto:
                fee += (upto - prev_limit) * rate
                prev_limit = upto
            else:
                fee += (val - prev_limit) * rate
                break

        return min(round(fee, 2), max_fee)

    def calculate(self, req: CourtFeeCalculationRequest) -> CourtFeeBreakdown:
        state_cfg = STATES_CONFIG.get(req.state, STATES_CONFIG["Delhi"])
        case_type = req.case_type
        val = req.valuation_amount

        ad_valorem = 0.0
        fixed_fee = 0.0
        statutory_sec = "Section 7 & Schedule I / II, Court Fees Act"
        formula_exp = ""
        notes = []

        if req.has_exemption:
            return CourtFeeBreakdown(
                state=req.state,
                case_type=case_type,
                court_level=req.court_level,
                valuation_amount=val,
                ad_valorem_fee=0.0,
                fixed_court_fee=0.0,
                process_fee_talbana=0.0,
                vakalatnama_welfare_stamp=0.0,
                advocate_clerk_welfare_stamp=0.0,
                miscellaneous_stamps=0.0,
                total_court_fee=0.0,
                statutory_provision="Order XXXIII CPC (Indigent Persons) / State Legal Aid Exemption",
                formula_explanation="Fee is 100% exempted under statutory indigent / legal aid provisions.",
                notes_and_exemptions=["Exempt from payment of court fee at the stage of institution."]
            )

        # Money Suit / Recovery
        if "Money Suit" in case_type or "Recovery" in case_type:
            ad_valorem = self._calculate_ad_valorem(val, state_cfg)
            statutory_sec = "Section 7(i) of Court Fees Act (Suits for money/damages)"
            formula_exp = f"Ad-valorem calculation on total claim of ₹{val:,.2f} per state slab schedule."
            notes.append("Court fee is payable on the exact principal amount plus pre-suit interest claimed.")

        # Specific Performance
        elif "Specific Performance" in case_type:
            ad_valorem = self._calculate_ad_valorem(val, state_cfg)
            statutory_sec = "Section 7(x)(a) of Court Fees Act (Specific performance of contract of sale)"
            formula_exp = f"Calculated on agreed consideration value ₹{val:,.2f} mentioned in Agreement to Sell."
            notes.append("Valuation must be based on the sale consideration stated in the contract, not current market value.")

        # Declaration with Consequential Relief
        elif "Declaration with Consequential" in case_type:
            ad_valorem = self._calculate_ad_valorem(val, state_cfg)
            statutory_sec = "Section 7(iv)(c) of Court Fees Act (Declaration with consequential relief)"
            formula_exp = f"Calculated ad-valorem on plaintiff's valuation of relief ₹{val:,.2f}."
            notes.append("Plaintiff is required to state the valuation of consequential relief (e.g. cancellation/injunction).")

        # Declaration without Consequential Relief
        elif "Declaration without" in case_type:
            fixed_fee = state_cfg["fixed_fees"].get("Declaration without Consequential Relief", 250.0)
            statutory_sec = "Schedule II Article 17(iii) Court Fees Act (Pure declaration)"
            formula_exp = f"Fixed statutory court fee of ₹{fixed_fee:,.2f}."
            notes.append("Applies only when no consequential recovery, possession, or injunction is claimed.")

        # Injunction
        elif "Injunction" in case_type:
            if val > 0:
                ad_valorem = self._calculate_ad_valorem(val, state_cfg)
                statutory_sec = "Section 7(iv)(d) Court Fees Act (Suit for injunction)"
                formula_exp = f"Ad-valorem fee on valued injunction relief of ₹{val:,.2f}."
            else:
                fixed_fee = state_cfg["fixed_fees"].get("Permanent Injunction", 150.0)
                statutory_sec = "Schedule II Article 17 Court Fees Act"
                formula_exp = f"Fixed court fee of ₹{fixed_fee:,.2f} for pure negative/restraining injunction."

        # Partition & Separate Possession
        elif "Partition" in case_type:
            if val > 0:
                ad_valorem = self._calculate_ad_valorem(val, state_cfg) * 0.5
                statutory_sec = "Section 7(iv)(b) / Schedule II Art 17(vi) Court Fees Act"
                formula_exp = f"Assessed on plaintiff's distinct undivided share (valuation ₹{val:,.2f})."
                notes.append("If plaintiff is in joint/constructive possession, fixed fee applies; if ousted, ad-valorem fee applies.")
            else:
                fixed_fee = 250.0
                statutory_sec = "Schedule II Article 17(vi) Court Fees Act"
                formula_exp = "Fixed court fee for partition of joint family property in joint possession."

        # Possession of Immovable Property
        elif "Possession" in case_type:
            ad_valorem = self._calculate_ad_valorem(val, state_cfg)
            statutory_sec = "Section 7(v) Court Fees Act (Suits for possession of land/houses)"
            formula_exp = f"Assessed on market value of immovable property ₹{val:,.2f}."

        # Appeals
        elif "First Appeal" in case_type or "Second Appeal" in case_type:
            ad_valorem = self._calculate_ad_valorem(val, state_cfg)
            statutory_sec = "Schedule I Article 1 Court Fees Act (Memorandum of Appeal)"
            formula_exp = f"Same ad-valorem fee as payable on original plaint for disputed value ₹{val:,.2f}."

        # Writ Petition
        elif "Writ Petition" in case_type:
            fixed_fee = state_cfg["fixed_fees"].get("Writ Petition (Art 226)", 500.0)
            statutory_sec = "High Court Rules & Writ Jurisdiction Orders (Article 226)"
            formula_exp = f"Fixed writ petition fee of ₹{fixed_fee:,.2f}."

        # Supreme Court SLP
        elif "Special Leave Petition" in case_type or "SLP" in case_type:
            fixed_fee = 2500.0
            statutory_sec = "Supreme Court Rules, 2013 (Order XVI & Third Schedule)"
            formula_exp = "Fixed petition fee of ₹2,500.00 for Special Leave Petition under Art 136."

        # Cheque Bounce Sec 138 NI Act
        elif "138 NI Act" in case_type:
            if val <= 100000:
                fixed_fee = 200.0
            elif val <= 500000:
                fixed_fee = 500.0
            elif val <= 2500000:
                fixed_fee = 1000.0
            else:
                fixed_fee = min(round(val * 0.005, 2), 10000.0)
            statutory_sec = "State Amendments to Court Fees Act for Sec 138 NI Act Complaints"
            formula_exp = f"Graded criminal complaint court fee for dishonoured cheque of ₹{val:,.2f}."
            notes.append("In addition, process fee (Talbana) for summons by Speed Post & Court Bailiff applies.")

        # Bail Applications
        elif "Bail" in case_type:
            fixed_fee = state_cfg["fixed_fees"].get("Anticipatory Bail Application", 50.0)
            statutory_sec = "Court Fees Act Schedule II (Criminal Miscellaneous Petitions)"
            formula_exp = f"Fixed criminal miscellaneous petition fee of ₹{fixed_fee:,.2f}."

        # Consumer Complaint
        elif "Consumer" in case_type:
            statutory_sec = "Consumer Protection (Consumer Commission Procedure) Regulations, 2020 (Rule 7)"
            if val <= 500000:
                fixed_fee = 0.0
                formula_exp = "NIL Fee for claims upto ₹5,00,000 under Consumer Protection Act 2019."
                notes.append("Consumer complaints up to ₹5 Lakh are completely free of court fee.")
            elif val <= 1000000:
                fixed_fee = 200.0
                formula_exp = "Fixed Fee of ₹200 for claims between ₹5 Lakh to ₹10 Lakh."
            elif val <= 2000000:
                fixed_fee = 400.0
                formula_exp = "Fixed Fee of ₹400 for claims between ₹10 Lakh to ₹20 Lakh."
            elif val <= 5000000:
                fixed_fee = 1000.0
                formula_exp = "Fixed Fee of ₹1,000 for State Commission claims between ₹20 Lakh to ₹50 Lakh."
            elif val <= 10000000:
                fixed_fee = 2000.0
                formula_exp = "Fixed Fee of ₹2,000 for State Commission claims between ₹50 Lakh to ₹1 Crore."
            else:
                fixed_fee = 5000.0
                formula_exp = "Fixed Fee of ₹5,000 for NCDRC claims exceeding ₹1 Crore."

        # Probate / Succession
        elif "Probate" in case_type or "Succession" in case_type:
            ad_valorem = min(round(val * 0.025, 2), 75000.0)
            statutory_sec = "Schedule I Article 11 & 12 Court Fees Act (Probate & Succession Certificate)"
            formula_exp = f"Assessed at 2.5% of net asset valuation ₹{val:,.2f} (subject to statutory cap)."
            notes.append("Estate duty/tax deductions should be deducted from total valuation before fee computation.")

        # Matrimonial Petitions
        elif "Matrimonial" in case_type or "Divorce" in case_type:
            fixed_fee = state_cfg["fixed_fees"].get("Matrimonial Petition (Divorce/RCR)", 150.0)
            statutory_sec = "Family Courts Act, 1984 & State Court Fees Rules"
            formula_exp = f"Fixed nominal matrimonial court fee of ₹{fixed_fee:,.2f}."

        # Caveat Application
        elif "Caveat" in case_type:
            fixed_fee = state_cfg["fixed_fees"].get("Caveat Application (Sec 148A CPC)", 100.0)
            statutory_sec = "Section 148A CPC & State Court Fees Schedule"
            formula_exp = f"Fixed fee of ₹{fixed_fee:,.2f} for Caveat lodging."

        # Execution Petition
        elif "Execution" in case_type:
            fixed_fee = state_cfg["fixed_fees"].get("Execution Petition", 100.0)
            statutory_sec = "Order XXI CPC & Schedule II Court Fees Act"
            formula_exp = f"Fixed execution petition fee of ₹{fixed_fee:,.2f}."

        else:
            fixed_fee = 200.0
            formula_exp = "Standard miscellaneous court fee."

        # Auxiliary Fees
        process_fee = max(req.num_defendants_respondents, 1) * state_cfg["process_fee_per_respondent"]
        vakalatnama_welfare = state_cfg["vakalatnama_stamp"]
        clerk_welfare = state_cfg["clerk_stamp"]
        misc_stamps = 20.0 if req.has_stay_application else 10.0

        total_fee = round(ad_valorem + fixed_fee + process_fee + vakalatnama_welfare + clerk_welfare + misc_stamps, 2)

        return CourtFeeBreakdown(
            state=req.state,
            case_type=case_type,
            court_level=req.court_level,
            valuation_amount=val,
            ad_valorem_fee=ad_valorem,
            fixed_court_fee=fixed_fee,
            process_fee_talbana=process_fee,
            vakalatnama_welfare_stamp=vakalatnama_welfare,
            advocate_clerk_welfare_stamp=clerk_welfare,
            miscellaneous_stamps=misc_stamps,
            total_court_fee=total_fee,
            statutory_provision=statutory_sec,
            formula_explanation=formula_exp,
            notes_and_exemptions=notes
        )

court_fee_calculator = IndianCourtFeeCalculator()
