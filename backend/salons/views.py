from django.views.generic import ListView, DetailView, View
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.shortcuts import redirect, render
from django.http import JsonResponse

from .models import Salon, Hair, Nails, HairRemoval, Makeup, Massage, City, Area, PRICE_CHOICES, RATING_CHOICES
from .forms import SalonFilterForm, MassageForm
PAGE_SIZE = 10

'''
class SalonListView(ListView):
    model = Salon
    template_name = 'salons/salon_list.html'
    context_object_name = 'salon_list'
    ordering = ['-list_date']
    paginate_by = 2 
'''

class SalonListView(View):
    form_class = SalonFilterForm
    template_name = 'salons/salon_list.html'

    def get(self, request, *args, **kwargs):
        form = self.form_class(request.GET)
        qs, facets = self.get_queryset_and_facets(request, form)
        page = self.get_page(request, qs)
        context = {
            "req": request.GET.getlist('city'),
            "form": form,
            "facets": facets,
            "salon_list": page,
        }
        return render(request, self.template_name, context)


    def get_queryset_and_facets(self, request, form):
        qs = Salon.objects.order_by("list_date")
        facets = {
            "selected": {},
            "categories": {
                "city": City.objects.all(),
                "area": Area.objects.all(),
                "hair": Hair.objects.all(),
                "nails": Nails.objects.all(),
                "hair_removal": HairRemoval.objects.all(),
                "makeup": Makeup.objects.all(),
                "massage": Massage.objects.all(),
                "price": PRICE_CHOICES,
                "rating": RATING_CHOICES,
            },
        }
        if form.is_valid():
            
            filters = (
                ("city", "city",),
                ("area", "area",),
                ("hair", "hair_categories",),
                ("nails", "nails_categories",),
                ("hair_removal", "hair_removal_categories",),
                ("makeup", "makeup_categories",),
                ("massage", "massage_categories",),
                ("price", "price_range",),
                ("rating", "rating",),
            )
            qs = self.filter_facets(request, facets, qs, form, filters)
        return qs, facets

    @staticmethod
    def filter_facets(request, facets, qs, form, filters):
        for facet, key in filters:
            #value = form.cleaned_data[facet]
            if key in request.GET:
                values = []
                for v in request.GET.getlist(key):
                    if v not in values:
                        values.append(v)
                for value in values:
                    if value:
                        selected_value = value
                        
                        if facet == "price":
                            price = int(value)
                            selected_value = (price,
                                            dict(PRICE_CHOICES)[price])
                        
                        if facet == "rating":
                            rating = int(value)
                            selected_value = (rating,
                                            dict(RATING_CHOICES)[rating])
                        
                        facets["selected"][facet] = selected_value
                        filter_args = {key: value}
                        qs = qs.filter(**filter_args).distinct()
        return qs


    def get_page(self, request, qs):
        paginator = Paginator(qs, PAGE_SIZE)
        page_number = request.GET.get("page")
        try:
            page = paginator.page(page_number)
        except PageNotAnInteger:
            page = paginator.page(1)
        except EmptyPage:
            page = paginator.page(paginator.num_pages)
        return page

    '''
    def filter(request):
        data = {"req": request.GET}
        return JsonResponse(data)
    '''

    '''
    def save_forms(request):

        if request.method == "POST":
            form = MassageForm(request.POST)
            if form.is_valid():
                form.save(commit=False)
                #massage_categories = form.cleaned_data['massage_categories']
                #context = {'form':form, 'massage_categories':massage_categories}
                form.save()
                form.save_m2m()
                
        return redirect(form)
    '''
    """
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs) 
        salon_list = Salon.objects.order_by('-list_date').filter(is_published=True)
        paginator = Paginator(salon_list, 3)

        page = self.request.GET.get('page')

        try:
        paged_listings = paginator.page(page)
        except PageNotAnInteger:
           paged_listings = paginator.page(1)
        except EmptyPage:
           paged_listings = paginator.page(paginator.num_pages)

        context['salon_list'] = paged_listings
        return context
    """
    
class SalonDetailView(DetailView):
    model = Salon
    context_object_name = 'salon'
    template_name = 'salons/salon_detail.html'

'''
def multiChoice_category(request):

    if request.method == "POST":
        form = CategoryForm(request.POST)
        if form.is_valid():
            form.save(commit=False)
            option = form.clean_option()
            context = {'form':form, 'option':option}
    
     
    return redirect(form, context)
       
'''


