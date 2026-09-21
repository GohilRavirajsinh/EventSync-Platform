import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/api/events');
                setEvents(response.data);
            } catch (error) {
                console.log("Error fetching events:", error);
            }
        };
        fetchEvents();
    }, []);
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10">Upcoming Events 🎟️</h1>
            {/* Grid Layout: Ek line me PC par 3 aur Mobile par 1 card dikhega */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {events.map((event) => (
                    <div key={event._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">

                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">{event.title}</h2>
                            <p className="text-gray-600 mb-4 h-12 overflow-hidden">{event.description}</p>

                            <div className="flex justify-between items-center text-sm font-semibold text-gray-700 mb-4">
                                <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full">
                                    ₹{event.entryFee}
                                </span>
                                <span className="text-red-500">
                                    Seats Left: {event.availableSeats}
                                </span>
                            </div>

                            {/* Hum agle step me is button ko click karke alag page par le jayenge */}
                            <Link to={`/event/${event._id}`} className="block text-center w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition">
                                View Details
                            </Link>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;