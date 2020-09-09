import graphene
from graphene_django import DjangoObjectType
from graphql import GraphQLError
from django.db.models import Q
from graphene_file_upload.scalars import Upload
from django.core.files.storage import FileSystemStorage
from PIL import Image
import datetime 

from salons.models import Salon, Hair, Nails, HairRemoval, Makeup, Massage, Eyebrow, Cosmetology, Tattoo, Aesthetics, City, Area
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
                                      title = serviceData.title,
                                      description = serviceData.description,
                                      duration = serviceData.duration,
                                      price = serviceData.price,
                                      promotion_price = serviceData.promotion_price
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

class HairRemovalServiceInput(graphene.InputObjectType):
    salonId = graphene.Int()
    categoryId = graphene.Int()
    title = graphene.String() 
    description = graphene.String() 
    price = graphene.Int()
    promotion_price = graphene.Int()

class CreateHairRemovalService(graphene.Mutation):
    hairRemovalService = graphene.Field(HairRemovalServiceType)

    class Arguments:
        hairRemovalServiceData = HairRemovalServiceInput(required=True)
    
    @staticmethod
    def mutate(root,info,hairRemovalServiceData):
        user = info.context.user
 
        if user.is_anonymous:
            raise GraphQLError('Log in to add a track.')
      
        salonId = hairRemovalServiceData.salonId             
        salon_obj = Salon.objects.get(id=salonId)

        categoryId = hairRemovalServiceData.categoryId             
        hairRemoval_obj = HairRemoval.objects.get(id=categoryId)
         
        hairRemovalService = HairRemovalService.objects.create(
                                      salon = salon_obj,
                                      category = hairRemoval_obj,
                                      posted_by = user,
                                      title = hairRemovalServiceData.title,
                                      description = hairRemovalServiceData.description,
                                      price = hairRemovalServiceData.price,
                                      promotion_price = hairRemovalServiceData.promotion_price
                                      )

        return CreateHairRemovalService(hairRemovalService=hairRemovalService)

class MakeupServiceInput(graphene.InputObjectType):
    salonId = graphene.Int()
    categoryId = graphene.Int()
    title = graphene.String() 
    description = graphene.String() 
    price = graphene.Int()
    promotion_price = graphene.Int()

class CreateMakeupService(graphene.Mutation):
    makeupService = graphene.Field(MakeupServiceType)

    class Arguments:
        makeupServiceData = MakeupServiceInput(required=True)
    
    @staticmethod
    def mutate(root,info,makeupServiceData):
        user = info.context.user
 
        if user.is_anonymous:
            raise GraphQLError('Log in to add a track.')
      
        salonId = makeupServiceData.salonId             
        salon_obj = Salon.objects.get(id=salonId)

        categoryId = makeupServiceData.categoryId             
        makeup_obj = Makeup.objects.get(id=categoryId)
         
        makeupService = MakeupService.objects.create(
                                      salon = salon_obj,
                                      category = makeup_obj,
                                      posted_by = user,
                                      title = makeupServiceData.title,
                                      description = makeupServiceData.description,
                                      price = makeupServiceData.price,
                                      promotion_price = makeupServiceData.promotion_price
                                      )

        return CreateMakeupService(makeupService=makeupService)

class MassageServiceInput(graphene.InputObjectType):
    salonId = graphene.Int()
    categoryId = graphene.Int()
    title = graphene.String() 
    description = graphene.String() 
    price = graphene.Int()
    promotion_price = graphene.Int()

class CreateMassageService(graphene.Mutation):
    massageService = graphene.Field(MassageServiceType)

    class Arguments:
        massageServiceData = MassageServiceInput(required=True)
    
    @staticmethod
    def mutate(root,info,massageServiceData):
        user = info.context.user
 
        if user.is_anonymous:
            raise GraphQLError('Log in to add a track.')
      
        salonId = massageServiceData.salonId             
        salon_obj = Salon.objects.get(id=salonId)

        categoryId = massageServiceData.categoryId             
        massage_obj = Massage.objects.get(id=categoryId)
         
        massageService = MassageService.objects.create(
                                      salon = salon_obj,
                                      category = massage_obj,
                                      posted_by = user,
                                      title = massageServiceData.title,
                                      description = massageServiceData.description,
                                      price = massageServiceData.price,
                                      promotion_price = massageServiceData.promotion_price
                                      )

        return CreateMassageService(massageService=massageService)

class EyebrowServiceInput(graphene.InputObjectType):
    salonId = graphene.Int()
    categoryId = graphene.Int()
    title = graphene.String() 
    description = graphene.String() 
    price = graphene.Int()
    promotion_price = graphene.Int()

