const APP_URL = 'https://zzzzzryanzzzzz.github.io/hacksocial/';
const MENU_ID = 'skeptic-check-selection';
const MAX = 8000;

function toBase64Url(text) {
  const bytes = new TextEncoder().encode(text.slice(0, MAX));
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: MENU_ID,
      title: 'Check "%s" with Skeptic',
      contexts: ['selection'],
    });
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId !== MENU_ID || !info.selectionText) return;
  chrome.tabs.create({ url: `${APP_URL}#m=${toBase64Url(info.selectionText)}` });
});

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: APP_URL });
});
