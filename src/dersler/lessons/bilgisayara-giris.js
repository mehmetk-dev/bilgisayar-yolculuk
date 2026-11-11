import { info, rehberSoru } from './kalip.js';

export const bilgisayaraGiris = {
  id: 'bilgisayara-giris', icon: '💻', title: 'Bilgisayar ne işimize yarar?', minutes: 6, stage: 'scene',
  desc: 'Evde, kursta ve günlük hayatta bilgisayarla neler yapabileceğinizi keşfedin.',
  summary: [
    ['Evde', 'Alışveriş listenizi yazıp sonra güncelleyebilirsiniz.'],
    ['Okulda veya kursta', 'Ders notlarını açıp tekrar okuyabilirsiniz.'],
    ['Günlük işlerde', 'Haritadan gideceğiniz yere yol tarifi alabilirsiniz.'],
  ],
  steps: [
    {
      title: 'Günlük hayatta bilgisayar',
      html: `<p>Bilgisayarla yazı yazabilir, yaptığınız işi sonra açmak için kaydedebilir ve internette bilgi bulabilirsiniz.</p>
        <p>Yandaki üç örneğe bakın. Sizin işinize en çok hangisi yarar? Bir an düşünün.</p>`,
      scene: info(`<p><b>Evde</b><br>Alışveriş listesi hazırlayın.</p>
        <p><b>Okulda veya kursta</b><br>Ders notlarını açıp okuyun.</p>
        <p><b>Günlük işlerde</b><br>Haritadan yol tarifi alın.</p>`),
    },
    {
      title: 'Aynı iş eskiden ve bugün',
      html: `<p>Bir kurs duyurusu hazırladığınızı düşünün. Duyuruda yazan ders saati değişti.</p>
        <p>İki yolu karşılaştırın. Saat değişince duyuruyu düzeltmek ve paylaşmak için neler yaparsınız?</p>`,
      scene: info(`<p><b>Eskiden</b><br>Duyuruyu kâğıda yazıp çoğaltırdık. Saat değişince duyuruyu düzeltip yeni kopyalar dağıtırdık.</p>
        <p><b>Bugün bilgisayarla</b><br>Duyuruyu yazıp kaydedebiliriz. Saat değişince aynı dosyayı açar, saati değiştirip yeni hâlini paylaşırız.</p>`),
    },
    {
      ...rehberSoru({
        title: 'Kısa bir soru',
        html: '<p>Bilgisayara kaydettiğiniz duyurunun saati değişti. Ne yaparsınız?</p>',
        opts: ['Duyuruyu boş bir sayfaya baştan yazarım.', 'Duyuru dosyasını açıp saati değiştiririm.', 'Duyuruyu eski saatiyle tekrar paylaşırım.'],
        ok: 1,
        wrong: 'Kaydettiğiniz duyuruyu düşünün. Yalnızca saati nasıl değiştirebilirsiniz?',
        why: 'Kaydettiğiniz duyuruyu yeniden açıp yalnızca değişen kısmı düzeltebilirsiniz.',
      }),
      scene: info('<p>Kurs duyurusunda değişen tek bilgi <b>ders saati</b>.</p>'),
    },
    {
      final: true,
      title: 'Giriş dersini tamamladınız',
      html: '<p>Bilgisayar, yaptığınız işi saklamanıza ve gerektiğinde güncellemenize yardımcı olur.</p>',
      scene: info(`<p>Bilgisayarların zamanla nasıl değiştiğini görmek için 3B sayfanın altındaki dönemlere tıklayın.</p>
        <a class="btn" href="bilgisayar.html" target="_blank" rel="noopener">3B zaman çizgisini aç (yeni sekme)</a>`),
    },
  ],
};
