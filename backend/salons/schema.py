import graphene
from graphene_django import DjangoObjectType
from graphql import GraphQLError
from django.db.models import Q, Case, When
from graphene_file_upload.scalars import Upload
from django.core.files.storage import FileSystemStorage
from mirvarix.storage_backends import PublicMediaStorage
from PIL import Image
from PIL import ExifTags
from io import BytesIO
from resizeimage import resizeimage
import datetime
import requests
import os
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth import get_user_model
from django.utils.timezone import make_aware,is_naive 
from django.conf import settings

from .models import Salon, Master, Hair, Nails, HairRemoval, Makeup, Massage, Eyebrow, Cosmetology, Tattoo, Aesthetics, City, Area, Booking
from services.models import HairService, NailsService, HairRemovalService, MassageService, MakeupService, EyebrowService, CosmetologyService, TattooService, AestheticsService

class HairType(DjangoObjectType):
    class Meta:
        model = Hair

class NailsType(DjangoObjectType):
    class Meta:
        model = Nails

class HairRemovalType(DjangoObjectType):
    class Meta:
        model = HairRemoval

class MakeupType(DjangoObjectType):
    class Meta:
        model = Makeup

class MassageType(DjangoObjectType):
    class Meta:
        model = Massage

class EyebrowType(DjangoObjectType):
    class Meta:
        model = Eyebrow

class CosmetologyType(DjangoObjectType):
    class Meta:
        model = Cosmetology

class TattooType(DjangoObjectType):
    class Meta:
        model = Tattoo

class AestheticsType(DjangoObjectType):
    class Meta:
        model = Aesthetics

class CityType(DjangoObjectType):
    class Meta:
        model = City

class AreaType(DjangoObjectType):
    class Meta:
        model = Area

class SalonType(DjangoObjectType): 
    class Meta:
        model = Salon
        convert_choices_to_enum = False

class MasterType(DjangoObjectType): 
    class Meta:
        model = Master

class BookingType(DjangoObjectType): 
    class Meta:
        model = Booking

