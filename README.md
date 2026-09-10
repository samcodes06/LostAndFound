# 🔎 Lost & Found

A full-stack web application that helps users report lost and found items, search for relevant posts, submit claims, and manage the process of returning items.

The application includes separate user and administrator workflows with authentication, item management, claims, contact privacy, notifications, media uploads, and admin controls.

---

## 📌 About the Project

Finding a lost item or identifying the owner of a found item can be difficult when there is no centralized platform to connect the two.

**Lost & Found** provides a single platform where users can:

- Post lost or found items
- Browse and search existing posts
- Submit claims for relevant items
- Manage claims they have submitted or received
- Receive notifications about claim activity
- Communicate through controlled contact information
- Mark items as returned after the claim process

Administrators can manage users, item posts, claims, and contact messages through a dedicated admin dashboard.

---

# 📸 Application Screenshots

### 🏠 Home 

<img width="1917" height="963" alt="image" src="https://github.com/user-attachments/assets/40abf92b-62b8-42a9-8874-b6b36202957d" />


### 🔍 Browse Items

<img width="1912" height="972" alt="image" src="https://github.com/user-attachments/assets/1a705c74-f332-4fe8-9278-616dd71a4200" />


### 📦 Item Details

<img width="1908" height="972" alt="image" src="https://github.com/user-attachments/assets/c480847c-8b02-422c-b6b7-58fe81771f28" />


### ➕ Post an Item

<img width="1915" height="967" alt="image" src="https://github.com/user-attachments/assets/ee72388b-fc6d-4674-942d-816bea8e6b6c" />


<img width="1917" height="968" alt="image" src="https://github.com/user-attachments/assets/61fbc403-749a-4815-8949-3a1640735b03" />


### 📋 Claims

<img width="1911" height="960" alt="image" src="https://github.com/user-attachments/assets/4f43155f-2aae-4fd6-b7db-2b21095e0b36" />


<img width="1913" height="967" alt="image" src="https://github.com/user-attachments/assets/594fda3b-1c1e-446a-b2cd-0c15469d9651" />


### 🔐 Contact Information Privacy

<img width="1916" height="962" alt="image" src="https://github.com/user-attachments/assets/c129e033-7055-4327-b4f8-f891e78f1710" />

<img width="1917" height="967" alt="image" src="https://github.com/user-attachments/assets/93f661f9-a52e-4660-9586-c6948fb692c7" />


### 🔔 Notifications

<img width="1911" height="973" alt="image" src="https://github.com/user-attachments/assets/4f1404ff-5bb0-48e0-ba55-996d9a2efdf4" />


### 🛡️ Admin Dashboard

<img width="1913" height="970" alt="image" src="https://github.com/user-attachments/assets/7a95eab8-740e-4738-b975-df80c4b03204" />


---

# 🔄 Application Workflow

The application is built around a simple **Lost/Found → Claim → Decision → Return** workflow.

### 👤 User Workflow

```text
Register / Login
       ↓
Post or Browse Items
       ↓
Search & Find a Matching Item
       ↓
View Item Details
       ↓
Submit Claim
       ↓
Item Owner Reviews Claim
       ↓
Accept / Reject Claim
       ↓
Item Marked as Returned
       ↓
Notification Sent
```

### 🛡️ Admin Workflow

```text
Admin Login
     ↓
Admin Dashboard
     ↓
Users / Items / Claims / Contact Messages
     ↓
Manage Platform Data
```

### 📦 Item Status

```text
AVAILABLE
    ↓
Claim Process
    ↓
Claim Accepted
    ↓
RETURNED
```

The application prevents further modification of an item once it has been marked as returned.

---

# ✨ Key Features

## 👤 User Features

### Authentication & Profile

- User registration and login
- JWT-based authentication
- Protected user routes
- User profile management
- Edit profile
- Change password

### 📦 Item Management

Users can create posts for both:

- **LOST** items
- **FOUND** items

Each post can contain:

- Item name
- Category
- Description
- Color
- Location
- Area
- Specific place
- Up to 5 images
- Optional video

Users can also:

- View their own posts
- Edit their posts
- Delete their posts
- Mark eligible items as returned

### 🔍 Browse & Search

