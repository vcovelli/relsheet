from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import sheets

router = DefaultRouter()
router.register(r'sheets', sheets.SheetViewSet)
router.register(r'columns', sheets.SheetColumnViewSet)
router.register(r'rows', sheets.SheetRowViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]