#Query definition
class Query(graphene.ObjectType):
    salons = graphene.List(SalonType, search=graphene.String())
    bookings = graphene.List(BookingType, id=graphene.String(), email=graphene.String())
    salons_filtered = graphene.List(SalonType, 
                                    booking=graphene.Boolean(),
                                    onlysalons=graphene.Boolean(),
                                    outcall=graphene.Boolean(),
                                    area=graphene.List(graphene.String),
                                    hair=graphene.List(graphene.String),
                                    nails=graphene.List(graphene.String),
                                    hairRemoval=graphene.List(graphene.String),
                                    makeup=graphene.List(graphene.String),
                                    massage=graphene.List(graphene.String),
                                    eyebrow=graphene.List(graphene.String),
                                    cosmetology=graphene.List(graphene.String),
                                    tattoo=graphene.List(graphene.String),
                                    aesthetics=graphene.List(graphene.String))                                  
    salon_selected = graphene.List(SalonType, id=graphene.Int(required=True))
    hair_cat = graphene.List(HairType)
    nails_cat = graphene.List(NailsType)
    hair_removal_cat = graphene.List(HairRemovalType)
    makeup_cat = graphene.List(MakeupType)
    massage_cat = graphene.List(MassageType)
    eyebrow_cat = graphene.List(EyebrowType)
    cosmetology_cat = graphene.List(CosmetologyType)
    tattoo_cat = graphene.List(TattooType)
    aesthetics_cat = graphene.List(AestheticsType)
    city = graphene.List(CityType)
    area = graphene.List(AreaType, search=graphene.String())

    def resolve_salons(self, info, search=None):
        if search:
            filter = (
                Q(name__icontains=search) |
                Q(description__icontains=search) |
                Q(city__title__icontains=search) |  
                Q(area__title__icontains=search) |
                Q(hair_categories__title__icontains=search) |
                Q(nails_categories__title__icontains=search) |
                Q(hair_removal_categories__title__icontains=search) |
                Q(makeup_categories__title__icontains=search) |
                Q(massage_categories__title__icontains=search) |
                Q(eyebrow_categories__title__icontains=search) |
                Q(cosmetology_categories__title__icontains=search) |
                Q(tattoo_categories__title__icontains=search) |
                Q(aesthetics_categories__title__icontains=search)  
            )
            return Salon.objects.filter(filter).distinct()
              
        return Salon.objects.all()
    
    def resolve_salons_filtered(self, info, booking=False, onlysalons=False, outcall=False, area=[], hair=[], nails=[], hairRemoval=[],
                                makeup=[], massage=[],eyebrow=[], cosmetology=[], tattoo=[], aesthetics=[]):

        if area and (not (hair or nails or hairRemoval or makeup or massage or eyebrow or cosmetology or tattoo or aesthetics)):
            return Salon.objects.filter((Q(appointment=booking)|Q(appointment=True)) &
                                        (~Q(freelancer=onlysalons)|Q(freelancer=False)) &
                                        (Q(outcall=outcall)|Q(outcall=True)) &
                                        Q(area__title__in=area)).distinct()
        
        if area and (hair or nails or hairRemoval or makeup or massage or eyebrow or cosmetology or tattoo or aesthetics):
            return Salon.objects.filter((Q(appointment=booking)|Q(appointment=True)) &
                                        (~Q(freelancer=onlysalons)|Q(freelancer=False)) &
                                        (Q(outcall=outcall)|Q(outcall=True)) &
                                        Q(area__title__in=area) &
                                        (Q(hair_categories__title__in=hair) |
                                        Q(nails_categories__title__in=nails)|
                                        Q(hair_removal_categories__title__in=hairRemoval)|
                                        Q(makeup_categories__title__in=makeup)|
                                        Q(massage_categories__title__in=massage)|
                                        Q(eyebrow_categories__title__in=eyebrow)|
                                        Q(cosmetology_categories__title__in=cosmetology)|
                                        Q(tattoo_categories__title__in=tattoo)|
                                        Q(aesthetics_categories__title__in=aesthetics))).distinct()
        
        if not area and (hair or nails or hairRemoval or makeup or massage or eyebrow or cosmetology or tattoo or aesthetics):
            return Salon.objects.filter((Q(appointment=booking)|Q(appointment=True)) &
                                        (~Q(freelancer=onlysalons)|Q(freelancer=False)) &
                                        (Q(outcall=outcall)|Q(outcall=True)) &
                                        (Q(hair_categories__title__in=hair) |
                                        Q(nails_categories__title__in=nails)|
                                        Q(hair_removal_categories__title__in=hairRemoval)|
                                        Q(makeup_categories__title__in=makeup)|
                                        Q(massage_categories__title__in=massage)|
                                        Q(eyebrow_categories__title__in=eyebrow)|
                                        Q(cosmetology_categories__title__in=cosmetology)|
                                        Q(tattoo_categories__title__in=tattoo)|
                                        Q(aesthetics_categories__title__in=aesthetics))).distinct()
        
        return Salon.objects.filter((Q(appointment=booking)|Q(appointment=True)) &
                                    (~Q(freelancer=onlysalons)|Q(freelancer=False)) &
                                    (Q(outcall=outcall)|Q(outcall=True)))
    
    def resolve_bookings(self, info, id=None, email=None):
      if id:
        return Booking.objects.filter(master__salon__id=int(id))
      if email:
        return Booking.objects.filter(customer__email=email)
      
      return Booking.objects.all()

    def resolve_salon_selected(self, info, id):
        return Salon.objects.filter(id=id)

    def resolve_hair_cat(self, info):
        return Hair.objects.all()

    def resolve_nails_cat(self, info):
        return Nails.objects.all()

    def resolve_hair_removal_cat(self, info):
        return HairRemoval.objects.all()

    def resolve_makeup_cat(self, info):
        return Makeup.objects.all()

    def resolve_massage_cat(self, info):
        return Massage.objects.all()

    def resolve_eyebrow_cat(self, info):
        return Eyebrow.objects.all()

    def resolve_cosmetology_cat(self, info):
        return Cosmetology.objects.all()

    def resolve_tattoo_cat(self, info):
        return Tattoo.objects.all()

    def resolve_aesthetics_cat(self, info):
        return Aesthetics.objects.all()

    def resolve_city(self, info):
        return City.objects.all()
    
    def resolve_area(self, info, search=None):
        if search:
          return Area.objects.filter(title__icontains=search).distinct()
        return Area.objects.all()

