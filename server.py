#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
简单的 HTTP 服务器，支持 UTF-8 编码
用于本地开发和测试
"""

import http.server
import socketserver
from pathlib import Path

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """自定义 HTTP 请求处理器，确保正确的 UTF-8 编码"""
    
    def end_headers(self):
        # 为所有响应添加 UTF-8 编码
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()
    
    def guess_type(self, path):
        """重写 guess_type 方法，确保文本文件使用 UTF-8"""
        mimetype = super().guess_type(path)
        
        # 为文本文件添加 UTF-8 编码
        if mimetype and mimetype.startswith('text/'):
            return f'{mimetype}; charset=utf-8'
        elif path.endswith('.js'):
            return 'application/javascript; charset=utf-8'
        elif path.endswith('.json'):
            return 'application/json; charset=utf-8'
        
        return mimetype

if __name__ == '__main__':
    Handler = MyHTTPRequestHandler
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"╔════════════════════════════════════════════╗")
        print(f"║  CloudMedia 本地开发服务器已启动           ║")
        print(f"╠════════════════════════════════════════════╣")
        print(f"║  访问地址: http://localhost:{PORT}         ║")
        print(f"║  按 Ctrl+C 停止服务器                      ║")
        print(f"╚════════════════════════════════════════════╝")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n服务器已停止")

