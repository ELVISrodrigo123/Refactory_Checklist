from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser
from django import forms
from app.models import (ExcelFile, Actividad, Peligro, Riesgo, MedidaControl, Artactividad, Area,Sector,FormularioChecklist,TituloChecklist,TareaChecklist,RespuestaChecklist, RespuestaTarea, RevisionChecklist)




class ExcelFileForm(forms.ModelForm):
    class Meta:
        model = ExcelFile
        fields = ['description', 'file', 'is_active']

    def clean_file(self):
        file = self.cleaned_data.get('file')
        if file:
            pass
        return file


class ExcelFileAdmin(admin.ModelAdmin):
    form = ExcelFileForm
    list_display = ('description', 'file', 'is_active', 'created_at')
    search_fields = ('description',)
    list_filter = ('is_active',)

class RespuestaTareaInline(admin.TabularInline):
    model = RespuestaTarea
    extra = 0
    readonly_fields = ('tarea',)
    fields = ('tarea', 'estado_bueno', 'estado_malo', 'comentario')

class RevisionChecklistInline(admin.TabularInline):
    model = RevisionChecklist
    extra = 0
    readonly_fields = ('usuario', 'fecha_revision')
    fields = ('usuario', 'estado', 'observaciones', 'fecha_revision')

class RespuestaChecklistAdmin(admin.ModelAdmin):
    list_display = ('formulario', 'usuario', 'fecha_respuesta', 'ultima_revision')
    list_filter = ('formulario__sector', 'usuario')
    search_fields = ('formulario__titulo', 'usuario__username')
    inlines = [RespuestaTareaInline, RevisionChecklistInline]
    
    def ultima_revision(self, obj):
        revision = obj.revisiones.last()
        return revision.estado if revision else 'Sin revisión'
    ultima_revision.short_description = 'Última revisión'

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'identity_card', 'role')
    fieldsets = UserAdmin.fieldsets + (
        ('Información adicional', {'fields': ('photo', 'identity_card', 'phone_number', 'shift_type', 'shift_group', 'role')}),
    )

admin.site.register(ExcelFile, ExcelFileAdmin)
admin.site.register(Actividad)
admin.site.register(Peligro)
admin.site.register(Riesgo)
admin.site.register(MedidaControl)
admin.site.register(Artactividad)
admin.site.register(Area)
admin.site.register(Sector)
admin.site.register(FormularioChecklist)
admin.site.register(TituloChecklist)
admin.site.register(TareaChecklist)
admin.site.register(RespuestaChecklist, RespuestaChecklistAdmin)
admin.site.register(RevisionChecklist)
admin.site.register(RespuestaTarea)



admin.site.register(CustomUser, CustomUserAdmin)
