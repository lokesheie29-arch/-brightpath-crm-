import React, { useState } from 'react';
import { Database, AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabaseClient';

export default function SupabaseStatusBanner() {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const envTemplate = `VITE_SUPABASE_URL=https://your-project-id.supabase.co\nVITE_SUPABASE_ANON_KEY=your-public-anon-key`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(envTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isSupabaseConfigured) {
    return (
      <div style={{
        background: 'rgba(16, 185, 129, 0.1)',
        borderBottom: '1px solid rgba(16, 185, 129, 0.25)',
        padding: '0.4rem 1.5rem',
        fontSize: '0.78rem',
        color: '#34d399',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={14} />
          <span><strong>Supabase Connected:</strong> Live cloud database & Auth persistence enabled.</span>
        </div>
        <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Region: Cloud PostgreSQL</span>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.12), rgba(56, 189, 248, 0.08))',
      borderBottom: '1px solid rgba(245, 158, 11, 0.25)',
      padding: '0.5rem 1.5rem',
      fontSize: '0.8rem',
      color: '#f8fafc'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Database size={15} color="#f59e0b" />
          <span>
            <strong style={{ color: '#fbbf24' }}>Workshop Prototype Mode:</strong> Real database credentials not yet loaded.
          </span>
          <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: '4px', color: '#cbd5e1' }}>
            Local InMemory State Active
          </span>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: 'none',
            border: 'none',
            color: '#38bdf8',
            fontSize: '0.75rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            padding: '2px 6px',
            borderRadius: '4px'
          }}
        >
          {expanded ? 'Hide Setup Guide' : 'Connect Your Supabase Project'}
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {expanded && (
        <div style={{
          marginTop: '0.75rem',
          padding: '1rem',
          background: '#090d16',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem'
        }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc' }}>
            Quick 3-Step Supabase Setup:
          </div>
          <ol style={{ paddingLeft: '1.25rem', fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.6 }}>
            <li>Go to <a href="https://supabase.com" target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>supabase.com</a>, create a free project named <code>brightpath-crm</code>.</li>
            <li>In Supabase, navigate to <strong>Project Settings &gt; API</strong> and copy your <strong>Project URL</strong> and <strong>anon / public key</strong>.</li>
            <li>Create a <code>.env</code> file in your project root with the keys below, then restart the dev server:</li>
          </ol>

          <div style={{
            position: 'relative',
            background: '#131b2e',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            color: '#38bdf8',
            border: '1px solid rgba(56, 189, 248, 0.2)'
          }}>
            <pre style={{ margin: 0 }}>{envTemplate}</pre>
            <button
              onClick={copyToClipboard}
              style={{
                position: 'absolute',
                right: '0.5rem',
                top: '0.5rem',
                background: 'rgba(255,255,255,0.08)',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 8px',
                color: '#fff',
                fontSize: '0.7rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
