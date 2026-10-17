# Ders kalite incelemesi: 14–15 Ekim 2026'da eklenen dersler

Kapsam: 38f9b12..09cad51 arasında eklenen/değişen ~110 ders + ana sayfa. İşletim sistemleri dersinin Windows 7/8.1/10/11 kısmı kapsam dışı.
Yöntem: 7 Sonnet agenti; kaynak okuma + `dist/index.html` Brave/puppeteer ile 1366×768'de adım adım ekran görüntüsü ve gerçek tıklama/yazma.
Genel: hiçbir derste konsol hatası yok; derslerde beklenen bütün olay adları gerçekten tetikleniyor. Hiçbir dosya değiştirilmedi.

---

## 1. Ders TAKILIYOR (öğrenci "Adımı geç" olmadan ilerleyemiyor)

| # | Ders | Sorun | Yer |
|---|---|---|---|
| 1 | takvim-randevu (5. h.) | 2. adım: Takvim `installable: true`, ders onu kurulu başlatmıyor → Başlat'ta ve aramada yok | apps/index.js:65, ileri2.js:10 (derse `desktop: { settings: { installed: ['takvim'] } }`) |
| 2 | alisveris (14. h.) | "Kapıda ödeme" seçilirse adım 7 (SMS) hiç tamamlanmaz; adım 6 "3D Secure açıldı" der | islemler.js:232, 239-241 |
| 3 | yapay-zeka | Kimlik no uyarısından sonra yazı kutuda kalıyor; sonraki soru arkasına ekleniyor, adım 10 takılıyor | siteler-yz.js (`st.draft`) |
| 4 | belge-duzen (10. h.) | Bul ve Değiştir kutusu açık kalıp vurgu paletini örtüyor; "önemli yeri boyayın" yapılamıyor | kelime.js:282, word.js:62 |
| 5 | simge-sekil (10. h.) | İpucu "Ctrl+A şekil yazısını seçer" yanlış: bütün sayfayı seçer, yazınca belge silinir | kelime2.js:359 |
| 6 | tarayici, tarayici-not (13. h.) | Tarayıcı penceresi klavye odağı almıyor: Ctrl+H/F/D, Ctrl+Shift+N/B ilk basışta çalışmıyor (6 adım) | apps/browser.js ~826 (`api.focus` yok) |
| 7 | tablo-parkur (11. h.) | İpucu "Tab ile yan hücre": satır sonunda Enter başa dönmüyor, alt hücreye iniyor → veri kayıyor. Ayrıca Başlat'ta "hesap"+Enter Hesap Makinesi'ni açıyor | sheet.js:950, excel2.js |
| 8 | calisma-sayfalari (11. h.) | 5. adım "şubat" kabul ediyor, 6. adım tam "Şubat" arıyor | excel2.js:206, 212 |
| 9 | yazi-sorun (2. h.) | Insert modu yalnız fiziksel Insert tuşuyla kapanıyor; çoğu dizüstüde yok | notepad.js:137 |
| 10 | adres (8. h.) | 13. adım: önceki adımın site bilgisi kutusu açık kalıp öneri listesini örtüyor | apps/browser.js `.bi-x` |
| 11 | ilan-tuzak (14. h.) | Önce 7. ilanı şikâyet eden öğrenci "bir tane daha" adımını tetikleyemez | hizmet.js:150, 173 |
| 12 | alisveris | Tek ürünle sepete gidince sessizce takılıyor (uyarı yok); SMS 30 sn sonra kayboluyor, yeniden gönderme yok | islemler.js:209, siteler-gunluk.js:350 |
| 13 | e-Devlet | Üstteki "Giriş yap" ile girilirse ana sayfaya düşülüyor, sonraki adımın formu yok | siteler-gunluk.js:111 |
| 14 | gorunum-renk, temalar (7. h.) | Ayarlar'da aşağıdaki bir anahtara tıklanınca pencere bomboş kalıyor (içerik dışarı kayıyor); gorunum-renk 4-7. adımlar yapılamıyor | css/20-apps.css:98-100 (`.st-tog`'a `position: relative` yok — doğrulandı) |
| 15 | zip, resimweb (6. h.) | Dosya Gezgini Ayrıntılar görünümünde ilk tıklamada komut çubuğu uzayıp satırlar 27 px kayıyor; çift tık ve sağ tık yanlış dosyaya gidiyor | apps/explorer.js `chrome()` |

