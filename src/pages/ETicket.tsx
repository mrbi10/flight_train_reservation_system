import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Navbar from '@/components/Navbar';
import { useBooking } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/button';
import { Download, Printer, Check } from 'lucide-react';
import { toast } from 'sonner';

const ETicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bookings } = useBooking();
  const ticketRef = useRef<HTMLDivElement>(null);

  const booking = bookings.find(b => b.id === id);

  useEffect(() => {
    if (!booking) {
      navigate('/my-bookings');
    }
  }, [booking, navigate]);

  if (!booking) return null;

  const handleDownloadPDF = async () => {
    if (!ticketRef.current) return;

    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`ticket-${booking.pnr}.pdf`);
      toast.success('Ticket downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download ticket');
    }
  };

  const handlePrint = () => {
    window.print();
    toast.success('Printing ticket...');
  };

  return (
    <div className="min-h-screen gradient-hero print:bg-white">
      <div className="print:hidden">
        <Navbar />
      </div>
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8 print:hidden"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-full mb-4">
            <Check className="h-8 w-8 text-secondary-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground">
            Your e-ticket has been generated successfully
          </p>
        </motion.div>

        <div ref={ticketRef} className="glass-card p-8 rounded-xl space-y-8 print:shadow-none">
          {/* Header */}
          <div className="text-center border-b border-border pb-6">
            <h2 className="text-2xl font-bold mb-2">E-TICKET</h2>
            <p className="text-muted-foreground">PNR: {booking.pnr}</p>
          </div>

          {/* Journey Details */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Journey Details</h3>
              <div>
                <p className="text-sm text-muted-foreground">Service</p>
                <p className="font-semibold">{booking.serviceName}</p>
                <p className="text-sm">{booking.serviceNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Route</p>
                <p className="font-semibold text-lg">
                  {booking.from} → {booking.to}
                </p>
                <p className="text-sm">{booking.fromCode} to {booking.toCode}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Departure</p>
                  <p className="font-semibold">{booking.departure}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Arrival</p>
                  <p className="font-semibold">{booking.arrival}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-semibold">{booking.date}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Class</p>
                <p className="font-semibold">{booking.class}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Passenger Details</h3>
              {booking.passengers.map((passenger, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-lg">
                  <p className="font-semibold">{passenger.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Age: {passenger.age} • Gender: {passenger.gender}
                  </p>
                  <p className="text-sm font-medium mt-1">
                    Seat: {booking.seats[index]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center gap-4 py-6 border-t border-border">
            <QRCodeSVG
              value={JSON.stringify({
                pnr: booking.pnr,
                from: booking.fromCode,
                to: booking.toCode,
                date: booking.date,
              })}
              size={150}
            />
            <p className="text-sm text-muted-foreground">
              Scan this QR code at the terminal
            </p>
          </div>

          {/* Amount */}
          <div className="border-t border-border pt-6">
            <div className="flex justify-between items-center">
              <span className="text-lg">Total Amount Paid</span>
              <span className="text-2xl font-bold text-gradient">
                ${(booking.totalAmount * 1.1).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-6 print:hidden">
          <Button onClick={handleDownloadPDF} className="flex-1" size="lg">
            <Download className="mr-2 h-5 w-5" />
            Download PDF
          </Button>
          <Button onClick={handlePrint} variant="outline" className="flex-1" size="lg">
            <Printer className="mr-2 h-5 w-5" />
            Print Ticket
          </Button>
        </div>

        <div className="text-center mt-6 print:hidden">
          <Button onClick={() => navigate('/my-bookings')} variant="ghost">
            View All Bookings
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ETicket;
