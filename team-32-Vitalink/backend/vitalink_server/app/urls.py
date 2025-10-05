from django.urls import path, include
from app import views


urlpatterns = [
    path("", views.home),
    path('push', views.push_data),
    path("pull", views.pull_data),
]