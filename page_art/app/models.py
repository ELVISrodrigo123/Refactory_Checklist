import os
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model


def upload_to(instance, filename):
    return f"excel_files/{filename}"

class ExcelFile(models.Model):
    description = models.CharField(max_length=255, blank=True, null=True)
    file = models.FileField(upload_to=upload_to, help_text='Sube el archivo Excel aquí.', verbose_name='Archivo Excel')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.description or "Archivo Excel"

class Artactividad(models.Model):
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField()

    def __str__(self):
        return self.nombre

class Actividad(models.Model):
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField()
    artactividad = models.ForeignKey(Artactividad, on_delete=models.CASCADE)

    def __str__(self):
        return self.nombre


class Peligro(models.Model):
    descripcion = models.TextField()
    actividad = models.ForeignKey(Actividad, on_delete=models.CASCADE, related_name='peligros')

    def __str__(self):
        return self.descripcion

class Riesgo(models.Model):
    descripcion = models.TextField()
    actividad = models.ForeignKey(Actividad, on_delete=models.CASCADE, related_name='riesgos')

    def __str__(self):
        return self.descripcion


class MedidaControl(models.Model):
    descripcion = models.TextField()
    actividad = models.ForeignKey(Actividad, on_delete=models.CASCADE, related_name='medidascontrol')

    def __str__(self):
        return self.descripcion
    
class Area(models.Model):
    OPCIONES_ACTIVIDAD = [
        ('210', '210-CHANCADO'),
        ('220', '220-DOMO'),
        ('230', '230-MOLIENDA'),
        ('240', '240-FLOTACION PLOMO'),
        ('250', '250-FLOTACION ZINC'),
        ('270', '270-REACTIVOS'),
        ('310', '310-ESPESADORES'),
        ('320', '320-FILTROS'),
        ('330', '330-CARGUIO'),
    ]
    
    artactividad = models.ForeignKey(
        Artactividad,
        on_delete=models.CASCADE,
        verbose_name='Area Principal',
        related_name='Area'
    )
    
    opcion = models.CharField(
        max_length=3,
        choices=OPCIONES_ACTIVIDAD,
        verbose_name='Opción de Area',
        help_text='Selecciona una opción de Area predefinida.'
    )

    def __str__(self):
        return f'{self.artactividad.nombre} - {self.get_opcion_display()}'

    class Meta:
        verbose_name = 'Area'
        verbose_name_plural = 'Areas'
        constraints = [
            models.UniqueConstraint(
                fields=['artactividad', 'opcion'],
                name='unique_artactividad_opcion'
            )
        ]

class CustomUser(AbstractUser):
    # Campos personalizados
    photo = models.ImageField(
        verbose_name='Foto',
        upload_to='photos/',
        blank=True,  # No es obligatorio
        null=True    # Permite valores nulos en la base de datos
    )
    
    identity_card = models.CharField(
        verbose_name='Carnet de Identidad',
        max_length=20,
        unique=True,
        blank=True,  # No es obligatorio
        null=True,   # Permite valores nulos en la base de datos
        help_text='El carnet de identidad debe ser único.'
    )
    
    first_name = models.CharField(
        verbose_name='Nombre',
        max_length=100,
        blank=True,  # No es obligatorio
        null=True    # Permite valores nulos en la base de datos
    )
    
    last_name = models.CharField(
        verbose_name='Apellido',
        max_length=150,
        blank=True,  # No es obligatorio
        null=True    # Permite valores nulos en la base de datos
    )
    
    phone_number = models.CharField(
        verbose_name='Número de Celular',
        max_length=15,
        default='',
        help_text='Incluye el código de área si es necesario. Ejemplo: +591 78965412'
    )
    
    email = models.EmailField(
        verbose_name='Correo Electrónico',
        unique=True,
        blank=True,  # No es obligatorio
        null=True    # Permite valores nulos en la base de datos
    )
    
    shift_type = models.CharField(
        verbose_name='Turno',
        max_length=10,
        choices=[
            ('Día', 'Día'),
            ('Noche', 'Noche'),
        ],
        blank=True,  # No es obligatorio
        null=True,   # Permite valores nulos en la base de datos
        help_text='Indica si el usuario está en el turno de día o de noche.'
    )
    
    shift_group = models.PositiveSmallIntegerField(
        verbose_name='Grupo',
        choices=[
            (1, 'Grupo 1'),
            (2, 'Grupo 2'),
            (3, 'Grupo 3'),
            (4, 'Grupo 4'),
        ],
        blank=True,  # No es obligatorio
        null=True,   # Permite valores nulos en la base de datos
        help_text='Selecciona el grupo de turno del usuario (1 a 4).'
    )
    
    role = models.CharField(
        verbose_name='Rol',
        max_length=20,
        choices=[
            ('jefe_area', 'Jefe de Área'),
            ('capataz', 'Capataz'),
            ('operador', 'Operador'),
        ],
        blank=True,  # No es obligatorio
        null=True,   # Permite valores nulos en la base de datos
        help_text='Rol del usuario en el sistema.'
    )
    
    def __str__(self):
        return f'{self.username} - {self.first_name} {self.last_name}'
    
