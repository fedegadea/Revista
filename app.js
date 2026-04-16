/* ============================================================
   EMILIA ITZA — app.js
============================================================ */

const STORAGE_KEY = 'emiliaitza_articles_v1';

function getArticles() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : seedData();
  } catch { return seedData(); }
}

function saveArticles(arts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arts));
}

function seedData() {
  const arts = [
    {
      id: 'a1', title: 'La producción artesanal de Colonia recupera tradiciones centenarias',
      category: 'cultura', status: 'published',
      excerpt: 'Artesanos locales reviven técnicas ancestrales de tejido y cerámica que habían quedado en el olvido durante décadas.',
      content: 'Los talleres artesanales de Colonia del Sacramento están experimentando un renacimiento sin precedentes. Decenas de artesanos han vuelto a las técnicas de sus abuelos, recuperando el tejido en telar y la cerámica vidriada que caracterizaban a la región hace más de un siglo.\n\nEsta tendencia, que comenzó durante la pandemia como una forma de reinventarse, se ha convertido hoy en un movimiento cultural de gran relevancia para la identidad coloniense. Los productos artesanales locales tienen cada vez más demanda tanto en el mercado nacional como en el turismo internacional que visita la ciudad.\n\n"Esto no es solo un negocio, es memoria viva", explica una artesana local que trabaja con técnicas de cerámica heredadas de su abuela italiana. Su taller, ubicado en el casco histórico, recibe visitantes de todo el mundo que buscan llevar algo auténticamente uruguayo.',
      image: 'https://images.unsplash.com/photo-1530021232320-687d8e3dba54?w=800&q=80',
      date: '2025-04-14', featured: true,
    },
    {
      id: 'a2', title: 'Nueva bodega familiar abre sus puertas en el interior del departamento',
      category: 'economia', status: 'published',
      excerpt: 'Una familia de tradición vitivinícola presenta su primera cosecha propia con uvas 100% colonienses.',
      content: 'La región de Colonia suma una nueva apuesta enológica con la apertura de una bodega familiar que promete destacar el terroir único de esta zona del país. Con cinco hectáreas de viñedos plantados hace ocho años, la familia presentó su primera cosecha oficial con etiqueta propia.\n\nEl vino, elaborado con uvas Tannat y Albariño adaptadas al clima coloniense, ya recibió reconocimientos en una feria nacional de vinos artesanales celebrada en Montevideo.',
      image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80',
      date: '2025-04-12', featured: false,
    },
    {
      id: 'a3', title: 'Festival de teatro callejero llenó el casco histórico de vida y color',
      category: 'arte', status: 'published',
      excerpt: 'Más de 2.000 personas disfrutaron de tres días de espectáculos de compañías uruguayas en la ciudad patrimonio.',
      content: 'El Festival Internacional de Teatro Callejero de Colonia reunió durante tres jornadas a compañías de todo Uruguay y también de Argentina y Brasil. Las piedras coloniales del barrio histórico sirvieron de escenario para obras de mimo, circo contemporáneo y teatro de texto.\n\nLa organización destacó el compromiso de las autoridades municipales y el apoyo de comercios locales que hicieron posible que la entrada fuera completamente gratuita para el público.',
      image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&q=80',
      date: '2025-04-10', featured: false,
    },
    {
      id: 'a4', title: 'Restaurantes de Colonia apuestan por el producto local en sus cartas',
      category: 'gastronomia', status: 'published',
      excerpt: 'Una decena de establecimientos se suma al movimiento "Cocina Coloniense" que prioriza ingredientes de productores del departamento.',
      content: 'El movimiento gastronómico que pone en valor los productos de la tierra está ganando fuerza en Colonia del Sacramento. Diez restaurantes de distintas categorías anunciaron su adhesión formal a la iniciativa "Cocina Coloniense", que exige que al menos el 60% de los ingredientes provengan de productores locales.\n\nChefs y dueños de locales destacan que el turismo internacional valora cada vez más la autenticidad y la trazabilidad de los ingredientes.',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
      date: '2025-04-08', featured: false,
    },
    {
      id: 'a5', title: 'Récord de visitantes en Semana de Turismo para la región',
      category: 'turismo', status: 'published',
      excerpt: 'Colonia recibió más de 45.000 turistas durante la Semana de Turismo, superando los registros históricos anteriores.',
      content: 'Las cifras de turismo de Semana de Turismo marcaron un hito histórico para Colonia del Sacramento. Con más de 45.000 visitantes registrados entre el jueves y el domingo, el departamento superó en un 18% los números del año anterior.',
      image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
      date: '2025-04-06', featured: false,
    },
    {
      id: 'a6', title: 'Cooperativa textil de mujeres rurales expande su mercado a Europa',
      category: 'sociedad', status: 'published',
      excerpt: 'Un grupo de tejedoras del interior del departamento logró colocar sus productos en tiendas de diseño en España y Portugal.',
      content: 'Una cooperativa formada por doce mujeres de zonas rurales del departamento de Colonia logró lo que parecía imposible hace apenas tres años: vender sus tejidos artesanales en boutiques de diseño de Madrid y Lisboa.\n\nCon apoyo del MIDES y de una ONG española especializada en comercio justo, las mujeres aprendieron a estandarizar su producción sin perder la identidad artesanal que hace únicos a sus productos.',
      image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80',
      date: '2025-04-04', featured: false,
    },
  ];
  saveArticles(arts);
  return arts;
}

function fmtDate(d) {
  if (!d) return '';
  const dt = new Date(d + 'T12:00:00');
  return dt.toLocaleDateString('es-UY', { day: 'numeric', month: 'long', year: 'numeric' });
}

