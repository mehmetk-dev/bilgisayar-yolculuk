# Eksikler raporu: 13., 14., 15. hafta ve Ek ("Hafta 0") dersleri

Tarih: 2026-10-30 · Kapsam: `dokum-2026-10-30.md` 2471–3058. satırlar (13 + 11 + 8 + 5 ders). Kod değiştirilmedi.

Yöntem: Dökümde yalnızca adım metinleri var; özet panelleri ve "doğru/yanlış" açıklamaları (`why`, `done`) yok. Bu yüzden ilgili ders kaynaklarını da okudum (`src/dersler/lessons/islemler.js`, `odeme.js`, `hizmet.js`, `kamu.js`, `bilgiguvenligi.js`, `bilgiguvenligi2.js`, `guvenlik.js`, `gunluk2.js`, `testler.js`, `final.js`). Bir konu için "eksik" demeden önce dökümün tamamında ve kaynakta arama yaptım. Sonuç: URL okuma, sahte e-Devlet sitesi, reklam sonucu, SMS kodu paylaşmama, sanal kart, kapora, taklit hesap, ortak Wi-Fi, ortak bilgisayarda çıkış zaten iyi anlatılmış. Aşağıdakiler gerçekten boşluk.

Öncelik özeti: **8 YÜKSEK, 5 ORTA, 2 DÜŞÜK = 15 bulgu.**

"(emin değilim)" işareti: bilginin ayrıntısını öğretmenin ya da yazarın güncel kaynaktan doğrulaması gerekir.

---

## YÜKSEK

### 1. Telefonla "polis / savcı / banka" dolandırıcılığı ana derste yok
- **Tür:** eksik
- **Ders / adım:** `guvenlik` (Hafta 0), "Telefon araması" kartı ve özet paneli. Konu şu an yalnızca `dolandirildim` dersindeki 155 sorusunun açıklamasında tek cümleyle geçiyor.
- **Sorun:** Yaşlıları en çok vuran senaryo, "adınıza soruşturma var / hesabınız kara paraya karışmış, paranızı ya da altınızı güvenli hesaba aktarın, kimseye söylemeyin, telefonu kapatmayın" aramasıdır. Derste yalnızca "banka kodu ister" senaryosu var. Ayrıca arayan numaranın bankanın ya da polisin numarası gibi görünebileceği (numara taklidi) hiçbir yerde söylenmiyor. "Kapatın, kendiniz arayın" önerisi tek başına yetmez: kapatınca aynı kişiye bağlanılan durumlar anlatılıyor (emin değilim, ama öğretmenler tanıyordur).
- **Öneri:** `guvenlik` içine yeni bir `card` ("Telefon araması 2") ve özet paneline bir satır ekleyin.
  - Kart metni: "Merhaba, ben Ankara Emniyeti'nden komiser. Adınıza bir soruşturma var. Paranız tehlikede; hepsini bizim verdiğimiz hesaba aktarın. Telefonu kapatmayın, kimseye söylemeyin." (doğru cevap: dolandırıcılık)
  - Açıklama: "Polis, savcı, hâkim, banka ve SGK telefonda para, altın ya da kart bilgisi istemez; 'güvenli hesaba aktarın' demez. 'Kimseye söylemeyin' ve 'telefonu kapatmayın' diyen kişi dolandırıcıdır. Ekranda görünen numara da taklit edilebilir. Kapatın, birkaç dakika bekleyip (ya da başka bir telefondan) bankanızı kartın arkasındaki numaradan, polisi 155'ten kendiniz arayın. Önce bir yakınınıza anlatın."
  - Özet satırı: `['“Polisiz / savcıyız / bankadanız, paranızı aktarın”', 'Kapatın. Kimse telefonla para istemez. Yakınınıza anlatın, 155 veya bankayı kendiniz arayın']`

