from django.urls import path
from . import views

app_name = 'haruhi'

urlpatterns = [
    path('', views.index, name='index'),
    path('story/', views.story, name='story'),
    path('battle/', views.battle, name='battle'),
    path('api/towers/', views.tower_data, name='tower_data'),
    path('api/story/', views.story_data, name='story_data'),
]
