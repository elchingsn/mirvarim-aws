from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class CustomUser(AbstractUser):

    VISITER = 1
    FREELANCER = 2
    SALONADMIN = 3

    ROLE_CHOICES = (
        (VISITER, 'Visiter'),
        (FREELANCER, 'Freelancer'),
        (SALONADMIN, 'SalonAdmin'),
    )
     
    # identifier = models.CharField(max_length=40, unique=True)
    # USERNAME_FIELD = 'identifier'

    email = models.EmailField(max_length=254, unique=True)
    role = models.PositiveSmallIntegerField(choices=ROLE_CHOICES, default=1)
    key = models.CharField(max_length=50,null=True,blank=True)

    EMAIL_FIELD = 'email'
    ROLE_FIELD = 'role' 
    KEY_FIELD = 'key'
  

  
    