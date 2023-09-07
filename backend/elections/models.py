from django.utils import timezone
from django.db import models
from core.models import SoftDeleteModel
from django.utils.translation import gettext as _
from django.db.models import Count

# Create your models here.

class Candidate(SoftDeleteModel):
    first_name = models.CharField(_("First Name"), max_length=150, blank=True)
    last_name = models.CharField(_("Last Name"), max_length=150, blank=True)
    mobile = models.CharField(_("mobile number"), max_length=11, unique=True, blank=True, null=True)
    student_number = models.CharField(_("student number"), max_length=50, blank=True,null=True,unique=True)
    entry_year = models.PositiveIntegerField(_("Entry Year"), blank=True, null=True)
    description = models.TextField(_("description"),null=True)
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
    max_votes_per_user = models.PositiveIntegerField(
        _("Maximum Votes Per User"),
        default=1,  
    )
    
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
    
    

    def get_total_participants(self):
        """
        Get the total number of participants (users who have voted) in this election.
        """
        return self.election_votes.values('user').distinct().count()

    
       
class Vote(SoftDeleteModel):
    user = models.ForeignKey("accounts.User", on_delete=models.CASCADE)
    election = models.ForeignKey(Election,
                                 on_delete=models.CASCADE,
                                 related_name="election_votes"
                                 )
    candidate = models.ForeignKey(Candidate,
                                  verbose_name=_("candidate"),
                                  on_delete=models.CASCADE,
                                  null=True
                                )
    
    def __str__(self):
        return f"{self.candidate}"
        
    @classmethod
    def get_votes_count_for_candidate(cls, candidate):
        return cls.objects.filter(candidate=candidate).count()
    
    @classmethod
    def get_votes_count_for_election(cls, election):
        return Vote.objects.filter(election=election).count()
    
    
    @classmethod
    def get_candidates_with_votes_ordered_by_votes(cls, election):
        candidates_with_votes = cls.objects.filter(election=election)
        candidates_with_votes = candidates_with_votes.values('candidate__id', 'candidate__first_name', 'candidate__last_name', 'candidate__entry_year')
        candidates_with_votes = candidates_with_votes.annotate(votes_count=Count('candidate'))
        candidates_with_votes = candidates_with_votes.order_by('-votes_count')

        return candidates_with_votes

    
   