class CreateEyebrowService(graphene.Mutation):
    eyebrowService = graphene.Field(EyebrowServiceType)

    class Arguments:
        eyebrowServiceData = EyebrowServiceInput(required=True)
    
    @staticmethod
    def mutate(root,info,eyebrowServiceData):
        user = info.context.user
 
        if user.is_anonymous:
            raise GraphQLError('Log in to add a track.')
      
        salonId = eyebrowServiceData.salonId             
        salon_obj = Salon.objects.get(id=salonId)

        categoryId = eyebrowServiceData.categoryId             
        eyebrow_obj = Eyebrow.objects.get(id=categoryId)
         
        eyebrowService = EyebrowService.objects.create(
                                      salon = salon_obj,
                                      category = eyebrow_obj,
                                      posted_by = user,
                                      title = eyebrowServiceData.title,
                                      description = eyebrowServiceData.description,
                                      price = eyebrowServiceData.price,
                                      promotion_price = eyebrowServiceData.promotion_price
                                      )

        return CreateEyebrowService(eyebrowService=eyebrowService)

class CosmetologyServiceInput(graphene.InputObjectType):
    salonId = graphene.Int()
    categoryId = graphene.Int()
    title = graphene.String() 
    description = graphene.String() 
    price = graphene.Int()
    promotion_price = graphene.Int()

class CreateCosmetologyService(graphene.Mutation):
    cosmetologyService = graphene.Field(CosmetologyServiceType)

    class Arguments:
        cosmetologyServiceData = CosmetologyServiceInput(required=True)
    
    @staticmethod
    def mutate(root,info,cosmetologyServiceData):
        user = info.context.user
 
        if user.is_anonymous:
            raise GraphQLError('Log in to add a track.')
      
        salonId = cosmetologyServiceData.salonId             
        salon_obj = Salon.objects.get(id=salonId)

        categoryId = cosmetologyServiceData.categoryId             
        cosmetology_obj = Cosmetology.objects.get(id=categoryId)
         
        cosmetologyService = CosmetologyService.objects.create(
                                      salon = salon_obj,
                                      category = cosmetology_obj,
                                      posted_by = user,
                                      title = cosmetologyServiceData.title,
                                      description = cosmetologyServiceData.description,
                                      price = cosmetologyServiceData.price,
                                      promotion_price = cosmetologyServiceData.promotion_price
                                      )

        return CreateCosmetologyService(cosmetologyService=cosmetologyService)

class TattooServiceInput(graphene.InputObjectType):
    salonId = graphene.Int()
    categoryId = graphene.Int()
    title = graphene.String() 
    description = graphene.String() 
    price = graphene.Int()
    promotion_price = graphene.Int()

class CreateTattooService(graphene.Mutation):
    tattooService = graphene.Field(TattooServiceType)

    class Arguments:
        tattooServiceData = TattooServiceInput(required=True)
    
    @staticmethod
    def mutate(root,info,tattooServiceData):
        user = info.context.user
 
        if user.is_anonymous:
            raise GraphQLError('Log in to add a track.')
      
        salonId = tattooServiceData.salonId             
        salon_obj = Salon.objects.get(id=salonId)

        categoryId = tattooServiceData.categoryId             
        tattoo_obj = Tattoo.objects.get(id=categoryId)
         
        tattooService = TattooService.objects.create(
                                      salon = salon_obj,
                                      category = tattoo_obj,
                                      posted_by = user,
                                      title = tattooServiceData.title,
                                      description = tattooServiceData.description,
                                      price = tattooServiceData.price,
                                      promotion_price = tattooServiceData.promotion_price
                                      )

        return CreateTattooService(tattooService=tattooService)

class AestheticsServiceInput(graphene.InputObjectType):
    salonId = graphene.Int()
    categoryId = graphene.Int()
    title = graphene.String() 
    description = graphene.String() 
    price = graphene.Int()
    promotion_price = graphene.Int()

class CreateAestheticsService(graphene.Mutation):
    aestheticsService = graphene.Field(AestheticsServiceType)

    class Arguments:
        aestheticsServiceData = AestheticsServiceInput(required=True)
    
    @staticmethod
    def mutate(root,info,aestheticsServiceData):
        user = info.context.user
 
        if user.is_anonymous:
            raise GraphQLError('Log in to add a track.')
      
        salonId = aestheticsServiceData.salonId             
        salon_obj = Salon.objects.get(id=salonId)

        categoryId = aestheticsServiceData.categoryId             
        aesthetics_obj = Aesthetics.objects.get(id=categoryId)
         
        aestheticsService = AestheticsService.objects.create(
                                      salon = salon_obj,
                                      category = aesthetics_obj,
                                      posted_by = user,
                                      title = aestheticsServiceData.title,
                                      description = aestheticsServiceData.description,
                                      price = aestheticsServiceData.price,
                                      promotion_price = aestheticsServiceData.promotion_price
                                      )

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

    
    

        




        





