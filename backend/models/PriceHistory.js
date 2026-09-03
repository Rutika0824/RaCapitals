import mongoose from 'mongoose'

// PriceHistory documents are append-only.
// A price change must always create a NEW document.
// Never update an existing PriceHistory record.

const PriceHistorySchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  price: { type: Number, required: true },
  recordedAt: { type: Date, default: Date.now }
}, { timestamps: true })

export default mongoose.model('PriceHistory', PriceHistorySchema)
