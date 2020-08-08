from django.urls import path

from .views import SalonListView, SalonDetailView
from . import views 

urlpatterns = [
    path('', SalonListView.as_view(), name='salon_list'),
    #path('ajax/filtered_salons/',views.filter, name = 'filtered_salons'),
    path('<int:pk>', SalonDetailView.as_view(), name='salon_detail'),
]