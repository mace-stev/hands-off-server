const { v4: uuidv4} = require("uuid");
exports.up = function (knex){
    return knex.schema.createTable('user-profile', (table) => {
        table.uuid('id').primary();
        table.string('obsPort');
        table.string('username').notNullable();
        table.string('social-links');
        table.string('#').notNullable();
        table.timestamps(true, true)

    });
};


exports.down = function (knex) {
    return knex.schema.dropTable('user-profile');
}
