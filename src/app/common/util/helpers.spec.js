import { assert } from 'chai';
import {
  checkRolesAndPermissions,
  matchPermissions,
  noop,
  checkResponse
} from './helpers';
import { User } from '../../../../test/mockData';
import { Roles } from 'app/core/config/constants';

describe('COMMON: Helpers', () => {
  describe('noop', () => {
    it('noop should equal undefined', () => {
      assert.deepEqual(noop(), undefined);
      assert.deepEqual(noop(true), undefined);
      assert.deepEqual(noop(false), undefined);
    });
  });

  describe('checkResponse', () => {
    it('checkResponse should succeed with data', () => {
      const expected = {
        ok: true,
        data: { data: 'im ok', status: 'success' }
      };
      return checkResponse(expected).then(actual =>
        assert.deepEqual(actual, expected.data)
      );
    });

    it('checkResponse should fail with error', () => {
      const expected = {
        problem: 'unidentified_error'
      };
      return checkResponse(expected).catch(actual =>
        assert.deepEqual(actual, expected.problem)
      );
    });
  });

  describe('Roles and permission checks', () => {
    describe('checkRolesAndPermissions()', () => {
      // Matching permissions
      it('Should deny user without matching permissions', () => {
        const mockAllowedPermissions = {
          '/videos': []
        };
        const mockAllowedRoles = [Roles.SuperAdmin];
        assert.deepEqual(
          checkRolesAndPermissions(
            User,
            mockAllowedRoles,
            mockAllowedPermissions
          ),
          false
        );
      });
      // Matching roles
      it('Should deny user without matching roles', () => {
        const mockAllowedPermissions = {
          '/test-resource': []
        };
        const mockAllowedRoles = [Roles.Learner];
        assert.deepEqual(
          checkRolesAndPermissions(
            User,
            mockAllowedRoles,
            mockAllowedPermissions
          ),
          false
        );
      });
    });

    describe('matchPermissions()', () => {
      // Permission matching function is working
      it('Should return true for matching permissions', () => {
        const mockAllowedPermissions = {
          '/test-resource': ['deny-premission', 'allow-permission']
        };
        const mockUserPermissions = {
          '/test-resource': ['allow-permission']
        };
        assert.deepEqual(
          matchPermissions(mockUserPermissions, mockAllowedPermissions),
          true
        );
      });
    });

    // it('<UserAccess /> component will not display content if user doesnt have a matching role', () => {

    // });
  });
});