# class CityInput(graphene.InputObjectType):
#     title = graphene.String()

class SalonInput(graphene.InputObjectType):
    name = graphene.String()
    address = graphene.String()
    # city = graphene.Field(CityInput)
    city_id = graphene.Int()
    area_id = graphene.Int()
    description = graphene.String()
    # price_range = graphene.Int()
    masters =   graphene.Int()
    # hair_categories = graphene.List(graphene.String)
    # nails_categories = graphene.List(graphene.String)
    # hair_removal_categories = graphene.List(graphene.String)
    # makeup_categories = graphene.List(graphene.String)
    # massage_categories = graphene.List(graphene.String)
    # eyebrow_categories = graphene.List(graphene.String)
    # cosmetology_categories = graphene.List(graphene.String)
    # tattoo_categories = graphene.List(graphene.String)
    # aesthetics_categories = graphene.List(graphene.String)
    facebook = graphene.String()
    instagram = graphene.String()
    male = graphene.Boolean()
    female = graphene.Boolean()
    email = graphene.String()
    phone = graphene.String()
    photo_main = graphene.String()
    photo_1 = graphene.String()
    photo_2 = graphene.String()
    photo_3 = graphene.String()
    photo_4 = graphene.String()
    photo_5 = graphene.String()
    photo_6 = graphene.String()

class CreateSalon(graphene.Mutation):
    salon = graphene.Field(SalonType)

    class Arguments:
        salon_data = SalonInput(required=True)
    
    @staticmethod
    def mutate(root,info,salon_data):
        user = info.context.user

        if user.is_anonymous:
            raise GraphQLError('Log in to add a salon.')
      
        city_id = salon_data.city_id
        area_id = salon_data.area_id    
        # hair_categories = salon_data.hair_categories,
        # nails_categories = salon_data.nails_categories,
        # hair_removal_categories = salon_data.hair_removal_categories,
        # makeup_categories = salon_data.makeup_categories,
        # massage_categories = salon_data.massage_categories,
        # eyebrow_categories = salon_data.eyebrow_categories,
        # cosmetology_categories = salon_data.cosmetology_categories,
        # tattoo_categories = salon_data.tattoo_categories,
        # aesthetics_categories = salon_data.aesthetics_categories,

        # city_title = "city1"
        city_obj = City.objects.get(id=city_id)
        area_obj = Area.objects.get(id=area_id)  
         
        salon = Salon.objects.create(
                                      created_by = user,
                                      name = salon_data.name,
                                      address = salon_data.address,
                                      city = city_obj,
                                      area = area_obj,
                                      description = salon_data.description,
                                      # price_range = salon_data.price_range,
                                      # masters = salon_data.masters,
                                      # hair_categories = salon_data.hair_categories,
                                      male = salon_data.male,
                                      female = salon_data.female,
                                      email = salon_data.email,
                                      phone = salon_data.phone,
                                      facebook = salon_data.facebook,
                                      instagram = salon_data.instagram,
                                      photo_main = salon_data.photo_main,
                                      photo_1 = salon_data.photo_1,
                                      photo_2 = salon_data.photo_2,
                                      photo_3 = salon_data.photo_3,
                                      photo_4 = salon_data.photo_4,
                                      photo_5 = salon_data.photo_5,
                                      photo_6 = salon_data.photo_6
                                      )
        # if hair_categories[0]:
        #   for id in hair_categories[0]:
        #     salon.hair_categories.add(Hair.objects.get(id=id))

        # if nails_categories[0]:
        #   for id in nails_categories[0]:
        #     salon.nails_categories.add(Nails.objects.get(id=id))

        # if hair_removal_categories[0]:
        #   for id in hair_removal_categories[0]:
        #     salon.hair_removal_categories.add(HairRemoval.objects.get(id=id))

        # if makeup_categories[0]:
        #   for id in makeup_categories[0]:
        #     salon.makeup_categories.add(Makeup.objects.get(id=id))

        # if massage_categories[0]:
        #   for id in massage_categories[0]:
        #     salon.massage_categories.add(Massage.objects.get(id=id))

        # if eyebrow_categories[0]:
        #   for id in eyebrow_categories[0]:
        #     salon.eyebrow_categories.add(Eyebrow.objects.get(id=id))

        # if cosmetology_categories[0]:
        #   for id in cosmetology_categories[0]:
        #     salon.cosmetology_categories.add(Cosmetology.objects.get(id=id))

        # if tattoo_categories[0]:
        #   for id in tattoo_categories[0]:
        #     salon.tattoo_categories.add(Tattoo.objects.get(id=id))

        # if aesthetics_categories[0]:
        #   for id in aesthetics_categories[0]:
        #     salon.aesthetics_categories.add(Aesthetics.objects.get(id=id))

        return CreateSalon(salon=salon)

