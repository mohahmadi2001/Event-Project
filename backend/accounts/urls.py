from django.urls import path
from .views import (
                    UserRegistrationView,
                    UserUpdateView
                )
from workshops.views import RegisteredEventListView
from djoser.views import TokenCreateView,TokenDestroyView

app_name = 'accounts'
urlpatterns = [
    path('user/register/', UserRegistrationView.as_view(), name='user-registration'),
    path('user/update/', UserUpdateView.as_view(), name='user-profile-update'),
    path('profile/registered-events/', RegisteredEventListView.as_view(), name='user-registered-events'),
]
