// Robo ile Kodlama: haftalık program (haftada bir gün, 4 ders × 40 dk)
import { b1, b2, b3, b4 } from './h1.js';
import { b5, b6, b7, b8 } from './h2.js';
import { b9, b10, b11, b12 } from './h3.js';
import { b13, b14, b15, b16 } from './h4.js';
import { b17, b18, b19, b20 } from './h5.js';
import { b21, b22, b23, b24 } from './h6.js';
import { b25, b26, b27, b28 } from './h7.js';
import { b29, b30, b31, b32 } from './h8.js';
import { b33, b34 } from './ek1.js';
import { b35, b36 } from './ek2.js';
import { b37, b38 } from './ek3.js';

export const WEEKS = [
  { title: 'Algoritma ve yönler', lessons: [b1, b2, b3, b4] },
  { title: 'Hata ayıklama ve döngüler', lessons: [b5, b6, b7, b8] },
  { title: 'Fonksiyonlar ve koşullar', lessons: [b9, b10, b11, b12] },
  { title: 'Scratch\'e merhaba', lessons: [b13, b14, b15, b16] },
  { title: 'Döngü, ses, algılama ve kalem', lessons: [b17, b18, b19, b20] },
  { title: 'Değişkenler, rastgelelik ve hikâye', lessons: [b21, b22, b23, b24] },
  { title: 'Oyun projeleri ve kendi projen', lessons: [b25, b26, b27, b28] },
  { title: 'Scratch ustalığı: soru, matematik, klonlar', lessons: [b29, b30, b31, b32] },
  // Ek bölümler: 8 haftalık programın dışında; hızlı bitirenler ve tekrar için (ilerleme numaraları değişmesin diye sona eklenir)
  { extra: true, title: 'Ek bölümler: bulmaca, müzik ve oyunlar', lessons: [b33, b34, b35, b36, b37, b38] },
];

// Bölümlere sıra numarası ve hafta bilgisi verilir
export const LESSONS = WEEKS.flatMap((w, wi) => w.lessons.map((l) => Object.assign(l, { week: wi + 1, extra: !!w.extra })));
LESSONS.forEach((l, i) => { l.no = i + 1; });
