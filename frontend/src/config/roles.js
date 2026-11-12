export const roles = { administrador: 'Administrador', capturista: 'Capturista', consulta: 'Consulta' };
export function getRole(user) {
  const code = typeof user?.role === 'string' ? user.role : user?.role?.code;
  return Object.hasOwn(roles, code) ? code : null;
}
export function canAccess(role, module) {
  if (!Object.hasOwn(roles, role)) return false;
  return !['usuarios', 'roles'].includes(module) || role === 'administrador';
}
export function canWrite(role) { return ['administrador', 'capturista'].includes(role); }
