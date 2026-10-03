import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchTickets = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/ticket/my-tickets', {
                    withCredentials: true
                });
                setTickets(response.data.tickets);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-10 flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center space-x-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-black shadow-lg">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900">Welcome, {user?.name}!</h1>
                            <p className="text-gray-500 font-medium mt-1">Manage your tickets and events here.</p>
                        </div>
                    </div>
                    <Link to="/create-event" className="mt-6 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-bold transition-all shadow-md transform hover:-translate-y-1">
                        + Host New Event
                    </Link>
                </div>
                
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-6">
                        <h2 className="text-2xl font-bold text-white flex items-center">
                            My Booked Tickets
                        </h2>
                    </div>
                    
                    <div className="p-8">
                        {loading ? (
                            <div className="flex justify-center py-10">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
                            </div>
                        ) : tickets.length === 0 ? (
                            <div className="text-center py-16">
                                <h3 className="text-2xl font-bold text-gray-700 mb-2">No Tickets Yet!</h3>
                                <p className="text-gray-500 mb-6">Looks like you haven't booked any events.</p>
                                <Link to="/" className="bg-blue-50 text-blue-600 font-bold px-6 py-3 rounded-full hover:bg-blue-100 transition">
                                    Explore Events
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {tickets.map(ticket => (
                                    <div key={ticket._id} className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-8 h-8 bg-gray-50 rounded-bl-3xl border-l border-b border-gray-100"></div>
                                        <div className="absolute bottom-1/3 -left-3 w-6 h-6 bg-gray-50 rounded-full border border-gray-100"></div>
                                        <div className="absolute bottom-1/3 -right-3 w-6 h-6 bg-gray-50 rounded-full border border-gray-100"></div>
                                        <div className="border-b-2 border-dashed border-gray-200 absolute bottom-1/3 left-3 right-3"></div>

                                        <div className="p-6 pb-20">
                                            <span className="bg-green-100 text-green-700 text-xs font-black px-2 py-1 rounded-md uppercase tracking-wide mb-3 inline-block">Confirmed</span>
                                            <h3 className="text-xl font-extrabold text-gray-900 line-clamp-1">{ticket.event?.title}</h3>
                                            
                                            <div className="mt-4 space-y-2">
                                                <p className="text-gray-600 text-sm flex items-center">
                                                    <span className="font-medium truncate">Location: {ticket.event?.location}</span>
                                                </p>
                                                <p className="text-gray-600 text-sm flex items-center">
                                                    <span className="font-medium">Date: {new Date(ticket.event?.date).toLocaleDateString()}</span>
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="absolute bottom-0 w-full p-4 bg-gray-50 flex justify-between items-center border-t border-gray-100 h-1/3 max-h-16">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-400 font-bold uppercase">Order ID</span>
                                                <span className="text-xs font-mono text-gray-700 font-bold truncate max-w-[120px]" title={ticket.paymentId}>{ticket.paymentId}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Dashboard;
