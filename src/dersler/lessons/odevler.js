// Her haftanın sonunda “Gerçek bilgisayarda deneyin” ödevi: alıştırma bilgisayarı yerine kursiyerin kendi (ya da kurstaki gerçek) bilgisayarında
// yapacağı 6–8 küçük görev. Her görev “Yaptım” ile işaretlenir; son ekran yazdırılabilir ödev kâğıdıdır (takıldığım yerler için boşluklu).
import { info } from './kalip.js';

const KURAL = '<p class="mut">Gerçek bilgisayarda çalışırken <b>şifrelerinizi ve kimlik bilgilerinizi</b> yalnızca bildiğiniz, güvendiğiniz sitelere yazın. Takıldığınız yeri not alın, derste sorun: hata yapmak öğrenmenin parçasıdır.</p>';

// görev: [başlık, anlatım, ipucu (isteğe bağlı), simge]
const SAYI = ['', 'Bir', 'İki', 'Üç', 'Dört', 'Beş', 'Altı', 'Yedi', 'Sekiz', 'Dokuz', 'On'];
function odev(n, konu, icon, gorevler) {
  const kac = SAYI[gorevler.length] || gorevler.length;
  const steps = [
    {
      title: 'Gerçek bilgisayarda deneyin',
      html: `<p>Bu ödev <b>alıştırma bilgisayarında değil</b>, <b>kendi bilgisayarınızda</b> (ya da kurstaki gerçek bilgisayarda) yapılır. ${n}. haftada öğrendiğiniz <b>${konu}</b> konusunu gerçekte denersiniz.</p>
        <p>${kac} küçük görev var. Her birini yapınca <b>Yaptım ✔</b>'ya basın. Hepsi bitince son ekranda yazdırılabilir <b>ödev kâğıdı</b> çıkar.</p>${KURAL}`,
      scene: info(`<div class="sc-big">${icon}<br>💻</div><p>${n}. hafta ödevi: kendi bilgisayarınızda</p>`),
    },
    ...gorevler.map(([t, h, ip, ic], i) => ({
      title: `Görev ${i + 1}: ${t}`,
      html: `<p>${h}</p>`,
      hint: ip,
      manual: 'Yaptım ✔',
      scene: info(`<div class="sc-big">${ic || '✅'}</div><p>Görev ${i + 1} / ${gorevler.length}</p>`),
      done: i === gorevler.length - 1 ? 'Son görevi de bitirdiniz!' : undefined,
    })),
    { final: true, title: 'Ödev kâğıdı 🎉', html: `<p>${n}. hafta ödevini bitirdiniz. Aşağıdaki kâğıdı yazdırıp çalışmanızı işaretleyebilir, takıldığınız yerleri not alıp derse getirebilirsiniz.</p>`, scene: info('<div class="sc-big">🏠✔</div>') },
  ];
  return {
    id: `odev${n}`, icon: '🏠', title: `${n}. hafta ödevi: gerçek bilgisayarda deneyin`, minutes: 25, stage: 'scene',
    desc: `${konu}: ${kac.toLocaleLowerCase('tr')} küçük görev. Kendi bilgisayarınızda yapılır; ödev kâğıdı yazdırılabilir.`,
    summary: [...gorevler.map(([t], i) => [`☐ ${i + 1}. ${t}`, 'Not: ______________']), ['Takıldığım yerler', '__________________________________']],
    steps,
  };
}

export const odev1 = odev(1, 'açma-kapama ve fare', '🖱', [
  ['Bilgisayarı açın', 'Bilgisayarı <b>kendiniz açın</b>: güç düğmesine bir kez basın, ekran gelene kadar bekleyin. Bilgisayar zaten açıksa önce kapatıp yeniden açın. Oturum açma ekranında <b>şifrenizi ya da PIN\'inizi</b> yazın ve masaüstünün gelmesini bekleyin.', 'Açılırken düğmeye tekrar tekrar basmayın; birkaç saniye bekleyin.', '⏻'],
  ['İmleci gezdirin', 'Fareyi tutup imleci (oku) masaüstünde gezdirin. Bir simgenin üzerine <b>tıklamadan</b> götürün, sonra <b>bir kez tıklayarak</b> seçin (renkleniyor).', 'Fare kayıyorsa fare altına kitap ya da fare altlığı koyun.', '🖱'],
  ['Çift tıklayıp kapatın', '<b>Dosya Gezgini</b>\'nde (ya da masaüstünde) bir klasöre (örneğin <b>Belgeler</b>) <b>çift tıklayarak</b> açın. Sonra pencerenin <b>sağ üstündeki ✕</b> ile kapatın.', 'Çift tıklamak zor geliyorsa Ayarlar → Fare\'den çift tıklama hızını yavaşlatın.', '📂'],
  ['Sağ tık menüsü', 'Masaüstünün boş bir yerine <b>sağ tıklayın</b>. Açılan menüyü okuyun; <b>hiçbir şeye basmadan</b> klavyede <b>Esc</b> tuşuyla kapatın.', 'Menüyü kapatmak için boş bir yere sol tıklamak da olur.', '☰'],
  ['Pencereyi taşıyın', 'Bir programı (örneğin Hesap Makinesi) açın ve <b>başlık çubuğundan</b> tutup sürükleyerek masaüstünde başka yere taşıyın. Sonra kapatın.', 'Başlık çubuğu, pencerenin en üstündeki ad yazan çubuktur.', '🪟'],
  ['Doğru kapatın', 'İşiniz bitince bilgisayarı <b>güç düğmesiyle değil</b> menüden kapatın: <b>Başlat → ⏻ Güç → Kapat</b>. Ekran kararıp ışık sönene kadar bekleyin.', 'Dizüstüyse kapağı kapatmak bilgisayarı kapatmaz, uykuya alır.', '🔌'],
]);

