const express = require('express');
const { allUser,sresult, reset } = require('../controllers/others');

const router = express.Router();

router.get('/', allUser);
router.get('/sresult', sresult);
//router.get('/all', reset);
module.exports = router;
