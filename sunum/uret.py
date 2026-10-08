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