export const odev2 = odev(2, 'klavye', '⌨', [
  ['Adınızı yazın', '<b>Not Defteri</b>\'ni açın ve adınızı soyadınızı yazın: ilk harfler büyük, kalanı küçük olsun (büyük harf için <b>Shift</b>).', 'Shift tuşunu basılı tutup harfe basın, sonra bırakın.', '✍'],
  ['Türkçe harfler', 'Şu cümleyi yazın: <b>Şükrü öğlen İğdır\'dan çıkıp aşağı indi.</b> ş, ğ, ü, ö, ç, ı, İ harflerinin hepsi çıkmalı.', 'Harfler çıkmıyorsa sağ alttaki dil yazısı TUR mu? Alt + Shift ile değiştirin.', 'Ş'],
  ['Caps Lock\'u deneyin', '<b>Caps Lock</b>\'a basıp <b>MERHABA</b> yazın, sonra tekrar basıp kapatın ve <b>merhaba</b> yazın. Tuşun (ya da ekrandaki) ışığına bakın.', 'Şifreniz “yanlış” çıkıyorsa Caps Lock açık olabilir.', '🔠'],
  ['Silme tuşları', 'Bir cümle yazın. <b>Backspace</b> imlecin <b>solundaki</b> harfi, <b>Delete</b> ise <b>sağındakini</b> siler: ikisini de deneyin. <b>Enter</b> ile alt satıra geçin.', 'Ok tuşlarıyla imleci yazının içinde gezdirin.', '⌫'],
  ['@ işareti', 'Kendi e-posta adresinizi Not Defteri\'ne yazın. <b>@</b> işareti için <b>AltGr + Q</b> (ya da Ctrl + Alt + Q) tuşlarına basın.', 'Telefon numaralarınızı ve adresinizi bu şekilde ayrı satırlara yazıp kaydedebilirsiniz.', '@'],
  ['Dil değiştirin', 'Sağ alttaki <b>TUR</b> yazısını bulun. <b>Alt + Shift</b> ile <b>ENG</b> yapıp bir şey yazın (ş harfi ne oldu?), sonra tekrar <b>TUR</b> yapın.', 'Yanlışlıkla ENG\'de kalırsanız aynı tuşlarla geri dönün.', '🌐'],
]);

export const odev3 = odev(3, 'metin seçme ve kısayollar', '🖱', [
  ['Seçip kopyalayın', 'Not Defteri\'nde iki üç cümle yazın. Bir cümleyi <b>çift ya da üç tıklayarak</b> seçin, <b>Ctrl + C</b> ile kopyalayın, satır sonuna gelip <b>Ctrl + V</b> ile yapıştırın.', 'C: kopyala, V: yapıştır, X: kes.', '📋'],
  ['Geri alın', 'Bir cümleyi silin; <b>Ctrl + Z</b> ile geri getirin. Pişman olduğunuzda <b>Ctrl + Y</b> ile yineleyin.', 'Ctrl + Z, bilgisayardaki “bozdum” korkusunun ilacıdır.', '↶'],
  ['Hepsini seçin', '<b>Ctrl + A</b> ile bütün yazıyı seçin; sonra boş bir yere tıklayarak seçimi kaldırın. Seçili yazıyı yazarsanız üzerine yazılır: dikkat!', 'Yanlışlıkla silerseniz Ctrl + Z.', '🔲'],
  ['Kaydedin', '<b>Ctrl + S</b> ile yazıyı <b>Belgeler</b> klasörüne <b>ödev3</b> adıyla kaydedin. Kapatıp Dosya Gezgini\'nden bulup yeniden açın.', 'Dosya Gezgini: Başlat\'ın yanındaki sarı klasör.', '💾'],
  ['Kesip taşıyın', 'Yazının bir satırını <b>Ctrl + X</b> ile kesin ve başka bir yere <b>Ctrl + V</b> ile yapıştırarak taşıyın.', 'Kopyalama yazıyı çoğaltır, kesme taşır.', '✂'],
  ['Pencere değiştirin', 'İki program açın (Not Defteri ve Hesap Makinesi). <b>Alt + Tab</b> ile aralarında geçiş yapın.', 'Alt\'ı basılı tutup Tab\'a basın; bıraktığınızda seçili pencere öne gelir.', '🔁'],
]);

