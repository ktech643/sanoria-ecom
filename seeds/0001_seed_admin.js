const bcrypt = require('bcryptjs');

exports.seed = async function seed(knex) {
  // Ensure no duplicate admin
  await knex('users').where({ email: 'abcd@gmail.com' }).del();
  const hash = await bcrypt.hash('11223344', 10);
  await knex('users').insert({
    name: 'Admin',
    email: 'abcd@gmail.com',
    password_hash: hash,
    role: 'admin',
  });
};

