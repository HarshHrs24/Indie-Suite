const express = require('express');
const { createInvoice, getInvoicesByProject, getInvoiceById, updateInvoice, deleteInvoice } = require('../controllers/invoiceController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createInvoice);

router.route('/project/:projectId')
  .get(protect, getInvoicesByProject);

router.route('/:id')
  .get(protect, getInvoiceById)
  .put(protect, updateInvoice)
  .delete(protect, deleteInvoice);

module.exports = router;