export const odev4 = odev(4, 'donanım ve yazılım', '🧰', [
  ['Bağlantıları sayın', 'Bilgisayarınızın (ya da dizüstünün) kenarlarına ve arkasına bakıp <b>USB</b>, <b>kulaklık</b>, <b>şarj</b> ve (varsa) <b>HDMI</b> girişlerini sayın. Kâğıda yazın.', 'USB: dikdörtgen küçük delik; kulaklık: yuvarlak delik.', '🔌'],
  ['Marka ve model', 'Bilgisayarın üzerinde ya da <b>altındaki etiketten</b> markasını ve modelini bulup yazın.', 'Etiket yoksa Başlat → Ayarlar → Sistem → Hakkında\'da yazar.', '🏷'],
  ['İşlemci ve RAM', '<b>Başlat → Ayarlar → Sistem → Hakkında</b> sayfasını açın ve <b>işlemci</b> ile <b>yüklü RAM</b> bilgisini kâğıda yazın.', 'RAM, “8,00 GB” gibi yazar. Hız (GHz) işlemcinin adının sonundadır.', '🧠'],
  ['Görev Yöneticisi', '<b>Ctrl + Shift + Esc</b> tuşlarına basın. <b>Performans</b> sekmesinde bellek (RAM) ve işlemci kullanım yüzdesine bakın. Sonra kapatın.', 'Yüzde sürekli %90\'ın üzerindeyse bilgisayar yoruluyor demektir.', '📊'],
  ['Disk doluluğu', '<b>Dosya Gezgini → Bu bilgisayar</b>\'a gidip <b>C:</b> sürücüsünün ne kadar dolu olduğuna bakın (mavi çubuk).', 'Kırmızıya dönmüşse yer açmak gerekir.', '💽'],
  ['Pil ve şarj', 'Dizüstüyseniz sağ alttaki <b>pil simgesine</b> bakın: yüzde kaç? Şarj aleti takılı mı (⚡)? Masaüstüyseniz güç kablolarının sağlam takıldığını kontrol edin.', 'Pili %20\'nin altına düşürmemeye çalışın.', '🔋'],
]);

export const odev5 = odev(5, 'masaüstü, Başlat menüsü ve pencereler', '🪟', [
  ['Başlat ve arama', '<b>Başlat</b> düğmesine tıklayın, arama kutusuna <b>hesap</b> yazın ve <b>Hesap Makinesi</b>\'ni açıp bir toplama yapın.', 'Başlat menüsünü kapatmak için Esc ya da boş bir yere tıklayın.', '🔍'],
  ['Pencere boyutu', 'Hesap Makinesi\'nde (ya da başka bir pencerede) sağ üstteki <b>—</b> (küçült), <b>☐</b> (büyüt) ve <b>✕</b> (kapat) düğmelerini sırayla deneyin; küçülen pencereyi görev çubuğundan geri getirin.', 'Küçültülen pencere kapanmaz, görev çubuğunda bekler.', '➖'],
  ['Yan yana yerleştirin', 'İki pencere açın. <b>⊞ Windows + ←</b> ile birini sola, <b>⊞ + →</b> ile ötekini sağa yapıştırın.', 'Kısayol çalışmazsa pencereyi başlık çubuğundan tutup ekranın sol ya da sağ kenarına sürükleyin; yarım ekran olur.', '↔'],
  ['Klasör oluşturun', 'Masaüstünün boş yerine <b>sağ tık → Yeni → Klasör</b> deyin ve adını <b>Ödevlerim</b> yapıp Enter\'a basın.', 'Adı değiştirmek için klasörü seçip F2 tuşuna basın.', '📁'],
  ['Arka planı değiştirin', '<b>Başlat → Ayarlar → Kişiselleştirme → Arka plan</b> bölümünden bir resim seçin. Sonra tekrar eskisine döndürün.', 'Ortak bilgisayarda değiştirdiğiniz ayarı eski hâline getirin.', '🖼'],
  ['Alarm kurun', '<b>Başlat</b>\'ta <b>Saat</b> (Windows 10\'da <b>Alarmlar ve Saat</b>) yazıp açın; 5 dakika sonrasına <b>“Çay”</b> adında bir alarm kurun.', 'Alarm için bilgisayarın açık ve sesinin açık olması gerekir.', '⏰'],
]);

