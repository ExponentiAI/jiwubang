from django.contrib import admin

# Register your models here.
# Register your models here.
from medical_resources.models import MedicalSuppliesType, UserInfo, MedicalSupplies

admin.site.register([MedicalSuppliesType, MedicalSupplies, UserInfo])
