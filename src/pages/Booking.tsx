import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { useBooking } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Passenger } from '@/contexts/BookingContext';

const Booking = () => {
  const navigate = useNavigate();
  const { currentBooking, setCurrentBooking } = useBooking();
  const [passengers, setPassengers] = useState<Passenger[]>([
    { id: '1', name: '', age: 18, gender: 'male' }
  ]);

  if (!currentBooking) {
    navigate('/');
    return null;
  }

  const addPassenger = () => {
    const newId = (passengers.length + 1).toString();
    setPassengers([...passengers, { id: newId, name: '', age: 18, gender: 'male' }]);
  };

  const removePassenger = (id: string) => {
    if (passengers.length === 1) {
      toast.error('At least one passenger is required');
      return;
    }
    setPassengers(passengers.filter(p => p.id !== id));
  };

  const updatePassenger = (id: string, field: keyof Passenger, value: any) => {
    setPassengers(passengers.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const handleContinue = () => {
    // Validate passenger details
    for (const passenger of passengers) {
      if (!passenger.name || passenger.age < 1) {
        toast.error('Please fill in all passenger details');
        return;
      }
    }

    setCurrentBooking({
      ...currentBooking,
      passengers
    });
    navigate('/seat-selection');
  };

  return (
    <div className="min-h-screen gradient-hero">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/search-results')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Results
        </Button>

        <div className="space-y-6">
          {/* Trip Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 rounded-xl"
          >
            <h2 className="text-2xl font-bold mb-4">Trip Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Service</p>
                <p className="font-semibold">{currentBooking.serviceName}</p>
                <p className="text-sm">{currentBooking.serviceNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Route</p>
                <p className="font-semibold">
                  {currentBooking.fromCode} → {currentBooking.toCode}
                </p>
                <p className="text-sm">{currentBooking.date}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Departure</p>
                <p className="font-semibold">{currentBooking.departure}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Class</p>
                <p className="font-semibold">{currentBooking.class}</p>
              </div>
            </div>
          </motion.div>

          {/* Passenger Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 rounded-xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Passenger Details</h2>
              <Button onClick={addPassenger} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Passenger
              </Button>
            </div>

            <div className="space-y-6">
              {passengers.map((passenger, index) => (
                <div key={passenger.id} className="p-4 border border-border rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Passenger {index + 1}</h3>
                    {passengers.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removePassenger(passenger.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input
                        value={passenger.name}
                        onChange={(e) => updatePassenger(passenger.id, 'name', e.target.value)}
                        placeholder="Enter full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Age</Label>
                      <Input
                        type="number"
                        value={passenger.age}
                        onChange={(e) => updatePassenger(passenger.id, 'age', parseInt(e.target.value))}
                        min="1"
                        max="120"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select
                        value={passenger.gender}
                        onValueChange={(value) => updatePassenger(passenger.id, 'gender', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 rounded-xl"
          >
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  onChange={(e) => updatePassenger(passengers[0].id, 'email', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  type="tel"
                  placeholder="+1 234 567 8900"
                  onChange={(e) => updatePassenger(passengers[0].id, 'phone', e.target.value)}
                />
              </div>
            </div>
          </motion.div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-3xl font-bold text-gradient">
                ${(currentBooking.price || 0) * passengers.length}
              </p>
            </div>
            <Button onClick={handleContinue} size="lg">
              Continue to Seat Selection
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Booking;
