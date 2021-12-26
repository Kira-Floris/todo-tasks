from django.urls import path
from . import views

from rest_framework_simplejwt.views import (
    # TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
	path("task-list/", views.taskList, name="list"),
	path("task-create/", views.taskCreate, name="create"),
	path("task-detail/<str:pk>/", views.taskDetail, name="detail"),
	path("task-update/<str:pk>/", views.taskUpdate, name="update"),
	path("task-delete/<str:pk>/", views.taskDelete, name="delete"),

	path("register/", views.RegisterAPI.as_view(), name="register"),

	path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
]