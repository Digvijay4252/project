const path = require('path');
const asyncHandler = require('../utils/async-handler');
const { sendSuccess } = require('../utils/api-response');
const { getPagination, getPaginationMeta } = require('../utils/pagination');
const foodService = require('../services/food.service');

const listFoods = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const query = {
    ...req.query,
    sellerId: req.user.id,
  };
  const result = await foodService.listFoodsForViewer(req.user.role, query, limit, offset);
  return sendSuccess(res, 200, 'Foods fetched', result.rows, getPaginationMeta(page, limit, result.total));
});

const getFoodById = asyncHandler(async (req, res) => {
  const food = await foodService.getFoodDetailForViewer(Number(req.params.foodId), req.user.role, req.user.id);
  return sendSuccess(res, 200, 'Food detail fetched', food);
});

const createFood = asyncHandler(async (req, res) => {
  const payload = {
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    price: Number(req.body.price),
    rating: Number(req.body.rating || 0),
    imageUrl: req.body.imageUrl || null,
    isAvailable: req.body.isAvailable !== undefined ? Boolean(req.body.isAvailable) : true,
    sellerId: req.body.sellerId ? Number(req.body.sellerId) : undefined,
    storeId: req.body.storeId ? Number(req.body.storeId) : undefined,
  };
  const food = await foodService.createFoodByActor(req.user, payload);
  return sendSuccess(res, 201, 'Food item created', food);
});

const updateFood = asyncHandler(async (req, res) => {
  const payload = {
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    price: Number(req.body.price),
    rating: Number(req.body.rating),
    imageUrl: req.body.imageUrl || null,
    isAvailable: Boolean(req.body.isAvailable),
  };
  const food = await foodService.updateFoodForOwnerOrAdmin(Number(req.params.foodId), payload, req.user);
  return sendSuccess(res, 200, 'Food item updated', food);
});

const deleteFood = asyncHandler(async (req, res) => {
  await foodService.deleteFoodForOwnerOrAdmin(Number(req.params.foodId), req.user);
  return sendSuccess(res, 200, 'Food item deleted');
});

const uploadFoodImage = asyncHandler(async (req, res) => {
  const relativePath = path.posix.join('foods', req.file.filename);
  const imageUrl = `/uploads/${relativePath}`;
  const food = await foodService.updateFoodImage(Number(req.params.foodId), imageUrl, req.user);
  return sendSuccess(res, 200, 'Food image uploaded', food);
});

module.exports = {
  listFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
  uploadFoodImage,
};
