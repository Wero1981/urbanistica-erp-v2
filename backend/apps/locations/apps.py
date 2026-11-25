"""Configuración de la aplicación de ubicaciones."""

from django.apps import AppConfig


class LocationsConfig(AppConfig):
    """Registra la aplicación que reutiliza el catálogo SEPOMEX."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.locations"
    label = "locations"
