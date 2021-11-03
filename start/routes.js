'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

// What we are saying here is to use the PageController class and the index method.  I am guessing to use these when handling GET requests to the root directory.
Route.get('/', 'PageController.index');

// Admin/Products
// This route is for the products page and it is going to use the index method of the ProductController class inside of the Admin folder.
Route.get('/admin/products', 'Admin/ProductController.index');
// This route is going to be used for POST requests to save new products.  We are using the ProductController inside of the Admin folder with the store method.
Route.post('/admin/products', 'Admin/ProductController.store');
// This route is for the /products/create page.
Route.get('/admin/products/create', 'Admin/ProductController.create');
// This route is for a single product. It uses the product id in order to find the product.  The product is shown with the show method.
// :id is a route parameter.  We can think of :id as a variable that we have access to at any moment.
// We changed back to this route with just the :id, instead of the one below with the :id and the :name.  It seems like you have to put some value in each route parameter when using AdonisJS, or you will get an error, or get sent back to the homepage.
Route.get('/admin/products/:id', 'Admin/ProductController.show');
// We can create as many route parameters as we want.  We added the route parameter :name to the route above.  We get access to all of the route parameters right away when we use the params property in a f().
// Route.get('/admin/products/:id/:name', 'Admin/ProductController.show');
// This route is for a page with a form that will allow us to edit a product itself.
Route.get('/admin/products/:id/edit', 'Admin/ProductController.edit');
// This route is going to be used for PUT requests in order to update products.  This is going to use the update method.  POST requests are basically used for creating new things while PUT requests are used for updating things.
// Route.put('/admin/products/:id/edit', 'Admin/ProductController.update');
// We had to remove the /edit at the end of the route because we were getting a "Route not found" error.  This is because we are submitting the form to the /admin/products/:id URL in the edit.edge file.
Route.put('/admin/products/:id', 'Admin/ProductController.update');
// This route is for deleting products.
// Route.delete('/admin/products/:id/delete', 'Admin/ProductController.delete');
// Instead of using the DELETE request above, we are going to change it to a GET request.  Joe said that since we are working on a project that is going to be used as an internal tool, we can kind of cheat and not use a POST request or the DELETE request above.
// If the user goes to this route, whichever product has an id that matches the :id will be deleted.  We will create a confirm box on the product show page so that the user has to confirm that he or she wants to delete the product.
Route.get('/admin/products/:id/delete', 'Admin/ProductController.delete');

// Admin/Brands
// We copied all of the routes for the products and modified them for the brands.
Route.get('/admin/brands', 'Admin/BrandController.index');
Route.post('/admin/brands', 'Admin/BrandController.store');
Route.get('/admin/brands/create', 'Admin/BrandController.create');
Route.get('/admin/brands/:id', 'Admin/BrandController.show');
Route.get('/admin/brands/:id/edit', 'Admin/BrandController.edit');
Route.put('/admin/brands/:id', 'Admin/BrandController.update');
Route.get('/admin/brands/:id/delete', 'Admin/BrandController.delete');

// Admin/Orders
// We copied all of the routes for the brands and modified them for the orders.
Route.get('/admin/orders', 'Admin/OrderController.index');
Route.post('/admin/orders', 'Admin/OrderController.store');
Route.get('/admin/orders/create', 'Admin/OrderController.create');
Route.get('/admin/orders/:id', 'Admin/OrderController.show');
Route.get('/admin/orders/:id/edit', 'Admin/OrderController.edit');
Route.put('/admin/orders/:id', 'Admin/OrderController.update');
Route.get('/admin/orders/:id/delete', 'Admin/OrderController.delete');