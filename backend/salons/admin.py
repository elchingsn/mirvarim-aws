from django.contrib import admin
from django.db import models
from django.forms import CheckboxSelectMultiple
from .models import Salon, Hair, Nails, HairRemoval, Makeup, Massage, City, Area

class SalonAdmin(admin.ModelAdmin):
  
  formfield_overrides = {
    models.ManyToManyField: {'widget':CheckboxSelectMultiple},
  }

  class Meta:
    model = Salon 


  list_display = ('id', 'name', 'city', 'price_range','email', 'phone', 'list_date')
  list_display_links = ('name',)
  list_filter = ('price_range',)
  search_fields = ('name','city', 'price_range')
  list_per_page = 25
  
admin.site.register(Salon, SalonAdmin)


@admin.register(Hair)
class HairAdmin(admin.ModelAdmin):
  pass
@admin.register(Nails)
class NailsAdmin(admin.ModelAdmin):
  pass
@admin.register(HairRemoval)
class HairRemovalAdmin(admin.ModelAdmin):
  pass
@admin.register(Makeup)
class MakeupAdmin(admin.ModelAdmin):
  pass
@admin.register(Massage)
class MassageAdmin(admin.ModelAdmin):
  pass
@admin.register(City)
class CityAdmin(admin.ModelAdmin):
  pass
@admin.register(Area)
class RegionAdmin(admin.ModelAdmin):
  pass



