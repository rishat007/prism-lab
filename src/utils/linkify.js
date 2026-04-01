const LINK_PATTERN = /(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+|\b10\.\d{4,9}\/[\-._;()\/:A-Z0-9]+\b|\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b|(?:\+?\d{1,3}[\s.-]?)?(?:\(\d{3}\)|\b\d{3}\b)[\s.-]?\d{3}[\s.-]?\d{4}\b)/gi;
const TRAILING_PUNCTUATION = /[.,;:!?]+$/;

function trimTrailingPunctuation(value) {
  let token = value;
  let suffix = '';

  while (token.length > 0) {
    const lastChar = token[token.length - 1];
    if (TRAILING_PUNCTUATION.test(lastChar)) {
      suffix = lastChar + suffix;
      token = token.slice(0, -1);
      continue;
    }
    if (lastChar === ')' && (token.match(/\(/g) || []).length < (token.match(/\)/g) || []).length) {
      suffix = lastChar + suffix;
      token = token.slice(0, -1);
      continue;
    }
    break;
  }

  return { token, suffix };
}

function getHrefForToken(token) {
  if (/^https?:\/\//i.test(token)) return token;
  if (/^www\./i.test(token)) return `https://${token}`;
  if (/^10\.\d{4,9}\//i.test(token)) return `https://doi.org/${token}`;
  if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(token)) return `mailto:${token}`;
  const digits = token.replace(/\D/g, '');
  if (digits.length >= 10 && digits.length <= 15) {
    const hasLeadingPlus = token.trim().startsWith('+');
    return `tel:${hasLeadingPlus ? `+${digits}` : digits}`;
  }
  return null;
}

function isExternalNavigationHref(href) {
  return /^https?:\/\//i.test(href);
}

export function linkifyTextToParts(text) {
  const input = String(text ?? '');
  if (!input) return [];

  const parts = [];
  let lastIndex = 0;
  LINK_PATTERN.lastIndex = 0;

  for (const match of input.matchAll(LINK_PATTERN)) {
    const fullMatch = match[0];
    const start = match.index ?? 0;
    const { token, suffix } = trimTrailingPunctuation(fullMatch);
    const href = getHrefForToken(token);
    if (!href) continue;

    if (start > lastIndex) {
      parts.push({ type: 'text', value: input.slice(lastIndex, start) });
    }

    parts.push({ type: 'link', value: token, href, external: isExternalNavigationHref(href) });
    if (suffix) parts.push({ type: 'text', value: suffix });

    lastIndex = start + fullMatch.length;
  }

  if (lastIndex < input.length) {
    parts.push({ type: 'text', value: input.slice(lastIndex) });
  }

  return parts;
}

function linkifyTextNode(node, documentRef) {
  const text = node.nodeValue ?? '';
  if (!text.trim()) return;

  LINK_PATTERN.lastIndex = 0;
  if (!LINK_PATTERN.test(text)) return;
  LINK_PATTERN.lastIndex = 0;

  const fragment = documentRef.createDocumentFragment();
  let lastIndex = 0;

  for (const match of text.matchAll(LINK_PATTERN)) {
    const fullMatch = match[0];
    const start = match.index ?? 0;
    const { token, suffix } = trimTrailingPunctuation(fullMatch);
    const href = getHrefForToken(token);
    if (!href) continue;

    if (start > lastIndex) {
      fragment.appendChild(documentRef.createTextNode(text.slice(lastIndex, start)));
    }

    const a = documentRef.createElement('a');
    a.setAttribute('href', href);
    if (isExternalNavigationHref(href)) {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    }
    a.textContent = token;
    fragment.appendChild(a);

    if (suffix) {
      fragment.appendChild(documentRef.createTextNode(suffix));
    }

    lastIndex = start + fullMatch.length;
  }

  if (lastIndex < text.length) {
    fragment.appendChild(documentRef.createTextNode(text.slice(lastIndex)));
  }

  node.parentNode?.replaceChild(fragment, node);
}

export function linkifyHtmlContent(html) {
  const input = String(html ?? '');
  if (!input) return input;
  if (typeof window === 'undefined' || typeof window.DOMParser === 'undefined') return input;

  const parser = new window.DOMParser();
  const doc = parser.parseFromString(`<div>${input}</div>`, 'text/html');
  const root = doc.body.firstElementChild;
  if (!root) return input;

  const walker = doc.createTreeWalker(root, window.NodeFilter.SHOW_TEXT);
  const textNodes = [];
  let current = walker.nextNode();
  while (current) {
    const parentTag = current.parentElement?.tagName;
    if (parentTag !== 'A' && parentTag !== 'SCRIPT' && parentTag !== 'STYLE') {
      textNodes.push(current);
    }
    current = walker.nextNode();
  }

  textNodes.forEach((node) => linkifyTextNode(node, doc));
  return root.innerHTML;
}