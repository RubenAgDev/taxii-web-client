from flask import Flask, request, jsonify
from flask_cors import CORS
from taxii2client.v21 import Server, Collection, ApiRoot
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/taxii/server-info', methods=['POST'])
def get_server_info():
    data = request.json
    server_url = data.get('server_url')
    
    try:
        # Connect to the TAXII server
        server = Server(server_url)
        
        # Return server information
        return jsonify({
            'title': server.title,
            'description': server.description,
            'contact': server.contact,
            'api_roots': [api_root.url for api_root in server.api_roots],
            'version': server.version
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/taxii/collections', methods=['POST'])
def get_collections():
    data = request.json
    server_url = data.get('server_url')
    
    try:
        # Connect to the TAXII server
        server = Server(server_url)
        
        collections = []
        # Get collections from all API roots
        for api_root in server.api_roots:
            for collection in api_root.collections:
                collections.append({
                    'id': collection.id,
                    'title': collection.title,
                    'description': collection.description,
                    'can_read': collection.can_read,
                    'can_write': collection.can_write,
                    'media_types': collection.media_types,
                    'added': collection.added
                })
        
        return jsonify(collections)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/taxii/objects', methods=['POST'])
def get_objects():
    data = request.json
    server_url = data.get('server_url')
    collection_id = data.get('collection_id')
    params = data.get('params', {})
    
    try:
        # Connect to the TAXII server
        server = Server(server_url)
        
        # Find the collection
        target_collection = None
        for api_root in server.api_roots:
            for collection in api_root.collections:
                if collection.id == collection_id:
                    target_collection = collection
                    break
            if target_collection:
                break
        
        if not target_collection:
            return jsonify({'error': 'Collection not found'}), 404
        
        # Get objects from the collection
        objects = target_collection.get_objects(**params)
        
        # Convert objects to JSON-serializable format
        result = []
        for obj in objects.get('objects', []):
            result.append(obj)
        
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/taxii/object', methods=['POST'])
def get_object():
    data = request.json
    server_url = data.get('server_url')
    collection_id = data.get('collection_id')
    object_id = data.get('object_id')
    
    try:
        # Connect to the TAXII server
        server = Server(server_url)
        
        # Find the collection
        target_collection = None
        for api_root in server.api_roots:
            for collection in api_root.collections:
                if collection.id == collection_id:
                    target_collection = collection
                    break
            if target_collection:
                break
        
        if not target_collection:
            return jsonify({'error': 'Collection not found'}), 404
        
        # Get the specific object
        obj = target_collection.get_object(object_id)
        
        return jsonify(obj)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
