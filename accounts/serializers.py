from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    student_number = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = (
            'first_name', 
            'last_name', 
            'email', 
            'mobile',
            'is_student',
            'student_number',
            'password', 
            'confirm_password'
        )

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        if data.get('is_student') and not data.get('student_number'):
            raise serializers.ValidationError("Student number is required for students.")
        return data
    
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data.get('password'))
        return super().create(validated_data)
    

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    class Meta:
        fields = ('email', 'password')

