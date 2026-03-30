# ✅ Wedding Venue Finder — TODO List
> Based on: `prd.md`, `teck.md`, `design.md`

---

## 🏗️ PHASE 1 — Project Setup

### 1.1 Frontend Setup (React + Tailwind)
- [ ] Initialize React project with Vite (`npx create-vite@latest`)
- [ ] Install and configure Tailwind CSS
- [ ] Install React Router DOM for routing
- [ ] Add Google Fonts: `Playfair Display` + `Poppins` in `index.css`
- [ ] Set up global color variables/theme tokens from design.md palette
  - Primary: `#E8CFC4`, Secondary: `#F8F5F2`, Accent: `#C8A97E`
- [ ] Create base folder structure: `pages/`, `components/`, `api/`, `assets/`

### 1.2 Backend Setup (Node.js + Express)
- [ ] Initialize Node project (`npm init`)
- [ ] Install dependencies: `express`, `mongoose`, `dotenv`, `cors`, `bcryptjs`, `jsonwebtoken`
- [ ] Set up `server.js` with Express app
- [ ] Configure `.env` file for secrets (MONGO_URI, JWT_SECRET, CLOUDINARY keys)
- [ ] Create folder structure: `routes/`, `controllers/`, `models/`, `middleware/`

### 1.3 Database Setup (MongoDB)
- [ ] Create MongoDB Atlas cluster
- [ ] Connect Mongoose in `server.js`
- [ ] Define data models:
  - [ ] **User Model** — name, email, password, role (user/admin)
  - [ ] **Venue Model** — name, location, price, capacity, amenities, images, description, rating
  - [ ] **Booking Model** — userId, venueId, date, guestCount, status (pending/approved/rejected)

### 1.4 Cloudinary Setup (Image Upload)
- [ ] Create Cloudinary account
- [ ] Install `cloudinary` and `multer` packages
- [ ] Create image upload utility/middleware

---

## 🔐 PHASE 2 — Authentication (FR1)

### 2.1 Backend — Auth API
- [ ] Create `POST /api/auth/register` — hash password, return JWT
- [ ] Create `POST /api/auth/login` — validate credentials, return JWT
- [ ] Create `authMiddleware.js` — verify JWT on protected routes
- [ ] Create `adminMiddleware.js` — check role === 'admin'

### 2.2 Frontend — Auth Pages
- [ ] Build `/register` page
  - [ ] Form: Name, Email, Password
  - [ ] Rounded inputs with focus highlight (design.md spec)
  - [ ] Submit → call register API → redirect to login
- [ ] Build `/login` page
  - [ ] Form: Email, Password
  - [ ] Submit → store JWT in localStorage → redirect to home
- [ ] Create `AuthContext` (or Zustand store) for global user state
- [ ] Add protected route wrapper component

---

## 🏠 PHASE 3 — Homepage (design.md §4.1)

- [ ] Build `Navbar` component
  - [ ] Links: Home, Venues, Favorites, Login/Profile
  - [ ] Sticky header style
  - [ ] Hamburger menu for mobile
- [ ] Build **Hero Section**
  - [ ] Full-width background image
  - [ ] Headline + subheadline text (Playfair Display font)
  - [ ] Search bar (city input + search button)
  - [ ] Smooth animated search interaction
- [ ] Build **Featured Venues** section
  - [ ] Fetch top-rated/featured venues from API
  - [ ] Display as horizontal scroll or 3-col grid of VenueCards
- [ ] Build **Categories** section
  - [ ] Banquet Hall, Garden, Poolside, etc.
  - [ ] Click filters venue listing page
- [ ] Build **Testimonials** section
  - [ ] Static/hardcoded quotes with star ratings
- [ ] Build **Footer** component
  - [ ] Links, copyright, social icons

---

## 🔍 PHASE 4 — Search & Filter (FR2)

### 4.1 Backend — Venues API
- [ ] Create `GET /api/venues` — support query params: `city`, `minPrice`, `maxPrice`, `capacity`, `amenities`
- [ ] Create `GET /api/venues/:id` — single venue details

### 4.2 Frontend — Venue Listing Page (`/venues`)
- [ ] Build sidebar filter panel
  - [ ] City/location input
  - [ ] Price range slider (min/max)
  - [ ] Guest capacity input
  - [ ] Checkbox filters: AC, Parking, Catering, Indoor, Outdoor
- [ ] Build **VenueCard** component
  - [ ] Image on top, content below (design.md spec)
  - [ ] Show: name, location, price/day, capacity, short amenities
  - [ ] Slight card elevation/shadow, hover effect
  - [ ] Heart icon for Favorites
- [ ] Display venues in responsive grid
  - [ ] Mobile: 1 col, Tablet: 2 col, Desktop: 3–4 col (design.md §6)
- [ ] Implement live filter state → refetch API on filter change

---

## 🏛️ PHASE 5 — Venue Details Page (FR3, design.md §4.3)

- [ ] Build `/venues/:id` page
- [ ] **Image Gallery** section
  - [ ] Main image + thumbnail strip
  - [ ] Image zoom on hover (design.md §7)
