import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Navbar = () => {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('http://127.0.0.1:5000/api/auth/logout', {}, { withCredentials: true });
            setUser(null);
            navigate('/login');
        } catch (error) {
            console.log("Logout error", error);
        }
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <Link to="/" className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-80 transition-opacity">
                        EventSync
                    </Link>
                    <div className="flex space-x-6 items-center">
                        <Link to="/" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors">Home</Link>
                        {user ? (
                            <>
                                {(user?.role === 'ORGANIZER' || user?.role === 'ADMIN') && (
                                    <Link to="/create-event" className="text-gray-700 hover:text-green-600 font-semibold transition-colors">Create Event</Link>
                                )}
                                <Link to="/dashboard" className="text-gray-700 hover:text-purple-600 font-semibold transition-colors">Dashboard</Link>
                                <div className="h-8 w-px bg-gray-300 mx-2"></div>
                                <span className="font-bold text-blue-900 flex items-center">
                                    Hi, {user.name} 
                                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full font-black border border-blue-200 shadow-sm">
                                        {user.role}
                                    </span>
                                </span>
                                <button onClick={handleLogout} className="bg-red-50 hover:bg-red-100 text-red-600 px-5 py-2 rounded-full font-bold transition-all shadow-sm ml-2">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="h-8 w-px bg-gray-300 mx-2"></div>
                                <Link to="/login" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors">Login</Link>
                                <Link to="/register" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-md transform hover:-translate-y-0.5">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
export default Navbar;