from datetime import timezone
from django.db import models
from django.forms import ValidationError
from core.models import SoftDeleteModel,TimeStampMixin
from django.utils.translation import gettext as _

# Create your models here.

class Election(SoftDeleteModel,TimeStampMixin):
    title = models.CharField(_("Title"), max_length=50)
    description = models.TextField(_("description"))
    participants = models.ManyToManyField("accounts.User",
                                          related_name="election_as_participants"
                                          )
    student = models.ForeignKey("accounts.User",
                                   verbose_name=_("student id"),
                                   related_name="election_as_student",
                                   on_delete=models.CASCADE
                                   )
    def __str__(self):
        return self.title
    
    @classmethod
    def create_election(cls, title, description, student):
        election = cls(
            title=title,
            description=description,
            student=student
        )
        election.save()
        return election
    
    @classmethod
    def read_election_info(cls, election_id):
        election = cls.objects.filter(pk=election_id).first()
        return election
    
    def update_election(self, new_title, new_description):
        self.title = new_title
        self.description = new_description
        self.save()
        return self
    
    def is_active_election(self):
        """
        Check if the election is currently active.
        """
        now = timezone.now()
        return self.started_at <= now <= self.ended_at
    
    @staticmethod
    def get_active_elections():
        """
        Retrieve a queryset of active elections.

        """
        now = timezone.now()
        return Election.objects.filter(start_date__lte=now, end_date__gte=now)
    
    def get_election_results(self):
        """
        Calculate and return the voting results for this election.
        
        This method calculates the vote count for each option in the election
        and returns a dictionary containing the option titles and their respective vote counts.
        """
        options = self.options.all()
        results = {}

        for option in options:
            vote_count = option.options_votes.count()
            results[option.title] = vote_count

        return results
    
    
class ElectionOption(SoftDeleteModel):
    title = models.CharField(_("Title"), max_length=50)
    description = models.TextField(_("Description"), blank=True, null=True)
    election = models.ForeignKey(Election,
                                 on_delete=models.CASCADE,
                                 related_name="options"
                                 )

    def __str__(self):
        return self.title
    
    @classmethod
    def create_ElectionOption(cls, title, description, election):
        option = cls(
            title=title,
            description=description,
            election=election
        )
        option.save()
        return option
    
    @classmethod
    def read_ElectionOption_info(cls, option_id):
        option = cls.objects.filter(pk=option_id).first()
        return option

    def update_ElectionOption(self, new_title, new_description):
        self.title = new_title
        self.description = new_description
        self.save()
        return self
    
    
class Vote(SoftDeleteModel):
    user = models.ForeignKey("accounts.User", on_delete=models.CASCADE)
    election = models.ForeignKey(Election,
                                 on_delete=models.CASCADE,
                                 related_name="election_votes"
                                 )
    option = models.ForeignKey(ElectionOption,
                               on_delete=models.CASCADE,
                               related_name="options_votes"
                               )
    
    class Meta:
        unique_together = ('user', 'election')
        
    @classmethod
    def create_vote(cls, user, election, option):
        vote = cls(
            user=user,
            election=election,
            option=option
        )
        vote.save()
        return vote
    
    @classmethod
    def read_vote_info(cls, vote_id):
        vote = cls.objects.filter(pk=vote_id).first()
        return vote
    
    def update_vote(self, new_option):
        self.option = new_option
        self.save()
        return self
        
    @classmethod
    def get_votes_count_for_option(cls, option):
        return cls.objects.filter(option=option).count()
    
    @classmethod
    def get_votes_count_for_election(cls, election):
        return Vote.objects.filter(election=election).count()
    
    
class Candidate(SoftDeleteModel):
    first_name = models.CharField(_("First Name"), max_length=150, blank=True)
    last_name = models.CharField(_("Last Name"), max_length=150, blank=True)
    registration_date = models.DateTimeField(_("Registration Date"), auto_now_add=True)
    is_approved = models.BooleanField(_("Approved"), default=False)
    description = models.TextField(_("Description"), blank=True, null=True)
    student = models.ForeignKey("accounts.User",
                                verbose_name=_("student id"),
                                related_name="user_candidates",
                                on_delete=models.CASCADE
                                )
    election = models.ForeignKey("elections.Election",
                                 verbose_name=_("candidates"),
                                 on_delete=models.CASCADE,
                                 related_name="election_candidates",
                                 null=True
                                 )
    def __str__(self):
        return f"Candidate: {self.student} for {self.election}"

    @classmethod
    def create_candidate(cls, student, election, description=None):
        candidate = cls(
            student=student,
            election=election,
            description=description
        )
        candidate.save()
        return candidate
    
    @classmethod
    def read_candidate_info(cls, candidate_id):
        return cls.objects.filter(pk=candidate_id).first()
    
    def update_candidate(self, description=None, is_approved=None):
        self.description = description
        self.is_approved = is_approved
        self.save()
        
    def is_candidate_approved(self):
        return self.is_approved
    
    @classmethod
    def get_approved_candidates(cls):
        return cls.objects.filter(is_approved=True)
    
    @classmethod
    def get_candidates_by_election(cls, election_id):
        return cls.objects.filter(election_id=election_id)
    
    @classmethod
    def count_candidates(cls):
        return cls.objects.count()
    
    @classmethod
    def count_approved_candidates(cls):
        return cls.objects.filter(is_approved=True).count()
    
    def get_full_info(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'election': self.election.title,
            'registration_date': self.registration_date,
            'is_approved': self.is_approved,
            'description': self.description
        }