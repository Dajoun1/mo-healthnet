# MO HealthNet Frontend - UI Application

## Project Overview

MO HealthNet is a Missouri Medicaid Employment Verification System designed to streamline the process of verifying employment information for Medicaid applicants. This repository is a monolith that contains the UI components of the application and the API.

## Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Routing:** React Router v6
- **State Management:** React Context API (AuthContext)
- **Package Manager:** npm

## Installation

### Prerequisites
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Java 25** (for backend) - [Download here](https://www.oracle
- **Spring Boot Backend** running on `http://localhost:8080`

### Setup Steps

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd mo-healthnet/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Open your browser to `http://localhost:5173`
   - Default Vite dev server port is 5173

## Configuration

### API Base URL

The frontend communicates with the backend via the `api.js` service. The API base URL is configured in `src/services/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
```

**Environment Variables:**
- `VITE_API_URL` - Set this to change the backend API endpoint
- By default, it uses `http://localhost:8080` (local development)

**To set a custom API URL:**

Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://your-backend-server:8080
```

### CORS Configuration

The frontend is configured to communicate with the backend through CORS (Cross-Origin Resource Sharing). The backend Spring Boot application includes CORS configuration in `WebConfig.java` to allow requests from:
- `http://localhost:5173` (development)
- `http://localhost:3000` (backup port)


### Authentication
- **Component:** `Signin.jsx`
- **Service:** `authService.login()` in `api.js`
- **Endpoint:** `POST /auth/login`

### 4. HTTP Client
- **File:** `services/api.js`
- **Library:** Axios
- **Features:**
  - Centralized API request handling
  - Automatic token injection in Authorization header
  - Error handling with redirect on 401 (Unauthorized)
  - Request/response logging (in development)

## Styling
The project uses Tailwind CSS for styling. All components use Tailwind utility classes.

## Development Workflow

### Vite
Vite provides fast Hot Module Replacement (HMR) - changes to your code automatically reload in the browser without losing state.

### Console Logging
The API service includes detailed console logging for debugging:
- Request details (method, URL, data)
- Response details (status, data)
- Error information with full stack traces
## Testing

### Test Backend Connection (Temporary Test Page)
A temporary test page is available at `http://localhost:5173/test` to verify backend connectivity and API responses without going through the full authentication flow.
1. Navigate to `http://localhost:5173/test`
2. Click the "Test /login Endpoint" button

### Manual Testing
1. Start the backend: `cd backend && mvn spring-boot:run`
2. Start the frontend: `cd frontend && npm install && npm run dev`
3. Open `http://localhost:5173/signin`
4. Enter test credentials and click Sign In
5. Watch browser console and backend logs for requests/responses

## Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [React Router Documentation](https://reactrouter.com)
- [Axios Documentation](https://axios-http.com)
- [Missouri Medicaid Information](https://dss.mo.gov/rhc/)

---

**Backend Repository:** See `../backend/` for Spring Boot backend setup and documentation.
