from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate,login,logout
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from .serializers import (UserRegistrationSerializer,
                          UserLoginSerializer,
                          UserProfileSerializer,
                          UserUpdateSerializer,
                          ChangePasswordSerializer,
                        )
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class CustomUserRegistrationView(UserCreateView):
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user = self.user
        is_student = self.request.data.get('is_student')
        student_number = self.request.data.get('student_number')

        if is_student and not student_number:
            return Response({"error": "Student number is required for students."},
                            status=status.HTTP_400_BAD_REQUEST)

        return response


class CustomUserLoginView(APIView):

    def post(self, request, *args, **kwargs):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        user = authenticate(email=email, password=password)

        if user is not None:
            login(request, user)
            refresh = RefreshToken.for_user(user)

            return Response({
                "message": "User logged in successfully.",
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh)
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)


class CustomUserLogoutView(APIView):

    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get('refresh_token')

        if not refresh_token:
            return Response({"error": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            logout(request)
            return Response({"message": "User logged out successfully."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Invalid refresh token."}, status=status.HTTP_400_BAD_REQUEST)


