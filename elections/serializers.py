from rest_framework import serializers
from .models import Candidate, Election, ElectionOption, Vote

class CandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = '__all__'

class ElectionOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElectionOption
        fields = '__all__'

class ElectionSerializer(serializers.ModelSerializer):
    options = ElectionOptionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Election
        fields = '__all__'

class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = '__all__'
