// 7. hafta: Oyun projeleri ve kendi projen (25–28. bölümler)
import { lesson, weekCover, weekEnd, quiz, botsay, robo, ders, scratch, blocks, step } from './yardim.mjs';

const D = await ders(7);
const W = 7;
const L1 = lesson({ week: W, idx: 1, no: 25, color: '#5b6ee1', icon: '🧀', title: 'Oyun 1: Labirent', desc: 'Adım adım kendi labirent oyununu yap: akıcı hareket, duvarlar, hedef!' });
const L2 = lesson({ week: W, idx: 2, no: 26, color: '#ff4d4d', icon: '🍎', title: 'Oyun 2: Elma Yakala', desc: 'Gökten elmalar yağıyor! Sepetle yakala, skor topla, canlarını koru.' });
const L3 = lesson({ week: W, idx: 3, no: 27, color: '#2c2a6b', icon: '🚀', title: 'Oyun 3: Uzay Kaçışı', desc: 'Roketini göktaşlarından kaçır! Ne kadar dayanırsan o kadar puan.' });
const L4 = lesson({ week: W, idx: 4, no: 28, color: '#d97706', icon: '🏆', title: 'Kendi Projen', desc: 'Öğrendiğin her şeyle kendi oyununu, hikâyeni ya da sanat eserini yap!' });
const sol = (L, t) => step(L, t).sol;
const card = (c, t, b) => `<div class="f" style="border:6px solid ${c}"><h3>${t}</h3>${b}</div>`;

