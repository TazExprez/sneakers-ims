'use strict'

// We are creating this migration to fix some things that we are missing from some tables.  We are missing several foreign keys in several tables.

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddForeignKeysSchema extends Schema {
  up () {
    // this.table('add_foreign_keys', (table) => {
    //   // alter table
    // })
    this.raw(
      `ALTER TABLE brands
      ADD CONSTRAINT fk_user_id_brands
      FOREIGN KEY (user_id) REFERENCES users(id);`
    );
    this.raw(
      `ALTER TABLE orders
      ADD CONSTRAINT fk_user_id_orders
      FOREIGN KEY (user_id) REFERENCES users(id);`
    );
    this.raw(
      `ALTER TABLE items
      ADD CONSTRAINT fk_user_id_items
      FOREIGN KEY (user_id) REFERENCES users(id);`
    );
    this.raw(
      `ALTER TABLE items
      ADD CONSTRAINT fk_brand_id_items
      FOREIGN KEY (brand_id) REFERENCES brands(id);`
    );
    this.raw(
      `ALTER TABLE items
      ADD CONSTRAINT fk_order_id_items
      FOREIGN KEY (order_id) REFERENCES orders(id);`
    );
  }

  down () {
    // this.table('add_foreign_keys', (table) => {
    //   // reverse alternations
    // })
    this.raw(
      `ALTER TABLE brands
      DROP FOREIGN KEY fk_user_id_brands;`
    );
    this.raw(
      `ALTER TABLE orders
      DROP FOREIGN KEY fk_user_id_orders;`
    );
    this.raw(
      `ALTER TABLE items
      DROP FOREIGN KEY fk_user_id_items;`
    );
    this.raw(
      `ALTER TABLE items
      DROP FOREIGN KEY fk_brand_id_items;`
    );
    this.raw(
      `ALTER TABLE items
      DROP FOREIGN KEY fk_order_id_items;`
    );
  }
}

module.exports = AddForeignKeysSchema

// The reason we were having issues is because we already had the foreign key name fk_user_id and it seems like we cannot really use the same one for different columns.  So we are going to give our own names to the foreign keys and each one will be different.  The format is going to be fk_columnName_id_tableName.  The tableName is the name of the table where the column is coming from.  This is the column that you are adding the foreign key to.  So the foreign key for the user_id column in the brands table is going to be named fk_user_id_brands.  Before we solved this, we were getting an error about not being able to write duplicate keys in the table.  Joe said that each foreign key needs to have a unique name.

// Joe recommends not to make changes to migration files once the application is in production because we can make many mistakes.  Joe said that it is better to do new migration files to make changes.