### 2. "Programı kurun / ekranı paylaşın" (uzaktan erişim) ve APK dolandırıcılığı hiç yok
- **Tür:** eksik
- **Ders / adım:** `guvenlik` "Virüs uyarısı" kartı (açıklamasında yalnızca "uzaktan bilgisayarınıza bağlanıp para ister" geçiyor), `dolandirildim`.
- **Sorun:** Dökümün tamamında "AnyDesk", "TeamViewer", "ekran paylaşımı", ".apk" ya da "uygulama kurun" geçmiyor. Sahte banka ya da "destek" görevlisi, kursiyeri telefonuna/bilgisayarına bir uzaktan yardım programı kurdurup bankacılık uygulamasını ekrandan izler ve kodu okur. Tek bir cümlelik açıklama bunu öğretmez.
- **Öneri:** `guvenlik` içine yeni kart: "Telefondaki kişi 'işleminizi iptal edeceğiz, şu programı kurun / ekranı bizimle paylaşın' diyor." Doğru cevap: kurmam, kapatırım.
  - Açıklama: "Bankanın, devletin ya da bir 'destek ekibinin' sizden bir program kurmanızı, ekranınızı paylaşmanızı ya da size SMS ile gelen bir dosyayı (.apk) açmanızı istemesi dolandırıcılıktır. Bu programlar ekranınızı karşıdakine gösterir ve kod, şifre onun eline geçer. Böyle bir şey kurduysanız: interneti kapatın, programı silin, bankayı arayın (bkz. bulgu 8)."
  - Telefon uygulamaları için tek kural: "Uygulamayı yalnızca telefonunuzun kendi mağazasından (Google Play / App Store) indirin; mesajla gelen dosyayı açmayın."

### 3. WhatsApp hesabının çalınması (doğrulama kodu, karekod, bağlı cihazlar) anlatılmıyor
- **Tür:** eksik
- **Ders / adım:** `mesajlas-web` (13. hafta). Adım 1 ve adım 9–12 dolandırıcı bağlantısını anlatıyor, kod ve karekod konusu yok.
- **Sorun:** Türkiye'de çok sık: tanıdığın bir hesaptan "yanlışlıkla sana bir kod gitti, iletir misin?" ya da "gruba katılmak için bu karekodu okut" mesajı. WhatsApp'ın 6 haneli kodu verilirse hesap çalınır, tüm tanıdıklardan para istenir. Derste hem karekod hem "kod kimseye söylenmez" kuralı var ama WhatsApp'a bağlanmıyor. Ders, kursiyere karekod okutmayı öğretirken kimin karekodunu okuttuğunu sormuyor.
- **Öneri:** `mesajlas-web` sonuna iki kısa adım ya da ipucu ekleyin.
  - Adım "Karekod kimin?": "Karekodu yalnızca kendi bilgisayarınızın ekranındaki koddan okutun. Biri size karekod gönderip 'okut' derse, hesabınızı onlara bağlarsınız. Telefonda WhatsApp → ⋮ → Bağlı cihazlar listesinde tanımadığınız cihaz varsa 'Çıkış yap' deyin."
  - Adım "Kod kimseye verilmez": "WhatsApp size 6 haneli kod gönderdiyse ve siz istemediyseniz, kodu kimseye (tanıdığınıza da) söylemeyin. Kodu isteyen kişinin hesabı ele geçirilmiş olabilir; onu telefonla arayın."
  - Ödev 13 görev 8'e ek: "WhatsApp'ta Ayarlar → Hesap → İki adımlı doğrulama'yı açıp 6 haneli bir PIN belirleyin" (WhatsApp'ın kendi iki adımlı doğrulaması vardır). `iki-adimli` dersinde yalnızca kurgusal "Dostlarım" hesabı kullanılıyor; en çok kullanılan hesabın korumasını kimse göstermiyor.

