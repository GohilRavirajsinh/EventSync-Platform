import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/events');
                setEvents(response.data);
            } catch (error) {
                console.log("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 px-4 text-center">
                <h1 className="text-5xl md:text-6xl font-extrabold mb-6 animate-pulse">Discover Amazing Events</h1>
                <p className="text-xl md:text-2xl mb-8 opacity-90">Book tickets for the best concerts, tech shows, and comedy nights!</p>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center relative inline-block left-1/2 -translate-x-1/2">
                    Upcoming Events
                    <span className="absolute -bottom-2 left-0 w-full h-1 bg-blue-500 rounded-full"></span>
                </h2>

                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {events.map((event) => (
                            <div key={event._id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden flex flex-col">
                                <div className="h-48 overflow-hidden relative group">
                                    <img 
                                        src={event.imageUrl || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"} 
                                        alt={event.title} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-blue-600 shadow-sm">
                                        {event.category || "General"}
                                    </div>
                                </div>
                                <div className="p-6 flex-grow flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-2 line-clamp-1">{event.title}</h3>
                                        <p className="text-gray-500 text-sm mb-4">Location: {event.location}</p>
                                        <p className="text-gray-600 mb-6 line-clamp-2">{event.description}</p>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center text-sm font-bold mb-6 pb-4 border-b">
                                            <span className="text-green-600 bg-green-50 px-3 py-1 rounded-lg">Rs. {event.entryFee}</span>
                                            <span className={event.availableSeats > 10 ? "text-blue-600" : "text-red-500"}>
                                                {event.availableSeats} Seats Left
                                            </span>
                                        </div>
                                        <Link to={'/event/' + event._id} className="block text-center w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-colors duration-300">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
export default Home;
