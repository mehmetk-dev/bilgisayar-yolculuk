// Masadaki modem ve telefonun “Kişisel Erişim Noktası”: internet kesilmesi dersleri için masaüstünün köşesinde çizilir.
// Modem: Power, DSL, Internet, WLAN, LAN ışıkları; arkadaki düğmeyle kapatıp açmak (10 saniye kuralı).
// Telefon: erişim noktası açılınca Wi-Fi listesinde telefonun ağı görünür; bilgisayar telefonun internetini kullanır.
import { esc } from './util.js';

export const HOTSPOT = { name: 'Ahmet\'in telefonu', lock: true, pass: 'telefon123', bars: 3, phone: true };

export const LEDS = [
  ['power', 'Power', 'Modemin elektriği var mı? Yanmıyorsa fiş takılı değil ya da düğme kapalı.'],
  ['dsl', 'DSL', 'Telefon / fiber hattından sinyal geliyor mu? Yanıp sönüyorsa hattı arıyor; sürekli yanıyorsa hat tamam.'],
  ['internet', 'Internet', 'İnternet sağlayıcınıza bağlanabildi mi? Yeşilse internet var; sönük ya da kırmızıysa internet yok.'],
  ['wlan', 'WLAN', 'Kablosuz (Wi-Fi) yayın açık mı? Yanıp sönmesi veri gidip geldiğini gösterir.'],
  ['lan', 'LAN', 'Kabloyla bağlı bilgisayar var mı?'],
];

// Bilgisayar internete çıkabiliyor mu? (Ev ağına bağlıysa modemin interneti olmalı; telefonun ağına bağlıysa telefon yeter)
export function online(desk) {
  const s = desk.settings;
  if (!s.wifi || !s.network || s.airplane) return false;
  if (s.network === HOTSPOT.name) return !!desk.hotspot;
  return !s.noInternet;
}

// fault: 'reset' → kapatıp 10 saniye bekleyip açınca düzelir
export function modemPanel(desk, { fault = 'reset' } = {}) {
  desk.screen.querySelector('.dk-modem')?.remove();
  const m = desk.modem = { on: true, booting: false, fault, offAt: 0, lit: { power: 'on', dsl: 'on', internet: fault ? 'red' : 'on', wlan: 'blink', lan: 'off' } };
  desk.settings.netSim = true;
  if (fault) desk.settings.noInternet = true;
  desk.applySettings();
  const el = document.createElement('div');
  el.className = 'dk-modem';
  desk.screen.append(el);
  let timer = 0;
  let small = false; // küçültülünce yalnızca küçük bir düğme kalır (pencereleri kapatmasın)
  const draw = () => {
    if (small) { el.innerHTML = '<button type="button" class="dk-chip" data-big="1">📟 Modem ▴</button>'; return; }
    const off = !m.on && !m.booting;
    const secs = off ? Math.floor((Date.now() - m.offAt) / 1000) : 0;
    el.innerHTML = `<div class="mo-box"><div class="mo-brand">MODEM <button type="button" class="dk-mini" data-small="1" title="Küçült">▾</button></div><div class="mo-leds">${LEDS.map(([id, l]) => `<button type="button" class="mo-led" data-led="${id}" title="${esc(l)}"><i class="${m.lit[id]}"></i><span>${l}</span></button>`).join('')}</div></div>
      <div class="mo-back"><button type="button" class="mo-pwr" title="Modemin arkasındaki açma/kapama düğmesi">⏻</button><small>${m.booting ? 'Açılıyor…' : off ? `Kapalı · ${secs} sn` : 'Arkadaki düğme'}</small></div>
      <div class="mo-say" hidden></div>`;
  };
  const tick = () => { if (!m.on && !m.booting) { const sm = el.querySelector('.mo-back small'); if (sm) sm.textContent = `Kapalı · ${Math.floor((Date.now() - m.offAt) / 1000)} sn`; } };
  timer = setInterval(tick, 500);
  draw();
  el.addEventListener('click', (e) => {
    if (e.target.closest('[data-small], [data-big]')) { small = !!e.target.closest('[data-small]'); draw(); return; }
    const led = e.target.closest('[data-led]');
    if (led) {
      const d = LEDS.find((x) => x[0] === led.dataset.led);
      const say = el.querySelector('.mo-say');
      say.hidden = false;
      say.innerHTML = `<b>${d[1]}</b>: ${d[2]}`;
      desk.emit('modem-led', { id: d[0], state: m.lit[d[0]] });
      return;
    }
    if (!e.target.closest('.mo-pwr') || m.booting) return;
    if (m.on) {
      m.on = false;
      m.offAt = Date.now();
      for (const k of Object.keys(m.lit)) m.lit[k] = 'off';
      desk.settings.noInternet = true;
      desk.applySettings();
      draw();
      desk.emit('modem-power', { on: false });
      return;
    }
    const waited = Date.now() - m.offAt;
    m.booting = true;
    m.lit.power = 'on';
    draw();
    desk.emit('modem-power', { on: true, waited });
    // Açılış: önce DSL ışığı yanıp söner (hattı arar), sonra sabitlenir; ardından Internet ışığı
    setTimeout(() => { if (desk.modem !== m) return; m.lit.dsl = 'blink'; m.lit.wlan = 'blink'; draw(); }, 600);
    setTimeout(() => { if (desk.modem !== m) return; m.lit.dsl = m.fault === 'line' ? 'off' : 'on'; draw(); }, 3200);
    setTimeout(() => {
      if (desk.modem !== m) return;
      m.booting = false;
      m.on = true;
      const fixed = !m.fault || (m.fault === 'reset' && waited >= 10000);
      if (fixed) m.fault = null;
      m.lit.internet = fixed ? 'on' : 'red';
      desk.settings.noInternet = !fixed;
      desk.applySettings();
      draw();
      desk.wins.forEach((w) => w.api?.onSettings?.());
      desk.emit('modem-ready', { internet: fixed, waited });
    }, 6000);
  });
  // Arıza: 'reset' (kapatıp açınca düzelir), 'line' (hat kopuk: DSL sönük, kapatıp açmak işe yaramaz), null (sorun yok)
  m.setFault = (f) => {
    m.fault = f;
    if (m.on) { m.lit.dsl = f === 'line' ? 'off' : 'on'; m.lit.internet = f ? 'red' : 'on'; }
    desk.settings.noInternet = !!f || !m.on;
    desk.applySettings();
    draw();
    desk.wins.forEach((w) => w.api?.onSettings?.());
  };
  m.remove = () => { clearInterval(timer); el.remove(); };
  return m;
}

