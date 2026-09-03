import express from 'express'
import { updatePrice, getPriceHistory } from '../controllers/priceController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/:companyId', authMiddleware, updatePrice)
router.get('/:companyId', getPriceHistory)

export default router
