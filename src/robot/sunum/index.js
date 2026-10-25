// Haftalık sunumlar: SUNUM[hafta] = { slides: [...] } (biçim: ../sunum.js başındaki açıklama). Slaytı olmayan hafta listelenmez.
import { s1 } from './h1.js';
import { s2 } from './h2.js';
import { s3 } from './h3.js';
import { s4 } from './h4.js';
import { s5 } from './h5.js';
import { s6 } from './h6.js';
import { s7 } from './h7.js';
import { s8 } from './h8.js';

export const SUNUM = Object.fromEntries([s1, s2, s3, s4, s5, s6, s7, s8].map((s, i) => [i + 1, s]).filter(([, s]) => s.slides.length));
