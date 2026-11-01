// 1. hafta: Algoritma ve yönler (1–4. bölümler)
import { lesson, weekCover, weekEnd, player, quiz, botsay, order, turnToy, grid, code, chips, chip, robo } from './yardim.mjs';

const W = 1;
const L1 = lesson({ week: W, idx: 1, no: 1, color: '#ff8a3d', icon: '📋', title: 'Algoritma Nedir?', desc: 'Robo ile tanış, günlük hayattaki algoritmaları sırala ve ilk komutunu ver.' });
const L2 = lesson({ week: W, idx: 2, no: 2, color: '#2fbf71', icon: '↕️', title: 'İleri ve Geri', desc: 'Robo hem ileri hem geri gidebilir. Hangisini ne zaman kullanacağız?' });
const L3 = lesson({ week: W, idx: 3, no: 3, color: '#2f8cff', icon: '🔄', title: 'Sağa ve Sola Dön', desc: 'Robo yerinde dönmeyi öğreniyor. Ağaçların ve gölün etrafından dolaşalım.' });
const L4 = lesson({ week: W, idx: 4, no: 4, color: '#0ea5a4', icon: '🗝️', title: 'Önce Plan Yap', desc: 'Anahtarı bul, kilitli kapıyı aç, pile ulaş! Önce plan, sonra program.' });

