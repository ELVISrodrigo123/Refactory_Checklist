from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import LoginView, ProtectedView, CustomUserViewSet, RegisterUserView,MineraDashboardView, CustomTokenObtainPairView
from .authentication import views
from .views import ( ExcelFileViewSet, PeligroViewSet, RiesgoViewSet, MedidaControlViewSet, ArtactividadViewSet, ActividadViewSet, AreaViewSet,formularios_por_sector, titulos_por_formulario,
    tareas_por_titulo, respuestas_por_formulario)
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import SectorViewSet, FormularioChecklistViewSet, RevisionChecklistViewSet, TituloChecklistViewSet, TareaChecklistViewSet, RespuestaChecklistViewSet, FormulariosPorSectorAPIView, RevisionChecklistCreateAPIView, RespuestaTareaViewSet
router = DefaultRouter()

router.register('excelfiles', ExcelFileViewSet)
router.register('artactividades', ArtactividadViewSet)
router.register('actividades', ActividadViewSet)
router.register('areas', AreaViewSet)
router.register(r'sectores', SectorViewSet)
router.register(r'formularios', FormularioChecklistViewSet)
router.register(r'titulos', TituloChecklistViewSet)
router.register(r'tareas', TareaChecklistViewSet, basename='tareas')
urlpatterns = router.urls
router.register(r'users', CustomUserViewSet, basename='users')
router.register('excelfiles', ExcelFileViewSet, basename='excelfiles')
router.register('artactividades', ArtactividadViewSet, basename='artactividades')
router.register('actividades', ActividadViewSet, basename='actividades')
router.register('areas', AreaViewSet, basename='areas')
router.register(r'customusers', CustomUserViewSet, basename='customusers')
router.register(r'actividades/(?P<actividad_id>\d+)/peligros', PeligroViewSet, basename='peligros-por-actividad')
router.register(r'actividades/(?P<actividad_id>\d+)/riesgos', RiesgoViewSet, basename='riesgos-por-actividad')
router.register(r'actividades/(?P<actividad_id>\d+)/medidascontrol', MedidaControlViewSet, basename='medidascontrol-por-actividad')
router.register(r'respuestas', RespuestaChecklistViewSet)
router.register(r'respuestas-tareas', RespuestaTareaViewSet)
router.register(r'revisiones', RevisionChecklistViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('excel-files/', views.ExcelFileListCreateView.as_view(), name='excel-file-list-create'),
    path('excel-files/<int:pk>/', views.ExcelFileDetailView.as_view(), name='excel-file-detail'),
    path('protected/', ProtectedView.as_view(), name='protected_view'),
    path('login/', LoginView.as_view(), name='login'),
    path('minera-dashboard/', MineraDashboardView.as_view(), name='minera_dashboard'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', RegisterUserView.as_view(), name='register'),
    path('api/login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('users/me/', views.UserDetailView.as_view(), name='user-detail'),
    path('users/me/update/', views.UserUpdateView.as_view(), name='user-update'),
    path('api/formularios-por-sector/<int:sector_id>/', formularios_por_sector),
    path('api/titulos-por-formulario/<int:formulario_id>/', titulos_por_formulario),
    path('api/tareas-por-titulo/<int:titulo_id>/', tareas_por_titulo),
    path('', include(router.urls)),
    path('sectores/<int:sector_id>/formularios/', FormulariosPorSectorAPIView.as_view(), name='formularios-por-sector'),
    path('respuestas/<int:respuesta_id>/revisiones/', RevisionChecklistCreateAPIView.as_view(), name='crear-revision'),
]