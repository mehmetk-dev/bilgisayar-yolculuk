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
import { hedef, mayin, kartlar } from './games.js';
import { esc } from './util.js';

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
  notepad: { name: 'Not Defteri', icon: '📝', w: 0.62, h: 0.7, keywords: ['not', 'metin', 'yazı'], create: notepad },
  calc: { name: 'Hesap Makinesi', icon: '🧮', w: 0.34, h: 0.8, keywords: ['hesap', 'toplama', 'calculator'], create: calc },
  explorer: { name: 'Dosya Gezgini', icon: '📁', w: 0.8, h: 0.8, keywords: ['dosya', 'klasör', 'gezgin', 'belgeler'], create: explorer },
  paint: { name: 'Paint', icon: '🎨', w: 0.9, h: 0.9, keywords: ['resim', 'çizim', 'boya'], create: paint },
  settings: { name: 'Ayarlar', icon: '⚙', w: 0.86, h: 0.88, single: true, keywords: ['ayar', 'arka plan', 'wifi', 'wi-fi', 'ses', 'yazıcı', 'saat', 'ekran'], create: settings },
  browser: { name: 'İnternet', icon: '🌐', w: 0.9, h: 0.9, keywords: ['tarayıcı', 'internet', 'edge', 'chrome', 'web'], create: browser },
  photos: { name: 'Fotoğraflar', icon: '🖼', w: 0.66, h: 0.78, keywords: ['fotoğraf', 'resim'], create: photos },
  viewer: { name: 'Resim Gösterici', icon: '🌄', w: 0.66, h: 0.78, installable: true, keywords: ['resim', 'gösterici'], create: viewer },
  pdf: { name: 'PDF Okuyucu', icon: '📕', w: 0.55, h: 0.8, hidden: true, create: pdf },
  music: { name: 'Müzik Çalar', icon: '🎵', w: 0.4, h: 0.55, keywords: ['müzik', 'şarkı'], create: music },
  setup: { name: 'Kurulum', icon: '💿', w: 0.64, h: 0.7, hidden: true, create: setup },
  devmgr: { name: 'Aygıt Yöneticisi', icon: '🖥', w: 0.6, h: 0.8, keywords: ['aygıt', 'sürücü', 'donanım'], create: devmgr },
  snip: { name: 'Ekran Alıntısı', icon: '✂', w: 0.48, h: 0.55, single: true, keywords: ['ekran', 'alıntı', 'görüntü', 'snip'], create: snip },
  hedef: { name: 'Hedef Oyunu', icon: '🎯', w: 0.84, h: 0.88, keywords: ['oyun', 'fare'], create: hedef },
  mayin: { name: 'Mayın Tarlası', icon: '💣', w: 0.46, h: 0.86, keywords: ['oyun', 'mayın'], create: mayin },
  kartlar: { name: 'Kart Dizme', icon: '🃏', w: 0.8, h: 0.8, keywords: ['oyun', 'kart', 'solitaire'], create: kartlar },
};

export const START_APPS = ['notepad', 'calc', 'paint', 'explorer', 'settings', 'browser', 'snip', 'photos', 'music', 'mayin', 'hedef', 'kartlar', 'viewer'];
