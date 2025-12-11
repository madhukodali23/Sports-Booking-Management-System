# 🏸 Sports Facility Court Booking Platform  
A full-stack web application built for the **Acorn Globus Assignment** to manage multi-resource scheduling and dynamic pricing for a sports facility.

Users can book badminton courts along with optional equipment and coaches. The system checks resource availability in real-time and calculates pricing dynamically using admin-defined rules.

---

## 📁 Full Project Folder Structure

```
sports-booking-management/
│
├── backend/
│   ├── models/
│   │   ├── Booking.js
│   │   ├── Coach.js
│   │   ├── Court.js
│   │   ├── Equipment.js
│   │   └── PricingRule.js
│   │
│   ├── routes/
│   │   ├── bookings.js
│   │   ├── coaches.js
│   │   ├── courts.js
│   │   ├── equipment.js
│   │   └── pricing.js
│   │
│   ├── server.js
│   ├── seed.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   ├── components/
│   │   │   └── BookingForm.js
│   │   │
│   │   ├── pages/
│   │   │   └── BookingPage.js
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── reportWebVitals.js
│   │
│   ├── package.json
│   └── README.md
│
└── README.md  ← root project readme
```

---

## 🚀 Features

### ✔ Multi-Resource Scheduling
- Court availability checking  
- Coach availability  
- Equipment stock validation  

### ✔ Dynamic Pricing Engine
Automatically adjusts pricing based on:
- Peak hours  
- Weekends  
- Indoor premium  
- Equipment quantity  
- Coach hourly rate  

### ✔ Modern, Clean UI
- Court selection dropdown  
- Datetime booking  
- Equipment selection with quantity  
- Coach selection  
- Live price preview box  
- Booking confirmation  

---

## 🛠 Tech Stack

### **Frontend**
- React.js  
- Plain CSS  
- Fetch API  

### **Backend**
- Node.js  
- Express.js  
- MongoDB (Mongoose)  

### **Deployment**
- Backend: **Render**  
- Frontend: **Vercel**  
- Database: **MongoDB Atlas**  

---

## 🌍 Deployment Links

| Component | Link |
|----------|------|
| **Frontend (Vercel)** |[https://your-frontend-url.vercel.app](https://sports-booking-management-system-b8s3s7ik2.vercel.app/) |
| **Backend (Render)** |[ https://your-backend-url.onrender.com ](https://sports-booking-management-system.onrender.com)|
| **GitHub Repo** | https://github.com/madhukodali23/sports-booking-management |

*(Replace with your actual URLs)*

---

## 🧪 API Endpoints

### Courts
```
GET /api/courts
POST /api/courts
```

### Coaches
```
GET /api/coaches
POST /api/coaches
```

### Equipment
```
GET /api/equipment
POST /api/equipment
```

### Pricing (Preview)
```
POST /api/bookings/calc
```

### Bookings
```
POST /api/bookings
GET  /api/bookings
```

---

## 🙌 Acknowledgements
This project is developed as part of the **Acorn Globus Full-Stack Developer Assignment**, demonstrating backend logic, dynamic pricing systems, and a functional modern UI.
