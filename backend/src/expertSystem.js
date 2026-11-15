export function evaluarConsultaExperta(mensaje, datosContexto = null) {
  const texto = (mensaje || "").toLowerCase();
  
  // 1. Presión Arterial e Hipertensión
  if (texto.includes('presion') || texto.includes('presión') || texto.includes('hiperten') || texto.includes('pa')) {
    return {
      categoria: "Cardiovascular / Signos Vitales",
      recomendacion: "Protocolo Geriátrico PA: Realizar medición en reposo cada 12 horas. Si la sistólica supera 140 mmHg o la diastólica 90 mmHg, registrar alerta roja en el sistema y notificar al médico.",
      nivelPrioridad: "Alta"
    };
  }
  
  // 2. Control de Dietas y Nutrición (Desayuno, Almuerzo, Merienda, Cena)
  if (texto.includes('dieta') || texto.includes('aliment') || texto.includes('comida') || texto.includes('blanda') || texto.includes('hiposódica')) {
    return {
      categoria: "Nutrición y Dietética",
      recomendacion: "Control Nutricional: Las 4 raciones diarias (desayuno, almuerzo, merienda y cena) deben cumplir con la consistencia prescrita (blanda, hiposódica o astringente) con un margen máximo de retraso de 30 minutos.",
      nivelPrioridad: "Media"
    };
  }

  // 3. Medicamentos y Protocolo de los 5 Correctos
  if (texto.includes('medicamento') || texto.includes('dosis') || texto.includes('pastilla') || texto.includes('farma') || texto.includes('omision')) {
    return {
      categoria: "Farmacología y Trazabilidad",
      recomendacion: "Protocolo de los 5 Correctos: Verifique paciente, fármaco, dosis, vía y horario correcto. Si hay rechazo u omisión, registre inmediatamente la incidencia con su respectiva justificación en el sistema.",
      nivelPrioridad: "Alta"
    };
  }

  // 4. Glucemia / Diabetes
  if (texto.includes('glucemia') || texto.includes('azucar') || texto.includes('diabetes')) {
    return {
      categoria: "Control Metabólico",
      recomendacion: "Protocolo Glicemia: Control en ayunas según indicación médica. Valores fuera de rango (menores a 70 mg/dL o mayores a 180 mg/dL) deben reportarse al médico tratante de inmediato.",
      nivelPrioridad: "Alta"
    };
  }

  // Respuesta por defecto con el texto exacto consultado
  return {
    categoria: "Acompañamiento General AyniSalud",
    recomendacion: `Consulta registrada ("${mensaje}"). Mantenga la observación activa del bienestar general del residente, asegure una hidratación adecuada y verifique el registro oportuno en el panel operativo.`,
    nivelPrioridad: "Normal"
  };
}