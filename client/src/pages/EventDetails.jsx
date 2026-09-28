import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.js';
import axios from 'axios';

const EventDetail = () => {
    // URL se ID nikal li
    const { id } = useParams();
    const [event, setEvent] = useState(null);

    // Check using AuthContent user is login or not
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // When page load than take single event from Backend
    useEffect(() => {
        const fetchSingleEvent = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/api/events/${id}`, {
                    withCredentials: true
                });
                setEvent(response.data);
            } catch (error) {
                console.log("Error fetching event:", error);
            }
        };
        fetchSingleEvent();
    },[id])

    const handleBooking = () => {
         if (!user) {
            alert("Login First!");
            navigate('/login');
            return;
         }
         alert("Razorpay Payment Gateway!");
    };

    // Show Loading between time to show data 
    if (!event) return <div className="flex justify-center items-center h-screen text-2xl font-bold text-gray-500 animate-pulse">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
                
                {/* Left Side: Image Section (Naya Cloudinary feature!) */}
                <div className="md:w-1/2 bg-gray-200">
                    <img 
                        src={event.imageUrl || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"} 
                        alt={event.title} 
                        className="w-full h-full object-cover min-h-[300px]"
                    />
                </div>
                {/* Right Side: Details Section */}
                <div className="md:w-1/2 p-8 flex flex-col justify-between">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{event.title}</h1>
                        <p className="text-blue-600 font-medium mb-6">Organized by: {event.organizer?.name || "Unknown"}</p>
                        
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-3">About the Event</h3>
                            <p className="text-gray-600 leading-relaxed">{event.description}</p>
                        </div>
                        {/* 4 Chote Dabbe (Grid) */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-blue-50 p-4 rounded-xl">
                                <span className="block text-sm text-blue-400 font-bold mb-1">📍 Location</span>
                                <span className="text-md text-blue-900 font-semibold">{event.location}</span>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-xl">
                                <span className="block text-sm text-purple-400 font-bold mb-1">📅 Date</span>
                                <span className="text-md text-purple-900 font-semibold">
                                    {new Date(event.date).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="bg-green-50 p-4 rounded-xl">
                                <span className="block text-sm text-green-500 font-bold mb-1">🎟️ Seats Left</span>
                                <span className={`text-xl font-black ${event.availableSeats > 10 ? 'text-green-600' : 'text-red-600'}`}>
                                    {event.availableSeats}
                                </span>
                            </div>
                            <div className="bg-orange-50 p-4 rounded-xl">
                                <span className="block text-sm text-orange-400 font-bold mb-1">💰 Entry Fee</span>
                                <span className="text-2xl text-orange-600 font-black">₹{event.entryFee}</span>
                            </div>
                        </div>
                    </div>
                    {/* Book Ticket Button */}
                    <button 
                        onClick={handleBooking}
                        disabled={event.availableSeats <= 0}
                        className={`w-full py-4 rounded-xl text-xl font-bold text-white transition duration-300 shadow-lg ${
                            event.availableSeats > 0 
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:-translate-y-1' 
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
                    >
                        {event.availableSeats > 0 ? "Book Ticket Now" : "Housefull! Sold Out"}
                    </button>
                </div>
            </div>
        </div>
    );
};


export default EventDetail;