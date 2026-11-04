// Windows Güvenliği (Windows 11): Giriş (Güvenlik bir bakışta), Virüs ve tehdit koruması (Hızlı tarama, USB belleği tara), Hesap koruması,
// Güvenlik duvarı ve ağ koruması, Uygulama ve tarayıcı denetimi, Cihaz güvenliği, Cihaz performansı ve durumu, Aile seçenekleri, Koruma geçmişi, Disk Temizleme.
import { esc, progress } from './util.js';
import { RECYCLE } from '../vfs.js';
import { SYS_ICONS as SI } from './appicons.js';
import { MI, CP } from './w11-simge.js';

const gb = (n) => n.toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' GB';
export const DISK_TOTAL = 256;
// Temizlenebilecek şeyler: [anahtar, ad, açıklama, GB, varsayılan seçili, riskli]
const CATS = [
  ['tmp', 'Geçici internet dosyaları', 'Tarayıcının hız için sakladığı kopyalar; silmek zararsızdır', 4.2, true],
  ['upd', 'Windows güncelleme artıkları', 'Güncellemeden arta kalan eski dosyalar', 6.8, true],
  ['thumb', 'Küçük resimler', 'Klasörlerde fotoğrafların minik önizlemeleri; yeniden oluşur', 0.4, true],
  ['recycle', 'Geri Dönüşüm Kutusu', 'İçindeki dosyalar kalıcı silinir', 0, false],
  ['down', 'İndirilenler klasörü', 'Dikkat: sizin indirdiğiniz dosyalar (fatura, fotoğraf…) vardır; silinince geri gelmez!', 0, false, true],
];
// Sol gezinti: [sayfa, simge, ad]
const NAV = [
  ['home', 'home', 'Giriş'], ['virus', 'shieldcheck', 'Virüs ve tehdit koruması'], ['account', 'accountcheck', 'Hesap koruması'],
  ['duvar', 'hotspot', 'Güvenlik duvarı ve ağ koruması'], ['app', 'browser', 'Uygulama ve tarayıcı denetimi'], ['device', 'laptop', 'Cihaz güvenliği'],
  ['perf', 'pulse', 'Cihaz performansı ve durumu'], ['disk', 'trash', 'Disk Temizleme'], ['family', 'family', 'Aile seçenekleri'], ['history', 'history', 'Koruma geçmişi'],
];
const TITLES = Object.fromEntries(NAV.map(([p, , t]) => [p, t]));
// Bilgi sayfaları: başlık altı yazı + satırlar [ad, açıklama, durum]
const INFO = {
  account: ['Hesabınızın ve cihazınıza oturum açma yöntemlerinin güvenliği.'],
  app: ['Zararlı uygulamalara, dosyalara ve sitelere karşı koruma.'],
  device: ['Cihazınızın donanımına yerleşik güvenlik özellikleri.'],
  family: ['Ailenizin cihazlarını ve etkinliklerini yönetin.'],
};
const fmtClock = (d) => d.toLocaleString('tr-TR', { day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export function guvenlik({ desk, body, args, emit, dialogs }) {
  body.classList.add('wgz');
  const sec = (desk.sec ||= { used: 231.4, firewall: true, lastScan: null, scans: 0 });
  sec.log ||= [];
  let page = args.page || 'home';
  let fwSel = null; // güvenlik duvarı sayfasında açık ağ profili
  const flow = {};
  const recycleN = () => desk.fs.children(RECYCLE).length;
  const downN = () => desk.fs.children('downloads').length;
  const catSize = (k) => (k === 'recycle' ? recycleN() * 0.1 : k === 'down' ? downN() * 0.3 : CATS.find((c) => c[0] === k)[3]);
  const done = (k) => sec.cleaned?.[k];
  const log = (title, text, bad = false) => sec.log.unshift({ when: fmtClock(desk.now()), title, text, bad });
  const lowDisk = () => sec.used / DISK_TOTAL > 0.8;

  // Giriş kutucukları: [sayfa, simge, ad, durum, metin]
  const tiles = () => {
    const thr = flow.threats?.length;
    return [
      ['virus', 'shieldcheck', 'Virüs ve tehdit koruması', thr ? 'bad' : 'ok', thr ? 'Tehdit bulundu. Eylem gerekli.' : 'Eylem gerekmiyor.'],
      ['account', 'accountcheck', 'Hesap koruması', 'ok', 'Eylem gerekmiyor.'],
      ['duvar', 'hotspot', 'Güvenlik duvarı ve ağ koruması', sec.firewall ? 'ok' : 'bad', sec.firewall ? 'Eylem gerekmiyor.' : 'Güvenlik duvarı kapalı. Eylem gerekli.'],
      ['app', 'browser', 'Uygulama ve tarayıcı denetimi', 'ok', 'Eylem gerekmiyor.'],
      ['device', 'laptop', 'Cihaz güvenliği', 'ok', 'Standart donanım güvenliği destekleniyor.'],
      ['perf', 'pulse', 'Cihaz performansı ve durumu', lowDisk() ? 'warn' : 'ok', lowDisk() ? 'Disk alanı azalıyor. Disk Temizleme önerilir.' : 'Cihazınızın sistem durumu bildirildi.'],
      ['family', 'family', 'Aile seçenekleri', 'ok', 'Ailenizin cihazlarını yönetin.'],
    ];
  };
  const badge = (st) => `<em class="wgz-bd ${st}">${st === 'ok' ? MI.check : st === 'warn' ? '!' : MI.close}</em>`;
  const stCard = (st, title, text = '') => `<div class="wgz-st ${st}"><span class="wgz-sti">${st === 'ok' ? MI.shieldcheck : st === 'warn' ? MI.warn : MI.close}</span><div><b>${title}</b>${text ? `<small>${text}</small>` : ''}</div></div>`;
  const card = (t, inner, cls = '') => `<section class="wgz-card ${cls}">${t ? `<h3>${t}</h3>` : ''}${inner}</section>`;
  const infoRows = (rows) => rows.map(([n, d, v]) => `<div class="wgz-line"><div><b>${n}</b>${d ? `<small>${d}</small>` : ''}</div>${v ? `<span class="wgz-v">${v}</span>` : ''}</div>`).join('');

  function render() {
    let h = '';
    const head = (t, sub) => `<h2>${t}</h2><p class="wgz-sub">${sub}</p>`;
    if (page === 'home') {
      const t = tiles();
      const ok = t.every((x) => x[3] === 'ok');
      h = `${head('Güvenlik bir bakışta', 'Cihazınızın güvenlik ve sistem durumuyla ilgili bilgi edinin, gerekirse eylem alın.')}
        ${stCard(ok ? 'ok' : t.some((x) => x[3] === 'bad') ? 'bad' : 'warn', ok ? 'Cihazınız korunuyor' : 'Bazı öğeler dikkatinizi gerektiriyor', ok ? 'Şu anda eylem gerekmiyor.' : 'Sarı ünlemli ya da kırmızı kutucuklara bakın.')}
        <div class="wgz-tiles">${t.map(([p, ic, n, st, tx]) => `<button type="button" class="wgz-tile ${st}" data-p="${p}"><span class="wgz-ti">${MI[ic]}${badge(st)}</span><b>${n}</b><small>${tx}</small></button>`).join('')}</div>`;
    } else if (page === 'virus') {
      const usb = desk.fs.usb;
      const thr = flow.threats?.length;
      h = `${head('Virüs ve tehdit koruması', 'Cihazınızı tehditlere karşı koruyun.')}
        ${card('Geçerli tehditler', flow.scan ? `<div class="wgz-scan"><b>${flow.scan === 'usb' ? 'USB bellek taraması sürüyor…' : 'Hızlı tarama sürüyor…'}</b><div class="wgz-prog"></div>
            <div class="wgz-meta"><span class="wgz-left"></span><span class="wgz-files"></span></div><button type="button" class="wgz-btn" data-act="cancel">Taramayı iptal et</button></div>`
          : thr ? `${stCard('bad', 'Tehdit bulundu', 'Şu tehditler kaldırılmayı bekliyor:')}${flow.threats.map((t) => `<div class="wgz-thr">${MI.warn} ${esc(t)} <small>(zararlı yazılım)</small></div>`).join('')}<div class="wgz-btns"><button type="button" class="wgz-btn primary" data-act="remove">Tehditleri kaldır</button></div>`
          : `${stCard('ok', 'Şu anda geçerli tehdit yok.', sec.lastScan ? `Son tarama: ${esc(sec.lastScan)} (${esc(sec.lastKind || 'hızlı tarama')})<br>${sec.lastThr || 0} tehdit bulundu. Tarama ${sec.lastDur || '0 dakika 4 saniye'} sürdü; ${sec.lastFiles || '24.318'} dosya tarandı.` : 'Henüz tarama yapılmadı.')}
            ${flow.result ? `<div class="wgz-res">${flow.result}</div>` : ''}
            <div class="wgz-btns"><button type="button" class="wgz-btn primary" data-act="scan">Hızlı tarama</button><button type="button" class="wgz-btn" data-act="scanUsb">USB belleği tara</button></div>`)}
        ${card('Virüs ve tehdit koruması ayarları', `<div class="wgz-line"><div><b>Gerçek zamanlı koruma</b><small>Kötü amaçlı yazılımları siz açmadan önce bulur ve durdurur.</small></div><span class="wgz-v ok">Açık</span></div>`)}
        <p class="wgz-note">${usb ? 'USB bellek takılı: başkasından aldığınız belleği açmadan önce taratın.' : 'USB bellek takılı değil.'} Virüs programı bilgisayar açıkken kendisi de arka planda tarar; ayrıca el ile tarayabilirsiniz.<br><small>(Gerçek Windows'ta: USB için sürücüye sağ tık → Microsoft Defender ile tara)</small></p>`;
    } else if (page === 'duvar') {
      const active = desk.settings.netProfiles?.[desk.settings.network] === 'ortak' ? 'ortak' : desk.settings.network ? 'ozel' : 'ortak';
      const profs = [['alan', 'Etki alanı ağı', 'Bir iş yeri etki alanına bağlı ağlar.'], ['ozel', 'Özel ağ', 'Güvendiğiniz, evdeki gibi ağlar.'], ['ortak', 'Genel ağ', 'Kafe, hastane gibi herkese açık ağlar.']];
      const sel = fwSel || active;
      const P = profs.find((x) => x[0] === sel);
      h = `${head('Güvenlik duvarı ve ağ koruması', 'Güvenlik duvarı, internetten izinsiz gelen bağlantıları durdurur. <b>Açık kalmalıdır.</b>')}
        ${sec.firewall ? '' : stCard('bad', 'Güvenlik duvarı kapalı', 'Bilgisayarınız korunmuyor!')}
        <div class="wgz-profs">${profs.map(([k, n, d]) => `<button type="button" class="wgz-prof${k === sel ? ' on' : ''}" data-fw="${k}"><span class="wgz-ti ${sec.firewall ? 'ok' : 'bad'}">${MI.hotspot}${badge(sec.firewall ? 'ok' : 'bad')}</span><div><b>${n}${k === active ? ' (etkin)' : ''}</b><small>${d}</small></div></button>`).join('')}</div>
        ${card(`${P[1]}${P[0] === active ? ' (etkin)' : ''}`, `<div class="wgz-line"><div><b>Microsoft Defender Güvenlik Duvarı</b><small>${sec.firewall ? 'Güvenlik duvarı açık.' : 'Güvenlik duvarı kapalı.'}</small></div>
          <label class="wgz-tog"><span>${sec.firewall ? 'Açık' : 'Kapalı'}</span><input type="checkbox" data-act="fw" ${sec.firewall ? 'checked' : ''}><i></i></label></div>`)}`;
    } else if (page === 'perf') {
      h = `${head('Cihaz performansı ve durumu', 'Cihazınızın sistem durumu hakkında bilgi alın.')}
        ${card('Depolama kapasitesi', `${stCard(lowDisk() ? 'warn' : 'ok', lowDisk() ? 'Disk alanı azalıyor' : 'Yeterli disk alanı var', `Yerel Disk (C:) · ${gb(sec.used)} dolu / ${DISK_TOTAL} GB · ${gb(DISK_TOTAL - sec.used)} boş`)}<div class="wgz-btns"><button type="button" class="wgz-btn" data-p="disk">Disk Temizleme'yi aç</button></div>`)}
        ${card('Diğer', infoRows([['Windows Update', 'Güncelleştirmeler denetlendi.', 'Güncel'], ['Pil ömrü', 'Masaüstü bilgisayarda pil yoktur.', '—'], ['Uygulamalar ve yazılım', 'Sorun bulunmadı.', 'Tamam']]))}`;
    } else if (page === 'history') {
      h = `${head('Koruma geçmişi', 'Windows Güvenliği\'nin yaptığı taramaları ve bulduğu tehditleri burada görürsünüz.')}
        ${sec.log.length ? sec.log.map((l) => `<section class="wgz-card"><div class="wgz-line"><div><b>${esc(l.title)}</b><small>${esc(l.when)}</small><small>${esc(l.text)}</small></div><span class="wgz-v ${l.bad ? 'bad' : 'ok'}">${l.bad ? 'Tehdit' : 'Temiz'}</span></div></section>`).join('') : card('', '<p class="wgz-empty">Gösterilecek yeni öneri yok. Bir tarama yaptığınızda burada görünür.</p>')}`;
    } else if (page === 'disk') {
      const total = CATS.map((c) => c[0]).filter((k) => !done(k)).reduce((a, k) => a + catSize(k), 0);
      h = `${head('Disk Temizleme', 'Gereksiz dosyaları silip disk alanı açın. <small>(Gerçek Windows\'ta: Disk Temizleme ayrı bir programdır)</small>')}
        ${card('', `<div class="wgz-disk"><div class="wgz-bar"><i style="width:${sec.used / DISK_TOTAL * 100}%"></i></div><small>Yerel Disk (C:) · ${gb(sec.used)} dolu / ${DISK_TOTAL} GB · <b>${gb(DISK_TOTAL - sec.used)} boş</b></small></div>`)}
        ${flow.clean ? '<div class="wgz-prog"></div>' : `<div class="wgz-list">${CATS.map(([k, n, d, , on, risk]) => {
          const sz = catSize(k);
          return `<label class="wgz-cat ${risk ? 'risk' : ''}${done(k) ? ' gone' : ''}"><input type="checkbox" data-cat="${k}" ${(flow.sel ? flow.sel[k] : on && !done(k)) ? 'checked' : ''} ${done(k) ? 'disabled' : ''}><span><b>${n}</b><small>${d}</small></span><em>${done(k) ? 'temiz' : gb(sz)}</em></label>`;
        }).join('')}</div>
        <p class="wgz-note">Silinecek yaklaşık: <b>${gb(CATS.filter((c) => (flow.sel ? flow.sel[c[0]] : c[4] && !done(c[0]))).reduce((a, c) => a + catSize(c[0]), 0))}</b> (toplam temizlenebilir: ${gb(total)})</p>
        <button type="button" class="wgz-btn primary" data-act="clean">Temizle</button>`}
        ${flow.msg ? `<div class="wgz-res">${flow.msg}</div>` : ''}`;
    } else {
      const sub = INFO[page][0];
      h = head(TITLES[page], sub);
      if (page === 'account') h += `${stCard('ok', 'Eylem gerekmiyor.', 'Hesabınız güvende.')}${card('Oturum açma', infoRows([['Hesap türü', 'Bu bilgisayarda yerel hesap kullanıyorsunuz.', 'Yerel hesap'], ['Windows Hello PIN', 'PIN, şifreden daha kısa ve bu bilgisayara özeldir.', desk.settings.pin ? 'Ayarlı' : 'Ayarlı değil'], ['Dinamik kilit', 'Yanınızdan uzaklaşınca bilgisayarı kilitler.', 'Kapalı']]))}<div class="wgz-btns"><button type="button" class="wgz-btn" data-act="openAcc">Hesap ayarlarını aç</button></div>`;
      if (page === 'app') h += `${stCard('ok', 'Eylem gerekmiyor.', 'Uygulamalarınız ve tarayıcınız korunuyor.')}${card('Güvenlik özellikleri', infoRows([['Uygulamalarda ve dosyalarda itibar tabanlı koruma', 'Şüpheli uygulamaları ve dosyaları engeller.', '<span class="wgz-v ok">Açık</span>'], ['Microsoft Edge için SmartScreen', 'Zararlı siteleri ve indirmeleri engeller.', '<span class="wgz-v ok">Açık</span>'], ['İstenmeyen uygulama engelleme', 'Bilgisayarı yavaşlatan reklam yazılımlarını engeller.', '<span class="wgz-v ok">Açık</span>']]))}`;
      if (page === 'device') h += `${stCard('ok', 'Standart donanım güvenliği destekleniyor.', 'Eylem gerekmiyor.')}${card('Güvenlik işlemcisi', infoRows([['Güvenlik işlemcisi (TPM 2.0)', 'Şifreleme anahtarlarını donanımda saklar.', '<span class="wgz-v ok">Hazır</span>'], ['Güvenli önyükleme', 'Açılışta zararlı yazılımı engeller.', '<span class="wgz-v ok">Açık</span>'], ['Çekirdek yalıtımı', 'Windows\'un çekirdeğini saldırılardan korur.', '<span class="wgz-v ok">Açık</span>']]))}`;
      if (page === 'family') h += `${stCard('ok', 'Eylem gerekmiyor.')}${card('Ailenizin cihazları', '<p class="wgz-empty">Torunlarınız ya da çocuğunuz için <b>çocuk hesabı</b> açarsanız, kullanım süresini ve gezdikleri siteleri buradan izleyebilirsiniz. Şu anda bağlı bir aile üyesi yok.</p>')}`;
    }
    const navBtns = NAV.map(([p, ic, l]) => `<button type="button" data-p="${p}" class="${p === page ? 'on' : ''}" title="${l}"><span>${MI[ic]}</span><b>${l}</b></button>`).join('');
    body.innerHTML = `<nav class="wgz-nav"><button type="button" class="wgz-hb" data-act="mini" aria-label="Menüyü daralt ya da genişlet" title="Menü"><span>${MI.menu}</span></button>${navBtns}<i class="wgz-sp"></i><button type="button" data-act="openSet" title="Ayarlar"><span>${MI.gear}</span><b>Ayarlar</b></button></nav><div class="wgz-page">${h}</div>`;
  }

  // Tarama: dosya sayacı ve kalan süre canlı güncellenir; "Taramayı iptal et" ile durdurulur
  async function scan(kind) {
    flow.scan = kind; flow.result = ''; flow.threats = null; flow.cancel = false;
    emit('scan-start', { kind });
    render();
    const targets = kind === 'usb' ? desk.fs.children('usb') : null;
    const dur = kind === 'usb' ? 2200 : 3800;
    const totalFiles = kind === 'usb' ? 12 : 24318;
    const bar = body.querySelector('.wgz-prog');
    const left = body.querySelector('.wgz-left'), files = body.querySelector('.wgz-files');
    bar.innerHTML = '<div class="prg"><i></i></div>';
    const fill = bar.querySelector('.prg i');
    const t0 = performance.now();
    await new Promise((res) => {
      const tick = () => {
        if (flow.cancel || !body.isConnected) return res();
        const p = Math.min(1, (performance.now() - t0) / dur);
        fill.style.width = (p * 100).toFixed(1) + '%';
        const n = Math.floor(totalFiles * (1 - (1 - p) ** 1.6));
        files.textContent = `Taranan dosyalar: ${n.toLocaleString('tr-TR')}`;
        const secs = Math.ceil((1 - p) * (kind === 'usb' ? 12 : 55));
        left.textContent = `Tahmini kalan süre: ${Math.floor(secs / 60)} dk ${String(secs % 60).padStart(2, '0')} sn`;
        if (p < 1) setTimeout(tick, 90); else res();
      };
      tick();
    });
    if (flow.cancel) {
      flow.scan = false;
      flow.result = 'Tarama iptal edildi. İsterseniz yeniden başlatın.';
      emit('scan-cancel', { kind });
      render();
      return;
    }
    flow.scan = false;
    sec.scans++;
    sec.lastScan = fmtClock(desk.now());
    sec.lastKind = kind === 'usb' ? 'USB bellek taraması' : 'hızlı tarama';
    sec.lastDur = kind === 'usb' ? '0 dakika 2 saniye' : '0 dakika 4 saniye';
    sec.lastFiles = totalFiles.toLocaleString('tr-TR');
    const bad = (targets || []).filter((n) => /\.exe$/i.test(n.name)).map((n) => n.name);
    sec.lastThr = bad.length;
    flow.threats = bad;
    flow.result = bad.length ? '' : kind === 'usb' ? '<b>USB bellekte tehdit bulunamadı.</b> Dosyalarını güvenle açabilirsiniz.' : `<b>Tehdit bulunamadı.</b> ${sec.lastFiles} dosya tarandı.`;
    log(kind === 'usb' ? 'USB bellek taraması tamamlandı' : 'Hızlı tarama tamamlandı', bad.length ? `${bad.length} tehdit bulundu: ${bad.join(', ')}` : 'Tehdit bulunamadı.', !!bad.length);
    emit('scan-done', { kind, threats: bad.length });
    render();
  }

  body.addEventListener('click', async (e) => {
    const nav = e.target.closest('[data-p]');
    if (nav) { if (flow.scan) return; page = nav.dataset.p; flow.msg = ''; if (page !== 'virus') flow.result = ''; render(); emit('ws-page', { page }); return; }
    const fw = e.target.closest('[data-fw]');
    if (fw) { fwSel = fw.dataset.fw; render(); return; }
    const a = e.target.closest('[data-act]')?.dataset.act;
    if (a === 'mini') { body.classList.toggle('wgz-mini'); return; }
    if (a === 'openSet') { desk.open('settings', { page: 'privacy' }); return; }
    if (a === 'openAcc') { desk.open('settings', { page: 'accounts' }); return; }
    if (a === 'cancel') { flow.cancel = true; return; }
    if (a === 'scan') return scan('quick');
    if (a === 'scanUsb') {
      if (!desk.fs.usb) { desk.toast('USB bellek yok', 'Taranacak bir USB bellek takılı değil. Önce belleği takın.', SI.usb); emit('scan-nousb'); return; }
      return scan('usb');
    }
    if (a === 'remove') {
      const n = flow.threats.length;
      for (const f of desk.fs.children('usb')) if (flow.threats.includes(f.name)) desk.fs.purge(f.id);
      log('Tehditler kaldırıldı', `${n} tehdit USB bellekten kaldırıldı.`);
      emit('threat-remove', { count: n });
      flow.result = '<b>Tehditler kaldırıldı.</b> USB bellek temiz.';
      flow.threats = null;
      sec.lastThr = 0;
      render();
      return;
    }
    if (a === 'clean') {
      const sel = CATS.filter((c) => body.querySelector(`[data-cat="${c[0]}"]`)?.checked && !done(c[0])).map((c) => c[0]);
      if (!sel.length) { desk.toast('Bir şey seçilmedi', 'Temizlemek istediğiniz öğeleri işaretleyin.', CP.programs); return; }
      if (sel.includes('down')) {
        const ans = await dialogs.ask({ title: 'İndirilenler silinsin mi?', icon: 'warn', text: `<b>İndirilenler</b> klasöründeki ${downN()} dosya kalıcı olarak silinecek. Fatura, fotoğraf gibi dosyalarınız burada olabilir. Emin misiniz?`, buttons: [['yes', 'Yine de sil'], ['no', 'Vazgeç', true]] });
        emit('disk-downloads-ask', { answer: ans });
        if (ans !== 'yes') return;
      }
      flow.clean = true; flow.sel = null; flow.msg = '';
      render();
      await progress(body.querySelector('.wgz-prog'), 2400, 'Temizleniyor…');
      let freed = 0;
      for (const k of sel) {
        freed += catSize(k);
        (sec.cleaned ||= {})[k] = true;
        if (k === 'recycle') desk.fs.emptyRecycle();
        if (k === 'down') for (const n of desk.fs.children('downloads')) desk.fs.purge(n.id);
      }
      sec.used = Math.max(10, sec.used - freed);
      flow.clean = false;
      flow.msg = `<b>${gb(freed)}</b> yer açıldı. Boş alan: <b>${gb(DISK_TOTAL - sec.used)}</b>.`;
      desk.toast('Disk temizlendi', `${gb(freed)} yer açıldı.`, SI.ok);
      emit('disk-clean', { freed, items: sel, downloads: sel.includes('down') });
      render();
      return;
    }
  });
  body.addEventListener('change', async (e) => {
    if (e.target.dataset.act === 'fw') {
      const on = e.target.checked;
      if (!on) {
        const ans = await dialogs.ask({ title: 'Güvenlik duvarı kapatılsın mı?', icon: 'warn', text: 'Güvenlik duvarı kapatılırsa bilgisayarınız internetten gelen saldırılara açık kalır. Gerçekten kapatmak istiyor musunuz?', buttons: [['yes', 'Evet, kapat'], ['no', 'Vazgeç', true]] });
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
