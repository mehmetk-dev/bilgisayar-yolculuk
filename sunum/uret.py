#!/usr/bin/env python3
"""1.–14. hafta, ek ders ve donanım slaytlarını üretir: sunum/hafta1.html ... sunum/hafta14.html, sunum/ek-guvenlik.html
Kullanım: python3 sunum/uret.py && node sunum/pdf.mjs   (PDF'ler sunum/ klasörüne yazılır)"""
import os

D = os.path.dirname(os.path.abspath(__file__))
IMG = 'img2/'


# ---------------------------------------------------------------- yardımcılar
def ul(items, cls=''):
    return f'<ul class="{cls}">' + ''.join(f'<li>{i}</li>' for i in items) + '</ul>'


def table(rows, cls='', head=None):
    h = ''
    if head:
        h = '<thead><tr>' + ''.join(f'<th>{c}</th>' for c in head) + '</tr></thead>'
    body = ''.join('<tr><th>' + r[0] + '</th>' + ''.join(f'<td>{c}</td>' for c in r[1:]) + '</tr>' for r in rows)
    return f'<table class="{cls}">{h}{body}</table>'


def note(t):
    return f'<p class="note">{t}</p>'


def fig(img, cap='', style=''):
    c = f'<figcaption>{cap}</figcaption>' if cap else ''
    src = img if '/' in img else IMG + img
    return f'<figure class="fig" style="{style}"><img src="{src}">{c}</figure>'


def split(left, right, a=0.85, b=1.15):
    return (f'<div class="cols"><div class="col" style="flex:{a}">{left}</div>'
            f'<div class="col" style="flex:{b}">{right}</div></div>')


def two(img1, cap1, img2, cap2):
    return f'<div class="twoimg">{fig(img1, cap1)}{fig(img2, cap2)}</div>'


def slide(kick, title, body):
    return f'<section class="slide"><p class="kick">{kick}</p><h1>{title}</h1>{body}</section>\n'


def cover(title, sub, meta=''):
    return (f'<section class="slide cover"><div class="bar"></div><h1>Bilgisayar İşletmenliği</h1>'
            f'<p class="sub">{title}</p><p class="sub" style="font-size:22px;margin-top:10px">{sub}</p>'
            f'<div class="meta">{meta}</div></section>\n')


def page(foot, title, slides, css=''):
    return (f'<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>{title}</title>'
            f'<link rel="stylesheet" href="stil.css"><style>body{{--foot:"Bilgisayar İşletmenliği  ·  {foot}";}}{css}</style></head>'
            f'<body>{"".join(slides)}</body></html>')


def write(name, foot, title, slides, css=''):
    with open(os.path.join(D, name + '.html'), 'w', encoding='utf-8') as f:
        f.write(page(foot, title, slides, css))
    print(name, len(slides), 'slayt')


K = lambda *k: ' + '.join(f'<kbd>{x}</kbd>' for x in k)


def adim(items, cls=''):
    """Numaralı adımlar: 1, 2, 3… (ilk sütun dar kalır)."""
    return table([[f'<span class="num">{i}</span>', t] for i, t in enumerate(items, 1)], cls)


def hafta_sonu(odev, soru):
    """Ders planının altına: haftanın ödevi ve testi (ayrı slayt yapılmaz)."""
    t = f'<b>{soru} soruluk test</b>' if isinstance(soru, int) else soru
    return f'<p class="mut" style="margin-top:16px;font-size:19px">Hafta sonunda: <b>ödev</b> (gerçek bilgisayarda {odev}) ve {t}.</p>'


def odev_test(odev, soru):
    t = f'{soru} soru' if isinstance(soru, int) else soru
    return note(f'<b>Ödev:</b> kendi bilgisayarınızda {odev}; ödev kâğıdı yazdırılabilir. <b>Test:</b> {t}, tekrar içindir.')


def ozet(rows, odev=None, soru=None):
    """Haftanın özet tablosu; uzun listeler iki sütuna bölünür. Sonda ödev ve test notu."""
    if len(rows) <= 8:
        body = table(rows, 'kv' if len(rows) <= 7 else 'kv tight')
    else:
        h = (len(rows) + 1) // 2
        body = split(table(rows[:h], 'kv tight'), table(rows[h:], 'kv tight'), 1, 1)
    return body + (odev_test(odev, soru) if odev else '')


def plan(rows, odev, soru):
    """Haftanın ders listesi. rows: (ders adı, dakika). Çok dersli haftalarda iki sütun."""
    rows = [(f'<span class="num">{i}</span>&nbsp; {a}', f'{d} dk' if d else '3B') for i, (a, d) in enumerate(rows, 1)]
    cls = 'tight' if len(rows) > 14 else ''
    if len(rows) <= 7:
        body = table(rows, cls)
    else:
        h = (len(rows) + 1) // 2
        body = split(table(rows[:h], cls), table(rows[h:], cls), 1, 1)
    return body + hafta_sonu(odev, soru)


# ================================================================ HAFTA 1
# (ilk sürüm elle yazılmıştı; burada aynı slaytlar ve sonradan eklenen dersler)
S = []
S.append(cover('1. Hafta: Açma-kapama, fare ve pencereler', 'Alıştırmalar ve oyunlar', 'Alıştırma bilgisayarında uygulamalı ders'))
S.append(slide('Bu hafta', 'Yedi ders', table([
    ['<span class="num">1</span>&nbsp; Açma ve kapatma', '15 dk', 'Bilgisayarı aç, şifre gir; Uyku, Yeniden başlat, Kapat'],
    ['<span class="num">2</span>&nbsp; Fareyi tutma, tek tık', '15 dk', 'Dört köşe, Hedef oyunu'],
    ['<span class="num">3</span>&nbsp; Çift tık, sağ tık, tekerlek', '20 dk', 'Balon oyunu, Karışık hedef, Tarif kaydırma, Mayın Tarlası'],
    ['<span class="num">4</span>&nbsp; Sürükle-bırak', '15 dk', 'Simge taşıma, Kart dizme, Klasöre ve çöpe atma'],
    ['<span class="num">5</span>&nbsp; Pencereler', '20 dk', 'Hesap Makinesi ile küçült, büyüt, taşı'],
    ['<span class="num">6</span>&nbsp; Dizüstü ve touchpad', '30 dk', 'Touchpad hareketleri, pil ve şarj, kapak, Fn tuşları'],
    ['<span class="num">7</span>&nbsp; Fare parkuru', '15 dk', '11 görevlik tekrar, süre tutulur']], 'tight', head=['Ders', 'Süre', 'Alıştırma ve oyunlar']) +
    hafta_sonu('altı küçük görev', 10)))
# 3
S.append(slide('Başlamadan önce', 'Alıştırmalar nasıl işliyor?', '''
<div class="cols">
  <div class="col" style="flex:.8">
    <ul>
      <li>Solda <b>ne yapacağınız</b> yazar, sağda <b>alıştırma bilgisayarı</b> vardır.</li>
      <li>Doğru yaptığınızda ekran <b>kendiliğinden</b> sonraki adıma geçer.</li>
      <li>Yanlış yaparsanız bir uyarı çıkar; takılırsanız ipucu açılır.</li>
      <li>Gerçek dosyalarınıza dokunmaz. <b>Hiçbir şey bozulmaz.</b></li>
    </ul>
  </div>
  <div class="col" style="flex:1.2">
    <figure class="fig"><img src="img/app_genel.png"><figcaption>Sol: adım ve yönerge. Sağ: alıştırma bilgisayarı (burada Hedef oyunu açık).</figcaption></figure>
  </div>
</div>'''))
# 4
S.append(slide('Ders 1 · Açma ve kapatma', 'Bilgisayarın dört parçası', '''
<table style="margin-top:6px">
  <tr><th class="big" style="width:210px">Kasa</th><td class="big">Asıl bilgisayar budur. Bütün işi o yapar.</td></tr>
  <tr><th class="big">Ekran</th><td class="big">Kasanın yaptığını gösterir (monitör).</td></tr>
  <tr><th class="big">Klavye</th><td class="big">Yazı yazarız.</td></tr>
  <tr><th class="big">Fare</th><td class="big">Ekrandaki oku hareket ettirir, tıklarız.</td></tr>
</table>
<p class="mut" style="margin-top:26px">Dizüstü bilgisayarda (laptop) bunların hepsi tek parçadır.</p>'''))
# 5
S.append(slide('Ders 1 · Alıştırma', 'Bilgisayarı açın', '''
<div class="cols" style="gap:28px">
  <figure class="fig col"><img src="img/ac_kapali.png"><figcaption><b>1.</b> Kasadaki güç düğmesine <b>bir kez</b> basın. Ekranın düğmesi değil, kasanınki.</figcaption></figure>
  <figure class="fig col"><img src="img/ac_kilit.png"><figcaption><b>2.</b> Kilit ekranına bir kez tıklayın ya da bir tuşa basın.</figcaption></figure>
  <figure class="fig col"><img src="img/ac_sifre.png"><figcaption><b>3.</b> Şifreyi (1234) yazın, <b>Enter</b>’a basın. Harfler nokta olarak görünür.</figcaption></figure>
</div>
<p class="note" style="margin-top:30px">Güç düğmesine basılı tutulmaz. Basılı tutmak, donmuş bir bilgisayarı zorla kapatır.</p>'''))
# 6
S.append(slide('Ders 1 · Alıştırma', 'Kapatmanın üç yolu', '''
<div class="cols">
  <div class="col" style="flex:1">
    <figure class="fig"><img src="img/ac_guc.png"><figcaption>Başlat menüsü, sağ alt köşedeki güç simgesi.</figcaption></figure>
  </div>
  <div class="col" style="flex:1.1">
    <table>
      <tr><th>Uyku</th><td>Her şey yerinde kalır. <b>Kısa aralar</b> için.</td></tr>
      <tr><th>Yeniden başlat</th><td>Yavaşlayınca, donunca, güncellemeden sonra.</td></tr>
      <tr><th>Kapat</th><td><b>Gün sonunda.</b> Bilgisayar işini toparlayıp kapanır.</td></tr>
    </table>
    <p class="note">Fişten çekmek <b>asla</b>: kaydedilmemiş iş kaybolur, bilgisayar bir daha açılmayabilir.</p>
  </div>
</div>'''))
# 7
S.append(slide('Ders 2 · Fareyi tutma ve tek tık', 'Fareyi nasıl tutarız?', '''
<div class="cols">
  <div class="col" style="flex:.55">
    <svg viewBox="0 0 160 220" width="260" style="display:block;margin:0 auto">
      <path d="M80 10 C35 10 18 45 18 90 L18 150 C18 190 45 212 80 212 C115 212 142 190 142 150 L142 90 C142 45 125 10 80 10 Z" fill="#fff" stroke="#1d1d1b" stroke-width="3"/>
      <path d="M80 10 L80 95 M18 95 L142 95" stroke="#1d1d1b" stroke-width="2.5" fill="none"/>
      <rect x="73" y="34" width="14" height="34" rx="7" fill="#b5441c"/>
      <text x="48" y="72" font-size="14" text-anchor="middle" font-family="Fira Sans" font-weight="600">SOL</text>
      <text x="112" y="72" font-size="14" text-anchor="middle" font-family="Fira Sans" font-weight="600">SAĞ</text>
    </svg>
  </div>
  <div class="col" style="flex:1">
    <ul>
      <li>Avucunuzu farenin üstüne <b>rahatça</b> koyun.</li>
      <li><b>İşaret parmağı</b> sol tuşta, <b>orta parmak</b> sağ tuşta.</li>
      <li>Bileğiniz masaya dayalı olsun, fare masada kayar.</li>
      <li>Masanın kenarına geldiyseniz fareyi <b>kaldırıp ortaya koyun</b>. Ekrandaki ok yerinde kalır.</li>
    </ul>
  </div>
</div>'''))
# 8
S.append(slide('Ders 2 · Alıştırma 1', 'Dört köşe', '''
<div class="cols">
  <div class="col" style="flex:.85">
    <ul>
      <li>Ekrandaki ok, yani <b>imleç</b>, fareyle birlikte hareket eder.</li>
      <li>İmleci ekranın <b>dört köşesine</b> sırayla götürün.</li>
      <li>Değdiğiniz köşenin işareti <b>yeşile</b> döner.</li>
    </ul>
    <p class="note">Amaç: imleci istediğimiz yere götürebilmek.</p>
  </div>
  <div class="col" style="flex:1.15">
    <figure class="fig"><img src="img/f1_kose.png"><figcaption>İki köşe tamamlandı, iki köşe kaldı.</figcaption></figure>
  </div>
</div>'''))
# 9
S.append(slide('Ders 2 · Oyun', 'Hedef oyunu: tek tık', '''
<div class="cols">
  <div class="col" style="flex:.85">
    <ul>
      <li>Yeşil daireye <b>sol tuşla bir kez</b> tıklayın.</li>
      <li>10 hedef var; daireler gittikçe <b>küçülür</b>.</li>
      <li>Üstte <b>vurulan</b> ve <b>ıska</b> sayısı görünür.</li>
      <li>İmlecin <b>ucu</b> dairenin içinde olsun, fareyi oynatmadan tıklayın.</li>
    </ul>
  </div>
  <div class="col" style="flex:1.15">
    <figure class="fig"><img src="img/f1_hedef.png"><figcaption>Oyunun üstündeki sekmelerle tek tık, çift tık, sağ tık ve karışık kipleri arasında geçilir.</figcaption></figure>
  </div>
</div>'''))
# 10
S.append(slide('Ders 2 · Alıştırma', 'Simge seçme ve düğmeye basma', '''
<div class="cols">
  <div class="col" style="flex:1">
    <table>
      <tr><th class="num">1</th><td>Geri Dönüşüm Kutusu’na <b>bir kez</b> tıklayın. Simge <b>seçili</b> olur.</td></tr>
      <tr><th class="num">2</th><td>Hesap Makinesi’ne tıklayın. Öncekinin seçimi kalkar.</td></tr>
      <tr><th class="num">3</th><td>Boş bir yere tıklayın. Seçim kalkar.</td></tr>
      <tr><th class="num">4</th><td>Başlat’a tıklayın, menü açılır. Bir daha tıklayın, kapanır.</td></tr>
    </table>
  </div>
  <div class="col" style="flex:.9">
    <figure class="fig"><img src="img/ac_baslat.png"><figcaption>Başlat menüsü: bütün programlar burada.</figcaption></figure>
  </div>
</div>'''))
# 11
S.append(slide('Ders 3 · Oyun', 'Balon oyunu: çift tık', '''
<div class="cols">
  <div class="col" style="flex:.85">
    <ul>
      <li>Balona hızlıca <b>iki kez</b> tıklayın: <b>tık-tık</b>. 6 balon var.</li>
      <li>Tek tık balonu patlatmaz; oyun <b>uyarır</b>.</li>
      <li>Püf noktası: fareyi <b>oynatmayın</b>, yalnızca parmağınız hareket etsin.</li>
    </ul>
    <p class="note">Sonra Not Defteri simgesine çift tıklayıp açın, sağ üstteki ✕ ile kapatın.</p>
  </div>
  <div class="col" style="flex:1.15">
    <figure class="fig"><img src="img/f2_balon.png"><figcaption>Çift tık herkesi başta zorlar. Acele etmeyin.</figcaption></figure>
  </div>
</div>'''))
# 12
S.append(slide('Ders 3 · Oyun', 'Karışık hedef: sol tık, sağ tık', '''
<div class="cols" style="gap:28px">
  <figure class="fig" style="flex:0 0 400px"><img src="img/f2_karisik.png"><figcaption><b style="color:#2e7d32">Yeşil</b> daire: farenin <b>sol</b> tuşu</figcaption></figure>
  <figure class="fig" style="flex:0 0 400px"><img src="img/f2_sag.png"><figcaption><b style="color:#c25a00">Turuncu</b> daire: farenin <b>sağ</b> tuşu</figcaption></figure>
</div>
<p style="margin-top:18px;font-size:21px;line-height:1.4"><b>Sağ tık</b> “bununla neler yapabilirim?” diye sorar ve bir menü açar. Önce Paint simgesine, sonra masaüstüne sağ tıklayıp menüleri karşılaştırırız.</p>'''))
# 13
S.append(slide('Ders 3 · Alıştırma', 'Tekerlek: tarifi sonuna kadar kaydırın', '''
<div class="cols">
  <div class="col" style="flex:.85">
    <ul>
      <li>Tekerleği <b>kendinize doğru</b> çevirin: sayfa <b>aşağı</b> iner.</li>
      <li>Tekerleği <b>ileri</b> çevirin: sayfa yukarı çıkar.</li>
      <li>Tarifin en altında <b>gizli bir kelime</b> var. Bulana kadar kaydırın.</li>
    </ul>
  </div>
  <div class="col" style="flex:1.15">
    <figure class="fig"><img src="img/f2_tarif.png"><figcaption>Uydurma bir tarif sitesi. Gerçek bir siteye bağlanmaz.</figcaption></figure>
  </div>
</div>'''))
# 14
S.append(slide('Ders 3 · Bonus oyun', 'Mayın Tarlası', '''
<div class="cols">
  <div class="col" style="flex:1">
    <ul>
      <li><b>Sol tık</b> kareyi açar. Sayı, çevresindeki mayın sayısını söyler.</li>
      <li><b>Sağ tık</b> mayın olduğunu düşündüğünüz kareye bayrak koyar.</li>
      <li>Hem kare açın hem bayrak koyun.</li>
      <li>Mayına basarsanız gülen yüze tıklayıp yeniden başlayın.</li>
    </ul>
    <p class="note">Sol ve sağ tuş aynı oyunda kullanılır. İlk tıklama her zaman güvenlidir.</p>
  </div>
  <div class="col" style="flex:.9">
    <figure class="fig"><img src="img/f2_mayin.png"><figcaption>7 × 7 alan, 6 mayın. Sol üstte bir bayrak var.</figcaption></figure>
  </div>
</div>'''))
# 15
S.append(slide('Ders 4 · Sürükle-bırak', 'Tut, taşı, bırak', '''
<div class="steps4">
  <div><div class="n">1</div><span>Fareyi nesnenin <b>üzerine getirin</b>.</span></div>
  <div><div class="n">2</div><span>Sol tuşa <b>basın ve basılı tutun</b>.</span></div>
  <div><div class="n">3</div><span>Parmağınızı kaldırmadan fareyi <b>kaydırın</b>.</span></div>
  <div><div class="n">4</div><span>Gideceği yere gelince tuşu <b>bırakın</b>.</span></div>
</div>
<p style="margin-top:44px">İlk alıştırma: <b>Hesap Makinesi</b> simgesini tutup masaüstünün sağ tarafına taşıyın.</p>'''))
# 16
S.append(slide('Ders 4 · Oyun', 'Kart dizme', '''
<div class="cols">
  <div class="col" style="flex:.85">
    <ul>
      <li>Kartları tutup aşağıdaki yerlerine sürükleyin: <b>A, 2, 3, 4, 5</b>.</li>
      <li>Kartlar karışık gelir. Her oyunda sıra değişir.</li>
      <li>Yanlış yere bırakırsanız kart <b>geri döner</b> ve oyun bir ipucu verir.</li>
    </ul>
    <p class="note">Gerçek bilgisayarda aynı alıştırma: Başlat’a <b>Solitaire</b> yazın.</p>
  </div>
  <div class="col" style="flex:1.15">
    <figure class="fig"><img src="img/s_kart.png"><figcaption>As yerine oturdu, 2 – 5 sırada.</figcaption></figure>
  </div>
</div>'''))
# 17
S.append(slide('Ders 4 · Alıştırma', 'Dosyayı klasöre, çöpe atın', '''
<div class="cols">
  <div class="col" style="flex:1">
    <table>
      <tr><th class="num">1</th><td><b>deniz.jpg</b> resmini <b>Fotoğraflarım</b> klasörünün üzerine sürükleyin. Klasör <b>maviye boyanınca</b> bırakın.</td></tr>
      <tr><th class="num">2</th><td>Klasöre çift tıklayıp resmin içeride olduğunu görün.</td></tr>
      <tr><th class="num">3</th><td><b>eski not</b> dosyasını Geri Dönüşüm Kutusu’na bırakın.</td></tr>
    </table>
    <p class="note">Silinen dosya hemen yok olmaz; kutuya gider ve geri alınabilir.</p>
  </div>
  <div class="col" style="flex:.9">
    <figure class="fig"><img src="img/s_klasor.png"><figcaption>Masaüstünde klasör, resim ve gereksiz not dosyası.</figcaption></figure>
  </div>
</div>'''))
# 18
S.append(slide('Ders 5 · Pencereler', 'Pencerenin parçaları', '''
<div class="cols">
  <div class="col" style="flex:1">
    <div class="win" style="margin-bottom:22px"><div class="bar"><span>Hesap Makinesi</span><span><i>—</i><i>☐</i><i style="color:var(--acc);font-weight:600">✕</i></span></div><div class="body">Pencerenin içi</div></div>
    <table>
      <tr><th>—</th><td>Küçült: pencere görev çubuğuna iner</td></tr>
      <tr><th>☐ / ❐</th><td>Ekranı kapla / önceki boyut</td></tr>
      <tr><th>✕</th><td>Kapat</td></tr>
      <tr><th>Başlık çubuğu</th><td>Tutup sürükleyince pencere taşınır</td></tr>
    </table>
  </div>
  <div class="col" style="flex:.9">
    <figure class="fig"><img src="img/p_pencere.png"><figcaption>Alıştırma: Hesap Makinesi ile 12 + 7 hesaplayın, sonra pencereyi küçültüp görev çubuğundan geri getirin, kaplayın, taşıyın, boyutunu değiştirin.</figcaption></figure>
  </div>
</div>'''))
S.append(slide('Ders 6 · Dizüstü bilgisayar', 'Touchpad: farenin yerini tutar', split(
    table([['Tek parmak kaydırmak', 'İmleç (ok) hareket eder'],
           ['Hafifçe dokunmak', 'Sol tık. Alttaki sol köşeye basmak da olur'],
           ['İki parmakla dokunmak', 'Sağ tık. Bazılarında sağ alt köşeye basmak'],
           ['İki parmak yukarı-aşağı', 'Sayfayı kaydırır (tekerlek gibi)'],
           ['İki parmağı açıp kapamak', 'Yakınlaştırır / uzaklaştırır']], 'kv'),
    ul(['Dizüstünde kasa, ekran, klavye ve fare <b>tek parçadır</b>.',
        'Yazarken <b>avucunuz</b> touchpad’e değmesin: imleç sıçrar, yazı başka yere gider.',
        'Touchpad zor gelirse <b>USB fare</b> takın; ikisi birlikte çalışır.'], 'small'), 1.15, .85)))
S.append(slide('Ders 6 · Dizüstü bilgisayar', 'Pil, kapak ve Fn tuşları', table([
    ['🔋 Pil %20', 'İşinizi kaydedip şarj aletini takın. Şarjdayken simgede ⚡ görünür.'],
    ['Kapağı kapatmak', 'Bilgisayar <b>uykuya</b> geçer. Uzun süre kullanmayacaksanız Başlat → ⏻ → Kapat.'],
    [K('Fn') + ' + üst sıra tuşlar', 'Yanlışlıkla ses, Wi-Fi ya da parlaklık kapanabilir. <b>Aynı tuşla</b> geri açılır.'],
    ['✈ simgesi, internet yok', 'Uçak modu açık kalmış: simgeye tıklayıp kapatın (ya da Fn + uçak tuşu).'],
    ['Touchpad’i kapatmak', 'Ayarlar → Bluetooth ve cihazlar → <b>Dokunmatik yüzey</b> (Windows 10: Ayarlar → Aygıtlar) ya da Fn + touchpad tuşu.'],
    ['Taşırken', 'Kapatın ya da uykuya alın; ekrandan değil gövdeden tutun.']], 'kv') +
    note('Çoğu zaman bilgisayar bozuk değildir; bir tuşa yanlışlıkla basılmıştır. Önce sağ alttaki simgelere bakın.')))
# 19
S.append(slide('Ders 7 · Tekrar', 'Fare parkuru: 11 görev', '''
<ul class="task2">
  <li>Hesap Makinesi’ni çift tıklayıp açın</li>
  <li>25 + 17 hesaplayın</li>
  <li>Küçültün</li>
  <li>Görev çubuğundan geri getirin</li>
  <li>✕ ile kapatın</li>
  <li>Başlat’tan Not Defteri’ni açın</li>
  <li>Adınızı yazıp <b>Enter</b>’a basın</li>
  <li>Pencereyi taşıyın</li>
  <li>Kaydetmeden kapatın</li>
  <li>çöp.txt’yi Geri Dönüşüm Kutusu’na atın</li>
  <li>Bilgisayarı yeniden başlatın</li>
</ul>
<p class="note" style="margin-top:28px">Her görevin süresi tutulur. Sonda tablo çıkar, <b>en uzun süren görev kırmızı</b> görünür: kimin nerede takıldığı hemen anlaşılır.</p>'''))
S.append(slide('Özet', 'Bu hafta öğrendiklerimiz', table([
    ['Tek tık', 'Seçer, düğmelere basar'], ['Çift tık', 'Simgeyi, dosyayı, programı açar'],
    ['Sağ tık', '“Bununla neler yapabilirim?” menüsü'], ['Tekerlek', 'Sayfayı aşağı yukarı kaydırır'],
    ['Sürükle-bırak', 'Bas, tut, kaydır, bırak: taşır'], ['— ☐ ✕', 'Pencereyi küçültür, kaplar, kapatır'],
    ['Uyku / Yeniden başlat / Kapat', 'Kısa ara / bir şey ters gidince / gün sonu'],
    ['Touchpad', 'Tek parmak imleç, iki parmak dokunuş sağ tık, iki parmak kaydırma']], 'kv') +
    odev_test('altı küçük görev', 10)))
# 21
S.append(slide('Evde tekrar', 'Kendi bilgisayarınızda deneyin', '''
<ul>
  <li>Bilgisayarı açın, şifrenizle girin, <b>Kapat</b> ile kapatın. 2–3 kez tekrarlayın.</li>
  <li>Bir kez de <b>Yeniden başlat</b> deneyin.</li>
  <li>Başlat’a <b>Solitaire</b> ve <b>Minesweeper</b> yazın: sürükle-bırak ve sol/sağ tık için birebir alıştırma.</li>
  <li>Her gün birkaç dakika fareyle oynayın. Hız zamanla gelir.</li>
</ul>'''))
# hafta1'in elle yazılmış ilk sürümünde resimler sütunu tam kaplıyordu
write('hafta1', '1. Hafta', 'Bilgisayar İşletmenliği – 1. Hafta Alıştırmaları', S, '.fig img{max-height:none;width:100%}')

# ================================================================ HAFTA 2
S = []
S.append(cover('2. Hafta: Klavye', 'Alıştırmalar ve oyunlar', 'Alıştırma bilgisayarında uygulamalı ders'))
S.append(slide('Bu hafta', 'On ders', plan([
    ('Klavyeyi tanıyalım', 25), ('F klavye ve Q klavye', 20), ('Harf bulma alıştırması', 20), ('On parmak: temel sıra', 25),
    ('Rakamlar ve sayılar', 25), ('İşaretler: ( ) / = " # €', 20), ('Yazı yazarken başıma gelenler', 25),
    ('Klavye dili: TUR, ENG, Q, F', 30), ('Tuş avı', 20), ('Bayram kartı yazalım', 25)],
    'altı küçük görev', 12)))
S.append(slide('Ders 1 · Klavyeyi tanıyalım', 'Klavyeyi tanıyalım (25 dk)', split(
    ul(['Gerçek klavyenizde <b>hangi tuşa basarsanız</b> ekrandaki klavyede o tuş <b>mavi</b> yanar.',
        'Sarı yanan tuşlar, o adımda kullanacağınız tuşlardır.',
        'Yazılar <b>Not Defteri</b> penceresine yazılır; doğru yazınca ders sonraki adıma geçer.']),
    fig('k_giris.jpg', 'Not Defteri, Pano ve ekran klavyesi. Yazıyı kaydetmek gerekmez.'))))
S.append(slide('Ders 1 · Alıştırma 1', 'Harf, boşluk, Enter', split(
    table([['elma', 'Not Defteri’ne tıklayıp harfleri yazın'],
           ['elma armut', f'En alttaki uzun {K("Boşluk")} tuşuyla araya boşluk'],
           ['kiraz', f'{K("Enter ↵")} ile alt satıra geçip yazın']], 'kv'),
    note('İmleç, yanıp sönen ince çizgidir. Yazdığınız harfler imlecin olduğu yere gelir.'), 1.3, .7)))
S.append(slide('Ders 1 · Alıştırma 2', 'Silmek: Backspace ve Delete', f'''
<div class="steps4" style="margin-top:6px">
<div><div class="n">1</div><span><b>kiraz</b> kelimesinin sonunda {K('⌫ Backspace')} tuşuna bir kez basın: <b>kira</b> kalır.</span></div>
<div><div class="n">2</div><span>İmleci <b>kira</b>’nın başına getirin, {K('Delete')} tuşuna bir kez basın: <b>ira</b> kalır.</span></div></div>
{note('Backspace <b>geriye</b>, Delete <b>ileriye</b> siler. Backspace imlecin solundaki, Delete sağındaki harfi siler.')}'''))
S.append(slide('Ders 1 · Alıştırma 3', 'Büyük harf: Shift ve Caps Lock', table([
    [K('⇧ Shift') + ' + harf', '<b>Ali</b> yazın: yalnızca A büyük. Shift’i basılı tutup A’ya basın, sonra bırakın.'],
    [K('Caps Lock'), '<b>ANKARA</b> yazın, Caps Lock’a bir kez daha basıp kapatın, yanına <b>ankara</b> yazın.']], 'kv') +
    note('Caps Lock açık kalırsa her şey büyük harf yazılır. <b>Şifre yazarken buna dikkat edin.</b>')))
S.append(slide('Ders 1 · Alıştırma 4', 'Türkçe harfler ve İ / I farkı', split(
    ul(['<b>çiçek ağaç ışık göz şeker üzüm</b> kelimelerini yazın.',
        'Büyük harfle <b>İZMİR IĞDIR</b> yazın.',
        '<b>I</b> tuşu noktasız ı, noktalı <b>i</b> ise Ş’nin yanındaki <b>İ</b> tuşudur.'], 'small') +
    note('Türkçede İ ve I ayrı harflerdir; klavyede de ayrı tuşlardır.'),
    fig('k_turkce.jpg', 'Kelimeler yazıldı; ekran klavyesi basılan tuşları gösterir.'))))
S.append(slide('Ders 1 · Alıştırma 5', 'İşaretler: ! ? @', split(
    table([[K('Shift', '1'), '! (ünlem)'], [K('Shift', '*'), '? (soru işareti), sağ üstte 0’ın yanında'],
           [K('AltGr', 'Q'), '@ (et işareti): e-posta adresleri için']], 'kv') +
    f'<p style="margin-top:18px">Yazın: <b>Nasılsın? Harika!</b> ve <b>ali@ornek.com</b></p>' +
    note('AltGr yoksa Ctrl ve Alt’ı birlikte basılı tutup Q’ya basmak da @ yazar.'),
    fig('k_eposta.jpg', 'E-posta adresi yazıldı.'), 1.1, .9)))
S.append(slide('Ders 1 · Alıştırma 6', 'Ok tuşları, Home ve End', table([
    [K('↑') + ' ' + K('↓') + ' ' + K('←') + ' ' + K('→'), 'İmleci harf harf, satır satır hareket ettirir. Dördüne de basın.'],
    [K('Home'), 'İmleci satırın <b>başına</b> götürür.'],
    [K('End'), 'İmleci satırın <b>sonuna</b> götürür.'],
    [K('Tab') + ' · ' + K('Esc'), 'Formda sonraki kutuya geç · vazgeç, menüyü kapat. ' + K('⊞') + ' Windows tuşu Başlat’ı açar.']], 'kv') +
    note('Fareye gerek kalmadan imleci istediğiniz yere götürebilirsiniz. Uzun satırlarda Home ve End çok zaman kazandırır.')))
