// Benzetim bilgisayardaki programların listesi
import { Notepad } from '../notepad.js';
import { calc } from './calc.js';
import { explorer } from './explorer.js';
import { paint } from './paint.js';
import { settings } from './settings.js';
import { browser } from './browser.js';
import { setup } from './setup.js';
import { photos, viewer, pdf, music } from './media.js';
import { devmgr } from './devmgr.js';
import { snip } from './snip.js';
import { taskmgr } from './taskmgr.js';
import { osk, magnifier } from './araclar.js';
import { bulut } from './bulut.js';
import { store, takvim, hava } from './store.js';
import { mail } from './mail.js';
import { guvenlik } from './guvenlik.js';
import { denetim } from './denetim.js';
import { notlar, kayit, saat } from './donatilar.js';
import { word } from './word.js';
import { sheet } from './sheet.js';
import { slides } from './slides.js';
import { hedef, mayin, kartlar } from './games.js';
import { esc } from './util.js';
import { APP_ICONS } from './appicons.js';

function notepad({ desk, win, body, args, setTitle }) {
  const np = new Notepad(body, (ev) => {
    if (ev.type === 'print') desk.toast('Yazdırılıyor', `“${esc(ev.doc)}” → ${esc(ev.printer)}`, '🖨');
    desk.emit(ev.type, { ...ev, win: win.id });
  }, {
    fs: desk.fs.dialogApi(), dialogs: desk.dialogs, embedded: true, onTitle: setTitle,
    printers: () => desk.settings.printers, onExit: () => desk.close(win),
  });
  const n = args.node && desk.fs.get(args.node);
  if (n) np.setText(typeof n.content === 'string' ? n.content : '', n.name, n.parent);
  else if (args.text) np.setText(args.text);
  return {
    np,
    confirmClose: () => np.confirmDiscard(),
    focus: () => { if (!desk.dialogs.busy) np.focus(); },
  };
}

