from datetime import datetime
from django.conf import settings
from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
import re
# import redis
import arrow
import requests
import os
from decimal import Decimal

PRICE_CHOICES = ((1, '$'), (2, '$$'), (3, '$$$'),(4, '$$$$'),)

# RATING_CHOICES = ( 
#     (1, "★☆☆☆☆"),
#     (2, "★★☆☆☆"),
#     (3, "★★★☆☆"),
#     (4, "★★★★☆"),
#     (5, "★★★★★"), 
# )

class Hair(models.Model):
    title = models.CharField(max_length = 100)
    class Meta:
      verbose_name_plural = "Hair Categories"
    def __str__(self):
      return self.title  

class Nails(models.Model):
    title = models.CharField(max_length = 100)
    class Meta:
      verbose_name_plural = "Nail Categories"
    def __str__(self):
      return self.title  

class HairRemoval(models.Model):
    title = models.CharField(max_length = 100)
    class Meta:
      verbose_name_plural = "Hair Removal Categories"
    def __str__(self):
      return self.title  

class Massage(models.Model):
    title = models.CharField(max_length = 100)
    class Meta:
      verbose_name_plural = "Massage Categories"
    def __str__(self):
      return self.title  

class Makeup(models.Model):
    title = models.CharField(max_length = 100)
    class Meta:
      verbose_name_plural = "Makeup Categories"
    def __str__(self):
      return self.title  

class Eyebrow(models.Model):
    title = models.CharField(max_length = 100)
    class Meta:
      verbose_name_plural = "Eyebrow Categories"
    def __str__(self):
      return self.title 

class Cosmetology(models.Model):
    title = models.CharField(max_length = 100)
    class Meta:
      verbose_name_plural = "Cosmetology Categories"
    def __str__(self):
      return self.title 

class Tattoo(models.Model):
    title = models.CharField(max_length = 100)
    class Meta:
      verbose_name_plural = "Tattoo Categories"
    def __str__(self):
      return self.title 

class Aesthetics(models.Model):
    title = models.CharField(max_length = 100)
    class Meta:
      verbose_name_plural = "Aesthetics Categories"
    def __str__(self):
      return self.title 

class City(models.Model):
    title = models.CharField(max_length = 100)
    class Meta:
      verbose_name_plural = "Cities"
    def __str__(self):
      return self.title  

class Area(models.Model):
    city = models.ForeignKey(City, null=True, on_delete=models.CASCADE)
    title = models.CharField(max_length = 100)
    def __str__(self):
      return self.title  

class Salon(models.Model):
    name = models.CharField(max_length=200)
    address = models.CharField(max_length=200)
    city = models.ForeignKey(City, on_delete=models.CASCADE)
    area = models.ForeignKey(Area, on_delete=models.CASCADE)
    description = models.TextField(blank=True)
    price_range = models.PositiveIntegerField(choices=PRICE_CHOICES, blank=True, default=2)
    rating = models.PositiveIntegerField(blank=True, default=0)
    masters = models.IntegerField(default=1)
    opening_hour = models.TimeField(auto_now=False, default=datetime.strptime('08:00', '%H:%M').time(),blank=True)
    closing_hour = models.TimeField(auto_now=False, default=datetime.strptime('21:00', '%H:%M').time(),blank=True)
    hair_categories = models.ManyToManyField(Hair, blank=True) 
    nails_categories = models.ManyToManyField(Nails, blank=True)
    hair_removal_categories = models.ManyToManyField(HairRemoval, blank=True)
    makeup_categories = models.ManyToManyField(Makeup, blank=True)
    massage_categories = models.ManyToManyField(Massage, blank=True)
    eyebrow_categories = models.ManyToManyField(Eyebrow, blank=True)
    cosmetology_categories = models.ManyToManyField(Cosmetology, blank=True)
    tattoo_categories = models.ManyToManyField(Tattoo, blank=True)
    aesthetics_categories = models.ManyToManyField(Aesthetics, blank=True)
    male = models.BooleanField(default=True)
    female = models.BooleanField(default=True)
    email = models.EmailField(max_length=200, blank=True)
    phone = models.CharField(max_length=25, blank=True)
    photo_main = models.ImageField(upload_to='photos/%Y/%m/%d/')
    photo_1 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
    photo_2 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
    photo_3 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
    photo_4 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
    photo_5 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
    photo_6 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
    created_by = models.ForeignKey(get_user_model(), null=True, on_delete=models.CASCADE)
    # page_view = models.PositiveIntegerField(blank=True, default=0)
    facebook = models.CharField(max_length=500, blank=True)
    instagram = models.CharField(max_length=500, blank=True)
    is_published = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    freelancer = models.BooleanField(default=False)
    appointment = models.BooleanField(default=False)
    outcall = models.BooleanField(default=False)
    payment = models.BooleanField(default=False)
    # sms_limit = models.PositiveIntegerField(blank=True, default=10)
    list_date = models.DateTimeField(default=datetime.now, blank=True)

    def __str__(self):
      return self.name

    # def save(self):
    #   super(Salon, self).save()

