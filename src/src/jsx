import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Package, Trophy, User, Bell, LogOut, CheckCircle2,
  MapPin, Clock, Truck, ShieldCheck, Upload, ArrowRight, X, ChevronRight,
  Flame, Search, ArrowLeft
} from 'lucide-react';
import * as api from './api';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [showListModal, setShowListModal] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setUsers(await api.fetchUsers());
      setListings(await api.fetchListings());
    } catch (err) { console.log("Backend offline fallback"); }
  };

  if (!currentUser) return <Login onLogin={setCurrentUser} users={users} />;

  if (currentUser.status === 'Pending') {
    return <PendingApproval user={currentUser} onApprove={async () => {
      setCurrentUser(await api.approveUser(currentUser._id));
    }} />;
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-yellow-400" />
          <span className="font-bold text-xl tracking-tight">BridgeLocal</span>
        </div>
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
           <div>
             <p className="font-bold text-sm truncate">{currentUser.name}</p>
             <p className="text-xs text-brand-600 font-medium flex items-center gap-1">
               <ShieldCheck size={12}/> Verified {currentUser.role}
             </p>
           </div>
           <div className="w-8 h-8 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-bold text-xs uppercase">
             {(currentUser.name || 'User').substring(0, 2)}
           </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {['Dashboard', currentUser.role === 'Donor' ? 'My Listings' : 'My Claims', 'Leaderboard', 'Profile'].map(tab => {
            const Icon = { 'Dashboard': LayoutDashboard, 'My Listings': Package, 'My Claims': Package, 'Leaderboard': Trophy, 'Profile': User }[tab];
            const isActive = activeTab === tab;
            return (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                <Icon size={20} className={isActive ? 'text-brand-600' : 'text-slate-400'} />
                {tab}
              </button>
            );
          })}
        </nav>
        <div className="p-6">
          <button onClick={() => window.location.reload()} className="flex items-center gap-3 text-sm font-medium text-slate-500 hover:text-red-600 transition-colors">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col relative overflow-y-auto">
        <header className="sticky top-0 z-30 bg-[#F8FAFC]/80 backdrop-blur-md px-8 py-5 flex justify-between items-center border-b border-slate-200/50">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{activeTab === 'Dashboard' ? `${currentUser.role} Dashboard` : activeTab}</h1>
            <p className="text-sm text-slate-500 flex items-center gap-1">Good morning, {(currentUser.name || '').split(' ')[0]} <span className="text-yellow-500">👋</span></p>
          </div>
          <div className="flex items-center gap-4">
            {currentUser.role === 'Donor' && (
              <button onClick={() => setShowListModal(true)} className="bg-brand-600 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md shadow-brand-600/20 hover:bg-brand-700 transition-colors flex items-center gap-2">
                + List Donation
              </button>
            )}
            <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold shadow-sm">
              {(currentUser.name || 'U').substring(0, 1).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="px-8 py-6 max-w-6xl w-full">
           <AnimatePresence mode="wait">
             {activeTab === 'Dashboard' && currentUser.role === 'Donor' && <DonorDashboard key="d-dash" user={currentUser} listings={listings} onRefresh={fetchData} />}
             {activeTab === 'Dashboard' && currentUser.role === 'NGO' && <NGODashboard key="n-dash" user={currentUser} listings={listings} onRefresh={fetchData} />}
             {(activeTab === 'My Listings' || activeTab === 'My Claims') && <MyListings key="my-list" user={currentUser} listings={listings} onRefresh={fetchData} />}
             {activeTab === 'Leaderboard' && <Leaderboard key="leaderboard" users={users} />}
             {activeTab === 'Profile' && <Profile key="profile" user={currentUser} />}
           </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {showListModal && <ListDonationModal onClose={() => setShowListModal(false)} user={currentUser} onRefresh={fetchData} />}
      </AnimatePresence>
    </div>
  );
}

