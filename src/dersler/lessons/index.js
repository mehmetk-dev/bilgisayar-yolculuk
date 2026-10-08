// Derslerin haftalara göre listesi (eğitmenin 8 haftalık programıyla aynı sırada)
import { ackapa, fare1, fare2, surukle, pencereler, parkur } from './hafta1.js';
import { klavye } from './hafta2.js';
import { notdefteri } from './notdefteri.js';
import { donanim } from './hafta4.js';
import { masaustu, dosyalar } from './hafta5_6.js';
import { paint, alinti, ayarlar } from './hafta7.js';
import { internet, kurulum, yazici, oskurulum } from './hafta8.js';
import { guvenlik } from './guvenlik.js';
import { eslestir, tusavi, kart, liste, ilanOku, masaustuParkur, dosyaParkur } from './alistirmalar.js';
import { test1, test2, test3, test4, test5, test6, test7, test8 } from './testler.js';
import { onparmak, rakamlar, isaretler, klavyeOyun } from './hafta2_ek.js';
import { secme, kisayolYarisi, tarif, kaydetPratik, kopyaOyun } from './hafta3_ek.js';
import { parcalar, portlar, bakim, sorunGiderme } from './hafta4_ek.js';
import { hesapMakinesi, masaustuDuzen, baslatKesif, oyunlar, masaustuHarita } from './hafta5_ek.js';
import { dosyaTurleri, fotograflar, klasorAgaci, copKutusu, dosyaSenaryo } from './hafta6_ek.js';
import { evCiz, tebrikKarti, alintiPratik, ayarlarParkur } from './hafta7_ek.js';
import { aramaPratik, tuzaklar, internetParkur } from './hafta8_ek.js';

const yolculuk = {
  link: 'bilgisayar.html', icon: '🖥', title: 'Bilgisayarın İçine Yolculuk (3B)',
  desc: 'Kasanın içi, parçalar, portlar ve depolama: 1990\'lardan bugüne üç boyutlu.',
};

// Her hafta 8 ders: konu anlatımları, ek dersler, orta seviye alıştırmalar (yönlendirmesiz) ve tekrar testi
export const WEEKS = [
  { no: 1, title: 'Açma-kapama ve fare', lessons: [ackapa, fare1, fare2, surukle, pencereler, parkur, eslestir, test1] },
  { no: 2, title: 'Klavye', lessons: [klavye, onparmak, rakamlar, isaretler, tusavi, kart, klavyeOyun, test2] },
  { no: 3, title: 'Metin seçme ve kısayollar', lessons: [notdefteri, secme, kaydetPratik, liste, tarif, kisayolYarisi, kopyaOyun, test3] },
  { no: 4, title: 'Donanım ve yazılım', lessons: [yolculuk, donanim, parcalar, portlar, ilanOku, bakim, sorunGiderme, test4] },
  { no: 5, title: 'Masaüstü, Başlat menüsü ve pencereler', lessons: [masaustu, baslatKesif, masaustuDuzen, hesapMakinesi, oyunlar, masaustuParkur, masaustuHarita, test5] },
  { no: 6, title: 'Dosyalar ve klasörler', lessons: [dosyalar, dosyaTurleri, klasorAgaci, fotograflar, copKutusu, dosyaParkur, dosyaSenaryo, test6] },
  { no: 7, title: 'Paint, Ekran Alıntısı ve Ayarlar', lessons: [paint, evCiz, tebrikKarti, alinti, alintiPratik, ayarlar, ayarlarParkur, test7] },
  { no: 8, title: 'İnternet, program kurma, yazıcı ve işletim sistemi', lessons: [internet, aramaPratik, tuzaklar, kurulum, yazici, oskurulum, internetParkur, test8] },
  { no: 0, title: 'İnternette güvenlik', lessons: [guvenlik] },
];

export const LESSONS = WEEKS.flatMap((w) => w.lessons);
