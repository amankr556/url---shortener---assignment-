import mongoose from 'mongoose';

const UrlSchema = new mongoose.Schema({
  original_url: { type: String, required: true },
  short_code: { type: String, required: true, unique: true },
  visits: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Url || mongoose.model('Url', UrlSchema);
