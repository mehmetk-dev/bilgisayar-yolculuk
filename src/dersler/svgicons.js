// Ders kartlarındaki simgeler. Bazı emojiler eski bilgisayarlarda (Windows 7/8, eski Edge ve Chrome)
// hiç görünmez ya da kare çıkar; gömülü simge yazı tipinde de yoktur. Bunların yerine burada çizilen
// düz renkli SVG simgeler kullanılır. Yeni bir emoji eklenince eksikse buraya eklenir.
import { WIN_LOGO, MONO, APP_ICONS, SYS_ICONS } from './apps/appicons.js';
import { NAV } from './apps/w11-simge.js';

const S = (body) => `<svg class="svi" viewBox="0 0 32 32" aria-hidden="true">${body}</svg>`;
const person = (x, c) => `<circle cx="${x}" cy="11" r="4.5" fill="${c}"/><path d="M${x - 8} 27a8 8 0 0 1 16 0z" fill="${c}"/>`;

const ICONS = {
  '🪟': S('<rect x="3" y="3" width="26" height="26" rx="3" fill="#7a5a3a"/><g fill="#8fd0f7"><rect x="6" y="6" width="9.5" height="9.5" rx="1"/><rect x="16.5" y="6" width="9.5" height="9.5" rx="1"/><rect x="6" y="16.5" width="9.5" height="9.5" rx="1"/><rect x="16.5" y="16.5" width="9.5" height="9.5" rx="1"/></g>'),
  '🧩': S('<g fill="#2fa65a"><rect x="4" y="9" width="20" height="20" rx="2"/><circle cx="14" cy="7" r="4.2"/><circle cx="26" cy="19" r="4.2"/></g><circle cx="4" cy="19" r="3.6" fill="#fff"/><circle cx="12" cy="20" r="2" fill="#6fd68f"/>'),
  '⧉': S('<rect x="9" y="3" width="20" height="17" rx="2" fill="#fff" stroke="#3d6fb6" stroke-width="2.4"/><rect x="3" y="11" width="20" height="17" rx="2" fill="#cfe3fb" stroke="#3d6fb6" stroke-width="2.4"/>'),
  '🐧': S('<ellipse cx="16" cy="18" rx="9" ry="11" fill="#2b3340"/><ellipse cx="16" cy="20" rx="5.6" ry="8" fill="#fff"/><circle cx="12.8" cy="12.5" r="1.4" fill="#fff"/><circle cx="19.2" cy="12.5" r="1.4" fill="#fff"/><path d="M13.5 15h5l-2.5 3z" fill="#f4a21c"/><ellipse cx="11.5" cy="29" rx="3.5" ry="1.6" fill="#f4a21c"/><ellipse cx="20.5" cy="29" rx="3.5" ry="1.6" fill="#f4a21c"/>'),
  '🧭': S('<circle cx="16" cy="16" r="13" fill="#d9a441"/><circle cx="16" cy="16" r="10.5" fill="#fff"/><path d="M16 6l3 10-3 10-3-10z" fill="#d93b3b"/><path d="M16 26l-3-10h6z" fill="#5b6675"/><circle cx="16" cy="16" r="1.6" fill="#222"/>'),
  '🧮': S('<rect x="3" y="5" width="26" height="22" rx="2" fill="#a8744a"/><rect x="5.5" y="7.5" width="21" height="17" fill="#f6e3c4"/><g stroke="#7a4f2a" stroke-width="1.4"><path d="M5.5 12.5h21M5.5 16h21M5.5 19.5h21"/></g><g fill="#d93b3b"><circle cx="10" cy="12.5" r="1.9"/><circle cx="14" cy="12.5" r="1.9"/><circle cx="21" cy="16" r="1.9"/></g><g fill="#2f6fd0"><circle cx="9" cy="16" r="1.9"/><circle cx="17" cy="19.5" r="1.9"/><circle cx="21" cy="19.5" r="1.9"/><circle cx="23.5" cy="12.5" r="1.9"/></g>'),
  '📑': S('<rect x="8" y="3" width="19" height="24" rx="2" fill="#e4ecf7" stroke="#8aa3c4" stroke-width="1.6"/><rect x="5" y="6" width="19" height="24" rx="2" fill="#fff" stroke="#6b86ad" stroke-width="1.6"/><path d="M9 12h11M9 16h11M9 20h7" stroke="#8aa3c4" stroke-width="1.8" stroke-linecap="round"/>'),
  '📧': S('<rect x="3" y="7" width="26" height="19" rx="3" fill="#fff" stroke="#4a73b8" stroke-width="2"/><path d="M4 9l12 9 12-9" fill="none" stroke="#4a73b8" stroke-width="2" stroke-linejoin="round"/>'),
  '🤝': S('<path d="M2 12l7-3 7 3 7-3 7 3v8l-5 4-5-3-4 4-5-4-4 1z" fill="#f2c28b"/><path d="M2 12l7-3 3 4zM30 12l-7-3-3 4z" fill="#3d7bd4"/><path d="M10 15l4 3 3-2 4 3" fill="none" stroke="#c98f52" stroke-width="1.6" stroke-linecap="round"/>'),
  '🧽': S('<rect x="4" y="9" width="24" height="16" rx="3" fill="#f2d03c"/><rect x="4" y="19" width="24" height="6" rx="2.5" fill="#2fa65a"/><g fill="#d6a912"><circle cx="10" cy="13" r="1.6"/><circle cx="17" cy="15" r="1.4"/><circle cx="23" cy="12" r="1.7"/></g>'),
  '🟢': S('<circle cx="16" cy="16" r="12" fill="#2fb566"/><circle cx="12" cy="11" r="3" fill="#7fe0a4"/>'),
  '🟩': S('<rect x="4" y="4" width="24" height="24" rx="4" fill="#2fb566"/>'),
  '🟦': S('<rect x="4" y="4" width="24" height="24" rx="4" fill="#3d7bd4"/>'),
  '🦊': S('<path d="M3 5l8 6h10l8-6 1 14-14 10L2 19z" fill="#ee7b22"/><path d="M8 17l8 6 8-6-4 9h-8z" fill="#fff"/><circle cx="11.5" cy="16" r="1.5" fill="#222"/><circle cx="20.5" cy="16" r="1.5" fill="#222"/><circle cx="16" cy="26" r="1.7" fill="#222"/>'),
  '🏛': S('<path d="M16 3L3 11h26z" fill="#c9ced6"/><rect x="3" y="26" width="26" height="3.5" fill="#aeb5c0"/><g fill="#e6e9ee"><rect x="6" y="13" width="3.6" height="12"/><rect x="11.5" y="13" width="3.6" height="12"/><rect x="17" y="13" width="3.6" height="12"/><rect x="22.5" y="13" width="3.6" height="12"/></g><rect x="3" y="24" width="26" height="2.5" fill="#c9ced6"/>'),
  '🦠': S('<g stroke="#4aa83a" stroke-width="2.4" stroke-linecap="round"><path d="M16 2v5M16 25v5M2 16h5M25 16h5M6 6l3.5 3.5M22.5 22.5L26 26M26 6l-3.5 3.5M9.5 22.5L6 26"/></g><circle cx="16" cy="16" r="9" fill="#7ed957"/><circle cx="13" cy="13" r="2" fill="#2f7a22"/><circle cx="19.5" cy="18" r="2.4" fill="#2f7a22"/><circle cx="13.5" cy="20" r="1.4" fill="#2f7a22"/>'),
  '🧳': S('<path d="M12 9V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3" fill="none" stroke="#5a3a22" stroke-width="2.2"/><rect x="4" y="9" width="24" height="18" rx="3" fill="#b8733a"/><rect x="4" y="15" width="24" height="2.4" fill="#8a5428"/><rect x="14" y="14" width="4" height="5" rx="1" fill="#f2c94c"/><path d="M8 27v2M24 27v2" stroke="#5a3a22" stroke-width="2.2"/>'),
  '🧊': S('<path d="M16 3l11 6v14l-11 6-11-6V9z" fill="#bfe8fa"/><path d="M16 3l11 6-11 6L5 9z" fill="#e5f6fd"/><path d="M16 15v14l11-6V9z" fill="#8fd0ee"/>'),
  '🎛': S('<rect x="3" y="5" width="26" height="22" rx="3" fill="#59616f"/><g fill="#e8ecf2"><circle cx="10" cy="12" r="4"/><circle cx="22" cy="12" r="4"/></g><g stroke="#59616f" stroke-width="1.8" stroke-linecap="round"><path d="M10 12v-3M22 12l2-2"/></g><g fill="#7ad08f"><rect x="6" y="20" width="20" height="3" rx="1.5"/></g><circle cx="19" cy="21.5" r="2.6" fill="#f2c94c"/>'),
  '☝': S('<path d="M12 4a2.6 2.6 0 0 1 5.2 0v12l1-.5a2.4 2.4 0 0 1 3.4 1.2l.6-.2a2.4 2.4 0 0 1 3.2 1.8l.4-.1a2.2 2.2 0 0 1 2.4 2.2V24c0 3-2 5.5-5 5.5h-6c-3 0-5-2-6.5-4.5L5 19.5a2.3 2.3 0 0 1 3.7-2.6L12 20z" transform="translate(-1 0)" fill="#f2c28b" stroke="#c98f52" stroke-width="1.2" stroke-linejoin="round"/>'),
  '🤏': S('<path d="M5 20c0-4 3-7 7-7h4l5-4 3 3-4 4h5a3 3 0 0 1 3 3v3c0 3-2 5-5 5H12c-4 0-7-1-7-3z" fill="#f2c28b" stroke="#c98f52" stroke-width="1.2" stroke-linejoin="round"/><path d="M13 15l3 2" stroke="#c98f52" stroke-width="1.4" stroke-linecap="round"/>'),
  '🔉': S('<path d="M4 12h5l7-6v20l-7-6H4z" fill="#5b6675"/><path d="M20 12a6 6 0 0 1 0 8" fill="none" stroke="#3d7bd4" stroke-width="2.6" stroke-linecap="round"/>'),
  '✈': S('<path d="M30 6c0-2-2-3-3.5-1.5L20 11 6 8 4 10l11 6-5 5-5-1-2 2 5 2 2 5 2-2-1-5 5-5 6 11 2-2-3-14 6-6z" fill="#3d7bd4"/>'),
  '🔅': S('<circle cx="16" cy="16" r="6" fill="#f2b705"/><g stroke="#f2b705" stroke-width="2.4" stroke-linecap="round"><path d="M16 3v4M16 25v4M3 16h4M25 16h4M7 7l2.5 2.5M22.5 22.5L25 25M25 7l-2.5 2.5M9.5 22.5L7 25"/></g>'),
  '📐': S('<path d="M4 4v24h24z" fill="#f2d03c" stroke="#b89000" stroke-width="2" stroke-linejoin="round"/><path d="M9 12v12h12z" fill="#fff" stroke="#b89000" stroke-width="1.6" stroke-linejoin="round"/>'),
  '🆓': S('<rect x="2" y="8" width="28" height="16" rx="4" fill="#3d7bd4"/><text x="16" y="20.5" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="9" fill="#fff">FREE</text>'),
  '⎋': S('<rect x="3" y="6" width="26" height="20" rx="4" fill="#eef2f7" stroke="#8a96a8" stroke-width="2"/><text x="16" y="20.5" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="11" fill="#39414d">esc</text>'),
  '🧠': S('<path d="M16 5c-3-3-9-1-9 4-3 1-4 5-2 7-1 3 1 6 4 6 1 3 5 4 7 1 2 3 6 2 7-1 3 0 5-3 4-6 2-2 1-6-2-7 0-5-6-7-9-4z" fill="#f4a5c0"/><path d="M16 6v19M10 12c2 0 3 1 3 3M22 12c-2 0-3 1-3 3M10 20c2 0 3-1 3-2M22 20c-2 0-3-1-3-2" fill="none" stroke="#d77a9e" stroke-width="1.6" stroke-linecap="round"/>'),
  '⏢': S('<path d="M2 24l5-16h18l5 16z" fill="#d6dbe3" stroke="#8a96a8" stroke-width="2" stroke-linejoin="round"/>'),
  '🧹': S('<path d="M24 2l-9 15" stroke="#a8744a" stroke-width="3" stroke-linecap="round"/><path d="M9 17l9-3 6 4-5 12H7z" fill="#f2c94c" stroke="#b89000" stroke-width="1.6" stroke-linejoin="round"/><path d="M11 21l-2 8M15 19l-1 10M19 20l1 9" stroke="#b89000" stroke-width="1.4"/>'),
  '🧴': S('<rect x="12" y="2" width="8" height="5" rx="1.5" fill="#3d7bd4"/><rect x="14.5" y="6" width="3" height="3" fill="#5b6675"/><rect x="8" y="9" width="16" height="21" rx="4" fill="#f4a5c0"/><rect x="11" y="15" width="10" height="9" rx="1.5" fill="#fff"/><path d="M13 18.5h6M13 21h4" stroke="#d77a9e" stroke-width="1.4" stroke-linecap="round"/>'),
  '🪤': S('<rect x="3" y="14" width="26" height="14" rx="2" fill="#c38a54" stroke="#8a5a2a" stroke-width="1.6"/><path d="M6 14V8a3 3 0 0 1 6 0v6" fill="none" stroke="#6b7482" stroke-width="2.2"/><path d="M26 14c0-6-4-9-10-9" fill="none" stroke="#6b7482" stroke-width="2.2" stroke-linecap="round"/><path d="M15 25l4-6 4 6z" fill="#f2c94c"/>'),
  '🧾': S('<path d="M7 3h18v26l-3-2-3 2-3-2-3 2-3-2-3 2z" fill="#fff" stroke="#8a96a8" stroke-width="1.8" stroke-linejoin="round"/><path d="M11 9h10M11 13h10M11 17h6" stroke="#8a96a8" stroke-width="1.8" stroke-linecap="round"/><path d="M11 22h10" stroke="#3d7bd4" stroke-width="2" stroke-linecap="round"/>'),
  '🩺': S('<path d="M8 3v8a6 6 0 0 0 12 0V3" fill="none" stroke="#5b6675" stroke-width="2.4" stroke-linecap="round"/><path d="M14 17v4a6 6 0 0 0 12 0v-3" fill="none" stroke="#5b6675" stroke-width="2.4" stroke-linecap="round"/><circle cx="26" cy="15" r="3.2" fill="#3d7bd4"/>'),
  '🦺': S('<path d="M10 3l6 6 6-6 6 5-3 6v15H7V14L4 8z" fill="#f28a1c"/><path d="M12 14v15M20 14v15" stroke="#fff3a8" stroke-width="3"/><path d="M16 9v20" stroke="#c96a0a" stroke-width="1.5"/>'),
  '🪑': S('<path d="M9 3h14l1 14H8z" fill="#c38a54" stroke="#8a5a2a" stroke-width="1.6" stroke-linejoin="round"/><rect x="5" y="16" width="22" height="5" rx="1.5" fill="#d9a56a" stroke="#8a5a2a" stroke-width="1.6"/><path d="M8 21l-2 9M24 21l2 9M12 21v8M20 21v8" stroke="#8a5a2a" stroke-width="2.2" stroke-linecap="round"/>'),
  '🦶': S('<path d="M10 3c4-1 7 2 7 7v9c3 0 6 2 7 5 1 3-1 5-3 5H10c-3 0-5-3-4-7z" fill="#f2c28b" stroke="#c98f52" stroke-width="1.4" stroke-linejoin="round"/><g fill="#f2c28b" stroke="#c98f52" stroke-width="1.2"><circle cx="20" cy="9" r="2"/><circle cx="24" cy="12" r="1.8"/><circle cx="26.5" cy="16" r="1.6"/></g>'),
  '🇹🇷': S('<rect x="2" y="6" width="28" height="20" rx="2.5" fill="#e30a17"/><circle cx="13" cy="16" r="5.2" fill="#fff"/><circle cx="14.6" cy="16" r="4.2" fill="#e30a17"/><path d="M19.4 16l3.4-1.1-2.1 2.9v-3.6l2.1 2.9z" fill="#fff"/>'),
  '🏥': S('<rect x="4" y="7" width="24" height="22" rx="2" fill="#f1f4f8" stroke="#8a96a8" stroke-width="1.8"/><rect x="13" y="3" width="6" height="5" fill="#8a96a8"/><path d="M14 12h4v3h3v4h-3v3h-4v-3h-3v-4h3z" fill="#e0342c"/><rect x="13" y="24" width="6" height="5" fill="#8a96a8"/>'),
  '📹': S('<rect x="2" y="9" width="19" height="15" rx="3" fill="#3d4654"/><path d="M22 14l8-4v12l-8-4z" fill="#3d4654"/><circle cx="8" cy="14" r="2" fill="#e0342c"/>'),
  '💳': S('<rect x="2" y="6" width="28" height="20" rx="3" fill="#3d7bd4"/><rect x="2" y="11" width="28" height="4" fill="#1d3f78"/><rect x="5" y="19" width="9" height="3" rx="1" fill="#cfe3fb"/><rect x="21" y="19" width="6" height="3" rx="1" fill="#f2c94c"/>'),
  '🔣': S('<rect x="3" y="3" width="26" height="26" rx="4" fill="#3d7bd4"/><text x="16" y="14" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="9" fill="#fff">&amp; %</text><text x="16" y="25" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="9" fill="#fff">+ #</text>'),
  '✍': S('<path d="M22 3l7 7L12 27l-8 2 2-8z" fill="#f2c94c" stroke="#b89000" stroke-width="1.6" stroke-linejoin="round"/><path d="M22 3l7 7-3 3-7-7z" fill="#e0678a"/><path d="M6 21l5 5" stroke="#b89000" stroke-width="1.4"/><path d="M4 29l2-8 5 5z" fill="#f2c28b"/>'),
  '🗜': S('<path d="M7 3h10v6H7z" fill="#5b6675"/><path d="M24 3v7h-4v8a8 8 0 0 1-8 8H8v-5h4a3 3 0 0 0 3-3V3z" fill="#7a8494"/><rect x="3" y="26" width="18" height="4" rx="1" fill="#5b6675"/><circle cx="24.5" cy="20" r="4" fill="#d93b3b"/>'),
  '👥': S(person(11, '#3d7bd4').replace(/<circle/, '<circle') + '<g opacity="0.85">' + person(22, '#7a4cf0') + '</g>').replace('viewBox="0 0 32 32"', 'viewBox="0 2 32 32"'),
  '☁': S('<path d="M9 25a6 6 0 0 1-.7-12A8 8 0 0 1 23.5 11 7 7 0 0 1 24 25z" fill="#9fd0f5" stroke="#5b9bd5" stroke-width="1.6" stroke-linejoin="round"/>'),
  '💰': S('<path d="M11 3h10l-3 6h-4z" fill="#a8744a"/><path d="M13 9h6c6 4 9 9 9 14 0 4-3 6-6 6H10c-3 0-6-2-6-6 0-5 3-10 9-14z" fill="#c9954f"/><rect x="11" y="8" width="10" height="2.6" rx="1" fill="#8a5a2a"/><text x="16" y="25" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="12" fill="#fff3c4">₺</text>'),
  '🦁': S('<circle cx="16" cy="16" r="14" fill="#c9742a"/><circle cx="16" cy="17" r="9" fill="#f4b63c"/><circle cx="12.5" cy="15" r="1.5" fill="#222"/><circle cx="19.5" cy="15" r="1.5" fill="#222"/><ellipse cx="16" cy="20" rx="3.4" ry="2.6" fill="#fff3d6"/><path d="M14.5 18.4h3l-1.5 1.8z" fill="#222"/>'),
  '🦆': S('<path d="M5 18c0-5 4-7 8-7 0-5 4-8 8-6s3 7 1 9c5 0 7 4 7 8 0 4-4 7-12 7S5 24 5 18z" fill="#f6d33a"/><path d="M22 8l8 1-8 3z" fill="#f28a1c"/><circle cx="18" cy="8" r="1.3" fill="#222"/><path d="M12 20c3 3 8 3 11 0" fill="none" stroke="#d6a912" stroke-width="1.6" stroke-linecap="round"/>'),
  '🎞': S('<rect x="3" y="5" width="26" height="22" rx="2" fill="#39414d"/><g fill="#fff"><rect x="5" y="7" width="3" height="3" rx="0.6"/><rect x="5" y="14.5" width="3" height="3" rx="0.6"/><rect x="5" y="22" width="3" height="3" rx="0.6"/><rect x="24" y="7" width="3" height="3" rx="0.6"/><rect x="24" y="14.5" width="3" height="3" rx="0.6"/><rect x="24" y="22" width="3" height="3" rx="0.6"/></g><rect x="10" y="8" width="12" height="16" fill="#8fd0f7"/>'),
  '🐴': S('<path d="M10 3l3 4c5-1 11 2 12 8l-2 12h-6l-1-7c-3 0-7-2-9-6-2-4-1-9 3-11z" fill="#a8683a"/><path d="M13 7c-2 5 0 10 4 12" fill="none" stroke="#5a3a22" stroke-width="3" stroke-linecap="round"/><circle cx="11" cy="12" r="1.4" fill="#222"/><ellipse cx="9" cy="17" rx="1" ry="1.4" fill="#5a3a22"/>'),
  '🐆': S('<path d="M3 20c0-8 6-14 13-14s13 6 13 14c0 6-5 8-13 8S3 26 3 20z" fill="#f4c24a"/><g fill="#5a3a22"><circle cx="9" cy="14" r="1.8"/><circle cx="22" cy="12" r="1.8"/><circle cx="15" cy="10" r="1.4"/><circle cx="25" cy="19" r="1.7"/><circle cx="7" cy="21" r="1.6"/></g><circle cx="12" cy="17" r="1.5" fill="#222"/><circle cx="20" cy="17" r="1.5" fill="#222"/><path d="M14 22h4l-2 2.4z" fill="#222"/>'),
  '💸': S('<rect x="6" y="9" width="20" height="14" rx="2" fill="#4ab36b"/><circle cx="16" cy="16" r="4" fill="#c9efd5"/><path d="M6 11C3 8 1 11 3 14M26 11c3-3 5 0 3 3" fill="none" stroke="#8fd0f7" stroke-width="2.6" stroke-linecap="round"/><path d="M6 21C3 18 1 21 3 24M26 21c3-3 5 0 3 3" fill="none" stroke="#8fd0f7" stroke-width="2.6" stroke-linecap="round"/>'),
};


