from rest_framework.permissions import SAFE_METHODS
from apps.accounts.models import Role
from apps.accounts.permissions import HasGlobalRole, role_code


class CompanyPermission(HasGlobalRole):
    message = "Su rol global no permite modificar empresas."

    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        if request.method in SAFE_METHODS:
            return True
        if request.method == "DELETE":
            return role_code(request.user) == Role.ADMINISTRADOR
        return role_code(request.user) in (Role.ADMINISTRADOR, Role.CAPTURISTA)
