from django.contrib import admin
from .models import Election, ElectionOption, Vote

class ElectionOptionInline(admin.TabularInline):
    model = ElectionOption
    extra = 1

class ElectionAdmin(admin.ModelAdmin):
    list_display = ('title', 'started_at', 'ended_at')
    inlines = [ElectionOptionInline]

class VoteAdmin(admin.ModelAdmin):
    list_display = ('user', 'election', 'option')

admin.site.register(Election, ElectionAdmin)
admin.site.register(ElectionOption)
admin.site.register(Vote, VoteAdmin)