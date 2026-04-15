import { useEffect, useState } from 'react';
import './App.css';

const API_BASE = import.meta.env.VITE_API_BASE || '';

interface Report {
  id: string;
  timestamp: string;
  status: string;
  severity: string;
  type: string;
  description: string;
  url?: string;
  elementTag?: string;
  elementSelector?: string;
  screenshot?: string;
  video?: string;
  sessionReplay?: { events: unknown[] } | null;
}

function App() {
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/reports`)
      .then((r) => r.json())
      .then((data) => {
        setReports(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch(`${API_BASE}/api/stats`)
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => {});
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`${API_BASE}/api/reports/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const deleteReport = async (id: string) => {
    if (!confirm('Excluir report?')) return;
    await fetch(`${API_BASE}/api/reports/${id}`, { method: 'DELETE' });
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🐛 BugDetector Cloud</h1>
        <div className="stats">
          <span className="badge">Total: {stats.total}</span>
          <span className="badge pending">Pendentes: {stats.pending}</span>
          <span className="badge resolved">Resolvidos: {stats.resolved}</span>
        </div>
      </header>

      <main className="main">
        {loading ? (
          <p className="center">Carregando...</p>
        ) : reports.length === 0 ? (
          <p className="center">Nenhum report recebido ainda.</p>
        ) : (
          <div className="list">
            {reports.map((report) => (
              <div key={report.id} className="card">
                <div className="card-header">
                  <div>
                    <div className="title">
                      <span className={`dot ${report.severity}`} />
                      {report.description.slice(0, 80)}
                      {report.description.length > 80 ? '...' : ''}
                    </div>
                    <div className="meta">
                      {report.elementTag} • {new Date(report.timestamp).toLocaleString('pt-BR')} • {report.status}
                    </div>
                  </div>
                  <div className="actions">
                    {report.status !== 'resolved' && (
                      <button onClick={() => updateStatus(report.id, 'resolved')}>Resolver</button>
                    )}
                    <button className="danger" onClick={() => deleteReport(report.id)}>Excluir</button>
                  </div>
                </div>

                <button
                  className="toggle"
                  onClick={() => setExpandedId(expandedId === report.id ? null : report.id)}
                >
                  {expandedId === report.id ? 'Ocultar detalhes' : 'Ver detalhes'}
                </button>

                {expandedId === report.id && (
                  <div className="details">
                    {report.screenshot && (
                      <div>
                        <label>Screenshot</label>
                        <img src={report.screenshot} alt="Screenshot" className="thumb" />
                      </div>
                    )}
                    {report.video && (
                      <div>
                        <label>Vídeo</label>
                        <video src={report.video} controls className="thumb" />
                      </div>
                    )}
                    {report.sessionReplay && report.sessionReplay.events && report.sessionReplay.events.length > 0 && (
                      <div>
                        <label>Session Replay ({report.sessionReplay.events.length} eventos)</label>
                        <p className="hint">Visualização disponível em breve no dashboard.</p>
                      </div>
                    )}
                    <div>
                      <label>URL</label>
                      <a href={report.url} target="_blank" rel="noreferrer">{report.url}</a>
                    </div>
                    <div>
                      <label>Seletor</label>
                      <code>{report.elementSelector}</code>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
