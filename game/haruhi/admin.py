from django.contrib import admin
from .models import Character, Level, StoryScene, Tower

admin.site.register(StoryScene)
admin.site.register(Character)
admin.site.register(Tower)
admin.site.register(Level)
