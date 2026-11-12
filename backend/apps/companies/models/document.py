
"""Documentos asociados a empresas."""

from django.conf import settings
from django.db import models


def company_document_path(instance, filename):
    """Organiza los archivos por empresa."""

    return f"companies/{instance.company_id}/documents/{filename}"


class CompanyDocument(models.Model):

    class DocumentType(models.TextChoices):
        ACTA = "acta", "Acta constitutiva"
        RFC = "rfc", "Constancia de situación fiscal"
        PODER = "poder", "Poder notarial"
        IDENTIFICACION = "identificacion", "Identificación"
        COMPROBANTE = "comprobante", "Comprobante de domicilio"
        OTRO = "otro", "Otro"

    company = models.ForeignKey(
        "companies.Company",
        on_delete=models.CASCADE,
        related_name="documents",
    )

    document_type = models.CharField(
        max_length=30,
        choices=DocumentType.choices,
    )

    title = models.CharField(max_length=200)

    file = models.FileField(
        upload_to=company_document_path,
    )

    description = models.TextField(blank=True)

    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="uploaded_company_documents",
    )

    uploaded_at = models.DateTimeField(auto_now_add=True)

    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "company_documents"
        ordering = ["-uploaded_at"]

    def __str__(self):
        return f"{self.company} - {self.title}"
