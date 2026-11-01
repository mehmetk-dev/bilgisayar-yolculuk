// 2. hafta: Hata ayıklama ve döngüler (5–8. bölümler)
import { lesson, weekCover, weekEnd, player, quiz, botsay, grid, code, chips, chip, robo, beat, hands, BAG } from './yardim.mjs';

const W = 2;
const L1 = lesson({ week: W, idx: 1, no: 5, color: '#e0457b', icon: '🐞', title: 'Bug Avı: Hata Ayıklama', desc: 'Programlarda hata var! Robo\'yu izle, hatalı komutu bul ve düzelt.' });
const L2 = lesson({ week: W, idx: 2, no: 6, color: '#8a5cff', icon: '🔁', title: 'Tekrar Tekrar: Döngüler', desc: 'Aynı komutları tekrar tekrar yazmak yerine “Tekrarla” bloğu ile kısa programlar yaz.' });
const L3 = lesson({ week: W, idx: 3, no: 7, color: '#d946ef', icon: '🧶', title: 'Desenler ve İç İçe Döngüler', desc: 'Tekrar eden desenleri bul, döngünün içine döngü koy, yıldızları tek tek topla.' });
const L4 = lesson({ week: W, idx: 4, no: 8, color: '#f59e0b', icon: '🏰', title: 'Labirent Görevi', desc: 'Seviye sonu! Döngüleri, anahtarları ve yıldızları birlikte kullan.' });
const bug = (bad, good) => [['🐞 Hatalı', bad], ['✅ Düzeltilmiş', good]];

