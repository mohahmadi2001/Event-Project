from django.contrib import admin
from .models import Candidate, Election,Vote

class CandidateAdmin(admin.ModelAdmin):
    list_display = ('student_number', 'first_name', 'last_name', 'is_approved', 'election')
    list_filter = ('is_approved', 'election')
    search_fields = ('student_number', 'first_name', 'last_name')
    ordering = ('student_number',)

    fieldsets = (
        (None, {'fields': ('student_number', 'first_name', 'last_name', 'mobile', 'entry_year', 'description')}),
        ('Approval', {'fields': ('is_approved',)}),
        ('Election', {'fields': ('election',)}),
    )

admin.site.register(Candidate, CandidateAdmin)

class ElectionAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'election_started_at', 'election_ended_at', 'capacity', 'max_votes_per_user')
    list_filter = ('election_started_at', 'election_ended_at')
    search_fields = ('title', 'slug')
    ordering = ('election_started_at',)

    fieldsets = (
        (None, {'fields': ('title', 'slug', 'description', 'capacity')}),
        ('Election Dates', {'fields': ('election_started_at', 'election_ended_at', 'candidate_registration_start', 'candidate_registration_end')}),
        ('Candidates', {'fields': ('candidates',)}),
        ('Voting', {'fields': ('max_votes_per_user',)}),
    )

admin.site.register(Election, ElectionAdmin)


class VoteAdmin(admin.ModelAdmin):
    list_display = ('user', 'election', 'candidate')
    list_filter = ('election', 'candidate')
    search_fields = ('user__email', 'election__title', 'candidate__student_number')
    ordering = ('election',)

admin.site.register(Vote, VoteAdmin)
