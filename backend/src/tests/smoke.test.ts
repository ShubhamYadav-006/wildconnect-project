import { test, describe } from 'node:test';
import assert from 'node:assert';
import { signToken, verifyToken } from '../utils/jwt.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import app from '../app.js';

describe('WildConnect Backend Smoke Tests', () => {
  test('Express application initializes correctly', () => {
    assert.ok(app, 'Express app should be instantiated');
    assert.strictEqual(typeof app.listen, 'function', 'App should have listen function');
  });

  test('ApiResponse formats data consistently', () => {
    const successRes = ApiResponse.success('Data retrieved', { count: 5 });
    assert.strictEqual(successRes.success, true);
    assert.strictEqual(successRes.message, 'Data retrieved');
    assert.deepStrictEqual(successRes.data, { count: 5 });

    const paginatedRes = ApiResponse.paginated('List', [1, 2], 1, 10, 2);
    assert.strictEqual(paginatedRes.success, true);
    assert.strictEqual(paginatedRes.meta.totalPages, 1);
  });

  test('JWT authentication tokens sign and verify accurately', () => {
    const payload = { id: 'test-user-id-123', role: 'TOURIST' as const };
    const token = signToken(payload);
    assert.ok(typeof token === 'string' && token.length > 20, 'Token should be a valid string');

    const decoded = verifyToken(token);
    assert.strictEqual(decoded.id, payload.id);
    assert.strictEqual(decoded.role, payload.role);
  });
});
