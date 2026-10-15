// 5. hafta ek dersi: Windows donatıları. Yapışkan Notlar, Ses Kaydedici, Saat (alarm ve zamanlayıcı).
import { K, desktopReady } from './common.js';
import { rehberSoru } from './kalip.js';

const appOpen = (app) => ({
  check: (c) => !!c.d.find(app),
  on: (ev) => ev.type === 'app-open' && ev.app === app,
});

export const donatilar = {
  id: 'donatilar', icon: '🗒', title: 'Yapışkan Notlar, Ses Kaydedici ve Alarm', minutes: 30, stage: 'desktop',
  desc: 'Renkli notlar, konuşarak not almak, alarm ve zamanlayıcı kurmak.',
  summary: [
    ['🗒 Yapışkan Notlar', 'Kısa notlar; renkli kâğıtlar, kapatınca silinmez'],
    ['＋ Yeni not', 'Boş bir kâğıt açar'],
    ['🎙 Ses Kaydedici', 'Kırmızı ● ile başlar, ■ ile durur; kayıt Müzik klasörüne kaydedilir'],
    ['⏰ Alarm', 'Belirli bir saatte çalar; adını yazın (İlaç saati)'],
    ['⏳ Zamanlayıcı', 'Şu andan belli bir süre sonra çalar (yemek, çay demi)'],
    ['🔊 Ses', 'Alarm ve kayıt için bilgisayarın sesi açık olmalı'],
  ],
  steps: [
    {
      title: 'Küçük yardımcılar',
      html: `<p>Bilgisayarda büyük programların yanında hayatı kolaylaştıran <b>küçük yardımcılar</b> vardır. Bugün üç tanesini öğreneceğiz:</p>
        <ul class="big-list"><li>🗒 <b>Yapışkan Notlar</b>: kâğıt not yerine</li><li>🎙 <b>Ses Kaydedici</b>: yazmak yerine konuşarak not</li><li>⏰ <b>Saat</b>: ilaç, randevu ya da yemek için alarm</li></ul>
        <p class="mut">Hepsi Başlat menüsünde. Alıştırma bilgisayarında hiçbir şey gerçek bir kayıt yapmaz; kendi sesiniz kaydedilmez.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); c.d.stickies = []; },
    },
    {
      title: 'Yapışkan Notlar\'ı açın',
      html: '<p>⊞ <b>Başlat</b> → <b>🗒 Yapışkan Notlar</b>.</p>',
      mouse: '🖱 Başlat → Yapışkan Notlar',
      ...appOpen('notlar'),
      done: 'Buzdolabına yapıştırdığınız not kâğıtlarının bilgisayardaki hâli.',
    },
    {
      title: 'Yeni bir not',
      html: '<p><b>＋ Yeni not</b>\'a tıklayın, kâğıdın içine tıklayıp unutmamanız gereken bir şey yazın. Örneğin: <b>Cuma günü eczaneye git</b>.</p>',
      hint: 'Önce ＋ Yeni not. Sonra çıkan sarı kâğıdın içine tıklayıp yazın.',
      on: (ev) => ev.type === 'sticky-text' && ev.text.trim().length >= 5,
      done: 'Yazdıkça kendiliğinden kaydedilir; “Kaydet”e basmak gerekmez. Pencereyi kapatsanız da not durur.',
    },
    {
      title: 'Rengini değiştirin',
      html: '<p>Notun üstündeki renkli noktalardan birine tıklayarak notun rengini değiştirin. Renkler, işleri ayırmanıza yardım eder: sarı alışveriş, pembe ilaç gibi.</p>',
      mouse: '🖱 Notun üstündeki renkli nokta',
      on: (ev) => ev.type === 'sticky-color',
      done: 'Renk, notları birbirinden ayırır.',
    },
    {
      title: 'İkinci not, sonra silin',
      html: `<p>Bir not daha ekleyin (içine istediğinizi yazın). Sonra <b>ilk notu</b> silin: notun üstündeki <b>🗑</b> simgesine tıklayın.</p>
        <p class="mut">Yapılan işin notunu silmek iyi bir alışkanlıktır; masa dağılmaz.</p>`,
      hint: '🗑 simgesi her notun sağ üst köşesindedir.',
      on: (ev, c) => ev.type === 'sticky-delete' && c.d.stickies.length >= 1,
      done: 'Notlarınız bu kadar kolay.',
    },
    {
      title: 'Ses Kaydedici\'yi açın',
      html: '<p>Yazmak zor gelirse <b>konuşarak</b> not alabilirsiniz. ⊞ <b>Başlat</b> → <b>🎙 Ses Kaydedici</b>.</p>',
      mouse: '🖱 Başlat → Ses Kaydedici',
      ...appOpen('kayit'),
    },
    {
      title: 'Kayıt yapın',
      html: `<ol class="steps"><li>Kırmızı <b>●</b> düğmesine tıklayın.</li><li>Sayaç ilerlerken birkaç saniye <b>konuşun</b> (örneğin “Yarın ilacı almayı unutma”).</li><li>Kırmızı <b>■</b> düğmesine tıklayarak durdurun.</li></ol>`,
      hint: 'En az 2 saniye sürsün. Durdurmak için ■ düğmesine basın.',
      on: (ev, c) => {
        if (ev.type !== 'rec-stop') return false;
        if (ev.secs < 2) { c.warn('Kayıt çok kısa oldu. Bir daha deneyin: ● ile başlayın, birkaç saniye bekleyip ■ ile durdurun.'); return false; }
        return true;
      },
      done: (c) => `Kaydınız <b>Müzik</b> klasörüne “Kayıt (1).m4a” adıyla kaydedildi. Dosya Gezgini'nden de bulabilirsiniz.`,
    },
    {
      title: 'Kaydı dinleyin',
      html: '<p>Aşağıdaki <b>Kayıtlarınız</b> listesinde kaydı bulup <b>▶ Dinle</b>\'ye tıklayın.</p>',
      mouse: '🖱 ▶ Dinle',
      hint: 'Ses gelmiyorsa sağ alttaki 🔊 simgesine tıklayıp sesi açın.',
      on: (ev, c) => {
        if (ev.type !== 'rec-play') return false;
        if (!ev.audible) { c.warn('Ses duyulmuyor: ses kapalı ya da sıfırda. Sağ alttaki 🔊 simgesinden açıp tekrar ▶ Dinle\'ye basın.'); return false; }
        return true;
      },
      done: 'Sesi dinledik. Torunlarınızdan gelen mesajları kaydedip saklayabilirsiniz.',
    },
    {
      title: 'Saat uygulaması',
      html: '<p>⊞ <b>Başlat</b> → <b>⏰ Saat</b>. Burada iki şey var: <b>Alarm</b> (belli saatte) ve <b>Zamanlayıcı</b> (şimdiden belli süre sonra).</p>',
      mouse: '🖱 Başlat → Saat',
      ...appOpen('saat'),
    },
    {
      title: 'Alarm kurun',
      html: `<p><b>Alarm</b> sekmesinde saati ayarlayın, adına <b>İlaç saati</b> yazın ve <b>＋ Ekle</b>'ye tıklayın.</p>
        <p class="mut">Gerçek bilgisayarda alarmın çalması için bilgisayar açık olmalı ve sesi kapalı olmamalıdır.</p>`,
      hint: 'Saat kutusundaki sayıları tıklayıp yazabilirsiniz. Adı “Alarm adı” kutusuna yazın.',
      on: (ev, c) => {
        if (ev.type !== 'alarm-add') return false;
        if ((ev.label || '').trim().length < 3) { c.warn('Alarma bir ad verin (örneğin İlaç saati) ve tekrar ekleyin; adsız alarmları sonra karıştırırsınız.'); return false; }
        return true;
      },
      done: 'Alarm listede görünüyor. “Açık / Kapalı” düğmesiyle geçici olarak kapatabilirsiniz.',
    },
    {
      title: 'Zamanlayıcı',
      html: `<p><b>⏳ Zamanlayıcı</b> sekmesine geçin ve <b>10 saniye</b>'yi seçin. Çay demlenirken ya da yemek fırındayken bu kullanılır.</p><p>Süre dolunca ekranın köşesinde uyarı çıkar ve ses çalar. Bekleyin.</p>`,
      hint: 'Sekmeler üstte: ⏰ Alarm | ⏳ Zamanlayıcı. 10 saniye düğmesi en solda üstte.',
      on: (ev) => ev.type === 'timer-ring',
      done: 'Süre doldu! Ses çaldı ve köşede uyarı çıktı. Gerçekte de böyle çalışır.',
    },
    rehberSoru({
      title: 'Alarm neden çalmadı?',
      html: '<p>Komşunuz şikâyetçi: “Alarm kurdum, öğleden sonra bilgisayarın başında değildim, çalmadı. Neden olabilir?” Hangisi <b>muhtemel bir nedendir</b>?</p>',
      opts: ['Bilgisayarın sesi kapalıydı', 'Alarm gece çalar, gündüz çalmaz', 'Alarmlar yalnızca pazartesi çalışır'], ok: 0,
      wrong: 'Bu değil. Alarmın duyulabilmesi için bilgisayarda bir şeyin açık olması gerekir.',
      why: `Evet. Alarm için bilgisayarın <b>açık</b> (uykuda değil) ve <b>sesinin açık</b> olması gerekir. Önemli ilaçlar için telefon alarmını da kurmak iyi olur.`,
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Küçük yardımcılarla günlük işleriniz kolaylaştı:</p>' },
  ],
};
