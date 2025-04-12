from django.core.management.base import BaseCommand
from openpyxl import load_workbook
from app.models import ExcelFile, Actividad, Peligro, Riesgo, MedidaControl, Artactividad

class Command(BaseCommand):
    help = 'Procesa archivos Excel y limpia datos inactivos'

    def handle(self, *args, **kwargs):
        self.delete_data_for_inactive_or_deleted_files()
        self.process_active_files()

    def delete_data_for_inactive_or_deleted_files(self):
        inactive_or_deleted_files = ExcelFile.objects.filter(is_active=False)

        if not inactive_or_deleted_files.exists():
            self.stdout.write(self.style.WARNING('No hay archivos inactivos o eliminados.'))
            return

        for excel_file in inactive_or_deleted_files:
            actividades = Actividad.objects.filter(artactividad__nombre=excel_file.file.name)

            Peligro.objects.filter(actividad__in=actividades).delete()
            Riesgo.objects.filter(actividad__in=actividades).delete()
            MedidaControl.objects.filter(actividad__in=actividades).delete()
            actividades.delete()

            self.stdout.write(self.style.SUCCESS(f'Datos del archivo {excel_file.file.name} eliminados.'))

        inactive_or_deleted_files.delete()

    def process_active_files(self):
        excel_files = ExcelFile.objects.filter(is_active=True)

        if not excel_files.exists():
            self.stdout.write(self.style.ERROR('No hay archivos Excel activos.'))
            return

        for excel_file in excel_files:
            try:
                workbook = load_workbook(excel_file.file.path, data_only=True)
                sheet = workbook.active
                self.stdout.write(self.style.SUCCESS(f'Procesando archivo: {excel_file.file.name}'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Error al cargar el archivo {excel_file.file.name}: {e}'))
                continue

            # Obtener el identificador general de la actividad
            superpadre_datos = " ".join(
                [sheet[f'{col}11'].value.strip() if sheet[f'{col}11'].value else "" for col in "CDEFGHIJKLMNOPQRSTUVWXYZ"]
            ).strip()

            if not superpadre_datos:
                self.stdout.write(self.style.ERROR('No se encontró información en la fila 11 de las columnas C a Z.'))
                continue

            superpadre, _ = Artactividad.objects.update_or_create(
                nombre=superpadre_datos,
                defaults={'descripcion': superpadre_datos}
            )

            row = 99
            while True:
                actividad_parte_b = sheet[f'B{row}'].value
                actividad_parte_c = sheet[f'C{row}'].value

                if not actividad_parte_b and not actividad_parte_c:
                    break

                actividad_nombre = f"{actividad_parte_b.strip() if actividad_parte_b else ''} {actividad_parte_c.strip() if actividad_parte_c else ''}".strip()
                actividad, _ = Actividad.objects.update_or_create(
                    nombre=actividad_nombre,
                    artactividad=superpadre
                )

                # Extraer peligros
                peligro_desc = " ".join(
                    [sheet[f'{col}{row}'].value.strip() if sheet[f'{col}{row}'].value else "" for col in "DEFGHI"]
                ).strip()
                if peligro_desc:
                    for p in filter(None, peligro_desc.split(".,")):
                        Peligro.objects.update_or_create(
                            actividad=actividad,
                            descripcion=p.strip(),
                            defaults={'descripcion': p.strip()}
                        )

                # Extraer riesgos
                riesgo_desc = " ".join(
                    [sheet[f'{col}{row}'].value.strip() if sheet[f'{col}{row}'].value else "" for col in "JKLM"]
                ).strip()
                if riesgo_desc:
                    for r in filter(None, riesgo_desc.split(".,")):
                        Riesgo.objects.update_or_create(
                            actividad=actividad,
                            descripcion=r.strip(),
                            defaults={'descripcion': r.strip()}
                        )

                # Extraer medidas de control
                medida_desc = " ".join(
                    [sheet[f'{col}{row}'].value.strip() if sheet[f'{col}{row}'].value else "" for col in "NOPQRSTUVWX"]
                ).strip()
                if medida_desc:
                    for m in filter(None, medida_desc.split(".,")):
                        MedidaControl.objects.update_or_create(
                            actividad=actividad,
                            descripcion=m.strip(),
                            defaults={'descripcion': m.strip()}
                        )

                self.stdout.write(f'Fila {row}: Actividad "{actividad_nombre}" procesada.')
                row += 1

        self.stdout.write(self.style.SUCCESS('Sincronización completada.'))
