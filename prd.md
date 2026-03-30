# 📄 Product Requirements Document (PRD)
## 🏷️ Product Name: Wedding Venue Finder

---

## 1. 📌 Overview

### 1.1 Purpose
The Wedding Venue Finder is a web-based platform that helps users discover, compare, and book wedding venues based on location, budget, and preferences.

### 1.2 Problem Statement
Finding the right wedding venue is time-consuming and fragmented. Users often rely on multiple sources, leading to inefficiency and poor decision-making.

### 1.3 Solution
A centralized platform that enables:
- Easy venue discovery
- Smart filtering
- Booking inquiries
- Transparent pricing and details

---

## 2. 🎯 Goals & Objectives

### Primary Goals
- Simplify venue discovery process
- Reduce search time
- Provide reliable and structured venue data

### Success Metrics (KPIs)
- Number of active users
- Number of venue searches
- Booking requests per day
- User retention rate

---

## 3. 👥 Target Users

### 3.1 End Users
- Couples planning weddings
- Families organizing events

### 3.2 Secondary Users
- Wedding planners
- Venue owners (Admin)

---

## 4. 🧩 Features & Requirements

### 4.1 User Features

#### 🔍 Search & Filter
- Search by city, budget, guest capacity
- Filters: AC, parking, catering, indoor/outdoor

#### 🏢 Venue Details
- Image gallery
- Price per day
- Amenities list
- Description
- Ratings & reviews

#### ❤️ Favorites
- Save venues for later

#### 📅 Booking Inquiry
- Select date
- Enter guest count
- Send booking request

---

### 4.2 Admin Features
- Add/Edit/Delete venues
- Upload venue images
- Manage bookings
- Approve/Reject booking requests

---

## 5. 🔄 User Flow

### Basic Flow
1. User visits homepage
2. Searches for venues
3. Views search results
4. Clicks on a venue
5. Sends booking request
6. Admin reviews and responds

---

## 6. 🖥️ Functional Requirements

| ID  | Requirement                          |
|-----|--------------------------------------|
| FR1 | User can register and login          |
| FR2 | User can search venues               |
| FR3 | User can view venue details          |
| FR4 | User can send booking requests       |
| FR5 | Admin can manage venues              |
| FR6 | Admin can manage bookings            |

---

## 7. ⚙️ Non-Functional Requirements

- Performance: Page load time < 3 seconds
- Security: Authentication and data protection
- Scalability: Support multiple concurrent users
- Availability: 99% uptime

---

## 8. 🗂️ Data Requirements

### Entities
- User
- Venue
- Booking

### Relationships
- User → Booking (1:M)
- Venue → Booking (1:M)

---

## 9. 🧪 Assumptions

- Users have internet access
- Admin manually verifies venue data
- Payment system is optional (can be added later)

---

## 10. 🚧 Constraints

- Limited development time
- Budget constraints (free hosting platforms)
- No real-time booking system initially

---

## 11. 📅 Timeline

| Phase        | Duration   |
|--------------|-----------|
| Planning     | 2 days     |
| Design       | 3 days     |
| Development  | 10–15 days |
| Testing      | 3 days     |
| Deployment   | 2 days     |

---

## 12. 🔮 Future Enhancements

- Online payment integration (Razorpay/Stripe)
- AI-based venue recommendations
- Chat system with venue owners
- Mobile application
- Virtual venue tours

---

## 13. 🧾 Acceptance Criteria

- User can search and view venues
- Booking request is successfully submitted
- Admin can manage venue listings
- System runs without critical errors

---

## 14. 📊 Risks

- Inaccurate venue information
- Low user engagement
- Server downtime or hosting issues

---