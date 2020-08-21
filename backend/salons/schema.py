import graphene
from graphene_django import DjangoObjectType
from graphql import GraphQLError
from django.db.models import Q
from graphene_file_upload.scalars import Upload
from django.core.files.storage import FileSystemStorage
from mirvarix.storage_backends import PublicMediaStorage
from PIL import Image
from io import BytesIO
from resizeimage import resizeimage
import datetime
import requests
import os

from .models import Salon, Hair, Nails, HairRemoval, Makeup, Massage, City, Area

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


#Query definition
class Query(graphene.ObjectType):
    salons = graphene.List(SalonType, search=graphene.String())
    salons_filtered = graphene.List(SalonType, 
                                    area=graphene.List(graphene.String),
                                    hair=graphene.List(graphene.String),
                                    nails=graphene.List(graphene.String),
                                    massage=graphene.List(graphene.String))
    salon_selected = graphene.List(SalonType, id=graphene.Int(required=True))
    hair_cat = graphene.List(HairType)
    nails_cat = graphene.List(NailsType)
    hair_removal_cat = graphene.List(HairRemovalType)
    makeup_cat = graphene.List(MakeupType)
    massage_cat = graphene.List(MassageType)
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
                Q(massage_categories__title__icontains=search)   
            )
            return Salon.objects.filter(filter).distinct()
              
        return Salon.objects.all()
    
    def resolve_salons_filtered(self, info, area=[], hair=[], nails=[], massage=[]):

        if area and (not hair) and (not nails) and (not massage):
            return Salon.objects.filter(area__title__in=area).distinct()
        
        if area and (hair or nails or massage):
            return Salon.objects.filter(Q(area__title__in=area) &
                                        (Q(hair_categories__title__in=hair) |
                                        Q(nails_categories__title__in=nails)|
                                        Q(massage_categories__title__in=massage))
                                        ).distinct()
        
        if not area and (hair or nails or massage):
            return Salon.objects.filter(Q(hair_categories__title__in=hair) |
                                        Q(nails_categories__title__in=nails)|
                                        Q(massage_categories__title__in=massage)
                                        ).distinct()
        
        return Salon.objects.all()
    

    def resolve_salon_selected(self, info, id):
        return Salon.objects.filter(id=id)

        # if area and (not haircut) and (not nails):
        #     return Salon.objects.filter(area__title__in=area).distinct()

                                         
        # if (not area) and (haircut) and (not nails):
        #     return Salon.objects.filter(area__title__in=area).distinct()

                                         
        # if area and (not haircut) and (not nails):
        #     return Salon.objects.filter(area__title__in=area).distinct()

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
    price_range = graphene.Int()
    masters =   graphene.Int()
    hair_categories = graphene.List(graphene.String)
    nails_categories = graphene.List(graphene.String)
    hair_removal_categories = graphene.List(graphene.String)
    makeup_categories = graphene.List(graphene.String)
    massage_categories = graphene.List(graphene.String)
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
            raise GraphQLError('Log in to add a track.')
      
        city_id = salon_data.city_id,
        area_id = salon_data.area_id,    
        hair_categories = salon_data.hair_categories,
        nails_categories = salon_data.nails_categories,
        hair_removal_categories = salon_data.hair_removal_categories,
        makeup_categories = salon_data.makeup_categories,
        massage_categories = salon_data.massage_categories,
        male = salon_data.male,
        female = salon_data.female,
        email = salon_data.email,
        phone = salon_data.phone,
        photo_main = salon_data.photo_main,
        photo_1 = salon_data.photo_1,
        photo_2 = salon_data.photo_2,
        photo_3 = salon_data.photo_3,
        photo_4 = salon_data.photo_4,
        photo_5 = salon_data.photo_5,
        photo_6 = salon_data.photo_6

        # city_title = "city1"
        city_obj = City.objects.get(id=city_id[0])
        area_obj = Area.objects.get(id=area_id[0])  
         
        
        salon = Salon.objects.create(
                                      created_by = user,
                                      name = salon_data.name,
                                      address = salon_data.address,
                                      city = city_obj,
                                      area = area_obj,
                                      description = salon_data.description,
                                      price_range = salon_data.price_range,
                                      masters = salon_data.masters,
                                      # hair_categories = salon_data.hair_categories,
                                      # nails_categories = salon_data.nails_categories,
                                      # hair_removal_categories = salon_data.hair_removal_categories,
                                      # makeup_categories = salon_data.makeup_categories,
                                      # massage_categories = salon_data.massage_categories,
                                      male = salon_data.male,
                                      female = salon_data.female,
                                      email = salon_data.email,
                                      phone = salon_data.phone,
                                      photo_main = salon_data.photo_main,
                                      photo_1 = salon_data.photo_1,
                                      photo_2 = salon_data.photo_2,
                                      photo_3 = salon_data.photo_3,
                                      photo_4 = salon_data.photo_4,
                                      photo_5 = salon_data.photo_5,
                                      photo_6 = salon_data.photo_6
                                      )
        if hair_categories[0]:
          for id in hair_categories[0]:
            salon.hair_categories.add(Hair.objects.get(id=id))

        if nails_categories[0]:
          for id in nails_categories[0]:
            salon.nails_categories.add(Nails.objects.get(id=id))
   
        return CreateSalon(salon=salon)


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
        resized_img = img.resize((512,288)) # aspect ratio 16:9
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
    upload_img = UploadFile.Field()

    
    

        




        





