from django.db import models
from datetime import datetime
from django.contrib.auth import get_user_model
from salons.models import Salon

RATING_CHOICES = ( 
    (1, "★☆☆☆☆"),
    (2, "★★☆☆☆"),
    (3, "★★★☆☆"),
    (4, "★★★★☆"),
    (5, "★★★★★"), 
)

FEEDBACK_CHOICES = ( 
    (1, "Yes"),
    (2, "Maybe"),
    (3, "No"),
    (4, "Skip"),
)

class Review(models.Model):
  posted_by = models.ForeignKey(get_user_model(), null=True, on_delete=models.CASCADE)
  salon = models.ForeignKey(Salon, on_delete=models.CASCADE)
  rating = models.PositiveIntegerField(choices=RATING_CHOICES, default=5)
  question1 = models.PositiveIntegerField(choices=FEEDBACK_CHOICES, blank=True, default=4)
  question2 = models.PositiveIntegerField(choices=FEEDBACK_CHOICES, blank=True, default=4)
  question3 = models.PositiveIntegerField(choices=FEEDBACK_CHOICES, blank=True, default=4)
  question4 = models.PositiveIntegerField(choices=FEEDBACK_CHOICES, blank=True, default=4)
  question5 = models.PositiveIntegerField(choices=FEEDBACK_CHOICES, blank=True, default=4)
  comment = models.TextField(blank=True)
  post_date = models.DateTimeField(default=datetime.now, blank=True)

  def __str__(self):
    return self.salon.name

class Vote(models.Model):
  voted_by = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
  review = models.ForeignKey(Review, on_delete=models.CASCADE)
  is_useful = models.BooleanField(default=False)
  is_reported = models.BooleanField(default=False)

  def __str__(self):
    return self.voted_by.username


  
