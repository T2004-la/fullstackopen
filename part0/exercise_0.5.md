```mermaid
sequenceDiagram
participant browser
participant server
browser->>server: HTTP GET [https://studies.cs.helsinki.fi/exampleapp/spa](https://studies.cs.helsinki.fi/exampleapp/spa)
activate server
server-->>browser: HTML document
deactivate server

browser->>server: HTTP GET [https://studies.cs.helsinki.fi/exampleapp/main.css](https://studies.cs.helsinki.fi/exampleapp/main.css)
activate server
server-->>browser: the css file
deactivate server

browser->>server: HTTP GET [https://studies.cs.helsinki.fi/exampleapp/spa.js](https://studies.cs.helsinki.fi/exampleapp/spa.js)
activate server
server-->>browser: the JavaScript file (spa.js)
deactivate server

Note right of browser: The browser starts executing the JavaScript code that fetches the JSON from the server

browser->>server: HTTP GET [https://studies.cs.helsinki.fi/exampleapp/data.json](https://studies.cs.helsinki.fi/exampleapp/data.json)
activate server
server-->>browser: [{ "content": "HTML is easy", "date": "2026-1-1" }, ... ]
deactivate server

Note right of browser: The browser executes the callback function that renders the notes
