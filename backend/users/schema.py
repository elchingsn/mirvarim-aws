from django.contrib.auth import get_user_model

import graphene
from graphene_django import DjangoObjectType

from graphql_auth import mutations


class UserType(DjangoObjectType):
    class Meta:
        model = get_user_model()
        convert_choices_to_enum = False


# class Query(graphene.ObjectType):
#     user = graphene.Field(UserType, id=graphene.Int(required=True))
#     me = graphene.Field(UserType)

#     def resolve_user(self, info, id):
#         return get_user_model().objects.get(id=id)

#     def resolve_me(self, info):
#         user = info.context.user
#         if not user.is_authenticated:
#             raise Exception('Authentication credentials were not provided')
#         return user


# class CreateUser(graphene.Mutation):
#     user = graphene.Field(UserType)

#     class Arguments:
#         username = graphene.String(required=True)
#         password = graphene.String(required=True)
#         email = graphene.String(required=True)

#     def mutate(self, info, username, password, email):
#         user = get_user_model()(
#             username=username,
#             email=email
#         )
#         user.set_password(password)
#         user.save()
#         return CreateUser(user=user)


# class Mutation(graphene.ObjectType):
#     create_user = CreateUser.Field()

class AuthMutation(graphene.ObjectType):
    register = mutations.Register.Field()
    verify_account = mutations.VerifyAccount.Field()
    resend_activation_email = mutations.ResendActivationEmail.Field()
    send_password_reset_email = mutations.SendPasswordResetEmail.Field()
    password_reset = mutations.PasswordReset.Field()
    password_change = mutations.PasswordChange.Field()
    update_account = mutations.UpdateAccount.Field()
    archive_account = mutations.ArchiveAccount.Field()
    delete_account = mutations.DeleteAccount.Field()
    send_secondary_email_activation =  mutations.SendSecondaryEmailActivation.Field()
    verify_secondary_email = mutations.VerifySecondaryEmail.Field()
    swap_emails = mutations.SwapEmails.Field()
    remove_secondary_email = mutations.RemoveSecondaryEmail.Field()

    # django-graphql-jwt inheritances
    token_auth = mutations.ObtainJSONWebToken.Field()
    verify_token = mutations.VerifyToken.Field()
    refresh_token = mutations.RefreshToken.Field()
    revoke_token = mutations.RevokeToken.Field()