const slides = [
  weekCover({ week: W, title: 'Hata Ayıklama ve Döngüler', color: '#e0457b', lessons: [['🐞', 'Bug avı'], ['🔁', 'Döngüler'], ['🧶', 'İç içe döngü'], ['🏰', 'Labirent']],
    note: 'Bu hafta hata bulmayı ve döngüyü öğreniyoruz. Oynatıcılarda <b>🐞 Hatalı / ✅ Düzeltilmiş</b> sekmeleri var: önce hatalıyı oynatın, sonra düzeltilmişi.' }),

  /* ---------------- 5. BÖLÜM: BUG AVI ---------------- */
  L1.cover('Sorun: “Hiç yanlış bir şey yapıp sonra düzelttiniz mi?” Programcılar da her gün hata yapar!'),
  L1.s({ tag: 'YENİ KELİME', title: 'Programda böcek var! 🐞',
    body: botsay('<p>Bazen program istediğimiz gibi çalışmaz. Programdaki hataya <b>bug</b> (böcek) denir.</p><p>Çok eskiden bir bilgisayarın içine <b>gerçek bir güve</b> girmiş ve onu bozmuş! O günden beri hatalara “bug” deniyor. 🦋</p>', 'think'),
    note: 'Hata yapmak programcılığın doğal parçası. “Hata yapmaktan korkmayın, hatayı bulmak bir oyun!” deyin.' }),
  L1.s({ tag: 'YENİ KELİME', title: '🔍 Hata ayıklama',
    body: `<div class="card" style="font-size:44px;font-weight:800;border:6px solid var(--lc)">Hatayı bulup düzeltmeye <b style="color:var(--lc)">hata ayıklama</b> denir.</div>
<p style="margin-top:34px">Bug avcısının 3 adımı:</p>
<p class="f">1️⃣ <b>▶ Çalıştır</b>, Robo\'yu dikkatle <b>izle</b>.</p>
<p class="f">2️⃣ Robo <b>nerede</b> yanlış yaptı?</p>
<p class="f">3️⃣ O bloğu <b>✖ sil</b>, doğrusunu koy. Tekrar çalıştır!</p>`,
    note: 'Bu üç adımı tahtaya da yazın. Bilgisayarda hata çıkınca çocuklar bu adımlara baksın.' }),
  L1.game({ title: '🧦 Bozuk tarif',
    body: `<div class="row"><div class="col"><p>Bu algoritmada bir <b>bug</b> var. Bul!</p>
<div class="card"><p>1. 🧦 Çorabı giy</p><p>2. 👟 Ayakkabıyı giy</p><p>3. 🎀 Ayakkabıyı bağla</p><p class="f" style="color:var(--no)">4. 🧦 Çorabı çıkar ← 🐞</p></div>
<p class="f" style="margin-top:20px">Ayakkabı ayakta, çorap nasıl çıkar? 😄 4. adımı <b>sil</b>!</p></div><div style="flex:0 0 260px">${robo('think', 240)}</div></div>`,
    note: 'Önce sınıfa okutun, kimse görmezse 4. adımı gösterin. Sonra çocuklar kendi bozuk tariflerini uydursun.' }),
  L1.hard({ title: 'Eksik adım',
    body: player({ map: ['S....G'], progs: bug('FFFF', 'FFFFF'), under: '<p class="f" style="margin-top:12px">Önce 🐞 hatalıyı oynat: Robo nerede kaldı? <b>Kaç adım eksik?</b></p>' }),
    note: 'Hatalı programı oynatın: Robo pilden bir önce durur. Kareleri sayın, sonra ✅ sekmesine geçip doğrusunu oynatın.' }),
  L1.s({ tag: 'BUG AVI 🐞', title: 'Yanlış dönüş',
    body: player({ map: ['S..', '##.', '##G'], lr: true, progs: bug('FFLFF', 'FFRFF'), under: '<p class="f">Robo köşede <b>yanlış yöne</b> dönüyor. Hangi blok?</p>' }),
    note: 'Hatalıda Robo sola döner ve ağaca çarpar. Hatalı blok kırmızı çerçeveyle işaretlenir: aslında hata ondan önceki dönüşte!' }),
  L1.s({ tag: 'SORU 🤔', body: quiz({ q: 'Robo pile gitmeli. Bu programda <b>hangi blok</b> hatalı?', pic: `<div style="display:flex;gap:26px;align-items:center">${grid(['..G', '.##', 'S##'], { dir: 'N', size: 120 })}${code('FFLFF', { w: 300 })}</div>`, v: true,
    opts: ['1. blok (İleri git)', '3. blok (Sola dön)', '5. blok (İleri git)'], a: 1, why: 'Yukarı çıkınca Robo <b>sağa</b> dönmeli. 3. blok yanlış.' }),
    note: 'Parmakla takip edin: iki kez yukarı, sonra pil sağda. Sola dönerse duvara bakar.' }),
  L1.hard({ title: 'Komutlar doğru, sıra yanlış!',
    body: player({ map: ['k.S.DG'], progs: bug('FFFFFBB', 'BBFFFFF'), under: '<p class="f">İki programda da <b>aynı bloklar</b> var. Fark ne? Önce anahtar 🔑, sonra kapı 🚪!</p>' }),
    note: 'Bazen hiçbir blok yanlış değildir, sadece <b>sırası</b> yanlıştır. Blokları sürükleyerek sıra değiştirilebilir.' }),
  L1.s({ tag: 'BUG AVI 🐞', title: 'Fazladan bir blok',
    body: player({ map: ['#...G', '#.###', 'S*...'], progs: bug('FFLFFRFFF', 'FLFFRFFF'), under: '<p class="f">Bu sefer programda <b>fazladan</b> bir blok var. Hangisi?</p>' }),
    note: 'Hatalıda Robo bir kare fazla ilerleyip ağaca çarpar. Fazla “İleri git” silinince düzelir.' }),
  L1.pc(['🐞 Eksik adım', '🐞 Yanlış dönüş', '❓ Hangi blok hatalı?', '💦 Neden suya düştü?', '🐞 Fazladan bir blok', '🔀 Sıra karışmış!', '⭐ İki bug birden', '⭐ Büyük bug avı']),

  /* ---------------- 6. BÖLÜM: DÖNGÜLER ---------------- */
  L2.cover('Hatırlatma: “Bug ne demekti? Nasıl buluyorduk?” (Çalıştır, izle, düzelt.)'),
  L2.s({ tag: 'YENİ', title: 'Ufff, çok yoruldum! 😮‍💨',
    body: botsay(`<p>“İleri git, ileri git, ileri git, ileri git, ileri git, ileri git…”</p><p>${chips('FFFFFF')}</p><p class="f">Bunun yerine şöyle diyebiliriz:</p><div class="f" style="width:460px">${code('6(F)')}</div><p class="f" style="margin-top:12px">Buna <b style="color:var(--lc)">DÖNGÜ</b> denir! 🔁</p>`, 'think'),
    note: 'Sınıfa 6 kez “ileri git” dedirtin, sonra “6 kez tekrarla: ileri git”. Hangisi daha kolay?' }),
  L2.s({ tag: 'DÖNGÜ', title: 'Döngü tur tur çalışır 🏃',
    body: `<div class="row"><div class="col"><p>Okulda <b>3 tur koşmak</b> gibi: her turda aynı işi yaparsın.</p><p class="f">Sayı kaçsa döngü o kadar <b>tur</b> atar.</p><p class="f">Boncuklar ⚪ turları sayar: dolan boncuk = bitmiş tur.</p></div>
<div class="col">${code('4(F)', { w: 480 })}<div class="f" style="margin-top:20px;font-size:34px;font-weight:800;display:flex;gap:16px;flex-wrap:wrap"><span>1. tur ⬆</span><span>2. tur ⬆</span><span>3. tur ⬆</span><span>4. tur ⬆</span></div></div></div>`,
    note: '“Kısa program ile uzun program aynı işi yapar.” Döngünün içindeki komut her turda bir kez çalışır.' }),
  L2.game({ title: '💃 Dans döngüsü',
    body: `<div class="row"><div class="col"><p>Hep birlikte yapalım:</p><div class="card" style="font-size:40px;font-weight:800;border:5px solid var(--lc)">🔁 3 kez tekrarla:<br>&nbsp;&nbsp;👏 alkışla<br>&nbsp;&nbsp;⬆ zıpla<br>&nbsp;&nbsp;🔄 dön</div><p class="f" style="margin-top:20px">Şimdi sen bir dans döngüsü uydur!</p></div><div style="flex:0 0 280px">${robo('dance', 260)}</div></div>`,
    note: 'Sınıf ayağa kalksın, 3 tur dans etsin. Sonra bir öğrenci kendi döngüsünü söylesin; sınıf uygulasın.' }),
  L2.s({ tag: 'SORU 🤔', body: quiz({ q: 'Bu program Robo\'yu <b>kaç kare</b> ilerletir?', pic: code('4(F)', { w: 420 }),
    opts: ['1 kare', '4 kare', '5 kare'], a: 1, why: 'Döngü 4 tur atar, her turda 1 kare: <b>4 kare</b>.' }), note: 'Önce tahmin, sonra bir sonraki slaytta izleyip kontrol edin.' }),
  L2.s({ tag: 'İZLE 👀', title: 'Döngü nasıl çalışır?',
    body: player({ map: ['S...G'], prog: '4(F)', stack: false, under: '<p class="f" style="margin-top:16px">Her turda bir boncuk dolar. “🔁 Başa dön” balonu yeni turu gösterir.</p>' }),
    note: 'Yavaş modda oynatın ve turları sesli sayın: “1. tur… 2. tur…”' }),
  L2.s({ tag: 'İZLE 👀', title: 'Pil çok uzakta!',
    body: player({ map: ['S.......G'], prog: '8(F)', stack: false, codeW: 440, under: '<p class="f" style="margin-top:16px">8 blok yerine <b>2 blok</b>! 😎</p>' }) }),
  L2.hard({ title: 'Döngünün içi ve dışı',
    body: `<div class="vs"><div><h3>${code('4(F)R', { w: 420 })}</h3><p class="f">↱ Sağa dön döngünün <b>dışında</b>: <b>1 kez</b> çalışır.</p></div><div><h3>${code('4(FR)', { w: 420 })}</h3><p class="f">↱ Sağa dön döngünün <b>içinde</b>: <b>her turda</b>, 4 kez çalışır!</p></div></div>
<p class="f" style="margin-top:24px;text-align:center">Döngünün <b>içindeki</b> blok her turda, <b>dışındaki</b> blok 1 kez çalışır.</p>`,
    note: 'Bu cümleyi sınıfla birlikte söyleyin. İç içe döngünün temeli bu! Blok kutunun içinde mi, altında mı? İçerideki blok biraz sağa kaymıştır.' }),
  L2.s({ tag: 'İZLE 👀', title: 'Döngüden sonra',
    body: player({ map: ['S....#', '####.#', '####G#'], prog: '4(F)R2(F)', lr: true, under: '<p class="f" style="margin-top:16px">Önce düz git (döngü), <b>sonra</b> bir kez dön, sonra yine düz git.</p>' }) }),
  L2.s({ tag: 'SORU 🤔', body: quiz({ q: 'Döngünün içinde <b>4 komut</b> var, döngü <b>2 kez</b> tekrarlanıyor. Robo toplam kaç komut yapar?', pic: code('2(FLFR)', { w: 420 }),
    opts: ['4', '6', '8'], a: 2, why: 'Bir tur = 4 komut. 2 tur = <b>8 komut</b>.' }) }),
  L2.s({ tag: 'İZLE 👀', title: 'Merdiven döngüsü 📶',
    body: player({ map: ['###G', '##.*', '#.*#', 'S.##'], prog: '3(FLFR)', lr: true, under: '<p class="f" style="margin-top:16px">Her basamak aynı: ileri, sola, ileri, sağa. Bu bir <b>desen</b>!</p>' }),
    note: 'Önce bir basamağı parmakla gösterin, sonra “kaç basamak var?” diye sorun: döngünün sayısı bu.' }),
  L2.s({ tag: 'SORU 🤔', body: quiz({ q: 'Robo ne çizer? Parmağınla masada dene!', pic: code('4(FR)', { w: 420 }), v: true,
    opts: ['Düz bir çizgi', 'Zikzak', 'Küçük bir kutu ⬜ çizip başladığı yere döner'], a: 2, why: 'İleri, sağa dön… 4 kez: bir <b>kare</b> çizer ve başladığı yere döner.' }) }),
  L2.s({ tag: 'SORU 🤔', body: quiz({ q: 'İki program Robo\'yu aynı yere götürür. Hangisi <b>daha iyi</b>?', v: true,
    pic: `<div style="display:flex;gap:30px;align-items:flex-start"><div style="max-width:330px"><p class="soft" style="font-size:26px">Sol</p>${chips('FLFRFLFRFLFR')}</div><div style="width:300px"><p class="soft" style="font-size:26px">Sağ</p>${code('3(FLFR)', { sm: true })}</div></div>`,
    opts: ['Sağdaki: daha kısa, okuması kolay', 'Soldaki: daha uzun', 'İkisi de çalışmaz'], a: 0, why: 'Döngü programı <b>kısaltır</b> ve okumayı kolaylaştırır.' }) }),
  L2.pc(['❓ Kaç kare?', '👀 İzle: döngü', '🔁 İlk döngün', '❓ Robo ne çizer?', '📶 Merdiven döngüsü', '❓ Kaç komut?', '👀 Bir tur = 4 komut', '❓ Hangi blok içinde?', '➡ Döngüden sonra', '⭐ Yıldızlı zikzak', '❓ Hangisi daha iyi?', '📶 Büyük merdiven', '⭐ Merdiven ve koridor', '⭐ Bahçeyi dolaş']),

  /* ---------------- 7. BÖLÜM: İÇ İÇE DÖNGÜ ---------------- */
  L3.cover('Bugün en zor konu: <b>iç içe döngü</b>. Yavaş gidin; bilgisayardan önce ritim ve yıldız tarlası oyunlarını mutlaka oynayın.'),
  L3.s({ tag: 'DESEN 🔍', title: 'Desen dedektifi',
    body: botsay('<p>Etrafına bak: kaldırım taşları, kazağındaki çizgiler, bir şarkının nakaratı…</p><p>Hepsinde <b>tekrar eden bir düzen</b> var. Buna <b style="color:var(--lc)">desen</b> denir.</p><p>Deseni bulursan döngü kurmak çok kolay!</p>'),
    note: 'Sınıfta desen arayın: fayanslar, pencere, birinin kazağı.' }),
  L3.s({ tag: 'SORU 🤔', body: quiz({ q: 'Sırada ne var?', pic: '<div class="seq"><span>🍎</span><span>🍌</span><span>🍌</span><span>🍎</span><span>🍌</span><span>🍌</span><span>🍎</span><span>🍌</span><span class="q2">?</span></div>',
    opts: ['🍎', '🍌', '🍇'], a: 1, why: 'Desen: 🍎 🍌 🍌. Sırada <b>🍌</b> var.' }) }),
  L3.s({ tag: 'SORU 🤔', body: quiz({ q: 'Bu programda <b>tekrar eden parça</b> hangisi?', pic: chips('FFRFFRFFR'),
    opts: [chips('FF'), chips('RF'), chips('FFR')], a: 2, why: '⬆ ⬆ ↱ parçası 3 kez tekrar ediyor.' }) }),
  L3.s({ tag: 'İZLE 👀', title: 'Önce uzun yaz, sonra döngüye al',
    body: player({ map: ['S...', '~~~.', '~~~.', 'G...'], progs: [['📜 Uzun', 'FFFRFFFRFFFR'], ['🔁 Döngülü', '3(FFFR)']], lr: true,
      under: '<p class="f" style="margin-top:12px">⬆ ⬆ ⬆ ↱ parçası <b>3 kez</b> tekrar ediyor. Onu döngüye koyduk!</p>' }),
    note: 'Önce “Uzun” sekmesini oynatın. Tekrar eden parçayı tahtada daire içine alın. Sonra “Döngülü” sekmesi: aynı yol, çok daha kısa.' }),
  L3.s({ tag: 'YENİ KELİME', title: '“İç içe” ne demek?',
    body: `<div class="row" style="gap:70px"><div class="box bag f"><div style="display:flex;flex-direction:column;align-items:center;gap:6px">${BAG}Çanta</div><div class="box pen f"><div>Kalem kutusu</div><div class="pens f">✏️✏️✏️</div></div></div>
<p class="f col">Çantanın <b>içinde</b> kalem kutusu,<br>kalem kutusunun <b>içinde</b> kalemler var.<br><br>Bunlar <b>iç içe!</b></p></div>`,
    note: 'Bir öğrencinin çantasından kalem kutusunu, onun içinden kalemi çıkarın.' }),
  L3.s({ tag: 'İÇ İÇE DÖNGÜ', title: 'Döngünün içinde döngü',
    body: `<div class="row"><div class="col f" style="flex:0 0 620px">${code('3(2(A)M)')}</div><div class="col"><p class="f"><i class="sq b"></i> <b class="tbig">Büyük döngü</b> dışarıda.</p><p class="f"><i class="sq k"></i> <b class="tsmall">Küçük döngü</b> içeride.</p><p class="f">Küçük döngü, büyük döngünün kutusunun <b>içinde</b>. Tıpkı çantadaki kalem kutusu gibi!</p></div></div>`,
    note: 'Mor = büyük döngü, turuncu = küçük döngü. Renkleri hep aynı kullanıyoruz.' }),
  L3.game({ title: '👏 Ritim oyunu',
    body: beat('3(2(A)M)'),
    note: 'Yavaş modda oynatın, sınıf ekranla birlikte alkışlasın ve masaya vursun. <b>Turuncu boncuklar her turda sıfırlanıyor</b>: buna dikkat çekin.' }),
  L3.s({ tag: 'SORU 🤔', body: quiz({ q: 'Ritim oyununda <b>kaç kez alkış</b> yaptık? 👏', opts: ['3', '5', '6'], a: 2,
    why: 'Her turda <b>2</b> alkış, <b>3</b> tur: 👏👏 + 👏👏 + 👏👏 = <b>6</b>' }) }),
  L3.s({ tag: 'YENİ KOMUT', title: 'Yıldızı al ✋',
    body: botsay(`<p>Bu görevlerde yıldızlar <b>kendiliğinden toplanmaz</b>.</p><p>Yıldızın <b>tam üstündeyken</b> ${chip('P', 'Yıldızı al')} de.</p><p>Yıldız yoksa elim boş kalır. 🤷</p>`, 'wave') }),
  L3.s({ tag: 'ROBO\'NUN GÖREVİ', title: '🌱 Yıldız tarlası',
    body: `<div class="row"><div style="flex:0 0 auto">${grid(['S***', '.***', '.***', 'G...'], { size: 120 })}</div><div class="col"><p>Tarlada <b class="tbig">3 sıra</b>, her sırada <b class="tsmall">3 yıldız</b>. Robo her sırada:</p>
<p class="f">1️⃣ İleri gider, yıldızı <b>alır</b> ✋ <span class="soft">(3 kez)</span></p><p class="f">2️⃣ Sıranın başına <b>geri</b> gider ⬇ <span class="soft">(3 kez)</span></p><p class="f">3️⃣ Bir <b>alt sıraya</b> iner ↱ ⬆ ↰</p><p class="f">🔁 Sonra <b>aynısını</b> yeni sırada yapar!</p></div></div>` }),
  L3.game({ title: '🌱 Yıldız tarlası oyunu',
    body: `<div class="row"><div class="col"><ol><li class="f">Yere <b>3 sıra</b>, her sıraya <b>3 kâğıt</b> (yıldız) koyun.</li><li class="f">Bir öğrenci <b>Robo</b> olur: kâğıtları alır, geri geri döner, alt sıraya iner.</li><li class="f">Sınıf <b>sesli sayar</b>: 1, 2, 3!</li><li class="f">Robo yeni sıraya inince yıldızları <b>kaçtan</b> saydık?</li></ol></div></div>`,
    note: 'İki elinizle gösterin: <b>sol el</b> sıra sayacı (1-2-3), <b>sağ el</b> yıldız sayacı (1-2-3). Her yeni sırada sağ el yumruk olup <b>sıfırdan</b> başlar.' }),
  L3.s({ tag: 'İZLE 👀', title: 'Önce bir sıra',
    body: player({ map: ['S***', 'G...'], prog: '3(FP)3(B)RFL', stack: false, lr: true }),
    note: 'Önce yalnız bir sıra. Üç parçayı ayrı ayrı gösterin.' }),
  L3.s({ tag: 'İZLE 👀', title: 'Bütün tarla: iç içe döngü!',
    body: player({ map: ['S***', '.***', '.***', 'G...'], prog: '3(3(FP)3(B)RFL)', lr: true, sm: true, codeW: 560 }),
    note: 'Yavaş oynatın. “Başa dön: 2. tur” balonu çıkınca durdurun: <b>“Yıldız boncukları şimdi ne oldu?”</b> (Sıfırlandı, baştan başlıyor.)' }),
  L3.s({ tag: 'SORU 🤔', body: quiz({ q: 'Robo <b class="tbig">2. sıraya</b> indi. Yıldızları <b>kaçtan</b> saymaya başlar?', opts: ['1’den', '4’ten', '7’den'], a: 0,
    why: '<b>1’den!</b> Yeni sırada küçük döngü <b>baştan</b> başlar: 1, 2, 3.' }), note: 'İç içe döngünün en önemli noktası bu.' }),
  L3.s({ tag: 'ALTIN KURAL ⭐', title: 'İki elle sayalım ✋✋',
    body: `${hands(3, 3, 'sıra', 'yıldız')}<div class="rule"><i class="sq b"></i> <span class="tbig">Büyük döngü</span> 1 tur atar ➜ <i class="sq k"></i> <span class="tsmall">küçük döngü</span> baştan sona çalışır!</div>`,
    note: 'Çocuklar da elleriyle saysın: sol el sıra, sağ el yıldız. Sağ el her yeni sırada yumruk olur.' }),
  L3.s({ tag: 'SORU 🤔', body: quiz({ q: '<b class="tbig">3 sıra</b> var, her sırada <b class="tsmall">3 yıldız</b>. Robo toplam kaç yıldız alır?', opts: ['6', '9', '12'], a: 1,
    why: '3 + 3 + 3 = <b>9</b> yıldız ⭐' }), note: 'Sonra sorun: “4 sıra, her sırada 2 yıldız olsa?” (8)' }),
  L3.s({ tag: 'İZLE 👀', title: '🌊 Göl yolunda da var',
    body: player({ map: ['S...', '~~~.', '~~~.', 'G...'], progs: [['Önce', '3(FFFR)'], ['Küçük döngü ile', '3(3(F)R)']], lr: true,
      under: '<p class="f" style="margin-top:12px"><i class="sq b"></i> Büyük döngü <b>kenarları</b>, <i class="sq k"></i> küçük döngü <b>adımları</b> sayar.</p>' }) }),
  L3.hard({ title: 'Sağa dön nerede olmalı?',
    body: player({ map: ['S...', '~~~.', '~~~.', 'G...'], progs: bug('3(3(FR))', '3(3(F)R)'), lr: true,
      under: '<p class="f" style="margin-top:12px">↱ Sağa dön, küçük döngünün <b>dışında</b>, büyük döngünün <b>içinde</b> olmalı.</p>' }),
    note: 'Hatalıyı oynatın: Robo ilk adımdan sonra döner ve suya düşer. Blok kutunun içinde mi dışında mı, girintiye bakın.' }),
  L3.s({ tag: 'İZLE 👀', title: 'Her iki adımda bir yıldız',
    body: player({ map: ['S.*.*.*G'], prog: '3(2(F)P)F', stack: false, codeW: 460, under: '<p class="f" style="margin-top:12px">Desen: 2 kez ileri, yıldızı al. 3 kez!</p>' }) }),
  L3.pc(['🔍 Sırada ne var?', '❓ Tekrar eden parça', '📜 Önce uzun yaz', '🔁 Döngüye al', '❓ Kaç yıldız?', '🌱 Tarla: bir sıra', '❓ Tahmin et', '👀 Üç sıra', '🌱 Bütün tarla', '🔢 Sayıları değiştir', '🌊 Göl: küçük döngü', '❓ Kaç kez ileri?', '🐞 Robo yerinde dönüyor', '⭐ İki adımda bir', '⭐ Köşe yıldızları', '⭐ Büyük kare', '⭐ Kenar ortaları']),

  /* ---------------- 8. BÖLÜM: LABİRENT ---------------- */
  L4.cover('Seviye sonu! Bugün yeni bir şey yok: öğrendiklerimizi birleştiriyoruz.'),
  L4.s({ tag: 'SEVİYE SONU 🏰', title: 'Hepsini birleştir!',
    body: botsay('<p>Öğrendiğin her şeyi kullanma zamanı:</p><p>📋 sıralama · ↕️ ileri-geri · 🔄 dönüşler · 🔑 anahtar · 🔁 döngü</p><p>Her labirentte: önce <b>plan</b>, sonra <b>program</b>, çalışmazsa <b>bug avı</b>! 🐞</p>', 'dance') }),
  L4.s({ tag: 'PLAN 📝', title: 'Büyük işi parçalara böl',
    body: `<div class="row"><div style="flex:0 0 auto">${grid(['S..#k', '##.#.', 'G#...', '.#D##', '...##'], { size: 104 })}</div><div class="col"><p>Kale kapısı çok uzun bir yol. Parçalara bölelim:</p>
<p class="f">1️⃣ Anahtara git 🔑</p><p class="f">2️⃣ Geri gel ⬇</p><p class="f">3️⃣ Kapıdan geç 🚪</p><p class="f">4️⃣ Pile ulaş 🔋</p><p class="f soft">Her parçayı ayrı yaz, ayrı dene!</p></div></div>`,
    note: 'Parmakla yolu çizin. Her parça bitince “Burada çalışıyor mu?” diye deneyin. Büyük problem = küçük problemler.' }),
  L4.s({ tag: 'İZLE 👀', title: 'Isınma turu',
    body: player({ map: ['S.~..', '#.~.#', '#...G'], prog: 'FRFFL3(F)', lr: true, stack: false }) }),
  L4.s({ tag: 'İZLE 👀', title: 'Küçük anahtar',
    body: player({ map: ['S.k.DG'], prog: '5(F)', stack: false, codeW: 420, under: '<p class="f" style="margin-top:12px">Döngü anahtarın ve kapının üstünden de geçer!</p>' }) }),
  L4.s({ tag: 'SORU 🤔', body: quiz({ q: 'İki program da Robo\'yu pile götürüyor. Hangisi <b>daha kısa</b>?', v: true,
    opts: ['🔁 4 kez ⬆ · ↱ · 🔁 2 kez ⬆', chips('FFFFRFF')], a: 0, why: 'Döngülü program <b>3 blok</b>, uzun program 7 blok.' }) }),
  L4.hard({ title: 'Önce çalışsın, sonra kısalsın',
    body: `<div class="row"><div class="col"><p class="f">1️⃣ Önce <b>çalışan</b> bir program yaz. Uzun olsa da olur!</p><p class="f">2️⃣ Robo pile ulaştı mı? 🔋 ✅</p><p class="f">3️⃣ Sonra <b>tekrar eden parçaları</b> bul, döngüye al.</p><p class="f">⭐⭐⭐ Daha az blok = daha çok yıldız!</p></div><div style="flex:0 0 260px">${robo('think', 240)}</div></div>`,
    note: 'Çocuklar en kısa programı ilk seferde yazmaya çalışınca takılıyor. Önce çalışsın, sonra kısaltırız.' }),
  L4.s({ tag: 'İZLE 👀', title: 'Yıldız tarlası',
    body: player({ map: ['S*.*.', 'G*.*.'], prog: '2(FPF)RFR2(FPF)', stack: false, lr: true, cols: true }) }),
  L4.game({ title: '🏰 Labirent yarışması',
    body: `<div class="row"><div class="col"><ol><li class="f">İkişer kişilik gruplar olun.</li><li class="f">Kareli kâğıda labirent çizin: en az bir 🔑 ve bir 🚪.</li><li class="f">Labirentleri <b>değiştirin</b>.</li><li class="f">Arkadaşınızın labirentine oklarla program yazın.</li><li class="f">🏆 En <b>kısa</b> çalışan program kazanır!</li></ol></div><div style="flex:0 0 260px">${robo('dance', 240)}</div></div>` }),
  L4.pc(['🏁 Isınma turu', '🔑 Küçük anahtar', '🏰 Kale kapısı', '❓ Hangisi kısa?', '⭐ Tek sıra yıldız', '🌱 Yıldız tarlası', '⭐ Spiral', '⭐ Çifte kapı', '⭐ Usta işi']),

  weekEnd({ week: W, color: '#e0457b', next: 'Fonksiyonlar ve koşullar 🧩❓',
    items: ['Programdaki hataya <b>bug</b>, düzeltmeye <b>hata ayıklama</b> denir.', 'Hatayı bulmak için programı <b>çalıştırıp izleriz</b>.', '<b>Döngü</b> komutları tekrar ettirir, programı kısaltır.', 'Döngünün <b>içindeki</b> blok her turda, <b>dışındaki</b> 1 kez çalışır.', '<b>Büyük döngü</b> her tur attığında <b>küçük döngü</b> baştan çalışır.', 'Önce <b>çalışan</b> program, sonra <b>kısa</b> program!'] }),
];

export default { title: 'Hata Ayıklama ve Döngüler', slides };
