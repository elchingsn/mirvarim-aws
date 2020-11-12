"""mirvarix URL Configuration
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from graphene_django.views import GraphQLView
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView

from graphene_file_upload.django import FileUploadGraphQLView

urlpatterns = [
    # Django admin
    path('admin/', admin.site.urls),
    
    # User management 
    # path('accounts/',include('django.contrib.auth.urls')),

    # apiclient on client-side will request this adress later
    # path("graphql/", csrf_exempt(GraphQLView.as_view(graphiql=True))),

    path("graphql/", csrf_exempt(FileUploadGraphQLView.as_view(graphiql=False))),

    # (it points to ~/templates/index.html)
    # (currently there is no file, webpack production bundle will come here )
    # path("", TemplateView.as_view(template_name="index.html")),

    # local apps
    # path('', include('pages.urls')),
    # path('salons/', include('salons.urls')),
    # path('accounts/', include('users.urls')),

] 

if settings.DEBUG:
  urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)

