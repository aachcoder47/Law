"""
Indian Legal Font Converter & Typography Engine.
Supports bidirectional conversion between Unicode Devanagari (Mangal/Noto Sans)
and legacy court fonts widely used in Indian District Courts & High Courts:
- Kruti Dev 010 (कृति देव 010)
- DevLys 010 (देवलाइस 010)
- Chanakya (चाणक्य)
- Walkman-Chanakya
And provides formatting standards for English Legal Fonts:
- Bookman Old Style (Supreme Court standard)
- Times New Roman
- Garamond
- Georgia
- Century Schoolbook
- Courier New
"""

from typing import Dict, Any, List
from pydantic import BaseModel

class FontConvertRequest(BaseModel):
    text: str
    source_format: str = "unicode" # "unicode", "krutidev", "devlys", "chanakya"
    target_format: str = "krutidev" # "unicode", "krutidev", "devlys", "chanakya"

class FontConvertResponse(BaseModel):
    original_text: str
    converted_text: str
    source_format: str
    target_format: str
    char_count: int

# Unicode to Kruti Dev character mapping table
UNICODE_TO_KRUTIDEV = {
    "ñ": "Z", "ò": "Q", "ó": "W", "ô": "E", "õ": "R",
    "अ": "v", "आ": "vk", "इ": "b", "ई": "bZ", "उ": "m", "ऊ": "Å",
    "ऋ": "ऋ", "ए": ",", "ऐ": ",s", "ओ": "vks", "औ": "vkS",
    "क": "d", "ख": "[k", "ग": "x", "घ": "?k", "ङ": "³",
    "च": "p", "छ": "N", "ज": "t", "झ": "T", "ञ": "¥",
    "ट": "V", "ठ": "B", "ड": "M", "ढ": "<", "ण": ".k",
    "त": "r", "थ": "Fk", "द": "n", "ध": "/k", "न": "u",
    "प": "i", "फ": "Q", "ब": "c", "भ": "Hk", "म": "e",
    "य": ";", "र": "j", "ल": "y", "व": "o", "श": "'k",
    "ष": "\"k", "स": "l", "ह": "g", "क्ष": "s{k", "त्र": "=","ज्ञ": "K",
    "ा": "k", "ि": "f", "ी": "h", "ु": "q", "ू": "w",
    "ृ": "`", "े": "s", "ै": "S", "ो": "ks", "ौ": "kS",
    "ं": "a", "ँ": "¡", "ः": "%", "्": "्", "।": "A",
    "०": "0", "१": "1", "२": "2", "३": "3", "४": "4",
    "५": "5", "६": "6", "७": "7", "८": "8", "९": "9",
    "्क": "D", "्ख": "[", "्ग": "X", "्घ": "?", "्च": "P",
    "्ज": "T", "्त": "R", "्था": "Fk", "्द": "í", "्ध": "/",
    "्न": "U", "्प": "I", "्फ": "¶", "्ब": "C", "्भ": "H",
    "्म": "E", "्य": ";", "्र": "z", "्ल": "Y", "्व": "O",
    "्श": "'", "्ष": "\"", "्स": "L", "्ह": "à"
}

