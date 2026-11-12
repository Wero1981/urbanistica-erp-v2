
"""Modelo principal de empresas de Urbanística ERP V2."""

from django.db import models
from django.core.validators import RegexValidator


class Company(models.Model):
    """Empresa administrada dentro del ERP."""

    class CompanyType(models.TextChoices):
        MORAL = "moral", "Persona moral"
        FISICA = "fisica", "Persona física"

    class TaxRegime(models.TextChoices):
        GENERAL = "601", "General de Ley Personas Morales"
        RESICO_MORAL = "626", "Régimen Simplificado de Confianza"
        ACTIVIDAD_EMPRESARIAL = "612", "Personas Físicas con Actividades Empresariales"
        ARRENDAMIENTO = "606", "Arrendamiento"
        OTRO = "otro", "Otro"

    name = models.CharField(
        "razón social o nombre completo",
        max_length=200,
    )

    trade_name = models.CharField(
        "nombre comercial",
        max_length=200,
        blank=True,
    )

    company_type = models.CharField(
        "tipo de contribuyente",
        max_length=10,
        choices=CompanyType.choices,
        default=CompanyType.MORAL,
    )

    rfc = models.CharField(
        "RFC",
        max_length=13,
        blank=True,
        db_index=True,
        validators=[
            RegexValidator(
                regex=r"^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$",
                message="RFC con formato inválido.",
            )
        ],
    )

    tax_regime = models.CharField(
        "régimen fiscal",
        max_length=10,
        choices=TaxRegime.choices,
        blank=True,
    )

    incorporation_date = models.DateField(
        "fecha de constitución",
        null=True,
        blank=True,
    )

    incorporation_deed = models.CharField(
        "número de escritura constitutiva",
        max_length=100,
        blank=True,
    )

    notary_name = models.CharField(
        "nombre del notario",
        max_length=200,
        blank=True,
    )

    notary_number = models.CharField(
        "número de notaría",
        max_length=20,
        blank=True,
    )

    commercial_registry = models.CharField(
        "folio mercantil",
        max_length=100,
        blank=True,
    )

    economic_activity = models.TextField(
        "actividad económica principal",
        blank=True,
    )

    website = models.URLField(
        "sitio web",
        blank=True,
    )

    notes = models.TextField(
        "observaciones",
        blank=True,
    )

    is_active = models.BooleanField(
        "activa",
        default=True,
        db_index=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "companies"
        verbose_name = "empresa"
        verbose_name_plural = "empresas"
        ordering = ["name"]

    def __str__(self):
        return self.trade_name or self.name
