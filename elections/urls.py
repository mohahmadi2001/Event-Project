from django.urls import path
from .views import CandidateRegistrationView,ElectionVoteView

urlpatterns = [
    path('register-candidate/', CandidateRegistrationView.as_view(), name='candidate-registration'),
    path('<slug:election_slug>/vote/', ElectionVoteView.as_view(), name='election-vote'),
]