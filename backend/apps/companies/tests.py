from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken
from apps.accounts.models import Role, User
from .models import Company, CompanyAddress, CompanyPartner, CompanyRepresentative


class CompanyAPITests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.users = {}
        for code, _ in Role.ROLE_CHOICES:
            role = Role.objects.create(code=code)
            cls.users[code] = User.objects.create_user(username=code, email=f'{code}@example.test', role=role)
        cls.company = Company.objects.create(name='Empresa de prueba', trade_name='Compañía Ñ', rfc='ABC010101AB1')
        cls.inactive = Company.objects.create(name='Inactiva', is_active=False)

    def authenticate(self, role):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {AccessToken.for_user(self.users[role])}')

    def test_anonymous_cannot_access_any_action(self):
        for method, url in [('get', '/api/companies/'), ('post', '/api/companies/'), ('get', f'/api/companies/{self.company.pk}/'), ('patch', f'/api/companies/{self.company.pk}/'), ('delete', f'/api/companies/{self.company.pk}/')]:
            self.assertEqual(getattr(self.client, method)(url).status_code, 401)

    def test_all_roles_read_global_companies_and_frontend_shape(self):
        for role in self.users:
            self.authenticate(role)
            response = self.client.get('/api/companies/', HTTP_X_COMPANY_ID='999999')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.data['count'], 1)
            company = response.data['results'][0]
            self.assertTrue({'id', 'name', 'trade_name', 'rfc', 'is_active'} <= company.keys())
            self.assertNotIn('company', company)
            self.assertEqual(company['trade_name'], 'Compañía Ñ')
            self.assertEqual(self.client.get(f'/api/companies/{self.company.pk}/').status_code, 200)
            self.assertEqual(self.client.get(f'/api/companies/{self.inactive.pk}/').status_code, 404)

    def test_admin_and_capturista_create_put_patch(self):
        for role in ['administrador', 'capturista']:
            self.authenticate(role)
            response = self.client.post('/api/companies/', {'name': f'Nueva {role}', 'rfc': 'ABC010101AB1'}, format='json')
            self.assertEqual(response.status_code, 201, response.data)
            url = f'/api/companies/{response.data["id"]}/'
            self.assertEqual(self.client.put(url, {'name': 'Actualizada'}, format='json').status_code, 200)
            self.assertEqual(self.client.patch(url, {'trade_name': 'Sucursal'}, format='json').status_code, 200)
            self.assertEqual(self.client.get(url).data['trade_name'], 'Sucursal')

    def test_consulta_cannot_write(self):
        self.authenticate('consulta')
        for method, url in [('post', '/api/companies/'), ('put', f'/api/companies/{self.company.pk}/'), ('patch', f'/api/companies/{self.company.pk}/'), ('delete', f'/api/companies/{self.company.pk}/')]:
            self.assertEqual(getattr(self.client, method)(url, {'name': 'No permitido'}, format='json').status_code, 403)
        self.company.refresh_from_db()
        self.assertEqual(self.company.name, 'Empresa de prueba')

    def test_soft_delete_never_removes_row(self):
        self.authenticate('administrador')
        url = f'/api/companies/{self.company.pk}/'
        self.assertEqual(self.client.delete(url).status_code, 204)
        self.company.refresh_from_db()
        self.assertFalse(self.company.is_active)
        self.assertEqual(self.client.get(url).status_code, 404)
        self.assertEqual(self.client.get('/api/companies/').data['count'], 0)
        self.assertEqual(self.client.delete(url).status_code, 404)

    def test_capturista_cannot_bypass_soft_delete_policy(self):
        self.authenticate('capturista')
        url = f'/api/companies/{self.company.pk}/'
        self.assertEqual(self.client.delete(url).status_code, 403)
        self.assertEqual(self.client.patch(url, {'is_active': False}, format='json').status_code, 400)
        self.assertEqual(self.client.post('/api/companies/', {'name': 'Inactiva', 'is_active': False}, format='json').status_code, 400)

    def test_validation_and_unknown_company(self):
        self.authenticate('administrador')
        for data in [{}, {'name': ''}, {'name': 'Empresa', 'rfc': 'incorrecto'}, {'name': 'Empresa', 'company_type': 'invalid'}, {'name': 'Empresa', 'website': 'invalid'}]:
            self.assertEqual(self.client.post('/api/companies/', data, format='json').status_code, 400)
        self.assertEqual(self.client.get('/api/companies/999999/').status_code, 404)

    def test_page_number_pagination(self):
        Company.objects.bulk_create([Company(name=f'Empresa {i:03}') for i in range(51)])
        self.authenticate('consulta')
        first = self.client.get('/api/companies/?page=1').data
        second = self.client.get('/api/companies/?page=2').data
        self.assertEqual(first['count'], 52)
        self.assertEqual(len(first['results']), 50)
        self.assertIn('page=2', first['next'])
        self.assertEqual(len(second['results']), 2)
        self.assertIsNone(second['next'])
        self.assertFalse({c['id'] for c in first['results']} & {c['id'] for c in second['results']})

    def test_company_relations_crud_and_nested_people(self):
        """Administrador crea, consulta, modifica y desactiva relaciones."""
        self.authenticate('administrador')

        address = self.client.post('/api/company-addresses/', {
            'company': self.company.pk,
            'address_type': 'fiscal',
            'street': 'Reforma',
            'exterior_number': '100',
            'neighborhood': 'Centro',
            'postal_code': '06000',
            'municipality': 'Cuauhtémoc',
            'state': 'Ciudad de México',
            'country': 'México',
        }, format='json')
        self.assertEqual(address.status_code, 201, address.data)

        person = {
            'person_type': 'fisica',
            'first_name': 'Ana',
            'last_name': 'Pérez',
            'nationality': 'Mexicana',
        }
        partner = self.client.post('/api/company-partners/', {
            'company': self.company.pk,
            'person': person,
            'ownership_percentage': '40.00',
        }, format='json')
        self.assertEqual(partner.status_code, 201, partner.data)

        representative = self.client.post('/api/company-representatives/', {
            'company': self.company.pk,
            'person': {**person, 'first_name': 'Luis'},
            'position': 'Apoderado legal',
        }, format='json')
        self.assertEqual(representative.status_code, 201, representative.data)

        response = self.client.get(f'/api/company-partners/?company={self.company.pk}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['person']['first_name'], 'Ana')

        partner_url = f'/api/company-partners/{partner.data["id"]}/'
        updated = self.client.patch(partner_url, {
            'ownership_percentage': '45.00',
            'person': {'first_name': 'Anabel'},
        }, format='json')
        self.assertEqual(updated.status_code, 200, updated.data)
        self.assertEqual(updated.data['person']['first_name'], 'Anabel')

        self.assertEqual(self.client.delete(partner_url).status_code, 204)
        self.assertFalse(CompanyPartner.objects.get(pk=partner.data['id']).is_active)
        self.assertEqual(CompanyAddress.objects.filter(is_active=True).count(), 1)
        self.assertEqual(CompanyRepresentative.objects.filter(is_active=True).count(), 1)

    def test_company_relations_respect_global_roles(self):
        """Consulta no escribe y capturista no elimina relaciones."""
        payload = {
            'company': self.company.pk,
            'address_type': 'fiscal',
            'street': 'Uno',
            'exterior_number': '1',
            'neighborhood': 'Centro',
            'postal_code': '06000',
            'municipality': 'Cuauhtémoc',
            'state': 'Ciudad de México',
        }
        self.authenticate('consulta')
        self.assertEqual(self.client.post('/api/company-addresses/', payload, format='json').status_code, 403)

        self.authenticate('capturista')
        created = self.client.post('/api/company-addresses/', payload, format='json')
        self.assertEqual(created.status_code, 201, created.data)
        self.assertEqual(
            self.client.delete(f'/api/company-addresses/{created.data["id"]}/').status_code,
            403,
        )
