from django.http import JsonResponse
from django.shortcuts import render, redirect
from app.models import *
import tensorflow as tf
from tensorflow.keras.models import load_model
import os


file_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), "model2.keras")

# Create your views here.

def getBP(age, gender, spo2, bpm, temp):
    model = load_model(file_path)
    pred = model.predict(tf.constant([[int(age), int(gender), int(spo2), int(bpm), float(temp)]]))
    return pred[0][0], pred[0][1]

def getAlert(spo2, bpm, temp, sbp, dbp):
    return "Drink Water"



def home(request):
    return redirect("/admin")

def push_data(request):
    if request.method == "GET":
        config = Config.objects.all()[0]

        age = config.age
        gender = config.gender
        spo2 = int(request.GET["spo2"])
        bpm = int(request.GET["bpm"])
        temp = float(request.GET["temp"])
        sbp, dbp = getBP(age, gender, spo2, bpm, temp)
        alert = getAlert(spo2, bpm, temp, sbp, dbp)

        VitalinkRecord.objects.create(age=age, gender=gender, spo2=spo2, bpm=bpm, temp=temp, sbp=sbp, dbp=dbp, alert=alert)
        return JsonResponse({"success": True})

def pull_data(request):
    current_record = VitalinkRecord.objects.all()[0]
    response_json = {
        "spo2": current_record.spo2,
        "bpm": current_record.bpm,
        "temp": current_record.temp,
        "sbp": current_record.sbp,
        "dbp": current_record.dbp,
        "alert": current_record.alert
    }
    return JsonResponse(response_json)

def update(request):
    if request.method == "GET":
        config = Config.objects.all()[0]
        config.age = int(request.GET["age"])
        config.gender = int(request.GET["gender"])
        config.save()
        return JsonResponse({"success": True})
