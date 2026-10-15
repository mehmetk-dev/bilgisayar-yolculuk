// 9. hafta ek dersleri: yanıtla / ilet / Bilgi (Cc) / Gizli (Bcc) / taslak; gelen belgeyi indirip taşımak; şifremi unuttum
import { K, desktopReady, maxed } from './common.js';
import { rehberSoru } from './kalip.js';
import { deliverMail } from '../apps/mail.js';
import { HESAP_MAIL } from '../apps/siteler-hesap.js';

const mailOpen = (c) => maxed(c, 'mail');
const br = (c, url) => maxed(c, 'browser', url ? { url } : {});

export const epostaIletme = {
  id: 'eposta-iletme', icon: '↪', title: 'E-posta: yanıtla, ilet, Bilgi (Cc), Gizli (Bcc) ve taslak', minutes: 30, stage: 'desktop',
  desc: 'Yanıtlamak ile iletmenin farkı, çok kişiye posta atarken Bilgi (Cc) ve Gizli (Bcc) kullanımı, yarım kalan postayı Taslaklar\'da bulmak.',
  summary: [
    ['↩ Yanıtla', 'Yalnızca size yazana cevap verir'],
    ['↪ İlet', 'Postayı başka birine gönderir; “Kime”yi siz yazarsınız'],
    ['Bilgi (Cc)', 'Bilgisi olsun istediğiniz kişiler; herkes birbirinin adresini görür'],
    ['Gizli (Bcc)', 'Alıcılar birbirini görmez; kalabalık duyuru için en güvenlisi'],
    ['Birden çok adres', 'Noktalı virgülle ayrılır: ali@ornek.com; ayse@ornek.com'],
    ['📝 Taslaklar', 'Yarım kalan posta kendiliğinden buraya kaydedilir'],
  ],
  steps: [
    {
      title: 'Yanıtla mı, ilet mi?',
      html: `<p>Gelen bir postayla iki şey yapabilirsiniz:</p>
        <ul class="big-list"><li><b>↩ Yanıtla</b>: size yazana cevap verirsiniz.</li><li><b>↪ İlet</b>: postayı <b>başka birine</b> gönderirsiniz (örneğin faturayı oğlunuza).</li></ul>
        <p>Ayrıca bir postayı <b>çok kişiye</b> atarken <b>Bilgi (Cc)</b> ve <b>Gizli (Bcc)</b> kutuları vardır.</p>`,
      setup: (c) => {
        desktopReady(c); c.d.closeAll();
        deliverMail(c.d, { key: 'fatura', from: 'fatura@elektrik-dagitim.com.tr', fromName: 'Elektrik Dağıtım', subject: 'Ekim ayı faturanız', time: '10:05', body: 'Sayın abonemiz,\n\nEkim ayı elektrik faturanız ekte yer almaktadır. Son ödeme tarihi 25 Ekim\'dir.\n\nElektrik Dağıtım', attachments: [{ name: 'elektrik faturası ekim.pdf', content: '' }] }, true);
      },
    },
    {
      title: 'Faturayı oğlunuza iletin',
      html: `<p>Gelen Kutusu'ndaki <b>Ekim ayı faturanız</b> postasını açın. Üstteki <b>↪ İlet</b>'e tıklayın.</p>
        <p><b>Kime</b>: <b>ahmet@ornek.com</b> (oğlunuz). Faturayı ödemesi için bir cümle yazıp <b>Gönder</b>.</p>`,
      hint: 'Konu kendiliğinden “İlt: …” olur ve fatura eki yanında gelir; siz yalnızca Kime ve kısa bir not ekleyin.',
      setup: mailOpen,
      on: (ev, c) => {
        if (ev.type !== 'mail-send') return false;
        if (!ev.forwardOf) { c.warn('Posta gitti ama iletme değil. Faturayı açıp ↪ İlet\'e tıklamalıydınız.'); return false; }
        if (!ev.toList.includes('ahmet@ornek.com')) { c.warn(`Posta <b>${ev.to}</b> adresine gitti. Oğlunuzun adresi: ahmet@ornek.com`); return false; }
        return true;
      },
      done: 'Fatura ekiyle birlikte oğlunuza gitti. İletilen postanın en üstüne kendi notunuzu yazmayı unutmayın.',
    },
    {
      title: 'Bilgi (Cc) ekleyin',
      html: `<p>Şimdi yeni bir posta: <b>✏ Yeni posta</b>. <b>Kime</b>: <b>elif@ornek.com</b>. <b>Kime</b> kutusunun yanındaki <b>Bilgi / Gizli</b> bağlantısına tıklayın; <b>Bilgi (Cc)</b>'ye <b>hoca@ornek.com</b> yazın. Konu: <b>Bahçe</b>. Gönderin.</p>
        <p class="mut"><b>Bilgi (Cc)</b>: asıl alıcı Elif; hocanın da haberi olsun. Herkes herkesi görür.</p>`,
      hint: 'Bilgi / Gizli bağlantısı Kime kutusunun sağında, mavi altı çizili.',
      on: (ev, c) => {
        if (ev.type !== 'mail-send') return false;
        if (!ev.toList.includes('elif@ornek.com')) { c.warn('Kime kutusuna elif@ornek.com yazın.'); return false; }
        if (!ev.cc.includes('hoca@ornek.com')) { c.warn('Bilgi (Cc) alanına hoca@ornek.com yazmalıydınız. “Bilgi / Gizli” bağlantısıyla alanı açın.'); return false; }
        return true;
      },
      done: 'Elif asıl alıcı, hoca “bilgi” alıcısı. İkisi de posta geldiğini ve kimlere gittiğini görür.',
    },
    {
      title: 'Gizli (Bcc) ile duyuru',
      html: `<p>Mahalle komşularına bayram mesajı atacaksınız. Komşuların e-posta adresleri birbirine <b>görünmemeli</b>; yoksa adresler tanımadıkları kişilerin eline de geçer.</p>
        <p>Yeni posta açın. <b>Kime</b>'ye kendi adresinizi (<b>ogrenci@ornek.com</b>), <b>Gizli (Bcc)</b>'ye iki komşuyu <b>noktalı virgülle</b> yazın: <b>fatma@ornek.com; ayse@ornek.com</b>. Konu: <b>Bayramınız mübarek olsun</b>. Gönderin.</p>`,
      hint: 'Bcc alanı Cc\'nin altında. İki adres arasına ; (noktalı virgül) koyun: Shift + virgül tuşu.',
      on: (ev, c) => {
        if (ev.type !== 'mail-send') return false;
        if (ev.bcc.length < 2) { c.warn('Gizli (Bcc) alanına iki adres yazmalıydınız: fatma@ornek.com; ayse@ornek.com'); return false; }
        return true;
      },
      done: 'Komşular birbirinin adresini görmez. Kalabalık gruplara posta atarken (duyuru, bayram mesajı) Bcc en güvenlisidir; yoksa adresleriniz ortalığa saçılır.',
    },
    {
      title: 'Yarım kalan posta',
      html: `<p>Posta yazarken telefon çaldı ve yazmayı yarıda bıraktınız. Bunu şöyle canlandıralım: <b>✏ Yeni posta</b>'ya tıklayın, Kime'ye <b>hoca@ornek.com</b>, Konu'ya <b>Ödevim</b> yazın (mesajı yazmayın). Sonra soldaki <b>📥 Gelen Kutusu</b>'na tıklayın.</p>
        <p class="mut">Posta kaybolmaz: kendiliğinden <b>Taslak</b> olarak kaydedilir.</p>`,
      on: (ev) => ev.type === 'mail-draft-save',
      done: 'Sağ altta “Taslak kaydedildi” çıktı.',
    },
    {
      title: 'Taslakta bulun',
      html: '<p>Soldaki <b>📝 Taslaklar</b>\'a tıklayın, <b>Ödevim</b> taslağını açıp mesajı yazın ve gönderin.</p>',
      hint: 'Taslaklar klasörü Gelen Kutusu\'nun hemen altında.',
      on: (ev, c) => {
        if (ev.type === 'mail-draft-open') c.note('Taslak açıldı. Mesaj kutusuna bir şeyler yazıp ➤ Gönder\'e basın.');
        return ev.type === 'mail-send' && ev.subject === 'Ödevim';
      },
      done: 'Taslak gönderildi ve Taslaklar klasöründen kalktı. Yarım işleriniz hep orada bekler.',
    },
    rehberSoru({
      title: 'Hangi alan?',
      html: '<p>30 kişilik bir kursun herkesine duyuru atacaksınız. Kimsenin adresi diğerlerine görünmesin istiyorsunuz. Hepsini nereye yazarsınız?</p>',
      opts: ['Kime', 'Bilgi (Cc)', 'Gizli (Bcc)'], ok: 2,
      wrong: 'Bu alanlarda herkes birbirinin adresini görür. Gizli olanı seçin.',
      why: 'Doğru: Gizli (Bcc). Alıcılar birbirinin adresini göremez. Kime ya da Cc\'ye yazarsanız hepsi görür.',
    }),
    rehberSoru({
      title: 'Yanıtla / İlet',
      html: '<p>Hocadan bir davet postası geldi, bunu komşunuza da göstermek istiyorsunuz. Ne yaparsınız?</p>',
      opts: ['↩ Yanıtla', '↪ İlet ve Kime\'ye komşunun adresini yazarım', 'Sil'], ok: 1,
      wrong: 'Yanıtla yalnızca gönderene cevap verir, başkasına göndermez.',
      why: 'Doğru: ↪ İlet, postayı (ekleriyle) başkasına gönderir.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>E-postada kalabalık ve yarım işler:</p>' },
  ],
};

export const ekTasi = {
  id: 'ek-tasi', icon: '📎', title: 'Gelen belgeleri indirmek ve kendi klasörünüze taşımak', minutes: 25, stage: 'desktop',
  desc: 'E-postayla gelen fatura ve tahlil sonucunu İndirilenler klasöründe bulup Belgeler içindeki kendi klasörünüze taşımak; dosyaya anlaşılır ad vermek.',
  summary: [
    ['⬇ İndir', 'Eki bilgisayara kaydeder (İndirilenler)'],
    ['İndirilenler', 'Her indirme önce buraya düşer; zamanla dağılır'],
    ['Kendi klasörünüz', 'Faturalar, Sağlık gibi klasörler açıp belgeleri oraya taşıyın'],
    ['Taşıma', 'Ctrl + X, Ctrl + V ya da sürükle-bırak; aslı yeni yerde durur'],
    ['Dosya adı', 'Anlaşılır yapın: “tahlil sonucu ekim 2026.pdf”'],
  ],
  steps: [
    {
      title: 'Belgeler nerede?',
      html: `<p>E-postayla fatura, tahlil sonucu gibi belgeler gelir. İndirdiğiniz her dosya önce <b>İndirilenler</b> klasörüne düşer. Zamanla orası <b>çöplüğe</b> dönüşür: bir yıl sonra "tahlilim neredeydi?" diye aranırsınız.</p>
        <p>Çözüm: belgeleri indirir indirmez <b>kendi klasörünüze</b> taşımak.</p>`,
      setup: (c) => {
        desktopReady(c); c.d.closeAll();
        deliverMail(c.d, { key: 'tahlil', from: 'sonuc@devlet-hastanesi.gov.tr', fromName: 'Devlet Hastanesi', subject: 'Tahlil sonucunuz', time: '09:30', body: 'Sayın hastamız,\n\nTahlil sonucunuz ekte yer almaktadır. Doktor kontrolünüz için randevu alabilirsiniz.\n\nDevlet Hastanesi', attachments: [{ name: 'tahlil sonucu.pdf', content: '' }] }, true);
      },
    },
    {
      title: 'Tahlil sonucunu indirin',
      html: '<p>E-postayı açın, <b>Tahlil sonucunuz</b> postasındaki eki <b>⬇ İndir</b> ile indirin.</p>',
      setup: mailOpen,
      on: (ev) => ev.type === 'mail-download' && /tahlil/i.test(ev.name),
      done: 'Dosya <b>İndirilenler</b> klasörüne düştü.',
    },
    {
      title: 'Sağlık klasörü açın',
      html: `<p>Dosya Gezgini'ni açın (⊞ Başlat → 📁). <b>Belgeler</b> klasörüne girin ve içinde <b>Sağlık</b> adında yeni bir klasör oluşturun: boşluğa <b>sağ tık → Yeni → Klasör</b>, adını yazıp Enter.</p>`,
      setup: (c) => c.d.ensure('explorer', { folder: 'docs' }),
      hint: 'Belgeler klasöründeki boş alana sağ tıklayın.',
      on: (ev, c) => ev.type === 'fs' && !!c.d.fs.children('docs').find((n) => n.type === 'folder' && /^sağlık$/i.test(n.name)),
      check: (c) => !!c.d.fs.children('docs').find((n) => n.type === 'folder' && /^sağlık$/i.test(n.name)),
      done: 'Belgeler → Sağlık klasörü hazır.',
    },
    {
      title: 'Tahlil sonucunu taşıyın',
      html: `<p><b>İndirilenler</b> klasöründeki <b>tahlil sonucu.pdf</b>'yi <b>Belgeler → Sağlık</b> klasörüne <b>taşıyın</b>: dosyaya tıklayın, ${K('Ctrl', 'X')} (kes); Sağlık klasörüne girip ${K('Ctrl', 'V')} (yapıştır). Ya da fareyle klasörün üzerine sürükleyin.</p>`,
      hint: 'İndirilenler klasörü Dosya Gezgini\'nin solunda. Dosyayı Sağlık klasörüne sürükleyip bırakmak da olur.',
      setup: (c) => c.d.ensure('explorer', { folder: 'downloads' }),
      on: (ev, c) => {
        if (!['fs', 'file-paste', 'drop'].includes(ev.type)) return false;
        const inSaglik = c.d.fs.children('docs').some((n) => n.type === 'folder' && /^sağlık$/i.test(n.name) && c.d.fs.children(n.id).some((f) => /tahlil/i.test(f.name)));
        const inDownloads = c.d.fs.children('downloads').some((f) => /tahlil/i.test(f.name));
        if (inSaglik && inDownloads) c.note('Dosya iki yerde duruyor: kopyaladınız. Taşımak için İndirilenler\'deki asıl dosyayı silin ya da baştan Kes (Ctrl + X) ile deneyin.');
        return inSaglik && !inDownloads;
      },
      done: 'Tahlil sonucu artık <b>Belgeler → Sağlık</b>\'ta. İndirilenler\'de kalmadı (taşıdınız, kopyalamadınız).',
    },
    {
      title: 'Adını anlaşılır yapın',
      html: '<p>Sağlık klasöründeki dosyaya <b>sağ tık → Yeniden adlandır</b> deyip adını <b>tahlil sonucu ekim 2026.pdf</b> yapın. Bir yıl sonra bile ne olduğunu hatırlarsınız.</p>',
      hint: 'Dosyayı seçip F2 tuşuna da basabilirsiniz. Uzantıyı (.pdf) silmeyin.',
      on: (ev, c) => (ev.type === 'fs') && c.d.fs.children('docs').some((n) => n.type === 'folder' && /^sağlık$/i.test(n.name) && c.d.fs.children(n.id).some((f) => /ekim 2026/i.test(f.name) && /\.pdf$/i.test(f.name))),
      done: 'Tarihli, açık adlar bulmayı kolaylaştırır.',
    },
    rehberSoru({
      title: 'Neden taşıyoruz?',
      html: '<p>Belgeleri İndirilenler klasöründe bırakmak neden iyi değil?</p>',
      opts: ['Orada dosya durmaz, kendiliğinden silinir', 'Zamanla yüzlerce dosya birikir, aradığınızı bulamazsınız', 'İndirilenler klasörü bozulabilir'], ok: 1,
      wrong: 'Bu pek öyle değil. Orada her şey birikir.',
      why: 'Doğru. İndirilenler karışıktır; önemli belgeleri adlı bir klasöre almak bulmayı kolaylaştırır.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Gelen belgeleri düzenli saklayabiliyorsunuz:</p>' },
  ],
};

export const sifreSifirla = {
  id: 'sifre-sifirla', icon: '🔑', title: '“Şifremi unuttum!” Şimdi ne olacak?', minutes: 25, stage: 'desktop',
  desc: 'E-posta ya da e-Devlet şifresini unutunca panik yapmadan sıfırlamak: “Şifremi unuttum”, telefona gelen SMS kodunu ekrana girmek, yeni şifre belirlemek, güvenli şifre defteri.',
  summary: [
    ['Giriş sayfası', '“Şifremi unuttum” bağlantısı genellikle şifre kutusunun altındadır'],
    ['Doğrulama kodu', 'SMS ile gelir; yalnızca ilgili sayfaya yazılır'],
    ['Kimse kodu sormaz', 'Telefonla arayan “kodu söyleyin” derse dolandırıcıdır'],
    ['Yeni şifre', '8+ karakter, büyük-küçük harf, rakam; eskisi olmasın'],
    ['Şifre defteri', 'Evde güvenli yerde; “banka şifresi: …” diye açıkça yazmayın'],
    ['Aynı şifreyi her yerde kullanmayın', 'Biri çalınırsa hepsi gider'],
  ],
  steps: [
    {
      title: 'Şifreyi unuttum',
      html: `<p>Herkesin başına gelir: e-postaya ya da bir siteye girmek istersiniz, şifre <b>aklınızdan çıkmıştır</b>. Bilgisayar bozulmadı; hesabınızı <b>sıfırlayabilirsiniz</b>.</p>
        <p>Alıştırma için <b>E-Hesabım</b> sitesi var. Hesabınız: <b>${HESAP_MAIL}</b>. Şifrenizi unuttuğunuzu varsayın.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'Siteyi açın',
      html: '<p>İnternet\'i açın ve adres çubuğuna <b>www.e-hesabim.com.tr</b> yazın.</p>',
      setup: (c) => br(c),
      on: (ev) => ev.type === 'web-nav' && ev.host === 'www.e-hesabim.com.tr',
    },
    {
      title: 'Yanlış şifre',
      html: `<p>E-posta kutusuna <b>${HESAP_MAIL}</b>, şifre olarak aklınıza gelen <b>bir şifre</b> (örneğin <b>Kedi2020</b>) yazıp <b>Giriş yap</b>'a tıklayın. Hata çıkacak.</p>`,
      on: (ev) => ev.type === 'hesap-login' && !ev.ok,
      done: 'Bu hata normal. Şifreyi tahmin etmeye devam edip hesabı kilitletmek yerine sıfırlayın.',
    },
    {
      title: 'Şifremi unuttum',
      html: '<p>Şifre kutusunun altındaki <b>Şifremi unuttum</b> bağlantısına tıklayın.</p>',
      on: (ev) => ev.type === 'web-nav' && ev.path === '/sifirla',
      done: 'Sıfırlama sayfası açıldı.',
    },
    {
      title: 'Kod isteyin',
      html: `<p>E-posta adresinizi yazın: <b>${HESAP_MAIL}</b> ve <b>Kod gönder</b>'e tıklayın.</p>`,
      hint: 'Adresi aynen yazın, Türkçe harf ve boşluk olmasın.',
      on: (ev, c) => { if (ev.type === 'hesap-send' && !ev.ok) c.note('Bu adresle kayıtlı hesap yok. Adres: ogrenci@ornek.com'); return ev.type === 'hesap-send' && ev.ok; },
      done: 'Telefonunuza SMS gönderildi. Ekranın sağ altında “SMS · E-HESABIM” çıkacak.',
    },
    {
      title: 'Kodu yazın',
      html: '<p>Sağ altta çıkan <b>SMS</b>\'teki <b>6 haneli kodu</b> okuyup sayfadaki kutuya yazın ve <b>Doğrula</b>\'ya tıklayın.</p><p class="mut">SMS birkaç saniye içinde gelir. Kayboldu ise “Yeniden gönder”e basın.</p>',
      hint: 'Kod 6 rakamdır. SMS kutusu 40 saniye kalır.',
      on: (ev, c) => { if (ev.type === 'hesap-verify' && !ev.ok) c.note('Kod yanlış. SMS\'teki 6 haneli sayıyı dikkatle yazın.'); return ev.type === 'hesap-verify' && ev.ok; },
      done: 'Kimliğiniz doğrulandı. Bu kodu hiçbir telefon görüşmesinde söylememelisiniz.',
    },
    {
      title: 'Yeni şifre belirleyin',
      html: `<p>İki kutuya da <b>aynı yeni şifreyi</b> yazın. Şifre en az <b>8 karakter</b> olsun, hem <b>büyük hem küçük harf</b> ve bir <b>rakam</b> içersin. Eski şifre (Kedi2019) olmasın.</p>
        <p class="mut">Örnek bir fikir: sevdiğiniz bir cümle ➜ “Ben3Yilda1Kez!”. (Bu örneği değil, kendi şifrenizi yazın.)</p>`,
      on: (ev, c) => { if (ev.type === 'hesap-newpass' && !ev.ok) c.note('Şifre kabul edilmedi; kırmızı uyarıyı okuyup düzeltin.'); return ev.type === 'hesap-newpass' && ev.ok; },
      done: 'Yeni şifreniz kaydedildi. Şimdi onu bir yere yazalım ki yine unutmayın.',
    },
    {
      title: 'Yeni şifreyle girin',
      html: `<p>Sayfadaki <b>giriş yapabilirsiniz</b> bağlantısına tıklayın. E-posta: <b>${HESAP_MAIL}</b>, şifre: <b>az önce belirlediğiniz yeni şifre</b>.</p>`,
      on: (ev, c) => { if (ev.type === 'hesap-login' && !ev.ok) c.note('Şifre uymadı. Az önce belirlediğiniz yeni şifreyi yazın.'); return ev.type === 'hesap-login' && ev.ok && ev.newPass; },
      done: 'Hesabınıza girdiniz. Çıkış yapmayı unutmayın.',
    },
    rehberSoru({
      title: 'Telefon geldi',
      html: '<p>Biri sizi arıyor: “Hesabınız bloke oldu, size gelen <b>SMS kodunu</b> bana söyler misiniz, açalım.” Ne yaparsınız?</p>',
      opts: ['Kodu söylerim, yardımcı oluyor', 'Telefonu kapatırım; kodu kimseye söylemem', 'Kodu yarısını söylerim'], ok: 1,
      wrong: 'Bu dolandırıcılığın klasik yolu. Kod kimseye söylenmez.',
      why: 'Doğru. Doğrulama kodu yalnızca sizin yazmanız içindir; hiçbir görevli sizi arayıp kodu istemez. İsteyen dolandırıcıdır.',
    }),
    rehberSoru({
      title: 'Şifre defteri',
      html: '<p>Şifrelerinizi nasıl saklarsınız?</p>',
      opts: ['Hepsi için aynı şifre, böylece unutmam', 'Evde güvenli yerde bir defterde; her hesap için farklı şifre', 'Monitöre yapışkan notla'], ok: 1,
      wrong: 'Bu pek güvenli değil. Aynı şifre ya da görünür not, başkalarının işini kolaylaştırır.',
      why: 'Doğru. Her hesaba ayrı şifre ve güvenli yerde saklanan defter en iyisidir. Bir şifre çalınırsa öbürleri etkilenmez.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Şifrenizi unutunca ne yapacağınızı biliyorsunuz:</p>' },
  ],
};
