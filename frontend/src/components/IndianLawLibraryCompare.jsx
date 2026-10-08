import React, { useState, useEffect } from 'react';
import {
  BookOpen, ArrowRightLeft, Search, Scale, Shield, CheckCircle,
  AlertTriangle, Filter, ExternalLink, RefreshCw, FileText,
  ChevronRight, Landmark, Layers, Award, Sparkles, Copy
} from 'lucide-react';

const API_BASE = "http://127.0.0.1:8000/api/v1";

export default function IndianLawLibraryCompare() {
  const [activeSubTab, setActiveSubTab] = useState('case_lookup'); // 'case_lookup' | 'transitions' | 'bare_acts' | 'precedents'
  
  // Transitions state
  const [comparisons, setComparisons] = useState([]);
  const [transitionSearch, setTransitionSearch] = useState('');
  const [selectedComparison, setSelectedComparison] = useState(null);

  // Bare Acts state
  const [acts, setActs] = useState([]);
  const [selectedActId, setSelectedActId] = useState('bns');
  const [actDetails, setActDetails] = useState(null);
  const [actSearchQuery, setActSearchQuery] = useState('');
  const [actLoading, setActLoading] = useState(false);

  // Case / CNR Lookup state
  const [caseQuery, setCaseQuery] = useState('');
  const [caseCourtFilter, setCaseCourtFilter] = useState('all');
  const [caseYearFilter, setCaseYearFilter] = useState('');
  const [caseLookupLoading, setCaseLookupLoading] = useState(false);
  const [caseLookupResults, setCaseLookupResults] = useState([]);
  const [selectedCaseDetail, setSelectedCaseDetail] = useState(null);
  const [sampleCases, setSampleCases] = useState([]);
  const [caseCopied, setCaseCopied] = useState(false);

  // Precedents state
  const [case1, setCase1] = useState('sc-2020-sushila-aggarwal');
  const [case2, setCase2] = useState('sc-1996-salauddin-shaikh');
  const [precedentResult, setPrecedentResult] = useState(null);
  const [precedentLoading, setPrecedentLoading] = useState(false);

  // Precedent options
  const precedentCatalog = [
    {
      id: "sc-2020-sushila-aggarwal",
      title: "Sushila Aggarwal v. State (NCT Delhi) (2020)",
      bench: "Constitution Bench (5 Judges)",
      status: "Active / Binding Precedent",
      domain: "Criminal Law / Anticipatory Bail",
      sections: "BNSS Sec 482 / CrPC Sec 438",
      holding: "Anticipatory bail should not ordinarily be limited to a fixed time period. It can continue until the conclusion of trial unless special circumstances warrant otherwise.",
      overrules: "Salauddin Abdulsamad Shaikh (1996) and its line of cases."
    },
    {
      id: "sc-1980-gurbaksh-sibbia",
      title: "Gurbaksh Singh Sibbia v. State of Punjab (1980)",
      bench: "Constitution Bench (5 Judges)",
      status: "Historical Foundation",
      domain: "Criminal Law / Personal Liberty",
      sections: "CrPC Sec 438 / Art 21",
      holding: "Anticipatory bail is a device to protect personal liberty guaranteed under Article 21; powers of High Court and Sessions Court cannot be fettered by narrow rules.",
      overrules: "Narrow restrictive interpretations of High Courts."
    },
    {
      id: "sc-1996-salauddin-shaikh",
      title: "Salauddin Abdulsamad Shaikh v. State of Maharashtra (1996)",
      bench: "3-Judge Bench",
      status: "OVERRULED (No longer good law)",
      domain: "Criminal Procedure",
      sections: "CrPC Sec 438",
      holding: "Held that anticipatory bail orders should necessarily be limited in time and accused must be left to surrender and apply for regular bail. OVERRULED BY SUSHILA AGGARWAL (2020).",
      overrules: "None"
    },
    {
      id: "sc-2017-puttaswamy-privacy",
      title: "K.S. Puttaswamy v. Union of India (2017)",
      bench: "Constitution Bench (9 Judges)",
      status: "Landmark / Inviolable Constitutional Law",
      domain: "Constitutional Law / Fundamental Rights",
      sections: "Article 21, Part III",
      holding: "Right to privacy is an intrinsic part of the right to life and personal liberty under Article 21 and Part III of the Constitution.",
      overrules: "M.P. Sharma (8-Judge, 1954) & ADM Jabalpur (5-Judge, 1976)."
    },
    {
      id: "sc-2023-cox-and-kings",
      title: "Cox and Kings Ltd v. SAP India Pvt Ltd (2024)",
      bench: "Constitution Bench (5 Judges)",
      status: "Active / Binding Precedent",
      domain: "Arbitration & Commercial Law",
      sections: "Arbitration Act 1996 Sec 7, 8, 11",
      holding: "Group of Companies doctrine recognized and clarified. Non-signatories may be bound to an arbitration agreement based on mutual intent and participation.",
      overrules: "Clarified Chloro Controls (2013)."
    },
    {
      id: "sc-2010-rangappa",
      title: "Rangappa v. Sri Mohan (2010)",
      bench: "3-Judge Bench",
      status: "Binding Precedent",
      domain: "Negotiable Instruments Act",
      sections: "NI Act Sec 138, 139",
      holding: "Presumption mandated by Section 139 NI Act does include the existence of a legally enforceable debt or liability, though it remains rebuttable on preponderance of probabilities.",
      overrules: "Krishna Janardhan Bhat (2008) in part."
    }
  ];

  useEffect(() => {
    fetchComparisons();
    fetchActs();
    runPrecedentCompare('sc-2020-sushila-aggarwal', 'sc-1996-salauddin-shaikh');
    fetchSampleCases();
  }, []);

  const fetchSampleCases = async () => {
    try {
      const res = await fetch(`${API_BASE}/cases/sample`);
      if (res.ok) {
        const data = await res.json();
        const cases = data.cases || [];
        setSampleCases(cases);
        setCaseLookupResults(cases);
        if (cases.length > 0) {
          setSelectedCaseDetail(cases[0]);
        }
      }
    } catch (e) {
      console.error("Error fetching sample cases:", e);
    }
  };

  const handleCaseLookup = async (overrideQuery) => {
    const q = overrideQuery !== undefined ? overrideQuery : caseQuery;
    if (!q || !q.trim()) return;
    setCaseLookupLoading(true);
    try {
      const res = await fetch(`${API_BASE}/cases/lookup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q.trim(),
          court: caseCourtFilter,
          case_year: caseYearFilter
        })
      });
      if (res.ok) {
        const data = await res.json();
        const cases = data.cases || [];
        setCaseLookupResults(cases);
        if (cases.length > 0) {
          setSelectedCaseDetail(cases[0]);
        }
      }
    } catch (e) {
      console.error("Case lookup error:", e);
    } finally {
      setCaseLookupLoading(false);
    }
  };

  useEffect(() => {
    if (selectedActId) {
      fetchActDetails(selectedActId);
    }
  }, [selectedActId]);

  const fetchComparisons = async () => {
    try {
      const res = await fetch(`${API_BASE}/library/comparisons`);
      if (res.ok) {
        const data = await res.json();
        setComparisons(data.comparisons || []);
        if (data.comparisons?.length > 0) {
          setSelectedComparison(data.comparisons[0]);
        }
      }
    } catch (e) {
      console.error("Error fetching comparisons:", e);
    }
  };

  const fetchActs = async () => {
    try {
      const res = await fetch(`${API_BASE}/library/acts`);
      if (res.ok) {
        const data = await res.json();
        setActs(data.acts || []);
      }
    } catch (e) {
      console.error("Error fetching acts:", e);
    }
  };

  const fetchActDetails = async (actId) => {
    setActLoading(true);
    try {
      const res = await fetch(`${API_BASE}/library/acts/${actId}`);
      if (res.ok) {
        const data = await res.json();
        setActDetails(data.act);
      }
    } catch (e) {
      console.error("Error fetching act details:", e);
    } finally {
      setActLoading(false);
    }
  };

  const runPrecedentCompare = (id1, id2) => {
    setPrecedentLoading(true);
    const p1 = precedentCatalog.find(c => c.id === id1);
    const p2 = precedentCatalog.find(c => c.id === id2);
    setPrecedentResult({ precedent1: p1, precedent2: p2 });
    setTimeout(() => setPrecedentLoading(false), 300);
  };

  const filteredComparisons = comparisons.filter(c => 
    c.topic.toLowerCase().includes(transitionSearch.toLowerCase()) ||
    c.law_1.name.toLowerCase().includes(transitionSearch.toLowerCase()) ||
    c.law_2.name.toLowerCase().includes(transitionSearch.toLowerCase()) ||
    c.key_differences.toLowerCase().includes(transitionSearch.toLowerCase())
  );

  const filteredSections = actDetails?.sections?.filter(s =>
    s.section_number.toLowerCase().includes(actSearchQuery.toLowerCase()) ||
    s.title.toLowerCase().includes(actSearchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(actSearchQuery.toLowerCase()) ||
    s.chapter.toLowerCase().includes(actSearchQuery.toLowerCase())
  ) || [];

  return (
    <div style={{ padding: '20px 0' }}>
      
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '24px 30px', marginBottom: '24px', borderLeft: '4px solid var(--gold-primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <BookOpen size={26} color="var(--gold-primary)" />
              <h2 style={{ fontSize: '1.45rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-serif)' }}>
                Indian Law Library & Comparative Explorer (संपूर्ण भारतीय विधि पुस्तकालय)
              </h2>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0 }}>
              Complete Central Acts, 2024 Sanhita Transition Matrix (BNS ↔ IPC, BNSS ↔ CrPC, BSA ↔ IEA), Section-by-Section Explorer & Landmark Precedent Comparator.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="gold-badge" style={{ fontSize: '0.78rem' }}>
              ⚖️ 20+ Central Statutes
            </span>
            <span className="gold-badge" style={{ fontSize: '0.78rem', background: 'rgba(56, 189, 248, 0.15)', borderColor: '#38BDF8' }}>
              🏛️ Landmark Constitution Benches
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '22px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
        {[
          { id: 'case_lookup', label: '🔍 Case No., CNR & Kanoon Search', icon: Search },
          { id: 'transitions', label: '🔄 2024 Sanhita Transition Matrix & Section Compare', icon: ArrowRightLeft },
          { id: 'bare_acts', label: '📜 Central Bare Acts Library & Section Explorer', icon: BookOpen },
          { id: 'precedents', label: '🏛️ Landmark Precedent & Constitution Bench Comparator', icon: Scale }
        ].map(tab => {
          const Icon = tab.icon;
          const active = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '8px',
                background: active ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255,255,255,0.03)',
                border: active ? '1px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                color: active ? 'var(--gold-light)' : 'var(--text-secondary)',
                fontWeight: active ? '600' : '500',
                fontSize: '0.86rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 0: CASE NUMBER, CNR & INDIAN KANOON REGISTRY */}
      {activeSubTab === 'case_lookup' && (
        <div>
          {/* Search Bar & Court Filter Card */}
          <div className="glass-card" style={{ padding: '24px', marginBottom: '24px', border: '1px solid var(--gold-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Scale size={20} color="var(--gold-primary)" />
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#FFF', fontFamily: 'var(--font-serif)' }}>
                INDIAN JUDICIAL CASE & CNR NUMBER REGISTRY (केस नंबर / CNR ट्रैकर)
              </h3>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0 0 18px 0', lineHeight: '1.5' }}>
              Search across Supreme Court of India, 25 High Courts, and Indian Kanoon repository by <b>Case Number</b> (e.g. <i>Criminal Appeal No. 1277 of 2014</i>, <i>SLP (Crl) 7281/2017</i>), <b>16-digit CNR Number</b> (e.g. <i>SCIN01-001277-2014</i>), <b>Official Citation</b> (e.g. <i>(2014) 8 SCC 273</i>), or <b>Party Names</b>.
            </p>

            {/* Inputs Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 220px 140px auto', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--gold-primary)' }} />
                <input
                  type="text"
                  value={caseQuery}
                  onChange={(e) => setCaseQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCaseLookup()}
                  placeholder="Enter Case No., CNR, Citation, or Parties (e.g. Crl.A. 1277/2014 or Arnesh Kumar)..."
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
                    background: '#091122',
                    border: '1px solid var(--gold-border)',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '0.86rem'
                  }}
                />
              </div>

              <div>
                <select
                  value={caseCourtFilter}
                  onChange={(e) => setCaseCourtFilter(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#091122',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '0.82rem'
                  }}
                >
                  <option value="all">🏛️ All Indian Courts</option>
                  <option value="sc">Supreme Court of India</option>
                  <option value="delhi_hc">High Court of Delhi</option>
                  <option value="bombay_hc">Bombay High Court</option>
                  <option value="allahabad_hc">Allahabad High Court</option>
                  <option value="district">Sessions & District Judiciary</option>
                </select>
              </div>

              <div>
                <input
                  type="text"
                  value={caseYearFilter}
                  onChange={(e) => setCaseYearFilter(e.target.value)}
                  placeholder="Year (e.g. 2020)"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#091122',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '0.82rem'
                  }}
                />
              </div>

              <button
                onClick={() => handleCaseLookup()}
                disabled={caseLookupLoading}
                className="gold-btn"
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '0.84rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: caseLookupLoading ? 'wait' : 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {caseLookupLoading ? (
                  <>
                    <RefreshCw size={15} className="spin" /> Searching...
                  </>
                ) : (
                  <>
                    <Search size={15} /> Search Records
                  </>
                )}
              </button>
            </div>

            {/* Quick Landmark Case Chips */}
            <div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                ⚡ Quick Lookup Landmarks (Click to inspect instant case record & Indian Kanoon link):
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { label: 'Arnesh Kumar (Crl.A. 1277/2014)', query: 'Criminal Appeal No. 1277 of 2014' },
                  { label: 'Sushila Aggarwal (SLP 7281/2017)', query: 'Special Leave Petition (Crl.) Nos. 7281-7282 of 2017' },
                  { label: 'Puttaswamy Privacy (WP 494/2012)', query: 'Writ Petition (Civil) No. 494 of 2012' },
                  { label: 'Lalita Kumari (WP 68/2008)', query: 'Writ Petition (Criminal) No. 68 of 2008' },
                  { label: 'Satender Kumar Antil (SLP 5191/2021)', query: 'SLP (Crl.) No. 5191 of 2021' },
                  { label: 'Rangappa NI Act (Crl.A. 1020/2010)', query: 'Criminal Appeal No. 1020 of 2010' },
                  { label: 'Cox and Kings (Arb.Pet. 38/2020)', query: 'Arbitration Petition No. 38 of 2020' },
                  { label: 'D.K. Basu Arrest (WP 592/1987)', query: 'Writ Petition (Crl.) No. 592 of 1987' }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCaseQuery(item.query);
                      handleCaseLookup(item.query);
                    }}
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(212,175,55,0.2)',
                      padding: '4px 10px',
                      borderRadius: '16px',
                      color: 'var(--gold-light)',
                      fontSize: '0.74rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    ⚖️ {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results 2-Column Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: '24px' }}>
            
            {/* Left Column: Matched Cases List */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Judicial Records Found ({caseLookupResults.length})
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Click to inspect full brief
                </span>
              </div>

              {caseLookupResults.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)' }}>
                  <Search size={28} style={{ opacity: 0.4, marginBottom: '8px' }} />
                  <p style={{ fontSize: '0.82rem', margin: 0 }}>No case found matching query. Try typing another Case Number, CNR or Party name.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '680px', overflowY: 'auto' }}>
                  {caseLookupResults.map((c, idx) => {
                    const isSelected = selectedCaseDetail?.title === c.title;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedCaseDetail(c)}
                        style={{
                          padding: '14px',
                          borderRadius: '8px',
                          background: isSelected ? 'rgba(212, 175, 55, 0.12)' : 'rgba(255,255,255,0.02)',
                          border: isSelected ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.05)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <span className="gold-badge" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                            {c.bench_type || 'Judicial Division'}
                          </span>
                          <span style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: '600' }}>
                            {c.date_of_judgment}
                          </span>
                        </div>

                        <div style={{ fontSize: '0.88rem', fontWeight: '600', color: isSelected ? 'var(--gold-light)' : '#FFF', marginBottom: '6px', lineHeight: '1.4' }}>
                          {c.title}
                        </div>

                        <div style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', marginBottom: '4px' }}>
                          📋 {c.case_number}
                        </div>

                        <div style={{ fontSize: '0.72rem', color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          🆔 {c.cnr_number}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Column: Case Deep-Dive Inspector */}
            <div>
              {selectedCaseDetail ? (
                <div className="glass-card" style={{ padding: '28px', border: '1px solid var(--gold-border)' }}>
                  
                  {/* Top Status & Badge Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                    <span className="gold-badge" style={{ fontSize: '0.75rem', padding: '3px 10px', background: 'rgba(16, 185, 129, 0.15)', borderColor: '#10B981', color: '#34D399' }}>
                      ✓ {selectedCaseDetail.status || 'Active / Binding Precedent'}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Source: <b>{selectedCaseDetail.source_tag || 'NyayaAI Registry'}</b>
                    </span>
                  </div>

                  {/* Case Heading */}
                  <h2 style={{ fontSize: '1.35rem', color: '#FFF', margin: '0 0 12px 0', fontFamily: 'var(--font-serif)', lineHeight: '1.4' }}>
                    {selectedCaseDetail.title}
                  </h2>

                  {/* Metadata Matrix */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', background: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', marginBottom: '20px' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Court:</div>
                      <div style={{ fontSize: '0.82rem', color: '#FFF', fontWeight: '600' }}>🏛️ {selectedCaseDetail.court}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Case Number:</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--gold-light)', fontWeight: '600' }}>📋 {selectedCaseDetail.case_number}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>eCourts CNR Number:</div>
                      <div style={{ fontSize: '0.82rem', color: '#38BDF8', fontWeight: '600' }}>🆔 {selectedCaseDetail.cnr_number}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Law Report Citations:</div>
                      <div style={{ fontSize: '0.82rem', color: '#FFF', fontWeight: '600' }}>📜 {selectedCaseDetail.citation}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Bench & Coram:</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>👨‍⚖️ {selectedCaseDetail.coram || selectedCaseDetail.bench_type}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Date of Judgment:</div>
                      <div style={{ fontSize: '0.82rem', color: '#10B981', fontWeight: '600' }}>📅 {selectedCaseDetail.date_of_judgment}</div>
                    </div>
                  </div>

                  {/* Statutes Involved */}
                  {selectedCaseDetail.statutes_involved && selectedCaseDetail.statutes_involved.length > 0 && (
                    <div style={{ marginBottom: '18px' }}>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Governing Statutes & Sections:</div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {selectedCaseDetail.statutes_involved.map((st, i) => (
                          <span key={i} style={{ fontSize: '0.74rem', padding: '3px 8px', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '4px', color: 'var(--gold-light)' }}>
                            § {st}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ratio Decidendi */}
                  <div style={{ marginBottom: '18px', background: 'rgba(212, 175, 55, 0.08)', border: '1px solid var(--gold-border)', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--gold-light)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Scale size={16} color="var(--gold-primary)" /> Ratio Decidendi & Legal Principle (निर्णय का सार):
                    </div>
                    <div style={{ fontSize: '0.86rem', color: 'var(--text-primary)', lineHeight: '1.6' }}>
                      {selectedCaseDetail.ratio_decidendi}
                    </div>
                  </div>

                  {/* Judicial Summary */}
                  <div style={{ marginBottom: '22px' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '600' }}>
                      📖 Case Summary & Operational Holdings:
                    </div>
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.7', background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                      {selectedCaseDetail.summary}
                    </div>
                  </div>

                  {/* External Links & Actions */}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
                    {selectedCaseDetail.kanoon_url && (
                      <a
                        href={selectedCaseDetail.kanoon_url}
                        target="_blank"
                        rel="noreferrer"
                        className="gold-btn"
                        style={{
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.82rem',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          fontWeight: '600'
                        }}
                      >
                        <ExternalLink size={14} /> Open in Indian Kanoon
                      </a>
                    )}

                    {selectedCaseDetail.ecourts_url && (
                      <a
                        href={selectedCaseDetail.ecourts_url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.82rem',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          background: 'rgba(56, 189, 248, 0.15)',
                          border: '1px solid #38BDF8',
                          color: '#38BDF8',
                          fontWeight: '600'
                        }}
                      >
                        <Landmark size={14} /> e-Courts Services
                      </a>
                    )}

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${selectedCaseDetail.title}, ${selectedCaseDetail.citation} (${selectedCaseDetail.court})`);
                        setCaseCopied(true);
                        setTimeout(() => setCaseCopied(false), 2000);
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.82rem',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--border-subtle)',
                        color: '#FFF',
                        cursor: 'pointer'
                      }}
                    >
                      {caseCopied ? <CheckCircle size={14} color="#10B981" /> : <Copy size={14} />}
                      {caseCopied ? 'Citation Copied!' : 'Copy Citation'}
                    </button>
                  </div>

                </div>
              ) : (
                <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
                  <Scale size={40} style={{ color: 'var(--gold-primary)', opacity: 0.5, marginBottom: '12px' }} />
                  <h4 style={{ color: '#FFF', margin: '0 0 6px 0' }}>No Case Selected</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', margin: 0 }}>
                    Select a judicial record from the left column or search by Case Number / CNR Number above.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* SUB-TAB 1: 2024 SANHITA TRANSITION MATRIX & SECTION COMPARE */}
      {activeSubTab === 'transitions' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 380px) 1fr', gap: '24px' }}>
          
          {/* Left Column: Transition Topics List */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ marginBottom: '14px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  value={transitionSearch}
                  onChange={(e) => setTransitionSearch(e.target.value)}
                  placeholder="Search Bail, Murder, Remand, Quashing..."
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 34px',
                    background: '#091122',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    color: '#FFF',
                    fontSize: '0.82rem'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '580px', overflowY: 'auto' }}>
              {filteredComparisons.map((c) => {
                const isSelected = selectedComparison?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedComparison(c)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '8px',
                      background: isSelected ? 'rgba(212, 175, 55, 0.14)' : 'rgba(255,255,255,0.03)',
                      border: isSelected ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.06)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.86rem', fontWeight: '600', color: isSelected ? 'var(--gold-light)' : '#FFF' }}>
                        {c.topic}
                      </span>
                      <ChevronRight size={14} color={isSelected ? 'var(--gold-primary)' : 'var(--text-muted)'} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                      <span style={{ color: '#38BDF8', fontWeight: '500' }}>{c.law_1.act} {c.law_1.section}</span>
                      <span>↔</span>
                      <span style={{ color: '#F59E0B', fontWeight: '500' }}>{c.law_2.act} {c.law_2.section}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Comparative Detail View */}
          <div>
            {selectedComparison ? (
              <div className="glass-card" style={{ padding: '26px' }}>
                
                {/* Header */}
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px', marginBottom: '20px' }}>
                  <span className="gold-badge" style={{ fontSize: '0.72rem', marginBottom: '6px', display: 'inline-block' }}>
                    COMPARATIVE STATUTORY ANALYSIS
                  </span>
                  <h3 style={{ fontSize: '1.25rem', color: '#FFF', margin: '4px 0 0 0', fontFamily: 'var(--font-serif)' }}>
                    {selectedComparison.topic}
                  </h3>
                </div>

                {/* Side-by-side Section Boxes */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '22px' }}>
                  
                  {/* New Law Box */}
                  <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '10px', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.72rem', background: '#38BDF8', color: '#000', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px' }}>NEW SANHITA</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#38BDF8' }}>{selectedComparison.law_1.act}</span>
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#FFF', marginBottom: '6px' }}>
                      {selectedComparison.law_1.section}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {selectedComparison.law_1.name}
                    </div>
                  </div>

                  {/* Old Law Box */}
                  <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '10px', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.72rem', background: '#F59E0B', color: '#000', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px' }}>PRE-2024 CODE</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#F59E0B' }}>{selectedComparison.law_2.act}</span>
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#FFF', marginBottom: '6px' }}>
                      {selectedComparison.law_2.section}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {selectedComparison.law_2.name}
                    </div>
                  </div>

                </div>

                {/* Key Differences */}
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '0.88rem', color: 'var(--gold-light)', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 8px 0' }}>
                    <ArrowRightLeft size={16} /> Substantive & Procedural Differences:
                  </h4>
                  <div style={{ fontSize: '0.88rem', lineHeight: '1.7', color: 'var(--text-primary)', background: 'rgba(255,255,255,0.02)', padding: '14px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    {selectedComparison.key_differences}
                  </div>
                </div>

                {/* Practice Directive / Tip */}
                <div style={{ marginBottom: '20px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '8px', padding: '14px 16px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: '600', color: '#34D399', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Award size={15} /> Senior Counsel Practice Tip (अधिवक्ता कार्यप्रणाली):
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    {selectedComparison.practice_tip}
                  </div>
                </div>

                {/* Landmark Precedents */}
                <div>
                  <h4 style={{ fontSize: '0.86rem', color: 'var(--gold-light)', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 10px 0' }}>
                    <Landmark size={15} /> Controlling Precedents:
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {selectedComparison.leading_precedents.map((p, idx) => (
                      <div key={idx} style={{ fontSize: '0.82rem', color: 'var(--text-primary)', padding: '6px 12px', background: 'rgba(212,175,55,0.06)', borderRadius: '6px', border: '1px solid rgba(212,175,55,0.2)' }}>
                        ⚖️ <b>{p}</b>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)' }}>Select a transition provision from the left to view side-by-side comparison.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* SUB-TAB 2: CENTRAL BARE ACTS LIBRARY & SECTION EXPLORER */}
      {activeSubTab === 'bare_acts' && (
        <div>
          {/* Acts Chips Selector */}
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '20px' }}>
            {acts.map(act => (
              <button
                key={act.id}
                onClick={() => setSelectedActId(act.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  whiteSpace: 'nowrap',
                  background: selectedActId === act.id ? 'var(--gold-primary)' : 'rgba(255,255,255,0.04)',
                  color: selectedActId === act.id ? '#000' : 'var(--text-primary)',
                  fontWeight: selectedActId === act.id ? '700' : '500',
                  fontSize: '0.82rem',
                  border: '1px solid ' + (selectedActId === act.id ? 'var(--gold-primary)' : 'var(--border-subtle)'),
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {act.short_name} ({act.year})
              </button>
            ))}
          </div>

          {/* Act Info & Search Bar */}
          {actDetails && (
            <div className="glass-card" style={{ padding: '22px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: '#FFF', margin: '0 0 4px 0', fontFamily: 'var(--font-serif)' }}>
                    {actDetails.name}
                  </h3>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--gold-light)' }}>Status: <b>{actDetails.status}</b></span>
                    <span>•</span>
                    <span>Category: <b>{actDetails.category}</b></span>
                    <span>•</span>
                    <span>Total Sections: <b>{actDetails.total_sections}</b></span>
                  </div>
                </div>

                {/* Section Search */}
                <div style={{ minWidth: '280px' }}>
                  <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      value={actSearchQuery}
                      onChange={(e) => setActSearchQuery(e.target.value)}
                      placeholder="Search section number or keyword..."
                      style={{
                        width: '100%',
                        padding: '8px 12px 8px 34px',
                        background: '#091122',
                        border: '1px solid var(--gold-border)',
                        borderRadius: '6px',
                        color: '#FFF',
                        fontSize: '0.82rem'
                      }}
                    />
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
                {actDetails.summary}
              </p>
            </div>
          )}

          {/* Sections Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '18px' }}>
            {filteredSections.map((sec, idx) => (
              <div
                key={idx}
                className="glass-card"
                style={{ padding: '20px', borderLeft: '3px solid var(--gold-primary)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="gold-badge" style={{ fontSize: '0.74rem' }}>
                      Section {sec.section_number}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {sec.chapter}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '0.98rem', fontWeight: '600', color: '#FFF', margin: '0 0 10px 0' }}>
                    {sec.title}
                  </h4>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '12px' }}>
                    {sec.description}
                  </p>

                  {sec.punishment_or_procedure && (
                    <div style={{ marginBottom: '8px', fontSize: '0.78rem', color: 'var(--gold-light)' }}>
                      <b>Punishment / Procedure:</b> {sec.punishment_or_procedure}
                    </div>
                  )}

                  {sec.cognizable_bailable && (
                    <div style={{ marginBottom: '8px', fontSize: '0.76rem', color: '#38BDF8' }}>
                      <b>Nature:</b> {sec.cognizable_bailable} {sec.trial_court && `| Trial: ${sec.trial_court}`}
                    </div>
                  )}
                </div>

                {sec.landmark_cases && sec.landmark_cases.length > 0 && (
                  <div style={{ marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Landmark Precedents:</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--gold-primary)' }}>
                      {sec.landmark_cases.join(' • ')}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      )}

      {/* SUB-TAB 3: LANDMARK PRECEDENT & CONSTITUTION BENCH COMPARATOR */}
      {activeSubTab === 'precedents' && (
        <div>
          {/* Selectors Bar */}
          <div className="glass-card" style={{ padding: '22px', marginBottom: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '16px', alignItems: 'center' }}>
              <div>
                <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Precedent 1 (Authoritative / Constitution Bench):
                </label>
                <select
                  value={case1}
                  onChange={(e) => setCase1(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#091122',
                    border: '1px solid var(--gold-border)',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '0.84rem'
                  }}
                >
                  {precedentCatalog.map(p => (
                    <option key={p.id} value={p.id}>{p.title} [{p.bench}]</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Precedent 2 (Comparison / Overruled / Divergent Ruling):
                </label>
                <select
                  value={case2}
                  onChange={(e) => setCase2(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#091122',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '0.84rem'
                  }}
                >
                  {precedentCatalog.map(p => (
                    <option key={p.id} value={p.id}>{p.title} [{p.bench}]</option>
                  ))}
                </select>
              </div>

              <div style={{ alignSelf: 'flex-end' }}>
                <button
                  onClick={() => runPrecedentCompare(case1, case2)}
                  className="btn-primary"
                  style={{ height: '42px', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <ArrowRightLeft size={16} />
                  <span>Compare</span>
                </button>
              </div>
            </div>
          </div>

          {/* Precedent Comparison Results */}
          {precedentResult && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              
              {/* Precedent 1 Card */}
              <div className="glass-card" style={{ padding: '24px', borderTop: '4px solid #10B981' }}>
                <span className="gold-badge" style={{ fontSize: '0.72rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', borderColor: '#10B981', marginBottom: '8px', display: 'inline-block' }}>
                  {precedentResult.precedent1.status}
                </span>
                <h3 style={{ fontSize: '1.15rem', color: '#FFF', margin: '4px 0 6px 0', fontFamily: 'var(--font-serif)' }}>
                  {precedentResult.precedent1.title}
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--gold-light)', marginBottom: '14px' }}>
                  🏛️ {precedentResult.precedent1.bench} • {precedentResult.precedent1.domain}
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Statutory Sections:</div>
                  <div style={{ fontSize: '0.82rem', color: '#38BDF8', fontWeight: '600' }}>
                    {precedentResult.precedent1.sections}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Ratio Decidendi / Principal Holding:</div>
                  <div style={{ fontSize: '0.86rem', color: 'var(--text-primary)', lineHeight: '1.7', background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    {precedentResult.precedent1.holding}
                  </div>
                </div>
              </div>

              {/* Precedent 2 Card */}
              <div className="glass-card" style={{ padding: '24px', borderTop: precedentResult.precedent2.status.includes('OVERRULED') ? '4px solid #EF4444' : '4px solid #38BDF8' }}>
                <span className="gold-badge" style={{ fontSize: '0.72rem', background: precedentResult.precedent2.status.includes('OVERRULED') ? 'rgba(239, 68, 68, 0.15)' : 'rgba(56, 189, 248, 0.15)', color: precedentResult.precedent2.status.includes('OVERRULED') ? '#F87171' : '#38BDF8', borderColor: precedentResult.precedent2.status.includes('OVERRULED') ? '#EF4444' : '#38BDF8', marginBottom: '8px', display: 'inline-block' }}>
                  {precedentResult.precedent2.status}
                </span>
                <h3 style={{ fontSize: '1.15rem', color: '#FFF', margin: '4px 0 6px 0', fontFamily: 'var(--font-serif)' }}>
                  {precedentResult.precedent2.title}
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--gold-light)', marginBottom: '14px' }}>
                  🏛️ {precedentResult.precedent2.bench} • {precedentResult.precedent2.domain}
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Statutory Sections:</div>
                  <div style={{ fontSize: '0.82rem', color: '#38BDF8', fontWeight: '600' }}>
                    {precedentResult.precedent2.sections}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Ratio Decidendi / Principal Holding:</div>
                  <div style={{ fontSize: '0.86rem', color: 'var(--text-primary)', lineHeight: '1.7', background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    {precedentResult.precedent2.holding}
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
