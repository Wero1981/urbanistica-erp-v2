"""Vistas públicas del módulo de propiedades."""

from .property import PropertyViewSet
from .property_type import PropertyTypeViewSet

__all__ = ["PropertyViewSet", "PropertyTypeViewSet"]
