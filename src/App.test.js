import { fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import App from './App';
import { mockDealerHighInitialDraw, mockHighCardDraw, mockInitialDraw, mockSingleCardDraw } from './mocks/mocks';
import { fetchDeck, fetchCards } from './helpers/deckUtils';

jest.mock('./helpers/deckUtils', () => ({
  ...jest.requireActual('./helpers/deckUtils'),
  fetchDeck: jest.fn(),
  fetchCards: jest.fn(),
}))


beforeEach(() => {
  fetchDeck.mockImplementation(() => ({deck_id: 'mock-deck-id'}));
  fetchCards.mockImplementation((deckID, count) => count > 1 ? mockInitialDraw : mockSingleCardDraw);
})

test('renders table', async () => {
  render(<App />);
  await waitForElementToBeRemoved(() => screen.queryByText('Shuffling deck...'));
  const dealerElement = screen.getByTestId('dealer-title');
  const userElement = screen.getByTestId('player-title')
  const dealbutton = screen.getByTestId('deal-btn');
  expect(dealerElement).toBeInTheDocument();
  expect(userElement).toBeInTheDocument();
  expect(dealbutton).toBeInTheDocument();
});

test('renders initial draw', async () => {
  render(<App />);
  await waitForElementToBeRemoved(() => screen.queryByText('Shuffling deck...'));

  const dealbutton = screen.getByTestId('deal-btn');
  fireEvent.click(dealbutton)

  await waitFor(() => {
    const dealerHand = screen.queryAllByTestId('dealer-card-container');
    expect(dealerHand.length).toBe(2);
  })

  await waitFor(() => {
    const userHand = screen.queryAllByTestId('player-card-container');
    expect(userHand.length).toBe(2);
  })

  await waitFor(() => {
    const hitMeButton = screen.getByText('Hit Me')
    expect(hitMeButton).toBeInTheDocument();
  })

  await waitFor(() => {
    const endTurnButton = screen.getByText('End Turn')
    expect(endTurnButton).toBeInTheDocument();
  })
})

test('renders extra user draw', async () => {
  render(<App />);
  await waitForElementToBeRemoved(() => screen.queryByText('Shuffling deck...'));

  const dealbutton = screen.getByTestId('deal-btn');
  fireEvent.click(dealbutton)

  const hitMeButton = await screen.findByText('Hit Me')
  fireEvent.click(hitMeButton)

  await waitFor(() => {
    const userHand = screen.queryAllByTestId('player-card-container');
    expect(userHand.length).toBe(3);
  })
})

test('renders end of user turn', async () => {
  fetchCards.mockImplementation((deckID, count) => count > 1 ? mockDealerHighInitialDraw : mockSingleCardDraw);

  render(<App />);
  await waitForElementToBeRemoved(() => screen.queryByText('Shuffling deck...'));

  const dealbutton = screen.getByTestId('deal-btn');
  fireEvent.click(dealbutton)

  const backOfCard = await screen.findByAltText('back-of-card')
  expect(backOfCard).toBeInTheDocument()

  const endTurnButton = await screen.findByText('End Turn')
  fireEvent.click(endTurnButton)

  await waitFor(() => {
    expect(screen.queryByAltText('back-of-card')).not.toBeInTheDocument()
  })

  await waitFor(() => {
    const winningMessage = screen.queryByTestId('winner-statement');
    expect(winningMessage).toBeInTheDocument()
  })
})

test('user goes bust', async () => {
  fetchCards.mockImplementation((deckID, count) => count > 1 ? mockInitialDraw : mockHighCardDraw);

  render(<App />);
  await waitForElementToBeRemoved(() => screen.queryByText('Shuffling deck...'));

  const dealbutton = screen.getByTestId('deal-btn');
  fireEvent.click(dealbutton)

  const hitMeButton = await screen.findByText('Hit Me')
  fireEvent.click(hitMeButton)

  await waitFor(() => {
    const userHand = screen.queryAllByTestId('player-card-container');
    expect(userHand.length).toBe(3);
  })

  await waitFor(() => {
    const losingMessage = screen.queryByText('YOU LOSE!');
    expect(losingMessage).toBeInTheDocument()
  })
})

test('dealer goes bust', async () => {
  fetchCards.mockImplementation((deckID, count) => count > 1 ? mockInitialDraw : mockHighCardDraw);

  render(<App />);
  await waitForElementToBeRemoved(() => screen.queryByText('Shuffling deck...'));

  const dealbutton = screen.getByTestId('deal-btn');
  fireEvent.click(dealbutton)

  const endTurnButton = await screen.findByText('End Turn')
  fireEvent.click(endTurnButton)

  await waitFor(() => {
    const losingMessage = screen.queryByText('YOU WIN!');
    expect(losingMessage).toBeInTheDocument()
  })
})

test('user & dealer stand - user win', async () => {
  fetchCards.mockImplementation((deckID, count) => count > 1 ? mockDealerHighInitialDraw : mockSingleCardDraw);
  render(<App />);
  await waitForElementToBeRemoved(() => screen.queryByText('Shuffling deck...'));

  const dealbutton = screen.getByTestId('deal-btn');
  fireEvent.click(dealbutton)

  const backOfCard = await screen.findByAltText('back-of-card')
  expect(backOfCard).toBeInTheDocument()

  const hitMeButton = await screen.findByText('Hit Me')
  fireEvent.click(hitMeButton)

  await waitFor(() => {
    const userHand = screen.queryAllByTestId('player-card-container');
    expect(userHand.length).toBe(3);
  })

  const endTurnButton = await screen.findByText('End Turn')
  fireEvent.click(endTurnButton)

  await waitFor(() => {
    expect(screen.queryByAltText('back-of-card')).not.toBeInTheDocument()
  })

  await waitFor(() => {
    const losingMessage = screen.queryByText('YOU WIN!');
    expect(losingMessage).toBeInTheDocument()
  })
})

test('user & dealer stand - dealer win', async () => {
  fetchCards.mockImplementation((deckID, count) => count > 1 ? mockDealerHighInitialDraw : mockSingleCardDraw);
  render(<App />);
  await waitForElementToBeRemoved(() => screen.queryByText('Shuffling deck...'));

  const dealbutton = screen.getByTestId('deal-btn');
  fireEvent.click(dealbutton)

  const backOfCard = await screen.findByAltText('back-of-card')
  expect(backOfCard).toBeInTheDocument()

  const endTurnButton = await screen.findByText('End Turn')
  fireEvent.click(endTurnButton)

  await waitFor(() => {
    expect(screen.queryByAltText('back-of-card')).not.toBeInTheDocument()
  })

  await waitFor(() => {
    const losingMessage = screen.queryByText('YOU LOSE!');
    expect(losingMessage).toBeInTheDocument()
  })
})



