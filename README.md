# Socket.IO Server Documentation

This document provides an overview of the Socket.IO server implementation in `server.js`. It explains the key features, events, and utility functions used in the server.

---

## Features

- **Real-time Communication**: Supports real-time messaging for conversations and rooms.
- **Database Integration**: Listens for PostgreSQL notifications and broadcasts updates to relevant clients.
- **Room and Conversation Management**: Handles dynamic joining and leaving of rooms and conversations.
- **Unread Messages Tracking**: Tracks and manages unread messages for conversations.
- **Custom Room Events**: Supports custom events like `entrance`, `message`, and `leave` for rooms.

---

## Environment Variables

The server uses the following environment variables for configuration:

| Variable             | Default Value      | Description                          |
|----------------------|--------------------|--------------------------------------|
| `POSTGRES_USER`      | `postgres`         | PostgreSQL username                  |
| `POSTGRES_HOST`      | `localhost`        | PostgreSQL host                      |
| `POSTGRES_DB`        | `practice`         | PostgreSQL database name             |
| `POSTGRES_PASSWORD`  | `Aloyebolu.123`    | PostgreSQL password                  |
| `POSTGRES_PORT`      | `5432`             | PostgreSQL port                      |

---

## Socket.IO Events

### Connection Events

- **`connection`**: Triggered when a client connects. The server validates the user and joins them to their personal room.
- **`disconnect`**: Triggered when a client disconnects. Logs the disconnection event.

---

### Room Events

#### `join_room`
- **Description**: Joins a user to a specific room.
- **Payload**:
  ```json
  {
    "roomId": "string"
  }
  ```
- **Example**:
  ```javascript
  socket.emit('join_room', { roomId: '123' });
  ```

#### `leave_room`
- **Description**: Removes a user from a specific room.
- **Payload**:
  ```json
  {
    "roomId": "string"
  }
  ```
- **Example**:
  ```javascript
  socket.emit('leave_room', { roomId: '123' });
  ```

#### `room_event`
- **Description**: Handles custom room events like `entrance`, `message`, and `leave`.
- **Payload**:
  ```json
  {
    "roomId": "string",
    "message": "string",
    "type": "string"
  }
  ```
- **Types**:
  - `entrance`: Broadcasts a user's entrance to the room.
  - `message`: Sends a message to all participants in the room.
  - `leave`: Notifies participants that a user has left the room.
  - `send_invite`: Notifies the invited user to accept or reject the request to join the speakers
  - `request`: Notifies the moderators of the room wether to accept or reject a user
  - `follow`: Notifies everyone in the room that a user followed the room holder

---

### Conversation Events

#### `join_conversation`
- **Description**: Joins a user to a specific conversation.
- **Payload**:
  ```json
  {
    "conversationId": "string"
  }
  ```

#### `leave_conversation`
- **Description**: Removes a user from a specific conversation.
- **Payload**:
  ```json
  {
    "conversationId": "string"
  }
  ```

#### `message`
- **Description**: Sends a message to a conversation or room.
- **Payload**:
  ```json
  {
    "text": "string",
    "conversationId": "string",
    "roomId": "string"
  }
  ```

#### `mark_read`
- **Description**: Marks all messages in a conversation as read.
- **Payload**:
  ```json
  {
    "conversationId": "string"
  }
  ```

#### `get_unread_messages`
- **Description**: Fetches unread messages for a specific conversation.
- **Payload**:
  ```json
  {
    "conversationId": "string"
  }
  ```

#### `get_unread_conversations`
- **Description**: Fetches the count of unread messages for all conversations.
- **Payload**:
  ```json
  {
    "userId": "string"
  }
  ```

---

## Utility Functions

### `sendToRoom(roomId, data, excludedUsers, type)`
- **Description**: Sends data to all participants of a room, excluding specified users.
- **Parameters**:
  - `roomId`: The ID of the room.
  - `data`: The data to send.
  - `excludedUsers`: Array of user IDs to exclude.
  - `type`: The type of event (e.g., `entrance`, `message`, `leave`).

### `getRoomParticipants(roomId)`
- **Description**: Fetches all participants of a room.
- **Parameters**:
  - `roomId`: The ID of the room.
- **Returns**: A list of user IDs.

### `getConversationParticipants(conversationId)`
- **Description**: Fetches all participants of a conversation.
- **Parameters**:
  - `conversationId`: The ID of the conversation.
- **Returns**: A list of user IDs.

### `emitToUsers(userIds, event, data)`
- **Description**: Emits a specific event to a list of user IDs.
- **Parameters**:
  - `userIds`: List of user IDs.
  - `event`: The event name.
  - `data`: The data to emit.

---

## Running the Server

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   node server.js
   ```

3. The server will run on `http://localhost:4000`.

---

## Notes

- Ensure the PostgreSQL database is running and accessible with the correct credentials.
- Use a proper `.env` file to manage sensitive environment variables.
- The server uses `Socket.IO` for real-time communication and listens for PostgreSQL notifications to broadcast updates.
# study_tool
# study_tool
