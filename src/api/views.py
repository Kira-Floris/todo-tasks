from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import *
from .models import *

# Create your views here.

@api_view(['GET'])
def taskList(request):
	tasks = Task.objects.all()
	serializer = TaskSerializer(tasks, many=True)
	return Response(serializer.data)

@api_view(["GET"])
def taskDetail(request, pk):
	tasks = Task.objects.get(id=pk)
	serializer = TaskSerializer(tasks, many=False)
	return Response(serializer.data)

@api_view(["POST"])
def taskCreate(request):
	serializer = TaskSerializer(data=request.data)

	if serializer.is_valid():
		serializer.save()

	return Response(serializer.data)

@api_view(["POST"])
def taskUpdate(request, pk):
	tasks = Task.objects.get(id=pk)
	serializer = TaskSerializer(instance=tasks, data=request.data)

	if serializer.is_valid():
		serializer.save()
	return Response(serializer.data)

@api_view(["DELETE"])
def taskDelete(request, pk):
	tasks = Task.objects.get(id=pk)
	tasks.delete()

	return Response("item successfully deleted")
