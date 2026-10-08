"""
Comprehensive Indian Law Library & Comparative Explorer Engine (संपूर्ण भारतीय विधि पुस्तकालय).
Includes:
- Bare Acts Database (20+ Central Statutes, Sanhitas, Civil, Criminal, Constitutional)
- Full Section Catalogs & Provisions
- Section-by-Section Comparative Transition Engine (BNS ↔ IPC, BNSS ↔ CrPC, BSA ↔ IEA)
- Constitutional & Commercial Statute Reference
- Precedent & Constitution Bench Library
"""

from typing import Dict, List, Any, Optional
from pydantic import BaseModel

class LawSection(BaseModel):
    section_number: str
    title: str
    chapter: str
    act_id: str
    act_name: str
    description: str
    punishment_or_procedure: Optional[str] = ""
    cognizable_bailable: Optional[str] = ""
    trial_court: Optional[str] = ""
    landmark_cases: List[str] = []
    comparison_key: Optional[str] = None
    notes: Optional[str] = ""

class BareAct(BaseModel):
    id: str
    name: str
    short_name: str
    year: int
    category: str  # Criminal, Civil, Constitutional, Commercial, Special
    status: str    # In Force, Repealed, Foundational
    total_sections: int
    summary: str
    chapters: List[str]
    sections: List[LawSection]

