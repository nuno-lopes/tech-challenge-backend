import { genre } from '../plugins/genres';
import { knex } from '../util/knex'
import { Genre } from './genres'

export interface Actor {
    id: number
    name: string
    bio: string
    bornAt: Date
}

export function list(): Promise<Actor[]> {
    return knex.from('actor').select()
}

export function find(id: number): Promise<Actor> {
    return knex.from('actor').where({ id }).first()
}

export async function findFavoriteGenre(id: number): Promise<Genre> {
    return knex.from('actor')
        .join('actor_movie', 'actor_movie.actorId', 'actor.id')
        .join('movie_genre', 'actor_movie.movieId', 'movie_genre.movieId')
        .join('genre', 'genre.id', 'movie_genre.genreId')
        .select('genre.name')
        .where('actor.id', id)
        .orderByRaw('count(actor_movie.movieId) desc')
        .groupBy('genre.name')
        .first()
}

/** @returns whether the ID was actually found */
export async function remove(id: number): Promise<boolean> {
    const count = await knex.from('actor').where({ id }).delete()
    return count > 0
}

/** @returns the ID that was created */
export async function create(name: string, bio: string, bornAt: Date): Promise<number> {
    const [id] = await (knex.into('actor').insert({ name, bio, bornAt }))
    return id
}

/** @returns whether the ID was actually found */
export async function update(id: number, name: string, bio: string, bornAt: Date): Promise<boolean> {
    const count = await knex.from('actor').where({ id }).update({ name, bio, bornAt })
    return count > 0
}
