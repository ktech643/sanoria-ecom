exports.up = async function(knex) {
  await knex.schema.createTable('users', (t) => {
    t.increments('id').primary();
    t.string('name');
    t.string('email').notNullable().unique();
    t.string('password_hash').notNullable();
    t.string('role').notNullable().defaultTo('customer');
    t.timestamps(true, true);
  });

  await knex.schema.createTable('categories', (t) => {
    t.increments('id').primary();
    t.string('name').notNullable();
    t.string('slug').notNullable().unique();
    t.string('skin_type');
    t.timestamps(true, true);
  });

  await knex.schema.createTable('products', (t) => {
    t.increments('id').primary();
    t.string('name').notNullable();
    t.string('slug').notNullable().unique();
    t.text('description');
    t.decimal('price', 10, 2).notNullable();
    t.integer('stock').notNullable().defaultTo(0);
    t.integer('category_id').references('id').inTable('categories').onDelete('SET NULL');
    t.string('image');
    t.integer('views').notNullable().defaultTo(0);
    t.timestamps(true, true);
  });

  await knex.schema.createTable('wishlists', (t) => {
    t.increments('id').primary();
    t.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
    t.integer('product_id').references('id').inTable('products').onDelete('CASCADE');
    t.unique(['user_id', 'product_id']);
    t.timestamps(true, true);
  });

  await knex.schema.createTable('orders', (t) => {
    t.increments('id').primary();
    t.integer('user_id').references('id').inTable('users');
    t.string('status').notNullable().defaultTo('pending');
    t.decimal('total', 10, 2).notNullable().defaultTo(0);
    t.string('payment_method');
    t.string('shipping_courier');
    t.json('shipping_address');
    t.timestamps(true, true);
  });

  await knex.schema.createTable('order_items', (t) => {
    t.increments('id').primary();
    t.integer('order_id').references('id').inTable('orders').onDelete('CASCADE');
    t.integer('product_id').references('id').inTable('products');
    t.integer('quantity').notNullable().defaultTo(1);
    t.decimal('price', 10, 2).notNullable();
  });

  await knex.schema.createTable('reviews', (t) => {
    t.increments('id').primary();
    t.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
    t.integer('product_id').references('id').inTable('products').onDelete('CASCADE');
    t.integer('rating').notNullable();
    t.text('comment');
    t.boolean('approved').notNullable().defaultTo(false);
    t.timestamps(true, true);
  });

  await knex.schema.createTable('promotions', (t) => {
    t.increments('id').primary();
    t.string('code').notNullable().unique();
    t.integer('discount_percent').notNullable();
    t.date('starts_at');
    t.date('ends_at');
    t.boolean('active').notNullable().defaultTo(true);
    t.timestamps(true, true);
  });

  await knex.schema.createTable('blog_posts', (t) => {
    t.increments('id').primary();
    t.string('title').notNullable();
    t.string('slug').notNullable().unique();
    t.text('content');
    t.boolean('published').notNullable().defaultTo(true);
    t.timestamps(true, true);
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('blog_posts');
  await knex.schema.dropTableIfExists('promotions');
  await knex.schema.dropTableIfExists('reviews');
  await knex.schema.dropTableIfExists('order_items');
  await knex.schema.dropTableIfExists('orders');
  await knex.schema.dropTableIfExists('wishlists');
  await knex.schema.dropTableIfExists('products');
  await knex.schema.dropTableIfExists('categories');
  await knex.schema.dropTableIfExists('users');
};
