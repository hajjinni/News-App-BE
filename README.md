#  Real-Time News Alert System – Backend

A scalable backend built using the MERN stack Real-time news application that delivers **real-time news alerts**, email notifications, and customizable user preferences.

---


##  Features

*  User Authentication (JWT-based)
*  News Aggregation using News API
*  Real-time alerts via Socket.IO
*  Email notifications using SendGrid
*  Web Push Notifications (VAPID)
*  Scheduled Jobs (Hourly & Daily Digests)
*  User Preferences (categories, frequency, alerts)
*  Alerts History Tracking

---

##  Tech Stack

*  Node.js
*  Express.js
*  MongoDB (Mongoose)
*  JWT Authentication
*  Socket.IO (Real-time)
*  Node-Cron (Scheduling)
*  Axios (API calls)
*  SendGrid (Email Service)
*  Web Push

---

##  Project Structure

```id="b1"
backend/
 ├── config/
 ├── controllers/
 ├── jobs/
 ├── middleware/
 ├── models/
 ├── routes/
 ├── services/
 ├── server.js
 └── .env
```

---


---

##  Getting Started

### 1. Clone the repository

```
git clone https://github.com/your-username/news-alert-backend.git
cd backend
```

### 2. Install dependencies

```
npm install
```

### 3. Run server

```
npm run dev
```

---

##  API Endpoints

###  Auth

* POST `/api/auth/register`
* POST `/api/auth/login`
* GET `/api/auth/me`

###  News

* GET `/api/news`
* GET `/api/news/categories`
* GET `/api/news/:id`

###  Preferences

* GET `/api/preferences`
* PUT `/api/preferences`

###  Alerts

* GET `/api/alerts`
* PATCH `/api/alerts/:id/read`
* PATCH `/api/alerts/read-all`
* DELETE `/api/alerts/:id`

---

##  Real-Time Flow

1. News fetched from external API
2. Stored in MongoDB
3. Users matched based on preferences
4. Alerts sent via:

   * Socket.IO
   * Email
   * Push notifications
5. Alerts saved in database

---

##  Cron Jobs

* Every hour → Fetch news
* Hourly digest
* Daily digest (8 AM)

---

##  Deployment

* Backend hosted on Render


---

##  Security Notes

* Passwords hashed using bcrypt
* JWT authentication implemented
* Sensitive data stored in environment variables


