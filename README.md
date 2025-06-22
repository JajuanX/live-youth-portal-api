# Transfer Portal Backend

This is the backend API for the Transfer Portal application. It is built with **Node.js**, **Express**, **MongoDB**, and uses **JWT** for authentication.

---

## 📦 Tech Stack

### Backend
- **Node.js + Express**
- **MongoDB + Mongoose**
- **JWT Authentication**
- **Multer or Cloudinary SDK** (Image Upload)
- **Nodemailer** (Email Notifications, Optional)

---

## 📦 Features (MVP)

### ✅ User Authentication
- JWT-based secure login/signup
- Role-based access (Player, Team Admin)

### ✅ Player Profiles
- Add bio, stats, position, age, and photo
- Manage commitments and announcements

### ✅ Team Management
- Teams can create profiles with logos and bios
- Accept or reject join requests

### ✅ Transfer Announcements
- Create visual transfer graphics
- Select templates, add images and text
- Download or share to social platforms

### ✅ Commitment Workflow
- Athletes send "Request to Join" to teams
- Teams review and approve
- Approved commitments trigger announcement flow

### ✅ Social Sharing
- Share announcements via Facebook, Instagram, etc.
- Downloadable graphics for printing or posting

---

## 📁 Project Structure

```bash
backend/
├── controllers/ # Business logic functions
├── middleware/ # JWT auth and error handling
├── models/ # Mongoose schemas
├── routes/ # Express routers
├── services/ # Third-party integrations (e.g. Stripe, S3)
├── app.js # App entry point
├── .env # Environment configuration
├── .gitignore
└── package.json
