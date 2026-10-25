// Sorunlu simgeler (bazı bilgisayarlarda kare çıkan ⏻ ⊞ ↻ gibi karakterler) SVG olarak çizilir.
// Metin kaynakta olduğu gibi kalır; sayfada gösterilirken bu karakterler yerine SVG konur.
// Ekranda sonradan eklenen metinler de (MutationObserver ile) aynı şekilde dönüştürülür.

const P = {
  '⏻': '<path d="M12 3v8"/><path d="M6.4 6.4a8 8 0 1 0 11.2 0"/>',
  '⏏': '<path d="M12 5l7 8H5z"/><path d="M5 18h14"/>',
  '⌨': '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>',
  '⌫': '<path d="M9 5h11v14H9l-6-7z"/><path d="M13 9l5 6M18 9l-5 6"/>',
  '⊞': '<rect x="3" y="3" width="8" height="8"/><rect x="13" y="3" width="8" height="8"/><rect x="3" y="13" width="8" height="8"/><rect x="13" y="13" width="8" height="8"/>',
  '↻': '<path d="M20 12a8 8 0 1 1-2.3-5.7"/><path d="M20 4v5h-5"/>',
  '⟳': '<path d="M20 12a8 8 0 1 1-2.3-5.7"/><path d="M20 4v5h-5"/>',
  '♻': '<path d="M20 12a8 8 0 1 1-2.3-5.7"/><path d="M20 4v5h-5"/>',
  '↺': '<path d="M4 12a8 8 0 1 0 2.3-5.7"/><path d="M4 4v5h5"/>',
  '↰': '<path d="M15 20V10a4 4 0 0 0-4-4H4"/><path d="M8 2L4 6l4 4"/>',
  '↱': '<path d="M9 20V10a4 4 0 0 1 4-4h7"/><path d="M16 2l4 4-4 4"/>',
  '↶': '<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>',
  '↷': '<path d="M15 14l5-5-5-5"/><path d="M20 9H10a6 6 0 0 0 0 12h3"/>',
  '⧉': '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
  '⇄': '<path d="M4 8h16l-4-4"/><path d="M20 16H4l4 4"/>',
  '⏱': '<circle cx="12" cy="13" r="8"/><path d="M12 13V9M10 2h4"/>',
  '⏲': '<circle cx="12" cy="13" r="8"/><path d="M12 13V9M10 2h4"/>',
  '⏹': '<rect x="5" y="5" width="14" height="14" rx="1"/>',
  '⏸': '<path d="M8 5v14M16 5v14"/>',
  '⏳': '<path d="M6 2h12M6 22h12M7 2c0 5 10 5 10 10S7 17 7 22M17 2c0 5-10 5-10 10s10 5 10 10"/>',
  '⏮': '<path d="M6 5v14"/><path d="M19 5L9 12l10 7z"/>',
  '⏭': '<path d="M18 5v14"/><path d="M5 5l10 7-10 7z"/>',
  '✂': '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.5 8.5L20 19M8.5 15.5L20 5"/>',
  '✏': '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
  '✉': '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  '⚙': '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
  '⌂': '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
  '⌄': '<path d="M6 9l6 6 6-6"/>',
};

const CHARS = Object.keys(P);
const RE = new RegExp(`[${CHARS.join('')}]`, 'g');
const svgOf = (ch) => {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 24 24');
  s.setAttribute('class', 'ic');
  s.setAttribute('aria-hidden', 'true');
  s.innerHTML = P[ch];
  return s;
};

// Metin düğümünü simge ve metin parçalarına böler
function fixNode(node) {
  const text = node.nodeValue;
  RE.lastIndex = 0;
  if (!RE.test(text)) return;
  RE.lastIndex = 0;
  const frag = document.createDocumentFragment();
  let last = 0, m;
  while ((m = RE.exec(text))) {
    if (m.index > last) frag.append(text.slice(last, m.index));
    frag.append(svgOf(m[0]));
    last = m.index + m[0].length;
  }
  if (last < text.length) frag.append(text.slice(last));
  node.replaceWith(frag);
}

const SKIP = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'OPTION', 'SVG']);
function fixTree(root) {
  if (!root || (root.nodeType === 1 && SKIP.has(root.nodeName))) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.parentNode && SKIP.has(n.parentNode.nodeName) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(fixNode);
}

const CSS = '.ic{display:inline-block;width:1.05em;height:1.05em;vertical-align:-0.16em;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}';

export function startIcons() {
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.append(style);
  fixTree(document.body);
  new MutationObserver((records) => {
    for (const r of records) {
      if (r.type === 'characterData' && r.target.nodeType === 3) {
        if (r.target.parentNode && !SKIP.has(r.target.parentNode.nodeName)) fixNode(r.target);
      } else {
        r.addedNodes.forEach((n) => (n.nodeType === 3 ? fixNode(n) : fixTree(n)));
      }
    }
  }).observe(document.body, { childList: true, subtree: true, characterData: true });
}
