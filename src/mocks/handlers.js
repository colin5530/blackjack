import { rest } from 'msw'
import { mockInitialDraw, mockSingleCardDraw } from './mocks';

export const handlers = [
  rest.get('https://deckofcardsapi.com/api/deck/new/shuffle/', (req, res, ctx) => {
    return res(
      ctx.json({"success": "true", "deck_id": "mock-deck-id"})
    )
  }),
  rest.get('https://deckofcardsapi.com/api/deck/mock-deck-id/draw/', (req, res, ctx) => {
    const count = req.url.searchParams.get('count')
    return res(
      ctx.json(count > 1 ? mockInitialDraw : mockSingleCardDraw)
    )
  })
]