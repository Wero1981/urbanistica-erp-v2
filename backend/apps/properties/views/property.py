"""ViewSet de inmuebles patrimoniales."""

from rest_framework.viewsets import ModelViewSet

from ..models import Asset, Property
from ..permissions import PropertyPermission
from ..serializers import PropertySerializer
from ..services.company_context import get_active_company


class PropertyViewSet(ModelViewSet):
    """CRUD de inmuebles limitado a la empresa del encabezado."""

    serializer_class = PropertySerializer
    permission_classes = (PropertyPermission,)

    def get_queryset(self):
        company = get_active_company(self.request)
        return Property.objects.select_related(
            "asset",
            "property_type",
        ).filter(
            asset__company=company,
            asset__category=Asset.Category.PROPERTY,
            asset__status=Asset.Status.ACTIVE,
        ).order_by("asset__code", "id")

    def perform_create(self, serializer):
        serializer.save(company=get_active_company(self.request))

    def perform_destroy(self, instance):
        """Realiza la baja lógica del bien, conservando el inmueble."""

        instance.asset.status = Asset.Status.INACTIVE
        instance.asset.save(update_fields=("status", "updated_at"))
