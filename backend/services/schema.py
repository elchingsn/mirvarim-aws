import graphene
from graphene_django import DjangoObjectType
from graphql import GraphQLError
from django.db.models import Q
from graphene_file_upload.scalars import Upload
from django.core.files.storage import FileSystemStorage
from PIL import Image
import datetime 

from salons.models import Salon, Master, Hair, Nails, HairRemoval, Makeup, Massage, Eyebrow, Cosmetology, Tattoo, Aesthetics, City, Area
from .models import HairService, NailsService, HairRemovalService, MassageService, MakeupService, EyebrowService, CosmetologyService, TattooService, AestheticsService

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

class EyebrowServiceType(DjangoObjectType):  
    class Meta:
        model = EyebrowService

class CosmetologyServiceType(DjangoObjectType):  
    class Meta:
        model = CosmetologyService

class TattooServiceType(DjangoObjectType):  
    class Meta:
        model = TattooService

class AestheticsServiceType(DjangoObjectType):  
    class Meta:
        model = AestheticsService

#Query definition
class Query(graphene.ObjectType):
    hairServices = graphene.List(HairServiceType, hairCatId=graphene.Int(required=True), salonId=graphene.Int())
    nailsServices = graphene.List(NailsServiceType, NailsCatId=graphene.Int(required=True), salonId=graphene.Int())
    hairRemovalServices = graphene.List(HairRemovalServiceType, hairRemovalCatId=graphene.Int(required=True), salonId=graphene.Int())
    makeupServices = graphene.List(MakeupServiceType, makeupCatId=graphene.Int(required=True), salonId=graphene.Int())
    massageServices = graphene.List(MassageServiceType, massageCatId=graphene.Int(required=True), salonId=graphene.Int())
    eyebrowServices = graphene.List(EyebrowServiceType, eyebrowCatId=graphene.Int(required=True), salonId=graphene.Int())
    cosmetologyServices = graphene.List(CosmetologyServiceType, cosmetologyCatId=graphene.Int(required=True), salonId=graphene.Int())
    tattooServices = graphene.List(TattooServiceType, tattooCatId=graphene.Int(required=True), salonId=graphene.Int())
    aestheticsServices = graphene.List(AestheticsServiceType, AestheticsCatId=graphene.Int(required=True), salonId=graphene.Int())

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

    def resolve_eyebrowServices(self, info, eyebrowCatId, salonId=None):
      if salonId:
        return EyebrowService.objects.filter(category__id=eyebrowCatId, salon__id=salonId)
      
      return EyebrowService.objects.filter(category__id=id)

    def resolve_cosmetologyServices(self, info, cosmetologyCatId, salonId=None):
      if salonId:
        return CosmetologyService.objects.filter(category__id=cosmetologyCatId, salon__id=salonId)
      
      return CosmetologyService.objects.filter(category__id=id)

    def resolve_tattooServices(self, info, tattooCatId, salonId=None):
      if salonId:
        return TattooService.objects.filter(category__id=tattooCatId, salon__id=salonId)
      
      return TattooService.objects.filter(category__id=id)

    def resolve_aestheticsServices(self, info, aestheticsCatId, salonId=None):
      if salonId:
        return AestheticsService.objects.filter(category__id=aestheticsCatId, salon__id=salonId)
      
      return AestheticsService.objects.filter(category__id=id)

class HairServiceInput(graphene.InputObjectType):
    salonId = graphene.Int()
    categoryId = graphene.Int()
    masterIds = graphene.List(graphene.String)
    title = graphene.String() 
    description = graphene.String() 
    duration = graphene.Int()
    price = graphene.Int()
    promotion_price = graphene.Int()
    
class CreateHairService(graphene.Mutation):
    hairService = graphene.Field(HairServiceType)

    class Arguments:
        serviceData = HairServiceInput(required=True)
    
    @staticmethod
    def mutate(root,info,serviceData):
        user = info.context.user
 
        if user.is_anonymous:
            raise GraphQLError('Log in to add a track.')
      
        salonId = serviceData.salonId             
        salon_obj = Salon.objects.get(id=salonId)

        categoryId = serviceData.categoryId             
        hair_obj = Hair.objects.get(id=categoryId)
         
        hairService = HairService.objects.create(
                                      salon = salon_obj,
                                      category = hair_obj,
                                      title = serviceData.title.title(),
                                      description = serviceData.description,
                                      duration = serviceData.duration,
                                      price = serviceData.price,
                                      promotion_price = serviceData.promotion_price
                                      )
        
        masterIds = serviceData.masterIds
        if masterIds[0]:
          for id in masterIds[0]:
            hairService.master.add(Master.objects.get(id=id))

        return CreateHairService(hairService=hairService)

