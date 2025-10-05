from django.contrib import admin
from .models import *


# Register your models here.
admin.site.site_header = 'Vitalink Admin'                    # default: "Django Administration"
admin.site.index_title = 'Monitor Prev Data'                 # default: "Site administration"
admin.site.site_title = 'Vitalink history data monitor'                  # default: "Django site admin"

admin.site.register(Config)

@admin.register(VitalinkRecord)
class VitalinkRecordAdmin(admin.ModelAdmin):
    def get_list_display(self, request):
        return ["timestamp", "age", "gender", "temp", "spo2", "bpm", "sbp", "dbp"]