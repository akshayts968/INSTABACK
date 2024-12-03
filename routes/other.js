const express = require('express');
const { allUser,sresult, reset,err } = require('../controllers/others');

const router = express.Router();

router.get('/', allUser);
router.get('/sresult', sresult);
router.get('/all', allUser);
router.get('/err', err);
module.exports = router;
