import mongoose from 'mongoose'

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  logoUrl: { type: String },
  sector: { type: String, required: true },
  description: { type: String },
  lotSize: { type: Number, required: true },
  faceValue: { type: Number },
  isin: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

export default mongoose.model('Company', CompanySchema)
