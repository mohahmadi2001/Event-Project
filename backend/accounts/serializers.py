from rest_framework import serializers
from django.contrib.auth import get_user_model
from djoser.serializers import UserCreateSerializer,UserSerializer,SetPasswordSerializer


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'email', 'mobile', 'is_student', 'student_number', 'has_voted',"student_entry_year")

    
class CustomRegistrationSerializer(UserCreateSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
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
        user = User.objects.create(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            is_student=validated_data['is_student'],
            student_number=validated_data['student_number']
        )

        user.set_password(validated_data['password'])
        user.save()
        
        return user
    

class UserUpdateSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        fields = (
            'first_name', 
            'last_name', 
            'mobile',
            'student_number',
        )
    
    
class StudentInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User  
        fields = ('student_number','first_name','last_name' ,'has_voted')    
     
        


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_new_password = serializers.CharField(required=True)