from django.urls import path
from .views import (
                    UserRegistrationView,
                    UserUpdateView,
                    ChangePasswordView,
                    StudentInfoAPIView
                )
from workshops.views import RegisteredEventsView


app_name = 'accounts'
urlpatterns = [
    path('user/register/', UserRegistrationView.as_view(), name='user-registration'),
    path('user/update/', UserUpdateView.as_view(), name='user-profile-update'),
    path('user/registered-events/', RegisteredEventsView.as_view(), name='user-registered-events'),
    path('user/change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('students/', StudentInfoAPIView.as_view(), name='student-info-list'),
]
