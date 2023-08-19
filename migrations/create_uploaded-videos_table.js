const { v4: uuidv4} = require("uuid");
exports.up = function (knex){
    return knex.schema.createTable('uploaded-videos', (table) => {
        table.uuid('id').primary();
        table.string('user').notNullable();
        table.string('description').notNullable();
        table.string('sites').notNullable();
        table.string('social-links').notNullable();
        table.timestamps(true, true)

    });
};


exports.down = function (knex) {
    return knex.schema.dropTable('uploaded-videos');
}
