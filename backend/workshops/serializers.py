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
        
    