### 4. e-Devlet'e giriş yolları ve şifreyi edinme/yenileme yok; "PTT'den alırsınız" eksik
- **Tür:** eksik (+ kısmen güncel olmayan)
- **Ders / adım:** `edevlet` adım 4 "Giriş yapın" ve son soru. PTT yalnızca özet panelinde ("şifre PTT'den alınır") ve soru açıklamasında ("unutursanız PTT'den yenisini alırsınız") geçiyor. Adım metinlerinde (dökümde) PTT, e-imza, mobil imza, banka ile giriş hiç yok.
- **Sorun:** Kurs "kendi e-Devlet şifrenizle girin" diyor (`odev14`) ama kursiyerin şifresi yoksa ya da unuttuysa ne yapacağı anlatılmıyor. Gerçekte e-Devlet'e beş yolla girilir: e-Devlet şifresi, T.C. Kimlik Kartı (kart okuyucu / NFC), mobil imza, e-imza, internet bankacılığı. Şifre almanın tek yolu PTT şubesi değil: bu yöntemlerden biriyle girip şifreyi yenilemek de mümkün (emin değilim: güncel ayrıntıyı turkiye.gov.tr "Yardım" bölümünden doğrulayın). "Unutursanız PTT'den yenisini alırsınız" cümlesi bu haliyle eksik/yanıltıcı.
- **Öneri:** `edevlet` adım 4'e (Giriş yapın) ipucu/ek paragraf:
  > Gerçek e-Devlet giriş sayfasında birkaç seçenek vardır: **e-Devlet şifresi**, **T.C. Kimlik Kartı**, **mobil imza**, **e-imza** ve **internet bankacılığı**. En yaygını şifredir. Şifreniz yoksa kimliğinizle bir **PTT şubesine** gidip alabilirsiniz; ilk girişte şifrenizi kendiniz değiştirin. Şifrenizi unuttuysanız giriş sayfasındaki **Şifremi unuttum** bağlantısına bakın ya da bankanızın internet şubesi/mobil imzanızla girip yenileyin. Telefon numaranızın e-Devlet'te güncel olması işinizi kolaylaştırır.
  - Son sorunun açıklamasını şöyle değiştirin: "e-Devlet şifresini yalnızca siz bilirsiniz; unutursanız şifre yenileme yollarını kullanır ya da kimliğinizle PTT'ye gidersiniz. Hiçbir kurum telefonda şifrenizi sormaz."
  - Ayrıca e-Devlet'te giriş sonrası kısa süre işlem yapılmazsa oturumun kendiliğinden kapanabileceğini söyleyin (emin değilim: süreyi yazmayın).

### 5. Tarayıcının "Şifreyi kaydedeyim mi?" sorusu ve "Beni hatırla" kutusu hiç anlatılmıyor
- **Tür:** eksik
- **Ders / adım:** `edevlet` adım 4, `sanal-kart-iban` adım 2, `mesajlas-web`, `e-nabiz` giriş adımları; `cerezler` adım 13 (ortak bilgisayar). Dökümde "şifreyi kaydet", "beni hatırla", "otomatik doldur" aramaları sonuç vermedi.
- **Sorun:** Kurs ortak bilgisayarda çıkış yapmayı çok iyi öğretiyor, ama gerçek tarayıcı kütüphanede ya da torunun bilgisayarında e-Devlet ve banka girişinden hemen sonra "Şifreyi kaydet?" diye sorar. Yanlışlıkla "Kaydet" denirse sonraki kişi şifreyi bir tıkla doldurabilir. Aynı şekilde sitelerdeki "Beni hatırla" kutusu. Kursun hem alıştırma sitesinde hem testte bu açılır pencere yok.
- **Öneri:** `edevlet` adım 4 "Giriş yapın" ipucuna ve `cerezler` adım 13'e şu metni ekleyin:
  > Giriş yaptıktan sonra tarayıcı "Şifreyi kaydedeyim mi?" diye sorabilir. **Kendi bilgisayarınız değilse** (kütüphane, torunun ya da komşunun bilgisayarı, iş yeri) her zaman **Hayır / Asla** deyin. Giriş sayfalarındaki **Beni hatırla** kutusunu da işaretlemeyin. Yanlışlıkla kaydettiyseniz: ⋯ → Ayarlar → Parolalar ve otomatik doldurma'dan silebilirsiniz.
  - Mümkünse `tuzaklar`/`cerezler` benzeri bir alıştırma pencerelerinden birine bu soruyu gerçek tarayıcıdaki gibi ekleyin (alıştırma sitesinde de çıksın).

