from django.db import models
from core.models import SoftDeleteModel,TimeStampMixin
from django.utils.translation import gettext as _
# Create your models here.

class Event(SoftDeleteModel,TimeStampMixin):
    title = models.CharField(_("Title"), max_length=50)
    description = models.TextField(_("description"))
    location = models.TextField(_("location"))
    capacity = models.PositiveIntegerField(_("Capacity"), default=0) 
    price = models.FloatField(_("price"))
    image = models.ImageField(_("Event Image"),
                                    upload_to='event_images/',
                                    blank=True,
                                    null=True
                                    )
    user = models.ForeignKey("accounts.User",
                                   verbose_name=_("user id"),
                                   related_name="events",
                                   on_delete=models.CASCADE
                                   )
    def __str__(self):
        return self.title