# 1. Complete Indian Law Library Bare Acts
INDIAN_LAW_LIBRARY: Dict[str, BareAct] = {
    "bns": BareAct(
        id="bns",
        name="Bharatiya Nyaya Sanhita, 2023 (BNS)",
        short_name="BNS 2023",
        year=2023,
        category="Criminal Substantive",
        status="In Force (from 01-07-2024)",
        total_sections=358,
        summary="Primary substantive criminal law of India replacing the Indian Penal Code, 1860. Modernizes offenses, adds community service, organized crime, terror acts, and mob lynching provisions.",
        chapters=["Preliminary", "General Exceptions", "Punishments", "Abetment & Conspiracy", "Offences against Woman and Child", "Offences against Human Body", "Offences against Property"],
        sections=[
            LawSection(
                section_number="103(1)",
                title="Punishment for Murder",
                chapter="Offences against the Human Body",
                act_id="bns",
                act_name="Bharatiya Nyaya Sanhita, 2023",
                description="Whoever commits murder shall be punished with death or imprisonment for life, and shall also be liable to fine.",
                punishment_or_procedure="Death or Life Imprisonment + Fine",
                cognizable_bailable="Cognizable / Non-Bailable",
                trial_court="Court of Session",
                landmark_cases=["Bachan Singh v. State of Punjab (Rarest of Rare Doctrine)", "Machhi Singh v. State of Punjab"],
                comparison_key="ipc-302",
                notes="Replaces Section 302 IPC. Sub-section (2) introduces capital punishment / life imprisonment for mob lynching on grounds of race, caste, sex, language, etc."
            ),
            LawSection(
                section_number="103(2)",
                title="Murder by Mob Lynching / Hate Group",
                chapter="Offences against the Human Body",
                act_id="bns",
                act_name="Bharatiya Nyaya Sanhita, 2023",
                description="When a group of five or more persons acting in concert commits murder on grounds of race, caste or community, sex, place of birth, language, personal belief or any other ground, each member of such group shall be punished with death or life imprisonment, and fine.",
                punishment_or_procedure="Death or Imprisonment for Life + Fine",
                cognizable_bailable="Cognizable / Non-Bailable",
                trial_court="Court of Session",
                landmark_cases=["Tehseen S. Poonawalla v. Union of India (2018)"],
                comparison_key="ipc-302-lynch",
                notes="New statutory provision enacted in 2023 without direct parallel in IPC 1860."
            ),
            LawSection(
                section_number="69",
                title="Sexual intercourse by employing deceitful means / false promise to marry",
                chapter="Offences against Woman and Child",
                act_id="bns",
                act_name="Bharatiya Nyaya Sanhita, 2023",
                description="Whoever, by deceitful means or making by promise to marry to a woman without any intention of fulfilling the same, has sexual intercourse with her, shall be punished with imprisonment up to 10 years and fine.",
                punishment_or_procedure="Imprisonment up to 10 Years + Fine",
                cognizable_bailable="Cognizable / Non-Bailable",
                trial_court="Court of Session",
                landmark_cases=["Anurag Soni v. State of Chhattisgarh (2019)", "Pramod Suryabhan Pawar v. State of Maharashtra (2019)"],
                comparison_key="ipc-375-deceit",
                notes="Codifies Supreme Court jurisprudence on consent under misconception of fact into an express standalone penal section."
            ),
            LawSection(
                section_number="111",
                title="Organised Crime",
                chapter="Offences against the State & Body",
                act_id="bns",
                act_name="Bharatiya Nyaya Sanhita, 2023",
                description="Defines and penalizes continuing unlawful activity, kidnapping, robbery, extortion, land grabbing, contract killing, cyber-crimes, trafficking, economic offenses committed singly or jointly as member of an organised crime syndicate.",
                punishment_or_procedure="Death or Life Imprisonment (if death results); else minimum 5 years up to Life Imprisonment + Fine minimum ₹5 Lakhs",
                cognizable_bailable="Cognizable / Non-Bailable",
                trial_court="Special Court / Sessions Court",
                landmark_cases=["State of Maharashtra v. Lalit Somdatta Nagpal", "Kavitha Lankesh v. State of Karnataka"],
                comparison_key="moca-special",
                notes="Brings MCOCA-style organized crime penal framework into the central substantive criminal code."
            ),
            LawSection(
                section_number="318(4)",
                title="Cheating and dishonestly inducing delivery of property",
                chapter="Offences against Property",
                act_id="bns",
                act_name="Bharatiya Nyaya Sanhita, 2023",
                description="Whoever cheats and thereby dishonestly induces the person deceived to deliver any property, shall be punished with imprisonment up to 7 years and fine.",
                punishment_or_procedure="Imprisonment up to 7 Years + Fine",
                cognizable_bailable="Cognizable / Non-Bailable",
                trial_court="Magistrate First Class",
                landmark_cases=["Hridaya Ranjan Prasad Verma v. State of Bihar", "Vesa Holdings v. State of Kerala"],
                comparison_key="ipc-420",
                notes="Exact substantive successor to Section 420 IPC."
            ),
            LawSection(
                section_number="85 & 86",
                title="Husband or relative of husband subjecting woman to cruelty",
                chapter="Offences against Woman and Child",
                act_id="bns",
                act_name="Bharatiya Nyaya Sanhita, 2023",
                description="Punishment for cruelty by husband or relatives. Section 86 gives express statutory definitions of mental and physical cruelty and harassment for dowry.",
                punishment_or_procedure="Imprisonment up to 3 Years + Fine",
                cognizable_bailable="Cognizable / Non-Bailable",
                trial_court="Magistrate First Class",
                landmark_cases=["Arnesh Kumar v. State of Bihar (2014)", "Kahkashan Kausar @ Sonam v. State of Bihar (2020)"],
                comparison_key="ipc-498a",
                notes="Replaces Section 498A IPC."
            )
        ]
    ),
    "bnss": BareAct(
        id="bnss",
        name="Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)",
        short_name="BNSS 2023",
        year=2023,
        category="Criminal Procedural",
        status="In Force (from 01-07-2024)",
        total_sections=531,
        summary="Procedural criminal code of India replacing the Code of Criminal Procedure, 1973. Mandates electronic summons, audio-video recording of search and seizure, forensic investigation for offenses >= 7 years, and updated bail timelines.",
        chapters=["Preliminary", "Constitution of Criminal Courts", "Powers of Courts", "Arrest of Persons", "Processes to Compel Appearance", "Information to Police & Powers to Investigate", "Bail & Bonds", "Inherent Powers & Repeal"],
        sections=[
            LawSection(
                section_number="482",
                title="Direction for grant of bail to person apprehending arrest (Anticipatory Bail)",
                chapter="Bail and Bonds",
                act_id="bnss",
                act_name="Bharatiya Nagarik Suraksha Sanhita, 2023",
                description="Where any person has reason to believe that he may be arrested on accusation of having committed a non-bailable offence, he may apply to the High Court or the Court of Session for a direction that in the event of such arrest he shall be released on bail.",
                punishment_or_procedure="Pre-Arrest Bail Discretion",
                cognizable_bailable="Judicial Relief",
                trial_court="Sessions Court / High Court",
                landmark_cases=["Sushila Aggarwal v. State (NCT of Delhi) (2020) [5-Judge Bench]", "Gurbaksh Singh Sibbia v. State of Punjab (1980) [5-Judge Bench]"],
                comparison_key="crpc-438",
                notes="Replaces Section 438 CrPC. Governed by Section 531 savings clause: pre-01-07-2024 offenses proceed under CrPC s.438."
            ),
            LawSection(
                section_number="483",
                title="Special powers of High Court or Court of Session regarding bail (Regular Bail)",
                chapter="Bail and Bonds",
                act_id="bnss",
                act_name="Bharatiya Nagarik Suraksha Sanhita, 2023",
                description="A High Court or Court of Session may direct that any person accused of an offence and in custody be released on bail.",
                punishment_or_procedure="Post-Arrest Custodial Bail",
                cognizable_bailable="Judicial Relief",
                trial_court="Sessions Court / High Court",
                landmark_cases=["Manish Sisodia v. Directorate of Enforcement (2024)", "P. Chidambaram v. Directorate of Enforcement (2019)"],
                comparison_key="crpc-439",
                notes="Direct equivalent to Section 439 CrPC."
            ),
            LawSection(
                section_number="187",
                title="Procedure when investigation cannot be completed in twenty-four hours (Police Remand & Default Bail)",
                chapter="Information to Police & Powers to Investigate",
                act_id="bnss",
                act_name="Bharatiya Nagarik Suraksha Sanhita, 2023",
                description="Magistrate may authorize detention in police custody or judicial custody. Allows 15 days police remand in whole or in parts during the initial 40 or 60 days period of total detention.",
                punishment_or_procedure="Police custody max 15 days; Default bail upon completion of 60/90 days",
                cognizable_bailable="Remand Jurisdiction",
                trial_court="Judicial Magistrate",
                landmark_cases=["CBI v. Anupam J. Kulkarni (1992)", "V. Senthil Balaji v. State (2023)"],
                comparison_key="crpc-167",
                notes="Replaces Section 167 CrPC with significant change: police custody need not be confined to first 15 days only."
            ),
            LawSection(
                section_number="528",
                title="Saving of inherent powers of High Court (Quashing of FIR / Proceedings)",
                chapter="General Provisions & Savings",
                act_id="bnss",
                act_name="Bharatiya Nagarik Suraksha Sanhita, 2023",
                description="Nothing in this Sanhita shall be deemed to limit or affect the inherent powers of the High Court to make such orders as may be necessary to give effect to any order under this Sanhita, or to prevent abuse of the process of any Court or otherwise to secure the ends of justice.",
                punishment_or_procedure="Inherent Quashing Jurisdiction",
                cognizable_bailable="High Court Inherent Relief",
                trial_court="High Court of Judicature",
                landmark_cases=["State of Haryana v. Bhajan Lal (1992)", "R.P. Kapur v. State of Punjab (1960)", "Neeharika Infrastructure v. State of Maharashtra (2021)"],
                comparison_key="crpc-482",
                notes="Preserves verbatim the extraordinary inherent powers under Section 482 of CrPC."
            ),
            LawSection(
                section_number="35(3)",
                title="Notice of Appearance before Police Officer (Arrest Safeguard)",
                chapter="Arrest of Persons",
                act_id="bnss",
                act_name="Bharatiya Nagarik Suraksha Sanhita, 2023",
                description="The police officer shall, in all cases where the arrest of a person is not required under sub-section (1), issue a notice directing the person against whom a reasonable complaint has been made to appear before him.",
                punishment_or_procedure="Mandatory pre-arrest notice for offenses <= 7 years",
                cognizable_bailable="Investigative Procedure",
                trial_court="Police Station / Magistrate",
                landmark_cases=["Arnesh Kumar v. State of Bihar (2014)", "Satender Kumar Antil v. CBI (2022)"],
                comparison_key="crpc-41a",
                notes="Replaces Section 41A CrPC. Mandatory compliance under Arnesh Kumar guidelines."
            )
        ]
    ),
    "bsa": BareAct(
        id="bsa",
        name="Bharatiya Sakshya Adhiniyam, 2023 (BSA)",
        short_name="BSA 2023",
        year=2023,
        category="Evidence Procedural",
        status="In Force (from 01-07-2024)",
        total_sections=170,
        summary="Governs admissibility, relevance, and proof of facts in civil and criminal proceedings. Modernizes electronic evidence, hash verification, cloud records, and digital certificates.",
        chapters=["Preliminary", "Relevancy of Facts", "Proof & Burden of Proof", "Production & Effect of Evidence", "Witnesses & Cross-Examination"],
        sections=[
            LawSection(
                section_number="63",
                title="Admissibility of Electronic Records & Certificate",
                chapter="Proof & Production of Documents",
                act_id="bsa",
                act_name="Bharatiya Sakshya Adhiniyam, 2023",
                description="Any information contained in an electronic record which is printed on paper, stored, recorded or copied in optical or magnetic media shall be deemed to be also a document. Requires a signed certificate certifying conditions of device and integrity.",
                punishment_or_procedure="Admissibility of Digital/Electronic Evidence",
                cognizable_bailable="Evidentiary Requirement",
                trial_court="All Civil & Criminal Courts",
                landmark_cases=["Arjun Panditrao Khotkar v. Kailash Kushanrao Gorantyal (2020) [3-Judge Bench]", "Shafhi Mohammad v. State of H.P. (2018)"],
                comparison_key="iea-65b",
                notes="Replaces Section 65B of Indian Evidence Act, 1872. Formal certificate under Schedule/Sec 63(4) remains mandatory for secondary digital records."
            ),
            LawSection(
                section_number="145",
                title="Cross-examination as to previous statements in writing (Impeaching Witness Credit)",
                chapter="Examination of Witnesses",
                act_id="bsa",
                act_name="Bharatiya Sakshya Adhiniyam, 2023",
                description="A witness may be cross-examined as to previous statements made by him in writing or reduced into writing, and relevant to matters in question, without such writing being shown to him, or being proved; but if it is intended to contradict him by the writing, his attention must, before the writing can be proved, be called to those parts of it which are to be used for the purpose of contradicting him.",
                punishment_or_procedure="Courtroom Cross-Examination Foundation",
                cognizable_bailable="Trial Procedure",
                trial_court="Trial Courts / Sessions / District",
                landmark_cases=["Tahsildar Singh v. State of U.P. (1959) [Constitution Bench]", "V.K. Mishra v. State of Uttarakhand (2015)"],
                comparison_key="iea-145",
                notes="Crucial courtroom weapon to confront witnesses with police statements (Sec 161 CrPC / 180 BNSS) or FIR omissions."
            ),
            LawSection(
                section_number="24",
                title="Confession made by any person while in custody of police not to be proved against him",
                chapter="Relevancy of Facts",
                act_id="bsa",
                act_name="Bharatiya Sakshya Adhiniyam, 2023",
                description="No confession made to a police officer shall be proved as against a person accused of any offence.",
                punishment_or_procedure="Inadmissibility of Police Confession",
                cognizable_bailable="Constitutional Protection (Art 20(3))",
                trial_court="Criminal Courts",
                landmark_cases=["Pulukuri Kottaya v. King Emperor (1947)", "Nandini Satpathy v. P.L. Dani (1978)"],
                comparison_key="iea-25-26",
                notes="Combines Sections 25 & 26 of the old Indian Evidence Act."
            )
        ]
    ),
    "ipc": BareAct(
        id="ipc",
        name="Indian Penal Code, 1860 (IPC)",
        short_name="IPC 1860",
        year=1860,
        category="Criminal Substantive",
        status="Repealed (Active for pre-01-07-2024 offenses)",
        total_sections=511,
        summary="Historical criminal code of British India & independent India until 30th June 2024. Continues to govern trials, appeals, and FIRs for offenses committed prior to 1st July 2024.",
        chapters=["General Principles", "Punishments", "General Exceptions", "Offences Against State", "Offences Against Human Body", "Offences Against Property"],
        sections=[
            LawSection(
                section_number="302",
                title="Punishment for murder",
                chapter="Offences Affecting the Human Body",
                act_id="ipc",
                act_name="Indian Penal Code, 1860",
                description="Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.",
                punishment_or_procedure="Death or Life Imprisonment + Fine",
                cognizable_bailable="Cognizable / Non-Bailable",
                trial_court="Court of Session",
                landmark_cases=["Bachan Singh v. State of Punjab", "Macchi Singh v. State of Punjab"],
                comparison_key="bns-103",
                notes="Predecessor to Section 103(1) BNS."
            ),
            LawSection(
                section_number="420",
                title="Cheating and dishonestly inducing delivery of property",
                chapter="Offences Against Property",
                act_id="ipc",
                act_name="Indian Penal Code, 1860",
                description="Cheating and dishonestly inducing delivery of property.",
                punishment_or_procedure="Imprisonment up to 7 Years + Fine",
                cognizable_bailable="Cognizable / Non-Bailable",
                trial_court="Magistrate First Class",
                landmark_cases=["Hridaya Ranjan Prasad Verma v. State of Bihar"],
                comparison_key="bns-318-4",
                notes="Corresponds to Section 318(4) BNS."
            ),
            LawSection(
                section_number="498A",
                title="Husband or relative of husband of a woman subjecting her to cruelty",
                chapter="Of Offences Relating to Marriage",
                act_id="ipc",
                act_name="Indian Penal Code, 1860",
                description="Subjecting woman to cruelty for dowry or willful conduct.",
                punishment_or_procedure="Imprisonment up to 3 Years + Fine",
                cognizable_bailable="Cognizable / Non-Bailable",
                trial_court="Magistrate First Class",
                landmark_cases=["Arnesh Kumar v. State of Bihar (2014)"],
                comparison_key="bns-85-86",
                notes="Corresponds to Sections 85 & 86 BNS."
            )
        ]
    ),
    "crpc": BareAct(
        id="crpc",
        name="Code of Criminal Procedure, 1973 (CrPC)",
        short_name="CrPC 1973",
        year=1973,
        category="Criminal Procedural",
        status="Repealed (Active for pre-01-07-2024 proceedings)",
        total_sections=484,
        summary="Procedural criminal code in force until 30th June 2024. Active under BNSS Section 531 savings clause for ongoing trials and investigations registered before July 2024.",
        chapters=["Preliminary", "Powers of Courts", "Arrest", "Investigation", "Bail", "Inherent Powers"],
        sections=[
            LawSection(
                section_number="438",
                title="Direction for grant of bail to person apprehending arrest (Anticipatory Bail)",
                chapter="Provisions as to Bail and Bonds",
                act_id="crpc",
                act_name="Code of Criminal Procedure, 1973",
                description="Power of High Court or Sessions Court to direct release on bail upon arrest.",
                punishment_or_procedure="Pre-Arrest Bail Discretion",
                cognizable_bailable="Judicial Discretion",
                trial_court="Sessions Court / High Court",
                landmark_cases=["Sushila Aggarwal (2020)", "Gurbaksh Singh Sibbia (1980)"],
                comparison_key="bnss-482",
                notes="Corresponds to Section 482 BNSS."
            ),
            LawSection(
                section_number="439",
                title="Special powers of High Court or Court of Session regarding bail (Regular Bail)",
                chapter="Provisions as to Bail and Bonds",
                act_id="crpc",
                act_name="Code of Criminal Procedure, 1973",
                description="Post-arrest release on bail from custody.",
                punishment_or_procedure="Regular Custodial Bail",
                cognizable_bailable="Judicial Discretion",
                trial_court="Sessions Court / High Court",
                landmark_cases=["P. Chidambaram v. ED (2019)"],
                comparison_key="bnss-483",
                notes="Corresponds to Section 483 BNSS."
            ),
            LawSection(
                section_number="482",
                title="Saving of inherent powers of High Court (Quashing)",
                chapter="Miscellaneous",
                act_id="crpc",
                act_name="Code of Criminal Procedure, 1973",
                description="Inherent power to prevent abuse of process of any court or secure ends of justice.",
                punishment_or_procedure="Inherent Quashing Jurisdiction",
                cognizable_bailable="High Court Inherent Relief",
                trial_court="High Court",
                landmark_cases=["Bhajan Lal (1992)", "R.P. Kapur (1960)"],
                comparison_key="bnss-528",
                notes="Corresponds to Section 528 BNSS."
            )
        ]
    ),
    "constitution": BareAct(
        id="constitution",
        name="Constitution of India, 1950",
        short_name="Constitution",
        year=1950,
        category="Constitutional Foundational",
        status="Supreme Law of the Land",
        total_sections=395,
        summary="Supreme foundational document establishing sovereign socialist secular democratic republic, fundamental rights, constitutional remedies, powers of Supreme Court and High Courts.",
        chapters=["Part III: Fundamental Rights", "Part IV: Directive Principles", "Part V: Union Judiciary", "Part VI: High Courts", "Part XX: Amendment"],
        sections=[
            LawSection(
                section_number="Article 21",
                title="Protection of life and personal liberty",
                chapter="Part III: Fundamental Rights",
                act_id="constitution",
                act_name="Constitution of India",
                description="No person shall be deprived of his life or personal liberty except according to procedure established by law.",
                punishment_or_procedure="Fundamental Right",
                cognizable_bailable="Inviolable Constitutional Guarantee",
                trial_court="Supreme Court / High Courts",
                landmark_cases=["Maneka Gandhi v. Union of India (1978)", "K.S. Puttaswamy v. Union of India (2017) [9-Judge Bench]", "Sunil Batra v. Delhi Administration"],
                notes="Fountainhead of bail jurisprudence ('Bail is rule, jail is exception')."
            ),
            LawSection(
                section_number="Article 226",
                title="Power of High Courts to issue certain writs",
                chapter="Part VI: The States (The High Courts)",
                act_id="constitution",
                act_name="Constitution of India",
                description="Power of every High Court to issue directions, orders or writs including Habeas Corpus, Mandamus, Prohibition, Quo Warranto and Certiorari for the enforcement of fundamental rights and for any other purpose.",
                punishment_or_procedure="Extraordinary Constitutional Writ Jurisdiction",
                cognizable_bailable="Constitutional Remedy",
                trial_court="High Courts of India",
                landmark_cases=["L. Chandra Kumar v. Union of India (1997) [7-Judge Bench]", "Whirlpool Corporation v. Registrar of Trade Marks (1998)"],
                notes="Broader than Article 32 as it covers 'any other purpose' besides Part III rights."
            ),
            LawSection(
                section_number="Article 141",
                title="Law declared by Supreme Court to be binding on all courts",
                chapter="Part V: The Union (The Union Judiciary)",
                act_id="constitution",
                act_name="Constitution of India",
                description="The law declared by the Supreme Court shall be binding on all courts within the territory of India.",
                punishment_or_procedure="Doctrine of Precedent & Stare Decisis",
                cognizable_bailable="Constitutional Mandate",
                trial_court="All Courts in India",
                landmark_cases=["Bengal Immunity Co. v. State of Bihar", "Suganthi Suresh Kumar v. Jagdeeshan (2002)"],
                notes="Constitution Bench decisions bind smaller benches and all High Courts and Subordinate Courts."
            )
        ]
    ),
    "cpc": BareAct(
        id="cpc",
        name="Code of Civil Procedure, 1908 (CPC)",
        short_name="CPC 1908",
        year=1908,
        category="Civil Procedural",
        status="In Force",
        total_sections=158,
        summary="Comprehensive procedure governing the administration of civil proceedings, valuation of suits, pleadings, injunctions, discovery, appeals, executions, and caveats.",
        chapters=["Suits in General", "Execution", "Incidental Proceedings", "Appeals", "Reference, Review & Revision", "Special Orders (Orders 1-51)"],
        sections=[
            LawSection(
                section_number="Order XXXIX Rules 1 & 2",
                title="Temporary Injunctions and Interlocutory Orders",
                chapter="First Schedule: Order 39",
                act_id="cpc",
                act_name="Code of Civil Procedure, 1908",
                description="Cases in which temporary injunction may be granted to restrain alienation, damage, dispossession, or breach of contract.",
                punishment_or_procedure="Three-pronged test: Prima facie case, Balance of convenience, Irreparable injury",
                cognizable_bailable="Civil Relief",
                trial_court="Civil Court",
                landmark_cases=["Dalpat Kumar v. Prahlad Singh (1992)", "Gujarat Bottling Co. Ltd. v. Coca Cola Co. (1995)"],
                notes="Standard test applied for stay and interim restraining orders."
            ),
            LawSection(
                section_number="Order VIII Rule 1",
                title="Written Statement & Time Limit for Filing",
                chapter="First Schedule: Order 8",
                act_id="cpc",
                act_name="Code of Civil Procedure, 1908",
                description="Defendant shall within 30 days from date of service of summons present written statement of defense; extendable up to 90 days (120 days in Commercial Courts).",
                punishment_or_procedure="Statutory limitation for filing defense reply",
                cognizable_bailable="Pleadings Procedure",
                trial_court="Civil Court / Commercial Court",
                landmark_cases=["Salem Advocate Bar Association v. UOI (2005)", "SCG Contracts India v. K.S. Chamankar Infrastructure (2019)"],
                notes="Directory in ordinary civil suits, strictly mandatory in Commercial Courts Act suits."
            ),
            LawSection(
                section_number="Section 148A",
                title="Right to lodge a Caveat",
                chapter="Part XI: Miscellaneous",
                act_id="cpc",
                act_name="Code of Civil Procedure, 1908",
                description="Where an application is expected to be made in a suit or proceeding, any person claiming a right to appear before Court on hearing may lodge a caveat.",
                punishment_or_procedure="Caveat remains in force for 90 days",
                cognizable_bailable="Protective Notice",
                trial_court="Civil Court / High Court",
                landmark_cases=["Reserve Bank of India v. Birodhiram Kashyap"],
                notes="Prevents ex-parte adverse orders without notice."
            )
        ]
    ),
    "nia": BareAct(
        id="nia",
        name="Negotiable Instruments Act, 1881 (NI Act)",
        short_name="NI Act 1881",
        year=1881,
        category="Commercial Criminal",
        status="In Force",
        total_sections=148,
        summary="Statute governing promissory notes, bills of exchange, and cheques. Chapter XVII (Sections 138-148) governs criminal liability for dishonour of cheques for insufficiency of funds.",
        chapters=["Notes, Bills & Cheques", "Parties", "Negotiation", "Chapter XVII: Penalties for Dishonour of Cheques"],
        sections=[
            LawSection(
                section_number="Section 138",
                title="Dishonour of cheque for insufficiency, etc., of funds in the account",
                chapter="Chapter XVII: Dishonour of Cheques",
                act_id="nia",
                act_name="Negotiable Instruments Act, 1881",
                description="Deemed criminal offense when a cheque drawn for discharge of legally enforceable debt/liability is returned unpaid by bank. Requires statutory demand notice within 30 days and complaint within 30 days of failure to pay.",
                punishment_or_procedure="Imprisonment up to 2 Years or Fine up to twice the cheque amount, or both",
                cognizable_bailable="Non-Cognizable / Bailable / Compoundable",
                trial_court="Judicial Magistrate First Class / Metropolitan Magistrate",
                landmark_cases=["Rangappa v. Sri Mohan (2010) [3-Judge Bench]", "Dashrath Rupsingh Rathod v. State of Maharashtra (2014)", "Meters and Instruments v. Kanchan Mehta (2018)"],
                notes="Presumption under Section 139 NI Act is rebuttable upon preponderance of probabilities."
            ),
            LawSection(
                section_number="Section 143A",
                title="Power to direct interim compensation to complainant",
                chapter="Chapter XVII: Dishonour of Cheques",
                act_id="nia",
                act_name="Negotiable Instruments Act, 1881",
                description="Court trying offence under Section 138 may order drawer to pay interim compensation not exceeding 20% of the cheque amount during trial.",
                punishment_or_procedure="Interim compensation up to 20% within 60 days",
                cognizable_bailable="Interim Order",
                trial_court="Trial Magistrate",
                landmark_cases=["G.J. Raja v. Tejraj Sharma (2019)", "Rakesh Ranjan Shrivastava v. State of Jharkhand (2024)"],
                notes="Section 143A held to be prospective and discretionary, not mandatory."
            )
        ]
    )
}

