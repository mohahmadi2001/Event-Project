from django.urls import path
from .views import (UserRegistrationView,
                    MyObtainTokenPairView,
                    UserLogoutView,
                    UserProfileView,
                    UserProfileUpdateView,
                    ChangePasswordView,
                )
from workshops.views import RegisteredEventListView
from rest_framework_simplejwt.views import TokenRefreshView

app_name = 'accounts'
urlpatterns = [
    path('user-registration/', UserRegistrationView.as_view(), name='user-registration'),
    path('user-login/', MyObtainTokenPairView.as_view(), name='user-login'),
    path('user-login/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('user-logout/', UserLogoutView.as_view(), name='user-logout'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('profile/update/', UserProfileUpdateView.as_view(), name='user-profile-update'),
    path('profile/change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('profile/registered-events/', RegisteredEventListView.as_view(), name='user-registered-events'),
]
