from django.urls import path
from .views import CandidateRegistrationView

urlpatterns = [
    path('register-candidate/', CandidateRegistrationView.as_view(), name='candidate-registration'),
]