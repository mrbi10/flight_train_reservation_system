import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Train, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBooking } from '@/contexts/BookingContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const SearchForm = () => {
  const navigate = useNavigate();
  const { setSearchParams } = useBooking();
  const [type, setType] = useState<'flight' | 'train'>('flight');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [travelClass, setTravelClass] = useState('Economy');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!from || !to || !date) {
      toast.error('Please fill in all fields');
      return;
    }

    setSearchParams({ from, to, date, travelClass, type });
    navigate('/search-results');
    toast.success('Searching for available options...');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8 md:p-10 rounded-3xl max-w-5xl mx-auto premium-shadow"
    >
      <div className="flex gap-3 mb-8 p-1.5 bg-muted/50 rounded-2xl">
        <Button
          type="button"
          variant={type === 'flight' ? 'default' : 'ghost'}
          className="flex-1 h-14 text-base font-semibold rounded-xl"
          onClick={() => setType('flight')}
        >
          <Plane className="mr-2 h-5 w-5" />
          Flights
        </Button>
        <Button
          type="button"
          variant={type === 'train' ? 'default' : 'ghost'}
          className="flex-1 h-14 text-base font-semibold rounded-xl"
          onClick={() => setType('train')}
        >
          <Train className="mr-2 h-5 w-5" />
          Trains
        </Button>
      </div>

      <form onSubmit={handleSearch} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="from">From</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="from"
                placeholder={type === 'flight' ? 'City or Airport' : 'Station'}
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="to">To</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="to"
                placeholder={type === 'flight' ? 'City or Airport' : 'Station'}
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Travel Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="pl-10"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="class">Class</Label>
            <Select value={travelClass} onValueChange={setTravelClass}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {type === 'flight' ? (
                  <>
                    <SelectItem value="Economy">Economy</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="First Class">First Class</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="Sleeper">Sleeper</SelectItem>
                    <SelectItem value="3-AC">3-AC</SelectItem>
                    <SelectItem value="2-AC">2-AC</SelectItem>
                    <SelectItem value="AC Chair Car">AC Chair Car</SelectItem>
                    <SelectItem value="Executive Chair">Executive Chair</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button type="submit" className="w-full h-14 text-base font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity" size="lg">
          Search {type === 'flight' ? 'Flights' : 'Trains'}
        </Button>
      </form>
    </motion.div>
  );
};

export default SearchForm;
