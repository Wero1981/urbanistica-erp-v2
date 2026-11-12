import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canAccess, canWrite, getRole } from '../src/config/roles.js';
test('roles globales: administración restringida y consulta sin escritura', () => {
  for (const role of ['administrador', 'capturista', 'consulta']) {
    assert.equal(canAccess(role, 'inmuebles'), true);
    assert.equal(canAccess(role, 'usuarios'), role === 'administrador');
    assert.equal(canAccess(role, 'roles'), role === 'administrador');
    assert.equal(canWrite(role), role !== 'consulta');
  }
});
test('no infiere privilegios por nombre, superusuario ni membresía V1', () => {
  assert.equal(getRole({ username: 'admin', is_superuser: true }), null);
  assert.equal(getRole({ role: { name: 'Administrador' } }), null);
  assert.equal(getRole({ role: { code: 'capturista' } }), 'capturista');
  for (const role of [null, undefined, 'admin', 'toString']) {
    assert.equal(canAccess(role, 'dashboard'), false);
    assert.equal(canWrite(role), false);
  }
});
