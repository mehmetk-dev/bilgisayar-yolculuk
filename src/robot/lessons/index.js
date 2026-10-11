// Robo ile Kodlama: haftalık program (haftada bir gün, 4 ders × 40 dk)
import { b1, b2, b3, b4 } from './h1.js';
import { b5, b6, b7, b8 } from './h2.js';
import { b9, b10, b11, b12 } from './h3.js';

export const WEEKS = [
  { title: 'Algoritma ve yönler', lessons: [b1, b2, b3, b4] },
  { title: 'Hata ayıklama ve döngüler', lessons: [b5, b6, b7, b8] },
  { title: 'Fonksiyonlar ve koşullar', lessons: [b9, b10, b11, b12] },
];

// Bölümlere sıra numarası ve hafta bilgisi verilir
export const LESSONS = WEEKS.flatMap((w, wi) => w.lessons.map((l) => Object.assign(l, { week: wi + 1 })));
LESSONS.forEach((l, i) => { l.no = i + 1; });
