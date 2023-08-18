from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from elections.models import Election,Candidate,Vote
from .serializers import CandidateRegistrationSerializer,ElectionVoteSerializer
from accounts.permissions import IsStudent
from django.utils import timezone


class CandidateRegistrationView(CreateAPIView):
    serializer_class = CandidateRegistrationSerializer

    def get_remaining_registration_time(self, election):
        now = timezone.now()
        remaining_time = election.candidate_registration_end - now
        remaining_days = remaining_time.days
        remaining_hours = remaining_time.seconds // 3600
        remaining_minutes = (remaining_time.seconds // 60) % 60
        remaining_seconds = remaining_time.seconds % 60
        
        return f"{remaining_days} days, {remaining_hours} hours, {remaining_minutes} minutes, {remaining_seconds} seconds"
    
    def create(self, request, *args, **kwargs):
        election_id = request.data.get('election') 
        try:
            election = Election.objects.get(pk=election_id)
        except Election.DoesNotExist:
            return Response(
                {"error": "Election does not exist."},
                status=status.HTTP_400_BAD_REQUEST
            )

        remaining_time_str = self.get_remaining_registration_time(election)
        
        serializer = self.get_serializer(data=request.data,context={'election': election})
        serializer.is_valid(raise_exception=True)

        candidate = serializer.save()
        if candidate is None:
            return Response(
                {"error": "Candidate registration failed."},
                status=status.HTTP_400_BAD_REQUEST
            )
        return Response(
            {"message": "Candidate registered successfully.", "remaining_time": remaining_time_str},
            status=status.HTTP_201_CREATED
        )



class ElectionVoteView(APIView):
    permission_classes = [IsStudent]
    
    def get_remaining_election_time(self, election):
        now = timezone.now()
        remaining_time = election.election_ended_at - now
        remaining_days = remaining_time.days
        remaining_hours = remaining_time.seconds // 3600
        remaining_minutes = (remaining_time.seconds // 60) % 60
        remaining_seconds = remaining_time.seconds % 60
        
        return f"{remaining_days} days, {remaining_hours} hours, {remaining_minutes} minutes, {remaining_seconds} seconds"
    
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

        remaining_time_str = self.get_remaining_time(election)
        
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
                        "remaining_time": remaining_time_str 
                    },
                    status=status.HTTP_201_CREATED
                )