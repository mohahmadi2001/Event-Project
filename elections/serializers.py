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
            'entry_year',
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


class ApprovedCandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = ('id', 'first_name', 'last_name')


class VoteSerializer(serializers.Serializer):
    candidate_id = serializers.PrimaryKeyRelatedField(queryset=Candidate.get_approved_candidates())


class ElectionVoteSerializer(serializers.Serializer):
    candidates = VoteSerializer(many=True)
    
    
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

class ElectionResultsSerializer(serializers.Serializer):
    candidates_with_votes = CandidateWithVotesSerializer(many=True)
    total_participants = serializers.IntegerField()
    total_candidates = serializers.IntegerField()

    
