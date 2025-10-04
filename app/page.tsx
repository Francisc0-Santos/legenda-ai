'use client';
import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [msg, setMsg] = useState<string>('');

  const handleProcess = async () => {
    if (!email.includes('@')) { setMsg('Coloque um e-mail válido.'); return; }
    if (!file) { setMsg('Escolha um vídeo .mp4'); return; }
    setMsg(''); setLoading(true);

    const fd = new FormData();
    fd.append('email', email);
    fd.append('file', file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/full_process`, {
        method: 'POST',
        body: fd
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Erro ao processar');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      setMsg('Prontinho! Baixe seu vídeo legendado. 🎉');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setMsg(`⚠️ ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 bg-gray-50">
      <h1 className="text-3xl font-bold">Legenda Viral AI</h1>
      <p className="text-gray-600">Envie um vídeo .mp4 e receba de volta com legendas automáticas.</p>

      <input
        className="border rounded px-3 py-2 w-80"
        type="email"
        placeholder="Seu e-mail (para plano/limite)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-80"
        type="file"
        accept="video/mp4"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={handleProcess}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Processando...' : 'Gerar vídeo legendado'}
      </button>

      {msg && <p className="text-sm text-gray-700">{msg}</p>}

      {videoUrl && (
        <div className="mt-6">
          <video src={videoUrl} controls className="max-w-md rounded shadow" />
          <a
            href={videoUrl}
            download="video_legenda.mp4"
            className="block text-blue-600 underline mt-2 text-center"
          >
            Baixar vídeo
          </a>
        </div>
      )}
    </main>
  );
}
