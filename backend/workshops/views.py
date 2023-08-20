from rest_framework.views import APIView
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response
from rest_framework import status
from workshops.models import Event
from workshops.serializers import EventSerializer,EventDetailSerializer
# Create your views here.

class EventListView(APIView):
    def get(self, request):
        events = Event.objects.all()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class EventDetailView(RetrieveAPIView):
    queryset = Event.objects.all()
    serializer_class = EventDetailSerializer