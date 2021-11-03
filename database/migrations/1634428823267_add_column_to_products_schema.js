'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddColumnToProductsSchema extends Schema {
  // This will be ran when we type adonis migration:run.
  up () {
    // Here we are adding the img_url column to the products table that will be located after the sku column.
    this.raw(`
      ALTER TABLE products
      ADD COLUMN img_url MEDIUMTEXT AFTER sku;
    `);
  }

  // This will be ran when we type adonis migration:rollback.
  down () {
    // Here we are removing the img_url from the products table.  This is done in case we want to rollback this migration and reverse the changes done to the products table in the up() method above. 
    this.raw(`
      ALTER TABLE products
      DROP COLUMN img_url;
    `);
  }
}

module.exports = AddColumnToProductsSchema