// ---- Sonradan eklenenler: gömülü yazı tiplerimizde (src/fonts) olmayan simgeler ----
// Tek renkli olanlar (currentColor) yazının rengini alır; renkli olanlar sabit renkle çizilir.
const MS = (body) => S(`<g fill="currentColor">${body}</g>`);
const LS = (body, w = 2.4) => S(`<g fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${body}</g>`);
const face = (fill, extra = '') => `<circle cx="16" cy="16" r="13" fill="${fill}"/>${extra}`;

Object.assign(ICONS, {
  // --- Düğme ve arayüz simgeleri ---
  '🔘': S('<circle cx="16" cy="16" r="12.5" fill="#eef2f7" stroke="#8a96a8" stroke-width="2"/><circle cx="16" cy="16" r="6" fill="#3d7bd4"/>'),
  '⋯': MS('<circle cx="6" cy="16" r="2.4"/><circle cx="16" cy="16" r="2.4"/><circle cx="26" cy="16" r="2.4"/>'),
  '⋮': MS('<circle cx="16" cy="6" r="2.4"/><circle cx="16" cy="16" r="2.4"/><circle cx="16" cy="26" r="2.4"/>'),
  '⛶': LS('<path d="M5 12V5h7M20 5h7v7M27 20v7h-7M12 27H5v-7"/>'),
  '⬚': LS('<rect x="5" y="5" width="22" height="22" rx="1" stroke-dasharray="4.2 3.4"/>'),
  '⬟': LS('<path d="M16 4l11 8-4.2 13H9.2L5 12z"/>', 2.2),
  '⤡': LS('<path d="M6 6l20 20M6 6v8M6 6h8M26 26v-8M26 26h-8"/>', 2.2),
  '⤢': LS('<path d="M26 6L6 26M26 6v8M26 6h-8M6 26v-8M6 26h8"/>', 2.2),
  '⤓': LS('<path d="M16 4v16M9 14l7 7 7-7M6 27h20"/>'),
  '↲': LS('<path d="M26 6v10H8M14 10l-6 6 6 6"/>'),
  '⇤': LS('<path d="M27 16H9M15 9l-7 7 7 7M5 6v20"/>'),
  '↹': LS('<path d="M4 16h14M13 10l6 6-6 6M28 6v20"/>', 2.2),
  '⟷': LS('<path d="M3 16h26M9 10l-6 6 6 6M23 10l6 6-6 6"/>'),
  '⊕': LS('<circle cx="16" cy="16" r="11.5"/><path d="M16 9.5v13M9.5 16h13"/>', 2.2),
  '⊘': LS('<circle cx="16" cy="16" r="11.5"/><path d="M8 24L24 8"/>', 2.2),
  '✎': LS('<path d="M5 27l1.6-6.4L21 6.2a2.8 2.8 0 0 1 4 0l.8.8a2.8 2.8 0 0 1 0 4L11.4 25.4z"/><path d="M19 8.5l4.5 4.5"/>', 2.2),
  '✦': MS('<path d="M16 3c1 7 3.2 11.5 13 13-9.8 1.5-12 6-13 13-1-7-3.2-11.5-13-13C12.8 14.5 15 10 16 3z"/>'),
  '▴': MS('<path d="M16 9l9 14H7z"/>'),
  '≣': LS('<path d="M5 7h22M5 13h22M5 19h22M5 25h22"/>', 2.2),
  '✚': MS('<path d="M13 4h6v9h9v6h-9v9h-6v-9H4v-6h9z"/>'),
  '📈': S('<path d="M4 4v24h24" fill="none" stroke="#8a96a8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 22l6-7 5 4 8-11M21 8h6v6" fill="none" stroke="#2fa65a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'),
  '🥧': S('<circle cx="15" cy="17" r="12" fill="#3d7bd4"/><path d="M15 17V5a12 12 0 0 1 11.4 8.4z" fill="#f2b705"/><path d="M15 17l11.4-3.6A12 12 0 0 1 24 25z" fill="#d93b3b"/>'),
  '🪣': S('<path d="M5 15L15 5l10 10-10 10z" fill="#e6e9ee" stroke="#5b6675" stroke-width="2" stroke-linejoin="round"/><path d="M5.5 15.5L15 12l9.5 3.5L15 25z" fill="#3d7bd4"/><path d="M15 5C13 2 8 4 8 9" fill="none" stroke="#5b6675" stroke-width="2" stroke-linecap="round"/><path d="M27 20c2 3 3 5 3 6.5a3 3 0 0 1-6 0c0-1.5 1-3.5 3-6.5z" fill="#3d7bd4"/>'),
  '🔖': S('<path d="M8 3h16v26l-8-6-8 6z" fill="#e0342c" stroke="#a82019" stroke-width="1.6" stroke-linejoin="round"/>'),
  '⚑': S('<path d="M7 3v26" stroke="#5b6675" stroke-width="2.6" stroke-linecap="round"/><path d="M8 5h17l-4 6 4 6H8z" fill="#d93b3b"/>'),
  '📍': S('<path d="M16 29C9 20 6 15.5 6 11.5a10 10 0 0 1 20 0C26 15.5 23 20 16 29z" fill="#e0342c"/><circle cx="16" cy="11.5" r="3.8" fill="#fff"/>'),
  '🕘': S('<circle cx="16" cy="16" r="13" fill="#fff" stroke="#5b6675" stroke-width="2.4"/><path d="M16 8v8H9.5" fill="none" stroke="#3d7bd4" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>'),
  '💤': S('<path d="M5 6h9l-9 10h9M17 15h7l-7 8h7M24 3h4.5L24 8.5h4.5" fill="none" stroke="#3d7bd4" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>'),
  '📏': S('<rect x="2" y="10" width="28" height="12" rx="2" fill="#f2c94c" stroke="#b89000" stroke-width="1.6"/><path d="M7 10v6M12 10v4M17 10v6M22 10v4M27 10v6" stroke="#7a5a00" stroke-width="1.8"/>'),

  // --- Renkli kareler, kalp ---
  '🟥': S('<rect x="4" y="4" width="24" height="24" rx="4" fill="#e0342c"/>'),
  '🟨': S('<rect x="4" y="4" width="24" height="24" rx="4" fill="#f2c94c"/>'),
  '🩷': S('<path d="M16 28C6 21 3 15.5 3 11a7 7 0 0 1 13-3.5A7 7 0 0 1 29 11c0 4.5-3 10-13 17z" fill="#f48fb1"/>'),
  '🔷': S('<path d="M16 2l14 14-14 14L2 16z" fill="#3d7bd4"/><path d="M16 2l14 14H2z" fill="#6fa8ee"/>'),

  // --- Yerler, ulaşım ---
  '🚌': S('<rect x="3" y="5" width="26" height="20" rx="4" fill="#3d7bd4"/><rect x="6" y="8" width="8" height="7" rx="1.4" fill="#cfe9fb"/><rect x="16" y="8" width="10" height="7" rx="1.4" fill="#cfe9fb"/><rect x="3" y="18" width="26" height="2.4" fill="#f2c94c"/><circle cx="9" cy="26" r="3" fill="#2b3340"/><circle cx="23" cy="26" r="3" fill="#2b3340"/>'),
  '🛣': S('<path d="M12 3h8l9 26H3z" fill="#5b6675"/><path d="M16 5v4M16 12v5M16 20v7" stroke="#fff" stroke-width="2" stroke-linecap="round"/>'),
  '🏨': S('<rect x="6" y="3" width="20" height="26" rx="2" fill="#9bbbe0" stroke="#5b7fa8" stroke-width="1.6"/><g fill="#fff"><rect x="9.5" y="7" width="3.6" height="3.6"/><rect x="14.2" y="7" width="3.6" height="3.6"/><rect x="18.9" y="7" width="3.6" height="3.6"/><rect x="9.5" y="13" width="3.6" height="3.6"/><rect x="14.2" y="13" width="3.6" height="3.6"/><rect x="18.9" y="13" width="3.6" height="3.6"/></g><rect x="13" y="21" width="6" height="8" fill="#5b7fa8"/>'),
  '🏢': S('<rect x="7" y="3" width="18" height="26" rx="1.6" fill="#8fa3bd" stroke="#5b6f8a" stroke-width="1.6"/><g fill="#e8f3fb"><rect x="10" y="7" width="3.2" height="3.2"/><rect x="14.4" y="7" width="3.2" height="3.2"/><rect x="18.8" y="7" width="3.2" height="3.2"/><rect x="10" y="13" width="3.2" height="3.2"/><rect x="14.4" y="13" width="3.2" height="3.2"/><rect x="18.8" y="13" width="3.2" height="3.2"/><rect x="10" y="19" width="3.2" height="3.2"/><rect x="18.8" y="19" width="3.2" height="3.2"/></g><rect x="14" y="23" width="4.4" height="6" fill="#5b6f8a"/>'),
  '🏚': S('<path d="M3 16L16 4l13 12h-3v13H6V16z" fill="#b8a38a" stroke="#7a6a58" stroke-width="1.6" stroke-linejoin="round"/><path d="M13 29V20h6v9" fill="#7a6a58"/><path d="M8 11l4 4M22 8l-3 4" stroke="#7a6a58" stroke-width="1.6"/>'),
  '🏜': S('<circle cx="22" cy="9" r="5" fill="#f2b705"/><path d="M2 27c5-9 9-9 13-4 4-6 9-7 15 1v4H2z" fill="#e8b45a"/><path d="M2 29c5-4 9-4 13-1 5-3 9-3 15 0" fill="none" stroke="#c98f3a" stroke-width="1.6"/>'),
  '💒': S('<path d="M3 29V15l8-6 8 6v14z" fill="#f4c5d6" stroke="#c97a9a" stroke-width="1.6" stroke-linejoin="round"/><path d="M11 3v10M7.5 6.5h7" stroke="#c97a9a" stroke-width="2.4" stroke-linecap="round"/><path d="M8 29v-8h6v8" fill="#c97a9a"/><rect x="21" y="14" width="8" height="15" fill="#e8a8c0"/>'),
  '🛰': S('<g transform="rotate(-35 16 16)"><rect x="12" y="11" width="8" height="10" rx="2" fill="#9aa6b4" stroke="#5b6675" stroke-width="1.6"/><rect x="1" y="12" width="9" height="8" fill="#3d7bd4" stroke="#1d3f78" stroke-width="1.2"/><rect x="22" y="12" width="9" height="8" fill="#3d7bd4" stroke="#1d3f78" stroke-width="1.2"/><path d="M16 11V7" stroke="#5b6675" stroke-width="1.6"/><circle cx="16" cy="6" r="1.6" fill="#d93b3b"/></g>'),

  // --- İnsanlar, yüzler ---
  '🧍': S('<circle cx="16" cy="7" r="4.2" fill="#f28a1c"/><path d="M10 28V15a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v13h-4.5v-8h-3v8z" fill="#f28a1c"/>'),
  '🧑': S('<circle cx="16" cy="10.5" r="5.5" fill="#f2c28b"/><path d="M10.5 9.5c1-5.5 10-5.5 11 0-3-1.5-8-1.5-11 0z" fill="#5a3a22"/><path d="M5 29a11 11 0 0 1 22 0z" fill="#3d7bd4"/>'),
  '🧒': S('<circle cx="16" cy="13" r="7" fill="#f2c28b"/><path d="M9 12c0-8 14-8 14 0-3-3-11-3-14 0z" fill="#5a3a22"/><circle cx="13.3" cy="14" r="1" fill="#222"/><circle cx="18.7" cy="14" r="1" fill="#222"/><path d="M13.5 17.5c1.5 1.4 3.5 1.4 5 0" fill="none" stroke="#a8503a" stroke-width="1.2" stroke-linecap="round"/><path d="M7 30a9 9 0 0 1 18 0z" fill="#f4a5c0"/>'),
  '🧓': S('<circle cx="16" cy="13" r="7" fill="#f2c28b"/><path d="M9 12c0-8 14-8 14 0-3-2-11-2-14 0z" fill="#d8dde4"/><circle cx="13.3" cy="14" r="1" fill="#222"/><circle cx="18.7" cy="14" r="1" fill="#222"/><path d="M13 17.5c1.5 1 4.5 1 6 0" fill="none" stroke="#a8503a" stroke-width="1.2" stroke-linecap="round"/><path d="M7 30a9 9 0 0 1 18 0z" fill="#8a96a8"/>'),
  '👪': S(person(9, '#3d7bd4') + person(23, '#e0678a') + '<circle cx="16" cy="19" r="3" fill="#f2b705"/><path d="M11 31a5 5 0 0 1 10 0z" fill="#f2b705"/>'),
  '😴': S(face('#f2c94c', '<path d="M8.5 13.5c1.5 1.6 3.5 1.6 5 0M18.5 13.5c1.5 1.6 3.5 1.6 5 0" fill="none" stroke="#7a5a00" stroke-width="1.8" stroke-linecap="round"/><ellipse cx="16" cy="22" rx="3" ry="2.2" fill="#7a5a00"/>')),
  '🧘': S('<circle cx="16" cy="6.5" r="3.8" fill="#f2c28b"/><path d="M16 11c-4 0-6 3-6 7l-6 5 4 3 8-3 8 3 4-3-6-5c0-4-2-7-6-7z" fill="#3d7bd4"/>'),
  '👍': S('<path d="M3 14h6v14H3z" fill="#3d7bd4"/><path d="M11 14l5-10c2.5 0 4 1.6 3.6 4L18.4 13H27a2.6 2.6 0 0 1 2.5 3.2l-2.200 9A3.4 3.4 0 0 1 24 28H11z" fill="#f2c28b" stroke="#c98f52" stroke-width="1.2" stroke-linejoin="round"/>'),

  // --- Eşyalar, araçlar ---
  '🛍': S('<path d="M5 11h16l1.5 18h-19z" fill="#f4a5c0" stroke="#c9648a" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 14V8a4 4 0 0 1 8 0v6" fill="none" stroke="#c9648a" stroke-width="1.8"/><path d="M13 14h13l2 15H14.5z" fill="#8fd0f7" stroke="#3d7bd4" stroke-width="1.6" stroke-linejoin="round"/><path d="M17 17v-5a3.5 3.5 0 0 1 7 0v5" fill="none" stroke="#3d7bd4" stroke-width="1.6"/>'),
  '🎙': S('<rect x="11" y="3" width="10" height="16" rx="5" fill="#5b6675"/><path d="M11 9h10M11 13h10" stroke="#9aa6b4" stroke-width="1.4"/><path d="M7 15a9 9 0 0 0 18 0M16 24v4M10 28.5h12" fill="none" stroke="#5b6675" stroke-width="2.2" stroke-linecap="round"/>'),
  '🎒': S('<path d="M11 6a5 5 0 0 1 10 0" fill="none" stroke="#a82019" stroke-width="2"/><rect x="6" y="7" width="20" height="22" rx="7" fill="#d93b3b"/><rect x="10" y="17" width="12" height="8" rx="2.4" fill="#a82019"/><path d="M10 21h12" stroke="#f2c94c" stroke-width="1.6"/>'),
  '🧺': S('<path d="M3 13h26l-3 15H6z" fill="#d9a56a" stroke="#8a5a2a" stroke-width="1.6" stroke-linejoin="round"/><path d="M8 13a8 8 0 0 1 16 0" fill="none" stroke="#8a5a2a" stroke-width="2.2"/><path d="M9 17l1.5 8M16 17v8M23 17l-1.5 8" stroke="#8a5a2a" stroke-width="1.4"/>'),
  '🧱': S('<rect x="2" y="5" width="28" height="22" rx="1.6" fill="#d9774a"/><g stroke="#f4e3d6" stroke-width="2"><path d="M2 12.3h28M2 19.7h28M11 5v7M21 12.3v7.4M11 19.7V27M21 5v7"/></g>'),
  '🧪': S('<path d="M12 3h8M13 3v9L5 26a3 3 0 0 0 2.7 4.2h16.6A3 3 0 0 0 27 26L19 12V3" fill="#eaf6fd" stroke="#5b6675" stroke-width="2" stroke-linejoin="round"/><path d="M8.5 21h15l3 5.5a2 2 0 0 1-1.8 3H7.3a2 2 0 0 1-1.8-3z" fill="#2fb566"/>'),
  '🎣': S('<path d="M26 3L9 23" stroke="#a8744a" stroke-width="2.6" stroke-linecap="round"/><path d="M26 3v16a4 4 0 1 1-4-4" fill="none" stroke="#5b6675" stroke-width="1.6" stroke-linecap="round"/><path d="M3 24l8 4-3 3z" fill="#3d7bd4"/>'),
  '☎': S('<path d="M5 12c0-4 6-7 11-7s11 3 11 7v2h-6v-3c-3-1.5-7-1.5-10 0v3H5z" fill="#2b3340"/><rect x="4" y="16" width="24" height="12" rx="3" fill="#39414d"/><circle cx="16" cy="22" r="4.2" fill="#eef2f7"/><circle cx="16" cy="22" r="1.4" fill="#39414d"/>'),
  '📻': S('<rect x="3" y="10" width="26" height="18" rx="3" fill="#5b6675"/><path d="M6 10L24 3" stroke="#2b3340" stroke-width="1.8" stroke-linecap="round"/><circle cx="21" cy="19" r="5" fill="#eef2f7"/><circle cx="21" cy="19" r="1.8" fill="#5b6675"/><path d="M6 15h8M6 19h8M6 23h8" stroke="#cfd5de" stroke-width="1.6" stroke-linecap="round"/>'),
  '📟': S('<rect x="3" y="7" width="26" height="18" rx="3" fill="#39414d"/><rect x="6" y="10" width="20" height="7" rx="1" fill="#b6e3a8"/><path d="M8 13.5h8" stroke="#2f7a22" stroke-width="1.6" stroke-linecap="round"/><circle cx="9" cy="21" r="1.4" fill="#cfd5de"/><circle cx="14" cy="21" r="1.4" fill="#cfd5de"/>'),
  '🕶': S('<path d="M2 12h28M3 12c0 9 6 11 8 11s5-2 5-7c0 5 3 7 5 7s8-2 8-11" fill="#2b3340" stroke="#2b3340" stroke-width="2" stroke-linejoin="round"/><path d="M5 14h6M19 14h6" stroke="#6b7482" stroke-width="1.4" stroke-linecap="round"/>'),
  '🗣': S('<circle cx="11" cy="12" r="7" fill="#f2c28b"/><path d="M5 30a9 9 0 0 1 12-8" fill="none" stroke="#3d7bd4" stroke-width="4" stroke-linecap="round"/><path d="M21 8c3 2 3 6 0 8M25 5c5 4 5 11 0 15" fill="none" stroke="#3d7bd4" stroke-width="2.2" stroke-linecap="round"/>'),
  '📚': S('<rect x="3" y="5" width="7" height="22" rx="1.2" fill="#d93b3b"/><rect x="11" y="3" width="7" height="24" rx="1.2" fill="#3d7bd4"/><rect x="19" y="7" width="7" height="20" rx="1.2" fill="#2fa65a" transform="rotate(8 22 17)"/><path d="M3 29h26" stroke="#5a3a22" stroke-width="2" stroke-linecap="round"/>'),
  '🖊': S('<path d="M23 3l6 6-17 17-8 2 2-8z" fill="#3d7bd4" stroke="#1d3f78" stroke-width="1.4" stroke-linejoin="round"/><path d="M23 3l6 6-3 3-6-6z" fill="#cfd5de"/><path d="M4 28l2-8 6 6z" fill="#f2c28b"/><circle cx="5" cy="27" r="1.2" fill="#222"/>'),
  '📽': S('<rect x="3" y="12" width="20" height="14" rx="2.4" fill="#5b6675"/><circle cx="9" cy="9" r="4.5" fill="#39414d"/><circle cx="19" cy="9" r="4.5" fill="#39414d"/><path d="M23 16l7-3v11l-7-3z" fill="#9aa6b4"/><circle cx="9" cy="19" r="2.4" fill="#cfd5de"/>'),
  '📜': S('<path d="M9 4h17a3 3 0 0 1 3 3v2h-5v15a4 4 0 0 1-4 4H7a4 4 0 0 0 4-4V7a3 3 0 0 0-2-3z" fill="#f6e3c4" stroke="#a8744a" stroke-width="1.6" stroke-linejoin="round"/><path d="M14 11h7M14 15h7M14 19h5" stroke="#a8744a" stroke-width="1.4" stroke-linecap="round"/>'),
  '🪪': S('<rect x="2" y="6" width="28" height="20" rx="3" fill="#eaf2fb" stroke="#4a73b8" stroke-width="1.8"/><circle cx="10" cy="13.5" r="3" fill="#8aa3c4"/><path d="M5 22a5 4 0 0 1 10 0z" fill="#8aa3c4"/><path d="M19 12h7M19 16h7M19 20h5" stroke="#4a73b8" stroke-width="1.8" stroke-linecap="round"/>'),
  '🧰': S('<path d="M12 9V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3" fill="none" stroke="#7a1f1a" stroke-width="2.2"/><rect x="3" y="9" width="26" height="18" rx="3" fill="#d93b3b"/><rect x="3" y="15" width="26" height="2.6" fill="#a82019"/><rect x="13.5" y="14" width="5" height="5.5" rx="1" fill="#f2c94c"/>'),
  '🪴': S('<path d="M8 19h16l-2 10H10z" fill="#c9742a"/><rect x="7" y="16.5" width="18" height="4" rx="1.4" fill="#d9894a"/><path d="M16 17C16 9 11 6 6 7c0 6 4 9 10 10zM16 17c0-7 4-11 10-11 0 6-4 10-10 11z" fill="#2fa65a"/>'),
  '🅰': S('<rect x="3" y="3" width="26" height="26" rx="5" fill="#e0342c"/><text x="16" y="23.5" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="20" fill="#fff">A</text>'),
  '💯': S('<text x="16" y="21" text-anchor="middle" font-family="Arial, sans-serif" font-weight="800" font-size="16" fill="#e0342c">100</text><path d="M5 25.5h22M8 28.5h16" stroke="#e0342c" stroke-width="2" stroke-linecap="round"/>'),
  '📵': S('<rect x="9" y="3" width="14" height="26" rx="3" fill="#39414d"/><rect x="11" y="7" width="10" height="15" fill="#8fd0f7"/><circle cx="16" cy="16" r="13" fill="none" stroke="#e0342c" stroke-width="3"/><path d="M7 25L25 7" stroke="#e0342c" stroke-width="3"/>'),
  '📨': S('<rect x="3" y="9" width="26" height="19" rx="3" fill="#fff" stroke="#4a73b8" stroke-width="2"/><path d="M4 11l12 9 12-9" fill="none" stroke="#4a73b8" stroke-width="2" stroke-linejoin="round"/><path d="M16 2v10M12 8.5l4 4 4-4" fill="none" stroke="#2fa65a" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>'),
  '🐦': S('<path d="M3 17c0-6 5-10 11-10 4 0 6 2 7 4l8 3-8 1c0 6-5 11-11 11-4 0-7-3-7-9z" fill="#4ab0e8"/><path d="M14 18c2 4 7 4 9 0" fill="none" stroke="#2b82b5" stroke-width="1.6" stroke-linecap="round"/><circle cx="19" cy="11.5" r="1.4" fill="#222"/>'),
  '🌫': S('<path d="M9 14a6 6 0 0 1 .7-11.9A8 8 0 0 1 24 7a6 6 0 0 1 0 7z" fill="#cfd5de"/><path d="M3 19h26M6 24h20M10 29h14" stroke="#9aa6b4" stroke-width="2.6" stroke-linecap="round"/>'),
});

