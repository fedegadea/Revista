/* ============================================================
   EMILIA ITZA — admin.js
============================================================ */

let editingId = null;

function showView(name) {
  document.querySelectorAll('.admin-view').forEach(v => v.classList.remove('active'));
  document.getElementById('view' + name.charAt(0).toUpperCase() + name.slice(1))?.classList.add('active');
  document.querySelectorAll('.admin-nav-link[data-view]').forEach(l => {
    l.classList.toggle('active', l.dataset.view === name || (name === 'form' && l.dataset.view === 'new'));
  });
}

document.getElementById('navArticles')?.addEventListener('click', () => showView('articles'));
document.getElementById('navNew')?.addEventListener('click', startNew);
document.getElementById('btnNewArticle')?.addEventListener('click', startNew);
document.getElementById('cancelBtn')?.addEventListener('click', () => { editingId = null; showView('articles'); });

function updateStats() {
  const arts = getArticles();
  const published = arts.filter(a => a.status === 'published').length;
  const drafts    = arts.filter(a => a.status === 'draft').length;
  const featured  = arts.filter(a => a.featured).length;
  document.getElementById('adminStats').innerHTML = `
    <div class="stat-card"><div class="stat-num">${arts.length}</div><div class="stat-label">Total</div></div>
    <div class="stat-card"><div class="stat-num">${published}</div><div class="stat-label">Publicados</div></div>
    <div class="stat-card"><div class="stat-num">${drafts}</div><div class="stat-label">Borradores</div></div>
    <div class="stat-card"><div class="stat-num">${featured}</div><div class="stat-label">Destacados</div></div>
  `;
}

function renderTable() {
  const arts  = getArticles();
  const tbody = document.getElementById('adminTableBody');
  const empty = document.getElementById('tableEmpty');
  updateStats();
  if (!arts.length) { tbody.innerHTML = ''; empty.style.display = 'block'; return; }
  empty.style.display = 'none';
  tbody.innerHTML = arts.map(a => `
    <tr>
      <td>
        <div class="td-title-wrap">
          <img class="td-thumb" src="${a.image || 'https://placehold.co/52x38/f4f1ec/9e9890?text=EI'}" alt="" onerror="this.style.opacity=0"/>
          <div>
            <div class="td-title-text">${a.title}</div>
            <div class="td-sub">${(a.excerpt || '').substring(0, 60)}…</div>
          </div>
        </div>
      </td>
      <td><span class="cat-badge">${catLabel(a.category)}</span></td>
      <td style="font-family:var(--font-mono);font-size:11px;color:var(--ink-faint)">${fmtDate(a.date)}</td>
      <td><span class="status-badge status-${a.status}">${a.status === 'published' ? 'Publicado' : 'Borrador'}</span></td>
      <td>
        <button class="featured-btn" data-id="${a.id}" style="background:none;border:none;cursor:pointer;font-size:16px;padding:2px 6px;opacity:${a.featured ? '1' : '0.3'};color:${a.featured ? 'var(--bordo)' : 'var(--ink-faint)'}">
          ${a.featured ? '★' : '☆'}
        </button>
      </td>
      <td>
        <div class="action-btns">
          <button class="btn-edit" data-id="${a.id}">Editar</button>
          <button class="btn-del"  data-id="${a.id}">Eliminar</button>
        </div>
      </td>
    </tr>`).join('');
  tbody.querySelectorAll('.btn-edit').forEach(b => b.addEventListener('click', () => startEdit(b.dataset.id)));
  tbody.querySelectorAll('.btn-del').forEach(b => b.addEventListener('click', () => confirmDelete(b.dataset.id)));
  tbody.querySelectorAll('.featured-btn').forEach(b => b.addEventListener('click', () => toggleFeatured(b.dataset.id)));
}

