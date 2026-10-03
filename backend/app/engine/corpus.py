"""
Authoritative Seed Corpus for Indian Legal Research.
Contains statutory provisions, central acts, landmark judgments, bench strengths,
transitional Sanhita mappings, and Law Commission reports.
"""

from typing import List, Dict, Any
from app.connectors.base import LegalDocument, LegalSourceType, AuthorityLevel

# 2024 Criminal Law Transition Mapping
TRANSITION_MAP: Dict[str, Dict[str, Any]] = {
    "CrPC 438": {
        "old_act": "Code of Criminal Procedure, 1973",
        "old_section": "Section 438",
        "new_act": "Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)",
        "new_section": "Section 482",
        "subject": "Direction for grant of bail to person apprehending arrest (Anticipatory Bail)",
        "effective_date": "01-07-2024",
        "transition_note": "Applications for offenses committed prior to 01-07-2024 continue under CrPC s.438 read with s.531 BNSS savings clause. Fresh FIRs registered on or after 01-07-2024 invoke s.482 BNSS."
    },
    "CrPC 439": {
        "old_act": "Code of Criminal Procedure, 1973",
        "old_section": "Section 439",
        "new_act": "Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)",
        "new_section": "Section 483",
        "subject": "Special powers of High Court or Court of Session regarding bail (Regular Bail)",
        "effective_date": "01-07-2024",
        "transition_note": "Corresponds to Section 483 of BNSS."
    },
    "CrPC 167": {
        "old_act": "Code of Criminal Procedure, 1973",
        "old_section": "Section 167",
        "new_act": "Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)",
        "new_section": "Section 187",
        "subject": "Procedure when investigation cannot be completed in 24 hours (Police Custody & Default Bail)",
        "effective_date": "01-07-2024",
        "transition_note": "BNSS s.187(3) allows police custody in whole or in parts during initial 40 or 60 days of detention period."
    },
    "CrPC 41A": {
        "old_act": "Code of Criminal Procedure, 1973",
        "old_section": "Section 41A",
        "new_act": "Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)",
        "new_section": "Section 35(3)",
        "subject": "Notice of appearance before police officer for offenses punishable with up to 7 years",
        "effective_date": "01-07-2024",
        "transition_note": "Maintains principles laid down in Arnesh Kumar v. State of Bihar."
    },
    "CrPC 482": {
        "old_act": "Code of Criminal Procedure, 1973",
        "old_section": "Section 482",
        "new_act": "Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)",
        "new_section": "Section 528",
        "subject": "Inherent powers of High Court to prevent abuse of process of any Court or secure ends of justice",
        "effective_date": "01-07-2024",
        "transition_note": "Inherent jurisdiction preserved verbatim under Section 528 BNSS."
    },
    "IPC 302": {
        "old_act": "Indian Penal Code, 1860",
        "old_section": "Section 302",
        "new_act": "Bharatiya Nyaya Sanhita, 2023 (BNS)",
        "new_section": "Section 103(1)",
        "subject": "Punishment for Murder",
        "effective_date": "01-07-2024",
        "transition_note": "Section 103(2) BNS introduces specific capital offense for mob lynching on grounds of race, caste, sex, language, etc."
    },
    "IPC 420": {
        "old_act": "Indian Penal Code, 1860",
        "old_section": "Section 420",
        "new_act": "Bharatiya Nyaya Sanhita, 2023 (BNS)",
        "new_section": "Section 318(4)",
        "subject": "Cheating and dishonestly inducing delivery of property",
        "effective_date": "01-07-2024",
        "transition_note": "Replaced by Section 318(4) BNS."
    },
    "IPC 498A": {
        "old_act": "Indian Penal Code, 1860",
        "old_section": "Section 498A",
        "new_act": "Bharatiya Nyaya Sanhita, 2023 (BNS)",
        "new_section": "Section 85 & 86",
        "subject": "Husband or relative of husband of a woman subjecting her to cruelty",
        "effective_date": "01-07-2024",
        "transition_note": "Cruelty defined with explanation in Section 86 BNS."
    },
    "IEA 65B": {
        "old_act": "Indian Evidence Act, 1872",
        "old_section": "Section 65B",
        "new_act": "Bharatiya Sakshya Adhiniyam, 2023 (BSA)",
        "new_section": "Section 63",
        "subject": "Admissibility of electronic records and certificate requirement",
        "effective_date": "01-07-2024",
        "transition_note": "Replaced by Section 63 BSA; retains Arjun Panditrao Khotkar principles."
    }
}

