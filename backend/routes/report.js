import express from 'express'
import {
    createReport,
    getFraudEntity,
    listFraudEntities
} from '../controllers/reportController.js'

const router = express.Router()

router.post('/', createReport)
router.get('/fraud/:kind/:identifier', getFraudEntity)
router.get('/list', listFraudEntities)

export default router
