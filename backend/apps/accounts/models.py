
"""Usuarios y roles globales de Urbanística ERP V2."""

from django.contrib.auth.models import AbstractUser
from django.db import models


class Role(models.Model):
    """Define los privilegios globales del usuario."""

    ADMINISTRADOR = "administrador"
    CAPTURISTA = "capturista"
    CONSULTA = "consulta"

    ROLE_CHOICES = [
        (ADMINISTRADOR, "Administrador"),
        (CAPTURISTA, "Capturista"),
        (CONSULTA, "Consulta"),
    ]

    code = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        unique=True,
    )

    description = models.CharField(
        max_length=255,
        blank=True,
    )

    class Meta:
        db_table = "roles"
        verbose_name = "rol"
        verbose_name_plural = "roles"

    def __str__(self):
        return self.get_code_display()


class User(AbstractUser):
    """Usuario con privilegios globales para todas las empresas."""

    email = models.EmailField(unique=True)

    role = models.ForeignKey(
        Role,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="users",
    )

    class Meta:
        db_table = "users"

    def __str__(self):
        return self.get_full_name() or self.username