# class Like(models.Model):
#     user = models.ForeignKey(get_user_model(), null=True, on_delete=models.CASCADE)
#     salon = models.ForeignKey(Salon, related_name='likes', on_delete=models.CASCADE)

#     def __str__(self):
#       return self.name

class Master(models.Model):
  salon = models.ForeignKey(Salon, on_delete=models.CASCADE)
  master_name = models.CharField(max_length=50, blank=True)
  master_email = models.EmailField(max_length=200, blank=True)
  master_phone = models.CharField(max_length=25, blank=True)
  home_visit = models.BooleanField(default=False)
  is_staff = models.BooleanField(default=False)
  staff_status = models.CharField(max_length=100, blank=True)
  staff = models.ForeignKey(get_user_model(), on_delete=models.SET_NULL, blank=True, null=True)
  avatar = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)

  def get_weekday_hours():
    weekday_default_hours = (datetime.strptime('09:00', '%H:%M').time(),datetime.strptime('21:00', '%H:%M').time())
    return list(weekday_default_hours)
 
  def get_weekend_hours():
    weekend_default_hours = (datetime.strptime('09:00', '%H:%M').time(),datetime.strptime('09:00', '%H:%M').time())  
    return list(weekend_default_hours)

  monday_hours = ArrayField(models.TimeField(auto_now=False), default=get_weekday_hours,size=2,blank=True)
  tuesday_hours = ArrayField(models.TimeField(auto_now=False), default=get_weekday_hours,size=2,blank=True)
  wednesday_hours = ArrayField(models.TimeField(auto_now=False), default=get_weekday_hours,size=2,blank=True)
  thursday_hours = ArrayField(models.TimeField(auto_now=False), default=get_weekday_hours,size=2,blank=True)
  friday_hours = ArrayField(models.TimeField(auto_now=False), default=get_weekday_hours,size=2,blank=True)
  saturday_hours = ArrayField(models.TimeField(auto_now=False), default=get_weekend_hours,size=2,blank=True)
  sunday_hours = ArrayField(models.TimeField(auto_now=False), default=get_weekend_hours,size=2,blank=True)

  # hair_services = models.ManyToManyField(HairService, blank=True) 

  def __str__(self):
    return self.master_name 

