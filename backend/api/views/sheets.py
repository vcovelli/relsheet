from rest_framework import viewsets
from api.models.spreadsheet import Sheet, SheetColumn, SheetRow
from api.serializers.spreadsheet import SheetSerializer, SheetColumnSerializer, SheetRowSerializer

class SheetViewSet(viewsets.ModelViewSet):
    queryset = Sheet.objects.all()
    serializer_class = SheetSerializer

class SheetColumnViewSet(viewsets.ModelViewSet):
    queryset = SheetColumn.objects.all()
    serializer_class = SheetColumnSerializer

class SheetRowViewSet(viewsets.ModelViewSet):
    queryset = SheetRow.objects.all()
    serializer_class = SheetRowSerializer