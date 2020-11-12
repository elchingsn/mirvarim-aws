from django.contrib import admin
from django.db import models
from django.forms import CheckboxSelectMultiple
from .models import Salon, Master, Hair, Nails, HairRemoval, Makeup, Massage, Eyebrow, Cosmetology, Tattoo, Aesthetics, City, Area, Booking

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

class BookingAdmin(admin.ModelAdmin):
  
  class Meta:
    model = Booking 

  list_display = ('id', 'master', 'customer','service_title', 'start', 'end')
  list_display_links = ('master', 'customer')
  list_filter = ('start',)
  search_fields = ('master','customer')
  list_per_page = 50
  
admin.site.register(Booking, BookingAdmin)

class MasterAdmin(admin.ModelAdmin):
  
  class Meta:
    model = Master 

  list_display = ('id','master_name','salon')
  list_display_links = ('master_name','salon',)
  list_filter = ('salon',)
  search_fields = ('salon',)
  list_per_page = 50
  
admin.site.register(Master, MasterAdmin)


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
@admin.register(Eyebrow)
class EyebrowAdmin(admin.ModelAdmin):
  pass
@admin.register(Cosmetology)
class CosmetologyAdmin(admin.ModelAdmin):
  pass
@admin.register(Tattoo)
class TattooAdmin(admin.ModelAdmin):
  pass
@admin.register(Aesthetics)
class AestheticsAdmin(admin.ModelAdmin):
  pass
@admin.register(City)
class CityAdmin(admin.ModelAdmin):
  pass
@admin.register(Area)
class RegionAdmin(admin.ModelAdmin):
  pass



