"""
Django settings for mirvarix project.
Generated by 'django-admin startproject' using Django 2.2.6.
For more information on this file, see
https://docs.djangoproject.com/en/2.2/topics/settings/
For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.2/ref/settings/
"""

import os
from datetime import timedelta
from decouple import config
import requests



# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
# SECRET_KEY = config('SECRET_KEY')
SECRET_KEY = os.environ.get("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = int(os.environ.get("DEBUG", default=0))

ALLOWED_HOSTS = ['*']
# ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS").split(",")
# ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0']

# EC2_PRIVATE_IP = None
# METADATA_URI = os.environ.get('ECS_CONTAINER_METADATA_URI', 'http://169.254.170.2/v2/metadata')

# try:
#     resp = requests.get(METADATA_URI)
#     data = resp.json()
#     # print(data)

#     container_meta = data['Containers'][0]
#     EC2_PRIVATE_IP = container_meta['Networks'][0]['IPv4Addresses'][0]
# except:
#     # silently fail as we may not be in an ECS environment
#     pass

# if EC2_PRIVATE_IP:
#     # Be sure your ALLOWED_HOSTS is a list NOT a tuple
#     # or .append() will fail
#     ALLOWED_HOSTS.append(EC2_PRIVATE_IP)

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # 'django.contrib.sites', #allauth


    #local
    # 'users.apps.UsersConfig',
    'salons.apps.SalonsConfig',
    # 'pages.apps.PagesConfig',
    'services.apps.ServicesConfig',
    # 'utils',
    'users',
    'reviews',

    # 3rd party
    'django_extensions',
    'graphene_django',
    'corsheaders',
    'crispy_forms',
    'graphql_auth',
    'django.contrib.humanize',
    'django.forms',
    # aws s3
    'storages',

    # refresh tokens are optional
    'graphql_jwt.refresh_token.apps.RefreshTokenConfig',

    # #allauth
    # 'allauth',
    # 'allauth.account',
    # 'allauth.socialaccount',
    # #providers
    # 'allauth.socialaccount.providers.facebook',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware', # new 
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',

]

# allow webpack development server to make cross-request
CORS_ORIGIN_WHITELIST = (
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://0.0.0.0:3000'
)

CORS_ALLOW_HEADERS = [
    'accept',
    'credentials',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
    'X-CSRFTOKEN',
]

CORS_ALLOW_CREDENTIALS = True

# SESSION_COOKIE_SAMESITE = None
# CSRF_COOKIE_SAMESITE = None

# CSRF_USE_SESSIONS = True

# CSRF_COOKIE_SECURE = False
# SESSION_COOKIE_SECURE = False
# CSRF_COOKIE_NAME = "csrftoken"

GRAPHENE = {
    'SCHEMA': 'graphql_api.schema.schema',
    'MIDDLEWARE': [
        'graphql_jwt.middleware.JSONWebTokenMiddleware',
    ],
}

AUTHENTICATION_BACKENDS = [
    'graphql_jwt.backends.JSONWebTokenBackend',
    # optional 
    # 'graphql_auth.backends.GraphQLAuthBackend',
    'django.contrib.auth.backends.ModelBackend',

    # # `allauth` specific authentication methods, such as login by e-mail
    # 'allauth.account.auth_backends.AuthenticationBackend',
]

AUTH_USER_MODEL = 'users.CustomUser'

GRAPHQL_JWT = {
    "JWT_VERIFY_EXPIRATION": True,
    'JWT_LONG_RUNNING_REFRESH_TOKEN': True,
    'JWT_EXPIRATION_DELTA': timedelta(minutes=60),
    'JWT_REFRESH_EXPIRATION_DELTA': timedelta(days=7),

    "JWT_ALLOW_ANY_CLASSES": [
        "graphql_auth.mutations.Register",
        "graphql_auth.mutations.VerifyAccount",
        "graphql_auth.mutations.ResendActivationEmail",
        "graphql_auth.mutations.SendPasswordResetEmail",
        "graphql_auth.mutations.PasswordReset",
        "graphql_auth.mutations.ObtainJSONWebToken",
        "graphql_auth.mutations.VerifyToken",
        "graphql_auth.mutations.RefreshToken",
        "graphql_auth.mutations.RevokeToken",
        "graphql_auth.mutations.VerifySecondaryEmail",
    ],

    # optional
    # "JWT_LONG_RUNNING_REFRESH_TOKEN": True,
}

# for production 
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_USE_TLS = True  # TLS and SSL are mutually exclusive
EMAIL_PORT = 587
EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD")
ROOT_URLCONF = 'mirvarix.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR,'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                 'django.template.context_processors.media', # access media url
            ],
        },
    },
]

WSGI_APPLICATION = 'mirvarix.wsgi.application'


# Database
# https://docs.djangoproject.com/en/2.2/ref/settings/#databases


DATABASES = {
    "default": {
        "ENGINE": os.environ.get("SQL_ENGINE"),
        "NAME": os.environ.get("SQL_DATABASE"),
        "USER": os.environ.get("SQL_USER"),
        "PASSWORD": os.environ.get("SQL_PASSWORD"),
        "HOST": os.environ.get("SQL_HOST"),
        "PORT": os.environ.get("SQL_PORT"),
    }
}


# Password validation
# https://docs.djangoproject.com/en/2.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# SITE_ID = 1 #allauth

# Internationalization
# https://docs.djangoproject.com/en/2.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

USE_S3 = os.getenv('USE_S3') == 'TRUE'

if USE_S3:
  # AWS settings
  AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
  AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")
  AWS_STORAGE_BUCKET_NAME = os.environ.get("AWS_STORAGE_BUCKET_NAME")
  AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'
  AWS_S3_OBJECT_PARAMETERS = {'CacheControl': 'max-age=86400'}
  AWS_DEFAULT_ACL = None
  # s3 static settings
  STATIC_LOCATION = 'static'
  STATIC_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/{STATIC_LOCATION}/'
  STATICFILES_STORAGE = 'mirvarix.storage_backends.StaticStorage'
  # s3 public media settings
  PUBLIC_MEDIA_LOCATION = 'media'
  MEDIA_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/{PUBLIC_MEDIA_LOCATION}/'
  DEFAULT_FILE_STORAGE = 'mirvarix.storage_backends.PublicMediaStorage'
else:
  MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
  MEDIA_URL = '/media/'
  STATIC_ROOT = os.path.join(BASE_DIR, 'static')
  STATIC_URL = '/static/'

STATICFILES_DIRS = [os.path.join(BASE_DIR, 'mirvarix/static')]

# AUTH_USER_MODEL = 'users.CustomUser'

# Media folder settings

# login and logout directions

# LOGIN_REDIRECT_URL = 'index'
# LOGOUT_REDIRECT_URL = 'index'

#django-crispy-forms

CRISPY_TEMPLATE_PACK = 'bootstrap4'

# for improved interactive shell
# add this
SHELL_PLUS = "ipython"

## Logging configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': os.path.join(BASE_DIR, 'debug.log'),
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}

#local settings
#try:
#    from .local_settings import *
#except ImportError:
#    pass