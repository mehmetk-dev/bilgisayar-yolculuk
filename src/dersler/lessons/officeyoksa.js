// Ek ders (10. hafta): evde Microsoft Office yoksa ücretsiz seçenekler. Tarayıcıda Word/Excel/PowerPoint (office.com),
// Google Dokümanlar, LibreOffice; dosya uzantıları ve uyumu; “ücretsiz Office” vaat eden sahte sitelere ve crack'e karşı uyarı.
// Bilgi adımları ve karar soruları (rehberSoru); etkileşimli benzetim yoktur.
import { desktopReady } from './common.js';
import { rehberSoru } from './kalip.js';

export const officeYoksa = {
  id: 'office-yoksa', icon: '🆓', title: 'Evde Office yoksa: ücretsiz seçenekler', minutes: 20, stage: 'desktop',
  desc: 'Evdeki bilgisayarda Word ve Excel yoksa ne yapılır: tarayıcıda Word, Google Dokümanlar, LibreOffice; dosya uzantıları; sahte “ücretsiz Office” sitelerine dikkat.',
  summary: [
    ['Tarayıcıda Word/Excel', 'office.com adresi + ücretsiz Microsoft hesabı (Outlook ya da Hotmail adresi); dosyalar OneDrive\'a kaydolur; internet gerekir'],
    ['Google Dokümanlar', 'docs.google.com + Gmail hesabı; Dokümanlar, E-Tablolar, Slaytlar; dosyalar Google Drive\'a kaydolur'],
    ['LibreOffice', 'Bilgisayara kurulan ücretsiz program: Writer (Word), Calc (Excel), Impress (PowerPoint); yalnızca libreoffice.org\'dan indirin; Pardus\'ta hazır gelir'],
    ['Uzantılar', '.docx Word, .xlsx Excel, .pptx PowerPoint; .odt ve .ods LibreOffice\'in kendi biçimi'],
    ['Başkasına gönderirken', '.docx ya da PDF tercih edin'],
    ['İşlev adları', 'Türkçe Excel\'de TOPLA, ORTALAMA, EĞER; İngilizcesi SUM, AVERAGE, IF; programın dil ayarına göre İngilizce ad gerekebilir'],
    ['Asla', '“Ücretsiz Office”, “crack”, “etkinleştirici” indirmeyin: virüs ve şifre hırsızlığı riski'],
  ],
  steps: [
    {
      title: 'Evde Office yok',
      html: `<p>Kursta <b>Word</b> ve <b>Excel</b> öğreniyorsunuz. Eve gelince bilgisayarda ya <b>hiç Office yok</b> ya da açınca “<b>Ürün etkinleştirilemedi</b>” uyarısı çıkıyor.</p>
        <p>Üzülmeyin. Aynı işi yapan <b>ücretsiz</b> yollar var. Bu derste üç tanesini göreceğiz. Ayrıca <b>korsan program indirmenin</b> neden tehlikeli olduğunu öğreneceğiz.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'Üç ücretsiz seçenek',
      html: `<table class="sum"><tr><th></th><th>Nerede çalışır?</th><th>Ne gerekir?</th><th>Dosya nereye kaydolur?</th></tr>
        <tr><th>Tarayıcıda Word, Excel</th><td>Tarayıcıda (office.com)</td><td>Ücretsiz Microsoft hesabı, internet</td><td>OneDrive</td></tr>
        <tr><th>Google Dokümanlar</th><td>Tarayıcıda (docs.google.com)</td><td>Gmail hesabı, internet</td><td>Google Drive</td></tr>
        <tr><th>LibreOffice</th><td>Bilgisayara kurulur</td><td>Bir kez indirip kurmak</td><td>Bilgisayarınıza</td></tr></table>
        <p>Önce tarayıcıdakileri, sonra LibreOffice'i göreceğiz.</p>`,
    },
    {
      title: 'Tarayıcıda Word ve Excel',
      html: `<p><b>Microsoft</b>, Word, Excel ve PowerPoint'in <b>tarayıcıda çalışan ücretsiz</b> sürümünü sunar.</p>
        <ul>
          <li>Adres çubuğuna <b>office.com</b> yazın (ya da <b>microsoft365.com</b>).</li>
          <li>Ücretsiz bir <b>Microsoft hesabıyla</b> girin. Outlook ya da Hotmail adresiniz varsa o hesaptır.</li>
          <li>Yazdıklarınız <b>OneDrive</b>'a kaydolur.</li>
        </ul>
        <p>Kursta gördüğünüz Word ve Excel'e çok benzer. <b>Ama:</b> internet olmadan çalışmaz ve bazı ileri özellikleri yoktur.</p>`,
    },
    {
      title: 'Google Dokümanlar',
      html: `<p><b>Google</b> da aynı işleri ücretsiz yapar. <b>Gmail</b> hesabınızla <b>docs.google.com</b> adresine girersiniz.</p>
        <ul>
          <li><b>Dokümanlar</b> Word'ün, <b>E-Tablolar</b> Excel'in, <b>Slaytlar</b> PowerPoint'in karşılığıdır.</li>
          <li>Dosyalarınız <b>Google Drive</b>'a kaydolur.</li>
          <li>Torununuzun gönderdiği <b>Word dosyasını açabilirsiniz</b>.</li>
          <li>Bitince <b>Dosya → İndir</b> deyip dosyayı <b>Word</b> ya da <b>PDF</b> olarak bilgisayarınıza alabilirsiniz.</li>
        </ul>
        <p class="mut">Bu iki yol da internet ister. İnternetin olmadığı yerde çalışacaksanız LibreOffice daha uygundur.</p>`,
    },
    {
      title: 'LibreOffice',
      html: `<p><b>LibreOffice</b>, bilgisayarınıza <b>kurulan</b> ücretsiz bir programdır. İnternet olmadan da çalışır. Üç ana parçası var:</p>
        <table class="sum"><tr><th>Writer</th><td>Word'ün karşılığı</td></tr><tr><th>Calc</th><td>Excel'in karşılığı</td></tr><tr><th>Impress</th><td>PowerPoint'in karşılığı</td></tr></table>
        <p><b>.docx</b> ve <b>.xlsx</b> dosyalarını açar, aynı biçimde kaydedebilir. Çok süslü ya da karmaşık belgelerde biçim <b>biraz kayabilir</b>.</p>
        <p><b>Önemli:</b> yalnızca resmî sitesinden, <b>libreoffice.org</b> adresinden indirin. <b>Pardus</b> yüklü bilgisayarlarda (ör. birçok okulda) LibreOffice <b>hazır gelir</b>; kurmanız gerekmez.</p>`,
    },
    {
      title: 'Dosya uzantıları ve uyum',
      html: `<p>Dosya adının sonundaki <b>uzantı</b>, dosyanın hangi programa ait olduğunu söyler:</p>
        <table class="sum"><tr><th>.docx</th><td>Word belgesi</td></tr><tr><th>.xlsx</th><td>Excel tablosu</td></tr><tr><th>.pptx</th><td>PowerPoint sunusu</td></tr><tr><th>.odt, .ods</th><td>LibreOffice'in kendi biçimi (yazı, tablo)</td></tr></table>
        <p>Dosyayı başkasına gönderecekseniz <b>.docx</b> ya da <b>PDF</b> olarak kaydedin. Böylece karşı taraf nerede açarsa açsın okur.</p>
        <p><b>Excel ipucu:</b> işlev adları dile göre değişir. Türkçe Excel'de <b>TOPLA</b>, <b>ORTALAMA</b>, <b>EĞER</b>; İngilizcede <b>SUM</b>, <b>AVERAGE</b>, <b>IF</b>. LibreOffice ve Google E-Tablolar Türkçe adları çoğu zaman kabul eder; dil ayarına göre <b>İngilizce ad gerekebilir</b>.</p>`,
    },
    {
      title: 'Dikkat: crack ve sahte siteler',
      html: `<p>İnternette “<b>Office ücretsiz, hemen indir</b>”, “<b>crack</b>”, “<b>etkinleştirici</b>” diyen siteler çıkabilir. <b>İndirmeyin.</b></p>
        <ul>
          <li>Bu programlar çoğu zaman <b>virüs</b> taşır.</li>
          <li>Kurulunca <b>şifrelerinizi çalabilirler</b> (e-posta, banka).</li>
          <li>Ayrıca korsan yazılım kullanmak yasa dışıdır.</li>
        </ul>
        <p>Zaten ihtiyacınız olan her şey <b>yasal ve ücretsiz</b> yukarıdaki üç yoldadır. Program indirecekseniz yalnızca <b>resmî siteden</b> indirin.</p>`,
    },
    rehberSoru({
      title: 'Torunun dosyası',
      html: '<p>Torununuz size <b>mektup.docx</b> gönderdi. Eve geldiniz, bilgisayarınızda Office yok. Ne yaparsınız?</p>',
      opts: ['Arama motorunda “Word crack” aratıp bulduğum ilk programı kurarım', 'Gmail hesabımla Google Dokümanlar\'a girer ya da LibreOffice Writer ile açarım', 'Dosyayı silerim, açılamaz'], ok: 1,
      wrong: 'Birinci seçenek virüs riski taşır, üçüncüsü gereksiz. Ücretsiz ve güvenli bir yol düşünün.',
      why: 'Doğru. .docx dosyasını Google Dokümanlar da LibreOffice Writer da açar. Bitirince .docx ya da PDF olarak kaydedip geri gönderebilirsiniz.',
    }),
    rehberSoru({
      title: 'Hemen indir!',
      html: '<p>Bir sitede kocaman yazıyor: “<b>Office tamamen ücretsiz! Hemen indir!</b>” Siteyi tanımıyorsunuz. Ne yaparsınız?</p>',
      opts: ['İndirir ve hemen kurarım, belki doğrudur', 'İndirmem; ücretsiz ve yasal yolları kullanırım', 'Banka kartı bilgilerimi yazıp üye olurum'], ok: 1,
      wrong: 'Tanımadığınız “ücretsiz” sitelerden program indirmek ve oraya bilgi yazmak risklidir.',
      why: 'Doğru. Tanımadık sitelerden program indirmeyin, kart ya da şifre bilgisi yazmayın. Tarayıcıda office.com ya da Google Dokümanlar\'ı kullanın; program gerekirse yalnızca libreoffice.org\'dan indirin.',
    }),
    rehberSoru({
      title: 'Pardus bilgisayar',
      html: '<p>Kursta <b>Pardus</b> kurulu bir bilgisayardasınız. Elinizde <b>hesap.xlsx</b> adlı bir Excel dosyası var. Nasıl açarsınız?</p>',
      opts: ['Açamam, Pardus\'ta Excel yok', 'Önce Excel kurmam gerekir', 'LibreOffice Calc ile açarım; Pardus\'ta hazır gelir'], ok: 2,
      wrong: 'Pardus\'ta Office paketi için ayrı bir şey kurmanız gerekmez. Hangi program hazır geliyordu?',
      why: 'Doğru. LibreOffice Calc, .xlsx dosyalarını açar ve kaydedebilir. Karmaşık tablolarda biçim biraz kayabilir; gönderirken .xlsx ya da PDF kullanın.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Evde Office olmasa da çalışabilirsiniz:</p>' },
  ],
};