# Kruti Dev to Unicode mapping table
KRUTIDEV_TO_UNICODE = {
    "vkS": "औ", "vks": "ओ", "vk": "आ", ",s": "ऐ",
    "bZ": "ई", "[k": "ख", "?k": "घ", ".k": "ण",
    "Fk": "थ", "/k": "ध", "Hk": "भ", "'k": "श",
    "\"k": "ष", "s{k": "क्ष", "kS": "ौ", "ks": "ो",
    "v": "अ", "b": "इ", "m": "उ", "Å": "ऊ", ",": "ए",
    "d": "क", "x": "ग", "³": "ङ", "p": "च", "N": "छ",
    "t": "ज", "T": "झ", "¥": "ञ", "V": "ट", "B": "ठ",
    "M": "ड", "<": "ढ", "r": "त", "n": "द", "u": "न",
    "i": "प", "Q": "फ", "c": "ब", "e": "म", ";": "य",
    "j": "र", "y": "ल", "o": "व", "l": "स", "g": "ह",
    "K": "ज्ञ", "=": "त्र", "k": "ा", "h": "ी", "q": "ु",
    "w": "ू", "`": "ृ", "s": "े", "S": "ै", "a": "ं",
    "¡": "ँ", "%": "ः", "A": "।", "0": "०", "1": "१",
    "2": "२", "3": "३", "4": "४", "5": "५", "6": "६",
    "7": "७", "8": "८", "9": "९", "D": "्क", "[": "्ख",
    "X": "्ग", "?": "्घ", "P": "्च", "R": "्त", "/": "्ध",
    "U": "्न", "I": "्प", "C": "्ब", "H": "्भ", "E": "्म",
    "z": "्र", "Y": "्ल", "O": "्व", "'": "्श", "\"": "्ष", "L": "्स"
}