// Telefonun ekranı: Kişisel Erişim Noktası anahtarı, ağ adı ve şifresi
export function hotspotPhone(desk) {
  desk.screen.querySelector('.dk-hotspot')?.remove();
  const el = document.createElement('div');
  el.className = 'dk-phone dk-hotspot';
  desk.screen.append(el);
  let small = false;
  const draw = () => {
    const on = !!desk.hotspot;
    if (small) { el.innerHTML = `<button type="button" class="dk-chip" data-big="1">📱 Telefon${on ? ' · erişim noktası açık' : ''} ▴</button>`; return; }
    el.innerHTML = `<button type="button" class="dk-mini" data-small="1" title="Telefonu küçült">▾ Küçült</button><div class="ph-body"><div class="ph-notch"></div><div class="ph-screen">
      <div class="ph-time">📶 4.5G 🔋</div><div class="hs-card"><b>Kişisel Erişim Noktası</b><small>Telefonunuzun mobil internetini başka cihazlarla paylaşır</small>
      <label class="hs-sw"><input type="checkbox" ${on ? 'checked' : ''}><span>${on ? 'Açık' : 'Kapalı'}</span></label>
      ${on ? `<div class="hs-info">Ağ adı: <b>${esc(HOTSPOT.name)}</b><br>Şifre: <b>${HOTSPOT.pass}</b></div><small class="hs-warn">Mobil veri (GB) paketinizden harcar.</small>` : ''}</div></div></div>`;
  };
  draw();
  el.addEventListener('click', (e) => { if (e.target.closest('[data-small], [data-big]')) { small = !!e.target.closest('[data-small]'); draw(); } });
  el.addEventListener('change', (e) => {
    if (!e.target.matches('.hs-sw input')) return;
    desk.hotspot = e.target.checked;
    if (!desk.hotspot && desk.settings.network === HOTSPOT.name) desk.settings.network = null;
    desk.applySettings();
    draw();
    desk.wins.forEach((w) => w.api?.onSettings?.());
    desk.emit('hotspot', { on: desk.hotspot });
  });
  return { remove: () => el.remove() };
}
