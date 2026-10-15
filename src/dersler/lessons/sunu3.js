// 12. hafta ek dersleri: iyi bir sunu nasıl olur (yazı miktarı, boyut, renk, resim, animasyon, sunum öncesi hazırlık)
// ve sunum anı (konuşmacı notları, slayt numarası, B/W/rakam kısayolları).
import { K, desktopReady, maxed, norm } from './common.js';
import { info, ayir, sec, rehberSoru } from './kalip.js';

// Küçük slayt taslakları
const slm = (cls, title, body) => `<div class="slm ${cls}"><b>${title}</b>${body}</div>`;
const CRAMPED = slm('cramped', 'Bahçe işleri', `<p>Nisan ayında fideler dikilmeli ve toprak çapalanmalıdır çünkü toprak sertleşirse kökler su alamaz. Mayıs ayında sulama başlatılmalı, sabah erken saatlerde yapılmalıdır. Haziran ayında domatesler toplanmaya başlanır; olgun olanlar seçilmeli, yeşiller bırakılmalıdır. Temmuz ayında bahçe sabah ve akşam sulanmalı, öğlen sulamasından kaçınılmalıdır çünkü yapraklar yanar. Ağustos ayında…</p>`);
const LOWC = slm('lowc', 'Bahçe işleri', '<ul><li>Fideleri dikmek</li><li>Toprağı çapalamak</li><li>Sulamayı başlatmak</li></ul>');
const GOOD = slm('good', 'İlkbahar işleri', '<ul><li>Fideleri dikmek</li><li>Toprağı çapalamak</li><li>Sulamayı başlatmak</li></ul><i>🌱</i>');

