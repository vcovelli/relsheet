from rest_framework import serializers
from api.models.spreadsheet import Sheet, SheetColumn, SheetRow

class SheetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sheet
        fields = '__all__'

class SheetColumnSerializer(serializers.ModelSerializer):
    class Meta:
        model = SheetColumn
        fields = '__all__'

class SheetRowSerializer(serializers.ModelSerializer):
    class Meta:
        model = SheetRow
        fields = '__all__'