class UpdateSalon(graphene.Mutation):
    salon = graphene.Field(SalonType)

    class Arguments:
        salon_id = graphene.Int(required=True)
        salon_data = SalonInput(required=True)
    
    @staticmethod
    def mutate(root,info,salon_id,salon_data):
        user = info.context.user
        salon=Salon.objects.get(id=salon_id)
      
        if salon.created_by != user:
            raise GraphQLError('Not permitted to update this salon.') 
      
        city_id = salon_data.city_id
        area_id = salon_data.area_id    
        # hair_categories = salon_data.hair_categories,
        # nails_categories = salon_data.nails_categories,
        # hair_removal_categories = salon_data.hair_removal_categories,
        # makeup_categories = salon_data.makeup_categories,
        # massage_categories = salon_data.massage_categories,
        # eyebrow_categories = salon_data.eyebrow_categories,
        # cosmetology_categories = salon_data.cosmetology_categories,
        # tattoo_categories = salon_data.tattoo_categories,
        # aesthetics_categories = salon_data.aesthetics_categories,
        # id is passed from frontend, salon model however requires relevant objects
        city_obj = City.objects.get(id=city_id)
        area_obj = Area.objects.get(id=area_id)  
       
        salon.name = salon_data.name
        salon.address = salon_data.address
        salon.city = city_obj
        salon.area = area_obj
        salon.description = salon_data.description
        # salon.price_range = salon_data.price_range
        # salon.masters = salon_data.masters
        salon.male = salon_data.male
        salon.female = salon_data.female
        salon.email = salon_data.email
        salon.phone = salon_data.phone
        salon.facebook = salon_data.facebook
        salon.instagram = salon_data.instagram
        salon.photo_main = salon_data.photo_main
        salon.photo_1 = salon_data.photo_1
        salon.photo_2 = salon_data.photo_2
        salon.photo_3 = salon_data.photo_3
        salon.photo_4 = salon_data.photo_4
        salon.photo_5 = salon_data.photo_5
        salon.photo_6 = salon_data.photo_6
        
        # if hair_categories[0]:
        #   salon.hair_categories.clear()
        #   for id in hair_categories[0]:
        #     salon.hair_categories.add(Hair.objects.get(id=id))

        # if nails_categories[0]:
        #   salon.nails_categories.clear()
        #   for id in nails_categories[0]:
        #     salon.nails_categories.add(Nails.objects.get(id=id))

        # if hair_removal_categories[0]:
        #   salon.hair_removal_categories.clear()
        #   for id in hair_removal_categories[0]:
        #     salon.hair_removal_categories.add(HairRemoval.objects.get(id=id))

        # if makeup_categories[0]:
        #   salon.makeup_categories.clear()
        #   for id in makeup_categories[0]:
        #     salon.makeup_categories.add(Makeup.objects.get(id=id))
        
        # salon.massage_categories.clear()
        # if massage_categories[0]:
        #   for id in massage_categories[0]:
        #     salon.massage_categories.add(Massage.objects.get(id=id))

        # if eyebrow_categories[0]:
        #   salon.eyebrow_categories.clear()
        #   for id in eyebrow_categories[0]:
        #     salon.eyebrow_categories.add(Eyebrow.objects.get(id=id))

        # if cosmetology_categories[0]:
        #   salon.cosmetology_categories.clear()
        #   for id in cosmetology_categories[0]:
        #     salon.cosmetology_categories.add(Cosmetology.objects.get(id=id))

        # if tattoo_categories[0]:
        #   salon.tattoo_categories.clear()
        #   for id in tattoo_categories[0]:
        #     salon.tattoo_categories.add(Tattoo.objects.get(id=id))

        # if aesthetics_categories[0]:
        #   salon.aesthetics_categories.clear()
        #   for id in aesthetics_categories[0]:
        #     salon.aesthetics_categories.add(Aesthetics.objects.get(id=id))

        salon.save()
        
        return UpdateSalon(salon=salon)