export const sunuKurallar = {
  id: 'sunu-kurallar', icon: '🎯', title: 'İyi bir sunu nasıl olur?', minutes: 25, stage: 'scene',
  desc: 'Slaytta ne kadar yazı olmalı, yazı boyutu ve renk nasıl seçilir, resim ve animasyon ne zaman işe yarar; sunum öncesi hazırlık: yedek, projeksiyon bağlantısı ve ⊞ + P.',
  summary: [
    ['Az yazı', 'Slayt başına en çok 3–5 kısa madde; bütün cümleleri yazmayın, konuşurken siz anlatın'],
    ['Büyük yazı', 'Metin en az 24 punto, başlık 32–44 punto; arka sıradan okunmalı'],
    ['Zıt renk', 'Açık zemin + koyu yazı ya da koyu zemin + açık yazı; sarı yazı beyaz zeminde okunmaz'],
    ['Tek fikir', 'Her slayt tek bir şey anlatsın'],
    ['Resim', 'Fotoğraf bin söze bedeldir; ama konuyla ilgili ve net olsun'],
    ['Animasyon', 'Az ve tutarlı: her maddede ayrı efekt dikkat dağıtır'],
    ['Yedek', 'Sunuyu USB belleğe ve e-postaya da koyun; bir de PDF kopyası alın'],
    ['⊞ + P', 'Projeksiyona bağlayınca: Yalnızca bilgisayar ekranı, Çoğalt, Genişlet, Yalnızca ikinci ekran'],
  ],
  steps: [
    {
      title: 'Sunu kimin için?',
      html: `<p>Sunu, <b>dinleyicilere yardım etmek</b> içindir; siz konuşurken onlara bir fikir verir. Slaytı okuyup durursanız dinleyici sıkılır. Bugün iyi ve kötü slaytların farkını göreceğiz.</p>
        <p>Torunlarınıza, mahalleye, dernek toplantısına… nerede olursa olsun aynı kurallar geçerlidir.</p>`,
      scene: info('<div class="sc-big">🎯 👥</div><p>Slayt dinleyiciye yardım eder,<br>sizin yerinize konuşmaz</p>'),
    },
    sec({
      title: 'Çok yazı', text: CRAMPED,
      q: 'Bu slaytta sizce asıl sorun nedir?', opts: ['Resim yok', 'Çok fazla ve küçük yazı: arka sıradan okunmaz, dinleyici ya sizi dinler ya yazıyı okur', 'Başlık çok büyük'], ok: 1,
      why: 'Slayt bir kitap sayfası değildir. Bütün cümleleri yazmayın; yalnızca <b>anahtar sözcükleri</b> koyun, gerisini siz anlatın. Slayt başına 3–5 kısa madde yeter.',
    }),
    sec({
      title: 'Renk', text: LOWC,
      q: 'Bu slaytta açık sarı yazı beyaz zemin üzerinde. Sorun nedir?', opts: ['Hiçbir sorun yok', 'Zıtlık az: yazı zemine karışıyor, uzaktan okunmuyor. Koyu yazı + açık zemin ya da tersi gerekir', 'Renk fazla canlı'], ok: 1,
      why: 'Okunurluk <b>zıtlıkla</b> olur: beyaz zeminde siyah ya da lacivert, koyu zeminde beyaz ya da açık sarı. Açık sarı + beyaz, projeksiyonda hiç görünmez.',
    }),
    sec({
      title: 'İyi slayt', text: GOOD,
      q: 'Bu slayt neden iyi?', opts: ['Çok renkli', 'Büyük başlık, üç kısa madde, tek fikir ve konuyla ilgili bir görsel', 'Çok bilgi var'], ok: 1,
      why: 'Okunaklı, sade, tek fikirli. Daha fazla ayrıntı konuşurken anlatılır ya da “konuşmacı notlarına” yazılır.',
    }),
    ayir({
      title: 'Yapın mı, yapmayın mı?',
      html: '<p>Her kartı sürükleyin: <b>iyi sunu alışkanlığı</b> mı, <b>kaçınılacak</b> mı?</p>',
      bins: [{ id: 'iyi', label: 'İyi alışkanlık', icon: '✅' }, { id: 'kotu', label: 'Kaçının', icon: '🚫' }],
      items: [
        { label: 'Slayt başına 3–5 kısa madde', icon: '📝', bin: 'iyi', why: 'Sade ve okunaklı.' },
        { label: 'Yazıyı en az 24 punto yapmak', icon: '🔠', bin: 'iyi', why: 'Arka sıradan okunur.' },
        { label: 'Konuyla ilgili net bir fotoğraf koymak', icon: '🖼', bin: 'iyi', why: 'Görsel, söylediğinizi pekiştirir.' },
        { label: 'Slaytta söyleyeceğiniz her cümleyi yazmak', icon: '📄', bin: 'kotu', why: 'Dinleyici slaytı okur, sizi dinlemez.' },
        { label: 'Her maddeye ayrı bir animasyon ve ses koymak', icon: '🎆', bin: 'kotu', why: 'Dikkat dağıtır, sunuyu uzatır.' },
        { label: 'Koyu mavi zeminde lacivert yazı', icon: '🌑', bin: 'kotu', why: 'Zıtlık yok, okunmaz.' },
        { label: 'Sunuyu PDF olarak da yedeklemek', icon: '💾', bin: 'iyi', why: 'Bilgisayar sorun çıkarırsa elinizde bir kopya kalır.' },
      ],
      done: 'İyi bir sununun kuralları basit: sade, büyük, zıt renkli, tek fikirli.',
    }),
    sec({
      title: 'Sunum günü', text: '<p>Dernek toplantısında sunumunuzu <b>kendi dizüstünüzle</b> yapacaksınız. Salonda bir projeksiyon var ve sizin bilgisayarınızı bağlayacaklar.</p>',
      q: 'Sunumdan önce hangisini <b>mutlaka</b> yaparsınız?', opts: ['Hiçbir şey; her zaman çalışır', 'Sunuyu bir USB belleğe ya da e-postanıza yedeklerim; bağlantıyı önceden denerim; bilgisayarı şarja takarım', 'Sunuyu yalnızca telefonda tutarım'], ok: 1,
      why: 'Teknik aksilik her zaman olur: kablo uymaz, bilgisayar açılmaz. Sunuyu ikinci bir yerde (USB, e-posta, PDF) saklayın, bağlantıyı salonda önceden deneyin.',
    }),
    sec({
      title: 'Projeksiyon bağlantısı', text: '<p>Dizüstünüzü projeksiyona bağladınız ama perdeye sizin masaüstünüz <b>yerine yalnızca boş bir görüntü</b> geliyor. Bilgisayarda ⊞ + P tuşlarına basınca dört seçenek çıkıyor.</p>',
      q: 'Perdede de sizin ekranınızın <b>aynısını</b> görmek için hangisini seçersiniz?', opts: ['Yalnızca bilgisayar ekranı', 'Çoğalt', 'Yalnızca ikinci ekran'], ok: 1,
      why: '<b>Çoğalt</b>: iki ekranda aynı şey. <b>Genişlet</b>: perde ikinci bir masaüstü olur (sunucu görünümü için). <b>Yalnızca ikinci ekran</b>: bilgisayar ekranı kararır. Kısayol: ⊞ Windows + P.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>İyi bir sunu için bilmeniz gerekenler:</p>', scene: info('<div class="sc-big">🎯 ✔</div>') },
  ],
};

// ---------- Sunum anı: uygulama
const P = (c) => c.d.find('slides')?.api;
const inf = (c) => P(c)?.info() || { slides: [], notes: [], slideNum: false };
const li = (...a) => a.map((t) => `<li>${t}</li>`).join('');
const sl = (layout, o = {}) => ({ layout, title: '', sub: '', body: '', body2: '', img: null, trans: 'none', art: null, anim: { effect: 'none', start: 'click' }, auto: 0, imgSize: 'M', notes: '', ...o });

export const sunuAni = {
  id: 'sunu-ani', icon: '🎤', title: 'Sunum anı: konuşmacı notları ve kısayollar', minutes: 30, stage: 'desktop',
  desc: 'Slayt numarası eklemek, konuşmacı notları yazmak (izleyici görmez), sunum sırasında B ile ekranı karartmak, rakam ve Enter ile istediğiniz slayda atlamak, Esc ile çıkmak.',
  summary: [
    ['＃ Slayt numarası', 'Ekle → Slayt numarası; her slaydın köşesine sıra numarası yazar'],
    ['Konuşmacı notları', 'Slaydın altındaki kutuya yazılır; izleyiciye görünmez, siz bakarsınız'],
    ['F5', 'Baştan başlat; Shift + F5 geçerli slayttan'],
    ['B', 'Ekranı karartır (izleyici sizi dinlesin); yeniden B ya da başka tuş → geri gelir'],
    ['W', 'Ekranı beyaz yapar'],
    ['Rakam + Enter', 'O numaralı slayda atlar: 3 yazıp Enter → 3. slayt'],
    ['Home / End', 'İlk / son slayt'],
    ['Esc', 'Gösteriden çıkar'],
  ],
  steps: [
    {
      title: 'Sunum günü',
      html: `<p>Sunuyu hazırladınız; şimdi izleyicinin karşısındasınız. Sunum sırasında işinizi kolaylaştıracak üç şey: <b>slayt numarası</b>, <b>konuşmacı notları</b> ve <b>kısayollar</b>.</p>
        <p>Önünüzde 3 slaytlık “Bahçe Takvimi” sunusu var.</p>`,
      setup: (c) => {
        desktopReady(c); c.d.closeAll();
        maxed(c, 'slides', { data: { theme: 'mavi', slides: [sl('title', { title: 'Bahçe Takvimi', sub: 'Her mevsim' }), sl('content', { title: 'İlkbahar işleri', body: li('Fideleri dikmek', 'Toprağı çapalamak', 'Sulamayı başlatmak') }), sl('content', { title: 'Yaz işleri', body: li('Sabah sulamak', 'Domatesleri toplamak')}), sl('content', { title: 'Sonbahar işleri', body: li('Toprağı gübrelemek', 'Soğan dikmek') })] } });
      },
    },
    {
      title: 'Slayt numarası',
      html: '<p><b>Ekle</b> sekmesine tıklayın ve <b>＃ Slayt numarası</b> düğmesine basın. Slaytların sağ alt köşesine numara gelir (ilk slayda gelmez).</p>',
      hint: 'Ekle sekmesi Giriş\'in sağında. Düğme Fotoğraf Albümü ve SmartArt\'ın yanında.',
      check: (c) => inf(c).slideNum,
      on: (ev) => ev.type === 'ppt-slidenum' && ev.on,
      done: 'Slaytlara numara geldi. Soru-cevap sırasında “5. slayda dönebilir miyiz?” denince hemen bulursunuz.',
    },
    {
      title: 'Konuşmacı notu yazın',
      html: '<p>Soldan <b>İlkbahar işleri</b> slaydına tıklayın. Slaydın <b>altındaki</b> “Konuşmacı notları” kutusuna <b>fideleri mayıs sonunda dikin</b> gibi bir not yazın (en az 10 harf).</p>',
      hint: 'Kutu, slayt resminin altında, “Bu slaytta söylemek istediklerinizi buraya yazın” yazıyor.',
      on: (ev) => ev.type === 'ppt-notes' && ev.length >= 10,
      done: 'Not kaydedildi. <b>Bu not perdede görünmez</b>; yalnızca siz görürsünüz. Unutmak istemediğiniz tarihleri, rakamları ve esprileri buraya yazarsınız.',
    },
    {
      title: 'Gösteriyi başlatın',
      html: `<p>${K('F5')} tuşuna basarak sunuyu <b>baştan</b> başlatın. (Geçerli slayttan başlamak için ${K('Shift')} + ${K('F5')}.) İlk slayt tüm ekranı kaplar.</p>`,
      combo: ['F5'],
      check: (c) => !!inf(c).showing,
      on: (ev) => ev.type === 'ppt-show-start',
    },
    {
      title: 'Ekranı karartın: B',
      html: `<p>Bir soru geldi ve siz izleyiciyle konuşacaksınız; ekran dikkatlerini dağıtmasın. Klavyede <b>B</b> tuşuna basın: ekran <b>kararır</b>. Yeniden <b>B</b>'ye basınca sunu geri gelir.</p>`,
      keys: ['KeyB'],
      hint: 'Sunu ekranı açıkken klavyeden B harfine basın.',
      on: (ev, c) => {
        if (ev.type === 'ppt-show-key' && ev.key === 'b' && ev.on) c.s.dark = true;
        return ev.type === 'ppt-show-key' && ev.key === 'b' && !ev.on && !!c.s.dark;
      },
      done: 'B ile karardı, B ile geri geldi. Aynı işi <b>W</b> tuşu beyaz ekranla yapar. Eskiden slayt makinesinin ışığını kapatmak gibi.',
    },
    {
      title: 'Slayda atlayın',
      html: `<p>Soru-cevapta üçüncü slayda dönmeniz gerekti. Klavyeden <b>3</b> yazıp ${K('Enter')}'a basın: doğrudan <b>3. slayt</b> açılır.</p>`,
      hint: 'Önce 3 tuşuna, sonra Enter\'a basın. Ok tuşlarıyla tek tek gezmenize gerek kalmaz.',
      on: (ev) => ev.type === 'ppt-show-jump' && ev.to === 3,
      done: 'Doğrudan 3. slayda geçtiniz. Rakam + Enter, kalabalık bir sunuda çok işe yarar.',
    },
    {
      title: 'Gösteriden çıkın',
      html: `<p>${K('Esc')} tuşuyla sunudan çıkın.</p>`,
      keys: ['Escape'],
      on: (ev) => ev.type === 'ppt-show-exit',
    },
    rehberSoru({
      title: 'Notlar görünür mü?',
      html: '<p>Slaytların altına <b>konuşmacı notları</b> yazdınız. Sunuyu izleyicilere perdeden gösterirken bu notları <b>onlar</b> görür mü?</p>',
      opts: ['Evet, slaydın altında görünür', 'Hayır; yalnızca siz görürsünüz (sunucu görünümünde ya da yazdırırsanız)', 'Notlar sunuyu bozar'], ok: 1,
      wrong: 'Notların amacı izleyiciden saklı kalmak. Siz nerede görürsünüz?',
      why: 'Notlar perdede görünmez. İki ekranla (bilgisayar + projeksiyon) <b>Genişlet</b> modunda sunucu görünümü açılırsa notlar yalnızca sizin ekranınızda belirir. Ayrıca “Not sayfası” olarak yazdırabilirsiniz.',
    }),
    rehberSoru({
      title: 'Hangi tuş?',
      html: '<p>Sunum sırasında izleyicilerle bir tartışma başladı ve ekranda artık slayt istemiyorsunuz. En hızlı yol?</p>',
      opts: ['Gösteriyi kapatıp yeniden açmak', 'B tuşuna basıp ekranı karartmak; devam edince yine B', 'Bilgisayarı kapatmak'], ok: 1,
      wrong: 'Gösteriyi kapatmadan geçici olarak ekranı karartmanın bir tuşu var.',
      why: 'B (kara ekran) ve W (beyaz ekran) tartışma sırasında ekranı saklar; aynı tuşla ya da herhangi bir tuşla kaldığınız slayttan devam edersiniz.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Sunum anı için hazırsınız:</p>' },
  ],
};
