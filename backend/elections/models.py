from django.utils import timezone
from django.db import models
from core.models import SoftDeleteModel
from django.utils.translation import gettext as _
from django.utils.text import slugify

# Create your models here.

class Candidate(SoftDeleteModel):
    first_name = models.CharField(_("First Name"), max_length=150, blank=True)
    last_name = models.CharField(_("Last Name"), max_length=150, blank=True)
    mobile = models.CharField(_("mobile number"), max_length=11, unique=True, blank=True, null=True)
    student_number = models.CharField(_("student number"), max_length=50, blank=True,null=True,unique=True)
    entry_year = models.PositiveIntegerField(_("Entry Year"), blank=True, null=True)
    registration_date = models.DateTimeField(_("Registration Date"), auto_now_add=True)
    is_approved = models.BooleanField(_("Approved"), default=False)
    election = models.ForeignKey("elections.Election",
                                 verbose_name=_("Election Title"),
                                 on_delete=models.CASCADE,
                                 related_name="election_candidates",
                                 null=True
                                )
    

    
    
    def __str__(self):
        return self.student_number

    def is_candidate_approved(self):
        return self.is_approved
    
    @classmethod
    def get_approved_candidates(cls):
        return cls.objects.filter(is_approved=True)
    
    def get_candidate_info(self):
        return {
            'student_number': self.student_number,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'entry_year': self.entry_year,
        }
        
       
class Election(SoftDeleteModel):
    title = models.CharField(_("Title"), max_length=50)
    slug = models.SlugField(_("Slug"), unique=True)
    description = models.TextField(_("description"))
    capacity = models.IntegerField(_("capacity"))
    election_started_at = models.DateTimeField(_("Election Start"))
    election_ended_at = models.DateTimeField(_("Election End"))
    candidate_registration_start = models.DateTimeField(_("Candidate Registration Start"))
    candidate_registration_end = models.DateTimeField(_("Candidate Registration End"))
    candidates = models.ManyToManyField("elections.Candidate", related_name="elections",blank=True)
    
    def __str__(self):
        return self.title
    
    def is_active_election(self):
        """
        Check if the election is currently active.
        """
        now = timezone.now()
        return self.election_started_at <= now <= self.election_ended_at
    
    def get_remaining_election_time(self, election):
        now = timezone.now()
        remaining_time = election.election_ended_at - now
        remaining_days = remaining_time.days
        remaining_hours = remaining_time.seconds // 3600
        remaining_minutes = (remaining_time.seconds // 60) % 60
        remaining_seconds = remaining_time.seconds % 60
        
        return f"{remaining_days} days, {remaining_hours} hours, {remaining_minutes} minutes, {remaining_seconds} seconds"
    
    def get_remaining_registration_time(self, election):
        now = timezone.now()
        remaining_time = election.candidate_registration_end - now
        remaining_days = remaining_time.days
        remaining_hours = remaining_time.seconds // 3600
        remaining_minutes = (remaining_time.seconds // 60) % 60
        remaining_seconds = remaining_time.seconds % 60
        
        return f"{remaining_days} days, {remaining_hours} hours, {remaining_minutes} minutes, {remaining_seconds} seconds"
    
    def get_candidates_with_votes_ordered_by_votes(self):
        candidates_with_votes = []
        for candidate in self.candidates.all():
            votes_count = Vote.get_votes_count_for_candidate(candidate)
            candidates_with_votes.append({
                "candidate": {
                    "id": candidate.id,
                    "first_name": candidate.first_name,
                    "last_name": candidate.last_name,
                    "entry_year": candidate.entry_year,
                },
                "votes_count": votes_count
            })

        candidates_with_votes.sort(key=lambda x: x["votes_count"], reverse=True)
        return candidates_with_votes
    
       
class Vote(SoftDeleteModel):
    user = models.ForeignKey("accounts.User", on_delete=models.CASCADE)
    election = models.ForeignKey(Election,
                                 on_delete=models.CASCADE,
                                 related_name="election_votes"
                                 )
    
    class Meta:
        unique_together = ('user', 'election')
        
    @classmethod
    def get_votes_count_for_candidate(cls, candidate):
        return cls.objects.filter(candidate=candidate).count()
    
    @classmethod
    def get_votes_count_for_election(cls, election):
        return Vote.objects.filter(election=election).count()
    
   
