from rest_framework.viewsets import ModelViewSet
from .models import Company
from .permissions import CompanyPermission
from .serializers import CompanySerializer


class CompanyViewSet(ModelViewSet):
    queryset = Company.objects.filter(is_active=True).order_by("name", "id")
    serializer_class = CompanySerializer
    permission_classes = (CompanyPermission,)

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save(update_fields=("is_active", "updated_at"))