// --- Benzetim sitelerinde (harita, ilan, sosyal medya, mağaza) geçenler ---
const house = (wall, roof, x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M4 28V14l12-9 12 9v14z" fill="${wall}"/><path d="M2 15L16 3l14 12" fill="none" stroke="${roof}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><rect x="13" y="19" width="6" height="9" fill="${roof}"/></g>`;
Object.assign(ICONS, {
  '🏘': S(house('#f4d9b8', '#c9742a', -4, 8, 0.65) + house('#cfe3fb', '#3d7bd4', 12, 9, 0.65) + house('#f4c5d6', '#c97a9a', 4, 1, 0.75)),
  '🏙': S('<rect x="3" y="12" width="9" height="17" fill="#8fa3bd"/><rect x="12" y="4" width="10" height="25" fill="#5b6f8a"/><rect x="22" y="14" width="8" height="15" fill="#8fa3bd"/><g fill="#e8f3fb"><rect x="14.5" y="8" width="2" height="2"/><rect x="18" y="8" width="2" height="2"/><rect x="14.5" y="13" width="2" height="2"/><rect x="18" y="13" width="2" height="2"/><rect x="14.5" y="18" width="2" height="2"/><rect x="18" y="18" width="2" height="2"/><rect x="5.5" y="16" width="2" height="2"/><rect x="24.5" y="18" width="2" height="2"/></g>'),
  '🌇': S('<rect x="0" y="0" width="32" height="32" rx="4" fill="#ffb74d"/><circle cx="16" cy="19" r="7" fill="#ef6c3a"/><path d="M0 22h32v10H0z" fill="#5b6f8a"/><rect x="3" y="14" width="6" height="14" fill="#39414d"/><rect x="22" y="10" width="7" height="18" fill="#39414d"/><rect x="11" y="18" width="7" height="10" fill="#4a566a"/>'),
  '🏡': S(house('#f2e0b5', '#d93b3b', 0, 0, 1) + '<circle cx="26" cy="26" r="4" fill="#2fa65a"/><rect x="25.200" y="27" width="1.600" height="3" fill="#5a3a22"/>'),
  '🛁': S('<path d="M3 15h26v4a8 8 0 0 1-8 8H11a8 8 0 0 1-8-8z" fill="#eef2f7" stroke="#8a96a8" stroke-width="1.8" stroke-linejoin="round"/><path d="M7 15V8a3 3 0 0 1 6 0" fill="none" stroke="#8a96a8" stroke-width="2" stroke-linecap="round"/><path d="M8 28l-1.500 2M24 28l1.500 2" stroke="#8a96a8" stroke-width="2" stroke-linecap="round"/>'),
  '👴': S('<circle cx="16" cy="14" r="9" fill="#f2c28b"/><path d="M7 14c0-10 18-10 18 0-4-3-14-3-18 0z" fill="#e6e9ee"/><path d="M10 19c0 7 12 7 12 0-4 2-8 2-12 0z" fill="#e6e9ee"/><circle cx="12.600" cy="14" r="1.100" fill="#222"/><circle cx="19.400" cy="14" r="1.100" fill="#222"/><path d="M14 20.500c1.200.8 2.800.8 4 0" fill="none" stroke="#a8503a" stroke-width="1.200" stroke-linecap="round"/>'),
  '👵': S('<circle cx="16" cy="14" r="9" fill="#f2c28b"/><path d="M6.500 16c-2-12 17-15 19 0-2-5-6-7-9.500-7S8.500 11 6.500 16z" fill="#d8dde4"/><circle cx="12.600" cy="14" r="1.100" fill="#222"/><circle cx="19.400" cy="14" r="1.100" fill="#222"/><path d="M13 19c1.500 1.400 4.500 1.400 6 0" fill="none" stroke="#a8503a" stroke-width="1.200" stroke-linecap="round"/><circle cx="16" cy="6" r="3.200" fill="#d8dde4"/>'),
  '🍅': S('<circle cx="16" cy="18" r="11" fill="#e0342c"/><path d="M16 8l-4 3 4 1 4-1z" fill="#2fa65a"/><path d="M16 5v5" stroke="#2fa65a" stroke-width="2" stroke-linecap="round"/><ellipse cx="12" cy="14.500" rx="2.200" ry="1.400" fill="#fff" opacity=".4"/>'),
  '🙏': S('<path d="M16 3c-3 4-7 8-7 14 0 5 3 9 7 12 4-3 7-7 7-12 0-6-4-10-7-14z" fill="#f2c28b" stroke="#c98f52" stroke-width="1.400" stroke-linejoin="round"/><path d="M16 8v21" stroke="#c98f52" stroke-width="1.400"/>'),
  '🛑': S('<path d="M10 3h12l7 7v12l-7 7H10l-7-7V10z" fill="#e0342c"/><path d="M10 3h12l7 7v12l-7 7H10l-7-7V10z" fill="none" stroke="#fff" stroke-width="1.600"/><rect x="8" y="14" width="16" height="4" rx="1" fill="#fff"/>'),
  '⛔': S('<circle cx="16" cy="16" r="13" fill="#e0342c"/><rect x="7" y="13.500" width="18" height="5" rx="1" fill="#fff"/>'),
  '📒': S('<rect x="6" y="3" width="20" height="26" rx="2.400" fill="#f2c94c" stroke="#b89000" stroke-width="1.600"/><path d="M6 8h-2M6 14h-2M6 20h-2M6 26h-2" stroke="#b89000" stroke-width="2" stroke-linecap="round"/><path d="M12 10h10M12 15h10M12 20h6" stroke="#7a5a00" stroke-width="1.600" stroke-linecap="round"/>'),
  '🚚': S('<rect x="2" y="8" width="16" height="14" rx="2" fill="#3d7bd4"/><path d="M18 12h7l5 5v5H18z" fill="#f2c94c"/><path d="M21 14.500h3.500l2.500 2.500h-6z" fill="#cfe9fb"/><circle cx="9" cy="24" r="3.200" fill="#2b3340"/><circle cx="24" cy="24" r="3.200" fill="#2b3340"/>'),
  '🏬': S('<rect x="5" y="4" width="22" height="25" rx="1.600" fill="#d9a56a" stroke="#8a5a2a" stroke-width="1.600"/><path d="M5 11h22" stroke="#8a5a2a" stroke-width="1.600"/><g fill="#fff"><rect x="9" y="14" width="4" height="4"/><rect x="14" y="14" width="4" height="4"/><rect x="19" y="14" width="4" height="4"/></g><rect x="13" y="21" width="6" height="8" fill="#8a5a2a"/>'),
  '🥖': S('<path d="M5 22L22 5c3-3 7 1 4 4L9 26c-3 3-7 0-4-4z" fill="#e8b45a" stroke="#a8744a" stroke-width="1.600" stroke-linejoin="round"/><path d="M12 13l4 4M16 9l4 4M8 17l4 4" stroke="#a8744a" stroke-width="1.600" stroke-linecap="round"/>'),
  '📮': S('<path d="M7 29V13a9 9 0 0 1 18 0v16z" fill="#e0342c"/><rect x="10" y="11" width="12" height="3" rx="1.200" fill="#7a1f1a"/><rect x="5" y="27" width="22" height="3" rx="1" fill="#a82019"/><rect x="12" y="17" width="8" height="5" fill="#fff"/>'),
  '🚑': S('<rect x="2" y="8" width="20" height="15" rx="2" fill="#fff" stroke="#8a96a8" stroke-width="1.600"/><path d="M22 12h5l3 5v6H22z" fill="#fff" stroke="#8a96a8" stroke-width="1.600" stroke-linejoin="round"/><path d="M10 11v7M6.500 14.500h7" stroke="#e0342c" stroke-width="2.600"/><circle cx="9" cy="24" r="3" fill="#2b3340"/><circle cx="24" cy="24" r="3" fill="#2b3340"/>'),
  '🅿': S('<rect x="3" y="3" width="26" height="26" rx="5" fill="#3d7bd4"/><text x="16" y="23.500" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="20" fill="#fff">P</text>'),
  '🚏': S('<path d="M10 29V4" stroke="#5b6675" stroke-width="2.600" stroke-linecap="round"/><rect x="10" y="4" width="17" height="11" rx="2" fill="#3d7bd4"/><path d="M14 10h9" stroke="#fff" stroke-width="2.200" stroke-linecap="round"/>'),
  '⚪': S('<circle cx="16" cy="16" r="11" fill="#eef2f7" stroke="#8a96a8" stroke-width="2"/>'),
  '🎻': S('<path d="M12 12c-4 0-6 3-5 6-3 2-3 8 2 10 4 1 6-1 8-1 3 0 5-2 4-6 0-2-1-3-1-5 0-3-2-4-5-4z" fill="#c9742a" stroke="#7a4018" stroke-width="1.600" stroke-linejoin="round"/><path d="M13 20h4M15 8l10-5" stroke="#5a3a22" stroke-width="2.200" stroke-linecap="round"/>'),
  '🗗': LS('<rect x="4" y="9" width="17" height="17" rx="1.500"/><path d="M10 9V6.500A1.500 1.500 0 0 1 11.500 5H26.500A1.500 1.500 0 0 1 28 6.500V21.500A1.500 1.500 0 0 1 26.500 23H21"/>', 2.2),
  '💙': S('<path d="M16 28C6 21 3 15.500 3 11a7 7 0 0 1 13-3.500A7 7 0 0 1 29 11c0 4.500-3 10-13 17z" fill="#3d7bd4"/>'),
  '🍳': S('<ellipse cx="13" cy="17" rx="11" ry="9" fill="#39414d"/><ellipse cx="13" cy="17" rx="8.500" ry="6.500" fill="#cfd5de"/><circle cx="13" cy="17" r="3.600" fill="#f2c94c"/><path d="M23 17l8 4" stroke="#39414d" stroke-width="3.600" stroke-linecap="round"/>'),
  '🫖': S('<path d="M7 15h16v5a8 8 0 0 1-8 8 8 8 0 0 1-8-8z" fill="#3d7bd4"/><path d="M23 17h2a3 3 0 0 1 0 6h-2.500M7 17L2 14" fill="none" stroke="#1d3f78" stroke-width="2.200" stroke-linecap="round"/><path d="M10 15a5 4 0 0 1 10 0" fill="#1d3f78"/><circle cx="15" cy="9.500" r="1.800" fill="#1d3f78"/>'),
  '🥤': S('<path d="M8 8h16l-2.500 21h-11z" fill="#e0342c"/><path d="M8 8h16l-.4 3.600H8.400z" fill="#fff"/><path d="M17 8l3-6 5-1" fill="none" stroke="#5b6675" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'),
  '✗': LS('<path d="M7 7l18 18M25 7L7 25"/>', 2.6),
  'ⓘ': LS('<circle cx="16" cy="16" r="12"/><path d="M16 14v8"/><circle cx="16" cy="9.600" r="0.600" fill="currentColor"/>', 2.2),
});
Object.assign(ICONS, {
  '⚕': LS('<path d="M16 3v26M16 6c-6 0-6 5 0 6s6 5 0 6-6 5 0 6" /><path d="M9 7c0-3 7-3 7 0M23 7c0-3-7-3-7 0"/>', 2),
  '⤒': LS('<path d="M16 28V12M9 18l7-7 7 7M6 5h20"/>'),
  '⇕': LS('<path d="M16 4v24M10 10l6-6 6 6M10 22l6 6 6-6"/>'),
});

// ---- Ders metinlerinde Windows 11 arayüzündeki simgeler ----
// Metinde "görev çubuğundaki 🔊" ya da "⊞ Başlat" yazıyorsa ekrandaki gerçek simge gösterilir
// (apps/appicons.js ve apps/w11-simge.js). Yanında yazan ada göre seçilenler: [{ a: sonrası, b: öncesi, svg }].
const SAVE = LS('<path d="M5 5h17l5 5v17H5z"/><path d="M10 5v7h11V5M9 27v-9h14v9"/>', 2);
const TEXT_ICONS = {
  '⊞': WIN_LOGO,
  '🔊': MONO.vol2, '🔈': MONO.vol1, '🔇': MONO.vol0,
  '📶': [{ a: /^\s*Ağ ve/i, svg: NAV.network }, MONO.wifi],
  '⏻': MONO.power, '🔋': MONO.battery, '✈': MONO.airplane,
  '⚙': [{ a: /^\s*Ayarlar/, svg: APP_ICONS.settings }, MONO.gear],
  '🖥': [{ a: /^\s*Sistem(\s|<|$)/, svg: NAV.system }],
  '🖨': [{ a: /^\s*Bluetooth/, svg: NAV.devices }],
  '🔵': [{ a: /^\s*Bluetooth/, svg: MONO.bluetooth }],
  '🎨': [{ a: /^\s*Kişiselleştirme/, svg: NAV.personal }],
  '🧩': [{ a: /^\s*Uygulamalar/, svg: NAV.apps }],
  '👤': [{ a: /^\s*Hesaplar/, svg: NAV.accounts }],
  '♿': [{ a: /^\s*Erişilebilirlik/, svg: NAV.access }],
  '🔄': [{ a: /^\s*Windows Update/, svg: NAV.update }],
  '🎮': [{ a: /^\s*Oyun(\s|$)/, svg: NAV.gaming }],
  '💾': [{ a: /^\s*(USB|simge)/, svg: SYS_ICONS.usb }, { b: /görev çubuğ\S*\s*$/, svg: SYS_ICONS.usb },
    { a: /^\s*(Kaydet|Resmi farklı kaydet|Notu kaydet)/i, svg: SAVE }],
  '⧉': MONO.copy,
  '🗜': SYS_ICONS['file-zip'],
  '☁': [{ a: /^\s*Bulut/, svg: APP_ICONS.bulut }],
};

const keyOf = (ch) => ch.replace(/️/g, '');
const pick = (ch, before, after, guide) => {
  const rules = guide && TEXT_ICONS[ch];
  if (rules) {
    if (typeof rules === 'string') return rules;
    for (const r of rules) {
      if (typeof r === 'string') return r;
      if ((!r.a || r.a.test(after)) && (!r.b || r.b.test(before))) return r.svg;
    }
  }
  return ICONS[ch] || null;
};
const ALL_KEYS = [...new Set([...Object.keys(ICONS), ...Object.keys(TEXT_ICONS)])].sort((x, y) => y.length - x.length);
// Yarım ekranlık eski sürüm: 👩‍⚕️ bütün olarak tek simge olur
const SEQ = /👩‍⚕️?/g;
const RE = new RegExp(`(?:${ALL_KEYS.join('|')})\\uFE0F?`, 'g');
const HAS = new RegExp(`(?:${ALL_KEYS.join('|')})|👩\\u200d⚕`);

// Ders anlatımı: Windows 11 simgeleri yalnızca burada yazıdaki simgelerin yerine geçer (uygulamaların içine dokunulmaz)
const GUIDE = '#guide,#home,#ozet,#printCard,#scene,#top,#pick,[data-w11text]';
const NO_ICON = 'script,style,textarea,input,select,option,svg,canvas,[data-noicon]';
const holder = typeof document !== 'undefined' ? document.createElement('template') : null;

// Düğümün yanındaki (kardeş ve üst öğenin kardeşi) yazıdan en çok 60 karakter: "Başlat → <b>⚙ Ayarlar</b>" gibi yerlerde bağlam için
function around(node, dir) {
  let s = '', n = node;
  for (let up = 0; up < 3 && s.length < 60 && n; up++) {
    for (let x = n[dir]; x && s.length < 60; x = x[dir]) s = dir === 'nextSibling' ? s + x.textContent.slice(0, 60) : x.textContent.slice(-60) + s;
    n = n.parentNode;
  }
  return s;
}

function fixText(node) {
  const text = node.nodeValue;
  if (!text || !HAS.test(text)) return;
  const el = node.parentElement;
  if (!el || el.closest(NO_ICON) || el.isContentEditable) return;
  const src = text.replace(SEQ, '🩺');
  const guide = !!el.closest(GUIDE);
  const prev = around(node, 'previousSibling');
  const next = around(node, 'nextSibling');
  let html = '', last = 0, n = 0, m;
  RE.lastIndex = 0;
  while ((m = RE.exec(src))) {
    const svg = pick(keyOf(m[0]), prev + src.slice(0, m.index), src.slice(m.index + m[0].length) + next, guide);
    if (!svg) continue;
    html += escapeText(src.slice(last, m.index)) + svg;
    last = m.index + m[0].length;
    n++;
  }
  if (!n) return;
  html += escapeText(src.slice(last));
  holder.innerHTML = html;
  node.replaceWith(holder.content.cloneNode(true));
}
const escapeText = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function fixTree(root) {
  if (!root) return;
  if (root.nodeType === 3) { fixText(root); return; }
  if (root.nodeType !== 1 || !root.isConnected || root.closest?.(NO_ICON)) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) if (HAS.test(walker.currentNode.nodeValue)) nodes.push(walker.currentNode);
  nodes.forEach(fixText);
}

/**
 * Sayfadaki (ve sonradan eklenen) metinlerde, her bilgisayarda görünmeyebilecek emojiler
 * ile Windows 11 arayüz simgelerinin yerine SVG koyar. Kaynak metin olduğu gibi kalır.
 * Düzenlenebilir alanlara (Word, Not Defteri), giriş kutularına ve data-noicon'lu öğelere dokunmaz.
 */
export function watchIcons(root = document.body) {
  fixTree(root);
  const mo = new MutationObserver((records) => {
    for (const r of records) {
      if (r.type === 'characterData') fixText(r.target);
      else r.addedNodes.forEach((nd) => fixTree(nd));
    }
    mo.takeRecords();
  });
  mo.observe(root, { childList: true, subtree: true, characterData: true });
  return mo;
}

/** Emoji ise ve eski bilgisayarlarda görünmeme ihtimali varsa SVG simgesini, değilse metni verir. */
export function emojiIcon(ch) {
  return ICONS[keyOf(String(ch))] || ch;
}
export const SVG_ICONS = ICONS;