Users can browse available items and search for relevant posts using:

- Lost / Found type
- Category
- Location
- Area
- Item name

Each item has a dedicated details page with its relevant information.

### 📋 Claims & Contact Privacy

Users can submit claims for relevant items by providing:

- Claim description
- Contact information

The application uses the **claim status to control the visibility of contact information**.

| Claim Status | Contact Information |
|--------------|---------------------|
| PENDING | 🔒 Hidden |
| ACCEPTED | ✅ Visible to the appropriate user |
| REJECTED | 🔒 Hidden |
| RETURNED | 🔒 Hidden again |

This prevents contact information from being exposed while a claim is under review and hides it again after the item has been returned.

The system also includes validation and authorization rules such as:

- A user cannot claim their own item
- Returned items cannot be claimed
- Only the item owner can accept or reject claims
- Contact information is revealed only when the claim reaches the accepted state

Users can view:

- Claims they have submitted
- Claims received on their own posts
- Individual claim details

### 🔔 Notifications

The application provides in-app notifications for important claim events.

Notifications are generated when:

| Event | Notification Recipient |
|-------|-------------------------|
| Claim submitted | Item owner |
| Claim accepted | Claimant |
| Claim rejected | Claimant |
| Item marked as returned | Claimant |

Users can view notifications and mark them as read.

---

# 🛡️ Admin Features

Administrators have access to a dedicated dashboard for platform-level management.

### Admin Dashboard

Provides an overview of application data and statistics.

### User Management

- View registered users
- Activate users
- Deactivate users

### Item Management

- View all item posts
- Delete posts when required

### Claim Management

- View claims across the platform

### User Posts

- View posts created by a particular user
- Review individual user posts
- Delete posts when necessary

### Contact Messages

- View messages submitted through the contact form

All administrative APIs are protected by authentication and admin authorization middleware.

---

# 🖼️ Media Upload

The application supports multiple images and an optional video for item posts.

### Images

Users can upload up to **5 images per item**.

The image upload process uses:

**Multer → Backend → Cloudinary**

The application stores the Cloudinary image URL and public ID with the item, allowing uploaded images to be referenced and managed without storing the image files directly in the application server.

### Video

Users can also attach **one optional video** to provide additional information about the lost or found item.

---

# 🔐 Authentication, Authorization & Privacy

Security and access control are implemented on both the frontend and backend.

### Authentication

The application uses **JSON Web Tokens (JWT)** to authenticate users.

Protected functionality includes:

- Posting items
- Managing personal posts
- Submitting claims
- Viewing claims
- Notifications
- Profile management

### Role-Based Authorization

The application supports different user roles:

- `USER`
- `ADMIN`

Regular users can manage their own resources, while administrators have access to platform-level management features.

Backend authorization is enforced using middleware, including:

- Authentication middleware
- Admin authorization middleware

### Contact Information Privacy

A key part of the claim workflow is controlling when contact information can be accessed.

```text
PENDING
   ↓
Contact Hidden 🔒
   ↓
Owner Reviews Claim
   ↓
ACCEPTED ─────────→ Contact Visible ✅
   ↓
Item Returned
   ↓
Contact Hidden Again 🔒
```

This prevents a claimant's contact information from being unnecessarily exposed before the item owner has accepted the claim and after the item has been returned.

---

# 🧩 Main Application Modules

The project is organized into separate modules based on functionality.

### Authentication Module

Handles:

- Registration
- Login
- JWT authentication
- User activation
- Role-based access

### Item Module

Handles:

- Creating items
- Updating items
- Deleting items
- Searching and filtering
- Item details
- Item return status
- Image and video uploads

### Claim Module

Handles:

- Creating claims
- Viewing claims
- Accepting claims
- Rejecting claims
- Claim authorization
- Contact information access based on claim status

### Notification Module

Handles:

- Claim submitted notifications
- Claim accepted notifications
- Claim rejected notifications
- Item returned notifications
- Read/unread notification status

### Admin Module

Handles:

- Dashboard statistics
- User management
- Item management
- Claim management
- User post management
- Contact messages

---

# 🏗️ Project Structure

