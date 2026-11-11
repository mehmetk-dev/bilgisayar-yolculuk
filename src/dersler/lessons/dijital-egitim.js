import { desktopReady, maxed } from './common.js';
import { MEB_KURS, SEARCH_HOST } from '../apps/sites.js';

const ARAMA_URL = `${SEARCH_HOST}/search?q=kurs`;
const KURS_URL = `${MEB_KURS.host}${MEB_KURS.path}`;
const tarayiciUrl = (c) => c.d.find('browser')?.api.url;
const aramaAcik = (c) => tarayiciUrl(c)?.toLocaleLowerCase('tr') === ARAMA_URL;
const kursAcik = (c) => tarayiciUrl(c) === KURS_URL;
const mebAcik = (c) => tarayiciUrl(c) === MEB_KURS.host || kursAcik(c);

function sayfayiHazirla(c, url) {
  desktopReady(c);
  const w = maxed(c, 'browser', { url });
  if (w.api.url !== url) w.api.go(url, 'link');
}

function materyalDosyasi(c) {
  const n = c.d.fs.find('downloads', MEB_KURS.file);
  return n?.type === 'file' && n.content?.html === MEB_KURS.content.html ? n : null;
}

const dogruDosya = (c, id) => !!id && id === materyalDosyasi(c)?.id;

// Yenilenen derste sanal İndirilenler klasörü de baştan kurulur.
const materyaliHazirla = (c) => materyalDosyasi(c) || c.d.fs.write('downloads', MEB_KURS.file, MEB_KURS.content);
const kursOnde = (c) => c.d.active?.app === 'browser' && c.d.active.api.url === KURS_URL;

export const dijitalEgitim = {
  id: 'dijital-egitim', icon: '🎓', title: 'İnternetten öğrenin', minutes: 12, stage: 'desktop',
  desc: 'Bir bilgisayar kursu duyurusu bulun, örnek ders notunu indirip açın ve duyuruya dönün.',
  summary: [
    ['Kursu bulma', 'Aramada konuya ve sonucun site adresine bakın.'],
    ['PDF indirme', 'Materyali duyuru sayfasından indirin. Dosyanın adını okuyun.'],
    ['İndirilenler', 'Dosya Gezgini’nde İndirilenler klasörünü açıp dosyaya çift tıklayın.'],
    ['Duyuruya dönme', 'PDF Okuyucu’yu kapatın veya görev çubuğundan İnternet’e dönün.'],
  ],
  steps: [
    {
      title: 'Kurs arayın',
      html: '<p>Bir bilgisayar kursu ve başlangıç notu bulacağız. Alıştırma tarayıcısında Google arama kutusuna <b>kurs</b> yazıp <b>Enter</b> tuşuna basın.</p>',
      hint: 'Google sayfasının ortasındaki arama kutusunu kullanın.',
      setup: (c) => { if (!aramaAcik(c)) sayfayiHazirla(c, SEARCH_HOST); },
      check: aramaAcik,
      on: (ev, c) => ev.type === 'web-search' && aramaAcik(c),
      done: 'Kursla ilgili sonuçlar geldi. Şimdi başlıkları ve adresleri okuyun.',
    },
    {
      title: 'Millî Eğitim Bakanlığı sonucunu açın',
      html: `<p>Sonuçlarda <b>Millî Eğitim Bakanlığı</b> başlığını bulun. Adresi <b>${MEB_KURS.host}</b> olan sonuca tıklayın.</p>`,
      hint: 'Başlığa tıklamadan önce sonuçta görünen site adresini okuyun.',
      setup: (c) => { if (!mebAcik(c)) sayfayiHazirla(c, ARAMA_URL); },
      check: mebAcik,
      on: (ev, c) => ev.type === 'web-nav' && ev.host === MEB_KURS.host && ev.path === '/' && mebAcik(c),
      done: 'Bakanlığın alıştırma sayfası açıldı.',
    },
    {
      title: 'Bilgisayar kursu duyurusunu açın',
      html: '<p><b>Duyurular</b> altında <b>Bilgisayar İşletmenliği kurs duyurusu</b> bağlantısına tıklayın.</p>',
      setup: (c) => { if (!kursAcik(c)) sayfayiHazirla(c, MEB_KURS.host); },
      check: kursAcik,
      on: (ev, c) => ev.type === 'web-nav' && ev.host === MEB_KURS.host && ev.path === MEB_KURS.path && kursAcik(c),
      done: 'Duyuru açıldı. İlk dersin konusu ve başlangıç notu bu sayfada.',
    },
    {
      title: 'Başlangıç notunu indirin',
      html: '<p>Duyurudaki <b>Başlangıç notunu indir (PDF)</b> düğmesine tıklayın.</p>',
      setup: (c) => sayfayiHazirla(c, KURS_URL),
      check: (c) => !!materyalDosyasi(c),
      on: (ev, c) => ev.type === 'download' && ev.name === MEB_KURS.file && dogruDosya(c, ev.id) && kursAcik(c),
      done: 'Başlangıç notu İndirilenler klasörüne kaydedildi.',
    },
    {
      title: 'İndirilenler’den PDF’yi açın',
      html: `<p>Dosya Gezgini'nde <b>İndirilenler</b> klasörünü açın. <b>${MEB_KURS.file}</b> dosyasını bulup çift tıklayın.</p>`,
      hint: 'Tarayıcıdaki indirme kutusu açıksa dosyanın yanındaki Klasörde göster düğmesi sizi İndirilenler’e götürür.',
      setup: (c) => {
        if (!materyalDosyasi(c)) {
          materyaliHazirla(c);
          c.d.open('explorer', { folder: 'downloads' });
        }
      },
      on: (ev, c) => ev.type === 'ex-open' && ev.app === 'explorer'
        && c.d.find('explorer')?.api.folder === 'downloads' && dogruDosya(c, ev.id),
      done: 'Doğru PDF açıldı. Başlığını ve ilk derste yapacağınız üç işi okuyun.',
    },
    {
      title: 'Duyuruya geri dönün',
      html: '<p>Başlangıç notunu okuduktan sonra <b>PDF Okuyucu</b> penceresini kapatın. Duyuru görünmüyorsa görev çubuğundaki <b>İnternet</b> simgesine tıklayın.</p>',
      hint: `Tarayıcıda <b>Geri</b> düğmesini kullanın. Duyuruya ulaşamazsanız adres çubuğuna <b>${KURS_URL}</b> yazıp Enter'a basın.`,
      setup: (c) => {
        if (!c.d.find('browser')) {
          sayfayiHazirla(c, KURS_URL);
          c.d.openNode(materyaliHazirla(c));
        }
        c.s.hazir = true;
      },
      check: kursOnde,
      on: (_ev, c) => c.s.hazir && kursOnde(c),
      done: 'Kurs duyurusuna döndünüz. PDF, İndirilenler klasöründe duruyor.',
    },
    {
      final: true,
      title: 'Ders notunu buldunuz',
      html: '<p>Bir kurs duyurusu buldunuz, örnek ders notunu açtınız ve duyuruya geri döndünüz.</p>',
    },
  ],
};
