"""Autorización global, independiente de la empresa seleccionada."""
from rest_framework.permissions import BasePermission
from .models import Role


def role_code(user):
    if not user or not user.is_authenticated or not user.is_active:
        return None
    return getattr(user.role, "code", None)


class HasGlobalRole(BasePermission):
    message = "El usuario no tiene un rol global válido."

    def has_permission(self, request, view):
        return role_code(request.user) in dict(Role.ROLE_CHOICES)


class IsGlobalAdministrator(BasePermission):
    message = "Solo el administrador puede administrar usuarios."

    def has_permission(self, request, view):
        return role_code(request.user) == Role.ADMINISTRADOR
