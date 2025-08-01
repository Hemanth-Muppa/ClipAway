# Background Removal App

This project is a full-stack MERN web application that allows users to effortlessly remove backgrounds from images, manage usage credits, and purchase credits securely. The app utilizes AI-powered background removal, robust authentication (via Clerk), and secure payments (via Razorpay). The project architecture is modern, modular, and production ready.

## Features

- **AI Background Removal:** Instantly remove image backgrounds with the ClipDrop API.
- **User Authentication:** Seamless and secure authentication with Clerk, including social sign-in and webhooks.
- **Credit System:** Every background removal operation deducts one credit from the user's balance.
- **Credit Purchase:** Easy and secure credit top-up via Razorpay integration with multiple plans.
- **User Dashboard:** View and manage credit balance.
- **Modern Responsive UI:** Built with React & TailwindCSS for a fast, mobile-friendly experience.
- **Toast Notifications & Feedback:** Real-time status updates on actions.


## Tech Stack

| Layer           | Technologies / Services                    |
|-----------------|--------------------------------------------|
| Frontend        | React, TailwindCSS, Axios, Clerk, React Toastify |
| Backend         | Node.js, Express.js, Multer, JWT, Mongoose |
| Database        | MongoDB Atlas                             |
| Authentication  | Clerk                                     |
| Payments        | Razorpay                                  |
| Image Processing| ClipDrop API                              |
| Deployment      | Vercel (Frontend), Vercel/Render/Heroku (API) |

## Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB Atlas account or local MongoDB server
- Clerk account ([clerk.dev](https://clerk.dev/))
- Razorpay account ([razorpay.com](https://razorpay.com/))
- ClipDrop API key

### Backend Setup

1. **Clone the repository:**
    ```
    git clone https://github.com/Hemanth-Muppa/ClipAway.git
    cd server
    ```

2. **Install backend dependencies:**
    ```
    npm install
    ```

3. **Create a `.env` file in the backend directory with the following example entries:**
    ```
    PORT=4000
    MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/clipaway
    CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
    CLIPDROP_API=your_clipdrop_api_key
    RAZORPAY_KEY_ID=your_razorpay_key_id
    RAZORPAY_KEY_SECRET=your_razorpay_key_secret
    CURRENCY=INR
    ```

4. **Start the backend server:**
    ```
    nodemon server.js
    ```

### Frontend Setup

1. **Navigate to the frontend (client) directory:**
    ```
    cd client
    ```

2. **Install frontend dependencies:**
    ```
    npm install
    ```

3. **Create a `.env` file in the client directory with example entries:**
    ```
    VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    VITE_BACKEND_URL=http://localhost:4000   # Or your production API URL
    VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
    ```

4. **Start the frontend development server:**
    ```
    npm run dev
    ```

5. **Open your browser and visit:**  
   `http://localhost:5173` (or the port shown in the console)

## Usage

- **Home Page:** Upload an image to remove its background.
- **Result Page:** View the processed image, download it, or try another image.
- **Credits:** Check available credits in the navbar, and purchase more credits in the Buy page.
- **Authentication:** Register, sign in, or sign out via Clerk authentication system.

## API Overview

- `POST /api/image/remove-bg` — Remove image background (multipart/form-data upload, authenticated).
- `GET /api/user/credits` — Retrieve the currently logged-in user's credit balance.
- `POST /api/user/pay-razor` — Initiate Razorpay payment for credits.
- `POST /api/user/verify-razor` — Verify Razorpay payment and update credit balances.
- `POST /api/user/webhooks` — Handle Clerk user webhooks for sync.


## Customization

- Update credit plans and pricing in backend and frontend files (`UserController.js`, `BuyCredit.jsx`).
- You can replace the ClipDrop API with any other background removal API by modifying the image controller.
- Customize UI easily with TailwindCSS.

## Deployment

- **Frontend:** Deploy using static hosting services like Vercel or Netlify.
- **Backend:** Deploy using Vercel (serverless), Render, Heroku, or any Node.js hosting.
- **Database:** Use MongoDB Atlas for cloud database hosting.
- **Environment variables:** Make sure all API keys and secrets are set on the hosting platform.

## Security

- Store all sensitive credentials securely in environment variables.
- JWT authentication protects sensitive routes.
- Svix verifies incoming Clerk webhook payloads to prevent spoofing.
- Multer only accepts valid image file uploads.
- CORS is configured to restrict API access to allowed origins.

## Contributing

Contributions are welcome!  
Please fork the repository and submit pull requests. For significant changes, open an issue first to discuss improvements or fixes.

## Acknowledgments

- [ClipDrop API](https://clipdrop.co/)
- [Clerk](https://clerk.dev/)
- [Razorpay](https://razorpay.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [TailwindCSS](https://tailwindcss.com/)
- [React](https://reactjs.org/)

---

Made with ❤️ by MUPPA HEMANTH

