from django.utils import timezone
from django.db import models
from core.models import SoftDeleteModel,TimeStampMixin
from django.utils.translation import gettext as _

# Create your models here.

class Candidate(SoftDeleteModel):
    first_name = models.CharField(_("First Name"), max_length=150, blank=True)
    last_name = models.CharField(_("Last Name"), max_length=150, blank=True)
    mobile = models.CharField(_("mobile number"), max_length=11, unique=True, blank=True, null=True)
    student_number = models.CharField(_("student number"), max_length=50, blank=True,null=True,unique=True)
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
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
        }


class Election(SoftDeleteModel):
    title = models.CharField(_("Title"), max_length=50)
    description = models.TextField(_("description"))
    capacity = models.IntegerField(_("capacity"))
    election_started_at = models.DateTimeField(_("Election Start"))
    election_ended_at = models.DateTimeField(_("Election End"))
    candidate_registration_start = models.DateTimeField(_("Candidate Registration Start"))
    candidate_registration_end = models.DateTimeField(_("Candidate Registration End"))
    
    def __str__(self):
        return self.title
    
    def is_active_election(self):
        """
        Check if the election is currently active.
        """
        now = timezone.now()
        return self.election_started_at <= now <= self.election_ended_at
    
    def get_election_results(self):
        candidates_with_votes = []
        for candidate in self.get_active_candidates():
            votes_count = Vote.get_votes_count_for_candidate(candidate)
            candidates_with_votes.append((candidate, votes_count))
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
    
    
