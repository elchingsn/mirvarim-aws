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

from .models import Salon, Hair, Nails, HairRemoval, Makeup, Massage, Eyebrow, Cosmetology, Tattoo, Aesthetics, City, Area

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


#Query definition
class Query(graphene.ObjectType):
    salons = graphene.List(SalonType, search=graphene.String())
    salons_filtered = graphene.List(SalonType, 
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
    
    def resolve_salons_filtered(self, info, area=[], hair=[], nails=[], hairRemoval=[], makeup=[], massage=[],
                                eyebrow=[], cosmetology=[], tattoo=[], aesthetics=[]):

        if area and (not (hair or nails or hairRemoval or makeup or massage or eyebrow or cosmetology or tattoo or aesthetics)):
            return Salon.objects.filter(area__title__in=area).distinct()
        
        if area and (hair or nails or hairRemoval or makeup or massage or eyebrow or cosmetology or tattoo or aesthetics):
            return Salon.objects.filter(Q(area__title__in=area) &
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
            return Salon.objects.filter(Q(hair_categories__title__in=hair) |
                                        Q(nails_categories__title__in=nails)|
                                        Q(hair_removal_categories__title__in=hairRemoval)|
                                        Q(makeup_categories__title__in=makeup)|
                                        Q(massage_categories__title__in=massage)|
                                        Q(eyebrow_categories__title__in=eyebrow)|
                                        Q(cosmetology_categories__title__in=cosmetology)|
                                        Q(tattoo_categories__title__in=tattoo)|
                                        Q(aesthetics_categories__title__in=aesthetics)).distinct()
        
        return Salon.objects.all()
    

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
    price_range = graphene.Int()
    masters =   graphene.Int()
    hair_categories = graphene.List(graphene.String)
    nails_categories = graphene.List(graphene.String)
    hair_removal_categories = graphene.List(graphene.String)
    makeup_categories = graphene.List(graphene.String)
    massage_categories = graphene.List(graphene.String)
    eyebrow_categories = graphene.List(graphene.String)
    cosmetology_categories = graphene.List(graphene.String)
    tattoo_categories = graphene.List(graphene.String)
    aesthetics_categories = graphene.List(graphene.String)
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
        eyebrow_categories = salon_data.eyebrow_categories,
        cosmetology_categories = salon_data.cosmetology_categories,
        tattoo_categories = salon_data.tattoo_categories,
        aesthetics_categories = salon_data.aesthetics_categories,
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

        if hair_removal_categories[0]:
          for id in hair_removal_categories[0]:
            salon.hair_removal_categories.add(HairRemoval.objects.get(id=id))

        if makeup_categories[0]:
          for id in makeup_categories[0]:
            salon.makeup_categories.add(Makeup.objects.get(id=id))

        if massage_categories[0]:
          for id in massage_categories[0]:
            salon.massage_categories.add(Massage.objects.get(id=id))

        if eyebrow_categories[0]:
          for id in eyebrow_categories[0]:
            salon.eyebrow_categories.add(Eyebrow.objects.get(id=id))

        if cosmetology_categories[0]:
          for id in cosmetology_categories[0]:
            salon.cosmetology_categories.add(Cosmetology.objects.get(id=id))

        if tattoo_categories[0]:
          for id in tattoo_categories[0]:
            salon.tattoo_categories.add(Tattoo.objects.get(id=id))

        if aesthetics_categories[0]:
          for id in aesthetics_categories[0]:
            salon.aesthetics_categories.add(Aesthetics.objects.get(id=id))

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
      
        city_id = salon_data.city_id,
        area_id = salon_data.area_id,    
        hair_categories = salon_data.hair_categories,
        nails_categories = salon_data.nails_categories,
        hair_removal_categories = salon_data.hair_removal_categories,
        makeup_categories = salon_data.makeup_categories,
        massage_categories = salon_data.massage_categories,
        eyebrow_categories = salon_data.eyebrow_categories,
        cosmetology_categories = salon_data.cosmetology_categories,
        tattoo_categories = salon_data.tattoo_categories,
        aesthetics_categories = salon_data.aesthetics_categories,
        # id is passed from frontend, salon model however requires relevant objects
        city_obj = City.objects.get(id=city_id[0])
        area_obj = Area.objects.get(id=area_id[0])  
       
        salon.name = salon_data.name
        salon.address = salon_data.address
        salon.city = city_obj
        salon.area = area_obj
        salon.description = salon_data.description
        salon.price_range = salon_data.price_range
        salon.masters = salon_data.masters
        salon.male = salon_data.male
        salon.female = salon_data.female
        salon.email = salon_data.email
        salon.phone = salon_data.phone
        salon.photo_main = salon_data.photo_main
        salon.photo_1 = salon_data.photo_1
        salon.photo_2 = salon_data.photo_2
        salon.photo_3 = salon_data.photo_3
        salon.photo_4 = salon_data.photo_4
        salon.photo_5 = salon_data.photo_5
        salon.photo_6 = salon_data.photo_6
        
        if hair_categories[0]:
          salon.hair_categories.clear()
          for id in hair_categories[0]:
            salon.hair_categories.add(Hair.objects.get(id=id))

        if nails_categories[0]:
          salon.nails_categories.clear()
          for id in nails_categories[0]:
            salon.nails_categories.add(Nails.objects.get(id=id))

        if hair_removal_categories[0]:
          salon.hair_removal_categories.clear()
          for id in hair_removal_categories[0]:
            salon.hair_removal_categories.add(HairRemoval.objects.get(id=id))

        if makeup_categories[0]:
          salon.makeup_categories.clear()
          for id in makeup_categories[0]:
            salon.makeup_categories.add(Makeup.objects.get(id=id))
        
        salon.massage_categories.clear()
        if massage_categories[0]:
          for id in massage_categories[0]:
            salon.massage_categories.add(Massage.objects.get(id=id))

        if eyebrow_categories[0]:
          salon.eyebrow_categories.clear()
          for id in eyebrow_categories[0]:
            salon.eyebrow_categories.add(Eyebrow.objects.get(id=id))

        if cosmetology_categories[0]:
          salon.cosmetology_categories.clear()
          for id in cosmetology_categories[0]:
            salon.cosmetology_categories.add(Cosmetology.objects.get(id=id))

        if tattoo_categories[0]:
          salon.tattoo_categories.clear()
          for id in tattoo_categories[0]:
            salon.tattoo_categories.add(Tattoo.objects.get(id=id))

        if aesthetics_categories[0]:
          salon.aesthetics_categories.clear()
          for id in aesthetics_categories[0]:
            salon.aesthetics_categories.add(Aesthetics.objects.get(id=id))

        salon.save()
        
        return UpdateSalon(salon=salon)


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
    update_salon = UpdateSalon.Field() 
    upload_img = UploadFile.Field()

    
    

        




        