class NailsServiceInput(graphene.InputObjectType):
    salonId = graphene.Int()
    categoryId = graphene.Int()
    masterIds = graphene.List(graphene.String)
    title = graphene.String() 
    description = graphene.String() 
    duration = graphene.Int()
    price = graphene.Int()
    promotion_price = graphene.Int()

class CreateNailsService(graphene.Mutation):
    nailsService = graphene.Field(NailsServiceType)

    class Arguments:
        serviceData = NailsServiceInput(required=True)
    
    @staticmethod
    def mutate(root,info,serviceData):
        user = info.context.user
 
        if user.is_anonymous:
            raise GraphQLError('Log in to add a track.')
      
        salonId = serviceData.salonId             
        salon_obj = Salon.objects.get(id=salonId)

        categoryId = serviceData.categoryId             
        nails_obj = Nails.objects.get(id=categoryId)
         
        nailsService = NailsService.objects.create(
                                      salon = salon_obj,
                                      category = nails_obj,
                                      title = serviceData.title,
                                      description = serviceData.description,
                                      duration = serviceData.duration,
                                      price = serviceData.price,
                                      promotion_price = serviceData.promotion_price
                                      )

        masterIds = serviceData.masterIds
        if masterIds[0]:
          for id in masterIds[0]:
            nailsService.master.add(Master.objects.get(id=id))                                      

        return CreateNailsService(nailsService=nailsService)

class HairRemovalServiceInput(graphene.InputObjectType):
    salonId = graphene.Int()
    categoryId = graphene.Int()
    masterIds = graphene.List(graphene.String)
    title = graphene.String() 
    description = graphene.String() 
    duration = graphene.Int()
    price = graphene.Int()
    promotion_price = graphene.Int()

class CreateHairRemovalService(graphene.Mutation):
    hairRemovalService = graphene.Field(HairRemovalServiceType)

    class Arguments:
        serviceData = HairRemovalServiceInput(required=True)
    
    @staticmethod
    def mutate(root,info,serviceData):
        user = info.context.user
 
        if user.is_anonymous:
            raise GraphQLError('Log in to add a track.')
      
        salonId = serviceData.salonId             
        salon_obj = Salon.objects.get(id=salonId)

        categoryId = serviceData.categoryId             
        hairRemoval_obj = HairRemoval.objects.get(id=categoryId)
         
        hairRemovalService = HairRemovalService.objects.create(
                                      salon = salon_obj,
                                      category = hairRemoval_obj,
                                      title = serviceData.title,
                                      description = serviceData.description,
                                      duration = serviceData.duration,
                                      price = serviceData.price,
                                      promotion_price = serviceData.promotion_price
                                      )

        masterIds = serviceData.masterIds
        if masterIds[0]:
          for id in masterIds[0]:
            hairRemovalService.master.add(Master.objects.get(id=id))

        return CreateHairRemovalService(hairRemovalService=hairRemovalService)

class MakeupServiceInput(graphene.InputObjectType):
    salonId = graphene.Int()
    categoryId = graphene.Int()
    masterIds = graphene.List(graphene.String)
    title = graphene.String() 
    description = graphene.String() 
    duration = graphene.Int()
    price = graphene.Int()
    promotion_price = graphene.Int()

