from rest_framework.generics import CreateAPIView
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
# from rest_framework_simplejwt.tokens import RefreshToken

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
            
        try:
            validate_password(serializer.validated_data.get('password'))
        except ValidationError as e:
            return Response(
                {"error": e.messages},
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
            login(request, user) 
            return Response({"message": "User logged in successfully."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)


# class UserLoginView(APIView):
#     serializer_class = UserLoginSerializer

#     def post(self, request, *args, **kwargs):
#         serializer = self.serializer_class(data=request.data)
#         serializer.is_valid(raise_exception=True)

#         email = serializer.validated_data['email']
#         password = serializer.validated_data['password']

#         user = authenticate(email=email, password=password)

#         if user is not None:
#             login(request, user)
#             refresh = RefreshToken.for_user(user)
            
#             return Response({
#                 "message": "User logged in successfully.",
#                 "access_token": str(refresh.access_token),
#                 "refresh_token": str(refresh)
#             }, status=status.HTTP_200_OK)
#         else:
#             return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)


class UserLogoutView(APIView):

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        logout(request)
        return Response({"message": "User logged out successfully."}, status=status.HTTP_200_OK)


class UserProfileView(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            user = request.user
            serializer = UserProfileSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "User is not authenticated."}, status=status.HTTP_401_UNAUTHORIZED)



class UserProfileUpdateView(APIView):
    def put(self, request):
        user = request.user
        serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class ChangePasswordView(APIView):
    def put(self, request):
        user = request.user
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            old_password = serializer.validated_data.get('old_password')
            new_password = serializer.validated_data.get('new_password')

            if not check_password(old_password, user.password):
                return Response({"error": "Invalid old password."}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.save()
            return Response({"message": "Password changed successfully."}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


