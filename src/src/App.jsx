import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShieldCheck, LogOut, Package, MapPin, Clock, Truck, Search, Plus, ArrowLeft, Building2 } from 'lucide-react';
import * as api from './api';
function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [listings, setListings] = useState([]);
  // Fetch initial data from local storage
  const fetchData = async () => {
     setListings(await api.fetchListings());
  };
  useEffect(() => { fetchData(); }, []);
  // Show login screen if not authenticated
  if (!currentUser) return <Login onLogin={setCurrentUser} />;
  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* 1. Left Sidebar Navigation */}
      <aside className="...">...</aside>
      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Dynamic Route Rendering based on role */}
        <AnimatePresence mode="wait">
             {activeTab === 'Dashboard' && currentUser.role === 'Donor' && <DonorDashboard />}
             {activeTab === 'Dashboard' && currentUser.role === 'NGO' && <NGODashboard />}
             {(activeTab === 'My Listings' || activeTab === 'My Claims') && <MyListings />}
        </AnimatePresence>
      </main>
    </div>
  );
}
// ------------------------------------------------------------------
// GLOBAL CRASH HANDLER (The Fix for the Blank White Screens)
// ------------------------------------------------------------------
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-8">
          <div className="bg-white p-8 rounded-3xl shadow-xl">
            <h1 className="text-3xl font-black mb-4">React App Crashed</h1>
            <pre className="bg-red-900 text-red-50 p-4 rounded-xl">{this.state.error.toString()}</pre>
            <button onClick={() => { localStorage.clear(); window.location.reload(); }}>
               Clear Local Storage & Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
export default function AppWrapper() {
  return <ErrorBoundary><App /></ErrorBoundary>;
}
