import Company from '../models/Company.js'
import PriceHistory from '../models/PriceHistory.js'

export const getAllCompanies = async (req, res) => {
  try {
    const { sector, search } = req.query
    const query = { isActive: true }

    if (sector) {
      query.sector = sector
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' }
    }

    const companies = await Company.find(query).lean()

    const companiesWithStats = await Promise.all(
      companies.map(async (company) => {
        const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)

        const latestPriceDoc = await PriceHistory.findOne({ company: company._id })
          .sort({ recordedAt: -1 })
          .lean()

        const prices52w = await PriceHistory.find({
          company: company._id,
          recordedAt: { $gte: oneYearAgo }
        }).lean()

        const prices = prices52w.map(p => p.price)
        const high52 = prices.length ? Math.max(...prices) : null
        const low52 = prices.length ? Math.min(...prices) : null

        return {
          ...company,
          latestPrice: latestPriceDoc ? latestPriceDoc.price : null,
          high52,
          low52
        }
      })
    )

    res.status(200).json(companiesWithStats)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching companies', error: error.message })
  }
}

export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params

    const company = await Company.findById(id).lean()
    if (!company) {
      return res.status(404).json({ message: 'Company not found' })
    }

    const priceHistory = await PriceHistory.find({ company: id })
      .sort({ recordedAt: 1 })
      .lean()

    const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
    const prices52w = priceHistory.filter(p => p.recordedAt >= oneYearAgo).map(p => p.price)

    const high52 = prices52w.length ? Math.max(...prices52w) : null
    const low52 = prices52w.length ? Math.min(...prices52w) : null

    res.status(200).json({
      ...company,
      priceHistory,
      high52,
      low52
    })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching company', error: error.message })
  }
}

export const createCompany = async (req, res) => {
  try {
    const company = await Company.create(req.body)
    res.status(201).json(company)
  } catch (error) {
    res.status(400).json({ message: 'Error creating company', error: error.message })
  }
}

export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params
    const allowedFields = ['name', 'sector', 'description', 'lotSize', 'faceValue', 'isin', 'logoUrl']

    const updates = {}
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key]
      }
    }

    const company = await Company.findByIdAndUpdate(id, updates, { new: true, runValidators: true })
    if (!company) {
      return res.status(404).json({ message: 'Company not found' })
    }

    res.status(200).json(company)
  } catch (error) {
    res.status(400).json({ message: 'Error updating company', error: error.message })
  }
}

export const deactivateCompany = async (req, res) => {
  try {
    const { id } = req.params
    const company = await Company.findByIdAndUpdate(id, { isActive: false }, { new: true })
    if (!company) {
      return res.status(404).json({ message: 'Company not found' })
    }
    res.status(200).json({ message: 'Company deactivated', company })
  } catch (error) {
    res.status(500).json({ message: 'Error deactivating company', error: error.message })
  }
}

export const uploadLogo = async (req, res) => {
  try {
    const { id } = req.params

    if (!req.file) {
      return res.status(400).json({ message: 'No logo file uploaded' })
    }

    const company = await Company.findById(id)
    if (!company) {
      return res.status(404).json({ message: 'Company not found' })
    }

    company.logoUrl = `/uploads/${req.file.filename}`
    await company.save()

    res.status(200).json(company)
  } catch (error) {
    res.status(500).json({ message: 'Error uploading logo', error: error.message })
  }
}

export const getAllCompaniesAdmin = async (req, res) => {
  try {
    const { sector, search } = req.query
    const query = {}

    if (sector) {
      query.sector = sector
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' }
    }

    const companies = await Company.find(query).lean()

    const companiesWithStats = await Promise.all(
      companies.map(async (company) => {
        const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)

        const latestPriceDoc = await PriceHistory.findOne({ company: company._id })
          .sort({ recordedAt: -1 })
          .lean()

        const prices52w = await PriceHistory.find({
          company: company._id,
          recordedAt: { $gte: oneYearAgo }
        }).lean()

        const prices = prices52w.map(p => p.price)
        const high52 = prices.length ? Math.max(...prices) : null
        const low52 = prices.length ? Math.min(...prices) : null

        return {
          ...company,
          latestPrice: latestPriceDoc ? latestPriceDoc.price : null,
          high52,
          low52
        }
      })
    )

    res.status(200).json(companiesWithStats)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching companies', error: error.message })
  }
}

export const activateCompany = async (req, res) => {
  try {
    const { id } = req.params
    const company = await Company.findByIdAndUpdate(id, { isActive: true }, { new: true })
    if (!company) {
      return res.status(404).json({ message: 'Company not found' })
    }
    res.status(200).json({ message: 'Company activated', company })
  } catch (error) {
    res.status(500).json({ message: 'Error activating company', error: error.message })
  }
}
