'use strict'

// We copied this from the ProductController.js file to solve the "ReferenceError Database is not defined" error that we were getting when we clicked on Add New Orders in the Orders section of the left menu.
const Database = use('Database');
const sanitize = use('sqlstring');

class OrderController {
    // We copied many of these methods from the ProductController.js file because they are going to be similar.
    // We changed everything with the word product within the name to order.

    async index({view, request, response}) {
        try {
            // let allorders = await Database.raw(
            //     `SELECT orders.id, orders.title, orders.sku, brands.title AS brand, CONCAT(users.f_name, ' ', users.l_name) AS user, orders.material, orders.qty, orders.size, orders.user_id, orders.created_at
            //     FROM orders
            //     INNER JOIN brands
            //     ON orders.brand_id = brands.id
            //     INNER JOIN users
            //     ON orders.user_id = users.id
            //     ORDER BY created_at ASC;`
            // );
            
            // allorders = allorders[0];
            let allorders = '';

            return view.render('admin/orders/all', {allorders});
        } catch (error) {
            console.log(error);

            return response.redirect('back');
        }
    }

    async store({request, response}) {
        try {
            const post = request.post();
            await Database.raw(
                `INSERT INTO orders (title, sku, img_url, material, description, brand_id, qty, size, user_id)
                VALUES (${sanitize.escape(post.title)},
                    ${sanitize.escape(post.sku)},
                    ${sanitize.escape(post.img_url)},
                    ${sanitize.escape(post.material)},
                    ${sanitize.escape(post.description)},
                    ${sanitize.escape(post.brand_id)},
                    ${sanitize.escape(post.qty)},
                    ${sanitize.escape(post.size)},
                    ${parseInt(1)});`
            );
            
            return response.redirect('/admin/orders');
        } catch (error) {
            console.log(error);

            return response.redirect('back');
        }   
    }

    async create({view, request, response}) {
        // let brands = await Database.raw(
        //     `SELECT * FROM brands
        //     ORDER BY brands.title ASC;`
        // );
        // brands = brands[0];
        let brands = '';

        return view.render('admin/orders/create', {brands});
    }

    async show({view, request, response, params}) {
        try {
            let order = await Database.raw(
                `SELECT orders.id, orders.title, orders.sku, orders.img_url, orders.description, brands.title AS brand, CONCAT(users.f_name, ' ', users.l_name) AS user, orders.material, orders.qty, orders.size, orders.user_id, orders.created_at
                FROM orders
                INNER JOIN brands
                ON orders.brand_id = brands.id
                INNER JOIN users
                ON orders.user_id = users.id
                WHERE orders.id = ${params.id}
                ORDER BY created_at ASC
                LIMIT 1;`
            );

            order = order[0][0];

            return view.render('admin/orders/show', {order});
        } catch (error) {
            console.log(error);

            return response.redirect('back');
        }
    }

    async edit({view, request, response, params}) {
        try {
            let order = await Database.raw(
                `SELECT orders.id, orders.title, orders.sku, orders.img_url, orders.description, brands.title AS brand, CONCAT(users.f_name, ' ', users.l_name) AS user, orders.material, orders.qty, orders.size, orders.user_id, orders.brand_id, orders.created_at
                FROM orders
                INNER JOIN brands
                ON orders.brand_id = brands.id
                INNER JOIN users
                ON orders.user_id = users.id
                WHERE orders.id = ${params.id}
                ORDER BY created_at ASC
                LIMIT 1;`
            );
            order = order[0][0];
            
            let brands = await Database.raw(
                `SELECT * FROM brands
                ORDER BY brands.title ASC;`
            );
            brands = brands[0];

            return view.render('admin/orders/edit', {order, brands});
        } catch (error) {
            console.log(error);

            return response.redirect('back');
        }
    }

    async update({request, response, params}) {
        try {
            const id = params.id;

            const post = request.post();
            
            await Database.raw(
                `UPDATE orders
                SET
                    title = ${sanitize.escape(post.title)},
                    sku = ${sanitize.escape(post.sku)},
                    img_url = ${sanitize.escape(post.img_url)},
                    material = ${sanitize.escape(post.material)},
                    description = ${sanitize.escape(post.description)},
                    brand_id = ${sanitize.escape(post.brand_id)},
                    qty = ${sanitize.escape(post.qty)},
                    size = ${sanitize.escape(post.size)},
                    user_id = ${parseInt(1)}
                    WHERE id = ${id};`
            );
            
            return response.redirect(`/admin/orders/${id}`);
        } catch (error) {
            console.log(error);

            return response.redirect('back');
        }
    }

    async delete({request, response, params}) {
        const id = params.id;

        try {
            await Database.raw(
                `DELETE FROM orders
                WHERE id = ${id};`
            )

            return response.redirect('/admin/orders');
        } catch (error) {
            console.log(error);

            return response.redirect('back');
        }
    }
}

module.exports = OrderController