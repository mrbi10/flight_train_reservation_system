import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import SeatMap from '@/components/SeatMap';
import { useBooking } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const SeatSelection = () => {
  const navigate = useNavigate();
  const { currentBooking, setCurrentBooking } = useBooking();

  if (!currentBooking || !currentBooking.passengers) {
    navigate('/');
    return null;
  }

  const handleSeatsSelected = (seats: string[]) => {
    setCurrentBooking({
      ...currentBooking,
      seats
    });
    navigate('/payment');
  };

  return (
    <div className="min-h-screen gradient-hero">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/booking')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Passenger Details
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold mb-2">Select Your Seats</h1>
          <p className="text-muted-foreground">
            Choose {currentBooking.passengers.length} seat(s) for your journey
          </p>
        </motion.div>

        <SeatMap
          totalSeats={120}
          maxPassengers={currentBooking.passengers.length}
          onSeatsSelected={handleSeatsSelected}
        />
      </main>
    </div>
  );
};

export default SeatSelection;
