from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from elections.models import Election,Candidate,Vote
from .serializers import CandidateRegistrationSerializer,ElectionVoteSerializer
from accounts.permissions import IsStudent

class CandidateRegistrationView(CreateAPIView):
    serializer_class = CandidateRegistrationSerializer

    def create(self, request, *args, **kwargs):
        election_id = request.data.get('election')  # Assuming 'election' is the field name
        try:
            election = Election.objects.get(pk=election_id)
        except Election.DoesNotExist:
            return Response(
                {"error": "Election does not exist."},
                status=status.HTTP_400_BAD_REQUEST
            )


        serializer = self.get_serializer(data=request.data,context={'election': election})
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
        
        return Response({"message": "Votes submitted successfully."}, status=status.HTTP_201_CREATED)