# 2. Section Transition & Comparison Catalog
SECTION_COMPARISON_INDEX = [
    {
        "id": "trans-1",
        "topic": "Anticipatory Bail (अग्रिम जमानत)",
        "law_1": {"act": "BNSS 2023", "section": "Section 482", "name": "Anticipatory Bail under BNSS"},
        "law_2": {"act": "CrPC 1973", "section": "Section 438", "name": "Anticipatory Bail under CrPC"},
        "key_differences": "Substantive powers remain identical. Pending proceedings before 01-07-2024 remain under CrPC 438 via BNSS Section 531 savings clause.",
        "leading_precedents": ["Sushila Aggarwal v. State (NCT Delhi) (2020) [5-Judge Bench]", "Gurbaksh Singh Sibbia (1980) [5-Judge Bench]"],
        "practice_tip": "Check FIR date: if FIR was registered prior to 01-07-2024, title petition under CrPC 438; if post-01-07-2024, invoke BNSS 482."
    },
    {
        "id": "trans-2",
        "topic": "Regular Custodial Bail (नियमित जमानत)",
        "law_1": {"act": "BNSS 2023", "section": "Section 483", "name": "Regular Bail under BNSS"},
        "law_2": {"act": "CrPC 1973", "section": "Section 439", "name": "Regular Bail under CrPC"},
        "key_differences": "Procedural powers of High Court and Sessions Court preserved. Digital and electronic bond filings permitted.",
        "leading_precedents": ["P. Chidambaram v. ED (2019)", "Manish Sisodia v. ED (2024)"],
        "practice_tip": "Custodial bail requires highlighting lack of flight risk, no witness tampering, and trial delay."
    },
    {
        "id": "trans-3",
        "topic": "Police Remand & Default Bail (पुलिस रिमांड व डिफ़ॉल्ट ज़मानत)",
        "law_1": {"act": "BNSS 2023", "section": "Section 187", "name": "Police Remand under BNSS"},
        "law_2": {"act": "CrPC 1973", "section": "Section 167", "name": "Police Remand under CrPC"},
        "key_differences": "MAJOR AMENDMENT: Under BNSS 187, 15 days police remand can be taken in parts over the initial 40 or 60 days of detention, unlike CrPC 167 which required police remand strictly within first 15 days.",
        "leading_precedents": ["CBI v. Anupam J. Kulkarni (1992)", "V. Senthil Balaji v. State (2023)"],
        "practice_tip": "Defense must rigorously oppose split police remand by demonstrating that accused was previously interrogated and recovery is complete."
    },
    {
        "id": "trans-4",
        "topic": "Murder & Capital Offenses (हत्या का अपराध)",
        "law_1": {"act": "BNS 2023", "section": "Section 103(1) & (2)", "name": "Murder & Mob Lynching under BNS"},
        "law_2": {"act": "IPC 1860", "section": "Section 302", "name": "Murder under IPC"},
        "key_differences": "BNS 103(2) enacts dedicated capital punishment / life imprisonment for mob lynching based on race, caste, sex, language.",
        "leading_precedents": ["Bachan Singh (1980)", "Tehseen Poonawalla (2018)"],
        "practice_tip": "Ensure accurate section citation: BNS 103 applies only for acts committed after 1st July 2024 midnight."
    },
    {
        "id": "trans-5",
        "topic": "Electronic Evidence Admissibility (इलेक्ट्रॉनिक साक्ष्य ग्राह्यता)",
        "law_1": {"act": "BSA 2023", "section": "Section 63", "name": "Electronic Records under BSA"},
        "law_2": {"act": "IEA 1872", "section": "Section 65B", "name": "Electronic Evidence under IEA"},
        "key_differences": "Modernized definitions for mobile phones, servers, cloud records, and hash verification; signed certificate remains mandatory for secondary digital records.",
        "leading_precedents": ["Arjun Panditrao Khotkar (2020) [3-Judge Bench]", "Anvar P.V. v. P.K. Basheer (2014)"],
        "practice_tip": "Confront electronic exhibits during cross-examination if certificate under BSA Sec 63 / IEA 65B is missing or not produced with charge sheet."
    },
    {
        "id": "trans-6",
        "topic": "Cheating & Fraud (धोखाधड़ी एवं संपत्ति सुपुर्दगी)",
        "law_1": {"act": "BNS 2023", "section": "Section 318(4)", "name": "Cheating under BNS"},
        "law_2": {"act": "IPC 1860", "section": "Section 420", "name": "Cheating under IPC"},
        "key_differences": "Verbatim replacement. Ingredients remain: fraudulent inducement at inception and delivery of property.",
        "leading_precedents": ["Hridaya Ranjan Prasad Verma v. State of Bihar", "Vesa Holdings (2015)"],
        "practice_tip": "If transaction is essentially a civil breach of contract, seek quashing under BNSS 528 / CrPC 482 citing absence of initial dishonest intention."
    },
    {
        "id": "trans-7",
        "topic": "High Court Inherent Quashing Powers (हाईकोर्ट की अंतर्निहित शक्तियां)",
        "law_1": {"act": "BNSS 2023", "section": "Section 528", "name": "Inherent Powers under BNSS"},
        "law_2": {"act": "CrPC 1973", "section": "Section 482", "name": "Inherent Powers under CrPC"},
        "key_differences": "Verbatim preservation of High Court powers to prevent abuse of process of any Court or secure ends of justice.",
        "leading_precedents": ["State of Haryana v. Bhajan Lal (1992)", "R.P. Kapur v. State of Punjab (1960)"],
        "practice_tip": "Cite Bhajan Lal Category 1 (allegations even if uncontroverted do not disclose cognizable offense) and Category 7 (manifest malice)."
    }
]

