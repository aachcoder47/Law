import os
import io
import uuid
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

from app.connectors.base import BaseLegalConnector, LegalDocument, LegalSourceType, AuthorityLevel

logger = logging.getLogger(__name__)

try:
    import pypdf
except ImportError:
    pypdf = None

class UploadedDocMeta(BaseModel):
    id: str
    filename: str
    title: str
    category: str  # "Statute", "Guideline", "Judgment_SC", "Judgment_HC", "Judgment_District", "Case File", "Charge Sheet", "FIR", "MLC Medical"
    case_name: Optional[str] = "General Case"
    language: str  # "en", "hi", "auto"
    file_size_bytes: int
    file_size_formatted: Optional[str] = "1 KB"
    page_count: Optional[int] = 1
    upload_date: str
    word_count: int
    content: str
    snippet: str
    citation: str


class UserDocumentConnector(BaseLegalConnector):
    name: str = "Uploaded Laws & Case Documents"
    source_type: LegalSourceType = LegalSourceType.COMMENTARY

    def __init__(self, upload_dir: str = "uploads"):
        self.upload_dir = upload_dir
        self.documents: Dict[str, UploadedDocMeta] = {}
        os.makedirs(self.upload_dir, exist_ok=True)
        self._load_stored_documents()

    def _load_stored_documents(self):
        """Loads metadata for sample and stored files."""
        if not self.documents:
            sample_id = "user-doc-bns-2023"
            self.documents[sample_id] = UploadedDocMeta(
                id=sample_id,
                filename="BNS_2023_Section_111_Organized_Crime.txt",
                title="Bharatiya Nyaya Sanhita 2023 - Section 111 (Organized Crime)",
                category="Statute",
                language="en",
                file_size_bytes=1420,
                file_size_formatted="1.4 KB",
                page_count=2,
                upload_date=datetime.now().strftime("%Y-%m-%d %H:%M"),
                word_count=210,
                content=(
                    "Bharatiya Nyaya Sanhita, 2023 (Act No. 45 of 2023)\n"
                    "Section 111. Organized crime.\n"
                    "(1) Any continuing unlawful activity including kidnapping, robbery, vehicle theft, extortion, "
                    "land grabbing, contract killing, economic offences, cyber-crimes, trafficking of persons or drugs, "
                    "by any person singly or jointly, either as a member of an organized crime syndicate or on behalf of "
                    "such syndicate, by use of violence, threat of violence, intimidation, coercion, or other unlawful means "
                    "to obtain direct or indirect material benefit, including financial gain, shall constitute organized crime.\n"
                    "(2) Whoever commits organized crime shall,— (a) if such offence has resulted in the death of any person, "
                    "be punishable with death or imprisonment for life, and shall also be liable to fine which shall not be less than five lakh rupees."
                ),
                snippet="Section 111 Bharatiya Nyaya Sanhita 2023: Definition and punishment for organized crime including syndicate offences.",
                citation="BNS 2023 Sec. 111"
            )

            # Sample Hindi District Court Order
            sample_hi_id = "user-doc-district-court-bail-hi"
            self.documents[sample_hi_id] = UploadedDocMeta(
                id=sample_hi_id,
                filename="District_Court_Jaipur_Bail_Order.txt",
                title="जिला एवं सत्र न्यायालय जयपुर - अग्रिम जमानत आदेश (धारा 482 बीएनएसएस)",
                category="Judgment_District",
                language="hi",
                file_size_bytes=1850,
                file_size_formatted="1.8 KB",
                page_count=3,
                upload_date=datetime.now().strftime("%Y-%m-%d %H:%M"),
                word_count=280,
                content=(
                    "न्यायालय जिला एवं सत्र न्यायाधीश, जयपुर महानगर\n"
                    "प्रकीर्ण आपराधिक अग्रिम जमानत आवेदन संख्या: 412/2024\n"
                    "प्रार्थी: रामेश्वर शर्मा बनाम राज्य (राजस्थान)\n"
                    "धारा: भारतीय नागरिक सुरक्षा संहिता 2023 की धारा 482 (पूर्व में धारा 438 सीआरपीसी)\n"
                    "आदेश दिनांक: 12 अगस्त 2024\n\n"
                    "आदेश:\n"
                    "प्रार्थी के विद्वान अधिवक्ता एवं लोक अभियोजक के तर्कों का अनुशीलन किया गया। "
                    "प्रकरण के तथ्यों एवं परिस्थितियों तथा सर्वोच्च न्यायालय के सुशीला अग्रवाल बनाम राज्य फैसले के आलोक में, "
                    "प्रार्थी को गिरफ़्तारी की स्थिति में रु. 50,000/- के व्यक्तिगत बंधपत्र पर अंतरिम अग्रिम जमानत दी जाती है। "
                    "प्रार्थी अनुसंधानाधिकारी के समक्ष आवश्यकतानुसार उपस्थित होकर जांच में सहयोग करेगा।"
                ),
                snippet="जिला एवं सत्र न्यायालय जयपुर: धारा 482 बीएनएसएस के तहत प्रार्थी को अंतरिम अग्रिम जमानत स्वीकृत।",
                citation="Dist. Ct. Jaipur Misc. Bail 412/2024"
            )

    def extract_text_from_bytes(self, file_bytes: bytes, filename: str) -> tuple[str, int]:
        """
        Extracts plain text from PDF or TXT bytes with high-capacity processing (supports 100MB+ files)
        and Hindi/Devanagari UTF-8 support. Returns (extracted_text, page_count).
        """
        ext = filename.lower().split('.')[-1]
        text = ""
        page_count = 1

        if ext == "pdf":
            if pypdf:
                try:
                    pdf_reader = pypdf.PdfReader(io.BytesIO(file_bytes), strict=False)
                    page_count = len(pdf_reader.pages)
                    extracted_pages = []
                    for idx, page in enumerate(pdf_reader.pages):
                        try:
                            page_text = page.extract_text()
                            if page_text:
                                extracted_pages.append(f"--- [Page {idx+1}] ---\n{page_text}")
                        except Exception as pe:
                            logger.warning(f"Error extracting page {idx+1}: {pe}")
                    text = "\n\n".join(extracted_pages)
                except Exception as e:
                    logger.error(f"Error parsing PDF with pypdf: {e}")

            if not text.strip():
                # Fallback decoding
                for encoding in ['utf-8', 'latin-1', 'cp1252', 'utf-16']:
                    try:
                        text = file_bytes.decode(encoding, errors='ignore')
                        if len(text.strip()) > 50:
                            break
                    except Exception:
                        pass
        else:
            # TXT / CSV / Markdown / DOC text
            for encoding in ['utf-8', 'latin-1', 'cp1252']:
                try:
                    text = file_bytes.decode(encoding)
                    break
                except UnicodeDecodeError:
                    continue

        return text.strip(), page_count

    def detect_language(self, text: str) -> str:
        """Language detector for Hindi (Devanagari script check) vs English."""
        devanagari_chars = sum(1 for char in text if '\u0900' <= char <= '\u097F')
        if devanagari_chars > 20 or (len(text) > 0 and (devanagari_chars / len(text)) > 0.08):
            return "hi"
        return "en"

    def format_size(self, size_bytes: int) -> str:
        if size_bytes < 1024:
            return f"{size_bytes} B"
        elif size_bytes < 1024 * 1024:
            return f"{size_bytes / 1024:.1f} KB"
        else:
            return f"{size_bytes / (1024 * 1024):.1f} MB"

    def add_document(self, filename: str, file_bytes: bytes, category: str = "Statute", language_override: str = "auto", case_name: str = "General Case") -> UploadedDocMeta:
        doc_id = f"doc-{uuid.uuid4().hex[:8]}"
        content, page_count = self.extract_text_from_bytes(file_bytes, filename)
        if not content:
            content = f"Uploaded document: {filename} (Content indexed, length: {len(file_bytes)} bytes)."

        detected_lang = self.detect_language(content) if language_override == "auto" else language_override
        words = content.split()
        word_count = len(words)
        snippet = " ".join(words[:45]) + "..." if word_count > 45 else content

        # Save file to upload directory
        save_path = os.path.join(self.upload_dir, f"{doc_id}_{filename}")
        try:
            with open(save_path, "wb") as f:
                f.write(file_bytes)
        except Exception as e:
            logger.error(f"Failed to write uploaded file to disk: {e}")

        # Clean title
        title = os.path.splitext(filename)[0].replace('_', ' ').replace('-', ' ').title()
        citation = f"Uploaded Doc [{category}]: {title[:30]}"

        meta = UploadedDocMeta(
            id=doc_id,
            filename=filename,
            title=title,
            category=category,
            case_name=case_name or "General Case",
            language=detected_lang,
            file_size_bytes=len(file_bytes),
            file_size_formatted=self.format_size(len(file_bytes)),
            page_count=page_count,
            upload_date=datetime.now().strftime("%Y-%m-%d %H:%M"),
            word_count=word_count,
            content=content,
            snippet=snippet,
            citation=citation
        )
        self.documents[doc_id] = meta
        return meta

    def remove_document(self, doc_id: str) -> bool:
        if doc_id in self.documents:
            del self.documents[doc_id]
            return True
        return False

    def get_all_documents(self) -> List[UploadedDocMeta]:
        return list(self.documents.values())

    async def search(self, query: str, filters: Optional[Dict[str, Any]] = None, limit: int = 5) -> List[LegalDocument]:
        """Search uploaded documents for query matching in English or Hindi."""
        query_terms = [t.lower() for t in query.split() if len(t) > 2]
        matched_docs: List[LegalDocument] = []

        for doc_id, meta in self.documents.items():
            if filters and filters.get("category") and filters.get("category") != "all":
                if meta.category != filters.get("category"):
                    continue

            content_lower = meta.content.lower()
            title_lower = meta.title.lower()

            matches = 0
            for term in query_terms:
                if term in title_lower:
                    matches += 3
                if term in content_lower:
                    matches += 1

            if matches > 0 or len(query_terms) == 0:
                doc_type = LegalSourceType.STATUTE if meta.category == "Statute" else (
                    LegalSourceType.NOTIFICATION if meta.category == "Guideline" else (
                        LegalSourceType.JUDGMENT_SC if meta.category in ["Judgment_SC", "Case File", "Charge Sheet"] else (
                            LegalSourceType.JUDGMENT_HC if meta.category == "Judgment_HC" else LegalSourceType.COMMENTARY
                        )
                    )
                )

                auth_level = AuthorityLevel.CENTRAL_ACT if meta.category == "Statute" else (
                    AuthorityLevel.SC_DIVISION_BENCH if meta.category == "Judgment_SC" else (
                        AuthorityLevel.HC_DIVISION_BENCH if meta.category == "Judgment_HC" else (
                            AuthorityLevel.SUBORDINATE_COURT if meta.category in ["Judgment_District", "Charge Sheet", "FIR"] else AuthorityLevel.COMMENTARY
                        )
                    )
                )

                legal_doc = LegalDocument(
                    id=meta.id,
                    title=meta.title,
                    source_name=f"Uploaded Document ({'Hindi' if meta.language == 'hi' else 'English'})",
                    source_url=f"/api/v1/documents/{meta.id}",
                    doc_type=doc_type,
                    authority_level=auth_level,
                    citation=meta.citation,
                    court="District Court / High Court" if meta.category == "Judgment_District" else "Uploaded Authority",
                    date=meta.upload_date,
                    snippet=meta.snippet,
                    content=meta.content,
                    ratio_decidendi=f"User uploaded {meta.category} reference: {meta.title}",
                    current_status="User Active Source",
                    score=float(matches * 25.0)
                )
                matched_docs.append(legal_doc)

        matched_docs.sort(key=lambda d: d.score, reverse=True)
        return matched_docs[:limit]

    async def get_document(self, doc_id: str) -> Optional[LegalDocument]:
        meta = self.documents.get(doc_id)
        if not meta:
            return None
        return LegalDocument(
            id=meta.id,
            title=meta.title,
            source_name="Uploaded Document",
            source_url=f"/api/v1/documents/{meta.id}",
            doc_type=LegalSourceType.COMMENTARY,
            authority_level=AuthorityLevel.COMMENTARY,
            citation=meta.citation,
            content=meta.content,
            snippet=meta.snippet,
            current_status="User Active Source"
        )

user_document_connector = UserDocumentConnector()
