// Google (www.google.com): arama motoru. Ana sayfa, sonuç sayfası (Tümü, Görseller, Haberler, Videolar), "Sponsorlu" reklam sonucu.
// Hepsi uydurma ve hazır sonuçludur; internete bağlanılmaz. Sonuç verileri sites.js'den gelir (döngüsel içe aktarma olmasın diye parametreyle).
import { esc } from './util.js';
import { ic, icMic, icLens, icApps, gLogo, favicon } from './google-ui.js';
import { VIDEOS } from './siteler-medya.js';

const escAttr = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const page = (title, html) => ({ title, html: `<div class="wp gg">${html}</div>` });
const soon = (cls, label, inner) => `<a class="${cls}" data-soon="1" title="${label}">${inner}</a>`;

// Sonuç sayfası: aranan kelimeye göre "yaklaşık N sonuç (0,42 saniye)"
const count = (n, q) => `Yaklaşık ${(n * 1240000).toLocaleString('tr-TR')} sonuç bulundu (0,${String(28 + (q.length * 7) % 60).padStart(2, '0')} saniye)`;
const siteLabel = (url, SITES) => {
  const host = url.split('/')[0];
  const name = (SITES[host]?.name || '').replace(/\s*\(sahte\)/i, '') || host.replace(/^www\./, '').split('.')[0].replace(/-/g, ' ');
  return name.charAt(0).toLocaleUpperCase('tr') + name.slice(1);
};
// "www.site.com/yol/alt" -> "https://www.site.com › yol › alt"
const crumb = (url) => { const [h, ...r] = url.split('/'); return 'https://' + h + r.filter(Boolean).map((p) => ' › ' + p).join(''); };

// Arama kutusu: büyüteç, yazı, (sonuç sayfasında temizle), mikrofon, Lens. extra: kutunun altındaki düğmeler (aynı formun içinde)
export const searchBox = (q, big, extra = '', ph = '') => `<form class="gg-frm" data-search><div class="gg-box ${big ? 'big' : 'sm'}"><span class="gg-bi">${ic('search', 20)}</span><input name="q" value="${escAttr(q)}" placeholder="${escAttr(ph)}" autocomplete="off" spellcheck="false" aria-label="Ara">
  ${big ? '' : `<button type="button" class="gg-ib clr" data-clearq="1" title="Temizle" ${q ? '' : 'hidden'}>${ic('close', 20)}</button><i class="gg-sep"></i>`}<span class="gg-ib" title="Sesle arama">${icMic(22)}</span><span class="gg-ib" title="Resimle arama">${icLens(22)}</span>${big ? '' : `<button class="gg-go" title="Google Arama">${ic('search', 22)}</button>`}</div>${extra}</form>`;


