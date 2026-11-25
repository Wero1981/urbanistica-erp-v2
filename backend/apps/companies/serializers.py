from rest_framework import serializers
from apps.accounts.models import Role
from apps.accounts.permissions import role_code
from django.db import transaction

from .models import (
    Company,
    CompanyAddress,
    CompanyPartner,
    CompanyRepresentative,
    Person,
)


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


class CompanyAddressSerializer(serializers.ModelSerializer):
    """Serializa domicilios asociados a una empresa activa."""

    company = serializers.PrimaryKeyRelatedField(
        queryset=Company.objects.filter(is_active=True),
    )

    class Meta:
        model = CompanyAddress
        fields = (
            "id", "company", "address_type", "street", "exterior_number",
            "interior_number", "neighborhood", "postal_code", "municipality",
            "state", "country", "references", "is_primary", "is_active",
            "created_at", "updated_at",
        )
        read_only_fields = ("id", "is_active", "created_at", "updated_at")


class PersonSerializer(serializers.ModelSerializer):
    """Representa los datos personales compartidos por relaciones empresariales."""

    class Meta:
        model = Person
        fields = (
            "id", "person_type", "first_name", "last_name", "business_name",
            "rfc", "curp", "email", "phone", "nationality", "notes",
        )
        read_only_fields = ("id",)

    def validate(self, attrs):
        person_type = attrs.get("person_type", getattr(self.instance, "person_type", "fisica"))
        first_name = attrs.get("first_name", getattr(self.instance, "first_name", ""))
        last_name = attrs.get("last_name", getattr(self.instance, "last_name", ""))
        business_name = attrs.get("business_name", getattr(self.instance, "business_name", ""))
        validates_identity = self.instance is not None or "person_type" in attrs
        if validates_identity and person_type == Person.PersonType.MORAL and not business_name.strip():
            raise serializers.ValidationError({"business_name": "La razón social es obligatoria."})
        if validates_identity and person_type == Person.PersonType.FISICA and not (first_name.strip() and last_name.strip()):
            raise serializers.ValidationError({"first_name": "El nombre y apellidos son obligatorios."})
        return attrs


class PersonRelationSerializer(serializers.ModelSerializer):
    """Base para crear y actualizar relaciones con una persona anidada."""

    person = PersonSerializer()
    company = serializers.PrimaryKeyRelatedField(
        queryset=Company.objects.filter(is_active=True),
    )

    @transaction.atomic
    def create(self, validated_data):
        person_data = validated_data.pop("person")
        person = Person.objects.create(**person_data)
        return self.Meta.model.objects.create(person=person, **validated_data)

    @transaction.atomic
    def update(self, instance, validated_data):
        person_data = validated_data.pop("person", None)
        if person_data is not None:
            serializer = PersonSerializer(
                instance.person,
                data=person_data,
                partial=self.partial,
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
        return super().update(instance, validated_data)


class CompanyPartnerSerializer(PersonRelationSerializer):
    """Serializa socios y su participación empresarial."""

    class Meta:
        model = CompanyPartner
        fields = (
            "id", "company", "person", "ownership_percentage",
            "contribution_amount", "start_date", "end_date", "notes",
            "is_active", "created_at", "updated_at",
        )
        read_only_fields = ("id", "is_active", "created_at", "updated_at")


class CompanyRepresentativeSerializer(PersonRelationSerializer):
    """Serializa representantes legales y sus facultades."""

    class Meta:
        model = CompanyRepresentative
        fields = (
            "id", "company", "person", "position", "powers_description",
            "power_deed_number", "start_date", "end_date", "notes",
            "is_active", "created_at", "updated_at",
        )
        read_only_fields = ("id", "is_active", "created_at", "updated_at")
