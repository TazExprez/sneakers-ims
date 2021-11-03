'use strict'

// This is the migration for the items table schema.

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateItemsSchema extends Schema {
  up () {
    // this.create('create_items', (table) => {
    //   table.increments()
    //   table.timestamps()
    // })
    // We are adding the foreign key by writing CONSTRAINT order_id FOREIGN KEY (order_id) REFERENCES orders(id).  This will allow us to name the foreign key and define it on multiple lines.
    this.raw(
      `CREATE TABLE items(
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        sku VARCHAR(60) NOT NULL,
        material VARCHAR(60) NOT NULL,
        description TEXT NOT NULL,
        brand_id INT UNSIGNED,
        qty INT UNSIGNED,
        size FLOAT UNSIGNED,
        order_id INT UNSIGNED NOT NULL,
        user_id INT UNSIGNED NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );`
    );
  }
// ,
// CONSTRAINT order_id FOREIGN KEY (order_id) REFERENCES orders(id),
// CONSTRAINT brand_id FOREIGN KEY (brand_id) REFERENCES brands(id)
  down () {
    // this.drop('create_items')
    this.raw(
      `DROP TABLE items;`
    );
  }
}

module.exports = CreateItemsSchema
