///EVENT LISTENERS

$('.save-button').on("click", addIdea);
$('.body-input').on("keyup", disableSaveButton);
$('.title-input').on("keyup", disableSaveButton);
$('.tags-input').on("keyup", disableSaveButton);
$('main').on("click", ideaButtonDelegator);
$('main').on("focusout", updateIdea);
$(document).on("keypress", updateIdeaOnEnter);
$('.search-input').on("keyup", search);
$('.global-tags-container').on("click", searchByTag);

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
  parent.remove();
  localStorage.removeItem($(e.target).parents('.new-idea').attr('id'));
  deleteTags();
};

function deleteTags() {
  var tagsOnPage = $('.tag');
  var globalTagsFiltered = [];
  var globalTagsOnPage = $('.global-tag');
  $(tagsOnPage).each(function(i, tag) {
    if (globalTagsFiltered.indexOf(tag) === -1) globalTagsFiltered.push($(tag).text().trim());
  })
  $(globalTagsOnPage).each(function(i, tag){
    if(globalTagsFiltered.indexOf($(tag).text()) === -1) $(tag).remove();
  })
  localStorage.setItem("tagList", JSON.stringify(globalTagsFiltered));
}

function changeQuality(e, change) {
  var idea = JSON.parse(localStorage.getItem($(e.target).parents('.new-idea').attr('id')))
  idea.qualityIndex += change;
  if (idea.qualityIndex < 0) idea.qualityIndex = 0;
  if (idea.qualityIndex > 2) idea.qualityIndex = 2;
  $(e.target).siblings('.quality-value').text(idea.quality[idea.qualityIndex])
  localStorage.setItem(idea.timestamp, JSON.stringify(idea))
}

////UPDATE IDEAS WHEN BODY OR TITLE IS CHANGED

function updateIdeaOnEnter(e) {
  if(e.which == 13) {
    $('p, h2').blur();
		updateIdea(e);
  }
}

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

////ADD NEW IDEA FUNCTION

function addIdea() {
	var idea = new IdeaBox($('.title-input').val(), $('.body-input').val(), $('.tags-input').val());
	$('.title-input').val('');
  $('.body-input').val('');
  $('.tags-input').val('');
	disableSaveButton();
  createHtml(idea);
  createTags(idea);
}

/// IDEABOX CONSTRUCTOR

function IdeaBox (title, body, tags) {
	this.title = title;
	this.body = body;
  this.timestamp = Date.now();
  this.quality = ['swill', 'plausible', 'genius']
  this.qualityIndex = 0;
  this.tags = tags.split(',');
}

//// CREATE HTML

function createHtml(idea) {
  var item =  `<article class="new-idea" id="${idea.timestamp}">
  <div class="idea-header-container">
    <h2 class="edit-idea idea-title" contenteditable="true">${idea.title}</h2>
    <img class="x-icon" src="images/delete.svg" alt="Delete Button"
       onmouseover='hover(this)'
       onmouseout='unhover(this)'>
  </div>
  <p class="edit-idea idea-body" contenteditable="true">${idea.body}</p>
  <div class="idea-rating-container">
    <img class="arrow up-arrow-icon" src="images/upvote.svg" alt="Upvote Button"
      onmouseover='hover(this)'
      onmouseout='unhover(this)'>
    <img class="arrow down-arrow-icon" src="images/downvote.svg" alt="Downvote Button"
      onmouseover='hover(this)'
      onmouseout='unhover(this)'>
    <h3 class="quality">quality: </h3>
    <h3 class="quality-value">${idea.quality[idea.qualityIndex]}</h3>
  </div>
  <div class="tags-container">
    <h3 class="tags-title">Tags: </h3>
  </div>
</article>`
  $(item).insertAfter('.ideas-container');
  idea.tags.forEach(function(tag){
    $(`<h3 class="tag">${tag}</h3>`).appendTo($(`#${idea.timestamp}`).children('.tags-container'))
  })
  localStorage.setItem(idea.timestamp, JSON.stringify(idea));
};

////ADDING/CHECKING GLOBAL TAGS

function createTags(idea) {
  if (localStorage.getItem("tagList") === null) localStorage.setItem("tagList", "[]")
  var currentTags = JSON.parse(localStorage.getItem("tagList"))
  idea.tags.forEach(function(tag){
    if (currentTags.indexOf(tag.trim()) === -1) {
      currentTags.push(tag.trim());
      $(`<h3 class="global-tag">${tag.trim()}</h3>`).appendTo($('.global-tags-container'));
      localStorage.setItem("tagList", JSON.stringify(currentTags));
    }
  })
}

/////SEARCH FUNCTIONS

function search(e){
  var value = $(e.target).val().toLowerCase();
  $('.new-idea').each(function(i, element) {
    $(element).toggle($(element).text().toLowerCase().indexOf(value) !== -1)
  });
};

function searchByTag(e) {
  if ($(e.target).hasClass('global-tag')){
    $('.new-idea').each(function(i, element) {
      $(element).toggle($(element).text().toLowerCase().indexOf($(e.target).text()) !== -1)
    });
  }
  if ($(e.target).hasClass('show-all')) {
    $('.new-idea').each(function(i, element) {
    $(element).toggle(element) 
    })
  }
}

/////DISABLE SAVE FUNCTION

function disableSaveButton() {
	$('.save-button').prop('disabled', $('.title-input').val() === '' || $('.body-input').val() === '' ||  $('.tags-input').val() === '')
};

////GETTING ITEMS ON PAGE LOAD;

window.onload = function() {
  for ( var i = 0; i < localStorage.length; i++) {
    if (localStorage.key(i) === "tagList") {
      var currentTags = JSON.parse(localStorage.getItem("tagList"))
       currentTags.forEach(function(tag) {
        $(`<h3 class="global-tag">${tag}</h3>`).appendTo($('.global-tags-container'));
       })
    } else {
      var key = localStorage.key(i);
      var idea = JSON.parse(localStorage.getItem(key))
      createHtml(idea);
    }
  }
}

////HOVER FUNCTIONS 

function hover(x) {
  if (x.src === "file:///Users/jakelauer/Documents/mod-one-projects/idea-box/images/delete.svg") x.src = "images/delete-hover.svg";
  if (x.src === "file:///Users/jakelauer/Documents/mod-one-projects/idea-box/images/upvote.svg") x.src = "images/upvote-hover.svg";
  if (x.src === "file:///Users/jakelauer/Documents/mod-one-projects/idea-box/images/downvote.svg") x.src = "images/downvote-hover.svg";
}

function unhover(x) {
  if (x.src === "file:///Users/jakelauer/Documents/mod-one-projects/idea-box/images/delete-hover.svg") x.src = "images/delete.svg";
  if (x.src === "file:///Users/jakelauer/Documents/mod-one-projects/idea-box/images/upvote-hover.svg") x.src = "images/upvote.svg";
  if (x.src === "file:///Users/jakelauer/Documents/mod-one-projects/idea-box/images/downvote-hover.svg") x.src = "images/downvote.svg";
}