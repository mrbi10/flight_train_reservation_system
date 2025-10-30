import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import ResultCard from '@/components/ResultCard';
import { useBooking } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { ArrowLeft, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';

const SearchResults = () => {
  const navigate = useNavigate();
  const { searchParams } = useBooking();
  const [results, setResults] = useState<any[]>([]);
  const [filteredResults, setFilteredResults] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState('price');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!searchParams) {
      navigate('/');
      return;
    }

    const fetchResults = async () => {
      try {
        const dataFile = searchParams.type === 'flight' ? 'flights' : 'trains';
        const response = await axios.get(`/data/${dataFile}.json`);
        
        // Filter results based on search criteria
        const filtered = response.data.filter((item: any) => {
          const matchesRoute = 
            item.from.toLowerCase().includes(searchParams.from.toLowerCase()) &&
            item.to.toLowerCase().includes(searchParams.to.toLowerCase());
          const matchesClass = item.class === searchParams.travelClass;
          
          return matchesRoute || matchesClass;
        });

        setResults(filtered);
        setFilteredResults(filtered);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch results');
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams, navigate]);

  useEffect(() => {
    let sorted = [...results];
    
    switch (sortBy) {
      case 'price':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'duration':
        sorted.sort((a, b) => {
          const durationA = parseInt(a.duration.split('h')[0]);
          const durationB = parseInt(b.duration.split('h')[0]);
          return durationA - durationB;
        });
        break;
      case 'departure':
        sorted.sort((a, b) => a.departure.localeCompare(b.departure));
        break;
    }
    
    setFilteredResults(sorted);
  }, [sortBy, results]);

  if (loading) {
    return (
      <div className="min-h-screen gradient-hero">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-xl">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Search
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {searchParams?.from} → {searchParams?.to}
            </h1>
            <p className="text-muted-foreground">
              {filteredResults.length} {searchParams?.type}(s) found • {searchParams?.date}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Price: Low to High</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
                <SelectItem value="departure">Departure Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredResults.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-12 rounded-xl text-center"
          >
            <p className="text-xl">No results found. Try adjusting your search.</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              New Search
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredResults.map((result, index) => (
              <ResultCard
                key={result.id}
                data={result}
                type={searchParams?.type as 'flight' | 'train'}
                index={index}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchResults;
