// İşletim sistemi benzetimlerinin simgeleri (SVG). Emoji kullanılmaz: eski bilgisayarlarda kare çıkabilir
// ve gerçek sistemlerin simgelerine benzemez. Hepsi 48×48'lik alanda çizilir; boyut CSS ile verilir.
const S = (body, vb = 48) => `<svg viewBox="0 0 ${vb} ${vb}" aria-hidden="true">${body}</svg>`;
let gid = 0;
const uid = (p) => `${p}${++gid}`;

// ---------------------------------------------------------------- logolar
// Windows 7: dalgalı, dört renkli bayrak
export const w7flag = (glow = false) => S(`${glow ? '<circle cx="24" cy="24" r="22" fill="#fff" opacity=".18"/>' : ''}
  <path d="M7 10q7-3 15.5 1l-1.6 11.4q-8-3.6-15.3-.6z" fill="#f65314"/><path d="M24.6 11.8q7.6 3.4 16.4-.4l-1.6 11.4q-8.6 3.6-16.4.4z" fill="#7cbb00"/>
  <path d="M5.2 23.8q7.3-3 15.3.6l-1.6 11.4q-8-3.6-15.3-.6z" fill="#00a1f1"/><path d="M22.8 25.2q7.8 3.2 16.4-.4l-1.6 11.4q-8.6 3.6-16.4.4z" fill="#ffbb00"/>`);
