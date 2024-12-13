import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [seats, setSeats] = useState([]);
  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSeats();
  }, []);

  const fetchSeats = async () => {
    try{
      const response = await fetch('https://ticket-booking-backend-production.up.railway.app/seats');
      const data = await response.json();
      setSeats(data);
    }
    catch (error) {
      console.log('error', error)

    }
  };

  const bookSeats = async () => {
    try {
      const response = await fetch('https://ticket-booking-backend-production.up.railway.app/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numberOfSeats }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Booking successful! Your seats: ${data.bookedSeats.map(s => s.id).join(', ')}`);
        fetchSeats();
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Error booking seats.');
      console.log(error)
    }
  };

  return (
    <div className="App">
      <h1>Train Seat Booking</h1>
      <div>
        <label>Number of seats to book (1-7): </label>
        <input
          type="number"
          min="1"
          max="7"
          value={numberOfSeats}
          onChange={(e) => setNumberOfSeats(Number(e.target.value))}
        />
        <button onClick={bookSeats}>Book Seats</button>
      </div>
      <p>{message}</p>
      <div className="seats-container">
        {seats.map((seat) => (
          <div
            key={seat.id}
            className={`seat ${seat.status ? 'booked' : 'available'}`}
          >
            {seat.id}
          </div>
        ))}
      </div>
    </div>
    );
  }
  
  export default App;