// Derslerin haftalara göre listesi (eğitmenin 8 haftalık programıyla aynı sırada)
import { ackapa, fare1, fare2, surukle, pencereler, parkur } from './hafta1.js';
import { dizustu } from './dizustu.js';
import { yaziSorun } from './yazisorun.js';
import { donatilar } from './donatilar.js';
import { fareAyar, okumaKolay } from './erisim.js';
import { takvimRandevu, ekranKlavyesi, mektup, sanalMasaustu } from './ileri2.js';
import { bluetooth, hesapPin } from './bluetooth.js';
import { bakimGuvenlik } from './bakimguvenlik.js';
import { medya } from './medya.js';
import { epostaIletme, ekTasi, sifreSifirla } from './eposta3.js';
import { apartmanDuyuru, sayfaDuzeni, tabloInce, simgeSekil, dilekceParkur } from './kelime2.js';
import { hucreInce, doldurDondur, calismaSayfalari, excelYazdir, tabloParkur } from './excel2.js';
import { slaytDuzen, smartArt, animasyon, anıAlbumu } from './sunu2.js';
import { pdfCalis, whatsappWeb } from './gunluk2.js';
import { eNabiz, ilanTuzak, eHizmetParkur } from './hizmet.js';
import { yapayZeka } from './yapayzeka.js';
import { isletimSistemleri } from './isletim.js';
import { tarayicilarBilgi } from './tarayicilar.js';
import { virusAntivirus } from './virus.js';
import { gmailHotmail } from './gmailhotmail.js';
import { videoHz } from './videohz.js';
import { fqKlavye, klavyeDili } from './fqklavye.js';
import { saatTarih } from './saat.js';
import { denetimMasasi } from './denetimmasasi.js';
import { pdfDuzenle } from './pdfduzenle.js';
import { resimWeb } from './resimweb.js';
import { cerezler } from './cerezler.js';
import { aramaMotorlari } from './aramamotoru.js';
import { sunuKurallar, sunuAni } from './sunu3.js';
import { duseyara, aidatTakip } from './excel3.js';
import { odev1, odev2, odev3, odev4, odev5, odev6, odev7, odev8, odev9, odev10, odev11, odev12, odev13, odev14 } from './odevler.js';
import { klavye } from './hafta2.js';
import { notdefteri } from './notdefteri.js';
import { donanim } from './hafta4.js';
import { masaustu, dosyalar } from './hafta5_6.js';
import { paint, alinti, ayarlar } from './hafta7.js';
import { internet, kurulum, yazici, oskurulum } from './hafta8.js';
import { guvenlik } from './guvenlik.js';
import { hiz } from './hiz.js';
import { eposta } from './eposta.js';
import { harfbul } from './harfbul.js';
import { dilekce, belgeEkle, belgeDuzen } from './kelime.js';
import { gorev } from './gorev.js';
import { temalar } from './temalar.js';
import { tarayici } from './tarayici.js';
import { adres } from './adres.js';
import { zip, eposta2, bulutPaylas, ozgecmis, butce } from './programlar2.js';
import { edevlet, randevu, alisveris, gorusme, telefon } from './islemler.js';
import { hesap1, hesap2, hesap3, hesap4 } from './hesap.js';
import { sunu } from './sunu.js';
import { gunlukPc, gunlukWeb } from './gunluk.js';
import { isg } from './isg.js';
import { eslestir, tusavi, kart, liste, ilanOku, masaustuParkur, dosyaParkur } from './alistirmalar.js';
import { testDonanim, test1, test2, test3, test4, test5, test6, test7, test8, test9, test10, test11, test12, test13, test14 } from './testler.js';
import { onparmak, rakamlar, isaretler, klavyeOyun } from './hafta2_ek.js';
import { secme, kisayolYarisi, tarif, kaydetPratik, kopyaOyun } from './hafta3_ek.js';
import { parcalar, portlar, bakim, sorunGiderme } from './hafta4_ek.js';
import { hesapMakinesi, masaustuDuzen, baslatKesif, oyunlar, masaustuHarita } from './hafta5_ek.js';
import { dosyaTurleri, fotograflar, klasorAgaci, copKutusu, dosyaSenaryo } from './hafta6_ek.js';
import { evCiz, tebrikKarti, alintiPratik, ayarlarParkur } from './hafta7_ek.js';
import { aramaPratik, tuzaklar, internetParkur } from './hafta8_ek.js';

