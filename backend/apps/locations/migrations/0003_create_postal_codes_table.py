"""Crea la tabla SEPOMEX omitida por el estado inicial no administrado."""

from django.db import migrations


def create_postal_codes_table(apps, schema_editor):
    """Crea postal_codes solamente cuando todavía no existe."""

    postal_code = apps.get_model("locations", "PostalCode")
    existing_tables = schema_editor.connection.introspection.table_names()
    if postal_code._meta.db_table not in existing_tables:
        schema_editor.create_model(postal_code)


def drop_postal_codes_table(apps, schema_editor):
    """Elimina la tabla al revertir, si aún existe."""

    postal_code = apps.get_model("locations", "PostalCode")
    existing_tables = schema_editor.connection.introspection.table_names()
    if postal_code._meta.db_table in existing_tables:
        schema_editor.delete_model(postal_code)


class Migration(migrations.Migration):
    # MySQL no permite ejecutar CREATE TABLE dentro de una migración atómica.
    atomic = False

    dependencies = [
        ("locations", "0002_alter_postalcode_options"),
    ]

    operations = [
        migrations.RunPython(
            create_postal_codes_table,
            drop_postal_codes_table,
        ),
    ]
