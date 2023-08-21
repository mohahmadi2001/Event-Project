from django.urls import path
from .views import (UserRegistrationView,
                    UserLoginView,
                    UserLogoutView,
                    UserProfileView,
                    UserProfileUpdateView,
                    ChangePasswordView,
                    UserProfileRegisteredEventsView
                )

app_name = 'accounts'
urlpatterns = [
    path('user-registration/', UserRegistrationView.as_view(), name='user-registration'),
    path('user-login/', UserLoginView.as_view(), name='user-login'),
    path('user-logout/', UserLogoutView.as_view(), name='user-logout'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('profile/update/', UserProfileUpdateView.as_view(), name='user-profile-update'),
    path('profile/change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('profile/registered-events/', UserProfileRegisteredEventsView.as_view(), name='user-registered-events'),
]
