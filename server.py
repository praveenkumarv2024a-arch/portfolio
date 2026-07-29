import http.server
import socket
import socketserver

PORT = 3000

class DualStackHTTPServer(socketserver.TCPServer):
    def __init__(self, server_address, RequestHandlerClass):
        self.address_family = socket.AF_INET6
        super().__init__(server_address, RequestHandlerClass)

    def server_bind(self):
        self.socket.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
        return super().server_bind()

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

socketserver.TCPServer.allow_reuse_address = True

try:
    with DualStackHTTPServer(("::", PORT), QuietHandler) as httpd:
        print(f"Dual-stack server listening on http://localhost:{PORT} and http://127.0.0.1:{PORT}")
        httpd.serve_forever()
except Exception as e:
    with socketserver.TCPServer(("", PORT), QuietHandler) as httpd:
        print(f"IPv4 server listening on http://127.0.0.1:{PORT}")
        httpd.serve_forever()
