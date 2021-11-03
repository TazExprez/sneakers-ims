'use strict'
// When you cannot find the answer to some database related things in the AdonisJS documentation, just go to the Knex.js documentation.  Just remember that you use Database.whatever in AdonisJS, instead of knex.whatever in Knex.js.
const Database = use('Database');
// We are using the sqlstring package in order to avoid SQL Injection attacks.  These are attacks where the user enters raw SQL statements in forms that can do changes to our database, and even delete the entire thing.
const sanitize = use('sqlstring');

class ProductController {
    // Here we are passing in an {} that has a view property.
    // index({view}) {
    //     // Here we are going to render the all.edge file in the admin/products folder.
    //     return view.render('admin/products/all');
    // }
    // Here we are changing the index() method above in order to show all of the products on the index page.  We copied the try...catch statement from the store() method and modified it.  We turned the index() method into an async method.  Now instead of using a MySQL INSERT statement, we are using a MySQL SELECT statement.  We are going to select all of the columns in the products table with the `SELECT * FROM products;` SELECT statement.  When we first refreshed the /admin/products page, we received an error of "request is not defined" without the quotes.  Joe said the reason we are getting this error is because there is basically no way to go back to the /admin/products page.  We were having this issue because we were not sending the request and response to the index() method.  Joe said that we must send these two properties to every method.  We added the view, request, and response properties to the create(), show(), and edit() methods.  We only added the request and response properties to the arguments for the update() and delete() methods because these only require request and response, but not view.  When we use the update() and delete() methods,  these have nothing to do with the view, these only deal with request and response.  After we do all this, the error disappears and something is returned on the /admin/products URL.
    // async index({view, request, response}) {
    //     try {
    //         // This is currently not being used for anything other than assigning a value to the post const variable.
    //         const post = request.post();
    //         await Database.raw(
    //             `SELECT * FROM products;`
    //         );
            
    //         return view.render('admin/products/all');
    //     } catch (error) {
    //         console.log(error);

    //         return response.redirect('back');
    //     }
    // }
    // Now we will change this index() method to see exactly what is being returned by this method.
    // async index({view, request, response}) {
    //     try {
    //         // Whatever we are getting back from the Database.raw() method, we are putting into the allProducts const variable.
    //         const allProducts = await Database.raw(
    //             `SELECT * FROM products;`
    //         );
            
    //         return allProducts[0];
    //         // return view.render('admin/products/all');
    //     } catch (error) {
    //         console.log(error);

    //         return response.redirect('back');
    //     }
    // }
    // Here we are going to send the data to the view.  We are rendering the all edge template in the admin/products/ directory.
    // async index({view, request, response}) {
    //     try {
    //         let allProducts = await Database.raw(
    //             `SELECT * FROM products;`
    //         );
            
    //         // We are doing this because we only care about the result of the first element in the allProducts[].  This will give us a single [] with a single {} for each product.
    //         allProducts = allProducts[0];
            
    //         // Here we are going to pass in an {} with the allProducts variable as the property.  This will give us access to the allProducts variable when we are rendering the all edge template in the admin/products/ directory.  We changed the allProducts variable from a const to a regular variable.
    //         return view.render('admin/products/all', {allProducts});
    //     } catch (error) {
    //         console.log(error);

    //         return response.redirect('back');
    //     }
    // }
    // Here we pasted a SELECT statement that we created in MySQL Workbench.  We created this in order to also add the brand of the product and the name of the user who inserted the product.  Before this, we did not have these two columns because they are in the brands table and the users table, but not in the products table.
    // Here we merged three tables with inner joins.  This is a one to many relationship.  We have one products table and it has a one to many relationship with the brands table and a one to many relationship with the users table.
    async index({view, request, response}) {
        try {
            let allProducts = await Database.raw(
                `SELECT products.id, products.title, products.sku, brands.title AS brand, CONCAT(users.f_name, ' ', users.l_name) AS user, products.material, products.qty, products.size, products.user_id, products.created_at
                FROM products
                INNER JOIN brands
                ON products.brand_id = brands.id
                INNER JOIN users
                ON products.user_id = users.id
                ORDER BY created_at ASC;`
            );
            
            // return allProducts;
            allProducts = allProducts[0];
            // return allProducts;
            // We are doing this for now just so that we can see the result of our MySQL statement above really quickly in {} form.  This is going to return an [] with many {}s, which will contain a product each.  We will comment this out because it was just meant to be temporary.
            // return allProducts;

            return view.render('admin/products/all', {allProducts});
        } catch (error) {
            console.log(error);

            return response.redirect('back');
        }
    }