def validar_tres_digitos(value):
    if not value.isdigit() or len(value) != 3:
        raise ValidationError('El nombre del sector debe ser un número de tres dígitos.')

class Sector(models.Model):
    nombre = models.CharField(max_length=255, validators=[validar_tres_digitos])
    descripcion = models.CharField(max_length=255)
    def __str__(self):
        return self.nombre

User = get_user_model()

class FormularioChecklist(models.Model):
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('en_revision', 'En Revisión'),
        ('aprobado', 'Aprobado'),
        ('rechazado', 'Rechazado'),
    ]
    titulo = models.CharField(max_length=255)
    sector = models.ForeignKey(Sector, on_delete=models.CASCADE, related_name="formularios")
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    item = models.CharField(max_length=255)
    aspecto_a_verificar = models.CharField(max_length=255)
    bueno = models.CharField(max_length=100)
    malo = models.CharField(max_length=100)
    comentarios = models.CharField(max_length=255)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente')
    version = models.CharField(max_length=20) 
    codigo = models.CharField(max_length=20)
    def __str__(self):
        return self.titulo

class TituloChecklist(models.Model):
    formulario = models.ForeignKey(FormularioChecklist, on_delete=models.CASCADE, related_name="titulos")
    nombre = models.CharField(max_length=255)
    def __str__(self):
        return self.nombre
    
User = get_user_model()

class TareaChecklist(models.Model):
    titulo = models.ForeignKey('TituloChecklist', on_delete=models.CASCADE, related_name="tareas")
    descripcion = models.TextField()
    def __str__(self):
        return self.descripcion

class RespuestaChecklist(models.Model):
    formulario = models.ForeignKey(FormularioChecklist, on_delete=models.CASCADE, related_name="respuestas")
    usuario = models.ForeignKey(get_user_model(), on_delete=models.SET_NULL, null=True)
    fecha_respuesta = models.DateTimeField(auto_now_add=True)
    comentario_general = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"Respuesta de {self.usuario} para {self.formulario}"

class RespuestaTarea(models.Model):
    respuesta = models.ForeignKey(RespuestaChecklist, on_delete=models.CASCADE, related_name="respuestas_tareas")
    tarea = models.ForeignKey(TareaChecklist, on_delete=models.CASCADE)
    estado_bueno = models.BooleanField(default=False)
    estado_malo = models.BooleanField(default=False)
    comentario = models.TextField(blank=True, null=True)
    ESTADO_OPCIONES = [
        ('no_critico', 'No Crítico'),
        ('algo_critico', 'Algo Crítico'),
        ('critico', 'Crítico'),
    ]
    
    def __str__(self):
        return f"Respuesta para {self.tarea}"

class RevisionChecklist(models.Model):
    ESTADO_REVISION = [
        ('pendiente', 'Pendiente'),
        ('revisado', 'Revisado'),
        ('observado', 'Observado'),
    ]
    
    respuesta = models.ForeignKey(RespuestaChecklist, on_delete=models.CASCADE, related_name="revisiones")
    usuario = models.ForeignKey(get_user_model(), on_delete=models.SET_NULL, null=True)
    fecha_revision = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=20, choices=ESTADO_REVISION, default='pendiente')
    observaciones = models.TextField(blank=True, null=True)
    
    class Meta:
        ordering = ['-fecha_revision']
    
    def __str__(self):
        return f"Revisión por {self.usuario} - {self.estado}"