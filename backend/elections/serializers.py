from django.utils import timezone
from rest_framework import serializers
from .models import Candidate, Election, Vote


class ElectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Election
        exclude = ("is_deleted",)


class CandidateRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = (
            'first_name',
            'last_name',
            'mobile',
            'student_number',
            'entry_year',
            'description',
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
        
        required_fields = ['first_name', 'last_name', 'mobile', 'student_number','description']
        for field in required_fields:
            if not data.get(field):
                raise serializers.ValidationError(f"{field} is required.")
        
        return data


class ApprovedCandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = ('id', 'first_name', 'last_name','entry_year')



    
    
class CandidateWithVotesSerializer(serializers.Serializer):
    candidate = serializers.SerializerMethodField()
    votes_count = serializers.IntegerField()

    def get_candidate(self, obj):
        candidate = obj["candidate"]
        return {
            "id": candidate.id,
            "first_name": candidate.first_name,
            "last_name": candidate.last_name,
            "entry_year": candidate.entry_year
        }

class ElectionResultSerializer(serializers.Serializer):
    candidate_id = serializers.IntegerField(source='candidate__id')
    first_name = serializers.CharField(source='candidate__first_name')
    last_name = serializers.CharField(source='candidate__last_name')
    entry_year = serializers.IntegerField(source='candidate__entry_year')
    votes_count = serializers.IntegerField()

    
class VoteSerializer(serializers.Serializer):
    election_id = serializers.IntegerField(write_only=True)
    candidate_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True
    )