// 8. hafta ek dersi: ekranda çıkan İngilizce düğmeler (OK, Cancel, Allow, Skip…). Sık kullanılan kelimeler,
// eşleştirme ve “pencere karar oyunu”: gerçeğine benzeyen İngilizce pencerede doğru düğmeye tıklamak.
import { info, ayir, sekmeler } from './kalip.js';
import { esc } from '../dialog.js';

const row = (en, tr, not = '') => `<tr><td><span class="en-btn">${en}</span></td><td><b>${tr}</b>${not ? `<small>${not}</small>` : ''}</td></tr>`;
const tablo = (rows) => `<table class="en-tbl">${rows.map((r) => row(...r)).join('')}</table>`;

const GRUPLAR = [
  { id: 'ilerle', label: 'Devam etmek', icon: '➡', html: tablo([
    ['OK', 'Tamam'], ['Next', 'İleri', 'Kurulumda bir sonraki sayfa'], ['Continue', 'Devam et'], ['Yes', 'Evet'],
    ['Accept / I agree', 'Kabul ediyorum', 'Sözleşme ve çerez pencerelerinde'], ['Done / Finish', 'Bitti / Bitir'], ['Apply', 'Uygula', 'Ayarı kaydeder, pencere açık kalır']]) },
  { id: 'vazgec', label: 'Vazgeçmek', icon: '✋', html: tablo([
    ['Cancel', 'İptal', 'Hiçbir şey yapmadan kapatır'], ['Back', 'Geri'], ['No', 'Hayır'], ['Close', 'Kapat'],
    ['Skip', 'Atla', 'Bu adımı geç'], ['Not now / Later', 'Şimdi değil / Sonra'], ['Remind me later', 'Bana sonra hatırlat'], ['Dismiss / No thanks', 'Kapat / Hayır, teşekkürler']]) },
  { id: 'izin', label: 'İzin vermek', icon: '🔐', html: tablo([
    ['Allow', 'İzin ver'], ['Block / Deny', 'Engelle / Reddet'], ['Accept all', 'Hepsini kabul et', 'Çerezlerin hepsine izin'],
    ['Reject all', 'Hepsini reddet'], ['Manage / Settings', 'Ayarla / Ayarlar'], ['Only this time', 'Yalnızca bu sefer']]) },
  { id: 'dosya', label: 'İndirme, kurma', icon: '⬇', html: tablo([
    ['Download', 'İndir'], ['Install', 'Kur, yükle'], ['Update / Update now', 'Güncelle / Şimdi güncelle'], ['Restart', 'Yeniden başlat'],
    ['Save', 'Kaydet'], ["Don't save", 'Kaydetme'], ['Open', 'Aç'], ['Delete / Remove', 'Sil / Kaldır'], ['Upload', 'Yükle (bilgisayardan siteye gönder)']]) },
  { id: 'hesap', label: 'Hesap', icon: '👤', html: tablo([
    ['Sign in / Log in', 'Giriş yap', 'Hesabınız varsa'], ['Sign up / Register', 'Kayıt ol', 'Yeni hesap açmak için'], ['Create account', 'Hesap oluştur'],
    ['Sign out / Log out', 'Çıkış yap'], ['Forgot password?', 'Şifremi unuttum'], ['Username / Password', 'Kullanıcı adı / Şifre'], ['Submit / Send', 'Gönder'], ['Search', 'Ara']]) },
];

