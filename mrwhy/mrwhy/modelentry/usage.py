import os

from transformers import pipeline, AutoModelForCausalLM, AutoTokenizer
from langchain_huggingface import HuggingFacePipeline
from langchain_core.prompts import PromptTemplate


#load model and tokenizer from local
# path = os.path.join( os.path.dirname(os.path.abspath(__file__)),"saved_models")
#
# print('models loading')
# model = AutoModelForCausalLM.from_pretrained(path)
# tokenizer = AutoTokenizer.from_pretrained(path)
# pipe = pipeline("text-generation",
#                 model=model,
#                 tokenizer=tokenizer,
#                 max_new_tokens=256,
#                 pad_token_id=12808,
#                 return_full_text=False)
# print('loading successfully')

# load model and tokenizer from hugging face
print('models loading')
pipe = pipeline("text-generation",
                model='meta-llama/Llama-3.2-1B-Instruct',
                max_new_tokens=256,
                pad_token_id=12808,
                return_full_text=False)
print('loading successfully')

# hf pipeline
hf = HuggingFacePipeline(pipeline=pipe)

# craft prompt template
system_prompt = PromptTemplate.from_template(''''<|begin_of_text|><|start_header_id|>system<|end_header_id|>
You are a helpful assistant. Your task is answering user's questions. If you do not know the answer, just respond that you do not know it.
The below is chat history of the user and the assistant. User's question can be related to the chat history, the assistant should remember it to improve the conversation.
{chat_history}

Current chat:
<|eot_id|><|start_header_id|>user<|end_header_id|>
{user_prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>''')

# chain
model_chain = system_prompt | hf

# preload function
def preload_models():
    return None

#
def chat_history_to_str(chat_history):
    str = ''
    for turn_idx in range(len(chat_history)-1):
        str += 'user: ' + chat_history[turn_idx][0] + '\n'
        str += 'assistant: ' + chat_history[turn_idx][1] + '\n'
    return str

### generation function
def llama_generate(user_prompt, chat_history):
    str_chat_history = chat_history_to_str(chat_history)
    assistant_message = model_chain.invoke({'chat_history': str_chat_history,
                       'user_prompt': user_prompt})
    return assistant_message.lstrip()