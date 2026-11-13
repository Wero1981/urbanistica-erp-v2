"""Rutas REST del módulo de propiedades."""

from rest_framework.routers import DefaultRouter

from .views import PropertyTypeViewSet, PropertyViewSet

router = DefaultRouter()
router.register("properties", PropertyViewSet, basename="property")
router.register("types", PropertyTypeViewSet, basename="property-type")

urlpatterns = router.urls