const slides = [
  weekCover({ week: W, title: 'Oyun Projeleri', color: '#5b6ee1', lessons: [['🧀', 'Labirent'], ['🍎', 'Elma yakala'], ['🚀', 'Uzay kaçışı'], ['🏆', 'Kendi projen']],
    note: 'Bu hafta üç oyun yapıyoruz. Her oyun adım adım kurulur; sunumda adımların kodu sırayla büyür. Tuşlu oyunlarda ekrandaki ok düğmelerini basılı tutun.' }),

  /* ---------------- 25. BÖLÜM ---------------- */
  L1.cover('Sorun: “En sevdiğiniz oyun hangisi? O oyunda ne yapıyorsunuz?”'),
  L1.s({ tag: 'OYUN TASARIMI 🎮', title: 'Her oyunun dört parçası',
    body: `<div class="vs">${card('#2a86c4', '🐭 Oyuncu', '<p>Senin yönettiğin karakter</p>')}${card('#e9a100', '🧀 Hedef', '<p>Ulaşmak istediğin şey</p>')}${card('var(--no)', '🧱 Engeller', '<p>Seni zorlayan şeyler: duvar, hayalet 👻</p>')}${card('var(--ok)', '📜 Kurallar', '<p>Duvara değersen başa dön, peynire ulaşırsan kazan!</p>')}</div>`,
    note: 'Sevdikleri bir oyunu bu dört parçaya ayırın: Süper Mario\'da oyuncu kim, hedef ne, engeller neler?' }),
  L1.s({ tag: '1. ADIM', title: 'Fare sağa yürüsün', body: scratch(D.b25, '1. adım'), note: 'Sadece sağ ok için bir kural. → düğmesini basılı tutun.' }),
  L1.hard({ title: 'Tuş olayı mı, “eğer tuşa basılı mı?” mı?',
    body: scratch(D.b25, '1. adım', { variants: [['Tuş olayı (takılır)', { Fare: [[['flag'], ['goto', -200, -135]], [['key', 'right'], ['chx', 10]]] }], ['Sürekli + eğer (akıcı)', sol(D.b25, '1. adım')]] }),
    note: 'Tuş olayı ile kukla ilk basışta bir an takılır. “sürekli tekrarla + eğer tuşa basılı mı?” ile her an kontrol edilir: hareket akıcı olur. Oyunlarda bu yöntem kullanılır.' }),
  L1.s({ tag: '3. ADIM', title: 'Duvarlar: değersen başa dön', body: scratch(D.b25, '3. adım', { sm: true }), note: 'Döngünün içine bir “eğer” daha: duvara dokunuyorsa boing ve başa dön.' }),
  L1.s({ tag: '4. ADIM', title: 'Peynir = kazandın! 🏆', body: scratch(D.b25, '4. adım', { sm: true }), note: 'Son kural: peynire dokununca kazan ve tümünü durdur. Bir öğrenci tahtada oynasın!' }),
  L1.game({ title: '🕹️ Oyun test ekibi',
    body: `<div class="row"><div class="col"><p class="f">Oyununu bitirince yanındakiyle <b>yer değiştir</b>.</p><p class="f">Arkadaşının oyununu oyna ve yaz:</p><p class="f">😍 Bir şey <b>güzel</b> · 😅 Bir şey <b>zor</b> · 💡 “Şöyle olsa <b>daha iyi</b>”</p><p class="f">Gerçek oyun şirketlerinde de <b>test ekipleri</b> var!</p></div><div style="flex:0 0 260px">${robo('dance', 240)}</div></div>` }),
  L1.pc(['🐭 1. adım: Sağa yürüt', '⬆⬇⬅ 2. adım: Üç yön', '🧱 3. adım: Duvarlar', '🧀 4. adım: Peynir', '🏆 Oyunun hazır', '⭐ Süre tut', '⭐ Hayalet düşman']),

  /* ---------------- 26. BÖLÜM ---------------- */
  L2.cover('Dün labirent yaptık. Bugün gökten elma yağıyor!'),
  L2.s({ tag: 'YENİ OYUN', title: 'Elma yağmuru 🍎',
    body: botsay('<p>Gökten elmalar düşüyor! Sepeti fareyle sağa sola götür, elmaları yakala.</p><p class="f">🧺 Sepet fareyi takip eder.</p><p class="f">🎲 Elma rastgele bir yerden düşer.</p><p class="f">⭐ Yakalarsan <b>skor</b> artar, kaçırırsan <b>can</b> azalır ❤️</p>', 'wave') }),
  L2.s({ tag: '1. ADIM', title: 'Sepet fareyi takip etsin', body: scratch(D.b26, '1. adım'), note: '“x\'i (fare x) yap”: sepet farenin x\'ine gider, y\'si hep aynı kalır. Fareyi sahnede gezdirin.' }),
  L2.s({ tag: '2. ADIM', title: 'Elma düşsün', body: scratch(D.b26, '2. adım', { show: 'Elma', sm: true }), note: 'Elma her adımda biraz aşağı iner (y −4). Yere gelince (y < −170) yine tepeye döner.' }),
  L2.s({ tag: '4. ADIM', title: 'Skor ve üç can ❤️', body: scratch(D.b26, '4. adım', { show: 'Elma', sm: true }), note: 'Yakalayınca skor +1, yere düşünce can −1. Can 0 olunca oyun biter. Değişkenler sol üstte.' }),
  L2.s({ tag: 'SORU 🤔', body: quiz({ q: 'Elma yere düşünce <b>bir can</b> eksilsin. Hangi blok?', v: true, opts: ['can değişkenini -1 değiştir', 'can değişkenini 0 yap', 'can değişkenini 3 yap'], a: 0, why: '<b>−1 değiştir</b>: kutudan bir tane almak.' }) }),
  L2.game({ title: '⚖️ Zorluk ayarı',
    body: `<div class="row"><div class="col"><p class="f">Bir oyun <b>çok kolay</b> olursa ne olur? 😴</p><p class="f">Bir oyun <b>çok zor</b> olursa ne olur? 😤</p><p class="f">Sınıfça elmanın <b>hızını</b> seçin: −2 mi, −4 mü, −8 mi?</p><p class="f">Farklı hızları deneyen grupları karşılaştırın!</p></div><div style="flex:0 0 260px">${robo('think', 240)}</div></div>` }),
  L2.pc(['🧺 1. adım: Sepet', '🍎 2. adım: Elma düşsün', '🎲 3. adım: Rastgele ve skor', '❤️ 4. adım: Üç can', '🛠️ Oyunu geliştir', '⭐ Hızlanan elmalar', '⭐ Kazanma ekranı']),

  /* ---------------- 27. BÖLÜM ---------------- */
  L3.cover('Üçüncü oyun: uzayda bir roket ve göktaşları!'),
  L3.s({ tag: 'YENİ OYUN', title: 'Uzayda tehlike! ☄️',
    body: botsay('<p>Roketin uzayda ama karşıdan <b>göktaşları</b> geliyor!</p><p class="f">⬆⬇ Ok tuşlarıyla kaç.</p><p class="f">☄️ Göktaşı sağdan sola uçar, sonra yine sağdan çıkar.</p><p class="f">💥 Çarparsan oyun biter. Dayandığın her saniye <b>1 puan</b>!</p>', 'think') }),
  L3.s({ tag: '1. ADIM', title: 'Roket kontrolü', body: scratch(D.b27, '1. adım'), note: '↑ ↓ düğmelerini basılı tutun.' }),
  L3.s({ tag: '3. ADIM', title: 'Göktaşı rastgele yükseklikten', body: scratch(D.b27, '3. adım', { show: 'Göktaşı', sm: true }), note: 'Göktaşı sol kenara gelince yeniden sağdan, rastgele bir yükseklikten çıkar.' }),
  L3.s({ tag: '5. ADIM', title: 'Çarpışma ve puan', body: scratch(D.b27, '5. adım', { sm: true }), note: 'Roketin iki betiği var: biri kontrol ve çarpışma, biri her saniye puan. Bir öğrenci oynasın!' }),
  L3.hard({ title: 'Kodu yeniden kullan: ikinci göktaşı',
    body: scratch(D.b27, '⭐ Bonus: İkinci göktaşı', { show: 'Göktaşı2', sm: true }),
    note: 'İkinci göktaşının kodu birincinin aynısı, sadece hızı farklı. Gerçek Scratch\'te bir betiği başka kuklanın üstüne sürükleyerek kopyalayabilirsiniz. Programcılar kodu yeniden kullanır!' }),
  L3.s({ tag: 'FARK ETTİN Mİ? 🔍', title: 'Üç oyunda aynı fikirler',
    body: `<div class="row"><div class="col"><p class="f">⚡ <b>Olaylar</b>: 🏁, tuşlar</p><p class="f">♾️ <b>Sürekli tekrarla</b>: oyun döngüsü</p><p class="f">❓ <b>Eğer</b>: oyun kuralları</p><p class="f">🗃️ <b>Değişken</b>: skor, can</p><p class="f">🎲 <b>Rastgele</b>: her oyun farklı</p></div><div style="flex:0 0 280px">${robo('dance', 260)}</div></div>`,
    note: 'Artık bir oyun yapımcısısınız! Bu beş fikirle sayısız oyun yapılabilir.' }),
  L3.pc(['🚀 1. adım: Roket', '☄️ 2. adım: Göktaşı', '🎲 3. adım: Rastgele', '💥 4. adım: Çarpışma', '⭐ 5. adım: Puan', '⭐ İkinci göktaşı']),

  /* ---------------- 28. BÖLÜM ---------------- */
  L4.cover('Bugün herkes kendi projesini yapıyor! Önce fikir ve plan.'),
  L4.s({ tag: 'SIRA SENDE 💡', title: 'Ne yapmak istersin?',
    body: `<div class="vs">${card('#2a86c4', '🎮 Oyun', '<p>Yakala, kaç, labirent…</p>')}${card('#c2185b', '📖 Hikâye', '<p>Konuşan karakterler</p>')}${card('#0fbd8c', '🎨 Sanat', '<p>Kalemle desenler</p>')}${card('#cf63cf', '🎵 Müzik', '<p>Şarkı ve dans</p>')}</div><p class="f" style="margin-top:26px">Kâğıda 3 şey yaz: <b>Kukla kim? Ne olacak? Nasıl bitecek?</b></p>` }),
  L4.s({ tag: 'HATIRLA 🧠', body: quiz({ q: 'Bir kukla oyun boyunca <b>hiç durmadan</b> hareket etsin. Hangi blok?', opts: ['10 kez tekrarla', 'bekle', 'sürekli tekrarla'], a: 2, why: '<b>Sürekli tekrarla</b> ⏹ basılana kadar durmaz.' }) }),
  L4.s({ tag: 'HATIRLA 🧠', body: quiz({ q: '“Karakter yıldıza değerse puan kazansın.” Hangi blok gerekir?', v: true, opts: ['eğer yıldıza dokunuyor mu? ise', 'rastgele konuma git', 'kalemi bastır'], a: 0, why: 'Bir kural = <b>eğer</b> + algılama.' }) }),
  L4.s({ tag: 'HATIRLA 🧠', body: quiz({ q: 'Oyundaki <b>puanı</b> saklamak için ne kullanırız?', opts: ['👕 Kostüm', '🗃️ Değişken', '🌄 Dekor'], a: 1, why: 'Puan bir <b>değişkende</b> saklanır.' }) }),
  L4.s({ tag: 'BAŞLANGIÇ 👀', title: 'Fikrin yoksa: kedi fareyi takip etsin', body: scratch(D.b28, 'Hazır başlangıç'), note: 'Fikri olmayan öğrenciler buradan başlar; sonra elma, skor ve can ekleyebilirler.' }),
  L4.game({ title: '🎪 Proje fuarı',
    body: `<div class="row"><div class="col"><p class="f">Herkes projesini <b>açık bırakır</b>.</p><p class="f">Sınıfta <b>dolaşıp</b> arkadaşlarının projelerini dene.</p><p class="f">Yapışkan nota bir <b>övgü</b> yaz ve bilgisayarın yanına yapıştır. 📝</p></div><div style="flex:0 0 260px">${robo('dance', 240)}</div></div>` }),
  L4.s({ tag: 'GERÇEK SCRATCH 🐱', title: 'Aynı bloklar, gerçek Scratch\'te!',
    body: botsay('<p>Burada öğrendiğin bloklar <b>gerçek Scratch</b>\'te birebir aynı!</p><p class="f">🌐 Tarayıcıda <b>scratch.mit.edu</b> adresine git, “Oluştur”a tıkla.</p><p class="f">💾 Projelerini kaydetmek için <b>ailen ya da öğretmeninle</b> hesap aç.</p><p class="f">📴 İnternetsiz çalışmak için “Scratch Uygulaması” da var.</p>', 'wave'),
    note: 'Hesap açmak için aile izni gerekir. Okulda hesap açmadan da “Oluştur” ile denenebilir (kaydedilmez).' }),
  L4.pc(['❓ Hatırla: döngü', '❓ Hatırla: koşul', '❓ Hatırla: değişken', '🐱 Hazır başlangıç', '🏆 Bitirme projen', '🐱 Gerçek Scratch\'e geçiş']),

  weekEnd({ week: W, color: '#5b6ee1', next: 'Scratch ustalığı: soru, matematik, klonlar 👾',
    items: ['Her oyunun <b>oyuncusu, hedefi, engelleri ve kuralları</b> vardır.', 'Oyun <b>adım adım</b> yapılır; her adım denenir.', 'Oyun kuralları <b>sürekli tekrarla + eğer</b> ile yazılır.', '<b>Skor ve can</b> değişkenleri oyunun durumunu tutar.', '<b>Rastgele</b> konumlar oyunu her seferinde farklı yapar.', 'Kodu <b>yeniden kullanmak</b> işi kolaylaştırır.'] }),
];

export default { title: 'Oyun Projeleri', slides };
