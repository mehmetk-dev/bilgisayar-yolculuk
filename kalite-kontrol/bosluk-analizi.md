# Boşluk analizi: kursta işlenmeyen gerçek hayat görevleri (30 Ekim 2026)

Kaynaklar: `dokum-2026-10-30.md` (195 ders) + bugün eklenen `belge-gonder`, `office-yoksa`, `telefon-kayip`; `eksikler-*.md` "Yeni ders fikirleri"; `src/dersler/lessons/*.js` ve `apps/*.js` taraması.
Not: Önceki raporlardaki 3 ders fikrinden `belge-gonder`, `office-yoksa`, `telefon-kayip` yapıldı. Kalanlar: "Telefonda arayan kişi", "İlk e-Devlet girişi" (aşağıda 2. sırada), "İndirdim ama açılmıyor", "Yazıcı yazmıyor", "Güncelleniyor, kapatmayın", ".xls/.csv açma".

## 1. Görev durumu

| Görev | Durum | Kanıt / eksik |
|---|---|---|
| Belge taramak (tarayıcı/telefon) | YOK | Yalnızca "taranmış PDF'te arama olmaz" bilgisi (`pdf-duzenle` ad.13, `dosya-senaryo`). Tarama yapma yok |
| e-Devlet barkodlu belge, doğrulama, yazdırma | VAR | `edevlet` (ad.8 doğrulama), `pdf-duzenle` (yazdırma), `ehizmet-parkur` |
| İnternette form (zorunlu alan, liste, dosya yükleme) | VAR (tarih seçici yok) | `randevu`, `foto-boyut` (dosya yükleme), `alisveris`; tarih "gün düğmesi" ile, gerçek tarih kutusu yok |
| PDF formu doldurup imzalamak | VAR | `pdf-duzenle`. e-imza/mobil imza ve çizilen imza anlatılmıyor |
| Fotoğraf düzenleme, küçültme, forma yükleme | VAR | `foto-boyut`, `fotograflar`, `paint`, `tebrik-karti`, `resim-web-dosyalari` |
| Telefon-bilgisayar dosya aktarımı | KISMEN | `telefon` (kablo), `mesajlas-web` (belge gönderme), `bulut-paylas`, `eposta`. "Kendime WhatsApp", bulut yedeklemesi yok |
| Görüntülü görüşme | VAR | `gorusme` (kamera/mikrofon izni). Kendi toplantı açma/Zoom yok, ikincil |
| Banka güvenliği, fatura ödeme | KISMEN | Güvenlik VAR: `sanal-kart-iban`, `dolandirildim`. Fatura ödeme YOK (fatura yalnızca okunuyor: `pdf-calis`, `yan-yana`) |
| e-Okul / e-Nabız / SGK / ÖSYM / İŞKUR | KISMEN | `e-nabiz`, `edevlet-kamu` VAR. e-Okul, ÖSYM, İŞKUR YOK. İlk e-Devlet şifresi yalnızca bir cümle (`edevlet`) |
| Harita ve yol tarifi | VAR | `harita` |
| Takvim ve hatırlatıcı | VAR | `takvim-randevu`, `donatilar` (alarm) |
| Ekran görüntüsü alıp göndermek | VAR | `alinti` (ad.7 WhatsApp), `gunluk-web` (PrtSc), `gunluk-parkur` |
| Ekranı büyütmek/okunaklı yapmak | VAR | `okuma-kolay`, `ayarlar`, `windows-araclar`, `gunluk-web` (Ctrl +) |
| Sesle yazma (Win + H) / sesli asistan | YOK | Hiçbir derste dikte yok |
| Yapay zekâ güvenliği | VAR | `yapay-zeka` |
| Bilgisayarı temiz tutma | VAR | `kurulum`, `bakim-guvenlik`, `gorev-ayrinti` (başlangıç), `zip`. "Güncelleniyor, kapatmayın" eksik |
| Yedekleme | VAR | `yedekleme`, `bulut-paylas`, `windows-araclar` (Dosya Geçmişi) |
| Wi-Fi şifresi, modem | KISMEN | `internet-kesildi` (ışıklar, yeniden başlatma), `ayarlar` ad.9 (şifre etikette). Şifreyi bulma/değiştirme, modem sayfası, misafire verme yok |
| Çocuk/torun güvenliği, ebeveyn denetimi | YOK | `virus` içinde tek cümle |
| Sorunu internette arayıp çözmek | KISMEN | `arama-motorlari`, `adres`, `tuzaklar` (genel). "Hata mesajını aratmak, resmî/üretici sitesi, forum, sahte yardım" yok |
| Online kurs, YouTube'dan öğrenme | KISMEN | `video-gazete` (izleme, altyazı, hız). "Öğrenmek için ara/oynatma listesi" yok; ikincil |
| Kargo takibi, iade | KISMEN | `alisveris` ad.9 (sipariş takibi). İade, cayma hakkı, kargo takip no yok |
| Sınav/başvuru sonucu (ÖSYM, İŞKUR) | YOK | Dökümde ÖSYM, İŞKUR, e-Okul geçmiyor |
| Kendi e-posta hesabını açmak (eklenen görev) | KISMEN | `gmail-hotmail` yalnızca bilgi+soru. Hesap açma formu, parola, doğum tarihi, kurtarma bilgisi yok. E-posta olmadan hafta 9-15 çalışmaz |
| Windows güncelleme ekranı (eklenen) | YOK | `ayarlar` ad.14 yalnızca "denetle" |
| İade/cayma hakkı (eklenen) | YOK | 0 sonuç |