class MasterInput(graphene.InputObjectType):
    salon_id = graphene.String()
    name = graphene.String()
    email = graphene.String()
    phone = graphene.String()
    isStaff = graphene.Boolean()
    status = graphene.String()

class AddMaster(graphene.Mutation):
    master = graphene.Field(MasterType)

    class Arguments:
      master_data = MasterInput(required=True)
    
    @staticmethod
    def mutate(root,info,master_data):
        user = info.context.user

        if user.is_anonymous:
            raise GraphQLError('Log in to add a master.')      
             
        salon_obj = Salon.objects.get(id=int(master_data.salon_id))

        # if master_data.isStaff:
        #   send_mail(
        #             'Mirvarim: access confirmation request from {}'.format(salon_obj.name),
        #             contact_data.message,
        #             contact_data.email,
        #             ['mirvarim.partner@gmail.com'],
        #             fail_silently=False,
        #           )

        master = Master.objects.create(
                                      salon = salon_obj,
                                      master_name = master_data.name.title(),
                                      master_email = master_data.email,
                                      master_phone = master_data.phone
                                      )
        if master_data.isStaff:
          if get_user_model().objects.filter(email=master_data.email).exists():
            master.staff = get_user_model().objects.get(email=master_data.email)
            master.is_staff = True
            master.staff_status = 'pending'
          else: 
            master.is_staff = False
            master.staff_status = 'no match'
        
        master.save()

        return AddMaster(master=master)

class UpdateMaster(graphene.Mutation):
    master = graphene.Field(MasterType)

    class Arguments:
      master_id = graphene.Int(required=True)
      master_data = MasterInput(required=True)
    
    @staticmethod
    def mutate(root,info,master_id,master_data):
        user = info.context.user
        master=Master.objects.get(id=master_id)

        if user.is_anonymous:
            raise GraphQLError('Log in to update master.')
        master.master_name = master_data.name.title()
        master.master_email = master_data.email
        master.master_phone = master_data.phone
        master.staff_status = master_data.status  

        if master.staff and master_data.status == 'rejected':
          master.staff = None
          master.is_staff = False
        
        if master.is_staff and (not master_data.isStaff):
          master.staff_status = '' 
          master.staff = None
          master.is_staff = False

        if (not master.is_staff) and master_data.isStaff:
          if get_user_model().objects.filter(email=master_data.email).exists():
            master.is_staff = True
            master.staff = get_user_model().objects.get(email=master_data.email)
            master.staff_status = 'pending'
          else: 
            master.is_staff = False
            master.staff_status = 'no match'
   
        master.save()
        return UpdateMaster(master=master)

# class ConfirmMaster(graphene.Mutation):
#     success = graphene.Boolean()

#     class Arguments:
#       contact_data = ContactInput(required=True)
    
#     @staticmethod
#     def mutate(root,info,contact_data):
#         send_mail(
#           'from {}: from {}'.format(contact_data.email, contact_data.subject),
#           contact_data.message,
#           contact_data.email,
#           ['mirvarim.partner@gmail.com'],
#           fail_silently=False,
#         )

#         return ConfirmMaster(success=True)

class DeleteMaster(graphene.Mutation):
    master = graphene.Field(MasterType)

    class Arguments:
      master_id = graphene.Int(required=True)
    
    @staticmethod
    def mutate(root,info,master_id):
        user = info.context.user
        master = Master.objects.get(id=master_id)

        if user.is_anonymous:
            raise GraphQLError('Log in to delete master.')
                
        master.delete()
        return DeleteMaster(master=master)

class WorkingHourInput(graphene.InputObjectType):
    monday = graphene.List(graphene.String)
    tuesday = graphene.List(graphene.String)
    wednesday = graphene.List(graphene.String)
    thursday = graphene.List(graphene.String)
    friday = graphene.List(graphene.String)
    saturday = graphene.List(graphene.String)
    sunday = graphene.List(graphene.String)

