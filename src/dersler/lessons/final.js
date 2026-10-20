// Ek bölüm: Kurs bitirme sınavı (15 haftanın tamamından 28 soru; %70 ve üstünde belge yazdırılır)
// ve Büyük parkur (torunun doğum günü: klasör, davetiye, harcama tablosu, e-posta, harita, sanal kart).
import { desktopReady, norm } from './common.js';
import { test } from './testler.js';
import { HARITA_HOST } from '../apps/siteler-harita.js';
import { BANKA_HOST, BANKA_SIFRE } from '../apps/siteler-banka.js';
import { KURS_TC } from '../apps/siteler-gunluk.js';

export const kursSinavi = {
  ...test({
    id: 'kurs-sinavi', icon: '🎓', title: 'Kurs bitirme sınavı (15 haftanın özeti)',
    desc: '15 haftanın tamamından 28 soru. Soruların en az %70\'ini ilk denemede bilirseniz kurs bitirme belgenizi yazdırabilirsiniz.',
    intro: '15 hafta boyunca öğrendiklerimizi',
    scene: '<div class="sc-big">🎓</div><p>Kurs bitirme sınavı</p>',
    qs: [
      { t: '1. Dosya açmak', pic: '🖱🖱', q: 'Masaüstündeki bir dosyayı açmak için ne yaparız?', opts: ['Bir kez sağ tıklarız', 'Sol tuşla hızlıca iki kez tıklarız (çift tık)', 'Fareyi sallarız'], ok: 1, why: 'Çift tık dosyayı açar. Tek tık yalnızca seçer, sağ tık menüyü açar.' },
      { t: '2. Büyük harf', pic: '⇧ A', q: 'Yazının arasında tek bir büyük harf yazmak için?', opts: ['Shift\'i basılı tutup harfe basarım', 'Caps Lock\'a iki kez basarım', 'Enter\'a basarım'], ok: 0, why: 'Shift tek harf içindir. Caps Lock açık kalırsa her şey büyük yazılır.' },
      { t: '3. Geri al', pic: '↶', q: 'Yanlışlıkla bir paragrafı sildiniz. En hızlı çare?', opts: ['Ctrl + Z', 'Bilgisayarı kapatmak', 'Ctrl + P'], ok: 0, why: 'Ctrl + Z son yaptığınızı geri alır; birkaç kez basılırsa daha geriye gider.' },
      { t: '4. Kopyala yapıştır', pic: '📋', q: 'Bir yazıyı kopyalayıp başka yere koymanın kısayolları hangileri?', opts: ['Ctrl + C, sonra Ctrl + V', 'Ctrl + X, sonra Ctrl + S', 'Alt + F4'], ok: 0, why: 'Ctrl + C kopyalar, Ctrl + V yapıştırır. Ctrl + X keser (taşır).' },
      { t: '5. Yan yana', pic: '🪟🪟', q: 'Bir pencereyi ekranın sol yarısına yerleştirmek için?', opts: ['⊞ Windows tuşu + ← (sol ok)', 'Ctrl + Home', 'Pencereyi küçültmek'], ok: 0, why: 'Windows tuşu ve sol ok; sonra öbür pencereyi sağ yarıya seçersiniz.' },
      { t: '6. Kayıp dosya', pic: '🕵️', q: 'Az önce kaydettiğiniz dosyanın yerini unuttunuz. Nereye bakarsınız?', opts: ['Dosya Gezgini → Giriş → Son kullanılan dosyalar', 'Geri Dönüşüm Kutusu', 'Denetim Masası'], ok: 0, why: 'Giriş sayfası son açtığınız ve kaydettiğiniz dosyaları listeler; sağ tıkla dosyanın konumu açılır.' },
      { t: '7. Tek tek seçmek', pic: 'Ctrl + 🖱', q: '50 fotoğraftan yalnızca beğendiğiniz 5\'ini seçmek için?', opts: ['Ctrl\'yi basılı tutup tek tek tıklarım', 'Shift\'i basılı tutup ilk ve son fotoğrafa tıklarım', 'Hepsini silerim'], ok: 0, why: 'Ctrl ile aradan istediklerinizi seçersiniz; Shift ise baştan sona aralık seçer.' },
      { t: '8. İnternet yok', pic: '📶❌', q: 'Wi-Fi bağlı görünüyor ama hiçbir site açılmıyor. İlk ne yaparsınız?', opts: ['Modemi kapatıp 10 saniye bekler, yeniden açarım', 'Bilgisayarı satarım', 'Klavyeyi değiştiririm'], ok: 0, why: 'Çoğu bağlantı sorunu modemi yeniden başlatınca düzelir. Işıklar yanınca 1–2 dakika bekleyin.' },
      { t: '9. İngilizce pencere', pic: 'Allow · Block', q: 'Bir site “… wants to show notifications · Allow / Block” diyor. Bildirim istemiyorsanız?', opts: ['Block', 'Allow', 'Next'], ok: 0, why: 'Allow izin ver, Block engelle demektir. Gereksiz bildirimleri engelleyin.' },
      { t: '10. Şüpheli ek', pic: '📎 fatura.exe', q: 'Tanımadığınız birinden “fatura.exe” ekli bir e-posta geldi. Ne yaparsınız?', opts: ['Açmam, silerim', 'Hemen açarım', 'Herkese iletirim'], ok: 0, why: '.exe bir programdır; fatura olamaz. Virüs olabilir.' },
      { t: '11. Güçlü şifre', pic: '🔑', q: 'Hangisi daha güçlü bir şifredir?', opts: ['123456', 'Mavi.Kedi-2026!Bahçe', 'Doğum tarihiniz'], ok: 1, why: 'Uzun, harf-rakam-işaret karışık ve tahmin edilemeyen şifre güçlüdür.' },
      { t: '12. Gizli alıcı', pic: '✉ Bcc', q: 'Bir duyuruyu 30 kişiye, adresleri birbirini görmeden göndermek için hangi kutuyu kullanırsınız?', opts: ['Gizli (Bcc)', 'Bilgi (Cc)', 'Konu'], ok: 0, why: 'Bcc\'deki adresleri alıcılar göremez. Cc\'dekiler herkese görünür.' },
      { t: '13. Reklam postaları', pic: '📰', q: 'Her gün gelen reklam bültenlerinden kurtulmanın doğru yolu?', opts: ['Postanın içindeki “Abonelikten çık” bağlantısı', 'Bilgisayarı kapatmak', 'Her gün tek tek silmek'], ok: 0, why: 'Abonelikten çıkınca bülten gelmez; posta kutunuz dolmaz.' },
      { t: '14. Kaçan resim', pic: '🖼', q: 'Word\'de resim yazının arasında sıkışıyor, sürüklenmiyor. Ne yaparsınız?', opts: ['Düzen Seçenekleri → Metni kaydır: Kare ya da Sıkı', 'Resmi silerim', 'Yazıyı büyütürüm'], ok: 0, why: 'Kare/Sıkı seçilince resim yazının yanında serbestçe taşınır.' },
      { t: '15. Biçim boyacısı', pic: '🖌', q: 'Bir başlığın rengini ve boyutunu başka başlıklara tek tıkla kopyalamak için?', opts: ['Biçim Boyacısı', 'Ctrl + P', 'Satır aralığı'], ok: 0, why: 'Biçim Boyacısı biçimi alır; çift tıklarsanız birden çok yere sürebilirsiniz.' },
      { t: '16. Excel toplam', pic: '∑', q: 'B2\'den B10\'a kadar olan sayıları Excel\'de toplamak için?', opts: ['=TOPLA(B2:B10)', '=B2-B10', 'TOPLA B2 B10'], ok: 0, why: 'Formül = ile başlar; TOPLA işlevi aralığı toplar. ∑ düğmesi de aynısını yazar.' },
      { t: '17. Excel hatası', pic: '#SAYI/0!', q: 'Bir hücrede #SAYI/0! yazıyor. Ne demek?', opts: ['Sıfıra ya da boş hücreye bölünüyor', 'Sütun dar', 'Yazı yerine sayı var'], ok: 0, why: 'Bölen hücreyi doldurunca düzelir. Dar sütun ##### olarak görünür.' },
      { t: '18. Asıl Slayt', pic: '🎨', q: '30 slaytlık sununun hepsine aynı logoyu eklemenin en hızlı yolu?', opts: ['Görünüm → Asıl Slayt\'ta bir kez eklemek', 'Her slayda tek tek eklemek', 'Sunuyu yazdırmak'], ok: 0, why: 'Asıl Slayt\'ta yapılan değişiklik bütün slaytlara uygulanır.' },
      { t: '19. Slayt gösterisi', pic: 'F5', q: 'Sunuyu baştan, tam ekran göstermek için hangi tuşa basılır?', opts: ['F5', 'F1', 'Esc'], ok: 0, why: 'F5 gösteriyi başlatır, Esc bitirir.' },
      { t: '20. 2 MB sınırı', pic: '📐', q: 'Site “Dosya 2 MB\'den büyük olamaz” diyor. Fotoğrafı nasıl küçültürsünüz?', opts: ['Paint → Yeniden boyutlandır (ör. yüzde 50) ve yeni adla kaydet', 'Fotoğrafı silip yeniden çekerim', 'Dosyanın adını kısaltırım'], ok: 0, why: 'Nokta (piksel) sayısı azalınca dosya küçülür. Adın kısalması boyutu değiştirmez.' },
      { t: '21. Sokak Görünümü', pic: '🧍', q: 'Haritada bir sokağı oradaymış gibi gezmek için ne yaparsınız?', opts: ['Sarı insanı sokağın üzerine sürükleyip bırakırım', 'Uydu düğmesine basarım', 'Haritayı yazdırırım'], ok: 0, why: 'Sarı insan Sokak Görünümü\'nü açar; oklarla ilerler, dönersiniz.' },
      { t: '22. IBAN', pic: 'TR…', q: 'Mesajla gelen IBAN\'a para göndereceksiniz. En güvenli yol?', opts: ['IBAN\'ı seçip kopyalar, bankadaki kutuya yapıştırırım', 'Bakarak elle yazarım', 'Yalnızca ilk 10 hanesini yazarım'], ok: 0, why: 'Kopyala-yapıştır tek rakam hatasını önler; banka ayrıca alıcının adını karşılaştırır.' },
      { t: '23. Sanal kart', pic: '💳', q: 'İnternet alışverişi için neden limitli sanal kart kullanılır?', opts: ['Bilgileri çalınsa bile en fazla limiti kadar harcanabilir', 'Daha çok puan kazandırır', 'Faizi yoktur'], ok: 0, why: 'Sanal kart asıl kartınızdan ayrıdır; iş bitince silinebilir.' },
      { t: '24. Bilmediğiniz hat', pic: '📱', q: 'e-Devlet\'te adınıza açılmış, tanımadığınız bir telefon hattı gördünüz. Ne yaparsınız?', opts: ['Hattı açan operatöre başvurup kapattırırım', 'Önemsemem', 'Hattı kullanırım'], ok: 0, why: 'Adınıza açılan hat dolandırıcılıkta kullanılabilir; hemen kapattırın, gerekirse savcılığa başvurun.' },
      { t: '25. Yapay zekâ', pic: '🤖', q: 'Yapay zekâ sohbet aracı size bir ilacın dozunu söyledi. Ne yaparsınız?', opts: ['Doktoruma ya da eczacıma sorarım', 'Hemen uygularım', 'Herkese tavsiye ederim'], ok: 0, why: 'Yapay zekâ yanılabilir; sağlık, para ve hukuk konularında mutlaka uzmana danışın.' },
      { t: '26. Yedek', pic: '💻 💾 ☁', q: 'Torunların fotoğraflarını kaybetmemek için en güvenli yol hangisi?', opts: ['Bilgisayarda + USB bellekte + bulutta kopyası olsun; yedekten bir dosyayı açıp denerim', 'Yalnızca bilgisayarda dursun', 'Masaüstünde ikinci bir klasöre kopyalarım'], ok: 0, why: 'Üç kopya: biri başka bir cihazda, biri evin dışında. Fidye yazılımına karşı da en iyi çare yedektir.' },
      { t: '27. İki adımlı doğrulama', pic: '🔑 + 📱', q: 'E-posta hesabınızda iki adımlı doğrulama açıksa şifrenizi öğrenen biri ne yapabilir?', opts: ['Telefonunuza gelen kod olmadan giremez', 'Hemen girer', 'Bütün postaları siler'], ok: 0, why: 'Kodu kimseye söylemeyin; telefon kaybolursa yedek kodlarla girersiniz.' },
      { t: '28. Acil para mesajı', pic: '💬 💸', q: 'Komşunuzun sosyal medya hesabından “Acil para lazım, kimseye söyleme” mesajı geldi. Ne yaparsınız?', opts: ['Para göndermem; komşumu bildiğim numarasından arar, mesajı şikâyet ederim', 'Hemen gönderirim', 'IBAN\'ı başkalarına da iletirim'], ok: 0, why: 'Ele geçirilen hesaptan herkese aynı mesaj atılır. Dolandırıldıysanız kartı kapatın, delil saklayın, karakola ya da savcılığa başvurun.' },
    ],
  }),
  sertifika: true,
};

