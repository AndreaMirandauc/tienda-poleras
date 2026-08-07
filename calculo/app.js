const cardsContainer = document.querySelector('#cards');
const emptyState = document.querySelector('#emptyState');
const searchInput = document.querySelector('#searchInput');
const topicFilter = document.querySelector('#topicFilter');
const levelFilter = document.querySelector('#levelFilter');
const entryForm = document.querySelector('#entryForm');
const jsonOutput = document.querySelector('#jsonOutput');
const copyBtn = document.querySelector('#copyBtn');
const updated = document.querySelector('#updated');

let soluciones = [];

updated.textContent = new Date().toLocaleDateString('es-CL', {
  year: 'numeric', month: 'long', day: 'numeric'
});

async function cargarSoluciones() {
  try {
    const response = await fetch('soluciones.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('No se pudo cargar soluciones.json');
    soluciones = await response.json();
  } catch (error) {
    soluciones = [];
    cardsContainer.innerHTML = `<article class="card"><h3>No hay soluciones cargadas todavía</h3><p>Edita el archivo <code>soluciones.json</code> para comenzar a mostrar ejercicios.</p></article>`;
    return;
  }

  crearFiltros(soluciones);
  renderizar();
}

function crearFiltros(items) {
  const temas = [...new Set(items.map(item => item.tema).filter(Boolean))].sort();
  temas.forEach(tema => {
    const option = document.createElement('option');
    option.value = tema;
    option.textContent = tema;
    topicFilter.appendChild(option);
  });
}

function normalizar(texto = '') {
  return String(texto)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function filtrar() {
  const q = normalizar(searchInput.value);
  const tema = topicFilter.value;
  const nivel = levelFilter.value;

  return soluciones.filter(item => {
    const texto = normalizar([
      item.libro,
      item.capitulo,
      item.ejercicio,
      item.tema,
      item.dificultad,
      item.descripcion
    ].join(' '));

    const coincideTexto = texto.includes(q);
    const coincideTema = tema === 'todos' || item.tema === tema;
    const coincideNivel = nivel === 'todos' || item.dificultad === nivel;

    return coincideTexto && coincideTema && coincideNivel;
  });
}

function renderizar() {
  const items = filtrar();
  cardsContainer.innerHTML = '';
  emptyState.classList.toggle('hidden', items.length !== 0);

  items.forEach(item => {
    const card = document.createElement('article');
    card.className = 'card';
    const tieneArchivo = Boolean(item.archivo);

    card.innerHTML = `
      <div class="card-top">
        <span class="badge">${item.dificultad || 'Sin nivel'}</span>
        <span class="badge">${item.tema || 'General'}</span>
      </div>
      <h3>${item.ejercicio || 'Ejercicio sin número'}</h3>
      <div class="meta">
        <span>${item.libro || 'Libro no indicado'}</span>
        <span>${item.capitulo || 'Capítulo no indicado'}</span>
      </div>
      <p>${item.descripcion || 'Solución disponible para estudio.'}</p>
      <div class="card-actions">
        ${tieneArchivo ? `<a class="btn primary" href="${item.archivo}" target="_blank" rel="noopener">Ver PDF</a>` : `<span class="btn">Sin PDF</span>`}
        ${tieneArchivo ? `<a class="btn secondary" href="${item.archivo}" download>Descargar</a>` : ''}
      </div>
    `;

    cardsContainer.appendChild(card);
  });
}

[searchInput, topicFilter, levelFilter].forEach(element => {
  element.addEventListener('input', renderizar);
  element.addEventListener('change', renderizar);
});

entryForm.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(entryForm);
  const entry = {
    libro: data.get('libro').trim(),
    capitulo: data.get('capitulo').trim(),
    ejercicio: data.get('ejercicio').trim(),
    tema: data.get('tema').trim(),
    dificultad: data.get('dificultad'),
    archivo: data.get('archivo').trim(),
    descripcion: data.get('descripcion').trim() || 'Solución paso a paso.'
  };

  jsonOutput.textContent = JSON.stringify(entry, null, 2);
});

copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(jsonOutput.textContent);
    copyBtn.textContent = 'Copiado';
    setTimeout(() => copyBtn.textContent = 'Copiar', 1400);
  } catch (error) {
    copyBtn.textContent = 'No se pudo copiar';
    setTimeout(() => copyBtn.textContent = 'Copiar', 1600);
  }
});

cargarSoluciones();
