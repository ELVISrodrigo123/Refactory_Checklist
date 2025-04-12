from rest_framework import viewsets, serializers, status, permissions, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .serializers import CustomUserSerializer, SectorSerializer, FormularioChecklistSerializer, TituloChecklistSerializer, TareaChecklistSerializer, UserSerializer, UserUpdateSerializer
from django.contrib.auth import get_user_model, authenticate
from django.shortcuts import render
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from rest_framework.viewsets import ModelViewSet
from .models import (  ExcelFile, Area, Artactividad, Actividad, Peligro, Riesgo, MedidaControl)
from .serializers import ( ExcelFileSerializer, ArtactividadSerializer, ActividadSerializer, AreaSerializer , PeligroSerializer, RiesgoSerializer, MedidaControlSerializer, ActividadSerializer, PeligroSerializer,
RiesgoSerializer, MedidaControlSerializer, RespuestaChecklistSerializer)
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view
from rest_framework import generics
from .models import Sector, FormularioChecklist, TituloChecklist, TareaChecklist, RespuestaChecklist, RevisionChecklist, RespuestaTarea
from .serializers import RespuestaTareaSerializer, RevisionChecklistSerializer, RespuestaChecklistSerializer

class ExcelFileSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format='%Y-%m-%dT%H:%M:%SZ', read_only=True)
    class Meta:
        model = ExcelFile
        fields = ['id', 'file', 'description', 'is_active', 'created_at']
class ExcelFileViewSet(viewsets.ModelViewSet):
    queryset = ExcelFile.objects.all()
    serializer_class = ExcelFileSerializer

    @action(detail=True, methods=['delete'])
    def delete_file(self, request, pk=None):
        """
        Elimina un archivo Excel y sus datos relacionados.
        """
        excel_file = get_object_or_404(ExcelFile, pk=pk)
        excel_file.delete()
        return Response({'message': 'Archivo eliminado correctamente'}, status=status.HTTP_200_OK)

class ExcelFileListCreateView(generics.ListCreateAPIView):
    queryset = ExcelFile.objects.all()
    serializer_class = ExcelFileSerializer

class ExcelFileDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ExcelFile.objects.all()
    serializer_class = ExcelFileSerializer


class AreaViewSet(viewsets.ModelViewSet):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer

class ArtactividadViewSet(viewsets.ModelViewSet):
    queryset = Artactividad.objects.all()
    serializer_class = ArtactividadSerializer

class ActividadViewSet(viewsets.ModelViewSet):
    queryset = Actividad.objects.all()
    serializer_class = ActividadSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        artactividad_id = self.request.query_params.get('artactividad', None)
        if artactividad_id is not None:
            queryset = queryset.filter(artactividad_id=artactividad_id)
        return queryset

    class ArtactividadViewSet(viewsets.ReadOnlyModelViewSet):
        queryset = Artactividad.objects.all()
        serializer_class = ArtactividadSerializer

    class ActividadViewSet(viewsets.ReadOnlyModelViewSet):
        queryset = Actividad.objects.all()
        serializer_class = ActividadSerializer


class PeligroViewSet(viewsets.ModelViewSet):
    serializer_class = PeligroSerializer

    def get_queryset(self):
        actividad_id = self.kwargs.get('actividad_id')  # Obtiene el ID de la actividad de la URL
        if actividad_id:
            return Peligro.objects.filter(actividad_id=actividad_id)  # Filtra por actividad
        return Peligro.objects.none()  # Devuelve una lista vacía si no hay actividad_id

class RiesgoViewSet(ModelViewSet):
    serializer_class = RiesgoSerializer

    def get_queryset(self):
        actividad_id = self.kwargs.get('actividad_id')
        if actividad_id:
            return Riesgo.objects.filter(actividad_id=actividad_id)
        return Riesgo.objects.none()

class MedidaControlViewSet(ModelViewSet):
    serializer_class = MedidaControlSerializer

    def get_queryset(self):
        actividad_id = self.kwargs.get('actividad_id')
        if actividad_id:
            return MedidaControl.objects.filter(actividad_id=actividad_id)
        return MedidaControl.objects.none()

def home(request):
    return render(request, 'home.html')

class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "Esta vista está protegida."})
    

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)
        
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

class MineraDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.has_perm('app.can_access_minera_dashboard'):
            return Response({"message": "Bienvenido al dashboard de Minería."})
        else:
            return Response({"error": "No tienes permiso para acceder a esta vista."}, status=403)
        
@api_view(['POST'])
def crear_area(request):
    print("Datos recibidos:", request.data)  # 📌 Muestra los datos en el backend
    return Response({"mensaje": "Datos recibidos"}, status=200)
class AreaViewSet(viewsets.ModelViewSet):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer


from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializers import CustomUserSerializer
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .serializers import CustomUserSerializer