    // Here we will handle a POST request sent to the /admin/products URL.  This will take the data in the form in the /admin/products/create URL and put it into an {} with the _csrf, title, sku, material, qty, and description properties and send this data to the server to the /admin/products URL.  We have to do more work in order to get the form saved to our MySQL database.
    // Here we are passing in an {}, with the request and the response to the store() method.  This method will return the request.post() method, at first, but then we will modify it.  This is all part of the AdonisJS framework.
    // Here we also added the Database.raw() method in order to finally insert the form data into our MySQL database.
    // store({request, response}) {
    //     // Here we are assigning the result of the request.post() method to the post const variable.  The result will be an {} with all of the form data that we want to put inside of our MySQL database.
    //     const post = request.post();
    //     // Here we are running a raw query and then using a Promise by using the .then() f() and then passing in a f() to the .then() f(). 
    //     // We put a 1 for the brand_id and the user_id because we have not set up a way to handle these, yet.  We have to put these temporary values for now because these columns are required and the brand_id and user_id columns are also foreign keys.  We are also going to manually enter some values using MySQL Workbench in the sneakers_ims.brands table, for now.  For the title, we will enter Nike.  For the description, we will enter Just do it.  For the user_id, we will enter 1.  Then  we will click apply.  Joe got an error when he tried to apply these changes, so I did not click apply.  So we went to the sneakers_ims.users table to try to make changes to that one.  I think we needed to create a user because doing changes to the previous table seems to have required this.  For the f_name, we will enter joe.  For the l_name, we will enter santos.  For the email, we will enter joesantosgarcia@gmail.com.  For the phone_number, we will enter 3472934455.  For the birth_date, we will enter 12-03-1987.  Then Joe clicked apply, but he got an error because the date was entered incorrectly.  Joe originally entered 12-03-1987, which is not using the correct date format, and changed it to 1987-12-03, which is using the correct date format.  Then Joe clicked apply and created the new user.  Now Joe pressed apply to the changes he made to the sneakers_ims.brands table and did not get an error this time.  The problem he originally had is that the sneakers_ims.brands table is using the user_id column as a foreign key.  If the user does not exist, we will get an error when trying to apply changes to the sneakers_ims.brands table.  If the user does not exist in the sneakers_ims.users table, then you will be unable to apply changes to the sneakers_ims.brands table.
    //     // We had to change the size field to 1 because there is no size field in the form, so it was being left empty.  This was causing an error of undefined for the size field and our data was not being saved to the sneakers_ims.products table.
    //     // We decided to put all of the placeholders for '' values into ''s.
    //     // We had to change the brand_id to 2 because that's what Joe had in the sneaker_ims.brands table. The brand_id column with a value of 1 does not exist.  Before making the change, we had an error, but now the form was submitted and the database was updated.  I had an error with the quantity entered because the number was too large, so I lowered it and everything worked fine.
    //     Database.raw(
    //         `INSERT INTO products (title, sku, material, description, brand_id, qty, size, user_id)
    //         VALUES ('${post.title}', '${post.sku}', '${post.material}', '${post.description}', 2, ${post.qty}, 1, 1);`
    //     // After we do the raw MySQL query, we will return the response, at first, but then we will console.log() the response.
    //     ).then(response => console.log(response));
        
    //     // After the raw query is performed and the response is logged, we will output the 'Saved Success!' to the page the user is taken to.
    //     return 'Saved Success!';

    //     // return request.post();   
    // }
    // We are going to clean up the store() method above.  If there is an error, we will send the user back to the form.  If there is no error, we will return the "Saved Success!".  We will have to do several changes in order to do this.
    // We are going to turn the store() method into an async f() and put its content inside of a try...catch statement.  I also noticed that Joe removed the .then() f() after the Database.raw() method.
    // We are going to try to do what is inside of the try statement.  We are going to pass in a potential error to the catch statement.  If there is an error, we are going to console.log() it.  If everything went well, we want the try statement to return the <h1> with the "Saved Successfully!" in green.
    // We changed the brand_id in the Database.raw() method below to 1 because we want to see an error.
    // We put the await keyword in front of the Database.raw() method.
    // What this is all doing below is that this is an async f(), so it will return a Promise.  We will try to do what is inside of the try statement.  We will wait until the Database.raw() method returns back a Promise.  If a Promise is successfully returned, the return statement in the try statement will get executed.  The user will get sent to the /admin/products page with a message displaying the "Saved Successfully!" inside of an <h1> and the text color will be green.  If the Database.raw() method is returning back an error, then the catch statement is going to be executed.  The catch statement is going to catch the error, console.log() it, and return a message with the error on the /admin/products page that the user is sent to.  Part of the message will be in an <h1> with red text.  The other part of the message will be inside of an <h3> and it will be the actual error that is displayed in the console.log() in the sqlMessage portion of it.
    // After seeing many errors on purpose, we changed the brand_id back to 2, from 1, so that we would not get an error and we also decided to change the qty to 2, from ${post.qty}.
    // We have basically set up everything that we need in order to submit data into the sneakers_ims.products table.  Joe wants to go back and fix several things.
    // async store({request, response}) {
    //     try {
    //         const post = request.post();
    //         await Database.raw(
    //             `INSERT INTO products (title, sku, material, description, brand_id, qty, size, user_id)
    //             VALUES ('${post.title}', '${post.sku}', '${post.material}', '${post.description}', 2, 2, 1, 1);`
    //         );

