import React, { useState, useEffect } from 'react';
import {
  Scale, Shield, Search, BookOpen, FileText, CheckCircle, AlertTriangle,
  ExternalLink, Copy, Printer, Bookmark, Sparkles, Filter, ChevronRight,
  Database, RefreshCw, Landmark, ArrowRightLeft, Eye, Award, Check, Settings,
  MessageSquare, Send, X, Key, Info, UploadCloud, Trash2, Globe, FilePlus, FileCheck,
  Languages, FolderOpen, FileCode, Layers, Download, Target, FileDown, Calculator, Type
} from 'lucide-react';

import CourtFeeCalculator from './components/CourtFeeCalculator';
import DraftingFontStudio from './components/DraftingFontStudio';
import LegalEcosystemHub from './components/LegalEcosystemHub';
import PdfPromptStudio from './components/PdfPromptStudio';
import IndianLawLibraryCompare from './components/IndianLawLibraryCompare';
import MultiModelConsensusHub from './components/MultiModelConsensusHub';

const API_BASE = "http://127.0.0.1:8000/api/v1";

export default function App() {
  const [activeTab, setActiveTab] = useState('research'); // 'research' | 'calculator' | 'drafting' | 'documents' | 'compare' | 'transitions' | 'ecosystem' | 'history'

  const [query, setQuery] = useState('Can a High Court grant anticipatory bail under Indian law?');
  const [preferredModel, setPreferredModel] = useState('auto');
  const [localOnly, setLocalOnly] = useState(false);
  const [languageMode, setLanguageMode] = useState('en'); // 'en' | 'hi' | 'hinglish'
  const [selectedSources, setSelectedSources] = useState([
    'Uploaded Laws & Case Documents',
    'Indian Kanoon',
    'India Code (Legislative Department)',
    'Supreme Court of India (e-SCR Portal)',
    'High Courts of India',
    'Law Commission of India'
  ]);
  const [filterCourt, setFilterCourt] = useState('all');
  const [filterBench, setFilterBench] = useState('all');

  const [loading, setLoading] = useState(false);
  const [researchData, setResearchData] = useState(null);
  const [activeCitation, setActiveCitation] = useState(null);
  const [copied, setCopied] = useState(false);
  const [savedMemos, setSavedMemos] = useState([]);
  const [transitionsList, setTransitionsList] = useState([]);
  const [backendStatus, setBackendStatus] = useState({ connected: false, keys_configured: {} });

  // Document Manager States
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [docCategory, setDocCategory] = useState('Statute');
  const [docLangOverride, setDocLangOverride] = useState('auto');
  const [uploading, setUploading] = useState(false);
  const [uploadStatusMsg, setUploadStatusMsg] = useState('');
  const [docSearch, setDocSearch] = useState('');

  // Document Analysis & Preview Modal States
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [analyzingDoc, setAnalyzingDoc] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  // Cross-Examination States (जिरह एवं प्रतिपरीक्षा)
  const [showCrossExamModal, setShowCrossExamModal] = useState(false);
  const [crossExamLoading, setCrossExamLoading] = useState(false);
  const [crossExamData, setCrossExamData] = useState(null);
  const [crossExamDoc, setCrossExamDoc] = useState(null);
  const [crossExamWitness, setCrossExamWitness] = useState('auto');
  const [crossExamLang, setCrossExamLang] = useState('hi');
  const [uploadCaseName, setUploadCaseName] = useState('FIR No. 104/2024 State v. Accused');
  const [selectedDocIds, setSelectedDocIds] = useState([]);



  // Settings & API Keys Modal State
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    gemini_key: '',
    groq_key: '',
    openai_key: '',
    anthropic_key: '',
    deepseek_key: '',
    qwen_key: '',
    minimax_key: '',
    indian_kanoon_key: '',
    ollama_url: 'http://localhost:11434'
  });
  const [keysSaving, setKeysSaving] = useState(false);
  const [keysSavedMsg, setKeysSavedMsg] = useState('');

  // Interactive AI Legal Follow-Up Chat State
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Ask any follow-up question regarding the legal propositions, conditions, exceptions, or factual application.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Comparison Tab State
  const [compareCase1, setCompareCase1] = useState('sc-2020-sushila-aggarwal');
  const [compareCase2, setCompareCase2] = useState('sc-1996-salauddin-shaikh');
  const [comparisonResult, setComparisonResult] = useState(null);
  const [compareLoading, setCompareLoading] = useState(false);

  // Transition filter
  const [transitionSearch, setTransitionSearch] = useState('');

  // Initial data fetch
  useEffect(() => {
    checkHealth();
    fetchTransitions();
    fetchUploadedDocs();
    handleSearch('Can a High Court grant anticipatory bail under Indian law?');
  }, []);

  const checkHealth = async () => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (res.ok) {
        const data = await res.json();
        setBackendStatus({ connected: true, ...data });
        setLocalOnly(data.local_only_mode);
      }
    } catch (e) {
      console.error("Backend offline:", e);
      setBackendStatus({ connected: false, keys_configured: {} });
    }
  };

  const fetchTransitions = async () => {
    try {
      const res = await fetch(`${API_BASE}/transition`);
      if (res.ok) {
        const data = await res.json();
        setTransitionsList(data.transitions || []);
      }
    } catch (e) {
      console.error("Failed to load transitions:", e);
    }
  };

  const fetchUploadedDocs = async () => {
    try {
      const res = await fetch(`${API_BASE}/documents`);
      if (res.ok) {
        const data = await res.json();
        setUploadedDocs(data.documents || []);
      }
    } catch (e) {
      console.error("Failed to fetch documents:", e);
    }
  };

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadStatusMsg('Parsing document text & Devanagari Hindi script...');

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    formData.append('category', docCategory);
    formData.append('language', docLangOverride);
    formData.append('case_name', uploadCaseName);

    try {
      const res = await fetch(`${API_BASE}/documents/upload`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setUploadStatusMsg(data.message || 'Successfully uploaded and indexed document(s)!');
        await fetchUploadedDocs();
        setTimeout(() => setUploadStatusMsg(''), 3500);
      } else {
        setUploadStatusMsg('Failed to upload document. Please check backend.');
      }
    } catch (e) {
      setUploadStatusMsg('Error uploading document: ' + e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleMultiDocCrossExam = async (witnessOverride, langOverride) => {
    if (selectedDocIds.length === 0) return;
    const targetWitness = witnessOverride || crossExamWitness || 'auto';
    const targetLang = langOverride || crossExamLang || 'hi';
    setCrossExamWitness(targetWitness);
    setCrossExamLang(targetLang);
    setCrossExamDoc({ title: `${uploadCaseName || 'Combined Case'} (${selectedDocIds.length} Case Exhibits)` });
    setShowCrossExamModal(true);
    setCrossExamLoading(true);
    setCrossExamData(null);

    try {
      const res = await fetch(`${API_BASE}/cases/multi-cross-examination`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doc_ids: selectedDocIds,
          case_name: uploadCaseName || "Multi-Document Case Dossier",
          witness_type: targetWitness,
          language: targetLang
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCrossExamData(data);
      }
    } catch (e) {
      console.error("Multi-doc cross-exam error:", e);
    } finally {
      setCrossExamLoading(false);
    }
  };


  const handleDeleteDoc = async (docId) => {
    try {
      const res = await fetch(`${API_BASE}/documents/${docId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await fetchUploadedDocs();
      }
    } catch (e) {
      console.error("Delete document error:", e);
    }
  };

  const handleAnalyzeDoc = async (doc) => {
    setAnalyzingDoc(true);
    setShowAnalysisModal(true);
    setAnalysisData(null);
    try {
      const res = await fetch(`${API_BASE}/documents/${doc.id}/analyze?language=${languageMode}`, {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        setAnalysisData(data);
      }
    } catch (e) {
      console.error("Analysis request error:", e);
    } finally {
      setAnalyzingDoc(false);
    }
  };

  const handleOpenCrossExam = async (doc, witnessOverride, langOverride) => {
    const targetWitness = witnessOverride || crossExamWitness || 'auto';
    const targetLang = langOverride || (doc?.language === 'hi' ? 'hi' : crossExamLang) || 'hi';
    if (doc) setCrossExamDoc(doc);
    const activeDoc = doc || crossExamDoc;
    if (!activeDoc) return;

    setCrossExamWitness(targetWitness);
    setCrossExamLang(targetLang);
    setShowCrossExamModal(true);
    setCrossExamLoading(true);
    setCrossExamData(null);

    try {
      const res = await fetch(`${API_BASE}/documents/${activeDoc.id}/cross-examination`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          witness_type: targetWitness,
          language: targetLang
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCrossExamData(data);
      }
    } catch (e) {
      console.error("Cross-examination request error:", e);
    } finally {
      setCrossExamLoading(false);
    }
  };

  const handleDownloadCrossExamPDF = () => {
    if (!crossExamData?.cross_examination_markdown) return;
    const printWindow = window.open('', '_blank', 'width=900,height=800');
    if (!printWindow) {
      alert("Please allow popups to export the PDF.");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Cross-Examination Strategy - ${crossExamDoc?.title || 'Case'}</title>
        <meta charset="utf-8" />
        <style>
          @page { size: A4; margin: 15mm; }
          body {
            font-family: 'Times New Roman', serif;
            color: #111;
            line-height: 1.6;
            padding: 20px;
          }
          .court-header {
            text-align: center;
            border-bottom: 2px solid #222;
            padding-bottom: 12px;
            margin-bottom: 18px;
          }
          .court-header h2 { margin: 0; font-size: 16pt; text-transform: uppercase; letter-spacing: 1px; }
          .court-header p { margin: 4px 0 0 0; font-size: 10pt; color: #444; font-weight: bold; }
          .case-badge {
            background: #f4f4f4;
            padding: 10px 14px;
            border-left: 4px solid #b8860b;
            font-size: 10.5pt;
            margin-bottom: 20px;
          }
          pre {
            white-space: pre-wrap;
            font-family: inherit;
            font-size: 11pt;
            line-height: 1.6;
          }
          @media print {
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="court-header">
          <h2>IN THE COURT OF SESSIONS / DISTRICT JUDICIARY</h2>
          <p>TRIAL ADVOCACY & WITNESS CROSS-EXAMINATION QUESTION BANK (जिरह एवं प्रतिपरीक्षा)</p>
        </div>
        <div class="case-badge">
          <div><strong>Case Matter / Document:</strong> ${crossExamDoc?.title || 'Case Record'}</div>
          <div><strong>Deponent / Witness:</strong> ${crossExamData?.witness_type?.toUpperCase() || 'WITNESS'} | <strong>Authority:</strong> Section 145/148 Bharatiya Sakshya Adhiniyam, 2023</div>
        </div>
        <pre>${crossExamData.cross_examination_markdown}</pre>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 400);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };



  const togglePrivacyMode = async () => {
    const nextVal = !localOnly;
    setLocalOnly(nextVal);
    try {
      await fetch(`${API_BASE}/settings/privacy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ local_only: nextVal })
      });
    } catch (e) {
      console.error("Privacy toggle failed:", e);
    }
  };

  const handleSaveKeys = async () => {
    setKeysSaving(true);
    setKeysSavedMsg('');
    try {
      const res = await fetch(`${API_BASE}/settings/keys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiKeys)
      });
      if (res.ok) {
        setKeysSavedMsg('API Keys saved successfully! Testing engine connection...');
        await checkHealth();
        setTimeout(() => {
          setKeysSavedMsg('');
          setShowSettingsModal(false);
        }, 1500);
      }
    } catch (e) {
      setKeysSavedMsg('Failed to save keys: ' + e.message);
    } finally {
      setKeysSaving(false);
    }
  };

  const handleSearch = async (searchQuery) => {
    const targetQuery = searchQuery || query;
    if (!targetQuery.trim()) return;

    setLoading(true);
    try {
      const payload = {
        query: targetQuery,
        preferred_model: preferredModel,
        local_only: localOnly,
        active_sources: selectedSources,
        language: languageMode,
        filters: {
          court: filterCourt !== 'all' ? filterCourt : undefined,
          min_bench_size: filterBench === 'constitution' ? 5 : filterBench === 'larger' ? 3 : undefined
        }
      };

      const res = await fetch(`${API_BASE}/research`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setResearchData(data);
        if (data.synthesis?.citations?.length > 0) {
          setActiveCitation(data.synthesis.citations[0]);
        }
        // Reset follow-up chat with new context
        setChatMessages([
          { sender: 'ai', text: `I have synthesized the legal memorandum for: "${data.query}". Ask any follow-up question or hypothetical fact scenario.` }
        ]);
      }
    } catch (err) {
      console.error("Research request error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendFollowUp = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatLoading(true);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          context_query: researchData?.query || query,
          memo_markdown: researchData?.synthesis?.memo_markdown,
          preferred_model: preferredModel,
          language: languageMode
        })
      });


      if (res.ok) {
        const data = await res.json();
        setChatMessages(prev => [
          ...prev,
          { sender: 'ai', text: data.answer, provider: data.provider }
        ]);
      } else {
        setChatMessages(prev => [
          ...prev,
          { sender: 'ai', text: 'Error generating response. Please check AI settings.' }
        ]);
      }
    } catch (e) {
      setChatMessages(prev => [
        ...prev,
        { sender: 'ai', text: 'Connection error while communicating with AI service.' }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleCompare = async () => {
    setCompareLoading(true);
    try {
      const res = await fetch(`${API_BASE}/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          case_id_1: compareCase1,
          case_id_2: compareCase2
        })
      });
      if (res.ok) {
        const data = await res.json();
        setComparisonResult(data);
      }
    } catch (e) {
      console.error("Comparison error:", e);
    } finally {
      setCompareLoading(false);
    }
  };

  const handleCopyMemo = () => {
    if (!researchData?.synthesis?.memo_markdown) return;
    navigator.clipboard.writeText(researchData.synthesis.memo_markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveMemo = () => {
    if (!researchData) return;
    const item = {
      id: Date.now(),
      query: researchData.query,
      domain: researchData.plan?.legal_domain,
      timestamp: new Date().toLocaleDateString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      data: researchData
    };
    setSavedMemos([item, ...savedMemos]);
    alert("Legal Research Memorandum saved to your private local archive!");
  };

  const toggleSource = (sourceName) => {
    if (selectedSources.includes(sourceName)) {
      if (selectedSources.length > 1) {
        setSelectedSources(selectedSources.filter(s => s !== sourceName));
      }
    } else {
      setSelectedSources([...selectedSources, sourceName]);
    }
  };

  const sampleQueries = [
    { label: "Anticipatory Bail (CrPC s.438 / BNSS s.482)", text: "Can a High Court grant anticipatory bail under Indian law?" },
    { label: "Right to Privacy (Puttaswamy 9-Judge)", text: "Right to privacy under Article 21 and the Puttaswamy proportionality standard" },
    { label: "NI Act s.138 Cheque Bounce Presumption", text: "Statutory presumption of debt under Section 139 Negotiable Instruments Act" },
    { label: "Arbitration Group of Companies (Cox & Kings)", text: "Application of Group of Companies doctrine under Indian Arbitration Act" }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Prestigious Legal Header */}
      <header style={{
        background: 'linear-gradient(180deg, #091122 0%, #060B16 100%)',
        borderBottom: '1px solid var(--gold-border)',
        padding: '16px 28px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          
          {/* Brand Logo & Emblem */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #1C2742 0%, #0F172A 100%)',
              border: '1.5px solid var(--gold-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px var(--gold-glow)'
            }}>
              <Scale size={24} color="#D4AF37" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.45rem',
                  fontWeight: '700',
                  letterSpacing: '1px',
                  background: 'linear-gradient(90deg, #FFF 0%, #F5E6BE 60%, #D4AF37 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  margin: 0
                }}>
                  NYAYA<span style={{ color: '#D4AF37' }}>AI</span>
                </h1>
                <span className="gold-badge" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                  <Award size={10} /> INDIAN JURISPRUDENCE
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
                Private Multi-Model Legal Research & Precedent Agent
              </p>
            </div>
          </div>

          {/* Model Selector, Privacy Shield & Key Configuration */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            
            {/* Privacy Shield Toggle */}
            <button
              id="privacy-shield-toggle"
              onClick={togglePrivacyMode}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 14px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: localOnly ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                border: `1.5px solid ${localOnly ? '#10B981' : 'var(--border-subtle)'}`,
                color: localOnly ? '#34D399' : 'var(--text-secondary)'
              }}
              title="Toggle between Local Privacy Shield and Cloud Hybrid mode."
            >
              <Shield size={16} color={localOnly ? '#10B981' : '#94A3B8'} />
              <span>{localOnly ? 'Local Shield Active' : 'Hybrid Mode'}</span>
            </button>

            {/* Language Mode Selector Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(13, 21, 39, 0.8)', padding: '4px 10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <Globe size={15} color="var(--gold-primary)" />
              <select
                id="language-mode-dropdown"
                value={languageMode}
                onChange={(e) => setLanguageMode(e.target.value)}
                style={{
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
                title="Language Mode: Synthesize legal analysis in English, Hindi, or Hinglish"
              >
                <option value="en" style={{ background: '#0D1527' }}>English (EN)</option>
                <option value="hi" style={{ background: '#0D1527' }}>हिंदी (Hindi)</option>
                <option value="hinglish" style={{ background: '#0D1527' }}>Hinglish (EN+HI)</option>
              </select>
            </div>

            {/* Model Selector Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(13, 21, 39, 0.8)', padding: '4px 10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <Sparkles size={15} color="var(--gold-primary)" />
              <select
                id="model-selector-dropdown"
                value={preferredModel}
                onChange={(e) => setPreferredModel(e.target.value)}
                style={{
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                <option value="auto" style={{ background: '#0D1527' }}>Auto Routing (Adaptive)</option>
                <option value="gemini" style={{ background: '#0D1527' }}>Google Gemini (1.5 Flash)</option>
                <option value="groq" style={{ background: '#0D1527' }}>Groq (Llama 3.3 70B)</option>
                <option value="openai" style={{ background: '#0D1527' }}>OpenAI GPT-4o</option>
                <option value="claude" style={{ background: '#0D1527' }}>Claude 3.5 Sonnet</option>
                <option value="deepseek" style={{ background: '#0D1527' }}>DeepSeek-Chat</option>
                <option value="ollama" style={{ background: '#0D1527' }}>Ollama Local (On-Device)</option>
              </select>
            </div>

            {/* Configure AI Keys Button */}
            <button
              id="configure-ai-keys-btn"
              onClick={() => setShowSettingsModal(true)}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              title="Configure API Keys for Gemini, OpenAI, Claude, DeepSeek, Groq, or Ollama"
            >
              <Key size={14} color="var(--gold-primary)" />
              <span>AI Keys & Models</span>
            </button>

            {/* Server Health Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: backendStatus.connected ? '#10B981' : '#EF4444',
                boxShadow: backendStatus.connected ? '0 0 8px #10B981' : 'none'
              }} />
              <span>{backendStatus.connected ? 'Engine Ready' : 'Backend Offline'}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ maxWidth: '1400px', margin: '14px auto 0', display: 'flex', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px', overflowX: 'auto' }}>
          {[
            { id: 'research', label: 'Legal Research & Memo', icon: Search },
            { id: 'pdf_studio', label: '🎯 PDF Prompt & Cross-Exam', icon: Target },
            { id: 'consensus', label: '🏛️ Multi-Model AI Consensus', icon: Sparkles },
            { id: 'library_compare', label: '📜 Indian Law Library & Compare', icon: BookOpen },
            { id: 'calculator', label: '⚖️ Court Fee Calculator (CG & MP)', icon: Calculator },
            { id: 'drafting', label: '✍️ Drafting & Font Studio', icon: Type },
            { id: 'documents', label: `📁 Case Dossier (${uploadedDocs.length})`, icon: UploadCloud },
            { id: 'ecosystem', label: '🌐 AI Ecosystem', icon: Globe },
            { id: 'history', label: `Saved (${savedMemos.length})`, icon: Bookmark }
          ].map(tab => {


            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'compare' && !comparisonResult) {
                    handleCompare();
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '0.84rem',
                  fontWeight: active ? '600' : '500',
                  cursor: 'pointer',
                  background: active ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                  color: active ? 'var(--gold-light)' : 'var(--text-secondary)',
                  border: active ? '1px solid var(--gold-border)' : '1px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={15} color={active ? '#D4AF37' : 'currentColor'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* API Keys Configuration Modal */}
      {showSettingsModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="glass-card" style={{ maxWidth: '580px', width: '100%', padding: '28px', border: '1px solid var(--gold-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={20} color="var(--gold-primary)" />
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: '#FFF', margin: 0 }}>
                  CONFIGURE AI MODELS & API KEYS
                </h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#FFF', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '18px', lineHeight: 1.5 }}>
              Connect your preferred AI model provider. All keys are stored securely on your local computer.
              If no cloud key is entered, NyayaAI uses its integrated offline legal reasoning rules engine.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
              {/* Google Gemini */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--gold-light)' }}>Google Gemini API Key:</label>
                  <span style={{ fontSize: '0.7rem', color: backendStatus.keys_configured?.gemini ? '#10B981' : '#94A3B8' }}>
                    {backendStatus.keys_configured?.gemini ? '✓ Active' : 'Not configured'}
                  </span>
                </div>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={apiKeys.gemini_key}
                  onChange={(e) => setApiKeys({ ...apiKeys, gemini_key: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', background: '#091122', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#FFF', fontSize: '0.82rem' }}
                />
              </div>

              {/* OpenAI */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--gold-light)' }}>OpenAI API Key:</label>
                  <span style={{ fontSize: '0.7rem', color: backendStatus.keys_configured?.openai ? '#10B981' : '#94A3B8' }}>
                    {backendStatus.keys_configured?.openai ? '✓ Active' : 'Not configured'}
                  </span>
                </div>
                <input
                  type="password"
                  placeholder="sk-proj-..."
                  value={apiKeys.openai_key}
                  onChange={(e) => setApiKeys({ ...apiKeys, openai_key: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', background: '#091122', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#FFF', fontSize: '0.82rem' }}
                />
              </div>

              {/* Anthropic Claude */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--gold-light)' }}>Anthropic Claude API Key:</label>
                  <span style={{ fontSize: '0.7rem', color: backendStatus.keys_configured?.anthropic ? '#10B981' : '#94A3B8' }}>
                    {backendStatus.keys_configured?.anthropic ? '✓ Active' : 'Not configured'}
                  </span>
                </div>
                <input
                  type="password"
                  placeholder="sk-ant-api..."
                  value={apiKeys.anthropic_key}
                  onChange={(e) => setApiKeys({ ...apiKeys, anthropic_key: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', background: '#091122', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#FFF', fontSize: '0.82rem' }}
                />
              </div>

              {/* DeepSeek */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--gold-light)' }}>DeepSeek API Key:</label>
                  <span style={{ fontSize: '0.7rem', color: backendStatus.keys_configured?.deepseek ? '#10B981' : '#94A3B8' }}>
                    {backendStatus.keys_configured?.deepseek ? '✓ Active' : 'Not configured'}
                  </span>
                </div>
                <input
                  type="password"
                  placeholder="sk-..."
                  value={apiKeys.deepseek_key}
                  onChange={(e) => setApiKeys({ ...apiKeys, deepseek_key: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', background: '#091122', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#FFF', fontSize: '0.82rem' }}
                />
              </div>

              {/* Groq / Qwen */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--gold-light)' }}>Groq / Qwen API Key:</label>
                  <span style={{ fontSize: '0.7rem', color: backendStatus.keys_configured?.groq ? '#10B981' : '#94A3B8' }}>
                    {backendStatus.keys_configured?.groq ? '✓ Active' : 'Not configured'}
                  </span>
                </div>
                <input
                  type="password"
                  placeholder="gsk_..."
                  value={apiKeys.groq_key}
                  onChange={(e) => setApiKeys({ ...apiKeys, groq_key: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', background: '#091122', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#FFF', fontSize: '0.82rem' }}
                />
              </div>

              {/* Qwen Direct */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--gold-light)' }}>Qwen 2.5 Max (DashScope) Key:</label>
                  <span style={{ fontSize: '0.7rem', color: backendStatus.keys_configured?.qwen ? '#10B981' : '#94A3B8' }}>
                    {backendStatus.keys_configured?.qwen ? '✓ Active' : 'Not configured'}
                  </span>
                </div>
                <input
                  type="password"
                  placeholder="sk-..."
                  value={apiKeys.qwen_key}
                  onChange={(e) => setApiKeys({ ...apiKeys, qwen_key: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', background: '#091122', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#FFF', fontSize: '0.82rem' }}
                />
              </div>

              {/* MiniMax */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--gold-light)' }}>MiniMax-01 API Key:</label>
                  <span style={{ fontSize: '0.7rem', color: backendStatus.keys_configured?.minimax ? '#10B981' : '#94A3B8' }}>
                    {backendStatus.keys_configured?.minimax ? '✓ Active' : 'Not configured'}
                  </span>
                </div>
                <input
                  type="password"
                  placeholder="eyJhbGciOi... (from api.minimax.chat)"
                  value={apiKeys.minimax_key}
                  onChange={(e) => setApiKeys({ ...apiKeys, minimax_key: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', background: '#091122', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#FFF', fontSize: '0.82rem' }}
                />
              </div>

              {/* Indian Kanoon */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', marginTop: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--gold-light)' }}>Indian Kanoon API Key:</label>
                  <span style={{ fontSize: '0.7rem', color: backendStatus.keys_configured?.indian_kanoon ? '#10B981' : '#94A3B8' }}>
                    {backendStatus.keys_configured?.indian_kanoon ? '✓ Active — Live Case Search' : 'Not configured'}
                  </span>
                </div>
                <input
                  type="password"
                  placeholder="bd9d9c... (from indiankanoon.org/api)"
                  value={apiKeys.indian_kanoon_key}
                  onChange={(e) => setApiKeys({ ...apiKeys, indian_kanoon_key: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', background: '#091122', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#FFF', fontSize: '0.82rem' }}
                />
                <p style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '4px' }}>Enables live case law search from indiankanoon.org</p>
              </div>

              {/* Ollama Local URL */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--gold-light)' }}>Ollama Local Host URL:</label>
                  <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Default: http://localhost:11434</span>
                </div>
                <input
                  type="text"
                  value={apiKeys.ollama_url}
                  onChange={(e) => setApiKeys({ ...apiKeys, ollama_url: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', background: '#091122', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#FFF', fontSize: '0.82rem' }}
                />
              </div>
            </div>

            {keysSavedMsg && (
              <div style={{ marginTop: '12px', fontSize: '0.8rem', color: '#10B981', textAlign: 'center' }}>
                {keysSavedMsg}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                className="btn-secondary"
                onClick={() => setShowSettingsModal(false)}
                style={{ padding: '8px 16px', fontSize: '0.82rem' }}
              >
                Cancel
              </button>
              <button
                id="save-api-keys-btn"
                className="btn-primary"
                onClick={handleSaveKeys}
                disabled={keysSaving}
                style={{ padding: '8px 20px', fontSize: '0.82rem' }}
              >
                {keysSaving ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
                <span>Save & Connect</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main style={{ flex: 1, maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '24px 28px' }}>
        
        {/* ================= TAB 1: RESEARCH CONSOLE ================= */}
        {activeTab === 'research' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            
            {/* Search Box & Query Assistant */}
            <div className="glass-card" style={{ padding: '22px', border: '1px solid var(--gold-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--gold-light)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Scale size={16} /> ENTER LEGAL PROPOSITION OR QUESTION
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Active Engine: <strong style={{ color: '#FFF' }}>{researchData?.synthesis?.model_metadata?.provider || 'Adaptive Multi-Model'}</strong>
                </span>
              </div>

              {/* Input row */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gold-primary)' }} />
                  <input
                    id="legal-search-input"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="e.g. Can a High Court grant anticipatory bail under Indian law?"
                    style={{
                      width: '100%',
                      padding: '14px 16px 14px 46px',
                      background: 'rgba(7, 11, 23, 0.9)',
                      border: '1px solid rgba(212, 175, 55, 0.4)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      fontSize: '0.98rem',
                      fontFamily: 'var(--font-sans)',
                      outline: 'none',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)'
                    }}
                  />
                </div>
                <button
                  id="submit-research-btn"
                  className="btn-primary"
                  onClick={() => handleSearch()}
                  disabled={loading}
                  style={{ minWidth: '160px', height: '48px' }}
                >
                  {loading ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      <span>Researching...</span>
                    </>
                  ) : (
                    <>
                      <Scale size={18} />
                      <span>Execute Research</span>
                    </>
                  )}
                </button>
              </div>

              {/* Sample Queries Chips */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Landmark Issues:</span>
                {sampleQueries.map((s, idx) => (
                  <button
                    key={idx}
                    id={`sample-query-${idx}`}
                    onClick={() => {
                      setQuery(s.text);
                      handleSearch(s.text);
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '16px',
                      padding: '4px 12px',
                      fontSize: '0.74rem',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--gold-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Active Sources Selector */}
              <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Database size={13} /> Legal Sources:
                  </span>
                  {[
                    'Indian Kanoon',
                    'India Code (Legislative Department)',
                    'Supreme Court of India (e-SCR Portal)',
                    'High Courts of India',
                    'Law Commission of India',
                    'SCC Online (Licensed API)',
                    'Manupatra (Licensed API)'
                  ].map(src => {
                    const isSelected = selectedSources.includes(src);
                    return (
                      <button
                        key={src}
                        id={`source-toggle-${src.replace(/\s+/g, '-').toLowerCase()}`}
                        onClick={() => toggleSource(src)}
                        style={{
                          background: isSelected ? 'rgba(212, 175, 55, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                          border: isSelected ? '1px solid var(--gold-border)' : '1px solid var(--border-subtle)',
                          color: isSelected ? 'var(--gold-light)' : 'var(--text-muted)',
                          padding: '3px 10px',
                          borderRadius: '14px',
                          fontSize: '0.72rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        {isSelected && <Check size={11} color="var(--gold-primary)" />}
                        {src}
                      </button>
                    );
                  })}
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <Filter size={13} />
                    <select
                      id="court-filter-dropdown"
                      value={filterCourt}
                      onChange={(e) => setFilterCourt(e.target.value)}
                      style={{ background: '#0D1527', color: '#FFF', border: '1px solid var(--border-subtle)', borderRadius: '4px', padding: '2px 6px', fontSize: '0.75rem' }}
                    >
                      <option value="all">All Courts</option>
                      <option value="Supreme Court">Supreme Court of India</option>
                      <option value="Delhi">Delhi High Court</option>
                      <option value="Bombay">Bombay High Court</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <select
                      id="bench-filter-dropdown"
                      value={filterBench}
                      onChange={(e) => setFilterBench(e.target.value)}
                      style={{ background: '#0D1527', color: '#FFF', border: '1px solid var(--border-subtle)', borderRadius: '4px', padding: '2px 6px', fontSize: '0.75rem' }}
                    >
                      <option value="all">All Benches</option>
                      <option value="constitution">Constitution Benches (5+ Judges)</option>
                      <option value="larger">Larger Benches (3+ Judges)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Agent Execution Steps Timeline */}
            {researchData?.steps_log && (
              <div className="glass-card" style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Multi-Agent Research Pipeline Execution
                  </span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={13} /> Completed in {researchData.total_duration_sec}s
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                  {researchData.steps_log.map((step, idx) => (
                    <div key={idx} style={{
                      background: 'rgba(7, 12, 24, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      fontSize: '0.76rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontWeight: '600', color: 'var(--gold-light)' }}>{step.agent}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{step.duration_ms}ms</span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                        {step.details}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Main Content Split Screen: Legal Memo (Left) + Evidence Matrix & Follow-Up (Right) */}
            {researchData && (
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(380px, 1fr)', gap: '22px' }}>
                
                {/* Left Panel: Legal Research Memorandum */}
                <div className="glass-card" style={{ padding: '28px', border: '1px solid rgba(212, 175, 55, 0.25)' }}>
                  
                  {/* Memo Actions Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px', marginBottom: '20px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#FFF', margin: 0 }}>
                          LEGAL RESEARCH MEMORANDUM
                        </h2>
                        <span className="gold-badge" style={{ fontSize: '0.68rem' }}>
                          GROUNDED PRECEDENT
                        </span>
                      </div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Synthesized by: <strong style={{ color: 'var(--gold-light)' }}>{researchData.synthesis?.model_metadata?.provider} ({researchData.synthesis?.model_metadata?.model})</strong>
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        id="copy-memo-btn"
                        className="btn-secondary"
                        onClick={handleCopyMemo}
                        style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                      >
                        {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                        <span>{copied ? 'Copied' : 'Copy'}</span>
                      </button>
                      <button
                        id="save-memo-btn"
                        className="btn-secondary"
                        onClick={handleSaveMemo}
                        style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                      >
                        <Bookmark size={14} />
                        <span>Save</span>
                      </button>
                      <button
                        id="print-memo-btn"
                        className="btn-secondary"
                        onClick={() => window.print()}
                        style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                      >
                        <Printer size={14} />
                        <span>Print</span>
                      </button>
                    </div>
                  </div>

                  {/* Status Banner */}
                  <div style={{
                    background: 'rgba(13, 21, 39, 0.9)',
                    borderLeft: '4px solid var(--gold-primary)',
                    padding: '12px 16px',
                    borderRadius: '0 8px 8px 0',
                    marginBottom: '22px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--gold-light)' }}>
                        CURRENT LAW & STATUTORY POSTURE
                      </span>
                      <span className={`status-tag ${researchData.synthesis?.current_law_status?.includes('Transitional') ? 'status-replaced' : 'status-good'}`}>
                        {researchData.synthesis?.current_law_status || 'In Force'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                      {researchData.statute_analysis?.statutory_summary?.split('\n')[0] || 'Governing statutory framework active and verified.'}
                    </p>
                  </div>

                  {/* Formatted Legal Memo Body */}
                  <div id="legal-memo-body" style={{
                    color: 'var(--text-primary)',
                    fontSize: '0.94rem',
                    lineHeight: '1.75',
                    fontFamily: 'var(--font-sans)',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {researchData.synthesis?.memo_markdown}
                  </div>

                  {/* Statutory Legal Safeguard Disclaimer */}
                  <div style={{
                    marginTop: '32px',
                    padding: '14px 18px',
                    background: 'rgba(239, 68, 68, 0.05)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: '8px',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start'
                  }}>
                    <AlertTriangle size={18} color="#F87171" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ fontSize: '0.78rem', color: '#CBD5E1', lineHeight: 1.5 }}>
                      <strong>Statutory Legal Disclaimer:</strong> This legal research memorandum is an analytical aid produced
                      by NyayaAI through multi-source Indian legal data retrieval. It does not constitute formal legal advice or
                      solicitation. Practitioners must verify original gazette notifications and recent High Court circulars before court filings.
                    </div>
                  </div>
                </div>

                {/* Right Panel: Follow-up AI Chat + Citation Inspector + Authorities */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  
                  {/* Interactive AI Legal Follow-Up Assistant */}
                  <div className="glass-card" style={{ padding: '20px', border: '1px solid var(--gold-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MessageSquare size={16} color="var(--gold-primary)" />
                        <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#FFF' }}>
                          AI LEGAL ADVOCATE (Q&A)
                        </span>
                      </div>
                      <span className="gold-badge" style={{ fontSize: '0.65rem' }}>
                        Interactive
                      </span>
                    </div>

                    {/* Chat messages */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      maxHeight: '260px',
                      overflowY: 'auto',
                      padding: '8px',
                      background: 'rgba(7, 11, 23, 0.7)',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.06)',
                      marginBottom: '12px'
                    }}>
                      {chatMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          style={{
                            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '90%',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            fontSize: '0.78rem',
                            lineHeight: 1.5,
                            background: msg.sender === 'user' ? 'rgba(212, 175, 55, 0.2)' : 'rgba(15, 23, 42, 0.9)',
                            border: msg.sender === 'user' ? '1px solid var(--gold-border)' : '1px solid rgba(255, 255, 255, 0.08)',
                            color: msg.sender === 'user' ? 'var(--gold-light)' : '#E2E8F0'
                          }}
                        >
                          {msg.text}
                        </div>
                      ))}
                      {chatLoading && (
                        <div style={{ alignSelf: 'flex-start', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <RefreshCw size={12} className="animate-spin" /> Thinking...
                        </div>
                      )}
                    </div>

                    {/* Chat input */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendFollowUp()}
                        placeholder="Ask follow-up (e.g. Can bail be cancelled?)"
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          background: '#091122',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '6px',
                          color: '#FFF',
                          fontSize: '0.8rem',
                          outline: 'none'
                        }}
                      />
                      <button
                        id="send-chat-btn"
                        className="btn-primary"
                        onClick={handleSendFollowUp}
                        disabled={chatLoading}
                        style={{ padding: '0 12px' }}
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Selected Citation Inspector */}
                  {activeCitation && (
                    <div className="glass-card" style={{ padding: '20px', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span className="gold-badge" style={{ fontSize: '0.72rem' }}>
                          CITATION [{activeCitation.citation_id}] INSPECTOR
                        </span>
                        <span className={`status-tag ${activeCitation.status === 'Overruled' ? 'status-overruled' : activeCitation.status === 'Replaced' ? 'status-replaced' : 'status-good'}`}>
                          {activeCitation.status}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.02rem', fontFamily: 'var(--font-serif)', color: '#FFF', marginBottom: '8px' }}>
                        {activeCitation.title}
                      </h3>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                        <div><strong>Citation:</strong> <span style={{ color: 'var(--gold-light)' }}>{activeCitation.citation}</span></div>
                        <div><strong>Court:</strong> {activeCitation.court}</div>
                        <div><strong>Bench:</strong> {activeCitation.bench} {activeCitation.bench_size ? `(${activeCitation.bench_size}-Judge)` : ''}</div>
                        {activeCitation.date && <div><strong>Judgment Date:</strong> {activeCitation.date}</div>}
                      </div>

                      <div style={{ background: 'rgba(7, 11, 23, 0.8)', padding: '12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '14px' }}>
                        <div style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--gold-primary)', marginBottom: '4px', textTransform: 'uppercase' }}>
                          Ratio Decidendi / Legal Principle:
                        </div>
                        <p style={{ fontSize: '0.82rem', color: '#E2E8F0', margin: 0, lineHeight: 1.5 }}>
                          {activeCitation.ratio}
                        </p>
                      </div>

                      {activeCitation.url && (
                        <a
                          id="open-original-source-btn"
                          href={activeCitation.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary"
                          style={{ width: '100%', fontSize: '0.82rem', padding: '8px 14px' }}
                        >
                          <ExternalLink size={15} />
                          <span>Open Authoritative Original Source</span>
                        </a>
                      )}
                    </div>
                  )}

                  {/* All Authoritative Documents List */}
                  <div className="glass-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                        Retrieved Legal Authorities ({researchData.synthesis?.citations?.length || 0})
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--gold-light)' }}>
                        Ranked by Authority
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
                      {researchData.synthesis?.citations?.map((c) => {
                        const isSelected = activeCitation?.citation_id === c.citation_id;
                        return (
                          <div
                            key={c.citation_id}
                            id={`citation-card-${c.citation_id}`}
                            onClick={() => setActiveCitation(c)}
                            style={{
                              background: isSelected ? 'rgba(212, 175, 55, 0.1)' : 'rgba(10, 16, 30, 0.6)',
                              border: isSelected ? '1px solid var(--gold-border)' : '1px solid rgba(255, 255, 255, 0.05)',
                              borderRadius: '8px',
                              padding: '12px',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <span className="citation-token" style={{ margin: 0 }}>
                                [{c.citation_id}]
                              </span>
                              <span className={`status-tag ${c.status === 'Overruled' ? 'status-overruled' : c.status === 'Replaced' ? 'status-replaced' : 'status-good'}`} style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                                {c.status}
                              </span>
                            </div>

                            <h4 style={{ fontSize: '0.86rem', color: isSelected ? 'var(--gold-light)' : 'var(--text-primary)', marginBottom: '4px', fontWeight: '600' }}>
                              {c.title}
                            </h4>

                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                              {c.citation} • {c.court}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

              </div>
            )}

          </div>
        )}

        {/* ================= TAB: PDF PROMPT & CROSS-EXAM STUDIO ================= */}
        {activeTab === 'pdf_studio' && (
          <PdfPromptStudio uploadedDocs={uploadedDocs} onDocUploaded={fetchUploadedDocs} />
        )}

        {/* ================= TAB: MULTI-MODEL CONSENSUS ARBITER ================= */}
        {activeTab === 'consensus' && (
          <MultiModelConsensusHub />
        )}

        {/* ================= TAB: INDIAN LAW LIBRARY & COMPARE ================= */}
        {activeTab === 'library_compare' && (
          <IndianLawLibraryCompare />
        )}

        {/* ================= TAB 2: COURT FEE CALCULATOR (कोर्ट फीस कैलकुलेटर) ================= */}
        {activeTab === 'calculator' && (
          <CourtFeeCalculator />
        )}

        {/* ================= TAB 3: DRAFTING & FONT STUDIO (ड्राफ्टिंग एवं फॉन्ट स्टूडियो) ================= */}
        {activeTab === 'drafting' && (
          <DraftingFontStudio />
        )}

        {/* ================= TAB 4: LEGAL AI ECOSYSTEM HUB ================= */}
        {activeTab === 'ecosystem' && (
          <LegalEcosystemHub />
        )}

        {/* ================= TAB 5: CASE & LAW DOCUMENTS MANAGER (150MB+ HIGH-CAPACITY DOSSIER) ================= */}
        {activeTab === 'documents' && (
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ marginBottom: '22px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FolderOpen size={22} color="var(--gold-primary)" />
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: '#FFF', margin: 0 }}>
                    CASE EVIDENCE & LAW REPOSITORY (150MB+ HIGH CAPACITY)
                  </h2>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                  High-capacity document processing: Upload large multi-page PDFs, Charge Sheets, FIRs, 161 Statements, Medical MLC Reports, Bare Acts & Judgments (English & Devanagari Hindi).
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span className="gold-badge" style={{ fontSize: '0.74rem', background: 'rgba(56, 189, 248, 0.15)', borderColor: 'rgba(56, 189, 248, 0.4)', color: '#38BDF8' }}>
                  ⚡ High Limit: 150MB+ / Batch OCR
                </span>
                <span className="gold-badge" style={{ fontSize: '0.78rem' }}>
                  <FileCheck size={14} /> {uploadedDocs.length} Active Exhibits
                </span>
              </div>
            </div>

            {/* Upload Area & Category Controls */}
            <div style={{
              background: 'rgba(9, 17, 34, 0.7)',
              border: '1.5px dashed var(--gold-border)',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '28px',
              textAlign: 'center'
            }}>
              <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
                  
                  {/* Case / FIR Title */}
                  <div style={{ textAlign: 'left', minWidth: '220px', flexGrow: 1 }}>
                    <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
                      Case Docket / FIR No. (Group Multiple PDFs):
                    </label>
                    <input
                      type="text"
                      value={uploadCaseName}
                      onChange={(e) => setUploadCaseName(e.target.value)}
                      placeholder="e.g., FIR 104/2026 State v. Sharma"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        background: '#060B16',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        color: '#FFF',
                        fontSize: '0.84rem'
                      }}
                    />
                  </div>

                  {/* Category Selector */}
                  <div style={{ textAlign: 'left', minWidth: '200px' }}>
                    <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
                      Document Category / Type:
                    </label>
                    <select
                      value={docCategory}
                      onChange={(e) => setDocCategory(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        background: '#060B16',
                        border: '1px solid var(--gold-border)',
                        borderRadius: '6px',
                        color: '#FFF',
                        fontSize: '0.84rem'
                      }}
                    >
                      <option value="Statute">📜 Bare Act / Indian Law PDF</option>
                      <option value="Charge Sheet">📑 Police Charge Sheet (चार्जशीट / धारा 173)</option>
                      <option value="FIR">🚨 First Information Report (FIR / प्राथमिकी)</option>
                      <option value="MLC Medical">🩺 Medico-Legal Report (MLC / चोट प्रतिवेदन)</option>
                      <option value="Guideline">📋 Guideline / Circular / HC Rules</option>
                      <option value="Judgment_SC">⚖️ Supreme Court Judgment</option>
                      <option value="Judgment_HC">🏛️ High Court Judgment</option>
                      <option value="Judgment_District">🏢 District Court Judgment (Hindi/English)</option>
                      <option value="Case File">📁 Motion / Petition / Case File</option>
                    </select>
                  </div>

                  {/* Language Override */}
                  <div style={{ textAlign: 'left', minWidth: '160px' }}>
                    <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
                      Document Language:
                    </label>
                    <select
                      value={docLangOverride}
                      onChange={(e) => setDocLangOverride(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        background: '#060B16',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        color: '#FFF',
                        fontSize: '0.84rem'
                      }}
                    >
                      <option value="auto">🌐 Auto-Detect Script</option>
                      <option value="en">English (EN)</option>
                      <option value="hi">हिंदी (Hindi / Devanagari)</option>
                    </select>
                  </div>
                </div>



                {/* Dropzone Box */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      handleFileUpload(e.dataTransfer.files);
                    }
                  }}
                  style={{
                    padding: '24px 20px',
                    background: 'rgba(13, 21, 39, 0.5)',
                    borderRadius: '8px',
                    border: '1px dashed rgba(255,255,255,0.15)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => document.getElementById('file-upload-input').click()}
                >
                  <input
                    id="file-upload-input"
                    type="file"
                    multiple
                    accept=".pdf,.txt,.doc,.docx"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    style={{ display: 'none' }}
                  />
                  
                  {uploading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <RefreshCw size={32} color="var(--gold-primary)" className="animate-spin" />
                      <p style={{ fontSize: '0.88rem', color: 'var(--gold-light)' }}>{uploadStatusMsg}</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <UploadCloud size={36} color="var(--gold-primary)" />
                      <p style={{ fontSize: '0.94rem', fontWeight: '600', color: '#FFF', margin: 0 }}>
                        Click to browse or Drag & Drop Law PDFs, Guidelines, or Orders here
                      </p>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                        Supports PDF (English & Devanagari Hindi text), TXT, and DOC files up to 50MB.
                      </p>
                    </div>
                  )}
                </div>

                {uploadStatusMsg && !uploading && (
                  <div style={{ marginTop: '12px', fontSize: '0.82rem', color: '#10B981', fontWeight: '500' }}>
                    ✓ {uploadStatusMsg}
                  </div>
                )}
              </div>
            </div>

            {/* Document Library Search & Grid */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', color: 'var(--gold-light)', margin: 0 }}>
                    DOCUMENT AUTHORITY LIBRARY ({uploadedDocs.length})
                  </h3>
                  {uploadedDocs.length > 0 && (
                    <button
                      onClick={() => {
                        if (selectedDocIds.length === uploadedDocs.length) {
                          setSelectedDocIds([]);
                        } else {
                          setSelectedDocIds(uploadedDocs.map(d => d.id));
                        }
                      }}
                      style={{
                        padding: '3px 10px',
                        fontSize: '0.74rem',
                        background: 'rgba(255,255,255,0.06)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      {selectedDocIds.length === uploadedDocs.length ? "Deselect All" : "Select All for Cross-Check"}
                    </button>
                  )}
                </div>

                <div style={{ position: 'relative', width: '280px' }}>
                  <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
                  <input
                    type="text"
                    placeholder="Filter uploaded documents..."
                    value={docSearch}
                    onChange={(e) => setDocSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '6px 12px 6px 30px',
                      background: '#091122',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      color: '#FFF',
                      fontSize: '0.8rem'
                    }}
                  />
                </div>
              </div>

              {/* Multi-PDF Cross-Check Action Banner */}
              {selectedDocIds.length > 0 && (
                <div style={{
                  background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.22) 0%, rgba(212, 175, 55, 0.15) 100%)',
                  border: '1.5px solid #F59E0B',
                  borderRadius: '10px',
                  padding: '14px 20px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '14px',
                  boxShadow: '0 4px 18px rgba(245, 158, 11, 0.2)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '8px',
                      background: 'rgba(245, 158, 11, 0.25)',
                      border: '1px solid #F59E0B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Layers size={22} color="#F59E0B" />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.96rem', color: '#FFF', fontWeight: '700' }}>
                        {selectedDocIds.length} Case PDFs Selected for Combined Cross-Check
                      </h4>
                      <p style={{ margin: '2px 0 0 0', fontSize: '0.76rem', color: '#CBD5E1' }}>
                        Inter-document contradiction finder: Spot discrepancies between FIR, 161 statements, medical report, and court statements.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleMultiDocCrossExam()}
                      style={{
                        padding: '9px 18px',
                        fontSize: '0.84rem',
                        fontWeight: '700',
                        background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                        color: '#000',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 2px 10px rgba(245, 158, 11, 0.4)'
                      }}
                      title="Cross-check all selected PDFs and generate comparative cross-examination questions"
                    >
                      <Target size={16} />
                      <span>Cross-Check All in One (सभी PDFs की संयुक्त जिरह)</span>
                    </button>

                    <button
                      className="btn-secondary"
                      onClick={() => setSelectedDocIds([])}
                      style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                    >
                      Clear Selection
                    </button>
                  </div>
                </div>
              )}

              {uploadedDocs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(9,17,34,0.4)', borderRadius: '8px', color: 'var(--text-muted)' }}>
                  <FileText size={36} color="var(--gold-border)" style={{ margin: '0 auto 12px' }} />
                  <p style={{ fontSize: '0.88rem' }}>No uploaded legal documents in memory.</p>
                  <p style={{ fontSize: '0.76rem' }}>Use the upload dropzone above to add Bare Acts, Guidelines, or Judgments.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
                  {uploadedDocs
                    .filter(d => !docSearch || d.title.toLowerCase().includes(docSearch.toLowerCase()) || d.filename.toLowerCase().includes(docSearch.toLowerCase()))
                    .map((doc) => {
                      const isSelected = selectedDocIds.includes(doc.id);
                      return (
                      <div
                        key={doc.id}
                        style={{
                          background: isSelected ? 'rgba(245, 158, 11, 0.08)' : 'rgba(9, 17, 34, 0.85)',
                          border: isSelected ? '1.5px solid #F59E0B' : '1px solid var(--border-subtle)',
                          borderRadius: '10px',
                          padding: '18px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '12px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedDocIds(prev => [...prev, doc.id]);
                                  } else {
                                    setSelectedDocIds(prev => prev.filter(id => id !== doc.id));
                                  }
                                }}
                                style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: '#F59E0B' }}
                                title="Select this PDF to cross-check with other PDFs"
                              />
                              <span style={{
                                fontSize: '0.7rem',
                                fontWeight: '600',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                background: doc.category === 'Statute' ? 'rgba(56, 189, 248, 0.15)' : doc.category === 'Judgment_District' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(212, 175, 55, 0.15)',
                                color: doc.category === 'Statute' ? '#38BDF8' : doc.category === 'Judgment_District' ? '#F59E0B' : 'var(--gold-light)',
                                border: '1px solid rgba(255,255,255,0.1)'
                              }}>
                                {doc.category}
                              </span>
                            </div>

                            <span style={{ fontSize: '0.7rem', color: doc.language === 'hi' ? '#F59E0B' : '#94A3B8', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Globe size={11} /> {doc.language === 'hi' ? 'हिंदी (Hindi)' : 'English'}
                            </span>
                          </div>


                          <h4 style={{ fontSize: '0.94rem', color: '#FFF', margin: '0 0 6px 0', fontWeight: '600', lineHeight: 1.4 }}>
                            {doc.title}
                          </h4>
                          <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: '0 0 8px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            📁 {doc.filename}
                          </p>

                          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 10px', borderRadius: '6px', fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.4, maxHeight: '60px', overflow: 'hidden' }}>
                            "{doc.snippet}"
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px', marginTop: '4px' }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {doc.word_count} words • {doc.upload_date}
                          </span>

                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              onClick={() => handleOpenCrossExam(doc)}
                              style={{
                                padding: '4px 10px',
                                fontSize: '0.75rem',
                                background: 'rgba(245, 158, 11, 0.15)',
                                color: '#F59E0B',
                                border: '1px solid rgba(245, 158, 11, 0.4)',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontWeight: '600'
                              }}
                              title="Generate Court Cross-Examination Strategy & Questions (जिरह एवं प्रतिपरीक्षा)"
                            >
                              <Target size={12} />
                              <span>Cross-Exam (जिरह)</span>
                            </button>

                            <button
                              onClick={() => handleAnalyzeDoc(doc)}
                              style={{
                                padding: '4px 10px',
                                fontSize: '0.75rem',
                                background: 'rgba(212, 175, 55, 0.15)',
                                color: 'var(--gold-light)',
                                border: '1px solid var(--gold-border)',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              title="Run AI Legal Analysis & Extract Facts/Issues/Ratio"
                            >
                              <Sparkles size={12} />
                              <span>Analyze</span>
                            </button>


                            <button
                              onClick={() => {
                                setPreviewDoc(doc);
                                setShowPreviewModal(true);
                              }}
                              style={{
                                padding: '4px 8px',
                                fontSize: '0.75rem',
                                background: 'rgba(255,255,255,0.05)',
                                color: 'var(--text-secondary)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: '4px',
                                cursor: 'pointer'
                              }}
                              title="Preview Extracted Plain Text"
                            >
                              <Eye size={12} />
                            </button>

                            <button
                              onClick={() => handleDeleteDoc(doc.id)}
                              style={{
                                padding: '4px 8px',
                                fontSize: '0.75rem',
                                background: 'rgba(239, 68, 68, 0.1)',
                                color: '#EF4444',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                borderRadius: '4px',
                                cursor: 'pointer'
                              }}
                              title="Delete from active session"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: SIDE-BY-SIDE CASE COMPARATOR ================= */}
        {activeTab === 'compare' && (

          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ marginBottom: '22px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ArrowRightLeft size={22} color="var(--gold-primary)" />
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: '#FFF', margin: 0 }}>
                  SIDE-BY-SIDE PRECEDENT COMPARATOR
                </h2>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                Compare judicial holdings, bench seniority, applied sections, and doctrinal evolutions across landmark authorities.
              </p>
            </div>

            {/* Selectors */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Precedent 1 (Authoritative / Constitution Bench):
                </label>
                <select
                  id="compare-case-select-1"
                  value={compareCase1}
                  onChange={(e) => setCompareCase1(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#091122',
                    border: '1px solid var(--gold-border)',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '0.86rem'
                  }}
                >
                  <option value="sc-2020-sushila-aggarwal">Sushila Aggarwal v. State (NCT Delhi) (2020) [5-Judge Bench]</option>
                  <option value="sc-1980-gurbaksh-sibbia">Gurbaksh Singh Sibbia v. State of Punjab (1980) [5-Judge Bench]</option>
                  <option value="sc-2017-puttaswamy-privacy">K.S. Puttaswamy v. Union of India (2017) [9-Judge Bench]</option>
                  <option value="sc-2023-cox-and-kings">Cox and Kings Ltd v. SAP India (2024) [5-Judge Bench]</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Precedent 2 (Comparison / Overruled / Divergent Bench):
                </label>
                <select
                  id="compare-case-select-2"
                  value={compareCase2}
                  onChange={(e) => setCompareCase2(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#091122',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '0.86rem'
                  }}
                >
                  <option value="sc-1996-salauddin-shaikh">Salauddin Abdulsamad Shaikh v. State of Maharashtra (1996) [Overruled]</option>
                  <option value="sc-1980-gurbaksh-sibbia">Gurbaksh Singh Sibbia v. State of Punjab (1980) [5-Judge Bench]</option>
                  <option value="sc-2010-rangappa">Rangappa v. Sri Mohan (2010) [3-Judge Bench]</option>
                </select>
              </div>

              <div style={{ alignSelf: 'flex-end' }}>
                <button
                  id="run-compare-btn"
                  className="btn-primary"
                  onClick={handleCompare}
                  disabled={compareLoading}
                  style={{ height: '42px', padding: '0 20px' }}
                >
                  {compareLoading ? <RefreshCw size={16} className="animate-spin" /> : <ArrowRightLeft size={16} />}
                  <span>Compare</span>
                </button>
              </div>
            </div>

            {/* Comparison Grid */}
            {comparisonResult && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '16px' }}>
                {/* Case 1 Card */}
                <div style={{
                  background: 'rgba(9, 17, 34, 0.85)',
                  border: '1.5px solid var(--gold-border)',
                  borderRadius: '10px',
                  padding: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span className="gold-badge">CASE 1 (AUTHORITATIVE)</span>
                    <span className={`status-tag ${comparisonResult.case_1.current_status === 'Overruled' ? 'status-overruled' : 'status-good'}`}>
                      {comparisonResult.case_1.current_status}
                    </span>
                  </div>

                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#FFF', marginBottom: '8px' }}>
                    {comparisonResult.case_1.title}
                  </h3>

                  <div style={{ fontSize: '0.84rem', color: 'var(--gold-light)', marginBottom: '14px', fontFamily: 'var(--font-mono)' }}>
                    {comparisonResult.case_1.citation}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    <div><strong>Court:</strong> {comparisonResult.case_1.court}</div>
                    <div><strong>Bench:</strong> {comparisonResult.case_1.bench}</div>
                    <div><strong>Bench Strength:</strong> <span style={{ color: '#FFF', fontWeight: 'bold' }}>{comparisonResult.case_1.bench_size || 1} Judges</span></div>
                    <div><strong>Statute / Section:</strong> {comparisonResult.case_1.section || comparisonResult.case_1.act}</div>
                  </div>

                  <div style={{ background: 'rgba(5, 9, 19, 0.8)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--gold-primary)', marginBottom: '6px', textTransform: 'uppercase' }}>
                      Ratio Decidendi:
                    </div>
                    <p style={{ fontSize: '0.84rem', color: '#F1F5F9', margin: 0, lineHeight: 1.6 }}>
                      {comparisonResult.case_1.ratio_decidendi}
                    </p>
                  </div>
                </div>

                {/* Case 2 Card */}
                <div style={{
                  background: 'rgba(9, 17, 34, 0.85)',
                  border: `1.5px solid ${comparisonResult.case_2.current_status === 'Overruled' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
                  borderRadius: '10px',
                  padding: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span className="gold-badge">CASE 2</span>
                    <span className={`status-tag ${comparisonResult.case_2.current_status === 'Overruled' ? 'status-overruled' : 'status-good'}`}>
                      {comparisonResult.case_2.current_status}
                    </span>
                  </div>

                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#FFF', marginBottom: '8px' }}>
                    {comparisonResult.case_2.title}
                  </h3>

                  <div style={{ fontSize: '0.84rem', color: 'var(--gold-light)', marginBottom: '14px', fontFamily: 'var(--font-mono)' }}>
                    {comparisonResult.case_2.citation}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    <div><strong>Court:</strong> {comparisonResult.case_2.court}</div>
                    <div><strong>Bench:</strong> {comparisonResult.case_2.bench}</div>
                    <div><strong>Bench Strength:</strong> <span style={{ color: '#FFF', fontWeight: 'bold' }}>{comparisonResult.case_2.bench_size || 1} Judges</span></div>
                    <div><strong>Statute / Section:</strong> {comparisonResult.case_2.section || comparisonResult.case_2.act}</div>
                  </div>

                  <div style={{ background: 'rgba(5, 9, 19, 0.8)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--gold-primary)', marginBottom: '6px', textTransform: 'uppercase' }}>
                      Ratio Decidendi:
                    </div>
                    <p style={{ fontSize: '0.84rem', color: '#F1F5F9', margin: 0, lineHeight: 1.6 }}>
                      {comparisonResult.case_2.ratio_decidendi}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Precedent Seniority Banner */}
            {comparisonResult && (
              <div style={{
                marginTop: '20px',
                padding: '16px 20px',
                background: 'rgba(212, 175, 55, 0.08)',
                border: '1px solid var(--gold-border)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--gold-light)', textTransform: 'uppercase' }}>
                    DOCTRINE OF PRECEDENT DETERMINATION (ARTICLE 141)
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#FFF', marginTop: '2px' }}>
                    {comparisonResult.higher_authority_case} prevails by virtue of larger bench composition and subsequent reaffirmation.
                  </div>
                </div>
                <span className="status-good status-tag" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                  Settled Binding Law
                </span>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: 2024 SANHITA TRANSITION MATRIX ================= */}
        {activeTab === 'transitions' && (
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Landmark size={22} color="var(--gold-primary)" />
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: '#FFF', margin: 0 }}>
                    2024 CRIMINAL LAW REFORMS (SANHITA TRANSITION MATRIX)
                  </h2>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                  Official concordance for Indian Penal Code (IPC), Code of Criminal Procedure (CrPC), and Indian Evidence Act (IEA) ➔ BNS, BNSS, BSA (Effective 1 July 2024).
                </p>
              </div>

              {/* Filter search */}
              <input
                type="text"
                value={transitionSearch}
                onChange={(e) => setTransitionSearch(e.target.value)}
                placeholder="Search Section, Act or Subject..."
                style={{
                  padding: '8px 14px',
                  background: '#091122',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  color: '#FFF',
                  fontSize: '0.82rem',
                  minWidth: '260px'
                }}
              />
            </div>

            {/* Transitions Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(212, 175, 55, 0.08)', borderBottom: '1px solid var(--gold-border)', textAlign: 'left' }}>
                    <th style={{ padding: '12px 16px', color: 'var(--gold-light)' }}>Previous Code (Pre-July 2024)</th>
                    <th style={{ padding: '12px 16px', color: 'var(--gold-light)' }}>New Sanhita (July 2024 onwards)</th>
                    <th style={{ padding: '12px 16px', color: 'var(--gold-light)' }}>Subject Matter</th>
                    <th style={{ padding: '12px 16px', color: 'var(--gold-light)' }}>Transitional Rule & Savings (s.531 BNSS)</th>
                  </tr>
                </thead>
                <tbody>
                  {transitionsList
                    .filter(t => {
                      if (!transitionSearch) return true;
                      const str = `${t.old_act} ${t.old_section} ${t.new_act} ${t.new_section} ${t.subject}`.toLowerCase();
                      return str.includes(transitionSearch.toLowerCase());
                    })
                    .map((t, idx) => (
                      <tr
                        key={idx}
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                          background: idx % 2 === 0 ? 'rgba(7, 12, 24, 0.5)' : 'transparent'
                        }}
                      >
                        <td style={{ padding: '14px 16px', fontWeight: '600', color: '#F1F5F9' }}>
                          <span style={{ color: 'var(--gold-light)', display: 'block', fontSize: '0.92rem' }}>{t.old_section}</span>
                          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{t.old_act}</span>
                        </td>
                        <td style={{ padding: '14px 16px', fontWeight: '600', color: '#38BDF8' }}>
                          <span style={{ display: 'block', fontSize: '0.92rem' }}>{t.new_section}</span>
                          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{t.new_act}</span>
                        </td>
                        <td style={{ padding: '14px 16px', color: '#E2E8F0' }}>
                          {t.subject}
                        </td>
                        <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '0.78rem', lineHeight: 1.5 }}>
                          {t.transition_note}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 4: SAVED RESEARCH MEMOS ================= */}
        {activeTab === 'history' && (
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bookmark size={22} color="var(--gold-primary)" />
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: '#FFF', margin: 0 }}>
                  SAVED RESEARCH ARCHIVE
                </h2>
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Persisted locally on your private machine
              </span>
            </div>

            {savedMemos.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Scale size={36} color="var(--gold-border)" style={{ margin: '0 auto 12px' }} />
                <p style={{ fontSize: '0.9rem', marginBottom: '6px' }}>No research memorandums saved yet.</p>
                <p style={{ fontSize: '0.78rem' }}>Click "Save" on any generated legal memo in the Research tab to bookmark it here.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {savedMemos.map((memo) => (
                  <div
                    key={memo.id}
                    style={{
                      background: 'rgba(9, 17, 34, 0.8)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--gold-light)', fontWeight: '600' }}>
                        {memo.domain} • {memo.timestamp}
                      </div>
                      <h4 style={{ fontSize: '0.96rem', color: '#FFF', margin: '4px 0 0 0' }}>
                        {memo.query}
                      </h4>
                    </div>
                    <button
                      className="btn-primary"
                      style={{ fontSize: '0.78rem', padding: '6px 14px' }}
                      onClick={() => {
                        setResearchData(memo.data);
                        setActiveTab('research');
                      }}
                    >
                      <Eye size={14} />
                      <span>View Memo</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AI Document Analysis Modal */}
        {showAnalysisModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(2, 6, 18, 0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <div style={{
              background: '#0D1527',
              border: '1.5px solid var(--gold-border)',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '850px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 0 35px rgba(0,0,0,0.8)'
            }}>
              <div style={{
                padding: '16px 24px',
                borderBottom: '1px solid var(--gold-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'linear-gradient(180deg, #091122 0%, #060B16 100%)',
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Sparkles size={20} color="var(--gold-primary)" />
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: '#FFF', margin: 0 }}>
                    AI LEGAL ANALYSIS & STRUCTURED EXTRACTION
                  </h3>
                </div>
                <button
                  onClick={() => setShowAnalysisModal(false)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ padding: '24px', overflowY: 'auto', flexGrow: 1 }}>
                {analyzingDoc ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: 'var(--gold-light)' }}>
                    <RefreshCw size={36} color="var(--gold-primary)" className="animate-spin" style={{ margin: '0 auto 16px' }} />
                    <p style={{ fontSize: '0.96rem', fontWeight: '600' }}>Synthesizing Attorney-Grade Breakdown...</p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Extracting Key Facts, Issues, Sanhita Sections, and Ratio Decidendi.</p>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.88rem', color: '#E2E8F0', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                    {analysisData?.analysis_markdown}
                  </div>
                )}
              </div>

              <div style={{ padding: '14px 24px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  className="btn-secondary"
                  onClick={() => setShowAnalysisModal(false)}
                  style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Document Plain Text Preview Modal */}
        {showPreviewModal && previewDoc && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(2, 6, 18, 0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <div style={{
              background: '#0D1527',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '800px',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{
                padding: '16px 24px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <h3 style={{ fontSize: '1rem', color: '#FFF', margin: 0 }}>
                    {previewDoc.title}
                  </h3>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    {previewDoc.filename} • {previewDoc.word_count} Words
                  </span>
                </div>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ padding: '24px', overflowY: 'auto', flexGrow: 1 }}>
                <pre style={{
                  fontFamily: previewDoc.language === 'hi' ? 'var(--font-sans)' : 'var(--font-mono)',
                  fontSize: '0.82rem',
                  color: '#CBD5E1',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  lineHeight: 1.6
                }}>
                  {previewDoc.content}
                </pre>
              </div>

              <div style={{ padding: '14px 24px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  className="btn-secondary"
                  onClick={() => setShowPreviewModal(false)}
                  style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI Court Trial Cross-Examination Modal (जिरह एवं प्रतिपरीक्षा) */}
        {showCrossExamModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(2, 6, 18, 0.88)',
            backdropFilter: 'blur(12px)',
            zIndex: 110,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <div style={{
              background: '#0B1325',
              border: '2px solid #F59E0B',
              borderRadius: '14px',
              width: '100%',
              maxWidth: '920px',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 0 45px rgba(245, 158, 11, 0.25)'
            }}>
              {/* Modal Header */}
              <div style={{
                padding: '16px 24px',
                borderBottom: '1.5px solid rgba(245, 158, 11, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'linear-gradient(180deg, #161F36 0%, #0B1325 100%)',
                borderTopLeftRadius: '14px',
                borderTopRightRadius: '14px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Target size={22} color="#F59E0B" />
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#FFF', margin: 0, letterSpacing: '0.5px' }}>
                      COURT TRIAL CROSS-EXAMINATION & WITNESS STRATEGY (जिरह)
                    </h3>
                  </div>
                  <span style={{ fontSize: '0.74rem', color: '#CBD5E1', display: 'block', marginTop: '2px' }}>
                    Case: <strong>{crossExamDoc?.title}</strong> • Bharatiya Sakshya Adhiniyam (BSA) / Evidence Act s.145/148
                  </span>
                </div>
                <button
                  onClick={() => setShowCrossExamModal(false)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={22} />
                </button>
              </div>

              {/* Witness & Language Toolbar */}
              <div style={{
                padding: '12px 24px',
                background: 'rgba(7, 12, 24, 0.95)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px', fontWeight: '600' }}>
                      Deponent / Witness:
                    </label>
                    <select
                      value={crossExamWitness}
                      onChange={(e) => {
                        setCrossExamWitness(e.target.value);
                        handleOpenCrossExam(crossExamDoc, e.target.value, crossExamLang);
                      }}
                      style={{
                        padding: '6px 10px',
                        background: '#060B16',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        color: '#FFF',
                        fontSize: '0.8rem'
                      }}
                    >
                      <option value="auto">Auto-Detect Deponent</option>
                      <option value="complainant">Complainant / परिवादी</option>
                      <option value="police_io">Police I.O. / जांच अधिकारी</option>
                      <option value="eye_witness">Eye Witness / प्रत्यक्षदर्शी</option>
                      <option value="medical_officer">Medical Officer / चिकित्सक</option>
                      <option value="hostile">Adverse / Hostile Witness</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px', fontWeight: '600' }}>
                      Courtroom Language:
                    </label>
                    <select
                      value={crossExamLang}
                      onChange={(e) => {
                        setCrossExamLang(e.target.value);
                        handleOpenCrossExam(crossExamDoc, crossExamWitness, e.target.value);
                      }}
                      style={{
                        padding: '6px 10px',
                        background: '#060B16',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        color: '#FFF',
                        fontSize: '0.8rem'
                      }}
                    >
                      <option value="hi">हिंदी (District Court Hindi)</option>
                      <option value="en">Courtroom English</option>
                      <option value="hinglish">Hinglish (Trial Practice)</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenCrossExam(crossExamDoc, crossExamWitness, crossExamLang)}
                  style={{
                    padding: '6px 14px',
                    fontSize: '0.78rem',
                    background: 'rgba(245, 158, 11, 0.15)',
                    color: '#F59E0B',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <RefreshCw size={13} className={crossExamLoading ? "animate-spin" : ""} />
                  <span>Regenerate Strategy</span>
                </button>
              </div>

              {/* Questions Content */}
              <div style={{ padding: '24px', overflowY: 'auto', flexGrow: 1 }}>
                {crossExamLoading ? (
                  <div style={{ padding: '50px 20px', textAlign: 'center' }}>
                    <RefreshCw size={40} color="#F59E0B" className="animate-spin" style={{ margin: '0 auto 16px' }} />
                    <p style={{ fontSize: '1rem', fontWeight: '600', color: '#F59E0B' }}>
                      Formulating Courtroom Cross-Examination Questions...
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Analyzing previous statements, FIR delays, and contradictions under Section 145/148 BSA.
                    </p>
                  </div>
                ) : (
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#E2E8F0',
                    lineHeight: 1.7,
                    whiteSpace: 'pre-wrap',
                    fontFamily: crossExamLang === 'hi' ? 'var(--font-sans)' : 'inherit'
                  }}>
                    {crossExamData?.cross_examination_markdown}
                  </div>
                )}
              </div>

              {/* Modal Footer with PDF Export */}
              <div style={{
                padding: '14px 24px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(6, 11, 22, 0.8)'
              }}>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  Ready for direct presentation in Sessions / District Court
                </span>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={handleDownloadCrossExamPDF}
                    disabled={!crossExamData?.cross_examination_markdown}
                    style={{
                      padding: '8px 18px',
                      fontSize: '0.84rem',
                      fontWeight: '600',
                      background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                      color: '#000',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 2px 10px rgba(245, 158, 11, 0.4)'
                    }}
                    title="Export / Download Cross-Examination Question Bank as PDF"
                  >
                    <FileDown size={16} />
                    <span>Download Cross-Exam PDF (पीडीएफ डाउनलोड करें)</span>
                  </button>

                  <button
                    className="btn-secondary"
                    onClick={() => {
                      if (crossExamData?.cross_examination_markdown) {
                        navigator.clipboard.writeText(crossExamData.cross_examination_markdown);
                        alert("Cross-examination questions copied to clipboard!");
                      }
                    }}
                    style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                  >
                    <Copy size={14} />
                    <span>Copy Text</span>
                  </button>

                  <button
                    className="btn-secondary"
                    onClick={() => setShowCrossExamModal(false)}
                    style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>



      {/* Modern Legal Footer */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        padding: '18px 28px',
        background: '#04070E',
        fontSize: '0.78rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Scale size={16} color="var(--gold-primary)" />
            <span>NyayaAI • Private Indian Legal Research & Multi-Model Precedent System</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>Indian Kanoon • India Code • Supreme Court e-SCR • High Courts • Law Commission</span>
            <span style={{ color: 'var(--gold-primary)' }}>100% Privacy Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
