import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// Types
interface Contact {
  id: number;
  name: string;
  email: string;
  company?: string;
  message?: string;
  createdAt: string;
}

interface Booking {
  id: number;
  contactId: number;
  service: string;
  date: string;
  status: string;
  notes?: string;
  createdAt: string;
}

// Fetch functions
const fetchContacts = async (): Promise<Contact[]> => {
  const response = await fetch('/api/admin/contacts');
  if (!response.ok) {
    throw new Error('Failed to fetch contacts');
  }
  return response.json();
};

const fetchBookings = async (): Promise<Booking[]> => {
  const response = await fetch('/api/admin/bookings');
  if (!response.ok) {
    throw new Error('Failed to fetch bookings');
  }
  return response.json();
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'contacts' | 'bookings'>('contacts');
  
  // Fetch data using React Query
  const contactsQuery = useQuery({
    queryKey: ['contacts'],
    queryFn: fetchContacts,
  });
  
  const bookingsQuery = useQuery({
    queryKey: ['bookings'],
    queryFn: fetchBookings,
  });
  
  if (contactsQuery.isLoading || bookingsQuery.isLoading) {
    return <div className="container mx-auto p-8">Loading...</div>;
  }
  
  if (contactsQuery.isError || bookingsQuery.isError) {
    return (
      <div className="container mx-auto p-8 text-red-500">
        Error: {(contactsQuery.error as Error)?.message || (bookingsQuery.error as Error)?.message}
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 ${activeTab === 'contacts' ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}
          onClick={() => setActiveTab('contacts')}
        >
          Contacts
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'bookings' ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          Bookings
        </button>
      </div>
      
      {/* Content */}
      {activeTab === 'contacts' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Contact Submissions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="p-3 border-b text-left">ID</th>
                  <th className="p-3 border-b text-left">Name</th>
                  <th className="p-3 border-b text-left">Email</th>
                  <th className="p-3 border-b text-left">Company</th>
                  <th className="p-3 border-b text-left">Date</th>
                  <th className="p-3 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contactsQuery.data?.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="p-3 border-b">{contact.id}</td>
                    <td className="p-3 border-b">{contact.name}</td>
                    <td className="p-3 border-b">{contact.email}</td>
                    <td className="p-3 border-b">{contact.company || '-'}</td>
                    <td className="p-3 border-b">{new Date(contact.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 border-b">
                      <button className="text-blue-500 hover:text-blue-700">View</button>
                    </td>
                  </tr>
                ))}
                {(contactsQuery.data?.length || 0) === 0 && (
                  <tr>
                    <td colSpan={6} className="p-3 text-center">No contacts found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {activeTab === 'bookings' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Bookings</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="p-3 border-b text-left">ID</th>
                  <th className="p-3 border-b text-left">Service</th>
                  <th className="p-3 border-b text-left">Date</th>
                  <th className="p-3 border-b text-left">Status</th>
                  <th className="p-3 border-b text-left">Created</th>
                  <th className="p-3 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookingsQuery.data?.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="p-3 border-b">{booking.id}</td>
                    <td className="p-3 border-b">{booking.service}</td>
                    <td className="p-3 border-b">{new Date(booking.date).toLocaleString()}</td>
                    <td className="p-3 border-b">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-3 border-b">{new Date(booking.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 border-b">
                      <button className="text-blue-500 hover:text-blue-700 mr-2">View</button>
                      <button className="text-green-500 hover:text-green-700">Update</button>
                    </td>
                  </tr>
                ))}
                {(bookingsQuery.data?.length || 0) === 0 && (
                  <tr>
                    <td colSpan={6} className="p-3 text-center">No bookings found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 