const donanimDersi = {
  link: 'bilgisayar.html#ders', icon: '🎓', title: 'Donanım dersi: kasanın içi adım adım (3B)',
  desc: '22 adım: anakart, işlemci, RAM, disk, ekran kartı, güç kaynağı ve portlar.',
};

const yolculuk = {
  link: 'bilgisayar.html', icon: '🖥', title: 'Bilgisayarın İçine Yolculuk (3B)',
  desc: 'Kasanın içi, parçalar, portlar ve depolama: 1990\'lardan bugüne üç boyutlu.',
};

// Her hafta 8 ders: konu anlatımları, ek dersler, orta seviye alıştırmalar (yönlendirmesiz) ve tekrar testi
export const WEEKS = [
  { no: 1, title: 'Açma-kapama ve fare', lessons: [ackapa, fare1, fare2, surukle, pencereler, dizustu, parkur, eslestir, odev1, test1] },
  { no: 2, title: 'Klavye', lessons: [klavye, fqKlavye, harfbul, onparmak, rakamlar, isaretler, yaziSorun, klavyeDili, tusavi, kart, klavyeOyun, odev2, test2] },
  { no: 3, title: 'Metin seçme ve kısayollar', lessons: [notdefteri, secme, kaydetPratik, liste, tarif, kisayolYarisi, kopyaOyun, odev3, test3] },
  { no: 4, title: 'Donanım ve yazılım', lessons: [yolculuk, donanimDersi, donanim, parcalar, portlar, ilanOku, bakim, isg, sorunGiderme, odev4, test4, testDonanim] },
  { no: 5, title: 'Masaüstü, Başlat menüsü ve pencereler', lessons: [masaustu, baslatKesif, masaustuDuzen, hesapMakinesi, donatilar, takvimRandevu, fareAyar, okumaKolay, ekranKlavyesi, oyunlar, gorev, sanalMasaustu, masaustuParkur, masaustuHarita, odev5, test5] },
  { no: 6, title: 'Dosyalar ve klasörler', lessons: [dosyalar, dosyaTurleri, resimWeb, klasorAgaci, fotograflar, zip, copKutusu, dosyaParkur, dosyaSenaryo, odev6, test6] },
  { no: 7, title: 'Paint, Ekran Alıntısı ve Ayarlar', lessons: [paint, evCiz, tebrikKarti, alinti, alintiPratik, ayarlar, saatTarih, denetimMasasi, temalar, bluetooth, hesapPin, ayarlarParkur, odev7, test7] },
  { no: 8, title: 'İnternet, program kurma, yazıcı ve işletim sistemi', lessons: [internet, tarayicilarBilgi, adres, aramaPratik, aramaMotorlari, medya, videoHz, tuzaklar, kurulum, yazici, bakimGuvenlik, virusAntivirus, isletimSistemleri, oskurulum, internetParkur, odev8, test8] },
  { no: 9, title: 'E-posta', lessons: [eposta, gmailHotmail, epostaIletme, eposta2, ekTasi, bulutPaylas, sifreSifirla, odev9, test9] },
  { no: 10, title: 'Kelime işlemci (Word)', lessons: [dilekce, apartmanDuyuru, belgeEkle, tabloInce, belgeDuzen, sayfaDuzeni, simgeSekil, mektup, ozgecmis, dilekceParkur, odev10, test10] },
  { no: 11, title: 'Hesap tablosu (Excel)', lessons: [hesap1, hesap2, hucreInce, hesap3, hesap4, duseyara, doldurDondur, aidatTakip, calismaSayfalari, excelYazdir, butce, tabloParkur, odev11, test11] },
  { no: 12, title: 'Sunu (PowerPoint)', lessons: [sunu, sunuKurallar, slaytDuzen, smartArt, animasyon, sunuAni, anıAlbumu, odev12, test12] },
  { no: 13, title: 'Günlük işler: bilgisayarda ve tarayıcıda', lessons: [gunlukPc, telefon, gunlukWeb, tarayici, cerezler, pdfCalis, pdfDuzenle, whatsappWeb, odev13, test13] },
  { no: 14, title: 'İnternette işlemler: e-Devlet, randevu, e-Nabız, alışveriş, görüntülü görüşme, ilan siteleri', lessons: [edevlet, randevu, alisveris, gorusme, eNabiz, ilanTuzak, eHizmetParkur, odev14, test14] },
  { no: 0, title: 'İnternette güvenlik, yapay zekâ ve yazma hızı', lessons: [guvenlik, yapayZeka, hiz] },
];

export const LESSONS = WEEKS.flatMap((w) => w.lessons);
