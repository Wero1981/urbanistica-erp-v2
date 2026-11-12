from datetime import timedelta
from django.utils import timezone
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken
from .models import Role, User


class AuthenticationTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.roles = {code: Role.objects.create(code=code) for code, _ in Role.ROLE_CHOICES}
        cls.user = User.objects.create_user(username="reader", email="reader@example.test", password="Test-password-917!", role=cls.roles[Role.CONSULTA])

    def token(self, user=None):
        return str(AccessToken.for_user(user or self.user))

    def test_login_and_me_match_frontend_contract(self):
        response = self.client.post('/api/auth/login/', {"username": "reader", "password": "Test-password-917!"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(set(response.data), {"access"})
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {response.data['access']}")
        response = self.client.get('/api/auth/me/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {"id": self.user.pk, "username": "reader", "first_name": "", "last_name": "", "role": {"code": "consulta"}})

    def test_bad_missing_and_inactive_credentials(self):
        self.assertEqual(self.client.post('/api/auth/login/', {"username": "reader", "password": "wrong"}).status_code, 401)
        self.assertEqual(self.client.post('/api/auth/login/', {}).status_code, 400)
        self.user.is_active = False
        self.user.save()
        self.assertEqual(self.client.post('/api/auth/login/', {"username": "reader", "password": "Test-password-917!"}).status_code, 401)

    def test_missing_invalid_expired_and_refresh_tokens(self):
        self.assertEqual(self.client.get('/api/auth/me/').status_code, 401)
        expired = AccessToken.for_user(self.user)
        expired.set_exp(from_time=timezone.now() - timedelta(hours=1), lifetime=timedelta(seconds=1))
        from rest_framework_simplejwt.tokens import RefreshToken
        for token in ['invalid', str(expired), str(RefreshToken.for_user(self.user))]:
            self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
            self.assertEqual(self.client.get('/api/auth/me/').status_code, 401)

    def test_stale_token_does_not_prevent_login(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer invalid')
        self.assertEqual(self.client.post('/api/auth/login/', {"username": "reader", "password": "Test-password-917!"}).status_code, 200)

    def test_role_changes_and_deactivation_apply_to_existing_token(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token()}')
        self.user.role = None
        self.user.is_superuser = True
        self.user.save()
        self.assertEqual(self.client.get('/api/auth/me/').status_code, 403)
        self.assertEqual(self.client.get('/api/companies/').status_code, 403)
        self.assertEqual(self.client.post('/api/auth/login/', {"username": "reader", "password": "Test-password-917!"}).status_code, 403)
        self.user.is_active = False
        self.user.save()
        self.assertEqual(self.client.get('/api/auth/me/').status_code, 401)

    def test_cors_frontend_preflight(self):
        response = self.client.options('/api/companies/', HTTP_ORIGIN='http://localhost:5173', HTTP_ACCESS_CONTROL_REQUEST_METHOD='POST', HTTP_ACCESS_CONTROL_REQUEST_HEADERS='authorization,content-type,x-company-id')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['access-control-allow-origin'], 'http://localhost:5173')
        self.assertIn('x-company-id', response['access-control-allow-headers'])


class UserAdministrationTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.users = {}
        for code, _ in Role.ROLE_CHOICES:
            role = Role.objects.create(code=code)
            cls.users[code] = User.objects.create_user(username=code, email=f'{code}@example.test', password='Test-password-917!', role=role)

    def authenticate(self, role):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {AccessToken.for_user(self.users[role])}')

    def test_only_global_administrator_can_manage_users(self):
        target = self.users['consulta']
        for role in ['capturista', 'consulta']:
            self.authenticate(role)
            for method, url, data in [('get', '/api/users/', {}), ('get', f'/api/users/{target.pk}/', {}), ('post', '/api/users/', {}), ('patch', f'/api/users/{target.pk}/', {'role': 'administrador'}), ('delete', f'/api/users/{target.pk}/', {})]:
                with self.subTest(role=role, method=method):
                    self.assertEqual(getattr(self.client, method)(url, data, format='json').status_code, 403)

    def test_admin_crud_hashes_password_and_cannot_grant_django_privileges(self):
        self.authenticate('administrador')
        data = {'username': 'newuser', 'email': 'new@example.test', 'password': 'Strong-ERP-Password-94!', 'role': 'capturista', 'is_superuser': True, 'is_staff': True}
        response = self.client.post('/api/users/', data, format='json')
        self.assertEqual(response.status_code, 201, response.data)
        self.assertNotIn('password', response.data)
        user = User.objects.get(pk=response.data['id'])
        self.assertTrue(user.check_password(data['password']))
        self.assertFalse(user.is_superuser)
        self.assertFalse(user.is_staff)
        self.assertEqual(self.client.get('/api/users/').status_code, 200)
        url = f'/api/users/{user.pk}/'
        self.assertEqual(self.client.patch(url, {'role': 'consulta', 'password': 'Changed-Password-921!'}, format='json').status_code, 200)
        user.refresh_from_db()
        self.assertTrue(user.check_password('Changed-Password-921!'))
        self.assertEqual(user.role.code, 'consulta')
        self.assertEqual(self.client.delete(url).status_code, 204)
        user.refresh_from_db()
        self.assertFalse(user.is_active)

    def test_invalid_role_and_weak_password(self):
        self.authenticate('administrador')
        for data in [{'role': 'owner'}, {'password': '123'}, {'role': None}]:
            self.assertEqual(self.client.patch(f'/api/users/{self.users["consulta"].pk}/', data, format='json').status_code, 400)
