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
                                      title = serviceData.title,
                                      description = serviceData.description,
                                      duration = serviceData.duration,
                                      price = serviceData.price,
                                      promotion_price = serviceData.promotion_price
                                      )
        
        masterIds = serviceData.masterIds
        if masterIds[0]:
          for id in masterIds:
            hairService.master.add(Master.objects.get(id=id))

        return CreateHairService(hairService=hairService)

class UpdateHairService(graphene.Mutation):
    hairService = graphene.Field(HairServiceType)

    class Arguments:
      serviceId = graphene.Int(required=True)
      serviceData = HairServiceInput(required=True)
    
    @staticmethod
    def mutate(root,info,serviceId,serviceData):
        user = info.context.user
        hairService = HairService.objects.get(id=serviceId)

        if user.is_anonymous:
            raise GraphQLError('Log in to edit service.')
        hairService.title = serviceData.title
        hairService.description = serviceData.description
        hairService.duration = serviceData.duration
        hairService.price = serviceData.price
        hairService.promotion_price = serviceData.promotion_price

        masterIds = serviceData.masterIds
        if masterIds[0]:
          hairService.master.clear()
          for id in masterIds:
            hairService.master.add(Master.objects.get(id=id))
     
        hairService.save()
        return UpdateHairService(hairService=hairService)

class DeleteHairService(graphene.Mutation):
    hairService = graphene.Field(HairServiceType)

    class Arguments:
      serviceId = graphene.Int(required=True)
    
    @staticmethod
    def mutate(root,info,serviceId):
        user = info.context.user
        hairService = HairService.objects.get(id=serviceId)

        if user.is_anonymous:
            raise GraphQLError('Log in to delete service.')
                
        hairService.delete()
        return DeleteHairService(hairService=hairService)


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
          for id in masterIds:
            nailsService.master.add(Master.objects.get(id=id))                                      

        return CreateNailsService(nailsService=nailsService)

class UpdateNailsService(graphene.Mutation):
    nailsService = graphene.Field(NailsServiceType)

    class Arguments:
      serviceId = graphene.Int(required=True)
      serviceData = NailsServiceInput(required=True)
    
    @staticmethod
    def mutate(root,info,serviceId,serviceData):
        user = info.context.user
        nailsService = NailsService.objects.get(id=serviceId)

        if user.is_anonymous:
            raise GraphQLError('Log in to edit service.')
        nailsService.title = serviceData.title
        nailsService.description = serviceData.description
        nailsService.duration = serviceData.duration
        nailsService.price = serviceData.price
        nailsService.promotion_price = serviceData.promotion_price

        masterIds = serviceData.masterIds
        if masterIds[0]:
          nailsService.master.clear()
          for id in masterIds:
            nailsService.master.add(Master.objects.get(id=id))
     
        nailsService.save()
        return UpdateNailsService(nailsService=nailsService)

class DeleteNailsService(graphene.Mutation):
    nailsService = graphene.Field(NailsServiceType)

    class Arguments:
      serviceId = graphene.Int(required=True)
    
    @staticmethod
    def mutate(root,info,serviceId):
        user = info.context.user
        nailsService = NailsService.objects.get(id=serviceId)

        if user.is_anonymous:
            raise GraphQLError('Log in to delete service.')
                
        nailsService.delete()
        return DeleteNailsService(nailsService=nailsService)

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
          for id in masterIds:
            hairRemovalService.master.add(Master.objects.get(id=id))

        return CreateHairRemovalService(hairRemovalService=hairRemovalService)

class UpdateHairRemovalService(graphene.Mutation):
    hairRemovalService = graphene.Field(HairRemovalServiceType)

    class Arguments:
      serviceId = graphene.Int(required=True)
      serviceData = HairRemovalServiceInput(required=True)
    
    @staticmethod
    def mutate(root,info,serviceId,serviceData):
        user = info.context.user
        hairRemovalService = HairRemovalService.objects.get(id=serviceId)

        if user.is_anonymous:
            raise GraphQLError('Log in to edit service.')
        hairRemovalService.title = serviceData.title
        hairRemovalService.description = serviceData.description
        hairRemovalService.duration = serviceData.duration
        hairRemovalService.price = serviceData.price
        hairRemovalService.promotion_price = serviceData.promotion_price

        masterIds = serviceData.masterIds
        if masterIds[0]:
          hairRemovalService.master.clear()
          for id in masterIds:
            hairRemovalService.master.add(Master.objects.get(id=id))
     
        hairRemovalService.save()
        return UpdateHairRemovalService(hairRemovalService=hairRemovalService)

