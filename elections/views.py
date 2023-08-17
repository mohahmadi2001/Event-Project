from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import CandidateRegistrationSerializer

class CandidateRegistrationView(CreateAPIView):
    serializer_class = CandidateRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
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

