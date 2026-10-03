import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        entryFee: '',
        totalSeats: '',
        category: 'General'
    });

    const [image, setImage] = useState(null);
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('date', formData.date);
            data.append('location', formData.location);
            data.append('entryFee', formData.entryFee);
            data.append('totalSeats', formData.totalSeats);
            data.append('category', formData.category);

            if (image) {
                data.append('image', image);
            }
            
            await axios.post('http://localhost:5000/api/events', data, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert("Wah! Event Created Successfully!");
            navigate('/');
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.error || "Kuch galti ho gayi!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute top-0 -left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute top-0 -right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

            <div className="max-w-4xl w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 relative z-10 border border-white">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">Host a Spectacular Event</h2>
                    <p className="text-gray-500 font-medium">Fill in the details to publish your event to the world.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Event Title</label>
                            <input type="text" name="title" onChange={handleChange} required className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-all shadow-sm" placeholder="e.g. Arijit Singh Live" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                            <select name="category" onChange={handleChange} className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-all shadow-sm cursor-pointer">
                                <option value="General">General</option>
                                <option value="Music">Music</option>
                                <option value="Tech">Tech</option>
                                <option value="Comedy">Comedy</option>
                                <option value="Sports">Sports</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
                            <input type="date" name="date" onChange={handleChange} required className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-all shadow-sm cursor-pointer" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                            <input type="text" name="location" onChange={handleChange} required className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-all shadow-sm" placeholder="e.g. Mumbai Stadium" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Entry Fee (Rs.)</label>
                            <input type="number" name="entryFee" onChange={handleChange} required className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-all shadow-sm" placeholder="e.g. 500" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Total Seats</label>
                            <input type="number" name="totalSeats" onChange={handleChange} required className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-all shadow-sm" placeholder="e.g. 1000" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                        <textarea name="description" onChange={handleChange} required rows="4" className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-all shadow-sm resize-none" placeholder="Tell us what makes this event special..."></textarea>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 border-dashed">
                        <label className="block text-sm font-bold text-blue-900 mb-2 flex items-center">
                            Event Poster (High Quality Image)
                        </label>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="w-full file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:transition-colors file:cursor-pointer text-blue-600 cursor-pointer" />
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black text-lg py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition duration-300 shadow-xl transform hover:-translate-y-1 mt-4">
                        {loading ? "Uploading to Cloudinary & Saving..." : "Publish Event Now"}
                    </button>
                </form>
            </div>
        </div>
    );
};
export default CreateEvent;
