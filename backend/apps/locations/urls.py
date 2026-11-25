"""Rutas de consulta geográfica."""

from django.urls import path

from .views import PostalCodeDetailView

app_name = "locations"

urlpatterns = [
    path(
        "postal-codes/<str:postal_code>/",
        PostalCodeDetailView.as_view(),
        name="postal-code-detail",
    ),
]