export const odev6 = odev(6, 'dosyalar ve klasörler', '📁', [
  ['Klasör içinde klasör', '<b>Belgeler</b>\'in içinde <b>Faturalar</b> adında bir klasör açın; onun içinde de <b>2026</b> klasörü açın.', 'Üstteki adres çubuğunda yolu okuyun: Belgeler › Faturalar › 2026.', '🗂'],
  ['Dosya kopyalayın', 'Not Defteri ile küçük bir dosya kaydedin (ör. <b>deneme.txt</b>). Dosyayı seçin, <b>Ctrl + C</b>; <b>2026</b> klasörüne girip <b>Ctrl + V</b> ile yapıştırın. İki yerde de duruyor mu?', 'Kopyalama dosyayı çoğaltır; Ctrl + X ile kesince taşınır.', '📄'],
  ['Adını değiştirin', 'Dosyayı seçip <b>F2</b> tuşuna basın, adını <b>deneme-1.txt</b> yapın. <b>Uzantıya (.txt)</b> dokunmayın.', 'Sağ tık → Yeniden adlandır da aynı işi yapar.', '✏'],
  ['Silin ve geri alın', 'Dosyayı seçip <b>Delete</b> ile silin. Masaüstündeki <b>Geri Dönüşüm Kutusu</b>\'nu açıp dosyayı bulun ve <b>sağ tık → Geri yükle</b> deyin.', 'Kutuyu boşaltırsanız dosyalar kalıcı olarak gider.', '🗑'],
  ['Uzantıları gösterin', 'Dosya Gezgini\'nde <b>Görünüm → Göster → Dosya adı uzantıları</b>\'nı işaretleyin. Dosyaların sonundaki .txt, .jpg, .pdf yazılarını okuyun.', 'Sahte dosya hilesini (belge.pdf.exe) bu ayar sayesinde görürsünüz.', '🏷'],
  ['Bellekten kopyalayın', 'Varsa bir <b>USB bellek</b> takın; içindeki bir dosyayı <b>Belgeler</b>\'e kopyalayın. Sonra belleği tepsideki <b>⏏ Güvenle kaldır</b> ile çıkarın.', 'Belleği çekmeden önce mutlaka güvenle kaldırın.', '💾'],
  ['Birkaç dosya seçin', 'Resimler klasöründe <b>Ctrl</b>\'yi basılı tutup üç fotoğrafa tek tek tıklayın; üçü birden seçilsin. Sağ tıklayıp <b>Kopyala</b>, sonra yeni bir klasöre <b>Yapıştır</b>.', 'Shift ile tıklarsanız aradaki hepsi seçilir. Yanlış seçerseniz boş bir yere tıklayıp yeniden başlayın.', '🖱'],
  ['Son kullanılanlar', 'Dosya Gezgini\'ni açın; soldaki <b>Giriş</b> (ya da Hızlı Erişim) sayfasında <b>son açtığınız dosyalara</b> bakın. Birine sağ tıklayıp <b>Dosya konumunu aç</b>\'ı seçin.', 'Nereye kaydettiğinizi unuttuğunuz dosyayı en hızlı buradan bulursunuz.', '🕵️'],
]);

export const odev7 = odev(7, 'Paint, ekran alıntısı ve ayarlar', '🎨', [
  ['Paint ile çizin', '<b>Paint</b>\'i açıp kalemle basit bir ev ya da çiçek çizin. <b>Ctrl + S</b> ile <b>Resimler</b> klasörüne <b>cizim.png</b> adıyla kaydedin.', 'Renk paletinden farklı renkler deneyin.', '🎨'],
  ['Ekran alıntısı', '<b>⊞ Windows + Shift + S</b> tuşlarına basıp ekranınızdan bir bölge seçin; sonra Paint\'e <b>Ctrl + V</b> ile yapıştırın.', 'Tüm ekranı almak için PrtSc tuşu da kullanılır.', '✂'],
  ['Ses ayarı', 'Sağ alttaki <b>hoparlör simgesinden</b> ses düzeyini değiştirin ve bir müzik ya da video açıp duyarak deneyin. Sonra eski düzeye getirin.', 'Hoparlör çizili ise ses kapalıdır.', '🔊'],
  ['Parlaklık', 'Ekran çok parlak ya da loşsa <b>Ayarlar → Sistem → Ekran → Parlaklık</b> (dizüstüde klavyedeki güneş tuşları) ile ayarlayın.', 'Gözünüzü yormayan, okuması rahat bir düzey seçin.', '☀'],
  ['Saat ve tarih', 'Sağ alttaki <b>saate</b> tıklayın: tarih ve saat doğru mu? <b>Ayarlar → Saat ve dil</b>\'de “Saati otomatik ayarla” açık mı?', 'Açık olması en iyisidir.', '🕒'],
  ['Wi-Fi\'ye bakın', 'Sağ alttaki <b>Wi-Fi simgesine</b> tıklayın ve bağlı olduğunuz ağın adını okuyup kâğıda yazın. (Şifreyi yazmayın!)', 'Simgede ✈ ya da ✕ varsa uçak modu ya da bağlantı yok demektir.', '📶'],
]);

