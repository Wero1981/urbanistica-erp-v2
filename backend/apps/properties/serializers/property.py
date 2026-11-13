"""Serializadores de bienes patrimoniales e inmuebles."""

from django.db import transaction
from rest_framework import serializers

from apps.companies.models import Company
from ..models import Asset, Property, PropertyType


class AssetSerializer(serializers.ModelSerializer):
    """Representa el bien patrimonial asociado a un inmueble."""

    class Meta:
        model = Asset
        fields = (
            "id", "code", "name", "category", "status", "description",
            "created_at", "updated_at",
        )
        read_only_fields = (
            "id", "code", "category", "status", "created_at", "updated_at",
        )


class PropertySerializer(serializers.ModelSerializer):
    """Crea y actualiza un inmueble junto con su bien patrimonial."""

    asset = AssetSerializer()
    property_type = serializers.PrimaryKeyRelatedField(
        queryset=PropertyType.objects.filter(is_active=True),
    )

    class Meta:
        model = Property
        fields = (
            "id", "asset", "property_type", "postal_code", "state",
            "municipality", "neighborhood", "street", "exterior_number",
            "interior_number", "land_area", "construction_area", "levels",
            "physical_details",
        )
        read_only_fields = ("id",)

    def validate(self, attrs):
        """Impide asociar un inmueble a un bien de otra categoría."""

        initial = getattr(self, "initial_data", {})
        asset_input = initial.get("asset", {})
        if "company" in initial or "company" in asset_input:
            raise serializers.ValidationError(
                {"company": "La empresa se obtiene exclusivamente de X-Company-ID."}
            )
        if self.instance is None:
            forbidden = sorted({"code", "category", "status"} & set(asset_input))
            if forbidden:
                raise serializers.ValidationError({
                    "asset": {
                        field: "Este campo es generado y controlado por el servidor."
                        for field in forbidden
                    }
                })
        asset = getattr(self.instance, "asset", None)
        if asset is not None and asset.category != Asset.Category.PROPERTY:
            raise serializers.ValidationError(
                {"asset": "El bien patrimonial debe tener categoría property."}
            )
        return attrs

    @staticmethod
    def _next_asset_code(company):
        """Calcula el siguiente código mientras la empresa está bloqueada."""

        prefix = "INM-"
        codes = Asset.objects.filter(
            company=company,
            code__startswith=prefix,
        ).values_list("code", flat=True)
        numbers = [
            int(code[len(prefix):])
            for code in codes
            if code[len(prefix):].isdigit()
        ]
        return f"{prefix}{max(numbers, default=0) + 1:06d}"

    @transaction.atomic
    def create(self, validated_data):
        """Registra Asset y Property en una sola transacción."""

        company = validated_data.pop("company")
        asset_data = validated_data.pop("asset")
        locked_company = Company.objects.select_for_update().get(
            pk=company.pk,
            is_active=True,
        )
        asset = Asset.objects.create(
            company=locked_company,
            code=self._next_asset_code(locked_company),
            category=Asset.Category.PROPERTY,
            **asset_data,
        )
        if asset.category != Asset.Category.PROPERTY:
            raise serializers.ValidationError(
                {"asset": "El bien patrimonial debe tener categoría property."}
            )
        return Property.objects.create(asset=asset, **validated_data)

    @transaction.atomic
    def update(self, instance, validated_data):
        """Actualiza conjuntamente los datos patrimoniales y del inmueble."""

        asset_data = validated_data.pop("asset", None)
        if instance.asset.category != Asset.Category.PROPERTY:
            raise serializers.ValidationError(
                {"asset": "El bien patrimonial debe tener categoría property."}
            )
        if asset_data is not None:
            for field, value in asset_data.items():
                setattr(instance.asset, field, value)
            instance.asset.save(update_fields=(*asset_data.keys(), "updated_at"))
        return super().update(instance, validated_data)
