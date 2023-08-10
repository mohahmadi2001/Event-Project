from datetime import timezone
from django.db import models
from django.forms import ValidationError
from django.utils.translation import gettext as _

# Create your models here.

class Election(models.Model):
    title = models.CharField(_("Title"), max_length=50)
    description = models.TextField(_("description"))
    start_date = models.DateTimeField(_("start date"))
    end_date = models.DateTimeField(_("end date"))
    participants = models.ManyToManyField("accounts.User", related_name="participated_elections")
    student_id = models.ForeignKey("accounts.User",
                                   verbose_name=_("student id"),
                                   related_name="election_as_student",
                                   on_delete=models.CASCADE
                                   )
    def __str__(self):
        return self.title
    
    def is_active(self):
        """
        Check if the election is currently active.
        """
        now = timezone.now()
        return self.start_date <= now <= self.end_date
    
    def get_votes(self):
        """
        Retrieve the votes cast in this election.

        This method retrieves all the votes cast in this election and returns
        a queryset containing the Vote objects associated with this election.
        """
        return self.vote_set.all()
    
    def get_results(self):
        """
        Calculate and return the voting results for this election.
        
        This method calculates the vote count for each option in the election
        and returns a dictionary containing the option titles and their respective vote counts.
        """
        options = self.options.all()
        results = {}

        for option in options:
            vote_count = option.vote_set.count()
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
    election = models.ForeignKey(Election, on_delete=models.CASCADE, related_name="options")
    title = models.CharField(_("Title"), max_length=50)
    description = models.TextField(_("Description"), blank=True, null=True)

    def __str__(self):
        return self.title
    
    
class Vote(models.Model):
    user = models.ForeignKey("accounts.User", on_delete=models.CASCADE)
    election = models.ForeignKey(Election, on_delete=models.CASCADE, related_name="votes")
    option = models.ForeignKey(ElectionOption, on_delete=models.CASCADE)
    
    class Meta:
        unique_together = ('user', 'election')
        
    def save(self, *args, **kwargs):
        """
        Save the vote object after checking if the associated election is active.

        This method overrides the default save method to perform an additional check.
        It ensures that the associated election is currently active before saving the vote.
        If the election is not active, a ValidationError will be raised.

        """
        if not self.election.is_active():
            raise ValidationError("This election is not currently active.")
        super().save(*args, **kwargs)