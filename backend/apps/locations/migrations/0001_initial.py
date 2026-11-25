"""Registra el modelo no administrado del catálogo SEPOMEX existente."""

from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True
    dependencies = []
    operations = [
        migrations.CreateModel(
            name="PostalCode",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("postal_code", models.CharField(db_index=True, max_length=5)),
                ("settlement", models.CharField(max_length=200)),
                ("settlement_type", models.CharField(blank=True, max_length=100)),
                ("municipality", models.CharField(max_length=150)),
                ("state", models.CharField(max_length=150)),
                ("city", models.CharField(blank=True, max_length=150)),
                ("state_code", models.CharField(blank=True, max_length=2)),
                ("municipality_code", models.CharField(blank=True, max_length=3)),
                ("settlement_code", models.CharField(blank=True, max_length=10)),
                ("zone_type", models.CharField(blank=True, max_length=50)),
            ],
            options={
                "db_table": "postal_codes",
                "ordering": ["postal_code", "settlement"],
                "managed": False,
            },
        ),
    ]
