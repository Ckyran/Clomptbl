#!/usr/bin/env python3
"""Serveur statique anti-cache pour CptblT.

Usage : python3 serve.py [port]      (port par défaut : 8000, ou variable PORT)

Le site est servi depuis le dossier de ce script, lié sur 0.0.0.0, avec des
en-têtes « Cache-Control: no-store » pour que le navigateur recharge toujours
la dernière version des fichiers pendant le développement.
"""
import os
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.abspath(__file__))


class NoCacheHandler(SimpleHTTPRequestHandler):
    # Garantit un type MIME correct pour les modules ES, quel que soit l'OS.
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".js": "text/javascript; charset=utf-8",
        ".mjs": "text/javascript; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".html": "text/html; charset=utf-8",
        ".json": "application/json; charset=utf-8",
    }

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else int(os.environ.get("PORT", "8000"))
    handler = partial(NoCacheHandler, directory=ROOT)
    with ThreadingHTTPServer(("0.0.0.0", port), handler) as httpd:
        print(f"CptblT servi sur http://0.0.0.0:{port}  (Ctrl+C pour arrêter)")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nArrêt du serveur.")


if __name__ == "__main__":
    main()
