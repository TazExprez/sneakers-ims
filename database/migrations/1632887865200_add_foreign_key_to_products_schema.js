'use strict'

// Here we are creating a migration to alter the products table.  We are going to add a foreign key to the products table.  We when wrote adonis make:migration, we chose the Select table option.  We did not add a foreign key in the earlier migration in which we created the products table because the brands table was not created yet, so we would have received an error.  In order for us to have a foreign key referencing a table, we must have created that table first.  After the table that will be referenced is created, it is fine for us to create the foreign key that will reference it. 

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddForeignKeyToProductsSchema extends Schema {
  up () {
    // this.table('add_foreign_key_to_products', (table) => {
    //   // alter table
    // })
    // Here we wrote a MySQL statement in order to add a foreign key to the products table.
    // this.raw(
    //   `ALTER TABLE products
    //   ADD FOREIGN KEY (brand_id) REFERENCES brands(id);`
    // );
    // Here we are naming the foreign key.
    // this.raw(
    //   `ALTER TABLE products
    //   ADD CONSTRAINT brand_id
    //   FOREIGN KEY (brand_id) REFERENCES brands(id);`
    // );
    // this.raw(
    //   `ALTER TABLE products
    //   ADD CONSTRAINT brand_id
    //   FOREIGN KEY (brand_id) REFERENCES brands(id),
    //   ADD CONSTRAINT user_id
    //   FOREIGN KEY (user_id) REFERENCES users(id);`
    // );
    // In the following two raw() methods, we split the single raw() method above.
    this.raw(
      `ALTER TABLE products
      ADD CONSTRAINT fk_brand_id_products
      FOREIGN KEY (brand_id) REFERENCES brands(id);`
    );
    this.raw(
      `ALTER TABLE products
      ADD CONSTRAINT fk_user_id_products
      FOREIGN KEY (user_id) REFERENCES users(id);`
    );
  }

  down () {
    // this.table('add_foreign_key_to_products', (table) => {
    //   // reverse alternations
    // })
    // Here we are removing the foreign key from the brand_id column.  This is in case we want to do a rollback.  If we do, we can rollback through this.  Since we did not name the foreign key, a default name of products_ibfk_1 was given to it.  We had to change the foreign key below from book_id to products_ibfk_1.  We did this so that the rollback would work and not give us any errors.
    // this.raw(
    //   `ALTER TABLE products
    //   DROP FOREIGN KEY products_ibfk_1;`
    // );
    // Here we are removing the named foreign key from the brand_id column.
    this.raw(
      `ALTER TABLE products
      DROP FOREIGN KEY fk_brand_id_products;`
    );
    // Here we are removing the named foreign key from the user_id column.
    this.raw(
      `ALTER TABLE products
      DROP FOREIGN KEY fk_user_id_products;`
    );
  }
}

module.exports = AddForeignKeyToProductsSchema
