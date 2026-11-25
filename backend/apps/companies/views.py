from rest_framework.viewsets import ModelViewSet
from .models import Company, CompanyAddress, CompanyPartner, CompanyRepresentative
from .permissions import CompanyPermission
from .serializers import (
    CompanyAddressSerializer,
    CompanyPartnerSerializer,
    CompanyRepresentativeSerializer,
    CompanySerializer,
)


class CompanyViewSet(ModelViewSet):
    queryset = Company.objects.filter(is_active=True).order_by("name", "id")
    serializer_class = CompanySerializer
    permission_classes = (CompanyPermission,)

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save(update_fields=("is_active", "updated_at"))


class CompanyRelationViewSet(ModelViewSet):
    """Base de relaciones empresariales con filtro y baja lógica."""

    permission_classes = (CompanyPermission,)

    def get_queryset(self):
        queryset = super().get_queryset().filter(is_active=True)
        company_id = self.request.query_params.get("company")
        if company_id:
            queryset = queryset.filter(company_id=company_id)
        return queryset

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save(update_fields=("is_active", "updated_at"))


class CompanyAddressViewSet(CompanyRelationViewSet):
    """CRUD de domicilios empresariales."""

    queryset = CompanyAddress.objects.select_related("company").all()
    serializer_class = CompanyAddressSerializer


class CompanyPartnerViewSet(CompanyRelationViewSet):
    """CRUD de socios empresariales."""

    queryset = CompanyPartner.objects.select_related("company", "person").all()
    serializer_class = CompanyPartnerSerializer


class CompanyRepresentativeViewSet(CompanyRelationViewSet):
    """CRUD de representantes legales."""

    queryset = CompanyRepresentative.objects.select_related("company", "person").all()
    serializer_class = CompanyRepresentativeSerializer