## 2. Öncelik sırası (6-8 ders)

Ölçüt: sıklık, önem, öğretilebilirlik. Hafta numaraları `lessons/index.js` sırasına göre.

### 1. Kendi e-posta adresinizi açın (`eposta-hesap-ac`)
- Yer: Hafta 9, `gmail-hotmail`'in hemen arkasına. Süre: 30 dk. Biçim: (b).
- Neden: E-posta adresi olmayan kursiyer hafta 9-15'in yarısına katılamaz (e-Devlet, banka, alışveriş, Google hesabı). Birçoğunun adresi torunun açtığı ve şifresini bilmediği bir adres. Gerçek formlardaki "tarih seçici, kullanıcı adı alınmış, parola kuralı" burada öğretilir.
- Benzetim: `src/dersler/apps/siteler-hesap.js` (şifremi unuttum sitesi, `strength` parola ölçer var) yanına "Hesap oluştur" sayfası: ad-soyad, kullanıcı adı (ilk deneme "kullanılıyor" der, öneri sunar), parola (kural + göster), doğum tarihi (gün/ay/yıl açılır liste), telefon/kurtarma e-postası, şartlar kutusu. Bitince `mail.js` gelen kutusuna "Hoş geldiniz" postası düşer.
- Adımlar:
  1. Neden kendi adresiniz olmalı (torunun adresi değil); Gmail mi Outlook mu (özet).
  2. "Hesap oluştur" bulunur, ad-soyad yazılır.
  3. Kullanıcı adı: Türkçe karakter yok, ilk seçim alınmış, öneriden seçilir.
  4. Parola: 12+ karakter, üç kelimelik cümle yöntemi, güç göstergesi, "göster" gözü.
  5. Doğum tarihi açılır listeyle seçilir; telefon ve kurtarma e-postası neden önemli.
  6. Şartlar kutusu; adresi ve parolayı kâğıda yazma (kasada saklı), ekranda asla.
  7. Giriş yapıp ilk postayı görme, çıkış yapma.
  8. Soru: "Biri parolanızı sormak için arıyor" ve "Torunum adresimi kendi telefonuna kurdu, sorun mu?".

