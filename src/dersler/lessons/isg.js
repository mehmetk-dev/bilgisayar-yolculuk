// 4. hafta: bilgisayar başında sağlık ve güvenlik. MEB Bilgisayar İşletmeni programının “İş Sağlığı ve Güvenliği” ünitesine göre:
// ekranın yüksekliği ve uzaklığı, oturuş, mola, ekran ayarları, elektrik ve kablolar, statik elektrik, yangın ve acil durum.
import { info, ayir, sec } from './kalip.js';

export const isg = {
  id: 'isg', icon: '🦺', title: 'Sağlıklı ve güvenli çalışma', minutes: 20, stage: 'scene',
  desc: 'Doğru oturuş, mola, ekran parlaklığı, kablolar ve priz güvenliği.',
  summary: [
    ['Ekran', 'Bir kol boyu (50–70 cm) uzakta; üst kenarı göz hizasında ya da biraz altında'],
    ['Oturuş', 'Sırt dik ve desteklenmiş, ayaklar yerde, dirsekler 90 derece, bilekler düz'],
    ['Mola', 'Her saat 5–10 dakika kalkın; 20 dakikada bir 20 saniye uzağa bakın'],
    ['Ekran ayarı', 'Parlaklık odaya uygun; yazılar zorlanmadan okunacak büyüklükte'],
    ['Kablolar', 'Yürüme yolunda olmasın; prizi aşırı yüklemeyin'],
    ['Kasa açmadan önce', 'Kapatın, fişi çekin, metal bir yere dokunup statik elektriği boşaltın'],
    ['Elektrik yangını', 'Su dökülmez! Fişi çekin, karbondioksitli ya da kuru kimyevi tozlu söndürücü'],
  ],
  steps: [
    {
      title: 'Neden önemli?',
      html: `<p>Bilgisayar başında uzun süre yanlış oturmak; boyun, sırt, bilek ağrılarına ve göz yorgunluğuna yol açar. Kablolar ve elektrik de dikkat ister.</p>
        <p>Bu derste birkaç basit kuralı sorularla öğreneceğiz.</p>`,
      scene: info('<div class="sc-big">🪑🖥👀</div><p>Sağlıklı ve güvenli çalışma</p>'),
    },
    sec({
      title: 'Ekranın uzaklığı', text: '<div class="qz-pic">🧑‍💻 ↔ 🖥</div>',
      q: 'Ekran gözlerinizden ne kadar uzakta olmalı?',
      opts: ['Burnumun dibinde, 20 cm', 'Yaklaşık bir kol boyu, 50–70 cm', 'Odanın öbür ucunda, 3 metre'], ok: 1,
      why: 'Kolunuzu uzattığınızda parmak uçlarınız ekrana yaklaşık değmeli. Çok yakın ekran gözü yorar.',
    }),
    sec({
      title: 'Ekranın yüksekliği', text: '<div class="qz-pic">👀 ➜ 🖥</div>',
      q: 'Ekranın yüksekliği nasıl olmalı?',
      opts: ['Üst kenarı göz hizasında ya da biraz altında', 'Başımı yukarı kaldırıp bakacağım kadar yüksekte', 'Masanın üstünde yatık, aşağı eğilerek bakacağım kadar alçakta'], ok: 0,
      why: 'Böylece boynunuz düz durur. Dizüstü bilgisayarlarda ekran genelde alçaktadır; altına bir yükseltici ya da kitap koymak işe yarar.',
    }),
    ayir({
      title: 'Doğru mu, yanlış mı?',
      html: '<p>Bilgisayar başındaki bu davranışları ayırın.</p>',
      bins: [{ id: 'iyi', label: 'Doğru', icon: '✅' }, { id: 'kotu', label: 'Yanlış', icon: '❌' }],
      items: [
        { label: 'Sırtımı sandalyeye yaslarım', icon: '🪑', bin: 'iyi', why: 'Sırt desteklenince bel yorulmaz.' },
        { label: 'Ayaklarım yere basar', icon: '🦶', bin: 'iyi', why: 'Yetişmiyorsa ayak altına bir destek konur.' },
        { label: 'Bileklerim düz durur', icon: '✋', bin: 'iyi', why: 'Bükük bilek zamanla ağrı yapar.' },
        { label: 'Her saat birkaç dakika kalkarım', icon: '🚶', bin: 'iyi', why: 'Mola kaslar ve gözler için gereklidir.' },
        { label: '3 saat hiç kalkmadan çalışırım', icon: '⏰', bin: 'kotu', why: 'Uzun süre aynı duruş boyun ve sırt ağrısı yapar.' },
        { label: 'Ekrana yaklaşıp kamburlaşırım', icon: '🐢', bin: 'kotu', why: 'Yazı küçükse yaklaşmak yerine yazıyı büyütün (Ctrl + +).' },
        { label: 'Klavyenin yanında çay içerim', icon: '☕', bin: 'kotu', why: 'Dökülen sıvı klavyeyi ve bilgisayarı bozabilir.' },
        { label: 'Karanlık odada parlak ekrana bakarım', icon: '🌑', bin: 'kotu', why: 'Oda aydınlık olmalı; ekran parlaklığı ortama uygun ayarlanır.' },
      ],
      done: 'Doğru duruş ve mola, uzun yıllar rahat çalışmanın anahtarıdır.',
    }),
    sec({
      title: 'Göz yorgunluğu', text: '<div class="qz-pic">👀 ⏱ 20</div>',
      q: 'Gözleriniz yoruldu, kurudu. Ne yaparsınız?',
      opts: ['Gözlerimi ovuştururum, devam ederim', '20 dakikada bir, 20 saniye uzaktaki bir şeye bakarım; sık sık göz kırparım', 'Ekranın parlaklığını en yükseğe çıkarırım'], ok: 1,
      why: 'Buna 20-20-20 kuralı denir. Ekrana bakarken daha az göz kırparız; bilerek göz kırpmak gözü nemlendirir.',
    }),
    sec({
      title: 'Kablolar', text: '<div class="qz-pic">🔌〰️🚶</div>',
      q: 'Bilgisayarın kabloları yürüme yolunun ortasından geçiyor. Ne yapmalı?',
      opts: ['Önemli değil, dikkat ederim', 'Kabloları kenardan, masanın arkasından geçiririm; gerekiyorsa kablo kanalı kullanırım', 'Üzerine halı sererim'], ok: 1,
      why: 'Kabloya takılan biri hem düşer hem de bilgisayarı devirebilir. Halının altındaki kablo ezilip ısınabilir.',
    }),
    sec({
      title: 'Kasayı açmadan önce', text: '<div class="qz-pic">🖥 🔧 ⚡</div>',
      q: 'RAM takmak için kasayı açacaksınız. Önce ne yaparsınız?',
      opts: ['Bilgisayar açıkken hemen açarım', 'Kapatırım, fişini çekerim, kasanın metal bir yerine dokunup üzerimdeki statik elektriği boşaltırım', 'Islak bezle içini silerim'], ok: 1,
      why: 'Vücudumuzda biriken statik elektrik, gözle görülmeyen bir kıvılcımla parçaları bozabilir. Fiş takılıyken kasayı açmak tehlikelidir.',
    }),
    sec({
      title: 'Prizden duman', text: '<div class="qz-pic">🔌💨🔥</div>',
      q: 'Bilgisayarın prizinden duman ve küçük bir alev çıkıyor. Ne yaparsınız?',
      opts: ['Hemen üzerine su dökerim', 'Güvenliyse sigortayı kapatır ya da fişi çekerim; karbondioksitli ya da kuru kimyevi tozlu yangın söndürücü kullanırım; büyürse 112\'yi ararım', 'Bilgisayarı kaydedip kapatmaya çalışırım'], ok: 1,
      why: 'Elektrik yangınına <b>asla su dökülmez</b>: elektrik çarpar. Önce elektriği kesin. Söndürülemiyorsa ortamı terk edip 112\'yi arayın.',
    }),
    sec({
      title: 'Acil durum', text: '<div class="qz-pic">🚨🏃🚪</div>',
      q: 'Kurstayken yangın alarmı çaldı. Ne yaparsınız?',
      opts: ['Çalışmamı kaydetmeden çıkmam', 'Eşyalarla uğraşmadan, sakin şekilde en yakın acil çıkıştan çıkıp toplanma alanına giderim; asansör kullanmam', 'Asansörle hızlıca inerim'], ok: 1,
      why: 'Dosya yeniden yazılır, can geri gelmez. Acil çıkış ve toplanma alanının yerini her ortamda önceden öğrenin.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Sağlıklı ve güvenli çalışmanın kuralları:</p>', scene: info('<div class="sc-big">🦺✅</div>') },
  ],
};
