// 4. hafta ek dersleri: kasanın içi, portlar ve kablolar, bakım ve sağlıklı kullanım, sorun giderme
import { K } from './common.js';
import { info, ayir, sec } from './kalip.js';

const YOLCULUK = '<a class="btn" href="bilgisayar.html">🖥 Bilgisayarın İçine Yolculuk (3B)</a>';

export const parcalar = {
  id: 'parcalar', icon: '🔩', title: 'Kasanın içi: parçalar ve görevleri', minutes: 25, stage: 'scene',
  desc: 'Anakart, işlemci, RAM, disk, ekran kartı, güç kaynağı ve fan ne işe yarar? Kasanın içi ve dışı; benzetmelerle.',
  summary: [
    ['Anakart', 'Bütün parçaların takıldığı büyük kart: şehrin yolları'],
    ['İşlemci (CPU)', 'Hesapları yapan beyin'],
    ['RAM', 'Çalışma masası: o an açık işler'],
    ['Disk (SSD/HDD)', 'Dolap: dosyalar kalıcı durur'],
    ['Ekran kartı', 'Görüntüyü hazırlayıp ekrana gönderir'],
    ['Güç kaynağı', 'Prizdeki elektriği parçalara uygun hale getirir'],
    ['Fan', 'Isınan parçaları soğutur'],
  ],
  steps: [
    {
      title: 'Kasanın içinde neler var?',
      html: `<p>Kasa, bilgisayarın parçalarını koruyan kutudur. İçinde bir şehir gibi düşünebileceğimiz parçalar vardır:</p>
        <table class="tbl"><tr><th>🟩 Anakart</th><td>Şehrin yolları: her şey ona takılır, birbirine onun üzerinden bağlanır.</td></tr>
        <tr><th>🧠 İşlemci</th><td>Beyin: bütün hesapları yapar.</td></tr>
        <tr><th>🗒 RAM</th><td>Çalışma masası: açık işler burada durur, kapanınca boşalır.</td></tr>
        <tr><th>🗄 Disk</th><td>Dolap: dosyalar kalıcı olarak burada saklanır.</td></tr>
        <tr><th>🎨 Ekran kartı</th><td>Ressam: ekrandaki görüntüyü çizer.</td></tr>
        <tr><th>🔌 Güç kaynağı</th><td>Elektriği parçalara dağıtır.</td></tr>
        <tr><th>🌀 Fan</th><td>Parçaları serinletir.</td></tr></table>`,
      scene: info(`<div class="sc-big">🟩🧠🗒🗄🎨🔌🌀</div><p>Kasanın içi 3B'de nasıl görünüyor?</p>${YOLCULUK}`),
    },
    ayir({
      title: 'İçinde mi, dışında mı?',
      html: '<p>Bu parçalar kasanın <b>içinde</b> mi, yoksa kasaya dışarıdan bağlanan <b>çevre birimleri</b> mi?</p>',
      bins: [{ id: 'ic', label: 'Kasanın içinde', icon: '🗄' }, { id: 'dis', label: 'Dışarıda (çevre birimi)', icon: '🔌' }],
      items: [
        { label: 'İşlemci', icon: '🧠', bin: 'ic', why: 'Anakartın üzerinde, soğutucunun altında durur.' },
        { label: 'RAM', icon: '🗒', bin: 'ic', why: 'Anakarttaki uzun yuvalara takılır.' },
        { label: 'Anakart', icon: '🟩', bin: 'ic', why: 'Kasanın içindeki en büyük karttır.' },
        { label: 'SSD', icon: '💽', bin: 'ic', why: 'Kasanın içindeki disk.' },
        { label: 'Güç kaynağı', icon: '🔌', bin: 'ic', why: 'Kasanın arkasında, kablonun takıldığı kutu.' },
        { label: 'Ekran kartı', icon: '🎨', bin: 'ic', why: 'Anakarta takılır; ekran kablosu onun girişine bağlanır.' },
        { label: 'Klavye', icon: '⌨', bin: 'dis', why: 'Dışarıdan USB ile bağlanır.' },
        { label: 'Fare', icon: '🖱', bin: 'dis', why: 'Dışarıdan bağlanır.' },
        { label: 'Monitör', icon: '🖥', bin: 'dis', why: 'Kablo ile ekran kartına bağlanır.' },
        { label: 'Yazıcı', icon: '🖨', bin: 'dis', why: 'USB ya da Wi-Fi ile bağlanır.' },
        { label: 'Web kamerası', icon: '📷', bin: 'dis', why: 'USB ile bağlanır (dizüstülerde ekranın üstündedir).' },
      ],
      done: 'Dışarıdan bağlanan parçalara çevre birimi denir.',
    }),
    sec({ title: 'Her şeyin takıldığı kart', text: '<div class="qz-pic">🟩</div>', q: 'Bütün parçaların takıldığı, onları birbirine bağlayan büyük kart hangisi?', opts: ['Ekran kartı', 'Anakart', 'Ses kartı'], ok: 1, why: 'Anakart, işlemciyi, RAM\'i, diskleri ve kartları birbirine bağlar.' }),
    sec({ title: 'Elektrik', text: '<div class="qz-pic">🔌 ⚡</div>', q: 'Prizden gelen elektriği parçaların kullanacağı hale getiren parça hangisi?', opts: ['Fan', 'İşlemci', 'Güç kaynağı'], ok: 2, why: 'Güç kaynağı (PSU) kasanın arkasındadır; elektrik kablosu ona takılır.' }),
    sec({ title: 'Görüntü', text: '<div class="qz-pic">🎨 ➜ 🖥</div>', q: 'Ekrandaki görüntüyü hazırlayıp monitöre gönderen parça hangisi?', opts: ['Ekran kartı', 'Disk', 'RAM'], ok: 0, why: 'Monitör kablosu ekran kartının girişine takılır. Oyun ve video işleri için güçlü ekran kartı gerekir.' }),
    sec({ title: 'Isınma', text: '<div class="qz-pic">🌡 🌀</div>', q: 'Bilgisayardan gelen vınlama sesi çoğunlukla hangi parçadan çıkar?', opts: ['Fanlardan', 'RAM\'den', 'Klavyeden'], ok: 0, why: 'Fanlar ısınan işlemciyi ve kartları serinletir. Bilgisayar zorlandıkça daha hızlı döner.' }),
    sec({ title: 'Daha çok RAM', text: '<div class="qz-pic">🗒 8 GB ➜ 16 GB</div>', q: 'Bilgisayara daha çok RAM takmak ne sağlar?', opts: ['Daha çok fotoğraf saklanır', 'Aynı anda daha çok iş rahatça yapılır', 'Ekran büyür'], ok: 1, why: 'RAM çalışma masasıdır: masa büyüdükçe aynı anda daha çok program açık kalabilir. Saklama alanı ise diske bağlıdır.' }),
    sec({ title: 'Dizüstü bilgisayar', text: '<div class="qz-pic">💻</div>', q: 'Dizüstü bilgisayarda bu parçalar nerededir?', opts: ['Yoktur', 'Klavyenin altındaki gövdede, küçültülmüş olarak; bir de pil vardır', 'Ekranın arkasında ayrı bir kutuda'], ok: 1, why: 'Dizüstülerde aynı parçalar küçültülüp tek gövdeye sığdırılır. Ekran, klavye ve dokunmatik fare (touchpad) de gövdeye bağlıdır.' }),
    {
      title: '3B\'de keşfedin',
      html: `<p>Şimdi 3B uygulamada kasayı açıp bu parçaları bulun:</p><ol class="steps"><li>“Kasayı aç” düğmesine basın.</li><li>Bir parçaya tıklayın: ne işe yaradığı yazar.</li><li>Dönemi değiştirin: 1990'larla bugünün farkına bakın.</li></ol>`,
      scene: info(`<div class="sc-big">🖥🔍</div>${YOLCULUK}`),
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Kasanın içini tanıyorsunuz:</p>', scene: info('<div class="sc-big">🔩🏆</div>') },
  ],
};

export const portlar = {
  id: 'portlar', icon: '🔌', title: 'Portlar ve kablolar', minutes: 20, stage: 'scene',
  desc: 'USB, USB-C, HDMI, ses girişleri ve Ethernet: hangi kablo nereye takılır? Takarken nelere dikkat edilir?',
  summary: [
    ['USB-A', 'Dikdörtgen; fare, klavye, USB bellek, yazıcı'],
    ['USB-C', 'Küçük ve oval; iki yönlü takılır; telefonlar, yeni dizüstüler'],
    ['HDMI', 'Görüntü ve ses: monitör, televizyon'],
    ['Yeşil ses girişi', 'Kulaklık, hoparlör'],
    ['Pembe ses girişi', 'Mikrofon'],
    ['Ethernet', 'İnternet kablosu (modemden)'],
    ['Kural', 'Girmiyorsa zorlamayın; çevirip yeniden deneyin'],
  ],
  steps: [
    {
      title: 'Port nedir?',
      html: `<p>Kabloların takıldığı yuvalara <b>port</b> (giriş) denir. Her kablonun şekli farklıdır; yanlış yere zaten girmez.</p>
        <table class="tbl"><tr><th>▭ USB-A</th><td>En yaygın: fare, klavye, USB bellek, yazıcı.</td></tr>
        <tr><th>⬭ USB-C</th><td>Küçük ve oval; ters takma derdi yok. Telefon şarjı ve yeni bilgisayarlar.</td></tr>
        <tr><th>⏢ HDMI</th><td>Monitör ve televizyon: görüntü ve ses taşır.</td></tr>
        <tr><th>🟢 / 🩷 Ses</th><td>Yeşil: kulaklık-hoparlör. Pembe: mikrofon.</td></tr>
        <tr><th>🔲 Ethernet</th><td>Modemden gelen internet kablosu.</td></tr></table>`,
      scene: info('<div class="sc-big">▭ ⬭ ⏢ 🟢 🔲</div><p>Kasanın arkasındaki portlar</p>'),
    },
    ayir({
      title: 'Hangi kablo nereye?',
      bins: [{ id: 'usb', label: 'USB', icon: '▭' }, { id: 'hdmi', label: 'HDMI', icon: '⏢' }, { id: 'ses', label: 'Ses girişleri', icon: '🎧' }, { id: 'eth', label: 'Ethernet', icon: '🔲' }],
      items: [
        { label: 'Fare', icon: '🖱', bin: 'usb', why: 'Kablolu fareler USB\'ye takılır.' },
        { label: 'Klavye', icon: '⌨', bin: 'usb', why: 'USB\'ye takılır.' },
        { label: 'USB bellek', icon: '💾', bin: 'usb', why: 'Adı üstünde: USB.' },
        { label: 'Yazıcı kablosu', icon: '🖨', bin: 'usb', why: 'Yazıcılar USB ile (ya da kablosuz) bağlanır.' },
        { label: 'Monitör', icon: '🖥', bin: 'hdmi', why: 'Görüntü kablosu: HDMI.' },
        { label: 'Televizyon', icon: '📺', bin: 'hdmi', why: 'Bilgisayarı televizyona HDMI ile bağlarız.' },
        { label: 'Kulaklık', icon: '🎧', bin: 'ses', why: 'Yeşil ses girişi.' },
        { label: 'Mikrofon', icon: '🎤', bin: 'ses', why: 'Pembe ses girişi.' },
        { label: 'Modemden gelen kablo', icon: '📡', bin: 'eth', why: 'İnternet kablosu Ethernet girişine takılır.' },
      ],
      done: 'Kabloyu doğru porta taktınız.',
    }),
    sec({ title: 'Yeşil giriş', text: '<div class="qz-pic">🟢</div>', q: 'Kasanın arkasındaki <b>yeşil</b> ses girişine ne takılır?', opts: ['Mikrofon', 'Kulaklık ya da hoparlör', 'Fare'], ok: 1, why: 'Yeşil çıkıştır: ses buradan çıkar. Pembe ise mikrofon girişidir.' }),
    sec({ title: 'Ters takılmayan', text: '<div class="qz-pic">⬭</div>', q: 'USB-C\'nin kolaylığı nedir?', opts: ['Her iki yönde de takılabilir', 'Kablosuzdur', 'Yalnızca şarj içindir'], ok: 0, why: 'USB-C simetriktir; çevirmeye gerek yoktur. Eski USB-A ise tek yönde girer.' }),
    sec({ title: 'Girmeyen USB', text: '<div class="qz-pic">💾 ✋</div>', q: 'USB bellek girişe girmiyor. Ne yaparsınız?', opts: ['Biraz daha bastırırım', 'Zorlamam; ters çevirip yeniden denerim', 'Girişi temizlemek için içine bir şey sokarım'], ok: 1, why: 'Zorlamak girişi kırabilir. USB-A çoğu zaman ilk denemede ters gelir; çevirince rahatça girer.' }),
    sec({ title: 'Telefondan fotoğraf', text: '<div class="qz-pic">📱 ➜ 💻</div>', q: 'Telefonunuzdaki fotoğrafları bilgisayara kablo ile aktarmak için ne kullanırsınız?', opts: ['HDMI kablosu', 'Telefonun şarj (USB) kablosu', 'Ethernet kablosu'], ok: 1, why: 'Şarj kablosunu bilgisayarın USB girişine takın; telefonda çıkan soruda “Dosya aktarımı”nı seçin.' }),
    sec({ title: 'Önden mi, arkadan mı?', text: '<div class="qz-pic">🗄 ⬅ ➡</div>', q: 'Masaüstü kasada fare ve klavye gibi hep takılı kalacak kabloları nereye takmak daha iyidir?', opts: ['Kasanın arkasındaki girişlere', 'Ön girişlere', 'Fark etmez, ikisi de yanlış'], ok: 0, why: 'Ön girişleri USB bellek gibi takıp çıkardığınız şeylere ayırın; sürekli takılı kalacaklar arkada dursun.' }),
    {
      title: '3B\'de portlar',
      html: `<p>3B uygulamada <b>Arka panel</b> görünüşüne geçin ve portlara tıklayın: her birinin adı ve görevi yazar. 1990'lardaki portlarla bugünkünü karşılaştırın.</p>`,
      scene: info(`<div class="sc-big">🔌🔍</div>${YOLCULUK}`),
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Kabloları doğru yere takabilirsiniz:</p>', scene: info('<div class="sc-big">🔌✔</div>') },
  ],
};

export const bakim = {
  id: 'bakim', icon: '🧹', title: 'Bakım ve sağlıklı kullanım', minutes: 20, stage: 'scene',
  desc: 'Bilgisayarı temiz ve güvende tutmak; havalandırma, güncelleme, elektrik; doğru oturuş ve göz sağlığı (20-20-20).',
  summary: [
    ['Ekran temizliği', 'Kapalıyken, kuru ya da hafif nemli yumuşak bezle'],
    ['Havalandırma', 'Deliklerin önü açık; dizüstü sert yüzeyde'],
    ['Güncellemeler', 'Ertelemeyin: güvenlik açıklarını kapatır'],
    ['Elektrik', 'Akım korumalı priz; fırtınada kapatın'],
    ['Oturuş', 'Ekran bir kol boyu uzakta, göz hizasının biraz altında'],
    ['20-20-20', '20 dakikada bir, 20 saniye, uzağa bakın'],
    ['Sıvı döküldüyse', 'Hemen kapatıp fişi çekin, ters çevirip kurutun'],
  ],
  steps: [
    {
      title: 'Bilgisayarın sağlığı',
      html: '<p>Bilgisayar da bakım ister: <b>temizlik</b>, <b>serin tutmak</b>, <b>güncel tutmak</b> ve <b>elektrikten korumak</b>. Bizim sağlığımız için de doğru oturmak ve gözleri dinlendirmek gerekir.</p>',
      scene: info('<div class="sc-big">🧹 🌀 🔄 ⚡ 🧘</div>'),
    },
    ayir({
      title: 'Doğru mu, yanlış mı?',
      html: '<p>Bu davranışlar bilgisayar için doğru mu, yanlış mı? Kartları sürükleyin.</p>',
      bins: [{ id: 'dogru', label: 'Doğru', icon: '✅' }, { id: 'yanlis', label: 'Yanlış', icon: '❌' }],
      items: [
        { label: 'Ekranı yumuşak, kuru bezle silmek', icon: '🧽', bin: 'dogru', why: 'Ekran hassastır; yumuşak bez çizmez.' },
        { label: 'Havalandırma deliklerinin önünü açık tutmak', icon: '🌀', bin: 'dogru', why: 'Sıcak hava çıkamazsa bilgisayar ısınır ve yavaşlar.' },
        { label: 'Güncellemeleri yapmak', icon: '🔄', bin: 'dogru', why: 'Güncellemeler güvenlik açıklarını kapatır.' },
        { label: 'Başlat\'tan kapatmak', icon: '⏻', bin: 'dogru', why: 'Dosyalar düzgünce kapanır.' },
        { label: 'Önemli dosyaları yedeklemek', icon: '💾', bin: 'dogru', why: 'Bilgisayar bozulsa da dosyalar kurtulur.' },
        { label: 'Ekrana cam sil püskürtmek', icon: '🧴', bin: 'yanlis', why: 'Sert kimyasallar ekranın kaplamasına zarar verir; sıvı içeri sızabilir.' },
        { label: 'Dizüstünü yorganın üstünde kullanmak', icon: '🛏', bin: 'yanlis', why: 'Kumaş alttaki havalandırmayı kapatır, bilgisayar ısınır.' },
        { label: 'Klavyenin yanında çay bardağı tutmak', icon: '🍵', bin: 'yanlis', why: 'Dökülen sıvı klavyeyi ve dizüstüyü bozabilir.' },
        { label: 'Fişi çekerek kapatmak', icon: '🔌', bin: 'yanlis', why: 'Açık dosyalar bozulabilir.' },
        { label: 'Güncellemeleri hep ertelemek', icon: '⏳', bin: 'yanlis', why: 'Güncel olmayan bilgisayar virüslere açıktır.' },
      ],
      done: 'Bilgisayarınız size teşekkür ediyor!',
    }),
    {
      title: 'Doğru oturuş ve gözler',
      html: `<ul class="big-list"><li>Ekran <b>bir kol boyu</b> (50–70 cm) uzakta, üst kenarı göz hizasında ya da biraz altında.</li><li>Sırt dik, ayaklar yere basık, bilekler düz.</li><li><b>20-20-20 kuralı</b>: her 20 dakikada bir, 20 saniye boyunca uzağa (yaklaşık 6 metre) bakın.</li><li>Ekranın arkasında pencere olmasın; parlama gözü yorar.</li></ul>
        <p>Yazılar küçük geliyorsa gözünüzü zorlamayın: Ayarlar'dan büyütün (7. hafta).</p>`,
      scene: info('<div class="sc-big">🧘 👀 ⏲</div><p>20 dakika · 20 saniye · uzağa</p>'),
    },
    sec({ title: 'Ekran mesafesi', text: '<div class="qz-pic">👀 ↔ 🖥</div>', q: 'Ekran gözünüzden ne kadar uzakta olmalı?', opts: ['Burnumun dibinde, 20 cm', 'Bir kol boyu, 50–70 cm', 'Odanın öbür ucunda, 3 metre'], ok: 1, why: 'Kolunuzu uzattığınızda parmak uçlarınız ekrana yaklaşık değmeli.' }),
    sec({ title: 'Göz yorgunluğu', text: '<div class="qz-pic">⏲ 20 · 20 · 20</div>', q: '20-20-20 kuralı nedir?', opts: ['Her 20 dakikada bir 20 saniye uzağa bakmak', 'Günde 20 dakikadan fazla oturmamak', 'Ekranı 20 cm\'den izlemek'], ok: 0, why: 'Uzağa bakmak, yakına odaklanmaktan yorulan göz kaslarını dinlendirir.' }),
    sec({ title: 'Dökülen çay', text: '<div class="qz-pic">🍵 ➜ ⌨</div>', q: 'Dizüstü bilgisayarın klavyesine çay döküldü. Ne yaparsınız?', opts: ['Kuruması için saç kurutma makinesinin en sıcak ayarıyla kuruturum', 'Hemen kapatıp fişini çekerim, ters çevirip en az bir gün kurumaya bırakırım', 'Silip kullanmaya devam ederim'], ok: 1, why: 'Elektrik varken sıvı kısa devre yapar. Kapatıp kurutun; sıcak hava parçalara zarar verebilir. Şüphedeyseniz servise götürün.' }),
    sec({ title: 'Isınan dizüstü', text: '<div class="qz-pic">💻 🔥</div>', q: 'Dizüstü bilgisayar çok ısınıyor, fan sürekli yüksek sesle dönüyor. İlk ne yaparsınız?', opts: ['Masa gibi sert bir yüzeye koyar, havalandırmanın önünü açarım', 'Buzdolabına koyarım', 'Fanın deliğini bantla kapatırım'], ok: 0, why: 'Yumuşak yüzeyler havalandırmayı kapatır. Sorun sürerse içindeki tozun temizletilmesi gerekebilir.' }),
    sec({ title: 'Fırtına', text: '<div class="qz-pic">⛈ ⚡</div>', q: 'Şimşekli bir fırtına var, elektrik gidip geliyor. Ne yaparsınız?', opts: ['Bilgisayarı kapatıp fişini çekerim', 'Çalışmaya devam ederim', 'Ekranı kapatırım, kasa açık kalabilir'], ok: 0, why: 'Elektrik dalgalanmaları parçaları bozabilir. Akım korumalı priz (uzatma) de koruma sağlar.' }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Hem bilgisayarınıza hem kendinize iyi bakacaksınız:</p>', scene: info('<div class="sc-big">🧹🧘</div>') },
  ],
};

export const sorunGiderme = {
  id: 'sorun-giderme', icon: '🛠', title: 'Bir şey çalışmıyor! İlk kontroller', minutes: 20, stage: 'scene',
  desc: 'Ekran kararıyor, fare oynamıyor, ses yok, internet yok, yazıcı yazmıyor… Panik yapmadan önce bakılacak basit şeyler.',
  summary: [
    ['1. Kablo ve düğme', 'Takılı mı, açık mı?'],
    ['2. Ses', 'Sessizde mi, kulaklık takılı mı?'],
    ['3. Pil', 'Kablosuz fare ve klavyede'],
    ['4. Modem', 'Kapatıp 30 saniye sonra açın'],
    ['5. Yeniden başlat', 'Çoğu sorunu çözer'],
    ['6. Danışın', 'Ekranın resmini çekip (Ekran Alıntısı) güvendiğiniz birine gösterin'],
    ['Asla', 'Ekranda çıkan “destek hattı” numarasını aramayın'],
  ],
  steps: [
    {
      title: 'Önce sakin olun',
      html: `<p>Bilgisayarda bir şey çalışmadığında çoğu zaman sebep çok basittir: gevşemiş bir kablo, kısılmış ses, biten pil…</p>
        <ol class="steps"><li>Kablolar takılı mı, düğmeler açık mı?</li><li>Ayarlar doğru mu (ses, Wi-Fi)?</li><li>Yeniden başlatmak işe yarıyor mu?</li><li>Olmadıysa: ne olduğunu not alın, güvendiğiniz birine danışın.</li></ol>`,
      scene: info('<div class="sc-big">🛠🙂</div><p>Kablo · Ayar · Yeniden başlat · Danış</p>'),
    },
    sec({ title: 'Kapkara ekran', text: '<div class="qz-pic">🖥⬛ 🗄💡</div>', q: 'Ekran kapkara ama kasanın ışığı yanıyor, fanı dönüyor. İlk neye bakarsınız?', opts: ['Ekranın kendi düğmesine ve ekran kablosuna', 'Bilgisayarı yeniden kurarım', 'Kasayı açarım'], ok: 0, why: 'Ekranın ayrı bir güç düğmesi ve kablosu vardır. Bilgisayar uykuda da olabilir: fareyi oynatın, bir tuşa basın.' }),
    sec({ title: 'Fare oynamıyor', text: '<div class="qz-pic">🖱❌</div>', q: 'Kablosuz farenin imleci ekranda hiç hareket etmiyor. Ne yaparsınız?', opts: ['Farenin pilini ve altındaki açma düğmesini kontrol ederim; USB alıcısının takılı olduğuna bakarım', 'Fareyi masaya vururum', 'Yeni bilgisayar alırım'], ok: 0, why: 'Kablosuz farelerin altında açma-kapama düğmesi ve pil yuvası vardır; bilgisayara takılı küçük bir USB alıcısı da gerekir.' }),
    sec({ title: 'Ses yok', text: '<div class="qz-pic">🔇</div>', q: 'Videonun sesi gelmiyor. Sıralama hangisi?', opts: ['Sağ alttaki 🔊 sessizde mi, ses kısık mı; kulaklık takılı mı; videonun kendi sesi açık mı', 'Hoparlörü sökerim', 'Bilgisayarı satarım'], ok: 0, why: 'Kulaklık takılıysa ses hoparlörden değil kulaklıktan çıkar. Videoların da ayrı ses düğmesi vardır.' }),
    sec({ title: 'İnternet yok', text: '<div class="qz-pic">📶❗</div>', q: 'Hiçbir site açılmıyor, Wi-Fi simgesinde ünlem var. Ne yaparsınız?', opts: ['Wi-Fi\'ye bağlı mıyım bakarım; olmazsa modemi kapatıp 30 saniye sonra açarım', 'Tarayıcıyı silerim', 'Ekranda çıkan bir numarayı ararım'], ok: 0, why: 'Modemi yeniden başlatmak çoğu bağlantı sorununu çözer. Evdeki diğer cihazlarda da internet yoksa sorun modemdedir ya da internet sağlayıcınızı arayın.' }),
    sec({ title: 'Yazıcı yazmıyor', text: '<div class="qz-pic">🖨❌</div>', q: 'Yazdır dediniz ama yazıcıdan kâğıt çıkmıyor. Ne kontrol edilir?', opts: ['Yazıcı açık mı, kâğıt ve mürekkep var mı, yazdırırken doğru yazıcı seçilmiş mi', 'Belgeyi yeniden yazarım', 'Yazıcıyı sallarım'], ok: 0, why: 'Yazdır penceresinde başka bir yazıcı (ör. “PDF olarak kaydet”) seçili olabilir. Yazıcının ekranındaki uyarıları da okuyun.' }),
    sec({ title: 'Donan program', text: '<div class="qz-pic">🧊</div>', q: 'Bir program dondu; tıklamalara cevap vermiyor. Ne yaparsınız?', opts: ['Biraz beklerim; olmazsa programı kapatırım, o da olmazsa bilgisayarı yeniden başlatırım', 'Fişi hemen çekerim', 'Ekrana art arda tıklarım'], ok: 0, why: 'Bazen program yalnızca meşguldür. Art arda tıklamak işi daha da uzatır.' }),
    sec({ title: 'Türkçe harfler yok', text: '<div class="qz-pic">ş ➜ ;</div>', q: 'Klavye birden Türkçe harfleri yazmamaya başladı. Ne olmuş olabilir?', opts: ['Klavye dili değişmiş; sağ alttaki ENG yerine TUR seçilir', 'Klavye bozulmuş', 'İnternet kesilmiş'], ok: 0, why: `Yanlışlıkla ${K('Alt', 'Shift')} ya da ${K('⊞', 'Boşluk')} basılınca dil değişebilir.` }),
    sec({ title: 'Ekranda destek numarası', text: '<div class="qz-pic">⚠ “Bilgisayarınız kilitlendi! Destek: 0850…”</div>', q: 'İnternette gezinirken “bilgisayarınız kilitlendi, hemen bu numarayı arayın” uyarısı çıktı. Ne yaparsınız?', opts: ['Numarayı ararım', 'Aramam; sekmeyi ya da tarayıcıyı kapatırım, gerekirse yeniden başlatırım', 'İstedikleri programı kurarım'], ok: 1, why: 'Bu bir dolandırıcılıktır. Gerçek Windows uyarıları telefon numarası vermez. Ek derste (İnternette güvenlik) ayrıntısı var.' }),
    sec({ title: 'Hiçbiri olmadı', text: '<div class="qz-pic">🤷</div>', q: 'Hepsini denediniz, sorun sürüyor. En iyisi hangisi?', opts: ['Ne olduğunu not alıp ekranın resmini çekerim (Ekran Alıntısı), güvendiğim birine gösteririm', 'Rastgele ayarları değiştiririm', 'İnternetten bulduğum ilk programı kurarım'], ok: 0, why: 'Ne zaman, ne yaparken olduğunu ve ekrandaki yazıyı bilmek, yardım edecek kişinin işini çok kolaylaştırır.' }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Artık basit sorunları kendiniz çözebilirsiniz:</p>', scene: info('<div class="sc-big">🛠✔</div>') },
  ],
};
