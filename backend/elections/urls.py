from django.urls import path
from .views import CandidateRegistrationView,ElectionVoteView,ElectionResultsView,ApprovedCandidateListView

app_name = 'elections'
urlpatterns = [
    path('register-candidate/', CandidateRegistrationView.as_view(), name='candidate-registration'),
    path('approved-candidates/', ApprovedCandidateListView.as_view(), name='approved-candidates-list'),
    path('<slug:election_slug>/vote/', ElectionVoteView.as_view(), name='election-vote'),
    path('<slug:election_slug>/results/', ElectionResultsView.as_view(), name='election-participant-count'),
]