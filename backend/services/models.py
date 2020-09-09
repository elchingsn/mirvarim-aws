from django.db import models
from datetime import datetime
from salons.models import Salon, Hair, Nails, HairRemoval, Massage, Makeup, Eyebrow, Cosmetology, Tattoo, Aesthetics

class HairService(models.Model):
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE)
    category = models.ForeignKey(Hair, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.IntegerField()
    promotion_price = models.IntegerField(blank=True, null=True)
    duration = models.IntegerField(blank=True, default=30)
    is_published = models.BooleanField(default=True) 
    list_date = models.DateTimeField(default=datetime.now, blank=True)
    
    def __str__(self):
        return self.title

class NailsService(models.Model):
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE)
    category = models.ForeignKey(Nails, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.IntegerField()
    promotion_price = models.IntegerField(blank=True, null=True)
    duration = models.IntegerField(blank=True, default=30)
    is_published = models.BooleanField(default=True) 
    list_date = models.DateTimeField(default=datetime.now, blank=True)
    
    def __str__(self):
        return self.title

class HairRemovalService(models.Model):
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE)
    category = models.ForeignKey(HairRemoval, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.IntegerField()
    promotion_price = models.IntegerField(blank=True, null=True)
    duration = models.IntegerField(blank=True, default=30)
    is_published = models.BooleanField(default=True) 
    list_date = models.DateTimeField(default=datetime.now, blank=True)
    
    def __str__(self):
        return self.title
    
class MassageService(models.Model):
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE)
    category = models.ForeignKey(Massage, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.IntegerField()
    promotion_price = models.IntegerField(blank=True, null=True)
    duration = models.IntegerField(blank=True, default=30)
    is_published = models.BooleanField(default=True) 
    list_date = models.DateTimeField(default=datetime.now, blank=True)
    
    def __str__(self):
        return self.title
    
class MakeupService(models.Model):
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE)
    category = models.ForeignKey(Makeup, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.IntegerField()
    promotion_price = models.IntegerField(blank=True, null=True)
    duration = models.IntegerField(blank=True, default=30)
    is_published = models.BooleanField(default=True) 
    list_date = models.DateTimeField(default=datetime.now, blank=True)

class EyebrowService(models.Model):
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE)
    category = models.ForeignKey(Eyebrow, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.IntegerField()
    promotion_price = models.IntegerField(blank=True, null=True)
    duration = models.IntegerField(blank=True, default=30)
    is_published = models.BooleanField(default=True) 
    list_date = models.DateTimeField(default=datetime.now, blank=True)

class CosmetologyService(models.Model):
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE)
    category = models.ForeignKey(Cosmetology, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.IntegerField()
    promotion_price = models.IntegerField(blank=True, null=True)
    duration = models.IntegerField(blank=True, default=30)
    is_published = models.BooleanField(default=True) 
    list_date = models.DateTimeField(default=datetime.now, blank=True)

class TattooService(models.Model):
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE)
    category = models.ForeignKey(Tattoo, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.IntegerField()
    promotion_price = models.IntegerField(blank=True, null=True)
    duration = models.IntegerField(blank=True, default=30)
    is_published = models.BooleanField(default=True) 
    list_date = models.DateTimeField(default=datetime.now, blank=True)

class AestheticsService(models.Model):
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE)
    category = models.ForeignKey(Aesthetics, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.IntegerField()
    promotion_price = models.IntegerField(blank=True, null=True)
    duration = models.IntegerField(blank=True, default=30)
    is_published = models.BooleanField(default=True) 
    list_date = models.DateTimeField(default=datetime.now, blank=True)
    
    def __str__(self):
        return self.title
