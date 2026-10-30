// 1. hafta ek dersi: dizüstü bilgisayar. Touchpad hareketleri, avuç içi değmesi, pil ve şarj, Fn tuşuyla yanlışlıkla kapanan ses ve Wi-Fi.
import { K } from './common.js';
import { info, ayir, sec } from './kalip.js';

const pad = (inner) => `<div class="qz-pic" style="font-size:2.2em">${inner}</div>`;

export const dizustu = {
  id: 'dizustu', icon: '💻', title: 'Dizüstü bilgisayar ve touchpad', minutes: 30, stage: 'scene',
  desc: 'Touchpad hareketleri, pil ve şarj, kapağı kapatınca ne olur.',
  summary: [
    ['Tek parmak', 'İmleci oynatır; hafifçe dokunmak = tık'],
    ['İki parmak dokunuş', 'Sağ tık'],
    ['İki parmak kaydırma', 'Sayfayı aşağı-yukarı kaydırır (fare tekerleği gibi)'],
    ['İki parmak aç-kapa', 'Yakınlaştırır / uzaklaştırır'],
    ['Sürükleme / yazı seçme', 'Bir elle sol alt köşeye basılı tutun, öbür elle kaydırın'],
    ['Avuç içi', 'Yazarken touchpad\'e değmesin; imleç kayarsa yazı başka yere gider'],
    ['Pil simgesi', 'Sağ altta; %20\'nin altına inmeden şarja takın'],
    ['Fn + ses / Wi-Fi tuşu', 'Yanlışlıkla ses ya da internet kapanabilir; aynı tuşla geri açılır'],
  ],
  steps: [
    {
      title: 'Dizüstü bilgisayar',
      html: `<p><b>Dizüstü bilgisayarda</b> (laptop) kasa, ekran, klavye ve fare tek parçadır. Farenin yerini klavyenin altındaki <b>dokunmatik yüzey</b> (<b>touchpad</b>) tutar.</p>
        <p>Bu derste touchpad'i rahat kullanmayı ve yanlışlıkla yapılan hataları düzeltmeyi öğreneceğiz.</p>
        <p class="mut">Sağdaki ekran gerçek bir touchpad değildir; hareketi okuyup doğru cevabı seçeceksiniz.</p>`,
      scene: info('<div class="sc-big">💻<br>▭</div><p>Klavyenin altındaki dikdörtgen: touchpad</p>'),
    },
    sec({
      title: 'Tek parmak', text: pad('💻 ☝ ▭'),
      q: 'Touchpad\'in üstünde tek parmağınızı kaydırırsanız ne olur?',
      opts: ['İmleç (ok) hareket eder', 'Sayfa aşağı iner', 'Bilgisayar kapanır'], ok: 0,
      why: 'Tek parmak, farenin kendisi gibidir: parmağı nereye götürürseniz ok oraya gider. Parmağınız kenara gelirse kaldırıp ortadan devam edin.',
    }),
    sec({
      title: 'Tık nasıl atılır?', text: pad('☝ ▭ → 👆'),
      q: 'Touchpad\'de tıklamak için hangisi yapılır?',
      opts: ['Parmakla yüzeye hafifçe dokunulur ya da alttaki sol köşeye basılır', 'Yüzeye tırnakla vurulur', 'Yüzey sürekli ovalanır'], ok: 0,
      why: 'Dokunmak ya da altına doğru bastırmak sol tık sayılır. Çift tık için iki kez hızlıca dokunun. Sert basmanıza gerek yok.',
    }),
    sec({
      title: 'Sağ tık', text: pad('✌ ▭'),
      q: 'Bir dosyaya sağ tık yapmak istiyorsunuz. Touchpad\'de ne yaparsınız?',
      opts: ['İki parmakla yüzeye bir kez dokunurum (ya da sağ alt köşeye basarım)', 'Üç kez peş peşe dokunurum', 'Klavyede Enter\'a basarım'], ok: 0,
      why: 'İki parmakla dokunuş sağ tıktır. Bazı bilgisayarlarda sağ alt köşeye basmak da aynı işi yapar.',
    }),
    sec({
      title: 'Sayfayı kaydırmak', text: pad('✌ ↕ 📄'),
      q: 'Uzun bir yazıyı aşağı kaydırmak için fare tekerleği yok. Ne yaparsınız?',
      opts: ['İki parmağımı birlikte yukarı-aşağı kaydırırım', 'Tek parmağımı çok hızlı oynatırım', 'Sayfayı kapatıp yeniden açarım'], ok: 0,
      why: 'İki parmakla kaydırma, tekerleğin yerini tutar. Hangi yöne kaydığı ayarlardan değiştirilebilir.',
    }),
    sec({
      title: 'Yakınlaştırma', text: pad('🤏 ↔ 🔍'),
      q: 'Fotoğraf küçük görünüyor. İki parmağınızı birbirinden uzaklaştırırsanız (telefondaki gibi) ne olur?',
      opts: ['Çoğu programda yakınlaşır; birbirine yaklaştırırsanız uzaklaşır', 'Dosya silinir', 'Hiçbir şey olmaz, bu yalnızca telefonda çalışır'], ok: 0,
      why: 'Touchpad telefonun ekranı gibi çalışır. Tarayıcıda alternatif olarak Ctrl ile + ve − tuşları da kullanılır.',
    }),
    {
      title: 'Sürükleme ve seçme',
      html: `<p>Pencere taşırken, simge sürüklerken ve yazı seçerken sol tuşu <b>basılı tutup</b> kaydırmak gerekir. Touchpad'de bunu tek elle yapmak yeni başlayanlar için zordur. İki kolay yol var:</p>
        <ol class="steps"><li><b>İki el:</b> Bir elinizin başparmağıyla touchpad'in <b>sol alt köşesine basılı tutun</b>. Öbür elinizin işaret parmağıyla yüzeyde kaydırın. Bırakınca yazı ya da simge yerinde kalır.</li><li><b>Tek el:</b> Bazı bilgisayarlarda iki kez hızlıca dokunup ikincisinde parmağınızı kaldırmadan kaydırmak da sürükler. Çalışmazsa 1. yolu kullanın.</li></ol>
        <p>Bu yöntem yazı seçerken, pencere taşırken ve simge sürüklerken aynıdır.</p>`,
      scene: info('<div class="sc-big">💻<br>👍 + ☝</div><p>Başparmak köşede basılı, işaret parmağı kaydırıyor</p>'),
    },
    sec({
      title: 'Touchpad ile yazı seçmek', text: pad('👍 ▭ ☝'),
      q: 'Yazının bir kısmını touchpad ile seçmek için ne yaparsınız?',
      opts: ['Bir elimle sol alt köşeye basılı tutar, öbür elimin parmağıyla yazının üstünde kaydırırım', 'Parmağımı çok hızlı oynatırım', 'İki parmağımla sayfayı kaydırırım'], ok: 0,
      why: 'Sürükleme için sol tuşun basılı kalması gerekir. Touchpad\'de bunu bir elinizle köşeye basarak, öbür elinizle kaydırarak yaparsınız.',
    }),
    ayir({
      title: 'Hangi hareket?',
      html: '<p>Her hareketi, ne işe yaradığına göre doğru kutuya sürükleyin.</p>',
      bins: [{ id: 'tik', label: 'Tık', icon: '👆' }, { id: 'kay', label: 'Kaydırma / yakınlaştırma', icon: '↕' }],
      items: [
        { label: 'Tek parmakla dokunmak', icon: '☝', bin: 'tik', why: 'Sol tık.' },
        { label: 'İki parmakla dokunmak', icon: '✌', bin: 'tik', why: 'Sağ tık.' },
        { label: 'Alttaki köşeye basmak', icon: '⬛', bin: 'tik', why: 'Sol alt köşe sol tık, sağ alt köşe sağ tık.' },
        { label: 'İki parmakla yukarı-aşağı', icon: '↕', bin: 'kay', why: 'Sayfayı kaydırır.' },
        { label: 'İki parmağı açıp kapamak', icon: '🤏', bin: 'kay', why: 'Yakınlaştırır ve uzaklaştırır.' },
        { label: 'İki parmakla sağa-sola', icon: '↔', bin: 'kay', why: 'Geniş sayfaları yana kaydırır.' },
      ],
      done: 'Touchpad hareketlerini ayırt ediyorsunuz.',
    }),
    sec({
      title: 'İmleç kaçtı', text: pad('⌨ 🖐 ▭'),
      q: 'Yazı yazarken avucunuz touchpad\'e değiyor ve yazdığınız harfler birden yazının başka yerine gidiyor. Ne yaparsınız?',
      opts: ['Elimi touchpad\'den uzak tutarım; sıklıkla oluyorsa touchpad\'i geçici kapatırım (Fn + touchpad tuşu)', 'Daha hızlı yazarım', 'Klavyeyi değiştiririm'], ok: 0,
      why: 'Avuç içi değince imleç sıçrar. Elinizi bileğinizle klavyenin kenarından yükseltin. Tuşların üzerindeki küçük touchpad işareti Fn ile birlikte açıp kapatır.',
    }),
    sec({
      title: 'Harici fare', text: pad('🖱 ⟷ 💻'),
      q: 'Touchpad size zor geliyor. USB fare takarsanız ne olur?',
      opts: ['Fare hemen çalışır; touchpad da çalışmaya devam eder', 'Önce bilgisayarı kapatmak gerekir', 'Touchpad bozulur'], ok: 0,
      why: 'Dizüstüne istediğiniz zaman fare takabilirsiniz; ikisi birlikte çalışır. Kendinizi rahat hissettiğiniz yöntemi kullanın.',
    }),
    sec({
      title: 'Pil simgesi', text: pad('🔋 20%'),
      q: 'Sağ alttaki pil simgesi %20 gösteriyor ve şarja takılı değil. Ne yaparsınız?',
      opts: ['Kaydedip işimi bitirir, şarj aletini takarım', 'Bir şey yapmam; pil bitince yine açılır', 'Pili çıkarıp tekrar takarım'], ok: 0,
      why: 'Pil bitince bilgisayar aniden kapanır ve kaydedilmemiş iş kaybolur. Şarj aleti takılıyken simgede şimşek (⚡) görünür. Pil %20\'ye inmeden şarja takmak ömrünü uzatır.',
    }),
    ayir({
      title: 'Fn tuşuyla ne olur?',
      html: `<p>Dizüstünde üst sıradaki tuşlar (F1–F12) ${K('Fn')} ile birlikte basılınca küçük simgelerini çalıştırır. Yanlışlıkla basılan tuşların sonucunu doğru kutuya bırakın.</p>`,
      bins: [{ id: 'ses', label: 'Ses', icon: '🔊' }, { id: 'net', label: 'İnternet / ekran parlaklığı', icon: '📶' }],
      items: [
        { label: 'Hoparlör çizili tuş: video sessiz kaldı', icon: '🔇', bin: 'ses', why: 'Aynı tuşa bir kez daha basın ya da sağ alttaki hoparlör simgesinden sesi açın.' },
        { label: 'Sesi kısma tuşuna çok basıldı', icon: '🔉', bin: 'ses', why: 'Ses simgesini tıklayıp kaydırıcıyı sağa çekin.' },
        { label: 'Uçak ya da anten tuşu: Wi-Fi kapandı', icon: '✈', bin: 'net', why: 'Uçak modu internet bağlantısını keser. Aynı tuşa ya da sağ alttaki Wi-Fi simgesine tıklayarak kapatın.' },
        { label: 'Ekran karardı (parlaklık sıfır)', icon: '🔅', bin: 'net', why: 'Parlaklık artırma tuşuna basın. Bilgisayar bozulmadı.' },
      ],
      done: 'Fn tuşunun yanlışlıkla neler kapatabileceğini biliyorsunuz.',
    }),
    sec({
      title: 'Wi-Fi yok!', text: pad('📶 ❌ ✈'),
      q: 'Sağ altta uçak simgesi var ve internet yok. Doğru çözüm hangisi?',
      opts: ['Uçak modunu kapatırım (simgeye tıklayıp ya da Fn + uçak tuşu)', 'Bilgisayarı sıfırlarım', 'Modemi yenisiyle değiştiririm'], ok: 0,
      why: 'Çoğu zaman bilgisayar bozuk değildir; yalnızca bir kapatma tuşuna yanlışlıkla basılmıştır. Önce sağ alttaki simgelere bakın.',
    }),
    sec({
      title: 'Kapağı kapatmak', text: pad('💻 ➜ 😴'),
      q: 'Çay almaya giderken dizüstünün kapağını kapattınız. Ne olur?',
      opts: ['Uykuya geçer; kapağı açınca kaldığınız yerden devam eder', 'Bütün dosyalar kaybolur', 'Bilgisayar bozulur'], ok: 0,
      why: 'Kapak kapanınca bilgisayar genellikle <b>uykuya</b> geçer: açık işler bellekte durur. Uzun süre kullanmayacaksanız Başlat → Güç → Kapat daha doğrudur; uyku da pili yavaşça tüketir. Bu davranış Ayarlar → Sistem → Güç bölümünden değiştirilebilir (Windows 10\'da: Ayarlar → Sistem → Güç ve uyku).',
    }),
    sec({
      title: 'Şarj aleti', text: pad('🔌 🔋'),
      q: 'Dizüstüyü çoğu zaman şarj aletine takılı kullanıyorsunuz. Ne yapmalısınız?',
      opts: ['Bir şey yapmayın; yalnızca havalandırmayı kapatmayın', 'Her gün pili sıfıra kadar bitirin', 'Şarj aletini her gece çıkarıp tekrar takın'], ok: 0,
      why: 'Yeni dizüstüler pil dolunca şarjı keser. Önemli olan <b>ısıdır</b>: bilgisayarı yatağın, battaniyenin üzerinde kapatarak kullanmayın; havalandırması açık dursun. Pili sürekli sıfıra kadar bitirmek de ömrünü kısaltır.',
    }),
    sec({
      title: 'Touchpad kapatmak', text: pad('☝ ▭ ⚙'),
      q: 'Dışarıdan fare kullanıyorsunuz ve yazarken touchpad sürekli imleci kaçırıyor. Touchpad\'i nasıl kapatırsınız?',
      opts: ['Ayarlar → Bluetooth ve cihazlar → Dokunmatik yüzey → Kapalı (Windows 10\'da Ayarlar → Aygıtlar → Dokunmatik yüzey); ya da Fn + touchpad tuşu', 'Bilgisayarı kapatırım', 'Touchpad\'in üstüne bant yapıştırırım'], ok: 0,
      why: 'Dokunmatik yüzey ayarlarından touchpad kapatılır, açılır; hassasiyet ve kaydırma yönü de oradan değiştirilir. Fare takılınca kapanması da seçilebilir.',
    }),
    sec({
      title: 'Taşırken', text: pad('🎒 💻'),
      q: 'Dizüstüyü çantayla taşıyacaksınız. Hangisi doğru?',
      opts: ['Önce kapatır (ya da en azından uykuya alır) ve çantada sıkışmayacak şekilde koyarım', 'Açık bırakırım, yolda iş yapmam gerekebilir', 'Ekranından tutup taşırım'], ok: 0,
      why: 'Ekran ince ve kırılgandır: ekrandan tutmayın, kapağı kapatıp gövdeden taşıyın. Çantada ağır şeylerin altında ezilmesin; sıvı şişelerini ayrı bölmeye koyun.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Dizüstü bilgisayarda bilmeniz gerekenler:</p>', scene: info('<div class="sc-big">💻✔</div>') },
  ],
};
