import graphene
from graphene_django import DjangoObjectType
from graphql import GraphQLError
from .models import Balance, Transaction

class BalanceType(DjangoObjectType): 
  class Meta:
      model = Balance


class TransactionType(DjangoObjectType): 
  class Meta:
      model = Transaction

class Query(graphene.ObjectType):
  balances = graphene.List(BalanceType, id=graphene.String())
  transactions = graphene.List(TransactionType, id=graphene.String())

  def resolve_balances(self, info, id=None):
    if id:
      return Balance.objects.filter(id=int(id))
  
    return Balance.objects.all()
  
  def resolve_transactions(self, info, id=None):
    if id:
      return Transaction.objects.filter(id=int(id))
  
    return Transaction.objects.all()





