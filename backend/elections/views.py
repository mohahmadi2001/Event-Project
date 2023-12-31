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
                {"electionerror": "Election does not exist."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        existing_candidate = Candidate.objects.filter(
            student_number=request.data['student_number'],
            election=election
        ).first()

        if existing_candidate:
            return Response(
                {"existserror": "Candidate with the same information already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(data=request.data, context={'election': election})
        serializer.is_valid(raise_exception=True)

        serializer.save()
        
        return Response(
            {"message": "Candidate registered successfully."},
            status=status.HTTP_201_CREATED
        )
           
   
class VoteView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        user = request.user
        
        if not user.is_student:
            return Response({"studenterror": "You are not a student and cannot vote."}, status=status.HTTP_400_BAD_REQUEST)

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



class TopCandidatesView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, *args, **kwargs):
        try:
            election = Election.objects.first()
        except Election.DoesNotExist:
            return Response({"message": "There is no active election."}, status=status.HTTP_404_NOT_FOUND)


        top_candidates = Vote.get_candidates_with_votes_ordered_by_votes(election)

        top_candidates_list = []

        max_top_candidates = election.max_votes_per_user

        last_place_votes = top_candidates[max_top_candidates - 1]['votes_count']

        for candidate in top_candidates:
            if candidate['votes_count'] >= last_place_votes:
                top_candidates_list.append({
                    "first_name": candidate["candidate__first_name"],
                    "last_name": candidate["candidate__last_name"],
                    "entry_year": candidate["candidate__entry_year"],
                    "votes_count": candidate["votes_count"],
                })

        return Response(top_candidates_list, status=status.HTTP_200_OK)
   