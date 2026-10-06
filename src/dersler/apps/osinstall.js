// İşletim sistemi kurulumu (gösterim). Gerçek kurulumun ekranlarını sırayla canlandırır.
import { esc, progress, wait } from './util.js';

export const OS_SCREENS = ['boot', 'lang', 'install', 'key', 'edition', 'license', 'type', 'disk', 'copy', 'region', 'keyboard', 'keyboard2', 'network', 'name', 'pin', 'privacy', 'final'];

export function osInstall(desk) {
  const o = desk.overEl;
  desk.closeAll();
  desk.closeMenus();
  desk.power = 'os';
  o.hidden = false;
  o.className = 'dk-over pw-os';
  const st = { i: 0, edition: null, accept: false, type: null, disk: false, net: false, name: '', pin: '' };
  const emit = (type, data = {}) => desk.emit(type, data);

  const win = (title, inner, btns = '') => `<div class="os-win"><div class="os-title">${title}</div><div class="os-body">${inner}</div><div class="os-btns">${btns}</div></div>`;
  const oobe = (title, inner, btns) => `<div class="os-oobe"><div class="os-oobe-card"><h2>${title}</h2>${inner}<div class="os-btns">${btns}</div></div></div>`;
  const next = (label = 'İleri', dis = false) => `<button type="button" class="os-next primary" ${dis ? 'disabled' : ''}>${label}</button>`;

  function render() {
    const id = OS_SCREENS[st.i];
    let h = '';
    switch (id) {
      case 'boot': h = '<div class="os-boot">USB bellekten başlatmak için bir tuşa basın…<br><small>(Ekrana tıklayın ya da bir tuşa basın)</small></div>'; break;
      case 'lang': h = win('Windows Kurulumu', `<label>Yüklenecek dil: <select><option>Türkçe</option></select></label><label>Saat ve para birimi biçimi: <select><option>Türkçe (Türkiye)</option></select></label><label>Klavye veya giriş yöntemi: <select><option>Türkçe Q</option><option>Türkçe F</option></select></label>`, next()); break;
      case 'install': h = win('Windows Kurulumu', '<div class="os-center"><button type="button" class="os-big os-next">Şimdi yükle</button><p><a class="os-link" data-no="1">Bilgisayarınızı onarın</a></p></div>'); break;
      case 'key': h = win('Windows\'u etkinleştirin', `<p>Ürün anahtarınızı girin. Anahtar, Windows'u satın aldığınızda verilen 25 karakterlik koddur.</p><input class="os-key" placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"><p><a class="os-link os-nokey">Ürün anahtarım yok</a></p><div class="os-err"></div>`, next()); break;
      case 'edition': h = win('Yüklemek istediğiniz işletim sistemini seçin', `<div class="os-list">${['Windows 11 Home', 'Windows 11 Pro', 'Windows 11 Education'].map((e) => `<button type="button" data-ed="${e}" class="${st.edition === e ? 'on' : ''}">${e}</button>`).join('')}</div><p class="os-small">Ev bilgisayarları için genellikle <b>Home</b> seçilir.</p>`, next('İleri', !st.edition)); break;
      case 'license': h = win('Geçerli bildirimler ve lisans koşulları', `<div class="os-lic">Bu yazılımı kullanarak lisans koşullarını kabul etmiş olursunuz…</div><label class="os-chk"><input type="checkbox" class="os-acc" ${st.accept ? 'checked' : ''}> Lisans koşullarını <b>kabul ediyorum</b></label>`, next('İleri', !st.accept)); break;
      case 'type': h = win('Ne tür bir yükleme istiyorsunuz?', `<button type="button" class="os-opt" data-type="up"><b>Yükseltme:</b> Windows'u yükleyin ve dosyaları, ayarları, uygulamaları koruyun</button><button type="button" class="os-opt" data-type="custom"><b>Özel:</b> Yalnızca Windows'u yükleyin (gelişmiş)</button><div class="os-err"></div>`); break;
      case 'disk': h = win('Windows\'u nereye yüklemek istiyorsunuz?', `<table class="os-disk"><tr><th>Ad</th><th>Toplam boyut</th><th>Boş alan</th></tr><tr data-disk="1" class="${st.disk ? 'on' : ''}"><td>🖴 Sürücü 0 Ayrılmamış Alan</td><td>476,9 GB</td><td>476,9 GB</td></tr></table><p class="os-warn">⚠ Dikkat: Var olan bir bölümü <b>biçimlendirmek</b> (silmek) içindeki her şeyi siler. Kurulumdan önce fotoğraflarınızı ve belgelerinizi mutlaka yedekleyin.</p>`, next('İleri', !st.disk)); break;
      case 'copy': h = win('Windows yükleniyor', '<div class="os-steps"><p>Durum</p><div class="os-prog"></div><p class="os-small">Bilgisayarınız birkaç kez yeniden başlatılabilir. Bu biraz zaman alabilir.</p></div>'); break;
      case 'region': h = oobe('Bu doğru ülke veya bölge mi?', `<div class="os-list">${['Türkiye', 'Almanya', 'Azerbaycan', 'Kıbrıs'].map((r, i) => `<button type="button" class="${i ? '' : 'on'}">${r}</button>`).join('')}</div>`, next('Evet')); break;
      case 'keyboard': h = oobe('Bu doğru klavye düzeni mi?', `<div class="os-list">${['Türkçe Q', 'Türkçe F', 'ABD (US)'].map((r, i) => `<button type="button" class="${i ? '' : 'on'}">${r}</button>`).join('')}</div><p class="os-small">Klavyenizin harfleri Q W E R T Y diye başlıyorsa <b>Türkçe Q</b>'dur.</p>`, next('Evet')); break;
      case 'keyboard2': h = oobe('İkinci bir klavye düzeni eklemek istiyor musunuz?', '<p>Çoğu kişinin ikinci bir düzene ihtiyacı olmaz.</p>', '<button type="button" class="os-skip">Atla</button><button type="button" disabled>Düzen ekle</button>'); break;
      case 'network': h = oobe('Sizi bir ağa bağlayalım', `<div class="os-list">${st.net ? '<button type="button" class="on">📶 EvAğı — Bağlandı</button>' : `<button type="button" class="os-net">📶 EvAğı 🔒</button>${st.netOpen ? '<div class="os-pw"><input type="password" class="os-netpw" placeholder="Ağ güvenlik anahtarı"><button type="button" class="os-netgo">Bağlan</button><small>Alıştırma şifresi: evagi2024</small><div class="os-err"></div></div>' : ''}<button type="button" disabled>📶 Komşu_5G 🔒</button>`}</div>`, next('İleri', !st.net)); break;
      case 'name': h = oobe('Bu cihazı kim kullanacak?', `<input class="os-name" placeholder="Adınız" value="${esc(st.name)}" maxlength="20"><p class="os-small">Bu ad, oturum açma ekranında görünecek.</p>`, next('İleri', !st.name.trim())); break;
      case 'pin': h = oobe('PIN oluşturun', '<p>Bilgisayarı açarken şifre yerine kullanacağınız en az 4 rakamlık bir PIN belirleyin. <b>Unutmayacağınız ama başkalarının tahmin edemeyeceği</b> bir sayı seçin (doğum yılınız olmasın).</p><input class="os-pin" type="password" inputmode="numeric" placeholder="Yeni PIN"><input class="os-pin2" type="password" inputmode="numeric" placeholder="PIN\'i onaylayın"><div class="os-err"></div>', next('Tamam')); break;
      case 'privacy': h = oobe('Cihazınız için gizlilik ayarlarını seçin', `${['Konum', 'Cihazımı bul', 'Tanılama verileri', 'Kişiselleştirilmiş reklamlar'].map((p, i) => `<label class="os-tog"><span>${p}</span><input type="checkbox" ${i < 2 ? 'checked' : ''}></label>`).join('')}<p class="os-small">Bu ayarları daha sonra Ayarlar'dan değiştirebilirsiniz.</p>`, next('Kabul et')); break;
      case 'final': h = '<div class="os-final"><h2>Merhaba!</h2><p>Her şeyi hazırlıyoruz… Bu birkaç dakika sürebilir.<br><b>Bilgisayarınızı kapatmayın.</b></p><div class="pw-spin"><i></i><i></i><i></i><i></i><i></i></div></div>'; break;
    }
    o.innerHTML = h;
    emit('os-screen', { screen: id, index: st.i });
    if (id === 'copy') copy();
    if (id === 'final') finish();
    o.querySelector('.os-name')?.addEventListener('input', (e) => { st.name = e.target.value; o.querySelector('.os-next').disabled = !st.name.trim(); });
    setTimeout(() => o.querySelector('input:not([type=checkbox])')?.focus(), 30);
  }

  async function copy() {
    await progress(o.querySelector('.os-prog'), 3600, 'Windows dosyaları kopyalanıyor · Özellikler yükleniyor · Güncelleştirmeler yükleniyor');
    o.querySelector('.os-steps').insertAdjacentHTML('beforeend', '<p><b>Windows\'un yeniden başlatılması gerekiyor…</b></p>');
    await wait(1400);
    st.i++;
    render();
  }

  async function finish() {
    await wait(2600);
    if (st.name.trim()) desk.settings.user = st.name.trim();
    if (st.pin) desk.settings.password = st.pin;
    desk.setPower('desktop');
    desk.applySettings();
    emit('os-done', { user: desk.settings.user });
  }

  const err = (t) => { const e = o.querySelector('.os-err'); if (e) e.textContent = t; };
  const go = () => { st.i++; render(); };

  // Özellik olarak atıyoruz ki gösterim yeniden başlatılınca dinleyiciler birikmesin
  o.onclick = (e) => {
    if (desk.power !== 'os') return;
    const id = OS_SCREENS[st.i];
    if (id === 'boot') return go();
    const t = e.target;
    if (t.closest('.os-nokey')) { emit('os-nokey'); return go(); }
    if (t.closest('[data-no]')) { emit('os-wrong', { what: 'repair' }); desk.toast('Kurulum', 'Bu seçenek, bozulmuş bir Windows\'u onarmak içindir. Yeni kurulum için “Şimdi yükle”yi seçin.', 'ℹ'); return; }
    const ed = t.closest('[data-ed]');
    if (ed) { st.edition = ed.dataset.ed; emit('os-edition', { edition: st.edition }); return render(); }
    const ty = t.closest('[data-type]');
    if (ty) {
      if (ty.dataset.type === 'up') { emit('os-wrong', { what: 'upgrade' }); err('Yükseltme, ancak bilgisayarda zaten Windows varken çalışır. Temiz kurulum için “Özel”i seçin.'); return; }
      st.type = 'custom'; emit('os-type'); return go();
    }
    if (t.closest('[data-disk]')) { st.disk = true; emit('os-disk'); return render(); }
    if (t.closest('.os-net')) { st.netOpen = true; return render(); }
    if (t.closest('.os-netgo')) {
      if (o.querySelector('.os-netpw').value === 'evagi2024') { st.net = true; emit('os-net', { ok: true }); return render(); }
      emit('os-net', { ok: false });
      return err('Şifre yanlış.');
    }
    if (t.closest('.os-skip')) return go();
    if (!t.closest('.os-next') || t.closest('.os-next').disabled) return;
    if (id === 'key') {
      const v = o.querySelector('.os-key').value.replace(/[^a-z0-9]/gi, '');
      if (v.length !== 25) { emit('os-wrong', { what: 'key' }); return err('Geçerli bir ürün anahtarı girin ya da “Ürün anahtarım yok”a tıklayın.'); }
    }
    if (id === 'pin') {
      const a = o.querySelector('.os-pin').value, b = o.querySelector('.os-pin2').value;
      if (!/^\d{4,}$/.test(a)) return err('PIN en az 4 rakam olmalı.');
      if (a !== b) return err('İki PIN aynı değil. Tekrar yazın.');
      st.pin = a;
      emit('os-pin');
    }
    go();
  };
  o.onchange = (e) => { if (desk.power === 'os' && e.target.classList.contains('os-acc')) { st.accept = e.target.checked; emit('os-license', { accept: st.accept }); render(); } };
  o.onkeydown = (e) => {
    if (desk.power !== 'os') return;
    if (OS_SCREENS[st.i] === 'boot') { e.preventDefault(); go(); }
    if (e.key === 'Enter' && e.target.matches('.os-netpw')) o.querySelector('.os-netgo').click();
  };
  render();
  setTimeout(() => o.focus({ preventScroll: true }), 30);
}