// ----------------------------------------------------------------------------------
// DONOR DASHBOARD
// ----------------------------------------------------------------------------------
function DonorDashboard({ user, listings, onRefresh }) {
  const activeListings = listings.filter(l => l.donorId?._id === user._id && l.status !== 'Delivered');
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 bg-brand-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg shadow-brand-600/20">
           <div className="absolute top-0 right-0 p-8 opacity-20"><Trophy size={160} /></div>
           <p className="text-brand-100 font-bold tracking-widest text-xs uppercase mb-2">Impact Score</p>
           <h2 className="text-5xl font-black mb-4">{user.impactScore || 1393} <span className="text-xl font-medium text-brand-200">pts</span></h2>
           <p className="font-semibold text-brand-50 flex items-center gap-2"><span className="bg-brand-500 px-2 py-1 rounded-md">Rank #{user.rank || 7}</span> nationwide ✨ +3 this week</p>
        </div>
        <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg shadow-orange-500/20">
           <p className="text-orange-100 font-bold tracking-widest text-xs uppercase mb-2">Food Streak</p>
           <h2 className="text-5xl font-black mb-4 flex items-center gap-3"><Flame size={40} className="text-yellow-300" /> {user.foodStreak || 11}</h2>
           <p className="text-sm text-orange-50 font-medium leading-tight">Consecutive days.<br/>Keep donating food to maintain your streak!</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"><p className="text-3xl font-black text-slate-900 mb-1">{user.totalDonated || 23}</p><p className="text-sm font-medium text-slate-500">Total Delivered</p></div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"><p className="text-3xl font-black text-slate-900 mb-1">{activeListings.length}</p><p className="text-sm font-medium text-slate-500">Active Listings</p></div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"><p className="text-3xl font-black text-slate-900 mb-1 flex items-center gap-2"><Trophy size={24} className="text-yellow-500"/> #{user.rank || 7}</p><p className="text-sm font-medium text-slate-500">Leaderboard Rank</p></div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg">Recent Listings</h3></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {listings.filter(l => l.donorId?._id === user._id).slice(0,2).map(listing => (
             <ListingCard key={listing._id} listing={listing} role="Donor" />
           ))}
        </div>
      </div>
    </motion.div>
  );
}

