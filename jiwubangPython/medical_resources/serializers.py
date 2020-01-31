#!/usr/bin/env python
# _*_ coding: utf-8 _*_
# @Time    : 2020/1/30 1:44 下午 
# @Author  : Roger 
# @Version : V 0.1
# @Email   : 550997728@qq.com
# @File    : serializers.py.py

from django.contrib.auth.models import User, Group
from rest_framework import serializers
from medical_resources.models import MedicalSupplies, UserInfo, MedicalSuppliesType


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')


class MedicalSuppliesSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = MedicalSupplies
        fields = ('m_id', 'm_name', 'm_type', 'm_store_name', 'm_longitude', \
                  'm_latitude', 'm_price', 'm_count', 'm_address', 'm_city', \
                  'm_time')


class UserInfoSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = UserInfo
        fields = ('u_id', 'nick_name', 'avatar_url','gender')


class MedicalSuppliesTypeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = MedicalSuppliesType
        fields = ('t_id', 't_name')