- [ ] **Venue Info** section
  - [ ] Name, location, price/day, max capacity, description
- [ ] **Amenities** section
  - [ ] Icon grid: AC, Parking, Catering, Indoor/Outdoor tags
- [ ] **Ratings & Reviews** section
  - [ ] Star rating display
  - [ ] List of user reviews (if implemented)
- [ ] **Booking Panel** (FR4)
  - [ ] Date picker input
  - [ ] Guest count input
  - [ ] "Send Booking Request" CTA button (rounded, soft shadow, hover effect)
  - [ ] Call `POST /api/bookings`
  - [ ] Show success/error toast

---

## 📅 PHASE 6 — Booking System (FR4)

### 6.1 Backend — Bookings API
- [ ] Create `POST /api/bookings` — create booking (auth required)
- [ ] Create `GET /api/bookings/my` — user's own bookings
- [ ] Create `GET /api/bookings` — all bookings (admin only)
- [ ] Create `PATCH /api/bookings/:id` — approve/reject (admin only)

### 6.2 Frontend — User Bookings
- [ ] Build `/my-bookings` page (protected route)
  - [ ] List of user's booking requests with status badge (Pending/Approved/Rejected)

---

## ❤️ PHASE 7 — Favorites (PRD §4.1)

### 7.1 Backend
- [ ] Add `favorites` array field to User model
- [ ] Create `POST /api/users/favorites/:venueId` — toggle favorite
- [ ] Create `GET /api/users/favorites` — get user's saved venues

### 7.2 Frontend
- [ ] Heart icon on VenueCard toggles favorite (calls API)
- [ ] Build `/favorites` page (protected route)
  - [ ] Displays saved venues as VenueCards grid

---

## 🧑‍💼 PHASE 8 — Admin Dashboard (FR5, FR6, design.md §4.5)

### 8.1 Backend — Admin API (all require adminMiddleware)
- [ ] Create `POST /api/venues` — add new venue (with image upload)
- [ ] Create `PUT /api/venues/:id` — edit venue
- [ ] Create `DELETE /api/venues/:id` — delete venue

### 8.2 Frontend — Admin Pages (route: `/admin`)
- [ ] Admin route guard (redirect if not admin)
- [ ] Build Admin Dashboard layout
  - [ ] Sidebar navigation (design.md §4.5)
- [ ] **Venues Management** tab
  - [ ] Table of all venues with Edit / Delete actions
  - [ ] "Add New Venue" button → modal/form
    - [ ] Fields: Name, Location, Price, Capacity, Description, Amenities checkboxes
    - [ ] Image upload (Cloudinary) — multiple images
- [ ] **Bookings Management** tab
  - [ ] Table of all bookings: user, venue, date, guests, status
  - [ ] Approve / Reject action buttons (calls `PATCH /api/bookings/:id`)

---

## 🗺️ PHASE 9 — Google Maps Integration (teck.md)

- [ ] Get Google Maps API key
- [ ] Install `@react-google-maps/api`
- [ ] Add map to Venue Details page showing venue pin
- [ ] (Optional) Add map view toggle on Venue Listing page

---

## 💳 PHASE 10 — Optional Payment (Razorpay)

- [ ] Install Razorpay SDK (frontend + backend)
- [ ] Create `POST /api/payment/order` — generate Razorpay order
- [ ] Create `POST /api/payment/verify` — verify payment signature
- [ ] Add "Pay Now" button on booking confirmation
- [ ] Handle success/failure callbacks

---

## 🎨 PHASE 11 — UI Polish & Responsiveness

- [ ] Apply hover effects to all interactive elements (design.md §7)
- [ ] Add smooth CSS transitions globally
- [ ] Test and fix all responsive breakpoints (mobile / tablet / desktop)
- [ ] Verify font usage: Playfair Display for headings, Poppins for body
- [ ] Ensure high-contrast text meets accessibility standards
- [ ] Add keyboard accessibility to forms and nav
- [ ] Add loading skeletons/spinners for API calls

---

## 🧪 PHASE 12 — Testing

- [ ] Test all API routes with Postman/Thunder Client
- [ ] Test auth flows (register, login, protected routes)
- [ ] Test venue CRUD as admin
- [ ] Test booking request and approval flow
- [ ] Test favorites toggle and list
- [ ] Test all filters and search
- [ ] Test mobile responsiveness on real device / DevTools
- [ ] Verify page load time < 3 seconds (PRD §7)

---

## 🚀 PHASE 13 — Deployment

- [ ] Push codebase to GitHub repository
- [ ] **Backend → Render**
  - [ ] Set environment variables on Render dashboard
  - [ ] Deploy Express server
- [ ] **Frontend → Vercel**
  - [ ] Set `VITE_API_URL` env variable
  - [ ] Deploy React app
- [ ] Test live production URLs end-to-end
- [ ] Verify Cloudinary image uploads work on production

---

## 🔮 PHASE 14 — Future Enhancements (PRD §12)

- [ ] AI-based venue recommendations
- [ ] Real-time chat with venue owners
- [ ] Virtual venue tours (360° images)
- [ ] Mobile application (React Native)
- [ ] Email notifications on booking status change
