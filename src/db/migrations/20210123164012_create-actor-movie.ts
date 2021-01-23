import * as Knex from 'knex'


export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`
    CREATE TABLE actor_movie (
      actorId    INT(10) UNSIGNED NOT NULL,
      movieId    INT(10) UNSIGNED NOT NULL,

      CONSTRAINT PK_actor_movie__id PRIMARY KEY (actorId, movieId),
      CONSTRAINT FK_ActorMovie_Actor FOREIGN KEY (actorId) REFERENCES actor(id),
      CONSTRAINT FK_ActorMovie_Movie FOREIGN KEY (movieId) REFERENCES movie(id)
  );`)
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw('DROP TABLE actor_movie;')
}