### 6. IBAN ile para gönderirken alıcının adını kontrol etme öğretilmiyor; "uyuşmazsa para gitmez" iddiası riskli
- **Tür:** eksik + (emin değilim) yanlış güvence
- **Ders / adım:** `sanal-kart-iban` adım 8–10; özet panelinde "Alıcı adı: Banka adı IBAN sahibiyle karşılaştırır; uyuşmazsa para gitmez"; `kurs-sinavi` soru 22 açıklaması ("banka ayrıca alıcının adını karşılaştırır").
- **Sorun:** Alıştırma sahte bankası uyuşmayan adı reddediyor, ama gerçek hayatta her bankada ve her işlemde (havale, EFT, FAST) bunun böyle olduğundan emin değilim; ad uyuşmazlığına güvenip göndermek riskli. Daha önemlisi derste, kopyaladığınız IBAN'ın gerçekten yöneticiye ait olduğunu teyit etmek de yok. Dolandırıcılığın klasiği: "IBAN numaramız değişti, yenisi şu" mesajı ya da sahte yönetici hesabı. Adımda alıcı adını kursiyer kendi yazıyor; bankanın gösterdiği adı kontrol etme alışkanlığı oluşmuyor.
- **Öneri:** `sanal-kart-iban` adım 10 ("Ödemeyi yapın") ipucuna/ek metne:
  > Göndermeden önce banka onay ekranında **alıcının adını ve tutarı** mesajdaki bilgiyle bir kez daha karşılaştırın. Banka size IBAN'ın sahibini gösteriyorsa ad beklediğiniz kişiyle uyuşmalı; uyuşmuyorsa göndermeyin. Para ilk kez gönderdiğiniz bir kişi ya da **IBAN'ı yeni değişmiş** biri ise önce onu bildiğiniz numaradan arayıp IBAN'ı sorun. Para gittikten sonra geri almak zordur.
  - Özet paneli satırını "Alıcı adı: bankanız IBAN sahibinin adını gösteriyorsa mutlaka kendiniz de kontrol edin" yapın; "uyuşmazsa para gitmez" cümlesini kaldırın. `kurs-sinavi` 22. sorunun açıklamasından "banka ayrıca alıcının adını karşılaştırır" kısmını çıkarın.

### 7. İnternetten alışverişte tanımadığınız siteyi nasıl ölçeceğiniz ve "sipariş vermediğiniz kargo" yok
- **Tür:** eksik
- **Ders / adım:** `alisveris` (adım 1, 5 ve sorular); `cerezler` ve `tuzaklar` Fırsat Pazarı'nı zaten "iyi" site gibi kullanıyor.
- **Sorun:** Alıştırma, Fırsat Pazarı'nın güvenli olduğunu baştan varsayıyor. Kursiyer gerçek hayatta Instagram/Facebook reklamında "yarı fiyatına" bir ürün, ilk kez duyduğu bir site görecek. "Yalnızca 🔒 ve adresini bildiğiniz sitelerde" (özet) yetersiz: kilidin sahte sitelerde de olduğunu `adres` dersi söylüyor ama alışverişe bağlanmıyor. Kapıda ödemenin tehlikesi de yok: "siz sipariş vermediğiniz kargoyu, başka birinin siparişi diyerek kapıda ödemeye zorlama" yaygın.
- **Öneri:** `alisveris` adım 1'e kısa bir "Siteye güvenmeden önce" kutusu, ya da yeni adım "Tanımadığınız site":
  > Tanımadığınız bir siteden alışveriş yapacaksanız: (1) Fiyat piyasanın çok altındaysa durun. (2) Sayfanın altındaki **iletişim**, **adres**, **telefon** ve şirket bilgisini arayın; yoksa kart bilgisi girmeyin. (3) Sitenin adını arama motoruna "…yorum" ya da "…şikayet" diye yazıp başkalarının deneyimine bakın. (4) Emin değilseniz kapıda ödeme ya da limitli sanal kart kullanın. (5) Mümkünse tanıdığınız büyük mağazaların kendi sitesine **adresi yazarak** girin.
  - Yeni soru: "Eve sipariş vermediğiniz bir paket geldi; kargocu 'kapıda ödeme, şu kadar lira' diyor. Ne yaparsınız?" Doğru: "Teslim almam; aile bireylerine sorarım, onların siparişi bile olsa içeriğini görmeden ödeme yapmam." (Kargo firmalarının kontrol kuralları değişebilir: emin değilim, "teslim almam" en güvenli cevaptır.)

