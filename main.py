import openai
import config
from gtts import gTTS
import os
# from pydub import AudioSegment

openai.api_key = config.OPENAI_API_KEY

chats = []

def generate_response(prompt):
    model_engine = "text-davinci-003"
    prompt = (f"{prompt}")

    completions = openai.Completion.create(
        engine=model_engine,
        prompt=prompt,
        max_tokens=1024,
        n=1,
        stop=None,
        temperature=0.9,
    )

    message = completions.choices[0].text
    return message.strip()

def generate_audio(text):
    tts = gTTS(text, lang='en', slow=False)
    tts.save('audio.mp3')
    with open('audio.mp3', 'rb') as f:
        audio_content = f.read()
    os.remove('audio.mp3')
    return audio_content

def transcribe(audio):
  audio_file = open(audio, "rb")
  transcript = openai.Audio.transcribe("whisper-1", audio_file,language = "en", response_format="json")
  return transcript.text