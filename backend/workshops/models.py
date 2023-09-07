from django.db import models
from core.models import SoftDeleteModel
from django.utils.translation import gettext as _
from django.utils import timezone
# Create your models here.

class Event(SoftDeleteModel):
    title = models.CharField(_("Title"), max_length=50)
    slug = models.SlugField(_("slug"),default="-")
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
    user = models.ManyToManyField(
                                "accounts.User",
                                verbose_name=_("user")
                            )

    def __str__(self):
        return self.title
    
    # Create
    def create_event(title, description, location, capacity, price, image, start_event_at, end_event_at):
        event = Event(
            title=title,
            description=description,
            location=location,
            capacity=capacity,
            price=price,
            image=image,
            start_event_at=start_event_at,
            end_event_at=end_event_at
        )
        event.save()
        return event


    # Read
    def get_event(event_id):
        try:
            event = Event.objects.get(pk=event_id)
            return event
        except Event.DoesNotExist:
            return None

    def get_all_events():
        events = Event.objects.all()
        return events


    # Update
    def update_event(event_id, **kwargs):
        try:
            event = Event.objects.get(pk=event_id)
            for key, value in kwargs.items():
                setattr(event, key, value)
            event.save()
            return event
        except Event.DoesNotExist:
            return None
     
     
class RegisterEvent(SoftDeleteModel):
    user = models.ForeignKey(
        "accounts.User",
        verbose_name=_("user"), 
        on_delete=models.CASCADE,
        related_name="user_event"
    )
    event_related = models.ForeignKey(
        Event,
        verbose_name=_("event_related"),
        on_delete=models.CASCADE,
        related_name="event_for_user"
    )
        
    def __str__(self):
        return f"Registration for '{self.event_related.title}' by {self.user.email}"
