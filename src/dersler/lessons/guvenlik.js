// Ek ders: internette güvenlik ve dolandırıcılığı tanıma
import { quiz, passwordMeter } from './scenes.js';

const card = (opts) => ({
  title: opts.title,
  html: opts.html || '<p>Yandaki mesajı okuyun. Sizce güvenli mi, yoksa bir dolandırıcılık mı?</p>',
  scene: quiz(opts),
  on: (ev, c) => {
    if (ev.type === 'quiz' && !ev.ok) c.warn('Bu sefer olmadı. Yandaki açıklamayı okuyun ve diğer seçeneği deneyin.');
    return ev.type === 'quiz' && ev.ok;
  },
  done: opts.done || 'Doğru bildiniz.',
});

const clue = (t, why) => `<span class="clue" title="${why}">${t}<em>${why}</em></span>`;

export const guvenlik = {
  id: 'guvenlik', icon: '🛡', title: 'İnternette güvenlik', minutes: 20, stage: 'scene',
  desc: 'Sahte mesaj, arama ve siteleri tanıma; doğrulama kodu, sahte virüs uyarısı ve güçlü şifre.',
  summary: [
    ['Acele ettiren, korkutan mesaj', 'Durun, düşünün, kimseye hemen bilgi vermeyin'],
    ['Şifre, kart bilgisi, SMS kodu', 'Bankanız ve devlet kurumları ASLA telefonla ya da SMS ile istemez'],
    ['Garip bağlantılar', 'Mesajdaki bağlantıya tıklamayın; siteyi kendiniz açın'],
    ['“Acil para lazım” diyen yakın', 'Önce bildiğiniz eski numarasından arayıp doğrulayın'],
    ['Sahte virüs uyarısı', 'Numarayı aramayın; sekmeyi ya da tarayıcıyı kapatın'],
    ['Güçlü şifre', 'En az 12 karakter, harf + rakam + işaret; doğum yılı ve 1234 olmasın'],
  ],
  steps: [
    {
      title: 'Dolandırıcılar nasıl kandırır?',
      html: `<p>Dolandırıcıların mesajlarında hep aynı işaretler vardır:</p>
        <ul class="big-list"><li>⏰ <b>Acele ettirir</b>: “Hemen! Yoksa hesabınız kapanacak!”</li><li>😨 <b>Korkutur</b> ya da 🎁 <b>ödül vaat eder</b>.</li><li>🔑 <b>Şifre, kart numarası, SMS kodu</b> ister.</li><li>🔗 <b>Garip bir bağlantıya</b> tıklatmak ister.</li></ul>
        <p>Şimdi gerçek hayattan örneklere bakalım.</p>`,
      scene: (el) => { el.className = 'sc sc-info'; el.innerHTML = '<div class="sc-big">🕵️ ⚠ 📱</div><p>Dur · Düşün · Sor</p>'; },
    },
    card({
      title: 'Kargo mesajı', kind: 'sms', from: '+90 5XX XXX XX XX',
      text: `Sayın müşterimiz, kargonuz adres eksikliği nedeniyle ${clue('teslim edilemedi', 'Siparişiniz yoksa zaten şüpheli')}. ${clue('24 saat içinde', 'Acele ettiriyor')} adresinizi onaylamazsanız iade edilecektir: ${clue('kargo-teslimat-tr.co/x7k', 'Gerçek kargo firmasının adresi değil')}`,
      correct: 'scam',
      explain: 'Acele ettiriyor ve garip bir bağlantı veriyor. Bu bağlantılar kart bilgisi çalan sahte sayfalara gider. Kargonuz varsa firmanın kendi sitesinden ya da uygulamasından takip numarasıyla bakın.',
    }),
    card({
      title: 'Banka mesajı', kind: 'sms', from: 'BANKAM',
      text: `${clue('Hesabınız bloke edilmiştir!', 'Korkutuyor')} Blokeyi kaldırmak için ${clue('şifrenizi ve kart bilgilerinizi', 'Banka bunu ASLA istemez')} şu adresten girin: ${clue('bankam-guvenlik-giris.xyz', 'Bankanın gerçek adresi değil')}`,
      correct: 'scam',
      explain: 'Bankanız sizden <b>asla</b> SMS ya da telefonla şifre veya kart bilgisi istemez. Şüphelenirseniz kartınızın arkasındaki numaradan bankayı kendiniz arayın.',
    }),
    card({
      title: 'Doğrulama kodu', kind: 'sms', from: 'BANKAM',
      text: 'İnternet şubesi giriş doğrulama kodunuz: <b>482913</b>. Bu kodu banka çalışanları dahil <b>kimseyle paylaşmayınız</b>.',
      html: '<p>Az önce bankanızın internet şubesine <b>kendiniz</b> girmeye çalıştınız ve şu mesaj geldi. Güvenli mi?</p>',
      correct: 'safe',
      explain: 'Bu mesaj gerçek: girişi siz yaptınız, bağlantı yok ve “kimseyle paylaşmayın” diyor. Kodu yalnızca kendiniz, bankanın kendi sayfasına yazarsınız. <b>Bir başkası bu kodu sizden isterse, o kişi dolandırıcıdır.</b>',
    }),
    card({
      title: 'Telefon araması', kind: 'call', from: 'Bilinmeyen numara',
      text: '“Merhaba, bankanızın güvenlik biriminden arıyorum. Kartınızdan şüpheli bir harcama yapıldı. İptal edebilmem için <b>telefonunuza gelen kodu</b> bana söyler misiniz?”',
      correct: 'scam',
      explain: 'Gelen kodu isteyen her arama dolandırıcılıktır; o kodla hesabınıza girerler. Telefonu kapatın, bankanızı <b>kartın arkasındaki numaradan</b> kendiniz arayın.',
    }),
    card({
      title: 'Torundan mesaj', kind: 'sms', from: '+90 5XX XXX XX XX (kayıtlı değil)',
      text: `Babaanne benim Elif, ${clue('telefonum bozuldu, bu yeni numaram', 'Yeni numara bahanesi')}. ${clue('Çok acil', 'Acele')} 5.000 TL lazım, ${clue('şu hesaba atar mısın? Anneme söyleme', 'Gizlilik istiyor')}.`,
      correct: 'scam',
      explain: 'Çok yaygın bir dolandırıcılık! Para göndermeden önce torununuzu <b>bildiğiniz eski numarasından</b> arayın ya da ailenize sorun.',
    }),
    card({
      title: 'Fatura e-postası', kind: 'mail', from: 'Elektrik Dağıtım <fatura@…>', subject: 'Ekim ayı faturanız hazır',
      text: 'Sayın abonemiz, Ekim ayı elektrik faturanız <b>412,50 TL</b>\'dir. Son ödeme tarihi 25 Ekim\'dir. Ödemenizi her zamanki gibi bankanızdan ya da otomatik ödeme talimatınızla yapabilirsiniz.',
      correct: 'safe',
      explain: 'Bağlantı yok, şifre ya da kart bilgisi istenmiyor, acele ettirmiyor. Yine de emin olmak için tutarı kendi bankanızın uygulamasından kontrol edebilirsiniz.',
    }),
    card({
      title: 'Hangisi gerçek banka sitesi?', kind: 'plain',
      text: '<div class="addr-cmp"><div><b>A</b><span class="fake-addr">🔒 www.bankam.com.tr</span></div><div><b>B</b><span class="fake-addr bad">⚠ Güvenli değil | www.bankam-guvenlik-giris.xyz</span></div></div>',
      question: 'Şifrenizi hangi siteye yazarsınız?',
      options: [['a', 'A'], ['b', 'B']],
      correct: 'a',
      explain: 'A: adres bankanın kendi adresi ve kilit 🔒 var. B: adreste fazladan kelimeler ve garip bir uzantı (.xyz) var, “Güvenli değil” yazıyor. Banka sitesine her zaman adresi <b>kendiniz yazarak</b> ya da kayıtlı yer işaretinden girin.',
    }),
    card({
      title: 'Virüs uyarısı', kind: 'web', from: '⚠ Güvenli değil | www.bedava-hediye-kazan.xyz',
      text: '<div class="fake-pop"><b>⚠ Windows Güvenlik Uyarısı</b><p>Bilgisayarınızda 5 VİRÜS bulundu! Verileriniz silinmek üzere. HEMEN arayın: 0850 000 00 00</p></div>',
      question: 'İnternette gezerken bu pencere çıktı. Ne yaparsınız?',
      options: [['call', '📞 Numarayı ararım'], ['ok', '🖱 Penceredeki “Tamam”a basarım'], ['close', '❌ Sekmeyi ya da tarayıcıyı kapatırım']],
      correct: 'close',
      explain: 'Gerçek Windows uyarıları internet sayfasının içinde çıkmaz ve telefon numarası vermez. Arayan kişi uzaktan bilgisayarınıza bağlanıp para ister. Sekmeyi kapatın; kapanmıyorsa tarayıcıyı kapatın ya da bilgisayarı yeniden başlatın.',
    }),
    {
      title: 'Güçlü şifre',
      html: `<p>İyi bir şifre <b>uzun</b> olmalı ve <b>tahmin edilemez</b> olmalı.</p><ul class="big-list"><li>En az <b>12 karakter</b></li><li>Büyük + küçük harf, rakam, işaret</li><li>Doğum yılı, isim, 1234 <b>olmasın</b></li></ul>
        <p>İpucu: üç kelimeyi birleştirin: <b>MaviBalık!Çay7</b></p><p>Yandaki kutuda bir şifre deneyin; çubuk <b>Güçlü</b> olana kadar.</p>`,
      scene: passwordMeter,
      on: (ev) => ev.type === 'pw' && ev.score >= 3,
      done: 'Güçlü bir şifre! Her yerde aynı şifreyi kullanmayın; bir kâğıda yazacaksanız bilgisayarın yanında değil, güvenli bir yerde saklayın.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Altın kurallar:</p>', scene: (el) => { el.className = 'sc sc-info'; el.innerHTML = '<div class="sc-big">🛡</div><p><b>Dur · Düşün · Sor</b><br>Emin değilseniz bir yakınınıza danışın.</p>'; } },
  ],
};
