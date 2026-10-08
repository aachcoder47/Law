import React, { useState, useEffect } from 'react';
import {
  FileText, UploadCloud, Sparkles, Target, Shield, AlertTriangle,
  CheckCircle, Copy, Printer, Download, RefreshCw, MessageSquare,
  HelpCircle, ChevronRight, BookOpen, Layers, Scale, Eye, UserCheck,
  Cpu, Award, Send
} from 'lucide-react';

const API_BASE = "http://127.0.0.1:8000/api/v1";

export default function PdfPromptStudio({ uploadedDocs = [], onDocUploaded }) {
  const [selectedDocId, setSelectedDocId] = useState('');
  const [customFile, setCustomFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  // Prompt configuration
  const [promptType, setPromptType] = useState('cross_examination'); // cross_examination | contradictions | bail_grounds | quashing_grounds | custom
  const [witnessType, setWitnessType] = useState('investigating_officer');
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('consensus'); // consensus | claude | openai | gemini | deepseek | qwen | minimax
  const [language, setLanguage] = useState('hi'); // 'hi' | 'en'

  // Results state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // Set default document if available
  useEffect(() => {
    if (uploadedDocs.length > 0 && !selectedDocId) {
      setSelectedDocId(uploadedDocs[0].id);
    }
  }, [uploadedDocs]);

  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    setUploadStatus('Uploading & indexing legal document...');
    const formData = new FormData();
    formData.append('files', file);
    formData.append('category', 'Case Docket / Trial Record');
    formData.append('language', language);
    formData.append('case_name', file.name.replace(/\.[^/.]+$/, ""));

    try {
      const res = await fetch(`${API_BASE}/documents/upload`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setUploadStatus('Document uploaded and indexed successfully!');
        if (onDocUploaded) onDocUploaded();
        if (data.documents && data.documents.length > 0) {
          setSelectedDocId(data.documents[0].id);
        }
        setTimeout(() => setUploadStatus(''), 3000);
      } else {
        setUploadStatus('Upload failed. Please check backend.');
      }
    } catch (e) {
      setUploadStatus('Error: ' + e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleExecutePrompt = async () => {
    if (!selectedDocId) {
      alert("Please select or upload a legal PDF document first.");
      return;
    }
    setLoading(true);
    setResult(null);

    try {
      const payload = {
        doc_id: selectedDocId,
        prompt_type: promptType,
        witness_type: witnessType,
        custom_prompt: customPrompt,
        model_preference: selectedModel,
        language: language
      };

      const res = await fetch(`${API_BASE}/pdf/prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        const err = await res.json();
        alert(err.detail || "Failed to execute legal prompt.");
      }
    } catch (e) {
      console.error("PDF Prompt error:", e);
      alert("Error contacting legal prompt engine: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result?.response_text) {
      navigator.clipboard.writeText(result.response_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const activeDoc = uploadedDocs.find(d => d.id === selectedDocId);

  return (
    <div style={{ padding: '20px 0' }}>
      {/* Studio Header Banner */}
      <div className="glass-card" style={{ padding: '24px 30px', marginBottom: '24px', borderLeft: '4px solid var(--gold-primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <Sparkles size={26} color="var(--gold-primary)" />
              <h2 style={{ fontSize: '1.45rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-serif)' }}>
                Legal PDF Studio & Prompt Engine (विधिक पीडीएफ एवं प्रॉम्प्ट स्टूडियो)
              </h2>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0 }}>
              Upload any Case PDF (FIR, Charge Sheet, 161 Statements, Trial Brief) & execute advanced courtroom prompts (Cross-Examination, Contradictions, Bail, Quashing) using Multi-Model AI.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span className="gold-badge" style={{ fontSize: '0.78rem', background: 'rgba(212, 175, 55, 0.15)', borderColor: 'var(--gold-border)' }}>
              🏛️ Multi-Model Consensus Verified
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 420px) 1fr', gap: '24px' }}>
        
        {/* Left Control Column: Document Upload & Prompt Selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Step 1: Upload or Select Document */}
          <div className="glass-card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
              <span style={{ background: 'var(--gold-primary)', color: '#000', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 'bold' }}>1</span>
              <h3 style={{ fontSize: '0.96rem', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>
                Upload or Select Legal PDF / Brief
              </h3>
            </div>

            {/* Drop / Browse Area */}
            <div
              onClick={() => document.getElementById('studio-pdf-input').click()}
              style={{
                border: '1.5px dashed var(--gold-border)',
                borderRadius: '8px',
                padding: '18px 14px',
                textAlign: 'center',
                background: 'rgba(9, 17, 34, 0.5)',
                cursor: 'pointer',
                marginBottom: '14px'
              }}
            >
              <input
                id="studio-pdf-input"
                type="file"
                accept=".pdf,.txt,.doc,.docx"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
                style={{ display: 'none' }}
              />
              <UploadCloud size={28} color="var(--gold-primary)" style={{ margin: '0 auto 6px auto' }} />
              <p style={{ fontSize: '0.84rem', fontWeight: '600', color: '#FFF', margin: '0 0 2px 0' }}>
                Click to Upload Case PDF / Record
              </p>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
                FIR, Charge Sheet 173, Sec 161/164, MLC or Judgment
              </p>
            </div>

            {uploadStatus && (
              <div style={{ fontSize: '0.78rem', color: uploading ? 'var(--gold-light)' : '#10B981', marginBottom: '12px', textAlign: 'center' }}>
                {uploadStatus}
              </div>
            )}

            {/* Select from existing */}
            {uploadedDocs.length > 0 && (
              <div>
                <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Or Choose from Active Case Exhibits ({uploadedDocs.length}):
                </label>
                <select
                  value={selectedDocId}
                  onChange={(e) => setSelectedDocId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: '#091122',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    color: '#FFF',
                    fontSize: '0.82rem'
                  }}
                >
                  {uploadedDocs.map(d => (
                    <option key={d.id} value={d.id}>
                      [{d.category || 'PDF'}] {d.title || d.filename}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {activeDoc && (
              <div style={{ marginTop: '10px', padding: '8px 12px', background: 'rgba(56, 189, 248, 0.08)', borderRadius: '6px', border: '1px solid rgba(56, 189, 248, 0.2)', fontSize: '0.76rem', color: '#38BDF8' }}>
                📄 <b>Selected:</b> {activeDoc.title} ({activeDoc.word_count || 'Parsed'} words)
              </div>
            )}
          </div>

          {/* Step 2: Choose Prompt & Strategy */}
          <div className="glass-card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
              <span style={{ background: 'var(--gold-primary)', color: '#000', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 'bold' }}>2</span>
              <h3 style={{ fontSize: '0.96rem', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>
                Select Legal Action & Prompt Preset
              </h3>
            </div>

            {/* Prompt Type Pills */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', marginBottom: '16px' }}>
              {[
                { id: 'cross_examination', label: '🎯 Courtroom Cross-Exam (जिरह प्रश्न बैंक)', desc: 'Impeach witness credit under Sec 145/146/155 BSA / IEA' },
                { id: 'contradictions', label: '⚡ Contradictions & Omissions (विरोधाभास)', desc: 'Scan FIR vs 161 statements vs MLC contradictions' },
                { id: 'bail_grounds', label: '🛡️ Bail Defense Grounds (जमानत के आधार)', desc: 'Grounds under BNSS 482/483 & CrPC 438/439' },
                { id: 'quashing_grounds', label: '⚖️ FIR Quashing Grounds (धारा 528 BNSS / 482)', desc: 'Apply Bhajan Lal parameters for quashing' },
                { id: 'custom', label: '💬 Custom Legal Prompt (कस्टम सवाल)', desc: 'Ask any specific legal analysis question' }
              ].map(pt => (
                <button
                  key={pt.id}
                  onClick={() => setPromptType(pt.id)}
                  style={{
                    padding: '10px 12px',
                    textAlign: 'left',
                    borderRadius: '8px',
                    background: promptType === pt.id ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255,255,255,0.03)',
                    border: promptType === pt.id ? '1px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                    color: promptType === pt.id ? 'var(--gold-light)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ fontSize: '0.84rem', fontWeight: '600', color: promptType === pt.id ? '#FFF' : 'var(--text-primary)' }}>
                    {pt.label}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {pt.desc}
                  </div>
                </button>
              ))}
            </div>

            {/* Witness Selection if Cross-Exam */}
            {promptType === 'cross_examination' && (
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Target Witness to Cross-Examine (गवाह का प्रकार):
                </label>
                <select
                  value={witnessType}
                  onChange={(e) => setWitnessType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: '#091122',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    color: '#FFF',
                    fontSize: '0.82rem'
                  }}
                >
                  <option value="investigating_officer">👮 Investigating Officer (I.O. / विवेचनाधिकारी)</option>
                  <option value="eye_witness">👀 Eye Witness (PW / चश्मदीद गवाह)</option>
                  <option value="complainant">📢 Informant / Complainant (वादी / परिवादी)</option>
                  <option value="medical_doctor">🩺 Medical Doctor / Autopsy Surgeon (डॉक्टर / एमएलसी)</option>
                  <option value="panch_witness">📦 Seizure & Recovery Witness (पंच गवाह / जब्ती)</option>
                  <option value="hostile_witness">⚠️ Adverse / Hostile Witness (पक्षद्रोही गवाह)</option>
                </select>
              </div>
            )}

            {/* Custom Prompt Box */}
            {promptType === 'custom' && (
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Enter Specific Legal Prompt or Question:
                </label>
                <textarea
                  rows={3}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g., Examine paragraph 4 of the charge sheet and formulate 8 questions to grill the IO on the recovery of the weapon..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#091122',
                    border: '1px solid var(--gold-border)',
                    borderRadius: '6px',
                    color: '#FFF',
                    fontSize: '0.82rem',
                    resize: 'vertical'
                  }}
                />
              </div>
            )}

            {/* Model & Language Controls */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '18px' }}>
              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  AI Model Engine:
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    background: '#091122',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    color: '#FFF',
                    fontSize: '0.8rem'
                  }}
                >
                  <option value="consensus">🏛️ Consensus Arbiter (All Models)</option>
                  <option value="claude">🟣 Claude 3.7 / 5 (Anthropic)</option>
                  <option value="openai">🟢 ChatGPT Advanced (GPT-4o)</option>
                  <option value="gemini">🔵 Google Gemini 2.5 Pro</option>
                  <option value="deepseek">🐋 DeepSeek R1 / V3</option>
                  <option value="qwen">🟠 Qwen 2.5 Max</option>
                  <option value="minimax">🔴 MiniMax-01</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Output Language:
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    background: '#091122',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    color: '#FFF',
                    fontSize: '0.8rem'
                  }}
                >
                  <option value="hi">हिंदी (Legal Devanagari)</option>
                  <option value="en">English (Court Standard)</option>
                </select>
              </div>
            </div>

            {/* Run Button */}
            <button
              onClick={handleExecutePrompt}
              disabled={loading || !selectedDocId}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.92rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  <span>Cross-Analyzing Legal Record...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Execute Legal Prompt</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Output Column: Courtroom Results Display */}
        <div>
          {result ? (
            <div className="glass-card" style={{ padding: '26px' }}>
              
              {/* Output Action Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="gold-badge" style={{ fontSize: '0.74rem', background: 'rgba(212,175,55,0.15)' }}>
                      {result.prompt_type.replace('_', ' ').toUpperCase()}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      Model: <b>{result.model_used}</b>
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', color: '#FFF', margin: '6px 0 0 0', fontFamily: 'var(--font-serif)' }}>
                    Generated Legal Strategy & Courtroom Brief
                  </h3>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handleCopy}
                    className="btn-secondary"
                    style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    {copied ? <CheckCircle size={15} color="#10B981" /> : <Copy size={15} />}
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="btn-secondary"
                    style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Printer size={15} />
                    <span>Print</span>
                  </button>
                </div>
              </div>

              {/* Consensus Details Banner if present */}
              {result.consensus_details && (
                <div style={{ marginBottom: '20px', padding: '14px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', fontWeight: '600', color: '#34D399' }}>
                      <Award size={16} /> Multi-Model Consensus Agreement: {result.consensus_details.consensus_score}%
                    </div>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      Evaluated across 6 AI Architectures
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    <b>Unanimous Grounding:</b> {result.consensus_details.unanimous_agreements?.[0]}
                  </div>
                </div>
              )}

              {/* Main Response Markdown in Court Typography */}
              <div
                style={{
                  fontFamily: language === 'hi' ? "'Mangal', 'Shobhika', sans-serif" : "'Bookman Old Style', 'Times New Roman', serif",
                  fontSize: '0.96rem',
                  lineHeight: '1.75',
                  color: '#E2E8F0',
                  whiteSpace: 'pre-wrap',
                  background: 'rgba(4, 8, 18, 0.6)',
                  padding: '24px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.06)'
                }}
              >
                {result.response_text}
              </div>

              {/* Statutory Footnote */}
              <div style={{ marginTop: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                <span>⚖️ Grounded in Bharatiya Sakshya Adhiniyam, 2023 & Indian Evidence Act, 1872</span>
                <span>Grounded on document: {result.documents_included?.join(', ')}</span>
              </div>

            </div>
          ) : (
            <div className="glass-card" style={{ padding: '60px 30px', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', border: '1px solid var(--gold-border)' }}>
                <Target size={32} color="var(--gold-primary)" />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: '#FFF', marginBottom: '8px', fontFamily: 'var(--font-serif)' }}>
                Legal PDF Prompt Studio Ready
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 20px auto' }}>
                Select an uploaded case brief or PDF on the left, pick an action (Cross-Examination, Contradictions, Bail, Quashing) or type a custom prompt, and click <b>Execute Legal Prompt</b>.
              </p>
              <div style={{ display: 'inline-flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <span className="gold-badge" style={{ fontSize: '0.74rem' }}>🎯 Cross-Examination Generator</span>
                <span className="gold-badge" style={{ fontSize: '0.74rem' }}>⚡ Contradiction Spotter</span>
                <span className="gold-badge" style={{ fontSize: '0.74rem' }}>🛡️ Bail Grounds</span>
                <span className="gold-badge" style={{ fontSize: '0.74rem' }}>🏛️ Multi-Model Consensus</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