// ---- Büyük parkur ----
const folder = (c) => c.d.fs.children('docs').find((n) => n.type === 'folder' && /doğum/i.test(n.name));
const W = (c) => c.d.find('word')?.api;
const X = (c) => c.d.find('sheet')?.api;
const cell = (c, a) => X(c)?.cell(a) || {};
const durum = (test) => ({ check: (c) => !!test(c), on: (ev, c) => !!test(c) });
const lower = (s) => String(s || '').toLocaleLowerCase('tr');

export const buyukParkur = {
  id: 'buyuk-parkur', icon: '🏁', title: 'Büyük parkur: torunun doğum günü', minutes: 40, stage: 'desktop', parkur: true,
  desc: 'Kursun tamamı tek bir günlük işte: klasör, davetiye, harcama tablosu, e-posta, yol tarifi ve güvenli kart. Yönlendirme yok, süreler tutulur.',
  steps: [
    {
      title: 'Elif\'in doğum günü',
      html: `<p>Cumartesi torununuz Elif'in doğum günü; partiyi siz hazırlıyorsunuz. 14 haftada öğrendiklerinizle <b>10 görevi</b> sırayla yapın.</p>
        <p><b>Nasıl yapılacağı yazmıyor</b>; takılırsanız 💡 İpucu. Adresler: Ahmet <b>ahmet@ornek.com</b>, Haritalar <b>${HARITA_HOST}</b>, banka <b>${BANKA_HOST}</b> (T.C. ${KURS_TC}, şifre ${BANKA_SIFRE}).</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: '1. Klasör', html: '<p><b>Belgeler</b> klasörünün içinde <b>Doğum Günü</b> adında bir klasör oluşturun.</p>',
      hint: 'Dosya Gezgini → Belgeler → ＋ Yeni klasör → adı yazıp Enter.',
      ...durum(folder),
    },
    {
      title: '2. Davetiye', html: '<p>Kelime İşlemci\'de ilk satıra <b>DOĞUM GÜNÜ DAVETİ</b> yazıp <b>ortalı ve kalın</b> yapın. Altına partinin gününü ve saatini yazın: <b>Cumartesi saat 15.00</b></p>',
      hint: 'Başlat → Kelime İşlemci. Başlığı seçip Ctrl + E (ortala) ve Ctrl + B (kalın). Alt satırda Ctrl + L ile sola dönebilirsiniz.',
      ...durum((c) => {
        const b = W(c)?.info().blocks || [];
        const h = b.find((x) => norm(x.text).includes('doğum günü davet'));
        return h && h.align === 'center' && h.bold && b.some((x) => norm(x.text).includes('cumartesi') && /15/.test(x.text));
      }),
    },
    {
      title: '3. Davetiyeyi kaydedin', html: '<p>Davetiyeyi <b>Doğum Günü</b> klasörüne <b>davetiye</b> adıyla kaydedin.</p>',
      hint: 'Ctrl + S → Belgeler → Doğum Günü klasörüne çift tık → Dosya adı: davetiye → Kaydet.',
      on: (ev, c) => {
        if (ev.type !== 'doc-save' || !/davet/i.test(ev.name)) return false;
        if (ev.folder !== folder(c)?.id) { c.note('Kaydedildi ama Doğum Günü klasörüne değil. Dosya → Farklı kaydet ile o klasöre kaydedin.'); return false; }
        return true;
      },
    },
    {
      title: '4. Harcama tablosu', html: '<p>Hesap Tablosu\'nda A1:B3\'e harcamaları yazın: <b>Pasta 450 · Balon 120 · İçecek 200</b>. <b>B4</b>\'e formülle toplamı hesaplatın.</p>',
      hint: 'Ürün adını yazıp Tab, fiyatı yazıp Enter. B4\'e =TOPLA(B1:B3) ya da ∑ düğmesi.',
      ...durum((c) => cell(c, 'B4').value === 770 && String(cell(c, 'B4').raw || '').startsWith('=')),
    },
    {
      title: '5. Tabloyu kaydedin', html: '<p>Tabloyu da <b>Doğum Günü</b> klasörüne <b>harcamalar</b> adıyla kaydedin.</p>',
      hint: 'Ctrl + S → Belgeler → Doğum Günü → Dosya adı: harcamalar.',
      on: (ev, c) => {
        if (ev.type !== 'xl-save' || !/harcama/i.test(ev.name)) return false;
        if (ev.folder !== folder(c)?.id) { c.note('Kaydedildi ama Doğum Günü klasörüne değil. Farklı kaydet ile o klasöre kaydedin.'); return false; }
        return true;
      },
    },
    {
      title: '6. Davetiyeyi gönderin', html: '<p>Ahmet\'e konusu <b>Doğum günü daveti</b> olan bir e-posta gönderin; <b>davetiye</b> dosyasını ekleyin.</p>',
      hint: 'E-posta → ✏ Yeni posta → Kime: ahmet@ornek.com → 📎 Dosya ekle → Belgeler → Doğum Günü → davetiye → Aç → ➤ Gönder.',
      on: (ev, c) => {
        if (ev.type !== 'mail-send' || !ev.toList.map(lower).includes('ahmet@ornek.com')) return false;
        if (!ev.attachments.some((a) => /davet/i.test(a))) { c.warn('Posta gitti ama davetiye ekli değildi. Yeniden gönderin; 📎 Dosya ekle\'yi kullanın.'); return false; }
        return true;
      },
    },
    {
      title: '7. Yol tarifi', html: '<p>Parti kızınızın evinde (<b>Gül Apartmanı</b>). Haritalar\'da evinizden oraya <b>yürüyerek</b> yol tarifi alın.</p>',
      hint: `İnternet → ${HARITA_HOST} → “Gül Apartmanı” arayın → ➜ Yol tarifi → Nereden: 📍 Konumunuz → 🚶 → Yol tarifi al.`,
      on: (ev, c) => {
        if (ev.type !== 'map-route') return false;
        if (ev.to !== 'kizim') { c.note('Yol tarifi başka bir yere çıktı. Nereye kutusuna “Gül Apartmanı” yazın.'); return false; }
        if (ev.mode !== 'walk') { c.note('Yürüyerek seçin (🚶) ve yeniden yol tarifi alın.'); return false; }
        return true;
      },
    },
    {
      title: '8. Hediye kartı', html: '<p>Hediyeyi internetten alacaksınız. Bankam İnternet Şubesi\'nde <b>300 ₺ limitli</b> bir sanal kart oluşturun.</p>',
      hint: `${BANKA_HOST} → T.C. ${KURS_TC}, şifre ${BANKA_SIFRE} → SMS kodu → Kartlarım → Limit: 300 → Oluştur.`,
      on: (ev, c) => {
        if (ev.type !== 'bank-vcard') return false;
        if (ev.limit > 300) { c.note(`Limit ${ev.limit} ₺ oldu. Hediye için 300 ₺ yeter: sanal kartı silip 300 ₺ ile yeniden oluşturun.`); return false; }
        return true;
      },
    },
    {
      title: '9. Bankadan çıkın', html: '<p>İşiniz bitti: internet şubesinden <b>çıkış</b> yapın.</p>',
      hint: 'Sağ üstteki ⏻ Çıkış. İndirme paneli üstünü kapatıyorsa ✕ ile kapatın.',
      on: (ev) => ev.type === 'bank-logout',
    },
    {
      title: '10. Tek bakışta', html: '<p>Son olarak <b>Doğum Günü</b> klasörünü Dosya Gezgini\'nde açın: içinde davetiye ve harcamalar olmalı.</p>',
      hint: 'Dosya Gezgini → Belgeler → Doğum Günü\'ne çift tık.',
      on: (ev, c) => ev.type === 'nav' && ev.folder === folder(c)?.id,
    },
    { final: true, title: 'Büyük parkur bitti! 🎓', html: '<p>Bir günlük işi baştan sona, yönlendirme olmadan bilgisayarla yaptınız. Kursu tamamladınız!</p>' },
  ],
};
