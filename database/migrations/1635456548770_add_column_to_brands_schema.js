'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddColumnToBrandsSchema extends Schema {
  up () {
    // When creating this migration, Joe messed up and chose the option to create a table, instead of the one to select a table.  This does not matter because we will not be using the default f()s inside of the up() method and the down() method, since we will be using raw MySQL statements.
    this.raw(
      `ALTER TABLE brands
      ADD COLUMN img_url TEXT AFTER title;`
    );
  }

  down () {
    this.raw(
      `ALTER TABLE brands
      DROP COLUMN img_url;`
    );
  }
}

module.exports = AddColumnToBrandsSchema
