"""
Pre-built Authoritative Indian Legal Drafting Templates (Bilingual: Hindi & English).
Format compliant with Supreme Court of India Rules, High Court Rules, and District Court Standard.
"""

from typing import Dict, Any, List
from pydantic import BaseModel

class LegalTemplate(BaseModel):
    id: str
    title: str
    title_hi: str
    category: str # Criminal, Civil, Constitutional, Commercial, General
    act_applicable: str
    language: str # "hi", "en", "bilingual"
    description: str
    placeholders: List[str]
    template_text: str

INDIAN_LEGAL_TEMPLATES: List[LegalTemplate] = [
    LegalTemplate(
        id="bail-anticipatory-bnss-482",
        title="Application for Anticipatory Bail under Section 482 BNSS (438 CrPC)",
        title_hi="धारा 482 बीएनएसएस (438 सीआरपीसी) के अंतर्गत अग्रिम जमानत प्रार्थना पत्र",
        category="Criminal",
        act_applicable="Bharatiya Nagarik Suraksha Sanhita, 2023 (Section 482) / Code of Criminal Procedure, 1973 (Section 438)",
        language="bilingual",
        description="Standard petition for pre-arrest bail in District & Sessions Court / High Court citing landmark precedents (Sushila Aggarwal v. State).",
        placeholders=[
            "COURT_NAME", "CASE_NUMBER", "APPLICANT_NAME", "APPLICANT_PARENTAGE",
            "APPLICANT_ADDRESS", "POLICE_STATION", "FIR_NUMBER", "FIR_DATE",
            "OFFENCES_SECTIONS", "COUNSEL_NAME"
        ],
        template_text="""IN THE COURT OF THE SESSIONS JUDGE AT {{COURT_NAME}}
CRIMINAL MISC. ANTICIPATORY BAIL APPLICATION NO. _____ OF 2026

IN THE MATTER OF:
{{APPLICANT_NAME}}
S/o / D/o / W/o {{APPLICANT_PARENTAGE}}
R/o {{APPLICANT_ADDRESS}}
                                                            ... APPLICANT / ACCUSED
                                 VERSUS
STATE (GOVT. OF NCT / STATE OF ________)
Through Station House Officer,
Police Station: {{POLICE_STATION}}
                                                            ... RESPONDENT / PROSECUTION

FIR NO.: {{FIR_NUMBER}}
DATED: {{FIR_DATE}}
UNDER SECTIONS: {{OFFENCES_SECTIONS}} (Bharatiya Nyaya Sanhita, 2023 / IPC)
POLICE STATION: {{POLICE_STATION}}

APPLICATION UNDER SECTION 482 OF THE BHARATIYA NAGARIK SURAKSHA SANHITA, 2023
(CORRESPONDING TO SECTION 438 OF CODE OF CRIMINAL PROCEDURE, 1973)
FOR GRANT OF ANTICIPATORY BAIL ON BEHALF OF THE APPLICANT.

MOST RESPECTFULLY SHOWETH:

1. That the Applicant is a law-abiding citizen of India, having deep roots in society, residing permanently at the above-mentioned address, and has never been previously convicted in any criminal offence.

2. That the present FIR No. {{FIR_NUMBER}} has been registered against the Applicant at Police Station {{POLICE_STATION}} with mala fide intention, ulterior motive, and at the behest of interested persons to harass and humiliate the Applicant.

3. That a bare perusal of the allegations contained in the FIR discloses that no prima facie cognizable offence is made out against the Applicant. The allegations are vague, omnibus, and lack specific overt acts attributed to the Applicant.

4. That the Applicant is ready and willing to join the investigation as and when directed by the Investigating Officer and undertakes not to tamper with any prosecution evidence or intimidate any witnesses.

5. That the Applicant places reliance upon the Constitution Bench judgment of the Hon'ble Supreme Court in 'Sushila Aggarwal & Ors. v. State (NCT of Delhi) & Anr.' (2020) 5 SCC 1, wherein it was categorically held that anticipatory bail once granted should not ordinarily be limited to a fixed time frame and personal liberty under Article 21 of the Constitution must be safeguarded against arbitrary arrest.

6. That the custodial interrogation of the Applicant is neither warranted nor necessary in the facts and circumstances of the case, and recovery, if any, can be effected without custodial confinement.

7. That no other similar bail application has been filed or is pending before this Hon'ble Court or any other Court.

PRAYER:
In the light of the facts and circumstances stated hereinabove, it is most respectfully prayed that this Hon'ble Court may be pleased to:
(a) Direct the Investigating Officer / Arresting Officer that in the event of arrest of the Applicant in connection with FIR No. {{FIR_NUMBER}} registered at P.S. {{POLICE_STATION}}, the Applicant be released on anticipatory bail on such terms and conditions as this Hon'ble Court may deem fit;
(b) Grant ad-interim protection from arrest during the pendency of the present application;
(c) Pass any such other or further order(s) as this Hon'ble Court may deem fit and proper in the interest of justice.

APPLICANT
THROUGH COUNSEL: {{COUNSEL_NAME}}, Advocate
Place:
Date:

VERIFICATION:
I, the Applicant above-named, do hereby verify that the contents of paragraphs 1 to 7 of the accompanying application are true and correct to my knowledge and belief.
Verified at ________ on this ___ day of ________, 2026.
DEPONENT
"""
    ),
    LegalTemplate(
        id="bail-anticipatory-hi",
        title="अग्रिम जमानत प्रार्थना पत्र (धारा 482 बीएनएसएस / 438 सीआरपीसी)",
        title_hi="अग्रिम जमानत प्रार्थना पत्र (हिंदी प्रारूप - जिला एवं सत्र न्यायालय)",
        category="Criminal",
        act_applicable="भारतीय नागरिक सुरक्षा संहिता, 2023 (धारा 482) / दंड प्रक्रिया संहिता, 1973 (धारा 438)",
        language="hi",
        description="हिंदी भाषा में जिला एवं सत्र न्यायालय हेतु पूर्ण विधिक प्रारूप (सुप्रीम कोर्ट नज़ीर सहित)।",
        placeholders=[
            "COURT_NAME", "APPLICANT_NAME", "APPLICANT_PARENTAGE", "APPLICANT_ADDRESS",
            "POLICE_STATION", "FIR_NUMBER", "FIR_DATE", "OFFENCES_SECTIONS", "COUNSEL_NAME"
        ],
        template_text="""न्यायालय श्रीमान जिला एवं सत्र न्यायाधीश महोदय, {{COURT_NAME}}
प्रकीर्ण आपराधिक अग्रिम जमानत आवेदन संख्या: _____ / 2026

प्रार्थी / अभियुक्त:
{{APPLICANT_NAME}}
पुत्र / पुत्री / पत्नी: {{APPLICANT_PARENTAGE}}
निवासी: {{APPLICANT_ADDRESS}}
                                                            ... प्रार्थी
बनाम
राज्य (राजस्थान / उत्तर प्रदेश / दिल्ली शासन)
द्वारा: थानाधिकारी, पुलिस थाना: {{POLICE_STATION}}
                                                            ... विपक्षी / अभियोजन

प्रथम सूचना रिपोर्ट (FIR) संख्या: {{FIR_NUMBER}}
दिनांक: {{FIR_DATE}}
धाराएं: {{OFFENCES_SECTIONS}} (भारतीय न्याय संहिता 2023 / भा.दं.सं.)
पुलिस थाना: {{POLICE_STATION}}

प्रार्थना पत्र अंतर्गत धारा 482 भारतीय नागरिक सुरक्षा संहिता, 2023
(पूर्ववर्ती धारा 438 दंड प्रक्रिया संहिता, 1973)
वास्ते प्रदान किए जाने अग्रिम जमानत प्रार्थी।

माननीय न्यायालय,
प्रार्थी की ओर से सविनय निवेदन निम्न प्रकार है:

1. यह कि प्रार्थी एक शांतिप्रिय, सम्मानित एवं कानून का पालन करने वाला नागरिक है तथा समाज में प्रार्थी की प्रतिष्ठा है। प्रार्थी का कोई पूर्व आपराधिक इतिहास नहीं है।

2. यह कि विपक्षी पुलिस थाना द्वारा प्रार्थी के विरुद्ध दुर्भावनापूर्ण तरीके से एवं रंजिशन उपरोक्त प्रथम सूचना रिपोर्ट (FIR) दर्ज की गई है, जिसमें लगाए गए समस्त आरोप पूर्णतः असत्य, मनगढ़ंत एवं निराधार हैं।

3. यह कि प्रार्थी ने कोई संज्ञेय अपराध कारित नहीं किया है। मामले में प्रार्थी की कस्टोडियल पूछताछ अथवा गिरफ्तारी की कोई विधिक आवश्यकता नहीं है।

4. यह कि प्रार्थी अनुसंधान में पुलिस का पूर्ण सहयोग करने को तत्पर है तथा न्यायालय द्वारा अधिरोपित समस्त शर्तों का पालन करने का वचन देता है।

5. यह कि माननीय सर्वोच्च न्यायालय द्वारा 'सुशीला अग्रवाल बनाम राज्य' (2020) 5 SCC 1 में प्रतिपादित सिद्धांतों के अनुसार व्यक्तिगत स्वतंत्रता के अधिकार की रक्षा हेतु प्रार्थी अग्रिम जमानत का पूर्ण अधिकारी है।

6. यह कि इस बाबत अन्य कोई अग्रिम जमानत प्रार्थना पत्र किसी अन्य न्यायालय में प्रस्तुत अथवा लंबित नहीं है।

प्रार्थना:
अतः श्रीमान जी से विनम्र प्रार्थना है कि प्रार्थी का अग्रिम जमानत प्रार्थना पत्र स्वीकार फरमाकर, पुलिस थाना {{POLICE_STATION}} की एफ.आई.आर. संख्या {{FIR_NUMBER}} में प्रार्थी को गिरफ्तार किए जाने की दशा में उचित मुचलके पर रिहा किए जाने का आदेश पारित फरमाएं।

प्रार्थी
द्वारा अधिवक्ता: {{COUNSEL_NAME}}
स्थान:
दिनांक:

शपथ पत्र / तसदीक:
मैं, उपरोक्त प्रार्थी, सत्यनिष्ठा से तसदीक करता हूँ कि उक्त प्रार्थना पत्र के पैरा संख्या 1 से 6 तक का मजमून मेरे निजी ज्ञान एवं विश्वास में सत्य व सही है।
तसदीककर्ता
"""
    ),
    LegalTemplate(
        id="cheque-bounce-138-ni-act",
        title="Criminal Complaint under Section 138 Negotiable Instruments Act, 1881",
        title_hi="धारा 138 परक्राम्य लिखत अधिनियम के अंतर्गत चेक बाउंस परिवाद",
        category="Commercial",
        act_applicable="Negotiable Instruments Act, 1881 (Section 138 & 142) read with BNSS 2023 / CrPC",
        language="en",
        description="Court-ready criminal complaint for cheque dishonour with legal notice and bank return memo details.",
        placeholders=[
            "COURT_NAME", "COMPLAINANT_NAME", "COMPLAINANT_ADDRESS", "ACCUSED_NAME",
            "ACCUSED_ADDRESS", "CHEQUE_NUMBER", "CHEQUE_DATE", "CHEQUE_AMOUNT",
            "BANK_NAME", "MEMO_DATE", "NOTICE_DATE", "POSTAL_RECEIPT_DATE", "COUNSEL_NAME"
        ],
        template_text="""IN THE COURT OF THE METROPOLITAN MAGISTRATE / JUDICIAL MAGISTRATE FIRST CLASS
AT {{COURT_NAME}}
CRIMINAL COMPLAINT NO. _____ OF 2026

IN THE MATTER OF:
{{COMPLAINANT_NAME}}
R/o {{COMPLAINANT_ADDRESS}}
                                                            ... COMPLAINANT
                                 VERSUS
{{ACCUSED_NAME}}
R/o {{ACCUSED_ADDRESS}}
                                                            ... ACCUSED

COMPLAINT UNDER SECTION 138 READ WITH SECTION 142 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881
FOR DISHONOUR OF CHEQUE BEARING NO. {{CHEQUE_NUMBER}} DATED {{CHEQUE_DATE}} FOR ₹{{CHEQUE_AMOUNT}}/-.

MOST RESPECTFULLY SHOWETH:

1. That the Complainant and the Accused had business/personal dealings, in discharge of which the Accused had a legally enforceable debt/liability towards the Complainant amounting to ₹{{CHEQUE_AMOUNT}}/-.

2. That in partial/full discharge of the said existing legal debt, the Accused issued Cheque No. {{CHEQUE_NUMBER}} dated {{CHEQUE_DATE}} drawn on {{BANK_NAME}} for an amount of ₹{{CHEQUE_AMOUNT}}/- with an assurance that the same would be duly honoured on presentation.

3. That the Complainant presented the said cheque for encashment through their banker, but the same was returned unpaid/dishonoured by the bank vide Return Memo dated {{MEMO_DATE}} with the remarks "Funds Insufficient" / "Account Closed".

4. That within 30 days of receipt of the bank return memo, the Complainant issued a statutory Statutory Legal Notice of Demand dated {{NOTICE_DATE}} through Registered Post / Speed Post to the Accused demanding payment of the cheque amount within 15 days of receipt.

5. That despite receipt/service of the legal demand notice, the Accused has failed to pay the said cheque amount within the statutory period of 15 days, thereby committing an offence punishable under Section 138 of the Negotiable Instruments Act, 1881.

6. That the present complaint is filed within the limitation period prescribed under Section 142 of the Negotiable Instruments Act before this Hon'ble Court within whose territorial jurisdiction the drawee bank is located.

PRAYER:
It is therefore most respectfully prayed that this Hon'ble Court may be pleased to:
(a) Summon, try, and punish the Accused under Section 138 of the Negotiable Instruments Act, 1881;
(b) Award compensation to the Complainant under Section 357(3) CrPC / Section 143A NI Act to the extent of double the cheque amount;
(c) Pass such other or further orders as this Hon'ble Court may deem fit.

COMPLAINANT
THROUGH COUNSEL: {{COUNSEL_NAME}}, Advocate
"""
    ),
    LegalTemplate(
        id="legal-notice-recovery",
        title="Statutory Legal Notice for Recovery of Outstanding Dues / Breach of Contract",
        title_hi="बकाया राशि वसूली एवं अनुबंध उल्लंघन हेतु विधिक नोटिस (Legal Notice)",
        category="Civil",
        act_applicable="Indian Contract Act, 1872 & Code of Civil Procedure, 1908",
        language="bilingual",
        description="Formal Advocate legal demand notice with 15-day compliance deadline before institution of suit.",
        placeholders=[
            "ADVOCATE_NAME", "ADVOCATE_OFFICE_ADDRESS", "NOTICE_DATE", "CLIENT_NAME",
            "RECIPIENT_NAME", "RECIPIENT_ADDRESS", "PRINCIPAL_AMOUNT", "INTEREST_RATE", "INVOICE_DETAILS"
        ],
        template_text="""SPEED POST / REGISTERED A.D. / EMAIL

LEGAL NOTICE OF DEMAND

FROM:
{{ADVOCATE_NAME}}, Advocate
{{ADVOCATE_OFFICE_ADDRESS}}
Date: {{NOTICE_DATE}}

TO:
{{RECIPIENT_NAME}}
{{RECIPIENT_ADDRESS}}

SUBJECT: LEGAL NOTICE FOR PAYMENT OF OUTSTANDING SUM OF ₹{{PRINCIPAL_AMOUNT}}/- ALONG WITH ACCRUED INTEREST @ {{INTEREST_RATE}}% P.A.

Sir/Madam,

Under instructions from and on behalf of my client {{CLIENT_NAME}}, I hereby serve upon you this Statutory Legal Notice:

1. That my Client had provided services / goods / financial accommodation to you as per agreed terms, against which invoices/agreements bearing details {{INVOICE_DETAILS}} were raised.

2. That the principal sum of ₹{{PRINCIPAL_AMOUNT}}/- became due and payable by you to my Client upon delivery and receipt of the said goods/services.

3. That despite repeated verbal reminders and written communications, you have deliberately failed and neglected to clear the outstanding dues, causing wrongful financial loss to my Client and unjust enrichment to yourself.

4. That by withholding the legitimate dues of my Client, you have committed a willful breach of contractual obligations under the Indian Contract Act, 1872.

NOW THEREFORE, I hereby call upon you through this Legal Notice to pay the total outstanding amount of ₹{{PRINCIPAL_AMOUNT}}/- along with interest @ {{INTEREST_RATE}}% per annum from the due date until realization, together with ₹5,500/- towards legal notice charges, within FIFTEEN (15) DAYS from the date of receipt of this notice.

PLEASE TAKE NOTE that in the event of your failure to comply with the aforesaid demand within the stipulated period of 15 days, my Client has given me peremptory instructions to institute civil and/or criminal proceedings against you before the competent Court of Law for recovery of dues, damages, and costs entirely at your risk and consequence.

Copy retained in my office for future legal reference.

{{ADVOCATE_NAME}}
Advocate
Counsel for the Claimant
"""
    ),
    LegalTemplate(
        id="written-statement-cpc",
        title="Written Statement under Order VIII Rule 1 CPC",
        title_hi="जवाब दावा (लिखित कथन) - आदेश 8 नियम 1 सिविल प्रक्रिया संहिता",
        category="Civil",
        act_applicable="Code of Civil Procedure, 1908 (Order VIII)",
        language="en",
        description="Standard civil written statement including preliminary objections, parawise reply, and verification.",
        placeholders=[
            "COURT_NAME", "SUIT_NUMBER", "PLAINTIFF_NAME", "DEFENDANT_NAME",
            "DEFENDANT_ADDRESS", "COUNSEL_NAME"
        ],
        template_text="""IN THE COURT OF THE CIVIL JUDGE (SENIOR DIVISION) AT {{COURT_NAME}}
CIVIL SUIT NO. _____ OF 2026

IN THE MATTER OF:
{{PLAINTIFF_NAME}}
                                                            ... PLAINTIFF
                                 VERSUS
{{DEFENDANT_NAME}}
R/o {{DEFENDANT_ADDRESS}}
                                                            ... DEFENDANT

WRITTEN STATEMENT ON BEHALF OF THE DEFENDANT UNDER ORDER VIII RULE 1
READ WITH SECTION 151 OF THE CODE OF CIVIL PROCEDURE, 1908.

MOST RESPECTFULLY SHOWETH:

PRELIMINARY OBJECTIONS:
1. That the present suit is not maintainable either on facts or in law and is liable to be rejected under Order VII Rule 11 CPC as it discloses no cause of action against the Defendant.
2. That the Plaintiff has concealed material facts from this Hon'ble Court and has not approached the Court with clean hands.
3. That the suit is barred by limitation under the Limitation Act, 1963 and is improperly valued for the purposes of court fee and jurisdiction.

REPLY ON MERITS (PARA-WISE):
1. That the contents of Paragraph 1 of the Plaint are matters of record and need no reply, save and except what is specifically admitted herein.
2. That the contents of Paragraph 2 of the Plaint are false, frivolous, and categorically denied. It is submitted that the Defendant never entered into the alleged transaction in the manner projected by the Plaintiff.
3. That the contents of Paragraphs 3 to 6 of the Plaint are wrong and vehemently denied. The Plaintiff is put to strict proof thereof.

PRAYER:
It is, therefore, most respectfully prayed that this Hon'ble Court may graciously be pleased to:
(a) Dismiss the suit of the Plaintiff with exemplary costs under Section 35A CPC;
(b) Pass any other order(s) as this Hon'ble Court may deem fit and proper in the interest of justice.

DEFENDANT
THROUGH COUNSEL: {{COUNSEL_NAME}}, Advocate

VERIFICATION:
I, {{DEFENDANT_NAME}}, the Defendant above-named, do hereby verify that the contents of preliminary objections and reply on merits are true and correct to my personal knowledge.
Verified at _______ on this ___ day of ________, 2026.
DEPONENT
"""
    ),
    LegalTemplate(
        id="writ-petition-226-hc",
        title="Writ Petition (Civil / Criminal) under Article 226 of the Constitution of India",
        title_hi="अनुच्छेद 226 भारत का संविधान - रिट याचिका (हाई कोर्ट)",
        category="Constitutional",
        act_applicable="Constitution of India (Article 226)",
        language="en",
        description="High Court Writ Petition format for Mandamus / Certiorari / Quashing with statement of facts, grounds, and prayers.",
        placeholders=[
            "HIGH_COURT_NAME", "PETITIONER_NAME", "PETITIONER_ADDRESS",
            "RESPONDENT_DEPT", "COUNSEL_NAME", "IMPUNED_ORDER_DATE"
        ],
        template_text="""IN THE HIGH COURT OF JUDICATURE AT {{HIGH_COURT_NAME}}
(EXTRAORDINARY WRIT JURISDICTION)
WRIT PETITION (CIVIL / CRIMINAL) NO. _____ OF 2026

IN THE MATTER OF:
{{PETITIONER_NAME}}
R/o {{PETITIONER_ADDRESS}}
                                                            ... PETITIONER
                                 VERSUS
1. STATE OF ____________
2. {{RESPONDENT_DEPT}}
                                                            ... RESPONDENTS

PETITION UNDER ARTICLE 226 OF THE CONSTITUTION OF INDIA FOR ISSUANCE OF A WRIT IN THE NATURE OF CERTIORARI / MANDAMUS OR ANY OTHER APPROPRIATE WRIT, ORDER, OR DIRECTION.

TO,
THE HON'BLE THE CHIEF JUSTICE AND HIS COMPANION JUSTICES OF THE HON'BLE HIGH COURT.

THE HUMBLE PETITION OF THE PETITIONER ABOVENAMED MOST RESPECTFULLY SHOWETH:

1. That the Petitioner is a citizen of India and invokes the extraordinary constitutional jurisdiction of this Hon'ble Court to redress the arbitrary and illegal action of the Respondents.

2. QUESTIONS OF LAW:
A. Whether the impugned order / action dated {{IMPUNED_ORDER_DATE}} is violative of Articles 14, 19, and 21 of the Constitution of India?
B. Whether the Respondent authorities acted in gross breach of the principles of natural justice?

3. GROUNDS:
I. Because the impugned action is wholly without jurisdiction and contrary to statutory mandates.
II. Because the Petitioner has no other efficacious alternative remedy available under law.

PRAYER:
In the premises, it is respectfully prayed that this Hon'ble Court may be pleased to:
(i) Issue a Writ of Certiorari or any other appropriate writ quashing the impugned order dated {{IMPUNED_ORDER_DATE}};
(ii) Issue a Writ of Mandamus directing the Respondents to grant the consequential relief;
(iii) Pass such other and further orders as may be deemed fit and proper.

PETITIONER
THROUGH COUNSEL: {{COUNSEL_NAME}}, Advocate
"""
    ),
    LegalTemplate(
        id="affidavit-standard",
        title="General Affidavit with Court Verification Clause",
        title_hi="सामान्य शपथ पत्र (Affidavit) - सत्यापन खंड सहित",
        category="General",
        act_applicable="Oaths Act, 1969 & Code of Civil Procedure / BNSS",
        language="bilingual",
        description="Standard sworn affidavit format for judicial filings, interlocutory applications, and registry compliance.",
        placeholders=[
            "COURT_NAME", "CASE_TITLE", "DEPONENT_NAME", "DEPONENT_AGE", "DEPONENT_PARENTAGE", "DEPONENT_ADDRESS"
        ],
        template_text="""BEFORE THE HON'BLE COURT AT {{COURT_NAME}}
IN THE MATTER OF: {{CASE_TITLE}}

AFFIDAVIT

I, {{DEPONENT_NAME}}, Aged about {{DEPONENT_AGE}} years,
S/o / D/o / W/o {{DEPONENT_PARENTAGE}},
Resident of {{DEPONENT_ADDRESS}},
do hereby solemnly affirm and declare on oath as under:

1. That I am the Applicant / Petitioner / Deponent in the accompanying application and am fully conversant with the facts and circumstances of the case, and as such competent to swear this affidavit.

2. That the contents of the accompanying Application / Petition have been drafted under my instructions and the contents thereof have been read over and explained to me in vernacular, which I admit to be true and correct.

3. That the annexures attached with the application are true copies of their respective originals.

                                                                DEPONENT

VERIFICATION:
I, the above-named Deponent, do hereby verify on oath that the contents of paragraphs 1 to 3 of the above affidavit are true and correct to the best of my knowledge and belief. No part of it is false and nothing material has been concealed therefrom.
Verified at ________ on this ___ day of ________, 2026.

                                                                DEPONENT
"""
    )
]

class IndianLegalDraftingEngine:
    """Provides template retrieval and auto-fill capabilities for court submissions."""

    def get_all_templates(self) -> List[Dict[str, Any]]:
        return [t.model_dump() for t in INDIAN_LEGAL_TEMPLATES]

    def get_template_by_id(self, template_id: str) -> Dict[str, Any]:
        tpl = next((t for t in INDIAN_LEGAL_TEMPLATES if t.id == template_id), INDIAN_LEGAL_TEMPLATES[0])
        return tpl.model_dump()

    def fill_template(self, template_id: str, values: Dict[str, str]) -> str:
        tpl = next((t for t in INDIAN_LEGAL_TEMPLATES if t.id == template_id), INDIAN_LEGAL_TEMPLATES[0])
        text = tpl.template_text
        for k, v in values.items():
            placeholder = "{{" + k + "}}"
            text = text.replace(placeholder, v)
        return text

drafting_engine = IndianLegalDraftingEngine()