// ----------------------------------------------------------------------------------
// NGO DASHBOARD
// ----------------------------------------------------------------------------------
function NGODashboard({ user, listings, onRefresh }) {
  const [claimModal, setClaimModal] = useState(null);
  const available = listings.filter(l => l.status === 'Available');

  const handleClaimConfirm = async (listing, override) => {
    await api.claimListing(listing._id, user._id, override);
    setClaimModal(null);
    onRefresh();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm"><p className="text-sm font-medium text-slate-500 mb-2">Available Donations</p><p className="text-4xl font-black text-brand-600">{available.length}</p></div>
         <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm"><p className="text-sm font-medium text-slate-500 mb-2">My Active Claims</p><p className="text-4xl font-black text-slate-900">{listings.filter(l => l.claimedByNGOId?._id === user._id && l.status !== 'Delivered').length}</p></div>
         <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm bg-gradient-to-br from-brand-50 to-white"><p className="text-sm font-medium text-slate-500 mb-2">Organization</p><p className="text-xl font-bold text-slate-900 leading-tight">{user.organizationName}</p></div>
       </div>
       <div className="flex gap-4">
         <div className="flex-1 bg-white border border-slate-200 rounded-full px-5 py-3.5 flex items-center gap-3 shadow-sm"><Search size={20} className="text-slate-400" /><input type="text" placeholder="Search by item, location, or category..." className="w-full focus:outline-none font-medium" /></div>
       </div>
       <div className="flex gap-2 pb-2 overflow-x-auto">
         {['All', 'Food', 'Education', 'Clothes', 'Others'].map(cat => (
           <button key={cat} className={`px-5 py-2 rounded-full text-sm font-bold border transition-colors whitespace-nowrap ${cat === 'All' ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-600/20' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}>{cat}</button>
         ))}
       </div>
       <div>
         <h3 className="font-bold text-lg mb-4">Latest Donations</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {available.map(listing => (
             <ListingCard key={listing._id} listing={listing} role="NGO" onClaimClick={() => setClaimModal(listing)} />
           ))}
         </div>
       </div>
       <AnimatePresence>
         {claimModal && <ClaimModal listing={claimModal} onClose={() => setClaimModal(null)} onConfirm={handleClaimConfirm} />}
       </AnimatePresence>
    </motion.div>
  );
}

// ----------------------------------------------------------------------------------
// LISTING CARD & MODALS
// ----------------------------------------------------------------------------------
function ListingCard({ listing, role, onClaimClick }) {
  const isDonorPays = listing.logistics === 'Donor Pays';
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4"><span className="bg-brand-50 text-brand-700 border border-brand-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{listing.status}</span></div>
      <div>
        <div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center"><Package size={20}/></div><div><p className="font-bold text-slate-900 leading-tight pr-20">{listing.title}</p></div></div>
        <p className="text-sm text-slate-500 font-medium mb-4 leading-relaxed">Freshly packed for immediate distribution in food-grade containers.</p>
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6">
          <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5"><Package size={14} className="text-slate-400"/> {listing.quantity}</span>
          <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5"><MapPin size={14} className="text-slate-400"/> {(listing.location || '').split(',')[0]}</span>
        </div>
      </div>
      <div className="pt-4 border-t border-slate-100 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
           {isDonorPays ? <><Truck size={16} className="text-brand-500"/> Donor Pays - {listing.deliveryPartner}</> : <><Truck size={16} className="text-slate-400"/> NGO Pays</>}
        </div>
        {role === 'NGO' && listing.status === 'Available' && (
          <button onClick={onClaimClick} className="w-full bg-brand-600 text-white py-3.5 rounded-2xl font-bold hover:bg-brand-700 transition-colors shadow-md shadow-brand-600/20">Claim Donation</button>
        )}
      </div>
    </div>
  );
}

function ListDonationModal({ onClose, user, onRefresh }) {
  const [formData, setFormData] = useState({ title: '', quantity: '', category: 'Food', logistics: 'Donor Pays', deliveryPartner: 'Dunzo', location: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.createListing({ ...formData, donorId: user._id });
    onRefresh(); onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div><h2 className="text-2xl font-black">List a Donation</h2><p className="text-sm text-slate-500 font-medium mt-1">NGOs in your area will be notified instantly</p></div>
          <button onClick={onClose} className="bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-slate-200"><X size={20}/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6 bg-white">
          <div><label className="block text-sm font-bold mb-2">Item Title *</label><input required value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} placeholder="e.g. Home-cooked Biryani" className="w-full border-2 border-slate-100 rounded-2xl px-5 py-4 font-medium" /></div>
          <div><label className="block text-sm font-bold mb-2">Quantity *</label><input required value={formData.quantity} onChange={e=>setFormData({...formData, quantity: e.target.value})} placeholder="e.g. 30 servings" className="w-full border-2 border-slate-100 rounded-2xl px-5 py-4 font-medium" /></div>
          <div><label className="block text-sm font-bold mb-2">Pickup Address *</label><input required value={formData.location} onChange={e=>setFormData({...formData, location: e.target.value})} placeholder="Full pickup address" className="w-full border-2 border-slate-100 rounded-2xl px-5 py-4 font-medium" /></div>
          <div>
            <label className="block text-sm font-bold mb-2">Transport Arrangement *</label>
            <div className="grid grid-cols-2 gap-4">
               <label className={`block border-2 rounded-2xl p-4 cursor-pointer transition-all ${formData.logistics === 'Donor Pays' ? 'border-brand-500 bg-brand-50' : 'border-slate-100'}`}>
                 <div className="flex items-center gap-3"><input type="radio" checked={formData.logistics === 'Donor Pays'} onChange={()=>setFormData({...formData, logistics: 'Donor Pays'})} className="w-4 h-4 text-brand-600" /><div><p className="font-bold text-sm">Donor Pays</p><p className="text-xs text-slate-500 font-medium">You arrange & pay</p></div></div>
               </label>
               <label className={`block border-2 rounded-2xl p-4 cursor-pointer transition-all ${formData.logistics === 'NGO Pays' ? 'border-brand-500 bg-brand-50' : 'border-slate-100'}`}>
                 <div className="flex items-center gap-3"><input type="radio" checked={formData.logistics === 'NGO Pays'} onChange={()=>setFormData({...formData, logistics: 'NGO Pays'})} className="w-4 h-4 text-brand-600" /><div><p className="font-bold text-sm">NGO Pays</p><p className="text-xs text-slate-500 font-medium">NGO arranges pickup</p></div></div>
               </label>
            </div>
          </div>
          {formData.logistics === 'Donor Pays' && (
            <div>
              <label className="block text-sm font-bold mb-3">Delivery Partner</label>
              <div className="flex flex-wrap gap-4 text-sm font-bold text-slate-700">
                {['Dunzo', 'Porter', 'Shadowfax', 'Self Arrange'].map(p => (
                  <label key={p} className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={formData.deliveryPartner === p} onChange={()=>setFormData({...formData, deliveryPartner: p})} className="w-4 h-4 text-brand-600 border-slate-300" />{p}</label>
                ))}
              </div>
            </div>
          )}
          <div className="pt-4 sticky bottom-0 bg-white"><button type="submit" className="w-full bg-brand-600 text-white font-bold text-lg py-4 rounded-2xl hover:bg-brand-700">Publish Listing</button></div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function ClaimModal({ listing, onClose, onConfirm }) {
  const [override, setOverride] = useState(false);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
         <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
           <div className="flex items-center gap-3"><div className="bg-brand-50 p-2.5 rounded-full text-brand-600"><CheckCircle2 size={24}/></div><div><h2 className="text-xl font-black text-slate-900">Claim Donation</h2></div></div>
           <button onClick={onClose} className="bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-slate-200"><X size={20}/></button>
         </div>
         <div className="p-8 space-y-6 bg-slate-50/50">
            <div className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
              <div className="bg-slate-100 p-3 rounded-xl"><Package size={24} className="text-slate-600" /></div>
              <div><h3 className="font-bold text-slate-900 text-lg leading-tight mb-1">{listing.title}</h3></div>
            </div>
            <div className="flex justify-between px-2 text-center">
              <div><p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Quantity</p><p className="font-bold text-slate-900">{listing.quantity}</p></div>
              <div><p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Location</p><p className="font-bold text-slate-900">{(listing.location || '').split(',')[0]}</p></div>
            </div>
         </div>
         <div className="px-8 py-6 bg-white border-t border-slate-100 flex gap-4">
           <button onClick={onClose} className="w-1/3 py-4 rounded-2xl font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200">Cancel</button>
           <button onClick={() => onConfirm(listing, override)} className="w-2/3 py-4 rounded-2xl font-bold text-white bg-brand-600 hover:bg-brand-700">Confirm Claim &rarr;</button>
         </div>
      </motion.div>
    </motion.div>
  );
}

// ----------------------------------------------------------------------------------
// VIEWS (LEADERBOARD, MY LISTINGS, PROFILE)
// ----------------------------------------------------------------------------------
function Leaderboard({ users }) {
  const donors = users.filter(u => u.role === 'Donor').sort((a,b) => (b.impactScore || 0) - (a.impactScore || 0));
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm mb-6 flex justify-between items-center bg-gradient-to-br from-brand-600 to-brand-700 text-white">
        <div><h2 className="text-3xl font-black mb-2">City Leaderboard</h2><p className="text-brand-100 font-medium">Top donors making a difference in Hyderabad</p></div>
        <Trophy size={64} className="text-brand-300 opacity-50" />
      </div>
      <div className="space-y-4">
        {donors.map((donor, idx) => (
          <div key={donor._id} className="bg-white rounded-2xl p-5 border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg ${idx===0?'bg-yellow-100 text-yellow-600':idx===1?'bg-slate-100 text-slate-600':idx===2?'bg-orange-100 text-orange-600':'bg-slate-50 text-slate-400'}`}>#{idx+1}</div>
              <div><p className="font-bold text-slate-900 text-lg">{donor.name}</p><p className="text-sm font-medium text-slate-500">{donor.totalDonated || 0} donations delivered</p></div>
            </div>
            <div className="text-right"><p className="font-black text-2xl text-brand-600">{donor.impactScore || 0}</p><p className="text-xs font-bold text-brand-400 uppercase tracking-widest">Points</p></div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function MyListings({ user, listings, onRefresh }) {
  const myListings = listings.filter(l => user.role === 'Donor' ? l.donorId?._id === user._id : l.claimedByNGOId?._id === user._id);
  const active = myListings.filter(l => l.status !== 'Delivered');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
       <div className="flex gap-4 border-b border-slate-200 pb-px mb-8">
         <button className="px-6 py-3 border-b-2 border-brand-600 text-brand-600 font-bold">Active ({active.length})</button>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {active.map(listing => (
            <ListingCard key={listing._id} listing={listing} role={user.role} />
         ))}
       </div>
    </motion.div>
  );
}

function Profile({ user }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl py-8">
       <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
         <div className="flex items-center gap-6 mb-10">
           <div className="w-24 h-24 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center font-black text-3xl">
             {(user.name || 'User').substring(0,2).toUpperCase()}
           </div>
           <div>
             <h2 className="text-2xl font-black text-slate-900 mb-1">{user.name}</h2>
             <p className="text-slate-500 font-medium mb-2">{user.email}</p>
             <span className="bg-brand-50 text-brand-700 border border-brand-200 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1 w-max"><ShieldCheck size={14}/> Verified {user.role}</span>
           </div>
         </div>
       </div>
    </motion.div>
  );
}

// ----------------------------------------------------------------------------------
// AUTHENTICATION (LOGIN, REGISTRATION)
// ----------------------------------------------------------------------------------
function Login({ onLogin, users }) {
  const [mode, setMode] = useState('landing');
  const [phone, setPhone] = useState('');
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try { onLogin(await api.loginUser(phone)); } catch (err) { alert(err.message); }
  };

  if (mode === 'register-ngo') return <NGORegistration onBack={() => setMode('signup-choice')} onComplete={onLogin} />;
  if (mode === 'register-donor') return <DonorRegistration onBack={() => setMode('signup-choice')} onComplete={onLogin} />;

  if (mode === 'signup-choice') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 relative">
        <button onClick={() => setMode('login')} className="absolute top-6 left-6 flex items-center gap-2 text-slate-500 font-medium hover:text-slate-900 mb-8"><ArrowLeft size={18}/> Back to Login</button>
        <h2 className="text-3xl font-black text-slate-900 mb-6">Create an Account</h2>
        <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl justify-center">
           <button onClick={() => setMode('register-donor')} className="flex-1 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:border-brand-500 hover:shadow-md transition-all text-center">
             <div className="w-16 h-16 mx-auto bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mb-4"><Package size={32}/></div>
             <h3 className="font-bold text-xl mb-2 text-slate-900">Donor</h3>
             <p className="text-sm text-slate-500 font-medium">I want to list surplus items for donation.</p>
           </button>
           <button onClick={() => setMode('register-ngo')} className="flex-1 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:border-brand-500 hover:shadow-md transition-all text-center">
             <div className="w-16 h-16 mx-auto bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mb-4"><ShieldCheck size={32}/></div>
             <h3 className="font-bold text-xl mb-2 text-slate-900">NGO</h3>
             <p className="text-sm text-slate-500 font-medium">I want to register to claim and distribute items.</p>
           </button>
        </div>
      </div>
    );
  }

  if (mode === 'login') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 relative">
        <div className="max-w-md w-full text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center mb-6">
            <ShieldCheck size={32} className="text-brand-600" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Welcome back</h2>
        </div>

        <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl shadow-slate-200 border border-slate-100">
          <div className="flex bg-slate-100 rounded-full p-1 mb-8">
            <button className="flex-1 py-2.5 rounded-full bg-white font-bold shadow-sm text-slate-900">Sign In</button>
            <button onClick={() => setMode('signup-choice')} className="flex-1 py-2.5 rounded-full font-bold text-slate-500 hover:text-slate-900">Sign Up</button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Mobile Number</label>
              <div className="flex border-2 border-slate-100 rounded-2xl overflow-hidden focus-within:border-brand-500 transition-colors">
                <div className="bg-slate-50 px-4 py-3.5 font-bold text-slate-500 border-r border-slate-100">+91</div>
                <input required value={phone} onChange={e => setPhone(e.target.value)} placeholder="Enter registered phone" className="w-full px-4 py-3.5 font-bold focus:outline-none" />
              </div>
            </div>
            <button type="submit" className="w-full bg-slate-900 text-white font-bold text-lg py-4 rounded-2xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/30">
              Sign In
            </button>
          </form>

          <button onClick={() => onLogin(users.find(u => u.role === 'Donor') || { _id: '1', role: 'Donor', name: 'Arjun Reddy', impactScore: 1393, foodStreak: 11, totalDonated: 23, status: 'Verified' })} className="w-full bg-brand-600 text-white font-bold text-lg py-4 rounded-2xl hover:bg-brand-700 transition-colors mb-4">
            Demo Login: Donor
          </button>
          <button onClick={() => onLogin(users.find(u => u.role === 'NGO') || { _id: '2', role: 'NGO', name: 'Pratham', organizationName: 'Pratham Hyderabad', status: 'Verified' })} className="w-full bg-slate-900 text-white font-bold text-lg py-4 rounded-2xl hover:bg-slate-800 transition-colors shadow-lg">
            Demo Login: NGO
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
       <div className="text-center mb-12">
         <div className="flex items-center justify-center gap-2 text-brand-600 font-bold mb-6"><Package size={24}/> Social Impact Platform</div>
         <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">Donate with purpose.</h1>
       </div>
       <div className="w-full max-w-md space-y-4">
         <button onClick={() => setMode('register-donor')} className="w-full bg-brand-600 text-white rounded-3xl p-6 flex items-center justify-between shadow-xl shadow-brand-600/20 hover:scale-[1.02] transition-all">
           <div className="flex items-center gap-4 text-left"><div className="bg-white/20 p-3 rounded-2xl"><Package size={24}/></div><div><p className="font-bold text-lg">I'm a Donor</p><p className="text-brand-100 text-sm font-medium">List items for NGOs to claim</p></div></div><ArrowRight size={24}/>
         </button>
         <button onClick={() => setMode('register-ngo')} className="w-full bg-white text-slate-900 border border-slate-200 rounded-3xl p-6 flex items-center justify-between shadow-sm hover:scale-[1.02] transition-all">
           <div className="flex items-center gap-4 text-left"><div className="bg-brand-50 text-brand-600 p-3 rounded-2xl"><ShieldCheck size={24}/></div><div><p className="font-bold text-lg">I'm an NGO</p><p className="text-slate-500 text-sm font-medium">Register & discover donations</p></div></div><ArrowRight size={24} className="text-slate-400"/>
         </button>
       </div>
       <button onClick={() => setMode('login')} className="mt-8 text-slate-500 font-medium hover:text-slate-900">Already have an account? <span className="font-bold text-slate-900">Sign in</span></button>
    </div>
  );
}