    //         return `<h1 style="color: green">Saved Successfully!</h1>`;
    //     } catch (error) {
    //         console.log(error);

    //         return `<h1 style="color: red">There was an error:</h1>
    //             <h3>${error.sqlMessage}</h3>`;
    //     }   
    // }
    // We are going to sanitize all of the input from the user in the form.  We are doing this in order to avoid SQL Injection attacks.  We are going to do this by using the sanitize.escape() method on many of the values that are input by the user.  We put the brand_id and the user_id inside of a parseInt() f() to be extra safe and make sure that the value of the variable will be an integer for each one.  The sanitize.escape() method and the parseInt() f() will make sure that there will never be any SQL Injections sent to our database.  We also removed the quotes from the placeholders because we no longer need to get these values returned to us as ''s since the sanitize.escape() method will do this automatically.  The sanitize.escape() method will also return integers and floats correctly, like it did for us with the qty and the size columns, respectively.
    // async store({request, response}) {
    //     try {
    //         const post = request.post();
    //         await Database.raw(
    //             `INSERT INTO products (title, sku, material, description, brand_id, qty, size, user_id)
    //             VALUES (${sanitize.escape(post.title)},
    //                 ${sanitize.escape(post.sku)},
    //                 ${sanitize.escape(post.material)},
    //                 ${sanitize.escape(post.description)},
    //                 ${parseInt(2)},
    //                 ${sanitize.escape(post.qty)},
    //                 ${sanitize.escape(post.size)},
    //                 ${parseInt(1)});`
    //         );

    //         return `<h1 style="color: green">Saved Successfully!</h1>`;
    //     } catch (error) {
    //         console.log(error);

