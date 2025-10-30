import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { useBooking } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Ticket, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const MyBookings = () => {
  const navigate = useNavigate();
  const { bookings, cancelBooking } = useBooking();

  const handleCancelBooking = (id: string) => {
    cancelBooking(id);
    toast.success('Booking cancelled successfully');
  };

  const handleViewTicket = (id: string) => {
    navigate(`/e-ticket/${id}`);
  };

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen gradient-hero">
        <Navbar />
        <main className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-12 rounded-xl text-center max-w-2xl mx-auto"
          >
            <Ticket className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">No Bookings Yet</h2>
            <p className="text-muted-foreground mb-6">
              Start your journey by booking a flight or train ticket
            </p>
            <Button onClick={() => navigate('/')} size="lg">
              Search Tickets
            </Button>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
          <p className="text-muted-foreground">
            {bookings.length} booking(s) found
          </p>
        </motion.div>

        <div className="space-y-6">
          {bookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card glass-card-hover p-6 rounded-xl"
            >
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-1">
                        {booking.serviceName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {booking.serviceNumber} • PNR: {booking.pnr}
                      </p>
                    </div>
                    <Badge
                      variant={booking.status === 'confirmed' ? 'default' : 'destructive'}
                    >
                      {booking.status}
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div>
                        <p className="font-semibold">
                          {booking.from} → {booking.to}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {booking.fromCode} to {booking.toCode}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div>
                        <p className="font-semibold">{booking.date}</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.departure} - {booking.arrival}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Passengers</p>
                    <div className="flex flex-wrap gap-2">
                      {booking.passengers.map((p, i) => (
                        <Badge key={i} variant="outline">
                          {p.name} (Seat {booking.seats[i]})
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex lg:flex-col justify-between lg:justify-start gap-2 lg:min-w-[160px]">
                  <div className="lg:text-right">
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold text-gradient">
                      ${(booking.totalAmount * 1.1).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex lg:flex-col gap-2">
                    <Button
                      onClick={() => handleViewTicket(booking.id)}
                      variant="default"
                      className="flex-1 lg:w-full"
                      disabled={booking.status === 'cancelled'}
                    >
                      <Ticket className="mr-2 h-4 w-4" />
                      View Ticket
                    </Button>

                    {booking.status === 'confirmed' && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            className="flex-1 lg:w-full"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Cancel
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to cancel this booking? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>No, Keep It</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleCancelBooking(booking.id)}
                              className="bg-destructive text-destructive-foreground"
                            >
                              Yes, Cancel Booking
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MyBookings;
