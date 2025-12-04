// app-firebase.js
document.addEventListener('DOMContentLoaded', ()=> {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  form.addEventListener('submit', async (e)=> {
    e.preventDefault();
    status.textContent = 'Enviando...';
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());
    data.createdAt = new Date().toISOString();

    try {
      const fire = window.NEXUS_FIREBASE;
      if(fire && fire.db) {
        // write to Firestore collection 'messages'
        await fire.db.collection('messages').add(data);
      }
      // call Firebase Function endpoint to send email & WhatsApp (if configured)
      try {
        await fetch('/functions/sendNotification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      } catch(err){
        console.warn('Cloud function call failed (may require deployment):', err);
      }

      status.textContent = 'Mensagem enviada! Obrigado — responderemos em até 24h.';
      form.reset();
    } catch(err) {
      console.error(err);
      status.textContent = 'Erro ao enviar. Verifique o console.';
    }
  });
});
