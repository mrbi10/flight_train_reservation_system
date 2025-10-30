import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SeatMapProps {
  totalSeats: number;
  onSeatsSelected: (seats: string[]) => void;
  maxPassengers: number;
}

const SeatMap = ({ totalSeats, onSeatsSelected, maxPassengers }: SeatMapProps) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  
  // Generate seat layout (6 seats per row: A-F)
  const rows = Math.ceil(totalSeats / 6);
  const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
  
  // Randomly mark some seats as booked
  const bookedSeats = new Set<string>();
  for (let i = 0; i < totalSeats * 0.3; i++) {
    const row = Math.floor(Math.random() * rows) + 1;
    const letter = seatLetters[Math.floor(Math.random() * seatLetters.length)];
    bookedSeats.add(`${row}${letter}`);
  }

  const handleSeatClick = (seatNumber: string) => {
    if (bookedSeats.has(seatNumber)) {
      toast.error('This seat is already booked');
      return;
    }

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
    } else {
      if (selectedSeats.length >= maxPassengers) {
        toast.error(`You can only select ${maxPassengers} seat(s)`);
        return;
      }
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const getSeatClass = (seatNumber: string) => {
    if (bookedSeats.has(seatNumber)) {
      return 'bg-destructive/20 cursor-not-allowed';
    }
    if (selectedSeats.includes(seatNumber)) {
      return 'bg-secondary hover:bg-secondary/80';
    }
    return 'bg-muted hover:bg-primary/20 cursor-pointer';
  };

  const handleConfirm = () => {
    if (selectedSeats.length !== maxPassengers) {
      toast.error(`Please select exactly ${maxPassengers} seat(s)`);
      return;
    }
    onSeatsSelected(selectedSeats);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-muted rounded" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-secondary rounded" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-destructive/20 rounded" />
          <span>Booked</span>
        </div>
      </div>

      <div className="glass-card p-8 rounded-xl max-w-2xl mx-auto">
        <div className="mb-4 text-center">
          <p className="text-sm text-muted-foreground">Front</p>
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-primary to-accent rounded-full" />
        </div>

        <div className="space-y-3">
          {Array.from({ length: rows }, (_, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-2">
              <span className="w-8 text-center text-sm text-muted-foreground">
                {rowIndex + 1}
              </span>
              
              {seatLetters.slice(0, 3).map(letter => {
                const seatNumber = `${rowIndex + 1}${letter}`;
                return (
                  <motion.button
                    key={seatNumber}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSeatClick(seatNumber)}
                    className={`w-10 h-10 rounded-lg font-medium text-xs transition-colors ${getSeatClass(seatNumber)}`}
                    disabled={bookedSeats.has(seatNumber)}
                  >
                    {letter}
                  </motion.button>
                );
              })}
              
              <div className="w-4" />
              
              {seatLetters.slice(3, 6).map(letter => {
                const seatNumber = `${rowIndex + 1}${letter}`;
                return (
                  <motion.button
                    key={seatNumber}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSeatClick(seatNumber)}
                    className={`w-10 h-10 rounded-lg font-medium text-xs transition-colors ${getSeatClass(seatNumber)}`}
                    disabled={bookedSeats.has(seatNumber)}
                  >
                    {letter}
                  </motion.button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm mb-4">
          Selected: {selectedSeats.length} / {maxPassengers} seats
        </p>
        <Button 
          onClick={handleConfirm}
          disabled={selectedSeats.length !== maxPassengers}
          size="lg"
        >
          Confirm Seat Selection
        </Button>
      </div>
    </div>
  );
};

export default SeatMap;
