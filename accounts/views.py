from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from .serializers import UserRegistrationSerializer, UserLoginSerializer

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


class UserLoginView(APIView):
    serializer_class = UserLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        user = authenticate(email=email, password=password)

        if user is not None:
            return Response({"message": "User logged in successfully."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)
