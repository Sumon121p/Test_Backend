const express = require('express');
const router = express.Router();
const userController = require('../Controller/User.Controller');

router.post('/create', userController.createUser);

router.get('/view', userController.getAllUsers);

module.exports = router;