### 2. İlk e-Devlet girişi: şifrenizi nasıl alırsınız? (`edevlet-ilk-giris`)
- Yer: Hafta 14, `edevlet`'ten önce (listenin başı). Süre: 25 dk. Biçim: (c), isteğe bağlı (a) olarak mevcut `www.turkiye.gov.tr` benzetimine "şifre değiştir" ekranı.
- Neden: Kurs e-Devlet şifresini hazır varsayıyor (`hizmet.js` kurs şifresi veriyor). Evde ilk şifre PTT'den alınır; olmadan hafta 14 ve e-Nabız, SGK, MHRS yararsız kalır. (`eksikler-hafta13-15-ek.md` fikir 3; güncel e-Devlet sayfasından doğrulayın.)
- Adımlar:
  1. Giriş yolları: şifre, e-imza, mobil imza, T.C. Kimlik Kartı, internet bankacılığı.
  2. Şifre alma: PTT şubesi (kimlikle, şahsen), bazı bankaların internet şubesi; "kapıya gelen şifre" yok.
  3. İlk girişte şifreyi değiştirme (kural, geçici şifre).
  4. Kayıtlı cep telefonu ve e-posta güncelleme (SMS kodu buraya gelir).
  5. "Şifremi unuttum": hangi yollar var, hangileri kimliksiz yapılamaz.
  6. Ortak bilgisayarda "Güvenli Çıkış"; tarayıcının "şifreyi kaydet" sorusuna ne denir.
  7. Soru: "Size e-Devlet şifrenizi yenilemek için kod gönderen SMS" (sahte), "PTT'ye giderken ne götürürsünüz".

### 3. Faturayı internetten ödeyin (`fatura-ode`)
- Yer: Hafta 14, `sanal-kart-iban`'ın arkası. Süre: 30 dk. Biçim: (b).
- Neden: Her ay, herkes. Bugün fatura yalnızca okunuyor/yazdırılıyor; ödeme, abone numarası, kurum seçme, otomatik ödeme talimatı yok. Banka benzetimi hazır.
- Benzetim: `siteler-banka.js` (bakiye, para gönder, dekont var): "Fatura öde" menüsü (kurum listesi, abone/tesisat no, borç sorgula, SMS onay, makbuz PDF) + `lessons/gunluk2.js` elektrik faturası PDF'inde belirgin abone numarası. İsteğe bağlı "Otomatik ödeme talimatı" anahtarı.
- Adımlar:
  1. Faturadan abone numarasını, son ödeme tarihini, tutarı bulma (`elektrik faturası.pdf`).
  2. Ödeme yolları: banka uygulaması, kurum sitesi/e-Devlet, PTT, otomatik ödeme.
  3. Bankada Fatura Öde, kurum seç, abone no gir, borcu gör ve tutarı kontrol et.
  4. SMS onayı; kodu başkasına söylememe.
  5. Makbuzu/dekontu indirme, Belgeler\Faturalar klasörüne koyma.
  6. Aynı faturayı iki kez ödememek (borç sıfırlandı mı bakma).
  7. Soru: "Faturanız ödenmedi, kesilecek" SMS'i ve içindeki bağlantı.

### 4. Telefonla belge tarayıp PDF yapın, bilgisayara alın (`telefon-tarama`)
- Yer: Hafta 13, `telefon`'dan sonra (`pdf-calis`'ten önce). Süre: 30 dk. Biçim: (b) küçük.
- Neden: Dilekçe eki kimlik, tapu, rapor fotokopisi taramak çok sık; e-posta ve formlar PDF ister. Kurs "taranmış PDF"yi yalnızca okuyor.
- Benzetim: `explorer.js` "Telefonum" cihazına `Belgeler\Taranan` klasörü ve örnek taranmış sayfalar eklenir (`telefon` dersindeki DCIM yapısı hazır). `siteler-mesaj.js` (`web.mesajlas.com`) içine "Kendime" sohbeti (telefondan yollanan belge burada görünür, indirilir). Tarama ekranı tek sayfalık sahte telefon kutusu olabilir; yoksa (c) olarak anlatım + fotoğraflı sorular.
- Adımlar:
  1. Üç yol: yazıcı/tarayıcı cihazı, telefonda Drive "Tara" / Not uygulaması "belgeyi tara", fotoğraf çekip yollamak (kötü: eğri, gölgeli).
  2. İyi tarama kuralları: düz zemin, ışık, köşeler çerçevede, tek sayfa = tek PDF.
  3. Telefonda PDF olarak kaydetme, ad verme (kimlik-on-yuz.pdf).
  4. Bilgisayara alma: kablo (`telefon`), "Kendime" WhatsApp sohbeti, e-posta, bulut; her birinin artısı/eksisi.
  5. İndirilenlerde bulma, Belgeler\Taranan klasörüne taşıma.
  6. Boyut (2 MB sınırı) sorunu: PDF çok büyükse `foto-boyut` mantığı, ya da kalitesini düşür.
  7. Kişisel belge (kimlik) ile dikkat: kime gönderilir, tarama kopyasını telefonda bırakmama.

