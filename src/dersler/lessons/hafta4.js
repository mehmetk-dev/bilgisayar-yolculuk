// 4. hafta: donanım ve yazılım (3B uygulamaya ek olarak ayırma oyunları)
import { sorter } from './scenes.js';

const intro = (html) => (el) => { el.className = 'sc sc-info'; el.innerHTML = html; };

export const donanim = {
  id: 'donanim', icon: '🧩', title: 'Donanım mı, yazılım mı?', minutes: 15, stage: 'scene',
  desc: 'Ayırma oyunları: donanım ve yazılım, giriş ve çıkış birimleri, depolama ve USB bellek.',
  summary: [
    ['Donanım', 'Elle tutulan parçalar: klavye, fare, ekran, kasa, yazıcı'],
    ['Yazılım', 'Programlar: Windows, Not Defteri, Paint, internet tarayıcısı'],
    ['Giriş birimi', 'Bilgisayara bilgi verir: klavye, fare, mikrofon, kamera'],
    ['Çıkış birimi', 'Bilgisayardan bilgi alır: ekran, hoparlör, yazıcı'],
    ['Depolama', 'Dosyaların kalıcı durduğu yer: disk (HDD/SSD), USB bellek'],
    ['RAM (bellek)', 'Çalışma masası: bilgisayar kapanınca boşalır'],
  ],
  steps: [
    {
      title: 'Donanım ve yazılım',
      html: `<ul class="big-list"><li><b>Donanım</b>: elle tutabildiğimiz parçalar. Klavye, fare, ekran, kasa…</li><li><b>Yazılım</b>: bilgisayarın içindeki programlar. Elle tutulmaz. Windows, Not Defteri, Paint…</li></ul>
        <p>Benzetme: donanım <b>bir radyo</b>, yazılım radyodan çıkan <b>şarkı</b> gibidir.</p>`,
      scene: intro('<div class="sc-big">🖱⌨🖥 <span>+</span> 📝🎨🌐</div><p>Donanım + yazılım = çalışan bilgisayar</p>'),
    },
    {
      title: 'Ayırın: donanım mı, yazılım mı?',
      html: '<p>Yandaki kartları tutup doğru kutuya sürükleyin.</p>',
      mouse: '🖱 Kartı kutuya sürükleyin',
      scene: sorter({
        bins: [{ id: 'hw', label: 'Donanım', icon: '🔧' }, { id: 'sw', label: 'Yazılım', icon: '💿' }],
        items: [
          { label: 'Klavye', icon: '⌨', bin: 'hw', why: 'Elle tutulur, donanımdır.' },
          { label: 'Fare', icon: '🖱', bin: 'hw', why: 'Elle tutulur, donanımdır.' },
          { label: 'Ekran', icon: '🖥', bin: 'hw', why: 'Elle tutulur, donanımdır.' },
          { label: 'Yazıcı', icon: '🖨', bin: 'hw', why: 'Elle tutulur, donanımdır.' },
          { label: 'USB bellek', icon: '💾', bin: 'hw', why: 'Elle tutulur, donanımdır (içindeki dosyalar ise yazılım/veridir).' },
          { label: 'Windows', icon: '🪟', bin: 'sw', why: 'Bilgisayarı çalıştıran ana programdır: işletim sistemi.' },
          { label: 'Not Defteri', icon: '📝', bin: 'sw', why: 'Bir programdır, yazılımdır.' },
          { label: 'Paint', icon: '🎨', bin: 'sw', why: 'Bir programdır, yazılımdır.' },
          { label: 'İnternet tarayıcısı', icon: '🌐', bin: 'sw', why: 'İnternete girmeye yarayan programdır.' },
        ],
      }),
      on: (ev) => ev.type === 'sort-done',
      done: 'Hepsini doğru ayırdınız!',
    },
    {
      title: 'Giriş ve çıkış birimleri',
      html: `<ul class="big-list"><li><b>Giriş</b>: bilgisayara bilgi <b>veren</b> parçalar. Klavyeyle yazı veririz, mikrofona konuşuruz.</li><li><b>Çıkış</b>: bilgisayardan bilgi <b>alan</b> parçalar. Ekranda görürüz, hoparlörden duyarız.</li></ul>`,
      scene: intro('<div class="sc-big">⌨🎤 ➜ 🗄 ➜ 🖥🔊</div><p>Giriş ➜ bilgisayar ➜ çıkış</p>'),
    },
    {
      title: 'Ayırın: giriş mi, çıkış mı?',
      html: '<p>Kartları doğru kutuya sürükleyin.</p>',
      mouse: '🖱 Kartı kutuya sürükleyin',
      scene: sorter({
        bins: [{ id: 'in', label: 'Giriş (bilgi verir)', icon: '➡' }, { id: 'out', label: 'Çıkış (bilgi alır)', icon: '⬅' }],
        items: [
          { label: 'Klavye', icon: '⌨', bin: 'in', why: 'Yazdıklarımızı bilgisayara verir.' },
          { label: 'Fare', icon: '🖱', bin: 'in', why: 'Hareketlerimizi bilgisayara verir.' },
          { label: 'Mikrofon', icon: '🎤', bin: 'in', why: 'Sesimizi bilgisayara verir.' },
          { label: 'Kamera', icon: '📷', bin: 'in', why: 'Görüntümüzü bilgisayara verir.' },
          { label: 'Tarayıcı (scanner)', icon: '📠', bin: 'in', why: 'Kâğıttaki belgeyi bilgisayara verir.' },
          { label: 'Ekran', icon: '🖥', bin: 'out', why: 'Bilgisayarın gösterdiğini bize iletir.' },
          { label: 'Hoparlör', icon: '🔊', bin: 'out', why: 'Bilgisayarın sesini bize iletir.' },
          { label: 'Yazıcı', icon: '🖨', bin: 'out', why: 'Bilgisayardaki belgeyi kâğıda çıkarır.' },
          { label: 'Kulaklık', icon: '🎧', bin: 'out', why: 'Sesi bize iletir.' },
        ],
      }),
      on: (ev) => ev.type === 'sort-done',
      done: 'Dokunmatik ekran ise hem giriştir hem çıkış!',
    },
    {
      title: 'Depolama: dosyalar nerede durur?',
      html: `<ul class="big-list"><li><b>Disk</b> (HDD ya da SSD): kasanın içinde. Fotoğraflar, belgeler, programlar burada kalıcı durur. <b>Dolap</b> gibidir.</li>
        <li><b>RAM</b> (bellek): o an açık olan işler için. <b>Çalışma masası</b> gibidir; bilgisayar kapanınca boşalır. Kaydetmediğiniz yazı bu yüzden kaybolur.</li>
        <li><b>USB bellek</b>: cebe sığan, takılıp çıkarılan küçük disk. Dosyaları başka bilgisayara götürmek için.</li></ul>
        <p>Kasanın içindeki bu parçaları 3B görmek için: <a class="btn" href="bilgisayar.html">🖥 Bilgisayarın İçine Yolculuk</a></p>`,
      scene: intro('<div class="sc-big">🗄 Dolap = disk<br>🗒 Masa = RAM<br>💾 Cep = USB bellek</div>'),
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Bilgisayarın parçalarını ayırt edebiliyorsunuz.</p>', scene: intro('<div class="sc-big">🎉</div>') },
  ],
};
