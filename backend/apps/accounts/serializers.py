from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed, PermissionDenied
from rest_framework_simplejwt.tokens import AccessToken
from .models import Role, User
from .permissions import role_code


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate(self, attrs):
        user = authenticate(request=self.context.get("request"), **attrs)
        if user is None:
            raise AuthenticationFailed("El usuario o la contraseña no son correctos.")
        if role_code(user) not in dict(Role.ROLE_CHOICES):
            raise PermissionDenied("El usuario no tiene un rol global válido.")
        return {"access": str(AccessToken.for_user(user))}


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ("code",)


class CurrentUserSerializer(serializers.ModelSerializer):
    role = RoleSerializer(read_only=True)

    class Meta:
        model = User
        fields = ("id", "username", "first_name", "last_name", "role")


class UserSerializer(serializers.ModelSerializer):
    role = serializers.SlugRelatedField(slug_field="code", queryset=Role.objects.filter(code__in=dict(Role.ROLE_CHOICES)))
    password = serializers.CharField(write_only=True, required=False, trim_whitespace=False)

    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name", "role", "is_active", "password")
        read_only_fields = ("id",)

    def validate(self, attrs):
        if self.instance is None and "password" not in attrs:
            raise serializers.ValidationError({"password": "Este campo es obligatorio."})
        if "password" in attrs:
            candidate = User(**{key: attrs.get(key, getattr(self.instance, key, "")) for key in ("username", "email", "first_name", "last_name")})
            try:
                validate_password(attrs["password"], candidate)
            except DjangoValidationError as error:
                raise serializers.ValidationError({"password": error.messages}) from error
        return attrs

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for key, value in validated_data.items():
            setattr(instance, key, value)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance
