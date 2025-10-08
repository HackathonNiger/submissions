from django.db import models

# Create your models here.

class Config(models.Model):
    age = models.IntegerField()
    gender = models.IntegerField()

class VitalinkRecord(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    age = models.IntegerField()
    gender = models.IntegerField()
    spo2 = models.IntegerField("Oxygen Saturation")
    temp = models.FloatField("Body Temperature")
    bpm = models.IntegerField("Heartbeat Rate")
    alert = models.CharField("AI Alert message", max_length=10000)
    sbp = models.IntegerField("Systolic Blood Pressure")
    dbp = models.IntegerField("Diastolic Blood Pressure")