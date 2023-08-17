from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework import status

from elections.models import Election
from .serializers import CandidateRegistrationSerializer

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

