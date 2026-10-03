import React, { useState, useEffect } from 'react';
import {
  FileText, Type, Sparkles, Copy, Printer, Download,
  Check, ArrowRightLeft, RefreshCw, BookOpen, Layers,
  Shield, FileCode, CheckCircle, Sliders, Eye
} from 'lucide-react';

const API_BASE = "http://127.0.0.1:8000/api/v1";

export default function DraftingFontStudio() {
  const [activeSubTab, setActiveSubTab] = useState('editor'); // 'editor' | 'converter' | 'ai_draft'
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('bail-anticipatory-bnss-482');
  
  // Editor State
  const [editorText, setEditorText] = useState('');
  const [docTitle, setDocTitle] = useState('Bail_Application_BNSS_482');
  const [currentFontFamily, setCurrentFontFamily] = useState('Bookman Old Style');
  const [currentFontClass, setCurrentFontClass] = useState('font-bookman');
  const [fontSizePt, setFontSizePt] = useState(14);
  const [lineSpacing, setLineSpacing] = useState(1.5);
  const [copied, setCopied] = useState(false);

  // Font Converter State
  const [converterSourceText, setConverterSourceText] = useState('माननीय न्यायालय जिला एवं सत्र न्यायाधीश, जयपुर महानगर\nअग्रिम जमानत प्रार्थना पत्र अंतर्गत धारा 482 भारतीय नागरिक सुरक्षा संहिता, 2023');
  const [converterTargetText, setConverterTargetText] = useState('');
  const [sourceFormat, setSourceFormat] = useState('unicode');
  const [targetFormat, setTargetFormat] = useState('krutidev');
  const [converting, setConverting] = useState(false);
  const [convertCopied, setConvertCopied] = useState(false);

  // AI Legal Draft Assistant State
  const [aiDraftFacts, setAiDraftFacts] = useState('Client Rajesh Verma apprehends arrest in FIR No. 104/2026 registered at P.S. Connaught Place under Section 111 / 316 BNS 2023 (allegations of commercial transaction default projected as cheating). Client was a bona fide business vendor with no criminal antecedents.');
  const [aiClientName, setAiClientName] = useState('Rajesh Verma');
  const [aiOppositeParty, setAiOppositeParty] = useState('State (NCT of Delhi) & Anr.');
  const [aiCourtName, setAiCourtName] = useState('Hon\'ble High Court of Delhi / Sessions Court New Delhi');
  const [aiCategory, setAiCategory] = useState('Criminal');
  const [aiLanguage, setAiLanguage] = useState('en'); // 'en' | 'hi'
  const [aiDraftLoading, setAiDraftLoading] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch(`${API_BASE}/drafting/templates`);
      if (res.ok) {
        const data = await res.json();
        setTemplates(data.templates || []);
        if (data.templates && data.templates.length > 0) {
          loadTemplate(data.templates[0]);
        }
      }
    } catch (e) {
      console.log("Using built-in templates");
    }
  };

  const loadTemplate = (tpl) => {
    setSelectedTemplateId(tpl.id);
    setDocTitle(tpl.title.replace(/[^a-zA-Z0-9_-]/g, '_'));
    setEditorText(tpl.template_text);
    if (tpl.language === 'hi') {
      setCurrentFontFamily('Mangal (मंगल)');
      setCurrentFontClass('font-mangal');
    } else {
      setCurrentFontFamily('Bookman Old Style');
      setCurrentFontClass('font-bookman');
    }
  };

  const handleFontChange = (fontObj) => {
    setCurrentFontFamily(fontObj.name);
    setCurrentFontClass(fontObj.cssClass);
  };

  const handleConvert = async () => {
    setConverting(true);
    try {
      const res = await fetch(`${API_BASE}/fonts/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: converterSourceText,
          source_format: sourceFormat,
          target_format: targetFormat
        })
      });
      if (res.ok) {
        const data = await res.json();
        setConverterTargetText(data.data.converted_text);
      }
    } catch (e) {
      console.error("Font conversion failed:", e);
    } finally {
      setConverting(false);
    }
  };

  const handleApplyConvertedToEditor = () => {
    if (converterTargetText) {
      setEditorText(converterTargetText);
      if (targetFormat === 'krutidev') {
        setCurrentFontFamily('Kruti Dev 010');
        setCurrentFontClass('font-krutidev');
      } else {
        setCurrentFontFamily('Mangal (मंगल)');
        setCurrentFontClass('font-mangal');
      }
      setActiveSubTab('editor');
    }
  };

  const handleGenerateAIDraft = async () => {
    setAiDraftLoading(true);
    try {
      const res = await fetch(`${API_BASE}/drafting/ai-generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: aiCategory,
          case_facts: aiDraftFacts,
          client_name: aiClientName,
          opposite_party: aiOppositeParty,
          court_name: aiCourtName,
          language: aiLanguage,
          font_preference: currentFontFamily,
          preferred_model: "auto"
        })
      });
      if (res.ok) {
        const data = await res.json();
        setEditorText(data.draft_text);
        setDocTitle(`${aiClientName}_${aiCategory}_Pleading`);
        if (aiLanguage === 'hi') {
          setCurrentFontFamily('Mangal (मंगल)');
          setCurrentFontClass('font-mangal');
        } else {
          setCurrentFontFamily('Bookman Old Style');
          setCurrentFontClass('font-bookman');
        }
        setActiveSubTab('editor');
      }
    } catch (e) {
      console.error("AI Draft error:", e);
    } finally {
      setAiDraftLoading(false);
    }
  };

  const handleCopyText = (textToCopy, isConverter = false) => {
    navigator.clipboard.writeText(textToCopy);
    if (isConverter) {
      setConvertCopied(true);
      setTimeout(() => setConvertCopied(false), 2000);
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadDoc = () => {
    const element = document.createElement("a");
    const file = new Blob([editorText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${docTitle || 'Legal_Pleading'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrintPleading = () => {
    window.print();
  };

  const HINDI_FONTS = [
    { name: 'Mangal (मंगल Unicode)', cssClass: 'font-mangal', court: 'Supreme Court & High Court e-Filing Standard' },
    { name: 'Kruti Dev 010 (कृति देव 010)', cssClass: 'font-krutidev', court: 'District Courts (UP, MP, Bihar, Rajasthan, Delhi)' },
    { name: 'DevLys 010 (देवलाइस 010)', cssClass: 'font-devlys', court: 'Subordinate Courts & Tribunal Registry' },
    { name: 'Chanakya (चाणक्य)', cssClass: 'font-chanakya', court: 'Gazette & Official Law Publication Font' },
    { name: 'Shobhika (शोभिका)', cssClass: 'font-shobhika', court: 'Academic & Legislative Devanagari Standard' },
    { name: 'Kokila (कोकिला)', cssClass: 'font-kokila', court: 'High Court Official Notifications' },
    { name: 'Aparajita (अपराजिता)', cssClass: 'font-aparajita', court: 'Civil Petitions & Written Arguments' }
  ];

  const ENGLISH_FONTS = [
    { name: 'Bookman Old Style', cssClass: 'font-bookman', court: 'Official Supreme Court of India & High Courts Mandate' },
    { name: 'Times New Roman', cssClass: 'font-times', court: 'Universal Indian High Court Pleadings (14pt)' },
    { name: 'EB Garamond', cssClass: 'font-garamond', court: 'Arbitration & Commercial Court Claims' },
    { name: 'Georgia', cssClass: 'font-georgia', court: 'Appellate Memos & Legal Opinions' },
    { name: 'Century Schoolbook', cssClass: 'font-schoolbook', court: 'Constitution Bench Memoranda' },
    { name: 'Courier New', cssClass: 'font-courier', court: 'Trial Court Depositions & Charge Sheet Evidence' }
  ];

  return (
    <div style={{ padding: '24px 0' }}>
      {/* Studio Banner */}
      <div className="glass-card" style={{ padding: '22px 28px', marginBottom: '20px', borderLeft: '4px solid var(--gold-primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <Type size={26} color="var(--gold-primary)" />
              <h2 style={{ fontSize: '1.45rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-serif)' }}>
                Legal Drafting & Font Studio (विधिक ड्राफ्टिंग एवं फॉन्ट स्टूडियो)
              </h2>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0 }}>
              Authentic Indian Court Fonts (Kruti Dev 010, DevLys, Mangal, Bookman Old Style), Unicode Font Converter, Bilingual Templates & AI Petition Generator.
            </p>
          </div>

          {/* Sub Tab Switcher */}
          <div style={{ display: 'flex', background: 'rgba(0, 0, 0, 0.35)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setActiveSubTab('editor')}
              style={{
                padding: '7px 15px',
                borderRadius: '6px',
                fontSize: '0.84rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                background: activeSubTab === 'editor' ? 'var(--gold-primary)' : 'transparent',
                color: activeSubTab === 'editor' ? '#070B19' : 'var(--text-secondary)'
              }}
            >
              ✍️ Court Editor (ड्राफ्टिंग)
            </button>
            <button
              onClick={() => setActiveSubTab('converter')}
              style={{
                padding: '7px 15px',
                borderRadius: '6px',
                fontSize: '0.84rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                background: activeSubTab === 'converter' ? 'var(--gold-primary)' : 'transparent',
                color: activeSubTab === 'converter' ? '#070B19' : 'var(--text-secondary)'
              }}
            >
              🔄 Unicode ↔ Kruti Dev (फॉन्ट कनवर्टर)
            </button>
            <button
              onClick={() => setActiveSubTab('ai_draft')}
              style={{
                padding: '7px 15px',
                borderRadius: '6px',
                fontSize: '0.84rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                background: activeSubTab === 'ai_draft' ? 'var(--gold-primary)' : 'transparent',
                color: activeSubTab === 'ai_draft' ? '#070B19' : 'var(--text-secondary)'
              }}
            >
              ✨ AI Petition Generator (AI याचिका लेखक)
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: Main Court Editor with Typography Controls */}
      {activeSubTab === 'editor' && (
        <div style={{ display: 'grid', gridTemplateColumns: '290px 1fr', gap: '20px' }}>
          {/* Left Panel: Templates & Fonts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Pre-built Templates Card */}
            <div className="glass-card" style={{ padding: '18px' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--gold-light)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BookOpen size={16} /> Court Templates (विधिक प्रारूप)
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '280px', overflowY: 'auto' }}>
                {templates.map(tpl => (
                  <button
                    key={tpl.id}
                    onClick={() => loadTemplate(tpl)}
                    style={{
                      textAlign: 'left',
                      padding: '9px 12px',
                      borderRadius: '6px',
                      background: selectedTemplateId === tpl.id ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      border: selectedTemplateId === tpl.id ? '1px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                      color: selectedTemplateId === tpl.id ? 'var(--gold-light)' : 'var(--text-secondary)',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontWeight: '600', marginBottom: '2px', color: selectedTemplateId === tpl.id ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {tpl.title}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {tpl.category} • {tpl.language.toUpperCase()}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Typography Selector Card */}
            <div className="glass-card" style={{ padding: '18px' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--gold-light)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Type size={16} /> Court Fonts (न्यायालय फॉन्ट)
              </h4>

              {/* Hindi Fonts */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  हिंदी न्यायालय फॉन्ट (Devanagari)
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {HINDI_FONTS.map(f => (
                    <button
                      key={f.name}
                      onClick={() => handleFontChange(f)}
                      style={{
                        textAlign: 'left',
                        padding: '6px 10px',
                        borderRadius: '5px',
                        background: currentFontFamily === f.name ? 'rgba(212, 175, 55, 0.25)' : 'transparent',
                        border: currentFontFamily === f.name ? '1px solid var(--gold-primary)' : '1px solid transparent',
                        color: currentFontFamily === f.name ? 'var(--gold-light)' : 'var(--text-primary)',
                        fontSize: '0.82rem',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontWeight: '600' }}>{f.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{f.court}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* English Fonts */}
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  English Legal Typography (Supreme Court Standard)
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {ENGLISH_FONTS.map(f => (
                    <button
                      key={f.name}
                      onClick={() => handleFontChange(f)}
                      style={{
                        textAlign: 'left',
                        padding: '6px 10px',
                        borderRadius: '5px',
                        background: currentFontFamily === f.name ? 'rgba(212, 175, 55, 0.25)' : 'transparent',
                        border: currentFontFamily === f.name ? '1px solid var(--gold-primary)' : '1px solid transparent',
                        color: currentFontFamily === f.name ? 'var(--gold-light)' : 'var(--text-primary)',
                        fontSize: '0.82rem',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontWeight: '600' }}>{f.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{f.court}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Active Drafting Canvas & Formatting Toolbar */}
          <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Formatting Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', background: 'rgba(7, 11, 25, 0.7)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              {/* Font Badge & Size */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="gold-badge" style={{ fontSize: '0.74rem' }}>
                  FONT: {currentFontFamily}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Size:</span>
                  {[12, 14, 16].map(sz => (
                    <button
                      key={sz}
                      onClick={() => setFontSizePt(sz)}
                      style={{
                        padding: '2px 7px',
                        borderRadius: '4px',
                        fontSize: '0.76rem',
                        fontWeight: '600',
                        background: fontSizePt === sz ? 'var(--gold-primary)' : 'rgba(255,255,255,0.08)',
                        color: fontSizePt === sz ? '#070B19' : 'var(--text-secondary)',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {sz}pt
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Line Spacing:</span>
                  {[1.15, 1.5, 2.0].map(sp => (
                    <button
                      key={sp}
                      onClick={() => setLineSpacing(sp)}
                      style={{
                        padding: '2px 7px',
                        borderRadius: '4px',
                        fontSize: '0.76rem',
                        fontWeight: '600',
                        background: lineSpacing === sp ? 'var(--gold-primary)' : 'rgba(255,255,255,0.08)',
                        color: lineSpacing === sp ? '#070B19' : 'var(--text-secondary)',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {sp === 1.5 ? '1.5 (HC Rule)' : `${sp}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleCopyText(editorText)}
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                >
                  {copied ? <Check size={14} color="#34D399" /> : <Copy size={14} />} {copied ? 'Copied!' : 'Copy Text'}
                </button>
                <button
                  onClick={handleDownloadDoc}
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                >
                  <Download size={14} /> Export File
                </button>
                <button
                  onClick={handlePrintPleading}
                  className="btn-primary"
                  style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                >
                  <Printer size={14} /> Court Print
                </button>
              </div>
            </div>

            {/* Simulated Legal Document Canvas */}
            <div className="court-margin-guide printable-area">
              <textarea
                value={editorText}
                onChange={(e) => setEditorText(e.target.value)}
                className={`legal-paper-dark ${currentFontClass}`}
                style={{
                  width: '100%',
                  minHeight: '650px',
                  fontSize: `${fontSizePt}px`,
                  lineHeight: `${lineSpacing}`,
                  borderRadius: '6px',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  outline: 'none',
                  resize: 'vertical',
                  whiteSpace: 'pre-wrap',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Real-time Unicode <-> Kruti Dev / DevLys Font Converter */}
      {activeSubTab === 'converter' && (
        <div className="glass-card" style={{ padding: '26px' }}>
          <div style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--gold-light)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ArrowRightLeft size={20} /> Bi-Directional Legal Font Converter (यूनिकोड ↔ कृति देव 010 कनवर्टर)
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
              Instantly converts text between Unicode (Mangal/Noto Sans) and Legacy Remington Court Fonts (Kruti Dev 010 / DevLys 010 / Chanakya).
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Source Box */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.84rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                  Source Format (स्रोत प्रारूप):
                </label>
                <select
                  value={sourceFormat}
                  onChange={(e) => setSourceFormat(e.target.value)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '5px',
                    background: '#0D1527',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--gold-light)',
                    fontSize: '0.82rem'
                  }}
                >
                  <option value="unicode">Unicode (Mangal / Devanagari)</option>
                  <option value="krutidev">Kruti Dev 010 (कृति देव)</option>
                  <option value="devlys">DevLys 010 (देवलाइस)</option>
                </select>
              </div>

              <textarea
                value={converterSourceText}
                onChange={(e) => setConverterSourceText(e.target.value)}
                placeholder="Type or paste Hindi / Unicode text here..."
                style={{
                  width: '100%',
                  height: '320px',
                  padding: '14px',
                  borderRadius: '8px',
                  background: 'rgba(7, 11, 25, 0.85)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  fontFamily: sourceFormat === 'unicode' ? 'font-mangal' : 'font-krutidev',
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Target Box */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.84rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                  Target Format (लक्षित प्रारूप):
                </label>
                <select
                  value={targetFormat}
                  onChange={(e) => setTargetFormat(e.target.value)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '5px',
                    background: '#0D1527',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--gold-light)',
                    fontSize: '0.82rem'
                  }}
                >
                  <option value="krutidev">Kruti Dev 010 (कृति देव)</option>
                  <option value="unicode">Unicode (Mangal / Devanagari)</option>
                  <option value="devlys">DevLys 010 (देवलाइस)</option>
                </select>
              </div>

              <textarea
                value={converterTargetText}
                readOnly
                placeholder="Converted text will appear here automatically..."
                style={{
                  width: '100%',
                  height: '320px',
                  padding: '14px',
                  borderRadius: '8px',
                  background: 'rgba(7, 11, 25, 0.85)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  color: 'var(--gold-light)',
                  fontSize: '0.95rem',
                  fontFamily: targetFormat === 'unicode' ? 'font-mangal' : 'font-krutidev',
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={handleConvert}
                className="btn-primary"
                style={{ padding: '10px 22px' }}
              >
                <RefreshCw size={16} className={converting ? "animate-spin" : ""} /> Convert Font (रूपांतरित करें)
              </button>

              <button
                type="button"
                onClick={() => {
                  const temp = sourceFormat;
                  setSourceFormat(targetFormat);
                  setTargetFormat(temp);
                  setConverterSourceText(converterTargetText || converterSourceText);
                  setConverterTargetText('');
                }}
                className="btn-secondary"
              >
                <ArrowRightLeft size={15} /> Swap Direction
              </button>
            </div>

            {converterTargetText && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => handleCopyText(converterTargetText, true)}
                  className="btn-secondary"
                >
                  {convertCopied ? <Check size={15} color="#34D399" /> : <Copy size={15} />} {convertCopied ? 'Copied Converted Text!' : 'Copy Converted Text'}
                </button>

                <button
                  type="button"
                  onClick={handleApplyConvertedToEditor}
                  className="btn-primary"
                  style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#FFF' }}
                >
                  <CheckCircle size={15} /> Open in Drafting Editor
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: AI Legal Petition & Pleading Generator */}
      {activeSubTab === 'ai_draft' && (
        <div className="glass-card" style={{ padding: '26px' }}>
          <div style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={22} color="var(--gold-primary)" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                AI Legal Petition & Notice Generator (एआई विधिक याचिका लेखक)
              </h3>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
              Generates formal court-ready pleadings customized with case facts, 2024 Sanhita statutory citations (BNS/BNSS/BSA), and binding Supreme Court precedents.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            {/* Court Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Target Court / Tribunal (न्यायालय का नाम):
              </label>
              <input
                type="text"
                value={aiCourtName}
                onChange={(e) => setAiCourtName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '6px',
                  background: 'rgba(7, 11, 25, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.88rem'
                }}
              />
            </div>

            {/* Category & Language */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Pleading Category:
                </label>
                <select
                  value={aiCategory}
                  onChange={(e) => setAiCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '6px',
                    background: 'rgba(7, 11, 25, 0.8)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '0.88rem'
                  }}
                >
                  <option value="Criminal">Criminal (Bail / Quashing / 138 NI)</option>
                  <option value="Civil">Civil (Plaint / Written Statement / Injunction)</option>
                  <option value="Constitutional">Constitutional (Writ Art 226 / 32)</option>
                  <option value="Notice">Legal Notice of Demand</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Target Language:
                </label>
                <select
                  value={aiLanguage}
                  onChange={(e) => setAiLanguage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '6px',
                    background: 'rgba(7, 11, 25, 0.8)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '0.88rem'
                  }}
                >
                  <option value="en">English (Court Standard)</option>
                  <option value="hi">Hindi (शुद्ध विधिक हिंदी)</option>
                </select>
              </div>
            </div>

            {/* Parties */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Petitioner / Applicant Name:
              </label>
              <input
                type="text"
                value={aiClientName}
                onChange={(e) => setAiClientName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '6px',
                  background: 'rgba(7, 11, 25, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.88rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Respondent / Opposite Party:
              </label>
              <input
                type="text"
                value={aiOppositeParty}
                onChange={(e) => setAiOppositeParty(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '6px',
                  background: 'rgba(7, 11, 25, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.88rem'
                }}
              />
            </div>
          </div>

          {/* Case Facts Narrative */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Case Facts, Timeline & Relief Sought (तथ्य, घटनाक्रम एवं मांगी गई राहत):
            </label>
            <textarea
              value={aiDraftFacts}
              onChange={(e) => setAiDraftFacts(e.target.value)}
              placeholder="Enter brief facts, FIR details, allegations, arguments, or defense points..."
              style={{
                width: '100%',
                height: '140px',
                padding: '12px',
                borderRadius: '8px',
                background: 'rgba(7, 11, 25, 0.85)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="button"
            onClick={handleGenerateAIDraft}
            disabled={aiDraftLoading}
            className="btn-primary"
            style={{ padding: '12px 28px', fontSize: '0.92rem' }}
          >
            <Sparkles size={18} className={aiDraftLoading ? "animate-spin" : ""} />
            {aiDraftLoading ? "Generating Court-Ready Pleading..." : "Generate Court Pleading & Open in Editor"}
          </button>
        </div>
      )}
    </div>
  );
}