User = get_user_model()

class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = CustomUserSerializer

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [permissions.AllowAny]  # Permitir registro sin autenticación
        else:
            permission_classes = [permissions.IsAuthenticated]  # Solo usuarios autenticados para otras acciones
        return [permission() for permission in permission_classes]

    def update(self, request, *args, **kwargs):
        user = self.get_object()  # Obtener el usuario a actualizar

        # Serializar datos y validar
        serializer = self.get_serializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            # Guardar los cambios en el usuario
            serializer.save()

            # Generar nuevo token JWT
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': 'Usuario actualizado correctamente',
                'user': serializer.data,  # Datos actualizados del usuario
                'tokens': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                }
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# Vista para el registro de usuarios
class RegisterUserView(APIView):
    permission_classes = [permissions.AllowAny]  # Permitir registro sin autenticación

    def post(self, request):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            # Guardar usuario sin `commit=False`
            user.is_active = True  
            
            user = serializer.save()
            
            # Establecer contraseña correctamente
            user.set_password(request.data["password"])
            
            # Asegurar que el usuario esté activo
            
            user.save()  # Guardar cambios

            # Determinar el rol
            role = "superusuario" if user.is_superuser else user.role

            # Generar tokens JWT
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            return Response({
                'user': serializer.data,
                'role': role,  # Incluir el rol en la respuesta
                'tokens': {
                    'access': access_token,
                    'refresh': str(refresh),
                }
            }, status=status.HTTP_201_CREATED)


        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        # Llama al método post original para obtener los tokens
        response = super().post(request, *args, **kwargs)

        if response.status_code == status.HTTP_200_OK:
            # Obtén el usuario autenticado
            username = request.data.get('username')
            try:
                user = User.objects.get(username=username)
                # Imprime el rol del usuario en la consola
                if user.is_superuser:
                    print("Este usuario es un superusuario.")
                else:
                    print(f"Este usuario tiene el rol: {user.role}")
            except User.DoesNotExist:
                print(f"Usuario con username {username} no encontrado.")
        return response
    

User = get_user_model()

class UpdateUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]  # Solo usuarios autenticados pueden actualizarse

    def put(self, request, *args, **kwargs):
        user = request.user  # Usuario autenticado

        print("📥 Datos recibidos:", request.data)
        print("📥 Archivos recibidos:", request.FILES)

        # Manejo de la imagen
        if "photo" in request.FILES:
            if user.photo:
                user.photo.delete(save=False)  # Borrar la imagen anterior
            user.photo = request.FILES["photo"]

        # Manejo de contraseña
        if "password" in request.data:
            user.set_password(request.data["password"])

        # Guardar los cambios del usuario
        user.save()

        # Serializar datos actualizados
        serializer = CustomUserSerializer(user, context={"request": request})

        # Generar nuevo token JWT
        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "Usuario actualizado correctamente",
            "user": serializer.data,
            "tokens": {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
        }, status=status.HTTP_200_OK)

class UserDetailView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class UserUpdateView(generics.UpdateAPIView):
    serializer_class = UserUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class SectorViewSet(viewsets.ModelViewSet):
    queryset = Sector.objects.all()
    serializer_class = SectorSerializer

class FormularioChecklistViewSet(viewsets.ModelViewSet):
    queryset = FormularioChecklist.objects.all()
    serializer_class = FormularioChecklistSerializer


class TituloChecklistViewSet(viewsets.ModelViewSet):
    queryset = TituloChecklist.objects.all()
    serializer_class = TituloChecklistSerializer


class TareaChecklistViewSet(viewsets.ModelViewSet):
    queryset = TareaChecklist.objects.all()
    serializer_class = TareaChecklistSerializer

class RespuestaChecklistViewSet(viewsets.ModelViewSet):
    queryset = RespuestaChecklist.objects.all()
    serializer_class = RespuestaChecklistSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        formulario_id = self.request.query_params.get('formulario_id')
        usuario_id = self.request.query_params.get('usuario_id')
        
        if formulario_id:
            queryset = queryset.filter(formulario_id=formulario_id)
        if usuario_id:
            queryset = queryset.filter(usuario_id=usuario_id)
        return queryset

class RespuestaTareaViewSet(viewsets.ModelViewSet):
    queryset = RespuestaTarea.objects.all()
    serializer_class = RespuestaTareaSerializer

class RevisionChecklistViewSet(viewsets.ModelViewSet):
    queryset = RevisionChecklist.objects.all()
    serializer_class = RevisionChecklistSerializer
    
    
    def get_queryset(self):
        queryset = super().get_queryset()
        respuesta_id = self.request.query_params.get('respuesta_id')
        if respuesta_id:
            queryset = queryset.filter(respuesta_id=respuesta_id)
        return queryset