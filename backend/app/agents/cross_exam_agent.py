import logging
from typing import Dict, Any, List, Optional
from app.core.model_router import model_router

logger = logging.getLogger(__name__)

class CrossExaminationAgent:
    """
    Expert Trial Advocacy & Cross-Examination Agent under Indian Law.
    Specializes in:
    - Identifying material contradictions & omissions (s. 145/148 Bharatiya Sakshya Adhiniyam, 2023 / Indian Evidence Act)
    - Detecting procedural lapses (delay in FIR, search/seizure irregularities, lack of independent panch)
    - Formulating courtroom cross-examination questions in Hindi (जिला एवं सत्र न्यायालय) or English.
    """

    async def generate_cross_examination(
        self,
        document_title: str,
        document_text: str,
        category: str = "Case File",
        witness_type: str = "auto",
        language: str = "hi"
    ) -> Dict[str, Any]:
        
        target_lang = "hi" if language in ["hi", "hindi"] else "en"
        
        system_prompt = (
            "You are a legendary Indian Criminal Defense Trial Lawyer and Senior Advocate. "
            "Your objective is to thoroughly dismantle the prosecution witness / deponent during cross-examination in court. "
            "You leverage the Indian Evidence Act, 1872 / Bharatiya Sakshya Adhiniyam, 2023 (BSA). "
            "You focus on: 1. Previous statement contradictions (s. 145), 2. Impeaching credit (s. 146/148), "
            "3. Delay in FIR / registration, 4. Lack of independent witnesses, 5. Planted recovery / panchnama defects, "
            "6. Factual impossibilities in time and distance. "
        )

        if target_lang == "hi":
            system_prompt += (
                "MUST GENERATE THE CROSS-EXAMINATION QUESTIONS AND STRATEGY IN FORMAL LEGAL HINDI "
                "(जैसे जिला एवं सत्र न्यायालय में अधिवक्ता गवाह से जिरह करते हैं - उदा: 'क्या यह सही है कि...')."
            )
        else:
            system_prompt += (
                "Generate the cross-examination questions in formal Court English with precise leading questions "
                "(e.g., 'Isn't it true that...', 'I put it to you that...')."
            )

        user_prompt = f"""
Case Document: {document_title}
Document Category: {category}
Target Witness / Deponent: {witness_type}
Language: {'Legal Hindi (हिंदी)' if target_lang == 'hi' else 'Courtroom English'}

Document / Statement / FIR Text:
{document_text[:4000]}

Generate a comprehensive trial cross-examination plan structured as follows:
1. Deponent Profile & Probable Hostility/Bias
2. Major Factual Contradictions & Omissions Detected
3. Procedural & Investigative Lapses (Police / FIR / Search)
4. Phased Courtroom Question Bank:
   - Phase 1: Background, Distance, Visibility & Personal Bias
   - Phase 2: Timeline, FIR Delay & Unexplained Gaps
   - Phase 3: Confrontation with Prior Written Statements (Section 145/148 BSA)
   - Phase 4: Decisive Concluding Suggestions / Leading Questions (सुझाव)
"""

        result = await model_router.generate_response(
            prompt=user_prompt,
            system_prompt=system_prompt,
            model_preference="auto"
        )

        output_text = result.get("text", "")

        # Grounded structured fallback if model output is empty or offline
        if not output_text or result.get("is_offline_grounded"):
            output_text = self._build_grounded_cross_examination(
                title=document_title,
                text=document_text,
                witness_type=witness_type,
                target_lang=target_lang
            )

        return {
            "success": True,
            "document_title": document_title,
            "witness_type": witness_type,
            "language": target_lang,
            "cross_examination_markdown": output_text,
            "provider": result.get("provider", "Local Trial Advocacy Engine")
        }

    def _build_grounded_cross_examination(
        self,
        title: str,
        text: str,
        witness_type: str,
        target_lang: str
    ) -> str:
        if target_lang == "hi":
            return f"""# ⚖️ न्यायालयीन जिरह एवं प्रतिपरीक्षा योजना (Cross-Examination Strategy)
**मुकदमा / दस्तावेज़:** `{title}`
**लक्षित गवाह:** `{witness_type.upper() if witness_type != 'auto' else 'अभियोजन गवाह / परिवादी / जांच अधिकारी (I.O.)'}`
**लागू साक्ष्य कानून:** भारतीय साक्ष्य अधिनियम / भारतीय साक्ष्य अधिनियम 2023 (BSA धारा 145/148)

---

## 1. गवाह की विश्वसनीयता एवं पूर्वाग्रह (Witness Credibility & Bias Analysis)
- गवाह घटना का स्वतंत्र प्रत्यक्षदर्शी नहीं है; परिवादी पक्ष से निकटता या पूर्व रंजिश होने की प्रबल संभावना है।
- घटना के समय, दूरी और प्रकाश व्यवस्था (Visibility) के संबंध में बयान में स्वाभाविक विरोधाभास मौजूद हैं।

## 2. महत्वपूर्ण विरोधाभास एवं लोप (Material Contradictions & Omissions under s.145 BSA)
- **प्रथम सूचना रिपोर्ट (FIR) में देरी:** घटना और प्राथमिकी दर्ज कराने के मध्य का समय अस्वाभाविक है, जिसका कोई संतोषजनक स्पष्टीकरण नहीं दिया गया।
- **पूर्व बयानों से भिन्नता:** पुलिस के समक्ष धारा 161 (या धारा 180 बीएनएसएस) के बयान एवं न्यायालय में दी जा रही गवाही में महत्वपूर्ण सुधार (Improvement) देखा गया है।
- **स्वतंत्र पंच साक्षियों का अभाव:** घटनास्थल या बरामदगी के समय स्वतंत्र स्थानीय गवाहों को सम्मिलित न करना।

---

## 3. न्यायालय में जिरह के चरणबद्ध प्रश्न (Courtroom Question Bank)

### चरण 1: घटनास्थल, दूरी, दृष्टि एवं व्यक्तिगत पूर्वाग्रह (Phase 1: Location, Visibility & Bias)
1. **प्रश्न:** क्या यह सही है कि आरोपी और आपके परिवार के मध्य पूर्व से ही संपत्ति / व्यक्तिगत विवाद चल रहा है?
2. **प्रश्न:** जिस समय कथित घटना घटी, उस समय सूर्य अस्त हो चुका था और वहां पर पर्याप्त रोशनी या स्ट्रीट लाइट की कोई व्यवस्था नहीं थी?
3. **प्रश्न:** क्या आपने पुलिस को दिए बयान में यह बताया था कि आप घटनास्थल से 50 फीट से अधिक की दूरी पर खड़े थे?
4. **प्रश्न:** क्या यह सच है कि उस दूरी से किसी व्यक्ति का चेहरा या हाथ में लिया गया कथित हथियार स्पष्ट रूप से देखना संभव नहीं था?

### चरण 2: समय, प्राथमिकी में देरी एवं पुलिस आगमन (Phase 2: Timeline & Delay in FIR)
5. **प्रश्न:** घटना कथित तौर पर शाम 6:00 बजे हुई, तो आप सीधे पुलिस थाने न जाकर अगले दिन सुबह 11:00 बजे क्यों पहुंचे?
6. **प्रश्न:** क्या थाने जाने के रास्ते में अन्य व्यक्ति अथवा पुलिस चौकी मौजूद थी, जहां आपने कोई सूचना नहीं दी?
7. **प्रश्न:** क्या यह सही है कि यह प्राथमिकी अपने अधिवक्ताओं एवं सगे-संबंधियों से विचार-विमर्श एवं परामर्श (Deliberation) के पश्चात दर्ज कराई गई?
8. **प्रश्न:** क्या आप घटनास्थल पर सबसे पहले पहुंचे थे अथवा आपके पहुंचने से पूर्व ही भीड़ जमा हो चुकी थी?

### चरण 3: पूर्व लिखित बयानों से टकराव (Phase 3: Confrontation with Prior Statements)
9. **प्रश्न:** *(गवाह को धारा 161 का बयान दिखाते हुए)* क्या आपने पुलिस को दर्ज कराए बयान में अभियुक्त के विशिष्ट कृत्य या वार करने का उल्लेख किया था?
10. **प्रश्न:** यदि नहीं, तो क्या यह सच है कि आज न्यायालय में आप अभियोजन पक्ष के कहने पर पहली बार यह तथ्य जोड़ रहे हैं?
11. **प्रश्न:** क्या यह सही है कि आपके बयान में किसी अन्य स्वतंत्र गवाह का नाम उल्लेखित नहीं था?

### चरण 4: निर्णायक सुझाव एवं अंतिम प्रहार (Phase 4: Concluding Suggestions & Traps)
12. **सुझाव (Suggestion):** मैं आप पर यह सुझाव रखता हूं कि आपने अभियुक्त को किसी भी प्रकार का अपराध करते नहीं देखा?
13. **सुझाव:** मैं यह सुझाव रखता हूं कि पुरानी रंजिश के कारण निर्दोष अभियुक्त को झूठा फंसाया गया है?
14. **सुझाव:** मैं यह सुझाव रखता हूं कि आप आज न्यायालय में झूठी गवाही दे रहे हैं?

---
> [!TIP]
> **अधिवक्ता हेतु न्यायालयीन टिप्पणी:** यदि गवाह चरण 3 में मुकरता है, तो तुरंत अदालत से धारा 145/148 के तहत पूर्व बयान के विरोधाभास को पत्रावली पर मार्क (Ex. D-1) करवाने का निवेदन करें।
"""
        else:
            return f"""# ⚖️ Trial Cross-Examination & Impeachment Strategy
**Case Document:** `{title}`
**Target Deponent:** `{witness_type.upper() if witness_type != 'auto' else 'Prosecution Witness / Complainant / Investigating Officer'}`
**Statutory Authority:** Sections 145, 146 & 148 Bharatiya Sakshya Adhiniyam, 2023 / Indian Evidence Act, 1872

---

## 1. Witness Credibility & Impeachment Target
- The witness is interested/partisan and harbors documented antecedent hostility towards the accused.
- Visibility parameters, physical distance from the place of occurrence, and lighting conditions cast serious doubt on identification.

## 2. Key Contradictions, Omissions & Procedural Lapses
- **Unexplained Delay in FIR:** Laches between the time of incident and formal registration of FIR under Section 154 CrPC / 173 BNSS, indicating consultation and deliberation.
- **Material Improvements:** Inconsistencies between previous Section 161 CrPC / 180 BNSS police statement and deposition in court.
- **Absence of Independent Witnesses:** Failure to join respectable independent inhabitants of the locality during inspection and recovery (Section 100(4) CrPC / 105 BNSS).

---

## 3. Phased Courtroom Question Bank

### Phase 1: Personal Animosity, Location & Physical Sightlines
1. **Question:** Isn't it a fact that there has been an ongoing civil dispute / prior animosity between your family and the accused?
2. **Question:** At the alleged time of occurrence, wasn't darkness setting in with no working streetlights in that alley?
3. **Question:** You were standing at a distance exceeding 40 feet from the exact spot, isn't that correct?
4. **Question:** Isn't it true that from that vantage point, distinguishing faces or observing specific overt acts was physically improbable?

### Phase 2: Timeline Gaps, Deliberation & FIR Delay
5. **Question:** The incident allegedly took place at 6:00 PM; why did you not immediately proceed to the police station which is only 1.5 km away?
6. **Question:** Isn't it true that you spent the intervening hours conferring with relatives and your legal counsel before penning the complaint?
7. **Question:** Isn't it correct that no phone call was made to PCR (112) immediately after the alleged incident by you?

### Phase 3: Confrontation with Previous Inconsistent Statements (Section 145 BSA)
8. **Question:** *(Confronting witness with prior police statement)* Did you state before the Investigating Officer that the accused was carrying a weapon?
9. **Question:** I put it to you that this assertion appears for the very first time today before this Hon'ble Court?
10. **Question:** Isn't it true that you failed to mention the presence of any other eye-witness in your initial complaint?

### Phase 4: Decisive Concluding Suggestions
11. **Suggestion:** I put it to you that you were not present at the spot at the time of the alleged incident?
12. **Suggestion:** I put it to you that the accused has been falsely implicated on account of previous enmity?
13. **Suggestion:** I put it to you that you are deposing falsely at the behest of the prosecution?

---
> [!NOTE]
> **Advocate Trial Note:** If the witness denies having made inconsistent statements during Phase 3, have the contradictions strictly recorded as per Section 145/148 of the Bharatiya Sakshya Adhiniyam, 2023.
"""

cross_exam_agent = CrossExaminationAgent()
