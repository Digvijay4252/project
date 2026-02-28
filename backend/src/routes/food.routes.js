const express = require('express');
const foodController = require('../controllers/food.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles, requireApprovedSellerIfSeller } = require('../middleware/role.middleware');
const { validateRequest } = require('../middleware/validate.middleware');
const { createOrUpdateFoodValidation } = require('../validations/food.validation');
const { uploadFoodImage } = require('../middleware/upload.middleware');
const { ROLES } = require('../constants/roles');

const router = express.Router();

router.get('/', authenticate, authorizeRoles(ROLES.USER, ROLES.SELLER, ROLES.ADMIN), foodController.listFoods);
router.get('/:foodId', authenticate, authorizeRoles(ROLES.USER, ROLES.SELLER, ROLES.ADMIN), foodController.getFoodById);

router.post(
  '/',
  authenticate,
  authorizeRoles(ROLES.SELLER, ROLES.ADMIN),
  requireApprovedSellerIfSeller,
  createOrUpdateFoodValidation,
  validateRequest,
  foodController.createFood
);
router.put(
  '/:foodId',
  authenticate,
  authorizeRoles(ROLES.SELLER, ROLES.ADMIN),
  createOrUpdateFoodValidation,
  validateRequest,
  foodController.updateFood
);
router.delete('/:foodId', authenticate, authorizeRoles(ROLES.SELLER, ROLES.ADMIN), foodController.deleteFood);
router.post(
  '/:foodId/image',
  authenticate,
  authorizeRoles(ROLES.SELLER, ROLES.ADMIN),
  uploadFoodImage.single('image'),
  foodController.uploadFoodImage
);

module.exports = router;
