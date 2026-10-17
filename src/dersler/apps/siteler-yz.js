// Dijital Yardımcı: yapay zekâ ile sohbet eder gibi yazışmak (uydurma, hazır cevaplı alıştırma sitesi).
// Resmî yazıyı özetletmek, yemek tarifi, gezi planı, dilekçe taslağı istemek; kimlik ve kart bilgisi yazmama uyarısı; cevabı doğrulama.
import { esc } from './util.js';

const page = (title, html, cls = '') => ({ title, html: `<div class="wp ${cls}">${html}</div>` });
export const YZ_HOST = 'yardimci.bulalim.com';

export const RESMI_YAZI = 'Belediye Başkanlığı Kültür Müdürlüğü: 60 yaş üstü vatandaşlarımız için ücretsiz bilgisayar kursu açılmıştır. Kurs, Kültür Merkezi\'nde her salı ve perşembe günü saat 10.00\'da yapılacaktır. Başvurular 20 Ekim tarihine kadar Kültür Merkezi\'nden ya da belediyenin internet sitesinden alınacaktır. Kontenjan 24 kişiyle sınırlıdır. Katılımcılara kurs sonunda katılım belgesi verilecektir.';

const CHIPS = [
  ['📄 Resmî yazıyı özetlet', `Şu yazıyı özetler misin? ${RESMI_YAZI}`],
  ['🍲 Yemek tarifi iste', 'Mercimek çorbası tarifi verir misin?'],
  ['🗺 Gezi planı iste', 'Kapadokya için 3 günlük gezi planı yazar mısın?'],
  ['📝 Dilekçe taslağı', 'Sokaktaki bozuk aydınlatma için muhtarlığa dilekçe taslağı yazar mısın?'],
];
const RULES = [
  { intent: 'ozet', re: /özet|ozet/i, ans: 'Özet:\n• Belediye 60 yaş üstü vatandaşlar için ücretsiz bilgisayar kursu açıyor.\n• Kurs her salı ve perşembe 10.00\'da, Kültür Merkezi\'nde.\n• Başvuru 20 Ekim\'e kadar (Kültür Merkezi ya da internet sitesi).\n• Kontenjan 24 kişi; kurs sonunda belge verilecek.\n\nÖnemli tarihleri ve saatleri asıl yazıdan da bir kez kontrol edin.', v: 'ok' },
  { intent: 'tarif', re: /tarif|yemek|çorba|corba|börek|nasıl yapılır/i, ans: 'Mercimek çorbası (4 kişilik)\nMalzemeler: 1 su bardağı kırmızı mercimek, 1 soğan, 1 havuç, 1 yemek kaşığı un, 6 su bardağı su, tuz.\nYapılışı:\n1) Soğan ve havucu doğrayıp mercimekle birlikte tencereye koyun.\n2) Suyunu ekleyip 25 dakika pişirin.\n3) Blenderdan geçirin, tuzunu ayarlayın.\nAfiyet olsun! Alerjiniz ya da diyetiniz varsa doktorunuza danışın.', v: 'ok' },
  { intent: 'gezi', re: /gezi|(?<!\p{L})plan(?:[ıiI]|[ıiI]n[ıiI])?(?!\p{L})|tatil|nereye|rota/iu, ans: '3 günlük Kapadokya önerisi:\n• 1. gün: Göreme Açık Hava Müzesi, Uçhisar Kalesi, akşam yemeği.\n• 2. gün: Paşabağ vadisi, Avanos çömlek atölyeleri.\n• 3. gün: Derinkuyu yeraltı şehri, dönüş.\nNot: müze saatleri ve fiyatlar değişir; gitmeden önce resmî sitelerden ya da telefonla kontrol edin.', v: 'ok' },
  { intent: 'dilekce', re: /dilekçe|dilekce/i, ans: 'MAHALLE MUHTARLIĞINA\n\nKonu: Sokak aydınlatmasının onarılması\n\nMahallemizin Lale Sokağı\'ndaki aydınlatma lambaları bir aydır yanmamaktadır. Akşamları sokak karanlık olduğundan yürümek tehlikeli olmaktadır. Lambaların onarılması için gereğinin yapılmasını saygılarımla arz ederim.\n\nTarih: [tarih]\nAdı Soyadı: [adınız]\nİmza\n\n(Kimlik numaranızı ve telefonunuzu taslağı kendi bilgisayarınızda ekleyin; buraya yazmayın.)', v: 'ok' },
  { intent: 'yerel', re: /muhtar|komşu|apartman|mahalle|(?<!\p{L})kim(?!\p{L})/iu, ans: 'Mahallenizin muhtarı Hüseyin Aydın\'dır. Hafta içi 09.00–12.00 arasında muhtarlıkta bulunur; telefon numarası 0312 000 11 22\'dir.', v: 'bad' },
  { intent: 'selam', re: /merhaba|selam|günaydın|iyi günler/i, ans: 'Merhaba! Size nasıl yardımcı olabilirim? Bir yazıyı özetleyebilir, tarif, gezi planı ya da dilekçe taslağı hazırlayabilirim.', v: null },
];
// Yazılmaması gereken bilgiler
const SENSITIVE = [
  ['tc', /\b\d{11}\b/, 'T.C. kimlik numarası'],
  ['kart', /(?:\d[ -]?){15}\d/, 'kart numarası'],
  ['iban', /TR\d{2}[\s\d]{16,}/i, 'IBAN'],
  ['sifre', /(şifrem|şifre|parolam|parola)\s*[:=]?\s*\S{3,}/i, 'şifre'],
];

