/* global define, it, describe, FormData */
import { expect } from 'chai';
import reducer, {
  INITIAL_STATE
} from 'app/community/reducers/community-reducer';

describe('COMMUNITY: REDUCERS', () => {
  describe('Default', () => {
    it('should return the initial state', () => {
      const state = reducer(undefined, {});
      expect(state).to.equal(INITIAL_STATE);
    });
  });
});