### 8. "Para gönderdim ya da kodu söyledim" durumu yalnızca özet satırında; adım yok
- **Tür:** eksik (+ yetersiz)
- **Ders / adım:** `dolandirildim`. Özet panelinde "Para gönderdiyseniz: Havale ya da EFT ile para gönderdiyseniz bankanızı kartın arkasındaki numaradan hemen arayın…" satırı var; dökümdeki 15 adımın hiçbirinde işlenmiyor. Ders kart harcaması senaryosu üzerine kurulu.
- **Sorun:** Yaşlıların en çok yaşadığı durum "kodu söyledim ya da kendi elimle havale/FAST yaptım". Zaman çok önemli: banka işlemi bazen kısa sürede durdurabilir. Bu bilgi derste öğrenci tarafından bir kez bile okunup soru olarak denenmiyor. Ayrıca "uzaktan erişim programı kurduysanız ne yaparsınız" (bulgu 2) ve resmî bildirim yolları yok: kötü bağlantıları USOM'a bildirmek (usom.gov.tr; emin değilim, güncel adresi doğrulayın), hat/SMS için operatöre şikâyet.
- **Öneri:** `dolandirildim`'e iki yeni adım (soru) ekleyin.
  - Soru 1: "Dolandırıcının hesabına havale ile 5.000 TL gönderdiğinizi yeni fark ettiniz. Ne yaparsınız?" Doğru: "Hemen bankamı kartın arkasındaki numaradan arar, işlemi durdurmalarını ve alıcı hesabın incelenmesini isterim; sonra şikâyet ederim." Açıklama: "Dakikalar önemlidir. Banka her zaman geri alamaz ama ne kadar erken bildirirseniz şansınız o kadar artar. Sonra delilleri saklayıp karakola/savcılığa gidin."
  - Soru 2: "Telefonda arayan kişinin isteğiyle bir program kurdunuz / kodu söylediniz." Doğru: "İnterneti kapatır, programı silerim; bankayı arayıp kartları kapattırır, şifreleri başka bir cihazdan değiştiririm."
  - Özet paneline: `['Sahte bağlantı gördünüz', 'Zararlı bağlantıları bildirmek için USOM (usom.gov.tr) kullanılabilir (adresi doğrulayın)']`.

---

## ORTA

### 9. MHRS dersinde siteyi arama motorundan bulmak öğretiliyor
- **Tür:** yanlış yönlendirme / tutarsızlık
- **Ders / adım:** `randevu` adım 2: "Adres çubuğuna hastane randevusu yazıp aratın. Sonuçlardan MHRS'ye tıklayın."
- **Sorun:** `edevlet` ve `odev14` "adresi kendiniz yazın, arama sonucu reklamlarından girmeyin" diyor; bu ders tersini yaptırıyor. Gerçek hayatta "hastane randevusu" aratınca MHRS dışında, ücret alan randevu aracı siteler çıkabilir (emin değilim, ama bu tür siteler vardır). `ehizmet-parkur` zaten "mhrs.gov.tr" ipucunu veriyor, yani doğrusu biliniyor.
- **Öneri:** Adım 2'yi "Adres çubuğuna **mhrs.gov.tr** yazıp Enter'a basın (arama motorundaki reklamlardan değil). Sonra 📅 Randevu al'a basın." yapın. Ek olarak: "MHRS ücretsizdir. Randevu için sizden para ya da kart bilgisi isteyen site/arama MHRS değildir. 182'yi aramak da ücretsiz randevu hattıdır." (emin değilim: 182'nin ücretsiz olup olmadığını teyit edin; 'MHRS randevu için para istemez' yeterli.) Sahte "randevunuz iptal oldu, bağlantıya tıklayın" SMS'i için de bir cümle.

