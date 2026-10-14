#!/usr/bin/env python3
"""2.–8. hafta ve ek ders slaytlarını üretir: sunum/hafta2.html ... sunum/ek-guvenlik.html
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
    return f'<figure class="fig" style="{style}"><img src="{IMG}{img}">{c}</figure>'


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


def page(foot, title, slides):
    return (f'<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>{title}</title>'
            f'<link rel="stylesheet" href="stil.css"><style>body{{--foot:"Bilgisayar İşletmenliği  ·  {foot}";}}</style></head>'
            f'<body>{"".join(slides)}</body></html>')


def write(name, foot, title, slides):
    with open(os.path.join(D, name + '.html'), 'w', encoding='utf-8') as f:
        f.write(page(foot, title, slides))
    print(name, len(slides), 'slayt')


K = lambda *k: ' + '.join(f'<kbd>{x}</kbd>' for x in k)

# ================================================================ HAFTA 2
S = []
S.append(cover('2. Hafta: Klavye', 'Alıştırmalar ve oyunlar', 'Alıştırma bilgisayarında uygulamalı ders'))
S.append(slide('Bu hafta', 'Klavyeyi tanıyalım (25 dk)', split(
    ul(['Gerçek klavyenizde <b>hangi tuşa basarsanız</b> ekrandaki klavyede o tuş <b>mavi</b> yanar.',
        'Sarı yanan tuşlar, o adımda kullanacağınız tuşlardır.',
        'Yazılar <b>Not Defteri</b> penceresine yazılır; doğru yazınca ders sonraki adıma geçer.']),
    fig('k_giris.jpg', 'Not Defteri, Pano ve ekran klavyesi. Yazıyı kaydetmek gerekmez.'))))
S.append(slide('Alıştırma 1', 'Harf, boşluk, Enter', split(
    table([['elma', 'Not Defteri’ne tıklayıp harfleri yazın'],
           ['elma armut', f'En alttaki uzun {K("Boşluk")} tuşuyla araya boşluk'],
           ['kiraz', f'{K("Enter ↵")} ile alt satıra geçip yazın']], 'kv'),
    note('İmleç, yanıp sönen ince çizgidir. Yazdığınız harfler imlecin olduğu yere gelir.'), 1.3, .7)))
S.append(slide('Alıştırma 2', 'Silmek: Backspace ve Delete', f'''
<div class="steps4" style="margin-top:6px">
<div><div class="n">1</div><span><b>kiraz</b> kelimesinin sonunda {K('⌫ Backspace')} tuşuna bir kez basın: <b>kira</b> kalır.</span></div>
<div><div class="n">2</div><span>İmleci <b>kira</b>’nın başına getirin, {K('Delete')} tuşuna bir kez basın: <b>ira</b> kalır.</span></div></div>
{note('Backspace <b>geriye</b>, Delete <b>ileriye</b> siler. Backspace imlecin solundaki, Delete sağındaki harfi siler.')}'''))
S.append(slide('Alıştırma 3', 'Büyük harf: Shift ve Caps Lock', table([
    [K('⇧ Shift') + ' + harf', '<b>Ali</b> yazın: yalnızca A büyük. Shift’i basılı tutup A’ya basın, sonra bırakın.'],
    [K('Caps Lock'), '<b>ANKARA</b> yazın, Caps Lock’a bir kez daha basıp kapatın, yanına <b>ankara</b> yazın.']], 'kv') +
    note('Caps Lock açık kalırsa her şey büyük harf yazılır. <b>Şifre yazarken buna dikkat edin.</b>')))
S.append(slide('Alıştırma 4', 'Türkçe harfler ve İ / I farkı', split(
    ul(['<b>çiçek ağaç ışık göz şeker üzüm</b> kelimelerini yazın.',
        'Büyük harfle <b>İZMİR IĞDIR</b> yazın.',
        '<b>I</b> tuşu noktasız ı, noktalı <b>i</b> ise Ş’nin yanındaki <b>İ</b> tuşudur.'], 'small') +
    note('Türkçede İ ve I ayrı harflerdir; klavyede de ayrı tuşlardır.'),
    fig('k_turkce.jpg', 'Kelimeler yazıldı; ekran klavyesi basılan tuşları gösterir.'))))
S.append(slide('Alıştırma 5', 'İşaretler: ! ? @', split(
    table([[K('Shift', '1'), '! (ünlem)'], [K('Shift', '*'), '? (soru işareti), sağ üstte 0’ın yanında'],
           [K('AltGr', 'Q'), '@ (et işareti): e-posta adresleri için']], 'kv') +
    f'<p style="margin-top:18px">Yazın: <b>Nasılsın? Harika!</b> ve <b>ali@ornek.com</b></p>' +
    note('AltGr yoksa Ctrl ve Alt’ı birlikte basılı tutup Q’ya basmak da @ yazar.'),
    fig('k_eposta.jpg', 'E-posta adresi yazıldı.'), 1.1, .9)))
S.append(slide('Alıştırma 6', 'Ok tuşları, Home ve End', table([
    [K('↑') + ' ' + K('↓') + ' ' + K('←') + ' ' + K('→'), 'İmleci harf harf, satır satır hareket ettirir. Dördüne de basın.'],
    [K('Home'), 'İmleci satırın <b>başına</b> götürür.'],
    [K('End'), 'İmleci satırın <b>sonuna</b> götürür.']], 'kv') +
    note('Fareye gerek kalmadan imleci istediğiniz yere götürebilirsiniz. Uzun satırlarda Home ve End çok zaman kazandırır.')))
S.append(slide('Özet', 'Bu hafta öğrendiklerimiz', table([
    ['Boşluk', 'Kelimeler arasına boşluk'], ['Enter', 'Alt satıra geç'],
    ['⌫ Backspace / Delete', 'İmlecin solundaki / sağındaki harfi siler'],
    ['Shift + harf', 'Tek bir büyük harf'], ['Caps Lock', 'Hepsi büyük harf (aç/kapat)'],
    ['Shift+1 · Shift+* · AltGr+Q', '! · ? · @'], ['↑ ↓ ← →  ·  Home / End', 'İmleci hareket ettirir · satır başı / sonu']], 'kv')))
write('hafta2', '2. Hafta', 'Bilgisayar İşletmenliği – 2. Hafta Alıştırmaları', S)

# ================================================================ HAFTA 3
S = []
S.append(cover('3. Hafta: Not Defteri ve kısayollar', 'Alıştırmalar ve oyunlar', 'Alıştırma bilgisayarında uygulamalı ders'))
S.append(slide('Bu hafta', 'Not Defteri nedir? (25 dk)', split(
    ul(['Bilgisayardaki <b>en basit yazı programı</b>: alışveriş listesi, telefon numarası, kısa notlar.',
        'Alıştırma penceresi gerçeğinin benzeridir; <b>hiçbir şey bozulmaz</b>.',
        'Önce adınızı ve soyadınızı, sonra bir cümle yazarız.']),
    f'<h2>Gerçek bilgisayarda nasıl açılır?</h2>' + table([['1', f'{K("⊞ Windows")} tuşuna basın'], ['2', '<b>not defteri</b> yazın'],
                                                        ['3', f'{K("Enter")} tuşuna basın']], 'kv'), 1, 1)))
S.append(slide('Alıştırma 1', 'Seçmek: çift tık ve Ctrl + A', split(
    ul(['Bir yazıyla işlem yapmadan önce onu <b>seçmek</b> gerekir. Seçili yazı maviye boyanır.',
        'Bir kelimeyi seçmek için üzerine <b>çift tıklayın</b>.',
        f'Hepsini seçmek için {K("Ctrl", "A")}. A, İngilizce “All” (hepsi) kelimesinden gelir.'], 'small') +
    note('Seçiliyken bir harfe basarsanız yazının yerine o harf yazılır. Olursa Ctrl+Z ile geri alın.'),
    fig('nd_sec.jpg', 'Bütün yazı seçili (mavi).'))))
S.append(slide('Alıştırma 2', 'Kopyalamak ve yapıştırmak', split(
    ul([f'Yazı seçiliyken {K("Ctrl", "C")} (Copy): ekranda bir şey değişmez, yazı <b>Pano</b>’ya alınır.',
        'İmleci yazının sonuna götürüp <b>Enter</b> ile yeni satır açın.',
        f'{K("Ctrl", "V")} ile yapıştırın: yazı ikinci kez gelir.'], 'small') +
    note('Pano’daki yazı, siz yeni bir şey kopyalayana kadar orada kalır.'),
    fig('nd_kopya.jpg', 'Altta Pano kutusu: “Kopyalandı”.'))))
S.append(slide('Alıştırma 3', 'Geri almak, geri getirmek, taşımak', table([
    [K('Ctrl', 'Z'), '<b>Geri al.</b> Son yaptığınız iş silinir. Bilgisayardaki “can simidi”.'],
    [K('Ctrl', 'Y'), '<b>Yinele.</b> Geri aldığınızı geri getirir.'],
    [K('Ctrl', 'X'), '<b>Kes.</b> Yazı yerinden alınır, Pano’ya gider. Sonra Ctrl+V ile başka yere yapıştırılır.']], 'kv') +
    note('<b>Kopyala:</b> yazı yerinde kalır, bir kopyası gider. <b>Kes:</b> yazı yerinden alınıp götürülür.')))
S.append(slide('Alıştırma 4', 'Kısayolu unutursanız: sağ tık', ul([
    'Bir kelimeyi çift tıklayarak seçin.',
    'Seçili yazının üzerine farenin <b>sağ tuşuyla</b> bir kez tıklayın.',
    'Açılan menüden <b>Kopyala</b>’yı seçin.',
    'Menüde <b>Kes</b>, <b>Kopyala</b>, <b>Yapıştır</b> hep vardır; klavye kısayolları ise daha hızlıdır.'])))
S.append(slide('Alıştırma 5', 'Kaydetmek ve yeniden açmak', split(
    ul([f'Pencere başlığındaki <b>*Adsız</b>: baştaki yıldız “kaydedilmemiş değişiklik var” demektir.',
        f'{K("Ctrl", "S")}: <b>Dosya adı</b> kutusuna bir ad yazın, <b>Kaydet</b>’e tıklayın.',
        f'Dosya → <b>Yeni</b>: boş sayfa. Kaydettiğiniz yazı kaybolmaz.',
        f'{K("Ctrl", "O")}: kaydettiğiniz dosyayı yeniden açın.'], 'small') +
    note('Kaydedilen dosyalar, bilgisayarı kapatsanız da kaybolmaz.'),
    fig('nd_kaydet.jpg', 'Kaydet penceresi: Belgeler klasörü.'), .95, 1.05)))
S.append(slide('Özet', 'Kısayollar', table([
    ['Çift tıklama', 'Bir kelimeyi seç'], ['Ctrl + A', 'Hepsini seç'], ['Ctrl + C', 'Kopyala (yazı yerinde kalır)'],
    ['Ctrl + X', 'Kes (yazı yerinden alınır)'], ['Ctrl + V', 'Yapıştır'], ['Ctrl + Z', 'Geri al'],
    ['Ctrl + Y', 'Yinele'], ['Ctrl + S', 'Kaydet'], ['Ctrl + O', 'Aç'], ['Sağ tık', 'Kes, Kopyala, Yapıştır menüsü']], 'kv tight')))
write('hafta3', '3. Hafta', 'Bilgisayar İşletmenliği – 3. Hafta Alıştırmaları', S)

# ================================================================ HAFTA 4
S = []
S.append(cover('4. Hafta: Donanım ve yazılım', 'Alıştırmalar ve oyunlar', 'Ayırma oyunları ve 3B uygulama'))
S.append(slide('Bu hafta', 'Donanım mı, yazılım mı? (15 dk)', split(
    ul(['<b>Donanım:</b> elle tutabildiğimiz parçalar. Klavye, fare, ekran, kasa…',
        '<b>Yazılım:</b> bilgisayarın içindeki programlar. Elle tutulmaz. Windows, Not Defteri, Paint…',
        'Benzetme: donanım <b>bir radyo</b>, yazılım radyodan çıkan <b>şarkı</b> gibidir.']),
    fig('dn_giris.jpg', 'Donanım + yazılım = çalışan bilgisayar'))))
S.append(slide('Oyun 1', 'Ayırma oyunu: donanım mı, yazılım mı?', split(
    ul(['Kartları tutup <b>doğru kutuya</b> sürükleyin. 9 kart var.',
        'Doğru bırakırsanız kart kutuya yerleşir ve neden doğru olduğu yazar.',
        'Yanlış bırakırsanız kutu kızarır ve ipucu çıkar.'], 'small') +
    note('Dikkat: USB bellek donanımdır; içindeki dosyalar ise yazılım/veridir.'),
    fig('dn_ayir.jpg', 'Beş karttan ikisi kutulara yerleşti.'))))
S.append(slide('Oyun 2', 'Ayırma oyunu: giriş mi, çıkış mı?', split(
    table([['Giriş', 'Bilgisayara bilgi <b>verir</b>: klavye, fare, mikrofon, kamera, tarayıcı (scanner)'],
           ['Çıkış', 'Bilgisayardan bilgi <b>alır</b>: ekran, hoparlör, yazıcı, kulaklık']], 'kv') +
    note('Dokunmatik ekran hem giriştir hem çıkış!'),
    fig('dn_gc.jpg', 'Dokuz kart, iki kutu.'), 1.1, .9)))
S.append(slide('Konu', 'Depolama: dosyalar nerede durur?', table([
    ['Disk (HDD / SSD)', 'Kasanın içinde. Fotoğraf, belge, program kalıcı durur. <b>Dolap</b> gibi.'],
    ['RAM (bellek)', 'O an açık işler için. <b>Çalışma masası</b> gibi; bilgisayar kapanınca boşalır. Kaydetmediğiniz yazı bu yüzden kaybolur.'],
    ['USB bellek', 'Cebe sığan, takılıp çıkarılan küçük disk. <b>Cep</b> gibi; dosyaları başka bilgisayara götürür.']], 'kv')))
S.append(slide('Bilgisayarın İçine Yolculuk', '1990’lardan bugüne üç boyutlu', f'''
<div class="twoimg" style="gap:20px">{fig('3b_1990_front.jpg', "1990'lar: bej yatay kasa")}{fig('3b_2000_inside.jpg', "2000'ler: ATX kule, içi açık")}{fig('3b_2025_explode.jpg', '2025: parçalar ayrılmış')}</div>
<p style="margin-top:18px;font-size:21px">Kasayı açın, parçaları ayırın, bir parçaya tıklayıp “Ne işe yarar? Nereye takılır?” sekmelerini okuyun. Üstten <b>Çocuklar / Gençler (teknik)</b> düzeyi seçilir.</p>'''))
S.append(slide('Bilgisayarın İçine Yolculuk', 'Dört dönem, dört bilgisayar', table([
    ['İşlemci', 'Pentium sınıfı, Socket 7', 'Pentium 4 sınıfı, Socket 478', '4 çekirdek, LGA 1150', '8 çekirdek, AM5'],
    ['RAM', '72-pin EDO SIMM', 'DDR-400', 'DDR3-1600', 'DDR5-6000'],
    ['Depolama', 'IDE HDD, disket, CD-ROM', 'SATA HDD, disket, DVD', 'SATA SSD, HDD, DVD', 'M.2 NVMe'],
    ['Güç kaynağı', '200 W', '350 W', '500 W', '850 W']], 'kv', head=['', "1990'lar", "2000'ler", "2010'lar", '2025']) +
    '<p class="mut" style="margin-top:14px;font-size:17px">Temsilî sistemlerdir; kesin geçiş tarihlerini göstermez. Marka ve model adları uydurmadır.</p>'))
S.append(slide('Bilgisayarın İçine Yolculuk', '3B uygulamayla neler yapılır?', table([
    ['Kasayı aç · Parçaları ayır', 'Kasanın içini ve parçaların katmanlarını gösterir'],
    ['Parçaya tıkla', 'Ne işe yarar · Nereye takılır · Bu dönemde nasıldı'],
    ['İçini göster', 'HDD’de plakalar döner, CD/DVD’de lazer kızağı hareket eder'],
    ['Karşılaştır', 'Eski ve yeni parça cetvel üzerinde gerçek ölçekte yan yana'],
    ['Güç tüketimi', 'PSU kapasitesi ile anlık tüketim: boşta, ofis, oyun'],
    ['Buldurma oyunu', 'Etiketler gizlenir, soru sorulur, puan tutulur']], 'kv')))
S.append(slide('Özet', 'Bu hafta öğrendiklerimiz', table([
    ['Donanım', 'Elle tutulan parçalar: klavye, fare, ekran, kasa, yazıcı'],
    ['Yazılım', 'Programlar: Windows, Not Defteri, Paint, tarayıcı'],
    ['Giriş / Çıkış', 'Bilgisayara bilgi verir / bilgisayardan bilgi alır'],
    ['Depolama', 'Dosyaların kalıcı durduğu yer: disk, USB bellek'],
    ['RAM', 'Çalışma masası: bilgisayar kapanınca boşalır']], 'kv')))
write('hafta4', '4. Hafta', 'Bilgisayar İşletmenliği – 4. Hafta Alıştırmaları', S)

# ================================================================ HAFTA 5
S = []
S.append(cover('5. Hafta: Masaüstü, Başlat menüsü ve görev çubuğu', 'Alıştırmalar', 'Alıştırma bilgisayarında uygulamalı ders'))
S.append(slide('Bu hafta', 'Masaüstünün parçaları (20 dk)', split(
    ul(['<b>Simgeler:</b> sol taraftaki küçük resimler.',
        '<b>Görev çubuğu:</b> en alttaki şerit.',
        '<b>Başlat:</b> görev çubuğunun ortasında; bütün programlar burada.',
        '<b>Ara:</b> program ya da dosya aramak için.',
        'Sağ altta <b>saat</b>, <b>ses</b> ve <b>internet</b> simgeleri.'], 'small'),
    fig('ms_parca.jpg', 'Alıştırma masaüstü.'))))
S.append(slide('Alıştırma 1', 'Program açmanın iki yolu', split(
    table([['1', 'Başlat’a tıklayın, açılan menüden <b>Paint</b>’e tıklayın.'],
           ['2', f'Başlat’ı açıp hemen <b>hesap</b> yazın, {K("Enter")}’a basın.']], 'kv') +
    note('Gerçek bilgisayarda da ⊞ tuşuna basıp yazmaya başlamak en hızlı yoldur.'),
    fig('ms_ara.jpg', 'Yazdıkça sonuçlar değişir; en üstte “En iyi eşleşme”.'))))
S.append(slide('Alıştırma 2', 'Görev çubuğu ve masaüstünü göstermek', split(
    ul(['İki program açıkken görev çubuğunda simgelerinin altında küçük bir çizgi görünür.',
        'Bir simgeye tıklayın: o program <b>öne gelir</b>. Öndekine bir daha tıklarsanız <b>küçülür</b>.',
        'Çubuğun <b>en sağ köşesindeki ince çizgiye</b> tıklayın: bütün pencereler küçülür. Bir daha tıklayınca geri gelir.'], 'small'),
    fig('ms_gorev.jpg', 'Paint ve Hesap Makinesi açık.'))))
S.append(slide('Alıştırma 3', 'Alt + Tab ve ses düzeyi', split(
    table([[K('Alt', 'Tab'), 'Alt’ı basılı tutup Tab’a basın: açık programlar arasında geçersiniz.'],
           ['Ses simgesi', 'Sağ alttaki simgeye tıklayın, ses çubuğunu sürükleyin.']], 'kv') +
    note('Hoparlörden ses gelmiyorsa ilk bakılacak yer ses düzeyidir.'),
    fig('ms_ses.jpg', 'Hızlı ayarlar: Wi-Fi, Bluetooth, parlaklık, ses.'))))
S.append(slide('Özet', 'Bu hafta öğrendiklerimiz', table([
    ['Başlat', 'Bütün programlar; açınca hemen yazarak arayabilirsiniz'],
    ['Görev çubuğu', 'Açık programlar: tıklayınca öne gelir ya da küçülür'],
    ['Sağ alt köşe', 'Masaüstünü göster'], ['Alt + Tab', 'Açık pencereler arasında geç'],
    ['Ses ve Wi-Fi simgeleri', 'Ses düzeyi ve internet bağlantısı']], 'kv')))
write('hafta5', '5. Hafta', 'Bilgisayar İşletmenliği – 5. Hafta Alıştırmaları', S)

# ================================================================ HAFTA 6
S = []
S.append(cover('6. Hafta: Dosyalar ve klasörler', 'Alıştırmalar', 'Dosya Gezgini ve USB bellek'))
S.append(slide('Bu hafta', 'Dosya, klasör, Dosya Gezgini (30 dk)', split(
    ul(['<b>Dosya:</b> bir yazı, bir fotoğraf, bir şarkı. Bir <b>kâğıt</b> gibi.',
        '<b>Klasör:</b> dosyaları bir arada tutar. İçine başka klasör de konabilir.',
        '<b>Dosya Gezgini:</b> bu klasörlerin hepsini gösteren program.',
        'Yazılarınız genellikle <b>Belgeler</b> klasöründe durur.'], 'small'),
    fig('dg_belgeler.jpg', 'Belgeler klasörü: bir klasör, üç dosya.'))))
S.append(slide('Alıştırma 1', 'Yeni klasör ve ad değiştirme', split(
    table([['Yeni klasör', 'Üstteki <b>＋ Yeni klasör</b>’e tıklayın, adı seçili gelir: <b>Torunlarım</b> yazıp Enter.'],
           ['Ad değiştir', f'<b>alışveriş listesi</b>’ne bir kez tıklayın, {K("F2")} tuşuna basın, <b>market listesi</b> yazıp Enter.']], 'kv') +
    note('Dosyanın adı değişir; içindeki yazı aynı kalır.'),
    fig('dg_klasor.jpg', 'Torunlarım klasörü oluştu.'), 1.05, .95)))
S.append(slide('Alıştırma 2', 'Taşımak, kopyalamak, geri dönmek', table([
    ['Taşı', '<b>torun fotoğrafı</b>’nı tutup Torunlarım klasörünün üzerine sürükleyin. Klasör <b>maviye boyanınca</b> bırakın.'],
    ['Geri', 'Sol üstteki <b>←</b> okuna tıklayın: bir önceki klasöre dönersiniz.'],
    ['Kopyala', f'<b>telefon numaraları</b>’nı seçin → <b>Kopyala</b> ({K("Ctrl", "C")}) → Masaüstü’ne gidin → <b>Yapıştır</b> ({K("Ctrl", "V")}).']], 'kv') +
    note('Taşımada dosya yer değiştirir. Kopyalamada asıl dosya yerinde kalır, bir kopyası oluşur.')))
S.append(slide('Alıştırma 3', 'Silmek ve Geri Dönüşüm Kutusu', f'''
<div class="steps4" style="margin-top:6px">
<div><div class="n">1</div><span>Kopyayı seçin, {K('Delete')} tuşuna basın.</span></div>
<div><div class="n">2</div><span>Dosya silinir… ama <b>tamamen değil</b>: Geri Dönüşüm Kutusu’na gider.</span></div>
<div><div class="n">3</div><span>Kutuyu açın, dosyayı seçin, <b>♻ Geri yükle</b>’ye tıklayın.</span></div></div>
{note('Yanlışlıkla silmelerde bu kutu bir can simididir. Kutuyu <b>boşaltırsanız</b> içindekiler tamamen silinir.')}'''))
S.append(slide('Alıştırma 4', 'Arama', split(
    ul(['<b>Belgeler</b>’e gidin, sağ üstteki <b>Ara</b> kutusuna <b>fatura</b> yazın.',
        'Faturalar klasörünün içindeki dosyalar da bulunur.',
        'Bir dosyanın nerede olduğunu unuttuğunuzda arama kurtarır.'], 'small'),
    fig('dg_ara.jpg', '“fatura” araması: üç sonuç.'))))
S.append(slide('Alıştırma 5', 'USB bellek', split(
    table([['Tak', 'USB belleği bilgisayara takın: soldaki listeye <b>USB Bellek (E:)</b> eklenir.'],
           ['Kopyala', '<b>Resimler</b>’deki tatil fotoğrafını USB’nin üzerine sürükleyin. Farklı sürücüye sürüklenen dosya <b>kopyalanır</b>.'],
           ['Çıkar', 'Çekmeden önce <b>⏏ Çıkar</b>. “Artık çıkarılabilir” yazısını görünce çekin.']], 'kv'),
    fig('dg_usb.jpg', 'USB takılınca bildirim çıkar.'), 1.1, .9)))
S.append(slide('Özet', 'Bu hafta öğrendiklerimiz', table([
    ['＋ Yeni klasör', 'Boş klasör; adını hemen yazın'], ['F2', 'Seçili dosyanın adını değiştir'],
    ['Sürükle-bırak', 'Dosyayı klasöre taşı (USB’ye sürüklemek kopyalar)'],
    ['Ctrl + C → Ctrl + V', 'Dosyayı kopyala-yapıştır'], ['Delete', 'Sil (Geri Dönüşüm Kutusu’na gider)'],
    ['♻ Geri yükle', 'Silineni eski yerine koyar'], ['⏏ Çıkar', 'USB belleği çekmeden önce']], 'kv')))
write('hafta6', '6. Hafta', 'Bilgisayar İşletmenliği – 6. Hafta Alıştırmaları', S)

# ================================================================ HAFTA 7
S = []
S.append(cover('7. Hafta: Paint, Ekran Alıntısı ve Ayarlar', 'Alıştırmalar', 'Alıştırma bilgisayarında uygulamalı ders'))
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
S.append(slide('Ders 2 · Ekran Alıntısı (15 dk)', 'Ekranın fotoğrafını çekmek', two(
    'al_once.jpg', '1. Ekran Alıntısı’nı açıp <b>＋ Yeni</b>’ye tıklayın.', 'al_sonra.jpg', '2. İstediğiniz yeri çerçeveleyin: resim panoya kopyalanır.')))
S.append(slide('Ders 2 · Ekran Alıntısı', 'Alıntıyı kullanmak', table([
    ['Paint’e yapıştır', f'Paint’i açıp {K("Ctrl", "V")}. Üzerine çizebilir, yazı ekleyebilirsiniz.'],
    ['Kaydet', f'{K("Ctrl", "S")} ile Resimler klasörüne <b>hava durumu</b> adıyla.'],
    ['Gerçek bilgisayarda', f'{K("⊞", "Shift", "S")}, ekran kararınca yeri çerçeveleyin. Sonra WhatsApp’ta, e-postada ya da Paint’te {K("Ctrl", "V")}.'],
    ['Print Screen (PrtSc)', 'Bütün ekranı panoya alır.']], 'kv') +
    note('Bir hata mesajını, tarifi ya da adresi resim olarak saklayıp birine gönderebilirsiniz.')))
S.append(slide('Ders 3 · Ayarlar (25 dk)', 'Arka plan, ses, yazı boyutu', split(
    table([['Kişiselleştirme', 'Arka plan: Orman’ı seçin; kendi fotoğrafınızı da seçebilirsiniz'],
           ['Sistem', 'Ses düzeyini 30’a çekin; “Sesi kapat (sessiz)”i açıp kapatın'],
           ['Gerçekte', f'Ayarlar’ı {K("⊞", "I")} ile açın']], 'kv'),
    fig('ay_kisisel.jpg', 'Kişiselleştirme sayfası.'), 1.05, .95)))
S.append(slide('Ders 3 · Ayarlar', 'Wi-Fi: internete bağlanmak', split(
    ul(['<b>Ağ ve İnternet</b> → Wi-Fi anahtarını açın.',
        '<b>EvAğı</b> → Bağlan → şifre <b>evagi2024</b>.',
        'Gerçekte Wi-Fi şifresi çoğunlukla <b>modemin altındaki etikette</b> yazar.'], 'small') +
    note('<b>Kafe_Ücretsiz</b> gibi şifresiz ağlarda bankacılık işlemi yapmayın, şifre girmeyin: aynı ağdaki başkaları görebilir.'),
    fig('ay_ag.jpg', 'Üç ağ: ikisi güvenli, biri açık (güvensiz).'))))
S.append(slide('Ders 3 · Ayarlar', 'Saat ve yazı boyutu', two(
    'ay_saat.jpg', '<b>Saat ve dil:</b> “Saati otomatik olarak ayarla”yı açın. Saat yanlışsa bazı siteler açılmaz.',
    'ay_yazi.jpg', '<b>Erişilebilirlik:</b> metin boyutunu %130’a getirip Uygula’ya tıklayın.')))
S.append(slide('Özet', 'Bu hafta öğrendiklerimiz', table([
    ['Paint', 'Kalem, renk, şekil, doldur, yazı, silgi, Ctrl+Z, Ctrl+S'],
    ['Ekran Alıntısı', '⊞ + Shift + S; Ctrl + V ile yapıştır'],
    ['Ayarlar → Kişiselleştirme', 'Arka plan'], ['Ayarlar → Sistem', 'Ses düzeyi'],
    ['Ayarlar → Ağ ve İnternet', 'Wi-Fi açma, ağa bağlanma'], ['Ayarlar → Saat ve dil', 'Saati otomatik ayarla'],
    ['Ayarlar → Erişilebilirlik', 'Metin boyutu']], 'kv')))
write('hafta7', '7. Hafta', 'Bilgisayar İşletmenliği – 7. Hafta Alıştırmaları', S)

# ================================================================ HAFTA 8
S = []
S.append(cover('8. Hafta: İnternet, program kurma, yazıcı, işletim sistemi', 'Alıştırmalar', 'Alıştırma bilgisayarında uygulamalı ders'))
S.append(slide('Bu hafta', 'Dört ders, seksen beş dakika', table([
    ['İnternette gezinme ve indirme', '25 dk', 'Arama, sekmeler, reklam tuzakları, dosya indirme'],
    ['Program kurma ve kaldırma', '20 dk', 'İzin penceresi, lisans, ek yazılım tuzağı'],
    ['Yazıcı ve sürücüler', '20 dk', 'Yazıcı ekleme, test sayfası, Aygıt Yöneticisi'],
    ['İşletim sistemi kurulumu', '20 dk', 'Gösterim: Windows’un sıfırdan kurulumu']], 'kv')))
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
S.append(slide('Ders 2 · Program kurma', 'Kurulum adım adım', two(
    'kr_uac.jpg', '<b>İzin penceresi:</b> programı siz indirdiyseniz Evet; tanımıyorsanız Hayır.',
    'kr_ek.jpg', '<b>Ek bileşenler tuzağı:</b> iki kutucuğun da işaretini kaldırın.')))
S.append(slide('Ders 2 · Program kurma', 'Kurulum sırası ve kaldırma', table([
    ['1', '<b>…Kurulum.exe</b> dosyasına çift tıklayın, izin sorusuna <b>Evet</b> deyin.'],
    ['2', 'Hoş geldiniz → <b>İleri</b>. Lisansı <b>kabul ediyorum</b> seçmeden İleri çalışmaz.'],
    ['3', 'Kurulum yeri → İleri. “Önerilen” ek yazılımların <b>işaretini kaldırın</b>. Sonra <b>Kur</b>, <b>Son</b>.'],
    ['4', 'Kaldırmak için: Başlat → Ayarlar → <b>Uygulamalar</b> → programın yanındaki <b>Kaldır</b>.']], 'kv') +
    note('Yalnızca güvendiğiniz yerden indirdiğiniz programları kurun.')))
S.append(slide('Ders 3 · Yazıcı ve sürücüler', 'Yazıcı eklemek', split(
    ul(['<b>Sürücü</b> (driver): parçanın bilgisayarla “konuşmasını” sağlayan küçük program. Bir <b>tercüman</b> gibi.',
        'Ayarlar → <b>Bluetooth ve cihazlar</b> → <b>Cihaz ekle</b>: yazıcı bulunur, sürücüsü kendiliğinden yüklenir.',
        'Test sayfası yazdırın. Not Defteri’nden yazdırmak için ' + K('Ctrl', 'P') + '.'], 'small'),
    fig('yz_ekle.jpg', 'Renkli Yazıcı R-200 bulundu.'))))
S.append(slide('Ders 3 · Yazıcı ve sürücüler', 'Aygıt Yöneticisi', split(
    ul(['Bir parça çalışmıyorsa: <b>Başlat’a sağ tıklayın</b> → Aygıt Yöneticisi.',
        'Sarı ünlemli aygıt, sürücüsünün <b>eksik</b> olduğunu gösterir.',
        'Sağ tık → <b>Sürücüyü güncelleştir</b> → Sürücüleri otomatik olarak ara.',
        'Başka yerler: Windows Update; üreticinin resmî sitesi. “Sürücü güncelleyici” programlarından uzak durun.'], 'small'),
    fig('yz_aygit.jpg', '“Bilinmeyen aygıt”: sürücü eksik.'))))
S.append(slide('Ders 4 · İşletim sistemi (gösterim)', 'Windows’u sıfırdan kurmak', split(
    ul(['Kurulum diskteki fotoğrafları ve belgeleri <b>silebilir</b>. Önce mutlaka <b>yedek</b> alınır.',
        'Gerekenler: Windows kurulum USB’si; açılışta USB’den başlatmak (F12, F11 ya da Esc).',
        'Gerçekte kopyalama 15–30 dakika sürer; bilgisayar birkaç kez yeniden başlar. <b>Kapatmayın!</b>',
        'PIN: doğum yılınız ya da 1234 olmasın.'], 'small'),
    fig('os_disk_k.jpg', 'Disk seçimi: biçimlendirme her şeyi siler.'), 1, 1)))
S.append(slide('Ders 4 · İşletim sistemi (gösterim)', 'Kurulum ekranları', table([
    ['Dil ve klavye', 'Türkçe, Türkçe Q → İleri'], ['Şimdi yükle', '“Bilgisayarınızı onarın” bozuk Windows’u onarmak içindir'],
    ['Ürün anahtarı', 'Daha önce etkinleştirilmişse <b>Ürün anahtarım yok</b>'],
    ['Yükleme türü', '<b>Özel: Yalnızca Windows’u yükle</b> (temiz kurulum)'],
    ['Disk', 'Biçimlendirme her şeyi siler: uyarıyı okuyun'],
    ['İlk ayarlar', 'Bölge, klavye, internet (EvAğı), ad, PIN, gizlilik']], 'kv')))
S.append(slide('Özet', 'Bu hafta öğrendiklerimiz', table([
    ['Adres çubuğu', 'Adres biliniyorsa yazın; bilinmiyorsa kelimelerle arayın'],
    ['“İNDİR” düğmeleri', 'Çoğunlukla reklam; programın adının yazdığı sade bağlantıyı kullanın'],
    ['İzin penceresi', 'Siz indirdiyseniz Evet; tanımıyorsanız Hayır'],
    ['Önerilen ek yazılımlar', 'İşaretlerini kaldırın'],
    ['Sürücü', 'Parçanın bilgisayarla anlaşmasını sağlar; Aygıt Yöneticisi’nde sarı ünlem = eksik'],
    ['İşletim sistemi kurulumu', 'Önce yedek!']], 'kv')))
write('hafta8', '8. Hafta', 'Bilgisayar İşletmenliği – 8. Hafta Alıştırmaları', S)

# ================================================================ EK: GÜVENLİK
S = []
S.append(cover('Ek ders: İnternette güvenlik', 'Alıştırmalar ve oyunlar', 'Dolandırıcılığı tanıma alıştırması'))
S.append(slide('Bu ders', 'Dur · Düşün · Sor (20 dk)',
    ul(['<b>Acele ettirir:</b> “Hemen! Yoksa hesabınız kapanacak!”',
        '<b>Korkutur</b> ya da <b>ödül vaat eder</b>.',
        '<b>Şifre, kart numarası, SMS kodu</b> ister.',
        '<b>Garip bir bağlantıya</b> tıklatmak ister.']) +
    note('Dolandırıcıların mesajlarında hep aynı işaretler vardır. Alıştırmada her örneğe “güvenli mi, dolandırıcılık mı?” diye karar verilir.')))
S.append(slide('Oyun · Kargo mesajı', 'İşaretleri bulun', split(
    ul(['“Kargonuz teslim edilemedi.” Siparişiniz yoksa zaten şüpheli.',
        '“24 saat içinde.” Acele ettiriyor.',
        'Bağlantı gerçek kargo firmasının adresi değil.'], 'small') +
    note('Cevap: <b>dolandırıcılık</b>. Kargonuz varsa firmanın kendi sitesinden ya da uygulamasından takip numarasıyla bakın.'),
    fig('gv_cevap.jpg', 'Cevap verilince ipuçları sarıyla işaretlenir.'), .9, 1.1)))
S.append(slide('Oyun · Sekiz örnek', 'Hangisi güvenli, hangisi değil?', table([
    ['Kargo mesajı', '<span class="tag bad">dolandırıcılık</span> Acele ettiriyor, garip bağlantı'],
    ['Banka: “hesabınız bloke”', '<span class="tag bad">dolandırıcılık</span> Banka SMS ile şifre ya da kart bilgisi <b>asla</b> istemez'],
    ['Doğrulama kodu (siz giriş yaptınız)', '<span class="tag ok">güvenli</span> Ama kodu <b>kimseyle paylaşmayın</b>'],
    ['Telefonda “banka güvenlik birimi”', '<span class="tag bad">dolandırıcılık</span> Gelen kodu isteyen her arama; kapatın, bankayı kendiniz arayın'],
    ['“Babaanne, yeni numaram, 5.000 TL lazım”', '<span class="tag bad">dolandırıcılık</span> Eski numarasından arayıp doğrulayın'],
    ['Fatura e-postası (bağlantı, acele yok)', '<span class="tag ok">güvenli</span> Yine de tutarı bankanızdan kontrol edin']], 'kv small')))
S.append(slide('Oyun · Sahte site, sahte uyarı', 'Adrese ve uyarıya dikkat', two(
    'gv_adres.jpg', '<b>A:</b> bankanın kendi adresi, kilit var. <b>B:</b> fazladan kelimeler, .xyz, “Güvenli değil”.',
    'gv_virus.jpg', '<b>Sahte virüs uyarısı:</b> numarayı aramayın. Sekmeyi ya da tarayıcıyı kapatın.')))
S.append(slide('Alıştırma', 'Güçlü şifre', split(
    ul(['En az <b>12 karakter</b>',
        'Büyük + küçük harf, rakam, işaret',
        'Doğum yılı, isim, 1234 <b>olmasın</b>',
        'İpucu: üç kelimeyi birleştirin: <b>MaviBalık!Çay7</b>'], 'small') +
    note('Her yerde aynı şifreyi kullanmayın. Gerçek şifrenizi alıştırmada yazmayın.'),
    fig('gv_sifre.jpg', 'Çubuk “Çok güçlü” olana kadar deneyin.'), 1, .9)))
S.append(slide('Özet', 'Altın kurallar', table([
    ['Acele ettiren, korkutan mesaj', 'Durun, düşünün, kimseye hemen bilgi vermeyin'],
    ['Şifre, kart bilgisi, SMS kodu', 'Banka ve devlet kurumları telefonla ya da SMS ile <b>asla</b> istemez'],
    ['Garip bağlantılar', 'Tıklamayın; siteyi kendiniz açın'],
    ['“Acil para lazım” diyen yakın', 'Önce bildiğiniz eski numarasından arayıp doğrulayın'],
    ['Sahte virüs uyarısı', 'Numarayı aramayın; sekmeyi ya da tarayıcıyı kapatın'],
    ['Emin değilseniz', 'Bir yakınınıza danışın']], 'kv')))
write('ek-guvenlik', 'Ek ders: İnternette güvenlik', 'Bilgisayar İşletmenliği – Ek Ders: İnternette Güvenlik', S)


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
