from django.db import models
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