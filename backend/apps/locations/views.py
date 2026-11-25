"""Vistas de consulta del catálogo SEPOMEX."""

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import PostalCode
from .serializers import PostalCodeSerializer


class PostalCodeDetailView(APIView):
    """Consulta los asentamientos de un código postal válido."""

    def get(self, request, postal_code):
        if len(postal_code) != 5 or not postal_code.isascii() or not postal_code.isdigit():
            return Response(
                {"detail": "El código postal debe contener 5 dígitos."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        queryset = PostalCode.objects.filter(postal_code=postal_code)
        first = queryset.first()
        if first is None:
            return Response(
                {"detail": "Código postal no encontrado."},
                status=status.HTTP_404_NOT_FOUND,
            )

        data = PostalCodeSerializer(queryset, many=True).data
        return Response({
            "postal_code": postal_code,
            "state": first.state,
            "municipality": first.municipality,
            "city": first.city,
            "settlements": [
                {
                    "id": item["id"],
                    "name": item["settlement"],
                    "type": item["settlement_type"],
                    "settlement_code": item["settlement_code"],
                }
                for item in data
            ],
        })
