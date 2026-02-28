# Food Ordering Platform Starter (Angular + Express + MySQL)

## 1) Folder Structure

```text
project/
├─ backend/
│  ├─ .env.example
│  ├─ package.json
│  ├─ server.js
│  ├─ uploads/
│  │  └─ .gitkeep
│  ├─ database/
│  │  ├─ migrations/
│  │  │  └─ 001_init.sql
│  │  └─ seeds/
│  │     ├─ seed.js
│  │     └─ seed.sql
│  ├─ postman/
│  │  └─ FoodOrderingPlatform.postman_collection.json
│  └─ src/
│     ├─ app.js
│     ├─ config/
│     │  └─ database.js
│     ├─ constants/
│     │  └─ roles.js
│     ├─ controllers/
│     │  ├─ admin.controller.js
│     │  ├─ auth.controller.js
│     │  ├─ food.controller.js
│     │  ├─ order.controller.js
│     │  └─ store.controller.js
│     ├─ middleware/
│     │  ├─ auth.middleware.js
│     │  ├─ error.middleware.js
│     │  ├─ role.middleware.js
│     │  ├─ upload.middleware.js
│     │  └─ validate.middleware.js
│     ├─ models/
│     │  ├─ food.model.js
│     │  ├─ order.model.js
│     │  ├─ store.model.js
│     │  └─ user.model.js
│     ├─ routes/
│     │  ├─ admin.routes.js
│     │  ├─ auth.routes.js
│     │  ├─ food.routes.js
│     │  ├─ index.js
│     │  ├─ order.routes.js
│     │  └─ store.routes.js
│     ├─ services/
│     │  ├─ admin.service.js
│     │  ├─ auth.service.js
│     │  ├─ food.service.js
│     │  ├─ order.service.js
│     │  └─ store.service.js
│     ├─ utils/
│     │  ├─ api-response.js
│     │  ├─ async-handler.js
│     │  └─ pagination.js
│     └─ validations/
│        ├─ auth.validation.js
│        ├─ food.validation.js
│        ├─ order.validation.js
│        └─ store.validation.js
├─ frontend/
│  ├─ .env.example
│  ├─ package.json
│  ├─ angular.json
│  └─ src/
│     ├─ environments/
│     │  └─ environment.ts
│     ├─ styles.css
│     └─ app/
│        ├─ app.component.{ts,html,css}
│        ├─ app.module.ts
│        ├─ app-routing.module.ts
│        ├─ core/
│        │  ├─ guards/
│        │  │  ├─ auth.guard.ts
│        │  │  └─ role.guard.ts
│        │  ├─ interceptors/
│        │  │  └─ jwt.interceptor.ts
│        │  ├─ models/
│        │  │  └─ api.models.ts
│        │  └─ services/
│        │     ├─ admin.service.ts
│        │     ├─ auth.service.ts
│        │     ├─ food.service.ts
│        │     ├─ order.service.ts
│        │     └─ store.service.ts
│        ├─ features/
│        │  ├─ auth/
│        │  │  ├─ login/
│        │  │  └─ register/
│        │  ├─ user/
│        │  │  ├─ food-detail/
│        │  │  ├─ food-list/
│        │  │  ├─ store-profile/
│        │  │  └─ user-dashboard/
│        │  ├─ seller/
│        │  │  ├─ seller-dashboard/
│        │  │  ├─ seller-foods/
│        │  │  ├─ seller-orders/
│        │  │  └─ store-settings/
│        │  └─ admin/
│        │     ├─ admin-dashboard/
│        │     ├─ admin-foods/
│        │     ├─ admin-orders/
│        │     ├─ admin-sellers/
│        │     └─ admin-users/
│        └─ shared/
│           └─ components/
│              └─ map-view/
└─ PROJECT_STARTER_GUIDE.md
```

## 2) MySQL Schema

Implemented in `backend/database/migrations/001_init.sql`:

- `users`: auth + role + seller approval state
- `stores`: one store per seller, includes latitude/longitude
- `foods`: linked to seller + store, includes price/rating/image/availability
- `orders`: user orders with status and total
- `order_items`: line items with quantity/unit price

Key relations:

