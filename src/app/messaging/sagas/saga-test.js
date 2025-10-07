/* eslint-disable */
import { assert } from 'chai';
import { select, call, put } from 'redux-saga/effects';
import AppActions from 'app/core/actions/creator';
import Actions from '../actions/creator';
import { checkResponse } from 'app/common/util/helpers';
import API from 'app/core/services/api';
import saga from './chat-saga';
import { respSuccess } from '../../../../test/helpers';

const api = API.wla();

describe('Messaging Saga', () => {
  describe('getChatsAttempt', () => {
    describe.only('success', () => {
      const generator = saga(api).getChatsAttempt();
      const chats = ['test'];
      const mockResp = respSuccess({ chats });

      assert.deepEqual(generator.next().value, call(api.getChats));
      assert.deepEqual(generator.next(mockResp).value, checkResponse(mockResp));
      assert.deepEqual(
        generator.next(mockResp.data).value,
        put(Actions.getChatsSuccess(chats))
      );
    });
  });

  describe('getChatAttempt', () => {});
  describe('newChat - note: this may be better placed in a "UI saga"', () => {});
  describe('newChatAttempt', () => {});
  describe('getMessagesAttempt', () => {});
  describe('sendMessageAttempt', () => {});

  // xdescribe('toggleChat', () => {
  //   it('when open', () => {
  //     const generator = saga(api).toggleChat();
  //     const mockState = { ui: { primarySidebarOpen: true } };
  //     assert.deepEqual(generator.next().value, select());
  //     assert.deepEqual(generator.next(mockState).value, put(AppActions.togglePrimarySidebar()));
  //   });

  //   it('when closed [success]', () => {
  //     const generator = saga(api).toggleChat();
  //     const mockState = { ui: { primarySidebarOpen: false } };
  //     const chats = ['test'];
  //     const mockResp = respSuccess({ chats });
  //     assert.deepEqual(generator.next().value, select());
  //     assert.deepEqual(generator.next(mockState).value, call(api.getChats));
  //     assert.deepEqual(generator.next(mockResp).value, checkResponse(mockResp));
  //     assert.deepEqual(generator.next(mockResp.data).value, put(Actions.getChatsSuccess(chats)));
  //     assert.deepEqual(generator.next().value, put(AppActions.togglePrimarySidebar()));
  //   });

  //   it('when closed [faliure]', () => {
  //     const generator = saga(api).toggleChat();
  //     const mockState = { ui: { primarySidebarOpen: false } };
  //     assert.deepEqual(generator.next().value, select());
  //     assert.deepEqual(generator.next(mockState).value, call(api.getChats));
  //     assert.deepEqual(generator.throw(400).value, put(Actions.getChatsFailure(400)));
  //   });
  // });
});