const YZ = {
  name: 'Dijital Yardımcı', secure: true,
  render(path, q, ctx) {
    const st = ctx.state;
    st.msgs ||= [{ f: 'ai', t: 'Merhaba! Ben Dijital Yardımcınız (alıştırma için hazırlanmış hazır cevaplı bir yardımcı). Aşağıdaki hazır soruları deneyebilir ya da kendi sorunuzu yazabilirsiniz.' }];
    const bubble = (m, i) => `<div class="yz-msg ${m.f}"><span class="yz-who">${m.f === 'ai' ? '🤖' : '👤'}</span><div class="yz-t">${esc(m.t).replace(/\n/g, '<br>')}${m.f === 'ai' && m.v ? `<div class="yz-ver">${m.checked ? `<div class="yz-chk ${m.v}">${m.v === 'ok' ? '✔ Kontrol edildi: bu genel ve bilinen bir bilgiyle uyuşuyor. Yine de önemli kararlarda resmî kaynaktan doğrulayın.' : '⚠ Bu bilgi için güvenilir bir kaynak bulunamadı! Yapay zekâ bilmediği şeyi uydurabilir. Muhtarlığı arayarak ya da e-Devlet\'ten doğrulayın.'}</div>` : `<button type="button" class="yz-vb" data-act="verify" data-i="${i}">🔎 Doğru mu? Kontrol et</button>`}</div>` : ''}</div></div>`;
    return page('Dijital Yardımcı', `<div class="yz"><header>🤖 Dijital Yardımcı<small>Alıştırma sürümü: hazır cevaplar verir</small></header>
      ${st.warn ? `<div class="yz-warn">🛑 <b>Durun!</b> Mesajınızda <b>${esc(st.warn)}</b> var. Yapay zekâya <b>T.C. kimlik, kart, şifre ya da IBAN yazmayın</b>; yazdıklarınız saklanabilir. Mesajınız gönderilmedi.<small>(Gerçek yapay zekâ sizi uyarmayabilir; bu uyarıyı kendiniz hatırlayın.)</small></div>` : ''}
      <div class="yz-msgs">${st.msgs.map(bubble).join('')}${st.typing ? '<div class="yz-msg ai"><span class="yz-who">🤖</span><div class="yz-t">yazıyor…</div></div>' : ''}</div>
      <div class="yz-chips">${CHIPS.map(([l, t], i) => `<button type="button" class="yz-chip" data-act="fill" data-i="${i}">${l}</button>`).join('')}</div>
      <form class="yz-comp" data-act="send"><textarea name="msg" rows="2" placeholder="Sorunuzu yazın…">${esc(st.draft || '')}</textarea><button class="yz-send">➤ Gönder</button></form></div>`, 'yzp');
  },
  mount(el) { const m = el.querySelector('.yz-msgs'); if (m) m.scrollTop = m.scrollHeight; return 0; },
  act(a, v, ctx, el) {
    const st = ctx.state;
    if (a === 'fill') { st.draft = CHIPS[+el.dataset.i][1]; st.warn = ''; ctx.emit('ai-chip', { i: +el.dataset.i }); ctx.refresh(); return; }
    if (a === 'verify') {
      const m = st.msgs[+el.dataset.i];
      m.checked = true;
      ctx.emit('ai-verify', { ok: m.v === 'ok', intent: m.intent });
      ctx.refresh();
      return;
    }
    if (a === 'send') {
      const text = (v.msg || '').trim();
      if (!text) return;
      const bad = SENSITIVE.find(([, re]) => re.test(text));
      // özel bilgi kutuda kalmasın: sonraki soru onun arkasına eklenmesin
      if (bad) { st.warn = bad[2]; st.draft = ''; ctx.emit('ai-sensitive', { kind: bad[0] }); ctx.refresh(); return; }
      st.warn = ''; st.draft = '';
      st.msgs.push({ f: 'me', t: text });
      const rule = RULES.find((r) => r.re.test(text));
      ctx.emit('ai-ask', { intent: rule?.intent || 'diger', text });
      st.typing = true;
      ctx.refresh();
      setTimeout(() => {
        st.typing = false;
        st.msgs.push({ f: 'ai', intent: rule?.intent, t: rule ? rule.ans : 'Bunu tam anlayamadım. İsterseniz bir yazıyı özetletebilir, tarif, gezi planı ya da dilekçe taslağı isteyebilirsiniz. Sorunuzu başka sözlerle yazar mısınız?', v: rule?.v || null });
        ctx.refresh();
      }, 900);
    }
  },
};

export const YZ_SITES = { [YZ_HOST]: YZ };
