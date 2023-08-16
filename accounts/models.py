from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext as _

# Create your models here.
class User(AbstractUser):
    email = models.EmailField(_("email address"), unique=True)
    mobile = models.CharField(_("mobile number"), max_length=11, unique=True, blank=True, null=True)
  

    EMAIL_FIELD = "email"
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []



    
    
    
    