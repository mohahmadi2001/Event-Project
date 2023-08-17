from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from .serializers import UserRegistrationSerializer

User = get_user_model()

class UserRegistrationView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        is_student = serializer.validated_data.get('is_student')
        student_number = serializer.validated_data.get('student_number')
        if is_student and student_number is None:
            return Response(
                {"error": "Student number is required for students."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = serializer.save()
        if user is None:
            return Response(
                {"error": "User registration failed."},
                status=status.HTTP_400_BAD_REQUEST
            )
        return Response(
            {"message": "User registered successfully."},
            status=status.HTTP_201_CREATED
        )
