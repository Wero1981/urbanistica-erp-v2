"""Importa el catálogo postal de SEPOMEX sin borrar registros existentes."""
import csv
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from apps.locations.models import PostalCode


COLUMNS = {
    "postal_code": "d_codigo",
    "settlement": "d_asenta",
    "settlement_type": "d_tipo_asenta",
    "municipality": "D_mnpio",
    "state": "d_estado",
    "city": "d_ciudad",
    "state_code": "c_estado",
    "municipality_code": "c_mnpio",
    "settlement_code": "id_asenta_cpcons",
    "zone_type": "d_zona",
}
KEY_FIELDS = ("postal_code", "state_code", "municipality_code", "settlement_code", "settlement")


class Command(BaseCommand):
    help = "Importa CPdescarga.txt; omite asentamientos ya registrados, sin borrarlos ni modificarlos."

    def add_arguments(self, parser):
        parser.add_argument("file", nargs="?", default=str(Path(__file__).with_name("CPdescarga.txt")))
        parser.add_argument("--encoding", default="cp1252", help="Codificación del archivo (predeterminada: cp1252).")
        parser.add_argument("--dry-run", action="store_true", help="Valida y cuenta sin guardar.")

    def handle(self, *args, **options):
        records = []
        try:
            with Path(options["file"]).open(encoding=options["encoding"], newline="") as source:
                # El archivo oficial contiene una nota antes de la cabecera.
                for line in source:
                    if line.lstrip("\ufeff").startswith("d_codigo|"):
                        headers = line.lstrip("\ufeff").strip().split("|")
                        break
                else:
                    raise CommandError("No se encontró la cabecera d_codigo del catálogo postal.")
                missing = set(COLUMNS.values()) - set(headers)
                if missing:
                    raise CommandError(f"Faltan columnas: {', '.join(sorted(missing))}")
                for number, row in enumerate(csv.DictReader(source, fieldnames=headers, delimiter="|"), start=1):
                    if None in row or any(value is None for value in row.values()):
                        raise CommandError(f"Registro {number}: número de columnas incorrecto.")
                    data = {field: row[column].strip() for field, column in COLUMNS.items()}
                    code = data["postal_code"]
                    if len(code) != 5 or not code.isascii() or not code.isdigit():
                        raise CommandError(f"Registro {number}: código postal inválido: {code!r}.")
                    for name, value in data.items():
                        field = PostalCode._meta.get_field(name)
                        if (not field.blank and not value) or len(value) > field.max_length:
                            raise CommandError(f"Registro {number}: valor inválido para {name}.")
                    records.append(data)
        except (OSError, UnicodeError, LookupError, csv.Error) as exc:
            raise CommandError(f"No se pudo leer el catálogo: {exc}") from exc
        if not records:
            raise CommandError("El catálogo no contiene registros.")

        # La lectura y validación terminan antes de insertar; todo se guarda en una transacción.
        existing = set(PostalCode.objects.values_list(*KEY_FIELDS))
        pending = []
        skipped = 0
        for data in records:
            key = tuple(data[field] for field in KEY_FIELDS)
            if key in existing:
                skipped += 1
                continue
            existing.add(key)
            pending.append(PostalCode(**data))
        if options["dry_run"]:
            self.stdout.write(f"Validación: {len(records)} leídos; {len(pending)} nuevos; {skipped} existentes o repetidos. Sin guardar.")
            return
        with transaction.atomic():
            PostalCode.objects.bulk_create(pending, batch_size=1000)
        self.stdout.write(self.style.SUCCESS(f"Importación completada: {len(pending)} creados; {skipped} omitidos."))
