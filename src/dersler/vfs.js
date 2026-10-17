// Benzetim bilgisayarın dosya sistemi. Gerçek diske dokunmaz; her şey bellekte durur.
// Düğüm: { id, name, type: 'folder'|'file'|'link', parent, content?, app?, deletedFrom? }

export const ROOTS = [
  ['desktop', 'Masaüstü', '🖥'],
  ['docs', 'Belgeler', '📄'],
  ['downloads', 'İndirilenler', '⬇'],
  ['pictures', 'Resimler', '🖼'],
  ['music', 'Müzik', '🎵'],
];
export const RECYCLE = 'recycle';
export const USB = 'usb';
export const PHONE = 'phone';

const BAD_CHARS = /[\\/:*?"<>|]/;
const lower = (s) => s.toLocaleLowerCase('tr');

function seed() {
  return [
    ['desktop', 'link', 'Not Defteri', { app: 'notepad' }],
    ['desktop', 'link', 'Hesap Makinesi', { app: 'calc' }],
    ['desktop', 'link', 'Paint', { app: 'paint' }],
    ['desktop', 'link', 'İnternet', { app: 'browser' }],
    ['docs', 'file', 'alışveriş listesi.txt', { content: 'Ekmek\nSüt\nYumurta\nPeynir\nDomates' }],
    ['docs', 'file', 'telefon numaraları.txt', { content: 'Ahmet amca: 0555 000 11 22\nEczane: 0212 000 33 44\nTorunum Elif: 0555 000 55 66' }],
    ['docs', 'folder', 'Faturalar', {}],
    ['downloads', 'file', 'kampanya broşürü.pdf', {}],
    ['pictures', 'file', 'tatil.jpg', { content: { emoji: '🏖', bg: ['#4fc3f7', '#ffe082'] } }],
    ['pictures', 'file', 'çiçekler.jpg', { content: { emoji: '🌻', bg: ['#aed581', '#fff59d'] } }],
    ['pictures', 'file', 'kedimiz.jpg', { content: { emoji: '🐈', bg: ['#ffccbc', '#d7ccc8'] } }],
    ['music', 'file', 'türkü.mp3', {}],
    ['pictures', 'file', 'torunumun düğünü.mp4', { content: { emoji: '💒', bg: ['#f8bbd0', '#fff9c4'], video: true }, size: 850e6 }],
    ['downloads', 'file', 'tatil fotoğrafları.zip', { content: { zip: [
      { name: 'deniz.jpg', type: 'file', content: { emoji: '🌊', bg: ['#4fc3f7', '#01579b'] } },
      { name: 'kumsal.jpg', type: 'file', content: { emoji: '🏖', bg: ['#ffe082', '#4fc3f7'] } },
      { name: 'akşam yemeği.jpg', type: 'file', content: { emoji: '🍽', bg: ['#ffccbc', '#8d6e63'] } },
      { name: 'otel.jpg', type: 'file', content: { emoji: '🏨', bg: ['#b3e5fc', '#90a4ae'] } },
    ] } }],
  ];
}

export class VFS {
  constructor() {
    this.listeners = [];
    this.reset();
  }

  onChange(fn) { this.listeners.push(fn); }
  changed(op, node) { this.listeners.forEach((fn) => fn(op, node)); }

  reset() {
    this.nodes = {};
    this.seq = 1;
    for (const [id, name] of ROOTS) this.nodes[id] = { id, name, type: 'folder', parent: null, root: true };
    this.nodes[RECYCLE] = { id: RECYCLE, name: 'Geri Dönüşüm Kutusu', type: 'folder', parent: null, root: true };
    this.seeding = true;
    for (const [p, type, name, extra] of seed()) this.create(p, { type, name, ...extra }, true);
    const fat = this.find('docs', 'Faturalar');
    this.create(fat.id, { type: 'file', name: 'elektrik faturası.pdf' }, true);
    this.create(fat.id, { type: 'file', name: 'su faturası.pdf' }, true);
    this.seeding = false;
    this.usb = false;
    this.phone = false;
    this.changed('reset');
  }

  get(id) { return this.nodes[id]; }
  label(id) { return this.nodes[id]?.name ?? ''; }

  children(id) {
    return Object.values(this.nodes)
      .filter((n) => n.parent === id)
      .sort((a, b) => (a.type === 'folder' ? 0 : 1) - (b.type === 'folder' ? 0 : 1) || a.name.localeCompare(b.name, 'tr'));
  }

  find(parent, name) { return this.children(parent).find((n) => lower(n.name) === lower(name)); }
  findPath(path) {
    let cur = null;
    for (const part of path.split('/')) {
      cur = cur ? this.find(cur.id, part) : this.nodes[part];
      if (!cur) return null;
    }
    return cur;
  }

  path(id) {
    const out = [];
    for (let n = this.nodes[id]; n; n = this.nodes[n.parent]) out.unshift(n);
    return out;
  }

  isInside(id, ancestor) { return this.path(id).some((n) => n.id === ancestor); }
  inRecycle(id) { return this.isInside(id, RECYCLE); }

  uniqueName(parent, name, except) {
    const m = name.match(/^(.*?)(\.[^.]+)?$/);
    const base = m[1], ext = m[2] || '';
    let n = name, i = 2;
    while (this.children(parent).some((c) => c.id !== except && lower(c.name) === lower(n))) n = `${base} (${i++})${ext}`;
    return n;
  }

  create(parent, { type, name, content, app, size, mtime }, quiet) {
    const id = 'n' + this.seq++;
    // Ders başında gelen dosyaların tarihleri geçmişe yayılır (ayrıntılar görünümünde sıralama anlamlı olsun)
    const node = { id, type, parent, name: this.uniqueName(parent, name), content, app, size, mtime: mtime || (quiet && this.seeding ? Date.now() - (this.seq * 7919 % 90) * 86400e3 - this.seq * 3600e3 : Date.now()) };
    this.nodes[id] = node;
    if (!quiet) this.changed('create', node);
    return node;
  }

  checkName(name) {
    const n = name.trim();
    if (!n) return 'Ad boş olamaz.';
    if (BAD_CHARS.test(n)) return 'Adda şu işaretler olamaz:  \\ / : * ? " < > |';
    return '';
  }

  rename(id, name) {
    const node = this.nodes[id];
    const err = this.checkName(name);
    if (err) return err;
    name = name.trim();
    if (this.children(node.parent).some((c) => c.id !== id && lower(c.name) === lower(name))) return `Bu klasörde “${name}” adında başka bir öğe var.`;
    const old = node.name;
    node.name = name;
    this.changed('rename', { ...node, old });
    return '';
  }

  move(id, parent) {
    const node = this.nodes[id];
    if (!node || node.root) return 'Bu öğe taşınamaz.';
    if (node.parent === parent) return '';
    if (id === parent || this.isInside(parent, id)) return 'Bir klasör kendi içine taşınamaz.';
    if (parent === RECYCLE) return this.remove(id);
    const from = node.parent;
    node.parent = parent;
    node.name = this.uniqueName(parent, node.name, id);
    delete node.deletedFrom;
    this.changed('move', { ...node, from });
    return '';
  }

  copy(id, parent) {
    const src = this.nodes[id];
    const node = this.create(parent, { type: src.type, name: src.name, content: structuredClone(src.content), app: src.app, size: src.size, mtime: src.mtime }, true);
    for (const c of this.children(id)) this.copy(c.id, node.id);
    this.changed('copy', { ...node, src: id });
    return node;
  }

  remove(id) {
    const node = this.nodes[id];
    if (!node || node.root) return 'Bu öğe silinemez.';
    if (this.inRecycle(id)) return this.purge(id);
    node.deletedFrom = node.parent;
    node.parent = RECYCLE;
    node.name = this.uniqueName(RECYCLE, node.name, id);
    this.changed('delete', node);
    return '';
  }

  restore(id) {
    const node = this.nodes[id];
    if (!node?.deletedFrom) return 'Geri yüklenemedi.';
    const to = this.nodes[node.deletedFrom] ? node.deletedFrom : 'desktop';
    node.parent = to;
    node.name = this.uniqueName(to, node.name, id);
    delete node.deletedFrom;
    this.changed('restore', node);
    return '';
  }

  purge(id, quiet) {
    for (const c of this.children(id)) this.purge(c.id, true);
    const node = this.nodes[id];
    delete this.nodes[id];
    if (!quiet) this.changed('purge', node);
    return '';
  }

  emptyRecycle() {
    for (const c of this.children(RECYCLE)) this.purge(c.id, true);
    this.changed('empty');
  }

  write(parent, name, content) {
    const f = this.find(parent, name);
    if (f) { f.content = content; f.mtime = Date.now(); delete f.size; this.changed('write', f); return f; }
    const n = this.create(parent, { type: 'file', name, content }, true);
    this.changed('write', n);
    return n;
  }

  // Dosyanın boyutu (bayt): klasörde içindekilerin toplamı; içerik türüne göre makul bir tahmin
  sizeOf(id) {
    const n = typeof id === 'object' ? id : this.nodes[id];
    if (!n) return 0;
    if (n.size != null) return n.size;
    if (n.children) return n.children.reduce((s, c) => s + this.sizeOf(c), 0);
    if (n.type === 'folder') return this.children(n.id).reduce((s, c) => s + this.sizeOf(c), 0);
    if (n.type === 'link') return 1024;
    const c = n.content;
    if (typeof c === 'string') return c.startsWith('data:') ? Math.round(c.length * 0.75) : new Blob([c]).size;
    if (c?.zip) return Math.round(c.zip.reduce((s, x) => s + this.sizeOf(x), 0) * 0.85);
    if (c?.w && c?.h) return Math.round(c.w * c.h * (/\.png$/i.test(n.name) ? 1.1 : 0.4)); // telefon fotoğrafı ya da küçültülmüş resim
    if (c?.emoji) return 2.1e6 + (n.name.length * 104729 % 1.4e6);
    if (c?.html) return 14e3 + c.html.length * 2;
    if (c?.cells) return 9e3 + JSON.stringify(c).length;
    if (/\.pdf$/i.test(n.name)) return 186e3;
    if (/\.mp3$/i.test(n.name)) return 4.2e6;
    if (/\.exe$/i.test(n.name)) return 12.6e6;
    return 2048;
  }

  // Sıkıştırma: klasör ya da dosyayı .zip dosyasına çevirir (aslı yerinde kalır)
  zipOf(id) {
    const n = this.nodes[id];
    return n.type === 'folder' ? { name: n.name, type: 'folder', children: this.children(id).map((c) => this.zipOf(c.id)) } : { name: n.name, type: 'file', content: structuredClone(n.content), size: n.size };
  }
  compress(ids, parent, name) {
    const node = this.create(parent, { type: 'file', name, content: { zip: ids.map((i) => this.zipOf(i)) } }, true);
    this.changed('create', node);
    return node;
  }
  // Ayıklama: .zip dosyasının içindekileri yeni bir klasöre çıkarır
  extract(id, parent, folderName) {
    const z = this.nodes[id]?.content?.zip;
    if (!z) return null;
    const put = (items, into) => items.forEach((x) => {
      const n = this.create(into, { type: x.type, name: x.name, content: structuredClone(x.content), size: x.size }, true);
      if (x.children) put(x.children, n.id);
    });
    const f = this.create(parent, { type: 'folder', name: folderName }, true);
    put(z, f.id);
    this.changed('create', f);
    return f;
  }

  search(text) {
    const t = lower(text.trim());
    if (!t) return [];
    return Object.values(this.nodes).filter((n) => !n.root && !this.inRecycle(n.id) && lower(n.name).includes(t));
  }

  plugUsb(on) {
    if (on === this.usb) return;
    this.usb = on;
    if (on) {
      this.nodes[USB] = { id: USB, name: 'USB Bellek (E:)', type: 'folder', parent: null, root: true, drive: true };
      this.create(USB, { type: 'file', name: 'okul fotoğrafı.jpg', content: { emoji: '🏫', bg: ['#90caf9', '#e1bee7'] } }, true);
    } else {
      this.purge(USB, true);
    }
    this.changed('usb', { on });
  }

  // Telefon (dosya aktarımı modunda): Dahili depolama › DCIM › Kamera içinde fotoğraflar
  plugPhone(on) {
    if (on === this.phone) return;
    this.phone = on;
    if (on) {
      this.nodes[PHONE] = { id: PHONE, name: 'Telefonum', type: 'folder', parent: null, root: true, drive: true };
      const ic = this.create(PHONE, { type: 'folder', name: 'Dahili depolama' }, true);
      const dcim = this.create(ic.id, { type: 'folder', name: 'DCIM' }, true);
      const cam = this.create(dcim.id, { type: 'folder', name: 'Kamera' }, true);
      [['🎂', '#ffcdd2', '#ce93d8'], ['👶', '#fff9c4', '#b3e5fc'], ['🌳', '#c8e6c9', '#81d4fa'], ['🍲', '#ffe0b2', '#ffab91'], ['🐦', '#b3e5fc', '#e1f5fe'], ['🌅', '#ffcc80', '#5c6bc0']]
        .forEach(([e, a, b], i) => this.create(cam.id, { type: 'file', name: `IMG_2026100${i + 1}_${['0912', '1130', '1544', '1902', '0805', '1817'][i]}.jpg`, content: { emoji: e, bg: [a, b] } }, true));
      this.create(ic.id, { type: 'folder', name: 'Download' }, true);
      this.create(ic.id, { type: 'folder', name: 'Music' }, true);
    } else this.purge(PHONE, true);
    this.changed('phone', { on });
  }

  // Dosya kaydetme/açma pencerelerinin beklediği arayüz
  dialogApi() {
    const roots = () => [...ROOTS, ...(this.usb ? [[USB, 'USB Bellek (E:)', '💾']] : []), ...(this.phone ? [[PHONE, 'Telefonum', '📱']] : [])];
    return {
      folders: () => roots().map(([id, label, icon]) => ({ id, label, icon })),
      list: (id) => this.children(id).filter((n) => n.type !== 'link').map((n) => ({ id: n.id, name: n.name, folder: n.type === 'folder' })),
      label: (id) => this.label(id),
      read: (id, name) => this.find(id, name)?.content ?? null,
      write: (id, name, content) => this.write(id, name, content),
    };
  }
}
