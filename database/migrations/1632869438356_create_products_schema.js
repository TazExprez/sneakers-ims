'use strict'

// Here we are creating a new migration for the products table schema by typing adonis make:migration create_products_table in the terminal.  Joe said to try to be as specific as possible with the name because you may have 100s of migrations and this way others can tell what you are doing with a specific migration.  After typing this in, select the option Create table.  This will not create the table until you run this migration with Adonis.

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateProductsSchema extends Schema {
  up () {
    // this.create('create_products', (table) => {
    //   table.increments()
    //   table.timestamps()
    // })
    // We are going to use raw SQL statements here.  We used an unsigned int for the brand_id column.  This means that it is a number that is not negative.  The size column is going to be a float because we want to use decimal points for these so that we can have sizes like 9.5 and 12.5.
    this.raw(
      `CREATE TABLE products(
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        sku VARCHAR(60) NOT NULL,
        material VARCHAR(60) NOT NULL,
        description TEXT NOT NULL,
        brand_id INT UNSIGNED,
        qty INT UNSIGNED NOT NULL,
        size FLOAT UNSIGNED NOT NULL,
        user_id INT UNSIGNED NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );`
    );
  }

  down () {
    // this.drop('create_products')
    // If you are building this app in AdonisJS, you can simply use what is written, instead of using raw MySQL statements.  Since this is a MySQL course, we are using raw MySQL statements in order to learn MySQL better.
    this.raw(
      `DROP TABLE products;`
    );
  }
}

module.exports = CreateProductsSchema

// We make a migration for every database schema change, like altering a table.  AdonisJS will keep track of executed migrations and make sure that migrations are ran once.  Migrations are rolled back from the most recent.  We should avoid using rollback in production because we may lose data.  If we need to do a change, like add a column to a table, we should create a new migration to add the column.  If we do a rollback in production, we may drop a table and lose the data.

// Never make changes to a live website by editing the files directly, like we are doing here.  This is not a best practice.  As mentioned in the comment above, do a migration for making any changes, like altering a table.  Since we have not made any changes to the database, or really done anything or even inserted data, we have the option to go back into each migration file and change each one.  In this migration, Joe forgot to add a user_id column, so we will do that now.  We are also going to set several columns to NOT NULL.  We are also going to do some changes to other migrations.

// The adonis migration:reset command will do a rollback of all of our migrations.  Joe said that this basically resets all of our migrations and removes everything that we have done.  

// The adonis migration:refresh command will do a rollback of all of our migrations and then run them all again, starting with the first one.  Joe said that this basically resets everything to the beginning, before we even ran a migration, and then all of the migrations are ran again.  This is useful in a situation where we want to go all the way back to the beginning, before we even migrated the users table.  Then we want to run all of our migrations right after this.  We are going to run this command because we did many changes to our migrations and would like to create all of the tables again.