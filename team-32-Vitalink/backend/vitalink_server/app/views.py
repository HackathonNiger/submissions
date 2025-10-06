from django.http import JsonResponse
from django.shortcuts import render, redirect
from app.models import *
import tensorflow as tf
from tensorflow.keras.models import load_model
import os
import datetime
import tensorflow as tf
from django.utils import timezone


file_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), "model.keras")


# input = Input(shape = (5,))
# x = Dense(50, name = 'dense1', activation="relu")(input)
# x = Dense(50, name = 'dense2', activation="relu")(x)
# x = Dense(20, name = 'dense3', activation="relu")(x)
# output = Dense(2, activation="relu")(x)
# model = Model(inputs = input ,outputs = output)
# # model.compile(loss = 'mse', optimizer = Adam(learning_rate=0.1), metrics=[RootMeanSquaredError()])
# model.load_weights(file_path)

model = load_model(file_path)


# Create your views here.

def getBP(age, gender, spo2, bpm, temp):
    pred = model.predict(tf.constant([[int(age), int(gender), int(spo2), int(bpm), float(temp)]]))
    return pred[0][0], pred[0][1]

def getAlert(spo2, bpm, temp, sbp, dbp):
    message = ""

    if (bpm> 90):
        message = "Heartbeat rate is too high seek medical attention"

    elif (bpm< 60):
        message = "Signs of BradyCardia, seek medical attention"
    if (temp > 38):
        message += ". High temperature, Fever!"

    elif (temp <= 35.1):
        message += ". Signs of hypothermia"
    if (spo2 < 90):
        message += ". Hypoxemia signs. seek doctors help quickly."

    if bpm> 90 or bpm < 60 or temp > 38 or temp < 35.1 or spo2 > 90:
        return message
    return "Healthy state from restricted health data"



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
    current_record = VitalinkRecord.objects.last()
    response_json = {
        "spo2": current_record.spo2,
        "bpm": current_record.bpm,
        "temp": current_record.temp,
        "sbp": current_record.sbp,
        "dbp": current_record.dbp,
        "alert": current_record.alert,
        "online": (datetime.datetime.now(datetime.timezone.utc) - current_record.timestamp).total_seconds() < 7
    }
    return JsonResponse(response_json)

def update(request):
    if request.method == "GET":
        config = Config.objects.all()[0]
        config.age = int(request.GET["age"])
        config.gender = int(request.GET["gender"])
        config.save()
        return JsonResponse({"success": True})
    if request.method == "POST":
        config = Config.objects.all()[0]
        config.age = int(request.POST["age"])
        config.gender = int(request.POST["gender"])
        config.save()
        return JsonResponse({"success": True})
