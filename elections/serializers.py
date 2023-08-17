from django.utils import timezone
from rest_framework import serializers
from .models import Candidate, Election, Vote

class CandidateRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = (
            'first_name',
            'last_name',
            'mobile',
            'student_number',
            'election'
        )
        
    def validate(self, data):
        
        election = self.context.get('election')
        if election:
            now = timezone.now()  
            if not (election.candidate_registration_start <= now <= election.candidate_registration_end):
                raise serializers.ValidationError("Candidate registration is not open at the moment.")
        else:
            raise serializers.ValidationError("Election information is missing in context.")
        
        required_fields = ['first_name', 'last_name', 'mobile', 'student_number']
        for field in required_fields:
            if not data.get(field):
                raise serializers.ValidationError(f"{field} is required.")
        
        return data

