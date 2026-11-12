
"""Domicilios asociados a las empresas."""

from django.db import models
from django.core.validators import RegexValidator


class CompanyAddress(models.Model):

    class AddressType(models.TextChoices):
        FISCAL = "fiscal", "Fiscal"
        ADMINISTRATIVO = "administrativo", "Administrativo"
        CORRESPONDENCIA = "correspondencia", "Correspondencia"
        OTRO = "otro", "Otro"

    company = models.ForeignKey(
        "companies.Company",
        on_delete=models.CASCADE,
        related_name="addresses",
    )

    address_type = models.CharField(
        max_length=20,
        choices=AddressType.choices,
        default=AddressType.FISCAL,
    )

    street = models.CharField(max_length=200)
    exterior_number = models.CharField(max_length=20)
    interior_number = models.CharField(max_length=20, blank=True)

    neighborhood = models.CharField(max_length=150)

    postal_code = models.CharField(
        max_length=5,
        validators=[
            RegexValidator(
                regex=r"^\d{5}$",
                message="El código postal debe contener 5 dígitos.",
            )
        ],
    )

    municipality = models.CharField(max_length=150)
    state = models.CharField(max_length=100)

    country = models.CharField(
        max_length=100,
        default="México",
    )

    references = models.TextField(blank=True)

    is_primary = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "company_addresses"
        ordering = ["company", "address_type"]

    def __str__(self):
        return f"{self.company} - {self.get_address_type_display()}"
