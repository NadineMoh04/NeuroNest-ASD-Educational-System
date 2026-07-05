import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext.jsx';
import HomePage from './components/HomePage.jsx';
import AboutUs from './components/AboutUs.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Test from './components/Test.jsx';
import ParentDashboard from './components/ParentDashboard.jsx';
import ChildMode from './components/ChildMode.jsx';
import ChildInfo from './components/ChildInfo.jsx';
import EditChildProfile from './components/EditChildProfile.jsx';
import ViewChildProfile from './components/ViewChildProfile.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import ParentManagement from './components/ParentManagement.jsx';
import ChildManagement from './components/ChildManagement.jsx';
import PlayTogetherMode from './components/PlayTogetherMode.jsx';
import ProgressReport from './components/ProgressReport.jsx';


import './App.css';

function App() {
  return (
    <LanguageProvider>
      <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/test" element={<Test />} />
          <Route path="/child-info" element={<ChildInfo />} />
          <Route path="/parentdashboard" element={<ParentDashboard />} />  




          <Route path="/child-mode/:childId" element={<ChildMode />} />
          <Route path="/edit-child/:childId" element={<EditChildProfile />} />
          <Route path="/view-child/:childId" element={<ViewChildProfile />} />

          
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/parents" element={<ParentManagement />} />
          <Route path="/admin/children" element={<ChildManagement />} />

          
          <Route path="/playtogether/:childId" element={<PlayTogetherMode />} />

          
          <Route path="/progress/:childId" element={<ProgressReport />} />
        </Routes>
      </div>
    </Router>
    </LanguageProvider>
  );
}

export default App;
