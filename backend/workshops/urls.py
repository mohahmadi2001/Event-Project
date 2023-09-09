from django.urls import path
from workshops.views import EventListView,RegisterEventView


app_name = 'workshops'
urlpatterns = [
    path('', EventListView.as_view(), name='events-list'),  
    path('register-event/', RegisterEventView.as_view(), name='register-event'),
]
