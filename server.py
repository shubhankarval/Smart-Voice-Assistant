from flask import Flask, render_template, request, jsonify
import main
import json
import base64

app = Flask(__name__)
app.debug = True
app.config["TEMPLATES_AUTO_RELOAD"]  = True

# venv: env\Scripts\activate
# To run: flask --app server run
# to close venv: deactivate


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/prompt", methods=['POST'])
def prompt():
    input_data = request.form['input_text']
    result = main.generate_response(input_data)
    alt_result = main.generate_response(input_data)
    return jsonify({'resp':result, 'alt_resp':alt_result})
    # input_data = request.form['input_text']
    # output_text = main.generate_response(input_data)
    # audio_content = main.generate_audio(output_text)
    # return jsonify({'output_text': output_text, 'audio_content': base64.b64encode(audio_content).decode('utf-8')})

@app.route('/save-audio', methods=['POST'])
def save_audio():
    audio_file = request.files['audio']
    audio_file.save('static/audio/request.wav')
    return 'Audio saved successfully!', 200

@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    data = json.loads(request.data)
    filename = data['filename']
    transcription = main.transcribe('static/audio/' + filename)
    return transcription

@app.route('/text-to-speech', methods=['POST'])
def text_to_speech():
    input_data = request.form['input_text']
    audio_content = main.generate_audio(input_data)
    return jsonify({'audio_content': base64.b64encode(audio_content).decode('utf-8')})

if __name__ == '__main__':
    app.run(debug=True)