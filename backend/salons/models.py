from datetime import datetime
from django.db import models
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType


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
    title = models.CharField(max_length = 100)

    def __str__(self):
      return self.title  


class Salon(models.Model):
    name = models.CharField(max_length=200)
    address = models.CharField(max_length=200)
    city = models.ForeignKey(City, on_delete=models.CASCADE)
    area = models.ForeignKey(Area, on_delete=models.CASCADE)
    description = models.TextField(blank=True)
    price_range = models.PositiveIntegerField(choices=PRICE_CHOICES, blank=True)
    rating = models.PositiveIntegerField(blank=True, default=0)
    masters = models.IntegerField(default=1)
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
    email = models.EmailField(max_length=200)
    phone = models.CharField(max_length=25)
    photo_main = models.ImageField(upload_to='photos/%Y/%m/%d/')
    photo_1 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
    photo_2 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
    photo_3 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
    photo_4 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
    photo_5 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
    photo_6 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
    created_by = models.ForeignKey(get_user_model(), null=True, on_delete=models.CASCADE)
    is_published = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    appointment = models.BooleanField(default=False)
    payment = models.BooleanField(default=False)
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
  # photo = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
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
 







      
   
  