class CreateMakeupService(graphene.Mutation):
    makeupService = graphene.Field(MakeupServiceType)

    class Arguments:
        serviceData = MakeupServiceInput(required=True)
    
    @staticmethod
    def mutate(root,info,serviceData):
        user = info.context.user
 
        if user.is_anonymous:
            raise GraphQLError('Log in to add a track.')
      
        salonId = serviceData.salonId             
        salon_obj = Salon.objects.get(id=salonId)

        categoryId = serviceData.categoryId             
        makeup_obj = Makeup.objects.get(id=categoryId)
         
        makeupService = MakeupService.objects.create(
                                      salon = salon_obj,
                                      category = makeup_obj,
                                      title = serviceData.title,
                                      description = serviceData.description,
                                      duration = serviceData.duration,
                                      price = serviceData.price,
                                      promotion_price = serviceData.promotion_price
                                      )

        masterIds = serviceData.masterIds
        if masterIds[0]:
          for id in masterIds[0]:
            makeupService.master.add(Master.objects.get(id=id))                                      

        return CreateMakeupService(makeupService=makeupService)

class MassageServiceInput(graphene.InputObjectType):
    salonId = graphene.Int()
    categoryId = graphene.Int()
    masterIds = graphene.List(graphene.String)
    title = graphene.String() 
    description = graphene.String() 
    duration = graphene.Int()
    price = graphene.Int()
    promotion_price = graphene.Int()

class CreateMassageService(graphene.Mutation):
    massageService = graphene.Field(MassageServiceType)

    class Arguments:
        serviceData = MassageServiceInput(required=True)
    
    @staticmethod
    def mutate(root,info,serviceData):
        user = info.context.user
 
        if user.is_anonymous:
            raise GraphQLError('Log in to add a track.')
      
        salonId = serviceData.salonId             
        salon_obj = Salon.objects.get(id=salonId)

        categoryId = serviceData.categoryId             
        massage_obj = Massage.objects.get(id=categoryId)
         
        massageService = MassageService.objects.create(
                                      salon = salon_obj,
                                      category = massage_obj,
                                      title = serviceData.title,
                                      description = serviceData.description,
                                      duration = serviceData.duration,
                                      price = serviceData.price,
                                      promotion_price = serviceData.promotion_price
                                      )

        masterIds = serviceData.masterIds
        if masterIds[0]:
          for id in masterIds[0]:
            massageService.master.add(Master.objects.get(id=id))

        return CreateMassageService(massageService=massageService)

class EyebrowServiceInput(graphene.InputObjectType):
    salonId = graphene.Int()
    categoryId = graphene.Int()
    masterIds = graphene.List(graphene.String)
    title = graphene.String() 
    description = graphene.String() 
    duration = graphene.Int()
    price = graphene.Int()
    promotion_price = graphene.Int()

class CreateEyebrowService(graphene.Mutation):
    eyebrowService = graphene.Field(EyebrowServiceType)

    class Arguments:
        serviceData = EyebrowServiceInput(required=True)
    
    @staticmethod
    def mutate(root,info,serviceData):
        user = info.context.user
 
        if user.is_anonymous:
            raise GraphQLError('Log in to add a track.')
      
        salonId = serviceData.salonId             
        salon_obj = Salon.objects.get(id=salonId)

        categoryId = serviceData.categoryId             
        eyebrow_obj = Eyebrow.objects.get(id=categoryId)
         
        eyebrowService = EyebrowService.objects.create(
                                      salon = salon_obj,
                                      category = eyebrow_obj,
                                      title = serviceData.title,
                                      description = serviceData.description,
                                      duration = serviceData.duration,
                                      price = serviceData.price,
                                      promotion_price = serviceData.promotion_price
                                      )

        masterIds = serviceData.masterIds
        if masterIds[0]:
          for id in masterIds[0]:
            eyebrowService.master.add(Master.objects.get(id=id))

        return CreateEyebrowService(eyebrowService=eyebrowService)

class CosmetologyServiceInput(graphene.InputObjectType):
    salonId = graphene.Int()
    categoryId = graphene.Int()
    masterIds = graphene.List(graphene.String)
    title = graphene.String() 
    description = graphene.String() 
    duration = graphene.Int()
    price = graphene.Int()
    promotion_price = graphene.Int()