- `stores.seller_id -> users.id`
- `foods.seller_id -> users.id`
- `foods.store_id -> stores.id`
- `orders.user_id -> users.id`
- `orders.store_id -> stores.id`
- `order_items.order_id -> orders.id`
- `order_items.food_id -> foods.id`

## 3) REST API Endpoints + Access

Base URL: `/api/v1`

| Method | Route | Access |
|---|---|---|
| POST | `/auth/register/user` | Public |
| POST | `/auth/register/seller` | Public |
| POST | `/auth/login` | Public |
| GET | `/auth/me` | USER, SELLER, ADMIN |
| GET | `/foods` | USER, SELLER, ADMIN |
| GET | `/foods/:foodId` | USER, SELLER(own only), ADMIN |
| POST | `/foods` | SELLER(approved), ADMIN |
| PUT | `/foods/:foodId` | SELLER(own only), ADMIN |
| DELETE | `/foods/:foodId` | SELLER(own only), ADMIN |
| POST | `/foods/:foodId/image` | SELLER(own only), ADMIN |
| GET | `/stores` | USER, ADMIN |
| GET | `/stores/:storeId` | USER, ADMIN |
| GET | `/stores/seller/me/profile` | SELLER(approved) |
| PUT | `/stores/seller/me/profile` | SELLER(approved) |
| POST | `/orders` | USER |
| GET | `/orders` | USER(own), SELLER(own store), ADMIN(all) |
| PATCH | `/orders/:orderId/status` | SELLER(own store), ADMIN |
| GET | `/admin/users` | ADMIN |
| GET | `/admin/sellers` | ADMIN |
| GET | `/admin/foods` | ADMIN |
| GET | `/admin/orders` | ADMIN |
| GET | `/admin/stores` | ADMIN |
| PATCH | `/admin/sellers/:sellerId/approve` | ADMIN |
| PATCH | `/admin/sellers/:sellerId/block` | ADMIN |

## 4) Backend Code Coverage

- Auth register/login: `backend/src/controllers/auth.controller.js`, `backend/src/services/auth.service.js`
- JWT middleware: `backend/src/middleware/auth.middleware.js`
- Role middleware: `backend/src/middleware/role.middleware.js`
- Food/store/order controllers:
  - `backend/src/controllers/food.controller.js`
  - `backend/src/controllers/store.controller.js`
  - `backend/src/controllers/order.controller.js`

## 5) Angular Coverage

- Role-based routing: `frontend/src/app/app-routing.module.ts`
- Guards: `frontend/src/app/core/guards/auth.guard.ts`, `frontend/src/app/core/guards/role.guard.ts`
- Dashboards:
  - `frontend/src/app/features/user/user-dashboard/*`
  - `frontend/src/app/features/seller/seller-dashboard/*`
  - `frontend/src/app/features/admin/admin-dashboard/*`
- Key components:
  - Food list/detail: `features/user/food-list`, `features/user/food-detail`
  - Seller food CRUD: `features/seller/seller-foods`
  - Admin tables: `features/admin/admin-users`, `admin-sellers`, `admin-foods`, `admin-orders`
  - Map view: `shared/components/map-view`
- JWT interceptor: `frontend/src/app/core/interceptors/jwt.interceptor.ts`

## 6) Sample .env Files

- Backend: `backend/.env.example`
- Frontend: `frontend/.env.example`

## 7) Seed Data Script

- SQL data: `backend/database/seeds/seed.sql`
- Runner script: `backend/database/seeds/seed.js`
- NPM command: `npm run seed`

Default seed users (password for all: `Password@123`):

- `admin@foodapp.com` (ADMIN)
- `user@foodapp.com` (USER)
- `seller@foodapp.com` (SELLER approved)

## 8) Postman Collection

- `backend/postman/FoodOrderingPlatform.postman_collection.json`

## 9) Local Setup

1. Create DB and tables:
   - Run `backend/database/migrations/001_init.sql` in MySQL.
2. Configure env:
   - Copy `backend/.env.example` to `backend/.env` and set DB/JWT values.
3. Install backend deps and run:
   - `cd backend`
   - `npm install`
   - `npm run seed`
   - `npm run dev`
4. Install frontend deps and run:
   - `cd ../frontend`
   - `npm install`
   - `npm start`
5. Import Postman collection and test APIs.
