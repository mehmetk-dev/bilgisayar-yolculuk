// 15. hafta kısa dersi (Bilgi güvenliği): “Torununuz tablet ve telefonda: güvenli kullanım”
// Telefonu torununa verirken riskler, satın alma onayı, ebeveyn denetimi, YouTube Kids, ekran süresi,
// tanımadık kişiler, “ücretsiz elmas” tuzağı, torunun fotoğrafını paylaşmak. Benzetim yok; bilgi adımları ve senaryo soruları (rehberSoru).
import { desktopReady } from './common.js';
import { rehberSoru } from './kalip.js';

export const torunGuvenlik = {
  id: 'torun-guvenligi', icon: '🧒', title: 'Torununuz tablet ve telefonda: güvenli kullanım', minutes: 20, stage: 'desktop',
  desc: 'Telefonunuzu ya da tabletinizi torununuza verirken: oyun içi satın alma, ebeveyn denetimi, ekran süresi, tanımadık kişiler, “ücretsiz elmas” tuzağı ve torunun fotoğrafı.',
  summary: [
    ['Verirken riskler', 'Banka uygulaması · WhatsApp · kayıtlı kartla oyun içi satın alma · yanlışlıkla mesaj ya da arama · silinen fotoğraflar'],
    ['Satın alma', 'Uygulama mağazasında her alımda şifre ya da parmak izi istensin; kartınızı mağazaya kaydetmeyin'],
    ['Ebeveyn denetimi', 'Android: Google Family Link · iPhone: Ekran Süresi. Kurulumu torunun anne babasıyla birlikte yapın'],
    ['Küçük çocuk', 'YouTube Kids: çocuklar için ayrı uygulama'],
    ['Ekran süresi', 'Yaşa göre makul süre; yemekte ve yatmadan önce ekran yok. Süreye anne babasıyla birlikte karar verin'],
    ['Tanımadık kişiler', 'Oyunda ve sosyal medyada yazışmayın; kişisel bilgi ve fotoğraf paylaşmayın. Rahatsız eden bir şey olursa kızmadan dinleyin'],
    ['“Ücretsiz elmas/altın”', 'Dolandırıcılıktır; hesap şifresi isterler. Şifrenizi kimseye vermeyin'],
    ['Harcama çıktıysa', 'Bankayı kartın arkasındaki numaradan arayın; mağazadan da iade isteyin'],
    ['Torunun fotoğrafı', 'Okul adı, okul forması, ev adresi ve konum görünmesin; önce anne babasından izin alın'],
    ['Ayrı kullanıcı', 'Bazı telefonlarda torun için ayrı kullanıcı ya da “misafir” modu bulunur'],
  ],
  steps: [
    {
      title: 'Telefonu torununuza verirken',
      html: `<p>Torununuz telefonunuzu ya da tabletinizi isteyince çoğu zaman verirsiniz. Bu çok doğal; hem çocuk eğlenir, hem siz biraz soluk alırsınız.</p>
        <p>Ama o telefonda sizin hesaplarınız da var. Birkaç şeye dikkat etmek yeter:</p>
        <ul>
          <li><b>Banka uygulaması</b> açık kalabilir.</li>
          <li><b>WhatsApp</b>: yanlışlıkla mesaj gidebilir.</li>
          <li><b>Oyun içi satın alma</b>: kartınız kayıtlıysa tek dokunuşla para harcanabilir.</li>
          <li>Yanlışlıkla <b>arama</b> yapılabilir ya da <b>fotoğraflarınız silinebilir</b>.</li>
        </ul>
        <p class="mut">Korkmanıza gerek yok. Bu derste sakin ve uygulanabilir birkaç kural göreceğiz.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'Satın almayı kilitleyin',
      html: `<p>Uygulama mağazasında satın alma için <b>şifre ya da parmak izi istensin.</b> Böylece torununuz tek başına bir şey satın alamaz. Telefonun ayarlarında ve mağaza uygulamasının ayarlarında bu seçenek bulunur.</p>
        <p>Mümkünse <b>kartınızı mağazaya hiç kaydetmeyin.</b> Kayıtlı kart yoksa oyun içi satın alma da yapılamaz.</p>
        <p>Kart kayıtlı kalacaksa, <b>her alımda onay</b> istenmesini seçin.</p>
        <p><b>Ayrı kullanıcı:</b> bazı telefonlarda torun için ayrı bir kullanıcı ya da “misafir” modu olabilir. Bu modda sizin uygulamalarınız ve mesajlarınız görünmez. Telefonunuzda varsa ayarlarda arayın.</p>
        <p class="mut">Telefon marka ve sürümüne göre bölümlerin yeri değişir. Bulamazsanız torununuzun anne babasından ya da bir yakınınızdan yardım isteyin.</p>`,
    },
    {
      title: 'Ebeveyn denetimi ve YouTube Kids',
      html: `<p>Çocuklar için hazırlanmış <b>ebeveyn denetimi</b> araçları vardır. Çocuğun hangi uygulamayı ne kadar kullanacağını anne babası belirler:</p>
        <ul>
          <li>📱 <b>Android:</b> <b>Google Family Link</b></li>
          <li>🍎 <b>iPhone:</b> <b>Ekran Süresi</b></li>
        </ul>
        <p>Bunların <b>kurulumunu torununuzun anne babasıyla birlikte yapın.</b> Hangi ayarın seçileceği çocuğun yaşına ve ailenin kurallarına bağlıdır; bu karar onlarındır.</p>
        <p><b>YouTube Kids</b>, küçük çocuklar için hazırlanmış <b>ayrı bir uygulamadır.</b> Normal YouTube'da çocuğa uygun olmayan videolar çıkabilir. Küçük torununuz video izleyecekse bu uygulama daha uygundur.</p>`,
    },
    {
      title: 'Ekran süresi',
      html: `<p>Çok ekran bakmak çocukları yorabilir, uykularını bozabilir. İki kural herkes için iyidir:</p>
        <ul>
          <li><b>Yemekte ekran yok.</b> Sofrada sohbet etmek çocuk için de güzeldir.</li>
          <li><b>Yatmadan önce ekran yok.</b> Uyku daha rahat gelir.</li>
        </ul>
        <p>Günde kaç saat izleyeceği ise <b>yaşa göre değişir.</b> Kesin bir süre söylemek yerine şunu yapın: <b>torununuzun anne babasıyla birlikte karar verin</b> ve onların kuralına uyun. Sizde başka, evde başka kural olursa çocuk şaşırır.</p>
        <p class="mut">Ekran yerine birlikte yapılacak bir şey bulmak (yemek, yürüyüş, kağıt oyunu) çoğu zaman en iyi çözümdür.</p>`,
    },
    {
      title: 'Tanımadık kişiler',
      html: `<p>Oyunlarda ve sosyal medyada çocuğa <b>tanımadık biri</b> yazabilir. Torununuza şu kuralı öğretin:</p>
        <ul>
          <li><b>Tanımadığın kişilerle yazışma.</b></li>
          <li><b>Kişisel bilgi verme:</b> adını soyadını, okulunu, adresini, telefonunu.</li>
          <li><b>Fotoğraf gönderme.</b></li>
        </ul>
        <p>Çocuk rahatsız edici bir şey görür ya da biri ona kötü davranırsa size gelebilmeli. Bunun için siz ilk tepkide <b>kızmayın; önce sakin sakin dinleyin.</b> “İyi ki söyledin” demek yeterli. Çocuk kızılacağını düşünürse bir dahaki sefere saklar.</p>
        <p class="mut">Sonra durumu torununuzun anne babasına anlatın; ne yapılacağına birlikte karar verirsiniz.</p>`,
    },
    {
      title: '“Ücretsiz elmas” tuzağı',
      html: `<p>Oyun oynayan çocuklar bazen <b>“ücretsiz elmas”</b>, <b>“bedava altın”</b> gibi vaatlerle karşılaşır. Bunlar <b>sitelerde, reklamlarda ya da bilmediğiniz uygulamalarda</b> çıkar.</p>
        <p>Bunlar <b>dolandırıcılıktır.</b> Amaçları çocuğun <b>hesap şifresini</b> almaktır. Şifre verilirse hesap ele geçirilir.</p>
        <p>Torununuza şunu öğretin:</p>
        <ul>
          <li>Ücretsiz diye gelen sitelere <b>girme</b>, uygulamaları <b>indirme</b>.</li>
          <li>Oyun şifreni <b>kimseye verme</b>, hiçbir siteye de yazma.</li>
          <li>Bir şey çıkarsa <b>bize göster.</b></li>
        </ul>`,
    },
    rehberSoru({
      title: '“Şifreni söyler misin?”',
      html: '<p>Torununuz oyun oynuyor. Ekranı gösterip: “Dede, elmas almam lazım, <b>şifreni söyler misin?</b>” diyor. Ne yaparsınız?</p>',
      opts: ['Çocuk istiyor, kısa bir şey olur; şifreyi söylerim', 'Şifreyi söylemem, ama kartı mağazaya kaydedip bırakırım', 'Şifreyi söylemem; elmas almak için anne babasına sorarız'], ok: 2,
      wrong: 'Şifre ve kayıtlı kart, çocuğun eline para harcama yetkisi vermek demektir. Başka bir yol düşünün.',
      why: 'Doğru. Şifrenizi ve kartınızı vermeyin. “Elmas” oyun içi satın almadır ve para harcatır. Satın alıp almamaya torunun anne babasıyla birlikte karar verirsiniz. Kızmadan, “şifre bende kalır” demeniz yeterli.',
    }),
    rehberSoru({
      title: 'Kartınızda tanımadık harcama',
      html: '<p>Bankanızdan gelen mesajda kartınızdan <b>tanımadığınız bir “oyun” harcaması</b> yapıldığını görüyorsunuz. Birkaç gün önce torununuz telefonunuzda oynamıştı. Ne yaparsınız?</p>',
      opts: ['Bankayı arar, mağazadan iade isterim', 'Beklerim, belki kendiliğinden geri gelir', 'Torunu azarlar, oyunu telefondan silerim'], ok: 0,
      wrong: 'Harcamayı sessizce bırakmak ya da çocuğa kızmak sorunu çözmez. Kayıtlı kart varsa önce bankanıza ve mağazaya bakın.',
      why: 'Doğru. Bankayı kartın arkasındaki numaradan arayın ve harcamayı bildirin; torunu azarlamayın, büyük olasılıkla bilmeden yaptı. Uygulama mağazasından da iade isteyebilirsiniz; her harcamada iade kabul edilmeyebilir, ama denemeye değer. Bundan sonra için satın almada şifre isteyin ya da kartı mağazadan çıkarın.',
    }),
    {
      title: 'Torununuzun fotoğrafını paylaşmak',
      html: `<p>Torununuzla gurur duyuyorsunuz ve fotoğrafını paylaşmak istersiniz; çok doğal. Yalnızca paylaşmadan önce bir göz atın. Fotoğrafta şunlar <b>görünmesin:</b></p>
        <ul>
          <li><b>Okulun adı</b> ve <b>okul forması</b> (üstünde okul adı yazar).</li>
          <li><b>Evin adresi</b>, kapı numarası, sokak tabelası.</li>
          <li><b>Konum:</b> paylaşırken “yer ekle” seçeneğini kullanmayın.</li>
        </ul>
        <p>Bu bilgiler yabancıların çocuğun nerede olduğunu ve hangi saatlerde nerede bulunduğunu öğrenmesine yol açabilir.</p>
        <p>En önemlisi: <b>önce torunun anne babasından izin alın.</b> Kimi aileler çocuğunun fotoğrafının hiç paylaşılmasını istemez. Bu onların hakkıdır.</p>
        <p class="mut">Hesabınızı “yalnızca arkadaşlar” görecek şekilde ayarlamak da iyi bir önlemdir (Sosyal medya dersinde görmüştünüz).</p>`,
    },
    rehberSoru({
      title: 'Okul formalı fotoğraf',
      html: '<p>Torununuzun <b>okul formalı</b>, okulun kapısı önünde çekilmiş fotoğrafı çok güzel çıkmış. Sosyal medyada paylaşmak istiyorsunuz. Ne yaparsınız?</p>',
      opts: ['Paylaşırım, hesabım zaten kalabalık değil', 'Önce anne babasına sorar, formasız seçerim', 'Paylaşırım, yalnızca okul adını yazmam'], ok: 1,
      wrong: 'Okul kapısı ve forma, çocuğun nerede olduğunu gösterir. Anne babasının izni ve bilgi vermeyen bir fotoğraf daha güvenlidir.',
      why: 'Doğru. Önce anne babasının iznini alın; okul adı, forma, adres ve konum görünmesin. Okul adını yazmamak yetmez, kapı ve forma da yerini ele verir. Okul kapısı ve forma, yabancıların çocuğun nerede olduğunu anlamasına yol açar. Evde, sade bir arka planda çekilmiş bir fotoğraf aynı sevinci verir.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Torununuz telefonunuzdayken güvenli olmak için:</p>' },
  ],
};
