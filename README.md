# Blackjack

This is a blackjack game built using react.

`https://deckofcardsapi.com/` was used to handle the creation/shuffling of the deck and drawing cards

Game is played using the blackjack standard of 6 decks of 52 standard playing cards, combined and shuffled.

Blackjack's hand-splitting mechanic was left out for brevity. 

In order to run the game, please run `npm install`, followed by `npm start`
Then open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Testing 

Tests are written using `react-testing-library` & `Jest`, with `MSW` used for API mocking
Given the low amount of interactivity involved in this app, most of the functionality is handled through side effects. This makes is more difficult to test and as a result adds complexity to the tests in order to ensure the entire app is tested correctly

Tests can be run using `npm test`