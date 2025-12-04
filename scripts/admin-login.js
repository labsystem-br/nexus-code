// admin-login.js
document.addEventListener('DOMContentLoaded', ()=>{
  const form = document.getElementById('login');
  const status = document.getElementById('loginStatus');
  const fire = window.NEXUS_FIREBASE;
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    status.textContent='Entrando...';
    const fd = new FormData(form);
    const {email,password} = Object.fromEntries(fd.entries());
    try {
      await fire.auth.signInWithEmailAndPassword(email,password);
      location.href='/admin/dashboard.html';
    } catch(err){ console.error(err); status.textContent='Erro no login'; }
  });
});
