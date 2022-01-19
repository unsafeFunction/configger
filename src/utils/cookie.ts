import { CookieStorage } from 'cookie-storage';

let storage: null | CookieStorage = null;
// const today = moment();

function initCookieStorage() {
  try {
    storage = new CookieStorage({
      path: '/',
      // TODO:
      // expires: new Date(moment(today).add(1, 'days')),
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
