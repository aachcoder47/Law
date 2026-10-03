import React, { useState, useEffect } from 'react';
import {
  Globe, Shield, Database, ExternalLink, CheckCircle,
  Layers, Award, Cpu, Sparkles, Server, BookOpen, Scale
} from 'lucide-react';

const API_BASE = "http://127.0.0.1:8000/api/v1";

export default function LegalEcosystemHub() {
  const [ecosystem, setEcosystem] = useState({
    indian_primary_databases: [
      {
        name: "eSCR (Digital Supreme Court Reports)",
        status: "Active / Integrated",
        coverage: "Official Supreme Court of India judgments from 1950 to present with digital neutral citations.",
        url: "https://escr.sci.gov.in"
      },
      {
        name: "India Code (Legislative Department)",
        status: "Active / Integrated",
        coverage: "Central & State Acts, Gazette Notifications, Rules & Statutory Amendments (1836 to 2026).",
        url: "https://www.indiacode.nic.in"
      },
      {
        name: "Indian Kanoon",
        status: "Active / Integrated",
        coverage: "Federated search across SC, all 25 High Courts, Tribunals, and Law Commission reports.",
        url: "https://indiankanoon.org"
      },
      {
        name: "High Courts e-Courts Portal",
        status: "Active / Integrated",
        coverage: "All 25 Indian High Courts rulings, cause lists, daily orders, and certified transcripts.",
        url: "https://services.ecourts.gov.in"
      },
      {
        name: "SCC Online (Licensed API Adapter)",
        status: "Licensed Ready",
        coverage: "Supreme Court Cases (SCC), High Court volumes, true print law reports & digest notes.",
        url: "https://www.scconline.com"
      },
      {
        name: "Manupatra (Licensed API Adapter)",
        status: "Licensed Ready",
        coverage: "Comprehensive Indian case law repository, MANU citations, judicial analytics.",
        url: "https://www.manupatrafast.com"
      }
    ],
    global_legal_ai_platforms: [
      {
        name: "Lexis+ AI",
        vendor: "LexisNexis",
        capabilities: "Conversational legal search, Shepard's citation verification, automated legal drafting."
      },
      {
        name: "Westlaw CoCounsel",
        vendor: "Thomson Reuters / Casetext",
        capabilities: "KeyCite precedent verification, deposition prep, document review, and brief analysis."
      },
      {
        name: "Harvey AI",
        vendor: "Harvey / OpenAI",
        capabilities: "Enterprise law firm contract analysis, due diligence, litigation workflow orchestration."
      },
      {
        name: "LegalOn",
        vendor: "LegalOn Technologies",
        capabilities: "AI contract review, clause playbooks, risk scoring, pre-signature compliance audit."
      },
      {
        name: "Clio Draft / Clio ft. AI Lawyer",
        vendor: "Clio (Lawyaw)",
        capabilities: "Automated legal drafting, court form automation, e-signatures, practice management."
      },
      {
        name: "Prism AI",
        vendor: "Prism Legal",
        capabilities: "Advanced legal analytics, judicial outcome modeling, appellate brief analysis."
      },
      {
        name: "Spellbook",
        vendor: "Spellbook (Rally)",
        capabilities: "Contract drafting inside Microsoft Word with GPT-4 legal fine-tuning."
      },
      {
        name: "Rocket Lawyer AI",
        vendor: "Rocket Lawyer",
        capabilities: "Consumer and business legal document generation and automated compliance."
      },
      {
        name: "Smokeball AI",
        vendor: "Smokeball",
        capabilities: "Legal practice management, matter insights, automated document creation."
      }
    ]
  });

  useEffect(() => {
    fetchEcosystem();
  }, []);

  const fetchEcosystem = async () => {
    try {
      const res = await fetch(`${API_BASE}/ecosystem`);
      if (res.ok) {
        const d = await res.json();
        if (d.indian_primary_databases) setEcosystem(d);
      }
    } catch (e) {
      console.log("Using static ecosystem definitions");
    }
  };

  return (
    <div style={{ padding: '24px 0' }}>
      {/* Ecosystem Header */}
      <div className="glass-card" style={{ padding: '24px 30px', marginBottom: '24px', borderLeft: '4px solid var(--accent-cyan)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
          <Globe size={26} color="var(--accent-cyan)" />
          <h2 style={{ fontSize: '1.45rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-serif)' }}>
            Legal AI Ecosystem Hub (वैश्विक एवं भारतीय विधिक AI)
          </h2>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
          Connectors and architecture mapped across Indian Primary Legal Repositories (eSCR, India Code, Kanoon, SCC, Manupatra) and Global Legal AI benchmarks (Lexis+ AI, Westlaw CoCounsel, Harvey AI, Clio Draft, LegalOn).
        </p>
      </div>

      {/* SECTION 1: Indian Primary Legal Sources & Connectors */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Scale size={20} color="var(--gold-primary)" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--gold-light)', margin: 0 }}>
            Indian Authoritative Legal Databases (भारतीय विधिक डेटाबेस)
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {ecosystem.indian_primary_databases.map((db, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '1.02rem', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>
                    {db.name}
                  </h4>
                  <span className={`status-tag ${db.status.includes('Active') ? 'status-good' : 'status-replaced'}`}>
                    <CheckCircle size={12} /> {db.status}
                  </span>
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 14px 0' }}>
                  {db.coverage}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Authority: Central / Judiciary</span>
                {db.url && (
                  <a
                    href={db.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '0.78rem', color: 'var(--gold-primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    Official Portal <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Global Legal AI Platform Benchmarks */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Sparkles size={20} color="var(--accent-cyan)" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--accent-cyan)', margin: 0 }}>
            Global Legal AI Engines & Reference Architectures
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {ecosystem.global_legal_ai_platforms.map((ai, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '1.02rem', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>
                  {ai.name}
                </h4>
                <span className="gold-badge" style={{ fontSize: '0.7rem' }}>
                  {ai.vendor}
                </span>
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                {ai.capabilities}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
