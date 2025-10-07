#!/usr/bin/env python3
"""
Simple CORS proxy server to test PathwiseAgent
Run this on port 3001 to proxy requests to your agent on port 8000
"""
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import requests
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

AGENT_BASE_URL = "http://localhost:8000"

@app.route('/api/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
def proxy(path):
    """Proxy requests to your delivery agent"""
    
    if request.method == 'OPTIONS':
        # Handle preflight requests
        response = Response()
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = '*'
        return response
    
    url = f"{AGENT_BASE_URL}/{path}"
    
    try:
        # Forward the request to your agent
        if request.method == 'GET':
            resp = requests.get(url, params=request.args)
        else:
            resp = requests.post(url, 
                               json=request.get_json() if request.is_json else None,
                               data=request.get_data() if not request.is_json else None,
                               headers={'Content-Type': 'application/json'})
        
        # Return the response
        response = Response(
            resp.content,
            status=resp.status_code,
            headers=dict(resp.headers)
        )
        
        # Add CORS headers now
        response.headers['Access-Control-Allow-Origin'] = '*'
        return response
        
    except Exception as e:
        return jsonify({"error": f"Proxy error: {str(e)}"}), 500

@app.route('/test')
def test():
    """Test endpoint"""
    return jsonify({"status": "CORS proxy server is running", "agent_url": AGENT_BASE_URL})

if __name__ == '__main__':
    print(f"CORS Proxy Server starting...")
    print(f"Proxying requests from http://localhost:3001/api/* to {AGENT_BASE_URL}/*")
    print(f"Test the proxy: http://localhost:3001/test")
    
    app.run(host='0.0.0.0', port=3001, debug=True)