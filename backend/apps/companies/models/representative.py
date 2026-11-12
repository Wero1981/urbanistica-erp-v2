
"""Representantes legales de las empresas."""

from django.db import models


class CompanyRepresentative(models.Model):

    company = models.ForeignKey(
        "companies.Company",
        on_delete=models.CASCADE,
        related_name="representatives",
    )

    person = models.ForeignKey(
        "companies.Person",
        on_delete=models.PROTECT,
        related_name="legal_representations",
    )

    position = models.CharField(
        max_length=150,
        default="Representante legal",
    )

    powers_description = models.TextField(
        "facultades otorgadas",
        blank=True,
    )

    power_deed_number = models.CharField(
        "escritura del poder",
        max_length=100,
        blank=True,
    )

    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)

    is_active = models.BooleanField(default=True)

    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "company_representatives"
        ordering = ["company", "person"]

    def __str__(self):
        return f"{self.person} - {self.company}"
