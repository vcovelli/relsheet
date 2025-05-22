from django.db import models

class Sheet(models.Model):
    name = models.CharField(max_length=100)
    created_by = models.ForeignKey(
        "auth.User",
        on_delete=models.CASCADE,
        null=True,         # make it nullable
        blank=True         # allow blank in forms
    )

class SheetColumn(models.Model):
    sheet = models.ForeignKey(Sheet, on_delete=models.CASCADE, related_name="columns")
    name = models.CharField(max_length=100)
    data_type = models.CharField(max_length=50, choices=[
        ("text", "Text"),
        ("number", "Number"),
        ("choice", "Choice"),
        ("reference", "Reference"),
    ])
    options = models.JSONField(blank=True, null=True)

class SheetRow(models.Model):
    sheet = models.ForeignKey(Sheet, on_delete=models.CASCADE, related_name="rows")
    data = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
