from django.http import JsonResponse
from django.shortcuts import render

from .models import StoryScene, Tower


def index(request):
    return render(request, 'index.html')


def story(request):
    return render(request, 'story.html')


def battle(request):
    return render(request, 'battle.html')


def escape(request):
    return render(request, 'escape.html')


def victory(request):
    return render(request, 'victory.html')


def defeat(request):
    return render(request, 'defeat.html')


def tower_data(request):
    towers = list(Tower.objects.values('id', 'name', 'damage', 'range', 'cost', 'icon'))
    return JsonResponse({'towers': towers})


def story_data(request):
    scenes = list(StoryScene.objects.values('title', 'body', 'image', 'order'))
    return JsonResponse({'scenes': scenes})
