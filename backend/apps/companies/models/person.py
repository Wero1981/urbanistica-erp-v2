
"""Personas relacionadas con las empresas."""

from django.db import models


class Person(models.Model):

    class PersonType(models.TextChoices):
        FISICA = "fisica", "Persona física"
        MORAL = "moral", "Persona moral"

    person_type = models.CharField(
        max_length=10,
        choices=PersonType.choices,
        default=PersonType.FISICA,
    )

    first_name = models.CharField(
        max_length=100,
        blank=True,
    )

    last_name = models.CharField(
        max_length=150,
        blank=True,
    )

    business_name = models.CharField(
        max_length=200,
        blank=True,
    )

    rfc = models.CharField(
        max_length=13,
        blank=True,
        db_index=True,
    )

    curp = models.CharField(
        max_length=18,
        blank=True,
    )

    email = models.EmailField(blank=True)

    phone = models.CharField(
        max_length=30,
        blank=True,
    )

    nationality = models.CharField(
        max_length=100,
        default="Mexicana",
    )

    notes = models.TextField(blank=True)

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "persons"
        ordering = ["last_name", "first_name"]

    def __str__(self):
        if self.person_type == self.PersonType.MORAL:
            return self.business_name

        return f"{self.first_name} {self.last_name}".strip()
