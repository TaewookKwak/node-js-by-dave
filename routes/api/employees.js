const express = require('express')
const router = express.Router()
const employeesContoller = require('../../controllers/employeesContoller')
router
  .route('/')
  .get(employeesContoller.getAllEmployees)
  .post(employeesContoller.createNewEmployee)
  .put(employeesContoller.updateEmployee)
  .delete(employeesContoller.deleteEmployee)

router.route('/:id').get(employeesContoller.getEmployee)
module.exports = router
