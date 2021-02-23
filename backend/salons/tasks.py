import arrow
import dramatiq
import datetime
import requests
from django.conf import settings
import os

from .models import Salon, Booking

# from dramatiq.brokers.redis import RedisBroker

# redis_broker = RedisBroker(url="redis://localhost:6379/0")
# dramatiq.set_broker(redis_broker)
print('before')

@dramatiq.actor
def send_sms_reminder(appointment_id):
  """Send a reminder to a phone using Http API"""
  # Get our appointment from the database
  print('after')
  try:
    appointment = Booking.objects.get(id=appointment_id)
    print('appointment',appointment)
  except Booking.DoesNotExist:
    print('appointment does not exist')

    # The appointment we were trying to remind someone about
    # has been deleted, so we don't need to do anything
    return

  appointment_time = arrow.get(appointment.start).to(settings.TIME_ZONE)
  body = 'Salam {0}. Sizin {1} tarixinde {2} ile randevunuz var.'.format(
    appointment.customer_name,
    appointment_time.format('DD/MM/YYYY HH:mm'),
    appointment.master.salon.name
  ) 

  mobile_raw = [s for s in appointment.customer_mobile if s.isdigit()]
  mobile = ''.join(mobile_raw[3:])

  print('mobile',mobile)
  print('body',body)

  if not(mobile):
    return

  payload={'user':os.environ.get("SMS_USER"),'password':os.environ.get("SMS_PASSWORD"),'gsm':mobile,'text':body}
  url='http://www.poctgoyercini.com/api_http/sendsms.asp' 
  
  requests.get(url,params=payload) 
