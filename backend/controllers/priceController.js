import PriceHistory from '../models/PriceHistory.js'
import Company from '../models/Company.js'

export const updatePrice = async (req, res) => {
  try {
    const { companyId } = req.params
    const { price } = req.body

    const company = await Company.findById(companyId)
    if (!company) {
      return res.status(404).json({ message: 'Company not found' })
    }

    const priceRecord = await PriceHistory.create({
      company: companyId,
      price
    })

    res.status(201).json(priceRecord)
  } catch (error) {
    res.status(400).json({ message: 'Error updating price', error: error.message })
  }
}

export const getPriceHistory = async (req, res) => {
  try {
    const { companyId } = req.params

    const history = await PriceHistory.find({ company: companyId })
      .sort({ recordedAt: 1 })
      .lean()

    res.status(200).json(history)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching price history', error: error.message })
  }
}
