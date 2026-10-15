// Ek ders: yapay zekâ ile yazışmak (dijital yardımcı). Resmî yazıyı özetletmek, tarif ve gezi planı, dilekçe taslağı;
// kimlik ve kart bilgisi yazmama kuralı; cevabı doğrulama.
import { desktopReady, maxed } from './common.js';
import { rehberSoru } from './kalip.js';
import { YZ_HOST } from '../apps/siteler-yz.js';

const br = (c, url) => { const w = maxed(c, 'browser'); if (url) w.api.go(url, 'link'); return w; };
const nav = (host) => (ev) => ev.type === 'web-nav' && ev.host === host;

export const yapayZeka = {
  id: 'yapay-zeka', icon: '🤖', title: 'Yapay zekâya soru soralım (Dijital Yardımcınız)', minutes: 30, stage: 'desktop',
  desc: 'Yapay zekâyla yazışmak: özet, tarif, dilekçe taslağı; kişisel bilgi yazmama kuralı.',
  summary: [
    ['Soru yazmak', 'Sade Türkçeyle yazın: ne istediğinizi, kaç kişilik, kaç gün gibi ayrıntıları ekleyin'],
    ['Özetletmek', 'Uzun resmî yazıyı yapıştırıp “özetler misin?” deyin'],
    ['Taslak', 'Dilekçe, mektup, tebrik yazdırın; kendi bilgilerinizi (ad, tarih, imza) siz ekleyin'],
    ['Asla yazmayın', 'T.C. kimlik no, kart numarası, CVV, IBAN, şifre, SMS kodu'],
    ['Doğrulayın', 'Yapay zekâ yanılabilir ya da uydurabilir; önemli bilgiyi resmî kaynaktan kontrol edin'],
    ['Karar sizin', 'Tıbbi, hukuki ve parasal konularda uzmana danışın'],
  ],
  steps: [
    {
      title: 'Dijital yardımcı',
      html: `<p><b>Yapay zekâ</b>, yazdığınız soruya insan gibi cevap veren bir bilgisayar programıdır. Ona <b>sohbet eder gibi</b> yazarsınız: bir yazıyı <b>özetletir</b>, <b>tarif</b> sorar, <b>gezi planı</b> ya da <b>dilekçe taslağı</b> yazdırırsınız.</p>
        <p>İki önemli kural var: ona <b>asla özel bilgilerinizi yazmayın</b> ve verdiği cevabı <b>kontrol edin</b>, çünkü yanılabilir. Bu derste alıştırma için hazırlanmış bir <b>Dijital Yardımcı</b> kullanacağız.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); br(c); },
    },
    {
      title: 'Yardımcıyı açın',
      html: `<p>Adres çubuğuna <b>${YZ_HOST}</b> yazın.</p>`,
      on: nav(YZ_HOST),
      done: 'Sohbet ekranı açıldı. Altta hazır sorular var.',
    },
    {
      title: 'Resmî yazıyı özetletin',
      html: '<p>Belediyeden gelen uzun bir yazıyı okumak yorucu. <b>📄 Resmî yazıyı özetlet</b> düğmesine tıklayın (yazı kutuya yerleşir; gerçekte kopyalayıp yapıştırırsınız), sonra <b>➤ Gönder</b>\'e basın.</p>',
      hint: 'Düğme sohbet kutusunun hemen üstünde. Kutuda yazı belirince Gönder\'e basın.',
      on: (ev) => ev.type === 'ai-ask' && ev.intent === 'ozet',
      done: 'Birkaç saniye bekleyin: yardımcı özetleyecek.',
    },
    {
      title: 'Özeti okuyun',
      html: '<p>Yardımcının cevabını okuyun. Kurs hangi günler yapılacak? Cevabın altında <b>🔎 Doğru mu? Kontrol et</b> düğmesi var; ona tıklayın.</p>',
      on: (ev) => ev.type === 'ai-verify' && ev.ok,
      done: 'Özet doğru çıktı: tarihler ve saatler yazıyla uyuşuyor. Yine de resmî bir işlemde asıl yazıya da bakın.',
    },
    {
      title: 'Yemek tarifi isteyin',
      html: '<p>Kendi cümlenizle bir yemek tarifi isteyin. Örneğin: <b>Mercimek çorbası tarifi verir misin?</b> (Düğmeyi kullanmadan kutuya kendiniz yazın.)</p>',
      hint: 'Sohbet kutusuna tıklayıp yazın, Gönder\'e basın. “tarif” kelimesi geçsin.',
      on: (ev) => ev.type === 'ai-ask' && ev.intent === 'tarif',
      done: 'Tarif geldi: malzeme ve adımlarıyla. Sağlık sorununuz varsa yine de doktorunuza danışın.',
    },
    {
      title: 'Gezi planı isteyin',
      html: '<p>Şimdi bir <b>gezi planı</b> isteyin: <b>Kapadokya için 3 günlük gezi planı yazar mısın?</b></p>',
      on: (ev) => ev.type === 'ai-ask' && ev.intent === 'gezi',
      done: 'Plan geldi. Cevabın sonuna dikkat: “saatleri ve fiyatları resmî sitelerden kontrol edin” diyor; haklı.',
    },
    {
      title: 'Dilekçe taslağı',
      html: '<p><b>📝 Dilekçe taslağı</b> düğmesini kullanarak (ya da kendiniz yazarak) sokaktaki bozuk lamba için muhtarlığa <b>dilekçe taslağı</b> isteyin.</p>',
      on: (ev) => ev.type === 'ai-ask' && ev.intent === 'dilekce',
      done: 'Taslak hazır. Köşeli parantezleri ([tarih], [adınız]) siz kendi belgenizde doldurursunuz. Taslağı Kelime İşlemci\'ye kopyalayıp düzenleyebilirsiniz.',
    },
    {
      title: 'Özel bilgi yazmayı deneyin',
      html: `<p>Dilekçeye kimliğinizi ekletmek istediğinizi düşünün. Kutuya şunu yazıp gönderin:<br><b>Dilekçeye T.C. kimlik numaramı da ekle: 12345678901</b></p>
        <p class="mut">Gerçek yapay zekâ sizi uyarmayabilir ve yazdıklarınızı saklayabilir. Bu alıştırma sitesi uyaracak.</p>`,
      on: (ev) => ev.type === 'ai-sensitive',
      done: 'Mesajınız gönderilmedi ve kırmızı uyarı çıktı. İşte yapay zekâya <b>yazılmaması</b> gerekenler: T.C. kimlik, kart numarası ve CVV, IBAN, şifre, SMS kodu.',
    },
    rehberSoru({
      title: 'Hangisini yazmazsınız?',
      html: '<p>Yapay zekâya hangisini <b>kesinlikle yazmazsınız</b>?</p>',
      opts: ['Çorba tarifi istemek', 'Banka kart numarasını ve arkasındaki 3 haneli kodu', 'Hangi kitabı okuyayım diye sormak'], ok: 1,
      wrong: 'Bu sorular zararsız. Para çalınmasına yol açabilecek olan hangisi?',
      why: 'Doğru. Kart numarası ve CVV, T.C. kimlik, IBAN ve şifre hiçbir yapay zekâya ve sohbete yazılmaz.',
    }),
    {
      title: 'Bilmediği şeyi sorun',
      html: '<p>Şimdi bir tuzak: <b>Mahallemizin muhtarı kim?</b> diye sorun.</p>',
      on: (ev) => ev.type === 'ai-ask' && ev.intent === 'yerel',
      done: 'Çok emin bir cevap verdi: isim, saat, telefon… Ama yapay zekâ sizin mahallenizi bilebilir mi?',
    },
    {
      title: 'Doğru mu? Kontrol edin',
      html: '<p>Cevabın altındaki <b>🔎 Doğru mu? Kontrol et</b>\'e tıklayın ve sonucu okuyun.</p>',
      on: (ev) => ev.type === 'ai-verify' && !ev.ok,
      done: 'Turuncu uyarı çıktı: güvenilir kaynak bulunamadı. Yapay zekâ bilmediği şeyi de <b>emin bir sesle uydurabilir</b>.',
    },
    rehberSoru({
      title: 'Ne yaparsınız?',
      html: '<p>Yapay zekâ size bir doktor ismi, telefon numarası ve çalışma saatleri verdi. Bu bilgiyle ne yaparsınız?</p>',
      opts: ['Doğrudan güvenirim', 'Resmî kaynaktan (e-Nabız, MHRS, hastane sitesi) ya da telefonla doğrularım', 'Hiç bakmam'], ok: 1,
      wrong: 'Kontrol etmeden güvenmek tehlikeli olabilir.',
      why: 'Doğru. Yapay zekâ güçlü bir yardımcıdır ama her zaman haklı değildir. Önemli bilgileri (sağlık, para, adres, telefon) resmî kaynaktan doğrulayın.',
    }),
    rehberSoru({
      title: 'İyi bir soru',
      html: '<p>Hangi soru yapay zekâdan <b>daha iyi cevap</b> alır?</p>',
      opts: ['Yemek', 'Dört kişilik, etsiz, 30 dakikada hazır olan bir akşam yemeği tarifi ver', 'Ne yapayım?'], ok: 1,
      wrong: 'Bu çok kısa ve belirsiz. Daha ayrıntılı bir soru düşünün.',
      why: 'Doğru. Kaç kişilik, nasıl bir yemek, ne kadar zamanınız olduğu gibi ayrıntıları yazdıkça cevap daha işinize yarar olur.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Yapay zekâyı akıllıca kullanmayı öğrendiniz:</p>' },
  ],
};
