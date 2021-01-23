import { Server, Plugin } from '@hapi/hapi'
import { actorMovieRoutes } from './routes'

export const actor_movie: Plugin<void> = {
  name: 'actor_movie',
  version: '1.0.0',
  multiple: false,
  register: (server: Server, _options: void) => server.route(actorMovieRoutes)
}
