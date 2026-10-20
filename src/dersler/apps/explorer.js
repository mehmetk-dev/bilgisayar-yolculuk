// Dosya Gezgini: klasörlerde gezinme, yeni klasör, yeniden adlandırma, kes/kopyala/yapıştır,
// sürükle-bırak ile taşıma, silme, Geri Dönüşüm Kutusu, arama, USB bellek ve telefon; ayrıntılar görünümü ve sıralama
// (ad, tarih, tür, boyut); sıkıştırılmış (.zip) klasör oluşturma ve ayıklama.
import { ROOTS, RECYCLE, USB, PHONE } from '../vfs.js';
import { esc, pictureURL, isImage } from './util.js';
import { nodeIcon } from '../desktop.js';

export const fmtSize = (b) => (b >= 1e9 ? `${(b / 1e9).toLocaleString('tr-TR', { maximumFractionDigits: 1 })} GB` : b >= 1e6 ? `${(b / 1e6).toLocaleString('tr-TR', { maximumFractionDigits: 1 })} MB` : `${Math.max(1, Math.round(b / 1e3))} KB`);
const fmtDate = (t) => (t ? new Date(t).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '');
const TYPES = [[/\.txt$/i, 'Metin Belgesi'], [/\.docx$/i, 'Word Belgesi'], [/\.xlsx$/i, 'Excel Çalışma Kitabı'], [/\.pptx$/i, 'PowerPoint Sunusu'], [/\.pdf$/i, 'PDF Belgesi'], [/\.jpe?g$/i, 'JPG dosyası'], [/\.png$/i, 'PNG dosyası'], [/\.mp3$/i, 'MP3 ses dosyası'], [/\.mp4$/i, 'MP4 video'], [/\.zip$/i, 'Sıkıştırılmış (zip) klasör'], [/\.exe$/i, 'Uygulama']];
export const typeName = (n) => (n.type === 'folder' ? 'Dosya klasörü' : n.type === 'link' ? 'Kısayol' : TYPES.find(([r]) => r.test(n.name))?.[1] || 'Dosya');

// Resim dosyalarının küçük önizlemesi (simge görünümünde)
const thumb = (n) => n.type === 'file' && isImage(n.name) && n.content && (typeof n.content === 'object' || String(n.content).startsWith('data:')) ? pictureURL(n.content) : '';

