from django.urls import path
from . import views

urlpatterns = [
	path("task-list/", views.taskList, name="list"),
	path("task-create/", views.taskCreate, name="create"),
	path("task-detail/<str:pk>/", views.taskDetail, name="detail"),
	path("task-update/<str:pk>/", views.taskUpdate, name="update"),
	path("task-delete/<str:pk>/", views.taskDelete, name="delete"),
]