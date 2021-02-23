from django.contrib import admin
from django.db import models
from .models import Balance, Transaction

class BalanceAdmin(admin.ModelAdmin):

  class Meta:
    model = Balance 


  list_display = ('id', 'partner', 'amount')
  list_display_links = ('partner',)
  list_per_page = 25
  
admin.site.register(Balance, BalanceAdmin)

class TransactionAdmin(admin.ModelAdmin):

  class Meta:
    model = Transaction 


  list_display = ('id', 'date', 'partner', 'amount')
  list_display_links = ('partner',)
  list_per_page = 25
  
admin.site.register(Transaction, TransactionAdmin)