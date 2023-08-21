from django.urls import path
from workshops.views import EventListView,EventDetailView,EventRegistrationView


app_name = 'workshops'
urlpatterns = [
    path('', EventListView.as_view(), name='events-list'),  
    path('<int:pk>/', EventDetailView.as_view(), name='event-detail'),
    path('register-event/', EventRegistrationView.as_view(), name='register-event'),
]
