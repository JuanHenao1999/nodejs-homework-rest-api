const express = require('express')

const {validation, ctrlWrapper} = require("../../middlrwares")
const {joiSchema, favoriteJoiSchema} = require("../../models/contact")
const {contacts: ctrl} = require("../../controllers")

const router = express.Router()

router.get('/', ctrlWrapper(ctrl.getAll))

router.get('/:id', ctrlWrapper(ctrl.getById));

router.post('/', validation(joiSchema), ctrlWrapper(ctrl.addContact))

router.put('/:id', validation(joiSchema), ctrlWrapper(ctrl.updateById));

router.patch('/:id/favorite', validation(favoriteJoiSchema), ctrlWrapper(ctrl.updateFavorite));

router.delete('/:id', ctrlWrapper(ctrl.removeById));

module.exports = router