S.append(slide('Ders 2 · F klavye ve Q klavye', 'Hangi klavyeyi kullanıyorsunuz?', table([
    ['Q klavye', 'Üst sıra <b>Q W E R T Y</b>… Bilgisayarların çoğunda böyledir.'],
    ['F klavye', 'Üst sıra <b>F G Ğ I O D</b>… 1955’te Türkçenin harf sıklığına göre tasarlandı; sesli harfler sol elin altında.'],
    ['Hangisi bende?', 'Üst harf sırasının ilk tuşuna bakın: Q mu, F mi?'],
    ['Daktilo bilenler', 'Çoğu daktilo kursu F klavyeyle öğretti. Bilgisayara F düzeni eklenebilir.'],
    ['Windows’ta F eklemek', 'Ayarlar → Saat ve dil → <b>Klavye ekle</b> → Türkçe F'],
    ['Ortak bilgisayar', 'Düzeni değiştirdiyseniz işiniz bitince eski hâline getirin.']], 'kv')))
S.append(slide('Ders 3–4 · Harf bulma ve on parmak', 'Parmaklar nerede durur?', split(
    table([['Sol el', 'Serçe <b>A</b>, yüzük <b>S</b>, orta <b>D</b>, işaret <b>F</b>'],
           ['Sağ el', 'İşaret <b>J</b>, orta <b>K</b>, yüzük <b>L</b>, serçe <b>Ş</b>'],
           ['Başparmaklar', K('Boşluk') + ' tuşu'],
           ['F ve J', 'Üzerindeki küçük çıkıntılar: bakmadan yeri bulunur']], 'kv') +
    note('Önce doğru parmak, hız sonra gelir. Sırt dik, bilekler düz; ekran göz hizasının biraz altında.'),
    fig('k_temel.jpg', 'On parmak dersi: sarı tuşlar temel sıradır.') +
    '<p style="margin-top:16px;font-size:20px"><b>Harf bulma:</b> ekranda çıkan harfi klavyede bulup basın. Zorlandığınız harfler bir kez daha sorulur.</p>', 1, 1)))
S.append(slide('Ders 5 · Rakamlar ve sayılar', 'Tarih, saat, para', split(
    table([['Tarih', '<b>29.10.2026</b>: nokta, sağ alttaki . tuşu'],
           ['Saat', f'<b>14:30</b>: iki nokta için {K("Shift", ".")}'],
           ['Para', '<b>1.250,50 TL</b>: binlik nokta, kuruş virgül'],
           ['% ve +', f'{K("Shift", "5")} yüzde, {K("Shift", "4")} artı']], 'kv'),
    ul(['Rakamlar iki yerde: harflerin <b>üstündeki sıra</b> ve masaüstü klavyelerde en sağdaki <b>sayı tuşları</b>.',
        'Sağdaki tuşlar rakam yazmıyorsa <b>Num Lock</b> ışığına bakın; sönükse bir kez basın.',
        'Telefon numarasında gruplar arasına boşluk bırakılır.'], 'small'), 1.05, .95)))
S.append(slide('Ders 6 · İşaretler', 'Bir tuşta üç işaret', split(
    table([['( )', f'{K("Shift", "8")} açar, {K("Shift", "9")} kapatır'], ['/ (eğik çizgi)', K('Shift', '7')],
           ['= (eşittir)', K('Shift', '0')], ['_ (alt çizgi)', K('Shift', '-')],
           ['" (tırnak)', '1’in solundaki tuş']], 'kv'),
    table([['# (diyez)', K('AltGr', '3')], ['€ (avro)', K('AltGr', 'E')], ['@ (et)', K('AltGr', 'Q')]], 'kv') +
    note('Kural: tuşun <b>üstündeki</b> işaret Shift ile, <b>sağ altındaki</b> AltGr ile yazılır. Örnek: 3 tuşu → 3 · Shift ile ^ · AltGr ile #.'), 1, 1)))
S.append(slide('Ders 7 · Yazı yazarken başıma gelenler', '“Klavye bozuldu!” Bozulmadı.', table([
    ['Yazı gelmiyor', 'İmleç (yanıp sönen çizgi) yazı alanında mı? Yazı alanının içine tıklayın.'],
    ['Harfler siliniyor', K('Insert') + ' tuşuna basılmış (Üzerine yaz). Aynı tuşa bir daha basın.'],
    ['HER ŞEY BÜYÜK', K('Caps Lock') + ' açık. Bir kez basıp kapatın.'],
    ['Sayı tuşları çalışmıyor', K('Num Lock') + ' kapalı. Bir kez basıp açın.'],
    ['ş, ğ, ü yok', f'Klavye dili ENG olmuş. {K("Alt", "Shift")} ya da {K("⊞", "Boşluk")} ile TUR yapın.']], 'kv') +
    note('İlk kural: bilgisayar bozulmadı. Önce ekrana ve sağ alttaki simgelere bakın.')))
S.append(slide('Ders 8 · Klavye dili ve düzeni', 'TUR mu, ENG mi?', split(
    ul(['Sağ altta saatin yanında <b>TUR</b> ya da <b>ENG</b> yazar: klavye dili.',
        'ENG’de ş, ğ, ü, ö, ç, ı yazılmaz; <b>ş</b> tuşu <b>;</b> yazar.',
        f'Dili değiştirmek: {K("Alt", "Shift")} (aynı iş: {K("⊞", "Boşluk")}) ya da TUR yazısına tıklayıp seçmek.',
        f'@ işareti: Türkçe Q’da {K("AltGr", "Q")}, İngilizcede {K("Shift", "2")}.'], 'small'),
    '<h2>F klavye eklemek</h2>' + adim(['⊞ Başlat → ⚙ Ayarlar → <b>Saat ve dil</b> → <b>Dil ve bölge</b>',
          '<b>Klavye ekle</b> kutusundan Türkçe F klavye',
          'Sağ alttaki TUR’a tıklayıp düzeni seçin',
          'İşiniz bitince <b>Türkçe Q</b>’ya dönün']) +
    note('F düzeninde Q klavyenin tuşlarıyla F harfleri yazılır: F tuşu a, H tuşu t yazar.'), 1, 1)))
S.append(slide('Ders 9–10 · Tekrar', 'Alıştırmalar', table([
    ['Tuş avı', 'İpucu yanmadan, tarif edilen tuşu gerçek klavyede bulup basın: Enter, Esc, Home, End, AltGr…'],
    ['Bayram kartı', 'Kısa bir mesaj yazın: cümle büyük harfle başlar, nokta ya da ünlemle biter. Kesme işareti: <b>Shift + 2</b> (İzmir’e). Hataları düzeltip <b>bayram kartı</b> adıyla kaydedin.']], 'kv') +
    note('Dizüstünde Home ve End yoksa: ' + K('Fn') + ' basılıyken ← →. Klavyedeki küçük ışıklar Caps Lock ve Num Lock’ı gösterir.')))
S.append(slide('Özet', 'Bu hafta öğrendiklerimiz', table([
    ['Boşluk · Enter', 'Kelimeler arasına boşluk · alt satıra geç'],
    ['⌫ Backspace / Delete', 'İmlecin solundaki / sağındaki harfi siler'],
    ['Shift + harf · Caps Lock', 'Tek bir büyük harf · hepsi büyük harf (aç/kapat)'],
    ['Shift+1 · Shift+* · AltGr+Q', '! · ? · @'], ['↑ ↓ ← →  ·  Home / End', 'İmleci hareket ettirir · satır başı / sonu'],
    ['A S D F – J K L Ş', 'Temel sıra; F ve J’de çıkıntı var'],
    ['Insert · Num Lock', 'Harfler siliniyorsa · sayı tuşları yazmıyorsa'],
    ['TUR / ENG', 'Klavye dili: Alt + Shift ile değişir'], ['Q / F', 'Klavye düzeni: Ayarlar → Saat ve dil → Dil ve bölge']], 'kv tight') +
    odev_test('altı küçük görev', 12)))
write('hafta2', '2. Hafta', 'Bilgisayar İşletmenliği – 2. Hafta Alıştırmaları', S)

# ================================================================ HAFTA 3
S = []
S.append(cover('3. Hafta: Metin seçme ve kısayollar', 'Alıştırmalar ve oyunlar', 'Alıştırma bilgisayarında uygulamalı ders'))
S.append(slide('Bu hafta', 'Beş ders', plan([
    ('Not Defteri ve kısayollar', 25), ('Seçmenin incelikleri', 25), ('Kaydetme, farklı kaydetme, açma', 25),
    ('Alışveriş listesini düzenleyin', 25), ('Kısayol yarışı', 15)],
    'altı küçük görev', 10)))
S.append(slide('Ders 1 · Not Defteri', 'Not Defteri nedir? (25 dk)', split(
    ul(['Bilgisayardaki <b>en basit yazı programı</b>: alışveriş listesi, telefon numarası, kısa notlar.',
        'Alıştırma penceresi gerçeğinin benzeridir; <b>hiçbir şey bozulmaz</b>.',
        'Önce adınızı ve soyadınızı, sonra bir cümle yazarız.']),
    f'<h2>Gerçek bilgisayarda nasıl açılır?</h2>' + table([['1', f'{K("⊞ Windows")} tuşuna basın'], ['2', '<b>not defteri</b> yazın'],
                                                        ['3', f'{K("Enter")} tuşuna basın']], 'kv'), 1, 1)))
S.append(slide('Ders 1 · Alıştırma 1', 'Seçmek: çift tık ve Ctrl + A', split(
    ul(['Bir yazıyla işlem yapmadan önce onu <b>seçmek</b> gerekir. Seçili yazı maviye boyanır.',
        'Bir kelimeyi seçmek için üzerine <b>çift tıklayın</b>.',
        f'Hepsini seçmek için {K("Ctrl", "A")}. A, İngilizce “All” (hepsi) kelimesinden gelir.'], 'small') +
    note('Seçiliyken bir harfe basarsanız yazının yerine o harf yazılır. Olursa Ctrl+Z ile geri alın.'),
    fig('nd_sec.jpg', 'Bütün yazı seçili (mavi).'))))
S.append(slide('Ders 1 · Alıştırma 2', 'Kopyalamak ve yapıştırmak', split(
    ul([f'Yazı seçiliyken {K("Ctrl", "C")} (Copy): ekranda bir şey değişmez, yazı <b>Pano</b>’ya alınır.',
        'İmleci yazının sonuna götürüp <b>Enter</b> ile yeni satır açın.',
        f'{K("Ctrl", "V")} ile yapıştırın: yazı ikinci kez gelir.'], 'small') +
    note('Pano’daki yazı, siz yeni bir şey kopyalayana kadar orada kalır.'),
    fig('nd_kopya.jpg', 'Altta Pano kutusu: “Kopyalandı”.'))))
S.append(slide('Ders 1 · Alıştırma 3', 'Geri almak, geri getirmek, taşımak', table([
    [K('Ctrl', 'Z'), '<b>Geri al.</b> Son yaptığınız iş silinir. Bilgisayardaki “can simidi”.'],
    [K('Ctrl', 'Y'), '<b>Yinele.</b> Geri aldığınızı geri getirir.'],
    [K('Ctrl', 'X'), '<b>Kes.</b> Yazı yerinden alınır, Pano’ya gider. Sonra Ctrl+V ile başka yere yapıştırılır.']], 'kv') +
    note('<b>Kopyala:</b> yazı yerinde kalır, bir kopyası gider. <b>Kes:</b> yazı yerinden alınıp götürülür.')))
S.append(slide('Ders 1 · Alıştırma 4', 'Kısayolu unutursanız: sağ tık', ul([
    'Bir kelimeyi çift tıklayarak seçin.',
    'Seçili yazının üzerine farenin <b>sağ tuşuyla</b> bir kez tıklayın.',
    'Açılan menüden <b>Kopyala</b>’yı seçin.',
    'Menüde <b>Kes</b>, <b>Kopyala</b>, <b>Yapıştır</b> hep vardır; klavye kısayolları ise daha hızlıdır.'])))
S.append(slide('Ders 1 · Alıştırma 5', 'Kaydetmek ve yeniden açmak', split(
    ul([f'Pencere başlığındaki <b>*Adsız</b>: baştaki yıldız “kaydedilmemiş değişiklik var” demektir.',
        f'{K("Ctrl", "S")}: <b>Dosya adı</b> kutusuna bir ad yazın, <b>Kaydet</b>’e tıklayın.',
        f'Dosya → <b>Yeni</b>: boş sayfa. Kaydettiğiniz yazı kaybolmaz.',
        f'{K("Ctrl", "O")}: kaydettiğiniz dosyayı yeniden açın.'], 'small') +
    note('Kaydedilen dosyalar, bilgisayarı kapatsanız da kaybolmaz.'),
    fig('nd_kaydet.jpg', 'Kaydet penceresi: Belgeler klasörü.'), .95, 1.05)))
S.append(slide('Ders 2 · Seçmenin incelikleri', 'Bir parçayı, bir satırı seçmek', table([
    ['Sürüklemek', 'Sol tuş basılı, yazının üzerinden geçin: <b>hava çok güzel</b>'],
    ['Tık, sonra ' + K('Shift') + ' + tık', 'Uzun yazıyı seçer: başına tıklayın, Shift basılıyken sonuna tıklayın'],
    [K('Shift', '→') + ' / ' + K('Shift', '←'), 'Harf harf seçer. Klavyeyle seçmek daha hassastır.'],
    [K('Shift', 'End') + ' / ' + K('Shift', 'Home'), 'İmleçten satırın sonuna / başına kadar seçer'],
    ['Üç kez tıklama', 'Bütün satırı seçer'],
    [K('Ctrl', '→') + ' / ' + K('Ctrl', '←'), 'İmleci kelime kelime atlatır'],
    [K('Ctrl', 'Home') + ' / ' + K('Ctrl', 'End'), 'Yazının en başına / en sonuna götürür']], 'kv') +
    note('Alıştırmanın sonunda: 2. satırı baştan sona seçip ' + K('Delete') + ' ile silin.')))
S.append(slide('Ders 3 · Kaydetme', 'Kaydet mi, farklı kaydet mi?', split(
    table([[K('Ctrl', 'S') + ' (ilk kez)', 'Ad ve klasör sorulur'],
           [K('Ctrl', 'S') + ' (sonra)', 'Sormadan aynı dosyanın üzerine kaydeder'],
           ['Dosya → <b>Farklı kaydet</b>', 'Başka ad ya da klasörle <b>yeni bir kopya</b>; asıl dosya değişmez'],
           ['Dosya → Aç (' + K('Ctrl', 'O') + ')', 'Kayıtlı dosyayı açar'],
           ['Başlık çubuğu', 'Hangi dosyanın açık olduğunu gösterir; * kaydedilmemiş demek']], 'kv'),
    '<h2>Alıştırma</h2>' + adim(['Randevu notunu yazın, <b>Belgeler</b>’e <b>randevu</b> adıyla kaydedin.',
          'Bir satır ekleyin, yine ' + K('Ctrl', 'S') + ': bu sefer bir şey sorulmaz.',
          'Farklı kaydet ile <b>Masaüstü</b>’ne <b>randevu kopyası</b>.',
          K('Ctrl', 'O') + ' ile Belgeler’deki asıl dosyayı açın.'], 'small'), 1.1, .9)))
S.append(slide('Ders 4–5 · Tekrar', 'Alıştırmalar', table([
    ['Alışveriş listesi', 'Satırı taşıyın (' + K('Ctrl', 'X') + ' → ' + K('Ctrl', 'V') + '), ekleyin, silin, ' + K('Ctrl', 'Z') + ' ile geri getirin, listeyi çoğaltın. Başlığı <b>seçip üzerine yazın</b>.'],
    ['Kısayol yarışı', '9 görev, yalnızca kısayollarla; süre tutulur. Son görev: ' + K('Ctrl') + ' + fare tekerleği ile yazıyı büyütmek.']], 'kv') +
    note('Pano’da tek bir şey durur: en son kopyalanan. Kestiğiniz yazıyı hemen yapıştırın; bilgisayar kapanınca Pano boşalır.')))
S.append(slide('Özet', 'Kısayollar', ozet([
    ['Çift tıklama', 'Bir kelimeyi seç'], ['Ctrl + A', 'Hepsini seç'], ['Ctrl + C', 'Kopyala (yazı yerinde kalır)'],
    ['Ctrl + X', 'Kes (yazı yerinden alınır)'], ['Ctrl + V', 'Yapıştır'], ['Ctrl + Z', 'Geri al'],
    ['Ctrl + Y', 'Yinele'], ['Ctrl + S · Ctrl + O', 'Kaydet · Aç'], ['Dosya → Farklı kaydet', 'Başka ad ya da yerle yeni kopya'],
    ['Üç tık · Shift + End', 'Satırı seç · satır sonuna kadar seç'], ['Ctrl + → · Ctrl + End', 'Kelime kelime atla · yazının sonuna git'],
    ['Sağ tık', 'Kes, Kopyala, Yapıştır menüsü']], 'altı küçük görev', 10)))
write('hafta3', '3. Hafta', 'Bilgisayar İşletmenliği – 3. Hafta Alıştırmaları', S)

# ================================================================ HAFTA 4
S = []
S.append(cover('4. Hafta: Donanım ve yazılım', 'Alıştırmalar ve oyunlar', 'Ayırma oyunları ve 3B uygulama'))
S.append(slide('Bu hafta', 'Sekiz ders', plan([
    ('Bilgisayarın İçine Yolculuk', None), ('Donanım dersi: kasanın içi', None), ('Donanım mı, yazılım mı?', 15),
    ('Kasanın içi: parçalar', 25), ('Portlar ve kablolar', 20), ('Bilgisayar ilanını okuyalım', 20),
    ('Bakım, sağlıklı ve güvenli kullanım', 25), ('Bir şey çalışmıyor! İlk kontroller', 20)],
    'altı küçük görev', '<b>10 soruluk test</b> ile <b>15 soruluk donanım testi</b>')))
S.append(slide('Ders 3 · Donanım ve yazılım', 'Donanım mı, yazılım mı? (15 dk)', split(
    ul(['<b>Donanım:</b> elle tutabildiğimiz parçalar. Klavye, fare, ekran, kasa…',
        '<b>Yazılım:</b> bilgisayarın içindeki programlar. Elle tutulmaz. Windows, Not Defteri, Paint…',
        'Benzetme: donanım <b>bir radyo</b>, yazılım radyodan çıkan <b>şarkı</b> gibidir.']),
    fig('dn_giris.jpg', 'Donanım + yazılım = çalışan bilgisayar'))))
S.append(slide('Ders 3 · Oyun 1', 'Ayırma oyunu: donanım mı, yazılım mı?', split(
    ul(['Kartları tutup <b>doğru kutuya</b> sürükleyin. 9 kart var.',
        'Doğru bırakırsanız kart kutuya yerleşir ve neden doğru olduğu yazar.',
        'Yanlış bırakırsanız kutu kızarır ve ipucu çıkar.'], 'small') +
    note('Dikkat: USB bellek donanımdır; içindeki dosyalar ise yazılım/veridir.'),
    fig('dn_ayir.jpg', 'Beş karttan ikisi kutulara yerleşti.'))))
S.append(slide('Ders 3 · Oyun 2', 'Ayırma oyunu: giriş mi, çıkış mı?', split(
    table([['Giriş', 'Bilgisayara bilgi <b>verir</b>: klavye, fare, mikrofon, kamera, tarayıcı (scanner)'],
           ['Çıkış', 'Bilgisayardan bilgi <b>alır</b>: ekran, hoparlör, yazıcı, kulaklık']], 'kv') +
    note('Dokunmatik ekran hem giriştir hem çıkış!'),
    fig('dn_gc.jpg', 'Dokuz kart, iki kutu.'), 1.1, .9)))
S.append(slide('Ders 3 · Konu', 'Depolama: dosyalar nerede durur?', table([
    ['Disk (HDD / SSD)', 'Kasanın içinde. Fotoğraf, belge, program kalıcı durur. <b>Dolap</b> gibi.'],
    ['RAM (bellek)', 'O an açık işler için. <b>Çalışma masası</b> gibi; bilgisayar kapanınca boşalır. Kaydetmediğiniz yazı bu yüzden kaybolur.'],
    ['USB bellek', 'Cebe sığan, takılıp çıkarılan küçük disk. <b>Cep</b> gibi; dosyaları başka bilgisayara götürür.']], 'kv')))
S.append(slide('Ders 1 · Bilgisayarın İçine Yolculuk', '1990’lardan bugüne üç boyutlu', f'''
<div class="twoimg" style="gap:20px">{fig('3b_1990_front.jpg', "1990'lar: bej yatay kasa")}{fig('3b_2000_inside.jpg', "2000'ler: ATX kule, içi açık")}{fig('3b_2025_explode.jpg', '2025: parçalar ayrılmış')}</div>
<p style="margin-top:18px;font-size:21px">Kasayı açın, parçaları ayırın, bir parçaya tıklayıp “Ne işe yarar? Nereye takılır?” sekmelerini okuyun. Üstten <b>Çocuklar / Gençler (teknik)</b> düzeyi seçilir.</p>'''))
S.append(slide('Ders 1 · Bilgisayarın İçine Yolculuk', 'Dört dönem, dört bilgisayar', table([
    ['İşlemci', 'Pentium sınıfı, Socket 7', 'Pentium 4 sınıfı, Socket 478', '4 çekirdek, LGA 1150', '8 çekirdek, AM5'],
    ['RAM', '72-pin EDO SIMM', 'DDR-400', 'DDR3-1600', 'DDR5-6000'],
    ['Depolama', 'IDE HDD, disket, CD-ROM', 'SATA HDD, disket, DVD', 'SATA SSD, HDD, DVD', 'M.2 NVMe'],
    ['Güç kaynağı', '200 W', '350 W', '500 W', '850 W']], 'kv', head=['', "1990'lar", "2000'ler", "2010'lar", '2025']) +
    '<p class="mut" style="margin-top:14px;font-size:17px">Temsilî sistemlerdir; kesin geçiş tarihlerini göstermez. Marka ve model adları uydurmadır.</p>'))
S.append(slide('Ders 1 · Bilgisayarın İçine Yolculuk', '3B uygulamayla neler yapılır?', table([
    ['Kasayı aç · Parçaları ayır', 'Kasanın içini ve parçaların katmanlarını gösterir'],
    ['Parçaya tıkla', 'Ne işe yarar · Nereye takılır · Bu dönemde nasıldı'],
    ['İçini göster', 'HDD’de plakalar döner, CD/DVD’de lazer kızağı hareket eder'],
    ['Karşılaştır', 'Eski ve yeni parça cetvel üzerinde gerçek ölçekte yan yana'],
    ['Güç tüketimi', 'PSU kapasitesi ile anlık tüketim: boşta, ofis, oyun'],
    ['Buldurma oyunu', 'Etiketler gizlenir, soru sorulur, puan tutulur']], 'kv')))
S.append(slide('Ders 2 ve 4 · Kasanın içi', 'Parçalar ve görevleri', split(
    table([['Anakart', 'Bütün parçaların takıldığı büyük kart: <b>şehrin yolları</b>'],
           ['İşlemci (CPU)', 'Hesapları yapan <b>beyin</b>'],
           ['RAM', '<b>Çalışma masası</b>: o an açık işler'],
           ['Disk (SSD / HDD)', '<b>Dolap</b>: dosyalar kalıcı durur'],
           ['Ekran kartı', 'Görüntüyü hazırlayıp ekrana gönderir'],
           ['Güç kaynağı', 'Prizdeki elektriği parçalara uygun hâle getirir'],
           ['Fan', 'Isınan parçaları soğutur; vınlama sesi buradan']], 'kv tight'),
    ul(['Kasanın <b>dışında</b> olanlar çevre birimidir: klavye, fare, monitör, yazıcı, web kamerası.',
        'Daha çok RAM: aynı anda daha çok iş rahatça yapılır. Saklama alanı ise diske bağlıdır.',
        'Dizüstünde aynı parçalar küçültülüp klavyenin altındaki gövdeye sığdırılır; bir de pil vardır.'], 'small') +
    note('Parça parça anlatım: <b>Donanım dersi</b> (3B, 22 adım) ve ayrı <b>Donanım</b> sunusu.'), 1.05, .95)))
S.append(slide('Ders 5 · Portlar ve kablolar', 'Hangi kablo nereye takılır?', split(
    table([['USB-A', 'Dikdörtgen: fare, klavye, USB bellek, yazıcı'],
           ['USB-C', 'Küçük ve oval; iki yönlü takılır: telefonlar, yeni dizüstüler'],
           ['HDMI', 'Görüntü ve ses: monitör, televizyon'],
           ['Yeşil ses girişi', 'Kulaklık, hoparlör'], ['Pembe ses girişi', 'Mikrofon'],
           ['Ethernet', 'İnternet kablosu (modemden)']], 'kv'),
    ul(['Girmiyorsa <b>zorlamayın</b>; çevirip yeniden deneyin.',
        'Telefondan fotoğraf: <b>şarj kablosunu</b> USB’ye takın, telefonda “Dosya aktarımı”nı seçin.',
        'Hep takılı kalacak kablolar (fare, klavye) kasanın <b>arkasına</b>; USB bellek gibi takıp çıkardıklarınız öne.'], 'small') +
    note('3B uygulamada <b>Arka panel</b> görünüşüne geçip portlara tıklayın.'), 1.05, .95)))
S.append(slide('Ders 6 · İlan okuma', 'KB, MB, GB ne demek?', split(
    table([['KB', 'Kısa bir yazı'], ['MB', 'Bir fotoğraf ≈ 3–5 MB, bir şarkı ≈ 4 MB'],
           ['GB', 'Bir film ≈ 2–4 GB'], ['TB', '1 TB ≈ 1000 GB ≈ 250.000 fotoğraf']], 'kv') +
    note('Her biri bir öncekinin yaklaşık <b>1000 katı</b>. Sıra: 64 GB &lt; 500 GB &lt; 1 TB.'),
    '<h2>Kuzey K15 dizüstü bilgisayar</h2>' + table([
        ['Bellek (RAM)', '<b>16 GB</b>: masa, kapanınca boşalır'], ['Depolama', '<b>512 GB SSD</b>: fotoğraflar burada durur'],
        ['Ekran', '<b>15,6 inç</b>: köşeden köşeye (1 inç ≈ 2,5 cm)'], ['İşletim sistemi', '<b>Windows 11 Home</b>: tek yazılım satırı'],
        ['Bağlantılar', '<b>HDMI</b> ile televizyona bağlanır']], 'kv tight'), .9, 1.1)))
S.append(slide('Ders 6 · İlan okuma', 'Kendi bilgisayarınızda bakın', adim([
    f'{K("⊞")} tuşuna basın, <b>hakkında</b> yazın, <b>Bilgisayarınız hakkında</b>’yı açın: <b>Yüklü RAM</b> satırına bakın.',
    'Dosya Gezgini’nde soldan <b>Bu bilgisayar</b>’a tıklayın: diskin ne kadarının dolu olduğunu çubuk gösterir.',
    'İki ilanı karşılaştırırken: fotoğraf ve video saklayacaksanız <b>depolamaya</b> (GB, TB), aynı anda çok iş yapacaksanız <b>RAM</b>’e bakın.']) +
    note('<b>SSD</b>, eski tip diskten (HDD) çok daha hızlı ve sessizdir.')))
S.append(slide('Ders 7 · Bakım', 'Bilgisayarın sağlığı', table([
    ['Ekran temizliği', 'Kapalıyken, kuru ya da hafif nemli yumuşak bezle. Cam sil püskürtmeyin.'],
    ['Havalandırma', 'Deliklerin önü açık; dizüstü yorganda değil, masa gibi sert yüzeyde'],
    ['Güncellemeler', 'Ertelemeyin: güvenlik açıklarını kapatır'],
    ['Elektrik', 'Akım korumalı priz; şimşekli fırtınada kapatıp fişi çekin'],
    ['Sıvı döküldüyse', 'Hemen kapatıp fişi çekin, ters çevirip en az bir gün kurutun']], 'kv') +
    note('Kapatırken fişi çekmeyin: Başlat’tan kapatın. Önemli dosyaları yedekleyin.')))
S.append(slide('Ders 7 · Sağlıklı ve güvenli çalışma', 'Oturuş, mola, elektrik', table([
    ['Ekran', 'Bir kol boyu (50–70 cm) uzakta; üst kenarı göz hizasında ya da biraz altında'],
    ['Oturuş', 'Sırt dik ve desteklenmiş, ayaklar yerde, dirsekler 90 derece, bilekler düz'],
    ['Mola', 'Her saat 5–10 dakika kalkın. <b>20-20-20:</b> 20 dakikada bir, 20 saniye uzağa bakın'],
    ['Kablolar', 'Yürüme yolunda olmasın; prizi aşırı yüklemeyin'],
    ['Kasa', 'Kendiniz açmayın; parça takılacaksa servise götürün'],
    ['Elektrik yangını', '<b>Su dökülmez!</b> Fişi çekin; karbondioksitli ya da kuru kimyevi tozlu söndürücü. Büyürse 112']], 'kv') +
    note('Yangın alarmında eşyalarla uğraşmadan en yakın acil çıkıştan çıkın; asansör kullanmayın.')))
S.append(slide('Ders 8 · Sorun giderme', 'Bir şey çalışmıyor! İlk kontroller', split(
    adim(['<b>Kablo ve düğme:</b> takılı mı, açık mı?', '<b>Ses:</b> sessizde mi, kulaklık takılı mı?',
          '<b>Pil:</b> kablosuz fare ve klavyede', '<b>Modem:</b> kapatıp 10 saniye sonra açın',
          '<b>Yeniden başlat:</b> çoğu sorunu çözer', '<b>Danışın:</b> ekranın resmini çekip (Ekran Alıntısı) güvendiğiniz birine gösterin']),
    table([['Kapkara ekran, kasa ışığı yanıyor', 'Ekranın kendi düğmesi ve kablosu'],
           ['Türkçe harfler yok', 'Sağ altta ENG yerine TUR'],
           ['Program dondu', 'Bekleyin; olmazsa kapatın, yeniden başlatın']], 'kv tight') +
    note('<b>Asla:</b> ekranda çıkan “destek hattı” numarasını aramayın.'), 1, 1)))
S.append(slide('Özet', 'Bu hafta öğrendiklerimiz', ozet([
    ['Donanım', 'Elle tutulan parçalar: klavye, fare, ekran, kasa, yazıcı'],
    ['Yazılım', 'Programlar: Windows, Not Defteri, Paint, tarayıcı'],
    ['Giriş / Çıkış', 'Bilgisayara bilgi verir / bilgisayardan bilgi alır'],
    ['Depolama', 'Dosyaların kalıcı durduğu yer: disk, USB bellek'],
    ['RAM', 'Çalışma masası: bilgisayar kapanınca boşalır'],
    ['İşlemci · anakart', 'Beyin · şehrin yolları'],
    ['USB · HDMI · Ethernet', 'Fare, bellek · ekran, TV · internet kablosu'],
    ['KB → MB → GB → TB', 'Her biri yaklaşık 1000 katı'],
    ['20-20-20', '20 dakikada bir, 20 saniye uzağa bakın'],
    ['Sorun olunca', 'Kablo, ses, pil, modem, yeniden başlat, danış']],
    'altı küçük görev', '10 soru ve 15 soruluk donanım testi')))
write('hafta4', '4. Hafta', 'Bilgisayar İşletmenliği – 4. Hafta Alıştırmaları', S)

