from datetime import date
from rest_framework.views import APIView
from django.urls import reverse
from rest_framework.generics import RetrieveAPIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status
from workshops.models import Event
from workshops.serializers import EventSerializer,EventDetailSerializer,EventRegistrationSerializer,RegisteredEventSerializer
from rest_framework.permissions import IsAuthenticated
# Create your views here.

class EventListView(APIView):
    def get(self, request):
        events = Event.objects.all()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class EventDetailView(RetrieveAPIView):
    queryset = Event.objects.all()
    serializer_class = EventDetailSerializer
    
    
class EventRegistrationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        serializer = EventRegistrationSerializer(data=request.data)

        if serializer.is_valid():
            event_id = serializer.validated_data['event_id']

            try:
                event = Event.objects.get(id=event_id)
            except Event.DoesNotExist:
                return Response({"error": "Event not found."}, status=status.HTTP_404_NOT_FOUND)
        
        current_date = date.today()

        if event.start_event_at <= current_date:
            return Response({"error": "Event has already started. Registration is closed."}, status=status.HTTP_400_BAD_REQUEST)

        if event.capacity <= 0:
            return Response({"error": "Event capacity is full."}, status=status.HTTP_400_BAD_REQUEST)

        if user.event.filter(id=event_id).exists():
            return Response({"error": "User has already registered for this event."}, status=status.HTTP_400_BAD_REQUEST)

        event.capacity -= 1
        event.participants.add(user)
        event.save()

        user.add_registered_event(event)
        return Response({"message": "Event registration successful."}, status=status.HTTP_200_OK)
    
    def get_error_link(self):
        return reverse('workshops:events-list')
    

class RegisteredEventListView(ListAPIView):
    serializer_class = RegisteredEventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return user.event.all()


