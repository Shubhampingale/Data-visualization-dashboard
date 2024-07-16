import express from 'express';
const router = express.Router();
import DataModel from '../models/model.js';

// GET all data
router.get('/data', async (req, res) => {
  try {
    const data = await DataModel.find();
    res.json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