// Windows 8 ve 10: eğik, tek renkli pencere
export const w8logo = (c = '#fff') => S(`<path d="M4 9.5l16-2.2v15.2H4zM22 7l22-3v18.5H22zM4 24.5h16v15.2L4 37.5zM22 24.5h22V43l-22-3z" fill="${c}"/>`);
// Windows 11: dört düz kare
export const w11logo = () => { const g = uid('w11'); return S(`<defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3ccbf4"/><stop offset="1" stop-color="#1170cf"/></linearGradient></defs><path d="M4 4h19v19H4zM25 4h19v19H25zM4 25h19v19H4zM25 25h19v19H25z" fill="url(#${g})"/>`); };
// Ubuntu: turuncu daire, “dostluk çemberi”
export const ubuntu = (bg = '#e95420') => S(`${bg ? `<circle cx="24" cy="24" r="23" fill="${bg}"/>` : ''}<g fill="none" stroke="#fff" stroke-width="4.2"><path d="M30.6 12.6a13 13 0 0 0-17.6 4.2"/><path d="M11.4 28.6a13 13 0 0 0 13.7 9.4"/><path d="M33.4 33.6a13 13 0 0 0 1.4-16.6"/></g><g fill="#fff"><circle cx="11.2" cy="22.4" r="4.4"/><circle cx="31" cy="37.2" r="4.4"/><circle cx="33.2" cy="11.8" r="4.4"/></g>`);
// Pardus: turuncu-sarı damla içinde pars benekleri
export const pardus = () => { const g = uid('prd'); const spots = [[20, 16, 1.7], [28, 17, 1.5], [15, 24, 2], [23, 24, 2.2], [31, 25, 2], [18, 32, 2.2], [26, 32, 2.3], [34, 32, 1.7], [22, 39, 1.9], [30, 39, 1.7]]; return S(`<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffc21a"/><stop offset="1" stop-color="#f07c00"/></linearGradient></defs><path d="M24 3c9 9 17 15.5 17 25a17 17 0 0 1-34 0C7 18.5 15 12 24 3z" fill="url(#${g})"/><g fill="#6b3a0a" opacity=".75">${spots.map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.8}" transform="rotate(${(x * 23 + y * 11) % 60 - 30} ${x} ${y})"/>`).join('')}</g>`); };

// ---------------------------------------------------------------- klasörler ve dosyalar
const glyph = {
  doc: '<path d="M19 25h10M19 29h10M19 33h7" stroke="#fff" stroke-width="2" stroke-linecap="round"/>',
  pic: '<path d="M16 35l6-7 4 4 3-3 5 6z" fill="#fff"/><circle cx="29" cy="26" r="2" fill="#fff"/>',
  music: '<path d="M27 23v9.5a3 3 0 1 1-2-2.8V25l-6 1.5v7.5a3 3 0 1 1-2-2.8V25z" fill="#fff"/>',
  down: '<path d="M24 22v10M19.5 28l4.5 4.5 4.5-4.5M18 35h12" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round"/>',
  video: '<rect x="16" y="24" width="16" height="11" rx="1.5" fill="#fff"/><path d="M22 26.5v6l5-3z" fill="#888"/>',
  desk: '<rect x="16" y="23" width="16" height="10" rx="1" fill="#fff"/><path d="M21 36h6" stroke="#fff" stroke-width="2"/>',
  home: '<path d="M24 21l-8 7h2.5v7h11v-7H32z" fill="#fff"/>',
};
// stil: w7 (sarı, derin), w10 (sarı düz), w11 (açık sarı, yuvarlak), yaru (Ubuntu), papirus (Pardus, mavi)
export function folder(style = 'w10', g = '') {
  const c = { w7: ['#d9a12b', '#ffd86b', '#f4c043'], w10: ['#e8a72c', '#ffd364', '#ffd364'], w11: ['#f2b62a', '#ffd97a', '#ffcd4a'], yaru: ['#b2502d', '#f08a5d', '#e7703f'], papirus: ['#3f78c0', '#6ba3e8', '#5b93db'] }[style] || ['#e8a72c', '#ffd364', '#ffd364'];
  const id = uid('fd');
  const r = style === 'w11' || style === 'yaru' ? 3 : 1.5;
  const gl = g && glyph[g] ? (style === 'w7' || style === 'w10' || style === 'w11' ? glyph[g].replaceAll('#fff', '#b8862a').replaceAll('fill="#888"', 'fill="#ffd364"') : glyph[g]) : '';
  return S(`<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c[1]}"/><stop offset="1" stop-color="${c[2]}"/></linearGradient></defs>
    <path d="M4 ${10 + r}a${r} ${r} 0 0 1 ${r}-${r}h12l4 4h${20 - r}a${r} ${r} 0 0 1 ${r} ${r}v24H4z" fill="${c[0]}"/>
    ${style === 'w7' ? '<rect x="7" y="12" width="34" height="20" fill="#fff" stroke="#ddd"/>' : ''}
    <path d="M4 18h40v${20 - r}a${r} ${r} 0 0 1-${r} ${r}H${4 + r}a${r} ${r} 0 0 1-${r}-${r}z" fill="url(#${id})"/>${gl}`);
}
export const computer = (style = 'w7') => {
  const scr = style === 'w7' ? '#3a8ee6' : style === 'w11' ? '#2f7fd8' : '#1a86d9';
  return S(`<rect x="5" y="7" width="38" height="26" rx="${style === 'w11' ? 3 : 1.5}" fill="#3b4250"/><rect x="7.5" y="9.5" width="33" height="21" fill="${scr}"/><path d="M7.5 30.5L40.5 9.5V30.5z" fill="#fff" opacity=".15"/><path d="M19 33h10l2 6H17z" fill="#8a93a3"/><rect x="13" y="39" width="22" height="3" rx="1.5" fill="#6b7383"/>`);
};
export const bin = (full = false, style = 'w7') => {
  const glass = style === 'w7';
  return S(`<path d="M10 11h28l-3 32H13z" fill="${glass ? '#cfe6f7' : '#eef2f6'}" stroke="${glass ? '#7aa6c8' : '#9aa6b4'}" stroke-width="1.6"/>
    <path d="M17 15l1.5 24M24 15v24M31 15l-1.5 24" stroke="${glass ? '#8fb8d8' : '#b9c3ce'}" stroke-width="1.4"/>
    <ellipse cx="24" cy="11" rx="14.5" ry="3.5" fill="${glass ? '#e8f4fd' : '#fff'}" stroke="${glass ? '#7aa6c8' : '#9aa6b4'}" stroke-width="1.6"/>
    ${full ? '<path d="M15 10l5-5 6 3 5-2 3 5z" fill="#fff" stroke="#9aa6b4"/>' : ''}`);
};
export const drive = (sys = true) => S(`<rect x="4" y="16" width="40" height="18" rx="2.5" fill="#cfd5dd" stroke="#8a95a5" stroke-width="1.4"/><rect x="4" y="27" width="40" height="7" rx="2" fill="#a9b2bf"/><circle cx="38" cy="30.5" r="1.6" fill="#36c24a"/>${sys ? '<g transform="translate(8 17.5) scale(.24)">' + '<path d="M4 9.5l16-2.2v15.2H4zM22 7l22-3v18.5H22zM4 24.5h16v15.2L4 37.5zM22 24.5h22V43l-22-3z" fill="#1a86d9"/></g>' : ''}`);
export const dvd = () => S('<rect x="4" y="18" width="40" height="14" rx="2" fill="#cfd5dd" stroke="#8a95a5" stroke-width="1.4"/><circle cx="24" cy="25" r="8.5" fill="#e9eef4" stroke="#9aa6b4"/><circle cx="24" cy="25" r="2.4" fill="#fff" stroke="#9aa6b4"/><path d="M17 21a9 9 0 0 1 5-3" stroke="#c7a6f2" stroke-width="2" fill="none"/>');
export function file(ext) {
  const page = (body, fold = '#dfe5ec') => S(`<path d="M10 4h20l9 9v31H10z" fill="#fff" stroke="#a9b3c1" stroke-width="1.4"/><path d="M30 4v9h9" fill="${fold}" stroke="#a9b3c1" stroke-width="1.4"/>${body}`);
  const badge = (c, t) => `<rect x="6" y="22" width="22" height="16" rx="2" fill="${c}"/><text x="17" y="34.5" text-anchor="middle" font-size="12" font-weight="700" fill="#fff" font-family="Segoe UI, sans-serif">${t}</text>`;
  if (ext === 'txt') return page('<path d="M15 18h18M15 23h18M15 28h18M15 33h12" stroke="#7a8696" stroke-width="1.8"/>');
  if (ext === 'docx' || ext === 'odt') return page('<path d="M30 20h5M30 25h5M30 30h5" stroke="#9fb6d8" stroke-width="1.6"/>' + badge('#2b5797', 'W'));
  if (ext === 'xlsx') return page('<path d="M30 20h5M30 25h5M30 30h5" stroke="#9fcfae" stroke-width="1.6"/>' + badge('#1e7145', 'X'));
  if (ext === 'pdf') return page(`<rect x="13" y="26" width="22" height="10" rx="2" fill="#d93025"/><text x="24" y="34" text-anchor="middle" font-size="8.5" font-weight="700" fill="#fff" font-family="Segoe UI, sans-serif">PDF</text>`);
  if (ext === 'exe') return S('<rect x="6" y="9" width="36" height="30" rx="2" fill="#fff" stroke="#8a95a5" stroke-width="1.4"/><rect x="6" y="9" width="36" height="7" fill="#3c7fd6"/><rect x="11" y="21" width="14" height="12" fill="#dfe8f5"/><path d="M28 23h9M28 27h9M28 31h6" stroke="#9aa6b4" stroke-width="1.8"/>');
  if (ext === 'mp3') return page('<circle cx="24" cy="27" r="9" fill="#ff8c1a"/><path d="M26 21v8.5a2.4 2.4 0 1 1-1.6-2.3V21z" fill="#fff"/>');
  if (ext === 'mp4') return page('<rect x="14" y="20" width="20" height="14" rx="2" fill="#5a3fbf"/><path d="M22 23.5v7l6-3.5z" fill="#fff"/>');
  if (ext === 'jpg' || ext === 'png') {
    const id = uid('ph');
    return S(`<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc4f2"/><stop offset="1" stop-color="#d8efff"/></linearGradient></defs><rect x="5" y="9" width="38" height="30" rx="2" fill="#fff" stroke="#a9b3c1" stroke-width="1.4"/><rect x="8" y="12" width="32" height="24" fill="url(#${id})"/><path d="M8 36l10-11 7 7 5-4 10 8z" fill="#4c9a3b"/><circle cx="33" cy="18" r="3" fill="#ffd34d"/>`);
  }
  return page('');
}

