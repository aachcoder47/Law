import React, { useState, useEffect } from 'react';
import {
  Calculator, Scale, IndianRupee, FileText, CheckCircle,
  HelpCircle, AlertCircle, Printer, Download, RefreshCw,
  ChevronRight, Shield, BookOpen, Layers, Award
} from 'lucide-react';

const API_BASE = "http://127.0.0.1:8000/api/v1";

export default function CourtFeeCalculator() {
  const [states, setStates] = useState([
    "Delhi", "Maharashtra", "Uttar Pradesh", "Rajasthan",
    "Karnataka", "West Bengal", "Tamil Nadu", "Punjab & Haryana"
  ]);
  const [caseTypes, setCaseTypes] = useState([
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
  ]);

  const [selectedState, setSelectedState] = useState("Delhi");
  const [selectedCaseType, setSelectedCaseType] = useState("Money Suit / Recovery");
  const [valuationAmount, setValuationAmount] = useState(500000);
  const [courtLevel, setCourtLevel] = useState("District Court");
  const [reliefType, setReliefType] = useState("Primary");
  const [numRespondents, setNumRespondents] = useState(1);
  const [hasStayApp, setHasStayApp] = useState(false);
  const [hasExemption, setHasExemption] = useState(false);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchMeta();
    calculateFee();
  }, []);

  const fetchMeta = async () => {
    try {
      const resState = await fetch(`${API_BASE}/calculator/states`);
      if (resState.ok) {
        const d = await resState.json();
        if (d.states) setStates(d.states);
      }
      const resTypes = await fetch(`${API_BASE}/calculator/case-types`);
      if (resTypes.ok) {
        const d = await resTypes.json();
        if (d.case_types) setCaseTypes(d.case_types);
      }
    } catch (e) {
      console.log("Using default fee metadata");
    }
  };

  const calculateFee = async () => {
    setLoading(true);
    try {
      const payload = {
        state: selectedState,
        case_type: selectedCaseType,
        valuation_amount: parseFloat(valuationAmount) || 0,
        court_level: courtLevel,
        relief_type: reliefType,
        num_defendants_respondents: parseInt(numRespondents) || 1,
        has_stay_application: hasStayApp,
        has_exemption: hasExemption
      };

      const res = await fetch(`${API_BASE}/calculator/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data.data);
      }
    } catch (e) {
      console.error("Court fee calculation error:", e);
    } finally {
      setLoading(false);
    }
  };

  const setPresetValuation = (val) => {
    setValuationAmount(val);
  };

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div style={{ padding: '24px 0' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '24px 30px', marginBottom: '24px', borderLeft: '4px solid var(--gold-primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <Calculator size={26} color="var(--gold-primary)" />
              <h2 style={{ fontSize: '1.45rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-serif)' }}>
                Indian Court Fee Calculator (कोर्ट फीस कैलकुलेटर)
              </h2>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
              Statutory Ad-Valorem Schedules, Fixed Fees, Process Charges (Talbana) & Advocate Welfare Stamps under State Court Fees Acts.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={calculateFee}
              className="btn-primary"
              style={{ padding: '8px 18px', fontSize: '0.85rem' }}
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Recalculate (पुनर्गणना)
            </button>
            <button
              onClick={handlePrintSlip}
              className="btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <Printer size={15} /> Print Fee Slip
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* Left Column: Configuration Form */}
        <div className="glass-card" style={{ padding: '26px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '600', color: 'var(--gold-light)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Scale size={18} /> Suit & Jurisdiction Parameters
          </h3>

          {/* State Jurisdiction */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '7px' }}>
              Select State / High Court Jurisdiction (राज्य / क्षेत्राधिकार)
            </label>
            <select
              value={selectedState}
              onChange={(e) => { setSelectedState(e.target.value); }}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(7, 11, 25, 0.8)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            >
              {states.map(st => (
                <option key={st} value={st} style={{ background: '#0D1527', color: '#FFF' }}>{st}</option>
              ))}
            </select>
          </div>

          {/* Case / Plaint Type */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '7px' }}>
              Nature of Suit / Petition / Plaint (वाद / याचिका की प्रकृति)
            </label>
            <select
              value={selectedCaseType}
              onChange={(e) => { setSelectedCaseType(e.target.value); }}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(7, 11, 25, 0.8)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            >
              {caseTypes.map(ct => (
                <option key={ct} value={ct} style={{ background: '#0D1527', color: '#FFF' }}>{ct}</option>
              ))}
            </select>
          </div>

          {/* Valuation Amount */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                Suit / Claim Valuation in INR (वाद / संपत्ति का मूल्यांकन राशि)
              </label>
              <span style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--gold-primary)', fontFamily: 'var(--font-mono)' }}>
                ₹{Number(valuationAmount || 0).toLocaleString('en-IN')}
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--gold-primary)', fontWeight: '700' }}>₹</span>
              <input
                type="number"
                value={valuationAmount}
                onChange={(e) => setValuationAmount(e.target.value)}
                placeholder="e.g. 500000"
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 30px',
                  borderRadius: '8px',
                  background: 'rgba(7, 11, 25, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Quick Presets */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
              {[
                { label: '₹1 Lakh', val: 100000 },
                { label: '₹5 Lakh', val: 500000 },
                { label: '₹10 Lakh', val: 1000000 },
                { label: '₹25 Lakh', val: 2500000 },
                { label: '₹50 Lakh', val: 5000000 },
                { label: '₹1 Crore', val: 10000000 }
              ].map(p => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setPresetValuation(p.val)}
                  style={{
                    fontSize: '0.74rem',
                    padding: '3px 9px',
                    borderRadius: '4px',
                    background: valuationAmount === p.val ? 'rgba(212, 175, 55, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                    border: valuationAmount === p.val ? '1px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                    color: valuationAmount === p.val ? 'var(--gold-light)' : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Court Forum & Respondents */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                Court Forum (न्यायालय स्तर)
              </label>
              <select
                value={courtLevel}
                onChange={(e) => setCourtLevel(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '6px',
                  background: 'rgba(7, 11, 25, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              >
                <option value="District Court">District Court / Civil Judge</option>
                <option value="High Court">High Court (Original / Writ)</option>
                <option value="Supreme Court">Supreme Court of India</option>
                <option value="Consumer Commission">Consumer Commission</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                No. of Respondents / Defendants (प्रतिवादी संख्या)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={numRespondents}
                onChange={(e) => setNumRespondents(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '6px',
                  background: 'rgba(7, 11, 25, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          </div>

          {/* Checkboxes for Add-ons & Exemptions */}
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '8px', marginBottom: '20px', border: '1px solid var(--border-subtle)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.84rem', color: 'var(--text-primary)', cursor: 'pointer', marginBottom: '10px' }}>
              <input
                type="checkbox"
                checked={hasStayApp}
                onChange={(e) => setHasStayApp(e.target.checked)}
                style={{ accentColor: 'var(--gold-primary)', width: '16px', height: '16px' }}
              />
              <span>Includes Interim Stay / Injunction Application (अंतरिम स्थगन आवेदन)</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.84rem', color: '#34D399', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={hasExemption}
                onChange={(e) => setHasExemption(e.target.checked)}
                style={{ accentColor: '#34D399', width: '16px', height: '16px' }}
              />
              <span>Claim Statutory Exemption (Order XXXIII CPC / Legal Aid / Indigent Person)</span>
            </label>
          </div>

          <button
            type="button"
            onClick={calculateFee}
            className="btn-primary"
            style={{ width: '100%', padding: '12px' }}
          >
            <Calculator size={18} /> Calculate Official Court Fee (गणना करें)
          </button>
        </div>

        {/* Right Column: Court Fee Assessment Slip & Breakdown */}
        <div>
          {result ? (
            <div className="glass-card printable-area" style={{ padding: '26px', border: '1px solid var(--gold-border)' }}>
              {/* Slip Header */}
              <div style={{ borderBottom: '2px solid rgba(212, 175, 55, 0.3)', paddingBottom: '16px', marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="gold-badge" style={{ marginBottom: '6px' }}>STATUTORY ASSESSMENT CERTIFICATE</span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-serif)' }}>
                      Court Fee Assessment Slip (कोर्ट फीस विवरण)
                    </h3>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      {result.state} • {result.court_level}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TOTAL STAMPING REQUIRED</div>
                    <div style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--gold-primary)', fontFamily: 'var(--font-mono)' }}>
                      ₹{result.total_court_fee.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Fee Breakdown Table */}
              <div style={{ background: 'rgba(7, 11, 25, 0.6)', borderRadius: '8px', padding: '14px', marginBottom: '18px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', fontSize: '0.86rem', padding: '6px 0', borderBottom: '1px dashed rgba(255,255,255,0.08)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>1. Ad-Valorem Plaint Court Fee (मूल्यानुसार शुल्क):</span>
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                    ₹{result.ad_valorem_fee.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', fontSize: '0.86rem', padding: '6px 0', borderBottom: '1px dashed rgba(255,255,255,0.08)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>2. Fixed Statutory Court Fee (नियत न्यायालय शुल्क):</span>
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                    ₹{result.fixed_court_fee.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', fontSize: '0.86rem', padding: '6px 0', borderBottom: '1px dashed rgba(255,255,255,0.08)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>3. Process Fee / Talbana ({numRespondents} Respondent/Defendant):</span>
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                    ₹{result.process_fee_talbana.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', fontSize: '0.86rem', padding: '6px 0', borderBottom: '1px dashed rgba(255,255,255,0.08)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>4. Advocate Welfare Fund Stamp (अधिवक्ता कल्याण कोष स्टाम्प):</span>
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                    ₹{result.vakalatnama_welfare_stamp.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', fontSize: '0.86rem', padding: '6px 0', borderBottom: '1px dashed rgba(255,255,255,0.08)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>5. Advocates' Clerks Welfare Fund Stamp:</span>
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                    ₹{result.advocate_clerk_welfare_stamp.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', fontSize: '0.86rem', padding: '6px 0', borderBottom: '1px dashed rgba(255,255,255,0.08)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>6. Miscellaneous / Interim Application Stamps:</span>
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                    ₹{result.miscellaneous_stamps.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', fontSize: '0.95rem', padding: '10px 0 4px 0', fontWeight: '700' }}>
                  <span style={{ color: 'var(--gold-light)' }}>GRAND TOTAL (कुल देय स्टाम्प शुल्क):</span>
                  <span style={{ color: 'var(--gold-primary)', fontFamily: 'var(--font-mono)', fontSize: '1.05rem' }}>
                    ₹{result.total_court_fee.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Statutory Citation & Notes */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '600', color: 'var(--gold-light)', marginBottom: '4px' }}>
                  <BookOpen size={14} /> Statutory Authority & Section (विधिक धारा)
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', background: 'rgba(212, 175, 55, 0.08)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(212,175,55,0.2)' }}>
                  {result.statutory_provision}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '600', color: 'var(--accent-cyan)', marginBottom: '4px' }}>
                  <Award size={14} /> Statutory Calculation Logic
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                  {result.formula_explanation}
                </p>
              </div>

              {result.notes_and_exemptions && result.notes_and_exemptions.length > 0 && (
                <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: '600', color: '#34D399', marginBottom: '3px' }}>
                    PRACTICE DIRECTIVES & EXEMPTIONS:
                  </div>
                  {result.notes_and_exemptions.map((n, i) => (
                    <div key={i} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>• {n}</div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
              <Calculator size={40} color="var(--gold-dark)" style={{ marginBottom: '12px' }} />
              <h4 style={{ color: 'var(--text-secondary)' }}>Configure parameters and click Calculate</h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
