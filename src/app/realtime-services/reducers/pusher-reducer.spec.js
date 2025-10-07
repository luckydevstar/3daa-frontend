import Immutable from 'seamless-immutable';
import { expect } from 'chai';
import Actions from 'app/realtime-services/actions/creator';
import reducer, {
  INITIAL_STATE
} from 'app/realtime-services/reducers/pusher-reducer';

describe('Realtime services: Pusher reducer', function() {
  describe('realtimeConnectionOnline', function() {
    it("should set 'online' to true", function() {
      const expected = Object.assign({}, INITIAL_STATE, { online: true });
      const actual = reducer(INITIAL_STATE, Actions.realtimeConnectionOnline());

      expect(actual).to.eql(expected);
    });
  });
  describe('realtimeConnectionOffline', function() {
    it("should set 'online' to false", function() {
      const expected = Object.assign({}, INITIAL_STATE, { online: false });
      const actual = reducer(
        INITIAL_STATE,
        Actions.realtimeConnectionOffline()
      );

      expect(actual).to.eql(expected);
    });
  });
});
