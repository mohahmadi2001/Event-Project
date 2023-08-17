from rest_framework import serializers
from .models import Candidate, Election, Vote

class CandidateRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = (
            'first_name',
            'last_name',
            'mobile',
            'student_number'
        )
        
    def validate(self, data):
        required_fields = ['first_name', 'last_name', 'mobile', 'student_number']
        for field in required_fields:
            if not data.get(field):
                raise serializers.ValidationError(f"{field} is required.")
        return data

