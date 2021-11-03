'use strict'

// This is the migration for the brands table schema.

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BrandsSchema extends Schema {
  up () {
    // this.create('brands', (table) => {
    //   table.increments()
    //   table.timestamps()
    // })
    // We can set the description without NOT NULL so that we can leave it empty, if we want.  There has to be a title, so we set it to NOT NULL.
    this.raw(
      `CREATE TABLE brands(
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        user_id INT UNSIGNED NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );`
    );
  }

  down () {
    // this.drop('brands')
    this.raw(
      `DROP TABLE brands;`
    );
  }
}

module.exports = BrandsSchema
