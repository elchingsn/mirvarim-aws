from django.contrib import admin
from django.db import models
from django.forms import CheckboxSelectMultiple
from .models import Review, Vote, Like

class ReviewAdmin(admin.ModelAdmin):
  
  class Meta:
    model = Review 

  list_display = ('id','posted_by', 'salon', 'rating', 'post_date',)
  list_display_links = ('posted_by','salon')
  list_filter = ('rating',)
  search_fields = ('posted_by','salon',)
  list_per_page = 25
  
admin.site.register(Review, ReviewAdmin)

class VoteAdmin(admin.ModelAdmin):
  
  class Meta:
    model = Vote 

  list_display = ('voted_by', 'review', 'is_reported',)
  list_display_links = ('voted_by', 'review', 'is_reported',)
  list_filter = ('is_reported',)
  search_fields = ('voted_by','review','is_reported',)
  list_per_page = 25
  
admin.site.register(Vote, VoteAdmin)

@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
  list_display = ('liked_by', 'salon', 'like_date',)

