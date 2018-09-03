///EVENT LISTENERS

$('.save-button').on("click", addIdea);
$('.body-input').on("keypress", disableSaveButton);
$('.title-input').on("keypress", disableSaveButton);
$('.tags-input').on("keypress", disableSaveButton);
$('main').on("click", ideaButtonDelegator);
$('main').on("focusout", updateIdeaContent);
$(document).on("keypress", updateIdeaOnEnter);
$('.search-input').on("keyup", search);
$('.global-tags-container').on("click", searchByTag);
$('.sort-by-quality-button').on("click", sort);

/////SEARCH FUNCTIONS

function search(e){
  var value = $(e.target).val().toLowerCase();
  $('.new-idea').filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) !== -1)
  });
};

function searchByTag(e) {
  if ($(e.target).hasClass('global-tag')){
    $('.new-idea').filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf($(e.target).text()) !== -1)
    });
  }
  if ($(e.target).hasClass('show-all')) {
    $('.new-idea').filter(function() {
    $(this).toggle(true) 
    })
  }
}

////SORT FUNCTION

function sort() {
  $('.new-idea').sort(function(a, b) {
    if (x) {x}
  })
}

////UPDATE IDEAS WHEN BODY OR TITLE IS CHANGED

function updateIdeaOnEnter(e) {
  if(e.which == 13) {
    $('p, h2').blur();
		updateIdeaContent(e);
  }
}

////MAIN EVENT DELAGATION & VOTING/DELETE FUNCTIONS

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
  var parent = $(e.target).parents('.new-idea');
  parent.remove();
  var ideaKey = $(e.target).parents('.new-idea').attr('id')
  var storedIdeas = JSON.parse(localStorage.getItem('ideas'));
  var updatedIdeas = storedIdeas.filter(function(idea){
    return idea.timestamp != ideaKey;
  })
  localStorage.setItem('ideas', JSON.stringify(updatedIdeas))
};

function deleteTags() {
  var tagsOnPage = $('.tag');
  var globalTags = JSON.parse(localStorage.getItem("taglist"));
  var globalTagsOnPage = $('.global-tag');
  var globalTagsFiltered = [];
  for(var i = 0; i < tagsOnPage.length; i++) {
    if(globalTags.indexOf($(tagsOnPage[i]).text().trim()) !== -1 && globalTagsFiltered.indexOf($(tagsOnPage[i]).text().trim()) === -1) {
      globalTagsFiltered.push($(tagsOnPage[i]).text().trim())
    }
  }
  for(var i = 0; i < globalTagsOnPage.length; i++){
    if(globalTagsFiltered.indexOf($(globalTagsOnPage[i]).text()) === -1) $(globalTagsOnPage[i]).remove();
  }
  localStorage.setItem("taglist", JSON.stringify(globalTagsFiltered));
}

function changeQuality(e, change) {
  var key = $(e.target).parents('.new-idea').attr('id');
  var selectedIdea = retreiveIdeas(key);
  selectedIdea.qualityIndex += change;
  if (selectedIdea.qualityIndex < 0) selectedIdea.qualityIndex = 0;
  if (selectedIdea.qualityIndex > 2) selectedIdea.qualityIndex = 2;
  $(e.target).siblings('.quality-value').text(selectedIdea.quality[selectedIdea.qualityIndex])
  selectedIdea.returnItem();
}

function updateIdeaContent(e) {
  var key = $(e.target).parents('.new-idea').attr('id');
  var selectedIdea = retreiveIdeas(key);
if ($(e.target).hasClass('idea-title')) {
  selectedIdea.title = $(e.target).text();
  selectedIdea.returnItem();
}
if ($(e.target).hasClass('idea-body')) {
  selectedIdea.body = $(e.target).text();
  selectedIdea.returnItem();
} 
}

/////DISABLE SAVE FUNCTION

function disableSaveButton() {
	$('.save-button').prop('disabled', $('.title-input').val() === '' || $('.body-input').val() === '' ||  $('.tags-input').val() === '')
};

////ADD NEW IDEA FUNCTION

function addIdea() {
	var idea = new IdeaBox($('.title-input').val(), $('.body-input').val(), $('.tags-input').val());
	$('.title-input').val('');
  $('.body-input').val('');
  $('.tags-input').val('');
	disableSaveButton();
  idea.AddToPage()
  idea.sendToStorage();
}

/// IDEABOX CONSTRUCTOR

function IdeaBox (title, body, tags) {
	this.title = title;
	this.body = body;
  this.timestamp = Date.now();
  this.quality = ['swill', 'plausible', 'genius'];
  this.qualityIndex = 0;
  this.tags = tags.split(',');
}

//// CREATE HTML

IdeaBox.prototype.AddToPage = function() {
  var item =  `<article class="new-idea" id="${this.timestamp}">
  <div class="idea-header-container">
    <h2 class="edit-idea idea-title" contenteditable="true">${this.title}</h2>
    <img class="x-icon" src="images/delete.svg" alt="Delete Button"
       onmouseover='hoverDelete(this)'
       onmouseout='unHoverDelete(this)'>
  </div>
  <p class="edit-idea idea-body" contenteditable="true">${this.body}</p>
  <div class="idea-rating-container">
    <img class="arrow up-arrow-icon" src="images/upvote.svg" alt="Upvote Button"
      onmouseover='hoverUpArrow(this)'
      onmouseout='unHoverUpArrow(this)'>
    <img class="arrow down-arrow-icon" src="images/downvote.svg" alt="Downvote Button"
      onmouseover='hoverDownArrow(this)'
      onmouseout='unHoverDownArrow(this)'>
    <h3 class="quality">quality: </h3>
    <h3 class="quality-value">${this.quality[this.qualityIndex]}</h3>
  </div>
  <div class="tags-container">
    <h3 class="tags-title">Tags: </h3>
  </div>
</article>`
  $(item).insertAfter('.ideas-container');
  for(var i = 0; i < this.tags.length; i++) {
    var tag = `<h3 class="tag">${this.tags[i]}</h3>`
    $(tag).appendTo($(`#${this.timestamp}`).children('.tags-container'))
  }
};

IdeaBox.prototype.sendToStorage = function(){
  var storedIdeas = JSON.parse(localStorage.getItem('ideas'));
  storedIdeas.push(this);
  localStorage.setItem('ideas', JSON.stringify(storedIdeas));
}

window.onload = function() {
  if (localStorage.key('ideas') === null) localStorage.setItem('ideas', "[]");
  var storedIdeas = JSON.parse(localStorage.getItem('ideas'));
  for (var i = 0; i < storedIdeas.length; i++) {
    Object.setPrototypeOf(storedIdeas[i], IdeaBox.prototype);
    storedIdeas[i].AddToPage();
  }
}

function retreiveIdeas(key) {
  var storedIdeas = JSON.parse(localStorage.getItem('ideas'));
  for (var i = 0; i < storedIdeas.length; i++) {
    Object.setPrototypeOf(storedIdeas[i], IdeaBox.prototype);
  }
  var selectedIdea = storedIdeas.find(function(element) {
    return element.timestamp === parseInt(key);
    });
  return selectedIdea;
}

IdeaBox.prototype.returnItem = function() {
  var storedIdeas = JSON.parse(localStorage.getItem('ideas'));
  var ideaToReplace = storedIdeas.indexOf(this.timestamp);
  storedIdeas.splice(ideaToReplace, 1, this);
  localStorage.setItem('ideas', JSON.stringify(storedIdeas));
}
////ADDING/CHECKING GLOBAL TAGS

/////ADDING TO IDEA LIST

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
