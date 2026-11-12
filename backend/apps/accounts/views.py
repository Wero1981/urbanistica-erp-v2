from rest_framework.generics import GenericAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import User
from .permissions import HasGlobalRole, IsGlobalAdministrator
from .serializers import LoginSerializer, CurrentUserSerializer, UserSerializer


class LoginView(GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = (AllowAny,)
    # JWTAuthentication supplies the Bearer challenge for invalid credentials.
    authentication_classes = (JWTAuthentication,)

    def perform_authentication(self, request):
        # Ignore expired/stale Authorization headers when signing in again.
        pass

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data)


class CurrentUserView(RetrieveAPIView):
    serializer_class = CurrentUserSerializer
    permission_classes = (HasGlobalRole,)

    def get_object(self):
        return self.request.user


class UserViewSet(ModelViewSet):
    queryset = User.objects.select_related("role").order_by("id")
    serializer_class = UserSerializer
    permission_classes = (IsGlobalAdministrator,)

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save(update_fields=("is_active",))
