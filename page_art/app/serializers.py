from rest_framework import serializers
from .models import ( ExcelFile, Artactividad, Actividad, Peligro, Riesgo, MedidaControl, Area )
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import get_user_model
from .models import Sector, FormularioChecklist, TituloChecklist, TareaChecklist, CustomUser, RespuestaChecklist, RespuestaTarea, RevisionChecklist 

class ExcelFileSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format='%Y-%m-%dT%H:%M:%SZ')
    class Meta:
        model = ExcelFile
        fields = '__all__'

class ActividadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Actividad
        fields = '__all__'

class ArtactividadSerializer(serializers.ModelSerializer):
    actividades = ActividadSerializer(many=True, read_only=True)

    class Meta:
        model = Artactividad
        fields = '__all__'

class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = '__all__'

class ArtactividadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artactividad
        fields = ['id', 'nombre', 'descripcion']

# Serializador para Actividad
class ActividadSerializer(serializers.ModelSerializer):
    artactividad = ArtactividadSerializer(read_only=True)
    class Meta:
        model = Actividad
        fields = ['id', 'nombre', 'descripcion', 'artactividad']

# Serializador para Peligro
class PeligroSerializer(serializers.ModelSerializer):
    actividad = ActividadSerializer(read_only=True)
    class Meta:
        model = Peligro
        fields = ['id', 'descripcion', 'actividad']

# Serializador para Riesgo
class RiesgoSerializer(serializers.ModelSerializer):
    actividad = ActividadSerializer(read_only=True)
    class Meta:
        model = Riesgo
        fields = ['id', 'descripcion', 'actividad']

# Serializador para MedidaControl
class MedidaControlSerializer(serializers.ModelSerializer):
    actividad = ActividadSerializer(read_only=True)
    class Meta:
        model = MedidaControl
        fields = ['id', 'descripcion', 'actividad']

class AreaSerializer(serializers.ModelSerializer):
    opcion_display = serializers.CharField(source='get_opcion_display', read_only=True)
    artactividad_nombre = serializers.CharField(source='artactividad.nombre', read_only=True)

    class Meta:
        model = Area
        fields = "__all__"


User = get_user_model()

class CustomUserSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()  # ✅ Agregamos este campo

    class Meta:
        model = User
        fields = '__all__'  # ✅ Mantiene todos los campos + `photo_url`
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def get_photo_url(self, obj):
        """ Devuelve la URL completa de la foto. """
        if obj.photo:
            request = self.context.get("request")
            return request.build_absolute_uri(obj.photo.url) if request else obj.photo.url
        return None  # Si no hay foto, devuelve None

    def create(self, validated_data):
        password = validated_data.pop("password")
        validated_data["is_active"] = True
        
        user = super().create(validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.identity_card = validated_data.get('identity_card', instance.identity_card)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.shift_type = validated_data.get('shift_type', instance.shift_type)
        instance.shift_group = validated_data.get('shift_group', instance.shift_group)
        instance.role = validated_data.get('role', instance.role)

        # Si hay contraseña en los datos, encriptarla antes de guardar
        if 'password' in validated_data:
            instance.set_password(validated_data['password'])

        # Guardar la nueva imagen si se envió una
        if 'photo' in validated_data:
            instance.photo = validated_data['photo']

        instance.save()
        return instance

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'

class UpdatePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_new_password(self, value):
        validate_password(value)
        return value

class SectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sector
        fields = '__all__'

    def validate_nombre(self, value):
        if not value.strip():
            raise serializers.ValidationError("El nombre no puede estar vacío.")
        return value

class FormularioChecklistSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormularioChecklist
        fields = '__all__'

class TituloChecklistSerializer(serializers.ModelSerializer):
    class Meta:
        model = TituloChecklist
        fields = '__all__'

class TareaChecklistSerializer(serializers.ModelSerializer):
    class Meta:
        model = TareaChecklist
        fields = '__all__'


class RespuestaTareaSerializer(serializers.ModelSerializer):
    class Meta:
        model = RespuestaTarea
        fields = '__all__'

class RespuestaChecklistSerializer(serializers.ModelSerializer):
    respuestas_tareas = RespuestaTareaSerializer(many=True, read_only=True)
    usuario_username = serializers.CharField(source='usuario.username', read_only=True)
    
    class Meta:
        model = RespuestaChecklist
        fields = '__all__'
        extra_fields = ['usuario_username', 'respuestas_tareas']

class RevisionChecklistSerializer(serializers.ModelSerializer):
    usuario_username = serializers.CharField(source='usuario.username', read_only=True)
    
    class Meta:
        model = RevisionChecklist
        fields = '__all__'
        extra_fields = ['usuario_username']