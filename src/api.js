const seedData = () => {
  const storedUsers = localStorage.getItem('users');
  if (!storedUsers || storedUsers === '[]') {
    const users = [
      { _id: '1', role: 'Donor', name: 'Arjun Reddy', email: 'arjun@example.com', phone: '9849123456', city: 'Hyderabad', status: 'Verified', impactScore: 1393, foodStreak: 11, totalDonated: 23 },
      { _id: '2', role: 'NGO', name: 'Pratham', organizationName: 'Pratham Hyderabad', email: 'hello@pratham.org', phone: '9876543210', city: 'Hyderabad', status: 'Verified', impactScore: 0, foodStreak: 0, totalDonated: 0 }
    ];
    localStorage.setItem('users', JSON.stringify(users));
  }
  const storedListings = localStorage.getItem('listings');
  if (!storedListings || storedListings === '[]') {
    const listings = [
      { _id: '101', title: '50 Boxed Meals (Veg)', quantity: '50 portions', category: 'Food', location: 'Madhapur, Hyderabad', logistics: 'Donor Pays', deliveryPartner: 'Dunzo', status: 'Available', donorId: '1' },
      { _id: '102', title: 'Winter Jackets', quantity: '25 jackets', category: 'Clothes', location: 'Jubilee Hills, Hyderabad', logistics: 'Self-Pickup', status: 'Available', donorId: '1' }
    ];
    localStorage.setItem('listings', JSON.stringify(listings));
  }
};
seedData();
const generateId = () => Math.random().toString(36).substr(2, 9);
export const fetchUsers = async () => JSON.parse(localStorage.getItem('users') || '[]');
export const fetchListings = async () => {
  const listings = JSON.parse(localStorage.getItem('listings') || '[]');
  const users = await fetchUsers();
  return listings.map(l => ({
    ...l,
    donorId: users.find(u => u._id === l.donorId) || null,
    claimedByNGOId: l.claimedByNGOId ? users.find(u => u._id === l.claimedByNGOId) : null
  }));
};
export const registerNGO = async (data) => {
  const users = await fetchUsers();
  const newUser = { _id: generateId(), ...data, role: 'NGO', status: 'Verified', impactScore: 0, foodStreak: 0, totalDonated: 0 };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  return newUser;
};
export const registerDonor = async (data) => {
  const users = await fetchUsers();
  const newUser = { _id: generateId(), ...data, role: 'Donor', status: 'Verified', impactScore: 0, foodStreak: 0, totalDonated: 0 };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  return newUser;
};
export const loginUser = async (phone) => {
  const users = await fetchUsers();
  const user = users.find(u => u.phone === phone);
  if (!user) throw new Error('User not found with this phone number');
  return user;
};
export const createListing = async (data) => {
  const listings = JSON.parse(localStorage.getItem('listings') || '[]');
  const newListing = { _id: generateId(), ...data, status: 'Available' };
  listings.push(newListing);
  localStorage.setItem('listings', JSON.stringify(listings));
  return newListing;
};
export const claimListing = async (listingId, ngoId, override) => {
  const listings = JSON.parse(localStorage.getItem('listings') || '[]');
  const listing = listings.find(l => l._id === listingId);
  if (listing) {
    listing.status = 'Claimed';
    listing.claimedByNGOId = ngoId;
    listing.logisticsOverride = override;
  }
  localStorage.setItem('listings', JSON.stringify(listings));
  return listing;
};
