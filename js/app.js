'use strict'; // Start of use strict

// Temporarily stores opened cards
let listOpenCards = [];

// Stores call of setTimeout function
let timeID;

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Reset the entire grid
function resetGrid() {

  const deck = $('.deck');
  deck.css('display', 'none');
  const cards = deck.children();
  cards.remove();
  cards.removeClass('open show match');
  shuffle(cards);
  deck.append(cards);
  deck.removeAttr('style');

}

// Timer
function countTime() {

  let timer = $('.timer').text().split(':');

  for (var i = timer.length - 1; i >= 0; i--) {

    // Turn of minutes and seconds after 59
    if (i !== 0 && Number(timer[i]) + 1 === 60) {
      timer[i] = '00';
    } else {
      timer[i] = Number(timer[i]) + 1 < 10 ? '0' + (Number(timer[i]) + 1) : Number(timer[i]) + 1;
      break;
    }

  }

  $('.timer').text(timer.join(':'));

  timeID = setTimeout(countTime, 1000);

}

/*
* Create a list that holds all of your cards
* Display the cards on the page
*   - shuffle the list of cards using the provided "shuffle" method above
*   - loop through each card and create its HTML
*   - add each card's HTML to the page
*
* Reset the move counter, timer and star rating
*/
function initializeGame() {

  clearTimeout(timeID);
  listOpenCards = [];
  resetGrid();
  $('.moves').text(0);
  $('.stars').find('i').removeClass('display-none');
  $('.timer').text('00:00:00');

}

// Display the card's symbol
function displayCardSymbol(card) {

  card.addClass('open show');

}

// Add the card to a *list* of "open" cards
function addOpenCardList(card) {

  listOpenCards.push(card);

}

/*
* If the list already has another card, check to see if the two cards match
*   - if the cards do match, lock the cards in the open position
*   - if the cards do not match, remove the cards from the list and hide the card's symbol
*/
function checkMatchedCards() {

  if (listOpenCards.length === 2) {

    if (listOpenCards[0].children().attr('class') === listOpenCards[1].children().attr('class')) {

      listOpenCards.forEach(function(card) {
        card.toggleClass('open show match');
      });

    } else {

      listOpenCards.forEach(function(card) {
        card.removeClass('open show');
      });

    }

    listOpenCards = [];

  }

}

// Increment the move counter and display it on the page
function incrementMoveCounter() {

  const count = Number($('.moves').text()) + 1;

  $('.moves').text(count);

  switch(count) {
    case 13:
    case 25:
      const stars = $('.stars').find('i').not('.display-none');
      stars.first().addClass('display-none');
      break;
  }

}

// Check if all cards are matched
function checkGameEnd() {

  const cards = $('.card');

  for (const card of cards) {

    if (!$(card).hasClass('match')) {
      return false;
    }

  }

  return true;

}

// Display a message with the final score
function displayCongratulations() {

  clearTimeout(timeID);

  $(`<p>With ${$('.moves').text()} Moves and ${$('.stars').find('i').not('.display-none').length} Stars in ${$('.timer').text()}</p>`).insertAfter('.modal-content h2');

  $('.modal').attr('style', 'display: block');

}

// Executes when DOM is fully loaded
$(function() {

  initializeGame();

  // Executes when card (a li element) is clicked
  // Delegates the click event to card (li element)
  $('.deck').on('click', '.card', function(event) {

    // Initializes timer in the first click
    if (Number($('.moves').text()) === 0 && listOpenCards.length === 0) {
      timeID = setTimeout(countTime, 1000);
    }

    const card = $(event.target).is('li') ? $(event.target) : $(event.target).parent();

    if (!card.hasClass('open') && !card.hasClass('match') && listOpenCards.length < 2) {

      displayCardSymbol(card);
      addOpenCardList(card);

      if (listOpenCards.length === 2) {

        setTimeout(function() {

          checkMatchedCards();
          incrementMoveCounter();
          if (checkGameEnd()) {
            displayCongratulations();
          }

        }, 800);

      }

    }

  });

  // Resets the entire grid as well as the move counter, timer and star rating when div.restart is clicked
  $('.restart').on('click', function() {
    initializeGame();
  });

  // Closes the modal and resets the entire grid as well as the move counter, timer and star rating when button.btn-modal is clicked
  $('.btn-modal').click(function() {
    $('.modal').attr('style', null);
    $('.modal-content p').first().remove();
    initializeGame();
  });

});

// End of use strict