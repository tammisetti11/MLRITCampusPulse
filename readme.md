# 🎓 CampusPulse

**CampusPulse** is a student-focused event platform built on the MERN stack (MongoDB, Express, React, Node.js). It enables users to discover, register, and manage events seamlessly—with features like authentication, interest tagging, admin controls, and payment integration.
---
## 🚀 Features

- **Public Event Browsing**
  - View upcoming and ongoing events with filters.
  - Search by keywords, categories, price, organizer.
  - Mark events as “interested”.
- **User Accounts**
  - Sign up / log in.
  - Manage profile, password, photo, and personal details.
  - View interested events and purchased tickets.
- **Admin Dashboard**
  - Create, view, edit, and delete events.
  - Pre-filled event data and live preview.
- **Event Registration**
  - Modal form capturing personal info.
  - Free registrations generate unique tickets.
  - Paid registrations integrate with Razorpay (INR) / Stripe (USD).
- **Ticket Pass**
  - Unique pass per event-user.
  - Option to download PDF ticket.
- **Responsive UI**
  - Carousel hero section, modal dialogs, off-canvas filters, and Bootstrap styling.


---

## 🛠 Tech Stack


| Layer            | Tech & Libraries |
|-----------------|------------------|
| **Backend**      | Node.js, Express.js |
| **Database**     | MongoDB, Mongoose |
| **Auth & Payments** | JWT, bcrypt, Razorpay, Stripe |
| **Frontend**     | React, React Router, React Bootstrap, Bootstrap Icons |
| **Utils**        | Axios, Context API |

---

## ⚙️ Setup Instructions

### 1️⃣ Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` folder with the following:

```env
PORT=4000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

Start the backend server:

```bash
npm run dev
```

---

### 2️⃣ Frontend Setup

```bash
cd client
npm install
npm run dev
```

Visit your app at: [http://localhost:5173](http://localhost:5173)

---

## 💸 Razorpay Integration

- Integrated Razorpay checkout for INR payments
- Free events skip payment and directly generate tickets
- Razorpay Test Mode must be enabled in your Razorpay account

### 🔐 Razorpay Test Card

```
Card Number: 4111 1111 1111 1111
Expiry: 12/26
CVV: 123
OTP: 123456
```

---

## Snippets
![Alt Text](https://res.cloudinary.com/dbjaogapk/image/upload/v1753241921/Screenshot_2025-07-18_at_3.03.27_PM_diaumh.png)
![Alt Text](https://res.cloudinary.com/dbjaogapk/image/upload/v1753241920/Screenshot_2025-07-20_at_15.47.21_l0fomx.png)
![Alt Text](https://res.cloudinary.com/dbjaogapk/image/upload/v1753241919/Screenshot_2025-07-20_at_15.49.50_eu7xex.png)
![Alt Text](https://res.cloudinary.com/dbjaogapk/image/upload/v1753241918/Screenshot_2025-07-20_at_15.50.10_orbas4.png)
![Alt Text](https://res.cloudinary.com/dbjaogapk/image/upload/v1753241916/Screenshot_2025-07-20_at_15.48.02_jisnw1.png)
![Alt Text](https://res.cloudinary.com/dbjaogapk/image/upload/v1753241917/Screenshot_2025-07-20_at_15.48.43_pxmzov.png)
![Alt Text](https://res.cloudinary.com/dbjaogapk/image/upload/v1753241916/Screenshot_2025-07-20_at_15.49.33_g2orcc.png)
---

## 🙋‍♂️ Contributors

- **Naveen Tammisetti**

---

## 🤝 Contributing
Fork the repo

Create feature branch: git checkout -b feature/my-feature

Commit your changes: git commit -m 'Add feature'

Push to remote: git push origin feature/my-feature

Open a pull request for review

-----

## 📄 License

MIT License © 2023 **CampusPulse Team**
