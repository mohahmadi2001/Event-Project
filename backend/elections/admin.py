from django.contrib import admin
from .models import Election, Vote, Candidate



admin.site.register(Election)
admin.site.register(Vote)
admin.site.register(Candidate)