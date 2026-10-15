// Video, radyo ve gazete siteleri (hepsi uydurmadır): İzleyelim (arama, reklamı atla, tam ekran, altyazı, hız, radyo)
// ve Gazete Oku (haber okurken reklam ve galeri tuzakları).
import { esc, playTune } from './util.js';

const page = (title, html, cls = '') => ({ title, html: `<div class="wp ${cls}">${html}</div>` });

// ======================================================================= İzleyelim
export const VIDEOS = [
  { id: 'cay', emoji: '🍵', title: 'Çay nasıl demlenir? (5 dakikada)', by: 'Mutfak Rehberi', views: '412 bin', keys: ['çay', 'cay', 'demleme', 'demlik'], cc: ['Önce suyu kaynatın.', 'Demliğe üç kaşık çay koyun.', 'Üzerine kaynar su ekleyin.', 'Kısık ateşte on beş dakika demlenmeye bırakın.', 'Afiyet olsun!'] },
  { id: 'fide', emoji: '🍅', title: 'Domates fidesi nasıl dikilir?', by: 'Bahçıvan Ahmet', views: '98 bin', keys: ['domates', 'fide', 'bahçe', 'bahce', 'sebze'], cc: ['Fideyi saksıdan nazikçe çıkarın.', 'Toprağı bir karış derinlikte açın.', 'Fideyi gömüp çevresine toprak sıkıştırın.', 'Bol su verin.', 'İki günde bir sulamayı unutmayın.'] },
  { id: 'egzersiz', emoji: '🪑', title: 'Sandalyede sağlıklı egzersiz (her yaşa uygun)', by: 'Sağlıklı Yaşam', views: '1,2 milyon', keys: ['egzersiz', 'sandalye', 'spor', 'jimnastik', 'sağlık'], cc: ['Sandalyeye dik oturun.', 'Kollarınızı yavaşça yukarı kaldırın.', 'Beş saniye bekleyin.', 'Yavaşça indirin.', 'Bunu on kez tekrarlayın.'] },
  { id: 'dolandirici', emoji: '🛡', title: 'Telefon dolandırıcılığına karşı 5 kural', by: 'Güvenli Yaşam', views: '2,4 milyon', keys: ['dolandırıcı', 'dolandirici', 'güvenlik', 'guvenlik', 'telefon', 'sms'], cc: ['Bankalar şifrenizi telefonda istemez.', 'SMS ile gelen kodu kimseyle paylaşmayın.', 'Acele ettiren aramalardan şüphelenin.', 'Şüphede kapatın, bankayı kendiniz arayın.', 'Yakınlarınıza da anlatın.'] },
];
export const RADIOS = [['Türkü Radyo', '🎻', 'Türkü ve halk müziği'], ['Sabah Haberleri FM', '📰', 'Haber ve gündem'], ['Nostalji Radyo', '📻', 'Eski güzel şarkılar']];
const SPEEDS = [1, 0.75, 0.5, 1.25, 1.5];
const fmtT = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const LEN = 60;

const izHead = (q = '') => `<header class="iz-head"><a data-href="www.izleyelim.com" class="iz-logo">▶ İzleyelim</a><form class="iz-search" data-act="search"><input name="q" value="${esc(q)}" placeholder="Video ara" autocomplete="off"><button>🔍</button></form><a data-href="www.izleyelim.com/radyo" class="iz-nav">📻 Radyo</a></header>`;
const thumb = (v) => `<a class="iz-card" data-href="www.izleyelim.com/izle/${v.id}"><div class="iz-th">${v.emoji}</div><b>${esc(v.title)}</b><small>${esc(v.by)} · ${v.views} izlenme</small></a>`;

