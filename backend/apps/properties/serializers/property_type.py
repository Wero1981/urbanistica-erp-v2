"""Serializador del catálogo de tipos de inmueble."""

from rest_framework import serializers

from ..models import PropertyType


class PropertyTypeSerializer(serializers.ModelSerializer):
    """Expone tipos activos y permite su administración lógica."""

    class Meta:
        model = PropertyType
        fields = ("id", "name", "code", "is_active")
        read_only_fields = ("id", "is_active")

    def validate(self, attrs):
        if "company" in getattr(self, "initial_data", {}):
            raise serializers.ValidationError(
                {"company": "La empresa se obtiene exclusivamente de X-Company-ID."}
            )
        return attrs
