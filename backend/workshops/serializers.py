from rest_framework import serializers
from .models import Event,RegisterEvent


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        exclude = ("is_deleted",)
        
        
# class EventRegistrationSerializer(serializers.Serializer):
#     id = serializers.IntegerField()
    
class RegisterEventSerializer(serializers.Serializer):
        event_id = serializers.IntegerField(write_only=True)


class RegisteredEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['title', 'slug','location', 'start_event_at', 'end_event_at']

