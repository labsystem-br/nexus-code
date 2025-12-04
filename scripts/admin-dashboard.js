// admin-dashboard.js
document.addEventListener('DOMContentLoaded', async ()=>{
  const fire = window.NEXUS_FIREBASE;
  fire.auth.onAuthStateChanged(async user=>{
    if(!user){ location.href='/admin/login.html'; return; }
    const q = await fire.db.collection('messages').orderBy('createdAt','desc').limit(200).get();
    const messages = q.docs.map(d=>({id:d.id, ...d.data()}));
    const container = document.getElementById('messages');
    container.innerHTML = '';
    messages.forEach(m=>{
      const el = document.createElement('div');
      el.className='card';
      el.innerHTML = `<strong>${m.name}</strong> <small>${m.email}</small><p>${m.message}</p><small>${m.createdAt || ''}</small>`;
      container.appendChild(el);
    });
    document.getElementById('stats').innerHTML = `<p>Mensagens: ${messages.length}</p>`;
  });
});
