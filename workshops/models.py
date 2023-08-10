from django.db import models
from django.utils import timezone
from django.utils.translation import gettext as _
# Create your models here.

class Event(models.Model):
    title = models.CharField(_("Title"), max_length=50)
    description = models.TextField(_("description"))
    location = models.TextField(_("location"))
    start_date = models.DateTimeField(_("start date"))
    end_date = models.DateTimeField(_("end date"))
    participants = models.PositiveIntegerField(_("Participants"), default=0)
    capacity = models.PositiveIntegerField(_("Capacity"), default=0) 
    event_image = models.ImageField(_("Event Image"), upload_to='event_images/', blank=True, null=True)
    student_id = models.ForeignKey("accounts.User",
                                   verbose_name=_("student id"),
                                   related_name="events_as_student",
                                   on_delete=models.CASCADE
                                   )
    def __str__(self):
        return self.title
    
    def register_participant(self, user):
        """
        Register a user as a participant in the event.
        """
        user.events_as_student.add(self)
        self.participants += 1
        self.save()
            

class EventType(models.Model):
    type = models.CharField(_("type"), max_length=50)
    event_id = models.ForeignKey("Event",
                                 verbose_name=_("event_id"),
                                 on_delete=models.CASCADE
                                 )
    def __str__(self):
        return self.type