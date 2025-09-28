# ReactNativeDemoChatApp


## 📱 About the App

This is a full-featured **React Native chat application** designed to showcase the core building blocks of a modern mobile messaging platform. 

It demonstrates how to implement **secure authentication**, **real-time communication**, and **scalable architecture** using Firebase as the backend and Expo for rapid mobile development.

Built with a clean separation of concerns, the app highlights **best practices in state management, performance tuning, UI reusability, and Firestore integration**. Whether it’s one-on-one chats or dynamic group conversations, the app provides a production-style baseline for building real-world mobile messaging features.

The key focus areas include:
- Real-time chat with smooth FlatList-based message rendering
- Authentication and presence handling with Firebase Auth
- Online/offline user status tracking
- Group creation, participant handling, and conversation tracking
- Proper layering and modular design for maintainability

This project is both a functional messaging app and a reference architecture for scalable mobile app development with React Native.

## 🧭 Table of Contents
- [Features](#-features)
- [Architecture](#-architecture--responsibility-separation)
- [Screenshots](#-screenshots)
- [Testing & Build Access](#-testing--build-access)
- [Core Implementations](#-core-implementations--deep-dive)
  - [Authentication](#-authentication--context--overview)
  - [Firebase Services](#-firebase-services--overview)
  - [Firestore API](#-firestore-api--access-layer)
  - [Models](#-models--overview)
  - [Repositories](#-repositories--overview)
  - [UI Components](#-ui-components--overview)
  - [Screens](#-screens--overview)
  - [Utilities](#-utilities--overview)
- [License](#-license)
- [Final Notes](#-final-notes)

## ✨ Features

- 🔐 **Secure Authentication**  
  - Email/password login powered by Firebase Authentication  
  - Session persistence using `AsyncStorage` (users remain signed in across app restarts)  
  - Online/offline presence automatically updated in Firestore  

- 💬 **Real-Time One-on-one Messaging**  
  - One-on-one chat with instant message delivery using Firestore listeners  
  - Custom FlatList-based chat UI for smooth scrolling and pagination  
  - Deterministic conversation IDs for consistent retrieval  
  - Messages display timestamps
  - Unread Messages Indicator

- 👥 **Group Chat (Bonus Feature)**  
  - Fully functional group chat creation with ability to add multiple members  
  - Real-time group conversations with shared message stream  
  - Unread counts maintained for each participant  

- 🔔 **Unread Indicators (Bonus Feature)**  
  - Per-user unread counts tracked at the conversation level  
  - Unread badges displayed in chat lists  
  - Badges automatically clear when messages are viewed  

- 🟢 **Online Presence**  
  - Real-time tracking of user status (`isOnline` and `lastSeen`)  
  - Online indicator visible in chat headers for direct conversations  

- ⚡ **Performance**  
  - FlatList optimizations: batching, clipping, and window sizing for large chat lists  
  - Lazy loading of messages (messages stream in as needed)  
  - Memoization (`React.memo`, `useMemo`, `useCallback`) to minimize unnecessary re-renders  

- 🚦 **Rate Limiting (Bonus Feature)**  
  - Client-side throttling of messages to prevent spam  
  - 1-second cooldown between sends and 30 messages per minute per user  


## 🏗 Architecture — Responsibility Separation

The application follows a clean, layered architecture that prioritizes **separation of concerns**, **modularity**, and **testability**. Each layer has a distinct role:

- **🖼 UI Components**  
  Presentational-only. These components render data and receive event handlers via props. They are styled independently and reused across screens. No side effects, state, or Firestore access.

- **🧭 Screens**  
  The main orchestration layer. Screens subscribe to data (e.g., messages, groups), manage transient state (loading, errors), and compose UI using components. They **consume context** and **call services**, but do not directly access Firestore or contain business logic.

- **🧠 Context (AuthContext)**  
  Manages global authentication and presence state. Auth logic is centralized here (login, register, logout, session tracking), along with user state and presence toggling.

- **🔌 Services (API)**  
  A **service façade** that forwards selected repo methods and utils. Screens only import from this layer (`firestoreApi.js`) to maintain a consistent interface and avoid deep import chains.

- **🗃 Repositories**  
  Perform all **Firestore CRUD operations** and real-time subscriptions. No app logic, no UI formatting — just raw interaction with Firestore. Always return plain JS objects.

- **📄 Models**  
  Define the **data schema** and provide helpers like `.toFirestore()`, validation, and formatting. These classes are pure — they do not perform I/O or connect to Firebase. They ensure schema consistency across the app.

- **⚙️ Utilities**  
  Provide cross-cutting logic:  
  - `ids.js`: generate stable conversation/group IDs  
  - `rateLimits.js`: in-memory spam control  
  - `listeners.js`: global Firestore listener registry  
  - `loginScreenValidator.js`: email/password validation + error mapping

- **🔥 Firebase (Auth/DB)**  
  One-time initialization of Firebase app, Firestore, and Auth — abstracted in `firebaseConfig.js`. This layer provides the raw backend and is used only by the repositories and context.


### 📊 Architecture Diagram 

```
┌────────────────────────────┐
│      UI Components         │  ← only presentation (Buttons, Lists, etc.)
├────────────────────────────┤
│          Screens           │  ← orchestrate flows, navigation, state
├────────────────────────────┤
│     Context (AuthContext)  │  ← app-wide auth & presence state
├────────────────────────────┤
│       Services (API)       │  ← single import surface (firestoreApi.js)
├────────────────────────────┤
│       Repositories         │  ← Firestore access layer (no logic)
├────────────────────────────┤
│          Models            │  ← data schema + validation, no I/O
├────────────────────────────┤
│          Utilities         │  ← helpers (IDs, rate limits, listeners)
├────────────────────────────┤
│     Firebase Config Layer  │  ← managed backend (auth + db setup)
└────────────────────────────┘
```

## 🖼 Screenshots
<img width="297" height="609" alt="image" src="https://github.com/user-attachments/assets/290f1f22-699f-4575-8cfe-5d536fee004d" />  <img width="302" height="640" alt="image" src="https://github.com/user-attachments/assets/ecf4d3a3-3162-44ec-b2f0-0092c8083e60" /> <img width="302" height="613" alt="image" src="https://github.com/user-attachments/assets/b2ed416a-a099-413a-9c7e-ee33a552ca3a" /> <img width="302" height="501" alt="image" src="https://github.com/user-attachments/assets/4f160b04-744e-4d5f-9965-6ca629f344f1" /> <img width="302" height="612" alt="image" src="https://github.com/user-attachments/assets/20e7eac0-8e4a-44f5-bd6c-88daa261fdb8" /> <img width="301" height="612" alt="image" src="https://github.com/user-attachments/assets/607451c2-a387-4458-be8e-597d126b89f8" />


## 📲 Testing & Build Access

This app is built with **Expo** and can be tested instantly on **Android** by downloading the app from the below QR code or the link. The app is also provided as .apk in the target releases of this github repo.

2 ways to do this. It is best to download from the releases section of this github repo.

### 🔗 Public App Link
Go to releases or visit this link to download. 

https://github.com/Rocky111245/React-Native-Demo-ChatApp/releases/download/v1.0.0/application-ca8044d9-4ce3-40f2-aa56-0ca39e7960fe.apk


### 📱 QR Code
Scan this QR code to get access to the App download:

<img width="360" height="403" alt="image" src="https://github.com/user-attachments/assets/324de6d6-7f5a-4829-b196-9bf96bf886e8" />

---
## 🔧 Core Implementations — Deep Dive

---

## 🔐 Authentication & Context 

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
- If no session then show login screen
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

## 🔌 Firebase Services 

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


## 🧰 Firestore API 

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



## 📦 Repositories

Repositories encapsulate **all Firestore read/write logic**.  
They return plain JavaScript objects — no model instances — and contain no UI or app logic.



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



## 🧩 UI Components

All UI components in this project are **presentational** — they do not contain business logic or direct Firestore access.  
Instead, they receive data and handlers from the screen layer, which in turn consumes logic from `firestoreApi.js` and `AuthContext`.  
This separation ensures reusability, testability, and cleaner code organization.



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



## 🧭 Screens

Screens are responsible for **gluing together components, context, and services**.  
They orchestrate data fetching, subscriptions, state management, and navigation — but **do not define UI or Firestore logic themselves**.



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



## 🛠 Utilities

The **utils layer** provides small, reusable helpers that support validation, throttling, ID generation, and subscription management.  
These are imported throughout the app but contain no UI or Firestore logic themselves.



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



### ✅ What These Utilities Implement

- **🔒 User Protection**
  - Input validation and rate limits help reduce abuse and improve UX

- **🆔 Stable Keys**
  - Deterministic ID functions ensure consistent Firestore document references

- **♻️ Memory Safety**
  - Centralized listener registry ensures real-time subscriptions are cleaned up correctly

- **🧹 Clean Separation**
  - These functions are pure and side-effect-free (except listener registry), making them easy to test and reuse

## 📄 License

This project is licensed under a **Custom Evaluation License**.

- 🚫 **No Commercial Use** — You may not use this code, in whole or in part, for any commercial purposes.  
- 🚫 **No Modification or Redistribution** — You may not modify, distribute, sublicense, or reuse this codebase.  
- ✅ **Evaluation Only** — This code is provided solely for the purpose of demonstrating skills and for evaluation by reviewers.  

Any other use is strictly prohibited without the author’s explicit written permission.  


## ✅ Final Notes

This implementation covers **all major features expected of a real-world chat experience**, including:

- **Authentication & presence tracking** using Firebase and centralized context  
- **1-on-1 and group chat flows** with unread message tracking  
- **Fully reusable component architecture** with screen-driven orchestration  
- **Memoized, scroll-optimized chat UI** built on FlatList  
- **Lazy loading & listener cleanup** for performance and resource safety  
- **Clean service layer** that abstracts backend access

What sets this demo apart is not just its completeness, but its **architectural clarity**. Each layer is responsible for exactly one thing, allowing developers to reason about and extend the app confidently.

While some bonus features like video calling, offline caching, and push notifications remain open for future expansion, this app delivers a robust foundation that’s clean, testable, and extensible.
