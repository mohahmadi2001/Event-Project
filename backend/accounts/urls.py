from django.urls import path
from .views import (
                    UserRegistrationView,
                    UserUpdateView,
                    CustomSetPasswordView
                )
from workshops.views import RegisteredEventListView


app_name = 'accounts'
urlpatterns = [
    path('user/register/', UserRegistrationView.as_view(), name='user-registration'),
    path('user/update/', UserUpdateView.as_view(), name='user-profile-update'),
    path('user/registered-events/', RegisteredEventListView.as_view(), name='user-registered-events'),
    path('user/password_change/', CustomSetPasswordView.as_view(), name='password-change'),
]
