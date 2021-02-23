import graphene
import graphql_jwt
import salons.schema
import users.schema
import reviews.schema
import services.schema
import transactions.schema
from graphql_auth.schema import UserQuery, MeQuery


# class Query(salons.schema.Query, users.schema.Query, graphene.ObjectType):
#     pass

class Query(UserQuery, MeQuery, salons.schema.Query, reviews.schema.Query, services.schema.Query,transactions.schema.Query, graphene.ObjectType):
    pass


# class Mutation(users.schema.Mutation, graphene.ObjectType):
#     token_auth = graphql_jwt.ObtainJSONWebToken.Field()
#     verify_token = graphql_jwt.Verify.Field()
#     refresh_token = graphql_jwt.Refresh.Field()

class Mutation(users.schema.AuthMutation, salons.schema.SalonMutation, reviews.schema.ReviewMutation, services.schema.ServiceMutation, graphene.ObjectType):
    pass

schema = graphene.Schema(query=Query, mutation=Mutation)