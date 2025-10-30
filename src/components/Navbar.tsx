import { Link, useLocation } from 'react-router-dom';
import { Plane, Moon, Sun, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass-card sticky top-0 z-50 px-6 py-3.5 border-b border-border/50"
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent p-[2px] transition-transform group-hover:scale-105">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-background">
              <Plane className="h-5 w-5 text-primary" />
            </div>
          </div>
          <span className="text-xl font-bold font-display text-gradient">TravelBooker</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link to="/">
            <Button 
              variant={isActive('/') ? 'default' : 'ghost'}
              className="transition-all font-medium"
            >
              Home
            </Button>
          </Link>
          <Link to="/my-bookings">
            <Button 
              variant={isActive('/my-bookings') ? 'default' : 'ghost'}
              className="flex items-center gap-2 transition-all font-medium"
            >
              <Ticket className="h-4 w-4" />
              My Bookings
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-xl ml-2"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
