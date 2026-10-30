// Sesle yazma (dikte): ⊞ + H. Benzetimde gerçek mikrofon yoktur; şeritteki "Konuş" düğmesi hazır cümleleri yazar. (5. hafta)
import { K, desktopReady, norm } from './common.js';
import { rehberSoru } from './kalip.js';

const npWin = (c) => c.d.find('notepad');
const npText = (c) => npWin(c)?.el.querySelector('textarea')?.value || '';
// Not Defteri açık, imleç yazı alanında, görev çubuğunda yedek 🎤 düğmesi (tarayıcı ⊞ + H'yi alamazsa)
const ready = (c) => {
  desktopReady(c);
  const n = npWin(c) || c.d.open('notepad');
  c.d.ensure('notepad');
  n.el.querySelector('textarea').focus();
  c.d.dictationButton(true);
  return n;
};
const stripOn = (c) => c.d.dictation(true);

export const sesleYazma = {
  id: 'sesle-yazma', icon: '🎤', title: 'Konuşarak yazın: Windows + H', minutes: 15, stage: 'desktop',
  desc: 'Klavye yavaş geliyorsa ya da eliniz titriyorsa: konuşarak yazmak, noktalamayı sözle söylemek ve yanlışları düzeltmek.',
  summary: [
    ['⊞ + H', 'Sesle yazmayı açar. Önce yazı alanına tıklayın'],
    ['Yavaş ve net konuşun', 'Bazı bilgisayarlarda “nokta”, “virgül” diyerek noktalama eklenebilir; olmazsa sonra klavyeyle eklersiniz'],
    ['Durdurmak', 'Yeniden ⊞ + H ya da mikrofon simgesine tıklayın'],
    ['Yanlış kelime', 'Sonra klavyeyle düzeltin'],
    ['Telefonda', 'Klavyedeki mikrofon simgesine basın'],
    ['Gizlilik', 'Şifre ve kart numarası söylenmez'],
  ],
  steps: [
    {
      title: 'Bu derste',
      html: `<p>Klavyede yazmak yavaş geliyor olabilir ya da elleriniz titriyor olabilir. O zaman bilgisayara <b>konuşarak</b> yazdırabilirsiniz. Siz söylersiniz, bilgisayar yazar.</p>
        <p>Windows 10 ve 11'de bunun kısayolu ${K('⊞ Windows', 'H')} tuşlarıdır. <b>Akıllı telefonda</b> da aynısı vardır: klavyedeki <b>mikrofon simgesine</b> basarsınız.</p>
        <div class="box"><b>Önemli:</b> Bu dersteki bilgisayar bir <b>benzetimdir</b>. Sınıfta mikrofon olmayabilir, o yüzden gerçekten konuşmayacaksınız. Bir düğmeye basınca, söylemiş gibi hazır bir cümle yazılır. <b>Kendi bilgisayarınızda</b> ise mikrofona gerçekten konuşursunuz.</div>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); c.d.dictationButton(true); },
    },
    {
      title: 'Yazı alanına tıklayın',
      html: '<p>Not Defteri açıldı. Konuşarak yazmak için bilgisayarın <b>nereye yazacağını</b> bilmesi gerekir. Bunun için Not Defteri\'nin <b>beyaz yazı alanına bir kez tıklayın</b>. Yanıp sönen çizgi (imleç) görünsün.</p><p class="mut">Not Defteri, Word ya da e-posta yazarken olduğu gibi, imleç bir yazı kutusundaysa çalışır.</p>',
      setup: (c) => {
        c.d.closeAll(); c.d.dictation(false, true);
        const n = c.d.open('notepad');
        const ta = n.el.querySelector('textarea');
        // Pencere açılırken odak kendiliğinden gelebilir; öğrenci tıklasın diye biraz sonra odağı alıp dinlemeye başlarız
        setTimeout(() => { ta.blur(); ta.addEventListener('focus', () => c.complete(), { once: true }); }, 300);
        c.d.dictationButton(true);
      },
      hint: 'Yazı alanı pencerenin altındaki büyük beyaz yerdir.',
      on: () => false, // adım, yazı alanına odak gelince setup'taki dinleyiciyle tamamlanır
      done: 'İmleç yazı alanında. Şimdi bilgisayara "burada dinle" diyebiliriz.',
    },
    {
      title: '⊞ + H tuşlarına basın',
      html: `<p>${K('⊞ Windows', 'H')} tuşlarına <b>aynı anda</b> basın.</p>
        <p class="mut">Ekranın üstünde mikrofonlu küçük bir şerit çıkar. Gerçek bilgisayarda ilk seferde "mikrofonu kullanabilir miyim?" diye sorarsa <b>Evet</b> deyin.</p>`,
      keys: ['Meta', 'KeyH'],
      mouse: '🖱 ya da görev çubuğunda 🎤',
      setup: (c) => { ready(c); c.d.dictation(false, true); },
      hint: `Tuşlar çalışmazsa önce Not Defteri'nin yazı alanına bir kez tıklayın. Yine olmazsa görev çubuğunun sağındaki <b>🎤</b> düğmesine tıklayın.`,
      check: (c) => !!c.d.screen.querySelector('.dk-dict'),
      on: (ev) => ev.type === 'dictation' && ev.on,
      done: `Şeritte <b>Dinliyor…</b> yazıyor: bilgisayar sizi dinliyor. Türkçe seçili olmalıdır ve bazen <b>internet bağlantısı</b> gerekir.`,
    },
    {
      title: '“Konuş” düğmesine basın',
      html: `<p>Şimdi konuşuyormuş gibi yapacağız. Şeritteki <b>🗣 Konuş (benzetim)</b> düğmesine basın.</p>
        <p>Gerçekte şunu <b>yavaş ve net</b> söylerdiniz: <i>“yarın saat onda doktora gideceğim nokta”</i>.</p>`,
      setup: (c) => { ready(c); if (!npText(c).trim()) c.d.dictIdx = 0; stripOn(c); },
      hint: 'Şerit ekranın en üstündedir. Düğmeye basınca yazının harf harf geldiğini izleyin.',
      check: (c) => norm(npText(c)).includes('doktora gideceğim'),
      on: (ev) => ev.type === 'dictation-text' && norm(ev.value).includes('doktora gideceğim'),
      done: 'Cümle yazıldı. Sonundaki noktayı siz yazmadınız; “nokta” dediniz, bilgisayar işaret koydu. Aynı şekilde <b>“virgül”</b> ve <b>“soru işareti”</b> denir. Türkçede bu her bilgisayarda çalışmayabilir; çalışmazsa noktalamayı sonra klavyeyle eklersiniz.',
    },
    {
      title: 'Bir cümle daha söyleyin',
      html: '<p>Yine <b>🗣 Konuş</b> düğmesine basın. Bu kez söylenen: <i>“sonra pazardan elma alacağım nokta”</i>. Yazıya dikkat edin.</p>',
      setup: (c) => { ready(c); if (!npText(c).trim()) c.d.dictIdx = 1; stripOn(c); },
      check: (c) => norm(npText(c)).includes('elmas'),
      on: (ev) => ev.type === 'dictation-text' && norm(ev.value).includes('elmas'),
      done: 'Bilgisayar <b>“elma”</b> yerine <b>“elmas”</b> yazdı. Konuşarak yazarken arada böyle yanlış anlamalar olur. Sorun değil, birazdan düzelteceğiz.',
    },
    {
      title: 'Konuşmayı durdurun',
      html: `<p>Yazacaklarınız bitince bilgisayarı dinlemeyi bırakmalıdır; yoksa çevredeki sesleri de yazar. <b>Mikrofon simgesine</b> (şeritteki kırmızı daire) tıklayın.</p>
        <p class="mut">Ya da yeniden ${K('⊞ Windows', 'H')} tuşlarına basın.</p>`,
      keys: ['Meta', 'KeyH'],
      mouse: '🖱 Mikrofon simgesi',
      setup: (c) => { ready(c); stripOn(c); },
      check: (c) => !c.d.screen.querySelector('.dk-dict'),
      on: (ev) => ev.type === 'dictation' && !ev.on,
      done: `Şerit kapandı. <b>Gizlilik:</b> ses tanıma çoğu zaman internetteki bir sunucuya gider. Bu yüzden konuşarak <b>şifre ya da kart numarası</b> yazdırmayın.`,
    },
    {
      title: 'Yanlış kelimeyi düzeltin',
      html: '<p>Yazıdaki <b>elmas</b> kelimesini <b>elma</b> yapın. Kelimenin sonuna (<b>s</b> harfinin hemen arkasına) tıklayın, <b>⌫ Backspace</b> tuşuna bir kez basın.</p>',
      keys: ['Backspace'],
      setup: (c) => { ready(c); c.d.dictation(false, true); if (!norm(npText(c)).includes('elma')) npWin(c).api.np.setText('Yarın saat onda doktora gideceğim. Sonra pazardan elmas alacağım.'); },
      hint: 'Fare imleci "s" harfinin sağında olsun. Sonra ⌫ Backspace, soldaki harfi siler.',
      check: (c) => { const t = norm(npText(c)); return t.includes('elma alacağım') && !t.includes('elmas'); },
      on: (ev, c) => ev.type === 'input' && (() => { const t = norm(npText(c)); return t.includes('elma alacağım') && !t.includes('elmas'); })(),
      done: 'Yazı düzeldi. Kural: önce konuşup hızlıca yazdırın, sonra klavyeyle düzeltin.',
    },
    rehberSoru({
      title: 'Hangisi doğru?',
      html: '<p>Torununuza bir mektup yazdırıyorsunuz. Sıra <b>kredi kartı numaranızı</b> yazmaya geldi. Ne yaparsınız?</p>',
      opts: [
        'Kart numarasını da yüksek sesle söylerim, nasıl olsa kolay',
        'Numarayı söylemem, o kısmı klavyeyle yazarım',
        'Söyledikten sonra yazıyı silerim, böylece ses internetteki sunucuya hiç gitmemiş olur',
      ],
      ok: 1,
      wrong: 'Söylenen ses çoğu zaman internetteki bir sunucuya gider; sonradan yazıyı silmek bunu geri almaz.',
      why: 'Şifre, kart numarası, TC kimlik numarası gibi gizli bilgileri konuşarak yazdırmayın. Onları klavyeyle yazın. Sıradan mektup ve mesajlarda ise sesle yazma çok rahattır.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Sesle yazma:</p>' },
  ],
};
