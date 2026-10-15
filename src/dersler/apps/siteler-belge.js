// 13. hafta ek sitesi (uydurma): Örnek Belediyesi'nin form sayfası. PDF form indirilir; PDF Okuyucu'da doldurulur, kaydedilir, yazdırılır.
import { esc } from './util.js';

const page = (title, html, cls = '') => ({ title, html: `<div class="wp ${cls}">${html}</div>` });
export const BELEDIYE_HOST = 'www.ornek-belediyesi.bel.tr';

const SU = [
  `<p class="pdf-org">ÖRNEK BELEDİYESİ<br>Su İşleri Müdürlüğü</p><h3>Su Abonelik Başvuru Formu</h3>
    <div class="pdf-form"><p>Adı soyadı: <span class="pdf-blank"></span></p><p>T.C. Kimlik No: <span class="pdf-blank"></span></p><p>Adres: <span class="pdf-blank" style="width:20em"></span></p><p>Telefon: <span class="pdf-blank"></span></p>
    <p>Başvuru ücreti: <b>150 ₺</b> (ödeme belediye veznesine yapılır)</p><p>İmza: <span class="pdf-blank"></span></p></div><p class="pdf-small">Sayfa 1 / 2</p>`,
  `<p class="pdf-org">ÖRNEK BELEDİYESİ<br>Su İşleri Müdürlüğü</p><h3>Başvuruda istenen belgeler</h3>
    <ul><li>Kimlik fotokopisi</li><li>Tapu fotokopisi ya da kira sözleşmesi</li><li>Doldurulmuş ve imzalanmış başvuru formu (1. sayfa)</li></ul>
    <p>Başvurular hafta içi 08.30 – 17.00 arasında, Su İşleri Müdürlüğü gişelerinde alınır.</p><p class="pdf-small">Sayfa 2 / 2: Bu sayfayı teslim etmeniz gerekmez.</p>`,
];
const CEVRE = [`<p class="pdf-org">ÖRNEK BELEDİYESİ<br>Çevre Temizlik Müdürlüğü</p><h3>Çevre Temizlik Talep Formu</h3><div class="pdf-form"><p>Adı soyadı: <span class="pdf-blank"></span></p><p>Mahalle ve sokak: <span class="pdf-blank" style="width:20em"></span></p><p>Talep: <span class="pdf-blank" style="width:20em"></span></p></div>`];

const FORMS = [
  { id: 'su', ad: 'Su abonelik başvuru formu', dosya: 'su abonelik başvuru formu.pdf', info: 'PDF · 2 sayfa · yeni su aboneliği için', pages: SU },
  { id: 'cevre', ad: 'Çevre temizlik talep formu', dosya: 'çevre temizlik talep formu.pdf', info: 'PDF · 1 sayfa · çöp, ilaçlama ve temizlik talepleri', pages: CEVRE },
];

const BELEDIYE = {
  name: 'Örnek Belediyesi', secure: true,
  render(path, q, ctx) {
    const head = `<header class="ed-head bld-head">🏛 Örnek Belediyesi<nav><a data-href="${BELEDIYE_HOST}">Ana sayfa</a><a data-href="${BELEDIYE_HOST}/formlar">Form ve dilekçeler</a></nav></header>`;
    if (path === '/formlar') {
      return page('Form ve dilekçeler - Örnek Belediyesi', `${head}<div class="ed"><h1>Form ve dilekçeler</h1><p>İstediğiniz formu <b>PDF olarak indirip</b> bilgisayarınızda doldurabilir, yazdırıp gişemize getirebilirsiniz.</p>
        ${FORMS.map((f) => `<div class="ed-row bld-form"><div><b>📕 ${esc(f.ad)}</b><small>${esc(f.info)}</small></div><button type="button" class="ed-btn small" data-act="dl" data-id="${f.id}">⬇ PDF indir</button></div>`).join('')}</div>`);
    }
    return page('Örnek Belediyesi', `${head}<div class="ed"><h1>Örnek Belediyesi</h1><p>Hizmetlerimiz, duyurularımız ve başvuru formlarımız bu sayfada.</p>
      <div class="ed-grid"><a class="ed-card" data-href="${BELEDIYE_HOST}/formlar">📄 Form ve dilekçeler<small>Su aboneliği, çevre temizlik ve diğer formlar</small></a></div></div>`);
  },
  act(a, v, ctx, el) {
    if (a !== 'dl') return;
    const f = FORMS.find((x) => x.id === el.dataset.id);
    ctx.download(f.dosya, { pages: f.pages });
    ctx.emit('form-indir', { name: f.dosya });
  },
};

export const BELGE_SITES = { [BELEDIYE_HOST]: BELEDIYE };
