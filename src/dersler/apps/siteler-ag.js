// 8. hafta ek sitesi (uydurma): internet hız testi. İndirme / yükleme hızı (Mbps) ve gecikme (ping) ölçülür;
// sonuçların ne anlama geldiği sade bir dille yazılır.
import { HOTSPOT } from './modem.js';

export const HIZ_HOST = 'www.hiztesti.com.tr';
const fmt = (n) => n.toLocaleString('tr-TR', { maximumFractionDigits: 1 });

const HIZ = {
  name: 'Hız Testi', secure: true,
  render(path, q, ctx) {
    const r = ctx.state.result;
    const res = r ? `<div class="ht-res"><div><small>⬇ İndirme</small><b>${fmt(r.down)}</b><span>Mbps</span></div><div><small>⬆ Yükleme</small><b>${fmt(r.up)}</b><span>Mbps</span></div><div><small>⏱ Gecikme (ping)</small><b>${r.ping}</b><span>ms</span></div></div>
      <p class="ht-via">Bağlantı: <b>${r.phone ? '📱 ' + HOTSPOT.name + ' (mobil veri)' : '📶 EvAğı (ev interneti)'}</b></p>
      <div class="ht-exp"><b>Ne demek?</b><ul><li><b>İndirme</b>: internetten size gelen hız. Görüntülü görüşme için 3 Mbps, film için 5 Mbps, çok net (4K) film için 25 Mbps yeter.</li>
        <li><b>Yükleme</b>: sizden internete giden hız (fotoğraf gönderme, görüntülü görüşmede kameranız).</li><li><b>Ping</b>: tepki süresi. Küçük olması iyidir; 100 ms'nin altı rahattır.</li></ul></div>
      <p><button type="button" class="ht-go small" data-act="start">⟳ Yeniden ölç</button></p>` : '';
    return { title: 'Hız Testi', html: `<div class="wp ht"><header class="ht-head">⚡ hiztesti<span>İnternet hızınızı ölçün</span></header>
      <div class="ht-main">${r ? res : '<button type="button" class="ht-go" data-act="start">BAŞLA</button><p class="ht-note">Ölçüm sırasında başka bir şey indirmeyin.</p>'}</div></div>` };
  },
  act(a, v, ctx, el) {
    if (a !== 'start' || ctx.state.running) return;
    ctx.state.running = true;
    const phone = ctx.desk.settings.network === HOTSPOT.name;
    const r = phone ? { down: 18.4, up: 6.2, ping: 41, phone } : { down: 48.7, up: 9.8, ping: 18, phone };
    const main = el.closest('.ht').querySelector('.ht-main');
    main.innerHTML = '<div class="ht-gauge"><b class="ht-num">0</b><span>Mbps</span><small class="ht-what">İndirme ölçülüyor…</small></div>';
    const num = main.querySelector('.ht-num'), what = main.querySelector('.ht-what');
    const t0 = Date.now();
    const id = setInterval(() => {
      const t = (Date.now() - t0) / 1000;
      if (!num.isConnected) { clearInterval(id); ctx.state.running = false; return; }
      if (t < 2.4) num.textContent = fmt(r.down * Math.min(1, t / 1.6) * (0.92 + Math.random() * 0.12));
      else if (t < 4) { what.textContent = 'Yükleme ölçülüyor…'; num.textContent = fmt(r.up * (0.9 + Math.random() * 0.15)); }
      else {
        clearInterval(id);
        ctx.state.running = false;
        ctx.state.result = r;
        ctx.refresh();
        ctx.emit('speed-test', { down: r.down, up: r.up, ping: r.ping, phone });
      }
    }, 120);
  },
};

export const AG_SITES = { [HIZ_HOST]: HIZ };
