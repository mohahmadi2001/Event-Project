from django.urls import path
from .views import UserRegistrationView, UserLoginView

app_name = 'accounts'
urlpatterns = [
    path('user-registration/', UserRegistrationView.as_view(), name='user-registration'),
    path('user-login/', UserLoginView.as_view(), name='user-login'),
]
