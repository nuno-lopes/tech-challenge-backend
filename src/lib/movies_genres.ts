import { knex } from '../util/knex'
import { Genre } from './genres';
import { Movie } from './movies'

export function list(movieId: number): Promise<Genre[]> {
    return knex.from('movie_genre')
        .join('genre', 'movie_genre.genreId', 'genre.id')
        .select('genre.name')
        .where({ movieId });
}

/** @returns the ID that was created */
export async function create(movieId: number, genreId: number): Promise<void> {
    await (knex.into('movie_genre').insert({ movieId, genreId }))
}

