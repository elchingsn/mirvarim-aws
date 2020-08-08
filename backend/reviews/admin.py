from django.contrib import admin
from django.db import models
from django.forms import CheckboxSelectMultiple
from .models import Review, Vote

class ReviewAdmin(admin.ModelAdmin):
  
  class Meta:
    model = Review 

  list_display = ('id','posted_by', 'salon', 'rating', 'post_date',)
  list_display_links = ('posted_by','salon')
  list_filter = ('rating',)
  search_fields = ('posted_by','salon',)
  list_per_page = 25
  
admin.site.register(Review, ReviewAdmin)


@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
  pass
