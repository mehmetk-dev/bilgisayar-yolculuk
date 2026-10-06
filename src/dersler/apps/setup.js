// Kurulum sihirbazı: İleri, İleri… ama dikkat: lisans, kurulum yeri ve "ek yazılım" kutucukları.
import { esc, progress } from './util.js';

const PRODUCTS = {
  viewer: { name: 'Resim Gösterici', icon: '🌄', app: 'viewer', extras: true },
  driver: { name: 'R-200 Yazıcı Sürücüsü', icon: '🖨', app: null, extras: false },
};

export function setup({ desk, body, args, emit, setTitle, close, dialogs }) {
  const node = desk.fs.get(args.node);
  const kind = node?.content?.setup || (/surucu/i.test(node?.name || '') ? 'driver' : 'viewer');
  const P = PRODUCTS[kind];
  setTitle(`${P.name} Kurulumu`);
  body.classList.add('su');
  const st = { page: 0, accept: false, extras: { toolbar: true, homepage: true }, shortcut: true, run: true };
  const pages = kind === 'viewer' ? ['welcome', 'license', 'folder', 'extras', 'ready', 'install', 'done'] : ['welcome', 'license', 'ready', 'install', 'done'];

  function render() {
    const p = pages[st.page];
    let h = '';
    if (p === 'welcome') h = `<h2>${P.name} Kurulum Sihirbazına hoş geldiniz</h2><p>Bu sihirbaz, <b>${P.name}</b> programını bilgisayarınıza kuracak.</p><p>Devam etmeden önce diğer programları kapatmanız önerilir.</p><p>Devam etmek için <b>İleri</b>'ye tıklayın.</p>`;
    if (p === 'license') h = `<h2>Lisans Sözleşmesi</h2><p>Lütfen aşağıdaki sözleşmeyi okuyun.</p><div class="su-lic">1. Bu program ücretsizdir ve kişisel kullanım içindir.<br>2. Program, izniniz olmadan kişisel bilgilerinizi paylaşmaz.<br>3. Program olduğu gibi sunulur…<br><br>(Sözleşmeler uzundur; önemli olan, kabul etmeden kurulumun ilerlemediğini bilmektir.)</div>
      <label class="su-opt"><input type="radio" name="acc" value="1" ${st.accept ? 'checked' : ''}> Sözleşmeyi <b>kabul ediyorum</b></label><label class="su-opt"><input type="radio" name="acc" value="0" ${st.accept ? '' : 'checked'}> Sözleşmeyi kabul etmiyorum</label>`;
    if (p === 'folder') h = `<h2>Kurulum yeri</h2><p>Program şu klasöre kurulacak:</p><div class="su-path"><input value="C:\\Program Files\\${P.name}" readonly><button type="button" disabled>Gözat…</button></div><p class="su-note">Çoğu zaman bu ayarı değiştirmenize gerek yoktur.</p>
      <label class="su-opt"><input type="checkbox" data-opt="shortcut" ${st.shortcut ? 'checked' : ''}> Masaüstüne kısayol oluştur</label>`;
    if (p === 'extras') h = `<h2>Ek bileşenler</h2><p>Önerilen ek yazılımlar:</p>
      <label class="su-opt su-trap"><input type="checkbox" data-extra="toolbar" ${st.extras.toolbar ? 'checked' : ''}> Hızlı Arama Araç Çubuğu'nu da kur <small>(önerilen)</small></label>
      <label class="su-opt su-trap"><input type="checkbox" data-extra="homepage" ${st.extras.homepage ? 'checked' : ''}> Tarayıcı ana sayfamı “Süper Arama” yap</label>
      <p class="su-small">Bu bileşenler isteğe bağlıdır ve kurulmaları gerekmez.</p>`;
    if (p === 'ready') h = `<h2>Kurulmaya hazır</h2><p><b>${P.name}</b> kurulmaya hazır. Başlamak için <b>Kur</b>'a tıklayın.</p>`;
    if (p === 'install') h = `<h2>Kuruluyor…</h2><div class="su-prog"></div>`;
    if (p === 'done') h = `<h2>Kurulum tamamlandı ✔</h2><p><b>${P.name}</b> bilgisayarınıza kuruldu.</p>${P.app ? `<label class="su-opt"><input type="checkbox" data-opt="run" ${st.run ? 'checked' : ''}> ${P.name}'yi şimdi çalıştır</label>` : ''}`;
    const nextLabel = p === 'ready' ? 'Kur' : p === 'done' ? 'Son' : 'İleri >';
    body.innerHTML = `<div class="su-side">${P.icon}</div><div class="su-main"><div class="su-content">${h}</div>
      <div class="su-btns">${st.page > 0 && p !== 'install' && p !== 'done' ? '<button type="button" data-b="back">< Geri</button>' : ''}
        ${p !== 'install' ? `<button type="button" data-b="next" class="primary" ${p === 'license' && !st.accept ? 'disabled' : ''}>${nextLabel}</button>` : ''}
        ${p !== 'install' && p !== 'done' ? '<button type="button" data-b="cancel">İptal</button>' : ''}</div></div>`;
    emit('setup-page', { page: p, product: kind });
    if (p === 'install') install();
  }

  async function install() {
    emit('setup-install', { product: kind, extras: Object.keys(st.extras).filter((k) => st.extras[k]) });
    await progress(body.querySelector('.su-prog'), 2600, kind === 'driver' ? 'Sürücü dosyaları kopyalanıyor…' : 'Dosyalar kopyalanıyor…');
    const s = desk.settings;
    if (P.app && !s.installed.includes(P.app)) s.installed.push(P.app);
    if (kind === 'viewer' && st.shortcut && !desk.fs.children('desktop').some((n) => n.app === 'viewer')) desk.fs.create('desktop', { type: 'link', name: P.name, app: 'viewer' });
    if (st.extras.toolbar && kind === 'viewer') desk.setSetting('toolbar', true);
    if (kind === 'driver') { s.driverR200 = true; if (!s.printers.includes('Renkli Yazıcı R-200 (Ağ)')) s.printers.push('Renkli Yazıcı R-200 (Ağ)'); }
    st.page++;
    render();
  }

  body.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-b]');
    if (!b || b.disabled) return;
    if (b.dataset.b === 'back') { st.page--; render(); return; }
    if (b.dataset.b === 'cancel') {
      const a = await dialogs.ask({ title: 'Kurulum', icon: '❓', text: 'Kurulumdan çıkmak istediğinizden emin misiniz?', buttons: [['yes', 'Evet', true], ['no', 'Hayır']] });
      if (a === 'yes') { emit('setup-cancel', { product: kind }); close(); }
      return;
    }
    if (pages[st.page] === 'done') {
      emit('setup-done', { product: kind, extras: Object.keys(st.extras).filter((k) => st.extras[k] && P.extras), shortcut: st.shortcut });
      close();
      if (P.app && st.run) desk.open(P.app);
      if (st.extras.toolbar && P.extras) desk.toast('Hızlı Arama Araç Çubuğu kuruldu', 'Ek bileşen kutucuklarını boşaltmadığınız için istemediğiniz bir araç çubuğu da kuruldu.', '😬', 8000);
      return;
    }
    st.page++;
    render();
  });
  body.addEventListener('change', (e) => {
    const t = e.target;
    if (t.name === 'acc') { st.accept = t.value === '1'; emit('setup-license', { accept: st.accept }); render(); }
    if (t.dataset.extra) { st.extras[t.dataset.extra] = t.checked; emit('setup-extra', { name: t.dataset.extra, checked: t.checked, all: Object.values(st.extras).some(Boolean) }); }
    if (t.dataset.opt) st[t.dataset.opt] = t.checked;
  });
  render();
  return { get page() { return pages[st.page]; } };
}

export { esc };