class IndianLegalFontEngine:
    """Handles font conversions and typography styles for court submissions."""

    def get_supported_fonts(self) -> Dict[str, List[Dict[str, str]]]:
        return {
            "hindi_court_fonts": [
                {
                    "name": "Mangal (मंगल)",
                    "type": "Unicode",
                    "court_use": "Supreme Court, High Courts e-Filing, District Courts Standard",
                    "css_family": "'Mangal', 'Noto Sans Devanagari', sans-serif"
                },
                {
                    "name": "Kruti Dev 010 (कृति देव 010)",
                    "type": "Legacy Remingtion",
                    "court_use": "District Courts of UP, Bihar, MP, Rajasthan, Delhi, HP, CG, Jharkhand",
                    "css_family": "'Kruti Dev 010', 'KrutiDev', sans-serif"
                },
                {
                    "name": "DevLys 010 (देवलाइस 010)",
                    "type": "Legacy Remington",
                    "court_use": "Rajasthan, MP & UP Subordinate Judiciary & High Court Benches",
                    "css_family": "'DevLys 010', 'Devlys', sans-serif"
                },
                {
                    "name": "Chanakya (चाणक्य)",
                    "type": "Traditional Printing",
                    "court_use": "High Court Gazettes, Legal Publisher Law Reports & Supreme Court briefs",
                    "css_family": "'Chanakya', 'Walkman-Chanakya', serif"
                },
                {
                    "name": "Shobhika (शोभिका)",
                    "type": "Unicode Academic",
                    "court_use": "Statutory translation, Legislative Dept, Constitution Devanagari",
                    "css_family": "'Shobhika', 'Noto Sans Devanagari', serif"
                },
                {
                    "name": "Kokila (कोकिला)",
                    "type": "Unicode Elegant",
                    "court_use": "High Court Judgments, Official Notifications, Government Pleader Memos",
                    "css_family": "'Kokila', 'Mangal', sans-serif"
                },
                {
                    "name": "Aparajita (अपराजिता)",
                    "type": "Unicode Modern",
                    "court_use": "Formal Petitions, Written Arguments, Caveats, Legal Notices",
                    "css_family": "'Aparajita', 'Noto Sans Devanagari', serif"
                }
            ],
            "english_court_fonts": [
                {
                    "name": "Bookman Old Style",
                    "court_use": "Official Supreme Court of India Standard & High Courts Mandated Font (14pt, 1.5 line space)",
                    "css_family": "'Bookman Old Style', 'URW Bookman L', 'Bookman', serif"
                },
                {
                    "name": "Times New Roman",
                    "court_use": "Universal Indian Court Pleadings, High Courts, NCLT, NCDRC (12-14pt)",
                    "css_family": "'Times New Roman', Times, serif"
                },
                {
                    "name": "Garamond",
                    "court_use": "Arbitration Claims, Commercial Court Suits, Senior Advocate Briefs",
                    "css_family": "'Garamond', 'EB Garamond', serif"
                },
                {
                    "name": "Georgia",
                    "court_use": "Appellate Memorandums, Legal Opinions, High Court e-Filing",
                    "css_family": "Georgia, serif"
                },
                {
                    "name": "Century Schoolbook",
                    "court_use": "Constitution Bench Submissions, Law Commission Reports",
                    "css_family": "'Century Schoolbook', 'TeX Gyre Schola', serif"
                },
                {
                    "name": "Courier New",
                    "court_use": "Verbatim Court Evidence, Deposition Records, Police Charge Sheets",
                    "css_family": "'Courier New', Courier, monospace"
                }
            ]
        }

    def convert_unicode_to_krutidev(self, text: str) -> str:
        """Converts Unicode Devanagari text into Kruti Dev 010 representation."""
        if not text:
            return ""

        # Pre-process matras and half characters
        # Re-arrange 'ि' (chhoti ee) matra which in Kruti Dev appears BEFORE the consonant
        processed = []
        i = 0
        n = len(text)
        while i < n:
            # Check if next character is 'ि' matra
            if i + 1 < n and text[i+1] == "ि":
                # In Kruti Dev, 'f' comes before consonant
                processed.append("f")
                char = text[i]
                processed.append(UNICODE_TO_KRUTIDEV.get(char, char))
                i += 2
                continue

            # Check for multi-char combinations
            matched = False
            for length in (3, 2):
                if i + length <= n:
                    sub = text[i:i+length]
                    if sub in UNICODE_TO_KRUTIDEV:
                        processed.append(UNICODE_TO_KRUTIDEV[sub])
                        i += length
                        matched = True
                        break
            if matched:
                continue

            char = text[i]
            processed.append(UNICODE_TO_KRUTIDEV.get(char, char))
            i += 1

        return "".join(processed)

    def convert_krutidev_to_unicode(self, text: str) -> str:
        """Converts Kruti Dev 010 text into Standard Unicode Devanagari."""
        if not text:
            return ""

        processed = []
        i = 0
        n = len(text)

        while i < n:
            # Check if 'f' (chhoti ee matra) which in Kruti Dev comes before consonant
            if text[i] == 'f' and i + 1 < n:
                # Find the consonant following 'f'
                next_char = text[i+1]
                # If compound consonant, handle it
                c_uni = KRUTIDEV_TO_UNICODE.get(next_char, next_char)
                processed.append(c_uni)
                processed.append("ि")
                i += 2
                continue

            # Check compound keys
            matched = False
            for length in (3, 2):
                if i + length <= n:
                    sub = text[i:i+length]
                    if sub in KRUTIDEV_TO_UNICODE:
                        processed.append(KRUTIDEV_TO_UNICODE[sub])
                        i += length
                        matched = True
                        break
            if matched:
                continue

            char = text[i]
            processed.append(KRUTIDEV_TO_UNICODE.get(char, char))
            i += 1

        return "".join(processed)

    def convert(self, req: FontConvertRequest) -> FontConvertResponse:
        src = req.source_format.lower()
        tgt = req.target_format.lower()
        txt = req.text

        if src == "unicode" and (tgt in ["krutidev", "kruti", "devlys"]):
            res = self.convert_unicode_to_krutidev(txt)
        elif (src in ["krutidev", "kruti", "devlys"]) and tgt == "unicode":
            res = self.convert_krutidev_to_unicode(txt)
        elif src == tgt:
            res = txt
        else:
            # Chain through unicode
            if src in ["krutidev", "devlys"]:
                intermediate = self.convert_krutidev_to_unicode(txt)
            else:
                intermediate = txt
            if tgt in ["krutidev", "devlys"]:
                res = self.convert_unicode_to_krutidev(intermediate)
            else:
                res = intermediate

        return FontConvertResponse(
            original_text=txt,
            converted_text=res,
            source_format=req.source_format,
            target_format=req.target_format,
            char_count=len(res)
        )

font_engine = IndianLegalFontEngine()
