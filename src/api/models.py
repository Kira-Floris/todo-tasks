from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Task(models.Model):
	title = models.CharField(max_length=200, unique=True)
	completed = models.BooleanField(default=False)
	user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)

	def __str__(self):
		return str(self.title)
