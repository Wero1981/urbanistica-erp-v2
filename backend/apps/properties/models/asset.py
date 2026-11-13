
from django.db import models


class Asset(models.Model):
    """Bien patrimonial perteneciente a una empresa."""

    class Category(models.TextChoices):
        PROPERTY = "property", "Inmueble"
        VEHICLE = "vehicle", "Vehículo"
        OTHER = "other", "Otro bien"

    class Status(models.TextChoices):
        ACTIVE = "active", "Activo"
        INACTIVE = "inactive", "Inactivo"

    company = models.ForeignKey(
        "companies.Company",
        on_delete=models.PROTECT,
        related_name="assets",
    )

    code = models.CharField(max_length=50)
    name = models.CharField(max_length=200)

    category = models.CharField(
        max_length=20,
        choices=Category.choices,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE,
    )

    description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "properties_assets"
        constraints = [
            models.UniqueConstraint(
                fields=["company", "code"],
                name="unique_asset_code_per_company",
            )
        ]

    def __str__(self):
        return f"{self.code} - {self.name}"
