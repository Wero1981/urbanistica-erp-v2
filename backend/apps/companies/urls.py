from rest_framework.routers import DefaultRouter
from .views import (
    CompanyAddressViewSet,
    CompanyPartnerViewSet,
    CompanyRepresentativeViewSet,
    CompanyViewSet,
)

router = DefaultRouter()
router.register("companies", CompanyViewSet, basename="company")
router.register("company-addresses", CompanyAddressViewSet, basename="company-address")
router.register("company-partners", CompanyPartnerViewSet, basename="company-partner")
router.register(
    "company-representatives",
    CompanyRepresentativeViewSet,
    basename="company-representative",
)
urlpatterns = router.urls