# ================================================================ HAFTA 5
S = []
S.append(cover('5. Hafta: Masaüstü, Başlat menüsü ve pencereler', 'Alıştırmalar', 'Alıştırma bilgisayarında uygulamalı ders'))
S.append(slide('Bu hafta', 'On üç ders', plan([
    ('Masaüstü, Başlat ve görev çubuğu', 25), ('Masaüstünü düzenleyin', 20),
    ('Hesap Makinesi ile günlük hesaplar', 25), ('Yapışkan Notlar, Ses Kaydedici, Alarm', 30), ('Takvim: randevu ve hatırlatıcı', 25),
    ('Fareyi kendinize göre ayarlayın', 25), ('Büyüteç ve okuma kolaylıkları', 20), ('Ekran Klavyesi', 20),
    ('Program dondu! Görev Yöneticisi', 30), ('Görev Yöneticisi: kim yoruyor?', 25),
    ('İki pencereyi yan yana koymak', 20), ('Sanal masaüstleri', 25), ('Masaüstü parkuru', 20)],
    'altı küçük görev', 11)))
S.append(slide('Ders 1 · Masaüstü', 'Masaüstünün parçaları (25 dk)', split(
    ul(['<b>Simgeler:</b> sol taraftaki küçük resimler.',
        '<b>Görev çubuğu:</b> en alttaki şerit.',
        '<b>Başlat:</b> görev çubuğunun ortasında; bütün programlar burada.',
        '<b>Ara:</b> program ya da dosya aramak için.',
        'Sağ altta <b>saat</b>, <b>ses</b> ve <b>internet</b> simgeleri.'], 'small'),
    fig('ms_parca.jpg', 'Alıştırma masaüstü.'))))
S.append(slide('Ders 1 · Alıştırma 1', 'Program açmanın iki yolu', split(
    table([['1', 'Başlat’a tıklayın, açılan menüden <b>Paint</b>’e tıklayın.'],
           ['2', f'Başlat’ı açıp hemen <b>hesap</b> yazın, {K("Enter")}’a basın.']], 'kv') +
    note('Gerçek bilgisayarda da ⊞ tuşuna basıp yazmaya başlamak en hızlı yoldur.'),
    fig('ms_ara.jpg', 'Yazdıkça sonuçlar değişir; en üstte “En iyi eşleşme”.'))))
S.append(slide('Ders 1 · Alıştırma 2', 'Görev çubuğu ve masaüstünü göstermek', split(
    ul(['İki program açıkken görev çubuğunda simgelerinin altında küçük bir çizgi görünür.',
        'Bir simgeye tıklayın: o program <b>öne gelir</b>. Öndekine bir daha tıklarsanız <b>küçülür</b>.',
        'Çubuğun <b>en sağ köşesindeki ince çizgiye</b> tıklayın: bütün pencereler küçülür. Bir daha tıklayınca geri gelir.'], 'small'),
    fig('ms_gorev.jpg', 'Paint ve Hesap Makinesi açık.'))))
S.append(slide('Ders 1 · Alıştırma 3', 'Alt + Tab ve ses düzeyi', split(
    table([[K('Alt', 'Tab'), 'Alt’ı basılı tutup Tab’a basın: açık programlar arasında geçersiniz.'],
           ['Ses simgesi', 'Sağ alttaki simgeye tıklayın, ses çubuğunu sürükleyin.']], 'kv') +
    note('Hoparlörden ses gelmiyorsa ilk bakılacak yer ses düzeyidir.'),
    fig('ms_ses.jpg', 'Hızlı ayarlar: Wi-Fi, Bluetooth, parlaklık, ses.'))))
S.append(slide('Ders 1–2 · Başlat ve masaüstü', 'Başlat menüsü ve derli toplu masaüstü', split(
    table([[K('Esc'), 'Başlat’ı kapatır'], ['Başlat açıkken yazmak', 'Arama yapar: <b>dosya</b> → Dosya Gezgini'],
           ['🔍 Ara', 'Görev çubuğundan doğrudan arama'], ['⏻ Güç', 'Uyku, Kapat, Yeniden başlat'],
           [K('⊞', 'E') + ' · ' + K('⊞', 'I'), 'Dosya Gezgini · Ayarlar'],
           [K('⊞', 'D') + ' · ' + K('⊞', 'L'), 'Masaüstünü göster · bilgisayarı kilitle']], 'kv'),
    '<h2>Masaüstünü toparlamak</h2>' + adim([
        'Boş yere sağ tık → <b>Yeni → Klasör</b>; adını yazıp Enter',
        'Dosyaları sürükleyip klasörün üzerine bırakın',
        'Sağ tık → <b>Görünüm → Büyük simgeler</b>',
        'Sağ tık → <b>Kişiselleştir</b>: arka plan',
        'Geri Dönüşüm Kutusu’na sağ tık → <b>Geri Dönüşüm Kutusunu boşalt</b>'], 'small'), 1, 1)))
S.append(slide('Ders 3 · Hesap Makinesi', 'Günlük hesaplar', split(
    table([['Market', '45 + 32,50 + 18 = <b>95,50 TL</b>'], ['Faturalar', '412,50 + 187,30 = <b>599,80 TL</b>'],
           ['Kişi başı', '1.200 ÷ 4 = <b>300 TL</b>'], ['Bir yıl', '750 × 12 = <b>9.000 TL</b>'],
           ['%20 indirim', '2000 − 20 % = → <b>1.600 TL</b>'], ['Para üstü', '200 − 137,50 = <b>62,50 TL</b>']], 'kv'),
    ul([', (virgül) kuruş için: <b>32,50</b>.',
        '<b>⌫</b> son yazılan rakamı siler, <b>C</b> her şeyi sıfırlar.',
        f'Klavyeyle de olur: rakamlar, {K("*")} çarpma, {K("/")} bölme, {K("Enter")} eşittir.'], 'small'), 1.05, .95)))
S.append(slide('Ders 4 · Küçük yardımcılar', 'Yapışkan Notlar, Ses Kaydedici, Alarm', table([
    ['🗒 Yapışkan Notlar', 'Renkli kısa notlar; kapatınca silinmez. <b>＋ Yeni not</b>, rengi üstteki noktalardan, silmek için 🗑'],
    ['🎙 Ses Kaydedici', 'Kırmızı <b>●</b> ile başlar, <b>■</b> ile durur. Kayıt Belgeler › Ses kayıtları klasörüne gider'],
    ['⏰ Saat → Alarm', 'Belirli bir saatte çalar; adını yazın: <b>İlaç saati</b> → ＋ Ekle. Çalınca 💤 <b>Ertele (5 dk)</b>'],
    ['⏳ Zamanlayıcı', 'Şu andan belli bir süre sonra çalar: çay demi, fırındaki yemek']], 'kv') +
    note('Hepsi Başlat menüsündedir. Alarm için bilgisayar <b>açık</b>, sesi <b>açık</b> olmalı; sessizdeyse çalmaz.')))
S.append(slide('Ders 5 · Takvim', 'Randevu ve hatırlatıcı', split(
    adim(['⊞ Başlat’tan 📅 <b>Takvim</b>’i açın (Başlat’ta <b>takvim</b> yazmak da olur).',
          'Bir güne tıklayın; altta <b>＋ Randevu ekle</b>: <b>Doktor randevusu</b>, saat 10:30, hatırlatma <b>15 dk önce</b> → Ekle.',
          'Randevudan 15 dakika önce sağ altta bildirim çıkar.',
          'İptal olan randevunun yanındaki <b>✕</b> ile silin.']),
    ul(['Günün altındaki küçük nokta: o gün randevu ya da not var demektir.',
        'Hatırlatma, bilgisayar <b>açıkken</b> ve sesi açıkken gelir; kapalıyken gelmez.'], 'small'), 1.25, .75)))
S.append(slide('Ders 6 · Fare ayarı', 'Fareyi kendinize göre ayarlayın', split(
    table([['Çift tıklama hızı', 'Çift tık zorsa çubuğu <b>yavaş</b> tarafa çekin (3 ya da daha az)'],
           ['Birincil düğme', 'Sol elini kullananlar için <b>Sağ</b>; ortak bilgisayarda yine Sol yapın'],
           ['Fare işaretçisi', 'İmleci bulamıyorsanız boyutu <b>Çok büyük</b>, rengi <b>Sarı</b>']], 'kv') +
    note('Ayarlar → <b>Bluetooth ve cihazlar</b> → Fare. İmleç: Ayarlar → <b>Erişilebilirlik</b> → Fare işaretçisi.'),
    fig('fa_fare.jpg', 'Bluetooth ve cihazlar: Fare bölümü, çift tıklama hızı.'), 1, 1)))
S.append(slide('Ders 7–8 · Erişilebilirlik', 'Büyüteç, okuma kolaylığı, Ekran Klavyesi', split(
    table([[K('Ctrl') + ' + tekerlek', 'Penceredeki yazıyı büyütür / küçültür (' + K('Ctrl', '+') + ' / ' + K('Ctrl', '−') + ')'],
           [K('⊞', '+') + ' · ' + K('⊞', 'Esc'), '<b>Büyüteç</b>: bütün ekranı yakınlaştırır · kapatır'],
           ['Metin boyutu', 'Bütün yazıları büyütür'],
           ['Ekran klavyesi', 'Önce yazılacak yere tıklayın, sonra ekrandaki tuşlara. Tuş bozuksa işe yarar']], 'kv') +
    note('Hepsi Ayarlar → <b>Erişilebilirlik</b> sayfasında. Ekran klavyesi için Başlat’a <b>ekran klavyesi</b> yazmak da olur.'),
    fig('fa_erisim.jpg', 'Erişilebilirlik: metin boyutu, fare işaretçisi, Büyüteç, Ekran klavyesi.'), 1, 1)))
S.append(slide('Ders 9 · Görev Yöneticisi', 'Program dondu!', split(
    adim(['Önce biraz <b>bekleyin</b>: program çoğu zaman ağır bir işi bitirince kendine gelir.',
          'Görev çubuğuna sağ tık → <b>Görev Yöneticisi</b> (' + K('Ctrl', 'Shift', 'Esc') + ').',
          '<b>Yanıt vermiyor</b> yazan satıra tıklayın.',
          '⊘ <b>Görevi sonlandır</b>. Kaydedilmemiş iş kaybolur.'], 'small') +
    note('Bilgisayar tamamen kilitlendiyse ' + K('Ctrl', 'Alt', 'Delete') + '. <b>Başlangıç uygulamaları</b>: açılışı yavaşlatan gereksizleri devre dışı bırakın.'),
    fig('gy_dondu.jpg', 'İşlemler: Kelime İşlemci “Yanıt vermiyor”.'), 1, 1)))
S.append(slide('Ders 10 · Görev Yöneticisi', 'Bilgisayarı kim yoruyor?', split(
    table([['Sütun başlığı', 'Tıklayınca sıralar: en çok kullanan en üste çıkar'],
           ['İşlemci', 'Çalışma yükü; sürekli yüksekse bilgisayar ağırlaşır'],
           ['Bellek', 'Tuttuğu hafıza (MB); tarayıcılar çok tutar'],
           ['Disk ve Ağ', 'Tanımadığınız bir programın ağ kullanması şüphelidir'],
           ['▶ Yeni görev çalıştır', '<b>notepad</b>, <b>calc</b>, <b>mspaint</b> yazarak program açar']], 'kv tight') +
    note('Tanımadığınız program: adını internette aratın, güvenli değilse açılışta çalışmasını kapatın.'),
    fig('gy_ayrinti.jpg', 'İşlemciye göre sıralı: en üstte tanınmayan “Süper Arama Yardımcısı”.'), 1, 1)))
S.append(slide('Ders 11–12 · Pencereler', 'Yan yana pencere, sanal masaüstü', split(
    '<h2>İki pencere yan yana</h2>' + table([
        ['Başlık çubuğunu kenara sürükleyin', 'Gölge çıkınca bırakın: pencere o yarıya yerleşir; öbür yarıda çıkan listeden ikinci pencereyi seçin'],
        ['☐ üzerinde bekleyin', 'Küçük yerleşim kutusu: sol yarı ya da sağ yarı'],
        [K('⊞', '←') + ' / ' + K('⊞', '→') + ' · ' + K('⊞', '↑'), 'Sola / sağa yasla · ekranı kapla'],
        ['Ortaya sürükleyin', 'Pencere eski boyutuna döner']], 'kv tight'),
    '<h2>Sanal masaüstleri</h2>' + table([
        [K('⊞', 'Tab') + ' ya da ⧉', 'Görev Görünümü'],
        ['＋ Yeni masaüstü', K('⊞', 'Ctrl', 'D')],
        [K('⊞', 'Ctrl', '←') + ' / ' + K('→'), 'Masaüstleri arasında geçiş'],
        ['Pencereye sağ tık', '<b>Şuraya taşı</b> → Masaüstü 2'],
        ['Masaüstündeki ✕', 'Kapatır; pencereler yandakine geçer']], 'kv tight'), 1, 1)))
S.append(slide('Ders 13 · Tekrar', 'Masaüstü parkuru', table([
    ['Masaüstü parkuru', '10 görev, yönlendirme yok: arayarak aç, hesap yap (1250 − 375), Alt + Tab, masaüstünü göster, sesi kapat-aç.']], 'kv') +
    note('Masaüstündeki program simgesi yalnızca <b>kısayoldur</b>; silinse de program Başlat menüsünde durur.')))
S.append(slide('Özet', 'Bu hafta öğrendiklerimiz', ozet([
    ['Başlat', 'Bütün programlar; açınca hemen yazarak arayın'],
    ['Görev çubuğu', 'Açık programlar: tıklayınca öne gelir ya da küçülür'],
    ['Sağ alt köşe · Alt + Tab', 'Masaüstünü göster · pencereler arasında geç'],
    ['Ses ve Wi-Fi simgeleri', 'Ses düzeyi ve internet bağlantısı'],
    ['Sağ tık → Yeni → Klasör', 'Masaüstünde yeni klasör'],
    ['Hesap Makinesi', '+ − × ÷, virgül kuruş için, 2000 − 20 % ='],
    ['Yapışkan Notlar · Saat', 'Kısa notlar · alarm ve zamanlayıcı'],
    ['Takvim', 'Randevu + hatırlatma (bilgisayar açıkken)'],
    ['Ayarlar → Bluetooth ve cihazlar', 'Fare: çift tıklama hızı'],
    ['Ayarlar → Erişilebilirlik', 'Fare işaretçisi, Büyüteç, Ekran klavyesi'],
    ['Ctrl + Shift + Esc', 'Görev Yöneticisi: Görevi sonlandır'],
    ['⊞ + ← / →', 'Pencereyi sola / sağa yasla'],
    ['⊞ + Tab', 'Görev Görünümü, sanal masaüstleri']],
    'altı küçük görev', 11)))
write('hafta5', '5. Hafta', 'Bilgisayar İşletmenliği – 5. Hafta Alıştırmaları', S)

# ================================================================ HAFTA 6
S = []
S.append(cover('6. Hafta: Dosyalar ve klasörler', 'Alıştırmalar', 'Dosya Gezgini ve USB bellek'))
S.append(slide('Bu hafta', 'On bir ders', plan([
    ('Dosyalar ve klasörler', 30), ('Dosya türleri ve uzantılar', 20), ('Resim ve web dosyaları: PNG, JPG, HTML', 40),
    ('Klasör içinde klasör', 25), ('Fotoğraflarla çalışmak', 25), ('Birden çok dosya seçmek', 20),
    ('Kayıp dosyayı bulmak', 20), ('Sıkıştırılmış (zip) dosyalar', 30), ('Geri Dönüşüm Kutusu', 20),
    ('Dosya parkuru', 25), ('Ne yapardınız? Dosya durumları', 20)],
    'sekiz küçük görev', 12)))
S.append(slide('Ders 1 · Dosyalar ve klasörler', 'Dosya, klasör, Dosya Gezgini (30 dk)', split(
    ul(['<b>Dosya:</b> bir yazı, bir fotoğraf, bir şarkı. Bir <b>kâğıt</b> gibi.',
        '<b>Klasör:</b> dosyaları bir arada tutar. İçine başka klasör de konabilir.',
        '<b>Dosya Gezgini:</b> bu klasörlerin hepsini gösteren program.',
        'Yazılarınız genellikle <b>Belgeler</b> klasöründe durur.'], 'small'),
    fig('dg_belgeler.jpg', 'Belgeler klasörü: bir klasör, üç dosya.'))))
S.append(slide('Ders 1 · Alıştırma 1', 'Yeni klasör ve ad değiştirme', split(
    table([['Yeni klasör', 'Üstteki <b>＋ Yeni klasör</b>’e tıklayın, adı seçili gelir: <b>Torunlarım</b> yazıp Enter.'],
           ['Ad değiştir', f'<b>alışveriş listesi</b>’ne bir kez tıklayın, {K("F2")} tuşuna basın, <b>market listesi</b> yazıp Enter.']], 'kv') +
    note('Dosyanın adı değişir; içindeki yazı aynı kalır.'),
    fig('dg_klasor.jpg', 'Torunlarım klasörü oluştu.'), 1.05, .95)))
S.append(slide('Ders 1 · Alıştırma 2', 'Taşımak, kopyalamak, geri dönmek', table([
    ['Taşı', '<b>torun fotoğrafı</b>’nı tutup Torunlarım klasörünün üzerine sürükleyin. Klasör <b>maviye boyanınca</b> bırakın.'],
    ['Geri', 'Sol üstteki <b>←</b> okuna tıklayın: bir önceki klasöre dönersiniz.'],
    ['Kopyala', f'<b>telefon numaraları</b>’nı seçin → <b>Kopyala</b> ({K("Ctrl", "C")}) → Masaüstü’ne gidin → <b>Yapıştır</b> ({K("Ctrl", "V")}).']], 'kv') +
    note('Taşımada dosya yer değiştirir. Kopyalamada asıl dosya yerinde kalır, bir kopyası oluşur.')))
S.append(slide('Ders 1 · Alıştırma 3', 'Silmek ve Geri Dönüşüm Kutusu', f'''
<div class="steps4" style="margin-top:6px">
<div><div class="n">1</div><span>Kopyayı seçin, {K('Delete')} tuşuna basın.</span></div>
<div><div class="n">2</div><span>Dosya silinir… ama <b>tamamen değil</b>: Geri Dönüşüm Kutusu’na gider.</span></div>
<div><div class="n">3</div><span>Kutuyu açın, dosyayı seçin, <b>♻ Geri yükle</b>’ye tıklayın.</span></div></div>
{note('Yanlışlıkla silmelerde bu kutu bir can simididir. Kutuyu <b>boşaltırsanız</b> içindekiler tamamen silinir.')}'''))
S.append(slide('Ders 1 · Alıştırma 4', 'Arama', split(
    ul(['<b>Belgeler</b>’e gidin, sağ üstteki <b>Ara</b> kutusuna <b>fatura</b> yazın.',
        'Faturalar klasörünün içindeki dosyalar da bulunur.',
        'Bir dosyanın nerede olduğunu unuttuğunuzda arama kurtarır.'], 'small'),
    fig('dg_ara.jpg', '“fatura” araması: üç sonuç.'))))
S.append(slide('Ders 1 · Alıştırma 5', 'USB bellek', split(
    table([['Tak', 'USB belleği bilgisayara takın: soldaki listeye <b>USB Bellek (E:)</b> eklenir.'],
           ['Kopyala', '<b>Resimler</b>’deki tatil fotoğrafını USB’nin üzerine sürükleyin. Farklı sürücüye sürüklenen dosya <b>kopyalanır</b>.'],
           ['Çıkar', 'Çekmeden önce <b>⏏ Çıkar</b>. “Artık çıkarılabilir” yazısını görünce çekin.']], 'kv'),
    fig('dg_usb.jpg', 'USB takılınca bildirim çıkar.'), 1.1, .9)))
S.append(slide('Ders 2 · Dosya türleri', 'Dosyanın soyadı: uzantı', split(
    table([['.txt', 'Düz yazı (Not Defteri)'], ['.docx', 'Word belgesi'],
           ['.pdf', 'Değiştirilmeyen belge: fatura, dilekçe, e-Devlet çıktısı'],
           ['.jpg / .png', 'Fotoğraf, resim'], ['.mp3 / .mp4', 'Müzik / video'],
           ['.zip', 'Sıkıştırılmış paket: içinde birçok dosya'],
           ['.exe', '<b>Program!</b> Tanımadığınız yerden geldiyse açmayın']], 'kv tight'),
    ul(['<b>tatil.jpg</b> → adı tatil, türü jpg (fotoğraf).',
        '<b>kargo_bilgisi.pdf.exe</b>: gerçek tür en sondaki uzantıdır. PDF gibi görünen bir program; <b>açmayın</b>.',
        'Ad değiştirirken (F2) yalnızca noktadan önceki kısmı değiştirin; uzantıya dokunmayın.',
        'Uzantılar görünmüyorsa: Dosya Gezgini → <b>Görünüm → Göster → Dosya adı uzantıları</b>.'], 'small'), 1, 1)))
S.append(slide('Ders 3 · Resim ve web dosyaları', 'PNG mi, JPG mi? Web sayfası da bir dosya', split(
    table([['JPG (JPEG)', 'Fotoğraflar için: küçük boyutlu, çok renkli'],
           ['PNG', 'Çizim, logo, ekran alıntısı, yazılı görsel: net kenarlı, kayıpsız'],
           ['GIF', 'Kısa hareketli resimler'], ['BMP', 'Eski ve çok yer kaplar; kullanmayın'],
           ['Kayıt türü', 'Kaydet penceresinde uzantıyı belirler: PNG, JPEG, Tüm Dosyalar']], 'kv tight'),
    '<h2>İlk web sayfanız</h2>' + adim([
        'Not Defteri’ne yazın: <b>&lt;h1&gt;Merhaba&lt;/h1&gt;</b> ve <b>&lt;p&gt;Bu benim ilk web sayfam.&lt;/p&gt;</b>',
        K('Ctrl', 'S') + ': Kayıt türü <b>Tüm Dosyalar</b>, ad <b>sayfam.html</b> (yoksa sonuna .txt eklenir).',
        'Belgeler’de sayfam.html’e çift tıklayın: tarayıcı sayfayı çizer.',
        K('Ctrl', 'U') + ': sayfanın kaynağı, yani yazı hâli.'], 'small') +
    note('&lt; ve &gt;: Z’nin solundaki tuş (&gt; için Shift ile). Fotoğraf göndermek için JPG, ekran alıntısı için PNG.'), .95, 1.05)))
S.append(slide('Ders 4–5 · Klasörler ve fotoğraflar', 'Dolap, çekmece, dosya', split(
    table([['İç içe klasör', 'Belgeler › Ev › Faturalar: dolap → çekmece → dosya'],
           ['Adres çubuğu', 'Neredeyim? Bir ada tıklayınca o klasöre döner'],
           ['← Geri', 'Bir önceki klasör'],
           ['Ara', 'İçteki bütün klasörlere de bakar']], 'kv'),
    table([['🖼 Resimler', 'Fotoğrafların durduğu klasör'],
           ['Çift tık · ◀ ▶', 'Fotoğrafı açar · önceki / sonraki'],
           ['＋ / －', 'Yakınlaştır / uzaklaştır'],
           ['Sağ tık', '<b>Masaüstü arka planı olarak ayarla</b>'],
           [K('Ctrl', 'C') + ' → ' + K('Ctrl', 'V'), 'Albüm klasörüne kopyalar; asılları yerinde kalır']], 'kv'), 1, 1)))
S.append(slide('Ders 6 · Birden çok dosya seçmek', 'Ctrl ve Shift ile seçmek', split(
    table([[K('Ctrl') + ' + tık', 'Cımbız gibi: aradan istediklerinizi tek tek seçer'],
           [K('Shift') + ' + tık', 'İlk tıkladığınızdan ikinciye kadar aradakilerin hepsi'],
           ['Boş yerden sürükleyin', 'Çerçevenin içine giren her şey seçilir'],
           [K('Ctrl', 'A'), 'Klasördeki her şey'],
           ['☐ Onay kutuları', 'Tuşa basmadan, kutucuklarla seçmek']], 'kv') +
    note('Seçim duruyorken ' + K('Ctrl', 'C') + ' ya da ' + K('Delete') + ': hepsine birden uygulanır. 3., 17. ve 42. fotoğraf: Ctrl. 1’den 20’ye: Shift.'),
    fig('dg_coklu.jpg', 'Tatil fotoğrafları: 16 fotoğraf, dördü bulanık.'), 1, 1)))
S.append(slide('Ders 7 · Kayıp dosya', '“Az önce kaydettim, nereye gitti?”', split(
    adim(['📁 Dosya Gezgini → <b>🏠 Giriş</b>: son açılan ve kaydedilen dosyalar en üstte; yanında konumu yazar.',
          'Dosyaya sağ tık → <b>Dosya konumunu aç</b>.',
          '<b>Bu Bilgisayar</b>’dayken Ara kutusuna adının bir parçasını yazın: bütün klasörlere bakar.',
          '<b>Sırala: Tarih</b>: en yeni en üstte, “Bugün”, “Dün” diye gruplanır.',
          'İnternetten indirdiyseniz tarayıcıda ' + K('Ctrl', 'J') + ' → <b>Klasörde göster</b>.'], 'small') +
    note('Kaydederken pencerenin üstündeki klasör adına bakın; emin değilseniz Belgeler’i seçin.'),
    fig('dg_giris.jpg', 'Giriş: son kullanılan dosyalar ve konumları.'), 1.05, .95)))
S.append(slide('Ders 8–9 · Zip ve Geri Dönüşüm Kutusu', 'Paketler ve silinen dosyalar', split(
    table([['☰ Ayrıntılar', 'Boyut, tarih, tür sütun sütun; başlığa tıklayınca sıralar'],
           ['.zip', 'Birden çok dosyanın küçültülmüş paketi'],
           ['Tümünü ayıkla', 'Zip’in içindekileri normal bir klasöre çıkarır'],
           ['Klasöre sağ tık', '<b>Sıkıştırılmış (zip) klasöre gönder</b>: klasör tek dosya olur (e-postayla göndermek için)']], 'kv tight'),
    table([['Silmenin üç yolu', 'Kutuya sürükle · ' + K('Delete') + ' · sağ tık → Sil'],
           ['♻ Geri yükle', 'Dosyayı eski yerine koyar'],
           ['Kutuyu boşalt', 'İçindekiler tamamen silinir; geri gelmez']], 'kv tight') +
    note('USB bellekten silinen dosya kutuya <b>gitmez</b>, doğrudan silinir. Önemli dosyaların yedeğini alın.'), 1, 1)))
S.append(slide('Ders 10–11 · Tekrar', 'Dosya parkuru ve günlük durumlar', table([
    ['Dosya parkuru', 'Dağınık Belgeler’i toparlayın: Sağlık klasörü, taşıma, silineni geri getirme, ad değiştirme, USB’ye yedek, güvenle çıkarma.'],
    ['Torunun USB’si', 'Fotoğrafları Resimler’e <b>kopyalayın</b>; aslı USB’de kalsın.'],
    ['“Biçimlendirmeniz gerekiyor”', '<b>Basmayın</b>: içindekiler silinir. İptal deyip danışın.'],
    ['Disk dolu', 'İndirilenler’i ve kutuyu temizleyin, büyük videoları USB’ye taşıyın.'],
    ['Dosya adında olmaz', '\\ / : * ? " |']], 'kv') +
    note('Aynı klasöre yapıştırınca Windows ada “- Kopya” ekler; iki dosya birbirinden bağımsızdır.')))
S.append(slide('Özet', 'Bu hafta öğrendiklerimiz', ozet([
    ['＋ Yeni klasör', 'Boş klasör; adını hemen yazın'], ['F2', 'Seçili dosyanın adını değiştir'],
    ['Sürükle-bırak', 'Klasöre taşı (USB’ye sürüklemek kopyalar)'],
    ['Ctrl + C → Ctrl + V', 'Dosyayı kopyala-yapıştır'], ['Delete · ♻ Geri yükle', 'Sil · silineni geri koy'],
    ['⏏ Çıkar', 'USB belleği çekmeden önce'],
    ['Uzantı', '.pdf, .jpg, .zip…; .exe programdır'], ['JPG · PNG', 'Fotoğraf · ekran alıntısı, çizim'],
    ['Adres çubuğu', 'Belgeler › Ev › Faturalar'], ['Ctrl + tık · Shift + tık', 'Tek tek · aradaki hepsi'],
    ['🏠 Giriş · Sırala: Tarih', 'Kayıp dosyayı bulmak'], ['Tümünü ayıkla', 'Zip paketini açmak']],
    'sekiz küçük görev', 12)))
write('hafta6', '6. Hafta', 'Bilgisayar İşletmenliği – 6. Hafta Alıştırmaları', S)

# ================================================================ HAFTA 7
S = []
S.append(cover('7. Hafta: Paint, Ekran Alıntısı ve Ayarlar', 'Alıştırmalar', 'Alıştırma bilgisayarında uygulamalı ders'))
S.append(slide('Bu hafta', 'On bir ders', plan([
    ('Paint ile resim', 25), ('Paint ile tebrik kartı', 25), ('Ekran Alıntısı', 20),
    ('Ayarlar', 30), ('Saati ve tarihi değiştirmek', 30), ('Denetim Masası', 35),
    ('Kısayol, ekran ayarı ve geri yükleme', 30),
    ('Temalar ve Mağaza', 35), ('Bluetooth: kulaklık, hoparlör', 25),
    ('Şifre, PIN, ekranı kilitlemek', 25), ('Ayarlar parkuru', 25)],
    'altı küçük görev', 12)))
S.append(slide('Ders 1 · Paint (25 dk)', 'Çizmek: kalem, renk, fırça', split(
    ul(['<b>Paint</b>, Windows’la gelen basit bir çizim programıdır.',
        'Kalemle çizmek için sol tuşu <b>basılı tutup</b> fareyi gezdirin.',
        'Önce <b>renge</b> tıklayın, sonra çizin.',
        '<b>Fırça</b> ve <b>Kalın</b> kalınlığı seçip daha kalın çizgi çizin.'], 'small'),
    fig('pt_cizim.jpg', 'Kırmızı dikdörtgen, sarı dolgu, kalemle çatı, mavi fırça.'))))
S.append(slide('Ders 1 · Paint', 'Şekil, doldurma, yazı, silgi, kaydetme', table([
    ['▭ Dikdörtgen', 'Bir köşeden başlayıp <b>çapraz</b> sürükleyin. Elips ve çizgi de aynı şekilde çizilir.'],
    ['🪣 Doldur', 'Rengi seçin, kenarları kapalı bir alanın <b>içine</b> tıklayın.'],
    ['A Metin · Silgi', 'Metin: resme yazı ekler. Silgi: bir yeri siler.'],
    [K('Ctrl', 'Z'), 'Son yaptığınızı geri alır.'],
    [K('Ctrl', 'S'), 'Resimler klasörüne <b>ilk resmim</b> adıyla kaydedin. Sonra resme sağ tıklayıp <b>Masaüstü arka planı olarak ayarla</b>.']], 'kv')))
S.append(slide('Ders 2 · Paint alıştırması', 'Tebrik kartı', split(
    table([['▭ Dikdörtgen', 'Bir köşeden karşı köşeye sürükleyin: kartın çerçevesi'],
           ['╱ Çizgi', 'Başlangıçtan bitişe: süs, şerit'],
           ['◯ Elips', 'Güneş, balon. Shift basılıyken tam daire'],
           ['🪣 Doldur', 'Kapalı şeklin içine tıklayın; boş tuvale tıklarsanız bütün arka plan boyanır'],
           ['A Metin', 'Tıklayın, yazın: <b>İyi ki doğdun!</b>']], 'kv tight'),
    ul(['Kartı <b>doğum günü kartı</b> adıyla ' + K('Ctrl', 'S') + ' ile kaydedin.',
        'Beğenmediğinizi ' + K('Ctrl', 'Z') + ' ile geri alın.',
        'Kartı masaüstüne koymak: Resimler’de karta sağ tık → <b>Masaüstü arka planı olarak ayarla</b>.'], 'small'), 1.1, .9)))
