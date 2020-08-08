
# from django import forms
# from .models import Salon, Hair, Nails, HairRemoval, Makeup, Massage, City, Area, PRICE_CHOICES, RATING_CHOICES

# class HairForm(forms.ModelForm):
#     class Meta:
#         model = Salon
#         fields = ('hair_categories',)
   
#     hair_categories = forms.ModelMultipleChoiceField(
#         widget=forms.CheckboxSelectMultiple,
#         queryset = Hair.objects.all(),
#         required=False) 
 
# class NailsForm(forms.ModelForm):
#     class Meta:
#         model = Salon
#         fields = ('nails_categories',)
   
#     nails_categories = forms.ModelMultipleChoiceField(
#         widget=forms.CheckboxSelectMultiple,
#         queryset = Nails.objects.all(),
#         required=False)

# class HairRemovalForm(forms.ModelForm):
#     class Meta:
#         model = Salon
#         fields = ('hair_removal_categories',)
   
#     hair_removal_categories = forms.ModelMultipleChoiceField(
#         widget=forms.CheckboxSelectMultiple,
#         queryset = HairRemoval.objects.all(),
#         required=False)

# class MakeupForm(forms.ModelForm):
#     class Meta:
#         model = Salon
#         fields = ('makeup_categories',)
   
#     makeup_categories = forms.ModelMultipleChoiceField(
#         widget=forms.CheckboxSelectMultiple,
#         queryset = Makeup.objects.all(),
#         required=False)


# class MassageForm(forms.ModelForm):
#     class Meta:
#         model = Salon
#         fields = ['massage_categories',]

#     massage_categories = forms.ModelMultipleChoiceField(
#         widget=forms.CheckboxSelectMultiple,
#         queryset = Massage.objects.order_by('-title'),
#         required=False)


# class SalonFilterForm(forms.Form):
#     city = forms.ModelChoiceField(
#         label=("City"),
#         required=False,
#         queryset=City.objects.all())
#     area = forms.ModelChoiceField(
#         label=("Area"),
#         required=False,
#         queryset=Area.objects.all())
#     hair = forms.ModelChoiceField(
#         label=("Hair"),
#         required=False,
#         queryset=Hair.objects.all())
#     nails = forms.ModelChoiceField(
#         label=("Nails"),
#         required=False,
#         queryset=Nails.objects.all())
#     hair_removal = forms.ModelChoiceField(
#         label=("Hair Removal"),
#         required=False,
#         queryset=HairRemoval.objects.all())
#     makeup = forms.ModelChoiceField(
#         label=("Makeup"),
#         required=False,
#         queryset=Makeup.objects.all())
#     massage = forms.ModelChoiceField(
#         label=("Massage"),
#         required=False,
#         queryset=Massage.objects.all())
#     price = forms.ChoiceField(
#         label=("Price"),
#         required=False,
#         choices=PRICE_CHOICES)
#     rating = forms.ChoiceField(
#         label=("Rating"),
#         required=False,
#         choices=RATING_CHOICES)
    
    



# '''
# class CategoryForm(forms.ModelForm):

#     class Meta:
#         model = Category
#         fields = ('option',)
    
#     option = forms.MultipleChoiceField(choices=CATEGORY_CHOICES,
#     widget=forms.CheckboxSelectMultiple, required=False)

#     def clean_option(self):
        
#         if not self.is_valid():
#             raise forms.ValidationError("...")

#         option = self.cleaned_data['option']
#         return ', '.join([val for val in option])   
#     '''

    