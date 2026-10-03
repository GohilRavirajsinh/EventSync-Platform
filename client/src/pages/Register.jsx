import { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('USER');
    const [loading, setLoading] = useState(false);

    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role }, { withCredentials: true });
            setUser(response.data);
            alert('Registration Successful! Welcome to EventSync.');
            navigate('/');
        } catch (error) {
            alert(error.response?.data?.error || 'Registration failed!');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 py-12">
            <div className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/50">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Create Account</h2>
                    <p className="text-gray-500 font-medium">Join EventSync to book or host events.</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                        <input type="text" placeholder="e.g. John Doe" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 focus:bg-white transition-all" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                        <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 focus:bg-white transition-all" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Account Type</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 focus:bg-white transition-all cursor-pointer text-gray-700 font-medium">
                            <option value="USER">Regular User (Can book tickets)</option>
                            <option value="ORGANIZER">Organizer (Can host events)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                        <input type="password" placeholder="Create a strong password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 focus:bg-white transition-all" required />
                    </div>
                    
                    <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3.5 rounded-xl hover:from-purple-700 hover:to-blue-700 transition duration-300 font-black shadow-lg transform hover:-translate-y-0.5 mt-4">
                        {loading ? "Creating Account..." : "Sign Up Now"}
                    </button>
                </form>
                <p className="mt-8 text-center text-gray-600">
                    Already have an account? <Link to="/login" className="text-purple-600 font-bold hover:underline">Log in instead</Link>
                </p>
            </div>
        </div>
    );
}
export default Register;
