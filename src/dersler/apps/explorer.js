// Dosya Gezgini: klasörlerde gezinme, yeni klasör, yeniden adlandırma, kes/kopyala/yapıştır,
// sürükle-bırak ile taşıma, silme, Geri Dönüşüm Kutusu, arama ve USB bellek.
import { ROOTS, RECYCLE, USB } from '../vfs.js';
import { esc, pictureURL } from './util.js';
import { nodeIcon } from '../desktop.js';

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
  let sel = null;
  let renaming = null;
  let query = '';
  const back = [], fwd = [];

  const isSpecial = (id) => id === 'pc';
  const label = (id) => (id === 'pc' ? 'Bu Bilgisayar' : fs.label(id));

  function go(id, push = true) {
    if (id !== 'pc' && !fs.get(id)) id = 'pc';
    if (push && id !== cur) { back.push(cur); fwd.length = 0; }
    cur = id;
    sel = null;
    query = '';
    $('.ex-search').value = '';
    render();
    emit('nav', { folder: cur, name: label(cur) });
  }

  function items() {
    if (cur === 'pc') return [];
    if (query) {
      const inside = (n) => fs.isInside(n.id, cur) && n.id !== cur;
      return fs.search(query).filter(inside);
    }
    return fs.children(cur).filter((n) => n.type !== 'link' || cur === 'desktop');
  }

  function render() {
    setTitle(label(cur));
    const path = cur === 'pc' ? [] : fs.path(cur);
    $('.ex-addr').innerHTML = `<span>💻</span>` + ['pc', ...path.map((n) => n.id)].map((id) => `<button type="button" data-go="${id}">${esc(label(id))}</button>`).join('<i>›</i>');
    $('.ex-back').disabled = !back.length;
    $('.ex-fwd').disabled = !fwd.length;
    $('.ex-up').disabled = cur === 'pc';
    const roots = [...ROOTS, ['pc', 'Bu Bilgisayar', '💻'], ...(fs.usb ? [[USB, 'USB Bellek (E:)', '💾']] : []), [RECYCLE, 'Geri Dönüşüm Kutusu', '🗑']];
    $('.ex-nav').innerHTML = roots.map(([id, l, ic]) => `<button type="button" data-go="${id}" ${id !== 'pc' ? `data-drop="folder:${id}"` : ''} class="${id === cur ? 'on' : ''}">${ic} ${l}</button>`).join('');
    const inRecycle = cur === RECYCLE;
    const view = $('.ex-view');
    if (isSpecial(cur) || query) delete view.dataset.drop; else view.dataset.drop = 'folder:' + cur;
    const list = items();
    if (cur === 'pc') {
      $('.ex-items').innerHTML = `<div class="ex-drives">
        <button type="button" class="ex-drive" data-go="docs"><span>🖴</span><div><b>Yerel Disk (C:)</b><div class="ex-bar"><i style="width:62%"></i></div><small>180 GB boş / 476 GB</small></div></button>
        ${fs.usb ? `<button type="button" class="ex-drive" data-go="${USB}"><span>💾</span><div><b>USB Bellek (E:)</b><div class="ex-bar"><i style="width:12%"></i></div><small>28 GB boş / 32 GB</small></div></button>` : ''}</div>
        <p class="ex-hint">Klasörler: soldaki listeden Belgeler, Resimler gibi klasörlere geçebilirsiniz.</p>`;
    } else if (!list.length) {
      $('.ex-items').innerHTML = `<p class="ex-empty">${query ? 'Aramanızla eşleşen öğe yok.' : inRecycle ? 'Geri Dönüşüm Kutusu boş.' : 'Bu klasör boş.'}</p>`;
    } else {
      $('.ex-items').innerHTML = list.map((n) => `<div class="ex-item${n.id === sel ? ' sel' : ''}" data-id="${n.id}" ${n.type === 'folder' && !inRecycle ? `data-drop="folder:${n.id}"` : ''}>
          <span class="ei-img">${nodeIcon(n)}</span>
          ${renaming === n.id ? `<input class="ei-rename" value="${esc(n.name)}" spellcheck="false">` : `<span class="ei-name">${esc(n.name)}</span>`}
          ${query ? `<small class="ei-loc">${esc(fs.label(n.parent))}</small>` : ''}
          ${inRecycle && n.deletedFrom ? `<small class="ei-loc">Eski yeri: ${esc(fs.label(n.deletedFrom))}</small>` : ''}</div>`).join('');
    }
    chrome();
    if (renaming) bindRename();
  }

  // Komut çubuğu ve durum satırı (seçim değişince yalnızca bunlar yenilenir)
  function chrome() {
    const inRecycle = cur === RECYCLE;
    const s = sel && fs.get(sel);
    $('.ex-cmd').innerHTML = inRecycle
      ? `<button type="button" data-cmd="restore" ${s ? '' : 'disabled'}>♻ Geri yükle</button><button type="button" data-cmd="empty" ${fs.children(RECYCLE).length ? '' : 'disabled'}>🗑 Geri Dönüşüm Kutusunu boşalt</button>`
      : `<button type="button" data-cmd="newFolder" ${isSpecial(cur) ? 'disabled' : ''}>＋ Yeni klasör</button>
         <span class="sep"></span>
         <button type="button" data-cmd="cut" ${s ? '' : 'disabled'} title="Kes (Ctrl+X)">✂ Kes</button>
         <button type="button" data-cmd="copy" ${s ? '' : 'disabled'} title="Kopyala (Ctrl+C)">⧉ Kopyala</button>
         <button type="button" data-cmd="paste" ${desk.fileClip && !isSpecial(cur) ? '' : 'disabled'} title="Yapıştır (Ctrl+V)">📋 Yapıştır</button>
         <button type="button" data-cmd="rename" ${s ? '' : 'disabled'} title="Yeniden adlandır (F2)">✏ Yeniden adlandır</button>
         <button type="button" data-cmd="delete" ${s ? '' : 'disabled'} title="Sil (Delete)">🗑 Sil</button>
         ${cur === USB || (cur !== 'pc' && fs.isInside(cur, USB)) ? '<button type="button" data-cmd="eject">⏏ Çıkar</button>' : ''}`;
    $('.ex-status').textContent = cur === 'pc' ? '' : `${items().length} öğe${s ? ' · 1 öğe seçili' : ''}`;
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

  const select = (id) => {
    sel = id;
    body.querySelectorAll('.ex-item').forEach((el) => el.classList.toggle('sel', el.dataset.id === id));
    chrome();
    if (id) emit('ex-select', { id, name: fs.get(id)?.name });
  };

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
      case 'cut': case 'copy':
        if (!n) return;
        desk.fileClip = { op: c, id };
        emit('file-clip', { op: c, id, name: n.name });
        desk.toast(c === 'cut' ? 'Kesildi' : 'Kopyalandı', `“${esc(n.name)}” panoya alındı. Şimdi gideceği klasörü açıp <b>Yapıştır</b>'a basın.`, c === 'cut' ? '✂' : '⧉', 4000);
        return render();
      case 'paste': if (!isSpecial(cur)) { desk.pasteFile(cur); sel = null; render(); } return;
      case 'rename': if (n && cur !== RECYCLE) { renaming = id; render(); emit('rename-start', { id, name: n.name }); } return;
      case 'delete': if (n) { desk.deleteNode(id); sel = null; render(); } return;
      case 'restore': if (n) { fs.restore(id); emit('restore', { id, name: n.name, to: fs.label(fs.get(id).parent) }); sel = null; render(); } return;
      case 'empty': desk.emptyRecycle(); return;
      case 'eject': desk.ejectUsb(); return;
      case 'wallpaper': if (n) { desk.settings.customWall = pictureURL(n.content); desk.setSetting('wallpaper', 'custom'); emit('wallpaper', { name: n.name, custom: true }); } return;
      case 'open': return open(id);
      case 'props': return desk.dialogs.ask({ title: `${n.name} Özellikleri`, icon: nodeIcon(n), text: `<b>${esc(n.name)}</b><br>Tür: ${n.type === 'folder' ? 'Dosya klasörü' : 'Dosya'}<br>Konum: ${esc(fs.path(n.parent).map((x) => x.name).join(' › '))}`, buttons: [['ok', 'Tamam', true]] });
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
  $('.ex-search').addEventListener('input', (e) => {
    query = e.target.value.trim();
    sel = null;
    render();
    emit('ex-search', { text: query, results: items().map((n) => n.name) });
  });

  const view = $('.ex-view');
  view.addEventListener('pointerdown', (e) => {
    const it = e.target.closest('.ex-item');
    if (e.target.closest('.ei-rename')) return;
    if (!it) { if (e.button === 0) select(null); return; }
    if (it.dataset.id !== sel) select(it.dataset.id);
    const el = body.querySelector(`.ex-item[data-id="${it.dataset.id}"]`);
    if (e.button === 0 && cur !== RECYCLE) desk.dragStart(e, { kind: 'node', id: it.dataset.id, el, from: 'explorer' });
  });
  view.addEventListener('dblclick', (e) => {
    const it = e.target.closest('.ex-item');
    if (it && !e.target.closest('.ei-rename')) open(it.dataset.id);
  });
  view.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const it = e.target.closest('.ex-item');
    if (it) {
      select(it.dataset.id);
      const items = cur === RECYCLE
        ? [{ cmd: 'restore', label: '♻ Geri yükle', bold: true }, '-', { cmd: 'delete', label: 'Kalıcı olarak sil' }, { cmd: 'props', label: 'Özellikler' }]
        : [{ cmd: 'open', label: 'Aç', bold: true }, '-', { cmd: 'cut', label: 'Kes', key: 'Ctrl+X' }, { cmd: 'copy', label: 'Kopyala', key: 'Ctrl+C' }, '-',
          { cmd: 'rename', label: 'Yeniden adlandır', key: 'F2' }, { cmd: 'delete', label: 'Sil', key: 'Del' }, '-',
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
    else if (ctrl && e.code === 'KeyF') { e.preventDefault(); $('.ex-search').focus(); }
  });

  render();
  return {
    onFs: () => { if (cur !== 'pc' && !fs.get(cur)) cur = 'pc'; if (sel && !fs.get(sel)) sel = null; if (!renaming) render(); },
    onArgs: (a) => { if (a.folder) go(a.folder); },
    leaveUsb: () => { if (cur === USB || (cur !== 'pc' && fs.isInside(cur, USB))) go('pc'); },
    focus: () => { if (!renaming && document.activeElement?.closest('.ex') !== body) body.focus({ preventScroll: true }); },
    get folder() { return cur; },
    get selected() { return sel; },
    go,
  };
}
