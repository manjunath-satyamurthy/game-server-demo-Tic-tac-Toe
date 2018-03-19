# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import json

from django.http import JsonResponse, HttpResponse
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt
from django.template import loader



@csrf_exempt
def user_login(request):
    if request.method == 'GET':
        template = loader.get_template('game/index.html')
        return HttpResponse(template.render({}, request))
    if request.method == 'POST':
        print "here in login ..........."
        data = json.loads(request.POST['data'])

        username = data['username']
        password = data['password']

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({
                "status": "OK",
                "username": user.username
                })            
        else:
            return JsonResponse({
            "status": "FAILED"
            })
