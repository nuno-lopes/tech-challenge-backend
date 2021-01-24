import {
    ServerRoute,
    ResponseToolkit,
    Lifecycle,
    RouteOptionsValidate,
    Request,
    RouteOptionsResponseSchema
} from '@hapi/hapi'
import joi from 'joi'
import Boom from '@hapi/boom'

import * as actorsMovies from '../../lib/actors_movies'
import { isHasCode } from '../../util/types'


interface ParamsId {
    id: number
}
const validateParamsId: RouteOptionsValidate = {
    params: joi.object({
        id: joi.number().required().min(1),
    })
}

interface PayloadActorMovie {
    movieId: number,
    characterName: string
}
const validatePayloadActorMovie: RouteOptionsResponseSchema = {
    payload: joi.object({
        movieId: joi.number().required().min(1),
        characterName: joi.string().required(),
    })
}

export const actorMovieRoutes: ServerRoute[] = [{
    method: 'GET',
    path: '/actors/{id}/movies',
    handler: getAllActorMovies,
    options: { validate: validateParamsId },
},
{
    method: 'POST',
    path: '/actors/{id}/movies',
    handler: post,
    options: { validate: { ...validateParamsId, ...validatePayloadActorMovie } },
},
{
    method: 'GET',
    path: '/actors/{id}/movies/characterNames',
    handler: getAllActorCharacterNames,
    options: { validate: validateParamsId },
}]

async function getAllActorMovies(req: Request, _h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
    const { id } = (req.params as ParamsId)

    const found = await actorsMovies.list(id)
    return found || Boom.notFound()
}

async function getAllActorCharacterNames(req: Request, _h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
    const { id } = (req.params as ParamsId)

    const found = await actorsMovies.listCharacterNames(id)
    return found || Boom.notFound()
}

async function post(req: Request, h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
    const { id } = (req.params as ParamsId)
    const { movieId, characterName } = (req.payload as PayloadActorMovie)

    try {
        await actorsMovies.create(id, movieId, characterName)
        const result = {
            id,
            path: `${req.route.path.replace('{id}', id.toString())}/${movieId}`
        }
        return h.response(result).code(201)
    }
    catch (er: unknown) {
        if (!isHasCode(er) || er.code !== 'ER_DUP_ENTRY') throw er
        return Boom.conflict()
    }
}

