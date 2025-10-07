import en from './en';
import cn from './cn';
import enEx from 'brand/lang/en';
import cnEx from 'brand/lang/cn';

const dictionary = {
  en: {
    ...en,
    ...enEx
  },
  cn: {
    ...cn,
    ...cnEx
  }
};

export default dictionary;