## 2. Adım KENDİLİĞİNDEN geçiyor / denetim zayıf

- tablo-ince: başlık hücresi yazılmadan "Aferin" (belgede zaten "aidat çizelgesi" yazıyor) — kelime2.js:283
- sayfa-duzeni: "Hâlâ taşıyorsa" adımı hiçbir şey yapmadan geçiyor — kelime2.js:184-191
- slayt-duzen: "iki listeyi doldurun" yalnız sol listeye bakıyor — sunu2.js:44
- duseyara 3. adım: "45" yazan da geçer — excel3.js:52
- saat-tarih 3. adım: setup tarayıcıyı açıyor, açılış sayfası saat hatası verip adımı öğrenci bir şey yapmadan geçiriyor — saat.js (setup `maxed(c,'browser')`, browser.js:121)
- temalar: "simgeleri sola hizala" anahtar kapatılınca da geçiyor
- takvim "Hatırlatma gelsin" beklemeden geçiyor; bildirim "15 dk sonra" diyor ama randevu 10 dk sonra — ileri2.js:51-57

## 3. YANLIŞ BİLGİ

- klavye-dili: "Türkçe Q'da Shift+2 çift tırnak (")" → kesme işareti (') — fqklavye.js:144
- fq-klavye: "işaret parmakları A ve K'nin altında" → A ve T — fqklavye.js:55
- video-hz: "1080p'deki p piksel demektir" → progressive (aşamalı tarama) — videohz.js:152
- alisveris: "500 ₺'yi geçince kargo bedava oldu" → sepet baştan 808 ₺, kargo hiç değişmiyor — islemler.js:210, 217
- pdf-calis "PDF değiştirilemez" ↔ PDF Okuyucu'da her zaman Düzenle şeridi var; pdf-duzenle "bu kez Düzenle şeridi de var" — apps/media.js:64
- Yazdırma: varsayılan yazıcı "PDF olarak kaydet" ama dersler "yazıcıya gitti, kâğıda çıktı" diyor (pdf-calis, mesajlas-web, pdf-duzenle, edevlet)
- fare-ayar: "Sarı açık zeminde iyi seçilir" yanlış — erisim.js:86
- sunu-ani: "3 slaytlık sunu", sunuda 4 slayt — sunu3.js:99
- smartart: "Teyzem Fatma" Dedem Mehmet'in altında (teyze anne tarafı) → "Halam" — sunu2.js:107, 130
- gmail-hotmail: Skype "aynı hesap" (Skype Mayıs 2025'te kapandı) — gmailhotmail.js:18
- tarayici-not: "Sayfanın altında sık kullanılanlar çubuğu" → adres çubuğunun altında
- mesajlas-web: ⋮ "sol üstte" (ipucu "sağda"; gerçekte sağ üst)
- bakim-guvenlik: Disk Temizleme ve USB tarama Windows Güvenliği içinde gösteriliyor; gerçekte değil — apps/guvenlik.js
- isletim (Ubuntu): "çubuktan Uçbirim'i açın" ama çubukta Uçbirim yok — isletim.js:106
- e-Nabız "Güvenli çıkış" e-Devlet oturumunu kapatmıyor ama "güvenli çıkış yapıldı" diyor — hizmet.js:106
- gorev: Görev Yöneticisi i5-12400, Ayarlar i7-8700 (aynı bilgisayar) — taskmgr.js:178
- bluetooth: "Bluetooth ya da uçak modu kapalı" → "uçak modu AÇIK" — bluetooth.js:102
- resimweb 5. adım: "türü ve boyutuna bakın" ama Resimler simge görünümünde açılıyor (tür/boyut yok)
- testDonanim: "diske bir güç bir veri kablosu" yalnız SATA için doğru (M.2'de kablo yok)
- odev2: "ş ğ ü ö ç ı İ hepsi çıkmalı" cümlesinde ö ve küçük ş yok — odevler.js:45
- odev11: başlık satırı/TOPLA aralığı kendi içinde tutarsız — odevler.js:125-130
- Eksik içerik: "Randevu belgesini PDF indir" hiçbir derste öğretilmiyor ama parkur ve test14 soruyor

## 4. EKRANDA GÖRÜNEN HATALAR (UI)

- **`\'` kaçış hatası** (ekranda "Giriş Yap\'a", "Bul\'u", "Belgeler\'e"): islemler.js:49, 77, 84, 127, 191, 400; programlar2.js:159 (×2), 240, 329. Hepsinde `\\'` → `'`.
- video-gazete: "Reklamı atla ▶" beyaz zemin üstüne beyaz yazı — css/20-apps.css:1144 `.iz-skip` eziliyor
- bluetooth: Müzik Çalar "▶ Çal" yazısı beyaz üstüne beyaz — css/20-apps.css:671 `.mu-play`
- saat-tarih 11. adım: saate sağ tık "Tarih ve saati ayarla" yerine görev çubuğu menüsünü açıyor — desktop.js:840 / 849-862
- temalar: Mağaza ayrıntı sayfasında dev boş simge, yayımcı/boyut yazıları kesik
- resimweb 12. adım: sayfa açılınca odak yok, Ctrl+U çalışmıyor
- Denetim Masası: alt bağlantılar ~10 px, arama kutusu yazısı kesik
- duseyara: hedef formül kutuda kesik ("…;2;YANL") — excel3.js:43
- Sürükle-bırak (sırala/ayır) 1366×768'de kartlar kutuların üstüne biniyor: gmailhotmail.js:58-72, sunu-kurallar 5. adım (`.so-bins`)
- telefon ve özet tabloları: "Ctrl + C → Resimler → Ctrl + V" satırı tuş kutularına bölünüp tablo taşıyor — app.js:354
- Görev Yöneticisi penceresi dar (sütunlar kesik); Takvim penceresinde "Randevu ekle" formu kesik
- rehberSoru şıkkında `<b>` olunca kelimeler arası büyük boşluk — kalip.js
- Ekran klavyesinde tuş adları kırpılıyor ("aps Loc", "Delet")
- cerezler: çerez listesi sütunları kesik — browser.js:406
- excel-yazdir: önizleme "2 sayfaya bölündü" diyor ama tek sayfa gösteriyor, yazı okunmuyor
- klavye-dili: Not Defteri Ayarlar'ın arkasında kalıyor
- telefon: Ctrl+V odak kaybı (Resimler'e tıklayınca), telefon resmi Gezgin'i örtüyor
- Ana sayfa: 172 kartın 80'i hâlâ emoji (eski PC'de boş kare); 4-6 ve 11-13. hafta renklerinde beyaz yazı kontrastı düşük (5. hafta "Başla" 2,1:1, hedef 4,5:1); 1024 px'te üst çubuk iki satır
- Word: başlık üç tıkla seçilince boş paragraf da seçilip sonraki metin ortalı çıkıyor (apartman-duyuru, dilekce-parkur)
- simge-sekil: ikinci şekil birincinin içine giriyor
- mektup: adres alanı paragraf dışına düşüyor; "Sayın Ayşe Kaya ," — ileri2.js:140

## 5. DİL / ÜSLUP / ÖLÇME (düşük)

- rehberSoru şıkları karıştırılmıyor; doğru cevap çoğunlukla 2. şık ve en uzun şık (adres 5/5, aramamotoru, bakimguvenlik, medya)
- Öğrenci ekranında "Eğitmen notu" kutuları (tablo-parkur, dilekce-parkur, ehizmet-parkur); ödev kâğıdında "(eğitmen için)" başlığı
- Testlerde kapsam boşlukları (test10: kaydetme/stiller/mektup yok; test13: telefon, uzantı, YZ yok)
- Tek tek: "gerçekleri de aynı çalışır" (aramamotoru.js:27), "internetin bağlantısını", "Bir yanlışlıkla", "gözardı", "ileri yaştakiler", oyuncu/ekran kartı/400 FPS örneği (videohz.js:181), şaka şıklar ("modemi bahçeye atarım"), ödev metinlerinde Win 10/11 menü adı farkları
- Boş "✔ Aferin!" (done metni olmayan adımlar): calisma-sayfalari 5, sunu-ani 4 ve 7, animasyon Esc, slayt-duzen 3

---

## Ders başına durum (özet)

**1–2. hafta:** dizustu, odev1, test1: küçük sorunlar · fq-klavye: A/K bilgisi · klavye-dili: Shift+2 bilgisi, Not Defteri arkada · yazi-sorun: Insert takılması, kırpık tuşlar · odev2: eksik harf · test2: kolay şıklar
**5. hafta:** takvim-randevu TAKILIYOR · donatilar: "Dinle" sabit melodi, küçük düğmeler · ekran-klavyesi, sanal-masaustu, okuma-kolay: küçük · fare-ayar: sarı imleç bilgisi · gorev / gorev-ayrinti: dar pencere, CPU çelişkisi · odev5, test5: küçük
**4. hafta:** donanım dersi bağlantısı doğru · testDonanim: SATA/M.2 genellemesi · odev4, test4: sorunsuz
**6. hafta:** resimweb: 5. adım görünüm, Ctrl+U odağı · zip: Ayrıntılar görünümü kayması (5-6. adım) · odev6, test6: küçük (yeni konulara soru yok)
**7. hafta:** saat-tarih: 3. adım kendiliğinden, sağ tık menüsü · denetim-masasi: sorunsuz (küçük yazı) · temalar: Ayarlar boşalması, Mağaza sayfası · gorunum-renk TAKILIYOR · bluetooth: Çal yazısı, uçak modu bilgisi · hesap-pin: ekranda alıştırma şifresi ipucu · odev7, test7: küçük
**8. hafta:** tarayicilar: sorunsuz · adres: 13. adım örtme · arama-motorlari: küçük · video-gazete: görünmeyen "Reklamı atla" · video-hz: "p=piksel" · bakim-guvenlik: gerçekle uyumsuz menü · virus-antivirus: küçük · isletim (Ubuntu/Pardus): Uçbirim yönlendirmesi, Ubuntu 22.04 · odev8, test8: küçük
**9. hafta:** gmail-hotmail: sürükle-bırak binmesi, Skype · eposta-iletme: Bcc bağlantısı söylenmiyor · ek-tasi: güvenlik notu yok · sifre-sifirla: küçük · eposta2: imza sırası · bulut-paylas: `\'` · odev9, test9: küçük
**10. hafta:** belge-duzen TAKILIYOR · simge-sekil TAKILIYOR · tablo-ince kendiliğinden geçiyor · sayfa-duzeni akış tutarsız · apartman-duyuru, dilekce-parkur: ortalı metin · mektup: alan/virgül · kelime-harf: küçük · ozgecmis: `\'` · odev10: sorunsuz · test10: kapsam
**11–12. hafta:** duseyara: kesik formül, virgüllü argüman · tablo-parkur TAKILIYOR · calisma-sayfalari: büyük/küçük harf · excel-yazdir: önizleme · aidat-takip, doldur-dondur, hucre-ince: küçük · butce: `\'` · sunu-kurallar: kart binmesi · sunu-ani: 3/4 slayt · smartart: teyze/hala · slayt-duzen, animasyon, ani-albumu: küçük · odev11 tutarsız · test11/12: sorunsuz
**13. hafta:** tarayici / tarayici-not: klavye odağı · telefon: tablo taşması, `\'`, Ctrl+V odağı · cerezler: kesik sütunlar · pdf-calis / pdf-duzenle: Düzenle şeridi çelişkisi, yazıcı · mesajlas-web: ⋮ konumu, ad tutarsızlığı · odev13, test13: küçük
**14. hafta:** edevlet: `\'`, üst giriş bağlantısı · randevu: `\'`, PDF adımı yok · alisveris TAKILIYOR + kargo bilgisi · gorusme: sorunsuz (küçük el kaldır etiketi) · e-nabiz: çıkış · ilan-tuzak: ilan 7 · ehizmet-parkur: öğretilmemiş PDF adımı · odev14, test14: küçük
**Yapay zekâ:** TAKILIYOR (kutuda kalan kimlik no)
**Ana sayfa:** kontrast, emoji kartlar

## İncelenemeyenler
- Ekran görüntüleri oturum geçici klasörü silindiği için kayboldu; kanıtlar dosya:satır ve test çıktısı olarak verildi.
- Kısmen yürütülenler: e-nabiz ikinci yarısı, ilan-tuzak, ehizmet-parkur, ani-albumu son adımı, testlerin tüm soruları tek tek tıklanmadı.
- Eski bilgisayardaki gerçek emoji/yazı tipi görünümü test edilemedi.
