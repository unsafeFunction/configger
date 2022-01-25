import { CookieStorage } from 'cookie-storage';

let storage: null | CookieStorage = null;

function initCookieStorage() {
  try {
    storage = new CookieStorage({
      path: '/',
    });
  } catch {
    throw new Error('CookieStorage is not supported');
  }

  return storage;
}

export default function cookieStorage() {
  if (storage === null) {
    initCookieStorage();
  }
  return storage;
}
