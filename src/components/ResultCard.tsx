import { motion } from 'framer-motion';
import { Plane, Train, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '@/contexts/BookingContext';

interface ResultCardProps {
  data: any;
  type: 'flight' | 'train';
  index: number;
}

const ResultCard = ({ data, type, index }: ResultCardProps) => {
  const navigate = useNavigate();
  const { setCurrentBooking, searchParams } = useBooking();

  const handleBookNow = () => {
    setCurrentBooking({
      type,
      serviceId: data.id,
      serviceName: type === 'flight' ? data.airline : data.trainName,
      serviceNumber: type === 'flight' ? data.flightNumber : data.trainNumber,
      from: data.from,
      fromCode: data.fromCode,
      to: data.to,
      toCode: data.toCode,
      date: searchParams?.date || '',
      departure: data.departure,
      arrival: data.arrival,
      duration: data.duration,
      class: data.class,
      price: data.price,
    });
    navigate('/booking');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="glass-card p-6 rounded-2xl premium-shadow hover:shadow-2xl transition-all duration-300"
    >
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            {type === 'flight' ? (
              <Plane className="h-5 w-5 text-primary" />
            ) : (
              <Train className="h-5 w-5 text-primary" />
            )}
            <div>
              <h3 className="font-semibold text-lg">
                {type === 'flight' ? data.airline : data.trainName}
              </h3>
              <p className="text-sm text-muted-foreground">
                {type === 'flight' ? data.flightNumber : data.trainNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div>
              <p className="text-2xl font-bold">{data.departure}</p>
              <p className="text-sm text-muted-foreground">{data.fromCode}</p>
            </div>

            <div className="flex-1 flex flex-col items-center">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{data.duration}</span>
              </div>
              <div className="w-full h-0.5 bg-gradient-to-r from-primary to-accent my-2" />
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold">{data.arrival}</p>
              <p className="text-sm text-muted-foreground">{data.toCode}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="secondary">{data.class}</Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{data.availableSeats} seats left</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end justify-between min-w-[140px]">
          <div className="text-right">
            <p className="text-3xl font-bold text-gradient">${data.price}</p>
            <p className="text-sm text-muted-foreground">per person</p>
          </div>
          <Button onClick={handleBookNow} className="w-full">
            Book Now
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultCard;
