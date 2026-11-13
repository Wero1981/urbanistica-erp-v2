"""Pruebas de permisos globales y empresa activa."""

from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken

from apps.accounts.models import Role, User
from apps.companies.models import Company
from apps.properties.models import PropertyType


class PropertyPermissionTests(APITestCase):
    """Comprueba permisos por rol sin relaciones UserCompany."""

    @classmethod
    def setUpTestData(cls):
        cls.users = {}
        for code, _ in Role.ROLE_CHOICES:
            role = Role.objects.create(code=code)
            cls.users[code] = User.objects.create_user(
                username=f"properties-{code}",
                email=f"properties-{code}@example.test",
                role=role,
            )
        cls.company = Company.objects.create(name="Empresa activa")
        cls.inactive = Company.objects.create(name="Empresa inactiva", is_active=False)
        cls.property_type = PropertyType.objects.create(name="Terreno", code="terreno")

    def authenticate(self, role, company=None):
        headers = {
            "HTTP_AUTHORIZATION": f"Bearer {AccessToken.for_user(self.users[role])}",
        }
        if company is not None:
            headers["HTTP_X_COMPANY_ID"] = str(company.pk)
        self.client.credentials(**headers)

    def payload(self):
        return {
            "asset": {"name": "Terreno"},
            "property_type": self.property_type.pk,
        }

    def test_requires_authenticated_user_and_company_header(self):
        self.assertEqual(self.client.get("/api/properties/properties/").status_code, 401)
        self.authenticate(Role.ADMINISTRADOR)
        self.assertEqual(self.client.get("/api/properties/properties/").status_code, 400)
        self.authenticate(Role.ADMINISTRADOR, self.inactive)
        self.assertEqual(self.client.get("/api/properties/properties/").status_code, 404)

    def test_consulta_is_read_only(self):
        self.authenticate(Role.CONSULTA, self.company)
        self.assertEqual(self.client.get("/api/properties/properties/").status_code, 200)
        self.assertEqual(
            self.client.post("/api/properties/properties/", self.payload(), format="json").status_code,
            403,
        )

    def test_capturista_creates_and_edits_but_cannot_delete(self):
        self.authenticate(Role.CAPTURISTA, self.company)
        created = self.client.post("/api/properties/properties/", self.payload(), format="json")
        self.assertEqual(created.status_code, 201, created.data)
        url = f"/api/properties/properties/{created.data['id']}/"
        self.assertEqual(
            self.client.patch(url, {"street": "Nueva calle"}, format="json").status_code,
            200,
        )
        self.assertEqual(self.client.delete(url).status_code, 403)
