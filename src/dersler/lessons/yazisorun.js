// 2. hafta ek dersi: yazı yazarken başa gelenler. Odak kaybı (klavye yazmıyor), Insert (harfleri yutma), Caps Lock, Num Lock, klavye dili.
import { K } from './common.js';
import { rehberSoru } from './kalip.js';

const HEDEF = 'Dikkat: Yarın pazar.';

export const yaziSorun = {
  id: 'yazi-sorun', icon: '🆘', title: 'Yazı yazarken başıma gelenler', minutes: 25, stage: 'notepad',
  desc: 'Yazı gelmiyor, her şey BÜYÜK çıkıyor, ş ğ ü yazmıyor: nedenleri ve çözümleri.',
  summary: [
    ['Yazı gelmiyor', 'İmleç (yanıp sönen çizgi) yazı alanında mı? Yazı alanının içine tıklayın'],
    ['Harfler siliniyor', `${K('Insert')} tuşuna basılmıştır (Üzerine yaz). Aynı tuşa bir daha basın`],
    ['HER ŞEY BÜYÜK', `${K('Caps Lock')} açıktır. Bir kez basıp kapatın`],
    ['Sayı tuşları çalışmıyor', `${K('Num Lock')} kapalıdır. Bir kez basıp açın`],
    ['ş, ğ, ü yok', `Klavye dili ENG olmuştur. ${K('Alt', 'Shift')} ya da ${K('⊞', 'Boşluk')} ile TUR yapın`],
    ['İlk kural', 'Bilgisayar bozulmadı. Önce ekrana ve sağ alttaki simgelere bakın'],
  ],
  steps: [
    {
      title: '“Klavye bozuldu!”',
      html: `<p>Yazı yazarken bir şey ters gidince çoğu kişi <b>“bilgisayar bozuldu”</b> diye düşünür. Oysa neredeyse hepsi bir tuşa yanlışlıkla basmaktan olur.</p>
        <ul class="big-list"><li>Klavyeye basıyorum, <b>yazı gelmiyor</b></li><li>Yazdıkça <b>harfler siliniyor</b></li><li>Her şey <b>BÜYÜK HARF</b> çıkıyor</li><li><b>Sayılar</b> yazılmıyor</li><li><b>ş, ğ, ü</b> yerine başka işaretler çıkıyor</li></ul>
        <p>Hepsini sırayla deneyip çözümünü bulacağız. Hiçbir şey bozulmaz.</p>`,
      setup: (c) => { c.np.setText(''); c.np.setOverwrite(false); },
    },
    {
      title: 'Yazı gelmiyor',
      html: `<p>Yandaki Not Defteri'ne <b>bakın</b>: yazı alanında yanıp sönen çizgi (imleç) yok.</p>
        <p>Klavyeden birkaç harfe basıp deneyin. Yazı geliyor mu? Sonra bir çözüm bulun ve <b>merhaba</b> yazın.</p>`,
      hint: 'Yazı yalnızca <b>imlecin olduğu pencereye</b> gelir. Beyaz yazı alanının içine bir kez tıklayın, sonra yazın.',
      setup: (c) => {
        // Derse odak kaybıyla başlanır: adım açılınca Not Defteri odağı geri alır, bu yüzden biraz sonra bırakılır
        c.s.keys = 0;
        c.s.kd = (e) => {
          if (document.activeElement === c.np.ta || e.ctrlKey || e.metaKey || e.key.length !== 1) return;
          if (++c.s.keys === 3) c.note('Tuşlara basıyorsunuz ama yazı gelmiyor. Çünkü imleç yazı alanında değil. Fareyle beyaz alanın içine tıklayın.');
        };
        addEventListener('keydown', c.s.kd);
        setTimeout(() => c.np.ta.blur(), 150);
      },
      leave: (c) => removeEventListener('keydown', c.s.kd),
      on: (ev, c) => ev.type === 'input' && /merhaba/i.test(c.np.value),
      done: `Çözüm: yazı alanına <b>tıklamak</b>. Tıklayınca imleç oraya gelir. Klavye bozuk değildi; yazı, imlecin olmadığı yere gitmiyordu. Başka bir pencereye ya da masaüstüne tıkladıysanız da aynısı olur.`,
    },
    {
      title: 'Harfler yutuluyor',
      html: `<p>Not Defteri'ne bir yazı koyduk: <b>Yarın pazar.</b> İmleç en başta.</p>
        <p>Yazının <b>başına</b> şunu ekleyin: <b>Dikkat: </b> (iki noktadan sonra boşluk). Yazının sonu <b>Dikkat: Yarın pazar.</b> olmalı.</p>
        <p>Dikkat edin: yazıyı ekleyince ne oluyor?</p>`,
      hint: `Sağ alttaki durum çubuğunda <b>“Üzerine yaz (INS)”</b> yazıyor. ${K('Insert')} tuşu harfleri yutturur. Bir kez ${K('Insert')}'e basarak kapatın, ${K('Ctrl', 'A')} ile hepsini seçip yazıyı baştan yazın.`,
      setup: (c) => {
        c.np.setText('Yarın pazar.');
        c.np.setOverwrite(true);
        c.np.ta.setSelectionRange(0, 0);
      },
      leave: (c) => c.np.setOverwrite(false),
      on: (ev, c) => (ev.type === 'input' || ev.type === 'insert-toggle') && !c.np.overwrite && c.np.value.trim() === HEDEF,
      done: `Yazdıkça yanındaki harfleri yiyen şey <b>Insert</b> tuşudur. Üzerine yazma kipi açık kalınca yeni harf, imlecin sağındaki harfi siler. Aynı tuşa bir daha basınca normale döner. Bu tuş genellikle klavyenin sağ üstündedir; yanlışlıkla basmak çok kolay.`,
    },
    {
      title: 'HER ŞEY BÜYÜK',
      html: `<p>Şimdi <b>Caps Lock</b> tuşuna bir kez basın (klavyenin sol tarafında, <b>A</b>'nın solunda) ve <b>merhaba</b> yazın.</p>
        <p>Ne oldu?</p>`,
      keys: ['CapsLock'],
      setup: (c) => c.np.setText(''),
      on: (ev, c) => ev.type === 'input' && /MERHABA/.test(c.np.value),
      done: 'Caps Lock açıkken harfler hep büyük yazılır. Sayfanın üstünde çıkan sarı uyarı da bunu söyler. Şifre yazarken büyük-küçük harf önemlidir; şifreniz “yanlış” çıkıyorsa önce buna bakın.',
    },
    {
      title: 'Caps Lock\'u kapatın',
      html: `<p>${K('Caps Lock')} tuşuna <b>bir kez daha</b> basıp kapatın, sonra yeniden <b>merhaba</b> yazın. Bu sefer küçük harfle yazılmalı.</p>`,
      keys: ['CapsLock'],
      on: (ev, c) => ev.type === 'input' && c.np.value.includes('merhaba'),
      done: `Geçici olarak büyük harf için ${K('Shift')}'i basılı tutun; sürekli büyük yazmak gerekmedikçe Caps Lock'u kapalı tutun.`,
    },
    rehberSoru({
      title: 'Sayılar yazılmıyor',
      html: '<p>Masaüstü klavyenin sağındaki <b>sayı tuş takımında</b> 7, 8, 9 tuşlarına basıyorsunuz. Rakam yerine imleç hareket ediyor, hiçbir şey yazılmıyor. Neden?</p>',
      opts: ['Klavye bozuk', '<b>Num Lock</b> kapalı', 'Caps Lock açık'], ok: 1,
      wrong: 'Bu değil. O tuş takımının rakam mı ok mu olacağını belirleyen bir kilit tuşu var.',
      why: `<b>Num Lock</b> kapalıyken sağdaki tuşlar ok, Home, End gibi çalışır. ${K('Num Lock')}'a bir kez basınca rakam yazarlar. Klavyede ışığı yanıyorsa açıktır. Rakam sırasındaki (harflerin üstündeki) tuşlar her zaman çalışır.`,
    }),
    rehberSoru({
      title: 'ş, ğ, ü çıkmıyor',
      html: '<p><b>Şimdi</b> yazmak istiyorsunuz ama ş yerine <b>;</b>, ğ yerine <b>[</b> çıkıyor. Neden?</p>',
      opts: ['Klavye yanlış takıldı', 'Klavye dili <b>İngilizce (ENG)</b> olmuş', 'Num Lock açık'], ok: 1,
      wrong: 'Bu değil. Sağ alttaki saatin yanında klavye dilini gösteren üç harfli bir yazı var; Türkçe için TUR yazar.',
      why: `Klavye dili İngilizce olunca Türkçe harfler yazılmaz. Sağ alttaki <b>ENG</b> yazısına tıklayıp <b>TUR</b> seçin. Kısayolu: ${K('Alt', 'Shift')} ya da ${K('⊞ Windows', 'Boşluk')}. Çoğu zaman bunlara yanlışlıkla basılmıştır. Bunu “Klavye dili ve düzeni” dersinde kendiniz deneyeceksiniz.`,
    }),
    rehberSoru({
      title: 'Ne yaparsınız?',
      html: '<p>Bir komşunuz arıyor: “Bilgisayarda yazı yazıyorum, harfler yazıdaki başka harfleri siliyor, bozuldu galiba.” Ona ne söylersiniz?</p>',
      opts: ['Servise götür', 'Klavyenin sağ üstündeki <b>Insert</b> tuşuna yanlışlıkla basmış olabilirsin, bir kez daha bas', 'Bilgisayarı sıfırla'], ok: 1,
      wrong: 'Bu kadar büyük bir adıma gerek yok. Yazının harfleri yemesi bir klavye kilidinden olur.',
      why: 'Aynen öyle! Çoğu “bozuldu” şikâyeti bir tuşa yanlışlıkla basmaktan çıkar. Önce Insert, Caps Lock, Num Lock ve klavye diline bakın.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>“Yazı yazamıyorum” durumlarında bakacağınız yerler:</p>' },
  ],
};