class MasterWorkingHours(graphene.Mutation):
    master = graphene.Field(MasterType)

    class Arguments:
      master_id = graphene.Int(required=True)
      working_hours = WorkingHourInput(required=True)
    
    @staticmethod
    def mutate(root,info,master_id,working_hours):
        user = info.context.user
        master=Master.objects.get(id=master_id)

        if user.is_anonymous:
            raise GraphQLError('Log in to update master.')

        master.monday_hours = [datetime.datetime.strptime(x,'%H:%M').time() for x in working_hours.monday]
        master.tuesday_hours = [datetime.datetime.strptime(x,'%H:%M').time() for x in working_hours.tuesday]
        master.wednesday_hours = [datetime.datetime.strptime(x,'%H:%M').time() for x in working_hours.wednesday]
        master.thursday_hours = [datetime.datetime.strptime(x,'%H:%M').time() for x in working_hours.thursday]
        master.friday_hours = [datetime.datetime.strptime(x,'%H:%M').time() for x in working_hours.friday]
        master.saturday_hours = [datetime.datetime.strptime(x,'%H:%M').time() for x in working_hours.saturday]
        master.sunday_hours = [datetime.datetime.strptime(x,'%H:%M').time() for x in working_hours.sunday]
   
        master.save()
        return MasterWorkingHours(master=master)

class BookingInput(graphene.InputObjectType):
    master_id = graphene.String()
    customer_name = graphene.String()
    customer_email = graphene.String()
    customer_mobile = graphene.String()
    # service_type = graphene.String()
    # service_id = graphene.Int()
    service_title = graphene.String()
    service_price = graphene.Int()
    start = graphene.DateTime()
    duration = graphene.Int()
    isConfirmed = graphene.Boolean()

class CreateBooking(graphene.Mutation):
    booking = graphene.Field(BookingType)

    class Arguments:
      booking_data = BookingInput(required=True)
    
    @staticmethod
    def mutate(root,info,booking_data):
        user = info.context.user

        if user.is_anonymous:
            raise GraphQLError('Log in to add a booking.')

        if is_naive(booking_data.start):
            booking_data.start = make_aware(booking_data.start)
            
        # def service_model(type, service_id):
        #   if type == "HairServiceType":
        #     return ContentType.objects.get_for_model(HairService.objects.get(id=service_id))
        #   if type == "NailsServiceType":
        #     return ContentType.objects.get_for_model(NailsService.objects.get(id=service_id))
          
        master_obj = Master.objects.get(id=int(booking_data.master_id))
            
        booking = Booking.objects.create(
                                      master = master_obj,
                                      customer = user,
                                      customer_name = booking_data.customer_name,
                                      customer_email = booking_data.customer_email,
                                      customer_mobile = booking_data.customer_mobile,
                                      # service_content_type = service_model(booking_data.service_type, booking_data.service_id),
                                      # service_object_id = booking_data.service_id,
                                      service_title = booking_data.service_title,
                                      service_price = booking_data.service_price,
                                      start = booking_data.start,
                                      end = booking_data.start + datetime.timedelta(minutes=booking_data.duration),
                                      is_confirmed = booking_data.isConfirmed
                                      )

        return CreateBooking(booking=booking)

class UpdateBooking(graphene.Mutation):
    booking = graphene.Field(BookingType)

    class Arguments:
      booking_id = graphene.Int(required=True)
      booking_data = BookingInput(required=True)
    
    @staticmethod
    def mutate(root,info,booking_id,booking_data):
        user = info.context.user
        booking=Booking.objects.get(id=booking_id)

        if user.is_anonymous:
            raise GraphQLError('Log in to update booking.')

        if is_naive(booking_data.start):
            booking_data.start = make_aware(booking_data.start)
                        
        # duration = booking.end - booking.start
        booking.customer_name = booking_data.customer_name
        booking.customer_mobile = booking_data.customer_mobile
        booking.start = booking_data.start     
        booking.end = booking_data.start + datetime.timedelta(minutes=booking_data.duration)
        
        if booking_data.isConfirmed:
          booking.is_confirmed = True
          
        booking.save()
        return UpdateBooking(booking=booking)

