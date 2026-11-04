// Ayarlar, Denetim Masası, Aygıt Yöneticisi ve Windows Güvenliği için satır içi SVG simgeler (emoji yok).
//   NAV[ad]   renkli, 24 birimlik gezinti simgeleri (düz renk; degrade gerekmez)
//   MI[ad]    tek renkli (currentColor) çizgi simgeler; appicons.js'teki MONO ile birleştirilmiş
//   wifiBars(n, kilit)  çubuk sayısına göre Wi-Fi simgesi
import { MONO } from './appicons.js';

const C = (name, body) => `<svg class="wi wi-c" data-wi-c="${name}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${body}</svg>`;
const M = (name, body) => `<svg class="wi wi-m" data-wi-m="${name}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;

export const NAV = {
  system: C('system', '<rect x="2.5" y="4" width="19" height="12.5" rx="2" fill="#0f78d4"/><rect x="4" y="5.5" width="16" height="9.5" rx="1" fill="#8fd0ff"/><path d="M9 20h6M12 16.5V20" stroke="#5b6b7d" stroke-width="1.8" stroke-linecap="round"/>'),
  devices: C('devices', '<circle cx="12" cy="12" r="10" fill="#1a7ae0"/><path d="M8.3 8.3l7.4 7.4-3.7 3.2V5.1l3.7 3.2-7.4 7.4" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>'),
  network: C('network', '<path d="M2.5 9.3a13 13 0 0 1 19 0M5.5 12.8a8.6 8.6 0 0 1 13 0M8.6 16.2a4.2 4.2 0 0 1 6.8 0" fill="none" stroke="#0f78d4" stroke-width="2.1" stroke-linecap="round"/><circle cx="12" cy="19.6" r="1.9" fill="#0f78d4"/>'),
  personal: C('personal', '<path d="M3 21l1.3-5.2L16 4.1a2.5 2.5 0 0 1 3.5 3.5L7.8 19.4z" fill="#f59e0b"/><path d="M14.3 5.8l3.5 3.5" stroke="#fff" stroke-width="1.4"/><path d="M3 21l1.3-5.2 3.9 3.9z" fill="#3b4655"/>'),
  apps: C('apps', '<rect x="3" y="3" width="8" height="8" rx="1.8" fill="#0f78d4"/><rect x="13" y="3" width="8" height="8" rx="1.8" fill="#2fb4a0"/><rect x="3" y="13" width="8" height="8" rx="1.8" fill="#8764b8"/><rect x="13" y="13" width="8" height="8" rx="1.8" fill="#f2a31b"/>'),
  accounts: C('accounts', '<circle cx="12" cy="8" r="4.3" fill="#2e9e6a"/><path d="M3.5 21a8.5 8.5 0 0 1 17 0z" fill="#4cc38a"/>'),
  time: C('time', '<circle cx="12" cy="12" r="9.6" fill="#fff" stroke="#0f78d4" stroke-width="2"/><path d="M12 6.3V12l3.6 2.2" fill="none" stroke="#0f78d4" stroke-width="2" stroke-linecap="round"/><path d="M2.6 12h3M18.4 12h3" stroke="#0f78d4" stroke-width="1.2"/>'),
  gaming: C('gaming', '<path d="M7 7h10a4.6 4.6 0 0 1 4.5 5.5l-.8 4a2.5 2.5 0 0 1-4.6 1L15 16H9l-1.1 1.5a2.5 2.5 0 0 1-4.6-1l-.8-4A4.6 4.6 0 0 1 7 7z" fill="#5b6b7d"/><path d="M8 9.5v3.5M6.25 11.25h3.5" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/><circle cx="15.6" cy="10.5" r="1" fill="#fff"/><circle cx="17.8" cy="12.3" r="1" fill="#fff"/>'),
  access: C('access', '<circle cx="12" cy="12" r="10" fill="#0f78d4"/><circle cx="12" cy="6.8" r="1.7" fill="#fff"/><path d="M6.5 9.8l5.5 1.2 5.5-1.2M12 11v4M9.5 19l2.5-4 2.5 4" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>'),
  privacy: C('privacy', '<path d="M12 2.5l8 3v6.3c0 4.7-3.3 8.3-8 9.7-4.7-1.4-8-5-8-9.7V5.5z" fill="#5b6b7d"/><rect x="8.3" y="10.8" width="7.4" height="5.6" rx="1.2" fill="#fff"/><path d="M9.9 10.8V9.3a2.1 2.1 0 0 1 4.2 0v1.5" fill="none" stroke="#fff" stroke-width="1.5"/>'),
  update: C('update', '<path d="M20 12a8 8 0 0 1-14 5.3M4 12a8 8 0 0 1 14-5.3" fill="none" stroke="#0f78d4" stroke-width="2.2" stroke-linecap="round"/><path d="M18.6 3v4.6H14M5.4 21v-4.6H10" fill="none" stroke="#0f78d4" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'),
  user: C('user', '<circle cx="12" cy="12" r="12" fill="#c9d4e2"/><circle cx="12" cy="9.5" r="4" fill="#fff"/><path d="M4.5 21a7.6 7.6 0 0 1 15 0A12 12 0 0 1 12 24a12 12 0 0 1-7.5-3z" fill="#fff"/>'),
};

export const MI = {
  ...MONO,
  volume: MONO.vol2, volmute: MONO.vol0,
  monitor: M('monitor', '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>'),
  info: M('info', '<circle cx="12" cy="12" r="9"/><path d="M12 11v6"/><circle cx="12" cy="7.6" r=".7" fill="currentColor"/>'),
  printer: M('printer', '<path d="M7 9V3.5h10V9"/><rect x="4" y="9" width="16" height="8" rx="2"/><path d="M7 14h10v6.5H7z"/>'),
  mouse: M('mouse', '<rect x="6" y="3" width="12" height="18" rx="6"/><path d="M12 3v7M6 10h12"/>'),
  keyboard: M('keyboard', '<rect x="2.5" y="6" width="19" height="12" rx="2"/><path d="M6 10h.1M9 10h.1M12 10h.1M15 10h.1M18 10h.1M7 14h10"/>'),
  image: M('image', '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="M4 18l5-5 4 4 3-3 4 4"/>'),
  palette: M('palette', '<path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-.9 2-1.8 0-1.3-1-1.6-1-2.7 0-1 .8-1.5 1.8-1.5H17a4 4 0 0 0 4-4C21 6.5 17 3 12 3z"/><path d="M7.5 11h.1M10 7.5h.1M14 7.5h.1"/>'),
  taskbar: M('taskbar', '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 16h18M8 18.2h.1M12 18.2h.1M16 18.2h.1"/>'),
  store: M('store', '<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>'),
  apps: M('apps', '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
  list: M('list', '<path d="M8.5 6H21M8.5 12H21M8.5 18H21M3.5 6h.1M3.5 12h.1M3.5 18h.1"/>'),
  key: M('key', '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3M14 9l2 2"/>'),
  pin: M('pin', '<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M8 10h.1M12 10h.1M16 10h.1M8 14h.1M12 14h.1M16 14h.1"/>'),
  people: M('people', '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.8a3.5 3.5 0 0 1 0 6.4M18 14a6.5 6.5 0 0 1 3.5 6"/>'),
  calendar: M('calendar', '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>'),
  globe: M('globe', '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>'),
  language: M('language', '<path d="M3 5h9M7.5 3v2M5 5c.5 4 3 7 6.5 8.5M10 5c-.5 4-3 7-6.5 8.5"/><path d="M12 20l4.5-10 4.5 10M13.5 17h6"/>'),
  textsize: M('textsize', '<path d="M3 19l5-13 5 13M4.8 14.5h6.4M15 19l3-7.5 3 7.5M16 17h4"/>'),
  zoom: M('zoom', '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21M10.5 8v5M8 10.5h5"/>'),
  cursor: M('cursor', '<path d="M5.5 3.5l13 7.5-5.8 1.6L9.6 18.5z"/>'),
  shield: M('shield', '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>'),
  shieldcheck: M('shieldcheck', '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5L16 9.5"/>'),
  trash: M('trash', '<path d="M4 7h16M9 7V4.5h6V7M6 7l1 13h10l1-13M10 11v6M14 11v6"/>'),
  hotspot: M('hotspot', '<circle cx="12" cy="12" r="2"/><path d="M7.5 16.5a6.4 6.4 0 0 1 0-9M16.5 7.5a6.4 6.4 0 0 1 0 9M4.5 19.5a10.6 10.6 0 0 1 0-15M19.5 4.5a10.6 10.6 0 0 1 0 15"/>'),
  headphones: M('headphones', '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>'),
  speakerdev: M('speakerdev', '<rect x="6" y="3" width="12" height="18" rx="2"/><circle cx="12" cy="15" r="3"/><path d="M12 7h.1"/>'),
  question: M('question', '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.1"/>'),
  camera: M('camera', '<path d="M3 8h4l1.5-2h7L17 8h4v11H3z"/><circle cx="12" cy="13" r="3.5"/>'),
  location: M('location', '<path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>'),
  gamepad: M('gamepad', '<path d="M7 7h10a4.5 4.5 0 0 1 4.4 5.4l-.8 4A2.5 2.5 0 0 1 16 17.5l-1-1.5H9l-1 1.5a2.5 2.5 0 0 1-4.6-1.1l-.8-4A4.5 4.5 0 0 1 7 7z"/><path d="M8 10v3M6.5 11.5h3M15.5 11h.1M17.5 12.5h.1"/>'),
  download: M('download', '<path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 20h14"/>'),
  disk: M('disk', '<rect x="3" y="7" width="18" height="10" rx="2"/><path d="M7 14h.1M10 14h4"/>'),
  external: M('external', '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'),
  edit: M('edit', '<path d="M4 20l1-4L16.5 4.5a2 2 0 0 1 3 3L8 19z"/>'),
  bell: M('bell', '<path d="M6 17v-6a6 6 0 0 1 12 0v6l2 2H4zM10 21h4"/>'),
  menu: M('menu', '<path d="M4 7h16M4 12h16M4 17h16"/>'),
  back: M('back', '<path d="M19 12H5M11 6l-6 6 6 6"/>'),
  forward: M('forward', '<path d="M5 12h14M13 6l6 6-6 6"/>'),
  up: M('up', '<path d="M12 19V5M6 11l6-6 6 6"/>'),
  warn: M('warn', '<path d="M12 3.5l9.5 16.5h-19z"/><path d="M12 10v4.5M12 17.2v.1"/>'),
  block: M('block', '<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>'),
  cpu: M('cpu', '<rect x="6" y="6" width="12" height="12" rx="1.5"/><rect x="9.5" y="9.5" width="5" height="5"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/>'),
  firewall: M('firewall', '<rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M3 9.3h18M3 14.7h18M9 4v5.3M15 9.3v5.4M9 14.7V20"/>'),
  browser: M('browser', '<rect x="3" y="4.5" width="18" height="15" rx="2"/><path d="M3 9h18M6.5 6.8h.1M9 6.8h.1"/>'),
  heart: M('heart', '<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/>'),
  history: M('history', '<path d="M3.5 12a8.5 8.5 0 1 0 2.5-6M3.5 4v4.5H8"/><path d="M12 8v4.5l3 1.8"/>'),
  usbdrive: M('usbdrive', '<rect x="8" y="3" width="8" height="8" rx="1"/><rect x="5" y="11" width="14" height="10" rx="2"/>'),
  ok: M('ok', '<circle cx="12" cy="12" r="9"/><path d="M7.8 12.4l3 3 5.4-6"/>'),
  folderopen: M('folderopen', '<path d="M3.5 7a2 2 0 0 1 2-2h4l2 2.2h7a2 2 0 0 1 2 2V10M3.5 7v10a2 2 0 0 0 2 2h12.3a2 2 0 0 0 1.9-1.4L21.5 11a1 1 0 0 0-1-1.3H8.4a2 2 0 0 0-1.9 1.4L3.5 17"/>'),
  eyeoff: M('eyeoff', '<path d="M2.5 12S6 5.5 12 5.5c1.5 0 2.9.4 4 1M21.5 12S18 18.5 12 18.5c-1.5 0-2.9-.4-4-1"/><path d="M4 4l16 16"/>'),
  tools: M('tools', '<path d="M14.5 6.5a4 4 0 0 0 5 5L9.5 21.5l-3-3z"/><path d="M14.5 6.5L17 4l3 3-2.5 2.5"/>'),
  family: M('family', '<circle cx="8" cy="7" r="3"/><circle cx="17" cy="9.5" r="2.2"/><path d="M2.5 20a5.5 5.5 0 0 1 11 0M14 20a3.5 3.5 0 0 1 7 0"/>'),
};

// Denetim Masası öğe simgeleri (renkli, düz)
export const CP = {
  firewall: C('cp-firewall', '<rect x="2.5" y="4.5" width="19" height="15" rx="1.6" fill="#d9532b"/><path d="M2.5 9.5h19M2.5 14.5h19M9 4.5v5M15 9.5v5M9 14.5v5" stroke="#f6dcd2" stroke-width="1.2"/>'),
  power: C('cp-power', '<rect x="2.5" y="7" width="16" height="10" rx="2" fill="#3aa655"/><rect x="18.5" y="10" width="2.6" height="4" rx="1" fill="#3aa655"/><path d="M11.4 8.6l-3.2 4h3l-1 3.2 4.2-4.6h-3.1z" fill="#fff"/>'),
  sound: C('cp-sound', '<path d="M3 9.5h4l5-4v13l-5-4H3z" fill="#5b6b7d"/><path d="M15 9a4.5 4.5 0 0 1 0 6M17.8 6.4a8.2 8.2 0 0 1 0 11.2" fill="none" stroke="#0f78d4" stroke-width="1.9" stroke-linecap="round"/>'),
  mouse: C('cp-mouse', '<rect x="6" y="2.5" width="12" height="19" rx="6" fill="#e9eef3" stroke="#5b6b7d" stroke-width="1.4"/><path d="M6.7 10V8.6A5.4 5.4 0 0 1 12 2.5V10z" fill="#0f78d4"/><path d="M12 2.5V10M6 10h12" stroke="#5b6b7d" stroke-width="1.4"/>'),
  keyboard: C('cp-keyboard', '<rect x="2" y="6" width="20" height="12" rx="2" fill="#e9eef3" stroke="#5b6b7d" stroke-width="1.3"/><path d="M5.5 10h.1M8.5 10h.1M11.5 10h.1M14.5 10h.1M17.5 10h.1M7 14h10" stroke="#3b4655" stroke-width="1.8" stroke-linecap="round"/>'),
  programs: C('cp-programs', '<path d="M3.5 8L12 3.8 20.5 8v9L12 21.2 3.5 17z" fill="#f2a31b"/><path d="M3.5 8L12 12.2 20.5 8M12 12.2v9" fill="none" stroke="#a86a00" stroke-width="1.2"/><path d="M12 12.2L20.5 8v9L12 21.2z" fill="#d98a0b"/>'),
  region: C('cp-region', '<circle cx="12" cy="12" r="9.5" fill="#2f95e0"/><path d="M6 8.3c2-1.2 3.2 0 4 1s-1 3 0 4 3 0 2 3M14 5c1 2 3 2 4 3.2M16 14.2c1.3 0 2.2 1 2.4 2.3" fill="none" stroke="#5fc07a" stroke-width="2.2" stroke-linecap="round"/>'),
  display: C('cp-display', '<rect x="2.5" y="4" width="19" height="12.5" rx="2" fill="#0f78d4"/><path d="M4 15l5-6 4 4 3-3 4 5z" fill="#5fc07a"/><circle cx="16.5" cy="8" r="1.4" fill="#ffe27a"/><path d="M9 20h6M12 16.5V20" stroke="#5b6b7d" stroke-width="1.8" stroke-linecap="round"/>'),
};

// Wi-Fi: sinyal gücü kadar yay dolu, gerisi soluk (0–4 çubuk)
export const wifiBars = (n = 4) => {
  const on = Math.max(1, Math.min(4, n));
  const arc = (d, i) => `<path d="${d}" opacity="${on >= i ? 1 : 0.28}"/>`;
  return `<svg class="wi wi-m" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true" focusable="false">${arc('M2.8 9.2a13 13 0 0 1 18.4 0', 4)}${arc('M5.8 12.4a8.7 8.7 0 0 1 12.4 0', 3)}${arc('M8.9 15.6a4.3 4.3 0 0 1 6.2 0', 2)}<circle cx="12" cy="19" r="1.2" fill="currentColor" stroke="none" opacity="${on >= 1 ? 1 : 0.28}"/></svg>`;
};