const IZ = {
  name: 'İzleyelim', secure: true,
  render(path, q, ctx) {
    const st = ctx.state;
    if (path === '/ara') {
      const words = q.toLocaleLowerCase('tr').split(/\s+/).filter(Boolean);
      const hits = VIDEOS.filter((v) => words.some((w) => v.keys.some((k) => k.includes(w) || w.includes(k)) || v.title.toLocaleLowerCase('tr').includes(w)));
      return page(`${q} - İzleyelim`, `${izHead(q)}<div class="iz-body"><h2>“${esc(q)}” için ${hits.length} video</h2><div class="iz-grid">${hits.map(thumb).join('') || '<p>Video bulunamadı. Başka kelimelerle arayın.</p>'}</div></div>`, 'iz');
    }
    if (path === '/radyo') {
      return page('Radyo - İzleyelim', `${izHead()}<div class="iz-body"><h2>📻 İnternet radyosu</h2><p class="mut">İstediğiniz kanalın yanındaki ▶ düğmesine tıklayın. Başka kanala geçince öncekisi susar.</p>
        ${RADIOS.map(([n, e, d]) => `<div class="iz-radio${st.radio === n ? ' on' : ''}"><span>${e}</span><div><b>${n}</b><small>${d}</small></div><button type="button" data-act="radio" data-n="${n}">${st.radio === n ? '■ Durdur' : '▶ Dinle'}</button></div>`).join('')}</div>`, 'iz');
    }
    const m = path.match(/^\/izle\/(\w+)/);
    if (m) {
      const v = VIDEOS.find((x) => x.id === m[1]);
      if (!v) return page('Video bulunamadı', `${izHead()}<div class="iz-body"><h2>Video bulunamadı</h2></div>`, 'iz');
      if (st.vid !== v.id) Object.assign(st, { vid: v.id, adLeft: 5, adDone: false, playing: true, t: 0, mute: false, cc: false, speed: 1, full: false });
      const line = st.cc ? v.cc[Math.min(v.cc.length - 1, Math.floor(st.t / (LEN / v.cc.length)))] : '';
      const player = `<div class="iz-player${st.full ? ' iz-fs' : ''}">
        <div class="iz-screen">${v.emoji}${!st.adDone ? `<div class="iz-ad" data-act="adclick" data-ad="1"><span class="iz-adtag">Reklam</span><b>Yeni nesil diz ağrısı kremi: %50 indirim!</b><small>Reklamı <span class="iz-adtxt">${st.adLeft}</span> sn sonra atlayabilirsiniz</small><button type="button" class="iz-skip" data-act="skipad" ${st.adLeft > 0 ? 'hidden' : ''}>Reklamı atla ▶</button></div>` : ''}
          ${st.cc && st.adDone ? `<div class="iz-cc">${esc(line)}</div>` : ''}${st.adDone && !st.playing ? '<div class="iz-pause">⏸</div>' : ''}</div>
        <div class="iz-bar"><div class="iz-prog"><i style="width:${st.t / LEN * 100}%"></i></div>
          <div class="iz-ctrls"><button type="button" data-act="play" title="Oynat / durdur">${st.playing ? '⏸' : '▶'}</button><span class="iz-time">${fmtT(st.t)} / ${fmtT(LEN)}</span>
            <button type="button" data-act="mute" title="Ses">${st.mute ? '🔇' : '🔊'}</button><span class="iz-sp"></span>
            <button type="button" data-act="cc" class="${st.cc ? 'on' : ''}" title="Altyazı">CC</button>
            <button type="button" data-act="speed" title="Oynatma hızı">⚙ ${st.speed}x</button>
            <button type="button" data-act="full" title="Tam ekran">${st.full ? '🗗' : '⛶'}</button></div></div>
        ${st.full ? '<div class="iz-esc">Tam ekrandan çıkmak için <b>Esc</b> tuşuna basın</div>' : ''}</div>`;
      return page(v.title, `${izHead()}<div class="iz-body iz-watch">${player}${st.full ? '' : `<h1>${esc(v.title)}</h1><p class="iz-by">${esc(v.by)} · ${v.views} izlenme</p>
        <h3>Önerilen videolar</h3><div class="iz-grid">${VIDEOS.filter((x) => x.id !== v.id).slice(0, 2).map(thumb).join('')}<a class="iz-card ad" data-ad="1" data-act="adclick"><div class="iz-th bait">😱</div><b>ŞOK! Bu videoyu izleyen herkes hayretler içinde kaldı…</b><small>Sponsorlu</small></a></div>`}</div>`, 'iz');
    }
    return page('İzleyelim', `${izHead()}<div class="iz-body"><h2>Sizin için seçtiklerimiz</h2><div class="iz-grid">${VIDEOS.map(thumb).join('')}</div></div>`, 'iz');
  },
  mount(el, ctx) {
    const st = ctx.state;
    if (st.onKey) document.removeEventListener('keydown', st.onKey, true);
    st.onKey = (e) => {
      if (e.key === 'Escape' && st.full && ctx.loc.path.startsWith('/izle')) { st.full = false; ctx.emit('iz-full', { on: false, via: 'esc' }); ctx.refresh(); }
    };
    document.addEventListener('keydown', st.onKey, true);
    if (!ctx.loc.path.startsWith('/izle')) return 0;
    // Reklam engelleyici açıksa reklam hiç gelmez: video doğrudan başlar
    if (!st.adDone && !el.querySelector('.iz-ad')) { st.adDone = true; setTimeout(() => ctx.refresh(), 0); return 0; }
    return setInterval(() => {
      if (!el.isConnected || st.vid === undefined) return;
      if (!st.adDone) {
        if (st.adLeft > 0) st.adLeft--;
        const tx = el.querySelector('.iz-adtxt');
        if (tx) tx.textContent = st.adLeft;
        if (st.adLeft <= 0) {
          const sk = el.querySelector('.iz-skip');
          if (sk) { sk.hidden = false; el.querySelector('.iz-ad small').textContent = 'Reklam bitti ya da atlanabilir'; }
        }
        return;
      }
      if (!st.playing) return;
      st.t = Math.min(LEN, st.t + st.speed);
      const bar = el.querySelector('.iz-prog i');
      if (bar) bar.style.width = st.t / LEN * 100 + '%';
      const tm = el.querySelector('.iz-time');
      if (tm) tm.textContent = `${fmtT(st.t)} / ${fmtT(LEN)}`;
      if (st.cc) {
        const v = VIDEOS.find((x) => x.id === st.vid);
        const cc = el.querySelector('.iz-cc');
        if (cc && v) cc.textContent = v.cc[Math.min(v.cc.length - 1, Math.floor(st.t / (LEN / v.cc.length)))];
      }
      if (st.t >= LEN) { st.playing = false; ctx.refresh(); }
    }, 1000);
  },
  act(a, v, ctx, el) {
    const st = ctx.state;
    if (a === 'search') { if (v.q) { ctx.emit('iz-search', { q: v.q }); ctx.go('/ara', v.q); } return; }
    if (a === 'radio') {
      const n = el.dataset.n;
      st.radio = st.radio === n ? null : n;
      if (st.radio) playTune(ctx.desk, [392, 440, 494, 440, 392], 0.25);
      ctx.emit('iz-radio', { name: n, on: !!st.radio });
      ctx.refresh();
      return;
    }
    if (a === 'adclick') {
      ctx.emit('iz-ad-click');
      ctx.desk.toast('Reklama tıkladınız', 'Gerçekte yeni bir reklam sayfası açılırdı. Reklamdan kurtulmak için “Reklamı atla” düğmesini kullanın.', '⚠', 5000);
      return;
    }
    if (a === 'skipad') { st.adDone = true; ctx.emit('iz-ad-skip'); ctx.refresh(); return; }
    if (a === 'play') { st.playing = !st.playing; if (st.t >= LEN) st.t = 0; ctx.emit('iz-play', { on: st.playing }); ctx.refresh(); return; }
    if (a === 'mute') { st.mute = !st.mute; ctx.emit('iz-mute', { on: st.mute }); ctx.refresh(); return; }
    if (a === 'cc') { st.cc = !st.cc; ctx.emit('iz-cc', { on: st.cc }); ctx.refresh(); return; }
    if (a === 'speed') { st.speed = SPEEDS[(SPEEDS.indexOf(st.speed) + 1) % SPEEDS.length]; ctx.emit('iz-speed', { speed: st.speed }); ctx.refresh(); return; }
    if (a === 'full') { st.full = !st.full; ctx.emit('iz-full', { on: st.full, via: 'button' }); ctx.refresh(); }
  },
};