function catLabel(c) {
  return { cultura:'Cultura', sociedad:'Sociedad', economia:'Economía', gastronomia:'Gastronomía', turismo:'Turismo', arte:'Arte' }[c] || c;
}

function debounce(fn, ms) {
  let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

const dateEl = document.getElementById('topDate');
if (dateEl) {
  dateEl.textContent = new Date().toLocaleDateString('es-UY', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
}

let activeCat = '';

document.getElementById('navLinks')?.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    activeCat = link.dataset.cat;
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    renderAll();
  });
});

document.getElementById('navToggle')?.addEventListener('click', () => {
  document.getElementById('navLinks')?.classList.toggle('open');
});

function getPublished() { return getArticles().filter(a => a.status === 'published'); }

function getFiltered() {
  const arts = getPublished();
  if (!activeCat) return arts;
  return arts.filter(a => a.category === activeCat);
}

function renderAll() { renderFeatured(); renderGrid(); renderSidebar(); }

function renderFeatured() {
  const featuredEl = document.getElementById('featuredArticle');
  if (!featuredEl) return;
  const arts = getPublished();
  const feat = arts.find(a => a.featured) || arts[0];
  if (!feat) { featuredEl.innerHTML = ''; return; }

  featuredEl.innerHTML = `
    <div class="featured-wrap" data-id="${feat.id}">
      <div class="featured-img-wrap">
        <img class="featured-img" src="${feat.image || 'https://placehold.co/800x400/f4f1ec/9e9890?text=Emilia+Itza'}" alt="${feat.title}"/>
      </div>
      <div class="featured-body">
        <div class="featured-cat">${catLabel(feat.category)}</div>
        <h2 class="featured-title">${feat.title}</h2>
        <p class="featured-excerpt">${feat.excerpt || ''}</p>
        <div class="featured-meta"><span>${fmtDate(feat.date)}</span></div>
        <div class="read-more-link">Leer nota completa</div>
      </div>
    </div>`;

  featuredEl.querySelector('.featured-wrap').addEventListener('click', () => openModal(feat.id));
}

function renderGrid() {
  const grid = document.getElementById('newsGrid');
  const empty = document.getElementById('emptyState');
  if (!grid) return;
  const filtered = getFiltered();
  const published = getPublished();
  const feat = published.find(a => a.featured) || published[0];
  const list = filtered.filter(a => a.id !== feat?.id);
  if (!list.length) {
    grid.innerHTML = '';
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';
  grid.innerHTML = list.map((a, i) => `
    <div class="article-card" data-id="${a.id}" style="animation-delay:${i * 0.05}s">
      <div class="card-img-wrap">
        ${a.image ? `<img class="card-img" src="${a.image}" alt="${a.title}" loading="lazy"/>` : `<div class="card-no-img">EI</div>`}
      </div>
      <div class="card-body">
        <div class="card-cat">${catLabel(a.category)}</div>
        <h3 class="card-title">${a.title}</h3>
        <p class="card-excerpt">${a.excerpt || ''}</p>
        <div class="card-meta">${fmtDate(a.date)}</div>
      </div>
    </div>`).join('');
  grid.querySelectorAll('.article-card').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.id));
  });
}

function renderSidebar() {
  const catEl = document.getElementById('widgetCats');
  if (catEl) {
    const arts = getPublished();
    const cats = ['cultura','sociedad','economia','gastronomia','turismo','arte'];
    catEl.innerHTML = cats.map(c => {
      const count = arts.filter(a => a.category === c).length;
      return `<li><a href="#" data-cat="${c}"><span>${catLabel(c)}</span><span class="cat-count">${count}</span></a></li>`;
    }).join('');
    catEl.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        activeCat = a.dataset.cat;
        document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.cat === activeCat));
        renderAll();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }
  const recentEl = document.getElementById('sidebarRecents');
  if (recentEl) {
    const recent = getPublished().slice(0, 4);
    recentEl.innerHTML = recent.map(a => `
      <div class="sidebar-recent" data-id="${a.id}">
        <img class="sidebar-recent-img" src="${a.image || 'https://placehold.co/60x50/f4f1ec/9e9890?text=EI'}" alt="" loading="lazy"/>
        <div>
          <div class="sidebar-recent-title">${a.title}</div>
          <div class="sidebar-recent-meta">${fmtDate(a.date)}</div>
        </div>
      </div>`).join('');
    recentEl.querySelectorAll('.sidebar-recent').forEach(el => {
      el.addEventListener('click', () => openModal(el.dataset.id));
    });
  }
}

const modalOverlay  = document.getElementById('modalOverlay');
const modalContent  = document.getElementById('modalContent');
const modalClose    = document.getElementById('modalClose');
const modalBackdrop = document.getElementById('modalBackdrop');

function openModal(id) {
  const a = getArticles().find(x => x.id === id);
  if (!a) return;
  const paragraphs = (a.content || a.excerpt || '').split('\n').filter(Boolean).map(p => `<p>${p}</p>`).join('');
  modalContent.innerHTML = `
    ${a.image ? `<img class="modal-article-img" src="${a.image}" alt="${a.title}"/>` : ''}
    <div class="modal-body">
      <div class="modal-cat">${catLabel(a.category)}</div>
      <h2 class="modal-title">${a.title}</h2>
      <div class="modal-meta">
        <span>${fmtDate(a.date)}</span>
        <span>Emilia Itza · Colonia, Uruguay</span>
      </div>
      <div class="modal-content-text">${paragraphs}</div>
    </div>`;
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

modalClose?.addEventListener('click', closeModal);
modalBackdrop?.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

renderAll();
