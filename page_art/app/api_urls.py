from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import ( TokenObtainPairView, TokenRefreshView,)    
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views 
from .views import (
    CustomUserViewSet, RegisterUserView, ExcelFileViewSet,
    ArtactividadViewSet, ActividadViewSet, PeligroViewSet, 
    RiesgoViewSet, MedidaControlViewSet, AreaViewSet,
    SectorViewSet, FormularioChecklistViewSet, 
    TituloChecklistViewSet, TareaChecklistViewSet,RespuestaChecklistViewSet,RespuestaTareaViewSet, RevisionChecklistViewSet

)

router = DefaultRouter()
router.register(r'excel-files', ExcelFileViewSet, basename='excel-file')
router.register(r'artactividad', ArtactividadViewSet, basename='artactividad')
router.register(r'actividades', ActividadViewSet, basename='actividad')
router.register(r'actividades/(?P<actividad_id>\d+)/peligros',PeligroViewSet,basename='peligros-por-actividad')
router.register(r'actividades/(?P<actividad_id>\d+)/riesgos', RiesgoViewSet, basename='riesgos-por-actividad')
router.register(r'actividades/(?P<actividad_id>\d+)/medidascontrol', MedidaControlViewSet, basename='medidascontrol-por-actividad')
router.register(r'areas', AreaViewSet, basename='area')
router.register(r'users', CustomUserViewSet)
router.register(r'sectores', SectorViewSet)
router.register(r'formularios', FormularioChecklistViewSet)
router.register(r'titulos', TituloChecklistViewSet)
router.register(r'tareas', TareaChecklistViewSet)
router.register(r'respuestas', RespuestaChecklistViewSet)
router.register(r'respuestas-tareas', RespuestaTareaViewSet)
router.register(r'revisiones', RevisionChecklistViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('excel-files/<int:pk>/delete/', ExcelFileViewSet.as_view({'delete': 'delete_file'}), name='delete-excel-file'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Obtener token
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('login/', TokenObtainPairView.as_view(), name='token_login'),  # Refrescar token
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterUserView.as_view(), name='register'), 
    path('users/me/', views.UserDetailView.as_view(), name='user-detail'),
    path('users/me/update/', views.UserUpdateView.as_view(), name='user-update'),
]

