import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { useBooking } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CreditCard, Lock } from 'lucide-react';
import { toast } from 'sonner';

const Payment = () => {
  const navigate = useNavigate();
  const { currentBooking, addBooking } = useBooking();
  const [processing, setProcessing] = useState(false);

  if (!currentBooking || !currentBooking.passengers || !currentBooking.seats) {
    navigate('/');
    return null;
  }

  const totalAmount = (currentBooking.price || 0) * (currentBooking.passengers?.length || 0);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate booking
    const booking = {
      ...currentBooking,
      id: `BK${Date.now()}`,
      totalAmount,
      bookingDate: new Date().toISOString(),
      status: 'confirmed' as const,
      pnr: `PNR${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    };

    addBooking(booking as any);
    toast.success('Booking confirmed!');
    navigate(`/e-ticket/${booking.id}`);
  };

  return (
    <div className="min-h-screen gradient-hero">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/seat-selection')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Seat Selection
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Booking Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6 rounded-xl space-y-6"
          >
            <h2 className="text-2xl font-bold">Booking Summary</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Service</p>
                <p className="font-semibold">{currentBooking.serviceName}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Route</p>
                <p className="font-semibold">
                  {currentBooking.from} → {currentBooking.to}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Date & Time</p>
                <p className="font-semibold">
                  {currentBooking.date} at {currentBooking.departure}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Passengers</p>
                {currentBooking.passengers?.map((p, i) => (
                  <p key={i} className="font-semibold">
                    {i + 1}. {p.name} ({p.age}y, {p.gender})
                  </p>
                ))}
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Selected Seats</p>
                <p className="font-semibold">{currentBooking.seats?.join(', ')}</p>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between mb-2">
                  <span>Base Fare</span>
                  <span>${currentBooking.price} × {currentBooking.passengers?.length}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Taxes & Fees</span>
                  <span>${(totalAmount * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-gradient">${(totalAmount * 1.1).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6 rounded-xl"
          >
            <div className="flex items-center gap-2 mb-6">
              <Lock className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Secure Payment</h2>
            </div>

            <form onSubmit={handlePayment} className="space-y-4">
              <div className="space-y-2">
                <Label>Card Number</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="1234 5678 9012 3456"
                    className="pl-10"
                    maxLength={19}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cardholder Name</Label>
                <Input placeholder="JOHN DOE" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Expiry Date</Label>
                  <Input placeholder="MM/YY" maxLength={5} required />
                </div>

                <div className="space-y-2">
                  <Label>CVV</Label>
                  <Input
                    type="password"
                    placeholder="123"
                    maxLength={3}
                    required
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={processing}
                >
                  {processing ? 'Processing...' : `Pay $${(totalAmount * 1.1).toFixed(2)}`}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                This is a simulation. No real payment will be processed.
              </p>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Payment;
