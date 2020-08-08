import graphene
from graphene_django import DjangoObjectType
from graphql import GraphQLError
from django.db.models import Q
from graphene_file_upload.scalars import Upload
from django.core.files.storage import FileSystemStorage
from PIL import Image
import datetime 

from salons.models import Salon, Hair, Nails, HairRemoval, Massage, Makeup
from .models import HairService, NailsService, HairRemovalService, MassageService, MakeupService

class HairServiceType(DjangoObjectType):  
    class Meta:
        model = HairService

class NailsServiceType(DjangoObjectType):  
    class Meta:
        model = NailsService

class HairRemovalServiceType(DjangoObjectType):  
    class Meta:
        model = HairRemovalService

class MassageServiceType(DjangoObjectType):  
    class Meta:
        model = MassageService

class MakeupServiceType(DjangoObjectType):  
    class Meta:
        model = MakeupService

#Query definition
class Query(graphene.ObjectType):
    hairServices = graphene.List(HairServiceType, hairCatId=graphene.Int(required=True), salonId=graphene.Int())
    nailsServices = graphene.List(NailsServiceType, NailsCatId=graphene.Int(required=True), salonId=graphene.Int())
    hairRemovalServices = graphene.List(HairRemovalServiceType, hairRemovalCatId=graphene.Int(required=True), salonId=graphene.Int())
    makeupServices = graphene.List(MakeupServiceType, makeupCatId=graphene.Int(required=True), salonId=graphene.Int())
    massageServices = graphene.List(MassageServiceType, massageCatId=graphene.Int(required=True), salonId=graphene.Int())

    def resolve_hairServices(self, info, hairCatId, salonId=None):
      if salonId:
        return HairService.objects.filter(category__id=hairCatId, salon__id=salonId)
      
      return HairService.objects.filter(category__id=id)

    def resolve_nailsServices(self, info, nailsCatId, salonId=None):
      if salonId:
        return NailsService.objects.filter(category__id=nailsCatId, salon__id=salonId)
      
      return NailsService.objects.filter(category__id=id)  

    def resolve_hairRemovalServices(self, info, hairRemovalCatId, salonId=None):
      if salonId:
        return HairRemovalService.objects.filter(category__id=hairRemovalCatId, salon__id=salonId)
      
      return HairRemovalService.objects.filter(category__id=id)

    def resolve_makeupServices(self, info, makeupCatId, salonId=None):
      if salonId:
        return MakeupService.objects.filter(category__id=makeupCatId, salon__id=salonId)
      
      return MakeupService.objects.filter(category__id=id)

    def resolve_massageServices(self, info, massageCatId, salonId=None):
      if salonId:
        return MassageService.objects.filter(category__id=massageCatId, salon__id=salonId)
      
      return MassageService.objects.filter(category__id=id)


class HairServiceInput(graphene.InputObjectType):
    salonId = graphene.Int()
    categoryId = graphene.Int()
    title = graphene.String() 
    description = graphene.String() 
    price = graphene.Int()
    promotion_price = graphene.Int()
    
class CreateHairService(graphene.Mutation):
    hairService = graphene.Field(HairServiceType)

    class Arguments:
        hairServiceData = HairServiceInput(required=True)
    
    @staticmethod
    def mutate(root,info,hairServiceData):
        user = info.context.user
 
        if user.is_anonymous:
            raise GraphQLError('Log in to add a track.')
      
        salonId = hairServiceData.salonId             
        salon_obj = Salon.objects.get(id=salonId)

        categoryId = hairServiceData.categoryId             
        hair_obj = Hair.objects.get(id=categoryId)
         
        hairService = HairService.objects.create(
                                      salon = salon_obj,
                                      category = hair_obj,
                                      posted_by = user,
                                      title = hairServiceData.title,
                                      description = hairServiceData.description,
                                      price = hairServiceData.price,
                                      promotion_price = hairServiceData.promotion_price
                                      )

        return CreateHairService(hairService=hairService)

class NailsServiceInput(graphene.InputObjectType):
    salonId = graphene.Int()
    categoryId = graphene.Int()
    title = graphene.String() 
    description = graphene.String() 
    price = graphene.Int()
    promotion_price = graphene.Int()

class CreateNailsService(graphene.Mutation):
    nailsService = graphene.Field(NailsServiceType)

    class Arguments:
        nailsServiceData = NailsServiceInput(required=True)
    
    @staticmethod
    def mutate(root,info,nailsServiceData):
        user = info.context.user
 
        if user.is_anonymous:
            raise GraphQLError('Log in to add a track.')
      
        salonId = nailsServiceData.salonId             
        salon_obj = Salon.objects.get(id=salonId)

        categoryId = nailsServiceData.categoryId             
        nails_obj = Nails.objects.get(id=categoryId)
         
        nailsService = NailsService.objects.create(
                                      salon = salon_obj,
                                      category = nails_obj,
                                      posted_by = user,
                                      title = nailsServiceData.title,
                                      description = nailsServiceData.description,
                                      price = nailsServiceData.price,
                                      promotion_price = nailsServiceData.promotion_price
                                      )

        return CreateNailsService(nailsService=nailsService)

class ServiceMutation(graphene.ObjectType):
    create_hair_service = CreateHairService.Field() 
    create_nails_service = CreateNailsService.Field() 

    
    

        




        





