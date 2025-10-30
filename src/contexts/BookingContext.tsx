import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Passenger {
  id: string;
  name: string;
  age: number;
  gender: string;
  email?: string;
  phone?: string;
}

export interface Booking {
  id: string;
  type: 'flight' | 'train';
  serviceId: string;
  serviceName: string;
  serviceNumber: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  date: string;
  departure: string;
  arrival: string;
  duration: string;
  class: string;
  price: number;
  passengers: Passenger[];
  seats: string[];
  totalAmount: number;
  bookingDate: string;
  status: 'confirmed' | 'cancelled';
  pnr: string;
}

interface SearchParams {
  from: string;
  to: string;
  date: string;
  travelClass: string;
  type: 'flight' | 'train';
}

interface BookingContextType {
  searchParams: SearchParams | null;
  setSearchParams: (params: SearchParams) => void;
  currentBooking: Partial<Booking> | null;
  setCurrentBooking: (booking: Partial<Booking> | null) => void;
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  cancelBooking: (id: string) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [currentBooking, setCurrentBooking] = useState<Partial<Booking> | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const addBooking = (booking: Booking) => {
    setBookings(prev => [booking, ...prev]);
  };

  const cancelBooking = (id: string) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === id ? { ...booking, status: 'cancelled' as const } : booking
      )
    );
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === id ? { ...booking, ...updates } : booking
      )
    );
  };

  return (
    <BookingContext.Provider
      value={{
        searchParams,
        setSearchParams,
        currentBooking,
        setCurrentBooking,
        bookings,
        addBooking,
        cancelBooking,
        updateBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
