"""
ASGI config for mrwhy project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os

from django.urls import path
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from .consumers import ChatbotConsumer

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mrwhy.settings")

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": URLRouter([
            path("ws/chatbot", ChatbotConsumer.as_asgi())
        ])
    }
)