```mermaid
sequenceDiagram
participant browser
participant server
Note right of browser: The browser executes the event handler, prevents default form submit, updates DOM locally, and sends the new note to server

browser->>server: HTTP POST [https://studies.cs.helsinki.fi/exampleapp/new_note_spa](https://studies.cs.helsinki.fi/exampleapp/new_note_spa) (JSON data)
activate server
server-->>browser: HTTP Status Code 201 Created
deactivate server
