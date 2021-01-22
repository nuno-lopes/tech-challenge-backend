import * as Knex from 'knex'


export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`
    CREATE TABLE movie (
      id    INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
      name  VARCHAR(50) NOT NULL,
      synopsis VARCHAR(200),
      releasedAt DATE NOT NULL,
      runtime INTEGER NOT NULL,

      CONSTRAINT PK_movie__id PRIMARY KEY (id)
  );`)
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw('DROP TABLE movie;')
}