export const odev8 = odev(8, 'internet, güvenlik ve bakım', '🌐', [
  ['Arama yapın', 'Tarayıcıyı açın ve <b>bugünün hava durumu</b> diye aratın. İlk sonuç <b>reklam</b> mı (“Reklam” yazıyor mu)? Hangi siteye girdiniz? Adresi okuyun.', 'Adres çubuğundaki adrese bakın: .com.tr, .gov.tr…', '🔎'],
  ['Kilidi kontrol edin', 'Adres çubuğunun solundaki <b>🔒 kilide</b> tıklayın. “Bağlantı güvenli” yazıyor mu? Sitenin asıl adını bulun.', 'Kilit, sitenin dürüst olduğunu göstermez; yalnızca bağlantının şifreli olduğunu.', '🔒'],
  ['Sık kullanılanlara ekleyin', 'Sık girdiğiniz bir siteyi açıp <b>Ctrl + D</b> ile sık kullanılanlara ekleyin; sonra tarayıcının üst çubuğundan bulun.', 'Ad olarak anlaşılır bir şey yazın.', '⭐'],
  ['Resim indirin', 'Güvendiğiniz bir siteden bir fotoğraf indirin (sağ tık → Resmi farklı kaydet). Kaydet penceresinde klasör olarak <b>İndirilenler</b>\'i seçin. Sonra Dosya Gezgini\'nde <b>İndirilenler</b> klasöründe bulun.', 'İndirdiğiniz dosyayı hemen kendi klasörünüze taşıyın.', '⬇'],
  ['Virüs taraması', '<b>Başlat → Windows Güvenliği → Virüs ve tehdit koruması → Hızlı tarama</b> deyin ve bitmesini bekleyin. Sonucu kâğıda yazın.', 'Tarama sırasında bilgisayarı kullanabilirsiniz.', '🛡'],
  ['Güncellemeye bakın', '<b>Ayarlar → Windows Update</b>\'e (Windows 10\'da <b>Ayarlar → Güncelleştirme ve Güvenlik → Windows Update</b>) girin: “Güncelsiniz” mi yazıyor, yoksa bekleyen güncelleme var mı? Varsa işinizi kaydedip güncelleyin.', 'Güncelleme sırasında bilgisayarı kapatmayın.', '🔄'],
  ['İngilizce pencere', 'Bir sitede “<b>Allow / Block</b>” ya da “<b>Accept / Reject</b>” soran bir pencere görünce okuyun: Allow izin ver, Block engelle demektir. Bildirim isteyen siteye <b>Block</b> deyin.', 'Emin olmadığınız İngilizce pencerede Cancel (vazgeç) ya da ✕ güvenlidir.', '🔤'],
  ['Modem ve hız', 'Evinizdeki modemin <b>ışıklarına</b> bakın: Power, Internet/DSL ve WLAN yanıyor mu? Sonra tarayıcıda “<b>hız testi</b>” arayıp internet hızınızı ölçün ve not alın.', 'İnternet kesilirse modemi kapatın, 10 saniye bekleyip açın.', '📶'],
]);

export const odev9 = odev(9, 'e-posta', '✉', [
  ['Hesabınıza girin', 'E-postanızın sitesine (ör. <b>gmail.com</b> ya da <b>outlook.com</b>) <b>adresi kendiniz yazarak</b> girin ve oturum açın.', 'E-postadaki bağlantıdan değil, adres çubuğuna yazarak girin.', '🔑'],
  ['Kendinize yazın', 'Kendi adresinize <b>“Deneme”</b> konulu kısa bir posta gönderin. Birkaç saniye içinde gelen kutusuna düşmeli.', 'Adreste Türkçe harf ve boşluk olmaz.', '✉'],
  ['Yanıtlayın', 'Gelen “Deneme” postasını açıp <b>Yanıtla</b>\'ya basın ve bir cümle yazıp gönderin.', 'Yanıtla yalnızca gönderene cevap verir.', '↩'],
  ['İletin', 'Aynı postayı güvendiğiniz bir yakınınıza <b>İlet</b> ile gönderin; <b>Cc</b> kutusuna kendinizi de yazın.', 'Cc: bilgisi olsun istediğiniz kişi.', '↪'],
  ['Spam klasörü', '<b>Spam</b> (ya da Önemsiz E-posta) klasörüne bakın. Tanıdığınız birinin postası yanlışlıkla orada mı? Varsa “Spam değil” deyin. Bağlantılara tıklamayın.', 'Şüpheli postadaki bağlantılara hiç tıklamayın.', '🚫'],
  ['Eski postayı bulun', 'E-postanızın arama kutusuna bir <b>göndericinin adını</b> (ör. bankanız ya da elektrik şirketi) yazın; geçen ayki postayı bulun. Ekli postalar için arama seçeneklerine bakın.', 'Gmail\'de “has:attachment”, Outlook\'ta “Ekleri var” filtresi ekli postaları gösterir.', '🔍'],
  ['Abonelikten çıkın', 'Sürekli gelen bir reklam bülteninin en altındaki <b>Abonelikten çık</b> (Unsubscribe) bağlantısını bulun ve bültenden çıkın.', 'Yalnızca tanıdığınız mağazaların bültenlerinde yapın; şüpheli postadaki bağlantıya tıklamayın, silin.', '📰'],
  ['Çıkış yapın', 'Bir eki varsa indirip kendi klasörünüze taşıyın. İşiniz bitince hesabınızdan <b>Oturumu kapat</b> (Çıkış yap) düğmesine basın.', 'Ortak bilgisayarda çıkış yapmak şarttır.', '🚪'],
]);

