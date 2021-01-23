import { Plugin } from '@hapi/hapi'
import { health } from './health'
import { genre } from './genres'
import { movie } from './movies'
import { actor } from './actors'
import { actor_movie } from './actors_movies'

export const plugins: Plugin<void>[] = [
  health,
  genre,
  movie,
  actor,
  actor_movie
]
