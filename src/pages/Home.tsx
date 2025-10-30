import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import SearchForm from '@/components/SearchForm';
import { Plane } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen gradient-hero relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <Navbar />
      
      <main className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-8">
            <motion.div
              className="relative"
              animate={{ 
                y: [0, -15, 0],
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary blur-2xl opacity-30 rounded-full" />
              <div className="relative bg-gradient-to-br from-primary to-secondary p-5 rounded-3xl shadow-2xl">
                <Plane className="h-12 w-12 text-white" />
              </div>
            </motion.div>
          </div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="text-gradient">Book Your</span>
            <br />
            <span className="text-gradient">Dream Journey</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed"
          >
            Search and book flight and train tickets at the best prices. 
            Your next adventure starts here.
          </motion.p>
        </motion.div>

        <SearchForm />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-20 grid md:grid-cols-3 gap-6"
        >
          {[
            { title: 'Best Prices', desc: 'Compare and get unbeatable deals on every booking', icon: '💰' },
            { title: 'Easy Booking', desc: 'Simple and secure 3-step booking process', icon: '⚡' },
            { title: '24/7 Support', desc: 'Round the clock customer service and assistance', icon: '🎯' }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass-card p-8 rounded-2xl text-center group cursor-pointer premium-shadow hover:shadow-2xl transition-all duration-300"
            >
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="font-display font-bold text-xl mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default Home;
