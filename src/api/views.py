from django.shortcuts import render
from django.http import JsonResponse

from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import json
from django.core.exceptions import ObjectDoesNotExist
from .serializers import *
from .models import *

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

# customize token info to give username instead of id

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
	@classmethod
	def get_token(cls, user):
		token = super().get_token(user)

		# add custom claims
		token["username"] = user.username

		return token

class MyTokenObtainPairView(TokenObtainPairView):
	serializer_class = MyTokenObtainPairSerializer


class RegisterAPI(generics.GenericAPIView):
	serializer_class = RegisterSerializer

	def post(self, request, *args, **kwargs):
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		user = serializer.save()
		return Response({"user":"registration successful"})






# Create your views here.

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def taskList(request):
	user = request.user.id
	tasks = Task.objects.filter(user=user)
	serializer = TaskSerializer(tasks, many=True)
	return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def taskDetail(request, pk):
	user = request.user.id
	tasks = Task.objects.get(id=pk, user=user)
	serializer = TaskSerializer(tasks, many=False)
	return Response(serializer.data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def taskCreate(request):
	payload = json.loads(request.body)
	user = request.user
	try:
		author = User.objects.get(id=payload["user"])
		task = Task.objects.create(
				title=payload["title"],
				completed=payload["completed"],
				user=author,
			)
		serializer = TaskSerializer(data=task)

		return Response(serializer.data)
	except ObjectDoesNotExist as e:
		return Response({"error": str(e)})
	except Exception:
		return Response({"error":"Something went wrong"})


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def taskUpdate(request, pk):
	user = request.user.id
	payload = json.loads(request.body)
	
	try:
		task = Task.objects.filter(user=user, id=pk)
		task.update(**payload)
		taks = Task.objects.get(id=pk)
		serializer = TaskSerializer(task)
		return Response(serializer.data)
	except ObjectDoesNotExist:
		return Response({"error": str(e)})
	except Exception:
		return Response({"error":"Something went wrong"})


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def taskDelete(request, pk):
	user = request.user.id
	try:
		task = Task.objects.get(user=user, id=pk)
		task.delete()
		return Response({"task":"task deleted"})
	except ObjectDoesNotExist:
		return Response({"error": str(e)})
	except Exception:
		return Response({"error":"Something went wrong"})
