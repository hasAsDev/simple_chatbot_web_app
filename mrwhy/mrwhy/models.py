from django.db import models

class History(models.Model):
    user_message = models.CharField(max_length=1000)
    assistant_message = models.CharField(max_length=1000)
