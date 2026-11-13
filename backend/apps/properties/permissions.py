from rest_framework.permissions import SAFE_METHODS

from apps.accounts.models import Role
from apps.accounts.permissions import HasGlobalRole, role_code
from .services.company_context import get_active_company

class PropertyPermission(HasGlobalRole):
    """Permisos de lectura y escritura para la vista de propiedades."""

    message = "No tienes permisos para realizar esta acción."


    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False

        get_active_company(request)
        role = role_code(request.user)

        if request.method in SAFE_METHODS:
            return True

        if request.method == "DELETE":
            return role == Role.ADMINISTRADOR

        return role in (
            Role.ADMINISTRADOR,
            Role.CAPTURISTA,
        )
