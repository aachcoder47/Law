from abc import ABC, abstractmethod
from enum import Enum
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class LegalSourceType(str, Enum):
    CONSTITUTION = "Constitution"
    STATUTE = "Statute"
    JUDGMENT_SC = "Supreme Court Judgment"
    JUDGMENT_HC = "High Court Judgment"
    LAW_COMMISSION = "Law Commission Report"
    NOTIFICATION = "Gazette Notification"
    COMMENTARY = "Legal Commentary"

class AuthorityLevel(int, Enum):
    CONSTITUTION = 100
    CENTRAL_ACT = 90
    SC_CONSTITUTION_BENCH = 85
    SC_LARGER_BENCH = 80
    SC_DIVISION_BENCH = 75
    HC_FULL_BENCH = 65
    HC_DIVISION_BENCH = 60
    HC_SINGLE_BENCH = 50
    SUBORDINATE_COURT = 30
    COMMENTARY = 20

class LegalDocument(BaseModel):
    id: str
    title: str
    source_name: str
    source_url: str
    doc_type: LegalSourceType
    authority_level: AuthorityLevel
    citation: str
    court: Optional[str] = None
    bench: Optional[str] = None
    bench_size: Optional[int] = 1
    date: Optional[str] = None
    act: Optional[str] = None
    section: Optional[str] = None
    snippet: str = ""
    content: str = ""
    ratio_decidendi: Optional[str] = None
    current_status: str = "Good Law" # Good Law, Overruled, Distinguished, Replaced, Repealed
    status_details: Optional[str] = None
    score: float = 0.0

class BaseLegalConnector(ABC):
    name: str = "Base Connector"
    source_type: LegalSourceType = LegalSourceType.COMMENTARY

    @abstractmethod
    async def search(self, query: str, filters: Optional[Dict[str, Any]] = None, limit: int = 5) -> List[LegalDocument]:
        """Search the authoritative legal source."""
        pass

    @abstractmethod
    async def get_document(self, doc_id: str) -> Optional[LegalDocument]:
        """Retrieve full document text by ID."""
        pass
