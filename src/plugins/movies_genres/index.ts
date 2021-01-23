import { Server, Plugin } from '@hapi/hapi'
import { movieGenreRoutes } from './routes'

export const movie_genre: Plugin<void> = {
  name: 'movie_genre',
  version: '1.0.0',
  multiple: false,
  register: (server: Server, _options: void) => server.route(movieGenreRoutes)
}
