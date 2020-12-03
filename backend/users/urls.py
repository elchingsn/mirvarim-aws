from django.urls import path
from .views import DataDeletionView
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [

    path('deauthentication/',csrf_exempt(DataDeletionView.as_view()), name= 'deauthentication'),

]