export const odev10 = odev(10, 'kelime işlemci (Word)', '📘', [
  ['Dilekçe yazın', 'Word ya da benzeri bir programda <b>kısa bir dilekçe</b> yazın: üstte makam (ortalı, kalın), konu, bir paragraf, altta tarih ve adınız.', 'Satır sonunda Enter\'a basmayın; paragraf bitince basın.', '📝'],
  ['Biçimlendirin', 'Başlığı <b>ortalayın ve kalınlaştırın</b>, paragrafı <b>iki yana yaslayın</b> (Ctrl + J), yazı boyutunu 12 yapın.', 'Ctrl + E ortalar, Ctrl + B kalın yapar.', '🔠'],
  ['Önizleyin', '<b>Ctrl + P</b> ile yazdırma önizlemesine bakın: kaç sayfa? Tek sayfa olmalı.', 'Taşıyorsa kenar boşluklarını daraltın.', '👁'],
  ['PDF yapın', 'Belgeyi <b>PDF olarak kaydedin</b> (Yazdır → PDF olarak kaydet ya da Dışa aktar). PDF\'i çift tıklayıp açın.', 'PDF, her bilgisayarda aynı görünür.', '📕'],
  ['Tablo ekleyin', 'Yeni bir belgede <b>3 sütun × 4 satırlık</b> bir tablo ekleyin (Ekle → Tablo) ve içine aidat bilgilerini yazın.', 'Tab tuşu bir sonraki hücreye geçirir.', '▦'],
  ['Resmi yerleştirin', 'Word\'e bir fotoğraf ekleyin. Fotoğrafa tıklayıp yanındaki <b>Düzen Seçenekleri</b> simgesinden <b>Kare</b>\'yi seçin; resmi sürükleyerek yazının yanına taşıyın, köşesinden küçültün.', 'Resim yazıyı dağıtırsa Ctrl + Z ile geri alın.', '🖼'],
  ['Biçim Boyacısı', 'Bir başlığı renkli ve büyük yapın. Başlığa tıklayıp <b>Biçim Boyacısı</b>\'na (fırça) basın, sonra başka bir başlığı fareyle boyayın. Satırları <b>1,5 satır aralığı</b> ile ferahlatın.', 'Fırçaya çift tıklarsanız birden çok başlığa sürebilirsiniz; Esc ile bırakılır.', '🖌'],
  ['Kaydedin', 'Her ikisini de <b>Belgeler</b> klasörüne anlaşılır adlarla kaydedin: <b>dilekçe</b> ve <b>aidat tablosu</b>. Dosya Gezgini\'nde görün.', 'Ad olarak tarih eklemek bulmayı kolaylaştırır.', '💾'],
]);

export const odev11 = odev(11, 'hesap tablosu (Excel)', '📗', [
  ['Harcama tablosu', 'Excel ya da benzeri programda 1. satıra başlıkları yazın: <b>A1</b>\'e <b>Kalem</b>, <b>B1</b>\'e <b>Tutar</b>. Sonra 2. satırdan başlayarak <b>A sütununa</b> bir haftanın 7 harcama kalemini (market, ulaşım, ilaç…), <b>B sütununa</b> tutarlarını yazın.', 'Ondalık için virgül kullanın: 45,50.', '📋'],
  ['Toplamı bulun', 'Tutarların altındaki hücreye (<b>B9</b>) <b>=TOPLA(B2:B8)</b> yazın ya da <b>∑ Otomatik Toplam</b> düğmesine basın.', 'Tutar değişince toplam kendiliğinden güncellenir.', '∑'],
  ['Para biçimi', 'Tutarları seçip <b>₺ (Para birimi)</b> biçimine çevirin.', 'Sütun dar kalırsa ##### çıkar; çizgisine çift tıklayın.', '₺'],
  ['Sıralayın', 'Tutarlara göre <b>büyükten küçüğe</b> sıralayın: en pahalı kalem en üstte görünsün.', 'Seçerken 1. satırdaki başlıkları ve toplam satırını dahil etmeyin (yalnızca 2–8. satırlar).', '↓'],
  ['Başlığı donatın', 'Tablonun üstüne yeni bir satır ekleyin (1. satır numarasına sağ tık → Ekle). <b>A1</b>\'e <b>HAFTALIK HARCAMA</b> yazıp A1 ile B1\'i seçin ve <b>Birleştir ve Ortala</b> ile tek başlık yapın.', 'Başlığı kalın yapmak okunurluğu artırır.', '🏷'],
  ['Hatayı düzeltin', 'Bir sayının yerine yazıyla “<b>iki yüz</b>” yazın ve toplamın <b>#DEĞER!</b> verdiğini görün. Rakamla <b>200</b> yazarak düzeltin.', 'Hata kodları: #DEĞER! yazı var, #AD? işlev adı yanlış, #SAYI/0! sıfıra bölme.', '⚠'],
  ['Özet Tablo', 'Harcamalarınıza bir <b>Kategori</b> sütunu ekleyin (Market, Fatura…). Tabloya tıklayıp <b>Ekle → Özet Tablo</b> ile her kategorinin toplamını çıkarın.', 'Özet Tablo\'da Satırlar: Kategori, Değerler: Tutar toplamı.', '🧮'],
  ['Kaydedin', '<b>Ctrl + S</b> ile <b>harcamalar</b> adıyla <b>Belgeler</b> klasörüne kaydedin. Kapatıp yeniden açarak toplamın durduğunu görün.', 'Haftaya yeni bir sayfa sekmesiyle devam edin.', '💾'],
]);

