import json
from asgiref.sync import sync_to_async

from channels.generic.websocket import AsyncWebsocketConsumer
from .models import History
from .modelentry.usage import llama_generate



class ChatbotConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

        # get chat history
        chat_history = []
        async for record in History.objects.all():
            chat_history.append([record.user_message, record.assistant_message])

        # send
        await self.send(text_data=json.dumps({
            "process_state": "opening",
            "chat_history": chat_history
        }))

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        text_data_decoded = json.loads(text_data)
        print(text_data_decoded)

        if text_data_decoded['action'] == 'generate':
            # pending response
            pending_History = await History.objects.acreate(
                user_message=text_data_decoded['user_prompt'],
                assistant_message="<|pending|>"
            )
            chat_history = []
            async for record in History.objects.all():
                chat_history.append([record.user_message, record.assistant_message])

            await self.send(text_data=json.dumps({
                "process_state": "pending",
                "chat_history": chat_history
            }))

            # generation response
            generated_message = await generate(text_data_decoded['user_prompt'],
                                               chat_history=chat_history)
            last_turn = await History.objects.alast()
            last_turn.assistant_message = generated_message
            await sync_to_async(last_turn.save)()

            chat_history = []
            async for record in History.objects.all():
                chat_history.append([record.user_message, record.assistant_message])
            await self.send(text_data=json.dumps({
                "process_state": "completed",
                "chat_history": chat_history
            }))

        elif text_data_decoded['action'] == 'reset':
            chat_history = await History.objects.all().adelete()
            await self.send(text_data=json.dumps({
                "process_state": "reset",
            }))


##
async def generate(user_prompt, chat_history):
    assistant_message = await sync_to_async(llama_generate)(user_prompt, chat_history=chat_history)
    return assistant_message