export function explorer({ desk, body, args, emit, setTitle }) {
  const fs = desk.fs;
  body.classList.add('ex');
  body.tabIndex = 0;
  body.innerHTML = `
    <div class="ex-top">
      <button type="button" class="ex-back" title="Geri">←</button><button type="button" class="ex-fwd" title="İleri">→</button><button type="button" class="ex-up" title="Üst klasör">↑</button>
      <div class="ex-addr"></div>
      <input class="ex-search" placeholder="Ara" aria-label="Bu klasörde ara">
    </div>
    <div class="ex-cmd"></div>
    <div class="ex-main">
      <nav class="ex-nav"></nav>
      <div class="ex-view" data-drop=""><div class="ex-items"></div></div>
    </div>
    <div class="ex-status"></div>`;
  const $ = (s) => body.querySelector(s);
  let cur = args.folder || 'docs';
  let sel = null, anchor = null; // sel: son tıklanan öğe; anchor: Shift + tık aralığının başı
  const picked = new Set(); // seçili öğelerin hepsi (Ctrl + tık, Shift + tık, çerçeve)
  let boxes = !!desk.settings.exBoxes; // öğe onay kutuları
  let renaming = null;
  let query = '';
  let mode = args.view || 'icons', sortBy = 'name', sortDesc = false; // görünüm: icons | details
  const back = [], fwd = [];

  // 'pc': Bu Bilgisayar (sürücüler), 'home': Giriş (son kullanılan dosyalar)
  const isSpecial = (id) => id === 'pc' || id === 'home';
  const label = (id) => (id === 'pc' ? 'Bu Bilgisayar' : id === 'home' ? 'Giriş' : fs.label(id));
  const recent = () => (desk.recent || []).map((id) => fs.get(id)).filter((n) => n && n.type === 'file' && !fs.inRecycle(n.id));

  function go(id, push = true) {
    if (!isSpecial(id) && !fs.get(id)) id = 'pc';
    if (push && id !== cur) { back.push(cur); fwd.length = 0; }
    cur = id;
    sel = anchor = null;
    picked.clear();
    query = '';
    $('.ex-search').value = '';
    render();
    emit('nav', { folder: cur, name: label(cur) });
  }

  function items() {
    if (query) {
      // Bu Bilgisayar'da ya da Giriş'te arama bütün klasörlere bakar
      const inside = (n) => isSpecial(cur) || (fs.isInside(n.id, cur) && n.id !== cur);
      return fs.search(query).filter(inside);
    }
    if (cur === 'home') return recent();
    if (cur === 'pc') return [];
    return sortList(fs.children(cur).filter((n) => n.type !== 'link' || cur === 'desktop'));
  }
  // Klasörler her zaman önce; sonra seçilen sütuna göre
  function sortList(list) {
    const key = { name: (n) => n.name.toLocaleLowerCase('tr'), date: (n) => n.mtime || 0, type: (n) => typeName(n), size: (n) => fs.sizeOf(n) }[sortBy];
    const folderFirst = sortBy !== 'date';
    return [...list].sort((a, b) => (folderFirst ? ((a.type === 'folder') - (b.type === 'folder')) * -1 : 0) || (key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : 0) * (sortDesc ? -1 : 1));
  }
  // Tarihe göre sıralanınca dosyalar gruplara ayrılır: Bugün, Dün, Bu hafta, Daha önce
  function dateGroup(t) {
    const d0 = desk.now(); d0.setHours(0, 0, 0, 0);
    const day = 86400e3, x = t || 0;
    return x >= +d0 ? 'Bugün' : x >= +d0 - day ? 'Dün' : x >= +d0 - 6 * day ? 'Bu hafta başlarında' : x >= +d0 - 30 * day ? 'Geçen hafta ve önceki haftalar' : 'Daha önce';
  }
  const grouped = () => sortBy === 'date' && !isSpecial(cur) && !query;
  const groupHead = (list, i, html) => {
    if (!grouped()) return '';
    const g = dateGroup(list[i].mtime);
    return i && dateGroup(list[i - 1].mtime) === g ? '' : html(g);
  };

  // Düğmeler yeniden çizilince klavye odağı gövdeden kaybolmasın (Ctrl+V, Delete çalışmaya devam etsin)
  function keepFocus(fn) {
    const had = body.contains(document.activeElement);
    fn();
    if (had && !renaming && !body.contains(document.activeElement)) body.focus({ preventScroll: true });
  }

  function render() { keepFocus(draw); }

  function draw() {
    setTitle(label(cur));
    const path = cur === 'pc' ? [] : fs.path(cur);
    $('.ex-addr').innerHTML = cur === 'home' ? '<span>🏠</span><button type="button" data-go="home">Giriş</button>' : `<span>💻</span>` + ['pc', ...path.map((n) => n.id)].map((id) => `<button type="button" data-go="${id}">${esc(label(id))}</button>`).join('<i>›</i>');
    $('.ex-search').placeholder = isSpecial(cur) ? 'Bütün bilgisayarda ara' : `${label(cur)} içinde ara`;
    $('.ex-back').disabled = !back.length;
    $('.ex-fwd').disabled = !fwd.length;
    $('.ex-up').disabled = isSpecial(cur);
    const roots = [['home', 'Giriş', '🏠'], ...ROOTS, ['pc', 'Bu Bilgisayar', '💻'], ...(fs.usb ? [[USB, 'USB Bellek (E:)', '💾']] : []), ...(fs.phone ? [[PHONE, 'Telefonum', '📱']] : []), [RECYCLE, 'Geri Dönüşüm Kutusu', '🗑']];
    $('.ex-nav').innerHTML = roots.map(([id, l, ic]) => `<button type="button" data-go="${id}" ${id !== 'pc' ? `data-drop="folder:${id}"` : ''} class="${id === cur ? 'on' : ''}">${ic} ${l}</button>${id === 'home' ? '<hr>' : ''}`).join('');
    const inRecycle = cur === RECYCLE;
    const view = $('.ex-view');
    if (isSpecial(cur) || query) delete view.dataset.drop; else view.dataset.drop = 'folder:' + cur;
    const list = items();
    if (cur === 'home' && !query) {
      const quick = [['desktop', '🖥'], ['downloads', '⬇'], ['docs', '📄'], ['pictures', '🖼']];
      $('.ex-items').innerHTML = `<h3 class="ex-h">Hızlı erişim</h3><div class="ex-quick">${quick.map(([id, ic]) => `<button type="button" data-go="${id}" data-drop="folder:${id}"><span>${ic}</span>${esc(fs.label(id))}</button>`).join('')}</div>
        <h3 class="ex-h">Son kullanılan dosyalar</h3>${list.length ? `<table class="ex-det ex-recent"><thead><tr><th>Ad</th><th>Değiştirme tarihi</th><th>Konum</th></tr></thead><tbody>
        ${list.map((n) => `<tr class="ex-item${picked.has(n.id) ? ' sel' : ''}" data-id="${n.id}"><td><span class="ei-ic">${nodeIcon(n)}</span><span class="ei-name">${esc(n.name)}</span></td><td>${fmtDate(n.mtime)}</td><td class="ex-loc">${esc(fs.path(n.parent).map((x) => x.name).join(' › '))}</td></tr>`).join('')}</tbody></table>`
          : '<p class="ex-empty">Açtığınız ve kaydettiğiniz dosyalar burada görünür.</p>'}`;
    } else if (cur === 'pc' && !query) {
      $('.ex-items').innerHTML = `<div class="ex-drives">
        <button type="button" class="ex-drive" data-go="docs"><span>🖴</span><div><b>Yerel Disk (C:)</b><div class="ex-bar"><i style="width:62%"></i></div><small>180 GB boş / 476 GB</small></div></button>
        ${fs.usb ? `<button type="button" class="ex-drive" data-go="${USB}"><span>💾</span><div><b>USB Bellek (E:)</b><div class="ex-bar"><i style="width:12%"></i></div><small>28 GB boş / 32 GB</small></div></button>` : ''}
        ${fs.phone ? `<button type="button" class="ex-drive" data-go="${PHONE}"><span>📱</span><div><b>Telefonum</b><div class="ex-bar"><i style="width:71%"></i></div><small>37 GB boş / 128 GB</small></div></button>` : ''}</div>
        <p class="ex-hint">Klasörler: soldaki listeden Belgeler, Resimler gibi klasörlere geçebilirsiniz.</p>`;
    } else if (!list.length) {
      $('.ex-items').innerHTML = `<p class="ex-empty">${query ? 'Aramanızla eşleşen öğe yok.' : inRecycle ? 'Geri Dönüşüm Kutusu boş.' : 'Bu klasör boş.'}</p>`;
    } else if (mode === 'details') {
      const col = (k, l) => `<th data-sort="${k}" class="${sortBy === k ? 'on' : ''}">${l}${sortBy === k ? (sortDesc ? ' ▾' : ' ▴') : ''}</th>`;
      $('.ex-items').innerHTML = `<table class="ex-det"><thead><tr>${col('name', 'Ad')}${col('date', 'Değiştirme tarihi')}${col('type', 'Tür')}${col('size', 'Boyut')}</tr></thead><tbody>
        ${list.map((n, i) => `${groupHead(list, i, (g) => `<tr class="ex-grp"><td colspan="4">${g}</td></tr>`)}<tr class="ex-item${picked.has(n.id) ? ' sel' : ''}" data-id="${n.id}" ${n.type === 'folder' && !inRecycle ? `data-drop="folder:${n.id}"` : ''}><td>${boxes ? '<span class="ei-chk" title="Seç"></span>' : ''}<span class="ei-ic">${nodeIcon(n)}</span>${renaming === n.id ? `<input class="ei-rename" value="${esc(n.name)}" spellcheck="false">` : `<span class="ei-name">${esc(n.name)}</span>`}</td>
          <td>${fmtDate(n.mtime)}</td><td>${esc(typeName(n))}</td><td class="num">${n.type === 'folder' ? '' : fmtSize(fs.sizeOf(n))}</td></tr>`).join('')}</tbody></table>`;
    } else {
      $('.ex-items').innerHTML = list.map((n, i) => `${groupHead(list, i, (g) => `<div class="ex-grp">${g}</div>`)}<div class="ex-item${picked.has(n.id) ? ' sel' : ''}" data-id="${n.id}" ${n.type === 'folder' && !inRecycle ? `data-drop="folder:${n.id}"` : ''}>
          ${boxes ? '<span class="ei-chk" title="Seç"></span>' : ''}<span class="ei-img">${thumb(n) ? `<img class="ei-thumb" src="${thumb(n)}" alt="">` : nodeIcon(n)}</span>
          ${renaming === n.id ? `<input class="ei-rename" value="${esc(n.name)}" spellcheck="false">` : `<span class="ei-name">${esc(n.name)}</span>`}
          ${query ? `<small class="ei-loc">${esc(fs.label(n.parent))}</small>` : ''}
          ${inRecycle && n.deletedFrom ? `<small class="ei-loc">Eski yeri: ${esc(fs.label(n.deletedFrom))}</small>` : ''}</div>`).join('');
    }
    chrome();
    if (renaming) bindRename();
  }

  // Komut çubuğu ve durum satırı (seçim değişince yalnızca bunlar yenilenir)
  function chrome() { keepFocus(drawChrome); }

  function drawChrome() {
    const inRecycle = cur === RECYCLE;
    const s = sel && fs.get(sel);
    const many = picked.size > 1;
    $('.ex-cmd').innerHTML = inRecycle
      ? `<button type="button" data-cmd="restore" ${s ? '' : 'disabled'}>♻ Geri yükle</button><button type="button" data-cmd="empty" ${fs.children(RECYCLE).length ? '' : 'disabled'}>🗑 Geri Dönüşüm Kutusunu boşalt</button>`
      : `<button type="button" data-cmd="newFolder" ${isSpecial(cur) ? 'disabled' : ''}>＋ Yeni klasör</button>
         <span class="sep"></span>
         <button type="button" data-cmd="cut" ${s ? '' : 'disabled'} title="Kes (Ctrl+X)">✂ Kes</button>
         <button type="button" data-cmd="copy" ${s ? '' : 'disabled'} title="Kopyala (Ctrl+C)">⧉ Kopyala</button>
         <button type="button" data-cmd="paste" ${desk.fileClip && !isSpecial(cur) ? '' : 'disabled'} title="Yapıştır (Ctrl+V)">📋 Yapıştır</button>
         <button type="button" data-cmd="rename" ${s && !many ? '' : 'disabled'} title="Yeniden adlandır (F2)">✏ Yeniden adlandır</button>
         <button type="button" data-cmd="delete" ${s ? '' : 'disabled'} title="Sil (Delete)">🗑 Sil</button>
         ${cur === USB || (cur !== 'pc' && fs.isInside(cur, USB)) ? '<button type="button" data-cmd="eject">⏏ Çıkar</button>' : ''}
         ${fs.phone && cur !== 'pc' && fs.isInside(cur, PHONE) ? '<button type="button" data-cmd="import">🖼 Fotoğrafları içeri aktar</button>' : ''}
         <span class="sep"></span>
         ${s && !many && /\.zip$/i.test(s.name) ? '<button type="button" data-cmd="extract" class="ex-zip ex-hl">🗜 Tümünü ayıkla</button>' : `<button type="button" data-cmd="compress" class="ex-zip" ${s && !isSpecial(cur) ? '' : 'disabled'} title="Seçili öğelerden sıkıştırılmış (.zip) klasör yapar">🗜 Sıkıştır</button>`}
         ${isSpecial(cur) ? '' : '<button type="button" data-cmd="selectAll" title="Tümünü seç (Ctrl+A)">☑ Tümünü seç</button>'}
         <span class="ex-right"><label>Sırala: <select class="ex-sort">${[['name', 'Ad'], ['date', 'Tarih'], ['type', 'Tür'], ['size', 'Boyut']].map(([k, l]) => `<option value="${k}" ${sortBy === k ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
           <button type="button" data-cmd="boxes" class="${boxes ? 'on' : ''}" title="Öğelerin köşesinde onay kutusu gösterir: tıklayarak tek tek seçersiniz">${boxes ? '☑' : '☐'} Onay kutuları</button>
           <button type="button" data-cmd="view" title="Görünümü değiştir">${mode === 'details' ? '▦ Simgeler' : '☰ Ayrıntılar'}</button></span>`;
    const files = [...picked].map((id) => fs.get(id)).filter((n) => n && n.type === 'file');
    $('.ex-status').textContent = cur === 'pc' ? '' : `${items().length} öğe${picked.size ? ` · ${picked.size} öğe seçili${files.length ? ` · ${fmtSize(files.reduce((t, n) => t + fs.sizeOf(n), 0))}` : ''}` : ''}`;
  }

  function bindRename() {
    const inp = $('.ei-rename');
    if (!inp) return;
    const node = fs.get(renaming);
    inp.focus();
    const dot = node.type === 'file' ? node.name.lastIndexOf('.') : -1;
    inp.setSelectionRange(0, dot > 0 ? dot : node.name.length);
    let done = false;
    const finish = (save) => {
      if (done) return;
      done = true;
      const id = renaming;
      renaming = null;
      const v = inp.value.trim();
      const old = node.name;
      if (save && v && v !== old) {
        const err = fs.rename(id, v);
        if (err) { desk.toast('Ad değiştirilemedi', esc(err), '⚠'); render(); }
        else emit('rename', { id, name: v, old });
      } else render();
      body.focus({ preventScroll: true });
    };
    inp.addEventListener('keydown', (e) => {
      e.stopPropagation();
      if (e.key === 'Enter') { e.preventDefault(); finish(true); }
      if (e.key === 'Escape') finish(false);
    });
    inp.addEventListener('blur', () => finish(true));
    inp.addEventListener('pointerdown', (e) => e.stopPropagation());
  }

  // how: 'set' (tek tık), 'toggle' (Ctrl + tık, onay kutusu), 'range' (Shift + tık), 'all' (Ctrl + A)
  const select = (id, how = 'set') => {
    if (!id) { picked.clear(); sel = anchor = null; }
    else if (how === 'toggle') {
      if (picked.has(id)) { picked.delete(id); sel = [...picked].at(-1) || null; } else { picked.add(id); sel = id; }
      anchor = id;
    } else if (how === 'range' && anchor) {
      const ids = items().map((n) => n.id), a = ids.indexOf(anchor), b = ids.indexOf(id);
      picked.clear();
      if (a < 0) picked.add(id); else ids.slice(Math.min(a, b), Math.max(a, b) + 1).forEach((x) => picked.add(x));
      sel = id;
    } else if (how === 'all') { picked.clear(); items().forEach((n) => picked.add(n.id)); sel = anchor = [...picked][0] || null; }
    else { picked.clear(); picked.add(id); sel = anchor = id; }
    paintSel();
    chrome();
    if (sel || how !== 'set') emit('ex-select', { id: sel, name: fs.get(sel)?.name, how, count: picked.size, names: [...picked].map((x) => fs.get(x)?.name) });
  };
  const paintSel = () => body.querySelectorAll('.ex-item').forEach((el) => el.classList.toggle('sel', picked.has(el.dataset.id)));
  const chosen = () => [...picked].filter((x) => fs.get(x));

  // Boş yerden basılı tutup sürükleyince çerçeve çizilir; içine giren öğeler seçilir (Ctrl basılıysa öncekilere eklenir)
  function band(e) {
    const v = $('.ex-view'), sx = e.clientX, sy = e.clientY, base = e.ctrlKey || e.metaKey ? new Set(picked) : new Set();
    let el = null;
    const move = (ev) => {
      if (!el) {
        if (Math.hypot(ev.clientX - sx, ev.clientY - sy) < 5) return;
        el = document.createElement('div');
        el.className = 'ex-band';
        v.append(el);
      }
      const r = v.getBoundingClientRect();
      const x1 = Math.min(sx, ev.clientX), x2 = Math.max(sx, ev.clientX), y1 = Math.min(sy, ev.clientY), y2 = Math.max(sy, ev.clientY);
      Object.assign(el.style, { left: x1 - r.left + v.scrollLeft + 'px', top: y1 - r.top + v.scrollTop + 'px', width: x2 - x1 + 'px', height: y2 - y1 + 'px' });
      picked.clear();
      base.forEach((x) => picked.add(x));
      body.querySelectorAll('.ex-item').forEach((it) => {
        const b = it.getBoundingClientRect();
        if (b.right > x1 && b.left < x2 && b.bottom > y1 && b.top < y2) picked.add(it.dataset.id);
      });
      paintSel();
    };
    const up = () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      if (!el) return;
      el.remove();
      sel = anchor = [...picked].at(-1) || null;
      chrome();
      emit('ex-select', { id: sel, name: fs.get(sel)?.name, how: 'band', count: picked.size, names: [...picked].map((x) => fs.get(x)?.name) });
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  }

  function open(id) {
    const n = fs.get(id);
    if (!n) return;
    emit('ex-open', { id, name: n.name, type: n.type });
    if (cur === RECYCLE) { desk.toast('Geri Dönüşüm Kutusu', 'Silinen bir dosyayı açmak için önce <b>Geri yükle</b>yin.', '♻'); return; }
    if (n.type === 'folder') go(id);
    else desk.openNode(n);
  }

  function cmd(c, id = sel) {
    const n = id && fs.get(id);
    switch (c) {
      case 'newFolder': {
        if (isSpecial(cur) || cur === RECYCLE) return;
        const f = fs.create(cur, { type: 'folder', name: 'Yeni klasör' });
        emit('new-folder', { id: f.id, in: cur });
        sel = f.id; renaming = f.id;
        return render();
      }
      case 'newText': {
        const f = fs.create(cur, { type: 'file', name: 'Yeni Metin Belgesi.txt', content: '' });
        sel = f.id; renaming = f.id;
        return render();
      }
      case 'cut': case 'copy': {
        if (!n) return;
        const ids = picked.has(id) && picked.size > 1 ? chosen() : [id];
        desk.fileClip = { op: c, id: ids[0], ids };
        emit('file-clip', { op: c, id: ids[0], name: fs.get(ids[0]).name, count: ids.length, names: ids.map((x) => fs.get(x).name) });
        desk.toast(c === 'cut' ? 'Kesildi' : 'Kopyalandı', `${ids.length > 1 ? `<b>${ids.length} öğe</b>` : `“${esc(n.name)}”`} panoya alındı. Şimdi gideceği klasörü açıp <b>Yapıştır</b>'a basın.`, c === 'cut' ? '✂' : '⧉', 4000);
        return render();
      }
      case 'paste': if (!isSpecial(cur)) { desk.pasteFile(cur); select(null); render(); } return;
      case 'rename': if (n && cur !== RECYCLE) { renaming = id; render(); emit('rename-start', { id, name: n.name }); } return;
      case 'delete': if (n) { (picked.has(id) ? chosen() : [id]).forEach((x) => desk.deleteNode(x)); select(null); render(); } return;
      case 'restore': if (n) { for (const x of picked.has(id) ? chosen() : [id]) { const m = fs.get(x); fs.restore(x); emit('restore', { id: x, name: m.name, to: fs.label(fs.get(x).parent) }); } select(null); render(); } return;
      case 'selectAll': select(items()[0]?.id, 'all'); return;
      case 'boxes': boxes = desk.settings.exBoxes = !boxes; emit('ex-checkboxes', { on: boxes }); return render();
      case 'empty': desk.emptyRecycle(); return;
      case 'eject': desk.ejectUsb(); return;
      case 'import': desk.importPhotos(); return;
      case 'view': mode = mode === 'details' ? 'icons' : 'details'; emit('ex-view', { mode }); return render();
      case 'compress': {
        if (!n || isSpecial(cur)) return;
        const ids = picked.has(id) ? chosen() : [id];
        const before = ids.reduce((t, x) => t + fs.sizeOf(fs.get(x)), 0);
        const z = fs.compress(ids, cur, fs.uniqueName(cur, n.name.replace(/\.[^.]+$/, '') + '.zip'));
        select(z.id);
        render();
        desk.toast('Sıkıştırıldı', `${ids.length > 1 ? `${ids.length} öğe` : `“${esc(n.name)}”`} → <b>${esc(z.name)}</b> (${fmtSize(before)} → ${fmtSize(fs.sizeOf(z))})`, '🗜', 5000);
        emit('zip-make', { name: z.name, from: n.name, count: ids.length });
        return;
      }
      case 'extract': return desk.extractZip(n);
      case 'shortcut': {
        if (!n || n.type === 'link') return;
        const l = fs.create('desktop', { type: 'link', name: `${n.name} - Kısayol`, target: n.id, icon: nodeIcon(n) });
        desk.toast('Kısayol oluşturuldu', `Masaüstünde <b>${esc(l.name)}</b> var. Asıl ${n.type === 'folder' ? 'klasör' : 'dosya'} yerinde duruyor.`, '↗', 4000);
        emit('shortcut', { name: l.name, target: n.name, folder: n.type === 'folder' });
        return;
      }
      case 'wallpaper': if (n) { desk.settings.customWall = pictureURL(n.content); desk.setSetting('wallpaper', 'custom'); emit('wallpaper', { name: n.name, custom: true }); } return;
      case 'open': return open(id);
      case 'location': if (n) { go(n.parent); select(id); emit('ex-location', { id, name: n.name, folder: n.parent, path: fs.path(n.parent).map((x) => x.name).join(' › ') }); } return;
      case 'props': return desk.dialogs.ask({ title: `${n.name} Özellikleri`, icon: nodeIcon(n), text: `<b>${esc(n.name)}</b><br>Tür: ${esc(typeName(n))}<br>Konum: ${esc(fs.path(n.parent).map((x) => x.name).join(' › '))}<br>Boyut: ${fmtSize(fs.sizeOf(n))}<br>Değiştirme tarihi: ${fmtDate(n.mtime)}`, buttons: [['ok', 'Tamam', true]] });
    }
  }

  body.addEventListener('click', (e) => {
    const g = e.target.closest('[data-go]');
    if (g) { go(g.dataset.go); return; }
    const c = e.target.closest('[data-cmd]');
    if (c && !c.disabled) { emit('ex-cmd', { cmd: c.dataset.cmd }); cmd(c.dataset.cmd); }
  });
  $('.ex-back').onclick = () => { if (back.length) { fwd.push(cur); go(back.pop(), false); } };
  $('.ex-fwd').onclick = () => { if (fwd.length) { back.push(cur); go(fwd.pop(), false); } };
  $('.ex-up').onclick = () => {
    if (cur === 'pc') return;
    const p = fs.get(cur)?.parent;
    go(p || 'pc');
  };
  body.addEventListener('change', (e) => {
    if (!e.target.classList.contains('ex-sort')) return;
    sortBy = e.target.value;
    sortDesc = sortBy === 'date' || sortBy === 'size'; // tarih ve boyutta en yeni / en büyük önce
    render();
    emit('ex-sort', { by: sortBy, desc: sortDesc });
  });
  body.addEventListener('click', (e) => {
    const h = e.target.closest('[data-sort]');
    if (!h) return;
    if (sortBy === h.dataset.sort) sortDesc = !sortDesc; else { sortBy = h.dataset.sort; sortDesc = false; }
    render();
    emit('ex-sort', { by: sortBy, desc: sortDesc });
  });
  $('.ex-search').addEventListener('input', (e) => {
    query = e.target.value.trim();
    sel = anchor = null;
    picked.clear();
    render();
    emit('ex-search', { text: query, results: items().map((n) => n.name) });
  });

  const view = $('.ex-view');
  let single = null; // birden çok seçiliyken seçili bir öğeye tıklanıp sürüklenmezse yalnızca o seçili kalır
  view.addEventListener('pointerdown', (e) => {
    const it = e.target.closest('.ex-item');
    if (e.target.closest('.ei-rename')) return;
    if (!it) {
      if (e.button !== 0) return;
      if (!(e.ctrlKey || e.metaKey)) select(null);
      if (!isSpecial(cur)) { e.preventDefault(); body.focus({ preventScroll: true }); band(e); }
      return;
    }
    const id = it.dataset.id;
    single = null;
    if (e.button === 2) { if (!picked.has(id)) select(id); return; }
    if (e.target.closest('.ei-chk')) { e.preventDefault(); select(id, 'toggle'); return; }
    if (e.shiftKey) { e.preventDefault(); body.focus({ preventScroll: true }); select(id, 'range'); }
    else if (e.ctrlKey || e.metaKey) { select(id, 'toggle'); if (!picked.has(id)) return; }
    else if (!picked.has(id)) select(id);
    else if (picked.size > 1) { sel = id; single = id; }
    const el = body.querySelector(`.ex-item[data-id="${id}"]`);
    if (e.button === 0 && cur !== RECYCLE) desk.dragStart(e, { kind: 'node', id, ids: picked.size > 1 ? chosen() : null, el, from: 'explorer' });
  });
  view.addEventListener('pointerup', () => { if (single && !desk.dragged) select(single); single = null; });
  view.addEventListener('dblclick', (e) => {
    const it = e.target.closest('.ex-item');
    if (it && !e.target.closest('.ei-rename')) open(it.dataset.id);
  });
  view.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const it = e.target.closest('.ex-item');
    if (it) {
      if (!picked.has(it.dataset.id)) select(it.dataset.id);
      const items = cur === RECYCLE
        ? [{ cmd: 'restore', label: '♻ Geri yükle', bold: true }, '-', { cmd: 'delete', label: 'Kalıcı olarak sil' }, { cmd: 'props', label: 'Özellikler' }]
        : [{ cmd: 'open', label: 'Aç', bold: true }, ...(cur === 'home' || query ? [{ cmd: 'location', label: '📂 Dosya konumunu aç' }] : []), '-', { cmd: 'cut', label: 'Kes', key: 'Ctrl+X' }, { cmd: 'copy', label: 'Kopyala', key: 'Ctrl+C' }, '-',
          { cmd: 'rename', label: 'Yeniden adlandır', key: 'F2' }, { cmd: 'delete', label: 'Sil', key: 'Del' }, '-',
          { cmd: 'send', label: 'Gönder', sub: [{ cmd: 'shortcut', label: '🖥 Masaüstü (kısayol oluştur)' }] },
          /\.zip$/i.test(fs.get(it.dataset.id)?.name || '') ? { cmd: 'extract', label: '🗜 Tümünü ayıkla…', bold: true } : { cmd: 'compress', label: '🗜 Sıkıştırılmış (zip) klasöre gönder' },
          ...(/\.(png|jpe?g)$/i.test(fs.get(it.dataset.id)?.name || '') ? [{ cmd: 'wallpaper', label: 'Masaüstü arka planı olarak ayarla' }] : []),
          { cmd: 'props', label: 'Özellikler' }];
      desk.menu(e.clientX, e.clientY, items, (c) => cmd(c, it.dataset.id), 'explorer-item', { id: it.dataset.id, name: fs.get(it.dataset.id)?.name });
      return;
    }
    if (isSpecial(cur) || cur === RECYCLE) return;
    select(null);
    desk.menu(e.clientX, e.clientY, [
      { cmd: 'paste', label: 'Yapıştır', key: 'Ctrl+V', disabled: !desk.fileClip },
      { cmd: 'new', label: 'Yeni', sub: [{ cmd: 'newFolder', label: '📁 Klasör' }, { cmd: 'newText', label: '📝 Metin Belgesi' }] },
    ], (c) => cmd(c), 'explorer');
  });

  body.addEventListener('keydown', (e) => {
    if (e.target.closest('input')) return;
    const ctrl = e.ctrlKey || e.metaKey;
    if (e.key === 'Delete' && sel) { e.preventDefault(); cmd('delete'); }
    else if (e.key === 'F2' && sel) { e.preventDefault(); cmd('rename'); }
    else if (e.key === 'Enter' && sel) { e.preventDefault(); open(sel); }
    else if (e.key === 'Backspace') { e.preventDefault(); $('.ex-back').click(); }
    else if (ctrl && e.code === 'KeyC' && sel) { e.preventDefault(); cmd('copy'); }
    else if (ctrl && e.code === 'KeyX' && sel) { e.preventDefault(); cmd('cut'); }
    else if (ctrl && e.code === 'KeyV') { e.preventDefault(); cmd('paste'); }
    else if (ctrl && e.shiftKey && e.code === 'KeyN') { e.preventDefault(); cmd('newFolder'); }
    else if (ctrl && e.code === 'KeyA') { e.preventDefault(); cmd('selectAll'); }
    else if (ctrl && e.code === 'KeyF') { e.preventDefault(); $('.ex-search').focus(); }
  });

  render();
  if (args.select && fs.get(args.select)) select(args.select);
  return {
    onFs: () => { if (cur !== 'pc' && !fs.get(cur)) cur = 'pc'; if (sel && !fs.get(sel)) sel = null; if (picked.size) { const here = new Set(items().map((n) => n.id)); [...picked].forEach((x) => { if (!here.has(x)) picked.delete(x); }); } if (!renaming) render(); },
    onArgs: (a) => { if (a.folder) go(a.folder); if (a.select && fs.get(a.select)) select(a.select); },
    leaveUsb: () => { if (cur === USB || (cur !== 'pc' && fs.isInside(cur, USB))) go('pc'); },
    leavePhone: () => { if (cur !== 'pc' && (cur === PHONE || !fs.get(cur) || fs.isInside(cur, PHONE))) go('pc'); },
    focus: () => { if (!renaming && document.activeElement?.closest('.ex') !== body) body.focus({ preventScroll: true }); },
    get folder() { return cur; },
    get selected() { return sel; },
    get selection() { return chosen(); },
    get query() { return query; },
    go,
  };
}
