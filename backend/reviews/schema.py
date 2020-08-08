import graphene
from graphene_django import DjangoObjectType
from graphql import GraphQLError
from django.db.models import Q
from graphene_file_upload.scalars import Upload
from django.core.files.storage import FileSystemStorage
from PIL import Image
import datetime 

from .models import Review, Vote  
from salons.models import Salon

class ReviewType(DjangoObjectType):  
    class Meta:
        model = Review
        convert_choices_to_enum = False

class VoteType(DjangoObjectType): 
    class Meta:
        model = Vote

#Query definition
class Query(graphene.ObjectType):
    reviews = graphene.List(ReviewType, id=graphene.Int(required=True))
    votes = graphene.List(VoteType, id=graphene.Int(required=True))

    def resolve_reviews(self, info, id):
      return Review.objects.filter(salon__id=id)
    
    def resolve_votes(self, info, id):
      return Vote.objects.filter(voted_by__id=id)

class ReviewInput(graphene.InputObjectType):
    salon_id = graphene.Int()
    rating = graphene.Int()
    comment = graphene.String() 
    question1 = graphene.Int()
    question2 = graphene.Int()
    question3 = graphene.Int()
    question4 = graphene.Int()
    question5 = graphene.Int()  

    
class CreateReview(graphene.Mutation):
    review = graphene.Field(ReviewType)

    class Arguments:
        review_data = ReviewInput(required=True)
    
    @staticmethod
    def mutate(root,info,review_data):
        user = info.context.user
 
        if user.is_anonymous:
            raise GraphQLError('Log in to add a track.')
      
        salon_id = review_data.salon_id             
        salon_obj = Salon.objects.get(id=salon_id)
         
        review = Review.objects.create(
                                      salon = salon_obj,
                                      posted_by = user,
                                      rating = review_data.rating,
                                      comment = review_data.comment,
                                      question1 = review_data.question1,
                                      question2 = review_data.question2,
                                      question3 = review_data.question3,
                                      question4 = review_data.question4,
                                      question5 = review_data.question5
                                      )

        return CreateReview(review=review)
      
class CreateVote(graphene.Mutation):
    vote = graphene.Field(VoteType)

    class Arguments:
        review_id = graphene.Int()
        is_useful = graphene.Boolean()
        is_reported = graphene.Boolean()
    
    @staticmethod
    def mutate(root,info,review_id,is_useful,is_reported):
        user = info.context.user

        if user.is_anonymous:
            raise GraphQLError('Log in to add a track.')
               
        review_obj = Review.objects.get(id=review_id)
        vote = Vote(voted_by=user, review=review_obj, is_useful=is_useful, is_reported=is_reported)
        vote.save()
        return CreateVote(vote=vote)

   
class ReviewMutation(graphene.ObjectType):
    create_review = CreateReview.Field() 
    create_vote = CreateVote.Field() 

    
    

        




        





