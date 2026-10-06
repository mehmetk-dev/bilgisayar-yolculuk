// Fotoğraflar / Resim Gösterici, PDF okuyucu ve müzik çalar
import { esc, pictureURL, isImage, playTune } from './util.js';

function imageViewer(appName) {
  return ({ desk, body, args, emit, setTitle }) => {
    body.classList.add('pv');
    let node = args.node ? desk.fs.get(args.node) : null;
    let zoom = 1;
    const list = () => (node ? desk.fs.children(node.parent).filter((n) => isImage(n.name)) : []);
    function render() {
      if (!node) {
        const pics = desk.fs.children('pictures').filter((n) => isImage(n.name));
        setTitle(appName);
        body.innerHTML = `<div class="pv-gal"><h3>Resimler</h3><div class="pv-grid">${pics.map((n) => `<button type="button" data-id="${n.id}"><img src="${pictureURL(n.content)}" alt=""><span>${esc(n.name)}</span></button>`).join('') || '<p>Resimler klasörü boş.</p>'}</div></div>`;
        return;
      }
      setTitle(`${node.name} - ${appName}`);
      const l = list();
      body.innerHTML = `<div class="pv-bar"><button type="button" data-a="prev" ${l.length > 1 ? '' : 'disabled'}>◀</button><button type="button" data-a="out">－</button><span>%${Math.round(zoom * 100)}</span><button type="button" data-a="in">＋</button><button type="button" data-a="next" ${l.length > 1 ? '' : 'disabled'}>▶</button><button type="button" data-a="wall">🖼 Arka plan yap</button><button type="button" data-a="all">Tüm resimler</button></div>
        <div class="pv-img"><img src="${pictureURL(node.content)}" alt="${esc(node.name)}" style="transform:scale(${zoom})"></div>`;
    }
    body.addEventListener('click', (e) => {
      const p = e.target.closest('[data-id]');
      if (p) { node = desk.fs.get(p.dataset.id); zoom = 1; render(); emit('photo-open', { name: node.name }); return; }
      const a = e.target.closest('[data-a]')?.dataset.a;
      if (!a) return;
      const l = list(), i = l.findIndex((n) => n.id === node.id);
      if (a === 'next' || a === 'prev') { node = l[(i + (a === 'next' ? 1 : -1) + l.length) % l.length]; zoom = 1; emit('photo-open', { name: node.name }); }
      if (a === 'in') zoom = Math.min(3, zoom + 0.25);
      if (a === 'out') zoom = Math.max(0.25, zoom - 0.25);
      if (a === 'wall') { desk.settings.customWall = pictureURL(node.content); desk.setSetting('wallpaper', 'custom'); emit('wallpaper', { name: node.name, custom: true }); desk.toast('Arka plan değişti', `${esc(node.name)} masaüstü arka planı yapıldı.`, '🖼'); }
      if (a === 'all') node = null;
      if (a === 'in' || a === 'out') emit('photo-zoom', { zoom });
      render();
    });
    render();
    return { onArgs: (a) => { if (a.node) { node = desk.fs.get(a.node); render(); } } };
  };
}

export const photos = imageViewer('Fotoğraflar');
export const viewer = imageViewer('Resim Gösterici');

export function pdf({ desk, body, args, setTitle }) {
  const n = desk.fs.get(args.node);
  setTitle(`${n?.name || 'Belge'} - PDF Okuyucu`);
  body.classList.add('pdf');
  body.innerHTML = `<div class="pdf-page"><h2>📕 ${esc((n?.name || '').replace(/\.pdf$/i, ''))}</h2><p>Bu bir örnek PDF belgesidir. PDF dosyaları çoğunlukla fatura, broşür ve resmî yazılar için kullanılır; içindeki yazı değiştirilemez, sadece okunur ve yazdırılır.</p><div class="pdf-lines">${'<i></i>'.repeat(12)}</div></div>`;
  return {};
}

export function music({ desk, body, args, emit, setTitle }) {
  const n = args.node ? desk.fs.get(args.node) : null;
  setTitle(`${n?.name || 'Müzik'} - Müzik Çalar`);
  body.classList.add('mu');
  body.innerHTML = `<div class="mu-art">🎵</div><div class="mu-name">${esc(n?.name || 'türkü.mp3')}</div><button type="button" class="mu-play">▶ Çal</button><div class="mu-vol"></div>`;
  const vol = () => { const s = desk.settings; body.querySelector('.mu-vol').textContent = s.muted ? '🔇 Ses kapalı' : `🔊 Ses düzeyi: ${s.volume}`; };
  vol();
  body.querySelector('.mu-play').onclick = () => {
    const d = playTune(desk, [392, 392, 440, 392, 523, 494, 392, 392, 440, 392, 587, 523], 0.32);
    emit('music-play', { audible: d > 0, volume: desk.settings.volume, muted: desk.settings.muted });
    if (!d) desk.toast('Ses duyulmuyor', 'Ses kapalı ya da sıfırda. Görev çubuğundaki 🔊 simgesinden açabilirsiniz.', '🔇');
  };
  return { onSettings: vol };
}
