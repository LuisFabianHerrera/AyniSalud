import React, { useState } from 'react';

export default function AsistenteExperto() {
  const [abierto, setAbierto] = useState(false);
  const [consulta, setConsulta] = useState('');
  const [cargando, setCargando] = useState(false);
  const [respuesta, setRespuesta] = useState(null);
  const [error, setError] = useState('');

  const sugerencias = [
    'Protocolo presión arterial alta',
    'Pautas dieta blanda e hiposódica',
    'Protocolo de los 5 correctos en fármacos'
  ];

  const enviarConsulta = async (textoConsulta) => {
    const pregunta = textoConsulta || consulta;
    if (!pregunta.trim() || cargando) return;

    setCargando(true);
    setError('');
    setRespuesta(null);
    setConsulta(pregunta);

    try {
      const token = sessionStorage.getItem('aynisalud_token');
      const res = await fetch('/api/asistente-experto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ mensaje: pregunta }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          sessionStorage.removeItem('aynisalud_token');
          window.dispatchEvent(new Event('ayni-expired'));
        }
        throw new Error(data.error || 'No se pudo procesar la consulta.');
      }
      if (data.success) setRespuesta(data.resultado);
      else setError(data.error || 'No se pudo procesar la consulta.');
    } catch (err) {
      setError(err.message || 'Error de conexión con el servidor local.');
    } finally {
      setCargando(false);
    }
  };

  const colorPrioridad = (prioridad) => {
    switch (prioridad) {
      case 'Alta': return 'bg-red-100 text-red-800 border-red-300';
      case 'Media': return 'bg-amber-100 text-amber-800 border-amber-300';
      default: return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!abierto && (
        <button type="button" onClick={() => setAbierto(true)} className="flex items-center gap-3 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-base px-5 py-4 rounded-full shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-300">
          <span className="text-xl">🩺</span><span>Asistente Experto</span>
        </button>
      )}
      {abierto && (
        <div className="w-96 max-w-[92vw] bg-white border-2 border-teal-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          <div className="bg-teal-800 text-white px-5 py-4 flex justify-between items-center">
            <div><h3 className="text-lg font-bold flex items-center gap-2"><span>🩺</span> Asistente Gerontológico</h3><p className="text-xs text-teal-100">Sistema Experto Local • AyniSalud</p></div>
            <button type="button" onClick={() => setAbierto(false)} className="text-white hover:bg-teal-700 rounded-lg p-2 text-lg font-bold" aria-label="Cerrar asistente">✕</button>
          </div>
          <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto bg-slate-50">
            <div><p className="text-sm font-semibold text-slate-700 mb-2">Consultas rápidas de turno:</p><div className="flex flex-wrap gap-2">
              {sugerencias.map((sug) => <button key={sug} type="button" disabled={cargando} onClick={() => enviarConsulta(sug)} className="text-left text-sm bg-white hover:bg-teal-50 disabled:opacity-50 text-teal-900 border border-teal-300 px-3 py-2 rounded-lg transition">{sug}</button>)}
            </div></div>
            <form onSubmit={(e) => { e.preventDefault(); enviarConsulta(); }} className="space-y-3">
              <label className="block text-sm font-semibold text-slate-800">Escribe tu consulta operativa o clínica:</label>
              <textarea rows="2" value={consulta} onChange={(e) => setConsulta(e.target.value)} placeholder="Ej. ¿Qué hacer si hay retraso en medicación?" maxLength={1000} className="w-full p-3 text-base text-slate-900 bg-white border-2 border-slate-300 rounded-xl focus:border-teal-600 focus:outline-none" />
              <button type="submit" disabled={cargando || !consulta.trim()} className="w-full bg-teal-700 hover:bg-teal-800 disabled:bg-slate-400 text-white font-bold text-base py-3 rounded-xl shadow transition">{cargando ? 'Analizando protocolo...' : 'Consultar Protocolo'}</button>
            </form>
            {error && <div role="alert" className="p-3 bg-red-50 border border-red-300 text-red-800 text-sm rounded-xl">{error}</div>}
            {respuesta && (
              <div className="bg-white border-2 border-teal-600 rounded-xl p-4 space-y-2 shadow-sm">
                <div className="flex justify-between items-center gap-2"><span className="text-xs font-bold uppercase tracking-wider text-teal-800">{respuesta.categoria}</span><span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${colorPrioridad(respuesta.nivelPrioridad)}`}>Prioridad {respuesta.nivelPrioridad}</span></div>
                <p className="text-base text-slate-800 leading-relaxed">{respuesta.recomendacion}</p>
                <p className="text-xs text-slate-500">Orientación de apoyo; no sustituye la valoración del personal sanitario.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