// ======================================================================= Gazete Oku
const NEWS = [
  { id: 0, title: 'Belediyeden yaşlılara ücretsiz bilgisayar kursu', body: ['Belediye Kültür Merkezi\'nde başlayacak kurs, 60 yaş üstü vatandaşlara yönelik. Eğitimler <b>her salı ve perşembe günü saat 10.00\'da</b> yapılacak.', 'Başvurular <b>20 Ekim\'e kadar</b> Kültür Merkezi\'nden ya da internet sitesinden alınabilecek. Katılımcılara sertifika verilecek.', 'Kursun kontenjanı 24 kişiyle sınırlı. Kurslar boyunca bilgisayar ve eğitim malzemeleri belediye tarafından ücretsiz sağlanacak.'] },
  { id: 1, title: 'Eczaneler nöbetçi listesini yeniledi', body: ['Hafta sonu nöbetçi eczanelerin listesi eczacı odasının internet sitesinde yayımlandı.', 'Vatandaşlar nöbetçi eczaneye gitmeden önce listeyi kontrol etmeye çağrıldı.'] },
  { id: 2, title: 'Hafta sonu hava yağışlı geçecek', body: ['Meteoroloji, cumartesi günü sağanak yağış beklendiğini duyurdu. Pazar günü hava açacak.'] },
];
const gzHead = '<header class="gz-head">📰 Gazete Oku<small>Güne bir bakışta</small></header>';
const gzAd = (txt, cls = '') => `<div class="gz-ad ad ${cls}" data-ad="1" data-act="adclick"><span class="iz-adtag">Reklam</span><button type="button" class="gz-adx" data-act="adclose" title="Reklamı kapat">✕</button><b>${txt}</b></div>`;

