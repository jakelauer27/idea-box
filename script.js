///EVENT LISTENERS

$('.save-button').on("click", addIdea)
$('.body-input').on("keypress", disableSaveButton)
$('.title-input').on("keypress", disableSaveButton)
$('main').on("click", ideaButtonDelegator)
$('main').on("focusout", updateIdea)
$('.search-input').on("keyup", search)


///Search Function

function search(e){
  var value = $(e.target).val().toLowerCase();
  $('.new-idea').filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) !== -1)
  });
};

///Save new Text/Title Changes

function updateIdea(e) {
  	var idea = JSON.parse(localStorage.getItem($(e.target).parents('.new-idea').attr('id')));
	if ($(e.target).hasClass('idea-title')) {
    idea.title = $(e.target).text(); 
    localStorage.setItem(idea.timestamp, JSON.stringify(idea));
    }
	if ($(e.target).hasClass('idea-body')) {
		idea.body = $(e.target).text();
    localStorage.setItem(idea.timestamp, JSON.stringify(idea));
	} 
}

////EVENT DELAGATION & FUNCTIONS

function ideaButtonDelegator(e) {
  if ($(e.target).hasClass('x-icon')) {
    deleteIdea(e);
  } 
  if ($(e.target).hasClass('up-arrow-icon')) {
    changeQuality(e, 1);
  }
  if ($(e.target).hasClass('down-arrow-icon')) {
    changeQuality(e, -1);
  }
}

function deleteIdea(e) {
    var parent = $(e.target).parents('.new-idea')
    localStorage.removeItem($(e.target).parents('.new-idea').attr('id'));
    parent.remove();
};

function changeQuality(e, change) {
  var idea = JSON.parse(localStorage.getItem($(e.target).parents('.new-idea').attr('id')))
  idea.qualityIndex += change;
  if (idea.qualityIndex < 0) idea.qualityIndex = 0;
  if (idea.qualityIndex > 2) idea.qualityIndex = 2;
  $(e.target).siblings('.quality-value').text(idea.quality[idea.qualityIndex])
  localStorage.setItem(idea.timestamp, JSON.stringify(idea))
}

/////DISABLE SAVE FUNCTION

function disableSaveButton() {
	$('.save-button').prop('disabled', $('.title-input').val() === '' || $('.body-input').val() === '')
};

////ADD NEW IDEA FUNCTION

function addIdea() {
	var idea = new IdeaBox($('.title-input').val(), $('.body-input').val());
	$('.title-input').val('');
	$('.body-input').val('');
	disableSaveButton();
	createHtml(idea);
}

/// IDEABOX CONSTRUCTOR

function IdeaBox (title, body) {
	this.title = title;
	this.body = body;
  this.timestamp = Date.now();
  this.quality = ['swill', 'plausible', 'genius']
  this.qualityIndex = 0;
}

//// CREATE HTML

function createHtml(idea) {
  var item =  `<article class="new-idea" id="${idea.timestamp}">
  <div class="idea-header-container">
    <h2 class="edit-idea idea-title" contenteditable="true">${idea.title}</h2>
    <img class="x-icon" src="images/delete.svg" alt="Delete Button"
       onmouseover='hoverDelete(this)'
       onmouseout='unHoverDelete(this)'>
  </div>
  <p class="edit-idea idea-body" contenteditable="true">${idea.body}</p>
  <div class="idea-rating-container">
    <img class="arrow up-arrow-icon" src="images/upvote.svg" alt="Upvote Button"
      onmouseover='hoverUpArrow(this)'
      onmouseout='unHoverUpArrow(this)'>
    <img class="arrow down-arrow-icon" src="images/downvote.svg" alt="Downvote Button"
      onmouseover='hoverDownArrow(this)'
      onmouseout='unHoverDownArrow(this)'>
    <h3 class="quality">quality: </h3>
    <h3 class="quality-value">${idea.quality[idea.qualityIndex]}</h3>
  </div>
</article>`
  $(item).insertAfter('.ideas-container');
  localStorage.setItem(idea.timestamp, JSON.stringify(idea));
};

////getting items on page load;

for (i = 0; i < localStorage.length; i++) {
  var key = localStorage.key(i);
  var idea = JSON.parse(localStorage.getItem(key))
  createHtml(idea);
}

////HOVER FUNCTIONS 

function hoverDelete(x) {
  x.src = "images/delete-hover.svg"
}

function unHoverDelete(x) {
  x.src = "images/delete.svg"
}

function hoverUpArrow(x) {
  x.src = "images/upvote-hover.svg"
}

function unHoverUpArrow(x) {
  x.src = "images/upvote.svg"
}

function hoverDownArrow(x) {
  x.src = "images/downvote-hover.svg"
}

function unHoverDownArrow(x) {
  x.src = "images/downvote.svg"
}
