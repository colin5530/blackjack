import { fetchDeck, fetchCards, getCardBJValue } from './deckUtils';


test('fetchDeck', async () => {
  const result = await fetchDeck();
  expect(result).toMatchObject({"success": "true", "deck_id": "mock-deck-id"})
});

describe('fetchCards', () => {
  test('initial draw - 4 cards', async () => {
    const result = await fetchCards('mock-deck-id', 4)
    expect(result).toEqual(expect.objectContaining({
      'success': true,
      'cards': expect.arrayContaining([
        expect.objectContaining({
          'value': expect.any(String),
          'suit': expect.any(String),
        })
      ])
    }))
    expect(result.cards.length).toBe(4);
  })

  test('1 card', async () => {
    const result = await fetchCards('mock-deck-id', 1)
    expect(result).toEqual(expect.objectContaining({
      'success': true,
      'cards': expect.arrayContaining([
        expect.objectContaining({
          'value': expect.any(String),
          'suit': expect.any(String),
        })
      ])
    }))
    expect(result.cards.length).toBe(1);
  })
})

describe('getCardBJValue', () => {
  test('ACE', () => {
    expect(getCardBJValue('ACE')).toBe(11)
  })

  test('JACK', () => {
    expect(getCardBJValue('JACK')).toBe(10)
  })

  test('QUEEN', () => {
    expect(getCardBJValue('QUEEN')).toBe(10)
  })

  test('KING', () => {
    expect(getCardBJValue('KING')).toBe(10)
  })

  test('4', () => {
    expect(getCardBJValue('4')).toBe(4)
  })

  test('7', () => {
    expect(getCardBJValue('7')).toBe(7)
  })

  test('9', () => {
    expect(getCardBJValue('9')).toBe(9)
  })
})
