# Bilgisayarın İçine Yolculuk

Bilgisayar bileşenlerini 1990'lardan 2025'e kadar anlatan, tarayıcıda çalışan etkileşimli bir 3B ders uygulaması.

## Hızlı başlangıç

`dist/bilgisayarin-icine-yolculuk.html` dosyasını Chrome, Edge, Firefox ya da Brave ile açın. İnternet bağlantısı gerekmez: Three.js ve bütün dokular dosyanın içine gömülüdür. Kurulum da gerekmez.

## Dersteki kullanım

| Ne yapmak istiyorsunuz? | Nasıl? |
|---|---|
| Dönem değiştirmek | Alttaki zaman çizgisi ya da <kbd>1</kbd>–<kbd>4</kbd> tuşları |
| Döndürmek / yakınlaştırmak | Sol tuşla sürükleyin, tekerlek ile yakınlaştırın, sağ tuşla kaydırın |
| Kasayı açmak | "Kasayı aç" ya da <kbd>O</kbd> |
| Ön, arka, iç ve arka panel görünüşleri | Sol menüdeki "Görünüş" düğmeleri |
| Parçaları katman katman ayırmak | "Parçaları ayır" kaydırıcısı |
| Bir parçayı incelemek | Parçaya tıklayın (diğer parçalar soluklaşır). Sekmeler: Ne işe yarar? · Nereye takılır? · Bu dönemde nasıldı? |
| Tek bir parçayı çıkarıp yerine takmak | Bilgi panelindeki "Çıkar" düğmesi |
| HDD, CD/DVD, SSD ve M.2'nin içini görmek | "İçini göster": HDD'de plakalar döner, CD/DVD'de lazer kızağı hareket eder |
| İşlemcinin iç yapısını göstermek | "İç yapısı (şema)". Bu, öğretici bir şemadır; gerçek yongayı göstermez |
| Portları tanıtmak | Arka paneldeki ya da ön paneldeki herhangi bir porta tıklayın |
| Kabloları göstermek | "Güç kabloları" (turuncu) ve "Veri bağlantıları" (mavi). HDD için "Kablolarını göster": güç ve veri kablosu birlikte görünür |
| Anakart soketlerini göstermek | "Anakart soketleri": işlemci soketi, RAM yuvaları, PCI/AGP/PCIe, IDE/SATA/M.2, güç konnektörleri |
| Güç tüketimini anlatmak | "Güç tüketimi": PSU kapasitesi ile anlık tüketim ayrı gösterilir. Boşta, ofis ve oyun durumları vardır; 2025 için ofis ve oyun bilgisayarı seçilebilir |
| Eski ve yeni parçaları karşılaştırmak | "Karşılaştır": iki parça cetvel üzerinde gerçek ölçekte yan yana durur, altında tablo vardır |
| Öğrencilere parça buldurmak | "Buldurma oyunu": etiketler gizlenir, soru sorulur, puan tutulur |
| Anlatım düzeyini değiştirmek | Üstte "Çocuklar" / "Gençler (teknik)" |
| Sunum için ayar yapmak | Tam ekran (<kbd>F</kbd>), A−/A+ ile yazı boyutu, animasyonu durdurma (<kbd>Boşluk</kbd>), sonraki/önceki parça (<kbd>←</kbd> <kbd>→</kbd>) |
| Yavaş bilgisayarda çalıştırmak | "Grafik: düşük" seçeneği gölgeleri kapatır ve çözünürlüğü düşürür. Açılışta kare hızı düşükse uygulama bunu kendiliğinden yapar |

## Temsilî sistemler

| | 1990'lar (~1997) | 2000'ler (~2004) | 2010'lar (~2014) | 2025 |
|---|---|---|---|---|
| Kasa | Bej yatay masaüstü kasa; turbo düğmesi, kilit ve MHz göstergesi | ATX orta kule (bej ya da siyah-gümüş), CPU hava kanalı | Siyah kule, 2+1 adet 120 mm fan, PSU altta | Cam yan panel, PSU bölmesi, ARGB |
| İşlemci | Pentium sınıfı, Socket 7 | Pentium 4 sınıfı, Socket 478 | 4 çekirdek, LGA 1150 | 8 çekirdek, AM5 |
| RAM | 72-pin EDO SIMM (çift olarak takılır) | DDR-400 | DDR3-1600 | DDR5-6000 |
| Ekran kartı | PCI, VGA | AGP 8x, VGA/S-Video/DVI | PCIe 3.0, iki fanlı | PCIe 5.0, üç fanlı, 12V-2x6 |
| Depolama | IDE HDD, disket, CD-ROM | SATA HDD, disket, IDE DVD±RW | SATA SSD, HDD, SATA DVD | M.2 NVMe |
| PSU | 200 W, monitör çıkışlı | 350 W ATX12V | 500 W Bronze | 850 W Gold modüler (ofis sürümü: 450 W) |

Bu sistemler kesin geçiş tarihlerini göstermez. Her dönemin farkını anlatmak için seçilmiş tipik parçalardır. Marka ve model adları uydurmadır; gerçek logo kullanılmamıştır. Güç tüketimi değerleri tahminidir.

## Kaynaklar

- Intel ATX Specification 2.2, ATX12V ve ATX 3.x PSU tasarım kılavuzları
- JEDEC modül standartları (SIMM/DIMM ölçüleri, pin sayıları)
- PC 99 System Design Guide (port renk kodları)
- SATA-IO, PCI-SIG (PCI, PCIe, M.2), USB-IF belgeleri
- MEB MEGEP, "İç Donanım Birimleri" öğrenme materyali

## Geliştirme

```bash
npm install
node build.mjs          # dist/bilgisayarin-icine-yolculuk.html (küçültülmüş)
node build.mjs --dev    # okunabilir çıktı
node tools/shot.mjs senaryo.json   # ekran görüntüsü (Brave/Chromium + puppeteer-core)
```

### Klasör yapısı

```
src/
  main.js          Uygulama: sahne, kamera, seçim, paneller, kablo modları, karşılaştırma, oyun
  index.html       Arayüz (HTML/CSS)
  content.js       Bütün Türkçe metinler ve veriler (parçalar, portlar, güç, karşılaştırma, sorular)
  assemble.js      Parça kaydı, anakart yerleşimi, kablo oluşturucu
  geom.js          Geometri yardımcıları, statik birleştirme (draw call azaltma), kablo/şerit geometrisi
  materials.js     PBR malzemeler, PC 99 renkleri
  textures.js      Canvas dokuları: PCB izleri, yonga yazıları, etiketler, ızgaralar
  compare.js       Karşılaştırma sahnesi ve cetvel
  cpuSchema.js     İşlemci iç yapısı şeması (SVG)
  parts/           board, cpu, ram, cards, drives, psu, fan, ports, cases
  eras/            era1990, era2000, era2010, era2025 (her dönemin montajı)
tools/shot.mjs     Kalite kontrol için ekran görüntüsü betiği
kalite-kontrol/    Her dönem için dış görünüş, kasa açık, parçalar ayrılmış ve arka panel ekran görüntüleri
```

Lisans notu: Three.js MIT lisanslıdır ve derlenmiş dosyaya gömülüdür.