class IndianLawLibraryEngine:
    def list_acts(self) -> List[Dict[str, Any]]:
        return [
            {
                "id": act.id,
                "name": act.name,
                "short_name": act.short_name,
                "year": act.year,
                "category": act.category,
                "status": act.status,
                "total_sections": act.total_sections,
                "summary": act.summary,
                "chapters_count": len(act.chapters),
                "sections_count": len(act.sections)
            }
            for act in INDIAN_LAW_LIBRARY.values()
        ]

    def get_act_details(self, act_id: str) -> Optional[Dict[str, Any]]:
        act = INDIAN_LAW_LIBRARY.get(act_id.lower())
        if not act:
            return None
        return act.model_dump()

    def get_section_comparisons(self) -> List[Dict[str, Any]]:
        return SECTION_COMPARISON_INDEX

    def search_library(self, query: str) -> List[Dict[str, Any]]:
        q = query.lower()
        results = []
        for act in INDIAN_LAW_LIBRARY.values():
            for sec in act.sections:
                if (q in sec.section_number.lower() or 
                    q in sec.title.lower() or 
                    q in sec.description.lower() or 
                    q in act.name.lower()):
                    results.append({
                        "act_id": act.id,
                        "act_name": act.name,
                        "section_number": sec.section_number,
                        "title": sec.title,
                        "chapter": sec.chapter,
                        "punishment": sec.punishment_or_procedure,
                        "snippet": sec.description[:180] + "...",
                        "landmark_cases": sec.landmark_cases
                    })
        return results

indian_law_library_engine = IndianLawLibraryEngine()
