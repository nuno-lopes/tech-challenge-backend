import { script } from '@hapi/lab'
import { expect } from '@hapi/code'
import sinon from 'sinon'

export const lab = script()
const { beforeEach, before, after, afterEach, describe, it } = lab

import * as Hapi from '@hapi/hapi'
import { movie_genre as plugin } from './index'
import * as lib from '../../lib/movies_genres'

describe('plugin', () => describe('movieGenre', () => {
    const sandbox = Object.freeze(sinon.createSandbox())

    const isContext = (value: unknown): value is Context => {
        if (!value || typeof value !== 'object') return false
        const safe = value as Partial<Context>
        if (!safe.server) return false
        if (!safe.stub) return false
        return true
    }
    interface Context {
        server: Hapi.Server
        stub: Record<string, sinon.SinonStub>
    }
    interface Flags extends script.Flags {
        readonly context: Partial<Context>
    }

    before(async ({ context }: Flags) => {
        context.stub = {
            lib_get_all_movie_genres: sandbox.stub(lib, 'list'),
            lib_create: sandbox.stub(lib, 'create'),
        }

        // all stubs must be made before server starts
        const server = Hapi.server()
        await server.register(plugin)
        await server.start()
        context.server = server
    })

    beforeEach(({ context }: Flags) => {
        if (!isContext(context)) throw TypeError()

        context.stub.lib_get_all_movie_genres.rejects(new Error('test: provide a mock for the result'))
        context.stub.lib_create.rejects(new Error('test: provide a mock for the result'))
    })

    afterEach(() => sandbox.resetHistory())
    after(() => sandbox.restore())

    describe('GET /movies/:id/genres', () => {
        const paramId = 123
        const [method, url] = ['GET', `/movies/${paramId}/genres`]

        it('validates :id is numeric', async ({ context }: Flags) => {
            if (!isContext(context)) throw TypeError()
            const opts: Hapi.ServerInjectOptions = { method, url: 'not-a-number' }

            const response = await context.server.inject(opts)
            expect(response.statusCode).equals(400)
        })

        it('returns all movie genres', async ({ context }: Flags) => {
            if (!isContext(context)) throw TypeError()
            const opts: Hapi.ServerInjectOptions = { method, url }
            const anyResult = [{ 'any': 'result' }]
            context.stub.lib_get_all_movie_genres.resolves(anyResult)

            const response = await context.server.inject(opts)
            expect(response.statusCode).equals(200)

            sinon.assert.calledOnce(context.stub.lib_get_all_movie_genres)
            expect(response.result).equals(anyResult)
        })
    })

    describe('POST /movies/:id/genres', () => {
        const paramId = 123
        const [method, url] = ['POST', `/movies/${paramId}/genres`]
        
        it('validates :id is numeric', async ({ context }: Flags) => {
            if (!isContext(context)) throw TypeError()
            const opts: Hapi.ServerInjectOptions = { method, url: 'not-a-number' }

            const response = await context.server.inject(opts)
            expect(response.statusCode).equals(400)
        })

        it('validates payload is not empty', async ({ context }: Flags) => {
            if (!isContext(context)) throw TypeError()
            const payload = undefined
            const opts: Hapi.ServerInjectOptions = { method, url, payload }

            const response = await context.server.inject(opts)
            expect(response.statusCode).equals(400)
        })

        it('validates payload matches `movie_genre`', async ({ context }: Flags) => {
            if (!isContext(context)) throw TypeError()
            const payload = { 'some': 'object' }
            const opts: Hapi.ServerInjectOptions = { method, url, payload }

            const response = await context.server.inject(opts)
            expect(response.statusCode).equals(400)
        })

        it('returns HTTP 201, with the `id` and `path` to the row created', async ({ context }: Flags) => {
            if (!isContext(context)) throw TypeError()
            const payload = {
                'genreId': 123
            }

            const opts: Hapi.ServerInjectOptions = { method, url, payload }
            const anyResult = 123
            context.stub.lib_create.resolves(anyResult)

            const response = await context.server.inject(opts)
            expect(response.statusCode).equals(201)

            sinon.assert.calledOnceWithExactly(context.stub.lib_create, payload.genreId)
            expect(response.result).equals({
                id: anyResult,
                path: `/actors/${paramId}/movies/${payload.genreId}`
            })
        })

    })

}))