### 10. "Mesafeli satış sözleşmesi" ve cayma hakkı açıklanmadan onaylatılıyor
- **Tür:** yetersiz
- **Ders / adım:** `alisveris` adım 6: "Mesafeli satış sözleşmesini onaylayın" (terim açıklanmıyor). Özet panelinde iade/cayma yok.
- **Sorun:** Kursiyer ne onayladığını bilmiyor. Oysa asıl faydalı bilgi sözleşmede gizli: ürünü teslimattan sonra belirli bir süre (genelde 14 gün) gerekçe göstermeden iade etme hakkı; bazı ürünlerde (kişiye özel, çabuk bozulan) bu hak yoktur.
- **Öneri:** Adım 6 ipucuna: "Mesafeli satış sözleşmesi, internetten alışverişte satıcının ve sizin haklarınızı yazar. En önemli hakkınız **cayma hakkıdır**: ürünü teslim aldıktan sonra genellikle **14 gün içinde sebep göstermeden iade** edebilirsiniz (kişiye özel üretilen ya da çabuk bozulan ürünlerde yoktur). Siparişten sonra faturayı ve onay e-postasını saklayın." Sorunla karşılaşırsanız önce satıcıya yazılı başvurun; çözülmezse e-Devlet üzerinden Tüketici Hakem Heyeti'ne başvurulabilir (hizmet adını e-Devlet'te aratarak doğrulayın).

### 11. Yeni dolandırıcılık türleri yok: yatırım vaadi, yurtdışından hediye/gümrük, ses/video taklidi
- **Tür:** eksik
- **Ders / adım:** `guvenlik` ("Torundan mesaj" kartı ve yeni kartlar), `yapay-zeka`, `sosyal-medya-guvenlik`.
- **Sorun:** Dersteki örnekler (kargo, banka, kod, torun, fatura) iyi, ama şu üçü hiç yok: (a) "yüksek kazanç" yatırım grupları ve ünlü kişilerin adıyla verilen sahte yatırım/bahis reklamları, (b) tanımadığınız biriyle kurulan dostluk ve "sana hediye gönderdim, gümrükte takıldı, vergi yatır", (c) yakınınızın sesini ya da görüntüsünü taklit eden arama (yapay zekâ). `yapay-zeka` dersi yalnızca "yanılabilir, kişisel veri yazma" diyor; yapay zekânın dolandırıcılar tarafından da kullanıldığı hiç geçmiyor.
- **Öneri:** `guvenlik`'e kısa kartlar: "Sosyal medya reklamı: 'Ünlü iş insanı yöntemi: 1.000 TL yatır, bir haftada 5.000 TL kazan'." → dolandırıcılık ("Çok kazanç vaat eden yatırımdan kaçının; yatırım için yalnızca bankanızdaki yetkili danışmana güvenin."). `Torundan mesaj` kartının açıklamasına ekleyin: "Bugün sesi ya da görüntüsü de taklit edilebiliyor. Aileyle bir **ortak gizli kelime** belirleyin; acil para isteyen arayana bu kelimeyi sorun." `yapay-zeka` sonuna bir soru: "Yapay zekâ bir telefon numarası ya da internet adresi uydurabilir; kullanmadan önce resmî kaynaktan doğrulayın."