class DeleteHairRemovalService(graphene.Mutation):
    hairRemovalService = graphene.Field(HairRemovalServiceType)

    class Arguments:
      serviceId = graphene.Int(required=True)
    
    @staticmethod
    def mutate(root,info,serviceId):
        user = info.context.user
        hairRemovalService = HairRemovalService.objects.get(id=serviceId)

        if user.is_anonymous:
            raise GraphQLError('Log in to delete service.')
                
        hairRemovalService.delete()
        return DeleteHairRemovalService(hairRemovalService=hairRemovalService)

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
          for id in masterIds:
            makeupService.master.add(Master.objects.get(id=id))                                      

        return CreateMakeupService(makeupService=makeupService)

class UpdateMakeupService(graphene.Mutation):
    makeupService = graphene.Field(MakeupServiceType)

    class Arguments:
      serviceId = graphene.Int(required=True)
      serviceData = MakeupServiceInput(required=True)
    
    @staticmethod
    def mutate(root,info,serviceId,serviceData):
        user = info.context.user
        makeupService = MakeupService.objects.get(id=serviceId)

        if user.is_anonymous:
            raise GraphQLError('Log in to edit service.')
        makeupService.title = serviceData.title
        makeupService.description = serviceData.description
        makeupService.duration = serviceData.duration
        makeupService.price = serviceData.price
        makeupService.promotion_price = serviceData.promotion_price

        masterIds = serviceData.masterIds
        if masterIds[0]:
          makeupService.master.clear()
          for id in masterIds:
            makeupService.master.add(Master.objects.get(id=id))
     
        makeupService.save()
        return UpdateMakeupService(makeupService=makeupService)

class DeleteMakeupService(graphene.Mutation):
    makeupService = graphene.Field(MakeupServiceType)

    class Arguments:
      serviceId = graphene.Int(required=True)
    
    @staticmethod
    def mutate(root,info,serviceId):
        user = info.context.user
        makeupService = MakeupService.objects.get(id=serviceId)

        if user.is_anonymous:
            raise GraphQLError('Log in to delete service.')
                
        makeupService.delete()
        return DeleteMakeupService(makeupService=makeupService)

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
          for id in masterIds:
            massageService.master.add(Master.objects.get(id=id))

        return CreateMassageService(massageService=massageService)

class UpdateMassageService(graphene.Mutation):
    massageService = graphene.Field(MassageServiceType)

    class Arguments:
      serviceId = graphene.Int(required=True)
      serviceData = MassageServiceInput(required=True)
    
    @staticmethod
    def mutate(root,info,serviceId,serviceData):
        user = info.context.user
        massageService = MassageService.objects.get(id=serviceId)

        if user.is_anonymous:
            raise GraphQLError('Log in to edit service.')
        massageService.title = serviceData.title
        massageService.description = serviceData.description
        massageService.duration = serviceData.duration
        massageService.price = serviceData.price
        massageService.promotion_price = serviceData.promotion_price

        masterIds = serviceData.masterIds
        if masterIds[0]:
          massageService.master.clear()
          for id in masterIds:
            massageService.master.add(Master.objects.get(id=id))
     
        massageService.save()
        return UpdateMassageService(massageService=massageService)

class DeleteMassageService(graphene.Mutation):
    massageService = graphene.Field(MassageServiceType)

    class Arguments:
      serviceId = graphene.Int(required=True)
    
    @staticmethod
    def mutate(root,info,serviceId):
        user = info.context.user
        massageService = MassageService.objects.get(id=serviceId)

        if user.is_anonymous:
            raise GraphQLError('Log in to delete service.')
                
        massageService.delete()
        return DeleteMassageService(massageService=massageService)

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
          for id in masterIds:
            eyebrowService.master.add(Master.objects.get(id=id))

        return CreateEyebrowService(eyebrowService=eyebrowService)

