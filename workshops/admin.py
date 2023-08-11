from django.contrib import admin
from .models import Event, EventType

class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'started_at', 'ended_at', 'participants', 'capacity')

class EventTypeAdmin(admin.ModelAdmin):
    list_display = ('type', 'event_id')

admin.site.register(Event, EventAdmin)
admin.site.register(EventType, EventTypeAdmin)