    //         return `<h1 style="color: red">There was an error:</h1>
    //             <h3>${error.sqlMessage}</h3>`;
    //     }   
    // }
    // Instead of just having a "Saved Successfully!" message, or an error message, and sending the user to the URL where the form was submitted to, we want to change this.  We want to have the user redirected to the page that has all of the products, or back to the form, depending on if the form was successfully submitted, or not, respectively.
    async store({request, response}) {
        try {
            const post = request.post();
            await Database.raw(
                `INSERT INTO products (title, sku, img_url, material, description, brand_id, qty, size, user_id)
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
            
            // Here the user will be redirected to the section where all of the products are shown if the form was successfully submitted.
            return response.redirect('/admin/products');
        } catch (error) {
            console.log(error);

            // If there is an error, we will redirect the user back to the form.
            return response.redirect('back');

            // return `<h1 style="color: red">There was an error:</h1>
            //     <h3>${error.sqlMessage}</h3>`;
        }   
    }

    // Joe had an error because he forgot to turn this into an async f().  Whenever we use await inside of a f(), we have to turn that f() into an async f().
    async create({view, request, response}) {
        // We copied this from the edit() method below.  We are going to use this to populate the options for the select element in the Brands section of the page used to create a new product.
        let brands = await Database.raw(
            `SELECT * FROM brands
            ORDER BY brands.title ASC;`
        );
        brands = brands[0];

        // Here we are going to render the create.edge file in the admin/products folder.
        return view.render('admin/products/create', {brands});
    }

    // show({view, request, response}) {
    //     // Here we are going to render the show.edge file in the admin/products folder.
    //     return view.render('admin/products/show');
    // }
    // Here we are going to turn the show() method into an async f() and add to it.  We put a new property, params, in the {} inside of the show() method's argument.  This property will give us access to the :id variable, the route parameter.
    async show({view, request, response, params}) {
        // This is just temporary and to show us the :id route parameter.  As soon as we land on the /admin/products/:id page, it is going to return to us an {} with a property that is going to be called id and its value.  The id property and its value are coming from the route parameter :id.
        // return params;

        try {
            // Joe decided to include LIMIT 1 because even though we are currently searching by id, and the ids are all unique, we may later decide to search by title, or something else, that might not be unique, and we only want to return one product to the show page.
            // We had to add the products.img_url column and the products.description column to this MySQL query because we were getting undefined for the image and the description on the product show page, since the two columns were not originally included.
            let product = await Database.raw(
                `SELECT products.id, products.title, products.sku, products.img_url, products.description, brands.title AS brand, CONCAT(users.f_name, ' ', users.l_name) AS user, products.material, products.qty, products.size, products.user_id, products.created_at
                FROM products
                INNER JOIN brands
                ON products.brand_id = brands.id
                INNER JOIN users
                ON products.user_id = users.id
                WHERE products.id = ${params.id}
                ORDER BY created_at ASC
                LIMIT 1;`
            );

            // This is just temporary and Joe is using it to show us what is inside of product.  This will return an a multidimensional [].  The first element will be an [] with an {} that contains the product that was selected through the :id.  The second element will be an [] with many {}s that contain extra information that we are not interested in.
            // If you enter a route parameter that does not correspond to a value in the database, you will get an empty [] where you expect the {} with the results to be.  I was entering an id of 9, like Joe, but currently the highest id column value in the products table in my database is just 8, so the first [], the one that we are interested in, was coming up empty.
            // return product;
            // Joe said that what we really want is the {} inside of the first [], which is what we are returning here.
            // return product[0][0];
            
            // We only want the first element of the multidimensional [], which will be an [] with an {} that contains the product that we want.  The [] with multiple {}s that we are excluding has extra information that we are not interested in.
            // product = product[0];
            // Joe said that what we really want is the {} inside of the first [], which is what we are getting here.  This is how we return it back from Next.js and AdonisJS.
            product = product[0][0];

            return view.render('admin/products/show', {product});
        } catch (error) {
            console.log(error);

            return response.redirect('back');
        }
    }

    // edit({view, request, response}) {
    //     // Here we are going to render the edit.edge file in the admin/products folder.
    //     return view.render('admin/products/edit');
    // }
    // The edit page is not just very similar to the create page, but also very similar to the show page and the show() method in this ProductController class.  We are going to copy everything in the show() method and paste it in this edit() method.
    // Joe forgot to add the params property to the {} in the edit() method's argument, so he was getting an error of params being undefined when he started connecting the database with the edit page.  He was not even able to get to the edit page and would be sent back to a different page.
    // We also changed this edit() method to an async f().  We had to do this because we are a using try...catch statement, which is an ES6 thing.
    // We had to add the products.brand_id to the MySQL query below so that we could use it in the the edit.edge file and show the selected product, instead of the default of Adidas, in the Brands menu.
    async edit({view, request, response, params}) {
        try {
            let product = await Database.raw(
                `SELECT products.id, products.title, products.sku, products.img_url, products.description, brands.title AS brand, CONCAT(users.f_name, ' ', users.l_name) AS user, products.material, products.qty, products.size, products.user_id, products.brand_id, products.created_at
                FROM products
                INNER JOIN brands
                ON products.brand_id = brands.id
                INNER JOIN users
                ON products.user_id = users.id
                WHERE products.id = ${params.id}
                ORDER BY created_at ASC
                LIMIT 1;`
            );
            product = product[0][0];
            
            // We are doing this so that we can populate the product's show page select element's options in the brands section with the data contained in the sneakers_ims.brands. 
            let brands = await Database.raw(
                `SELECT * FROM brands
                ORDER BY brands.title ASC;`
            );
            // return brands;
            brands = brands[0];
            // return brands;

            return view.render('admin/products/edit', {product, brands});
        } catch (error) {
            console.log(error);

            return response.redirect('back');
        }
    }

    // We are copying everything from the store() method in here because inserting and updating are very similar.  After this, we also modified it.  We are also turning this into an async f().  We also brought in the params property.
    async update({request, response, params}) {
        try {
            // Here we are creating a new variable that was not in the store() method.
            const id = params.id;

            const post = request.post();
            
            // We changed this MySQL query from an INSERT statement to an UPDATE statement.
            // We really messed up the data in the sneakers_ims.products because we did not use a WHERE clause.  Since we did not use a WHERE clause, we changed all of the products, rows, in the sneakers_ims.products.  Joe did this on purpose just to show this to us.  We have to remember to use a WHERE clause, or we will ruin the table that we are trying to update because every row will be changed.  We have to come back to the MySQL statement below and put a WHERE clause right at the end and we have to be very specific with the row, or rows, that we want to change in that clause.
            await Database.raw(
                `UPDATE products
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
            
            // Here we are taking the user back to the product show page when the product is updated.
            return response.redirect(`/admin/products/${id}`);
        } catch (error) {
            console.log(error);

            return response.redirect('back');
        }
    }

    // Here we are going to delete the products.  We did not turn this into an async f() at first, so we were getting a syntax error.  This was happening because when we use await inside of a f(), we have to turn the f() into an async f().  The next error we had was a reference error of params is not defined.  This was happening because we forgot to include the params property inside of the {} in the delete() method's argument.
    async delete({request, response, params}) {
        const id = params.id;

        try {
            await Database.raw(
                `DELETE FROM products
                WHERE id = ${id};`
            )

            return response.redirect('/admin/products');
        } catch (error) {
            console.log(error);

            return response.redirect('back');
        }
    }
}

module.exports = ProductController