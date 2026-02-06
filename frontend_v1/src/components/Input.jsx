import { motion } from 'framer-motion';

export default function Input({ label, error, ...props }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <input 
        className={`w-full bg-gray-800 border ${error ? 'border-red-500' : 'border-gray-700'} rounded-lg p-3 text-white focus:ring-2 focus:ring-primary outline-none transition-all`}
        {...props}
      />
      {error && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs mt-1">
          {error}
        </motion.p>
      )}
    </div>
  );
}