function NGORegistration({ onBack, onComplete }) {
  const [formData, setFormData] = useState({ organizationName: '', representativeName: '', email: '', phone: '', city: '' });
  const handleSubmit = async () => { onComplete(await api.registerNGO(formData)); };
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-xl w-full">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-medium hover:text-slate-900 mb-8"><ArrowLeft size={18}/> Back</button>
        <div className="bg-white rounded-[32px] p-8 shadow-2xl border border-slate-100">
           <h2 className="text-2xl font-black mb-6">NGO Details</h2>
           <input value={formData.organizationName} onChange={e=>setFormData({...formData, organizationName: e.target.value})} placeholder="Organisation Name" className="w-full bg-slate-50 border border-slate-100 px-4 py-3.5 rounded-2xl font-medium mb-4" />
           <input value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} placeholder="Phone Number" className="w-full bg-slate-50 border border-slate-100 px-4 py-3.5 rounded-2xl font-medium mb-6" />
           <button onClick={handleSubmit} className="w-full bg-brand-600 text-white font-bold text-lg py-4 rounded-2xl hover:bg-brand-700">Complete Registration</button>
        </div>
      </div>
    </div>
  );
}

function DonorRegistration({ onBack, onComplete }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', city: '' });
  const handleSubmit = async (e) => { e.preventDefault(); onComplete(await api.registerDonor(formData)); };
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-xl w-full">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-medium hover:text-slate-900 mb-8"><ArrowLeft size={18}/> Back</button>
        <form onSubmit={handleSubmit} className="bg-white rounded-[32px] p-8 shadow-2xl border border-slate-100 space-y-5">
           <h2 className="text-2xl font-black mb-2">Donor Registration</h2>
           <input required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} placeholder="Full Name" className="w-full bg-slate-50 border border-slate-100 px-4 py-3.5 rounded-2xl font-medium" />
           <input required value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} placeholder="Phone" className="w-full bg-slate-50 border border-slate-100 px-4 py-3.5 rounded-2xl font-medium" />
           <button type="submit" className="w-full mt-6 bg-brand-600 text-white font-bold text-lg py-4 rounded-2xl hover:bg-brand-700">Join Platform</button>
        </form>
      </div>
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
            <h1 className="text-red-500 font-bold text-xl">Crash Prevented</h1>
            <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="mt-4 px-4 py-2 bg-red-100 text-red-600 font-bold rounded">Clear Storage & Restart</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function AppWrapper() {
  return <ErrorBoundary><App /></ErrorBoundary>;
}