export const odev12 = odev(12, 'sunu (PowerPoint)', '📙', [
  ['Üç slayt', 'Sunu programında <b>“Ailem”</b> konulu üç slaytlık bir sunu hazırlayın: kapak, bir aile üyesinin tanıtımı, bir anı.', 'Slayt başına en çok 3–5 kısa madde yazın.', '📙'],
  ['Fotoğraf ekleyin', 'Bilgisayarınızdaki bir fotoğrafı slayda ekleyin (Ekle → Resim) ve boyutunu ayarlayın.', 'Fotoğrafın köşelerinden tutup büyütebilirsiniz.', '🖼'],
  ['Geçiş seçin', 'Slaytlara bir <b>geçiş</b> (Soldurma (Fade) ya da İtme) verin. Fazla çeşit kullanmayın; hepsine aynısını verin.', 'Geçiş, slayttan slayda geçerkenki hareket.', '✨'],
  ['Gösterin', '<b>F5</b> ile sunuyu baştan izleyin; ok tuşları ya da tıklamayla ilerleyin; <b>Esc</b> ile çıkın.', 'B tuşu ekranı karartır.', '▶'],
  ['PDF yapın', 'Sunuyu <b>PDF olarak kaydedin</b> ve açıp bakın: herkesin telefonunda açılır.', 'WhatsApp\'tan göndermek için PDF idealdir.', '📕'],
  ['Asıl Slayt', 'Görünüm → <b>Asıl Slayt</b>\'ı açın; alt bilgiye adınızı yazın ya da köşeye küçük bir resim koyun. Asıl görünümü kapatıp bütün slaytlarda göründüğüne bakın.', 'PowerPoint\'te Görünüm → Asıl Slayt; çıkmak için Asıl Görünümü Kapat.', '🎨'],
  ['Tablo ya da grafik', 'Bir slayda <b>Ekle → Tablo</b> ile küçük bir tablo (ör. haftalık yürüyüş süreleri) ya da <b>Ekle → Grafik</b> ile sütun grafiği ekleyin.', 'Tabloda Tab sonraki hücreye geçer; son hücrede yeni satır açar.', '📊'],
  ['Birine gösterin', 'Sununuzu bir yakınınıza gösterin ve bir <b>iyi</b>, bir de <b>geliştirilecek</b> yanını sorun. Kâğıda not alın.', 'Eleştiri öğrenmenin en hızlı yoludur.', '👥'],
]);