// Pencere karar oyunu: İngilizce pencere gösterilir; öğrenci pencerenin kendi düğmesine tıklar.
// win: { app, icon, head, text, buttons: [[id, etiket, vurgulu?]] }; ok: doğru düğmelerin kimlikleri; why: { id: açıklama }
function pencere({ title, durum, win, ok, why, done }) {
  return {
    title, done,
    html: `<p>${durum}</p><p>Sağdaki penceredeki <b>doğru düğmeye</b> tıklayın.</p>`,
    mouse: '🖱 Penceredeki düğmeye tıklayın',
    scene: (el, c) => {
      el.className = 'sc sc-eng';
      el.innerHTML = `<div class="en-win"><div class="en-bar"><span>${win.app || ''}</span><i>✕</i></div>
        <div class="en-body">${win.icon ? `<div class="en-ic">${win.icon}</div>` : ''}<div><h4>${win.head}</h4>${win.text ? `<p>${win.text}</p>` : ''}</div></div>
        <div class="en-btns">${win.buttons.map(([id, l, p]) => `<button type="button" data-b="${id}" class="${p ? 'pri' : ''}">${esc(l)}</button>`).join('')}</div></div>
        <div class="en-exp" hidden></div>`;
      el.querySelector('.en-btns').addEventListener('click', (e) => {
        const b = e.target.closest('[data-b]');
        if (!b) return;
        const good = ok.includes(b.dataset.b);
        el.querySelectorAll('[data-b]').forEach((x) => x.classList.remove('right', 'wrong'));
        b.classList.add(good ? 'right' : 'wrong');
        const exp = el.querySelector('.en-exp');
        exp.hidden = false;
        exp.className = 'en-exp ' + (good ? 'ok' : 'bad');
        exp.innerHTML = `<b>${esc(b.textContent)}</b>: ${why[b.dataset.b] || ''}`;
        c.emit('en-pick', { ok: good, id: b.dataset.b });
      });
    },
    on: (ev, c) => {
      if (ev.type === 'en-pick' && !ev.ok) c.warn('Bu düğme olmadı. Açıklamayı okuyup başka bir düğme deneyin.');
      return ev.type === 'en-pick' && ev.ok;
    },
  };
}