S.append(slide('Ders 3 · Ekran Alıntısı (20 dk)', 'Ekranın fotoğrafını çekmek', two(
    'al_once.jpg', '1. Ekran Alıntısı’nı açıp <b>＋ Yeni</b>’ye tıklayın.', 'al_sonra.jpg', '2. İstediğiniz yeri çerçeveleyin: resim panoya kopyalanır.')))
S.append(slide('Ders 3 · Ekran Alıntısı', 'Alıntıyı kullanmak', table([
    ['Paint’e yapıştır', f'Paint’i açıp {K("Ctrl", "V")}. Üzerine çizebilir, yazı ekleyebilirsiniz.'],
    ['Kaydet', f'{K("Ctrl", "S")} ile Resimler klasörüne <b>hava durumu</b> adıyla.'],
    ['Gerçek bilgisayarda', f'{K("⊞", "Shift", "S")}, ekran kararınca yeri çerçeveleyin. Sonra WhatsApp’ta, e-postada ya da Paint’te {K("Ctrl", "V")}.'],
    ['Print Screen (PrtSc)', 'Bütün ekranı panoya alır.']], 'kv') +
    note('Bir hata mesajını, tarifi ya da adresi resim olarak saklayıp birine gönderebilirsiniz.')))
S.append(slide('Ders 3 · Ekran alıntısıyla yardım istemek', 'Anlatmak yerine resmini gönderin', split(
    adim(['Başlat’tan arayarak <b>Ekran Alıntısı</b>’nı açın, <b>＋ Yeni</b>.',
          'Göstermek istediğiniz bölgeyi (ör. bir hata yazısını) çapraz sürükleyerek seçin.',
          'Paint’i açıp ' + K('Ctrl', 'V') + '; kırmızı ◯ Elips ile önemli yeri işaretleyin.',
          'Kaydedin; e-postaya ya da mesaja ekleyin.']),
    ul(['Gerçekte: ' + K('⊞', 'Shift', 'S') + ' ile alanı seçin; WhatsApp Web’de ya da e-postada ' + K('Ctrl', 'V') + '.',
        'Altına kısaca ne yapmaya çalıştığınızı yazın.'], 'small') +
    note('Ekranda şifre, kart numarası ya da kimlik bilgisi görünüyorsa o resmi <b>kimseyle paylaşmayın</b>.'), 1.1, .9)))
S.append(slide('Ders 4 · Ayarlar (30 dk)', 'Arka plan, ses, parlaklık, güncelleme', split(
    table([['Kişiselleştirme', 'Arka plan: Orman’ı seçin; kendi fotoğrafınızı da seçebilirsiniz'],
           ['Sistem', 'Ses düzeyini 30’a çekin; “Sesi kapat (sessiz)”i açıp kapatın; parlaklığı 60–80 yapın'],
           ['Windows Update', '<b>Güncelleştirmeleri denetle</b>; ertelemeyin'],
           ['Gerçekte', f'Ayarlar’ı {K("⊞", "I")} ile açın']], 'kv'),
    fig('ay_kisisel.jpg', 'Kişiselleştirme sayfası.'), 1.05, .95)))
S.append(slide('Ders 4 · Ayarlar', 'Wi-Fi: internete bağlanmak', split(
    ul(['<b>Ağ ve İnternet</b> → Wi-Fi anahtarını açın.',
        '<b>EvAğı</b> → Bağlan → şifre <b>evagi2024</b>.',
        'Gerçekte Wi-Fi şifresi çoğunlukla <b>modemin altındaki etikette</b> yazar.'], 'small') +
    note('<b>Kafe_Ücretsiz</b> gibi şifresiz ağlarda bankacılık işlemi yapmayın, şifre girmeyin: aynı ağdaki başkaları görebilir.'),
    fig('ay_ag.jpg', 'Üç ağ: ikisi güvenli, biri açık (güvensiz).'))))
S.append(slide('Ders 4 · Ayarlar', 'Saat ve yazı boyutu', two(
    'ay_saat.jpg', '<b>Saat ve dil:</b> “Saati otomatik olarak ayarla”yı açın; saat dilimi <b>İstanbul</b> olsun. Saat yanlışsa bazı siteler açılmaz.',
    'ay_yazi.jpg', '<b>Erişilebilirlik:</b> metin boyutunu %130’a getirip Uygula’ya tıklayın.')))
S.append(slide('Ders 5 · Saat ve tarih', 'Saat yanlışsa site açılmaz', split(
    table([['Sağ alttaki saat', 'Tıklayınca takvim açılır; <b>sağ tık</b> → Tarih ve saati ayarla'],
           ['Saati otomatik olarak ayarla', '<b>Açık</b> kalsın: saat internetten düzelir'],
           ['Elle ayarlamak', 'İnternet yoksa: otomatiği kapatın → <b>Değiştir</b> → saati yazın. Sonra otomatiğe dönün'],
           ['Saat dilimi · 24 saatlik biçim', 'İstanbul (UTC+3) · 14.05 ya da 2.05 ÖS']], 'kv tight') +
    note('“Bağlantınız gizli değil” diyen sitede önce <b>tarih ve saate</b> bakın. Saat hep sıfırlanıyorsa anakartın düğme pili bitmiştir; teknisyen değiştirir.'),
    fig('st_hata.jpg', 'Bilgisayarın tarihi yanlış: site açılmıyor.'), 1.05, .95)))
S.append(slide('Ders 6 · Denetim Masası', 'Windows’un eski ayar paneli', split(
    table([['Açmak', 'Başlat’a <b>denetim</b> yazın. Başka yol: ' + K('⊞', 'R') + ', <b>control</b>, Enter'],
           ['Görüntüleme ölçütü', 'Sağ üstte: <b>Büyük simgeler</b> daha hızlı bulunur'],
           ['Arama kutusu', '<b>fare</b>, <b>yazıcı</b>, <b>saat</b> yazın'],
           ['Programlar ve Özellikler', 'Programı seçin → <b>Kaldır</b>'],
           ['Sistem', 'İşlemci, bellek (RAM), Windows sürümü'],
           ['Güç Seçenekleri', 'Ekranı kapat, uyku süresi']], 'kv tight') +
    note('Yeni Windows’ta çoğu ayar Ayarlar’a taşındı; bazı öğeler sizi oraya götürür. Windows 7’de yazıcı: Denetim Masası → Aygıtlar ve Yazıcılar.'),
    fig('dm_kategori.jpg', 'Denetim Masası: kategori görünümü.'), 1.05, .95)))
S.append(slide('Ders 7 · Kısayol, ekran ayarı, geri yükleme (30 dk)', 'Masaüstüne kısayol koymak', split(
    adim(['Dosya Gezgini’nde klasöre ya da dosyaya <b>sağ tıklayın</b>.',
          '<b>Gönder</b> → <b>Masaüstü (kısayol oluştur)</b>.',
          'Masaüstündeki simgeye <b>çift tıklayın</b>: asıl klasör açılır.']),
    ul(['Kısayol simgesinde küçük bir <b>ok ↗</b> vardır.',
        'Kısayolu silmek asıl dosyayı <b>silmez</b>.',
        'Asıl dosya silinirse kısayol <b>açılmaz</b>.']))))
S.append(slide('Ders 7 · Kısayol, ekran ayarı, geri yükleme', 'Ekran ayarı ve bilgisayarı eski güne döndürmek', table([
    ['Çözünürlük', 'Ayarlar → Sistem → Ekran. <b>(Önerilen)</b> yazan kalsın; düşürmek her şeyi bulanıklaştırır'],
    ['Ölçek', 'Yazılar küçükse <b>%125</b> ya da <b>%150</b> yapın'],
    ['Sistem Geri Yükleme', 'Programları ve ayarları sorun başlamadan önceki güne döndürür; <b>belgeler ve fotoğraflar değişmez</b>'],
    ['Geri yükleme noktası', 'Büyük bir program ya da sürücü kurmadan önce oluşturun (Sistem Koruması → Oluştur)'],
    ['Dosya Geçmişi', 'Belgelerin ve fotoğrafların kopyasını USB diske saatte bir alır; silinen dosyanın eski hâli geri gelir']], 'kv')))
S.append(slide('Ders 8 · Görünüm', 'Temalar, Mağaza, renkler', split(
    table([['Temalar', 'Arka plan, renk ve koyu modu birlikte değiştirir. Windows (koyu) akşamları gözü yormaz'],
           ['Vurgu rengi', 'Başlat düğmesi, seçili düğmeler, görev çubuğundaki çizgi'],
           ['🛍 Mağaza', 'Uygulama ve temaları güvenle indirme yeri']], 'kv tight') +
    note('Yüklemeden önce yayımcıya, puana, yorumlara ve istenen izinlere bakın. Yazı programı rehber ve mikrofon istiyorsa yüklemeyin.'),
    fig('tm_kisisel.jpg', 'Ayarlar → Kişiselleştirme: temalar, arka plan, renkler.'), 1.05, .95)))
S.append(slide('Ders 9 · Bluetooth', 'Kablosuz kulaklık ve hoparlör', split(
    adim(['⊞ Başlat → ⚙ Ayarlar → <b>Bluetooth ve cihazlar</b>.', 'Bluetooth düğmesini <b>Açık</b> yapın.',
          '<b>＋ Cihaz ekle</b>: kulaklık da açık ve eşleştirme kipinde olsun.',
          'Kendi cihazınızın yanındaki <b>Bağlan</b>. Bir kez eşleşince sonra kendiliğinden bağlanır.']),
    table([['Tanımadığınız cihaz', '<b>Bağlanmayın</b> (ör. TV-4F2A)'],
           ['Hızlı ayarlar', 'Sağ alttaki simgeler: Wi-Fi, Bluetooth, uçak modu'],
           ['✈ Uçak modu', 'Wi-Fi ve Bluetooth’u birlikte kapatır; internet yoksa buna bakın'],
           ['Kulaklık ses vermiyor', 'Bluetooth açık mı, kulaklık şarjlı ve açık mı, bağlı mı?']], 'kv tight'), 1, 1)))
S.append(slide('Ders 10 · Hesaplar', 'Şifre, PIN ve ekranı kilitlemek', split(
    table([['Ayarlar → Hesaplar', 'Şifre değiştirme, PIN ekleme'],
           ['Şifre', '8+ karakter, büyük-küçük harf ve rakam; ad, doğum yılı olmasın'],
           ['PIN', '4–6 rakam; 1234, 1111 olmasın'],
           [K('⊞', 'L'), 'Ekranı kilitler; işler yerinde kalır. Ya da Başlat → hesap adı → 🔒 Kilitle'],
           ['Ayrı hesap', 'Bilgisayarı başkası da kullanıyorsa ona ayrı hesap']], 'kv'),
    note('Şifreyi monitöre yapıştırmayın. Evde güvenli bir yerdeki deftere, ne için olduğunu açıkça yazmadan.'), 1.3, .7)))
S.append(slide('Ders 11 · Tekrar', 'Ayarlar parkuru: 11 görev', ul([
    'Ayarlar’ı açın', 'Koyu modu açın, sonra kapatın', 'Arka planı Orman yapın', 'Parlaklığı 60–80 arasına getirin',
    'Metin boyutu %130, sonra yine %100', 'Kafe_Ücretsiz ağına bağlanın', 'EvAğı’na dönün (şifre: evagi2024)',
    'Saat dilimini Londra yapıp yine İstanbul’a alın', 'Güncelleştirmeleri denetleyin'], 'task2') +
    note('Nasıl yapılacağı yazmaz; takılınca 💡 İpucu. Son ekranda her görevin süresi görünür.')))
S.append(slide('Özet', 'Bu hafta öğrendiklerimiz', ozet([
    ['Paint', 'Kalem, renk, şekil, doldur, yazı, silgi, Ctrl+Z, Ctrl+S'],
    ['Ekran Alıntısı', '⊞ + Shift + S; Ctrl + V ile yapıştır'],
    ['Ayarlar → Kişiselleştirme', 'Arka plan, temalar, koyu mod, renkler'], ['Ayarlar → Sistem', 'Ses düzeyi, parlaklık'],
    ['Ayarlar → Ağ ve İnternet', 'Wi-Fi açma, ağa bağlanma, uçak modu'], ['Ayarlar → Saat ve dil', 'Saati otomatik ayarla'],
    ['Ayarlar → Erişilebilirlik', 'Metin boyutu'], ['Ayarlar → Bluetooth ve cihazlar', '＋ Cihaz ekle, eşleştirme'],
    ['Ayarlar → Hesaplar', 'Şifre, PIN'], ['⊞ + L', 'Ekranı kilitle'],
    ['Denetim Masası', 'Programlar ve Özellikler, Sistem, Güç Seçenekleri'], ['Mağaza', 'Yayımcı, puan, izinlere bakın']],
    'altı küçük görev', 12)))
write('hafta7', '7. Hafta', 'Bilgisayar İşletmenliği – 7. Hafta Alıştırmaları', S)

# ================================================================ HAFTA 8
S = []
S.append(cover('8. Hafta: İnternet, program kurma, yazıcı ve işletim sistemi', 'Alıştırmalar', 'Alıştırma bilgisayarında uygulamalı ders'))
S.append(slide('Bu hafta', 'On altı ders', plan([
    ('İnternette gezinme ve indirme', 25), ('Tarayıcılar: Edge, Chrome, Firefox', 25), ('İnternet adresini (URL) okumak', 40),
    ('Arama motorları', 35), ('Video, radyo ve gazete', 35), ('Video kalitesi ve Hz', 30),
    ('Ekrandaki İngilizce kelimeler', 25), ('İnternetteki tuzaklar', 20), ('Program kurma ve kaldırma', 20),
    ('Yazıcı ve sürücüler', 20), ('Virüs taraması, Disk Temizleme', 30), ('Virüsler ve antivirüs', 30),
    ('İnternet kesildi!', 25), ('İşletim sistemleri', 40), ('İşletim sistemi kurulumu', 20), ('İnternet parkuru', 25)],
    'sekiz küçük görev', 16)))
S.append(slide('Ders 1 · İnternet', 'Adres mi, arama mı?', split(
    ul(['İnternete girmek için kullanılan programa <b>tarayıcı</b> denir.',
        'Adresi <b>biliyorsanız</b> adres çubuğuna yazın (www…).',
        'Bilmiyorsanız aradığınızı <b>kelimelerle</b> yazın: <b>börek tarifi</b>.',
        '<b>←</b> bir önceki sayfa, <b>＋</b> yeni sekme, sekmedeki <b>✕</b> kapatır.'], 'small') +
    note('Sonuçların en üstünde <b>Reklam</b> yazanlar reklamdır.'),
    fig('in_sonuc.jpg', 'Arama sonuçları: “börek tarifi”.'), .9, 1.1)))
S.append(slide('Ders 1 · İnternet', 'İndirme ve reklam tuzakları', split(
    ul(['Büyük, renkli, yanıp sönen <b>“İNDİR”</b> düğmeleri çoğunlukla reklamdır.',
        'Gerçek bağlantı, <b>programın adının</b> yazdığı sade bağlantıdır: “Resim Gösterici’yi indir (12 MB)”.',
        'En güvenlisi programı <b>resmî sitesinden</b> indirmektir.',
        'İndirdiğiniz her şey <b>İndirilenler</b> klasörüne gider.'], 'small'),
    fig('in_reklam.jpg', 'Soluk yeşil ve kırmızı düğmeler reklamdır.'))))
S.append(slide('Ders 2 · Tarayıcılar', 'Tarayıcı mı, arama motoru mu?', split(
    table([['Tarayıcı', 'İnternet sitelerini açan <b>program</b>: Edge, Chrome, Firefox, Safari, Opera, Brave. Kütüphane binası'],
           ['Arama motoru', 'Sitelerin <b>fihristi</b>: Google, Bing, Yandex, DuckDuckGo. Tarayıcının içinde açılır'],
           ['Hangisi?', 'Hepsi aynı işi yapar. Windows’ta Edge hazır gelir; Chrome şart değil'],
           ['Gizli pencere', 'Edge: <b>InPrivate</b>; Chrome ve Firefox: <b>Gizli pencere</b>']], 'kv'),
    ul(['Tarayıcıyı yalnızca <b>resmî sitesinden</b> indirin; “Chrome indir” reklamlarına dikkat.',
        'Bağlantılar hep <b>varsayılan tarayıcıda</b> açılır: Ayarlar → Uygulamalar → Varsayılan uygulamalar.',
        'Menü → Ayarlar → <b>Hakkında</b>: güncel tarayıcı daha güvenlidir.'], 'small'), 1.1, .9)))
S.append(slide('Ders 3 · Adres (URL) okumak', 'Sitenin asıl adı nerede yazar?', split(
    table([['Alan adı', 'Sitenin asıl adı: <b>turkiye.gov.tr</b>. “www.” bunun parçası değildir'],
           ['Sağdan sola okuyun', 'bankam.com.tr.<b>hesap-dogrulama.xyz</b> → site hesap-dogrulama.xyz’nindir'],
           ['.gov.tr · .edu.tr · .bel.tr', 'Yalnızca devlet · üniversite · belediye alabilir'],
           ['.com, .xyz', 'Herkes alabilir'],
           ['🔒 Kilit', 'Bağlantı şifreli demektir; site dürüst demek <b>değildir</b>'],
           ['⚠ Güvenli değil', 'Şifre ve kart bilgisi girmeyin']], 'kv tight') +
    note('Bildirim izni isteyen tanımadığınız siteye <b>Engelle</b>. Adresi paylaşmak: adres çubuğuna tıklayıp ' + K('Ctrl', 'C') + '.'),
    fig('in_sahte.jpg', 'Kilidi var ama adres turkiye-gov-giris.com: sahte e-Devlet.'), 1.05, .95)))
S.append(slide('Ders 4 · Aramak', 'İyi arama, doğru sonuç', split(
    table([['Kısa arama', '<b>izmir hava durumu</b>, <b>mercimek çorbası tarifi</b>: birkaç kelime yeter'],
           ['Sonuç satırı', 'Mavi başlık: bağlantı · gri: sitenin adresi · kısa açıklama'],
           ['Reklam', '“Reklam” yazan sonuçlar parayla yukarı çıkar; atlayın'],
           ['Sekmeler', 'Tümü, <b>Görseller</b>, <b>Haberler</b>'],
           ['Tırnak', '“su abonelik başvuru formu”: cümle olduğu gibi aranır']], 'kv tight'),
    ul(['Konu + yer + ne istediğiniz: <b>Örnek Belediyesi su abonelik başvuru formu</b>.',
        'Tıklamadan önce adrese bakın: .gov.tr, .bel.tr, hastane sitesi.',
        '＋ ile yeni sekme açın; açık sayfa kaybolmaz. ← bir önceki sayfa.',
        'Arama kutusuna T.C. kimlik no, kart numarası, şifre <b>yazılmaz</b>.'], 'small'), 1.05, .95)))
S.append(slide('Ders 5–6 · Video, radyo, gazete', 'İzlemek, dinlemek, okumak', split(
    table([['Reklamı atla ▶', 'Birkaç saniye sonra çıkar; reklamın kendisine tıklamayın'],
           ['⛶ Tam ekran', 'Çıkmak için ' + K('Esc')],
           ['CC', 'Altyazı açar / kapatır'], ['⚙ Hız', '0,75x ya da 0,5x: konuşma rahat anlaşılır'],
           ['📻 Radyo', 'Kanalın yanındaki ▶ Dinle'],
           ['Gazete', '“Sponsorlu” kutular reklam; “Galeri” sayfaları oyalar; ✕ ile kapatın']], 'kv tight'),
    table([['144p … 1080p, 4K', 'Videonun netliği; sayı büyüdükçe daha çok internet harcar'],
           ['Kotalı internet', 'Telefonda 360p ya da 480p; 4K bir saatte ≈ 7 GB'],
           ['60 Hz', 'Ekran saniyede 60 kez yenilenir; ofis ve internet için yeterli'],
           ['Çözünürlük', '“Önerilen” yazanı seçin; yazıyı büyütmek için Ölçek ya da Metin boyutu']], 'kv tight'), 1, 1)))
S.append(slide('Ders 7 · İngilizce kelimeler', 'OK, Cancel, Allow, Skip…', split(
    table([['OK · Yes · Next · Continue', 'Tamam · Evet · İleri · Devam'],
           ['Cancel · No · Back · Close', 'İptal · Hayır · Geri · Kapat'],
           ['Skip · Later · Remind me later', 'Atla · Sonra · Sonra hatırlat'],
           ['Allow · Block', 'İzin ver · Engelle'],
           ['Accept all · Reject all', 'Hepsini kabul et · Hepsini reddet'],
           ['Download · Install · Update', 'İndir · Kur · Güncelle'],
           ['Save · Don’t save', 'Kaydet · Kaydetme'],
           ['Sign in · Sign up · Sign out', 'Giriş yap · Kayıt ol · Çıkış yap']], 'tight'),
    note('Emin değilseniz <b>Cancel</b> ya da ✕: hiçbir şey değiştirmeden kapatır.') +
    ul(['Tarayıcıda sayfaya sağ tık → <b>Türkçe’ye çevir</b>.', 'Telefonda çeviri uygulamasının kamerasını ekrana tutun.'], 'small'), 1.25, .75)))
S.append(slide('Ders 8 · Tuzaklar', 'İnternetteki tuzakları tanıyalım', table([
    ['Büyük renkli İNDİR', 'Genellikle reklam; programın adının yazdığı sade bağlantıyı kullanın'],
    ['“Kazandınız!”', 'Kapatın; kimse bedava telefon vermez. Geri sayım acele ettirmek içindir'],
    ['“Bildirim göstermek istiyor”', '<b>Engelle</b>'],
    ['“Programınız eski, güncelleyin”', 'Siteden değil; Windows Update’ten ya da programın kendisinden'],
    ['Çerez penceresi', 'Kabul ya da Reddet; ikisi de güvenli'],
    ['Benzer adres', 'Harf harf okuyun: bankam / <b>bankarn</b>']], 'kv')))
S.append(slide('Ders 9 · Program kurma', 'Kurulum adım adım', two(
    'kr_uac.jpg', '<b>İzin penceresi:</b> programı siz indirdiyseniz Evet; tanımıyorsanız Hayır.',
    'kr_ek.jpg', '<b>Ek bileşenler tuzağı:</b> iki kutucuğun da işaretini kaldırın.')))
S.append(slide('Ders 9 · Program kurma', 'Kurulum sırası ve kaldırma', table([
    ['1', '<b>…Kurulum.exe</b> dosyasına çift tıklayın, izin sorusuna <b>Evet</b> deyin.'],
    ['2', 'Hoş geldiniz → <b>İleri</b>. Lisansı <b>kabul ediyorum</b> seçmeden İleri çalışmaz.'],
    ['3', 'Kurulum yeri → İleri. “Önerilen” ek yazılımların <b>işaretini kaldırın</b>. Sonra <b>Kur</b>, <b>Son</b>.'],
    ['4', 'Kaldırmak için: Başlat → Ayarlar → <b>Uygulamalar</b> → programın yanındaki <b>Kaldır</b>.']], 'kv') +
    note('Yalnızca güvendiğiniz yerden indirdiğiniz programları kurun.')))
S.append(slide('Ders 10 · Yazıcı ve sürücüler', 'Yazıcı eklemek', split(
    ul(['<b>Sürücü</b> (driver): parçanın bilgisayarla “konuşmasını” sağlayan küçük program. Bir <b>tercüman</b> gibi.',
        'Ayarlar → <b>Bluetooth ve cihazlar</b> → <b>Cihaz ekle</b>: yazıcı bulunur, sürücüsü kendiliğinden yüklenir.',
        'Test sayfası yazdırın. Not Defteri’nden yazdırmak için ' + K('Ctrl', 'P') + '.'], 'small'),
    fig('yz_ekle.jpg', 'Renkli Yazıcı R-200 bulundu.'))))
S.append(slide('Ders 10 · Yazıcı ve sürücüler', 'Aygıt Yöneticisi', split(
    ul(['Bir parça çalışmıyorsa: <b>Başlat’a sağ tıklayın</b> → Aygıt Yöneticisi.',
        'Sarı ünlemli aygıt, sürücüsünün <b>eksik</b> olduğunu gösterir.',
        'Sağ tık → <b>Sürücüyü güncelleştir</b> → Sürücüleri otomatik olarak ara.',
        'Başka yerler: Windows Update; üreticinin resmî sitesi. “Sürücü güncelleyici” programlarından uzak durun.'], 'small'),
    fig('yz_aygit.jpg', '“Bilinmeyen aygıt”: sürücü eksik.'))))
S.append(slide('Ders 11 · Bakım', 'Virüs taraması ve Disk Temizleme', split(
    table([['🛡 Windows Güvenliği', 'Windows’un kendi virüs programı; ek program gerekmez'],
           ['⚡ Hızlı tarama', 'Birkaç dakikada tarar'],
           ['USB belleği tara', 'Başkasından aldığınız belleği açmadan önce'],
           ['🧱 Güvenlik duvarı', 'Açık kalmalı. “Kapatın” diyen site şüphelidir'],
           ['🧹 Disk Temizleme', 'Geçici dosyaları siler, yer açar. <b>İndirilenler</b>’i işaretlemeyin']], 'kv tight') +
    note('Siteden çıkan “7 virüs bulundu” yazısına inanmayın; kendiniz Windows Güvenliği ile tarayın.'),
    fig('bg_disk.jpg', 'Disk Temizleme: İndirilenler klasörü sarı, işaretli değil.'), 1.05, .95)))
S.append(slide('Ders 12 · Virüsler', 'Virüs nedir, nasıl korunuruz?', split(
    table([['Nasıl bulaşır?', 'Tanımadığınız e-posta eki, “bedava” programlar, başkasının USB’si, sahte “güncelle” düğmeleri'],
           ['Belirtiler', 'Birden yavaşlama, açılır reklamlar, değişen ana sayfa, tanımadığınız programlar'],
           ['Antivirüs', 'Windows Güvenliği hazır gelir. <b>İki antivirüs</b> birbirini bozar'],
           ['Fidye yazılımı', '“Dosyalarınız şifrelendi” diyorsa para göndermeyin; yedekten dönün']], 'kv tight'),
    '<h2>Bulaştıysa</h2>' + adim(['İnterneti kesin (Wi-Fi’yi kapatın).', 'Windows Güvenliği ile tam tarama.',
                                  'Tanımadığınız programı Ayarlar → Uygulamalar’dan kaldırın.', 'Şifreleri başka bir cihazdan değiştirin.'], 'small') +
    note('En iyi savunma: önemli dosyaların düzenli <b>yedeği</b>.'), 1, 1)))
S.append(slide('Ders 13 · İnternet kesildi!', 'Wi-Fi bağlı ama internet yok', split(
    table([['Power · DSL · Internet', 'Elektrik var mı · hat geliyor mu · internete bağlandı mı'],
           ['Internet ışığı sönük / kırmızı', 'Modemi kapatın, <b>10 saniye</b> bekleyin, açın; ışıklar için 2–3 dakika bekleyin'],
           ['DSL ışığı hiç yanmıyor', 'Hat gelmiyor: kabloları kontrol edin, düzelmezse internet şirketini arayın'],
           ['Kişisel Erişim Noktası', 'Telefonun internetini bilgisayara paylaşır; mobil veriden harcar'],
           ['Hız testi', 'Görüntülü görüşmeye 3 Mbps, film için 5 Mbps yeter']], 'kv tight'),
    fig('ik_modem.jpg', '“İnternete bağlı değilsiniz”; sol altta modemin ışıkları.'), 1.05, .95)))
S.append(slide('Ders 14 · İşletim sistemleri', 'Windows 7’den Pardus’a', split(
    table([['Windows 7 (2009)', 'Yuvarlak Başlat düğmesi; desteği 2020’de bitti'],
           ['Windows 8 (2012)', 'Kutucuklu Başlat ekranı; destek 2023’te bitti'],
           ['Windows 10 (2015)', 'Başlat menüsü geri geldi; ücretsiz destek Ekim 2025’te bitti'],
           ['Windows 11 (2021)', 'Simgeler ortada; yeni bilgisayar ister'],
           ['Linux', 'Ücretsiz, açık kaynak: Ubuntu, Mint, Pardus'],
           ['Pardus', 'TÜBİTAK ULAKBİM’in yerli Linux’u; okul akıllı tahtalarında (ETAP)']], 'kv tight'),
    ul(['İşletim sistemi bilgisayarın <b>yöneticisidir</b>: parçalarla programlar arasında köprü kurar.',
        'Hangisi bende? Başlat → Ayarlar → Sistem → <b>Hakkında</b>; ya da ' + K('⊞', 'R') + ', <b>winver</b>, Enter.',
        '<b>Destek bitti</b>: yeni güvenlik açıkları kapatılmaz; bankacılığı güncel sistemde yapın.',
        'Windows programları Linux’ta doğrudan çalışmaz; LibreOffice gibi benzerleri Word ve Excel dosyalarını açar.'], 'small'), 1, 1)))
S.append(slide('Ders 15 · İşletim sistemi (gösterim)', 'Windows’u sıfırdan kurmak', split(
    ul(['Kurulum diskteki fotoğrafları ve belgeleri <b>silebilir</b>. Önce mutlaka <b>yedek</b> alınır.',
        'Gerekenler: Windows kurulum USB’si; açılışta USB’den başlatmak (F12, F11 ya da Esc).',
        'Gerçekte kopyalama 15–30 dakika sürer; bilgisayar birkaç kez yeniden başlar. <b>Kapatmayın!</b>',
        'PIN: doğum yılınız ya da 1234 olmasın.'], 'small'),
    fig('os_disk_k.jpg', 'Disk seçimi: biçimlendirme her şeyi siler.'), 1, 1)))
S.append(slide('Ders 15 · İşletim sistemi (gösterim)', 'Kurulum ekranları', table([
    ['Dil ve klavye', 'Türkçe, Türkçe Q → İleri'], ['Şimdi yükle', '“Bilgisayarınızı onarın” bozuk Windows’u onarmak içindir'],
    ['Ürün anahtarı', 'Daha önce etkinleştirilmişse <b>Ürün anahtarım yok</b>'],
    ['Yükleme türü', '<b>Özel: Yalnızca Windows’u yükle</b> (temiz kurulum)'],
    ['Disk', 'Biçimlendirme her şeyi siler: uyarıyı okuyun'],
    ['İlk ayarlar', 'Bölge, klavye, internet (EvAğı), ad, PIN, gizlilik']], 'kv')))
S.append(slide('Ders 16 · Tekrar', 'İnternet parkuru: 11 görev', ul([
    'Tarayıcıyı Başlat’tan arayarak açın', '<b>börek tarifi</b> arayın, ıspanaklı börek tarifini açın',
    'Sayfanın sonundaki gizli kelimeyi bulun', 'Yeni sekmede <b>www.program-indir.com.tr</b>',
    'Resim Gösterici’yi reklamlara tıklamadan indirin', 'İndirilenler klasörünü açın',
    'Kurulumu başlatıp izin penceresinde doğru cevabı verin', 'Bütün pencereleri kapatın'], 'task2') +
    note('Nasıl yapılacağı yazmaz; takılınca 💡 İpucu. Son ekranda her görevin süresi görünür.')))
