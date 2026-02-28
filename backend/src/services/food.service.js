const foodModel = require('../models/food.model');
const storeModel = require('../models/store.model');
const { ROLES, SELLER_APPROVAL, USER_STATUS } = require('../constants/roles');

const parseFilters = (query) => ({
  category: query.category,
  city: query.city,
  minPrice: query.minPrice !== undefined ? Number(query.minPrice) : undefined,
  maxPrice: query.maxPrice !== undefined ? Number(query.maxPrice) : undefined,
  minRating: query.minRating !== undefined ? Number(query.minRating) : undefined,
  latitude: query.latitude !== undefined ? Number(query.latitude) : undefined,
  longitude: query.longitude !== undefined ? Number(query.longitude) : undefined,
  maxDistanceKm: query.maxDistanceKm !== undefined ? Number(query.maxDistanceKm) : undefined,
  availableOnly: query.availableOnly !== 'false',
});

const listFoodsForViewer = async (viewerRole, query, limit, offset) => {
  if (viewerRole === ROLES.ADMIN) {
    return foodModel.listAllAdmin(limit, offset);
  }

  if (viewerRole === ROLES.SELLER) {
    if (!query.sellerId) {
      const error = new Error('sellerId missing for mine filter');
      error.statusCode = 400;
      throw error;
    }
    return foodModel.listBySeller(Number(query.sellerId), limit, offset);
  }

  return foodModel.listPublic(parseFilters(query), limit, offset);
};

const getFoodDetailForViewer = async (foodId, viewerRole, viewerId = null) => {
  const food = await foodModel.findById(foodId);
  if (!food) {
    const error = new Error('Food item not found');
    error.statusCode = 404;
    throw error;
  }

  if (viewerRole === ROLES.SELLER && food.seller_id !== viewerId) {
    const error = new Error('Cannot access another seller food item');
    error.statusCode = 403;
    throw error;
  }

  if (
    viewerRole !== ROLES.ADMIN &&
    !(viewerRole === ROLES.SELLER && food.seller_id === viewerId) &&
    (food.seller_approval !== SELLER_APPROVAL.APPROVED || food.seller_status !== USER_STATUS.ACTIVE)
  ) {
    const error = new Error('Food item not available');
    error.statusCode = 404;
    throw error;
  }

  return food;
};

const createFoodByActor = async (actor, payload) => {
  if (actor.role === ROLES.SELLER) {
    const store = await storeModel.findBySellerId(actor.id);
    if (!store) {
      const error = new Error('Create store profile before adding food items');
      error.statusCode = 400;
      throw error;
    }
    return foodModel.create({
      ...payload,
      sellerId: actor.id,
      storeId: store.id,
    });
  }

  if (actor.role === ROLES.ADMIN) {
    if (!payload.storeId || !payload.sellerId) {
      const error = new Error('Admin must provide sellerId and storeId');
      error.statusCode = 400;
      throw error;
    }
    return foodModel.create({
      ...payload,
      sellerId: payload.sellerId,
      storeId: payload.storeId,
    });
  }

  const error = new Error('Forbidden to create food');
  error.statusCode = 403;
  throw error;
};

const updateFoodForOwnerOrAdmin = async (foodId, payload, actor) => {
  const existing = await foodModel.findById(foodId);
  if (!existing) {
    const error = new Error('Food item not found');
    error.statusCode = 404;
    throw error;
  }

  if (actor.role === ROLES.SELLER && existing.seller_id !== actor.id) {
    const error = new Error('Cannot edit another seller food item');
    error.statusCode = 403;
    throw error;
  }

  return foodModel.updateById(foodId, payload);
};

const deleteFoodForOwnerOrAdmin = async (foodId, actor) => {
  const existing = await foodModel.findById(foodId);
  if (!existing) {
    const error = new Error('Food item not found');
    error.statusCode = 404;
    throw error;
  }
  if (actor.role === ROLES.SELLER && existing.seller_id !== actor.id) {
    const error = new Error('Cannot delete another seller food item');
    error.statusCode = 403;
    throw error;
  }
  await foodModel.deleteById(foodId);
};

const updateFoodImage = async (foodId, imageUrl, actor) => {
  const existing = await foodModel.findById(foodId);
  if (!existing) {
    const error = new Error('Food item not found');
    error.statusCode = 404;
    throw error;
  }
  if (actor.role === ROLES.SELLER && existing.seller_id !== actor.id) {
    const error = new Error('Cannot update image for another seller food item');
    error.statusCode = 403;
    throw error;
  }
  return foodModel.updateById(foodId, {
    name: existing.name,
    description: existing.description,
    category: existing.category,
    price: existing.price,
    rating: existing.rating,
    imageUrl,
    isAvailable: existing.is_available,
  });
};

module.exports = {
  listFoodsForViewer,
  getFoodDetailForViewer,
  createFoodByActor,
  updateFoodForOwnerOrAdmin,
  deleteFoodForOwnerOrAdmin,
  updateFoodImage,
};