class CreateCosmetologyService(graphene.Mutation):
    service = graphene.Field(CosmetologyServiceType)

    class Arguments:
        serviceData = CosmetologyServiceInput(required=True)
    
    @staticmethod
    def mutate(root,info,serviceData):
        user = info.context.user
 
        if user.is_anonymous:
            raise GraphQLError('Log in to add a track.')
      
        salonId = serviceData.salonId             
        salon_obj = Salon.objects.get(id=salonId)

        categoryId = serviceData.categoryId             
        cosmetology_obj = Cosmetology.objects.get(id=categoryId)
         
        cosmetologyService = CosmetologyService.objects.create(
                                      salon = salon_obj,
                                      category = cosmetology_obj,
                                      title = serviceData.title,
                                      description = serviceData.description,
                                      duration = serviceData.duration,
                                      price = serviceData.price,
                                      promotion_price = serviceData.promotion_price
                                      )

        masterIds = serviceData.masterIds
        if masterIds[0]:
          for id in masterIds[0]:
            cosmetologyService.master.add(Master.objects.get(id=id))
            
        return CreateCosmetologyService(cosmetologyService=cosmetologyService)

class TattooServiceInput(graphene.InputObjectType):
    salonId = graphene.Int()
    categoryId = graphene.Int()
    masterIds = graphene.List(graphene.String)
    title = graphene.String() 
    description = graphene.String() 
    duration = graphene.Int()
    price = graphene.Int()
    promotion_price = graphene.Int()

class CreateTattooService(graphene.Mutation):
    tattooService = graphene.Field(TattooServiceType)

    class Arguments:
       serviceData = TattooServiceInput(required=True)
    
    @staticmethod
    def mutate(root,info,serviceData):
        user = info.context.user
 
        if user.is_anonymous:
            raise GraphQLError('Log in to add a track.')
      
        salonId = serviceData.salonId             
        salon_obj = Salon.objects.get(id=salonId)

        categoryId = serviceData.categoryId             
        tattoo_obj = Tattoo.objects.get(id=categoryId)
         
        tattooService = TattooService.objects.create(
                                      salon = salon_obj,
                                      category = tattoo_obj,
                                      title = serviceData.title,
                                      description = serviceData.description,
                                      duration = serviceData.duration,
                                      price = serviceData.price,
                                      promotion_price = serviceData.promotion_price
                                      )

        masterIds = serviceData.masterIds
        if masterIds[0]:
          for id in masterIds[0]:
            tattooService.master.add(Master.objects.get(id=id))

        return CreateTattooService(tattooService=tattooService)

class AestheticsServiceInput(graphene.InputObjectType):
    salonId = graphene.Int()
    categoryId = graphene.Int()
    masterIds = graphene.List(graphene.String)
    title = graphene.String() 
    description = graphene.String() 
    duration = graphene.Int()
    price = graphene.Int()
    promotion_price = graphene.Int()

class CreateAestheticsService(graphene.Mutation):
    aestheticsService = graphene.Field(AestheticsServiceType)

    class Arguments:
        serviceData = AestheticsServiceInput(required=True)
    
    @staticmethod 
    def mutate(root,info,serviceData):
        user = info.context.user
 
        if user.is_anonymous:
            raise GraphQLError('Log in to add a track.')
      
        salonId = serviceData.salonId             
        salon_obj = Salon.objects.get(id=salonId)

        categoryId = serviceData.categoryId             
        aesthetics_obj = Aesthetics.objects.get(id=categoryId)
         
        aestheticsService = AestheticsService.objects.create(
                                      salon = salon_obj,
                                      category = aesthetics_obj,
                                      title = serviceData.title,
                                      description = serviceData.description,
                                      duration = serviceData.duration,
                                      price = serviceData.price,
                                      promotion_price = serviceData.promotion_price
                                      )

        masterIds = serviceData.masterIds
        if masterIds[0]:
          for id in masterIds[0]:
            aestheticsService.master.add(Master.objects.get(id=id))

        return CreateAestheticsService(aestheticsService=aestheticsService)

class ServiceMutation(graphene.ObjectType):
    create_hair_service = CreateHairService.Field() 
    create_nails_service = CreateNailsService.Field() 
    create_hair_removal_service = CreateHairRemovalService.Field() 
    create_makeup_service = CreateMakeupService.Field()    
    create_massage_service = CreateMassageService.Field() 
    create_eyebrow_service = CreateEyebrowService.Field()
    create_cosmetology_service = CreateCosmetologyService.Field()    
    create_tattoo_service = CreateTattooService.Field() 
    create_aesthetics_service = CreateAestheticsService.Field()

    
    

        




        





