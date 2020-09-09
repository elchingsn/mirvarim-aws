from django.contrib import admin

from .models import HairService, NailsService, HairRemovalService, MassageService, MakeupService, EyebrowService, CosmetologyService, TattooService, AestheticsService

class HairServiceAdmin(admin.ModelAdmin):
  list_display = ('salon', 'category', 'title', 'price','list_date')
  list_display_links = ('salon', 'title', 'category')
  list_filter = ('salon','category', 'price')
  search_fields = ('salon','title','category')
  list_per_page = 50

admin.site.register(HairService, HairServiceAdmin)

class NailsServiceAdmin(admin.ModelAdmin):
  list_display = ('salon', 'category', 'title', 'price','list_date')
  list_display_links = ('salon', 'title', 'category')
  list_filter = ('salon','category', 'price')
  search_fields = ('salon','title','category')
  list_per_page = 50

admin.site.register(NailsService, NailsServiceAdmin)

class HairRemovalServiceAdmin(admin.ModelAdmin):
  list_display = ('salon', 'category', 'title', 'price','list_date')
  list_display_links = ('salon', 'title', 'category')
  list_filter = ('salon','category', 'price')
  search_fields = ('salon','title','category')
  list_per_page = 50

admin.site.register(HairRemovalService, HairRemovalServiceAdmin)

class MassageServiceAdmin(admin.ModelAdmin):
  list_display = ('salon', 'category', 'title', 'price','list_date')
  list_display_links = ('salon', 'title', 'category')
  list_filter = ('salon','category', 'price')
  search_fields = ('salon','title','category')
  list_per_page = 50

admin.site.register(MassageService, MassageServiceAdmin)

class MakeupServiceAdmin(admin.ModelAdmin):
  list_display = ('salon', 'category', 'title', 'price','list_date')
  list_display_links = ('salon', 'title', 'category')
  list_filter = ('salon','category', 'price')
  search_fields = ('salon','title','category')
  list_per_page = 50

admin.site.register(MakeupService, MakeupServiceAdmin)

class EyebrowServiceAdmin(admin.ModelAdmin):
  list_display = ('salon', 'category', 'title', 'price','list_date')
  list_display_links = ('salon', 'title', 'category')
  list_filter = ('salon','category', 'price')
  search_fields = ('salon','title','category')
  list_per_page = 50

admin.site.register(EyebrowService, EyebrowServiceAdmin)

class CosmetologyServiceAdmin(admin.ModelAdmin):
  list_display = ('salon', 'category', 'title', 'price','list_date')
  list_display_links = ('salon', 'title', 'category')
  list_filter = ('salon','category', 'price')
  search_fields = ('salon','title','category')
  list_per_page = 50

admin.site.register(CosmetologyService, CosmetologyServiceAdmin)

class TattooServiceAdmin(admin.ModelAdmin):
  list_display = ('salon', 'category', 'title', 'price','list_date')
  list_display_links = ('salon', 'title', 'category')
  list_filter = ('salon','category', 'price')
  search_fields = ('salon','title','category')
  list_per_page = 50

admin.site.register(TattooService, TattooServiceAdmin)

class AestheticsServiceAdmin(admin.ModelAdmin):
  list_display = ('salon', 'category', 'title', 'price','list_date')
  list_display_links = ('salon', 'title', 'category')
  list_filter = ('salon','category', 'price')
  search_fields = ('salon','title','category')
  list_per_page = 50

admin.site.register(AestheticsService, AestheticsServiceAdmin)

