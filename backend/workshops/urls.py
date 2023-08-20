from django.urls import path
from workshops.views import EventListView,EventDetailView


app_name = 'workshops'
urlpatterns = [
    path('', EventListView.as_view(), name='home-events'),  
    path('events/<int:pk>/', EventDetailView.as_view(), name='event-detail'),
]
