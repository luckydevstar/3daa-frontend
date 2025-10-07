import dictionary from './lang';
import { forEachObjIndexed, type, map } from 'ramda';
import { sprintf } from 'sprintf-js';
import { select } from 'redux-saga/effects';
import { languageSelector } from 'app/common/util/saga-selectors';

export const _t = (key, lang) => {
  lang = dictionary[lang] ? lang : 'en';
  return dictionary[lang][key] || key;
};

export const _tt = (text, lang) => {
  lang = dictionary[lang] ? lang : 'en';
  let key = '';
  forEachObjIndexed((v, k) => {
    if (v === text) key = k;
  });
  return _t(key, lang);
};

// Vals are not translated
export const _tf = (key, vals, lang) => {
  if (type(vals) !== 'Array') return '';

  lang = dictionary[lang] ? lang : 'en';
  return dictionary[lang][key] ? sprintf(dictionary[lang][key], ...vals) : key;
};

// vkeys are translated
export const _tfk = (key, vkeys, lang) => {
  const translateKeys = k => _t(k, lang);
  const vals = map(translateKeys, vkeys);
  return _tf(key, vals, lang);
};

export const _tLevel = (level, lang) => {
  if (level === 0) {
    return _t('all_levels', lang);
  }
  return _tf('level_f', [level - 1], lang);
};

// Can be only used in saga
export function* translate(key) {
  const lang = yield select(languageSelector);
  return _t(key, lang);
}

export function* translatef(key, vals) {
  const lang = yield select(languageSelector);
  return _tf(key, vals, lang);
}
