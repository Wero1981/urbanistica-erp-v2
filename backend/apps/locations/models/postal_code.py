from django.db import models


class PostalCode(models.Model):
    postal_code = models.CharField(
        max_length=5,
        db_index=True,
    )

    settlement = models.CharField(
        max_length=200,
    )

    settlement_type = models.CharField(
        max_length=100,
        blank=True,
    )

    municipality = models.CharField(
        max_length=150,
    )

    state = models.CharField(
        max_length=150,
    )

    city = models.CharField(
        max_length=150,
        blank=True,
    )

    state_code = models.CharField(
        max_length=2,
        blank=True,
    )

    municipality_code = models.CharField(
        max_length=3,
        blank=True,
    )

    settlement_code = models.CharField(
        max_length=10,
        blank=True,
    )

    zone_type = models.CharField(
        max_length=50,
        blank=True,
    )

    class Meta:
        db_table = "postal_codes"
        ordering = ["postal_code", "settlement"]

    def __str__(self):
        return f"{self.postal_code} - {self.settlement}"