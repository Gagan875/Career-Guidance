# Digital Guidance Platform

A personalized career and education advisor platform for students built with React and Node.js.

## Features

- **User Authentication**: Secure login and registration system
- **Student Profile Management**: Complete profile with academic background, interests, and location
- **Career Guidance**: Personalized recommendations based on student profile
- **College & Course Discovery**: Browse and save colleges and courses
- **Interactive Quizzes**: Career assessment tools
- **Dark/Light Mode**: Toggle between dark and light themes with automatic system preference detection
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Axios for API calls
- Tailwind CSS for styling

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd digital-guidance-platform
```

2. Install dependencies for all parts of the application
```bash
npm run install-all
```

3. Set up environment variables
Create a `.env` file in the `server` directory with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/digital_guidance_platform
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. Start MongoDB service (if running locally)

5. Run the application
```bash
npm run dev
```

This will start both the client (http://localhost:3000) and server (http://localhost:5000) concurrently.

### Individual Commands

- Start only the server: `npm run server`
- Start only the client: `npm run client`
- Build the client for production: `npm run build`

## Project Structure

```
digital-guidance-platform/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts (Auth)
│   │   ├── pages/          # Page components
│   │   └── ...
│   └── package.json
├── server/                 # Node.js backend
│   ├── middleware/         # Express middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   └── package.json
└── package.json           # Root package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### User Profile
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/save-college/:collegeId` - Save college
- `POST /api/users/save-course/:courseId` - Save course

### Additional Routes
- `/api/quiz` - Quiz-related endpoints
- `/api/colleges` - College data endpoints
- `/api/courses` - Course data endpoints

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
