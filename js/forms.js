// Presupuesto: valida y abre el correo del usuario con la solicitud preparada. No se envía nada a ningún servidor.
const f = document.getElementById('presupuesto');
if (f) {
  const q = new URLSearchParams(location.search).get('servicio');
  if (q && [...f.servicio.options].some((o) => o.value === q)) f.servicio.value = q;
  const reglas = {
    nombre: (v) => v.trim().length > 1 || 'Escribe tu nombre.',
    contacto: (v) => /^\S+@\S+\.\S+$/.test(v.trim()) || /^[+\d][\d\s().-]{7,}$/.test(v.trim()) || 'Escribe un correo o un teléfono válido.',
    equipo: (v) => !!v || 'Elige el tipo de equipo.',
    servicio: (v) => !!v || 'Elige un servicio.',
    incidencia: (v) => v.trim().length >= 15 || 'Describe lo que ocurre con al menos 15 caracteres.',
    privacidad: (v, el) => el.checked || 'Debes aceptar la información de privacidad para continuar.',
  };
  const out = document.getElementById('salida');
  f.addEventListener('submit', (e) => {
    e.preventDefault();
    let primero = null;
    for (const n in reglas) {
      const r = reglas[n](f[n].value, f[n]);
      document.getElementById('e-' + n).textContent = r === true ? '' : r;
      f[n].setAttribute('aria-invalid', String(r !== true));
      if (r !== true && !primero) primero = f[n];
    }
    if (primero) { primero.focus(); return; }
    const to = f.dataset.email;
    if (!to || to.startsWith('[PENDIENTE')) { out.textContent = 'El correo de contacto aún no está configurado en esta web.'; return; }
    const d = Object.fromEntries(new FormData(f));
    const texto = `Nombre: ${d.nombre}\nContacto: ${d.contacto} (preferencia: ${d.preferencia})\nEquipo: ${d.equipo}${d.modelo ? ' · ' + d.modelo : ''}\nServicio: ${f.servicio.selectedOptions[0].text}\n\nIncidencia:\n${d.incidencia}`;
    location.href = `mailto:${to}?subject=${encodeURIComponent('Solicitud de presupuesto')}&body=${encodeURIComponent(texto)}`;
    out.innerHTML = 'Se abrirá tu programa de correo con la solicitud preparada. Revísala y pulsa Enviar allí: hasta entonces no se ha enviado nada. ';
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'btn btn--ghost btn--sm'; b.textContent = 'Copiar solicitud';
    b.onclick = () => navigator.clipboard.writeText(texto).then(() => { b.textContent = 'Copiada'; });
    out.append(b);
  });
}
