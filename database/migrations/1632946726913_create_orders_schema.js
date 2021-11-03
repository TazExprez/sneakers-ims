'use strict'

// This is the migration for the orders table schema.

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateOrdersSchema extends Schema {
  up () {
    // this.create('create_orders', (table) => {
    //   table.increments()
    //   table.timestamps()
    // })
    // The user_id column tells us who created the order.  We removed the NOT NULL from the user_id because we were having issues when running the command adonis migration:refresh.
    this.raw(
      `CREATE TABLE orders(
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        f_name VARCHAR(200) NOT NULL,
        l_name VARCHAR(60) NOT NULL,
        address VARCHAR(100) NOT NULL,
        address_2 VARCHAR(100),
        city VARCHAR(100) NOT NULL,
        state VARCHAR(60) NOT NULL,
        country VARCHAR(3) NOT NULL DEFAULT 'USA',
        payment_type VARCHAR(60) NOT NULL DEFAULT 'paypal',
        user_id INT UNSIGNED NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );`
    );
  }
  // , CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES users(id)
  down () {
    // this.drop('create_orders')
    this.raw(
      `DROP TABLE orders;`
    );
  }
}

module.exports = CreateOrdersSchema

// The good thing about migrations is that you can always go back and do changes to your migration files.  Once you have a live website though, you have to create a new migration every single time that you want to do a big change, like adding a foreign key or dropping a column, things like that.  Once the tables already exist, you cannot run a migration refresh on them.  Joe will show us what a migration refresh is.