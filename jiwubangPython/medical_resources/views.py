from django.shortcuts import render

# Create your views here.
from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from rest_framework.renderers import JSONRenderer

from medical_resources.models import MedicalSupplies, UserInfo, MedicalSuppliesType
from medical_resources.serializers import UserSerializer, GroupSerializer, MedicalSuppliesSerializer, \
    UserInfoSerializer, MedicalSuppliesTypeSerializer

from django.http import HttpResponse


class UserViewSet(viewsets.ModelViewSet):
    """
    允许用户查看或编辑的API路径。
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    """
    允许组查看或编辑的API路径。
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class JSONResponse(HttpResponse):
    """
    用于返回JSON数据.
    """

    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)


class MedicalSuppliesTypeViewSet(viewsets.ModelViewSet):
    queryset = MedicalSuppliesType.objects.all()
    serializer_class = MedicalSuppliesTypeSerializer


class MedicalSuppliesViewSet(viewsets.ModelViewSet):
    queryset = MedicalSupplies.objects.all()
    serializer_class = MedicalSuppliesSerializer


class UserInfoViewSet(viewsets.ModelViewSet):
    queryset = UserInfo.objects.all()
    serializer_class = UserInfoSerializer
