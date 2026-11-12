
"""Socios y participaciones empresariales."""

from decimal import Decimal

from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class CompanyPartner(models.Model):

    company = models.ForeignKey(
        "companies.Company",
        on_delete=models.CASCADE,
        related_name="partners",
    )

    person = models.ForeignKey(
        "companies.Person",
        on_delete=models.PROTECT,
        related_name="company_participations",
    )

    ownership_percentage = models.DecimalField(
        "porcentaje de participación",
        max_digits=5,
        decimal_places=2,
        validators=[
            MinValueValidator(Decimal("0.01")),
            MaxValueValidator(Decimal("100.00")),
        ],
    )

    contribution_amount = models.DecimalField(
        "aportación de capital",
        max_digits=16,
        decimal_places=2,
        null=True,
        blank=True,
    )

    start_date = models.DateField(
        "fecha de ingreso",
        null=True,
        blank=True,
    )

    end_date = models.DateField(
        "fecha de salida",
        null=True,
        blank=True,
    )

    is_active = models.BooleanField(default=True)

    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "company_partners"
        ordering = ["company", "person"]
        constraints = [
            models.UniqueConstraint(
                fields=["company", "person"],
                name="unique_company_partner",
            )
        ]

    def __str__(self):
        return (
            f"{self.person} - {self.company} "
            f"({self.ownership_percentage}%)"
        )
