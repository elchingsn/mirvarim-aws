from django.db import models
from django.contrib.auth import get_user_model
from datetime import datetime
from salons.models import Salon, Master

class Balance(models.Model):
  partner = models.ForeignKey(Salon, on_delete=models.CASCADE)
  # sms_limit = models.PositiveIntegerField(blank=True, default=10)
  amount = models.DecimalField(max_digits=7,decimal_places=3,blank=True, null=True)

class Transaction(models.Model):
  partner = models.ForeignKey(Salon, on_delete=models.CASCADE)
  date = models.DateTimeField(default=datetime.now, blank=True)
  amount = models.DecimalField(max_digits=7,decimal_places=3,blank=True, null=True)
  description = models.CharField(max_length=50, blank=True)





