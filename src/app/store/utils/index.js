import { find, propEq } from 'ramda';
import { createSelector } from 'reselect';
import * as lodash from 'lodash';

export const getCourse = (store, qualification_id) =>
  find(propEq('qualification_id', parseInt(qualification_id)))(
    store.qualifications
  );

export const getItemCount = (store, qualification_id) => {
  const item = find(propEq('course_id', parseInt(qualification_id)))(
    store.cart
  );
  return item && item.count;
};

export const getCartDetails = createSelector(
  store => store.qualifications,
  store => store.cart,
  (qualifications, cart) => {
    return cart.map(item => {
      const qualification = lodash.find(
        qualifications,
        q => lodash.get(q, 'qualification_id') == item.qualification_id
      );

      return {
        qualification_id: item.qualification_id,
        count: item.count,
        title: lodash.get(qualification, 'title'),
        price: lodash.get(qualification, 'price', 0)
      };
    });
  }
);

export const getTotalAmount = createSelector(
  store => store.qualifications,
  store => store.cart,
  (qualifications, cart) => {
    let sum = 0;
    cart.forEach(item => {
      const qualification = lodash.find(
        qualifications,
        q => lodash.get(q, 'qualification_id') == item.qualification_id
      );
      sum += parseInt(item.count) * lodash.get(qualification, 'price', 0);
    });
    return Math.round(sum * 100) / 100;
  }
);
