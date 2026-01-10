# 📱 Mr. Fix My Phone - Enterprise Repair Management System

A full-stack, production-ready web platform for modern device repair businesses. This system streamlines the entire repair lifecycle—from customer booking to device diagnostics and final pickup.

![Status](https://img.shields.io/badge/Status-Production%20Ready-green)
![Tech](https://img.shields.io/badge/Tech-React%20%7C%20Supabase%20%7C%20Tailwind-blue)

## ✨ Key Features

### 🏢 Admin Command Center
- **Live Dashboard**: Real-time overview of active repairs, revenue metrics, and support tickets.
- **Booking Management**: Complete CRUD operations for customer bookings with status tracking (e.g., *Diagnosing*, *Waiting for Parts*, *Ready*).
- **Service Catalog**: Dynamic management of repair services and pricing via a visual interface.
- **One-Click Communication**: Integrated WhatsApp and Phone dialer buttons for instant customer updates.
- **Device Database**: Pre-seeded database of 200+ device models (Apple, Samsung, Google, etc.).

### � Client Portal
- **Repair Tracking**: Customers can log in to view the real-time status of their device repair.
- **Service History**: persistent record of all past repairs and invoices.
- **Profile Management**: Users can update their contact info and custom avatars.
- **Seamless Booking**: "Wizard-style" booking flow for easy quote estimation and appointment scheduling.

### 🛠 Technical Highlights
- **Authentication**: Secure role-based auth (Admin vs Client) using **Supabase Auth**.
- **Database**: Real-time Postgres database hosted on **Supabase**.
- **Responsive Design**: Mobile-first architecture ensures perfect usability on phones and tablets.
- **Performance**: Optimized with Vite for near-instant load times.
- **Emergency Mode**: A unique toggle for urgent, high-priority repair flagging.

## � Getting Started

### Prerequisites
- Node.js (v18+)
- A Supabase project (for DB & Auth)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/repair-management-system.git
    cd repair-management-system
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment**:
    Create a `.env` file in the root directory:
    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run Locally**:
    ```bash
    npm run dev
    ```

## 🗄️ Database Schema
The project uses the following Supabase tables:
- `bookings`: Stores repair appointments, status, and quotes.
- `repair_services`: Catalog of available fixes and base prices.
- `support_tickets`: Customer inquiries and contact form submissions.
- `device_models`: Database of phones, tablets, and laptops.
- `service_menu_items`: Dynamic header navigation items.

## 🎨 Customization
- **Theme**: Edit `tailwind.config.js` to change the `primary` (Brand Color) and `secondary` (Dark UI) colors.
- **Shop Details**: Update `src/data.js` to configure the shop name, phone number, and location.

---
*Built with ❤️ for repair shops worldwide.*
