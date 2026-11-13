"""Pruebas de la API de inmuebles y tipos."""

from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken

from apps.accounts.models import Role, User
from apps.companies.models import Company
from apps.properties.models import Asset, Property, PropertyType


class PropertyAPITests(APITestCase):
    """Verifica ámbito empresarial y ciclo de vida de inmuebles."""

    @classmethod
    def setUpTestData(cls):
        role = Role.objects.create(code=Role.ADMINISTRADOR)
        cls.user = User.objects.create_user(
            username="property-admin",
            email="property-admin@example.test",
            role=role,
        )
        cls.company = Company.objects.create(name="Empresa Uno")
        cls.other_company = Company.objects.create(name="Empresa Dos")
        cls.inactive_company = Company.objects.create(name="Inactiva", is_active=False)
        cls.property_type = PropertyType.objects.create(name="Casa", code="casa")

    def setUp(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {AccessToken.for_user(self.user)}",
            HTTP_X_COMPANY_ID=str(self.company.pk),
        )

    def payload(self, name="Inmueble de prueba"):
        return {
            "asset": {"name": name, "description": "Patrimonio empresarial"},
            "property_type": self.property_type.pk,
            "postal_code": "06000",
            "state": "Ciudad de México",
            "municipality": "Cuauhtémoc",
            "neighborhood": "Centro",
            "street": "Reforma",
            "exterior_number": "100",
            "interior_number": "2",
            "land_area": "125.50",
            "construction_area": "90.25",
            "levels": 2,
            "physical_details": {"parking_spaces": 2},
        }

    def test_creates_asset_and_property_atomically_with_sequential_code(self):
        first = self.client.post("/api/properties/properties/", self.payload(), format="json")
        second = self.client.post(
            "/api/properties/properties/",
            self.payload("Segundo inmueble"),
            format="json",
        )
        self.assertEqual(first.status_code, 201, first.data)
        self.assertEqual(second.status_code, 201, second.data)
        self.assertEqual(first.data["asset"]["code"], "INM-000001")
        self.assertEqual(second.data["asset"]["code"], "INM-000002")
        asset = Asset.objects.get(pk=first.data["asset"]["id"])
        self.assertEqual(asset.company, self.company)
        self.assertEqual(asset.category, Asset.Category.PROPERTY)
        self.assertTrue(Property.objects.filter(asset=asset).exists())
        self.assertEqual(first.data["construction_area"], "90.25")
        self.assertEqual(first.data["levels"], 2)
        self.assertEqual(first.data["physical_details"], {"parking_spaces": 2})

    def test_filters_every_property_by_header_company(self):
        own = self.client.post("/api/properties/properties/", self.payload(), format="json")
        other_asset = Asset.objects.create(
            company=self.other_company,
            code="INM-000001",
            name="Ajeno",
            category=Asset.Category.PROPERTY,
        )
        other = Property.objects.create(asset=other_asset, property_type=self.property_type)
        response = self.client.get("/api/properties/properties/")
        self.assertEqual(response.status_code, 200)
        ids = {row["id"] for row in response.data["results"]}
        self.assertEqual(ids, {own.data["id"]})
        self.assertEqual(
            self.client.get(f"/api/properties/properties/{other.pk}/").status_code,
            404,
        )

    def test_updates_nested_asset_and_property(self):
        created = self.client.post("/api/properties/properties/", self.payload(), format="json")
        response = self.client.patch(
            f"/api/properties/properties/{created.data['id']}/",
            {"asset": {"name": "Nombre actualizado"}, "levels": 3},
            format="json",
        )
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(response.data["asset"]["name"], "Nombre actualizado")
        self.assertEqual(response.data["levels"], 3)

    def test_rejects_company_in_json(self):
        payload = self.payload()
        payload["company"] = self.other_company.pk
        response = self.client.post("/api/properties/properties/", payload, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertFalse(Asset.objects.exists())

    def test_rejects_server_controlled_asset_fields_on_create(self):
        """El cliente no puede elegir código, categoría ni estado."""

        for field, value in (
            ("code", "MANUAL-1"),
            ("category", Asset.Category.VEHICLE),
            ("status", Asset.Status.INACTIVE),
        ):
            payload = self.payload()
            payload["asset"][field] = value
            response = self.client.post(
                "/api/properties/properties/",
                payload,
                format="json",
            )
            self.assertEqual(response.status_code, 400, response.data)
        self.assertFalse(Asset.objects.exists())

    def test_logical_delete_hides_property(self):
        created = self.client.post("/api/properties/properties/", self.payload(), format="json")
        url = f"/api/properties/properties/{created.data['id']}/"
        self.assertEqual(self.client.delete(url).status_code, 204)
        asset = Asset.objects.get(pk=created.data["asset"]["id"])
        self.assertEqual(asset.status, Asset.Status.INACTIVE)
        self.assertTrue(Property.objects.filter(pk=created.data["id"]).exists())
        self.assertEqual(self.client.get(url).status_code, 404)

    def test_property_type_crud_requires_company_context(self):
        created = self.client.post(
            "/api/properties/types/",
            {"name": "Bodega", "code": "bodega"},
            format="json",
        )
        self.assertEqual(created.status_code, 201, created.data)
        response = self.client.get("/api/properties/types/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["count"], 2)
        self.assertEqual(
            self.client.delete(f"/api/properties/types/{created.data['id']}/").status_code,
            204,
        )
        self.assertFalse(PropertyType.objects.get(pk=created.data["id"]).is_active)
