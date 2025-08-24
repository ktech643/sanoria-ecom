import knex from "knex";
import knexConfig from "../../knexfile.js";
import bcrypt from "bcrypt";

const db = knex(knexConfig);

export async function migrateAndSeed() {
  // Users
  const hasUsers = await db.schema.hasTable("users");
  if (!hasUsers) {
    await db.schema.createTable("users", (t) => {
      t.increments("id").primary();
      t.string("name");
      t.string("email").unique().notNullable();
      t.string("password_hash").notNullable();
      t.boolean("is_admin").defaultTo(false);
      t.timestamps(true, true);
    });
  }

  // Products
  const hasProducts = await db.schema.hasTable("products");
  if (!hasProducts) {
    await db.schema.createTable("products", (t) => {
      t.increments("id").primary();
      t.string("name").notNullable();
      t.text("description");
      t.decimal("price", 10, 2).notNullable();
      t.integer("stock").defaultTo(0);
      t.string("skin_type");
      t.integer("views").defaultTo(0);
      t.boolean("is_new").defaultTo(false);
      t.boolean("is_promo").defaultTo(false);
      t.timestamps(true, true);
    });
  }

  // Orders
  const hasOrders = await db.schema.hasTable("orders");
  if (!hasOrders) {
    await db.schema.createTable("orders", (t) => {
      t.increments("id").primary();
      t.integer("user_id").references("id").inTable("users");
      t.string("status").defaultTo("pending");
      t.decimal("total", 10, 2).notNullable();
      t.string("payment_method");
      t.string("shipping_courier");
      t.timestamps(true, true);
    });
  }

  // Order Items
  const hasOrderItems = await db.schema.hasTable("order_items");
  if (!hasOrderItems) {
    await db.schema.createTable("order_items", (t) => {
      t.increments("id").primary();
      t.integer("order_id").references("id").inTable("orders").onDelete("CASCADE");
      t.integer("product_id").references("id").inTable("products");
      t.integer("quantity").notNullable();
      t.decimal("price", 10, 2).notNullable();
    });
  }

  // Cart
  const hasCart = await db.schema.hasTable("carts");
  if (!hasCart) {
    await db.schema.createTable("carts", (t) => {
      t.increments("id").primary();
      t.integer("user_id").references("id").inTable("users");
      t.timestamps(true, true);
    });
  }
  const hasCartItems = await db.schema.hasTable("cart_items");
  if (!hasCartItems) {
    await db.schema.createTable("cart_items", (t) => {
      t.increments("id").primary();
      t.integer("cart_id").references("id").inTable("carts").onDelete("CASCADE");
      t.integer("product_id").references("id").inTable("products");
      t.integer("quantity").notNullable();
    });
  }

  // Wishlist
  const hasWishlist = await db.schema.hasTable("wishlists");
  if (!hasWishlist) {
    await db.schema.createTable("wishlists", (t) => {
      t.increments("id").primary();
      t.integer("user_id").references("id").inTable("users");
      t.integer("product_id").references("id").inTable("products");
      t.timestamps(true, true);
    });
  }

  // Reviews
  const hasReviews = await db.schema.hasTable("reviews");
  if (!hasReviews) {
    await db.schema.createTable("reviews", (t) => {
      t.increments("id").primary();
      t.integer("user_id").references("id").inTable("users");
      t.integer("product_id").references("id").inTable("products");
      t.integer("rating").notNullable();
      t.text("comment");
      t.timestamps(true, true);
    });
  }

  // Promotions
  const hasPromos = await db.schema.hasTable("promotions");
  if (!hasPromos) {
    await db.schema.createTable("promotions", (t) => {
      t.increments("id").primary();
      t.string("code").unique();
      t.string("title");
      t.text("description");
      t.decimal("discount_percent", 5, 2);
      t.dateTime("starts_at");
      t.dateTime("ends_at");
      t.timestamps(true, true);
    });
  }

  // Blogs
  const hasBlogs = await db.schema.hasTable("blogs");
  if (!hasBlogs) {
    await db.schema.createTable("blogs", (t) => {
      t.increments("id").primary();
      t.string("title");
      t.text("content");
      t.timestamps(true, true);
    });
  }

  // Notifications
  const hasNotifications = await db.schema.hasTable("notifications");
  if (!hasNotifications) {
    await db.schema.createTable("notifications", (t) => {
      t.increments("id").primary();
      t.integer("user_id").references("id").inTable("users");
      t.string("title");
      t.text("message");
      t.boolean("read").defaultTo(false);
      t.timestamps(true, true);
    });
  }

  // Seed initial admin
  const admin = await db("users").where({ email: process.env.ADMIN_EMAIL }).first();
  if (!admin) {
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await db("users").insert({
      name: "Admin",
      email: process.env.ADMIN_EMAIL,
      password_hash: passwordHash,
      is_admin: true,
    });
  }
}

if (process.argv[1] && process.argv[1].endsWith("migrations.js")) {
  migrateAndSeed().then(() => {
    console.log("Migrations and seed complete");
    process.exit(0);
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

