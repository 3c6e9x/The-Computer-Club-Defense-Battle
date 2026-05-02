from django.db import models

class StoryScene(models.Model):
    title = models.CharField(max_length=120)
    body = models.TextField()
    image = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.order}: {self.title}"


class Character(models.Model):
    name = models.CharField(max_length=80)
    role = models.CharField(max_length=80)
    portrait = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Tower(models.Model):
    name = models.CharField(max_length=80)
    damage = models.PositiveIntegerField(default=10)
    range = models.PositiveIntegerField(default=3)
    cost = models.PositiveIntegerField(default=50)
    icon = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return self.name


class Level(models.Model):
    name = models.CharField(max_length=100)
    difficulty = models.CharField(max_length=50, blank=True)
    description = models.TextField(blank=True)
    map_name = models.CharField(max_length=120, blank=True)

    def __str__(self):
        return self.name
