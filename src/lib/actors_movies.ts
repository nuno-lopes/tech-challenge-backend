import { knex } from '../util/knex'
import { Movie } from './movies'

export function list(actorId: number): Promise<Movie[]> {
    return knex.from('actor_movie')
                .join('movie', 'actor_movie.movieId', 'movie.id')
                .select('movie.name', 'movie.synopsis', 'movie.releasedAt', 'movie.runtime')
                .where({ actorId });
}

/** @returns the ID that was created */
export async function create(actorId: number, movieId: number): Promise<void> {
    await (knex.into('actor_movie').insert({ actorId, movieId }))
}

