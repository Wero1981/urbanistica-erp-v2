from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from apps.accounts.views import UserViewSet

users_router = DefaultRouter()
users_router.register("users", UserViewSet, basename="user")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("apps.accounts.urls")),
    path("api/locations/", include("apps.locations.urls")),
    path("api/properties/", include("apps.properties.urls")),
    path("api/", include("apps.companies.urls")),
    path("api/", include(users_router.urls)),
]
