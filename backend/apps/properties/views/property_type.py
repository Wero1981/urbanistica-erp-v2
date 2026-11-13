"""ViewSet del catálogo de tipos de inmueble."""

from rest_framework.viewsets import ModelViewSet

from ..models import PropertyType
from ..permissions import PropertyPermission
from ..serializers import PropertyTypeSerializer
from ..services.company_context import get_active_company


class PropertyTypeViewSet(ModelViewSet):
    """Administra tipos activos tras validar la empresa seleccionada."""

    serializer_class = PropertyTypeSerializer
    permission_classes = (PropertyPermission,)

    def get_queryset(self):
        get_active_company(self.request)
        return PropertyType.objects.filter(is_active=True).order_by("name", "id")

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save(update_fields=("is_active",))