class UpdateEyebrowService(graphene.Mutation):
    eyebrowService = graphene.Field(EyebrowServiceType)

    class Arguments:
      serviceId = graphene.Int(required=True)
      serviceData = EyebrowServiceInput(required=True)
    
    @staticmethod
    def mutate(root,info,serviceId,serviceData):
        user = info.context.user
        eyebrowService = EyebrowService.objects.get(id=serviceId)

        if user.is_anonymous:
            raise GraphQLError('Log in to edit service.')
        eyebrowService.title = serviceData.title
        eyebrowService.description = serviceData.description
        eyebrowService.duration = serviceData.duration
        eyebrowService.price = serviceData.price
        eyebrowService.promotion_price = serviceData.promotion_price

        masterIds = serviceData.masterIds
        if masterIds[0]:
          eyebrowService.master.clear()
          for id in masterIds:
            eyebrowService.master.add(Master.objects.get(id=id))
     
        eyebrowService.save()
        return UpdateEyebrowService(eyebrowService=eyebrowService)

class DeleteEyebrowService(graphene.Mutation):
    eyebrowService = graphene.Field(EyebrowServiceType)

    class Arguments:
      serviceId = graphene.Int(required=True)
    
    @staticmethod
    def mutate(root,info,serviceId):
        user = info.context.user
        eyebrowService = EyebrowService.objects.get(id=serviceId)

        if user.is_anonymous:
            raise GraphQLError('Log in to delete service.')
                
        eyebrowService.delete()
        return DeleteEyebrowService(eyebrowService=eyebrowService)

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
    cosmetologyService = graphene.Field(CosmetologyServiceType)

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
          for id in masterIds:
            cosmetologyService.master.add(Master.objects.get(id=id))
            
        return CreateCosmetologyService(cosmetologyService=cosmetologyService)

class UpdateCosmetologyService(graphene.Mutation):
    cosmetologyService = graphene.Field(CosmetologyServiceType)

    class Arguments:
      serviceId = graphene.Int(required=True)
      serviceData = CosmetologyServiceInput(required=True)
    
    @staticmethod
    def mutate(root,info,serviceId,serviceData):
        user = info.context.user
        cosmetologyService = CosmetologyService.objects.get(id=serviceId)

        if user.is_anonymous:
            raise GraphQLError('Log in to edit service.')
        cosmetologyService.title = serviceData.title
        cosmetologyService.description = serviceData.description
        cosmetologyService.duration = serviceData.duration
        cosmetologyService.price = serviceData.price
        cosmetologyService.promotion_price = serviceData.promotion_price

        masterIds = serviceData.masterIds
        if masterIds[0]:
          cosmetologyService.master.clear()
          for id in masterIds:
            cosmetologyService.master.add(Master.objects.get(id=id))
     
        cosmetologyService.save()
        return UpdateCosmetologyService(cosmetologyService=cosmetologyService)

class DeleteCosmetologyService(graphene.Mutation):
    cosmetologyService = graphene.Field(CosmetologyServiceType)

    class Arguments:
      serviceId = graphene.Int(required=True)
    
    @staticmethod
    def mutate(root,info,serviceId):
        user = info.context.user
        cosmetologyService = CosmetologyService.objects.get(id=serviceId)

        if user.is_anonymous:
            raise GraphQLError('Log in to delete service.')
                
        cosmetologyService.delete()
        return DeleteCosmetologyService(cosmetologyService=cosmetologyService)

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
          for id in masterIds:
            tattooService.master.add(Master.objects.get(id=id))

        return CreateTattooService(tattooService=tattooService)

class UpdateTattooService(graphene.Mutation):
    tattooService = graphene.Field(TattooServiceType)

    class Arguments:
      serviceId = graphene.Int(required=True)
      serviceData = TattooServiceInput(required=True)
    
    @staticmethod
    def mutate(root,info,serviceId,serviceData):
        user = info.context.user
        tattooService = TattooService.objects.get(id=serviceId)

        if user.is_anonymous:
            raise GraphQLError('Log in to edit service.')
        tattooService.title = serviceData.title
        tattooService.description = serviceData.description
        tattooService.duration = serviceData.duration
        tattooService.price = serviceData.price
        tattooService.promotion_price = serviceData.promotion_price

        masterIds = serviceData.masterIds
        if masterIds[0]:
          tattooService.master.clear()
          for id in masterIds:
            tattooService.master.add(Master.objects.get(id=id))
     
        tattooService.save()
        return UpdateTattooService(tattooService=tattooService)