export const odev13 = odev(13, 'günlük işler: bilgisayarda ve tarayıcıda', '📑', [
  ['Telefondan aktarın', 'Telefonunuzdan <b>bir fotoğrafı</b> bilgisayara aktarın (kabloyla, Dosya aktarımı) ya da WhatsApp Web ile indirin. <b>Resimler</b> klasöründe bulun.', 'Kabloyu taktıktan sonra telefon ekranında “Dosya aktarımı”nı seçin.', '📱'],
  ['PDF\'te arayın', 'Bir PDF (fatura, tahlil) açıp <b>Ctrl + F</b> ile içinde bir kelime arayın.', 'Taranmış PDF\'lerde arama çalışmaz.', '📑'],
  ['PDF\'i yazdırma önizlemesi', 'Aynı PDF için <b>Ctrl + P</b> ile yazdırma penceresini açın; <b>yalnızca 1. sayfayı</b> seçin (yazdırmadan iptal edebilirsiniz).', 'İki yüze yazdırmak kâğıdı yarıya indirir.', '🖨'],
  ['Çerezleri görün', 'Tarayıcının Ayarlar sayfasında <b>Çerezler ve site verileri</b>\'ni bulun; kaç site çerez bırakmış? <b>Üçüncü taraf çerezler</b> engelli mi?', 'Engellemek reklam takibini azaltır; siteler yine çalışır.', '🍪'],
  ['Gizli pencere', '<b>Ctrl + Shift + N</b> (Firefox\'ta <b>Ctrl + Shift + P</b>) ile gizli pencere açıp bir site gezin; pencereyi kapatınca geçmişte görünüp görünmediğine bakın.', 'Gizli pencere sizi internette görünmez yapmaz.', '🕶'],
  ['Fotoğraf küçültün', 'Telefondan aldığınız bir fotoğrafı Paint\'te açın; <b>Yeniden boyutlandır</b> ile yüzde 50 küçültüp <b>Farklı kaydet</b> ile yeni adla kaydedin. İki dosyanın boyutunu (MB) karşılaştırın.', 'Dosya Gezgini\'nde dosyaya sağ tık → Özellikler boyutu gösterir.', '📐'],
  ['Yol tarifi', 'Gerçek bir harita sitesinde evinizden sık gittiğiniz bir yere (hastane, pazar) <b>yol tarifi</b> alın. Sonra <b>Sokak Görünümü</b> ile oranın kapısına bakın.', 'Harita konum izni isterse yalnızca harita sitesine verin.', '🗺'],
  ['WhatsApp Web ve çıkış', 'Dilerseniz <b>web.whatsapp.com</b>\'a girip telefonla karekodu okutun; bir mesaja bakın; <b>mutlaka “Oturumu kapat”</b> yapın.', 'Ortak bilgisayarda bunu atlamayın.', '💬'],
]);

export const odev14 = odev(14, 'e-Devlet, randevu ve internette işlemler', '🏛', [
  ['e-Devlet\'e girin', '<b>turkiye.gov.tr</b> adresini <b>kendiniz yazarak</b> girin; <b>T.C. kimlik numaranızı ve e-Devlet şifrenizi yalnızca bu adreste</b> yazın. Giriş yapın.', 'Arama sonucunda çıkan reklamlardan girmeyin.', '🏛'],
  ['Belge alın', '“Yerleşim yeri belgesi” (ikametgâh) hizmetini bulup belgeyi oluşturun ve <b>PDF olarak indirin</b>. İndirilenler\'de bulun. Belgede kişisel bilgileriniz var: ortak bilgisayarda işiniz bitince dosyayı silin (Geri Dönüşüm Kutusu\'nu da boşaltın).', 'Belgenin altındaki barkodu not edin.', '📄'],
  ['Barkodu doğrulayın', 'e-Devlet\'te <b>Barkodlu Belge Doğrulama</b> sayfasına gidip az önceki belgenin barkodunu yazarak doğrulayın.', 'Size verilen bir belgeyi bu yolla sorgulatırsınız.', '🔎'],
  ['Randevuları görün', '<b>MHRS</b> sitesine (mhrs.gov.tr) <b>e-Devlet ya da T.C. kimlik numaranızla giriş yaparak</b> girin ve <b>Randevularım</b> bölümüne bakın. (İstemiyorsanız yeni randevu almayın.)', 'Gidemeyecekseniz randevuyu iptal edin.', '🏥'],
  ['e-Nabız\'a bakın', '<b>e-Devlet ile giriş</b> yoluyla e-Nabız\'a girin ve reçete ya da tahlil listenize bakın. <b>Şifreyi e-Nabız sayfasında değil, e-Devlet sayfasında</b> yazdığınızı kontrol edin.', 'Sağlık bilgileriniz özeldir; işiniz bitince çıkış yapın.', '🩺'],
  ['Kayıtlı hatlar', 'e-Devlet\'te “<b>Mobil Hat Sorgulama</b>”yı açıp adınıza kayıtlı hatlara bakın. Tanımadığınız bir hat var mı?', 'Bilmediğiniz bir hat varsa operatörüne başvurup kapattırın.', '📱'],
  ['Kart ayarları', 'Bankanızın mobil uygulamasında ya da internet şubesinde kartınızın <b>internet alışverişi</b> ayarını ve <b>sanal kart</b> seçeneğini bulun. Değiştirmeniz gerekmez; yerini öğrenin.', 'Şifrenizi yalnızca bankanın kendi uygulamasına yazın; SMS kodunu kimseye söylemeyin.', '💳'],
  ['Çıkış yapın', 'Bütün sitelerden <b>Çıkış</b> yapın. Sonra tarayıcıda <b>Ctrl + Shift + Del</b> ile göz atma verilerini temizlemeyi düşünün (ortak bilgisayardaysanız).', 'Oturum açık kalırsa sonraki kişi girebilir.', '🚪'],
]);

export const ODEVLER = [odev1, odev2, odev3, odev4, odev5, odev6, odev7, odev8, odev9, odev10, odev11, odev12, odev13, odev14];
