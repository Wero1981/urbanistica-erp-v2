"""Serializadores del catálogo SEPOMEX."""

from rest_framework import serializers

from .models import PostalCode


class PostalCodeSerializer(serializers.ModelSerializer):
    """Expone los datos necesarios para seleccionar un asentamiento."""

    class Meta:
        model = PostalCode
        fields = (
            "id", "postal_code", "settlement", "settlement_type",
            "municipality", "state", "city", "settlement_code",
        )
