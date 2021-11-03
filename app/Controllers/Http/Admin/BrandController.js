'use strict'
// We copied over just about everything from the ProductController.js file to this file because we are going to be doing pretty much the same thing with the brands table that we did with the brands table.
const Database = use('Database');
const sanitize = use('sqlstring');

class BrandController {
    async index({view, request, response}) {
        try {
            // We changed the ORDER BY clause to be by brands.title ASC.
            let allBrands = await Database.raw(
                `SELECT brands.id, brands.title, brands.img_url, brands.user_id, CONCAT(users.f_name, ' ', users.l_name) AS user, brands.created_at, brands.updated_at FROM brands
                INNER JOIN users
                ON brands.user_id = users.id
                ORDER BY brands.title ASC;`
            );
            
            allBrands = allBrands[0];

            return view.render('admin/brands/all', {allBrands});
        } catch (error) {
            console.log(error);

            return response.redirect('back');
        }
    }

    async store({request, response}) {
        try {
            const post = request.post();
            await Database.raw(
                `INSERT INTO brands (title, img_url, description, user_id)
                VALUES (${sanitize.escape(post.title)},
                    ${sanitize.escape(post.img_url)},
                    ${sanitize.escape(post.description)},
                    ${parseInt(1)});`
            );
            
            return response.redirect('/admin/brands');
        } catch (error) {
            console.log(error);

            return response.redirect('back');
        }   
    }

    create({view, request, response}) {
        return view.render('admin/brands/create');
    }

    async show({view, request, response, params}) {
        try {
            // We removed the ORDER BY clause because this is for the brand show page and there will only be a single choice in here.
            let brand = await Database.raw(
                `SELECT brands.id, brands.title, brands.img_url, brands.description, CONCAT(users.f_name, ' ', users.l_name) AS user, brands.user_id, brands.created_at, brands.updated_at
                FROM brands
                INNER JOIN users
                ON brands.user_id = users.id
                WHERE brands.id = ${params.id}
                LIMIT 1;`
            );

            brand = brand[0][0];

            return view.render('admin/brands/show', {brand});
        } catch (error) {
            console.log(error);

            return response.redirect('back');
        }
    }

    async edit({view, request, response, params}) {
        try {
            // We removed the inner join with the brands table that was located before the inner join with the users table because we were getting a "Not unique table/alias: 'brands'" error.
            let brands = await Database.raw(
                `SELECT brands.id, brands.title, brands.img_url, brands.description, CONCAT(users.f_name, ' ', users.l_name) AS user, brands.user_id, brands.created_at, brands.updated_at
                FROM brands
                INNER JOIN users
                ON brands.user_id = users.id
                WHERE brands.id = ${params.id}
                ORDER BY created_at ASC
                LIMIT 1;`
            );

            brands = brands[0][0];

            return view.render('admin/brands/edit', {products, brands});
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
                `UPDATE brands
                SET
                    title = ${sanitize.escape(post.title)},
                    img_url = ${sanitize.escape(post.img_url)},
                    description = ${sanitize.escape(post.description)}
                    WHERE id = ${id};`
            );
            
            return response.redirect(`/admin/brands/${id}`);
        } catch (error) {
            console.log(error);

            return response.redirect('back');
        }
    }

    async delete({request, response, params}) {
        const id = params.id;

        try {
            await Database.raw(
                `DELETE FROM brands
                WHERE id = ${id};`
            )

            return response.redirect('/admin/brands');
        } catch (error) {
            console.log(error);

            return response.redirect('back');
        }
    }
}

module.exports = BrandController