class Booking(models.Model):
  master = models.ForeignKey(Master, on_delete=models.CASCADE)
  customer = models.ForeignKey(get_user_model(), null=True, on_delete=models.CASCADE)
  customer_name = models.CharField(max_length=50, blank=True)
  customer_email = models.EmailField(max_length=200, null=True, blank=True)
  customer_mobile = models.CharField(max_length=25, null=True, blank=True)
  # service title provides information about service, service content type complicates booking form in front end
  # service_content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
  # service_object_id = models.PositiveIntegerField(null=True, blank=True)
  # content_object = GenericForeignKey('service_content_type', 'service_object_id')
  service_title = models.CharField(max_length=50, blank=True)
  service_price = models.PositiveIntegerField(null=True, blank=True)
  start = models.DateTimeField()
  end = models.DateTimeField()
  is_confirmed = models.BooleanField(default=False)
  notes = models.TextField(blank=True)
  # Additional fields not visible to users
  sms_count = models.PositiveIntegerField(blank=True, default=0)
  task_id = models.CharField(max_length=50, blank=True, null=True, editable=False)
  message_id_salon = models.CharField(max_length=50, blank=True, null=True, editable=False)
  message_id_customer = models.CharField(max_length=50, blank=True, null=True, editable=False)
  created = models.DateTimeField(default=datetime.now, blank=True)

  def __str__(self):
        return 'Appointment #{0} - {1}'.format(self.pk, self.customer_name)

  def schedule_reminder(self):
    """Schedule a Dramatiq task to send a reminder for this appointment"""

    # Calculate the correct time to send this reminder
    appointment_time = arrow.get(self.start).to(settings.TIME_ZONE)
    reminder_time = appointment_time.shift(hours=-24)
    now = arrow.now(settings.TIME_ZONE)
    milli_to_wait = int(
        (reminder_time - now).total_seconds()) * 1000
    # do not schedule if less than 28 hours left until appointment

    # Schedule the Dramatiq task
    from .tasks import send_sms_reminder
    print('pk',self.pk)
    print('id',self.id)
    print('delay',milli_to_wait)
    result = send_sms_reminder.send_with_options(
        args=(self.pk,),
        delay=milli_to_wait)

  #   print('result',result)

  #   # result is not return from requests.get but from dramatiq.actor
  #   # res_list = re.split('[=,&]',result.text) 
  #   # res_iter = iter(res_list)
  #   # res_dct = dict(zip(res_iter,res_iter))

    return result.options['redis_message_id']

  def send_sms_confirmation(self):

    appointment_time = arrow.get(self.start).to(settings.TIME_ZONE)

    body = 'Salam {0}. Sizin {1} tarixinde {2} ile randevunuz tesdiq olundu.'.format(
      self.customer_name,
      appointment_time.format('DD/MM/YYYY HH:mm'),
      self.master.salon.name
    ) 

    mobile_raw = [s for s in self.customer_mobile if s.isdigit()]
    mobile = ''.join(mobile_raw[3:])

    if not(mobile):
      return "200"

    payload={'user':os.environ.get("SMS_USER"),'password':os.environ.get("SMS_PASSWORD"),'gsm':mobile,'text':body}
    url='http://www.poctgoyercini.com/api_http/sendsms.asp' 
    
    result = requests.get(url,params=payload) 

    res_list = re.split('[=,&]',result.text) 
    res_iter = iter(res_list)
    res_dct = dict(zip(res_iter,res_iter))

    return res_dct['message_id']

  def send_sms_for_confirmation(self):

    appointment_time = arrow.get(self.start).to(settings.TIME_ZONE)

    body = 'Salam. Sizden {0} tarixinde {1} terefinden randevu isteyi var. Musterinin mobil nomresi:{2}'.format(
      appointment_time.format('DD/MM/YYYY HH:mm'),
      self.customer_name,
      self.customer_mobile
    ) 

    mobile_raw = [s for s in self.master.master_phone if s.isdigit()]
    mobile = ''.join(mobile_raw[3:])

    if not(mobile):
      return "200"

    payload={'user':os.environ.get("SMS_USER"),'password':os.environ.get("SMS_PASSWORD"),'gsm':mobile,'text':body}
    url='http://www.poctgoyercini.com/api_http/sendsms.asp' 
    
    result = requests.get(url,params=payload) 

    res_list = re.split('[=,&]',result.text) 
    res_iter = iter(res_list)
    res_dct = dict(zip(res_iter,res_iter))

    return res_dct['message_id']


  def save(self, *args, **kwargs):

    # Save our appointment, which populates self.pk,
    # which is used in schedule_reminder
    existing = True
    if self.pk is None:
      existing = False
      super(Booking, self).save(*args, **kwargs)

    """Custom save method which also schedules a reminder"""
    appointment_time = arrow.get(self.start).to(settings.TIME_ZONE)
    reminder_time = appointment_time.shift(hours=-24)
    now = arrow.now(settings.TIME_ZONE)

    # Check if we have scheduled a reminder for this appointment before
    if self.task_id:
      # Revoke that task in case its time has changed
      self.cancel_task()

    # Schedule a new reminder task for this appointment
    from transactions.models import Balance, Transaction
    try:
      balance = Balance.objects.get(partner__id=self.master.salon.id)
    except: 
      print('no balance found for salon {0}'.format(self.master.salon.name)) 
    else:
      # sms block is executed only if the balance is positive
      if balance.amount>0:  
        salon_obj = Salon.objects.get(id=self.master.salon.id)
        if self.is_confirmed:
          if (reminder_time-now).total_seconds() > 0:
            self.task_id = self.schedule_reminder()
            balance.amount = balance.amount-Decimal('0.05')
            Transaction.objects.create(
              partner=salon_obj,
              amount=Decimal('0.05'),
              description='reminder sms to {0}'.format(self.customer_name)
            )
          if (self.sms_count < 5) and ((appointment_time-now).total_seconds() > 0):
            self.message_id_customer = self.send_sms_confirmation()
            self.sms_count = self.sms_count+1
            balance.amount = balance.amount-Decimal('0.05')
            Transaction.objects.create(
              partner=salon_obj,
              amount=Decimal('0.05'),
              description='confirmation sms to {0}'.format(self.customer_name)
            )
          else:
            self.notes = "5 sms limit reached for this booking"
        # if confirmation message not sent to salon yet
        if not(self.is_confirmed or self.message_id_salon): 
          self.message_id_salon = self.send_sms_for_confirmation()
          balance.amount = balance.amount-Decimal('0.05')
          Transaction.objects.create(
              partner=salon_obj,
              amount=Decimal('0.05'),
              description='New booking information sms from {0}'.format(self.customer_name)
            )
        balance.save()
    
    # Save our appointment again, with the new task_id
    # super(Booking, self).save(*args, **kwargs)

    if existing:
      super(Booking, self).save(*args, **kwargs)
    else:
      Booking.objects.filter(id=self.id).update(task_id=self.task_id, message_id_customer=self.message_id_customer, message_id_salon=self.message_id_salon)


  def cancel_task(self):
    redis_client = redis.Redis(host=settings.REDIS_HOST, port=6379, db=0)
    redis_client.hdel("dramatiq:default.DQ.msgs", self.task_id)
    print('deleted')

  






      
   
  

