from django.urls import path
from .views import UserRegistrationView

app_name = 'accounts'
urlpatterns = [
    path('user-registration/', UserRegistrationView.as_view(), name='user-registration'),
]
