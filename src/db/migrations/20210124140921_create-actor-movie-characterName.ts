import * as Knex from 'knex'


export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`
    ALTER TABLE actor_movie
    ADD characterName VARCHAR(50)
  ;`)
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw('ALTER TABLE actor_movie DROP COLUMN characterName;')
}
