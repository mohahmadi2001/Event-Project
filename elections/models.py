from datetime import timezone
from django.db import models
from django.forms import ValidationError
from core.models import SoftDeleteModel,TimeStampMixin
from django.utils.translation import gettext as _

# Create your models here.

class Election(models.Model,TimeStampMixin):
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
    
    def is_active(self):
        """
        Check if the election is currently active.
        """
        now = timezone.now()
        return self.started_at <= now <= self.ended_at
    
    def get_votes(self):
        """
        Retrieve the votes cast in this election.

        This method retrieves all the votes cast in this election and returns
        a queryset containing the Vote objects associated with this election.
        """
        return self.options_votes.all()
    
    def get_results(self):
        """
        Calculate and return the voting results for this election.
        
        This method calculates the vote count for each option in the election
        and returns a dictionary containing the option titles and their respective vote counts.
        """
        options = self.options.all()
        results = {}

        for option in options:
            vote_count = option.election_votes.count()
            results[option.title] = vote_count

        return results
    
    def register_participant(self, user):
        """
        Register a participant in the election if the conditions are met.

        """ 
        self.participants.add(user)
        return True

    @staticmethod
    def get_active_elections():
        """
        Retrieve a queryset of active elections.

        """
        now = timezone.now()
        return Election.objects.filter(start_date__lte=now, end_date__gte=now)

   
class ElectionOption(models.Model):
    title = models.CharField(_("Title"), max_length=50)
    description = models.TextField(_("Description"), blank=True, null=True)
    election = models.ForeignKey(Election,
                                 on_delete=models.CASCADE,
                                 related_name="options"
                                 )

    def __str__(self):
        return self.title
    
    
class Vote(models.Model):
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
        
    def save(self, *args, **kwargs):
        """
        Save the vote object after checking if the associated election is active.
        """
        super().save(*args, **kwargs)