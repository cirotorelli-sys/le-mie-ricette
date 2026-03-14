// ===== STATE =====
let ricette = loadRicette();
let currentCategory = 'tutti';
let nextId = ricette.length ? Math.max(...ricette.map(r => r.id)) + 1 : 1;
let ingCount = 0;
let faseCount = 0;
let currentDiff = 'medio';
let currentTags = [];
let _viewId = null;
let _viewPortions = null;
let _ratingTmp = 0;
let _editingId = null;
let deferredInstallPrompt = null;

// ===== INSTALL PWA =====
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  const banner = document.getElementById('installBanner');
  if (banner) banner.style.display = 'flex';
});

function installApp() {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    deferredInstallPrompt.userChoice.then(() => {
      deferredInstallPrompt = null;
      document.getElementById('installBanner').style.display = 'none';
    });
  }
}

// ===== UTILS =====
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('visible'));
  document.getElementById(id).classList.add('visible');
  window.scrollTo(0, 0);
}

function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

function cap(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
}

function fmtQty(q, ratio) {
  const v = q * ratio;
  if (v === Math.round(v)) return Math.round(v);
  return parseFloat(v.toFixed(2));
}

function totalTime(r) {
  return r.fasi.reduce((s, f) => s + f.cottura + f.riposo, 0);
}

function starsHTML(n, size) {
  const sz = size || 12;
  return Array.from({ length: 5 }, (_, i) =>
    `<span style="color:${i < n ? '#E8A020' : '#D4C4B0'};font-size:${sz}px">&#9733;</span>`
  ).join('');
}

const catLabel = { antipasto: 'Antipasto', primo: 'Primo', secondo: 'Secondo', contorno: 'Contorno', dolce: 'Dolce' };
const diffColor = { facile: '#5A9E5A', medio: '#C97040', difficile: '#8B3A0F' };

// ===== TABS =====
function setTab(cat, el) {
  currentCategory = cat;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  renderList();
}

// ===== DIFFICULTY =====
function setDiff(d, el) {
  currentDiff = d;
  document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

// ===== TAGS =====
function addTag(e) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault();
    const val = e.target.value.trim().replace(/,/g, '');
    if (val && !currentTags.includes(val)) {
      currentTags.push(val);
      renderTags();
    }
    e.target.value = '';
  }
}

function renderTags() {
  const c = document.getElementById('tagContainer');
  const inp = document.getElementById('tagInputField');
  c.innerHTML = '';
  currentTags.forEach((t, i) => {
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = t + ' ×';
    span.onclick = () => { currentTags.splice(i, 1); renderTags(); };
    c.appendChild(span);
  });
  c.appendChild(inp);
}

// ===== LIST =====
function getFilteredSorted() {
  const q = (document.getElementById('searchInput').value || '').trim().toLowerCase();
  const sort = document.getElementById('sortSelect').value;
  const diff = { facile: 1, medio: 2, difficile: 3 };

  let list = ricette.filter(r => {
    if (currentCategory !== 'tutti' && r.categoria !== currentCategory) return false;
    if (!q) return true;
    return r.titolo.toLowerCase().includes(q) ||
      (r.desc || '').toLowerCase().includes(q) ||
      (r.origine || '').toLowerCase().includes(q) ||
      (r.tags || []).some(t => t.toLowerCase().includes(q)) ||
      r.ingredienti.some(i => i.nome.toLowerCase().includes(q));
  });

  if (sort === 'az') list.sort((a, b) => a.titolo.localeCompare(b.titolo, 'it'));
  else if (sort === 'za') list.sort((a, b) => b.titolo.localeCompare(a.titolo, 'it'));
  else if (sort === 'rating') list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  else if (sort === 'time') list.sort((a, b) => totalTime(b) - totalTime(a));
  else if (sort === 'diff') list.sort((a, b) => (diff[b.difficolta] || 0) - (diff[a.difficolta] || 0));
  return list;
}