### 12. Şifre mesajı tutarsız: 12 / 8 karakter; "yazma" / "defterde sakla"; e-posta anahtarı
- **Tür:** yetersiz / karışık
- **Ders / adım:** `guvenlik` adım 10 (en az 12 karakter), `sifre-sifirla` adım 7 (en az 8) ve `dolandirildim` adım 11 (en az 8); `sanal-kart-iban` adım 1 ("hiçbir yere yazmayın") ile `sifre-sifirla` adım 10 ve `dolandirildim` adım 11 ("kâğıda yazıp evde saklayabilirsiniz").
- **Sorun:** Kursiyer üç ayrı kural duyuyor. "Hiçbir yere yazmayın" ile "defterde saklayın" çelişiyor. E-posta hesabının bütün hesapların "şifremi unuttum" anahtarı olduğu söylenmiyor (kod e-postaya gelir).
- **Öneri:** Tek bir kural paketi ve tek bir yer (`guvenlik` adım 10 `done` metni):
  > Şifreniz mümkünse **12 karakter** ya da üç dört kelimelik bir cümle olsun. Her sitenin şifresi **farklı** olsun. Şifreleri evde güvenli bir defterde saklayabilirsiniz, ama **banka şifrenizi ve kart PIN'inizi** kâğıda yazıp cüzdanda ya da kartın yanında taşımayın. En önemli şifreniz **e-posta** şifrenizdir: diğer sitelerin şifre yenileme kodları oraya gelir. Onu hiçbir yerde kullanmadığınız ayrı bir şifreyle koruyun ve iki adımlı doğrulamayı açın.
  - Diğer derslerdeki "8 karakter" sınırlarını 12'ye ya da "en az 8, tercihen 12" olarak hizalayın.