// ---------------------------------------------------------------- programlar
export const ie = () => S('<path d="M24 9a15 15 0 1 0 14.4 19.2h-8.6a7.4 7.4 0 0 1-13-3.4h22.4A15 15 0 0 0 24 9zm-7 12.8a7.2 7.2 0 0 1 14 0z" fill="#1ea0ec"/><path d="M41 6c5 4-6 19-19 28S3 46 5 40c1-3 5-8 9-11-3 4-6 8-5 10 2 3 12-2 21-10S45 9 41 6z" fill="#f6c21c"/>');
export const edge = () => { const a = uid('ea'), b = uid('eb'); return S(`<defs><linearGradient id="${a}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#36c3a5"/><stop offset=".5" stop-color="#2ba0d8"/><stop offset="1" stop-color="#1259b8"/></linearGradient><linearGradient id="${b}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0c59a4"/><stop offset="1" stop-color="#1b7fd8"/></linearGradient></defs><path d="M43 31c-2 8-10 13-19 13A20 20 0 0 1 4 24C4 12 13 4 24 4c11 0 20 8 20 18 0 6-4 9-10 9-5 0-9-2-9-6 0-2 1-3 1-5 0-4-4-7-9-7-6 0-10 5-10 11 0 9 8 15 17 15 6 0 11-3 15-8z" fill="url(#${a})"/><path d="M8 26c3 9 13 15 23 12-5 0-10-3-12-8-1-3-.5-7 2-9-5 0-10 1-13 5z" fill="url(#${b})" opacity=".85"/>`); };
export const firefox = () => { const a = uid('fa'), b = uid('fb'); return S(`<defs><radialGradient id="${a}" cx=".3" cy=".25" r=".9"><stop offset="0" stop-color="#ffe226"/><stop offset=".35" stop-color="#ff9a1f"/><stop offset=".7" stop-color="#ff3d4d"/><stop offset="1" stop-color="#e31587"/></radialGradient><radialGradient id="${b}" cx=".5" cy=".4" r=".6"><stop offset="0" stop-color="#7542e5"/><stop offset="1" stop-color="#3a1ba1"/></radialGradient></defs><circle cx="24" cy="25" r="19" fill="url(#${a})"/><circle cx="25" cy="24" r="11.5" fill="url(#${b})"/><path d="M6 20c1-7 6-13 12-15-3 3-4 6-3 9 3-3 8-4 12-2-6 0-11 4-11 10 0 7 6 12 13 12 8 0 13-7 12-15 3 5 3 11 0 16-4 6-10 9-17 9C12 44 4 34 6 20z" fill="url(#${a})"/>`); };
export const explorer7 = () => S('<path d="M5 15h15l3 3h20v22H5z" fill="#d9a12b"/><rect x="9" y="11" width="28" height="18" fill="#fff" stroke="#ccc"/><path d="M5 21h38v19H5z" fill="#ffd86b"/><path d="M3 41h42v3H3z" fill="#7a5a26"/>');
export const explorer10 = () => S('<path d="M4 12a2 2 0 0 1 2-2h12l4 4h20a2 2 0 0 1 2 2v24H4z" fill="#e8a72c"/><path d="M4 18h40v20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" fill="#ffd364"/><rect x="4" y="27" width="40" height="5" fill="#3c8fd6"/>');
export const explorer11 = () => S('<path d="M4 13a3 3 0 0 1 3-3h11l4 4h19a3 3 0 0 1 3 3v21a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" fill="#f2b62a"/><path d="M4 19h40v19a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" fill="#ffd97a"/><rect x="4" y="29" width="40" height="5" fill="#1a8cd8"/>');
export const notepad = (style = 'w7') => S(`<rect x="9" y="6" width="30" height="38" rx="${style === 'w11' ? 3 : 1}" fill="#fff" stroke="#7d8fa8" stroke-width="1.4"/><rect x="9" y="6" width="30" height="8" fill="${style === 'w11' ? '#2b88d8' : '#86bde8'}"/>${style === 'w11' ? '' : '<g fill="#555"><circle cx="15" cy="6" r="1.6"/><circle cx="21" cy="6" r="1.6"/><circle cx="27" cy="6" r="1.6"/><circle cx="33" cy="6" r="1.6"/></g>'}<path d="M14 21h20M14 26h20M14 31h20M14 36h13" stroke="#9aa6b4" stroke-width="1.6"/>`);
export const texteditor = () => S('<rect x="8" y="5" width="28" height="38" rx="3" fill="#f4f4f2" stroke="#9a9a96" stroke-width="1.4"/><path d="M13 13h18M13 18h18M13 23h12" stroke="#7a7a76" stroke-width="2"/><path d="M38 20l5 5-15 15h-5v-5z" fill="#e95420"/><path d="M23 35l5 5" stroke="#fff" stroke-width="1"/>');
export const calc = (style = 'w7') => S(`<rect x="9" y="4" width="30" height="40" rx="${style === 'w11' || style === 'lnx' ? 4 : 2}" fill="${style === 'w10' || style === 'w11' ? '#3a3f47' : '#5d6878'}"/><rect x="12" y="8" width="24" height="9" rx="1" fill="${style === 'w7' ? '#dfeedd' : '#cfe3f7'}"/><g fill="${style === 'w11' ? '#ffb24c' : '#d9dee6'}">${[0, 1, 2].map((r) => [0, 1, 2].map((cc) => `<rect x="${12.5 + cc * 8.2}" y="${21 + r * 7.5}" width="6" height="5.5" rx="1"/>`).join('')).join('')}</g>`);
export const gear = (c = '#fff', bg = '') => S(`${bg ? `<rect x="2" y="2" width="44" height="44" rx="10" fill="${bg}"/>` : ''}<path d="M21 6h6l1 5 4 2 4.5-3 4 4-3 4.5 2 4 5 1v6l-5 1-2 4 3 4.5-4 4-4.5-3-4 2-1 5h-6l-1-5-4-2-4.5 3-4-4 3-4.5-2-4-5-1v-6l5-1 2-4-3-4.5 4-4 4.5 3 4-2z" fill="${c}"/><circle cx="24" cy="24" r="6.5" fill="${bg || '#0000'}" stroke="${bg ? 'none' : c}"/>`);
export const gear11 = () => { const a = uid('g11'); return S(`<defs><linearGradient id="${a}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9aa3af"/><stop offset="1" stop-color="#5d6672"/></linearGradient></defs><path d="M21 5h6l1.2 5.2 4.4 2 4.6-3 4.2 4.2-3 4.6 2 4.4L45.6 24l-.1 3.4-5.1 1.2-2 4.4 3 4.6-4.2 4.2-4.6-3-4.4 2L27 43h-6l-1.2-5.2-4.4-2-4.6 3-4.2-4.2 3-4.6-2-4.4L2.4 24l.1-3.4 5.1-1.2 2-4.4-3-4.6 4.2-4.2 4.6 3 4.4-2z" fill="url(#${a})"/><circle cx="24" cy="24" r="7" fill="#2b88d8"/><circle cx="24" cy="24" r="3.4" fill="#fff"/>`); };
export const cpanel = () => S('<rect x="4" y="7" width="40" height="28" rx="2" fill="#3b4250"/><rect x="7" y="10" width="34" height="22" fill="#e9f3fd"/><rect x="11" y="22" width="5" height="7" fill="#3c7fd6"/><rect x="19" y="17" width="5" height="12" fill="#45a845"/><rect x="27" y="14" width="5" height="15" fill="#f0a020"/><rect x="34" y="20" width="4" height="9" fill="#d94040"/><path d="M19 35h10l2 5H17z" fill="#8a93a3"/>');
export const wmp = () => { const a = uid('wm'); return S(`<defs><radialGradient id="${a}" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#ffd24a"/><stop offset="1" stop-color="#f07a00"/></radialGradient></defs><circle cx="24" cy="24" r="20" fill="#2a63c5"/><circle cx="24" cy="24" r="16" fill="url(#${a})"/><path d="M19 15v18l14-9z" fill="#fff"/>`); };
export const store = (style = 'w10') => S(`<path d="M13 15a11 11 0 0 1 22 0" fill="none" stroke="${style === 'w8' ? '#fff' : '#3b4250'}" stroke-width="2.6"/><rect x="6" y="15" width="36" height="28" rx="${style === 'w11' ? 5 : 1}" fill="${style === 'w8' ? '#fff0' : style === 'w11' ? '#1f6fd1' : '#2b2b2b'}" ${style === 'w8' ? 'stroke="#fff" stroke-width="2.4"' : ''}/><g transform="translate(15 21) scale(.36)"><path d="M0 0h23v23H0zM25 0h23v23H25zM0 25h23v23H0zM25 25h23v23H25z" fill="${style === 'w8' ? '#fff' : ''}"/>${style === 'w8' ? '' : '<path d="M0 0h23v23H0z" fill="#f25022"/><path d="M25 0h23v23H25z" fill="#7fba00"/><path d="M0 25h23v23H0z" fill="#00a4ef"/><path d="M25 25h23v23H25z" fill="#ffb900"/>'}</g>`);
export const mail = (c = '#0078d4', line = '#fff') => S(`<rect x="4" y="10" width="40" height="28" rx="3" fill="${c}"/><path d="M5 12l19 14 19-14" fill="none" stroke="${line}" stroke-width="2.4" stroke-linejoin="round"/>`);
export const terminal = () => S('<rect x="4" y="7" width="40" height="34" rx="4" fill="#2c2c2c"/><rect x="4" y="7" width="40" height="7" rx="3" fill="#4a4a4a"/><path d="M11 21l7 5-7 5" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 32h12" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>');
export const files = () => S('<rect x="5" y="12" width="38" height="30" rx="4" fill="#9a9ea6"/><rect x="5" y="9" width="17" height="7" rx="3" fill="#7d828b"/><rect x="5" y="16" width="38" height="26" rx="4" fill="#d8dade"/><rect x="18" y="24" width="12" height="4" rx="2" fill="#6f747d"/>');
export const writer = () => S('<path d="M10 4h20l9 9v31H10z" fill="#fff" stroke="#9aa6b4" stroke-width="1.4"/><path d="M30 4v9h9z" fill="#2a7ad5"/><rect x="10" y="34" width="29" height="10" fill="#2a7ad5"/><path d="M15 17h12M15 22h18M15 27h18" stroke="#2a7ad5" stroke-width="2"/>');
export const appcenter = () => S('<path d="M15 14a9 9 0 0 1 18 0" fill="none" stroke="#c34113" stroke-width="3"/><rect x="7" y="14" width="34" height="29" rx="5" fill="#e95420"/><path d="M18 36l6-15 6 15M20.5 30.5h7" stroke="#fff" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>');
export const help = () => S('<circle cx="24" cy="24" r="19" fill="#fff" stroke="#c7162b" stroke-width="10" stroke-dasharray="15 14.85" transform="rotate(-38 24 24)"/><circle cx="24" cy="24" r="19" fill="none" stroke="#bbb" stroke-width="1"/>');
export const music = () => S('<circle cx="24" cy="24" r="20" fill="#f7b500"/><circle cx="24" cy="24" r="12" fill="#fff6d6"/><circle cx="24" cy="24" r="3" fill="#f7b500"/>');
export const thunderbird = () => S('<circle cx="24" cy="24" r="20" fill="#1373d9"/><rect x="11" y="16" width="26" height="18" rx="2" fill="#fff"/><path d="M12 17l12 9 12-9" fill="none" stroke="#1373d9" stroke-width="2"/>');
export const software = () => S('<rect x="6" y="6" width="36" height="36" rx="8" fill="#2e86de"/><path d="M15 17h18l-2 16H17z" fill="#fff"/><path d="M19 17a5 5 0 0 1 10 0" fill="none" stroke="#fff" stroke-width="2"/>');
export const photos = () => S('<rect x="5" y="9" width="38" height="30" rx="3" fill="#0f72c9"/><path d="M8 35l11-12 8 8 5-4 9 8z" fill="#fff"/><circle cx="33" cy="17" r="3.4" fill="#fff"/>');
export const clockApp = () => S('<circle cx="24" cy="24" r="19" fill="#2b5fbf"/><circle cx="24" cy="24" r="15" fill="#fff"/><path d="M24 13v11l7 4" stroke="#2b5fbf" stroke-width="2.6" fill="none" stroke-linecap="round"/>');
export const calendar = (c = '#1a73e8') => S(`<rect x="6" y="9" width="36" height="33" rx="3" fill="#fff" stroke="#9aa6b4" stroke-width="1.4"/><rect x="6" y="9" width="36" height="9" rx="3" fill="${c}"/><g fill="#9aa6b4">${[0, 1, 2, 3].map((r) => [0, 1, 2, 3, 4].map((cc) => `<rect x="${10 + cc * 6.2}" y="${22 + r * 4.6}" width="4" height="3"/>`).join('')).join('')}</g>`);
export const weather = () => S('<circle cx="19" cy="19" r="8" fill="#ffc83d"/><path d="M14 38h22a7 7 0 0 0 0-14 9 9 0 0 0-17 2 6 6 0 0 0-5 12z" fill="#e9eef5" stroke="#b9c3ce"/>');
export const paint = () => S('<path d="M8 36c0-10 6-28 20-28 9 0 14 6 14 12 0 8-7 7-10 9s0 9-7 9C14 38 8 40 8 36z" fill="#f5e6c8" stroke="#b49a6a" stroke-width="1.4"/><circle cx="20" cy="17" r="3" fill="#e2412b"/><circle cx="29" cy="15" r="3" fill="#2f86de"/><circle cx="35" cy="21" r="3" fill="#3cae4a"/><circle cx="15" cy="26" r="3" fill="#f2b91f"/>');
export const camera = () => S('<rect x="5" y="14" width="38" height="26" rx="4" fill="#3b4250"/><rect x="16" y="9" width="14" height="7" rx="2" fill="#3b4250"/><circle cx="24" cy="27" r="9" fill="#9fc6f0"/><circle cx="24" cy="27" r="5" fill="#2b5fbf"/>');
export const people = () => S('<circle cx="18" cy="17" r="7" fill="#fff"/><path d="M5 40a13 13 0 0 1 26 0z" fill="#fff"/><circle cx="33" cy="19" r="5.5" fill="#fff" opacity=".8"/><path d="M28 30a11 11 0 0 1 16 10H33" fill="#fff" opacity=".8"/>');
export const film = () => S('<rect x="5" y="10" width="38" height="28" rx="3" fill="#5c2d91"/><path d="M20 17v14l11-7z" fill="#fff"/>');
export const solitaire = () => S('<rect x="9" y="7" width="22" height="31" rx="3" fill="#fff" stroke="#9aa6b4" transform="rotate(-10 20 22)"/><rect x="17" y="9" width="22" height="31" rx="3" fill="#fff" stroke="#9aa6b4"/><path d="M28 19c-3-4-7 0-4 3l4 4 4-4c3-3-1-7-4-3z" fill="#d93025"/>');

