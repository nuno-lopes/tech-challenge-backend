import { script } from '@hapi/lab'
import { expect } from '@hapi/code'
import sinon from 'sinon'

export const lab = script()
const { beforeEach, before, after, afterEach, describe, it } = lab

import { list, create } from './movies_genres'
import { knex } from '../util/knex'

describe('lib', () => describe('movieGenre', () => {
    const sandbox = Object.freeze(sinon.createSandbox())

    const isContext = (value: unknown): value is Context => {
        if (!value || typeof value !== 'object') return false
        const safe = value as Partial<Context>
        if (!safe.stub) return false
        return true
    }
    interface Context {
        stub: Record<string, sinon.SinonStub>
    }
    interface Flags extends script.Flags {
        readonly context: Partial<Context>
    }

    before(({ context }: Flags) => {
        context.stub = {
            knex_from: sandbox.stub(knex, 'from'),
            knex_select: sandbox.stub(knex, 'select'),
            knex_where: sandbox.stub(knex, 'where'),
            knex_first: sandbox.stub(knex, 'first'),
            knex_delete: sandbox.stub(knex, 'delete'),
            knex_into: sandbox.stub(knex, 'into'),
            knex_insert: sandbox.stub(knex, 'insert'),
            knex_update: sandbox.stub(knex, 'update'),
            knex_join: sandbox.stub(knex, 'join'),
            console: sandbox.stub(console, 'error'),
        }
    })

    beforeEach(({ context }: Flags) => {
        if (!isContext(context)) throw TypeError()

        context.stub.knex_from.returnsThis()
        context.stub.knex_select.returnsThis()
        context.stub.knex_where.returnsThis()
        context.stub.knex_first.returnsThis()
        context.stub.knex_into.returnsThis()
        context.stub.knex_join.returnsThis()
        context.stub.knex_delete.rejects(new Error('test: expectation not provided'))
        context.stub.knex_insert.rejects(new Error('test: expectation not provided'))
        context.stub.knex_update.rejects(new Error('test: expectation not provided'))
    })

    afterEach(() => sandbox.resetHistory())
    after(() => sandbox.restore())

    describe('list', () => {

        it('returns movie genres', async ({ context }: Flags) => {
            if (!isContext(context)) throw TypeError()
            const anyId = 123

            await list(anyId)
            sinon.assert.calledOnceWithExactly(context.stub.knex_from, 'movie_genre')
            sinon.assert.calledOnceWithExactly(context.stub.knex_join, 'genre')
            sinon.assert.calledOnceWithExactly(context.stub.knex_where, { id: anyId })
            sinon.assert.calledOnce(context.stub.knex_select)
        })

    })

    describe('create', () => {

        it('insert one row into table `movie_genre`', async ({ context }: Flags) => {
            if (!isContext(context)) throw TypeError()
            const anyMovieId = 123
            const anyGenreId = 456
            context.stub.knex_insert.resolves([])

            await create(anyMovieId, anyGenreId)
            sinon.assert.calledOnceWithExactly(context.stub.knex_into, 'movie_genre')
            sinon.assert.calledOnceWithExactly(context.stub.knex_insert, { movieId: anyMovieId, genreId: anyGenreId })
        })
    })

}))
