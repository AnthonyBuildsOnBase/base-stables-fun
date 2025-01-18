import http.server
import socketserver
import sys
import os

# Try different ports if the default is in use
PORTS = [8000, 3000, 8080, 5000]  # Prioritize port 8000

def start_server(port):
    try:
        # Ensure we're serving from the correct directory
        os.chdir(os.path.dirname(os.path.abspath(__file__)))

        Handler = http.server.SimpleHTTPRequestHandler
        with socketserver.TCPServer(("0.0.0.0", port), Handler) as httpd:
            print(f"Server started successfully on port {port}")
            print(f"Serving files from: {os.getcwd()}")
            print(f"Available files: {', '.join(os.listdir())}")
            httpd.serve_forever()
    except Exception as e:
        print(f"Error on port {port}: {str(e)}")
        return False
    return True

def main():
    for port in PORTS:
        print(f"Attempting to start server on port {port}...")
        if start_server(port):
            break
    else:
        print("Failed to start server on any available port")
        sys.exit(1)

if __name__ == "__main__":
    main()