### 13. `ilan-tuzak`: ev sahibinin gerçekten mal sahibi olduğunu doğrulama ve satıcı tarafı eksik
- **Tür:** eksik
- **Ders / adım:** `ilan-tuzak` adım 9–10 ve özet paneli.
- **Sorun:** Ders alıcıyı koruyor, ama iki gerçek durum eksik. (a) Sahte ev sahibi: gerçek ev sahibinin evini, sahte "ev sahibi" kiralamaya çıkarabilir. (b) Kursiyer kendi eşyasını/evini ilana koyduğunda alıcının "ödemeyi yaptım" diye sahte dekont göndermesi.
- **Öneri:** Adım 9'un açıklamasına ekleyin: "Evi görmeye gittiğinizde ev sahibinden **kimliğini** ve **tapu kaydını** isteyin; adı birbirini tutmalı. Ev sahibi e-Devlet'ten barkodlu bir tapu kaydı belgesi alabilir; barkodu 'Barkodlu Belge Doğrulama'da doğrulayabilirsiniz (hizmetin tam adını e-Devlet'te doğrulayın: emin değilim)." Satıcı için bir soru: "Alıcı 'ödemeyi yaptım' diye bir dekont fotoğrafı gönderdi. Eşyanızı verir misiniz?" Doğru: "Hesabıma para geçtiğini bankamın kendi uygulamasından görmeden vermem."

---

## DÜŞÜK

### 14. `gunluk-web` adım 7: "Ctrl + Shift + S" her tarayıcıda çalışmaz
- **Tür:** yanlış / yetersiz
- **Ders / adım:** `gunluk-web` adım 7 ("Web yakalama … ✂ ya da Ctrl + Shift + S").
- **Sorun:** Bu kısayol Edge'de Web Yakalama, Firefox'ta ekran görüntüsüdür; Chrome'da aynı işi yapmaz. Kursiyerlerin çoğu Chrome kullanıyor olabilir ve "çalışmıyor" diye takılır.
- **Öneri:** Adıma ekleyin: "Tarayıcınızda bu kısayol çalışmazsa her yerde çalışan ⊞ Windows + Shift + S'yi kullanın." (`gunluk-parkur` ve `dolandirildim` zaten bunu söylüyor.)

### 15. `kisisel-veri`: reklam SMS/aramalarını durdurmanın pratik yolu (İYS) söylenmiyor
- **Tür:** eksik
- **Ders / adım:** `kisisel-veri` adım 10 ("Hakkınız var"); açıklamada yalnızca "ret için kısa bir yol" geçiyor.
- **Sorun:** Mağazanın reklam SMS'lerini durdurmak için en kolay yol Ticaret Bakanlığı'nın İleti Yönetim Sistemi'dir (İYS, iys.org.tr; e-Devlet ya da telefon numarasıyla giriş; ayrıntıyı doğrulayın: emin değilim). Ders yalnızca KVKK şikâyetine yöneliyor; bu yol daha hızlı ve kursiyerin hemen yapabileceği iş.
- **Öneri:** Açıklamaya ekleyin: "Reklam SMS'lerini ya da aramalarını durdurmak için mesajdaki 'ret' yolunu kullanabilir ya da İleti Yönetim Sistemi (İYS) sitesinden hangi firmalara izin verdiğinizi görüp kapatabilirsiniz."

---

## Yeni ders fikirleri (en fazla 3)

1. **"Telefonum kayboldu ya da çalındı" (30 dk, canlandırma).** Sırasıyla: telefonu başka cihazdan arama ve kilitleme (Cihazımı bul), hattı operatöre kapattırma, bankaları arayıp kartları/mobil bankacılığı kapatma, WhatsApp'ı başka telefonda "kaybettim, hesabı kapat", e-Devlet/e-posta şifrelerini değiştirme; yedek kodların önemi (zaten `iki-adimli` içinde). Neden: dökümde hiç yok (IMEI, Cihazımı bul, telefon kaybı aramaları boş); SMS koduyla çalışan kursiyer için en yıkıcı gerçek durum.
2. **"Telefonda arayan kişi" canlandırması (20 dk, ses/metin senaryolu).** Dört arama: banka, polis/savcı, "uzaktan destek", "torununuz". Her birinde 3 seçenek (devam et / kapat / yakınına danış). Amaç: bulgu 1 ve 2'yi deneyimle öğretmek, "Dur · Düşün · Sor" refleksi. `guvenlik` dersine alternatif/ek olarak.
3. **"İlk e-Devlet girişi" kılavuzu (25 dk).** Şifre alma yolları, ilk girişte şifre değiştirme, kayıtlı telefon/e-posta güncelleme, giriş yöntemleri, oturum kapatma ve "şifre kaydetme" sorusu (bulgu 4 ve 5). Kurs, e-Devlet'i bilen biri varsayıyor; şifresi olmayan kursiyer 14. haftada takılacak. Ayrıntıları yazmadan önce güncel e-Devlet sayfasından doğrulayın.

---

## Kontrol edilen ve sorun görülmeyen noktalar (tekrar önerilmedi)

- Sayılar: 155 Polis İmdat, 156 Jandarma, 112, 182 MHRS, ALO 170 (SGK), CİMER cevap süresi 30 gün, `enabiz.gov.tr`, `mhrs.gov.tr`, `turkiye.gov.tr`, `cimer.gov.tr`: doğru görünüyor.
- Sahte site ve adres okuma (`adres` dersi), kilit simgesinin yetmediği, kod paylaşmama (5 farklı derste), sanal kart, kapora, taklit hesap, çekiliş tuzağı, açık Wi-Fi, ortak bilgisayarda çıkış, fidye yazılımı ve yedek: iyi anlatılmış.
- İki adımlı doğrulamada doğrulama uygulaması seçeneği yalnızca `done` metninde geçiyor; yeni bulgu saymadım.
- Testler (`test13`, `test14`, `test15`, `kurs-sinavi`) yukarıdaki iki noktadan (bulgu 6'daki ad karşılaştırma cümlesi, bulgu 12'deki şifre uzunluğu) başka yanlış bilgi içermiyor.