export const ingilizce = {
  id: 'ingilizce-dugmeler', icon: '🔤', title: 'Ekranda çıkan İngilizce kelimeler: OK, Cancel, Allow, Skip…', minutes: 25, stage: 'scene',
  desc: 'En sık çıkan İngilizce düğmelerin Türkçesi ve İngilizce pencerelerde doğru karar.',
  summary: [
    ['OK · Yes · Next · Continue', 'Tamam · Evet · İleri · Devam'],
    ['Cancel · No · Back · Close', 'İptal · Hayır · Geri · Kapat'],
    ['Skip · Later · Remind me later', 'Atla · Sonra · Sonra hatırlat'],
    ['Allow · Block', 'İzin ver · Engelle'],
    ['Accept all · Reject all', 'Hepsini kabul et · Hepsini reddet (çerezler)'],
    ['Download · Install · Update', 'İndir · Kur · Güncelle'],
    ['Save · Don\'t save', 'Kaydet · Kaydetme'],
    ['Sign in · Sign up · Sign out', 'Giriş yap · Kayıt ol · Çıkış yap'],
    ['Emin değilseniz', 'Cancel (İptal) ya da ✕: hiçbir şey değiştirmeden kapatır'],
  ],
  steps: [
    {
      title: 'İngilizce pencere çıkınca',
      html: `<p>Her şeyi biliyorsunuz, ama karşınıza <b>“Remind me later”</b>, <b>“Allow”</b>, <b>“Cancel”</b> yazan bir pencere çıkınca duraksıyorsunuz. Çok normal: birçok program ve site İngilizcedir.</p>
        <p>İyi haber: bilgisayarda en sık çıkan kelimeler <b>yirmi kadar</b>. Onları tanıyınca İngilizce bilmeseniz de doğru düğmeye basarsınız.</p>`,
      scene: info('<div class="sc-big">OK = Tamam<br>Cancel = İptal</div><p>Yirmi kelime yeter</p>'),
    },
    {
      title: 'Kelimeler beş grupta',
      html: '<p>Sağdaki beş sekmeye <b>sırayla tıklayıp</b> okuyun. Sol sütunda düğmede yazan, sağda Türkçesi var.</p>',
      scene: sekmeler({ tabs: GRUPLAR, intro: 'Düğmelerde en sık çıkan İngilizce kelimeler' }),
      on: (ev) => ev.type === 'tabs-done',
      done: 'Beş grubu da okudunuz. Şimdi biraz alıştırma yapalım.',
    },
    ayir({
      title: 'Evet mi, hayır mı?',
      html: '<p>Her düğmeyi doğru kutuya sürükleyin: <b>devam ettiren</b> düğmeler mi, <b>vazgeçen</b> düğmeler mi?</p>',
      bins: [{ id: 'evet', label: 'Devam / Evet', icon: '➡' }, { id: 'hayir', label: 'Vazgeç / Hayır', icon: '✋' }],
      items: [
        { label: 'OK', icon: '🔘', bin: 'evet', why: 'OK: Tamam.' },
        { label: 'Next', icon: '🔘', bin: 'evet', why: 'Next: İleri, sonraki sayfa.' },
        { label: 'Continue', icon: '🔘', bin: 'evet', why: 'Continue: Devam et.' },
        { label: 'Accept', icon: '🔘', bin: 'evet', why: 'Accept: Kabul et.' },
        { label: 'Cancel', icon: '🔘', bin: 'hayir', why: 'Cancel: İptal; hiçbir şey yapmadan kapatır.' },
        { label: 'Skip', icon: '🔘', bin: 'hayir', why: 'Skip: Atla; bu adımı geçer.' },
        { label: 'Not now', icon: '🔘', bin: 'hayir', why: 'Not now: Şimdi değil.' },
        { label: 'Back', icon: '🔘', bin: 'hayir', why: 'Back: Geri; önceki sayfaya döner.' },
      ],
      done: 'Hepsi yerinde.',
    }),
    ayir({
      title: 'Giriş mi, kayıt mı?',
      html: '<p>Sitelerde en çok karıştırılanlar. Her düğmeyi doğru kutuya sürükleyin.</p>',
      bins: [{ id: 'giris', label: 'Giriş yap (hesabım var)', icon: '🔑' }, { id: 'kayit', label: 'Kayıt ol (yeni hesap)', icon: '🆕' }, { id: 'cikis', label: 'Çıkış yap', icon: '🚪' }],
      items: [
        { label: 'Sign in', icon: '🔘', bin: 'giris', why: 'Sign in: hesabınıza giriş.' },
        { label: 'Log in', icon: '🔘', bin: 'giris', why: 'Log in: Sign in ile aynı, giriş yap.' },
        { label: 'Sign up', icon: '🔘', bin: 'kayit', why: 'Sign up: yeni hesap aç, kaydol. “in” değil “up”!' },
        { label: 'Register', icon: '🔘', bin: 'kayit', why: 'Register: kayıt ol.' },
        { label: 'Create account', icon: '🔘', bin: 'kayit', why: 'Create account: hesap oluştur.' },
        { label: 'Sign out', icon: '🔘', bin: 'cikis', why: 'Sign out: çıkış yap; ortak bilgisayarda iş bitince.' },
        { label: 'Log out', icon: '🔘', bin: 'cikis', why: 'Log out: çıkış yap.' },
      ],
      done: 'Sign <b>in</b>: içeri gir. Sign <b>up</b>: kaydol. Sign <b>out</b>: dışarı çık.',
    }),
    pencere({
      title: 'Oyun 1: Güncelleme',
      durum: 'Torununuza uzun bir mektup yazıyorsunuz, daha <b>kaydetmediniz</b>. Birden bu pencere çıktı.',
      win: { app: 'Windows Update', icon: '🔄', head: 'Updates are ready', text: 'Your device needs to restart to install updates.', buttons: [['now', 'Restart now', true], ['later', 'Remind me later']] },
      ok: ['later'],
      why: { now: 'Şimdi yeniden başlat. Kaydedilmemiş mektubunuz kaybolabilir!', later: 'Bana sonra hatırlat. Doğru: önce mektubu kaydedin, işiniz bitince güncellemeyi yapın.' },
      done: 'Güncelleme önemlidir ama önce işinizi kaydedin.',
    }),
    pencere({
      title: 'Oyun 2: Bildirim izni',
      durum: 'Bir haber sitesini açtınız. Adres çubuğunun altında bu küçük pencere çıktı. Sürekli bildirim istemiyorsunuz.',
      win: { app: 'haberler-son-dakika.xyz', icon: '🔔', head: 'haberler-son-dakika.xyz wants to', text: '🔔 Show notifications', buttons: [['allow', 'Allow', true], ['block', 'Block']] },
      ok: ['block'],
      why: { allow: 'İzin ver. Site durmadan ekranınızın köşesine bildirim gönderir; bazıları sahte uyarı olur.', block: 'Engelle. Doğru: istemediğiniz siteye bildirim izni vermeyin.' },
      done: 'Bildirim izni istemediğiniz sitelere: Block.',
    }),
    pencere({
      title: 'Oyun 3: Çerezler',
      durum: 'Bir yemek tarifi sitesi açıldı. Alttan bu şerit çıktı. Reklamlar için takip edilmek istemiyorsunuz.',
      win: { app: 'tarifler.com', icon: '🍪', head: 'We value your privacy', text: 'We use cookies to personalise ads and analyse our traffic.', buttons: [['accept', 'Accept all', true], ['reject', 'Reject all'], ['manage', 'Manage settings']] },
      ok: ['reject'],
      why: { accept: 'Hepsini kabul et. Tehlikeli değildir ama reklam şirketleri sizi takip eder.', reject: 'Hepsini reddet. Doğru: site yine çalışır, takip çerezleri konmaz.', manage: 'Ayarları yönet: tek tek seçmek için. Olur ama uzun sürer; “Reject all” tek tıkla aynı işi yapar.' },
      done: 'Reject all: takip istemiyorum. Site yine açılır.',
    }),
    pencere({
      title: 'Oyun 4: Kurulum',
      durum: 'Resmî sitesinden indirdiğiniz bir programı kuruyorsunuz. İlk sayfa bu. Kuruluma <b>devam etmek</b> istiyorsunuz.',
      win: { app: 'Setup', icon: '💿', head: 'Welcome to the Setup Wizard', text: 'Click Next to continue, or Cancel to exit Setup.', buttons: [['back', '< Back'], ['next', 'Next >', true], ['cancel', 'Cancel']] },
      ok: ['next'],
      why: { back: 'Geri: ilk sayfadasınız, geri gidecek yer yok.', next: 'İleri. Doğru: kurulum sonraki sayfaya geçer. Her sayfayı okuyup işaretli ek program kutularına dikkat edin.', cancel: 'İptal: kurulumdan çıkar.' },
      done: 'Next: İleri. Kurulumlarda en çok basılan düğme.',
    }),
    pencere({
      title: 'Oyun 5: Kaydedilsin mi?',
      durum: 'Word\'de yazdığınız dilekçeyi kapatırken bu soru çıktı. Yazdıklarınız <b>kalsın</b> istiyorsunuz.',
      win: { app: 'Word', icon: '📘', head: 'Do you want to save changes to “dilekce.docx”?', text: 'Your changes will be lost if you don\'t save them.', buttons: [['save', 'Save', true], ['dont', "Don't Save"], ['cancel', 'Cancel']] },
      ok: ['save'],
      why: { save: 'Kaydet. Doğru: yazdıklarınız dosyaya kaydedilir.', dont: 'Kaydetme! Yazdıklarınız kaybolur. En çok karıştırılan düğme budur.', cancel: 'İptal: pencere kapanmaz, belgeye geri dönersiniz. Kaybolmaz ama kaydetmiş de olmazsınız.' },
      done: 'Save: kaydet. Don\'t save: kaydetme. Aradaki “Don\'t” küçük ama önemli.',
    }),
    pencere({
      title: 'Oyun 6: Korkutan pencere',
      durum: 'Bir sitede gezinirken ekranı kaplayan, kırmızı yanıp sönen bu pencere çıktı.',
      win: { app: 'WARNING!!!', icon: '⚠', head: 'Your computer is infected with 5 viruses!', text: 'Download our cleaner now or your files will be deleted!', buttons: [['dl', 'Download cleaner', true], ['call', 'Call support'], ['close', 'Close']] },
      ok: ['close'],
      why: { dl: 'Temizleyiciyi indir: tuzak! İndirdiğiniz şey asıl virüs olur.', call: 'Desteği ara: dolandırıcılar bilgisayarınıza girmek ya da para almak ister.', close: 'Kapat. Doğru: siteden çıkan virüs uyarısı sahtedir. Sekmeyi de kapatın.' },
      done: 'Sitelerden çıkan “virüs bulundu” pencereleri sahtedir: Close, sonra sekmeyi kapatın.',
    }),
    pencere({
      title: 'Oyun 7: Hesabım var',
      durum: 'Daha önce hesap açtığınız bir alışveriş sitesine girdiniz. <b>Hesabınıza girmek</b> istiyorsunuz.',
      win: { app: 'alisveris.com', icon: '🛒', head: 'Welcome back!', text: 'Already have an account?', buttons: [['in', 'Sign in', true], ['up', 'Sign up'], ['guest', 'Continue as guest']] },
      ok: ['in'],
      why: { in: 'Giriş yap. Doğru: hesabınız var, e-posta ve şifrenizle girersiniz.', up: 'Kayıt ol: yeni hesap açar. Sizin zaten hesabınız var.', guest: 'Misafir olarak devam et: hesaba girmeden alışveriş. Olur ama hesabınızdaki adres, siparişler gelmez.' },
      done: 'Sign in: hesabım var, giriyorum.',
    }),
    pencere({
      title: 'Oyun 8: Kalıcı silme',
      durum: 'Yanlışlıkla bir dosya seçip Shift + Delete\'e bastınız. Dosyayı <b>silmek istemiyorsunuz</b>.',
      win: { app: 'Delete File', icon: '🗑', head: 'Are you sure you want to permanently delete this file?', text: 'torunumun fotoğrafı.jpg', buttons: [['yes', 'Yes', true], ['no', 'No']] },
      ok: ['no'],
      why: { yes: 'Evet: dosya kalıcı olarak silinir; Geri Dönüşüm Kutusu\'na bile gitmez!', no: 'Hayır. Doğru: dosya yerinde kalır.' },
      done: 'Emin değilseniz No ya da Cancel: hiçbir şey değişmez.',
    }),
    {
      title: 'Bilmediğiniz bir kelime çıkarsa',
      html: `<ul><li><b>Emin değilseniz:</b> <b>Cancel</b> ya da pencerenin köşesindeki <b>✕</b>. Hiçbir şey değiştirmeden kapatır.</li>
        <li><b>Tarayıcıda:</b> sayfaya sağ tıklayıp <b>“Türkçe'ye çevir”</b>. Bütün sayfa Türkçe olur.</li>
        <li><b>Telefonda:</b> çeviri uygulamasının kamerasını ekrana tutun; yazıların Türkçesi ekranda belirir.</li>
        <li><b>Ayarlar:</b> programların çoğunda dil Türkçe yapılabilir (Settings → Language → Türkçe).</li></ul>`,
      scene: info('<div class="sc-big">❓ ➜ ✕</div><p>Emin değilseniz: Cancel</p>'),
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>İngilizce pencereler artık korkutmuyor. Bu kartı yazdırıp bilgisayarın yanına koyabilirsiniz:</p>' },
  ],
};
