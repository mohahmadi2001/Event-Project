from rest_framework.generics import ListCreateAPIView
from rest_framework.generics import ListAPIView,CreateAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from elections.models import Election,Candidate,Vote
from .serializers import  (
                           CandidateRegistrationSerializer,
                           VoteSerializer,
                           ElectionResultSerializer,
                           ApprovedCandidateSerializer,
                           ElectionSerializer
                        )
from accounts.permissions import IsStudent
from rest_framework.permissions import AllowAny



class ElectionListView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        election = Election.objects.all()
        serializer = ElectionSerializer(election, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CandidateRegistrationView(CreateAPIView):
    serializer_class = CandidateRegistrationSerializer
    permission_classes = [AllowAny]


    def get_election(self):
        election_id = self.request.data.get('election')
        try:
            election = Election.objects.get(pk=election_id)
            return election
        except Election.DoesNotExist:
            return None

    def create(self, request, *args, **kwargs):
        election = self.get_election()
        if not election:
            return Response(
                {"error": "Election does not exist."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(data=request.data, context={'election': election})
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
           
   
class VoteView(APIView):
    permission_classes = [IsStudent]

    def post(self, request, *args, **kwargs):
        user = request.user

        serializer = VoteSerializer(data=request.data)
        if serializer.is_valid():
            election_id = serializer.validated_data.get('election_id')
            
            try:
                election = Election.objects.get(id=election_id)
            except Election.DoesNotExist:
                return Response({"existerror": "Election does not exist."}, status=status.HTTP_400_BAD_REQUEST)

            if not election.is_active_election():
                return Response({"activeerror": "This election is not active or has not started yet."}, status=status.HTTP_400_BAD_REQUEST)

            existing_vote = Vote.objects.filter(user=user, election=election).first()
            if existing_vote:
                return Response({"votederror": "You have already voted in this election."}, status=status.HTTP_400_BAD_REQUEST)

            candidate_ids = serializer.validated_data.get('candidate_ids')

            if len(candidate_ids) > election.max_votes_per_user:
                return Response({"maxerror": f"You can vote for a maximum of {election.max_votes_per_user} candidates."}, status=status.HTTP_400_BAD_REQUEST)


            for candidate_id in candidate_ids:
                candidate = Candidate.objects.get(id=candidate_id)
                vote = Vote(user=user, candidate=candidate, election=election)
                vote.save()
            
            user.has_voted = True
            user.save()    

            return Response({"message": "Your votes have been cast successfully."}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
class ElectionResultsView(APIView):
    def get(self, request, *args, **kwargs):
        election = Election.objects.first()

        if not election:
            return Response({"message": "Election not found."}, status=status.HTTP_404_NOT_FOUND)

        candidates_with_votes = Vote.get_candidates_with_votes_ordered_by_votes(election)

        serializer = ElectionResultSerializer(candidates_with_votes, many=True)
        return Response(serializer.data)   
    
    
class ApprovedCandidateListView(ListAPIView):
    serializer_class = ApprovedCandidateSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Candidate.get_approved_candidates()
    

class ElectionStatsView(APIView):
    def get(self, request, *args, **kwargs):
        election = Election.objects.first()

        if not election:
            return Response({"message": "Election not found."}, status=status.HTTP_404_NOT_FOUND)

        total_candidates = election.election_candidates.filter(is_approved=True).count()
        total_participants = election.get_total_participants()
        remaining_election_time = election.get_remaining_election_time(election)
        remaining_registration_time = election.get_remaining_registration_time(election)

        
        data = {
            "total_approved_candidates": total_candidates,
            "total_participants": total_participants,
            "remaining_election_time": remaining_election_time,
            "remaining_registration_time": remaining_registration_time,
        }

        return Response(data, status=status.HTTP_200_OK)
