import os
from flask import Flask, flash, request, redirect, url_for, session, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from flask_cors import CORS, cross_origin
import json
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('HELLO WORLD')


UPLOAD_FOLDER = '.'
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])

app = Flask(__name__, static_folder=os.path.abspath('/static'), static_url_path=os.path.abspath('/static'))
app.secret_key = 'super secret key'
APP_ROOT = os.path.dirname(os.path.abspath(__file__))
# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/upload', methods=['POST'])
def fileUpload():
    if request.method == 'POST':
        target=os.path.join(APP_ROOT,'static','upload')
        if not os.path.isdir(target):
            os.mkdir(target)
        file = request.files['file'] 
        filename = secure_filename(file.filename)
        destination="/".join([target, filename])
        file.save(destination)
        session['uploadFilePath']=destination
        context = {}
        context['filename'] = filename
    return jsonify(**context), 201

@app.route('/annotate/<path:filename>', methods=['POST'])
def imageAnnotate(filename):
    if request.method == 'POST':
        context = {}
        context['filename'] = filename
        context['annotation'] = request.form.get('annotation')

        #create a json files
        try:
            with open(APP_ROOT + '/static/data.json',"w+") as f:
                json.dump(context, f)
        except FileNotFoundError:
            with open(APP_ROOT + '/static/data.json',"a+") as f:
                json.dump(context, f)
        print(context)
    return jsonify(**context), 201

@app.route('/static/upload/<path:filename>')
def serve_static(filename):
    return send_from_directory(os.path.join(APP_ROOT, 'static','upload'),filename)   

if __name__ == "__main__":

    app.run(debug=True, host="0.0.0.0", port=5000, use_reloader=False)

CORS(app, expose_headers='Authorization')