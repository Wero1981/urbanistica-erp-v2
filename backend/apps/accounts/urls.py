from django.urls import path
from .views import LoginView, CurrentUserView

urlpatterns = [
    path("login/", LoginView.as_view(), name="auth-login"),
    path("me/", CurrentUserView.as_view(), name="auth-me"),
]
