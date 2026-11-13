
from django.db import models


class PropertyType(models.Model):
    """Catálogo configurable de tipos de inmuebles."""

    name = models.CharField(max_length=100, unique=True)
    code = models.SlugField(max_length=50, unique=True)

    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "properties_types"
        ordering = ["name"]

    def __str__(self):
        return self.name
