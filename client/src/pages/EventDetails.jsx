import { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const EventDetail = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSingleEvent = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/api/events/' + id, {
                    withCredentials: true
                });
                setEvent(response.data);
            } catch (error) {
                console.log("Error fetching event:", error);
            }
        };
        fetchSingleEvent();
    }, [id]);

    const handleBooking = async () => {
        if (!user) {
            alert("Login First!");
            navigate('/login');
            return;
        }

        try {
            const { data } = await axios.post('http://127.0.0.1:5000/api/ticket/book/' + id, {}, { withCredentials: true });
            
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
                amount: data.order.amount,
                currency: "INR",
                name: "EventSync Tickets",
                description: event.title,
                order_id: data.order.id,
                handler: async function (response) {
                    try {
                        await axios.post('http://127.0.0.1:5000/api/ticket/verify/' + id, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        }, { withCredentials: true });

                        alert("Ticket Booked Successfully!");
                        navigate('/dashboard'); 
                    } catch (error) {
                        alert(error.response?.data?.error || "Payment Verification Failed");
                    }
                },
                theme: { color: "#3399cc" }
            };
            
            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            alert(error.response?.data?.error || "Failed to create order!");
        }
    };

    if (!event) return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
                <div className="lg:w-1/2 bg-gray-100 relative group overflow-hidden">
                    <img 
                        src={event.imageUrl || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"} 
                        alt={event.title} 
                        className="w-full h-full object-cover min-h-[400px] transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="lg:w-1/2 p-10 lg:p-12 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight">{event.title}</h1>
                        </div>
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                {event.organizer?.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-semibold">Organized by</p>
                                <p className="text-md text-gray-900 font-bold">{event.organizer?.name || "Unknown"}</p>
                            </div>
                        </div>
                        <div className="mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center">
                                About the Event
                            </h3>
                            <p className="text-gray-600 leading-relaxed font-medium">{event.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-10">
                            <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl transform transition hover:-translate-y-1">
                                <span className="block text-sm text-blue-600 font-bold mb-1 uppercase tracking-wide">Location</span>
                                <span className="text-lg text-blue-900 font-black flex items-center">{event.location}</span>
                            </div>
                            <div className="bg-purple-50/50 border border-purple-100 p-5 rounded-2xl transform transition hover:-translate-y-1">
                                <span className="block text-sm text-purple-600 font-bold mb-1 uppercase tracking-wide">Date</span>
                                <span className="text-lg text-purple-900 font-black flex items-center">{new Date(event.date).toLocaleDateString()}</span>
                            </div>
                            <div className="bg-orange-50/50 border border-orange-100 p-5 rounded-2xl transform transition hover:-translate-y-1">
                                <span className="block text-sm text-orange-600 font-bold mb-1 uppercase tracking-wide">Entry Fee</span>
                                <span className="text-2xl text-orange-600 font-black">Rs. {event.entryFee}</span>
                            </div>
                            <div className="bg-green-50/50 border border-green-100 p-5 rounded-2xl transform transition hover:-translate-y-1 flex flex-col justify-center">
                                <span className="block text-sm text-green-600 font-bold mb-1 uppercase tracking-wide">Status</span>
                                <span className={event.availableSeats > 10 ? 'text-green-600 text-xl font-black' : 'text-red-600 text-xl font-black'}>
                                    {event.availableSeats > 0 ? event.availableSeats + ' Seats Left' : 'Sold Out'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={handleBooking}
                        disabled={event.availableSeats <= 0}
                        className={event.availableSeats > 0 
                            ? "relative overflow-hidden w-full py-5 rounded-2xl text-xl font-black text-white transition-all duration-300 shadow-xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:shadow-2xl transform hover:-translate-y-1 hover:scale-[1.02] bg-[length:200%_auto] hover:bg-[position:right_center]"
                            : "w-full py-5 rounded-2xl text-xl font-black text-gray-500 bg-gray-200 cursor-not-allowed border-2 border-gray-300"}
                    >
                        {event.availableSeats > 0 ? "Secure Your Ticket Now" : "Housefull! Sold Out"}
                    </button>
                </div>
            </div>
        </div>
    );
};
export default EventDetail;