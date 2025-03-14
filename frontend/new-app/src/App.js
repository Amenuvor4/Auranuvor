import React from 'react';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Import componets
import HomePage from './componets/HomePage';
import Auth from './componets/Auth';
import Dashboard from './Dashboard/DashBoard';
//C:\Users\Dell_i7_16gb_256gb\OneDrive\Desktop\Personal projects\Auranuvor\frontend\new-app\src\Dashboard\DashBoard.jsx

function App() {
  return (
    <Router>
      <div className="font-sans text-gray-800">
        {/* Main Content */}
        <main className="p-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/Auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