class DeleteBooking(graphene.Mutation):
    booking = graphene.Field(BookingType)

    class Arguments:
      booking_id = graphene.Int(required=True)
    
    @staticmethod
    def mutate(root,info,booking_id):
        user = info.context.user
        booking=Booking.objects.get(id=booking_id)

        if user.is_anonymous:
            raise GraphQLError('Log in to delete booking.')
                
        booking.delete()
        return DeleteBooking(booking=booking)

class UploadFile(graphene.Mutation):
    class Arguments:
        file = Upload(required=True)

    success = graphene.Boolean()
    url = graphene.String()
    # filedata = graphene.List(graphene.String)

    def mutate(self, info, file, **kwargs):
        # # do something with your file
        # upl_date = datetime.datetime.now()
        # upl_url = 'media/photos/'+ upl_date.strftime('%Y/%m/%d/')
        # fs = FileSystemStorage(location = upl_url)
        # filename = fs.save(file.name, file)
        # # open saved img and resize it before passing to createSalon
        # img = Image.open(upl_url+filename)
        # # img = resizeimage.resize_contain(img, [600, 400])
        # resized_img = img.resize((512,288)) # aspect ratio 16:9
        # image_file = BytesIO()
        # # resized_img.save(upl_url+filename)
        # resized_img.save(image_file, format='JPEG', quality=90)
        # image_file.seek(0)
        # img_url = 'photos/'+ upl_date.strftime('%Y/%m/%d/') + filename
        # #new addition
        # s3_storage = PublicMediaStorage()
        # s3_storage.save(img_url, image_file)


        # do something with your file
        upl_date = datetime.datetime.now()
        filename, ext = os.path.splitext(file.name)
        upl_url = 'test/photos/'+ upl_date.strftime('%Y/%m/%d/') + filename + ext
        s3_storage = PublicMediaStorage()
        # ensure the path is unique
        while s3_storage.exists(upl_url):
          filename = filename + '01'
          upl_url = 'test/photos/'+ upl_date.strftime('%Y/%m/%d/') + filename + ext
        # save the file to s3 and get url
        s3_storage.save(upl_url, file)
        file_url = s3_storage.url(upl_url)
        response = requests.get(file_url)  

        # open saved img and resize it before passing to createSalon
        img = Image.open(BytesIO(response.content))
        # check exif orientation and rotate ifnecessary
        try: 
          for orientation in ExifTags.TAGS.keys():
            if ExifTags.TAGS[orientation] == 'Orientation':
              break
          exif = dict(img._getexif().items())
          if exif[orientation] == 3:
            img = img.rotate(180, expand=True)
          elif exif[orientation] == 6:
            img = img.rotate(270, expand=True)
          elif exif[orientation] == 8:
            img = img.rotate(90, expand=True)
        except (AttributeError, KeyError, IndexError):
          # cases: image don't have getexif
          pass

        # crop image in 16:9 (~1.7) aspect ratio  
        w,h=img.size 
        left = (w-h*1.7)/2
        right = (w-h*1.7)/2+h*1.7
        top = (h-w/1.7)/2 
        bottom = (h-w/1.7)/2+w/1.7
        if w/h > 1.7: 
          cropped_img = img.crop((left,0,right,h)) 
        else: 
          cropped_img = img.crop((0,top,w,bottom)) 
        resized_img = cropped_img.resize((512,288)) # aspect ratio 16:9
        image_file = BytesIO()
        # resized_img.save(upl_url+filename)
        resized_img.save(image_file, format='JPEG', quality=180)
        image_file.seek(0)
        img_url = 'photos/'+ upl_date.strftime('%Y/%m/%d/') + filename + ext
        #new addition - upload to s3
        s3_storage.save(img_url, image_file)


        return UploadFile(url=img_url, success=True)
    
class SalonMutation(graphene.ObjectType):
    create_salon = CreateSalon.Field() 
    update_salon = UpdateSalon.Field() 
    create_booking = CreateBooking.Field()
    update_booking = UpdateBooking.Field()
    delete_booking = DeleteBooking.Field()
    add_master = AddMaster.Field()
    update_master = UpdateMaster.Field()
    delete_master = DeleteMaster.Field()
    master_working_hours = MasterWorkingHours.Field()
    upload_img = UploadFile.Field()

    
    

        




        





