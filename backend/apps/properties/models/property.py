
from django.db import models


class Property(models.Model):
    """Información específica de un inmueble patrimonial."""

    asset = models.OneToOneField(
        "properties.Asset",
        on_delete=models.PROTECT,
        related_name="property_detail",
    )

    property_type = models.ForeignKey(
        "properties.PropertyType",
        on_delete=models.PROTECT,
        related_name="properties",
    )

    # Domicilio
    postal_code = models.CharField(max_length=5, blank=True)
    state = models.CharField(max_length=100, blank=True)
    municipality = models.CharField(max_length=150, blank=True)
    neighborhood = models.CharField(max_length=200, blank=True)
    street = models.CharField(max_length=200, blank=True)
    exterior_number = models.CharField(max_length=30, blank=True)
    interior_number = models.CharField(max_length=30, blank=True)

    # Características físicas generales
    land_area = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        null=True,
        blank=True,
    )

    construction_area = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        null=True,
        blank=True,
    )

    levels = models.PositiveSmallIntegerField(null=True, blank=True)

    physical_details = models.JSONField(default=dict, blank=True)

    class Meta:
        db_table = "properties_properties"

    def __str__(self):
        return self.asset.name
