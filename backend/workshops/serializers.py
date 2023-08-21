from rest_framework import serializers
from .models import Event


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'title', 'location', 'price', 'image']
        

class EventDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        exclude = ("is_deleted",)
        


class EventRegistrationSerializer(serializers.Serializer):
    event_id = serializers.IntegerField()
    

class RegisteredEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['title', 'location', 'start_event_at', 'end_event_at']

