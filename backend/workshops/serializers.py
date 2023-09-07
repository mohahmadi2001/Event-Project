from rest_framework import serializers
from .models import Event,RegisterEvent


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        exclude = ("is_deleted",)
        
         
class RegisterEventSerializer(serializers.Serializer):
        event_id = serializers.IntegerField(write_only=True)


class RegisteredEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['title', 'slug','location', 'start_event_at', 'end_event_at']

class RegisteredEventSerializer(serializers.ModelSerializer):
    event_id = serializers.IntegerField(source='event_related.id')
    event_title = serializers.CharField(source='event_related.title')
    event_slug = serializers.CharField(source='event_related.slug')
    event_location = serializers.CharField(source='event_related.location')
    event_start_time = serializers.DateTimeField(source='event_related.start_event_at')
    event_end_time = serializers.DateTimeField(source='event_related.end_event_at')

    class Meta:
        model = RegisterEvent
        fields = ['event_id','event_title', 'event_slug','event_location', 'event_start_time', 'event_end_time']