from django.views.generic import TemplateView
# from django.apps import apps

# Salon = apps.get_model('salons', 'Salon')

from salons.models import Salon 


class HomePageView(TemplateView):

    # contex for ListView        
    # model = Salon
    # context_object_name = 'salon_list'
    template_name = 'pages/index.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['salons'] = Salon.objects.order_by('-list_date').filter()[:3]
        return context


class AboutPageView(TemplateView): 
    template_name = 'pages/about.html'