const box = searchBox;
export function googleSite({ SEARCH_HOST, RESULTS, AD, AD_DEVLET, PHOTOS, sorunSonuc, getSites, HARITA_HOST, GUN_HOST }) {
  const words = (q) => q.toLocaleLowerCase('tr').split(/\s+/).filter(Boolean);
  // Aramanın sonuçları ve (varsa) üstteki reklam
  function search(q) {
    const w = words(q), sk = sorunSonuc(q);
    const hits = sk ? sk.hits : RESULTS.map((r) => ({ r, score: w.filter((x) => r.keys.some((k) => k.includes(x) || x.includes(k))).length })).filter((x) => x.score).sort((a, b) => b.score - a.score).map((x) => x.r);
    const devlet = w.some((x) => x.includes('devlet'));
    const showAd = sk || devlet || w.some((x) => ['indir', 'program', 'yavaş', 'hızlandır', 'resim'].some((k) => x.includes(k)));
    const ad = showAd ? (sk ? sk.ad : devlet ? AD_DEVLET : AD) : null;
    return { hits, ad };
  }

  const avatar = (ctx) => `<span class="gg-av" title="Google Hesabı">${esc((ctx.desk.settings.user || 'K').charAt(0).toLocaleUpperCase('tr'))}</span>`;
  const topLinks = (ctx) => `<nav class="gg-top">${soon('gg-tl', 'Gmail', 'Gmail')}${soon('gg-tl', 'Görseller', 'Görseller')}${soon('gg-ib', 'Google uygulamaları', icApps(22))}${avatar(ctx)}</nav>`;

  const TABS = [['all', 'Tümü'], ['img', 'Görseller'], ['news', 'Haberler'], ['vid', 'Videolar'], ['map', 'Haritalar']];
  const header = (q, ctx, tab) => `<header class="gg-rh"><a class="gg-home" data-href="${SEARCH_HOST}" title="Google">${gLogo('sm')}</a>${box(q, false)}<span class="gg-rr">${soon('gg-ib', 'Ayarlar', ic('gear', 22))}${soon('gg-ib', 'Google uygulamaları', icApps(22))}${avatar(ctx)}</span></header>
    <nav class="gg-tabs">${TABS.map(([k, l]) => `<button type="button" data-act="tab" data-v="${k}" class="${tab === k ? 'on' : ''}">${l}</button>`).join('')}${soon('gg-tabmore', 'Diğer', `Diğer ${ic('down', 18)}`)}<span class="gg-tabsp"></span>${soon('gg-tabtools', 'Araçlar', 'Araçlar')}</nav>`;

  const row = (r, SITES, ad) => `<div class="gg-r${ad ? ' ad' : ''}">${ad ? '<div class="gg-sp"><b>Sponsorlu</b></div>' : ''}<div class="gg-rs">${favicon(siteLabel(r.url, SITES), r.url.split('/')[0])}<div class="gg-rn"><span class="gg-sn">${esc(siteLabel(r.url, SITES))}</span><cite class="gg-cite">${esc(crumb(r.url))}</cite></div></div>
    <a class="gg-rt" data-href="${r.url}"${ad ? ' data-ad="1"' : ''}>${r.title}</a><p class="gg-rd">${r.snip}</p></div>`;

  const imgs = (q) => {
    const w = words(q), all = Object.values(PHOTOS), pick = all.filter((p) => w.some((x) => (p.title + ' ' + p.name).toLocaleLowerCase('tr').includes(x)));
    const list = pick.length ? pick : all;
    return `<p class="gg-note">${pick.length ? '' : 'Tam eşleşme yok, benzer görseller gösteriliyor. '}“${esc(q)}” için görseller</p><div class="gg-imgs">${list.map((p) => `<figure><span style="background:linear-gradient(135deg,${p.bg[0]},${p.bg[1]})">${p.emoji}</span><figcaption><b>${esc(p.title)}</b><small>ucretsiz-fotograflar.com.tr</small></figcaption></figure>`).join('')}</div>
      <p class="gg-warn">Görsellerin çoğunun <b>telif hakkı</b> vardır: izinsiz kullanmayın; serbest kullanım yazan sitelerden alın.</p>`;
  };
  const NEWS = [['Belediyeden yaşlılara ücretsiz bilgisayar kursu', 'Kurslar her hafta salı ve perşembe günleri yapılacak; katılımcılara sertifika verilecek.', '2 saat önce'], ['Kış lastiği uygulaması yarın başlıyor', 'Sürücülerin kış lastiği takması için son gün yaklaşıyor.', '5 saat önce'], ['Dolandırıcılara karşı uyarı: kodunuzu kimseyle paylaşmayın', 'Bankalar, telefonla şifre ya da doğrulama kodu istenmesinin dolandırıcılık olduğunu hatırlattı.', 'Dün']];
  const news = (q) => `<p class="gg-note">“${esc(q)}” için son haberler</p>${NEWS.map(([t, s, m], i) => `<div class="gg-r gg-news"><div class="gg-rs">${favicon('Günün Haberleri', 'gunun')}<div class="gg-rn"><span class="gg-sn">Günün Haberleri</span><cite class="gg-cite">${m}</cite></div></div><a class="gg-rt" data-href="${GUN_HOST}/haber/${i}">${t}</a><p class="gg-rd">${s}</p></div>`).join('')}
    <p class="gg-warn">Haberler tarihe göre sıralanır; yine de haberin asıl kaynağına ve tarihine bakın.</p>`;
  const vids = (q) => {
    const w = words(q), pick = VIDEOS.filter((v) => w.some((x) => v.keys.some((k) => k.includes(x) || x.includes(k)) || v.title.toLocaleLowerCase('tr').includes(x)));
    const list = pick.length ? pick : VIDEOS;
    return `<p class="gg-note">“${esc(q)}” için videolar${pick.length ? '' : ' (tam eşleşme yok, benzerleri gösteriliyor)'}</p>${list.map((v) => `<div class="gg-vid"><a class="gg-vth" data-href="www.izleyelim.com/izle/${v.id}"><span>${v.emoji}</span><i>${ic('play', 22)}</i></a><div><a class="gg-rt" data-href="www.izleyelim.com/izle/${v.id}">${esc(v.title)}</a><p class="gg-rd">${esc(v.by)} · ${v.views} izlenme</p><cite class="gg-cite">İzleyelim › www.izleyelim.com</cite></div></div>`).join('')}`;
  };

  return {
    name: 'Google', secure: true,
    act(a, v, ctx, el) {
      if (a === 'tab') {
        const k = el.dataset.v;
        ctx.emit('search-tab', { tab: k });
        if (k === 'map') { ctx.visit(HARITA_HOST); return; }
        ctx.state.tab = k;
        ctx.state.tabQ = ctx.loc.q;
        ctx.refresh();
      } else if (a === 'lucky') {
        // Kendimi Şanslı Hissediyorum: ilk sonuca doğrudan gider
        const q = (v.q || '').trim();
        const first = q && search(q).hits[0];
        if (!first) { ctx.desk.toast('Kendimi Şanslı Hissediyorum', 'Önce kutuya aradığınız şeyi yazın. Bu düğme sizi ilk sonuca doğrudan götürür.', 'ⓘ', 5000); return; }
        ctx.emit('search-lucky', { q });
        const i = first.url.indexOf('/');
        ctx.visit(i < 0 ? first.url : first.url.slice(0, i), i < 0 ? '/' : first.url.slice(i));
      }
    },
    render(path, q, ctx) {
      const SITES = getSites();
      if (path.startsWith('/search')) {
        const tab = ctx && ctx.state.tabQ === q ? ctx.state.tab || 'all' : 'all';
        const head = header(q, ctx, tab);
        if (tab === 'img') return page(`${q} - Google Görseller`, `${head}<main class="gg-body wide">${imgs(q)}</main>`);
        if (tab === 'news') return page(`${q} - Google Haberler`, `${head}<main class="gg-body">${news(q)}</main>`);
        if (tab === 'vid') return page(`${q} - Google Video`, `${head}<main class="gg-body">${vids(q)}</main>`);
        const { hits, ad } = search(q);
        const empty = `<p class="gg-none">Aramanız - <b>${esc(q)}</b> - hiçbir belgeyle eşleşmedi.</p><p>Öneriler:</p><ul><li>Tüm sözcüklerin doğru yazıldığından emin olun.</li><li>Farklı anahtar sözcükler deneyin.</li><li>Daha genel anahtar sözcükler deneyin.</li></ul>`;
        return page(`${q} - Google Arama`, `${head}<main class="gg-body">${hits.length ? `<p class="gg-count">${count(hits.length, q)}</p>` : ''}${ad ? row(ad, SITES, true) : ''}${hits.map((r) => row(r, SITES)).join('') || empty}</main>`);
      }
      return page('Google', `<div class="gg-homepg">${topLinks(ctx)}<main class="gg-center">${gLogo('xl')}${box('', true, `<div class="gg-btns"><button type="submit" class="gg-btn">Google'da Ara</button><button type="button" class="gg-btn" data-act="lucky">Kendimi Şanslı Hissediyorum</button></div>`)}
        <p class="gg-lang">Google.com.tr şu dilde de kullanılabilir: ${soon('gg-lnk', 'English', 'English')}</p>
        <p class="gg-tip">Deneyin: <a data-q="börek tarifi">börek tarifi</a> · <a data-q="hava durumu">hava durumu</a> · <a data-q="haberler">haberler</a></p></main>
        <footer class="gg-ft"><div class="gg-ft1">Türkiye</div><div class="gg-ft2"><span>${soon('gg-lnk', 'Hakkında', 'Hakkında')}${soon('gg-lnk', 'Reklam', 'Reklam')}${soon('gg-lnk', 'İşletme', 'İşletme')}${soon('gg-lnk', 'Arama nasıl çalışır?', 'Arama nasıl çalışır?')}</span><span>${soon('gg-lnk', 'Gizlilik', 'Gizlilik')}${soon('gg-lnk', 'Şartlar', 'Şartlar')}${soon('gg-lnk', 'Ayarlar', 'Ayarlar')}</span></div></footer></div>`);
    },
  };
}
