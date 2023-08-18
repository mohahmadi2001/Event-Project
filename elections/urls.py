from django.urls import path
from .views import CandidateRegistrationView,ElectionApprovedCandidatesView

urlpatterns = [
    path('register-candidate/', CandidateRegistrationView.as_view(), name='candidate-registration'),
    path('<slug:election_slug>/approved-candidates/', ElectionApprovedCandidatesView.as_view(), name='election-approved-candidates'),
]