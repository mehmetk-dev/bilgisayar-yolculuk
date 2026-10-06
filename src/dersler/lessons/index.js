// Derslerin haftalara göre listesi (eğitmenin 8 haftalık programıyla aynı sırada)
import { ackapa, fare1, fare2, surukle, pencereler, parkur } from './hafta1.js';
import { klavye } from './hafta2.js';
import { notdefteri } from './notdefteri.js';
import { donanim } from './hafta4.js';
import { masaustu, dosyalar } from './hafta5_6.js';
import { paint, alinti, ayarlar } from './hafta7.js';
import { internet, kurulum, yazici, oskurulum } from './hafta8.js';
import { guvenlik } from './guvenlik.js';

const yolculuk = {
  link: 'bilgisayar.html', icon: '🖥', title: 'Bilgisayarın İçine Yolculuk (3B)',
  desc: 'Kasanın içi, parçalar, portlar ve depolama: 1990\'lardan bugüne üç boyutlu.',
};

export const WEEKS = [
  { no: 1, title: 'Açma-kapama ve fare', lessons: [ackapa, fare1, fare2, surukle, pencereler, parkur] },
  { no: 2, title: 'Klavye', lessons: [klavye] },
  { no: 3, title: 'Metin seçme ve kısayollar', lessons: [notdefteri] },
  { no: 4, title: 'Donanım ve yazılım', lessons: [yolculuk, donanim] },
  { no: 5, title: 'Masaüstü, Başlat menüsü ve pencereler', lessons: [masaustu] },
  { no: 6, title: 'Dosyalar ve klasörler', lessons: [dosyalar] },
  { no: 7, title: 'Paint, Ekran Alıntısı ve Ayarlar', lessons: [paint, alinti, ayarlar] },
  { no: 8, title: 'İnternet, program kurma, yazıcı ve işletim sistemi', lessons: [internet, kurulum, yazici, oskurulum] },
  { no: 0, title: 'İnternette güvenlik', lessons: [guvenlik] },
];

export const LESSONS = WEEKS.flatMap((w) => w.lessons);