### 5. Modem ve Wi-Fi şifresi (`modem-wifi-sifre`)
- Yer: Hafta 8, `internet-kesildi`'nin arkası. Süre: 25 dk. Biçim: (b).
- Neden: "Misafir geldi şifre ne?", "şifreyi unuttum", "komşu kullanıyor galiba". Kurs bağlanmayı ve modemi yeniden başlatmayı öğretiyor; şifreyi bulmak/değiştirmek yok.
- Benzetim: `modem.js` modeline altta etiket (ağ adı, Wi-Fi şifresi, modem sayfası adresi 192.168.1.1, yönetici şifresi) eklenir; `siteler-ag.js` yanına `192.168.1.1` yönetim sayfası (giriş, Wi-Fi adı, Wi-Fi şifresi alanı, "Kaydet", bağlı cihazlar listesi). `settings.js` Wi-Fi ekranında "bağlı ağın şifresini göster" (isteğe bağlı).
- Adımlar:
  1. Modemin altındaki etiketi okuma (SSID, Wi-Fi şifresi, yönetici bilgileri); kâğıda yazma.
  2. Bilgisayardan bağlı Wi-Fi'nin şifresini görme (Ayarlar → Ağ → ağ özellikleri).
  3. Tarayıcıda 192.168.1.1: bunun internet sitesi değil, modemin kendi sayfası olduğu.
  4. Giriş (etiketteki yönetici şifresi), Wi-Fi bölümü.
  5. Varsayılan şifreyi güçlü yapma, ad değiştirme (adınızı/adresinizi yazmama).
  6. Kaydedince bağlı cihazların kopması: hepsine yeni şifre girme (telefon, TV).
  7. "Bağlı cihazlar" listesinde tanımadığın cihaz varsa şifreyi değiştirme.
  8. Soru: "Modem sayfası şifrem 'admin', dokunmaya korkuyorum".

### 6. Sorunu internette aratıp çözün (`sorun-ara`)
- Yer: Hafta 8, `arama-motorlari`'nın arkası (ya da hafta 13). Süre: 25 dk. Biçim: (a), mevcut benzetimle.
- Neden: Kursiyer kurs bitince yalnız kalır; "yazıcı çıktı vermiyor, ne yapayım?" diye doğru aratabilmek kalıcı bağımsızlık. Sahte "yardım" sitelerinden korur.
- Benzetim: Arama motoru ve `apps/sites.js` içindeki `www.yazici-destek.com.tr`, `www.eski-forum.com`, `www.program-indir.com.tr`, `www.super-hizlandirici.xyz` siteleri hazır. Yeni site gerekmez; yalnızca arama sonuçlarına "yazıcı çıktı vermiyor" sorgusu için üç sonuç (üretici sitesi, eski forum, sahte yardım) eklenir.
- Adımlar:
  1. Ekrandaki hata mesajını ya da modelini aynen yazma (ekran alıntısı + `alinti`).
  2. İyi sorgu: marka + model + sorun ("HP 2130 yazıcı çevrimdışı"), tırnak işareti.
  3. Sonuçları okuma: reklam, üretici sitesi, forum, video.
  4. Güvenilirlik: adres uzantısı (`adres` dersi), üretici/Microsoft sitesi önce.
  5. Tuzak: "Bilgisayarınız virüslü, bu numarayı arayın / bu programı indirin" (`super-hizlandirici`).
  6. Çözümü uygulamadan önce neyi değiştirdiğini anlama; emin değilsen yazıp bir tanıdığa danışma.
  7. Çözümü not alma (sık kullanılanlara ekleme).

