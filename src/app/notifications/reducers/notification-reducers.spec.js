import { expect } from 'chai';
import { Creators } from 'app/notifications/actions';
import { Creators as MessagingCreators } from 'app/messaging/actions';
import reducer, {
  INITIAL_STATE
} from 'app/notifications/reducers/notification-reducers';

describe('Notifications: reducers', function() {
  describe('receiveChatMessage', () => {
    let msg;
    let expected;

    beforeEach(() => {
      msg = {
        meta: {},
        body: '{"foo":"bar"}'
      };
      expected = [{ meta: {}, body: { foo: 'bar' }, isRead: false }];
    });

    it('should add message to state', () => {
      const actual = reducer(
        INITIAL_STATE,
        Creators.receiveChatMessage(msg, false)
      );
      expect(actual).to.eql(expected);
    });

    it('should set isRead property to boolean value provided as second argument', () => {
      const actual = reducer(
        INITIAL_STATE,
        Creators.receiveChatMessage(msg, false)
      );
      expect(actual[0].isRead).to.eql(false);
    });
  });

  describe('chatSelected', function() {
    describe('if a message exists in the state belonging to the selected chat', function() {
      it('should set the isRead property for the message to true', function() {
        const initialState = [
          {
            meta: {
              event: 'message'
            },
            body: {
              chat_id: 1
            },
            isRead: false
          }
        ];
        const expected = [
          {
            meta: {
              event: 'message'
            },
            body: {
              chat_id: 1
            },
            isRead: true
          }
        ];

        const chat_id = 1;

        const actual = reducer(
          initialState,
          MessagingCreators.chatSelected(chat_id)
        );

        expect(actual).to.eql(expected);
      });
    });
  });
});
