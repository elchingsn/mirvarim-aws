import graphene
from graphene_django import DjangoObjectType
from graphql import GraphQLError
from django.db.models import Q
from graphene_file_upload.scalars import Upload
from django.core.files.storage import FileSystemStorage
from PIL import Image
import datetime 
from django.core.mail import send_mail

from .models import Review, Vote, Like
from salons.models import Salon

class ReviewType(DjangoObjectType):  
    class Meta:
        model = Review
        convert_choices_to_enum = False

class VoteType(DjangoObjectType): 
    class Meta:
        model = Vote

class LikeType(DjangoObjectType): 
    class Meta:
        model = Like

#Query definition
class Query(graphene.ObjectType):
    reviews = graphene.List(ReviewType, id=graphene.Int(required=True),first=graphene.Int(),skip=graphene.Int())
    votes = graphene.List(VoteType, email=graphene.String(required=True))
    likes = graphene.List(LikeType, email=graphene.String(required=True))

    def resolve_reviews(self, info, id, first=None, skip=None):
      rw =  Review.objects.filter(salon__id=id)
      if skip:
          rw = rw[skip:]

      if first:
          rw = rw[:first]

      return rw
    
    def resolve_votes(self, info, email):
      return Vote.objects.filter(voted_by__email=email)
    
    def resolve_likes(self, info, email):
      return Like.objects.filter(liked_by__email=email)

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
            raise GraphQLError('Log in to add a review.')
      
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
            raise GraphQLError('Log in to vote.')
               
        review_obj = Review.objects.get(id=review_id)
        vote = Vote(voted_by=user, review=review_obj, is_useful=is_useful, is_reported=is_reported)
        vote.save()
        return CreateVote(vote=vote)

class DeleteVote(graphene.Mutation):
    vote_id = graphene.Int()

    class Arguments:
        vote_id = graphene.Int(required=True)
    
    @staticmethod
    def mutate(root,info,vote_id):
        user = info.context.user
        vote = Vote.objects.get(id=vote_id)

        if vote.voted_by != user:
            raise GraphQLError('Not permitted to delete this vote.')

        vote.delete()

        return DeleteVote(vote_id=vote_id)

class CreateLike(graphene.Mutation):
    like = graphene.Field(LikeType)

    class Arguments:
        salon_id = graphene.Int()
    
    @staticmethod
    def mutate(root,info,salon_id):
        user = info.context.user

        if user.is_anonymous:
            raise GraphQLError('Log in to add a favorite.')
               
        salon_obj = Salon.objects.get(id=salon_id)
        like = Like(liked_by=user, salon=salon_obj)
        like.save()
        return CreateLike(like=like)

class DeleteLike(graphene.Mutation):
    like_id = graphene.Int()

    class Arguments:
        like_id = graphene.Int(required=True)
    
    @staticmethod
    def mutate(root,info,like_id):
        user = info.context.user
        like = Like.objects.get(id=like_id)

        if like.liked_by != user:
            raise GraphQLError('Not permitted to delete this like.')

        like.delete()

        return DeleteLike(like_id=like_id)

class ContactInput(graphene.InputObjectType):
    subject = graphene.String()
    message = graphene.String()
    email = graphene.String()

class SendFeedback(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
      contact_data = ContactInput(required=True)
    
    @staticmethod
    def mutate(root,info,contact_data):
        send_mail(
          'from {}: subject - {}'.format(contact_data.email, contact_data.subject),
          contact_data.message,
          contact_data.email,
          ['mirvarim.partner@gmail.com'],
          fail_silently=False,
        )

        return SendFeedback(success=True)


class ReviewMutation(graphene.ObjectType):
    create_review = CreateReview.Field() 
    create_vote = CreateVote.Field() 
    delete_vote = DeleteVote.Field()
    create_like = CreateLike.Field() 
    delete_like = DeleteLike.Field() 
    send_feedback = SendFeedback.Field()



    
    

        




        