S.append(slide('Özet', 'Bu hafta öğrendiklerimiz', ozet([
    ['Adres çubuğu', 'Adres biliniyorsa yazın; bilinmiyorsa kelimelerle arayın'],
    ['Tarayıcı · arama motoru', 'Edge, Chrome · Google, Bing'],
    ['Alan adı', 'Sağdan sola okuyun; .gov.tr devletindir'], ['🔒 Kilit', 'Şifreli bağlantı; dürüst site demek değil'],
    ['“Reklam” · “İNDİR”', 'Atlayın; sade bağlantıyı kullanın'], ['Cancel · Allow · Skip', 'İptal · İzin ver · Atla'],
    ['İzin penceresi', 'Siz indirdiyseniz Evet; tanımıyorsanız Hayır'], ['Önerilen ek yazılımlar', 'İşaretlerini kaldırın'],
    ['Sürücü', 'Aygıt Yöneticisi’nde sarı ünlem = eksik'], ['Windows Güvenliği', 'Hızlı tarama, USB belleği tara'],
    ['Disk Temizleme', 'Yer açar; İndirilenler’e dikkat'], ['Modem', 'Kapat, 10 saniye bekle, aç'],
    ['winver', 'Hangi Windows sürümü?'], ['İşletim sistemi kurulumu', 'Önce yedek!']],
    'sekiz küçük görev', 16)))
write('hafta8', '8. Hafta', 'Bilgisayar İşletmenliği – 8. Hafta Alıştırmaları', S)

# ================================================================ HAFTA 9
S = []
S.append(cover('9. Hafta: E-posta', 'Alıştırmalar', 'Alıştırma bilgisayarında uygulamalı ders'))
S.append(slide('Bu hafta', 'Sekiz ders', plan([
    ('E-posta: okuma, yanıtlama, ek', 40), ('Gmail ve Hotmail (Outlook)', 25), ('Yanıtla, ilet, Bilgi (Cc), Gizli (Bcc)', 30),
    ('Kişiler, imza ve istenmeyenler', 30), ('Büyük dosyayı buluttan paylaşmak', 35),
    ('“Şifremi unuttum!”', 25), ('E-posta kutusu doldu!', 20), ('E-posta parkuru', 20)],
    'sekiz küçük görev', 12)))
S.append(slide('Ders 1 · E-posta', 'İnternetten giden mektup', split(
    ul(['E-posta birkaç saniyede ulaşır; içine fotoğraf ve belge <b>eklenebilir</b>.',
        f'Adres örneği: <b>elif@ornek.com</b>. @ için {K("AltGr", "Q")}.',
        'Adreste Türkçe harf (ç, ğ, ı, ö, ş, ü) ve boşluk <b>olmaz</b>.',
        'Kalın yazılı posta henüz okunmamıştır; 📎 postada ek olduğunu gösterir.']),
    fig('ep_gelen.jpg', 'Alıştırma posta kutusu: Gelen Kutusu.'), 1, 1)))
S.append(slide('Ders 1 · E-posta', 'Okumak, yanıtlamak, göndermek', table([
    ['Okumak', 'Gelen Kutusu’nda postaya tıklayın: Elif’ten “Bayram fotoğrafı”'],
    ['⬇ İndir', 'Eki bilgisayara kaydeder (İndirilenler klasörü)'],
    ['Kendi klasörüne taşı', 'İndirilenler’de bayram.jpg → ' + K('Ctrl', 'X') + ' → Resimler → ' + K('Ctrl', 'V')],
    ['↩ Yanıtla', 'Gönderene cevap; Kime ve Konu kendiliğinden dolar. Yazıp <b>➤ Gönder</b>'],
    ['✏ Yeni posta', 'Kime: <b>elif@ornek.com</b>, Konu: <b>Bahçemiz</b>, 📎 Dosya ekle → Resimler’den çiçekler.jpg → Aç → Gönder'],
    ['⚠ İstenmeyen', '“ACİL: Hesabınız askıya alındı!” gibi sahte postayı buraya. Bağlantısına tıklamayın']], 'kv') +
    note('Bankalar e-postayla şifre ya da kart numarası <b>istemez</b>.')))
S.append(slide('Ders 2 · Gmail ve Hotmail', 'İki yaygın e-posta hizmeti', split(
    table([['Gmail', 'Google; adres <b>@gmail.com</b>. Google hesabı: Android, YouTube, Drive'],
           ['Hotmail / Outlook', 'Microsoft; <b>@hotmail.com</b>, <b>@outlook.com</b>, @live.com. Microsoft hesabı: Windows, Office, OneDrive'],
           ['Görünüş', 'Gmail: üstte sekmeler, etiketler. Outlook: soldaki klasörler'],
           ['İstenmeyen posta', 'Gmail’de <b>Spam</b>, Outlook’ta <b>Önemsiz E-posta</b>']], 'kv'),
    ul(['Gmail ile Hotmail birbirine posta gönderir; adres doğruysa posta ulaşır.',
        'Şifre, hesabı veren firmanın sitesinden sıfırlanır: Hotmail için <b>outlook.com</b> → “Şifremi unuttum”.',
        'Yeni Android telefon Google hesabı (Gmail adresi) ister.'], 'small'), 1.1, .9)))
S.append(slide('Ders 3 · Yanıtla, ilet, Cc, Bcc', 'Kime gidecek, kim görecek?', split(
    table([['↩ Yanıtla', 'Yalnızca size yazana cevap'],
           ['↪ İlet', 'Postayı başka birine gönderir; Kime’yi siz yazarsınız'],
           ['Bilgi (Cc)', 'Bilgisi olsun istediğiniz kişiler; herkes birbirinin adresini görür'],
           ['Gizli (Bcc)', 'Alıcılar birbirini görmez; kalabalık duyuru için en güvenlisi'],
           ['Birden çok adres', 'Noktalı virgülle ayrılır']], 'kv'),
    ul(['Kime kutusunun yanındaki <b>Bilgi / Gizli</b> bağlantısı iki kutuyu açar.',
        'Yarım bırakılan posta kaybolmaz: <b>📝 Taslaklar</b>’a kaydedilir; oradan açıp bitirin.',
        '30 kişilik kursa duyuru: adresleri <b>Gizli (Bcc)</b>’ye yazın.'], 'small'), 1.1, .9)))
S.append(slide('Ders 4 · Kişiler, imza, istenmeyenler', 'E-postada düzen', table([
    ['⚠ İstenmeyen', 'Şüpheli postalar buraya düşer; ara sıra bakın. Gerçek posta düştüyse <b>✔ İstenmeyen değil</b>'],
    ['👥 Kişiler', 'Adres defteri: <b>Fatma Teyze</b>, fatma@ornek.com → Kaydet'],
    ['Kime: ilk harfler', '<b>fat</b> yazınca kayıtlı adres önerilir'],
    ['⚙ Ayarlar → İmza', 'Her postanın sonuna kendiliğinden eklenen yazı: ad, telefon']], 'kv') +
    note('Gönderen adresine bakın: <b>.bel.tr</b> belediyelere verilir. Perşembe günkü su kesintisi postası gerçekti.')))
S.append(slide('Ders 1 ve 5 · Belgeler ve büyük dosyalar', 'İndir, taşı; sığmayanı buluttan paylaş', split(
    '<h2>Gelen belgeyi saklamak</h2>' + adim([
        'Postadaki eki <b>⬇ İndir</b>: önce İndirilenler’e düşer.',
        'Belgeler’de <b>Sağlık</b> klasörü açın (sağ tık → Yeni → Klasör).',
        K('Ctrl', 'X') + ' → klasörde ' + K('Ctrl', 'V') + ' ile taşıyın.',
        'Adını anlaşılır yapın: <b>tahlil sonucu ekim 2026.pdf</b>.'], 'small') +
    note('Tanımadığınız birinden gelen eki açmayın; .exe ve .zip eklere dikkat.'),
    '<h2>Bulut Depo ile paylaşmak</h2>' + table([
        ['Ek sınırı', 'Genellikle 20–25 MB; düğün videosu sığmaz'],
        ['☁ Bulut Depo → ⬆ Yükle', 'Dosyayı internetteki deponuza koyar'],
        ['🔗 Paylaş', '👥 <b>Yalnızca eklediğim kişiler</b> + elif@ornek.com → Bağlantı oluştur'],
        ['⧉ Bağlantıyı kopyala', 'Postaya ' + K('Ctrl', 'V') + ' ile yapıştırıp gönderin'],
        ['🌐 Bağlantıya sahip herkes', 'Kişisel belgeler için kullanmayın']], 'kv tight'), 1, 1)))
S.append(slide('Ders 6 · Şifre sıfırlama', '“Şifremi unuttum!” Şimdi ne olacak?', split(
    adim(['Giriş sayfasında şifre kutusunun altındaki <b>Şifremi unuttum</b>.',
          'E-posta adresinizi yazıp <b>Kod gönder</b>.',
          'SMS’le gelen 6 haneli kodu yalnızca bu sayfaya yazın → <b>Doğrula</b>.',
          'Yeni şifreyi iki kez yazın: 8+ karakter, büyük-küçük harf, rakam; eskisi olmasın.',
          'Yeni şifreyle giriş yapın.'], 'small'),
    note('Telefonla arayıp “size gelen kodu söyleyin” diyen <b>dolandırıcıdır</b>. Kodu kimseye söylemeyin.') +
    ul(['Şifre defteri evde güvenli bir yerde; her hesap için <b>farklı</b> şifre.'], 'small'), 1.15, .85)))
S.append(slide('Ders 7 · E-posta kutusu doldu', 'Aramak, abonelikten çıkmak, yer açmak', split(
    table([['Arama kutusu', 'Konudaki, gönderendeki ya da yazıdaki bir kelime: <b>elektrik</b>'],
           ['ek:var', 'Yalnızca ekli postalar (Gmail’de: has:attachment)'],
           ['kimden:market', 'Bir kişinin ya da firmanın postaları (Gmail’de: from:)'],
           ['büyük:10mb', 'Ekleri 10 MB’tan büyükler (Gmail’de: larger:10M)'],
           ['Abonelikten çık', 'Reklam bültenlerini durdurur']], 'kv'),
    ul(['Ücretsiz kutular çoğunlukla 15 GB; dolarsa yeni postalar <b>ulaşmaz</b>.',
        'Silinen postalar Çöp Kutusu’nda 30 gün bekler: <b>Çöp Kutusunu şimdi boşalt</b>.',
        'Şüpheli postadaki “abonelikten çık” bağlantısına tıklamayın; İstenmeyen’e taşıyın.'], 'small'), 1.1, .9)))
S.append(slide('Ders 8 · Tekrar', 'E-posta parkuru', ul([
    'Elif’in <b>Bayram fotoğrafı</b> postasını açın', 'Fotoğrafı indirin, <b>Resimler</b>’e taşıyın',
    'Hocanın postasını <b>yanıtlayın</b>', 'Eczanenin postasını Ahmet’e <b>iletin</b>; Elif <b>Bilgi (Cc)</b>',
    'Sahte postayı bulup <b>silin</b>', 'Su kesintisi duyurusunu Gelen Kutusu’na alın',
    'Elif’e <b>Çiçekler</b> konulu, ekli posta'], 'task2') +
    note('Adresler: Ahmet (oğlunuz) ahmet@ornek.com, Elif (torununuz) elif@ornek.com. Süreler tutulur.')))
S.append(slide('Özet', 'Bu hafta öğrendiklerimiz', ozet([
    ['ad@ornek.com', 'Türkçe harf ve boşluk olmaz; @ = AltGr + Q'], ['Kalın · 📎', 'Okunmamış · ekli posta'],
    ['⬇ İndir', 'Eki İndirilenler’e kaydeder'], ['↩ Yanıtla · ↪ İlet', 'Gönderene cevap · başkasına gönder'],
    ['Bilgi (Cc) · Gizli (Bcc)', 'Herkes görür · kimse kimseyi görmez'], ['📝 Taslaklar', 'Yarım kalan postalar'],
    ['⚠ İstenmeyen', 'Spam; gerçekse “İstenmeyen değil”'], ['👥 Kişiler · İmza', 'Adres defteri · postanın sonu'],
    ['☁ Bulut Depo', 'Büyük dosyayı bağlantıyla paylaş'], ['Şifremi unuttum', 'SMS kodu kimseye söylenmez'],
    ['ek:var · kimden: · büyük:10mb', 'Postaları bulmak, yer açmak']],
    'sekiz küçük görev', 12)))
write('hafta9', '9. Hafta', 'Bilgisayar İşletmenliği – 9. Hafta Alıştırmaları', S)

# ================================================================ HAFTA 10
S = []
S.append(cover('10. Hafta: Kelime işlemci (Word)', 'Alıştırmalar', 'Alıştırma bilgisayarında uygulamalı ders'))
S.append(slide('Bu hafta', 'On sekiz ders', plan([
    ('Dilekçe yazalım', 40), ('Apartman duyurusu', 40), ('Liste, tablo, resim', 40), ('Resim neden kaçıyor?', 25),
    ('Tablo incelikleri', 35), ('Başlıklar, bul-değiştir, yazım', 40), ('Biçim Boyacısı, satır aralığı', 25),
    ('Sayfa düzeni ve yazdırma', 35), ('Simgeler ve şekiller: ₺ °C ½ ©', 25), ('Adres mektup birleştirme', 30),
    ('Büyük/küçük harf, stiller, cetvel', 30), ('Şablondan özgeçmiş', 40), ('Üst/alt bilgi, dipnot, köprü', 35),
    ('Numaralandırma ve içindekiler', 35), ('Bülten: sütun, kenarlık, sekme', 30),
    ('Tutanak: izle, açıklama, parola', 40), ('İlan: Metin Kutusu, WordArt', 30), ('Dilekçe parkuru', 25)],
    'on küçük görev', 19)))
S.append(slide('Ders 1 · Dilekçe', 'Kelime işlemci nedir?', split(
    ul(['Not Defteri düz yazı yazar; <b>kelime işlemci</b> (en bilineni Microsoft Word) yazıyı <b>biçimlendirir</b>.',
        'Kalın, büyük, ortalı başlıklar; renkler, listeler, tablolar, resimler.',
        'Dilekçe, mektup, özgeçmiş, ilan, davetiye… hepsi kelime işlemciyle yazılır.',
        '⊞ Başlat → 📘 <b>Kelime İşlemci</b>.']),
    fig('wd_dilekce.jpg', 'Alıştırma kelime işlemcisi.'), 1, 1)))
S.append(slide('Ders 1 · Dilekçe', 'Adım adım dilekçe', split(
    adim(['Başlığı büyük harfle yazın (Caps Lock), Enter.',
          'Başlığa <b>üç kez tıklayıp</b> seçin: ' + K('Ctrl', 'B') + ' kalın, ' + K('Ctrl', 'E') + ' ortala, boyut <b>11 → 14</b>.',
          'Metni yazın; paragrafı seçip ' + K('Ctrl', 'J') + ' <b>iki yana yasla</b>.',
          '<b>Ekle → 📅 Tarih</b>, alt satıra adınız; ikisini seçip ' + K('Ctrl', 'R') + ' sağa hizala.',
          K('Ctrl', 'S') + ' Belgeler’e <b>dilekçe</b>; ' + K('Ctrl', 'P') + ' yazdır.'], 'small'),
    table([[K('Ctrl', 'B'), 'Kalın (K düğmesi)'], [K('Ctrl', 'I') + ' / ' + K('Ctrl', 'U'), 'İtalik / altı çizili'],
           [K('Ctrl', 'E'), 'Ortala'], [K('Ctrl', 'J'), 'İki yana yasla'], [K('Ctrl', 'R') + ' / ' + K('Ctrl', 'L'), 'Sağa / sola hizala']], 'kv tight'), 1.2, .8)))
S.append(slide('Ders 2 · Apartman duyurusu', 'Göze çarpan, tek sayfalık duyuru', table([
    ['Başlık', 'Ortalı, büyük (24–28 punto), kalın'],
    ['Önemli satır', 'Renk ya da kalın: gözün hemen gördüğü yer'],
    ['Düzen → Sayfa kenarlığı', 'Sayfanın çevresine çerçeve çizer'],
    [K('Ctrl', 'P'), 'Yazdırma önizlemesi: kâğıtta nasıl çıkacağını gösterir'],
    ['Tek kâğıt', 'Önizlemede “tek kâğıda sığıyor” yazmalı; taşıyorsa yazıyı küçültün'],
    [K('Ctrl', 'S'), 'Kaydedin; adı anlaşılır olsun']], 'kv')))
S.append(slide('Ders 3–4 · Liste, tablo, resim', 'Belgeye eklemek', split(
    table([['Ekle → Tablo', 'Satır ve sütun sayısını seçip ekler'],
           [K('Tab') + ' / ' + K('Shift', 'Tab'), 'Tabloda sonraki / önceki hücre'],
           ['• Madde işaretleri', 'Enter yeni madde, iki kez Enter listeyi bitirir'],
           ['1. Numaralandırma', 'Sıralı adımlar için'],
           ['Ekle → Resim', 'Bilgisayardaki fotoğrafı koyar'],
           ['Dosya → PDF olarak kaydet', 'Değiştirilemeyen kopya: e-postayla göndermek için']], 'kv tight'),
    '<h2>Resim neden kaçıyor?</h2>' + table([
        ['Köşedeki yuvarlak', 'Orantılı büyütür / küçültür'],
        ['Kenardaki tutamaç', 'Yalnızca en ya da boy: resim basıklaşır'],
        ['⊞ Düzen Seçenekleri', '<b>Metinle aynı hizada</b>: harf gibi durur; <b>Kare / Sıkı</b>: yazı çevresinden akar, resmi sürükleyebilirsiniz'],
        ['Resim Biçimi → ✂ Kırp', 'Siyah çizgileri içeri çekin, Enter']], 'kv tight'), 1, 1)))
S.append(slide('Ders 5 · Tablo incelikleri', 'Aidat ve nöbet çizelgesi', table([
    ['Tabloya tıklayın', 'Sekmelerin yanında <b>Tablo Düzeni</b> çıkar'],
    ['↓ Alta ekle / ↑ Üste ekle', 'Yeni satır'], ['→ Sağa ekle / ← Sola ekle', 'Yeni sütun'],
    ['✕ Satırı sil · ✕ Sütunu sil', 'İşe yaramayanı kaldırır'],
    ['Hücreleri birleştir', 'Yan yana hücreleri sürükleyerek seçin, sonra düğme'],
    ['Çizgiler → Kalın', 'Yazdırınca çizgiler belirgin olur'], ['Hücre içi → Orta', 'Yazıyı hücrenin ortasına alır']], 'kv')))
S.append(slide('Ders 6–7 · Düzenlemek', 'Başlıklar, bul-değiştir, Biçim Boyacısı', split(
    table([['Giriş → Stiller', 'Normal, Başlık 1, Başlık 2, Konu Başlığı'],
           [K('Ctrl', 'F') + ' · ' + K('Ctrl', 'H'), 'Bul · Değiştir (Tümünü değiştir)'],
           [K('F7'), 'Yazım denetimi: kırmızı dalgalı çizgili kelimeler; sağ tık doğrusunu önerir'],
           ['🖍 Vurgu rengi', 'Fosforlu kalem gibi'],
           ['Gözden Geçir → Sözcük sayısı', 'Sayfa, sözcük, karakter']], 'kv tight'),
    table([['🖌 bir kez tıklayın', 'Seçili yazının biçimini alır, sonraki seçtiğinize sürer'],
           ['🖌 çift tıklayın', 'Birçok yere sürersiniz; bitince ' + K('Esc')],
           ['Satır aralığı 1,15 / 1,5', 'Sıkışık yazıyı ferahlatır; resmî yazılarda 1,5'],
           [K('Tab') + ' paragraf başında', 'İlk satır girintisi'],
           ['⇥ / ⇤', 'Paragrafı içeri alır / geri çeker']], 'kv tight'), 1, 1)))
S.append(slide('Ders 8–9 · Sayfa ve simgeler', 'Sayfa düzeni, yazdırma, simgeler', split(
    table([['Düzen → Kenar boşlukları', 'Dar: sayfaya daha çok yazı sığar'],
           ['Düzen → Yönlendirme', 'Dikey (mektup), Yatay (geniş tablo)'],
           ['Yazı taştı', 'Önizlemede “2 sayfa” yazıyorsa boşluğu daraltın ya da yazıyı küçültün'],
           ['Filigran', 'ÖRNEKTİR, ACİL gibi silik arka plan yazısı'],
           [K('Ctrl', 'Enter'), 'Yeni sayfa; Enter’a defalarca basmayın']], 'kv tight'),
    table([['Ekle → Simge', 'Klavyede olmayanlar: ₺ ° ½ © € ✓ ☎'],
           ['₺', 'Klavyede ' + K('AltGr', 'T') + ' de olabilir; Simge menüsü her yerde çalışır'],
           ['°C', 'Derece simgesi ° + C harfi'],
           ['Ekle → Şekil', 'Kutu, yuvarlak kutu, ok; içine yazı yazılır: “GİRİŞ →”']], 'kv tight') +
    note('Yazdırmadan önce hep ' + K('Ctrl', 'P') + ' ile önizlemeye bakın.'), 1, 1)))
S.append(slide('Ders 10 · Adres mektup birleştirme', 'Bir davet, herkese adıyla', split(
    adim(['Davet mektubunu yazın.',
          '<b>Postalar → Alıcıları seç</b>: kişi listesi (hesap tablosu; 1. satır Ad, Adres…).',
          '<b>Birleştirme alanı ekle</b>: «Ad» gibi yer tutucular her mektupta değişir.',
          '<b>Sonuçları önizle</b> ◀ ▶ ile her kişinin mektubuna bakın.',
          '<b>Bitir ve birleştir</b>: tek tek belgeler ya da doğrudan yazdırma.']),
    note('Aynı mektubu otuz kez yazmak yerine bir kez yazar, listeden çoğaltırsınız.'), 1.3, .7)))
S.append(slide('Ders 11–12 · Harfler ve özgeçmiş', 'Büyük/küçük harf, stiller, şablon', split(
    table([['Yazıyı seçin → Aa▾', 'BÜYÜK HARF, küçük harf, Cümle düzeni, Her Sözcüğün İlk Harfi Büyük'],
           ['Caps Lock açık kaldıysa', 'Yazıyı silmeyin; seçip Aa▾ → küçük harf'],
           ['Başlık 3 · Alıntı', 'Küçük ara başlık · girintili eğik yazı'],
           ['Satır aralığı 1,5 / 2,0', 'Uzun yazı rahat okunur'],
           ['Görünüm → Cetvel', 'Kenar boşluklarını ve girintiyi ölçer']], 'kv tight'),
    table([['Dosya → Yeni… → şablon', 'Başlıkları ve düzeni hazır belge'],
           ['[Köşeli parantez]', 'Kendi bilginizle değiştirilecek yer; ' + K('Ctrl', 'F') + ' → [ unutulanı bulur'],
           ['Ekle → Üst bilgi / Alt bilgi', 'Her sayfada tekrarlanan yazı'],
           ['Ekle → Sayfa numarası', '“Sayfa 1 / 2”'],
           ['PDF olarak kaydet', 'İş başvurusunda gönderilecek biçim']], 'kv tight'), 1, 1)))
S.append(slide('Ders 13 · Üst bilgi, dipnot, köprü', 'Uzun belgelerin süsleri', table([
    ['Ekle → Üst bilgi', 'Her sayfanın üstünde tekrarlanan yazı: <b>Çınar Emekliler Derneği</b>'],
    ['Ekle → Alt bilgi', 'Her sayfanın altında: <b>Hazırlayan:</b> adınız, tarih'],
    ['Ekle → Sayfa numarası', 'Alt bilgiye “Sayfa 1 / 2”; sayfalar karışırsa sırası bulunur'],
    ['Başvurular → Dipnot Ekle', 'İmlecin yerine küçük bir sayı; açıklama sayfanın altına (' + K('Alt', 'Ctrl', 'F') + ')'],
    ['Dipnotu silmek', 'Metindeki küçük sayıyı silin; numaralar yeniden sıralanır'],
    ['Köprü (bağlantı)', 'Yazıyı seçin → ' + K('Ctrl', 'K') + ' → adres (<b>www.cinar.bel.tr</b>) → Ekle'],
    ['Köprüyü açmak', K('Ctrl') + ' basılıyken tıklayın: tarayıcıda açılır']], 'kv tight')))
S.append(slide('Ders 14 · Uzun belge', 'Numaralandırma ve içindekiler tablosu', split(
    table([['Satırları seçin → 1. ≡', '<b>Numaralandırma</b>: 1, 2, 3; araya madde eklenince numaralar kendiliğinden kayar'],
           ['Giriş → Stiller → <b>Başlık 1</b>', 'Satıra tıklayıp basın; Word onun bir başlık olduğunu bilir'],
           ['Kalın + büyük yazı', 'Başlık gibi görünür ama içindekiler tablosu onu <b>görmez</b>']], 'kv tight'),
    table([['Başvurular → <b>İçindekiler Tablosu</b>', 'Başlıkları sayfa numaralarıyla listeler (Otomatik Tablo 1)'],
           [K('Ctrl', 'Enter'), 'İçindekiler ilk sayfada tek başına kalsın'],
           ['⟳ <b>Tabloyu Güncelleştir</b>', 'Başlık eklenince, sayfalar kayınca; kendiliğinden yenilenmez'],
           [K('Ctrl') + ' + tık', 'Tablodaki satırdan o başlığa gider']], 'kv tight'), 1, 1)))
S.append(slide('Ders 15 · Bülten', 'Sütunlar, kenarlık, gölgelendirme, sekmeler', split(
    table([['Giriş → 🪣 <b>Gölgelendirme</b>', 'Paragrafın arkasını boyar: başlık bandı'],
           ['Giriş → ▢ <b>Kenarlık</b>', 'Dış Kenarlıklar: çerçeve · Üst Kenarlık: kesme çizgisi'],
           ['Yazıyı seçin → Düzen → <b>Sütunlar → İki</b>', 'Yalnızca seçilen haberler iki sütun olur'],
           ['Seçmeden İki', 'Bütün belge iki sütun olur (başlık da)']], 'kv tight'),
    table([['Paragraf bölümünün oku → <b>Sekmeler…</b>', 'Sekme durağı konumu: <b>15 cm</b>, öncü: <b>2 .......</b>, Ayarla, Tamam'],
           [K('Tab'), 'İmleci durağa götürür, arayı noktalarla doldurur'],
           ['Adı Soyadı: ............', 'Bütün satırlar aynı yerde biter'],
           ['Nokta ya da boşluk tuşu', 'Hizalamak için kullanmayın: satır sonları kayar']], 'kv tight'), 1, 1)))
S.append(slide('Ders 16 · Tutanak', 'Değişiklikleri izle, açıklama, parola', split(
    table([['Gözden Geçir → 📝 <b>Değişiklikleri İzle</b>', 'Açıkken eklenen yazı <u>altı çizili</u> renkli, silinen <s>üstü çizili</s> kalır (' + K('Ctrl', 'Shift', 'E') + ')'],
           ['💬 <b>Yeni Açıklama</b>', 'Seçili yazıya sağ kenarda not balonu; yazı değişmez'],
           ['Sonraki ▶ · ◀ Önceki', 'Değişiklikleri sırayla seçer'],
           ['✔ <b>Kabul Et</b> · ✖ <b>Reddet</b>', 'Öneriyi işler · geri alır; ▾ Tüm Değişiklikleri Kabul Et'],
           ['🗑 Sil', 'Okunan açıklamayı kaldırır']], 'kv tight'),
    adim(['<b>Dosya → Bilgi → Belgeyi Koru → Parola ile Şifrele</b>.',
          'Parolayı yazın, Tamam; <b>aynı parolayı</b> yeniden yazın.',
          'Kaydedin ve kapatın.',
          'Açarken parola sorulur; yanlışsa belge <b>açılmaz</b>.'], 'small') +
    note('Parolayı unutursanız belge kurtarılamaz: güvenli bir yere yazın.'), 1.1, .9)))
S.append(slide('Ders 17 · İlan', 'Metin Kutusu ve WordArt', split(
    table([['Ekle → <b>WordArt ▾</b>', 'Süslü, gölgeli başlık; bir biçim seçin'],
           ['“Metninizi buraya yazın”', 'Seçili gelir; yazmaya başlayınca yerine geçer'],
           [K('Ctrl', 'E'), 'WordArt da satır gibi ortalanır'],
           ['Ne zaman?', 'İlan, afiş, davetiye; dilekçe ve tutanakta <b>kullanmayın</b>']], 'kv tight'),
    table([['Ekle → <b>Metin Kutusu ▾</b>', '<b>Basit Metin Kutusu</b>: çerçeveli ayrı yazı alanı'],
           ['Sağa yaslı kutu', 'Paragrafın yanında durur, yazı çevresinden akar'],
           ['Ne yazılır?', 'Telefon, “Giriş ücretsizdir”, önemli not: göze çarpması gereken kısa yazı'],
           [K('Ctrl', 'P'), 'Kâğıtta nasıl duracağına bakın']], 'kv tight'), 1, 1)))
S.append(slide('Ders 18 · Tekrar', 'Dilekçe parkuru', ul([
    'Kelime İşlemci’yi açın', 'Makam: <b>ÇINAR MAHALLESİ MUHTARLIĞINA</b>', 'Başlık ortalı, kalın, 14 punto',
    '<b>Konu: Sokak lambası hakkında</b> (sola hizalı)', 'En az iki cümlelik paragraf; son cümle: <b>Gereğini saygılarımla arz ederim.</b>',
    'Paragrafı iki yana yaslayın', 'Tarih (Ekle → Tarih) ve ad sağa hizalı', '<b>dilekçe</b> adıyla kaydedin, sonra PDF yapın'], 'task2') +
    note('Nasıl yapılacağı yazmaz; takılınca 💡 İpucu. Süreler tutulur.')))
S.append(slide('Özet', 'Bu hafta öğrendiklerimiz', ozet([
    ['Ctrl + B · I · U', 'Kalın · italik · altı çizili'], ['Ctrl + E · J · R · L', 'Ortala · iki yana · sağa · sola'],
    ['Üç tık', 'Bütün paragrafı seçer'], ['Ctrl + P', 'Yazdırma önizlemesi'],
    ['Ekle → Tablo · Resim · Simge', 'Tablo, fotoğraf, ₺ ° ½ ©'], ['Kare / Sıkı', 'Resmi yazının yanına yerleştirir'],
    ['Tablo Düzeni', 'Satır, sütun ekle; hücreleri birleştir'], ['Ctrl + F · Ctrl + H · F7', 'Bul · değiştir · yazım denetimi'],
    ['🖌 Biçim Boyacısı', 'Biçimi kopyalar'], ['Düzen', 'Kenar boşlukları, yönlendirme, sayfa kenarlığı'],
    ['Ctrl + Enter', 'Yeni sayfa'], ['Postalar', 'Adres mektup birleştirme'],
    ['Aa▾ · PDF', 'BÜYÜK / küçük harf · gönderme'],
    ['Başlık 1 → İçindekiler Tablosu', 'Tabloyu Güncelleştir’i unutmayın'], ['Sütunlar · Sekmeler', 'Seçili yazı iki sütun · noktalı satırlar'],
    ['Değişiklikleri İzle', 'Kabul Et / Reddet · parola']],
    'on küçük görev', 19)))
write('hafta10', '10. Hafta', 'Bilgisayar İşletmenliği – 10. Hafta Alıştırmaları', S)

# ================================================================ HAFTA 11
S = []
S.append(cover('11. Hafta: Hesap tablosu (Excel)', 'Alıştırmalar', 'Alıştırma bilgisayarında uygulamalı ders'))
S.append(slide('Bu hafta', 'On altı ders', plan([
    ('Hücreler ve formüller', 40), ('Biçim, sıralama, grafik', 35), ('Birleştir ve Ortala, #####, satır ekleme', 30),
    ('Otomatik doldurma, dondurma', 30), ('EĞER ve formül kopyalama', 40), ('Sabit başvuru, ETOPLA, filtre', 35), ('DÜŞEYARA', 35),
    ('Excel hataları ve Özet Tablo', 35), ('Yazı işlevleri, YUVARLA, koruma', 35), ('Tarihler, yaş, sayma işlevleri', 35), ('Alt Toplam', 35), ('Açılır liste ve aidat takibi', 35),
    ('Çalışma sayfaları', 30), ('Excel’de yazdırma', 30), ('Ev bütçesi ve pasta grafiği', 35), ('Tablo parkuru', 25)],
    'on küçük görev', 17)))
