from django.contrib import admin
from .models import Event, RegisterEvent

class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'location', 'capacity', 'price', 'start_event_at', 'end_event_at')
    list_filter = ('start_event_at', 'end_event_at')
    search_fields = ('title', 'description', 'location')
    ordering = ('start_event_at',)

    fieldsets = (
        (None, {'fields': ('title', 'slug', 'description', 'location', 'capacity', 'price', 'image')}),
        ('Event Dates', {'fields': ('start_event_at', 'end_event_at')}),
        # ('Participants', {'fields': ('user',)}),
    )

admin.site.register(Event, EventAdmin)

class RegisterEventAdmin(admin.ModelAdmin):
    list_display = ('user', 'event_related')
    list_filter = ('event_related',)
    search_fields = ('user__email', 'event_related__title')
    ordering = ('user',)

admin.site.register(RegisterEvent, RegisterEventAdmin)
