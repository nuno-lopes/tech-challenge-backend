import * as Knex from 'knex'


export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`
    CREATE TABLE movie_genre (
      movieId    INT(10) UNSIGNED NOT NULL,
      genreId    INT(10) UNSIGNED NOT NULL,

      CONSTRAINT PK_movie_genre__id PRIMARY KEY (movieId, genreId),
      CONSTRAINT FK_MovieGenre_Movie FOREIGN KEY (movieId) REFERENCES movie(id),
      CONSTRAINT FK_MovieGenre_Genre FOREIGN KEY (genreId) REFERENCES genre(id)
  );`)
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw('DROP TABLE movie_genre;')
}
