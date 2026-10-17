// Windows Güvenliği ve Bakım: virüs taraması (bilgisayar ve USB bellek), güvenlik duvarı, Disk Temizleme
import { esc, progress } from './util.js';
import { RECYCLE } from '../vfs.js';

const gb = (n) => n.toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' GB';
export const DISK_TOTAL = 256;
// Temizlenebilecek şeyler: [anahtar, ad, açıklama, GB, varsayılan seçili, riskli]
const CATS = [
  ['tmp', 'Geçici internet dosyaları', 'Tarayıcının hız için sakladığı kopyalar; silmek zararsızdır', 4.2, true],
  ['upd', 'Windows güncelleme artıkları', 'Güncellemeden arta kalan eski dosyalar', 6.8, true],
  ['thumb', 'Küçük resimler', 'Klasörlerde fotoğrafların minik önizlemeleri; yeniden oluşur', 0.4, true],
  ['recycle', 'Geri Dönüşüm Kutusu', 'İçindeki dosyalar kalıcı silinir', 0, false],
  ['down', 'İndirilenler klasörü', '⚠ Sizin indirdiğiniz dosyalar (fatura, fotoğraf…) vardır; silinince geri gelmez!', 0, false, true],
];

export function guvenlik({ desk, body, args, emit, dialogs }) {
  body.classList.add('ws');
  const sec = (desk.sec ||= { used: 231.4, firewall: true, lastScan: null, scans: 0 });
  let page = args.page || 'virus';
  const flow = {};
  const recycleN = () => desk.fs.children(RECYCLE).length;
  const downN = () => desk.fs.children('downloads').length;
  const catSize = (k) => (k === 'recycle' ? recycleN() * 0.1 : k === 'down' ? downN() * 0.3 : CATS.find((c) => c[0] === k)[3]);
  const done = (k) => sec.cleaned?.[k];

  const NAV = [['virus', '🛡', 'Virüs ve tehdit koruması'], ['duvar', '🧱', 'Güvenlik duvarı'], ['disk', '🧹', 'Disk Temizleme']];

  function render() {
    let h = '';
    if (page === 'virus') {
      const usb = desk.fs.usb;
      h = `<h2>🛡 Virüs ve tehdit koruması</h2>
        <div class="ws-card ${flow.threats?.length ? 'bad' : 'ok'}">${flow.threats?.length ? '⚠ <b>Tehdit bulundu</b>' : '✅ <b>Cihazınız korunuyor</b>'}<small>${sec.lastScan ? `Son tarama: ${esc(sec.lastScan)}` : 'Henüz tarama yapılmadı'}${sec.scans ? ` · ${sec.scans} tarama` : ''}</small></div>
        <div class="ws-flow">${flow.scan ? '<div class="ws-prog"></div>' : ''}</div>
        ${flow.threats?.length ? `<div class="ws-card bad"><b>Şu tehditler bulundu:</b>${flow.threats.map((t) => `<div class="ws-thr">☠ ${esc(t)} <small>(zararlı yazılım)</small></div>`).join('')}<button type="button" class="ws-btn primary" data-act="remove">Tehditleri kaldır</button></div>` : ''}
        ${flow.result ? `<div class="ws-card ok">${flow.result}</div>` : ''}
        <div class="ws-btns"><button type="button" class="ws-btn primary" data-act="scan" ${flow.scan ? 'disabled' : ''}>⚡ Hızlı tarama</button>
          <button type="button" class="ws-btn" data-act="scanUsb" ${flow.scan ? 'disabled' : ''}>💾 USB belleği tara</button></div>
        <p class="ws-note">${usb ? 'USB bellek takılı: başkasından aldığınız belleği açmadan önce taratın.' : 'USB bellek takılı değil.'} Virüs programı bilgisayar açıkken kendisi de arka planda tarar; ayrıca el ile tarayabilirsiniz.<br><small>(Gerçek Windows'ta: USB için sürücüye sağ tık → Microsoft Defender ile tara)</small></p>`;
    } else if (page === 'duvar') {
      h = `<h2>🧱 Güvenlik duvarı</h2><p class="ws-note">Güvenlik duvarı, internetten izinsiz gelen bağlantıları durdurur. <b>Açık kalmalıdır.</b></p>
        <div class="ws-card ${sec.firewall ? 'ok' : 'bad'}">${sec.firewall ? '✅ <b>Güvenlik duvarı açık</b><small>Ev ağı: etkin</small>' : '⚠ <b>Güvenlik duvarı kapalı</b><small>Bilgisayarınız korunmuyor!</small>'}</div>
        <label class="ws-tog"><input type="checkbox" data-act="fw" ${sec.firewall ? 'checked' : ''}><i></i><span>${sec.firewall ? 'Açık' : 'Kapalı'}</span></label>`;
    } else {
      const total = CATS.map((c) => c[0]).filter((k) => !done(k)).reduce((a, k) => a + catSize(k), 0);
      h = `<h2>🧹 Disk Temizleme</h2><p class="ws-note"><small>(Gerçek Windows'ta: Disk Temizleme ayrı bir programdır)</small></p>
        <div class="ws-disk"><div class="ws-bar"><i style="width:${sec.used / DISK_TOTAL * 100}%"></i></div><small>Yerel Disk (C:) · ${gb(sec.used)} dolu / ${DISK_TOTAL} GB · <b>${gb(DISK_TOTAL - sec.used)} boş</b></small></div>
        ${flow.clean ? '<div class="ws-prog"></div>' : `<div class="ws-list">${CATS.map(([k, n, d, , on, risk]) => {
          const sz = catSize(k);
          return `<label class="ws-cat ${risk ? 'risk' : ''}${done(k) ? ' gone' : ''}"><input type="checkbox" data-cat="${k}" ${(flow.sel ? flow.sel[k] : on && !done(k)) ? 'checked' : ''} ${done(k) ? 'disabled' : ''}><span><b>${n}</b><small>${d}</small></span><em>${done(k) ? '✔ temiz' : gb(sz)}</em></label>`;
        }).join('')}</div>
        <p class="ws-note">Silinecek yaklaşık: <b>${gb(CATS.filter((c) => (flow.sel ? flow.sel[c[0]] : c[4] && !done(c[0]))).reduce((a, c) => a + catSize(c[0]), 0))}</b> (toplam temizlenebilir: ${gb(total)})</p>
        <button type="button" class="ws-btn primary" data-act="clean">🗑 Temizle</button>`}
        ${flow.msg ? `<div class="ws-card ok">${flow.msg}</div>` : ''}`;
    }
    body.innerHTML = `<nav class="ws-nav">${NAV.map(([id, ic, l]) => `<button type="button" data-p="${id}" class="${id === page ? 'on' : ''}">${ic} ${l}</button>`).join('')}</nav><div class="ws-page">${h}</div>`;
  }

  async function scan(kind) {
    flow.scan = true; flow.result = ''; flow.threats = null;
    emit('scan-start', { kind });
    render();
    const targets = kind === 'usb' ? desk.fs.children('usb') : null;
    const el = body.querySelector('.ws-prog');
    await progress(el, kind === 'usb' ? 2200 : 3500, kind === 'usb' ? 'USB bellek taranıyor…' : 'Bilgisayar taranıyor… (dosyalar tek tek kontrol edilir)');
    flow.scan = false;
    sec.scans++;
    sec.lastScan = desk.now().toLocaleString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
    const bad = (targets || []).filter((n) => /\.exe$/i.test(n.name)).map((n) => n.name);
    flow.threats = bad;
    flow.result = bad.length ? '' : kind === 'usb' ? '✅ <b>USB bellekte tehdit bulunamadı.</b> Dosyalarını güvenle açabilirsiniz.' : '✅ <b>Tehdit bulunamadı.</b> 24.318 dosya tarandı.';
    emit('scan-done', { kind, threats: bad.length });
    render();
  }

  body.addEventListener('click', async (e) => {
    const nav = e.target.closest('[data-p]');
    if (nav) { page = nav.dataset.p; flow.result = ''; flow.msg = ''; render(); emit('ws-page', { page }); return; }
    const a = e.target.closest('[data-act]')?.dataset.act;
    if (a === 'scan') return scan('quick');
    if (a === 'scanUsb') {
      if (!desk.fs.usb) { desk.toast('USB bellek yok', 'Taranacak bir USB bellek takılı değil. Önce belleği takın.', '💾'); emit('scan-nousb'); return; }
      return scan('usb');
    }
    if (a === 'remove') {
      for (const n of desk.fs.children('usb')) if (flow.threats.includes(n.name)) desk.fs.purge(n.id);
      emit('threat-remove', { count: flow.threats.length });
      flow.result = '✅ <b>Tehditler kaldırıldı.</b> USB bellek temiz.';
      flow.threats = null;
      render();
      return;
    }
    if (a === 'clean') {
      const sel = CATS.filter((c) => body.querySelector(`[data-cat="${c[0]}"]`)?.checked && !done(c[0])).map((c) => c[0]);
      if (!sel.length) { desk.toast('Bir şey seçilmedi', 'Temizlemek istediğiniz öğeleri işaretleyin.', '🧹'); return; }
      if (sel.includes('down')) {
        const ans = await dialogs.ask({ title: 'İndirilenler silinsin mi?', icon: '⚠', text: `<b>İndirilenler</b> klasöründeki ${downN()} dosya kalıcı olarak silinecek. Fatura, fotoğraf gibi dosyalarınız burada olabilir. Emin misiniz?`, buttons: [['yes', 'Yine de sil'], ['no', 'Vazgeç', true]] });
        emit('disk-downloads-ask', { answer: ans });
        if (ans !== 'yes') return;
      }
      flow.clean = true; flow.sel = null; flow.msg = '';
      render();
      await progress(body.querySelector('.ws-prog'), 2400, 'Temizleniyor…');
      let freed = 0;
      for (const k of sel) {
        freed += catSize(k);
        (sec.cleaned ||= {})[k] = true;
        if (k === 'recycle') desk.fs.emptyRecycle();
        if (k === 'down') for (const n of desk.fs.children('downloads')) desk.fs.purge(n.id);
      }
      sec.used = Math.max(10, sec.used - freed);
      flow.clean = false;
      flow.msg = `✅ <b>${gb(freed)}</b> yer açıldı. Boş alan: <b>${gb(DISK_TOTAL - sec.used)}</b>.`;
      desk.toast('Disk temizlendi', `${gb(freed)} yer açıldı.`, '🧹');
      emit('disk-clean', { freed, items: sel, downloads: sel.includes('down') });
      render();
      return;
    }
  });
  body.addEventListener('change', async (e) => {
    if (e.target.dataset.act === 'fw') {
      const on = e.target.checked;
      if (!on) {
        const ans = await dialogs.ask({ title: 'Güvenlik duvarı kapatılsın mı?', icon: '⚠', text: 'Güvenlik duvarı kapatılırsa bilgisayarınız internetten gelen saldırılara açık kalır. Gerçekten kapatmak istiyor musunuz?', buttons: [['yes', 'Evet, kapat'], ['no', 'Vazgeç', true]] });
        if (ans !== 'yes') { e.target.checked = true; return; }
      }
      sec.firewall = on;
      emit('firewall', { on });
      render();
    }
    if (e.target.dataset.cat) {
      flow.sel = Object.fromEntries(CATS.map((c) => [c[0], !!body.querySelector(`[data-cat="${c[0]}"]`)?.checked]));
      render();
    }
  });
  render();
  return { onArgs: (a) => { if (a.page) { page = a.page; render(); } }, onFs: () => { if (!flow.scan && !flow.clean && page !== 'virus') render(); } };
}