const slides = [
  weekCover({ week: W, title: 'Algoritma ve Yönler', color: '#ff8a3d', lessons: [['📋', 'Algoritma'], ['↕️', 'İleri ve geri'], ['🔄', 'Dönüşler'], ['🗝️', 'Plan yap']],
    note: 'Bu hafta Robo ile tanışıyoruz. <b>M</b> tuşu ders menüsünü açar, <b>N</b> bu notları gösterir, <b>F</b> tam ekran yapar. Oynatıcılarda <b>P</b> oynatır.' }),

  /* ---------------- 1. DERS: ALGORİTMA ---------------- */
  L1.cover('Sınıfa sorun: <b>“Robotlar kendi kendine düşünebilir mi?”</b> Birkaç cevap alıp devam edin.'),
  L1.s({ tag: 'TANIŞALIM', title: 'Merhaba, ben Robo! 👋',
    body: botsay('<p>Ben çok çalışkan bir robotum ama <b>kendi kendime düşünemem</b>.</p><p>Ne yapacağımı bana <b>adım adım</b> söylemen gerekiyor.</p><p>Hedefim hep <b>pil</b> 🔋, çünkü şarjım bitmek üzere!</p>'),
    note: 'Robo bir karakter: çocuklar onunla konuşur gibi anlatsın. “Robo\'ya ne söylersek onu yapar, fazlasını yapmaz.”' }),
  L1.s({ tag: 'YENİ KELİME', title: '📋 Algoritma',
    body: `<div class="card" style="font-size:46px;font-weight:800;line-height:1.35;border:6px solid var(--lc)">Bir işi yapmak için <span class="hl">sırayla</span> izlenen adımlara <b style="color:var(--lc)">ALGORİTMA</b> denir.</div>
<p class="f" style="margin-top:40px">Sen de her gün algoritma kullanıyorsun:</p>
<div class="emos f"><span>🦷</span><span>🥪</span><span>👟</span><span>🌱</span></div>
<p class="f soft" style="text-align:center;margin-top:16px">diş fırçalamak · sandviç yapmak · ayakkabı giymek · fidan dikmek</p>`,
    note: 'Kelimeyi sınıfa birlikte, hece hece söyletin: al-go-rit-ma. Sonra “Sabah okula gelmeden önce hangi adımları yaptınız?” diye sorun.' }),
  L1.game({ title: '🤖 Robot oyunu',
    body: `<div class="row" style="align-items:flex-start"><div class="col"><ol>
<li class="f">Bir öğrenci <b>robot</b> olur, gözlerini kapatır.</li>
<li class="f">Sınıf ona sadece <b>“bir adım ileri”</b> komutu verir.</li>
<li class="f">Robotu <b>kapıya</b> götürün!</li>
<li class="f">Kaç komut gerekti? <b>Bir adım fazla</b> deseydik ne olurdu?</li></ol></div>
<div style="flex:0 0 280px">${robo('dance', 260)}</div></div>`,
    note: '5 dakikalık bilgisayarsız oyun. Robot rolündeki çocuk yalnızca söyleneni yapsın; kendi aklıyla yürümesin. Sonunda “Robo da böyle: ne dersek onu yapar.”' }),
  L1.s({ tag: 'SIRALA 🧩', title: 'Diş fırçalama algoritması',
    body: order([['🦷', 'Diş fırçasını al'], ['🧴', 'Fırçaya macun sür'], ['😁', 'Dişlerini fırçala'], ['💧', 'Ağzını çalkala'], ['🧼', 'Fırçayı yıka, yerine koy']]),
    note: 'Çocuklara sorun: “İlk ne yapılır?” Söyledikleri kartı tıklayın. Yanlış kart sallanır, doğru kart sağdaki listeye geçer.' }),
  L1.hard({ title: 'Sıra karışırsa ne olur? 😵',
    body: `<div class="vs"><div class="bad f"><h3>❌ Sıra yanlış</h3><p>1. 👟 Ayakkabını giy</p><p>2. 🧦 Çorabını giy</p><p style="font-size:60px;text-align:center;margin:0">😵</p><p>Çorap ayakkabının üstüne mi giyilecek?</p></div>
<div class="good f"><h3>✅ Sıra doğru</h3><p>1. 🧦 Çorabını giy</p><p>2. 👟 Ayakkabını giy</p><p style="font-size:60px;text-align:center;margin:0">😄</p><p>İşte böyle!</p></div></div>
<p class="f" style="margin-top:26px;text-align:center">Adımlar aynı, <b>sırası</b> farklı. Algoritmada <span class="hl">sıra çok önemli!</span></p>`,
    note: 'Bu yaşta en sık hata: “adımları biliyorum, sıra fark etmez” sanmak. Abartılı canlandırın: çorabı ayakkabının üstüne giyiyormuş gibi yapın.' }),
  L1.s({ tag: 'SIRALA 🧩', title: 'Fidan dikme algoritması 🌱',
    body: order([['⛏️', 'Toprağı kaz, çukur aç'], ['🌱', 'Fidanı çukura koy'], ['🤲', 'Üstünü toprakla ört'], ['💦', 'Fidanı sula']]),
    note: 'Bir öğrenci tahtaya gelip kartları sırayla tıklasın. “Sulamayı en başa koysak ne olurdu?”' }),
  L1.s({ tag: 'SORU 🤔', body: quiz({ q: 'Hangisi bir <b>algoritmadır</b>?', v: true,
    opts: ['🎂 Kek tarifi: önce un, sonra yumurta, sonra fırın', '🍎 Kırmızı, parlak bir elma', '😊 Çok güzel bir gün'], a: 0,
    why: 'Kek tarifi <b>sıralı adımlardan</b> oluşur. Elma ve güzel bir gün adım değildir.' }),
    note: 'Çocuklar parmakla A, B ya da C göstersin. Sonra doğru şıkka tıklayın (klavyede 1-2-3 de olur).' }),
  L1.s({ tag: 'YENİ KELİMELER', title: 'Komut ve program',
    body: `<div class="row"><div class="col">
<p class="f"><b style="color:var(--lc)">Komut:</b> Robo\'ya verilen <b>tek bir emir</b>. ${chip('F', 'İleri git')}</p>
<p class="f"><b style="color:var(--lc)">Program:</b> Komutları <b>arka arkaya dizince</b> program olur.</p>
<p class="f">Robo programı <b>yukarıdan aşağıya</b>, sırayla yapar. ⬇</p></div>
<div class="f" style="flex:0 0 420px">${code('FFF', { w: 400 })}<p class="soft" style="font-size:28px;margin-top:12px">3 komuttan oluşan bir program</p></div></div>`,
    note: 'Komut = tek emir, program = komutların sırası. “İleri git” komutu Robo\'yu baktığı yöne <b>bir kare</b> götürür.' }),
  L1.s({ tag: 'İZLE 👀', title: 'İlk program: pile git!',
    body: player({ map: ['S...G'], prog: 'FFFF', codeW: 420, under: '<p class="f" style="margin-top:30px">Robo ile pil arasında kaç kare var? <b>Sayalım!</b> 1, 2, 3, 4</p>' }),
    note: 'Önce kareleri parmakla sayın. Sonra <b>▶ Oynat</b>. Robo her komutta bir kare ilerler. Yanan blok, Robo\'nun şu an yaptığı komuttur.' }),
  L1.hard({ title: 'Kareleri tek tek say! 🔢',
    body: player({ map: ['S...G'], prog: 'FFF', codeW: 420, under: '<p class="f" style="margin-top:30px">Bu programda <b>3</b> komut var. Pile kaç kare var?</p><p class="f">Önce tahmin et, sonra <b>oynat</b>!</p>' }),
    note: 'Önce sorun: “Robo nerede durur?” Sonra oynatın: pile bir kare kala durur. Çocuklar çoğu zaman saymadan blok ekler; <b>parmakla saymayı</b> alışkanlık yapın.' }),
  L1.s({ tag: 'İZLE 👀', title: '“İleri” = Robo\'nun baktığı yön',
    body: player({ map: ['G', '.', '*', '.', 'S'], dir: 'N', prog: 'FFFF', codeW: 420, gap: 80,
      side: '<p class="f" style="margin-top:30px">Robo bu sefer <b>yukarı</b> bakıyor. Kırmızı ok 🔺 baktığı yeri gösterir.</p><p class="f">İleri git, Robo\'yu <b>yukarı</b> götürür. Yıldızı da toplar ⭐</p>' }),
    note: 'İleri her zaman ekranın sağı değildir; Robo nereye bakıyorsa oradır. Kırmızı oku gösterin.' }),
  L1.pc(['🧩 Diş fırçalama', '🧩 Fidan dikme', '❓ Hangisi algoritma?', '🧩 Sandviç', '🔋 İlk programın', '⬆ Yukarı doğru', '❓ Robo nerede durur?', '🛤️ Uzun yol', '⭐ Aşağı in']),

  /* ---------------- 2. DERS: İLERİ VE GERİ ---------------- */
  L2.cover('Hatırlatma sorusu: “Algoritma neydi?” (Sırayla izlenen adımlar.)'),
  L2.s({ tag: 'YENİ KOMUT', title: 'Geri vites! 🚗',
    body: botsay(`<p>Yeni bir komut öğrendim: ${chip('B', 'Geri git')}</p><p>Geri giderken <b>yüzüm aynı yöne bakar</b>, sadece geri geri yürürüm.</p><p>Tıpkı park eden bir arabanın geri vitesi gibi! 🚗</p>`),
    note: 'Bir öğrenciyi kaldırın: yüzü sınıfa dönük, iki adım geri yürüsün. “Arkasını döndü mü? Hayır!”' }),
  L2.s({ tag: 'İZLE 👀', title: 'Pil arkamda!',
    body: player({ map: ['G..S.'], prog: 'BBB', codeW: 420, under: '<p class="f" style="margin-top:30px">Robo <b>sağa</b> bakıyor ama pil <b>arkasında</b>.</p><p class="f">Dönmeden, geri geri gidiyor!</p>' }),
    note: 'Oynatırken kırmızı oka dikkat çekin: Robo geri giderken ok hâlâ sağı gösteriyor.' }),
  L2.hard({ title: 'Geri git = arkanı dönmek DEĞİL!',
    body: quiz({ q: 'Robo <b>sağa</b> bakıyor ve <b>⬇ Geri git</b> komutunu alıyor. Ne olur?', v: true, pic: grid(['..S..'], { size: 100 }),
      opts: ['Bir kare sağa gider', 'Bir kare sola gider, yüzü hâlâ sağa bakar', 'Arkasını döner ve sola bakar'], a: 1,
      why: 'Geri git, Robo\'yu <b>dönmeden</b> bir kare arkaya götürür.' }),
    note: 'Çocuklar “geri” deyince “arkasını döner” sanıyor. C şıkkını seçen çok olursa öğrenciyle canlandırın.' }),
  L2.game({ title: '↕️ İleri–geri oyunu',
    body: `<div class="row"><div class="col"><ol>
<li class="f">Herkes sırasının yanında <b>ayağa kalksın</b>.</li>
<li class="f">Öğretmen söyler: <b>“ileri, ileri, geri”</b></li>
<li class="f">Herkes aynı anda yapar.</li>
<li class="f">Sonunda herkes <b>aynı yerde</b> mi?</li></ol>
<p class="f soft">Sonra bir öğrenci öğretmen olsun!</p></div><div style="flex:0 0 300px" class="emos"><span>🧍</span><span>⬆</span><span>⬇</span></div></div>`,
    note: 'Dizileri yavaş söyleyin, sonra uzatın: “ileri, geri, geri, ileri, ileri”. Başladığı yerden kaç adım ileride?' }),
  L2.s({ tag: 'SORU 🤔', body: quiz({ q: 'Robo <b>2 kare ileri</b>, sonra <b>3 kare geri</b> gidiyor. Başladığı yere göre nerede?', v: true,
    pic: grid(['...S...'], { size: 86 }),
    opts: ['Başladığı yerde', 'Başladığı yerin bir sağında', 'Başladığı yerin bir solunda'], a: 2,
    why: '2 ileri, 3 geri: geri gidiş 1 fazla. Robo başladığı yerin <b>bir solunda</b>.' }),
    note: 'Tahtada parmakla gösterin: iki kare sağa, üç kare sola. İsterseniz bir öğrenci yürüyerek göstersin.' }),
  L2.s({ tag: 'İZLE 👀', title: 'Önce yıldız, sonra pil',
    body: player({ map: ['G...S.*'], prog: 'FFBBBBBB', codeW: 420, under: '<p class="f" style="margin-top:30px">Yıldız ⭐ <b>önde</b>, pil 🔋 <b>arkada</b>.</p><p class="f">Önce ileri gidip yıldızı al, sonra geri geri pile!</p>' }),
    note: 'Önce plan: “Yıldız hangi tarafta? Pil hangi tarafta? Kaç kare?” Sonra oynatın.' }),
  L2.s({ tag: 'SORU 🤔', body: quiz({ q: 'Bir bilmece: Robo <b>3 kez İleri git</b>, sonra <b>3 kez Geri git</b> yapıyor. Nerede durur?',
    opts: ['Başladığı yerde', '3 kare ileride', '6 kare ileride'], a: 0,
    why: '3 ileri ve 3 geri birbirini götürür: Robo <b>başladığı yere</b> döner.' }) }),
  L2.s({ tag: 'BİLGİ 💡', title: 'Birden çok yol olabilir!',
    body: `${grid(['*.S.*.G'], { size: 100 })}
<div class="vs" style="margin-top:30px"><div class="f" style="border:6px solid #c9d3e3"><h3>1. yol</h3>${chips('BBFFFFFF')}<p style="margin-top:12px">8 blok</p></div>
<div class="f" style="border:6px solid #c9d3e3"><h3>2. yol</h3>${chips('FFBBBBFFFFFF')}<p style="margin-top:12px">12 blok</p></div></div>
<p class="f" style="margin-top:22px">İkisi de çalışır! Ama <b>kısa olan</b> daha iyi. 👍</p>`,
    note: 'Bir problemin birden fazla çözümü olabilir. Hangisi daha kısa? Önce soldaki yıldızı almak yolu kısaltıyor.' }),
  L2.s({ tag: 'İZLE 👀', title: 'Önce sola, sonra sağa',
    body: player({ map: ['*.S.*.G'], prog: 'BBFFFFFF', codeW: 420 }),
    note: 'Kısa yolu oynatın. Robo önce geri geri soldaki yıldıza, sonra ileri ileri öbür yıldıza ve pile gider.' }),
  L2.pc(['❓ Düşün bakalım', '🔋 Pil arkamda!', '⭐ Önce yıldız, sonra pil', '❓ Nereye vardı?', '↕️ Yukarı, sonra aşağı', '↔️ Önce sola, sonra sağa', '❓ Bir bilmece', '⭐ İki yanda yıldız', '⭐ İki yanda su!', '⭐ Yıldız yağmuru']),

  /* ---------------- 3. DERS: DÖNÜŞLER ---------------- */
  L3.cover('Hatırlatma: “Geri git deyince Robo arkasını döner mi?” (Hayır!) Bugün gerçekten dönmeyi öğreniyoruz.'),
  L3.s({ tag: 'YENİ KOMUTLAR', title: 'Dönmeyi öğrendim!',
    body: botsay(`<p>İki yeni komutum var: ${chip('L', 'Sola dön')} ${chip('R', 'Sağa dön')}</p><p>Dönünce <b>ilerlemem</b>, sadece <b>yüzüm döner</b>.</p><p>Kırmızı ok 🔺 baktığım yeri gösterir.</p>`, 'think'),
    note: 'Dönüş komutu Robo\'yu yerinden oynatmaz. Bunu vurgulayın: “Döndü ama hâlâ aynı karede!”' }),
  L3.s({ tag: 'DENE 🕹️', title: 'Robo\'yu döndür',
    body: `<div class="row"><div style="flex:0 0 auto">${turnToy()}</div><div class="col"><p class="f"><span style="background:#2a86c4;color:#fff;border-radius:99px;padding:2px 14px">sol</span> ve <span style="background:#8a5cff;color:#fff;border-radius:99px;padding:2px 14px">sağ</span> etiketleri Robo ile birlikte döner.</p><p class="f">Robo yukarı bakınca sağı, <b>ekranın sağı</b>.</p><p class="f">Robo aşağı bakınca sağı, <b>ekranın solu</b>! 😮</p></div></div>`,
    note: 'Düğmelere tek tek basın. Her dönüşten önce sorun: “Şimdi nereye bakacak?” Sonra sağ-sol etiketlerinin nereye gittiğini gösterin.' }),
  L3.hard({ title: 'Sağ ve sol, Robo\'ya göre!',
    body: `<div class="row"><div class="col"><p>Robo bize <b>doğru</b> (aşağı) bakıyorsa onun sağı <b>bizim solumuz</b> olur.</p>
<p class="f">🙋 <b>Dene:</b> Arkanı dön, tahtaya sırtın gelsin. Sağ kolunu kaldır.</p><p class="f">Kolun tahtanın hangi tarafını gösteriyor?</p>
<p class="f">💡 <b>İpucu:</b> Kendini Robo\'nun yerine koy!</p></div><div style="flex:0 0 auto">${grid(['.', 'S', '.'], { dir: 'S', size: 150, lr: true })}</div></div>`,
    note: '<b>Arkanı dön oyunu (1 dk):</b> Öğrenciler ayağa kalkıp sınıfın arkasına dönsün, sağ kollarını kaldırsın. Kol tahtanın hangi tarafını gösteriyor? En çok zorlanılan yer burası; acele etmeyin.' }),
  L3.s({ tag: 'SORU 🤔', body: quiz({ q: 'Robo <b>yukarı</b> bakıyor. <b>↱ Sağa dön</b> dersek nereye bakar?', pic: grid(['S'], { dir: 'N', size: 220, lr: true }),
    opts: ['⬅️ Sola', '➡️ Sağa', '⬇️ Aşağı'], a: 1, why: 'Robo yukarı bakarken onun sağı, ekranın sağıdır.' }) }),
  L3.s({ tag: 'İZLE 👀', title: 'Köşeyi dön',
    body: player({ map: ['S..', '##.', '##G'], prog: 'FFRFF', lr: true, codeW: 420, under: '<p class="f" style="margin-top:24px">Köşeye gelince <b>↱ sağa dön</b>, sonra yine ilerle.</p>' }),
    note: 'Köşede Robo durur, döner, sonra aşağı ilerler. Dönüşte Robo\'nun yerinden kıpırdamadığını gösterin.' }),
  L3.hard({ title: 'Arkanı dön = İKİ kez dön! ↩',
    body: player({ map: ['G.*S'], prog: 'RRFFF', lr: true, codeW: 420,
      under: '<p class="f" style="margin-top:24px">Bir kez dönersen sadece <b>yana</b> bakarsın.</p><p class="f">Arkana bakmak için <b>iki kez</b> dön: ↱ ↱ ya da ↰ ↰</p>' }),
    note: 'Çocuklar art arda iki dönüşü çoğu zaman unutuyor. Oynatırken ilk dönüşten sonra durdurun (⏸): “Şimdi arkasına mı bakıyor? Hayır, aşağı!”' }),
  L3.s({ tag: 'SORU 🤔', body: quiz({ q: 'Robo <b>sağa</b> bakıyor. Arka arkaya <b>iki kez ↰ Sola dön</b> dersek nereye bakar?', pic: grid(['S'], { dir: 'E', size: 220, lr: true }),
    opts: ['⬆️ Yukarı', '➡️ Yine sağa', '⬅️ Sola (tam ters yöne)'], a: 2, why: 'İki çeyrek dönüş = yarım tur. Robo <b>tam ters</b> yöne bakar.' }) }),
  L3.game({ title: '🗺️ Sınıf haritası',
    body: `<div class="row"><div class="col"><ol>
<li class="f">Yere bantla <b>4×4 kare</b> çizin.</li>
<li class="f">Bir öğrenci <b>robot</b> olur.</li>
<li class="f">Diğeri kâğıda oklarla program yazar: ⬆ ↰ ↱</li>
<li class="f">Robot programı <b>sırayla</b> uygular.</li></ol>
<p class="f">🤔 “Sağa dön” derken <b>robotun sağı</b> mı, <b>bizim sağımız</b> mı?</p></div></div>`,
    note: 'Bant yoksa sıraların arası da olur. Tartışmanın sonunda: “Her zaman robotun sağı!”' }),
  L3.hard({ title: 'Düz gidersen suya düşersin! 💦',
    body: player({ map: ['S.~~', '#.*#', '##.G'], prog: 'FFF', lr: true, codeW: 420, under: '<p class="f" style="margin-top:24px">Bu program yanlış. Oynat, ne oluyor?</p>' }),
    note: 'Yanlış programı bilerek gösteriyoruz: Robo suya düşer. “Nerede dönmesi gerekiyordu?” diye sorun, sonra bir sonraki slayttaki doğru programa geçin.' }),
  L3.s({ tag: 'İZLE 👀', title: 'Merdiven: doğrusu',
    body: player({ map: ['S.~~', '#.*#', '##.G'], prog: 'FRFLFRFLF', lr: true, codeW: 420, under: '<p class="f" style="margin-top:24px">Sağa, sola, sağa, sola… <b>zikzak!</b></p>' }),
    note: 'Her dönüşte durdurup sorabilirsiniz: “Şimdi neden sağa döndü?”' }),
  L3.s({ tag: 'SORU 🤯', body: quiz({ q: 'Zor soru! Robo <b>aşağı</b> bakıyor. <b>↱ Sağa dön</b> dersek ekranda nereye bakar?', pic: grid(['S'], { dir: 'S', size: 220, lr: true }),
    opts: ['⬅️ Ekranın soluna', '➡️ Ekranın sağına', '⬆️ Yukarı'], a: 0, why: 'Aşağı bakan Robo\'nun sağ eli <b>ekranın solundadır</b>. Mor “sağ” etiketine bak!' }),
    note: 'Cevaptan önce arkanı dön oyununu hatırlatın. Sonra 🕹️ slaytına dönüp deneyebilirsiniz.' }),
  L3.s({ tag: 'İZLE 👀', title: 'Gölün etrafından 🌊',
    body: player({ map: ['..*..', '.~~~.', 'S~~~G'], dir: 'N', prog: 'FFRFFFFRFF', lr: true, codeW: 420, under: '<p class="f" style="margin-top:24px">Robo yüzme bilmez! Gölün <b>etrafından</b> dolaşır.</p>' }),
    note: 'Uzun yolları parçalara bölün: “önce yukarı, sonra sağa, sonra aşağı.”' }),
  L3.pc(['❓ Robo nereye bakar?', '❓ Bir kez sola', '❓ İki kez dönersek?', '↱ Köşeyi dön', '⬆ Yukarı tırman', '↩ Geri dön', '📶 Merdiven', '🌊 Gölün etrafından', '❓ Zor soru', '↪ Yarım U', 'U dönüşü', '⭐ Çıkmaz sokak', '⭐ Akıllı kısayol', '⭐ Büyük yolculuk']),

  /* ---------------- 4. DERS: PLAN ---------------- */
  L4.cover('Sorun: “Uzun bir yolculuğa çıkmadan önce ne yaparsınız?” (Haritaya bakarız, plan yaparız.)'),
  L4.s({ tag: 'PLAN 📝', title: 'Programcılar önce plan yapar',
    body: `<div class="row"><div class="col"><p>Kod yazmadan önce <b>3 soru</b> sor:</p>
<p class="f">1️⃣ <b>Hedef</b> nerede? 🔋</p><p class="f">2️⃣ Yolda <b>neler</b> var? 🌳 💦 🚪</p><p class="f">3️⃣ Hangi <b>sırayla</b> gideceğim?</p></div>
<div style="flex:0 0 auto">${grid(['S.#..', '.~~#.', '...#G', '.#...'], { size: 100 })}</div></div>`,
    note: 'Planı önce parmakla yolu çizerek yapın. Sonra komutlara çevirin. Plan yapmadan blok dizmek en sık hata.' }),
  L4.s({ tag: 'KAFANDA ÇALIŞTIR 🧠', body: quiz({ q: 'Robo bu programın sonunda <b>nerede</b> olur?', pic: `<div style="display:flex;gap:30px;align-items:center">${grid(['S..', '...', '...'], { size: 140 })}${code('FFRF', { w: 300 })}</div>`, v: true,
    opts: ['Sağ üst köşede', 'Sağ kenarın ortasında', 'Sağ alt köşede'], a: 1,
    why: '2 kare ileri → sağ üst köşe. Sağa dön → aşağı bakar. 1 kare ileri → <b>sağ kenarın ortası</b>.' }),
    note: 'Programı satır satır, parmakla tahtada takip edin. Buna “programı kafada çalıştırmak” diyoruz.' }),
  L4.s({ tag: 'KONTROL EDELİM 👀', title: 'Tahminin doğru mu?',
    body: player({ map: ['S..', '..G', '...'], prog: 'FFRF', codeW: 420, under: '<p class="f" style="margin-top:24px">Pili tam tahmin ettiğimiz yere koyduk!</p>' }) }),
  L4.s({ tag: 'YENİ', title: 'Anahtar ve kapı 🔑🚪',
    body: botsay('<p>Bazı yerlerde <b>kilitli kapılar</b> 🚪 var.</p><p>Kapıdan geçmek için önce <b>anahtarı</b> 🔑 almalıyım. Üstünden geçmem yeterli!</p><p>Anahtarı almadan kapıya gidersem <b>çarparım</b>. 💥</p>', 'think'),
    note: 'Bu bir “ön koşul”: bazı işler başka bir işten sonra yapılabilir. Günlük hayattan: “Kapıyı açmak için önce anahtar.”' }),
  L4.s({ tag: 'İZLE 👀', title: 'İlk anahtar',
    body: player({ map: ['SkD.G'], prog: 'FFFF', codeW: 420, under: '<p class="f" style="margin-top:24px">Anahtarı alınca kapı açılır!</p>' }) }),
  L4.hard({ title: 'Anahtar arkada kalırsa? 🔒',
    body: player({ map: ['k.S.DG'], prog: 'FFF', codeW: 420, under: '<p class="f" style="margin-top:24px">Robo hemen kapıya koşarsa ne olur? <b>Oynat!</b></p>' }),
    note: 'Robo kapıya çarpar. “Önce nereye gitmeliydi?” Cevap: geri geri anahtara.' }),
  L4.s({ tag: 'İZLE 👀', title: 'Önce anahtar, sonra kapı',
    body: player({ map: ['k.S.DG'], prog: 'BBFFFFF', codeW: 420, under: '<p class="f" style="margin-top:24px">2 kez <b>geri</b>, anahtarı al. Sonra ileri ileri, kapıdan geç!</p>' }) }),
  L4.s({ tag: 'İZLE 👀', title: 'Gizli anahtar',
    body: player({ map: ['~~~~~', 'S.D.G', '~.~~~', '~k~~~'], prog: 'FRFFBBLFFF', lr: true, codeW: 420, under: '<p class="f" style="margin-top:20px">Anahtar aşağıdaki çıkmaz sokakta. İn, al, <b>geri geri</b> çık!</p>' }),
    note: 'Geri git burada işi kolaylaştırıyor: aşağı inip anahtarı alan Robo arkasını dönmeden geri çıkar.' }),
  L4.game({ title: '✏️ Kâğıt plan',
    body: `<div class="row"><div class="col"><ol>
<li class="f">Kareli kâğıda <b>5×5</b> harita çiz.</li>
<li class="f">Bir 🔑 anahtar, bir 🚪 kapı, bir 🔋 pil koy.</li>
<li class="f">Yolu <b>kalemle</b> çiz.</li>
<li class="f">Programı oklarla yaz: ⬆ ⬇ ↰ ↱</li>
<li class="f">Arkadaşın programını <b>kafasında</b> çalıştırsın!</li></ol></div><div style="flex:0 0 260px">${robo('think', 240)}</div></div>`,
    note: 'Ders sonuna doğru 10 dk. Çocuklar haritalarını değiştirip birbirine çözdürsün.' }),
  L4.pc(['❓ Kafanda çalıştır', '❓ Hangi program doğru?', '🔑 İlk anahtar', '🔑 Anahtar arkamda', '❓ Ne olur?', '↩ Al, geri gel', '🗝️ Gizli anahtar', '⭐ Labirentte anahtar', '⭐ Hazine avı']),

  weekEnd({ week: W, color: '#ff8a3d', next: 'Hata ayıklama ve döngüler 🔁',
    items: ['<b>Algoritma</b>, bir işi yapmak için sırayla izlenen adımlardır.', 'Komutları sıraya dizince <b>program</b> olur.', '<b>İleri git</b> baktığı yöne, <b>Geri git</b> dönmeden arkaya gider.', 'Dönünce Robo ilerlemez. <b>Sağ ve sol Robo\'ya göredir.</b>', 'Arkaya dönmek için <b>iki kez</b> dönülür.', 'Önce <b>plan</b> yaparız: anahtar 🔑 kapıdan 🚪 önce!'] }),
];

export default { title: 'Algoritma ve Yönler', slides };
