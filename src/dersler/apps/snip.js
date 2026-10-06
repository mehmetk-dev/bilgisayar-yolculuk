// Ekran Alıntısı Aracı: "+ Yeni" ile ekranın bir bölümünü alır, panoya koyar, istenirse kaydeder.
export function snip({ desk, win, body, emit, dialogs }) {
  body.classList.add('sn');
  const render = () => {
    const img = desk.imageClip;
    body.innerHTML = `<div class="sn-tools"><button type="button" class="sn-new primary">＋ Yeni</button><span>✂ Dikdörtgen</span>${img ? '<button type="button" class="sn-save">💾 Kaydet</button>' : ''}</div>
      <div class="sn-prev">${img ? `<img src="${img.toDataURL()}" alt="Alıntı">` : '<p>“＋ Yeni”ye tıklayın, sonra ekranda almak istediğiniz yeri fareyle çerçeveleyin.<br><small>Gerçek bilgisayarda kısayol: ⊞ Windows + Shift + S</small></p>'}</div>`;
  };
  body.addEventListener('click', async (e) => {
    if (e.target.closest('.sn-new')) {
      emit('snip-new');
      desk.minimize(win, true);
      setTimeout(() => desk.snip(), 350);
    }
    if (e.target.closest('.sn-save') && desk.imageClip) {
      const r = await dialogs.file({ mode: 'save', fs: desk.fs.dialogApi(), folder: 'pictures', name: 'Ekran alıntısı.png', ext: '.png', typeLabel: 'PNG (*.png)' });
      if (!r) return;
      desk.fs.write(r.folder, r.name, desk.imageClip.toDataURL());
      emit('save', { name: r.name, folder: r.folder, label: desk.fs.label(r.folder) });
    }
  });
  const onSnip = () => { render(); if (win.min) desk.restore(win, true); };
  render();
  return { onSnip, onFs: () => {} };
}