function renderList() {
  const list = getFilteredSorted();
  const el = document.getElementById('recipeList');
  document.getElementById('recipeCount').textContent = list.length + ' ricett' + (list.length === 1 ? 'a' : 'e');

  if (!list.length) {
    el.innerHTML = `<div class="empty-state">
      <div class="icon">&#127859;</div>
      <p>Nessuna ricetta trovata.<br>Prova a cercare qualcosa di diverso<br>o aggiungi una nuova ricetta!</p>
    </div>`;
    return;
  }

  el.innerHTML = list.map(r => `
    <div class="recipe-card" onclick="viewRecipe(${r.id})">
      <div style="flex:1;min-width:0">
        <h3>${r.titolo}</h3>
        <div class="meta">
          ${r.ingredienti.length} ingr. &bull; ${r.porzioni} porz.
          ${totalTime(r) ? ' &bull; ' + totalTime(r) + ' min' : ''}
          ${r.origine ? ' &bull; ' + r.origine : ''}
          ${r.rating ? '&nbsp;&nbsp;' + starsHTML(r.rating, 11) : ''}
        </div>
        ${(r.tags || []).length ? `<div class="tags-row">${r.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
      </div>
      <span class="badge">${catLabel[r.categoria] || r.categoria}</span>
    </div>`).join('');
}

// ===== ADD / EDIT =====
function showAdd(editId) {
  ingCount = 0; faseCount = 0; currentTags = []; currentDiff = 'medio'; _editingId = null;
  ['fTitolo', 'fDesc', 'fOrigine', 'fNote'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  document.getElementById('fServings').value = 4;
  document.getElementById('fServCount').textContent = '4';
  document.getElementById('ingredientiList').innerHTML = '';
  document.getElementById('fasiList').innerHTML = '';
  document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.diff-btn.f-medio').classList.add('active');

  if (editId) {
    _editingId = editId;
    const r = ricette.find(x => x.id === editId);
    if (r) {
      document.getElementById('fTitolo').value = r.titolo || '';
      document.getElementById('fCategoria').value = r.categoria || 'primo';
      document.getElementById('fDesc').value = r.desc || '';
      document.getElementById('fOrigine').value = r.origine || '';
      document.getElementById('fNote').value = r.note || '';
      document.getElementById('fServings').value = r.porzioni || 4;
      document.getElementById('fServCount').textContent = r.porzioni || 4;
      currentDiff = r.difficolta || 'medio';
      currentTags = [...(r.tags || [])];
      document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
      const activeBtn = document.querySelector('.diff-btn.f-' + currentDiff);
      if (activeBtn) activeBtn.classList.add('active');
      r.ingredienti.forEach(ing => addIngrediente(ing));
      r.fasi.forEach(f => addFase(f));
    }
  } else {
    addIngrediente(); addIngrediente(); addIngrediente();
    addFase(); addFase();
  }

  renderTags();
  showSection('addSection');
}

function cancelAdd() { renderList(); showSection('listSection'); }

const umOptions = `
  <option value="g">g</option>
  <option value="kg">kg</option>
  <option value="ml">ml</option>
  <option value="l">l</option>
  <option value="cl">cl</option>
  <option value="pz">pz</option>
  <option value="cucchiaio">cucchiaio</option>
  <option value="cucchiaino">cucchiaino</option>
  <option value="tazza">tazza</option>
  <option value="spicchio">spicchio</option>
  <option value="foglia">foglia</option>
  <option value="rametto">rametto</option>
  <option value="fetta">fetta</option>
  <option value="pizzico">pizzico</option>
  <option value="qb">q.b.</option>
`;

function addIngrediente(data) {
  const i = ingCount++;
  const d = document.createElement('div');
  d.className = 'ing-row';
  d.id = 'ing_' + i;
  d.innerHTML = `
    <input type="text" placeholder="Es. Farina 00" value="${data ? data.nome : ''}">
    <input type="number" min="0" step="0.01" placeholder="250" value="${data ? data.qty : ''}">
    <select>${umOptions}</select>
    <button class="btn-rm" onclick="document.getElementById('ing_${i}').remove()">&#215;</button>
  `;
  document.getElementById('ingredientiList').appendChild(d);
  if (data) {
    const sel = d.querySelector('select');
    if (sel) sel.value = data.um;
  }
}

const tipoOptions = `
  <option value="preparazione">Preparazione</option>
  <option value="cottura">Cottura</option>
  <option value="mantecatura">Mantecatura</option>
  <option value="assemblaggio">Assemblaggio</option>
  <option value="riposo">Riposo</option>
  <option value="impiattamento">Impiattamento</option>
`;

function addFase(data) {
  const i = faseCount++;
  const d = document.createElement('div');
  d.className = 'fase-row';
  d.id = 'fase_' + i;
  d.innerHTML = `
    <div class="fase-num">${i + 1}</div>
    <div class="fase-desc">
      <textarea placeholder="Descrivi questa fase di preparazione...">${data ? data.desc : ''}</textarea>
      <div class="fase-time-row">
        <div><label>Cottura (min)</label><input type="number" min="0" value="${data ? data.cottura : 0}"></div>
        <div><label>Riposo (min)</label><input type="number" min="0" value="${data ? data.riposo : 0}"></div>
        <div><label>Tipo</label><select>${tipoOptions}</select></div>
      </div>
    </div>
    <button class="btn-rm" onclick="document.getElementById('fase_${i}').remove()" style="margin-top:8px">&#215;</button>
  `;
  document.getElementById('fasiList').appendChild(d);
  if (data) {
    const sel = d.querySelector('select');
    if (sel) sel.value = data.tipo;
  }
}

function saveRecipe() {
  const titolo = document.getElementById('fTitolo').value.trim();
  if (!titolo) { alert('Inserisci il titolo della ricetta'); return; }

  const ingredienti = [];
  document.querySelectorAll('#ingredientiList .ing-row').forEach(row => {
    const ins = row.querySelectorAll('input, select');
    if (ins[0] && ins[0].value.trim()) {
      ingredienti.push({ nome: ins[0].value.trim(), qty: parseFloat(ins[1].value) || 0, um: ins[2].value });
    }
  });
  if (!ingredienti.length) { alert('Aggiungi almeno un ingrediente'); return; }

  const fasi = [];
  document.querySelectorAll('#fasiList .fase-row').forEach(row => {
    const ta = row.querySelector('textarea');
    if (ta && ta.value.trim()) {
      const nums = row.querySelectorAll('input[type=number]');
      const sel = row.querySelector('select');
      fasi.push({ desc: ta.value.trim(), cottura: parseInt(nums[0]?.value) || 0, riposo: parseInt(nums[1]?.value) || 0, tipo: sel?.value || 'preparazione' });
    }
  });

  const recipeData = {
    titolo,
    categoria: document.getElementById('fCategoria').value,
    desc: document.getElementById('fDesc').value,
    origine: document.getElementById('fOrigine').value,
    difficolta: currentDiff,
    tags: [...currentTags],
    note: document.getElementById('fNote').value,
    porzioni: parseInt(document.getElementById('fServings').value),
    ingredienti,
    fasi
  };

  if (_editingId) {
    const idx = ricette.findIndex(x => x.id === _editingId);
    if (idx !== -1) {
      recipeData.id = _editingId;
      recipeData.rating = ricette[idx].rating || 0;
      ricette[idx] = recipeData;
      toast('Ricetta aggiornata!');
    }
  } else {
    recipeData.id = nextId++;
    recipeData.rating = 0;
    ricette.push(recipeData);
    toast('Ricetta salvata!');
  }

  saveRicette(ricette);
  renderList();
  showSection('listSection');
}

// ===== VIEW =====
function viewRecipe(id) {
  _viewId = id;
  const r = ricette.find(x => x.id === id);
  if (!r) return;
  _viewPortions = r.porzioni;
  renderDetail(r, _viewPortions);
  showSection('viewSection');
}

function renderDetail(r, vp) {
  const ratio = vp / r.porzioni;
  const totC = r.fasi.reduce((s, f) => s + f.cottura, 0);
  const totR = r.fasi.reduce((s, f) => s + f.riposo, 0);

  const infoItems = [
    { val: vp, lbl: 'Porzioni' },
    { val: r.ingredienti.length, lbl: 'Ingr.' },
    ...(totC ? [{ val: totC + "'", lbl: 'Cottura' }] : []),
    ...(totR ? [{ val: totR + "'", lbl: 'Riposo' }] : []),
    ...((totC + totR) ? [{ val: (totC + totR) + "'", lbl: 'Totale' }] : [])
  ];

  document.getElementById('recipeDetail').innerHTML = `
    <div class="recipe-view">
      <div style="display:flex;align-items:flex-start;gap:10px;flex-wrap:wrap;margin-bottom:4px">
        <div style="flex:1;min-width:0">
          <h2>${r.titolo}</h2>
          <div class="rvcat">
            ${catLabel[r.categoria] || r.categoria}
            ${r.origine ? ' · ' + r.origine : ''}
            ${r.difficolta ? ' · <span style="color:' + diffColor[r.difficolta] + '">' + cap(r.difficolta) + '</span>' : ''}
          </div>
        </div>
        ${r.rating ? `<div>${starsHTML(r.rating, 14)}</div>` : ''}
      </div>
      ${r.desc ? `<p style="font-size:13px;color:var(--cm);margin-bottom:12px;font-style:italic;line-height:1.65">${r.desc}</p>` : ''}
      ${(r.tags || []).length ? `<div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:12px">${r.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}

      <div class="adj-bar">
        <label>Porzioni:</label>
        <button class="adj-btn" onclick="changeP(-1)">&#8722;</button>
        <span class="adj-num">${vp}</span>
        <button class="adj-btn" onclick="changeP(1)">+</button>
        <span style="font-size:11px;color:var(--cm);margin-left:8px;font-family:sans-serif">(base: ${r.porzioni})</span>
      </div>

      <div class="info-strip">
        ${infoItems.map(item => `<div class="info-item"><div class="val">${item.val}</div><div class="lbl">${item.lbl}</div></div>`).join('')}
      </div>

      <div class="fsec" style="margin-top:0">Ingredienti</div>
      <table class="ing-table">
        <thead><tr><th>Ingrediente</th><th>Quantità</th><th>Unità</th></tr></thead>
        <tbody>
          ${r.ingredienti.map(ing => `
            <tr>
              <td>${ing.nome}</td>
              <td class="ing-qty">${fmtQty(ing.qty, ratio)}</td>
              <td class="ing-um">${ing.um}</td>
            </tr>`).join('')}
        </tbody>
      </table>

      <div class="fsec">Preparazione</div>
      ${r.fasi.map((f, i) => `
        <div class="fase-step">
          <div class="num">${i + 1}</div>
          <div>
            <div class="ftitle">${cap(f.tipo)}</div>
            <div class="fdesc">${f.desc}</div>
            <div class="tempi">
              ${f.cottura ? `<span class="tempo-tag">&#128293; Cottura: ${f.cottura} min</span>` : ''}
              ${f.riposo ? `<span class="tempo-tag">&#8987; Riposo: ${f.riposo} min</span>` : ''}
            </div>
          </div>
        </div>`).join('')}

      ${r.note ? `<div class="note-box"><div class="note-label">Note personali</div><p>${r.note}</p></div>` : ''}

      <div class="view-action-row">
        <button class="btn-sec" onclick="openRating(${r.id})">&#9733; Valuta</button>
        <button class="btn-sec" onclick="showAdd(${r.id})">&#9998; Modifica</button>
        <button class="btn-danger" onclick="deleteRecipe(${r.id})">&#128465; Elimina</button>
      </div>
    </div>`;
  _viewId = r.id;
}

function changeP(d) {
  _viewPortions = Math.max(1, (_viewPortions || 1) + d);
  const r = ricette.find(x => x.id === _viewId);
  if (r) renderDetail(r, _viewPortions);
}

function backToList() { renderList(); showSection('listSection'); }

function deleteRecipe(id) {
  if (!confirm('Eliminare questa ricetta? L\'operazione non è reversibile.')) return;
  ricette = ricette.filter(r => r.id !== id);
  saveRicette(ricette);
  backToList();
  toast('Ricetta eliminata');
}

// ===== ACTIONS =====
function printRecipe() { window.print(); }

function exportSingle(id) {
  const r = ricette.find(x => x.id === id);
  if (!r) return;
  dlJSON(JSON.stringify([r], null, 2), r.titolo.replace(/\s+/g, '_') + '.json');
  toast('Ricetta esportata in JSON!');
}

function exportAll() {
  dlJSON(JSON.stringify(ricette, null, 2), 'ricettario_completo.json');
  toast('Tutte le ricette esportate in JSON!');
}

function exportSinglePDF(id) {
  const r = ricette.find(x => x.id === id);
  if (!r) return;
  const ratio = (_viewPortions || r.porzioni) / r.porzioni;
  const html = buildPDFHtml([r], ratio, _viewPortions || r.porzioni);
  openPDFWindow(html);
  toast('Apri la finestra e salva come PDF!');
}

function exportAllPDF() {
  const html = buildPDFHtml(ricette, 1, null);
  openPDFWindow(html);
  toast('Apri la finestra e salva come PDF!');
}

function buildPDFHtml(lista, ratio, vp) {
  const diffColor = { facile: '#5A9E5A', medio: '#C97040', difficile: '#8B3A0F' };
  const catLabel = { antipasto: 'Antipasto', primo: 'Primo', secondo: 'Secondo', contorno: 'Contorno', dolce: 'Dolce' };
  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }
  function fq(q, rt) { const v = q * rt; return v === Math.round(v) ? Math.round(v) : parseFloat(v.toFixed(2)); }

  const ricetteHtml = lista.map(r => {
    const rt = vp ? vp / r.porzioni : 1;
    const porz = vp || r.porzioni;
    const totC = r.fasi.reduce((s, f) => s + f.cottura, 0);
    const totR = r.fasi.reduce((s, f) => s + f.riposo, 0);
    return `
      <div class="ricetta">
        <div class="r-header">
          <div>
            <h2>${r.titolo}</h2>
            <div class="r-meta">
              ${catLabel[r.categoria] || r.categoria}
              ${r.origine ? ' · ' + r.origine : ''}
              ${r.difficolta ? ' · ' + cap(r.difficolta) : ''}
              · ${porz} porzioni
              ${totC ? ' · Cottura: ' + totC + ' min' : ''}
              ${totR ? ' · Riposo: ' + totR + ' min' : ''}
            </div>
            ${(r.tags || []).length ? `<div class="r-tags">${r.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
          </div>
          ${r.rating ? `<div class="stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>` : ''}
        </div>
        ${r.desc ? `<p class="r-desc">${r.desc}</p>` : ''}
        <h3>Ingredienti</h3>
        <table>
          <thead><tr><th>Ingrediente</th><th>Quantità</th><th>Unità</th></tr></thead>
          <tbody>${r.ingredienti.map(i => `<tr><td>${i.nome}</td><td><strong>${fq(i.qty, rt)}</strong></td><td>${i.um}</td></tr>`).join('')}</tbody>
        </table>
        <h3>Preparazione</h3>
        ${r.fasi.map((f, i) => `
          <div class="fase">
            <div class="fase-num">${i + 1}</div>
            <div class="fase-body">
              <div class="fase-tipo">${cap(f.tipo)}</div>
              <div class="fase-desc">${f.desc}</div>
              ${(f.cottura || f.riposo) ? `<div class="fase-tempi">
                ${f.cottura ? `<span>🔥 Cottura: ${f.cottura} min</span>` : ''}
                ${f.riposo ? `<span>⏳ Riposo: ${f.riposo} min</span>` : ''}
              </div>` : ''}
            </div>
          </div>`).join('')}
        ${r.note ? `<div class="note"><strong>Note:</strong> ${r.note}</div>` : ''}
      </div>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<title>${lista.length === 1 ? lista[0].titolo : 'Il Mio Ricettario'}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Georgia, serif; color: #2C1A0E; background: #fff; padding: 2cm; font-size: 13px; }
  h1.main-title { font-size: 28px; color: #5C2409; text-align: center; margin-bottom: 6px; }
  .subtitle { text-align: center; color: #8A7060; font-style: italic; font-size: 12px; margin-bottom: 30px; }
  .ricetta { margin-bottom: 40px; padding-bottom: 30px; border-bottom: 2px solid #E8DDD4; page-break-inside: avoid; }
  .ricetta:last-child { border-bottom: none; }
  .r-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
  h2 { font-size: 20px; color: #5C2409; margin-bottom: 4px; }
  .r-meta { font-size: 11px; color: #8A7060; font-family: sans-serif; margin-bottom: 4px; }
  .r-tags { display: flex; gap: 5px; flex-wrap: wrap; margin-top: 4px; }
  .tag { background: #F5EDE6; color: #5C2409; font-size: 10px; padding: 2px 7px; border-radius: 10px; font-family: sans-serif; }
  .stars { font-size: 16px; color: #E8A020; flex-shrink: 0; }
  .r-desc { font-style: italic; color: #8A7060; margin: 8px 0 14px; line-height: 1.6; font-size: 12px; }
  h3 { font-size: 13px; color: #8B3A0F; text-transform: uppercase; letter-spacing: 1px; margin: 16px 0 8px; font-family: sans-serif; border-bottom: 1px solid #E8DDD4; padding-bottom: 4px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 13px; }
  th { text-align: left; padding: 5px 8px; border-bottom: 2px solid #E8DDD4; font-size: 10px; color: #8A7060; font-family: sans-serif; text-transform: uppercase; letter-spacing: 0.5px; font-weight: normal; }
  td { padding: 6px 8px; border-bottom: 1px solid #F0E8DF; }
  .fase { display: flex; gap: 10px; margin-bottom: 12px; }
  .fase-num { width: 24px; height: 24px; border-radius: 50%; background: #8B3A0F; color: #fff; font-size: 11px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-family: sans-serif; font-weight: 700; margin-top: 2px; }
  .fase-tipo { font-size: 10px; color: #8B3A0F; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; font-family: sans-serif; margin-bottom: 2px; }
  .fase-desc { font-size: 13px; line-height: 1.6; }
  .fase-tempi { display: flex; gap: 10px; margin-top: 4px; font-size: 11px; color: #8A7060; font-family: sans-serif; }
  .note { background: #F5EDE6; border-radius: 6px; padding: 10px 12px; margin-top: 12px; font-size: 12px; color: #5C2409; font-style: italic; line-height: 1.6; }
  .footer { text-align: center; margin-top: 30px; font-size: 11px; color: #C0A090; font-style: italic; font-family: sans-serif; }
  @media print {
    body { padding: 1cm; }
    .no-print { display: none; }
  }
</style>
</head>
<body>
  ${lista.length > 1 ? `<h1 class="main-title">Il Mio Ricettario</h1><p class="subtitle">${lista.length} ricette · Sviluppato da Ciro Torelli</p>` : ''}
  ${ricetteHtml}
  <div class="footer">Sviluppato da Ciro Torelli</div>
  <div class="no-print" style="text-align:center;margin-top:20px">
    <button onclick="window.print()" style="padding:10px 24px;background:#8B3A0F;color:#fff;border:none;border-radius:8px;font-size:14px;cursor:pointer;font-family:Georgia,serif">
      Stampa / Salva come PDF
    </button>
  </div>
</body>
</html>`;
}

function openPDFWindow(html) {
  const w = window.open('', '_blank');
  if (!w) { alert('Abilita i popup per esportare il PDF'); return; }
  w.document.write(html);
  w.document.close();
}

function dlJSON(content, filename) {
  const a = document.createElement('a');
  a.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(content);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function triggerImport() { document.getElementById('importFile').click(); }

function importJSON(input) {
  const f = input.files[0];
  if (!f) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      const arr = Array.isArray(data) ? data : [data];
      let added = 0;
      arr.forEach(r => {
        if (r.titolo && r.ingredienti) {
          r.id = nextId++;
          ricette.push(r);
          added++;
        }
      });
      saveRicette(ricette);
      renderList();
      showSection('listSection');
      toast(added + ' ricett' + (added === 1 ? 'a' : 'e') + ' importate!');
    } catch (err) {
      alert('File JSON non valido. Assicurati di importare un file esportato da questo ricettario.');
    }
  };
  reader.readAsText(f);
  input.value = '';
}

function shareRecipe(id) {
  const r = ricette.find(x => x.id === id);
  if (!r) return;
  const ratio = (_viewPortions || r.porzioni) / r.porzioni;
  let txt = `🍽️ ${r.titolo}\n`;
  if (r.origine) txt += `📍 ${r.origine}\n`;
  if (r.difficolta) txt += `📊 Difficoltà: ${cap(r.difficolta)}\n`;
  txt += `👥 ${_viewPortions || r.porzioni} porzioni\n\n`;
  txt += `INGREDIENTI:\n`;
  r.ingredienti.forEach(i => txt += `• ${i.nome}: ${fmtQty(i.qty, ratio)} ${i.um}\n`);
  txt += `\nPREPARAZIONE:\n`;
  r.fasi.forEach((f, i) => {
    txt += `${i + 1}. [${cap(f.tipo)}] ${f.desc}`;
    if (f.cottura) txt += ` — cottura: ${f.cottura} min`;
    if (f.riposo) txt += ` — riposo: ${f.riposo} min`;
    txt += '\n';
  });
  if (r.note) txt += `\n📝 NOTE: ${r.note}`;

  if (navigator.share) {
    navigator.share({ title: r.titolo, text: txt })
      .catch(() => copyToClipboard(txt));
  } else {
    copyToClipboard(txt);
  }
}

function copyToClipboard(txt) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(txt).then(() => toast('Testo copiato negli appunti!'));
  } else {
    const ta = document.createElement('textarea');
    ta.value = txt;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    toast('Testo copiato!');
  }
}

// ===== RATING =====
function openRating(id) {
  _viewId = id;
  _ratingTmp = ricette.find(x => x.id === id)?.rating || 0;
  highlightStars(_ratingTmp);
  document.getElementById('ratingModal').classList.add('open');
}

function closeModal() { document.getElementById('ratingModal').classList.remove('open'); }

function setRating(n) { _ratingTmp = n; highlightStars(n); }

function highlightStars(n) {
  document.querySelectorAll('.star').forEach((s, i) => s.classList.toggle('on', i < n));
}

function confirmRating() {
  const r = ricette.find(x => x.id === _viewId);
  if (r) {
    r.rating = _ratingTmp;
    saveRicette(ricette);
    renderDetail(r, _viewPortions);
    toast('Valutazione salvata!');
  }
  closeModal();
}

document.getElementById('ratingModal').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeModal();
});

// ===== INIT =====
renderList();
