from rest_framework import serializers
from apps.accounts.models import Role
from apps.accounts.permissions import role_code
from .models import Company


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = (
            "id", "name", "trade_name", "company_type", "rfc", "tax_regime",
            "incorporation_date", "incorporation_deed", "notary_name", "notary_number",
            "commercial_registry", "economic_activity", "website", "notes",
            "is_active", "created_at", "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")

    def validate_is_active(self, value):
        if not value and role_code(self.context["request"].user) != Role.ADMINISTRADOR:
            raise serializers.ValidationError("Solo el administrador puede dar de baja empresas.")
        return value