// ---------------------------------------------------------------- küçük çizgi simgeler (görev çubuğu, menüler)
const L = (d, w = 2, extra = '') => S(`<path d="${d}" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>${extra}`, 24);
export const ln = {
  search: L('M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5L21 21'),
  power: L('M12 3v9M6.3 6.5a8 8 0 1 0 11.4 0'),
  user: L('M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zM3.5 21a8.5 8.5 0 0 1 17 0'),
  doc: L('M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6'),
  pic: L('M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6M15.5 9.5h.01', 2),
  gear: L('M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM19.4 13.5l1.8 1.4-2 3.4-2.2-.8a7 7 0 0 1-2 1.2L14.7 21h-4l-.4-2.3a7 7 0 0 1-2-1.2l-2.2.8-2-3.4 1.8-1.4a7 7 0 0 1 0-2.4L4.1 9.7l2-3.4 2.2.8a7 7 0 0 1 2-1.2L10.7 3h4l.4 2.3a7 7 0 0 1 2 1.2l2.2-.8 2 3.4-1.8 1.4a7 7 0 0 1 0 2.4z', 1.6),
  menu: L('M4 6h16M4 12h16M4 18h16'),
  chevUp: L('M6 15l6-6 6 6'),
  chevDown: L('M6 9l6 6 6-6'),
  chevRight: L('M9 6l6 6-6 6'),
  chevLeft: L('M15 6l-6 6 6 6'),
  back: L('M19 12H5M11 6l-6 6 6 6'),
  fwd: L('M5 12h14M13 6l6 6-6 6'),
  up: L('M12 19V5M6 11l6-6 6 6'),
  refresh: L('M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7'),
  home: L('M3 11l9-8 9 8M5 9.5V21h5v-6h4v6h5V9.5'),
  star: L('M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z', 1.6),
  dots: S('<g fill="currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></g>', 24),
  grid9: S('<g fill="currentColor">' + [4, 12, 20].map((y) => [4, 12, 20].map((x) => `<circle cx="${x}" cy="${y}" r="2.2"/>`).join('')).join('') + '</g>', 24),
  wifi: L('M2 8.5a15 15 0 0 1 20 0M5.5 12a10 10 0 0 1 13 0M9 15.5a5 5 0 0 1 6 0', 2, '<circle cx="12" cy="19" r="1.6" fill="currentColor"/>'),
  net: L('M4 4h16v11H4zM12 15v4M7 20h10'),
  vol: L('M4 9h4l5-4v14l-5-4H4zM16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11'),
  bat: L('M3 7h16v10H3zM21 10.5v3', 2, '<rect x="5" y="9" width="10" height="6" fill="currentColor"/>'),
  flag: L('M5 21V4M5 4h11l-2 4 2 4H5'),
  bell: L('M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0'),
  note: L('M5 4h14v12l-4 4H5zM15 20v-4h4'),
  taskview: L('M3 6h11v12H3zM17 6h4M17 18h4M19 6v12', 1.8),
  close: L('M6 6l12 12M18 6L6 18'),
  min: L('M5 12h14'),
  max: L('M5 5h14v14H5z', 1.6),
  plus: L('M12 5v14M5 12h14'),
  lock: L('M6 11h12v10H6zM8.5 11V7.5a3.5 3.5 0 0 1 7 0V11'),
  logout: L('M10 4H4v16h6M14 8l4 4-4 4M18 12H9'),
  restart: L('M4 12a8 8 0 1 0 2.3-5.7M4 4v5h5'),
  moon: L('M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z'),
  share: L('M8 12h8M14 6l6 6-6 6M4 4v16'),
  devices: L('M3 5h13v10H3zM7 19h5M18 8h3v12h-3z'),
  access: L('M12 5.5a1.5 1.5 0 1 0 0-.01M5 8l7 1.5L19 8M12 9.5V14l-3 6M12 14l3 6', 1.8),
  bright: L('M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4', 1.8),
  bt: L('M7 7l10 10-5 4V3l5 4L7 17'),
  plane: L('M2.5 13.5l7-1.5L13 3.5h2l-1 8.5 6 1.5v2l-6-1-1 5 2 1.5v1.5L12 21l-3 1v-1.5l2-1.5-1-5-7.5 1z', 1.6),
  leaf: L('M5 19c0-9 6-15 15-15 0 9-6 15-15 15zM5 19l8-8'),
  cut: L('M6 8a2.5 2.5 0 1 0 0-.01M6 18a2.5 2.5 0 1 0 0-.01M8 9l12 9M8 17l12-9'),
  copy: L('M8 8h11v13H8zM5 16V3h11'),
  paste: L('M9 4h6v3H9zM6 5h3M15 5h3v16H6V5'),
  trash: L('M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14'),
  rename: L('M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4'),
  sort: L('M7 4v16M3 16l4 4 4-4M17 20V4M13 8l4-4 4 4'),
  view: L('M3 4h7v7H3zM14 4h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z', 1.6),
  apps: L('M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z', 1.6),
  info: L('M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 11v6M12 7.5v.01'),
  eye: L('M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'),
  key: L('M15 9a3 3 0 1 0 0-.01M13 11l-9 9M7 17l2 2M9 15l2 2'),
  kbd: L('M2 6h20v12H2zM6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10'),
};

// Kişi resmi (kullanıcı hesabı): yuvarlak, gri kişi silueti ya da W7'nin çiçek resmi
export const avatar = (kind = 'round') => {
  if (kind === 'flower') { const a = uid('av'); return S(`<defs><radialGradient id="${a}" cx=".5" cy=".5" r=".7"><stop offset="0" stop-color="#b9e27a"/><stop offset="1" stop-color="#3d8b2f"/></radialGradient></defs><rect width="48" height="48" fill="url(#${a})"/><g transform="translate(24 22)">${[0, 60, 120, 180, 240, 300].map((r) => `<ellipse rx="5" ry="10" cy="-9" fill="#ff7aa8" transform="rotate(${r})"/>`).join('')}<circle r="5" fill="#ffd23f"/></g>`); }
  return S('<circle cx="24" cy="24" r="24" fill="#c7ccd4"/><circle cx="24" cy="19" r="8" fill="#fff"/><path d="M9 40a15 15 0 0 1 30 0 22 22 0 0 1-30 0z" fill="#fff"/>');
};
