// Ders panelinde örnek tuval. Çizimler çevrimdışı da görünür ve öğrencinin tuvaline eklenmez.
function example(label, drawing) {
  return `<svg class="paint-guide" role="img" aria-label="${label}" viewBox="0 0 210 110" width="210" height="110"
    style="display:block;max-width:100%;height:auto;margin:0.5em auto">
    <rect x="1" y="1" width="208" height="108" rx="7" fill="#fff" stroke="#aab4c5"/>
    <g stroke-linecap="round" stroke-linejoin="round">${drawing}</g>
  </svg>`;
}

export function flowerGuide(step) {
  const stem = '<path d="M103 35v52" stroke="#218746" stroke-width="3"/>';
  const petals = '<path d="M103 24c-11-13 11-19 9-5 14-7 20 10 5 11 9 12-8 17-14 6-7 11-23 5-14-6-15-1-9-18 5-11-2-14 20-8 9 5Z" fill="none" stroke="#c62a40" stroke-width="2"/>';
  const leaves = '<path d="M103 65q-9-11-20-13m20 18q9-12 20-14" fill="none" stroke="#218746" stroke-width="5"/>';
  const pot = (fill) => `<rect x="83" y="87" width="40" height="16" fill="${fill}" stroke="#885839" stroke-width="2"/>`;
  const arrow = '<circle cx="103" cy="35" r="3" fill="#218746"/><path d="M118 36v47m-4-5 4 5 4-5" fill="none" stroke="#315b91" stroke-width="1.6"/>';
  const drawings = [
    ['Yeşil sap. Noktadan başlayıp ok yönünde aşağı sürükleyin.', stem + arrow],
    ['Yeşil sapın tepesinde kırmızı taç yapraklar.', stem + petals],
    ['Sapın iki yanına eklenen kalın yeşil yapraklar.', stem + petals + leaves],
    ['Sapın altına çizilmiş kahverengi dikdörtgen saksı.', stem + petals + leaves + pot('none')],
    ['Turuncu renkle doldurulmuş saksı ve tamamlanan çiçek.', stem + petals + leaves + pot('#ffad65')],
  ];
  return example(...drawings[step]);
}

export function houseGuide(step) {
  const wall = (fill = 'none') => `<rect x="58" y="48" width="90" height="46" fill="${fill}" stroke="#764428" stroke-width="2"/>`;
  const roof = '<path d="M58 48l45-29 45 29" fill="none" stroke="#a43f37" stroke-width="2"/>';
  const door = '<rect x="96" y="67" width="14" height="27" fill="#fff7ea" stroke="#764428" stroke-width="2"/>';
  const windows = '<path d="M69 59h15v15H69Zm53 0h15v15h-15Z" fill="#d9efff" stroke="#276196" stroke-width="2"/>';
  const sun = '<circle cx="174" cy="26" r="12" fill="#ffda58" stroke="#b67b1b" stroke-width="2"/>';
  const grass = '<path d="M33 99q9-4 18 0t18 0 18 0 18 0 18 0 18 0 18 0 18 0" fill="none" stroke="#24844c" stroke-width="4"/>';
  const drawings = [
    ['Dikdörtgen gövde.', wall()],
    ['Gövdenin üstüne eklenen iki eğik çatı çizgisi.', wall() + roof],
    ['Gövdenin ortasında dikdörtgen kapı.', wall() + roof + door],
    ['Kapının iki yanında kare pencereler.', wall() + roof + door + windows],
    ['Evin sağ üstünde daire biçiminde sarı güneş.', wall() + roof + door + windows + sun],
    ['Gövdesi boyanmış evin altına çizilen çimen.', wall('#ffca8a') + roof + door + windows + sun + grass],
  ];
  return example(...drawings[step]);
}

export function cardGuide(step) {
  const background = '<rect x="14" y="11" width="182" height="88" rx="4" fill="#fff1cb"/>';
  const balloon = '<ellipse cx="45" cy="34" rx="12" ry="17" fill="#f97999" stroke="#a82852" stroke-width="2"/>';
  const string = '<path d="M45 51q-6 7 0 12t0 11" fill="none" stroke="#813750" stroke-width="1.5"/>';
  const cake = '<rect x="93" y="69" width="55" height="19" fill="#e4a777" stroke="#885839" stroke-width="2"/><path d="M105 69V55m15 14V55m15 14V55" fill="none" stroke="#a82852" stroke-width="3"/>';
  const drawings = [
    ['Kartın sol üst tarafına çizilmiş pembe oval balon.', background + balloon],
    ['Balonun altından aşağı inen ince ip.', background + balloon + string],
    ['Kartın alt kısmında dikdörtgen pasta ve üstünde üç mum.', background + balloon + string + cake],
  ];
  return example(...drawings[step]);
}
