const { v4: uuidv4} = require("uuid");
exports.up = function (knex){
    return knex.schema.createTable('user-profile', (table) => {
        table.uuid('id').primary();
        table.string('obsPort').notNullable();
        table.string('obsUrl').notNullable();
        table.string('obsP').notNullable();
        table.string('social-links').notNullable();
        table.string('#').notNullable();
        table.timestamps(true, true)

    });
};


exports.down = function (knex) {
    return knex.schema.dropTable('user-profile');
}
