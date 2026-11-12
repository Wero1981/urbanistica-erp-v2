
"""Contactos administrativos de empresas."""

from django.db import models


class CompanyContact(models.Model):

    company = models.ForeignKey(
        "companies.Company",
        on_delete=models.CASCADE,
        related_name="contacts",
    )

    name = models.CharField(max_length=200)

    position = models.CharField(
        max_length=150,
        blank=True,
    )

    department = models.CharField(
        max_length=150,
        blank=True,
    )

    email = models.EmailField(blank=True)

    phone = models.CharField(
        max_length=30,
        blank=True,
    )

    mobile = models.CharField(
        max_length=30,
        blank=True,
    )

    is_primary = models.BooleanField(default=False)

    is_active = models.BooleanField(default=True)

    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "company_contacts"
        ordering = ["company", "name"]

    def __str__(self):
        return f"{self.name} - {self.company}"