const GZ = {
  name: 'Gazete Oku', secure: true,
  render(path) {
    const g = path.match(/^\/galeri\/(\d+)/);
    if (g) {
      const n = +g[1];
      return page('Ünlülerin şok değişimi', `${gzHead}<div class="gz"><h1>Ünlülerin şok değişimi (${n}/20)</h1><div class="gz-pic">🖼</div><p>Fotoğrafın devamı için sonraki sayfaya geçin…</p>
        <button type="button" class="gz-next" data-act="gallery" data-n="${n + 1}">Sonraki ▶ (${n + 1}/20)</button>
        <p class="gz-small">Bu tür “galeri” sayfaları sizi 20 sayfa dolaştırır, her sayfada yeni reklam gösterir. Haberin kendisini okumak için <a data-href="www.gazete-oku.com.tr">ana sayfaya</a> dönün.</p></div>`, 'gz-wrap');
    }
    const m = path.match(/^\/haber\/(\d+)/);
    if (m) {
      const n = NEWS.find((x) => x.id === +m[1]) || NEWS[0];
      return page(n.title, `${gzHead}<div class="gz"><nav class="gz-nav"><a data-href="www.gazete-oku.com.tr">← Ana sayfa</a></nav><h1>${n.title}</h1><div class="gz-meta">Yerel haber · bugün 09:15</div>
        ${gzAd('Diz ağrısına kesin çözüm! Sadece bugün %70 indirim')}
        <div class="gz-text">${n.body.map((p) => `<p>${p}</p>`).join('')}</div>
        <div class="gz-bait" data-act="adclick" data-ad="1"><span class="iz-adtag">Sponsorlu</span><button type="button" class="gz-big">HABERİN DEVAMI İÇİN TIKLAYIN ▶</button></div>
        <div class="gz-end" data-end="1">Haberin sonu. Okuduğunuz için teşekkürler.</div>
        ${gzAd('Bedava telefon kazandınız! Hemen tıklayın', 'big')}</div>`, 'gz-wrap');
    }
    return page('Gazete Oku', `${gzHead}<div class="gz">${gzAd('Bu fırsatı kaçırmayın: 3 kilo verdiren çay!')}
      <h2>Günün haberleri</h2>${NEWS.map((n) => `<a class="gz-item" data-href="www.gazete-oku.com.tr/haber/${n.id}" data-news="${n.id}"><span>📰</span><b>${n.title}</b></a>`).join('')}
      <a class="gz-item gz-clickbait" data-act="gallery" data-n="1"><span>😱</span><b>ŞOK! Ünlülerin son hâlini görünce inanamayacaksınız (Galeri)</b></a>${gzAd('Dolar yükselmeden önce mutlaka okuyun', 'big')}</div>`, 'gz-wrap');
  },
  act(a, v, ctx, el) {
    if (a === 'adclick') { ctx.emit('gz-ad-click'); ctx.desk.toast('Reklama tıkladınız', 'Gerçekte sizi satıcının sayfasına götürürdü. Habere dönmek için geri (←) düğmesine basın.', '⚠', 5000); return; }
    if (a === 'adclose') { el.closest('.gz-ad')?.remove(); ctx.emit('gz-ad-close'); return; }
    if (a === 'gallery') { ctx.emit('gz-gallery', { n: +el.dataset.n }); ctx.go(`/galeri/${el.dataset.n}`); }
  },
};

export const MEDYA_SITES = { 'www.izleyelim.com': IZ, 'www.gazete-oku.com.tr': GZ };
