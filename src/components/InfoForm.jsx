import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { useContext } from "react";
import { ManualProfileContext } from '../contextAPI/ManualProfileContext';

const InfoForm = () => {
    const { data, setData } = useContext(ManualProfileContext);
    const personalInfo = data.info;
    const setPersonalInfo = (field, value) => {
        setData(prev => ({
            ...prev,
            info: {
                ...prev.info,
                [field]: value
            }
        }));
    };
    if (personalInfo.avatarUrl.size > 2 * 1024 * 1024) {
        alert("Image must be under 2MB");
        return;
    }
    return (
        <motion.div
            key="personal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
        >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <User className="text-purple-400" size={28} />
                Personal Information
            </h2>
            <div className="space-y-6">
                {/* Full Name */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Full Name *
                    </label>
                    <input
                        type="text"
                        value={personalInfo.fullName}
                        onChange={(e) => setPersonalInfo("fullName", e.target.value)}
                        placeholder="Your Name"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                </div>
                {/* Avatar Upload */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Profile Picture
                    </label>

                    <div className="flex items-center gap-6">

                        {/* Preview */}
                        <div className="w-24 h-24 rounded-full overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">
                            {personalInfo.avatarUrl ? (
                                <img
                                    src={personalInfo.avatarUrl}
                                    alt="Avatar Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="text-slate-500" size={32} />
                            )}
                        </div>

                        {/* Upload Button */}
                        <label className="cursor-pointer px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all">
                            Select Image
                            <input
                                type="file"
                                accept="image/png, image/jpeg"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;

                                    // 🔹 Validate Size (2MB limit)
                                    if (file.size > 2 * 1024 * 1024) {
                                        alert("Image must be less than 2MB");
                                        return;
                                    }

                                    // 🔹 Convert to Base64
                                    const reader = new FileReader();
                                    reader.readAsDataURL(file);

                                    reader.onload = () => {
                                        setPersonalInfo("avatarUrl", reader.result);
                                    };

                                    reader.onerror = (error) => {
                                        console.error("Error converting image:", error);
                                    };
                                }}
                            />
                        </label>
                    </div>

                    {/* Remove Button */}
                    {personalInfo.avatarUrl && (
                        <button
                            onClick={() => setPersonalInfo("avatarUrl", "")}
                            className="text-xs text-red-400 mt-2"
                        >
                            Remove Image
                        </button>
                    )}
                </div>
                {/* Bio */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Bio
                    </label>
                    <textarea
                        value={personalInfo.bio}
                        onChange={(e) => setPersonalInfo("bio", e.target.value)}
                        placeholder="Tell us about yourself..."
                        rows={4}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                    />
                    <p className="text-xs text-slate-500 mt-1">{personalInfo.bio.length} / 500 characters</p>
                </div>
            </div>
        </motion.div>
    )
}

export default InfoForm;