S.append(slide('Ders 1 · Hesap tablosu', 'Satır, sütun, hücre', split(
    table([['Sütun', 'Yukarıdan aşağı: <b>A, B, C</b>…'], ['Satır', 'Soldan sağa uzanır; numarası <b>1, 2, 3</b>…'],
           ['Hücre adresi', 'Sütun harfi + satır numarası: <b>C4</b>'],
           [K('Enter') + ' / ' + K('Tab'), 'Onaylar; alttaki / sağdaki hücreye geçer'],
           ['=', 'Formül her zaman = ile başlar: <b>=B2+B3</b>'],
           ['∑ Otomatik Toplam', 'Üstteki sayıları toplayan formülü kendisi yazar']], 'kv tight'),
    '<h2>Ev bütçesi</h2>' + table([['Kira', '5000'], ['Elektrik', '750 → 900'], ['Su', '300'], ['Market', '4000'],
                                    ['Toplam (∑)', '10.050 → <b>10.200</b>'], ['=ORTALAMA(B2:B5)', '2.550'], ['=B2*12', 'Kira, bir yıl: 60.000']], 'tight') +
    note('Bir sayı değişince toplam <b>kendiliğinden</b> güncellenir. Çarpı *, bölü /.'), 1, 1)))
S.append(slide('Ders 2–3 · Biçim ve hücreler', 'Biçimlendirmek, sıralamak, grafik', split(
    table([['Sürükleyerek seçmek', 'Aralık seçer: <b>B2:B6</b>'], [K('Ctrl', 'B'), 'Kalın'],
           ['₺', 'Para birimi biçimi: 5.000,00 ₺'], ['Durum çubuğu', 'Seçili sayıların toplamı ve ortalaması en altta'],
           ['↓ Z→A', 'Büyükten küçüğe sıralar'], ['📊 Grafik', 'Seçili adlar ve sayılardan sütun grafiği']], 'kv tight'),
    table([['Birleştir ve Ortala', 'Yan yana hücreleri tek hücre yapar, başlığı ortalar'],
           ['Metni Kaydır', 'Uzun yazı hücre içinde alt satıra iner'],
           ['#####', '<b>Hata değil</b>: sütun dar. Sütun başlığındaki çizgiye çift tıklayın'],
           ['Sütun çizgisini sürükleyin', 'Sütunu elle genişletir'],
           ['Satır numarasına sağ tık', '<b>Ekle</b>: üstüne boş satır · <b>Sil</b>: satırı kaldırır']], 'kv tight'), 1, 1)))
S.append(slide('Ders 5 · EĞER ve kopyalama', 'Not çizelgesi: Geçti mi, kaldı mı?', table([
    ['Doldurma tutamacı', 'Seçili hücrenin sağ altındaki küçük kare: aşağı sürükleyince formülü kopyalar'],
    ['Göreli başvuru', 'Bir alt satıra kopyalanınca B2 → B3 olur'],
    ['=EĞER(D2>=50;"Geçti";"Kaldı")', 'Koşul doğruysa ilki, değilse ikincisi'],
    ['; (noktalı virgül)', 'İşlevin parçalarını ayırır: ' + K('Shift', ',')],
    ['=EĞERSAY(E2:E7;"Geçti")', 'Koşula uyan hücreleri sayar'],
    ['=MAK(…) / =MİN(…)', 'En büyük / en küçük değer'],
    ['🎨 Koşullu Biçim', 'Belli değerdeki hücreleri kendiliğinden renklendirir']], 'kv tight')))
S.append(slide('Ders 6–7 · Sabit başvuru ve DÜŞEYARA', 'Fatura listesi ve fiyat listesi', split(
    table([['%20', 'Hücreye %20 yazılır, hesapta 0,2'],
           ['$B$1', 'Sabit başvuru: kopyalanınca B1 değişmez (gerçek Excel’de ' + K('F4') + ')'],
           ['=ETOPLA(B4:B9;"Market";D4:D9)', 'Kategorisi Market olanların toplamı'],
           ['🔽 Filtre', 'Başlıklara ▾ ekler; bir daha basınca kalkar']], 'kv tight'),
    '<h2>=DÜŞEYARA(A2;$F$2:$G$7;2;YANLIŞ)</h2>' + table([
        ['A2', 'Aranan ürün'], ['$F$2:$G$7', 'Fiyat listesi; aranan değer <b>ilk sütunda</b>'],
        ['2', 'Getirilecek değer 2. sütunda (fiyat)'], ['YANLIŞ', 'Tam eşleşme'],
        ['#YOK', 'Ürün listede yok ya da yanlış yazılmış']], 'kv tight'), 1, 1)))
S.append(slide('Ders 8 · Hatalar ve Özet Tablo', 'Hücrede hata kodu çıkınca', split(
    table([['#DEĞER!', 'Sayı yerine yazı var (“iki yüz”): rakamla yazın'],
           ['#AD?', 'İşlevin adı yanlış: TOPLAM değil <b>TOPLA</b>'],
           ['#SAYI/0!', 'Sıfıra ya da boş hücreye bölünüyor: bölen hücreyi doldurun'],
           ['#####', 'Hata değil: sütun dar']], 'kv'),
    table([['Ekle → 🧮 Özet Tablo', 'Uzun listeyi formülsüz özetler'],
           ['Satırlar', 'Neye göre gruplanacak'], ['Değerler', 'Neyin toplamı'],
           ['Ana liste değişirse', 'Özet tabloyu yeniden oluşturun']], 'kv'), 1, 1)))
S.append(slide('Ders 9 · Yazı işlevleri ve koruma', 'Dağınık listeyi düzeltmek, sayfayı korumak', split(
    table([['=YAZIM.DÜZENİ(A2)', '“fatma nur” → “Fatma Nur”'], ['=BÜYÜKHARF(B2)', '“yılmaz” → “YILMAZ”'],
           ['=KÜÇÜKHARF(C2)', 'Hepsi küçük: e-posta adresleri için'],
           ['=BİRLEŞTİR(D2;" ";E2)', 'Ad ve soyadı yan yana; " " araya boşluk'],
           ['=D2&" "&E2', 'Aynı iş: & işareti (' + K('Shift', '6') + ')']], 'kv tight'),
    table([['=YUVARLA(B8/B9;2)', '12.500 ₺ ÷ 7 daire: kuruşa yuvarlar; 0 yazılırsa tam lira'],
           ['🔓 Hücre Kilidini Aç', 'Koruma açıkken de yazılabilecek hücreler (Ödendi mi?)'],
           ['🔒 Sayfayı Koru', 'Öteki hücreler değiştirilemez; parolayı bir yere yazın'],
           ['Koruma ne değildir?', 'Dosyayı şifrelemez: açan herkes içini görür']], 'kv tight'), 1, 1)))
S.append(slide('Ders 10 · Tarihler ve sayma', 'Kurs kayıt listesi: yaş, son ödeme, kaç kişi?', split(
    table([['12.04.1958', 'Tarih gün.ay.yıl, <b>noktayla</b> yazılır; Excel tanırsa sağa yaslar'],
           ['📅 · 123', 'Tarih aslında sayıdır: 1900’den bu yana geçen gün (21287)'],
           ['=BUGÜN()', 'Bugünün tarihi; her gün kendiliğinden yenilenir'],
           ['=ETARİHLİ(B2;$H$2;"Y")', 'Tam yaş: doğum günü gelmediyse onu da hesaba katar'],
           ['=D2+30', 'Kayıttan 30 gün sonrası: son ödeme günü']], 'kv tight'),
    table([['=BAĞ_DEĞ_DOLU_SAY(A2:A7)', 'Dolu hücreleri sayar: kaç kişi kayıtlı?'],
           ['=BAĞ_DEĞ_SAY(F2:F7)', 'Yalnızca <b>sayıları</b> sayar: kaç kişi sınava girdi?'],
           ['=BOŞLUKSAY(G2:G7)', 'Boş hücreleri sayar: kimin telefonu eksik?'],
           ['=YIL(MİN(B2:B7))', 'En eski tarihin yılı; AY() ayı, GÜN() günü verir'],
           ['_ (alt çizgi)', K('Shift', '-') + ': BAĞ_DEĞ_SAY yazarken']], 'kv tight'), 1, 1)))
S.append(slide('Ders 11 · Alt Toplam', 'Dernek harcamaları: her kalemin altına toplam', split(
    table([['1. ↑ A→Z', 'Önce <b>Kategori</b> sütununa göre sıralayın: aynı kalemler alt alta'],
           ['2. 🔢 Alt Toplam', 'Excel’de: Veri sekmesi → Anahat → Alt Toplam'],
           ['Her değişiklikte', '<b>Kategori</b>: kalem değişince yeni grup başlar'],
           ['Kullanılacak işlev', '<b>Topla</b> (ya da Say, Ortalama, Maks, Min)'],
           ['Alt toplam ekle', '<b>Tutar</b> işaretli'],
           ['Tümünü Kaldır', 'Toplam satırları silinir, liste eski hâline döner']], 'kv tight'),
    '<h2>Sonuç</h2>' + table([['Fatura Toplam', '2.310 ₺'], ['İkram Toplam', '1.310 ₺'], ['Kırtasiye Toplam', '1.470 ₺'],
                             ['Temizlik Toplam', '695 ₺'], ['Genel Toplam', '<b>5.785 ₺</b>']], 'tight') +
    note('Sol üstteki <b>1 2 3</b>: 1 yalnız genel toplam, 2 alt toplamlar, 3 bütün satırlar. '
         '<b>=ALTTOPLAM(9;D2:D4)</b>: 9 = topla. Başka alt toplamları saymaz; TOPLA ise iki kez toplar.'), 1, 1)))
S.append(slide('Ders 4, 12–13 · Pratik araçlar', 'Doldurma, açılır liste, sayfalar', split(
    table([['Doldurma tutamacı', 'Ocak → Şubat → Mart; 1, 2 seçip çekince 3, 4, 5…'],
           ['❄ Üst Satırı Dondur', 'Aşağı inerken başlık satırı yerinde kalır'],
           ['✔ Açılır Liste', 'Yalnızca belirlenen seçenekler: <b>Ödendi, Ödenmedi, Kısmen</b> (virgülle)'],
           ['Neden liste?', '“odendi”, “Ödendi ” gibi farklar sayımı bozar'],
           ['=EĞERSAY(C2:C9;"Ödendi")', 'Kaç kişi ödedi?']], 'kv tight'),
    table([['＋ (alttaki sekmeler)', 'Yeni çalışma sayfası'], ['Sekmeye çift tık', 'Adını değiştirir'],
           ['Sekmeye sağ tık', 'Yeniden adlandır, Sekme rengi, Taşı veya Kopyala, Sil'],
           ['Taşı veya Kopyala → Kopya oluştur', 'Ocak tablosunu Şubat’a çoğaltır; asıl sayfa bozulmaz']], 'kv tight'), 1, 1)))
S.append(slide('Ders 14–15 · Yazdırma ve bütçe', 'Tek kâğıda sığdırmak, pasta grafiği', split(
    table([[K('Ctrl', 'P'), 'Önizleme: kaç sayfa olacak?'],
           ['Tüm sütunları bir sayfaya sığdır', 'Tabloyu küçültüp tek kâğıda alır'],
           ['Yatay', 'Geniş tablolar için'],
           ['Kılavuz çizgilerini yazdır', 'Excel çizgileri kendiliğinden yazdırmaz; açın']], 'kv tight'),
    table([['Dosya → Yeni… → Aylık ev bütçesi', 'Formülleri hazır şablon'],
           ['Rakamı değiştirmek', 'Toplam ve kalan kendiliğinden hesaplanır'],
           ['🥧 Pasta grafiği', 'Her kalem bütünün yüzde kaçı?'],
           ['📊 Sütun grafiği', 'Kalemleri karşılaştırır']], 'kv tight'), 1, 1)))
S.append(slide('Ders 16 · Tekrar', 'Tablo parkuru: pazar alışverişi', split(
    table([['Domates', '45'], ['Peynir', '120,50'], ['Zeytin', '85'], ['Ekmek', '15'], ['Süt', '38,75'], ['Toplam (B6)', '<b>304,25</b>']], 'tight'),
    ul(['Ürünleri A1–A5’e, fiyatları B1–B5’e yazın.', 'B6’da toplamı hesaplatın, kalın yapın.',
        'B1:B6’yı ₺ biçiminde gösterin.', 'A1:B5’i fiyata göre büyükten küçüğe sıralayın; toplam yerinde kalsın.',
        '<b>pazar</b> adıyla Belgeler’e kaydedin.'], 'small'), .7, 1.3)))
S.append(slide('Özet', 'Bu hafta öğrendiklerimiz', ozet([
    ['Hücre adresi', 'Sütun harfi + satır: B3'], ['=', 'Formül = ile başlar'],
    ['=TOPLA · =ORTALAMA', 'Toplam · ortalama; ∑ Otomatik Toplam'], ['₺ · K', 'Para biçimi · kalın'],
    ['Z→A · 📊', 'Sıralama · grafik'], ['#####', 'Sütun dar: çizgiye çift tık'],
    ['Doldurma tutamacı', 'Formülü ve listeyi çoğaltır'], ['=EĞER · =EĞERSAY', 'Koşul · koşula uyanları say'],
    ['$B$1', 'Kopyalanınca değişmeyen adres'], ['=ETOPLA · 🔽 Filtre', 'Koşullu toplam · satırları süz'],
    ['=DÜŞEYARA', 'Listeden fiyat getir'], ['#DEĞER! · #AD? · #SAYI/0!', 'Yazı · yanlış ad · sıfıra bölme'],
    ['=BUGÜN · =ETARİHLİ', 'Bugünün tarihi · yaş hesabı'], ['=BAĞ_DEĞ_SAY · =BOŞLUKSAY', 'Sayıları say · boşları say'],
    ['🔢 Alt Toplam · 1 2 3', 'Sırala, grupla, özeti göster'],
    ['❄ Dondur · ✔ Açılır Liste', 'Başlık sabit · seçenekli hücre'], ['Ctrl + P', 'Tek sayfaya sığdır, kılavuz çizgileri']],
    'on küçük görev', 17)))
write('hafta11', '11. Hafta', 'Bilgisayar İşletmenliği – 11. Hafta Alıştırmaları', S)

# ================================================================ HAFTA 12
S = []
S.append(cover('12. Hafta: Sunu (PowerPoint)', 'Alıştırmalar', 'Alıştırma bilgisayarında uygulamalı ders'))
S.append(slide('Bu hafta', 'On iki ders', plan([
    ('Sunu hazırlayalım', 40), ('İyi bir sunu nasıl olur?', 25), ('Slayt düzenleri ve Slayt Sıralayıcı', 30),
    ('SmartArt: şema ve soy ağacı', 25), ('Asıl Slayt; tablo ve grafik', 30), ('Şekil, WordArt, video, köprü', 40), ('Animasyon ve süre ayarı', 30),
    ('Vurgu, çıkış, Animasyon Bölmesi', 40),     ('Sunum anı: notlar, kısayollar', 30), ('Sunuya hazırlık: prova, kalem', 40), ('Aile ve anı albümü', 40), ('Sunu parkuru', 25)],
    'on küçük görev', 17)))
S.append(slide('Ders 1 · Sunu hazırlayalım', 'Slaytlar ve slayt gösterisi', split(
    table([['Slayt', 'Sununun her bir sayfası'],
           ['Giriş → Yeni Slayt', 'Düzen seçerek slayt ekler: Başlık ve içerik…'],
           ['Giriş → Yazı boyutu', 'Önce yazı kutusuna tıklayın, sonra punto seçin'],
           ['Tasarım', 'Bütün slaytların renk ve arka planı'],
           ['Geçişler', 'Bir slayttan ötekine geçerkenki hareket'],
           ['▲ / ▼', 'Seçili slaydın sırasını değiştirir']], 'kv'),
    table([[K('F5'), 'Gösteriyi baştan başlatır'], [K('→') + ' · ' + K('Boşluk') + ' · tık', 'Sonraki slayt'],
           [K('Esc'), 'Gösteriden çıkar']], 'kv') +
    note('Sunuyu ' + K('Ctrl', 'S') + ' ile kaydedin.'), 1.2, .8)))
S.append(slide('Ders 2 · İyi bir sunu', 'Az yazı, büyük yazı, zıt renk', table([
    ['Az yazı', 'Slayt başına en çok 3–5 kısa madde; konuşurken siz anlatın'],
    ['Büyük yazı', 'Metin en az 24 punto, başlık 32–44 punto: arka sıradan okunmalı. Giriş → <b>Yazı boyutu</b>'],
    ['Zıt renk', 'Açık zemin + koyu yazı ya da tersi; sarı yazı beyaz zeminde okunmaz'],
    ['Tek fikir', 'Her slayt tek bir şey anlatsın'],
    ['Resim', 'Konuyla ilgili ve net olsun'],
    ['Animasyon', 'Az ve tutarlı; her maddede ayrı efekt dikkat dağıtır'],
    ['Yedek', 'USB belleğe ve e-postaya da koyun; bir de PDF kopyası alın'],
    [K('⊞', 'P'), 'Projeksiyon: Yalnızca bilgisayar ekranı, Çoğalt, Genişlet, Yalnızca ikinci ekran']], 'kv')))
S.append(slide('Ders 3–4 · Düzen ve SmartArt', 'Slayt düzenleri, şemalar', split(
    table([['Yeni Slayt ▾', 'Başlık ve içerik, İki içerik, Yalnızca başlık, Fotoğraf ve yazı, Boş'],
           ['⧉ Slaytı Çoğalt', 'Kopyası hemen altına eklenir; yalnızca yazıyı değiştirin'],
           ['Görünüm → Slayt Sıralayıcı', 'Bütün slaytlar küçük resim; sürükleyerek sıra değişir'],
           ['Çift tık (sıralayıcıda)', 'O slaydı düzenlemek için açar']], 'kv tight'),
    table([['Ekle → SmartArt', 'Maddeleri şemaya çevirir'],
           ['Liste', 'Birbirinden bağımsız başlıklar: renkli kutular'],
           ['Süreç', 'Sıralı işler: 1 ➜ 2 ➜ 3'],
           ['Soy ağacı / şema', 'İlk madde üstte, diğerleri altında dallanır'],
           ['↩ Listeye geri dön', 'Maddeleri yeniden yazılabilir yapar']], 'kv tight'), 1, 1)))
S.append(slide('Ders 5 · Asıl Slayt', 'Bütün slaytlara tek seferde', split(
    table([['Görünüm → 🎨 Asıl Slayt', 'Burada yapılan her şey bütün slaytlara uygulanır'],
           ['Logo, Alt bilgi', 'Dernek logosu, kurum adı, tarih: her slaytta aynı yerde'],
           ['Başlık rengi, Yazı tipi', '20 slaydı tek tek değiştirmek yerine bir kez'],
           ['✖ Asıl Görünümü Kapat', 'Normal slaytlara döner']], 'kv tight'),
    table([['Ekle → ▦ Tablo', 'Sütun × satır; ilk satır başlıktır'],
           [K('Tab') + ' (tabloda)', 'Sonraki hücre; son hücrede yeni satır'],
           ['Ekle → 📊 Grafik', 'Küçük tabloya kategori ve değer yazın; grafik kendiliğinden çizilir'],
           ['Sütun / Pasta', 'Karşılaştırma / bütünün payları']], 'kv tight'), 1, 1)))
S.append(slide('Ders 6 · Şekil, WordArt, köprü', 'Kurs tanıtımı: tıklanınca başka slayda ya da siteye', split(
    table([['Ekle → 𝒜 WordArt', 'Süslü, gölgeli yazı; örnek yazının yerine kendinizinkini yazın'],
           ['Ekle → ⬟ Şekiller', 'Dikdörtgen, ok, yıldız, konuşma balonu; içine yazı yazılır'],
           ['Şekil Biçimi → Şekil Dolgusu', 'Şekle tıklayınca çıkan sekme: rengi'],
           ['Sürükle-bırak', 'Şekil ve resim istenen yere taşınır'],
           ['Ekle → 🎬 Video', 'Gösteride tıklayınca oynar; video dosyası sunuyla birlikte taşınmalı']], 'kv tight'),
    table([[K('Ctrl', 'K') + ' (Bağlantı)', 'Seçili yazıya köprü: web adresi'],
           ['Bu Belgeye Yerleştir', 'Köprü başka bir slayda götürür'],
           ['Eylem Düğmeleri', '⌂ Giriş, ◀ Geri, ▶ İleri, ⏭ Son; Eylem Ayarları’nda nereye gideceği seçilir'],
           ['Ekle → Üst Bilgi ve Alt Bilgi', 'Tarih, slayt numarası, alt bilgi; Başlık slaydında gösterme; Tümüne Uygula']], 'kv tight'), 1, 1)))
S.append(slide('Ders 7–8 · Animasyon', 'Maddeler tek tek; nesneye göre giriş, vurgu, çıkış', split(
    table([['Geçiş', 'Slayttan slayda geçerkenki hareket (Geçişler)'],
           ['Animasyon', 'Slaydın içindeki yazı ve resimlerin tek tek gelmesi (Animasyonlar)'],
           ['Tıklayınca / Kendiliğinden', 'Maddeyi siz getirirsiniz / 1’er saniye arayla gelir'],
           ['Kendiliğinden ilerle', 'Slayt 3 sn, 5 sn sonra sonrakine geçer'],
           ['▶ Önizleme', 'Animasyonu slaytta oynatır']], 'kv tight'),
    table([['Giriş · Vurgu · Çıkış', 'Gelir (Belirme) · dikkat çeker (Darbe) · gider (Kaybolma)'],
           ['✚ Animasyon Ekle', 'Aynı nesneye ikinci animasyon; galeri ise var olanı değiştirir'],
           ['☰ Animasyon Bölmesi', 'Bütün animasyonlar sırayla; ▲ ▼ ile sıra, ▶ Oynat ile izleme'],
           ['Başlangıç', 'Tıklatıldığında · Öncekiyle (aynı anda) · Öncekinden Sonra (bitince)'],
           ['Süre · Gecikme', 'Ne kadar sürsün · başlamadan kaç saniye beklesin']], 'kv tight'), 1, 1)))
S.append(slide('Ders 9 · Sunum anı', 'Sunarken notlar ve kısayollar', split(
    table([['Ekle → ＃ Slayt numarası', 'Her slaydın köşesine numara'],
           ['Konuşmacı notları', 'Slaydın altındaki kutu; izleyiciye görünmez'],
           [K('F5') + ' · ' + K('Shift', 'F5'), 'Baştan · geçerli slayttan'],
           [K('B') + ' · ' + K('W'), 'Ekranı karartır · beyaz yapar'],
           ['3 + ' + K('Enter'), '3. slayda atlar']], 'kv tight'),
    table([[K('Home') + ' / ' + K('End'), 'İlk / son slayt'], [K('Esc'), 'Gösteriden çıkar']], 'kv tight') +
    note('Notlarınıza tarihleri, rakamları ve unutmak istemediklerinizi yazın.'), 1.2, .8)))
S.append(slide('Ders 10 · Sunuya hazırlık', 'Not sayfası, prova, kalem, dinleyici notları', split(
    table([['Not Sayfası', 'Görünüm sekmesi: slayt üstte, notunuz altta'],
           ['Okuma Görünümü', 'Sunu pencerede oynar; ' + K('Esc') + ' ile çıkılır'],
           ['⏱ Prova Et', 'Slayt Gösterisi → Zamanlamaları Prova Et: her slaydın süresi'],
           ['Dinleyici notları', 'Yazdırırken: 3 slayt + not çizgileri, izleyiciye'],
           ['Not sayfaları', 'Yazdırırken: slayt + notunuz, size']], 'kv tight'),
    table([[K('Shift', 'F5'), 'Seçili (geçerli) slayttan başlatır'],
           [K('Ctrl', 'P') + ' (gösteride)', 'Fare kalem olur; slayda çizersiniz'],
           ['Sağ tık → İşaretçi Seçenekleri', 'Kalem, Vurgulayıcı, Slayttaki Tüm Mürekkebi Sil'],
           [K('E') + ' · ' + K('Ctrl', 'A'), 'Çizimleri siler · yeniden ok işaretçi'],
           [K('Esc') + ' → Sakla / At', 'Çizimler slaytta kalsın mı?']], 'kv tight'), 1, 1)))
S.append(slide('Ders 11 · Anı albümü', 'Fotoğraflardan sunu, PDF ve video', table([
    ['Ekle → 📸 Fotoğraf Albümü', 'Resimler’deki fotoğraflar için birer slayt'],
    ['Altına yazı', 'Tarih ve kısa not: “Bayram 2026: dedenin bahçesinde”'],
    ['Resim boyutu', 'Küçük / Orta / Büyük (Ekle sekmesi)'],
    ['🎵 Ses', 'Fon müziği; gösteri başlayınca çalar'],
    ['Dosya → PDF olarak kaydet', 'Bilgisayarı olmayanlar da açar; WhatsApp’tan gönderilir'],
    ['Dosya → Video olarak kaydet (.mp4)', 'Her slayt kendi süresi kadar gösterilir'],
    ['Bir kâğıda 4 slayt', 'Yazdırırken düzen seçilir; kâğıt tasarrufu']], 'kv')))
S.append(slide('Ders 12 · Tekrar', 'Sunu parkuru: Kapadokya gezisi', ul([
    'Belgeler’deki <b>Kapadokya gezisi</b> sunusunu açın', 'Başlık: <b>Kapadokya Gezisi</b>, alt başlık: <b>Çınar Emekliler Derneği</b>',
    '2. slayda en az üç madde (Gezi programı)', '3. slayda <b>peri bacaları.jpg</b>',
    'Renkli bir tasarım teması', 'Bütün slaytlara geçiş efekti',
    'Sona “Yalnızca başlık” düzeninde <b>Teşekkürler</b>', 'Kaydedin, sonra PDF olarak Belgeler’e'], 'task2') +
    note('Nasıl yapılacağı yazmaz; takılınca 💡 İpucu. Süreler tutulur.')))
S.append(slide('Özet', 'Bu hafta öğrendiklerimiz', ozet([
    ['Yeni Slayt ▾', 'Düzen seçerek slayt ekler'], ['Tasarım · Geçişler', 'Renk ve arka plan · slayt geçişi'],
    ['F5 · Esc', 'Gösteriyi başlat · çık'], ['3–5 madde, 24+ punto', 'Az ve büyük yazı'],
    ['⧉ Çoğalt · Slayt Sıralayıcı', 'Kopya slayt · sırayı sürükleyerek değiştir'], ['SmartArt', 'Liste, süreç, soy ağacı'],
    ['Asıl Slayt', 'Logo, alt bilgi, yazı tipi: bütün slaytlara'], ['Ekle → Tablo · Grafik', 'Tablo, sütun ve pasta grafiği'],
    ['Animasyonlar', 'Maddeler tek tek gelir'], ['Animasyon Bölmesi', 'Vurgu, çıkış; sıra, Öncekiyle / Öncekinden Sonra'],
    ['Konuşmacı notları', 'Yalnızca siz görürsünüz'],
    ['B · W · 3 + Enter', 'Karart · beyaz · 3. slayda git'], ['PDF · Video olarak kaydet', 'Göndermek için'],
    ['Ctrl + K · Eylem düğmesi', 'Köprü: siteye ya da slayda git'], ['Prova · Ctrl + P (gösteride)', 'Süreyi ölç · kalemle göster']],
    'on küçük görev', 17)))
write('hafta12', '12. Hafta', 'Bilgisayar İşletmenliği – 12. Hafta Alıştırmaları', S)

# ================================================================ HAFTA 13
S = []
S.append(cover('13. Hafta: Günlük işler: bilgisayarda ve tarayıcıda', 'Alıştırmalar', 'Alıştırma bilgisayarında uygulamalı ders'))
S.append(slide('Bu hafta', 'On bir ders', plan([
    ('Günlük işler: tarayıcıda', 40), ('Telefondan bilgisayara fotoğraf', 30),
    ('Uzantılar, geçmiş, gizli pencere', 40), ('Sayfaya not, sık kullanılanlar', 25), ('Çerezler', 35),
    ('PDF dosyalarıyla çalışmak', 30), ('PDF formu doldurmak, yazdırmak', 40), ('Fotoğrafı küçültmek ve kırpmak', 25),
    ('Haritalar ve yol tarifi', 25), ('WhatsApp Web (Mesajlaş Web)', 35), ('Günlük işler parkuru', 25)],
    'sekiz küçük görev', 14)))
S.append(slide('Ders 1–2 · Ekran resmi ve telefon', 'Ekran resmi, kopyalama, telefondan fotoğraf', split(
    table([['PrtSc (Print Screen)', 'Bütün ekranın resmi panoya; Paint’te ' + K('Ctrl', 'V')],
           [K('⊞', 'Shift', 'S'), 'İstediğiniz bölümün resmi (Ekran Alıntısı)'],
           [K('Ctrl', 'C') + ' → ' + K('Ctrl', 'V'), 'Kopyalar: aslı yerinde kalır'],
           [K('Ctrl', 'X') + ' → ' + K('Ctrl', 'V'), 'Taşır: aslı oradan kalkar'],
           ['Sürükle-bırak', 'Aynı diskte taşır, USB belleğe kopyalar']], 'kv tight'),
    '<h2>Telefondan fotoğraf</h2>' + adim([
        'Kabloyu takın: telefon önce yalnızca şarj olur.',
        'Telefondaki bildirimde <b>Dosya aktarımı</b>’nı seçin.',
        '<b>Telefonum › Dahili depolama › DCIM › Kamera</b>',
        'Fotoğrafı seçip ' + K('Ctrl', 'C') + ', Resimler’de ' + K('Ctrl', 'V') + '. Ya da <b>Fotoğrafları içeri aktar</b>.'], 'small'), 1, 1)))
S.append(slide('Ders 1 · Tarayıcıda', 'İndirmek, kopyalamak, büyütmek', table([
    ['Resme sağ tık → Resmi farklı kaydet', 'Fotoğrafı istediğiniz klasöre kaydeder'],
    ['İndir düğmesi', 'Dosya İndirilenler klasörüne gider'],
    ['Yazıyı seç → ' + K('Ctrl', 'C'), 'Not Defteri’nde ' + K('Ctrl', 'V')],
    [K('Ctrl', 'Shift', 'S') + ' / ✂', 'Web yakalama: yalnızca sayfanın resmi'],
    [K('Ctrl', '+') + ' · ' + K('Ctrl', '−') + ' · ' + K('Ctrl', '0'), 'Büyüt · küçült · eski hâline getir'],
    ['☆ / ' + K('Ctrl', 'D'), 'Sayfayı sık kullanılanlara ekler']], 'kv')))
S.append(slide('Ders 3–4 · Tarayıcı ayarları', 'Uzantılar, geçmiş, gizli pencere, not', split(
    table([['🧩 → Yeni uzantılar bul', 'Uzantı mağazası'],
           ['Eklemeden önce', 'Doğrulanmış yayımcı ✔, kullanıcı sayısı, puan, izinler'],
           ['⋯ → Uzantılar', 'Kapatmak ve kaldırmak'],
           [K('Ctrl', 'H'), 'Geçmiş: gezdiğiniz sayfalar'],
           [K('Ctrl', 'Shift', 'Delete'), 'Göz atma verilerini temizle']], 'kv tight'),
    table([[K('Ctrl', 'Shift', 'N'), 'Gizli pencere: geçmiş tutulmaz; ama görünmez olmazsınız'],
           [K('Ctrl', 'F'), 'Sayfada bul: uzun sayfada bir kelime'],
           ['🗒 Yapışkan Not uzantısı', 'Sayfaya kendinize not; not sayfaya göre saklanır'],
           [K('Ctrl', 'Shift', 'B'), 'Sık kullanılanlar çubuğunu göster / gizle']], 'kv tight'), 1, 1)))