function startNew() {
  editingId = null;
  document.getElementById('formTitle').textContent = 'Nuevo artículo';
  document.getElementById('submitBtn').textContent = 'Publicar artículo';
  document.getElementById('articleForm').reset();
  document.getElementById('f-id').value = '';
  document.getElementById('f-date').value = new Date().toISOString().split('T')[0];
  hidePreview();
  showView('form');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function startEdit(id) {
  const a = getArticles().find(x => x.id === id);
  if (!a) return;
  editingId = id;
  document.getElementById('formTitle').textContent = 'Editar artículo';
  document.getElementById('submitBtn').textContent = 'Guardar cambios';
  sv('f-id', a.id); sv('f-title', a.title); sv('f-excerpt', a.excerpt || '');
  sv('f-content', a.content || ''); sv('f-image', a.image || '');
  sv('f-category', a.category); sv('f-date', a.date || '');
  sv('f-status', a.status || 'published');
  document.getElementById('f-featured').checked = !!a.featured;
  if (a.image) showPreview(a.image); else hidePreview();
  showView('form');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function sv(id, val) { const el = document.getElementById(id); if (el) el.value = val; }

document.getElementById('f-image')?.addEventListener('input', debounce(e => {
  const url = e.target.value.trim();
  if (url) showPreview(url); else hidePreview();
}, 600));

function showPreview(url) { const img = document.getElementById('imgPreview'); img.src = url; img.classList.add('visible'); }
function hidePreview() { const img = document.getElementById('imgPreview'); img.classList.remove('visible'); img.src = ''; }

document.getElementById('articleForm')?.addEventListener('submit', e => {
  e.preventDefault();
  if (!validateForm()) return;
  const arts = getArticles();
  const id   = editingId || Date.now().toString();
  const data = {
    id,
    title:    gv('f-title'),
    excerpt:  gv('f-excerpt'),
    content:  gv('f-content'),
    image:    gv('f-image'),
    category: gv('f-category'),
    date:     gv('f-date') || new Date().toISOString().split('T')[0],
    status:   gv('f-status') || 'published',
    featured: document.getElementById('f-featured').checked,
  };
  if (editingId) {
    const idx = arts.findIndex(a => a.id === editingId);
    if (idx > -1) arts[idx] = data;
  } else {
    arts.unshift(data);
  }
  saveArticles(arts);
  toast(editingId ? 'Artículo actualizado ✓' : 'Artículo publicado ✓');
  editingId = null;
  showView('articles');
  renderTable();
});

function gv(id) { return (document.getElementById(id)?.value || '').trim(); }

function validateForm() {
  const req = ['f-title', 'f-excerpt', 'f-content', 'f-category'];
  let ok = true;
  req.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const empty = !el.value.trim();
    el.closest('.field')?.classList.toggle('has-error', empty);
    if (empty) ok = false;
  });
  if (!ok) toast('Completá los campos requeridos (*)', true);
  return ok;
}

function toggleFeatured(id) {
  const arts = getArticles();
  const a = arts.find(x => x.id === id);
  if (!a) return;
  arts.forEach(x => x.featured = false);
  a.featured = true;
  saveArticles(arts);
  renderTable();
  toast('★ Artículo destacado en portada');
}

let pendingDelete = null;

function confirmDelete(id) {
  const a = getArticles().find(x => x.id === id);
  pendingDelete = id;
  document.getElementById('confirmMsg').textContent = `¿Eliminás "${a?.title || 'este artículo'}"? Esta acción no se puede deshacer.`;
  document.getElementById('confirmOverlay').style.display = 'flex';
}

document.getElementById('confirmYes')?.addEventListener('click', () => {
  if (!pendingDelete) return;
  saveArticles(getArticles().filter(a => a.id !== pendingDelete));
  pendingDelete = null;
  document.getElementById('confirmOverlay').style.display = 'none';
  renderTable();
  toast('Artículo eliminado');
});
document.getElementById('confirmNo')?.addEventListener('click', () => {
  pendingDelete = null;
  document.getElementById('confirmOverlay').style.display = 'none';
});

function toast(msg, isError = false) {
  const el = document.getElementById('toastEl');
  if (!el) return;
  el.textContent = msg;
  el.classList.toggle('toast-error', isError);
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 3000);
}

showView('articles');
renderTable();
