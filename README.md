# ReactNativeDemoChatApp

A modern, real-time chat application built with **React Native** and **Firebase**.  
It showcases secure email/password authentication, one-on-one and group messaging, presence, unread indicators, and careful separation of concerns suitable for professional codebases.

---

## 🧭 Navigation
- [Features](#-features)
- [Architecture](#-architecture)
- [Screenshots](#-screenshots)
- [Core Implementations](#-core-implementations)
  - [Authentication](#authentication)
  - [Database & Models](#database--models)
  - [Repositories (Data Access)](#repositories-data-access)
  - [Services](#services)
  - [Utilities](#utilities)
  - [UI Components & Screens](#ui-components--screens)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Performance Notes](#-performance-notes)
- [License](#-license)

---

## ✨ Features

- 🔐 **Secure Authentication** — Email/password with persistent sessions (AsyncStorage).
- 💬 **Real-Time Messaging** — Firestore listeners for instant updates.
- 👥 **Group Chat** — Create and browse group conversations.
- 🔔 **Unread Indicators** — Per-user unread counts and last-read timestamps.
- 🟢 **Online Presence** — Online/offline tracking with last seen.
- ⚡ **Performance** — Lazy loading, memoization, and tuned FlatLists.
- 🚦 **Rate Limiting** — Client-side message throttling for spam prevention.

- 

---

## 🏗 Architecture

A layered design that keeps UI lean and business logic testable:

<img width="995" height="331" alt="architecture" src="https://github.com/user-attachments/assets/6d4c1f0e-491d-4104-8775-9f08e197a859" />

- **Secure password handling**
- **Session persistence** with React Native Auth persistence
- **Deterministic IDs** for 1:1 conversations
- **Service façade** to keep screens/components clean

---

## 🖼 Screenshots
<img width="297" height="609" alt="image" src="https://github.com/user-attachments/assets/290f1f22-699f-4575-8cfe-5d536fee004d" />  <img width="302" height="640" alt="image" src="https://github.com/user-attachments/assets/ecf4d3a3-3162-44ec-b2f0-0092c8083e60" /> <img width="302" height="613" alt="image" src="https://github.com/user-attachments/assets/b2ed416a-a099-413a-9c7e-ee33a552ca3a" /> <img width="302" height="501" alt="image" src="https://github.com/user-attachments/assets/4f160b04-744e-4d5f-9965-6ca629f344f1" /> <img width="302" height="612" alt="image" src="https://github.com/user-attachments/assets/20e7eac0-8e4a-44f5-bd6c-88daa261fdb8" /> <img width="301" height="612" alt="image" src="https://github.com/user-attachments/assets/607451c2-a387-4458-be8e-597d126b89f8" />








---
## 🔧 Core Implementations — Deep Dive

## 🔐 Authentication & Context — Overview

Authentication in this app is managed using **Firebase Auth** and centralized in a custom **AuthContext**.  
This allows the entire app to access the current user's state and ensures consistent handling of login, logout, and online presence.  
Sessions are persisted across app restarts using **AsyncStorage**, enabling seamless user experience.

### 📁 Key File

- **`src/contexts/AuthContext.js`**  
  This is the central provider that:
  - Initializes Firebase Auth with session persistence
  - Listens to auth state changes
  - Updates user presence (online/offline)
  - Stores the current user in context
  - Exposes user and auth-related operations to the app

 ### 🔁 Flow Summary
App starts
- Auth context initializes
- Check persisted session (device storage)
- If session exists
- Restore user
- Mark user online
- Load initial data (users/conversations)
- If no session
- Show login screen
- On successful login
- Create/refresh profile in database
- Mark user online
- Navigate to main appApp closes / user signs out
- Mark user offline
- Clear in-memory state

### ✅ What It Implements

- **🔐 Firebase Auth Integration**
  - Email/password authentication
  - Secure session tokens handled by Firebase backend

- **📦 Persistent Sessions with AsyncStorage**
  - Uses `getReactNativePersistence(AsyncStorage)` to keep users signed in between app launches

- **🟢 Presence Tracking**
  - Sets `isOnline = true` on login
  - Updates `lastSeen` and `isOnline = false` on logout or unmount

- **🧠 Global User State**
  - `user` and `loading` states available throughout the app via `useAuth()`

- **📤 Graceful Teardown**
  - Automatically sets user offline when app is closed or context is unmounted

## 🔌 Firebase Services — Overview

Firebase provides the backend foundation for authentication, data storage, and real-time messaging in this app.  
All services are initialized and exposed in a single config file to keep setup consistent and centralized.

### 📁 Key File

- **`src/services/firebaseConfig.js`**  
  This file is responsible for:
  - Initializing the **Firebase app**
  - Setting up **Firebase Authentication** with persistent login using `AsyncStorage`
  - Initializing the **Cloud Firestore** database
  - Exporting the `auth` and `db` instances for use across the app

### 🔁 Flow Summary

Firebase Services Init
- Firebase App initialized with provided config
- Firebase Auth initialized with React Native session persistence
- Firestore initialized for data storage
- `auth` and `db` exported and shared across all features

Used In:
- **Authentication** → login, registration, auth state monitoring
- **Presence** → online/offline state stored in Firestore
- **Messaging** → conversations and messages stored and streamed in real-time
- **Group Chats** → managed entirely through Firestore documents
- **Rate Limiting, IDs, and Listener Registry** → helper utilities are aggregated via a single access layer

### ✅ What It Implements

- **🔥 Firebase App Bootstrap**
  - Sets up core project credentials (API key, project ID, etc.)
  - Keeps config isolated from other logic

- **🔐 Firebase Auth for React Native**
  - Session persistence via `getReactNativePersistence(AsyncStorage)`
  - Clean integration with `AuthContext` for login state tracking

- **🗄 Cloud Firestore**
  - Real-time database used for users, conversations, and messages
  - Supports live subscriptions, batched writes, and atomic transactions

- **🔁 Shared Backend Access**
  - `auth` and `db` are imported throughout the app via a consistent interface

---

## 🧰 Firestore API — Access Layer

To simplify access and enforce a clean separation of concerns, the app uses a **forward-only service façade**.

### 📁 Key File

- **`src/services/firestoreApi.js`**  
  This file re-exports functions from:
  - `usersRepo.js`
  - `conversationsRepo.js`
  - `messagesRepo.js`
  - `groupsRepo.js`
  - Utility files like `rateLimits.js`, `ids.js`, and `listeners.js`

### 🔁 Flow Summary

Screens/components need data
→ They import functions from `firestoreApi.js`
→ These are forwarded from low-level repos/util files
→ No business logic lives in this layer

Used In:
- Fetching users, creating/updating user profiles
- Creating or joining conversations and groups
- Sending and receiving messages
- Managing unread states and presence
- Registering and cleaning up Firestore listeners
- Applying client-side message throttling

### ✅ What It Implements

- **🧪 Single Point of Access**
  - Screens import from one place instead of referencing repos/utilities directly

- **📦 Decoupling Logic**
  - Keeps business logic out of the services layer
  - Makes swapping or mocking data sources easy

- **🔗 Cross-Cutting Utilities**
  - Includes IDs, rate limiters, listener registry alongside core data functions

- **🔁 Real-Time APIs**
  - Exposes only subscriptions, atomic operations, and CRUD helpers

- **🧹 Clean Import Flow**
  - Promotes consistency, discoverability, and testability across the app

## 🧱 Models — Overview

Models define the **shape**, **default values**, and **validation rules** for key data types like users, conversations, and messages.  
They contain **no Firestore logic** and are used purely for constructing and validating plain objects used in the app.

---

### 📁 Key Files

- **`src/models/User.js`**
  - Defines user profile fields (uid, email, displayName, avatar, isOnline, timestamps)
  - Includes validation, formatting (initials), and status text logic
  - Handles conversion to/from Firestore format

- **`src/models/Conversations.js`**
  - Defines structure for direct or group chats
  - Includes fields like participants, lastActivity, unread counts, lastMessage
  - Provides validation and `.toFirestore()` helper

- **`src/models/Messages.js`**
  - Defines message shape with sender, text, timestamp
  - Allows future extension (e.g. readBy)
  - Provides schema validation and formatting

- **`src/models/Index.js`**
  - Barrel export of all model classes for convenience

---

### ✅ What These Models Implement

- **📐 Schema Consistency**
  - All critical collections have defined shapes used across screens and services

- **🧪 Validation Hooks**
  - Each model includes a `validate()` method to catch malformed inputs before writing to Firestore

- **🔄 Firestore Compatibility**
  - `.toFirestore()` ensures data is correctly serialized for Firestore writes

- **🧱 No I/O**
  - Models are pure JavaScript classes — no Firestore read/write calls

- **🔁 Reusability**
  - Used by both creation flows (e.g., new chat, new user) and rendering logic

---

## 📦 Repositories — Overview

Repositories encapsulate **all Firestore read/write logic**.  
They return plain JavaScript objects — no model instances — and contain no UI or app logic.

---

### 📁 Key Files

- **`src/repos/usersRepo.js`**
  - Create or update user profile on login
  - Set online/offline status
  - Fetch individual users or user lists

- **`src/repos/conversationsRepo.js`**
  - Deterministic 1:1 conversation creation and fetch
  - Read status management (`lastReadBy`, `unreadCount`)
  - Append message to conversation with atomic updates
  - Live subscription to a user’s conversations (ordered by last activity)

- **`src/repos/messagesRepo.js`**
  - Create message document references
  - Build normalized message payloads
  - Subscribe to message streams (ascending timestamps, paginated)

- **`src/repos/groupsRepo.js`**
  - Create and manage group conversations
  - Match participant sets using a deterministic key
  - Append messages and update unread counters for all group members
  - Subscribe to user’s groups

---

### ✅ What Repositories Implement

- **🧼 Pure Data Access**
  - No business logic, no UI — only Firestore CRUD and streams

- **📄 Plain Objects**
  - Return raw JS objects (not model instances) for flexibility in rendering and mutation

- **⚡ Real-Time Subscriptions**
  - Use Firestore's `onSnapshot` to push updates to the UI (e.g., messages, conversations)

- **🔁 Batched Writes & Transactions**
  - Ensure consistency when appending messages and updating unread counts

- **🔐 Access Scoping**
  - Use query constraints to fetch only current user’s data (e.g., via `array-contains`)

---

## 🧩 UI Components — Overview

All UI components in this project are **presentational** — they do not contain business logic or direct Firestore access.  
Instead, they receive data and handlers from the screen layer, which in turn consumes logic from `firestoreApi.js` and `AuthContext`.  
This separation ensures reusability, testability, and cleaner code organization.

---

### 📁 Key Files

Each component is paired with a corresponding `.styles.js` file for consistent theming.

- **`src/components/ChatHeader.js`**  
  - Renders the chat header with back button, name, and status indicator  
  - Displays online/offline badge or group member count

- **`src/components/GroupChatBar.js`**  
  - Displays a card-style UI for accessing group chats  
  - Shows a badge for unread group messages

- **`src/components/MessagesInput.js`**  
  - Message composer with input box and send button  
  - Uses props to trigger the `onSendMessage` callback

- **`src/components/MessagesList.js`**  
  - Renders real-time messages using `FlatList`  
  - Supports auto-scroll, loading/error states, and current-user detection  
  - Gets its data from `subscribeMessagesByConversationAsc()` (injected from parent screen)

- **Other Components (Not Listed Here)**
  - `OnlineIndicator.js` — shows green dot if user is online  
  - `UnreadBadge.js` — renders unread count for chats  
  - `UsersList.js` — shows list of users with presence and avatars  

---

### ✅ What These Components Implement

- **🧼 Pure UI**
  - No data fetching, mutation, or Firestore logic inside components

- **📦 Data via Props**
  - Screens handle all fetching/subscribing and pass data down

- **🎨 Styling Separation**
  - Each component’s styles are maintained in dedicated `.styles.js` files for clarity and reuse

- **🧠 Smart Composition**
  - Components can be reused across screens because they do not rely on global state or hardcoded logic

- **🔁 Reactive Updates**
  - Components like `MessagesList` rerender when their inputs change, thanks to `useState` and `useEffect` in the screen

---

## 🧭 Screens — Overview

Screens are responsible for **gluing together components, context, and services**.  
They orchestrate data fetching, subscriptions, state management, and navigation — but **do not define UI or Firestore logic themselves**.

---

### 📁 Key Files

#### `src/screens/auth/LoginScreen.js`
- Presents a login/signup form
- Validates email and password inputs
- Uses `AuthContext` for login/register actions
- Does not include any chat-related features

#### `src/screens/ChatScreen.js`
- Handles direct or group chat logic
- Loads the relevant conversation using `firestoreApi`
- Marks messages as read and appends new messages
- Renders:
  - `ChatHeader` (with avatar and status)
  - `MessagesList` (real-time chat stream)
  - `MessagesInput` (message composer)

#### `src/screens/GroupChatListScreen.js`
- Displays a scrollable list of group chats
- Subscribes to user’s group conversations
- Shows unread count for each group using `UnreadBadge`
- Lets the user navigate to a group chat or create a new one

#### (Not Uploaded but Expected)
- `UserProfileScreen.js` — likely shows user list and recent chats
- `GroupCreationScreen.js` — likely used to start new group conversations

---

### ✅ What Screens Implement

- **🧩 Composition Layer**
  - Assemble UI from reusable components (`MessagesInput`, `ChatHeader`, etc.)

- **📥 Data Orchestration**
  - Fetch and subscribe to conversations/messages from `firestoreApi`

- **🧠 Local State Management**
  - Use `useState`, `useEffect`, `useCallback` to handle loading, inputs, and responses

- **🧼 No UI Logic**
  - Styling and rendering details are fully delegated to components

- **📦 Context Consumption**
  - Access global user state and auth methods through `useAuth()`

- **🔁 Real-Time Behavior**
  - All Firestore listeners (e.g. `onSnapshot`) are handled inside screens and cleaned up properly

---

## 🛠 Utilities — Overview

The **utils layer** provides small, reusable helpers that support validation, throttling, ID generation, and subscription management.  
These are imported throughout the app but contain no UI or Firestore logic themselves.

---

### 📁 Key Files

#### `src/utils/ids.js`
- 🔑 Generates stable, deterministic IDs for conversations
  - `conversationIdForUsers(a, b)` → always returns the same ID for any two users
  - `participantsKey([a, b, c])` → used to uniquely identify group participant sets

#### `src/utils/listeners.js`
- 🔁 Manages real-time Firestore subscriptions
  - `registerListener(key, unsubFn)` → track a listener
  - `cleanupListener(key)` → stop one
  - `cleanupAllListeners()` → useful on logout/unmount to avoid memory leaks

#### `src/utils/loginScreenValidator.js`
- ✅ Lightweight validators for the login screen
  - `isValidEmail(email)` — regex check for valid emails
  - `passwordIssues(pwd)` — returns error messages for weak/invalid passwords
  - `authErrorMessage(err)` — maps Firebase error codes to friendly messages

#### `src/utils/rateLimits.js`
- 🚦 In-memory client-side rate limiter
  - `canSendMessageNow(userId)` — applies 1-second cooldown and max 30 messages/min
  - Prevents users from accidentally spamming messages via fast taps

---

### ✅ What These Utilities Implement

- **🔒 User Protection**
  - Input validation and rate limits help reduce abuse and improve UX

- **🆔 Stable Keys**
  - Deterministic ID functions ensure consistent Firestore document references

- **♻️ Memory Safety**
  - Centralized listener registry ensures real-time subscriptions are cleaned up correctly

- **🧹 Clean Separation**
  - These functions are pure and side-effect-free (except listener registry), making them easy to test and reuse

---


