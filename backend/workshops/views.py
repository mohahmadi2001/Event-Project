from datetime import date
from rest_framework.views import APIView
from django.urls import reverse
from rest_framework.generics import ListAPIView,ListCreateAPIView
from rest_framework.response import Response
from rest_framework import status
from workshops.models import Event,RegisterEvent
from workshops.serializers import EventSerializer,RegisterEventSerializer,RegisteredEventSerializer
from rest_framework.permissions import IsAuthenticated,AllowAny
# Create your views here.

class EventListView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        events = Event.objects.all()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# class EventRegistrationView(ListCreateAPIView):
#     permission_classes = [AllowAny]
#     serializer_class = EventRegistrationSerializer
#     queryset = Event.objects.all()  

#     def create(self, request, *args, **kwargs):
#         user = request.user
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)

#         event_id = serializer.validated_data['id']

#         try:
#             event = self.queryset.get(id=event_id)
#         except Event.DoesNotExist:
#             return Response({"eventerror": "Event not found."}, status=status.HTTP_404_NOT_FOUND)

#         current_date = date.today()

#         if event.start_event_at.date() <= current_date:
#             return Response({"closeerror": "Event has already started. Registration is closed."}, status=status.HTTP_400_BAD_REQUEST)

#         if event.capacity <= 0:
#             return Response({"capacityerror": "Event capacity is full."}, status=status.HTTP_400_BAD_REQUEST)
        
#         event_registration = request.session.get("event_registration", {})
        
#         if event_id in event_registration:
#             return Response({"registerederror": "User has already registered for this event."}, status=status.HTTP_400_BAD_REQUEST)
        
#         event.capacity -= 1
#         event.participants.add(user)
#         event.save()

#         user.add_registered_event(event)

#         event_registration[event_id] = True
#         request.session["event_registration"] = event_registration
#         request.session.modified = True

#         return Response({"message": "Event registration successful."}, status=status.HTTP_200_OK)

class RegisterEventView(APIView):
    permission_classes = [AllowAny]
    

    def post(self, request, *args, **kwargs):
        user = request.user
        serializer = RegisterEventSerializer(data=request.data)
        if serializer.is_valid():
            event_id = serializer.validated_data.get('event_id')

            try:
                event = Event.objects.get(id=event_id)
            except Event.DoesNotExist:
                return Response({"eventerror": "Event not found."}, status=status.HTTP_404_NOT_FOUND)

            current_date = date.today()

            if event.start_event_at.date() <= current_date:
                return Response({"closeerror": "Event has already started. Registration is closed."}, status=status.HTTP_400_BAD_REQUEST)

            if event.capacity <= 0:
                return Response({"capacityerror": "Event capacity is full."}, status=status.HTTP_400_BAD_REQUEST)

            existing_registration = RegisterEvent.objects.filter(user=user, event_related=event).first()
            if existing_registration:
                return Response({"error": "You have already registered for this event."}, status=status.HTTP_400_BAD_REQUEST)

            register_event = RegisterEvent(user=user, event_related=event)
            register_event.save()

            event.capacity -= 1
            event.save()

            return Response({"message": "Registration successful."}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

 
class RegisteredEventListView(ListAPIView):
    serializer_class = RegisteredEventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return user.events.all()