AUTHORITATIVE_DOCUMENTS: List[LegalDocument] = [
    # 1. Sushila Aggarwal (Constitution Bench on Anticipatory Bail)
    LegalDocument(
        id="sc-2020-sushila-aggarwal",
        title="Sushila Aggarwal and Others v. State (NCT of Delhi) and Another",
        source_name="Supreme Court of India / Indian Kanoon",
        source_url="https://indiankanoon.org/doc/174301297/",
        doc_type=LegalSourceType.JUDGMENT_SC,
        authority_level=AuthorityLevel.SC_CONSTITUTION_BENCH,
        citation="(2020) 5 SCC 1 : AIR 2020 SC 831",
        court="Supreme Court of India",
        bench="5-Judge Constitution Bench (Arun Mishra, Indira Banerjee, Vineet Saran, M.R. Shah, S. Ravindra Bhat, JJ.)",
        bench_size=5,
        date="2020-01-29",
        act="Code of Criminal Procedure, 1973 (now BNSS 2023)",
        section="Section 438 CrPC (corresponds to Section 482 BNSS)",
        snippet="Anticipatory bail granted under Section 438 of CrPC should not ordinarily be limited to a fixed period; it should enure until the conclusion of the trial unless special circumstances warrant limitation.",
        content="""The Supreme Court Constitution Bench held:
1. The protection granted to a person under Section 438 CrPC should not ordinarily be limited to a fixed period. It should enure in favour of the accused without any restriction on time, until the trial is completed.
2. The life of anticipatory bail order does not automatically end when the charge sheet is filed under Section 173(2) CrPC or when charges are framed.
3. Overruled earlier restrictive decisions like Salauddin Abdulsamad Shaikh (1996) 1 SCC 667 and affirmed the principles in the 5-Judge Constitution Bench ruling in Gurbaksh Singh Sibbia (1980) 2 SCC 565.
4. Courts can, however, impose reasonable conditions under Section 438(2) based on specific facts, but blank restrictions or routine fixed durations violate constitutional personal liberty under Article 21.""",
        ratio_decidendi="Anticipatory bail under Section 438 CrPC (BNSS s.482) is not subject to an invariable rule of fixed time limitation; it ordinarily continues until the conclusion of the trial. Filing of a chargesheet does not ipso facto extinguish pre-arrest bail.",
        current_status="Good Law",
        status_details="Settled 5-Judge Constitution Bench law; binding on all Courts across India under Article 141 of the Constitution."
    ),

    # 2. Gurbaksh Singh Sibbia (Foundational Constitution Bench on Anticipatory Bail)
    LegalDocument(
        id="sc-1980-gurbaksh-sibbia",
        title="Gurbaksh Singh Sibbia and Others v. State of Punjab",
        source_name="Supreme Court of India / Indian Kanoon",
        source_url="https://indiankanoon.org/doc/1396751/",
        doc_type=LegalSourceType.JUDGMENT_SC,
        authority_level=AuthorityLevel.SC_CONSTITUTION_BENCH,
        citation="(1980) 2 SCC 565 : AIR 1980 SC 1632",
        court="Supreme Court of India",
        bench="5-Judge Constitution Bench (Y.V. Chandrachud, C.J., P.N. Bhagwati, N.L. Untwalia, R.S. Pathak, O. Chinnappa Reddy, JJ.)",
        bench_size=5,
        date="1980-04-09",
        act="Code of Criminal Procedure, 1973",
        section="Section 438 CrPC",
        snippet="Section 438 is a device to secure the individual's liberty; it neither needs to be circumscribed by unwritten conditions nor interpreted with narrow artificial restrictions.",
        content="""The 5-Judge Constitution Bench held that:
1. Anticipatory bail power conferred upon the High Court and Sessions Court under Section 438 is wide and discretionary, aimed at protecting personal liberty against harassment and false implication.
2. The Court rejected the proposition that anticipatory bail should only be granted in exceptional cases or only when the offense is non-cognizable.
3. Reasonable belief of apprehension of arrest based on tangible materials is sufficient; vague anticipations are not enough.
4. Overruled narrow restrictive guidelines previously framed by the Punjab and Haryana High Court Full Bench.""",
        ratio_decidendi="Discretion under Section 438 CrPC is broad and must be exercised to uphold personal liberty under Article 21; unwritten limitations not found in the statute cannot be imported by judicial fiat.",
        current_status="Good Law",
        status_details="Reaffirmed and clarified by the 5-Judge Bench in Sushila Aggarwal (2020)."
    ),

    # 3. Salauddin Abdulsamad Shaikh (Overruled decision)
    LegalDocument(
        id="sc-1996-salauddin-shaikh",
        title="Salauddin Abdulsamad Shaikh v. State of Maharashtra",
        source_name="Supreme Court of India / Indian Kanoon",
        source_url="https://indiankanoon.org/doc/1712496/",
        doc_type=LegalSourceType.JUDGMENT_SC,
        authority_level=AuthorityLevel.SC_DIVISION_BENCH,
        citation="(1996) 1 SCC 667",
        court="Supreme Court of India",
        bench="Division Bench (A.M. Ahmadi, C.J., S.C. Sen, J.)",
        bench_size=2,
        date="1995-11-27",
        act="Code of Criminal Procedure, 1973",
        section="Section 438 CrPC",
        snippet="Held that anticipatory bail must be limited to a specific time duration to enable the accused to surrender and apply for regular bail.",
        content="""A 2-Judge bench held that anticipatory bail should only be granted for a limited time duration, upon expiry of which the accused must surrender and apply for regular bail before the trial court.""",
        ratio_decidendi="Anticipatory bail orders should be limited in time.",
        current_status="Overruled",
        status_details="Expressly OVERRULED by the 5-Judge Constitution Bench in Sushila Aggarwal v. State (NCT of Delhi) (2020) 5 SCC 1."
    ),

    # 4. India Code Statute: Section 438 CrPC
    LegalDocument(
        id="ic-statute-crpc-438",
        title="Section 438 - Direction for grant of bail to person apprehending arrest",
        source_name="India Code (Legislative Department)",
        source_url="https://www.indiacode.nic.in/handle/123456789/1611?sam_handle=123456789/1362",
        doc_type=LegalSourceType.STATUTE,
        authority_level=AuthorityLevel.CENTRAL_ACT,
        citation="Code of Criminal Procedure, 1973 (Act No. 2 of 1974), Section 438",
        court="Parliament of India",
        bench="Enacted Statute",
        bench_size=0,
        date="1974-01-25",
        act="Code of Criminal Procedure, 1973",
        section="Section 438",
        snippet="Where any person has reason to believe that he may be arrested on an accusation of having committed a non-bailable offence, he may apply to the High Court or the Court of Session for a direction under this section.",
        content="""Section 438. Direction for grant of bail to person apprehending arrest:
(1) Where any person has reason to believe that he may be arrested on an accusation of having committed a non-bailable offence, he may apply to the High Court or the Court of Session for a direction under this section that in the event of such arrest he shall be released on bail; and that Court may, after taking into consideration, inter alia, the following factors, namely:—
  (i) the nature and gravity of the accusation;
  (ii) the antecedents of the applicant including the fact as to whether he has previously undergone imprisonment on conviction by a Court in respect of any cognizable offence;
  (iii) the possibility of the applicant to flee from justice; and
  (iv) where the accusation has been made with the object of injuring or humiliating the applicant by having him so arrested,
either reject the application forthwith or issue an interim order for the grant of anticipatory bail.""",
        ratio_decidendi="Statutory gateway for pre-arrest protection in non-bailable accusations.",
        current_status="Replaced",
        status_details="Replaced by Section 482 of the Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS) with effect from 1st July 2024. Applicable to pre-July 2024 offenses under s.531 BNSS savings clause."
    ),

    # 5. India Code Statute: Section 482 BNSS 2023
    LegalDocument(
        id="ic-statute-bnss-482",
        title="Section 482 - Direction for grant of bail to person apprehending arrest",
        source_name="India Code / Ministry of Law and Justice",
        source_url="https://www.indiacode.nic.in/handle/123456789/21804",
        doc_type=LegalSourceType.STATUTE,
        authority_level=AuthorityLevel.CENTRAL_ACT,
        citation="Bharatiya Nagarik Suraksha Sanhita, 2023 (Act No. 46 of 2023), Section 482",
        court="Parliament of India",
        bench="Enacted Statute",
        bench_size=0,
        date="2023-12-25",
        act="Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)",
        section="Section 482",
        snippet="Where any person has reason to believe that he may be arrested on an accusation of having committed a non-bailable offence, he may apply to the High Court or Court of Session for anticipatory bail.",
        content="""Section 482 BNSS 2023:
(1) When any person has reason to believe that he may be arrested on an accusation of having committed a non-bailable offence, he may apply to the High Court or the Court of Session for a direction under this section that in the event of such arrest he shall be released on bail; and that Court may, after taking into consideration:
  (i) the nature and gravity of the accusation;
  (ii) the antecedents of the applicant;
  (iii) the possibility of the applicant fleeing from justice; and
  (iv) whether the accusation has been made with the object of injuring or humiliating the applicant,
either reject the application forthwith or issue an interim order for the grant of anticipatory bail.
(2) When the High Court or Court of Session makes a direction under sub-section (1), it may include such conditions as:
  (i) a condition that the person shall make himself available for interrogation by a police officer as and when required;
  (ii) a condition that the person shall not induce, threaten or promise any person acquainted with facts;
  (iii) a condition that the person shall not leave India without previous permission of Court.""",
        ratio_decidendi="Current governing provision for anticipatory bail across India since July 1, 2024.",
        current_status="In Force",
        status_details="In full force across all Indian States and Union Territories since 1 July 2024."
    ),

    # 6. Justice K.S. Puttaswamy (9-Judge Constitution Bench on Privacy)
    LegalDocument(
        id="sc-2017-puttaswamy-privacy",
        title="Justice K.S. Puttaswamy (Retd.) and Another v. Union of India and Others",
        source_name="Supreme Court of India / Indian Kanoon",
        source_url="https://indiankanoon.org/doc/91938676/",
        doc_type=LegalSourceType.JUDGMENT_SC,
        authority_level=AuthorityLevel.SC_CONSTITUTION_BENCH,
        citation="(2017) 10 SCC 1 : AIR 2017 SC 4161",
        court="Supreme Court of India",
        bench="9-Judge Constitution Bench (J.S. Khehar, C.J., J. Chelameswar, S.A. Bobde, R.K. Agrawal, R.F. Nariman, A.M. Sapre, D.Y. Chandrachud, S.K. Kaul, S. Abdul Nazeer, JJ.)",
        bench_size=9,
        date="2017-08-24",
        act="Constitution of India",
        section="Article 21 read with Articles 14 and 19",
        snippet="Right to privacy is protected as an intrinsic part of the right to life and personal liberty under Article 21 and as a part of the freedoms guaranteed by Part III of the Constitution.",
        content="""The 9-Judge Constitution Bench unanimously held that:
1. The right to privacy is a fundamental right under Article 21 and Part III of the Constitution of India.
2. Overruled M.P. Sharma v. Satish Chandra (1954) [8-Judge Bench] to the extent it held privacy is not a fundamental right.
3. Overruled Kharak Singh v. State of U.P. (1962) [6-Judge Bench] to the extent it held that right to privacy is not guaranteed under the Constitution.
4. Established the three-fold proportionality test for state interference in privacy: (i) Legitimate state aim / legality, (ii) Proportionality / suitability, (iii) Necessity / least intrusive measure.""",
        ratio_decidendi="Right to privacy is a fundamental constitutional right emanating from Article 21, subject only to proportional state restrictions satisfying legality, necessity, and proportionality.",
        current_status="Good Law",
        status_details="Unanimous 9-Judge landmark; the supreme authority on informational, spatial, and bodily privacy in India."
    ),

    # 7. Cox and Kings Ltd (5-Judge Constitution Bench on Arbitration Group of Companies Doctrine)
    LegalDocument(
        id="sc-2023-cox-and-kings",
        title="Cox and Kings Ltd. v. SAP India Pvt. Ltd. and Another",
        source_name="Supreme Court of India / Indian Kanoon",
        source_url="https://indiankanoon.org/doc/173323030/",
        doc_type=LegalSourceType.JUDGMENT_SC,
        authority_level=AuthorityLevel.SC_CONSTITUTION_BENCH,
        citation="(2024) 4 SCC 1 : 2023 INSC 1051",
        court="Supreme Court of India",
        bench="5-Judge Constitution Bench (D.Y. Chandrachud, C.J., Hrishikesh Roy, P.S. Narasimha, J.B. Pardiwala, Manoj Misra, JJ.)",
        bench_size=5,
        date="2023-12-06",
        act="Arbitration and Conciliation Act, 1996",
        section="Section 7, Section 8, Section 11",
        snippet="The Group of Companies doctrine is retained in Indian arbitration jurisprudence, but must be founded on mutual intent to be bound by the arbitration agreement rather than mere corporate affiliation.",
        content="""The 5-Judge Constitution Bench settled the law on non-signatories in Indian arbitration:
1. The 'Group of Companies' doctrine has independent existence in Indian arbitration law under Section 7 of the Arbitration and Conciliation Act, 1996.
2. Being a non-signatory to an arbitration agreement does not per se exclude a party from arbitration if there is commonality of subject matter, composite transaction, and conduct evincing mutual intention to be bound.
3. Clarified and modified the Chloro Controls India (2013) framework: the phrase 'claiming through or under' in Section 8/45 applies only to successors-in-interest; non-signatories bound by conduct are actual parties under Section 7.
4. Referral courts under Section 11 must prima facie determine party status, leaving detailed examination to the arbitral tribunal under Section 16.""",
        ratio_decidendi="Group of Companies doctrine is valid under Indian arbitration law; mutual intention of all parties to bind non-signatories by conduct in performance of composite transactions governs.",
        current_status="Good Law",
        status_details="5-Judge Constitution Bench authority resolving decades of conflicting High Court and Division Bench jurisprudence."
    ),

    # 8. Rangappa v. Sri Mohan (3-Judge Bench on Negotiable Instruments Act s.138/139)
    LegalDocument(
        id="sc-2010-rangappa",
        title="Rangappa v. Sri Mohan",
        source_name="Supreme Court of India / Indian Kanoon",
        source_url="https://indiankanoon.org/doc/1449833/",
        doc_type=LegalSourceType.JUDGMENT_SC,
        authority_level=AuthorityLevel.SC_LARGER_BENCH,
        citation="(2010) 11 SCC 441 : AIR 2010 SC 1898",
        court="Supreme Court of India",
        bench="3-Judge Bench (K.G. Balakrishnan, C.J., P. Sathasivam, J.M. Panchal, JJ.)",
        bench_size=3,
        date="2010-05-07",
        act="Negotiable Instruments Act, 1881",
        section="Section 138, Section 139",
        snippet="Section 139 of the Act is an example of a reverse onus clause and mandates a statutory presumption that the cheque was issued for discharge of a legally enforceable debt.",
        content="""A 3-Judge Bench held that:
1. The presumption mandated by Section 139 of the Negotiable Instruments Act includes the presumption of existence of a legally enforceable debt or liability.
2. Overruled the contrary observation in Krishna Janardhan Bhat (2008) 4 SCC 54 to that extent.
3. The standard of proof to rebut the presumption is by 'preponderance of probabilities'; the accused need not prove his defense beyond reasonable doubt.""",
        ratio_decidendi="Section 139 NI Act creates a mandatory statutory presumption of a legally enforceable debt. The accused can rebut on preponderance of probabilities by raising probable defense.",
        current_status="Good Law",
        status_details="Overruled Krishna Janardhan Bhat; consistently affirmed by subsequent benches in Basalingappa (2019) and Kalamani Tex (2021)."
    ),

    # 9. Swiss Ribbons v. Union of India (IBC Constitutionality)
    LegalDocument(
        id="sc-2019-swiss-ribbons",
        title="Swiss Ribbons Pvt. Ltd. and Another v. Union of India and Others",
        source_name="Supreme Court of India / Indian Kanoon",
        source_url="https://indiankanoon.org/doc/173634351/",
        doc_type=LegalSourceType.JUDGMENT_SC,
        authority_level=AuthorityLevel.SC_DIVISION_BENCH,
        citation="(2019) 4 SCC 17 : AIR 2019 SC 739",
        court="Supreme Court of India",
        bench="Division Bench (R.F. Nariman, Navin Sinha, JJ.)",
        bench_size=2,
        date="2019-01-25",
        act="Insolvency and Bankruptcy Code, 2016",
        section="Section 7, Section 9, Section 12A, Section 29A",
        snippet="Upheld the constitutional validity of the Insolvency and Bankruptcy Code in its entirety, distinguishing financial creditors from operational creditors.",
        content="""The Supreme Court comprehensively upheld the IBC:
1. Distinction between financial creditors (Section 7) and operational creditors (Section 9) is based on intelligible differentia and does not violate Article 14.
2. Section 29A disqualification of willful defaulters from bidding is constitutionally valid to prevent backdoor entry of recalcitrant promoters.
3. The primary objective of the Code is reorganization and resolution of corporate debtors, not recovery of debts or liquidation.""",
        ratio_decidendi="IBC 2016 is an economic legislation fostering entrepreneurship and resolution. Financial and operational creditors are distinct classes. Section 29A is valid.",
        current_status="Good Law",
        status_details="Foundational judgment establishing IBC constitutional jurisprudence."
    ),

    # 10. Law Commission of India - 268th Report (Bail Reforms)
    LegalDocument(
        id="lci-rep-268",
        title="Law Commission of India - Report No. 268: Amendments to the Criminal Procedure Code, 1973 - Provisions Relating to Bail",
        source_name="Law Commission of India",
        source_url="https://cdnbbsr.s3waas.gov.in/s3ca0c2720d2d34a5d0959f6355ff4b1/uploads/2022/08/2022081682.pdf",
        doc_type=LegalSourceType.LAW_COMMISSION,
        authority_level=AuthorityLevel.COMMENTARY,
        citation="268th Law Commission Report (2017)",
        court="Law Commission of India (Chaired by Justice B.S. Chauhan)",
        bench="Full Commission",
        bench_size=0,
        date="2017-05-23",
        act="Code of Criminal Procedure, 1973 (Reforms)",
        section="Sections 436, 437, 438, 439 CrPC",
        snippet="Comprehensive empirical review of bail laws in India; recommended safeguarding personal liberty against mechanical arrests and streamlining anticipatory bail without arbitrary curbs.",
        content="""The 268th Law Commission Report highlighted:
1. Over 67% of prisoners in Indian jails are undertrials, suffering prolonged detention due to poverty and mechanical refusal of bail.
2. Recommended strengthening pre-arrest protection under Section 438 CrPC and restricting automatic police arrest for offenses under 7 years imprisonment.
3. Strongly advocated against routine conditions requiring fixed expiration dates on anticipatory bail, recommendations later integrated into the Bharatiya Nagarik Suraksha Sanhita (BNSS).""",
        ratio_decidendi="Law Commission recommendations on non-custodial bail standards and anti-harassment safeguards.",
        current_status="Good Law",
        status_details="Authoritative official government legal study referenced extensively by the Supreme Court in Arnesh Kumar and Satender Kumar Antil."
    )
]
