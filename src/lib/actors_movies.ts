import { knex } from '../util/knex'
import { Movie } from './movies'

export function list(actorId: number): Promise<Movie[]> {
    return knex.from('actor_movie')
        .join('movie', 'actor_movie.movieId', 'movie.id')
        .select('movie.name', 'movie.synopsis', 'movie.releasedAt', 'movie.runtime')
        .where({ actorId });
}

export function listCharacterNames(actorId: number): Promise<string[]> {
    return knex.from('actor_movie')
        .select('characterName')
        .where({ actorId });
}

/** @returns the ID that was created */
export async function create(actorId: number, movieId: number, characterName: string): Promise<void> {
    await (knex.into('actor_movie').insert({ actorId, movieId, characterName }))
}

