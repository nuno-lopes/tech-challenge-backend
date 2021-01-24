import { script } from '@hapi/lab'
import { expect } from '@hapi/code'
import sinon from 'sinon'

export const lab = script()
const { beforeEach, before, after, afterEach, describe, it } = lab

import { list, create, listCharacterNames } from './actors_movies'
import { knex } from '../util/knex'

describe('lib', () => describe('actorMovie', () => {
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

        it('returns actor movies', async ({ context }: Flags) => {
            if (!isContext(context)) throw TypeError()
            const anyId = 123

            await list(anyId)
            sinon.assert.calledOnceWithExactly(context.stub.knex_from, 'actor_movie')
            sinon.assert.calledOnceWithExactly(context.stub.knex_join, 'movie')
            sinon.assert.calledOnceWithExactly(context.stub.knex_where, { id: anyId })
            sinon.assert.calledOnce(context.stub.knex_select)
        })

    })

    describe('listCharacterNames', () => {

        it('returns actor character names', async ({ context }: Flags) => {
            if (!isContext(context)) throw TypeError()
            const anyId = 123

            await listCharacterNames(anyId)
            sinon.assert.calledOnceWithExactly(context.stub.knex_from, 'actor_movie')
            sinon.assert.calledOnceWithExactly(context.stub.knex_where, { id: anyId })
            sinon.assert.calledOnceWithExactly(context.stub.knex_select, 'characterName')
        })

    })

    describe('create', () => {

        it('insert one row into table `actor_movie`', async ({ context }: Flags) => {
            if (!isContext(context)) throw TypeError()
            const anyActorId = 123
            const anyMovieId = 456
            const anyCharacterName = 'any-character-name'
            context.stub.knex_insert.resolves([])

            await create(anyActorId, anyMovieId, anyCharacterName)
            sinon.assert.calledOnceWithExactly(context.stub.knex_into, 'actor_movie')
            sinon.assert.calledOnceWithExactly(context.stub.knex_insert, { actorId: anyActorId, movieId: anyMovieId, characterName: anyCharacterName })
        })
    })

}))
