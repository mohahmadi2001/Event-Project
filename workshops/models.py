from django.db import models
from django.utils import timezone
from core.models import SoftDeleteModel,TimeStampMixin
from django.utils.translation import gettext as _
# Create your models here.

class Event(models.Model,TimeStampMixin):
    title = models.CharField(_("Title"), max_length=50)
    description = models.TextField(_("description"))
    location = models.TextField(_("location"))
    participants = models.PositiveIntegerField(_("Participants"), default=0)
    capacity = models.PositiveIntegerField(_("Capacity"), default=0) 
    image = models.ImageField(_("Event Image"),
                                    upload_to='event_images/',
                                    blank=True,
                                    null=True
                                    )
    student = models.ForeignKey("accounts.User",
                                   verbose_name=_("student id"),
                                   related_name="events",
                                   on_delete=models.CASCADE
                                   )
    def __str__(self):
        return self.title
    
    @classmethod
    def create_event(cls, title, description, location, capacity, student):
        event = cls(
            title=title,
            description=description,
            location=location,
            capacity=capacity,
            student=student
        )
        event.save()
        return event
    
    @classmethod
    def read_event_info(cls, event_id):
        return cls.objects.filter(pk=event_id).first()
    
    def update_event(self, title=None, description=None, location=None, capacity=None):
        if title is not None:
            self.title = title
        if description is not None:
            self.description = description
        if location is not None:
            self.location = location
        if capacity is not None:
            self.capacity = capacity
        self.save()
        return self

class EventType(models.Model):
    type = models.CharField(_("type"), max_length=50)
    event = models.ForeignKey("Event",
                                 verbose_name=_("event_id"),
                                 on_delete=models.CASCADE,
                                 related_name="event_type"
                                 )
    def __str__(self):
        return self.type