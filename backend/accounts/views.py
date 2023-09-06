from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView,UpdateAPIView
from rest_framework import status
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from .serializers import (
                          CustomRegistrationSerializer,
                          UserUpdateSerializer,
                          CustomSetPasswordSerializer,
                          StudentInfoSerializer
                        )
from rest_framework.permissions import AllowAny
from rest_framework import generics

User = get_user_model()

class UserRegistrationView(CreateAPIView):
    permission_classes = [AllowAny]
    queryset = User.objects.all()
    serializer_class = CustomRegistrationSerializer

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


class UserUpdateView(UpdateAPIView):
    serializer_class = UserUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    

class CustomSetPasswordView(APIView):
    serializer_class = CustomSetPasswordSerializer

    def put(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = self.request.user

        if not user.check_password(serializer.validated_data['old_password']):
            return Response({"old_password": "Wrong password."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(serializer.validated_data['new_password'])
        user.save()

        return Response({"message": "Password changed successfully."}, status=status.HTTP_200_OK)


class StudentInfoAPIView(generics.ListAPIView):
    queryset = User.objects.filter(is_student=True)  
    serializer_class = StudentInfoSerializer
    permission_classes = [IsAuthenticated] 