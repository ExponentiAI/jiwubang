#!/usr/bin/env python
# _*_ coding: utf-8 _*_
# @Time    : 2020/1/30 1:45 下午 
# @Author  : Roger 
# @Version : V 0.1
# @Email   : 550997728@qq.com
# @File    : urls.py

from django.conf.urls import url, include
from rest_framework import routers

router = routers.DefaultRouter()

# 使用自动URL路由连接我们的API。
# 另外，我们还包括支持浏览器浏览API的登录URL。
urlpatterns = [
    # url(r'^UserInfo/', include(views.UserInfoViewSet)),
    # url(r'^get_MedicalSupplies_item/', include(views.MedicalSuppliesViewSet)),
    url(r'^api-UserInfo/', include('rest_framework.urls', namespace='rest_framework'))
]
