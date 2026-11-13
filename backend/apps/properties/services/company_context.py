"""Resolución de la empresa activa indicada en cada petición."""

from rest_framework.exceptions import NotFound, ValidationError

from apps.companies.models import Company


def get_active_company(request):
    """Obtiene y almacena la empresa activa desde ``X-Company-ID``.

    La selección es explícita y global por petición; no depende de una
    relación entre usuarios y empresas.
    """

    cached = getattr(request, "active_company", None)
    if cached is not None:
        return cached

    company_id = request.headers.get("X-Company-ID")
    if not company_id:
        raise ValidationError({"detail": "Debe indicar X-Company-ID."})
    if not company_id.isascii() or not company_id.isdigit():
        raise ValidationError({"detail": "X-Company-ID debe ser un identificador válido."})

    try:
        company = Company.objects.get(pk=company_id, is_active=True)
    except Company.DoesNotExist as exc:
        raise NotFound("La empresa activa no existe o está inactiva.") from exc

    request.active_company = company
    return company
