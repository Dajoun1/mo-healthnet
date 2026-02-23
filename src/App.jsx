// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './pages/Navbar';

// Page Components (create these separately)
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import SignIn from './components/Signin'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        {/* Add padding-top to prevent content from hiding behind fixed navbar */}
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path='/signin' element={<SignIn/>} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;