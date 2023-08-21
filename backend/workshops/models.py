from django.db import models
from core.models import SoftDeleteModel
from django.utils.translation import gettext as _
# Create your models here.

class Event(SoftDeleteModel):
    title = models.CharField(_("Title"), max_length=50)
    description = models.TextField(_("description"))
    location = models.TextField(_("location"))
    capacity = models.PositiveIntegerField(_("Capacity"), default=0) 
    price = models.CharField(_("price"), max_length=50)
    image = models.ImageField(_("Event Image"),
                                    upload_to='event_images/',
                                    blank=True,
                                    null=True
                                    )
    start_event_at = models.DateTimeField(_("Start Event At"))
    end_event_at = models.DateTimeField(_("End Event At"))

    def __str__(self):
        return self.title
    
    