// w, h: masaüstüne göre pencere boyutu (oran). single: tek pencere açılır. hidden: aramada çıkmaz.
export const APPS = {
  notepad: { name: 'Not Defteri', icon: APP_ICONS.notepad, w: 0.62, h: 0.7, keywords: ['not', 'metin', 'yazı'], create: notepad },
  calc: { name: 'Hesap Makinesi', icon: APP_ICONS.calc, w: 0.34, h: 0.8, keywords: ['hesap', 'toplama', 'calculator'], create: calc },
  explorer: { name: 'Dosya Gezgini', icon: APP_ICONS.explorer, w: 0.8, h: 0.8, keywords: ['dosya', 'klasör', 'gezgin', 'belgeler'], create: explorer },
  paint: { name: 'Paint', icon: APP_ICONS.paint, w: 0.9, h: 0.9, keywords: ['resim', 'çizim', 'boya'], create: paint },
  settings: { name: 'Ayarlar', icon: APP_ICONS.settings, w: 0.86, h: 0.88, single: true, keywords: ['ayar', 'arka plan', 'wifi', 'wi-fi', 'ses', 'yazıcı', 'saat', 'ekran'], create: settings },
  word: { name: 'Kelime İşlemci', icon: APP_ICONS.word, w: 0.9, h: 0.92, keywords: ['word', 'kelime', 'belge', 'yazı', 'dilekçe', 'mektup'], create: word },
  sheet: { name: 'Hesap Tablosu', icon: APP_ICONS.sheet, w: 0.9, h: 0.92, keywords: ['excel', 'hesap', 'tablo', 'bütçe', 'çizelge'], create: sheet },
  slides: { name: 'Sunu', icon: APP_ICONS.slides, w: 0.92, h: 0.92, keywords: ['powerpoint', 'sunu', 'slayt', 'sunum'], create: slides },
  mail: { name: 'E-posta', icon: APP_ICONS.mail, w: 0.86, h: 0.86, single: true, keywords: ['posta', 'e-posta', 'eposta', 'mail', 'mektup'], create: mail },
  browser: { name: 'İnternet', icon: APP_ICONS.browser, w: 0.9, h: 0.9, keywords: ['tarayıcı', 'internet', 'edge', 'chrome', 'web'], create: browser },
  photos: { name: 'Fotoğraflar', icon: APP_ICONS.photos, w: 0.66, h: 0.78, keywords: ['fotoğraf', 'resim'], create: photos },
  viewer: { name: 'Resim Gösterici', icon: APP_ICONS.viewer, w: 0.66, h: 0.78, installable: true, keywords: ['resim', 'gösterici'], create: viewer },
  pdf: { name: 'PDF Okuyucu', icon: APP_ICONS.pdf, w: 0.55, h: 0.8, hidden: true, create: pdf },
  music: { name: 'Müzik Çalar', icon: APP_ICONS.music, w: 0.4, h: 0.55, keywords: ['müzik', 'şarkı'], create: music },
  setup: { name: 'Kurulum', icon: APP_ICONS.setup, w: 0.64, h: 0.7, hidden: true, create: setup },
  devmgr: { name: 'Aygıt Yöneticisi', icon: APP_ICONS.devmgr, w: 0.6, h: 0.8, keywords: ['aygıt', 'sürücü', 'donanım'], create: devmgr },
  taskmgr: { name: 'Görev Yöneticisi', icon: APP_ICONS.taskmgr, w: 0.96, h: 0.82, single: true, keywords: ['görev', 'yönetici', 'işlem', 'donma', 'yanıt', 'performans', 'başlangıç'], create: taskmgr },
  store: { name: 'Mağaza', icon: APP_ICONS.store, w: 0.88, h: 0.88, single: true, keywords: ['mağaza', 'store', 'uygulama', 'indir', 'yükle', 'tema'], create: store },
  bulut: { name: 'Bulut Depo', icon: APP_ICONS.bulut, w: 0.8, h: 0.82, single: true, keywords: ['bulut', 'depo', 'drive', 'onedrive', 'yedek', 'paylaş', 'yükle'], create: bulut },
  takvim: { name: 'Takvim', icon: APP_ICONS.takvim, w: 0.6, h: 0.97, installable: true, keywords: ['takvim', 'tarih', 'gün', 'ay'], create: takvim },
  hava: { name: 'Hava Durumu', icon: APP_ICONS.hava, w: 0.55, h: 0.7, installable: true, keywords: ['hava', 'yağmur', 'sıcaklık'], create: hava },
  osk: { name: 'Ekran Klavyesi', icon: APP_ICONS.osk, w: 0.7, h: 0.42, single: true, top: true, noFocus: true, keywords: ['klavye', 'ekran klavyesi', 'erişilebilirlik'], create: osk },
  magnifier: { name: 'Büyüteç', icon: APP_ICONS.magnifier, keywords: ['büyüteç', 'büyüt', 'yakınlaştır', 'erişilebilirlik', 'görme'], launch: magnifier },
  snip: { name: 'Ekran Alıntısı', icon: APP_ICONS.snip, w: 0.48, h: 0.55, single: true, keywords: ['ekran', 'alıntı', 'görüntü', 'snip'], create: snip },
  notlar: { name: 'Yapışkan Notlar', icon: APP_ICONS.notlar, w: 0.6, h: 0.7, single: true, keywords: ['not', 'yapışkan', 'hatırlatma', 'sticky'], create: notlar },
  kayit: { name: 'Ses Kaydedici', icon: APP_ICONS.kayit, w: 0.45, h: 0.7, single: true, keywords: ['ses', 'kayıt', 'mikrofon'], create: kayit },
  saat: { name: 'Saat', icon: APP_ICONS.saat, w: 0.5, h: 0.65, single: true, keywords: ['saat', 'alarm', 'zamanlayıcı', 'hatırlatıcı'], create: saat },
  guvenlik: { name: 'Windows Güvenliği', icon: APP_ICONS.guvenlik, w: 0.72, h: 0.78, single: true, keywords: ['güvenlik', 'virüs', 'antivirüs', 'tarama', 'duvar', 'disk', 'temizleme', 'temizle'], create: guvenlik },
  denetim: { name: 'Denetim Masası', icon: APP_ICONS.denetim, w: 0.78, h: 0.8, single: true, keywords: ['denetim', 'control', 'panel', 'program kaldır', 'programlar ve özellikler', 'güç seçenekleri', 'sistem', 'ayar'], create: denetim },
  hedef: { name: 'Hedef Oyunu', icon: APP_ICONS.hedef, w: 0.84, h: 0.88, keywords: ['oyun', 'fare'], create: hedef },
  mayin: { name: 'Mayın Tarlası', icon: APP_ICONS.mayin, w: 0.46, h: 0.86, keywords: ['oyun', 'mayın'], create: mayin },
  kartlar: { name: 'Kart Dizme', icon: APP_ICONS.kartlar, w: 0.8, h: 0.8, keywords: ['oyun', 'kart', 'solitaire'], create: kartlar },
};

export const START_APPS = ['notepad', 'calc', 'paint', 'explorer', 'settings', 'browser', 'mail', 'word', 'sheet', 'slides', 'store', 'bulut', 'taskmgr', 'snip', 'photos', 'music', 'mayin', 'hedef', 'kartlar', 'viewer', 'takvim', 'hava', 'notlar', 'kayit', 'saat', 'guvenlik', 'osk'];