### 7. Sesle yazın: Windows + H (`sesle-yazma`)
- Yer: Hafta 5, `ekran-klavyesi`'nin arkası (alternatif giriş yöntemleri). Süre: 15 dk. Biçim: (b) küçük.
- Neden: Klavye zor gelen yaşlı için mektup/mesaj yazmanın en kolay yolu; ücretsiz; kursta hiç yok.
- Benzetim: `donatilar.js`/Not Defteri ve `word.js` penceresine ⊞ + H şeridi ("Dinliyor…" mikrofon düğmesi). Gerçek mikrofon yok: düğmeye basınca hazır cümleler sırayla yazılır (noktalama ve "yeni satır" komutlarıyla). Telefonun klavyesindeki mikrofon düğmesi bilgi olarak anlatılır.
- Adımlar:
  1. Dikte nedir; telefon klavyesinde de mikrofon düğmesi vardır.
  2. Not Defteri'ni açıp imleci yazı alanına koyma (şerit yalnızca yazı kutusunda açılır).
  3. ⊞ + H: mikrofon şeridi, izin sorusu, "Dinliyor" yazısı.
  4. Konuşma: yavaş ve net; "nokta", "virgül", "yeni satır", "soru işareti" demek.
  5. Hatalı yazılan kelimeyi klavyeyle düzeltme (yazım denetimi).
  6. Durdurma (mikrofona tekrar tıklama / Esc); gerçekte internet gerekir ve ses sunucuya gider.
  7. Soru: "Dikteye banka şifrenizi söyler misiniz?", "Gürültülü ortam".

### 8. Torunun tableti ve telefonu: güvenli kullanım (`torun-guvenligi`)
- Yer: Hafta 15, `kisisel-veri`'nin arkası. Süre: 25 dk. Biçim: (c).
- Neden: Kursiyerler torun bakıyor; tablet verilir, uygulama içi satın alma, tanımadık kişilerle sohbet, kartın kayıtlı olması. Kursta yalnızca antivirüs dersinde tek cümle.
- Adımlar (senaryo soruları + ekran görüntülü bilgi):
  1. Tabletinizde kartınız kayıtlıysa torun satın alabilir (oyun içi satın alma); kartı kaydetme, ödeme şifresi.
  2. Ebeveyn denetimi/Aile bağlantısı (Google Family Link, Apple Ekran Süresi, Windows Aile): ne yapar (süre, yaş, uygulama onayı).
  3. YouTube'da çocuk için güvenli seçenek (Kids uygulaması, kısıtlı mod); "önerilen videolar" tuzağı.
  4. Tanımadığı kişiyle sohbet/oyun mesajı: ne söylenir, kime anlatılır, adres/okul adı paylaşılmaz.
  5. Fotoğraf paylaşırken torunun yüzü ve okul forması (`sosyal-medya-guvenlik` ile bağ).
  6. Ekran süresi ve göz sağlığı (`bakim`'e atıf).
  7. Soru: "Torun 'Robux alayım mı' dedi", "Bilmediği biri arkadaşlık isteği attı", "Kimliği paylaşma".

## 3. Ders kapsamı dışı, kısa ek (ders açmaya değmeyen)

- **Sonuç sorgulama (e-Okul/ÖSYM/İŞKUR):** `edevlet-kamu`'ya 2-3 adım; e-Nabız gibi e-Devlet'e yönlendiren bir sayfa (`siteler-hizmet.js`). İsterseniz 9. ders olabilir (30 dk, b).
- **İade/cayma hakkı:** `alisveris`'e 2 adım (14 gün, kargo takip no, "iade için önce satıcıyı yaz").
- **"Güncelleştiriliyor %37, kapatmayın":** `ayarlar`'ın 14. adımına 1 ekran (önceki rapordaki fikir).
- **e-imza/mobil imza ve el yazısı imza:** `pdf-duzenle` ad. 7'ye 1-2 cümle.
- **Evde yazıcı yazmıyor, indirdim ama açılmıyor, telefonda arayan kişi:** `eksikler-*.md`'deki fikirler hâlâ geçerli; öncelikleri yukarıdakilerden düşük.

## 4. Emin olunmayan noktalar
- Gerçek sitelerin ekranları (e-Devlet şifre alma yolları, Gmail kayıt adımları, modem arayüzü) sık değişir; ders yazılmadan önce güncel sayfadan doğrulanmalı.
- `telefon-tarama` için telefon tarafı benzetimi isteniyorsa en pahalı parça odur; ucuz sürüm (c) + mevcut Telefonum klasörü.
