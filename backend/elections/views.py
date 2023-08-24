from rest_framework.generics import ListCreateAPIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from elections.models import Election,Candidate,Vote
from .serializers import  (
                           CandidateRegistrationSerializer,
                           ElectionVoteSerializer,
                           ElectionResultsSerializer,
                           ApprovedCandidateSerializer
                        )
from accounts.permissions import IsStudent
from rest_framework.permissions import IsAuthenticated


class CandidateRegistrationView(APIView):
    def post(self, request):
        election_id = request.data.get('election') 
        try:
            election = Election.objects.get(pk=election_id)
        except Election.DoesNotExist:
            return Response(
                {"error": "Election does not exist."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = CandidateRegistrationSerializer(data=request.data, context={'election': election})
        serializer.is_valid(raise_exception=True)

        candidate = serializer.save()
        if candidate is None:
            return Response(
                {"error": "Candidate registration failed."},
                status=status.HTTP_400_BAD_REQUEST
            )
        return Response(
            {"message": "Candidate registered successfully."},
            status=status.HTTP_201_CREATED
        )
           
   
class ElectionVoteView(APIView):
    permission_classes = [IsStudent]
    
    def post(self, request, election_slug):
        user = request.user
        
        if user.has_voted:
            return Response({"error": "You have already voted."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            election = Election.objects.get(slug=election_slug)
        except Election.DoesNotExist:
            return Response({"error": "Election not found."}, status=status.HTTP_404_NOT_FOUND)

        if not election.is_active_election():
            return Response({"error": "Election is not currently active."}, status=status.HTTP_400_BAD_REQUEST)

        
        serializer = ElectionVoteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        candidates_data = serializer.validated_data['candidates']
        if len(candidates_data) > 5:
            return Response({"error": "You can vote for up to 5 candidates."}, status=status.HTTP_400_BAD_REQUEST)
        
        for candidate_data in candidates_data:
            candidate_id = candidate_data['candidate_id']
            candidate = Candidate.objects.get(pk=candidate_id)
            
            Vote.objects.create(user=user, candidate=candidate)
        

        user.has_voted = True
        user.save()
        
        return Response(
                    {
                        "message": "Votes submitted successfully.",
                    },
                    status=status.HTTP_201_CREATED
                )
    

class ElectionResultsView(APIView):
    def get(self, request, election_slug):
        try:
            election = Election.objects.get(slug=election_slug)
        except Election.DoesNotExist:
            return Response({"error": "Election not found."}, status=status.HTTP_404_NOT_FOUND)

        candidates_with_votes = election.get_candidates_with_votes_ordered_by_votes()
        total_participants = Vote.get_votes_count_for_election(election)
        total_candidates = election.election_candidates.filter(is_approved=True).count()

        serializer = ElectionResultsSerializer(data={
            "candidates_with_votes": candidates_with_votes,
            "total_participants": total_participants,
            "total_candidates": total_candidates
        })
        
        serializer.is_valid()


        return Response(serializer.validated_data, status=status.HTTP_200_OK)

class ApprovedCandidateListView(ListAPIView):
    serializer_class = ApprovedCandidateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Candidate.get_approved_candidates()