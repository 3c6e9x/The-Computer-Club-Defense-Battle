from django.urls import path
from . import views

app_name = 'haruhi'

urlpatterns = [
    path('', views.index, name='index'),
    path('story/', views.story, name='story'),
    path('escape/', views.escape, name='escape'),
    path('battle/', views.battle, name='battle'),
    path('victory/', views.victory, name='victory'),
    path('defeat/', views.defeat, name='defeat'),
    path('api/towers/', views.tower_data, name='tower_data'),
    path('api/story/', views.story_data, name='story_data'),
]
