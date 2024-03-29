var express = require('express');
var router = express.Router();
const med_fn = require('./service_function')
/* GET home page. */
router.get('/get_operator', med_fn.get_operator);
router.get('/get_operating', med_fn.get_operating);
router.get('/get_pharmacy', med_fn.get_pharmacy);
router.get('/get_professional', med_fn.get_professional);
router.get('/get_vehicle', med_fn.get_vehicle);
router.get('/get_volunteer', med_fn.get_volunteer); 
router.post('/add_operator',med_fn.add_operator)
router.post('/add_pharmacy',med_fn.add_pharmacy)
router.post('/add_operating_unit',med_fn.add_operating_unit)
router.post('/add_volunteer',med_fn.add_volunteer)
router.post('/add_professional',med_fn.add_professional)
router.post('/add_vehicle',med_fn.add_vehicle)
router.delete('/delete_operator',med_fn.delete_operator)
router.delete('/delete_operating_unit',med_fn.delete_operating_unit)
router.delete('/delete_pharmacy',med_fn.delete_pharmacy)
router.delete('/delete_professional',med_fn.delete_professional)
router.delete('/delete_vehicle',med_fn.delete_vehicle)
router.delete('/delete_volunteer',med_fn.delete_volunteer)
router.get('/get_position',med_fn.get_position)
router.post('/update_operator',med_fn.update_operator)
router.post('/update_operating_unit',med_fn.update_operating_unit)
router.post('/update_pharmacy',med_fn.update_pharmacy)
router.post('/update_volunteer',med_fn.update_volunteer)
router.post('/update_professional',med_fn.update_professional)
router.post('/update_vehicle',med_fn.update_vehicle)
router.post('/add_hospital',med_fn.add_hospital)
router.post('/update_hospital',med_fn.update_hospital)
router.post('/add_patient',med_fn.add_patient)
router.post('/update_patient',med_fn.update_patient)
router.post('/add_consult',med_fn.add_consult)
router.post('/update_consult',med_fn.update_consult)
router.post('/add_emergency_reported',med_fn.add_emergency_reported)
router.post('/update_emergency_reported',med_fn.update_emergency_reported)
router.post('/command_operating_unit',med_fn.command_operating_unit)
router.post('/get_new_operation_id',med_fn.get_new_operation_id)
router.post('/get_getjob',med_fn.get_getjob)
router.get('/get_emergency_reported',med_fn.get_emergency_reported)
router.get('/get_patient_master',med_fn.get_patient_master)
router.get('/get_hospital_master',med_fn.get_hospital_master)
router.delete('/delete_hospital',med_fn.delete_hospital)
router.get('/get_compensate',med_fn.get_compensate)
router.post('/update_compensate',med_fn.update_compensate)
router.get('/get_advice',med_fn.get_advice)
router.post('/update_advice',med_fn.update_advice)
router.get('/get_mainsymptom',med_fn.get_mainsymptom)
router.get('/get_ready_hospital',med_fn.get_ready_hospital)
router.get('/get_ready_operatingunit',med_fn.get_ready_operatingunit)
router.post('/add_ready_operatingunit',med_fn.add_ready_operatingunit)
router.post('/add_ready_hospital',med_fn.add_ready_hospital)
router.post('/update_ready_operatingunit',med_fn.update_ready_operatingunit)
router.post('/update_ready_hospital',med_fn.update_ready_hospital)
router.post('/add_new_main_symptom',med_fn.add_new_main_symptom)
router.delete('/delete_main_symptom',med_fn.delete_main_symptom)
router.delete('/delete_ready_operatingunit',med_fn.delete_ready_operatingunit)
router.delete('/delete_ready_hospital',med_fn.delete_ready_hospital)
router.get('/get_screening_detail',med_fn.get_screening_detail)
router.post('/add_screening_minor',med_fn.add_screening_minor)
router.post('/add_screening_question',med_fn.add_screening_question)
router.delete('/delete_minor_symptom',med_fn.delete_minor_symptom)
router.post('/update_minor_symptom',med_fn.update_minor_symptom)
router.get('/get_consult',med_fn.get_consult)
router.delete('/delete_consult',med_fn.delete_consult)
router.get('/get_command_vehicle',med_fn.get_command_vehicle)
router.post('/tokencheck',med_fn.tokencheck)
router.get('/get_screening_minor',med_fn.get_screening_minor)
router.post('/update_operation_master',med_fn.update_operation_master)
router.get('/get_usermaster',med_fn.get_usermaster)
module.exports = router;
