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

import * as moviesGenres from '../../lib/movies_genres'
import { isHasCode } from '../../util/types'


interface ParamsId {
    id: number
}
const validateParamsId: RouteOptionsValidate = {
    params: joi.object({
        id: joi.number().required().min(1),
    })
}

interface PayloadMovieGenre {
    genreId: number
}
const validatePayloadMovieGenre: RouteOptionsResponseSchema = {
    payload: joi.object({
        genreId: joi.number().required().min(1),
    })
}

export const movieGenreRoutes: ServerRoute[] = [{
    method: 'GET',
    path: '/movies/{id}/genres',
    handler: getAllMovieGenres,
    options: { validate: validateParamsId },
},
{
    method: 'POST',
    path: '/movies/{id}/genres',
    handler: post,
    options: { validate: { ...validateParamsId, ...validatePayloadMovieGenre } },
}]

async function getAllMovieGenres(req: Request, _h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
    const { id } = (req.params as ParamsId)

    const found = await moviesGenres.list(id)
    return found || Boom.notFound()
}

async function post(req: Request, h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
    const { id } = (req.params as ParamsId)
    const { genreId } = (req.payload as PayloadMovieGenre)

    try {
        await moviesGenres.create(id, genreId)
        const result = {
            id,
            path: `${req.route.path.replace('{id}', id.toString())}/${genreId}`
        }
        return h.response(result).code(201)
    }
    catch (er: unknown) {
        if (!isHasCode(er) || er.code !== 'ER_DUP_ENTRY') throw er
        return Boom.conflict()
    }
}