S.append(slide('Ders 5 · Çerezler', 'Sizi hatırlayan küçük notlar', table([
    ['Çerez', 'Sitenin tarayıcınıza bıraktığı küçük not: giriş, sepet, tercihler'],
    ['Birinci taraf', 'Gezdiğiniz sitenin kendi çerezi: çoğu zaman yararlı'],
    ['Üçüncü taraf', 'Sayfaya gömülü reklam şirketinin çerezi: sizi siteden siteye izler'],
    ['Çerez penceresi', '“Yalnızca gerekli olanlar” en güvenlisi; “Tümünü kabul et” izlemeye de izin verir'],
    ['Görmek, silmek', '⋯ → Ayarlar → Çerezler. Silince siteler sizi unutur: girişler, sepetler gider'],
    ['Ortak bilgisayar', 'Çıkış yapın; gerekirse verileri silin ya da gizli pencere kullanın']], 'kv')))
S.append(slide('Ders 6–7 · PDF', 'Okumak, doldurmak, yazdırmak', split(
    table([['PDF', 'Fatura, tahlil, resmî yazı: her bilgisayarda aynı görünür; yazısı değiştirilemez'],
           ['◀ ▶ · 🔍 (' + K('Ctrl', 'F') + ')', 'Sayfalar arasında gezinmek · kelime aramak'],
           ['⟳ Döndür', 'Yan taranmış sayfayı düzeltir'],
           ['⬇ İndir · 🖨 Yazdır', 'Kopyasını kaydet · yazıcıya gönder; karıştırmayın']], 'kv tight'),
    table([['T Yazı ekle', 'Boşluğa tıklayıp yazın: formu elle doldurmaya gerek yok'],
           ['🖍 Vurgula · ✍ İmza', 'Önemli yeri boyar · imza yerine tıklayın'],
           ['💾 Kaydet', 'Doldurulmuş hâli yeni dosya; asıl form bozulmaz'],
           ['Yazdırma → Sayfalar', 'Yalnızca gereken sayfa: kâğıt ve mürekkep tasarrufu'],
           ['Kopya, iki yüz, renk', 'Kopya sayısı, iki yüze yazdırma, siyah-beyaz']], 'kv tight'), 1, 1)))
S.append(slide('Ders 8 · Fotoğrafı küçültmek', '“2 MB’den büyük olamaz” hatası', split(
    adim(['Paint’te fotoğrafı açın.', '<b>⤡ Yeniden boyutlandır</b> → Yüzde: <b>50</b>; “En boy oranını koru” açık kalsın.',
          'Vesikalık için <b>⬚ Seç</b> ile yüzün çevresine dik bir dikdörtgen → <b>✂ Kırp</b>.',
          '<b>Farklı kaydet</b>: küçük kopya yeni adla; asıl fotoğraf bozulmasın.']),
    ul(['Telefon fotoğrafı 4000 × 3000 = 12 milyon nokta; yarıya inince dosya yaklaşık <b>dörtte birine</b> iner.',
        'Paint’in altında piksel boyutu ve MB yazar.', 'Yanlış kırptıysanız ' + K('Ctrl', 'Z') + '.',
        'Fotoğraflar uygulamasında: ⋯ → Resmi yeniden boyutlandır.'], 'small'), 1.1, .9)))
S.append(slide('Ders 9–10 · Harita ve mesajlaşma', 'Yol tarifi ve bilgisayarda WhatsApp', split(
    table([['Arama kutusu', '“hastane”, “Menekşe Sokak 8”'], ['＋ / －', 'Yakınlaştır / uzaklaştır'],
           ['🛰 Uydu · 🗺 Harita', 'Yukarıdan fotoğraf · haritaya dönüş'],
           ['➜ Yol tarifi', 'Nereden – Nereye; 🚶 yürüyerek, 🚌 toplu taşıma, 🚗 arabayla'],
           ['🧍 Sarı insan', 'Sokağa sürükleyip bırakın: Sokak Görünümü'],
           ['📍 Konum izni', 'Vermezseniz adresinizi elle yazın']], 'kv tight'),
    table([['Karekod (QR)', 'Telefondan okutulur; telefon ile bilgisayar eşleşir'],
           ['📎 Ataş', 'Belge ya da fotoğrafı sohbete ekler'],
           ['⬇ İndir', 'Gelen fotoğraf İndirilenler’e'],
           ['⋮ → Oturumu kapat', 'Ortak bilgisayarda iş bitince <b>mutlaka</b>'],
           ['Tanımadığınız numara + bağlantı', 'Tıklamayın; doğrulama istemek dolandırıcılıktır']], 'kv tight') +
    note('Alıştırmadaki site: <b>Mesajlaş Web</b>.'), 1, 1)))
S.append(slide('Ders 11 · Tekrar', 'Günlük işler parkuru', ul([
    'Haritalar’da evinizden <b>Kültür Merkezi</b>’ne otobüsle yol tarifi', 'Ekranın resmini alın',
    'Paint’e yapıştırıp Resimler’e <b>yol tarifi</b> adıyla kaydedin', '<b>elektrik faturası.pdf</b>: son ödeme tarihini bulun',
    'Yalnızca o sayfayı yazdırın', 'Mesajlaş Web’i açıp telefonla bağlanın', 'Faturayı Ahmet’e gönderin',
    'Mesajlaş Web’den çıkın'], 'task2') +
    note('Nasıl yapılacağı yazmaz; takılınca 💡 İpucu. Süreler tutulur.')))
S.append(slide('Özet', 'Bu hafta öğrendiklerimiz', ozet([
    ['PrtSc · ⊞ + Shift + S', 'Bütün ekran · bir bölüm'], ['Dosya aktarımı · DCIM', 'Telefondaki fotoğraflar'],
    ['Resmi farklı kaydet', 'Sitedeki fotoğrafı kaydet'], ['Ctrl + / − / 0', 'Sayfayı büyüt, küçült, sıfırla'],
    ['Ctrl + D · Ctrl + H', 'Sık kullanılan · geçmiş'], ['Ctrl + Shift + N', 'Gizli pencere'],
    ['Çerez penceresi', '“Yalnızca gerekli olanlar”'], ['PDF: T Yazı ekle', 'Formu bilgisayarda doldur'],
    ['Yazdırma → Sayfalar', 'Yalnızca gereken sayfa'], ['Yeniden boyutlandır %50', '2 MB sınırına sığdır'],
    ['➜ Yol tarifi · 🧍', 'Güzergâh · Sokak Görünümü'], ['Oturumu kapat', 'Ortak bilgisayarda WhatsApp Web']],
    'sekiz küçük görev', 14)))
write('hafta13', '13. Hafta', 'Bilgisayar İşletmenliği – 13. Hafta Alıştırmaları', S)

# ================================================================ HAFTA 14
S = []
S.append(cover('14. Hafta: İnternette işlemler', 'e-Devlet, randevu, e-Nabız, alışveriş, görüntülü görüşme, ilan siteleri', 'Alıştırma bilgisayarında uygulamalı ders'))
S.append(slide('Bu hafta', 'Dokuz ders', plan([
    ('e-Devlet’ten belge almak', 40), ('Hastane randevusu: form doldurmak', 30), ('İnternetten güvenli alışveriş', 40),
    ('Sanal kart, IBAN, dekont', 35), ('Görüntülü görüşme', 30), ('e-Nabız: reçete ve tahlil', 30),
    ('SGK, kayıtlı hatlar, belediye, CİMER', 35), ('İlan siteleri ve kapora tuzakları', 30), ('e-Hizmet parkuru', 30)],
    'sekiz küçük görev', 13)))
S.append(slide('Ders 1 · e-Devlet', 'Belge almak: ikametgâh', split(
    adim(['Adres çubuğuna kendiniz yazın: <b>turkiye.gov.tr</b> (reklamlara değil).',
          '<b>Hizmet ara</b>: ikametgâh → Yerleşim Yeri (İkametgâh) ve Diğer Adres Belgesi Sorgulama.',
          '<b>Giriş Yap</b>: T.C. Kimlik No ve e-Devlet şifresi.',
          'Kendim → Bankaya verilecek → <b>Belge Oluştur</b>.',
          '📄 <b>Belgeyi indir (PDF)</b> → aç → 🖨 Yazdır.',
          'İş bitince sağ üstte <b>⏻ Çıkış</b>.'], 'small'),
    table([['e-Devlet şifresi', 'PTT’den alınır; büyük-küçük harf farklıdır'],
           ['Barkodlu Belge Doğrulama', 'Size verilen belgenin gerçek olup olmadığına bakar'],
           ['Telefonda şifre isteyen', 'Kapatın; şifre kimseye söylenmez']], 'kv tight') +
    note('Kurs bilgileri: T.C. Kimlik No 12345678950, şifre Kurs2026. Gerçek bilgileriniz kullanılmaz.'), 1.15, .85)))
S.append(slide('Ders 2 · Hastane randevusu', 'MHRS’de form doldurmak', split(
    table([['* (yıldız)', 'Doldurulması zorunlu alan'], ['Kırmızı yazı', 'O alanda hata var: okuyun, düzeltin, yeniden gönderin'],
           ['Açılır liste ⌄', 'Tıklayın, listeden seçin'], ['Seçenek düğmeleri', 'Birini seçersiniz: gün, saat (gri olanlar dolu)'],
           ['☐ Onay kutusu', 'Tıklayınca ✔ olur'], [K('Tab'), 'Bir sonraki kutu']], 'kv tight'),
    ul(['Klinik: <b>Göz Hastalıkları</b>; gün ve boş saat; “Aydınlatma metnini okudum” → <b>Randevuyu onayla</b>.',
        '<b>⬇ Randevu belgesini indir (PDF)</b>: randevu kodu ve saat yazar.',
        'Gidemeyecekseniz: <b>Randevularım</b> → İptal et.',
        'Telefonla <b>182</b>’yi aramak da olur.'], 'small'), 1, 1)))
S.append(slide('Ders 3–4 · Alışveriş ve ödeme', 'Sepet, kart, IBAN, dekont', split(
    table([['Sepete ekle → Sepetim', '− / + ile adet'], ['Kargo', 'Belli tutarın üstünde çoğu zaman bedava'],
           ['Kapıda ödeme', 'Ürün gelince ödersiniz; biraz ek ücret'],
           ['Kart ile ödeme', 'Yalnızca 🔒 ve adresini bildiğiniz sitelerde; “Kartımı kaydet” işaretini kaldırın'],
           ['3D Secure SMS kodu', 'Ödemeyi onaylar; <b>kimseye söylenmez</b>'], ['Siparişlerim', 'Kargo nerede?']], 'kv tight'),
    table([['Asıl kart', 'Kartlarım → “İnternet alışverişine açık” kutusunu boşaltın'],
           ['Sanal kart', 'İnternet için ayrı numara; belirlediğiniz limit kadar harcanır'],
           ['IBAN', 'TR + 24 rakam = 26 karakter. Elle yazmayın: ' + K('Ctrl', 'C') + ' → ' + K('Ctrl', 'V')],
           ['Alıcı adı', 'IBAN sahibiyle uyuşmazsa para gitmez'],
           ['📄 Dekont (PDF)', 'Ödemenin kanıtı; mesajla ya da e-postayla gönderilir']], 'kv tight') +
    note('İş bitince internet şubesinden mutlaka <b>çıkış</b> yapın.'), 1, 1)))
S.append(slide('Ders 5 · Görüntülü görüşme', 'Görüşmeye katılmak', (
    table([['Davet bağlantısı', 'Tıklayınca görüşme tarayıcıda açılır (adresine bakın!)'],
           ['Kamera ve mikrofon izni', 'Tanıdığınız görüşme sitesine <b>İzin ver</b>'],
           ['🎤 / 🔇', 'Sesinizi açar / kapatır'], ['📷 / 🚫', 'Kameranızı açar / kapatır'],
           ['💬 Sohbet · ✋ El kaldır', 'Yazıyla mesaj · söz istemek'], ['📞 Ayrıl', 'Görüşmeden çıkar']], 'kv') +
    note('Görüşmeye katılmadan önce bağlantının adresine bakın; tanımadığınız siteye kamera izni vermeyin.'))))
S.append(slide('Ders 6 · e-Nabız', 'Reçete ve tahlil sonuçlarınız', table([
    ['enabiz.gov.tr', '.gov.tr: devletin sitesi; “e-Devlet ile giriş yap” sizi e-Devlet’e götürür'],
    ['Şifre nereye yazılır?', 'Yalnızca adres çubuğunda <b>turkiye.gov.tr</b> yazan sayfaya'],
    ['💊 Reçetelerim', 'Geçmiş ve eczaneden alınabilecek reçeteler'],
    ['🧪 Tahlil sonuçlarım', 'Sonuç ve referans aralığı; ⚠ işaretli değeri doktorunuza gösterin'],
    ['⬇ PDF olarak indir', 'Sonucu kaydeder; hekime gösterilebilir'],
    ['👩‍⚕️ Aile hekimim', 'Hekimin adı, birimi, telefonu'], ['⏻ Çıkış', 'İşiniz bitince mutlaka']], 'kv')))
S.append(slide('Ders 7 · e-Devlet ve kamu hizmetleri', 'SGK, kayıtlı hatlar, belediye, CİMER', table([
    ['SGK Tescil ve Hizmet Dökümü', 'Kaç gün sigortalı çalıştığınız; belge olarak indirilir'],
    ['SGK Emekli Aylık Bilgileri', 'Her ay yatan aylık ve kesintiler; tanımadığınız kesintiyi <b>ALO 170</b>’e sorun'],
    ['Mobil Hat Sorgulama', 'Adınıza açılmış bütün hatlar; bilmediğiniz hat için operatöre ve savcılığa başvurun'],
    ['Şirket Ortaklık Bilgileri', 'Adınıza kurulmuş şirket var mı? Yılda bir bakın'],
    ['Belediye → Çözüm Merkezi (153)', 'Lamba, çukur, çöp: fotoğraf ve açık adres; başvuru numarasını not edin'],
    ['CİMER', 'Kurumdan sonuç alamazsanız; önceki başvuru numarasını yazın. Cevap 30 gün içinde']], 'kv')))
S.append(slide('Ders 8 · İlan siteleri', 'Arama ve kapora tuzakları', split(
    table([['Filtre', 'İl, oda sayısı, en çok fiyat: sonuçları daraltır'],
           ['Satıcı bilgisi', 'Üyelik süresi, telefon doğrulaması'],
           ['🚩 Şikayet et', 'Sahte ilanı siteye bildirin']], 'kv'),
    '<h2>Şüpheli ilan</h2>' + ul(['Fiyat çok düşük', 'Ev gösterilmiyor; “anahtar kargoyla”', '“Hemen kapora yatırın”']) +
    note('Evi görmeden ve sözleşmeyi imzalamadan <b>kapora göndermeyin</b>.'), 1, 1)))
S.append(slide('Ders 9 · Tekrar', 'e-Hizmet parkuru: 11 görev', ul([
    'Tarayıcıyı açıp e-Devlet’e gidin', 'Kurs bilgileriyle giriş yapın', 'İkametgâh belgesini PDF olarak indirin',
    'MHRS’den Göz Hastalıkları randevusu alın', 'Randevu belgesini PDF olarak indirin', 'Randevularım’da randevuyu görün',
    'e-Nabız’a girip bir tahlil sonucunu indirin', 'İndirdiğiniz bir PDF’yi açın', 'e-Devlet’ten çıkış yapın'], 'task2') +
    note('Nasıl yapılacağı yazmaz; takılınca 💡 İpucu. Süreler tutulur.')))
S.append(slide('Özet', 'Bu hafta öğrendiklerimiz', ozet([
    ['turkiye.gov.tr', 'e-Devlet’in tek gerçek adresi'], ['Belge Oluştur → İndir', 'PDF İndirilenler’e iner'],
    ['Barkodlu Belge Doğrulama', 'Belge gerçek mi?'], ['* · kırmızı yazı', 'Zorunlu alan · hata var'],
    ['MHRS · 182', 'Hastane randevusu'], ['3D Secure SMS kodu', 'Kimseye söylenmez'],
    ['Sanal kart', 'Limitli internet kartı'], ['IBAN', 'Kopyala-yapıştır; alıcı adı uyuşmalı'],
    ['🎤 · 📷 · 📞', 'Mikrofon · kamera · ayrıl'], ['enabiz.gov.tr', 'Reçete, tahlil, aile hekimi'],
    ['Mobil Hat Sorgulama', 'Adınıza açılmış hatlar'], ['153 · CİMER', 'Belediye · kurumdan sonuç yoksa'],
    ['Kapora', 'Görmeden, imzalamadan göndermeyin'], ['⏻ Çıkış', 'Ortak bilgisayarda her zaman']],
    'sekiz küçük görev', 13)))
write('hafta14', '14. Hafta', 'Bilgisayar İşletmenliği – 14. Hafta Alıştırmaları', S)

# ================================================================ HAFTA 15
S = []
S.append(cover('15. Hafta: Bilgi güvenliği', 'Yedek, iki adımlı doğrulama, sosyal medya, kişisel veriler', 'Alıştırma bilgisayarında uygulamalı ders'))
S.append(slide('Bu hafta', 'Altı ders', plan([
    ('Yedekleme', 40), ('İki adımlı doğrulama ve yedek kodlar', 30), ('Sosyal medyada güvenlik', 35),
    ('Kişisel veriler ve ortak Wi-Fi', 30), ('Dolandırıldım, ne yapmalıyım?', 35), ('Bilgi güvenliği parkuru', 25)],
    'sekiz küçük görev', 13)))
S.append(slide('Ders 1 · Yedekleme', 'Fotoğrafları ve belgeleri kaybetmeyin', split(
    adim(['USB belleği takın; içinde <b>Yedek</b> klasörü açın.',
          'Resimler’de ' + K('Ctrl', 'A') + ', ' + K('Ctrl', 'C') + ' → USB › Yedek → ' + K('Ctrl', 'V') + '. Aynısını Belgeler için.',
          'Yedekteki bir dosyayı açıp deneyin: açılmayan yedek, yedek değildir.',
          '☁ Bulut Depo → ⬆ Yükle: bir kopya da evin dışında.',
          'Belleği ⏏ güvenle çıkarın; takılı bırakmayın.'], 'small'),
    table([['Üç kopya', 'Bilgisayarda + USB bellekte + bulutta; biri evin dışında'],
           ['Fidye yazılımı', 'Dosyaları kilitleyip para ister. Ödemeyin; temizletip yedekten geri yükleyin'],
           ['Ne sıklıkla?', 'Ayda bir; çok fotoğraf çekiyorsanız haftada bir. Windows’ta Dosya Geçmişi de yapar']], 'kv tight'), 1.1, .9)))
S.append(slide('Ders 2 · İki adımlı doğrulama', 'Şifre + telefon: iki kilit', split(
    table([['Nedir?', 'Girişte şifreden sonra telefonunuza gelen kod da sorulur. Şifreyi öğrenen tek başına giremez'],
           ['Nerede açılır?', 'Hesabın <b>Ayarlar → Güvenlik</b> bölümünde: e-posta, sosyal medya, alışveriş hesapları'],
           ['SMS kodu', 'Yalnızca girdiğiniz sitenin sayfasına yazılır; telefonda soran herkes dolandırıcıdır'],
           ['Doğrulama uygulaması', 'Telefona kurulur, her 30 saniyede yeni kod üretir']], 'kv tight'),
    table([['Yedek kodlar', 'Telefon kaybolursa girmenin yolu: kâğıda yazıp evde saklayın; her biri bir kez kullanılır'],
           ['Siz istemeden kod geldi', 'Biri şifrenizi biliyor: kodu kimseye vermeyin, şifrenizi hemen değiştirin']], 'kv tight') +
    note('Alıştırma sitesi: <b>Dostlarım</b> (www.dostlarim.com.tr).'), 1.1, .9)))
S.append(slide('Ders 3 · Sosyal medya', 'Paylaştığınızı kimler görüyor?', table([
    ['👁 Başkası nasıl görüyor?', 'Profilinizi arkadaşınız olmayan birinin gözüyle görün'],
    ['Ayarlar → Gizlilik', 'Profil ve gönderiler: Arkadaşlar · Telefon: Yalnızca ben · Konum: kapalı'],
    ['Tatil paylaşımı', '“Ev boş” demeyin: fotoğrafları döndükten sonra, yalnızca arkadaşlara'],
    ['Taklit hesap', 'Zaten arkadaşınız olan birinden yeni istek, 0 ortak arkadaş, yeni hesap → sahte hesap olarak bildirin'],
    ['“Acil para lazım” mesajı', 'Para göndermeyin; kişiyi bildiğiniz numarasından arayın, mesajı şikâyet edin'],
    ['Çekiliş tuzağı', 'Kart bilgisi, “kargo ücreti” isteyen çekiliş sahtedir: tıklamayın, şikâyet edin']], 'kv')))
S.append(slide('Ders 4 · Kişisel veriler ve ortak Wi-Fi', 'Kime ne verilmez?', split(
    table([['Kişisel veri', 'Ad, T.C. kimlik no, adres, telefon, fotoğraf, sağlık ve banka bilgisi, anne kızlık soyadı'],
           ['Telefonda isteyen', 'T.C. kimlik no, anne kızlık soyadı, kart ve şifre söylenmez; kurumu kendiniz arayın'],
           ['Kimlik fotokopisi', 'Gerçekten gerekli mi? Verirseniz üstüne “… için verilmiştir” ve tarih yazın'],
           ['KVKK', 'Kurumlara ne tuttuklarını sorabilir, silinmesini isteyebilirsiniz']], 'kv tight'),
    table([['Açık (şifresiz) Wi-Fi', 'Kafe, hastane, otogar: haber okumak olur; banka, e-Devlet, alışveriş olmaz'],
           ['Ağ profili', 'Herkese açık yerde <b>Ortak ağ</b>; yalnızca evde Özel ağ'],
           ['Acil iş', 'Wi-Fi’yi kesip telefonun mobil internetini kullanın']], 'kv tight'), 1.1, .9)))
S.append(slide('Ders 5 · Dolandırıldım', 'Sırayla ne yapmalı?', split(
    adim(['<b>Kartı kapatın:</b> internet şubesi → Kartlarım → Kartı geçici olarak kapat; ya da kartın arkasındaki numara.',
          '<b>İtiraz edin:</b> tanımadığınız harcama için bankaya “ben yapmadım”.',
          '<b>Delil saklayın:</b> ekran görüntüsü (' + K('⊞', 'Shift', 'S') + ').',
          '<b>Şifreleri değiştirin:</b> aynı şifreyi kullandığınız bütün hesaplar.',
          '<b>Tanımadığınız cihaz:</b> Ayarlar → Oturum açılan cihazlar → Oturumu kapat.',
          '<b>Şikâyet:</b> delillerle karakola, jandarmaya ya da Cumhuriyet Başsavcılığına.'], 'small'),
    table([['155 / 156', 'Tehlike anında Polis İmdat / jandarma; çoğu ilde 112’ye bağlanır'],
           ['CİMER', 'Kamu kurumundan sonuç alamazsanız; başvuru numaranızı yazın'],
           ['e-Devlet', 'Kimliğiniz de gittiyse adınıza hat ya da şirket açılmış mı bakın']], 'kv tight') +
    note('Utanmayın: dolandırıcılık herkesin başına gelebilir. Ne kadar erken, o kadar iyi.'), 1.15, .85)))
S.append(slide('Ders 6 · Tekrar', 'Bilgi güvenliği parkuru: 8 görev', ul([
    'Telefon numaraları dosyasını USB’ye kopyalayın', 'Belleği güvenle çıkarın',
    'Dostlarım’da iki adımlı doğrulamayı SMS ile açın', 'Yedek kodları indirin',
    'Telefon numaranızı yalnızca siz görün', 'Taklit hesabı bulup bildirin',
    'Çekiliş tuzağını şikâyet edin', 'Kafe_Ücretsiz’i Ortak ağ yapıp bağlantıyı kesin'], 'task2') +
    note('Nasıl yapılacağı yazmaz; takılınca 💡 İpucu. Süreler tutulur.')))
S.append(slide('Özet', 'Bu hafta öğrendiklerimiz', ozet([
    ['Yedek', 'Başka yerdeki kopya; açıp deneyin'], ['Üç kopya', 'Bilgisayar + USB + bulut'],
    ['Fidye yazılımı', 'Ödemeyin; yedekten geri yükleyin'], ['İki adımlı doğrulama', 'Şifre + telefona gelen kod'],
    ['Yedek kodlar', 'Kâğıtta, evde'], ['Gizlilik', 'Arkadaşlar; telefon yalnızca ben; konum kapalı'],
    ['Taklit hesap · çekiliş', 'Bildirin, tıklamayın'], ['Kişisel veri', 'Telefonda söylenmez'],
    ['Şifresiz Wi-Fi', 'Banka, e-Devlet, alışveriş yok'], ['Dolandırıldıysanız', 'Kartı kapat, itiraz, delil, şifre, şikâyet'],
    ['155 · CİMER', 'Tehlike anı · kurumdan sonuç yoksa']],
    'sekiz küçük görev', 13)))
write('hafta15', '15. Hafta', 'Bilgisayar İşletmenliği – 15. Hafta Alıştırmaları', S)

# ================================================================ EK: GÜVENLİK
S = []
S.append(cover('Ek dersler: güvenlik, yapay zekâ, kurs bitirme', 'İnternette güvenlik, yapay zekâ, yazma hızı, büyük parkur ve kurs bitirme sınavı', 'Alıştırma bilgisayarında uygulamalı ders'))
S.append(slide('Ek', 'Beş ders', table([
    ['<span class="num">1</span>&nbsp; İnternette güvenlik', '20 dk', 'Sahte mesaj, arama ve siteleri tanımak; doğrulama kodu, güçlü şifre'],
    ['<span class="num">2</span>&nbsp; Yapay zekâya soru soralım', '30 dk', 'Özet, tarif, dilekçe taslağı; kişisel bilgi yazmama kuralı'],
    ['<span class="num">3</span>&nbsp; Yazma hızı ölçümü', '10 dk', 'Dakikada kaç kelime? Her hafta tekrar edilebilir'],
    ['<span class="num">4</span>&nbsp; Büyük parkur', '40 dk', 'Torunun doğum günü: kursun tamamı tek bir günlük işte'],
    ['<span class="num">5</span>&nbsp; Kurs bitirme sınavı', '38 dk', '14 haftadan 25 soru']], '', head=['Ders', 'Süre', 'Ne yapıyoruz'])))
S.append(slide('Ders 1 · İnternette güvenlik', 'Dur · Düşün · Sor (20 dk)',
    ul(['<b>Acele ettirir:</b> “Hemen! Yoksa hesabınız kapanacak!”',
        '<b>Korkutur</b> ya da <b>ödül vaat eder</b>.',
        '<b>Şifre, kart numarası, SMS kodu</b> ister.',
        '<b>Garip bir bağlantıya</b> tıklatmak ister.']) +
    note('Dolandırıcıların mesajlarında hep aynı işaretler vardır. Alıştırmada her örneğe “güvenli mi, dolandırıcılık mı?” diye karar verilir.')))
S.append(slide('Ders 1 · Oyun · Kargo mesajı', 'İşaretleri bulun', split(
    ul(['“Kargonuz teslim edilemedi.” Siparişiniz yoksa zaten şüpheli.',
        '“24 saat içinde.” Acele ettiriyor.',
        'Bağlantı gerçek kargo firmasının adresi değil.'], 'small') +
    note('Cevap: <b>dolandırıcılık</b>. Kargonuz varsa firmanın kendi sitesinden ya da uygulamasından takip numarasıyla bakın.'),
    fig('gv_cevap.jpg', 'Cevap verilince ipuçları sarıyla işaretlenir.'), .9, 1.1)))
S.append(slide('Ders 1 · Oyun · Sekiz örnek', 'Hangisi güvenli, hangisi değil?', table([
    ['Kargo mesajı', '<span class="tag bad">dolandırıcılık</span> Acele ettiriyor, garip bağlantı'],
    ['Banka: “hesabınız bloke”', '<span class="tag bad">dolandırıcılık</span> Banka SMS ile şifre ya da kart bilgisi <b>asla</b> istemez'],
    ['Doğrulama kodu (siz giriş yaptınız)', '<span class="tag ok">güvenli</span> Ama kodu <b>kimseyle paylaşmayın</b>'],
    ['Telefonda “banka güvenlik birimi”', '<span class="tag bad">dolandırıcılık</span> Gelen kodu isteyen her arama; kapatın, bankayı kendiniz arayın'],
    ['“Babaanne, yeni numaram, 5.000 TL lazım”', '<span class="tag bad">dolandırıcılık</span> Eski numarasından arayıp doğrulayın'],
    ['Fatura e-postası (bağlantı, acele yok)', '<span class="tag ok">güvenli</span> Yine de tutarı bankanızdan kontrol edin']], 'kv small')))
S.append(slide('Ders 1 · Oyun · Sahte site, sahte uyarı', 'Adrese ve uyarıya dikkat', two(
    'gv_adres.jpg', '<b>A:</b> bankanın kendi adresi, kilit var. <b>B:</b> fazladan kelimeler, .xyz, “Güvenli değil”.',
    'gv_virus.jpg', '<b>Sahte virüs uyarısı:</b> numarayı aramayın. Sekmeyi ya da tarayıcıyı kapatın.')))
S.append(slide('Ders 1 · Alıştırma', 'Güçlü şifre', split(
    ul(['En az <b>12 karakter</b>',
        'Büyük + küçük harf, rakam, işaret',
        'Doğum yılı, isim, 1234 <b>olmasın</b>',
        'İpucu: üç kelimeyi birleştirin: <b>MaviBalık!Çay7</b>'], 'small') +
    note('Her yerde aynı şifreyi kullanmayın. Gerçek şifrenizi alıştırmada yazmayın.'),
    fig('gv_sifre.jpg', 'Çubuk “Çok güçlü” olana kadar deneyin.'), 1, .9)))
S.append(slide('Ders 1 · Özet', 'Altın kurallar', table([
    ['Acele ettiren, korkutan mesaj', 'Durun, düşünün, kimseye hemen bilgi vermeyin'],
    ['Şifre, kart bilgisi, SMS kodu', 'Banka ve devlet kurumları telefonla ya da SMS ile <b>asla</b> istemez'],
    ['Garip bağlantılar', 'Tıklamayın; siteyi kendiniz açın'],
    ['“Acil para lazım” diyen yakın', 'Önce bildiğiniz eski numarasından arayıp doğrulayın'],
    ['Sahte virüs uyarısı', 'Numarayı aramayın; sekmeyi ya da tarayıcıyı kapatın'],
    ['Emin değilseniz', 'Bir yakınınıza danışın']], 'kv')))
S.append(slide('Ders 2 · Yapay zekâ', 'Dijital yardımcıya soru soralım', split(
    ul(['<b>Yapay zekâ</b>, yazdığınız soruya insan gibi cevap veren bir programdır; sohbet eder gibi yazarsınız.',
        'Alıştırmada <b>Dijital Yardımcı</b>: adres çubuğuna <b>yardimci.bulalim.com</b>.',
        'Yazıyı özetletin, tarif ya da gezi planı isteyin, dilekçe taslağı yazdırın.'], 'small'),
    table([['Soru yazmak', 'Sade Türkçe; ayrıntı ekleyin: kaç kişilik, kaç gün'],
           ['Özetletmek', 'Uzun resmî yazıyı yapıştırıp “özetler misin?”'],
           ['Taslak', 'Dilekçe, mektup, tebrik; ad, tarih, imzayı siz ekleyin']], 'kv'), 1, 1)))
