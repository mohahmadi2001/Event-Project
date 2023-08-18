from django.urls import path
from .views import UserRegistrationView, UserLoginView, UserLogoutView


urlpatterns = [
    path('user-registration/', UserRegistrationView.as_view(), name='user-registration'),
    path('user-login/', UserLoginView.as_view(), name='user-login'),
    path('user-logout/', UserLogoutView.as_view(), name='user-logout'),
]