```text
LostAndFound/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── api/
│   │   ├── styles/
│   │   └── routes/
│   ├── public/
│   └── package.json
│
├── screenshots/
│   ├── home.png
│   ├── browse-items.png
│   ├── item-details.png
│   ├── add-item.png
│   ├── claims.png
│   ├── contact-privacy.png
│   ├── notifications.png
│   └── admin-dashboard.png
│
├── .gitignore
└── README.md
```

---

# 🛠️ Tech Stack

## Frontend

| Technology | Purpose |
|------------|---------|
| React.js | User interface development |
| React Router | Client-side routing |
| Axios | API communication |
| JavaScript | Application logic |
| HTML | Page structure |
| CSS | Styling |
| Vite | Development and build tool |

## Backend

| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript runtime |
| Express.js | REST API and backend server |
| MongoDB | Database |
| Mongoose | MongoDB object modeling |
| JWT | Authentication and authorization |
| Multer | Handling image and video uploads |
| Cloudinary | Image storage and management |

## Development Tools

| Tool | Purpose |
|------|---------|
| Git | Version control |
| GitHub | Source code hosting |
| VS Code | Development environment |

---

# 🔗 Frontend–Backend Architecture

The application follows a client-server architecture.

```text
┌──────────────────────┐
│    React Frontend    │
│                      │
│ Pages / Components   │
│ Routing / Context    │
└──────────┬───────────┘
           │
           │ HTTP Requests
           │ Axios
           ↓
┌──────────────────────┐
│    Express Backend   │
│                      │
│ Routes               │
│ Middleware           │
│ Controllers          │
└──────────┬───────────┘
           │
           ↓
┌──────────────────────┐
│       MongoDB        │
│                      │
│ Users                │
│ Items                │
│ Claims               │
│ Notifications        │
└──────────────────────┘

        Image Upload
             │
             ↓
        Cloudinary
```

---

# 🔒 Access Control Examples

The application includes business-level authorization rules to protect resources.

Examples include:

- Users can modify and delete their own posts.
- Users cannot claim their own items.
- Only the item owner can accept or reject a claim.
- Returned items cannot be modified.
- Only authenticated users can access protected functionality.
- Only administrators can access administrative operations.
- Contact information is controlled according to claim status.

These rules are enforced on the backend rather than relying only on frontend restrictions.

---

# 🚀 Getting Started

## Prerequisites

Install the following before running the project:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Git](https://git-scm.com/)

A [Cloudinary](https://cloudinary.com/) account is also required for image uploads.

---

## 1. Clone the Repository

```bash
git clone https://github.com/samcodes06/LostAndFound.git

cd LostAndFound
```

---

## 2. Setup the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the backend:

```bash
npm run dev
```

---

## 3. Setup the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available through the Vite development server.

---

# 🧪 Example User Journey

A typical interaction with the application looks like this:

```text
User Registers
      ↓
User Logs In
      ↓
Posts a Lost / Found Item
      ↓
Another User Finds a Matching Post
      ↓
Views Item Details
      ↓
Submits a Claim
      ↓
Contact Information Remains Hidden
      ↓
Item Owner Receives Notification
      ↓
Owner Reviews the Claim
      ↓
Accepts or Rejects
      ↓
If Accepted → Contact Information Becomes Available
      ↓
Item Is Marked as Returned
      ↓
Contact Information Is Hidden Again
      ↓
Claimant Receives Notification
```

This connects the major modules of the application into one complete workflow.

---

# 📚 What This Project Demonstrates

This project demonstrates practical experience with:

- Full-stack web application development
- React component-based development
- Client-side routing
- REST API development
- CRUD operations
- MongoDB database design
- Mongoose models and relationships
- JWT authentication
- Role-based authorization
- Express middleware
- File upload handling
- Cloudinary integration
- Search and filtering
- Business-rule implementation
- Privacy and access-control logic
- Claim and approval workflows
- Notification systems
- Admin dashboards
- Protected frontend and backend routes
- Git and GitHub version control

---

# 🔗 Repository

**GitHub:**  
https://github.com/samcodes06/LostAndFound

---

## 👩‍💻 Developer

**Samcodes06**

Built as a full-stack web development project using React, Node.js, Express, MongoDB, and Cloudinary.
