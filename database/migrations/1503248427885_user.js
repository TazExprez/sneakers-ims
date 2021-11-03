'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  // When you type adonis migration:run, the up() method is what is ran.
  up () {
    // We are using the Knex.js SQL query builder that is included in AdonisJS.  Instead of writing knex.schema.raw, we can simply write this.raw because this is all being passed in by the UserSchema class.  Then we can just pass in any SQL statement that we want.
    // this.raw("SET sql_mode='TRADITIONAL'");
    // this.create('users', (table) => {
    //   table.increments()
    //   table.string('username', 80).notNullable().unique()
    //   table.string('email', 254).notNullable().unique()
    //   table.string('password', 60).notNullable()
    //   table.timestamps()
    // })
    // Here we will write the users table above, but will use raw SQL statements instead.
    // We set the user_id column in other tables to INT UNSIGNED NOT NULL, just like in the users table.  NOT NULL does not need to be written when using PRIMARY KEY because they already have this by default.  Joe probably did this so that the user_id columns in other tables, which will reference the users(id), would all be INT UNSIGNED NOT NULL.
    this.raw(
      `CREATE TABLE users(
        id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        f_name VARCHAR(60) NOT NULL,
        l_name VARCHAR(60) NOT NULL,
        email VARCHAR(60) NOT NULL UNIQUE,
        phone_number VARCHAR(20) NOT NULL,
        birth_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );`
    );
  }

  // When you type adonis migration:rollback, the down() is what is ran.  This is used in case you made a mistake in the table above.  Instead of deleting the table above manually, you can use this and can always rollback on the changes that you did.  Since we just created a table in the up() method above, our down() method will be simple and just drop the users table.  You can also drop the users table using the this.raw() with a SQL statement.
  down () {
    // this.drop('users')
    // We are going to drop the users table using raw SQL statements.  When you drop a table you lose all of the data in that table, so make sure that you do not do this randomly.
    this.raw(
      `DROP TABLE users;`
    );
  }
}

module.exports = UserSchema