class DeleteTattooService(graphene.Mutation):
    tattooService = graphene.Field(TattooServiceType)

    class Arguments:
      serviceId = graphene.Int(required=True)
    
    @staticmethod
    def mutate(root,info,serviceId):
        user = info.context.user
        tattooService = TattooService.objects.get(id=serviceId)

        if user.is_anonymous:
            raise GraphQLError('Log in to delete service.')
                
        tattooService.delete()
        return DeleteTattooService(tattooService=tattooService)

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
          for id in masterIds:
            aestheticsService.master.add(Master.objects.get(id=id))

        return CreateAestheticsService(aestheticsService=aestheticsService)

class UpdateAestheticsService(graphene.Mutation):
    aestheticsService = graphene.Field(AestheticsServiceType)

    class Arguments:
      serviceId = graphene.Int(required=True)
      serviceData = AestheticsServiceInput(required=True)
    
    @staticmethod
    def mutate(root,info,serviceId,serviceData):
        user = info.context.user
        aestheticsService = AestheticsService.objects.get(id=serviceId)

        if user.is_anonymous:
            raise GraphQLError('Log in to edit service.')
        aestheticsService.title = serviceData.title
        aestheticsService.description = serviceData.description
        aestheticsService.duration = serviceData.duration
        aestheticsService.price = serviceData.price
        aestheticsService.promotion_price = serviceData.promotion_price

        masterIds = serviceData.masterIds
        if masterIds[0]:
          aestheticsService.master.clear()
          for id in masterIds:
            aestheticsService.master.add(Master.objects.get(id=id))
     
        aestheticsService.save()
        return UpdateAestheticsService(aestheticsService=aestheticsService)

class DeleteAestheticsService(graphene.Mutation):
    aestheticsService = graphene.Field(AestheticsServiceType)

    class Arguments:
      serviceId = graphene.Int(required=True)
    
    @staticmethod
    def mutate(root,info,serviceId):
        user = info.context.user
        aestheticsService = AestheticsService.objects.get(id=serviceId)

        if user.is_anonymous:
            raise GraphQLError('Log in to delete service.')
                
        aestheticsService.delete()
        return DeleteAestheticsService(aestheticsService=aestheticsService)

class ServiceMutation(graphene.ObjectType):
    create_hair_service = CreateHairService.Field() 
    update_hair_service = UpdateHairService.Field() 
    delete_hair_service = DeleteHairService.Field()

    create_nails_service = CreateNailsService.Field() 
    update_nails_service = UpdateNailsService.Field() 
    delete_nails_service = DeleteNailsService.Field()

    create_hair_removal_service = CreateHairRemovalService.Field() 
    update_hair_removal_service = UpdateHairRemovalService.Field() 
    delete_hair_removal_service = DeleteHairRemovalService.Field()

    create_makeup_service = CreateMakeupService.Field()    
    update_makeup_service = UpdateMakeupService.Field() 
    delete_makeup_service = DeleteMakeupService.Field()

    create_massage_service = CreateMassageService.Field() 
    update_massage_service = UpdateMassageService.Field() 
    delete_massage_service = DeleteMassageService.Field()

    create_eyebrow_service = CreateEyebrowService.Field()
    update_eyebrow_service = UpdateEyebrowService.Field() 
    delete_eyebrow_service = DeleteEyebrowService.Field()

    create_cosmetology_service = CreateCosmetologyService.Field()    
    update_cosmetology_service = UpdateCosmetologyService.Field() 
    delete_cosmetology_service = DeleteCosmetologyService.Field()

    create_tattoo_service = CreateTattooService.Field() 
    update_tattoo_service = UpdateTattooService.Field() 
    delete_tattoo_service = DeleteTattooService.Field()

    create_aesthetics_service = CreateAestheticsService.Field()
    update_aesthetics_service = UpdateAestheticsService.Field() 
    delete_aesthetics_service = DeleteAestheticsService.Field()


    
    

        




        