S.append(slide('Ders 2 · Yapay zekâ', 'İki kural: özel bilgi yok, cevabı kontrol et', split(
    table([['Asla yazmayın', 'T.C. kimlik no, kart numarası, CVV, IBAN, şifre, SMS kodu'],
           ['Doğrulayın', 'Yapay zekâ yanılabilir ya da uydurabilir: “Mahallemizin muhtarı kim?”'],
           ['Karar sizin', 'Sağlık, hukuk ve para konularında uzmana danışın']], 'kv'),
    '<h2>İyi soru</h2><p style="font-size:20px"><span class="tag bad">kötü</span> Yemek</p>'
    '<p style="font-size:20px"><span class="tag ok">iyi</span> Dört kişilik, etsiz, 30 dakikada hazır olan bir akşam yemeği tarifi ver</p>' +
    note('Verdiği doktor adı, telefon, çalışma saati gibi bilgiyi e-Nabız, MHRS ya da hastane sitesinden doğrulayın.'), 1.1, .9)))
S.append(slide('Ders 3–5 · Kursu bitirirken', 'Yazma hızı, büyük parkur, sınav', table([
    ['Yazma hızı ölçümü', 'Kısa bir metni Not Defteri’ne yazın; süre ilk tuşta başlar, bitince Enter. Dakikada kaç kelime ve yüzde kaç doğru yazdığınız saklanır; her hafta tekrar edip ilerlemenizi görün. Önce doğru, sonra hızlı.'],
    ['Büyük parkur', 'Torununuz Elif’in doğum günü: 10 görev, yönlendirme yok, süre tutulur.'],
    ['Kurs bitirme sınavı', '14 haftadan 25 soru. En az %70’ini ilk denemede bilirseniz <b>kurs bitirme belgenizi</b> yazdırabilirsiniz.']], 'kv')))
S.append(slide('Ders 4 · Büyük parkur', 'Torunun doğum günü: 10 görev', ul([
    'Belgeler’de <b>Doğum Günü</b> klasörü', 'Kelime İşlemci: <b>DOĞUM GÜNÜ DAVETİ</b> ortalı, kalın; <b>Cumartesi saat 15.00</b>',
    'Davetiyeyi klasöre <b>davetiye</b> adıyla kaydedin', 'Hesap Tablosu: Pasta 450 · Balon 120 · İçecek 200; B4’te formülle toplam',
    'Tabloyu <b>harcamalar</b> adıyla kaydedin', 'Ahmet’e <b>Doğum günü daveti</b> konulu, davetiye ekli e-posta',
    'Haritalar: <b>Gül Apartmanı</b>’na yürüyerek yol tarifi', 'Bankam: <b>300 ₺</b> limitli sanal kart',
    'İnternet şubesinden çıkış', 'Doğum Günü klasörünü açıp bakın'], 'task2') +
    note('Kursun bütün konuları tek bir günlük işte: dosya, yazı, tablo, e-posta, harita, güvenli ödeme.')))
S.append(slide('Özet', 'Kursun altın kuralları', table([
    ['Acele ettiren mesaj', 'Durun, düşünün; şifre, kart bilgisi, SMS kodu kimseye verilmez'],
    ['Bağlantı', 'Tıklamayın; siteyi adresini kendiniz yazarak açın'],
    ['Yapay zekâ', 'Özel bilgi yazmayın; cevabı resmî kaynaktan kontrol edin'],
    ['Kaydet', K('Ctrl', 'S') + ' sık sık; önemli dosyaların yedeği'],
    ['Takıldığınızda', K('Ctrl', 'Z') + ', 💡 İpucu, ekran resmi alıp güvendiğiniz birine sorun'],
    ['Ortak bilgisayar', 'İş bitince <b>çıkış</b> yapın']], 'kv')))
write('ek-guvenlik', 'Ek dersler', 'Bilgisayar İşletmenliği – Ek Dersler: Güvenlik, Yapay Zekâ, Kurs Bitirme', S)


# ================================================================ DONANIM
# Öğrencilere gösterilen slaytlar (cevapsız) + öğretmen için ayrı not dosyası (cevaplar, anlatım, 3B adımı).
# Görseller 3B "Donanım dersi"nin adımlarından alınır: img2/dh_<adım>.jpg (adım 0'dan başlar).
def orn(t):
    return f'<div class="ornek"><b class="t">Örnek</b>{t}</div>'


def dus(t):
    return f'<p class="soru"><b class="t">Düşünelim</b>{t}</p>'


def resim(img, cap='', style=''):
    c = f'<figcaption>{cap}</figcaption>' if cap else ''
    return f'<figure class="fig dark"><img src="{IMG}{img}" style="{style}">{c}</figure>'


# Her parça: slayt + öğretmen notu aynı kayıttan üretilir
# adim: 3B dersteki adım numarası (ekranda görünen), anlat: öğretmenin ek anlatımı, dikkat: sık karışan nokta
DN = [
    dict(kick='Giriş', title='Bilgisayar neden oluşur?', adim=1, img='dh_00.jpg',
         items=['<b>Kasa:</b> asıl bilgisayar.', '<b>Ekran, klavye, fare:</b> kasaya takılır.', 'Dizüstüde hepsi tek parçadır.'],
         ornek='Araba gibi: direksiyon ve pedallar klavye ile fare, gösterge ekran. Arabayı yürüten kaputun altındaki motordur; bilgisayarın motoru da kasanın içindedir.',
         soru='Ekran bozulursa fotoğraflar da gider mi?', cevap='Hayır. Ekran sadece gösterir; fotoğraflar kasanın içinde saklıdır.',
         anlat='Masadaki gerçek bilgisayarı gösterin: “Bu kutu kasa, asıl bilgisayar bu.” Öğrenciler çoğu zaman ekranı bilgisayar sanar.',
         dikkat='“Bilgisayar” denince ekran değil kasa kastedilir.'),
    dict(kick='Kasa', title='Düğmeler ve girişler', adim=2, img='dh_01.jpg',
         items=['<b>⏻ Açma düğmesi:</b> yuvarlak, ışıklı olan.', '<b>USB girişleri:</b> USB bellek buraya.', '<b>Yeşil:</b> kulaklık, <b>pembe:</b> mikrofon.', 'Bazı kasalarda bunlar üstte, bazılarında önde.'],
         ornek='Evin kapısı ve zili gibi. Açma düğmesi de evin anahtarıdır.',
         soru='Bilgisayar dondu, fare de klavye de çalışmıyor. Ne yaparsınız?',
         cevap='Önce 1–2 dakika beklenir. Düzelmezse açma düğmesine 5–10 saniye basılı tutulur; bilgisayar kapanır. Kaydedilmemiş işler gider, bu yüzden son çaredir. Normalde Başlat → Güç → Kapat kullanılır.',
         anlat='Sınıftaki kasalarda açma düğmesinin yerini öğrencilere buldurun; her kasada farklı yerdedir.',
         dikkat='Kısa basmak açar; uzun basılı tutmak zorla kapatır.'),
    dict(kick='Kasa', title='Kasayı açalım', adim=3, img='dh_02.jpg',
         items=['İçeride birkaç parça ve kablolar var.', 'Şimdi bunları <b>birer birer</b> tanıyacağız.', 'Gerçekte açmadan önce: <b>kapat ve fişi çek</b>.'],
         ornek='Buzdolabının arkasını açmadan önce fişini çekeriz. Bilgisayar da öyle.',
         soru='Kasayı açmadan önce ilk ne yapılır?', cevap='Bilgisayar kapatılır, fişi çekilir. Parçalara kenarlarından tutularak dokunulur.',
         anlat='Statik elektrik: halıda yürüyüp kapı koluna dokununca çarpan elektrik, parçaları bozabilir. Önce bir metale dokunulur.',
         dikkat=''),
    dict(kick='Parça 1', title='Anakart: her şeyin takıldığı kart', adim=4, img='dh_03.jpg',
         items=['Kasanın içindeki <b>en büyük kart</b>.', 'Diğer bütün parçalar ona takılır.', 'Parçalar onun üzerinden haberleşir.'],
         ornek='Şehrin <b>yolları</b> gibi: diğer parçalar binalar, anakart aradaki yollar. Yol kapanırsa kimse kimseye ulaşamaz.',
         soru='Anakart bozulursa ne olur?', cevap='Bilgisayar çoğu zaman hiç açılmaz. İçindeki dosyalar genelde kurtarılabilir.',
         anlat='Anakart değişince çoğu zaman işlemci ve RAM de değişmek zorunda kalır; bu yüzden eski bilgisayarda anakart arızası “yeni bilgisayar al” demek olabilir.',
         dikkat=''),
    dict(kick='Parça 2', title='İşlemci: bilgisayarın beyni', adim=5, img='dh_04.jpg',
         items=['Tıkladığınız, yazdığınız her şeyi <b>o hesaplar</b>.', 'Küçük, kare bir parça.', 'Üstünde bir fan durur (resimde kaldırdık).'],
         ornek='Lokantanın <b>aşçısı</b> gibi: siparişleri o hazırlar. Aşçı iyiyse yemek çabuk gelir.',
         soru='Bilgisayar her işte çok yavaşsa sebebi işlemci olabilir mi?',
         cevap='Evet, eski ya da zayıf işlemci yavaşlatır. Ama çoğu zaman sorun disk (eski HDD) ya da az RAM’dir; önce onlara bakılır.',
         anlat='3B’de işlemcinin üstündeki soğutucu kaldırılmış hâlde görünür.',
         dikkat='İşlemci = CPU. Kasanın kendisine “işlemci” denmez.'),
    dict(kick='Parça 2', title='İşlemcinin adı: “i5, 4. nesil” ne demek?', adim=6, img='dh_04.jpg', tablo=True,
         items=[], ornek='Araba gibi: <b>i3, i5, i7</b> donanım paketleri (temel, orta, dolu), <b>nesil</b> model yılı. Yeni model “orta paket”, eski model “dolu paket”ten çoğu zaman iyidir: <b>yeni bir i5, eski bir i7’den hızlı olabilir.</b>',
         soru='“i7, 4. nesil” mi, “i5, 12. nesil” mi daha hızlı?',
         cevap='Büyük ihtimalle i5, 12. nesil. Arada yaklaşık 8 yıl var. Kural: önce nesle, sonra sınıfa bakılır.',
         anlat='Okuma örneği: Intel Core i5-4590 → i5 sınıf, tireden sonraki ilk sayı 4 → 4. nesil (2014 civarı). i5-12400 → tireden sonra 12 → 12. nesil (2022 civarı). Nesil numarası iki basamaklı olabilir (10, 11, 12, 13, 14). AMD’de Ryzen 5 5600 → Ryzen 5 sınıf (≈ i5), ilk rakam 5 → 5000 serisi. Sondaki harfler: U = dizüstü, tasarruflu; H = dizüstü, güçlü; K = masaüstü, en güçlü sürüm. Derste gösterilen 2010’lar bilgisayarı 2014 dönemi, yani tam bir “4. nesil” dönemi bilgisayardır. 2024’ten sonra Intel yeni adlar kullanıyor (Core Ultra 5, 7, 9); mantık aynı: sayı büyüdükçe daha güçlü.',
         dikkat='GHz’e tek başına bakmak yanıltır; farklı nesilleri GHz ile karşılaştırmayın.'),
    dict(kick='Parça 3', title='Fan: işlemciyi serin tutar', adim=7, img='dh_06.jpg',
         items=['İşlemci çalışırken <b>ısınır</b>.', 'Metal parça ısıyı çeker, <b>fan</b> üfleyip uzaklaştırır.', 'Zorlanınca fan hızlanır, ses artar: normal.'],
         ornek='Sıcak çorbayı üfleyerek soğutmak gibi.',
         soru='Dizüstüyü yorganın üstünde kullanırsak ne olur?', cevap='Hava delikleri kapanır, ısınır. Önce yavaşlar, çok ısınırsa kendiliğinden kapanır.',
         anlat='Bilgisayar kendi kendine kapanıyorsa ilk şüphelilerden biri ısınmadır (toz, kapalı hava delikleri).',
         dikkat=''),
    dict(kick='Parça 4', title='RAM: geçici hafıza', adim=8, img='dh_07.jpg',
         items=['O an <b>açık olan</b> işleri tutar.', 'Kaydedilmemiş yazı da buradadır.', 'Kapanınca ya da elektrik gidince <b>silinir</b>.', 'Büyüklüğü <b>GB</b>: 8 GB, 16 GB…'],
         ornek='<b>Çalışma masası:</b> dosyayı dolaptan alıp masada çalışırsınız, akşam masa temizlenir. Ya da telefon numarasını <b>çevirene kadar aklınızda tutmak</b>.',
         soru='Elektrik kesildi, kaydetmediğiniz yazı kayboldu. Neden?', cevap='Yazı RAM’deydi (masada); diske (dolaba) kaydedilmemişti. Elektrik gidince RAM boşaldı. Sık sık Ctrl + S.',
         anlat='Bugün için öneri: internet ve ofis işi 8 GB ile döner, rahat çalışmak için 16 GB. Tarayıcıda çok sekme açmak RAM’i doldurur.',
         dikkat='En sık karışan konu: “RAM’i büyük bilgisayara daha çok fotoğraf sığar” yanlış. Fotoğraf diske sığar.'),
    dict(kick='Parça 5', title='Disk: kalıcı hafıza', adim=9, img='dh_08.jpg',
         items=['Fotoğraf, belge, program <b>burada saklanır</b>.', 'Kapansa da <b>silinmez</b>.', 'Eski tip diskin (HDD) içinde plak gibi dönen bir disk var.', 'Büyüklüğü GB ya da TB (1 TB = 1000 GB).'],
         ornek='Disk bir <b>dolap</b>. Eski diskin içi ise <b>pikap</b> gibi: plak döner, iğne okur.',
         soru='Çalışan kasaya çarparsanız hangi parça zarar görebilir?', cevap='Dönen disk (HDD): okuyan kol plağa çarpıp çizebilir, dosyalar kaybolabilir.',
         anlat='3B’de diskin kapağı soluklaşır, içindeki plakanın döndüğü ve kolun hareket ettiği görünür. 1 TB yaklaşık 250 bin telefon fotoğrafı eder.',
         dikkat=''),
    dict(kick='Parça 6', title='SSD: hızlı disk', adim=10, img='dh_09.jpg',
         items=['O da disk: dosyaları kalıcı saklar.', 'Dönen parçası yok; küçük yongalar var.', 'Eski diskten <b>çok daha hızlı</b>.'],
         ornek='Eski disk: kütüphanede raflar arasında kitap aramak. SSD: kitap <b>elinizin altındaki çekmecede</b>.',
         soru='Eski bilgisayar çok geç açılıyor. Ne en çok işe yarar?', cevap='Eski disk yerine SSD taktırmak.',
         anlat='Öğrencilerin evdeki eski bilgisayarları için en ucuz ve en etkili yükseltme budur; ilanlarda “SSD” yazıp yazmadığına bakmalarını söyleyin.',
         dikkat=''),
    dict(kick='En çok karıştırılan', title='RAM mi, disk mi?', adim=11, img='dh_10.jpg', ramdisk=True,
         items=[], ornek='<b>Kaydet</b> = masadakini dolaba koymak. İlanda “16 GB RAM, 512 GB SSD” = 16 GB masa, 512 GB dolap.',
         soru='“Disk dolu” uyarısı: RAM mi gerekir, disk mi?', cevap='Disk (dolap dolmuş): gereksiz dosyalar silinir ya da büyük disk takılır. RAM, çok program açınca yavaşlama varsa artırılır.',
         anlat='Tahtaya iki sütun çizin: MASA / DOLAP. Öğrencilere “şunu nereye koyarsınız?” diye sorun: açık Word belgesi (masa), tatil fotoğrafları (dolap), çalışan internet tarayıcısı (masa), kurulu program (dolap).',
         dikkat='Telefonlarda da aynı ayrım vardır: “4 GB RAM, 128 GB depolama”.'),
    dict(kick='Parça 7', title='Ekran kartı: görüntüyü çizer', adim=12, img='dh_11.jpg',
         items=['Ekranda gördüğünüz her şeyi <b>çizip ekrana gönderir</b>.', 'Ekran kablosu onun arkasına takılır.', 'Oyun ve video için güçlüsü gerekir.'],
         ornek='Bir <b>ressam</b>: saniyede onlarca resim çizer; resimler değişince hareket görürüz, çizgi film gibi.',
         soru='Işık yanıyor, fan dönüyor ama ekranda görüntü yok. Neye bakarsınız?', cevap='Ekranın fişine ve düğmesine; sonra ekran kablosunun iki ucunun da tam takılı olduğuna.',
         anlat='Çoğu ofis bilgisayarında ayrı ekran kartı yoktur; işlemcinin içindeki küçük grafik birimi bu işi yapar. Ayrı kart varsa ekran kablosu ona takılmalıdır (alttaki girişler).',
         dikkat=''),
    dict(kick='Parça 8', title='Güç kaynağı: elektriği hazırlar', adim=13, img='dh_12.jpg',
         items=['Bilgisayarın <b>fişi buna takılır</b>.', 'Prizdeki güçlü elektriği <b>zayıf elektriğe</b> çevirir.', 'Kablolarla her parçaya dağıtır.'],
         ornek='Telefonun <b>şarj aleti</b> gibi.',
         soru='Elektrik sık kesiliyorsa bilgisayar nasıl korunur?', cevap='Kesintisiz güç kaynağı (UPS): elektrik gidince birkaç dakika çalıştırır; iş kaydedilip kapatılır.',
         anlat='Teknik bilgi (sorulursa): prizdeki 220 voltu 12 ve 5 volta çevirir. Üzerindeki watt değeri verebileceği en fazla güçtür; bilgisayar her an o kadar harcamaz. 3B’deki “Ne kadar elektrik harcıyor?” düğmesi bunu gösterir.',
         dikkat='Güç kaynağının içi asla açılmaz; fiş çekili olsa da içinde elektrik kalabilir.'),
    dict(kick='Bağlantılar', title='Kablolar: elektrik ve bilgi', adim=14, img='dh_13.jpg',
         items=['Diske <b>iki kablo</b> takılır.', '<b>Turuncu:</b> elektrik getirir.', '<b>Mavi:</b> bilgiyi taşır.'],
         ornek='Eve de iki ayrı kablo gelir: biri elektrik, biri internet.',
         soru='Yalnızca elektrik kablosu takılıysa disk görünür mü?', cevap='Görünmez. Disk çalışır ama bilgi kablosu olmadan bilgisayar ona ulaşamaz.',
         anlat='Renkler 3B uygulamanın gösterimidir; gerçek kablolar farklı renkte olabilir.', dikkat=''),
    dict(kick='Parça 9', title='Kasa fanları: içeriyi havalandırır', adim=15, img='dh_14.jpg',
         items=['Öndeki fanlar serin havayı <b>içeri alır</b>.', 'Arkadaki fan sıcak havayı <b>dışarı atar</b>.', 'Toz birikince ses artar.'],
         ornek='Karşılıklı iki pencere açınca olan <b>cereyan</b> gibi.',
         soru='Fan sesi eskisinden çok daha fazla. Ne olabilir?', cevap='Toz birikmiş olabilir; fiş çekiliyken temizletilir. Kasa duvara dayanmaz.',
         anlat='Yılda bir toz temizliği yeterlidir. Elektrik süpürgesi kasanın içine sokulmaz (statik elektrik).', dikkat=''),
    dict(kick='Parça 10', title='CD/DVD sürücüsü', adim=16, img='dh_15.jpg',
         items=['CD ve DVD’leri okur.', 'Yeni bilgisayarların çoğunda <b>yok</b>.', 'Yerini USB bellek ve internet aldı.'],
         ornek='Pikap gibi döner, ama okuyan iğne değil, ince bir ışıktır.',
         soru='DVD yeri olmayan bilgisayarda eski DVD nasıl izlenir?', cevap='USB ile takılan ayrı bir DVD sürücüsü alınır.',
         anlat='Eski düğün, sünnet DVD’lerini bilgisayara ve USB belleğe kopyalamalarını önerin; diskler yıllar içinde bozulabilir.', dikkat=''),
    dict(kick='Bağlantılar', title='Arkadaki girişler', adim=17, img='dh_16.jpg',
         items=['<b>USB:</b> fare, klavye, yazıcı', '<b>HDMI:</b> ekran, televizyon', '<b>İnternet kablosu</b> girişi', '<b>Ses:</b> yeşil hoparlör, pembe mikrofon'],
         ornek='Her kablonun ucu farklı, yanlış yere girmez. Girmiyorsa <b>zorlamayın</b>, çevirin.',
         soru='USB bellek girmiyor. Ne yaparsınız?', cevap='Zorlamadan ters çevirip yeniden denenir.',
         anlat='3B’de herhangi bir girişe tıklanınca adı ve görevi yazar; öğrencilere birkaç tanesini tıklatın.', dikkat=''),
    dict(kick='Hepsi bir arada', title='Parçaları ayıralım', adim=18, img='dh_17.jpg',
         items=['Her parça bir iş yapar.', 'Hiçbiri tek başına bilgisayar değil.', 'Birlikte çalışınca bilgisayar olur.'],
         ornek='Bir lokanta: aşçı (işlemci), tezgâh (RAM), kiler (disk), garson (ekran kartı), elektrik (güç kaynağı).',
         soru='Hangi parça olmadan bilgisayar hiç açılmaz?', cevap='Anakart, işlemci, RAM ve güç kaynağı. Disk olmadan açılır ama Windows gelmez.',
         anlat='Alttaki “Parçaları ayır” kaydırıcısıyla parçaları toplayıp ayırın.', dikkat=''),
    dict(kick='Birlikte çalışma', title='Bir fotoğrafı açınca ne olur?', adim=19, img='dh_18.jpg', akis=True,
         items=[], ornek='Fotoğrafı kırpıp <b>kaydetmeden</b> kapatırsanız kırpılmış hâli kaybolur.',
         soru='Kaydetmeden kapattınız. Diskte hangi hâli kalır?', cevap='Eski hâli. Kırpılmış hâli yalnızca RAM’deydi.',
         anlat='3B’de parçalar sırayla yeşil yanar: disk → RAM → işlemci → ekran kartı. Bir tur izletin, sonra öğrencilere sırayı söyletin.', dikkat=''),
    dict(kick='Bugün', title='Küçücük disk: M.2 SSD', adim=20, img='dh_19.jpg',
         items=['<b>Sakız paketi</b> kadar.', 'Kablosu yok; anakarta takılır.', 'Çok hızlı. Dizüstülerde de bu var.'],
         ornek='Sakız paketi kadar ama içine on binlerce fotoğraf sığar.',
         soru='Dizüstüde bu parçalar nerede?', cevap='Klavyenin altındaki gövdede, küçültülmüş olarak; bir de pil vardır.',
         anlat='Parçalar küçüldü ama görevler aynı: beyin, masa, dolap, ressam, elektrik.', dikkat=''),
    dict(kick='Eskiden', title='Disket', adim=21, img='dh_20.jpg',
         items=['1990’larda dosyalar disketle taşınırdı.', 'Bir diskete bugünkü <b>tek bir telefon fotoğrafı</b> bile sığmaz.'],
         ornek='Disket bir kartpostal, bugünkü disk bir kütüphane.',
         soru='Disketin yerini ne aldı?', cevap='USB bellek ve internet (e-posta, bulut).',
         anlat='Bir disket 1,44 MB; bugünkü 1 TB’lık diske yaklaşık 700 bin disket sığar. 3B’de “Eski ve yeni diskleri karşılaştır” düğmesi gerçek boyutlarıyla yan yana gösterir.', dikkat=''),
]

S = []
S.append(cover('Donanım: bilgisayarın içine yolculuk', 'Bilgisayarın parçaları, ne işe yaradıkları ve günlük hayattan örnekler', ''))
S.append(slide('Bugün', 'Neler öğreneceğiz?', split(ul([
    'Bilgisayarın içinde hangi parçalar var?', 'Her parça ne işe yarar?', '“i5, 4. nesil”, “16 GB RAM” ne demek?', 'RAM ile disk arasındaki fark'], ) +
    note('Her parçayı bir benzetmeyle hatırlayacağız: <b>işlemci aşçı, RAM masa, disk dolap, ekran kartı ressam.</b>'),
    resim('dh_02.jpg'), 1, 1)))
for d in DN:
    if d.get('tablo'):
        left = table([['i3 · i5 · i7 · i9', '<b>Sınıfı.</b> Sayı büyüdükçe daha güçlü.'],
                      ['i5-<b>4</b>590', 'Tireden sonraki ilk sayı = <b>nesil</b>: 4. nesil, 2014 civarı'],
                      ['i5-<b>12</b>400', '12. nesil, 2022 civarı'],
                      ['AMD Ryzen 5', 'Öteki marka, aynı mantık: Ryzen 5 ≈ i5']], 'kv tight')
        body = left + orn(d['ornek']) + dus(d['soru'])
        S.append(slide(d['kick'], d['title'], body))
    elif d.get('ramdisk'):
        S.append(slide(d['kick'], d['title'], split(
            table([['Ne tutar?', 'Şu an açık işler', 'Bütün dosyalar'], ['Kapanınca', '<b>Silinir</b>', '<b>Kalır</b>'], ['Hız', 'Çok hızlı', 'Daha yavaş'],
                   ['Ne kadar?', '8–32 GB', '256 GB – 2 TB']], 'tight', head=['', 'RAM (masa)', 'Disk (dolap)']) + orn(d['ornek']) + dus(d['soru']),
            resim(d['img']), 1.1, .9)))
    elif d.get('akis'):
        S.append(slide(d['kick'], d['title'], '''
<div class="flow">
<div><div class="n">1</div><b>Disk</b> fotoğrafı bulur.<br><span class="mut">Dolaptan çıkarılır</span></div>
<div><div class="n">2</div><b>RAM</b>’e gelir.<br><span class="mut">Masaya konur</span></div>
<div><div class="n">3</div><b>İşlemci</b> açar.<br><span class="mut">Aşçı hazırlar</span></div>
<div><div class="n">4</div><b>Ekran kartı</b> çizer.<br><span class="mut">Ressam gösterir</span></div>
</div>''' + split(orn(d['ornek']) + dus(d['soru']), resim(d['img'], style='max-height:330px'), 1, 1)))
    else:
        S.append(slide(d['kick'], d['title'], split(ul(d['items'], 'small') + orn(d['ornek']) + dus(d['soru']), resim(d['img']), 1, 1)))
S.append(slide('Özet', 'Kasanın içi: tek cümleyle', table([
    ['Anakart', 'Şehrin yolları: her şey ona takılır'], ['İşlemci', 'Beyin, aşçı. i3–i9 sınıfı, nesil = yılı'],
    ['RAM', 'Masa: geçici, kapanınca silinir'], ['Disk (HDD / SSD)', 'Dolap: kalıcı, kapanınca da durur'],
    ['Ekran kartı', 'Ressam: görüntüyü çizer'], ['Güç kaynağı', 'Şarj aleti: elektriği hazırlar'], ['Fan', 'Serinletir']], 'kv tight')))
S.append(slide('Sırada', 'Kendinizi deneyin', split(
    table([['1', '3B bilgisayarda <b>🎓 Donanım dersi</b>: adımları kendiniz gezin.'],
           ['2', '<b>❓ Buldurma oyunu</b>: “RAM nerede?” sorusuna parçaya tıklayın.'],
           ['3', 'Dersler sayfası → 4. hafta → <b>Donanım testi</b> (15 soru).'],
           ['4', 'Evde: kendi bilgisayarınızın RAM’ine ve işlemcisine bakın. <span class="mut">Ayarlar → Sistem → Hakkında</span>']], 'kv'),
    resim('dh_21.jpg'), 1.1, .9)))
write('donanim', 'Donanım: bilgisayarın içi', 'Bilgisayar İşletmenliği – Donanım: Bilgisayarın İçine Yolculuk', S)

# ---------------------------------------------------------------- öğretmen notları (A4, yazdırmak için)
NOT_CSS = '''@page { size: A4; margin: 14mm 14mm 16mm; }
body { font-family: 'Fira Sans', sans-serif; color: #1d1d1b; font-size: 11pt; line-height: 1.4; margin: 0; }
h1 { font-size: 20pt; margin: 0 0 2mm; } .sub { color: #6b6a64; margin: 0 0 6mm; }
.plan { border-collapse: collapse; width: 100%; margin-bottom: 6mm; } .plan td, .plan th { border-bottom: 1px solid #d9d5ca; padding: 1.5mm 2mm; text-align: left; vertical-align: top; }
.n { break-inside: avoid; border-top: 2px solid #b5441c; padding: 3mm 0 4mm; display: flex; gap: 5mm; }
.n img { width: 52mm; height: auto; border-radius: 2px; flex: none; }
.n h2 { font-size: 13pt; margin: 0 0 1mm; } .n .meta { font-size: 9pt; color: #b5441c; letter-spacing: .06em; text-transform: uppercase; margin-bottom: 1.5mm; }
.n p { margin: 1mm 0; } .q { background: #eef4f7; padding: 1.5mm 3mm; border-left: 3px solid #2e5f7a; } .a { color: #2e6b3a; }
.d { color: #b5441c; } b { font-weight: 600; }'''
cards = []
slide_no = 3
for d in DN:
    cards.append(f'''<div class="n"><img src="{IMG}{d['img']}"><div>
<div class="meta">Slayt {slide_no} · 3B dersinde {d['adim']}. adım</div><h2>{d['title']}</h2>
<p>{d['anlat']}</p>
<p class="q"><b>Düşünelim:</b> {d['soru']}<br><span class="a"><b>Cevap:</b> {d['cevap']}</span></p>
{f'<p class="d"><b>Dikkat:</b> {d["dikkat"]}</p>' if d['dikkat'] else ''}</div></div>''')
    slide_no += 1
notlar = f'''<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>Donanım dersi – öğretmen notları</title><style>{NOT_CSS}</style></head><body>
<h1>Donanım dersi: öğretmen notları</h1>
<p class="sub">Slaytlar (Bilgisayar-Isletmenligi-donanim.pdf) öğrencilere gösterilir; cevaplar ve ek anlatım yalnızca bu dosyadadır.</p>
<table class="plan">
<tr><th>Hazırlık</th><td>Sınıf bilgisayarlarında <b>bilgisayar.html</b> açılır, üstteki <b>🎓 Donanım dersi</b> düğmesine basılır. Öğrenciler kendi ekranlarında aynı adımları izler; ← → tuşlarıyla ilerlenir. Panelde “Düşünelim” sorusu ve “Cevabı göster” düğmesi vardır: önce öğrencilere düşündürün, sonra açtırın.</td></tr>
<tr><th>Akış (≈ 55 dk)</th><td>1) Anlatım: slayt + 3B adımları birlikte (30 dk) · 2) <b>❓ Buldurma oyunu</b> 3B’de (10 dk) · 3) Dersler sayfası → 4. hafta → <b>Donanım testi: kasanın içi</b>, 15 soru (15 dk)</td></tr>
<tr><th>Ana fikir</th><td>İşlemci = aşçı (beyin) · RAM = masa (geçici) · Disk = dolap (kalıcı) · Ekran kartı = ressam · Güç kaynağı = şarj aleti · Anakart = şehrin yolları</td></tr>
</table>
{''.join(cards)}
</body></html>'''
with open(os.path.join(D, 'donanim-notlar.html'), 'w', encoding='utf-8') as f:
    f.write(notlar)
print('donanim-notlar', len(DN), 'not')
