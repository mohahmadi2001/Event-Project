from django.urls import path
from workshops.views import EventListView,EventRegistrationView


app_name = 'workshops'
urlpatterns = [
    path('', EventListView.as_view(), name='events-list'),  
    path('register-event/', EventRegistrationView.as_view(), name='register-event'),
]
