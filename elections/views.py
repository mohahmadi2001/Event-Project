from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from elections.models import Election,Candidate
from .serializers import CandidateRegistrationSerializer,ApprovedCandidateSerializer

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



class ElectionApprovedCandidatesView(APIView):
    def get(self, request, election_slug):
        try:
            election = Election.objects.get(slug=election_slug)
        except Election.DoesNotExist:
            return Response({"error": "Election not found."}, status=status.HTTP_404_NOT_FOUND)

        if not election.is_active_election():
            return Response({"error": "Election is not currently active."}, status=status.HTTP_400_BAD_REQUEST)

        approved_candidates = Candidate.get_approved_candidates().filter(election=election)
        serializer = ApprovedCandidateSerializer(approved_candidates, many=True)
        return Response(serializer.data)