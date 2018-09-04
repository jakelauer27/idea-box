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
// $('.sort-by-quality-button').on("click", sort);

////MAIN EVENT DELAGATION & VOTING/CHANGE/DELETE FUNCTIONS

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
  deleteTags();
};

function deleteTags() {
  var tagsOnPage = $('.tag');
  var globalTags = JSON.parse(localStorage.getItem("globalTags"));
  var globalTagsOnPage = $('.global-tag');
  var globalTagsFiltered = [];
  for(var i = 0; i < tagsOnPage.length; i++) {
    if(globalTags.indexOf($(tagsOnPage[i]).text().trim()) !== -1 && globalTagsFiltered.indexOf($(tagsOnPage[i]).text().trim()) === -1) {
      globalTagsFiltered.push($(tagsOnPage[i]).text().trim())
    }
  }
  for(var i = 0; i < globalTagsOnPage.length; i++){
    if(globalTagsFiltered.indexOf($(globalTagsOnPage[i]).text().trim()) === -1) $(globalTagsOnPage[i]).remove();
  }
  localStorage.setItem("globalTags", JSON.stringify(globalTagsFiltered));
}

function changeQuality(e, change) {
  var key = $(e.target).parent().parent().attr("id");
  var selectedIdea = retreiveIdeas(key);
  console.log(key)
  console.log(e.target)
  selectedIdea.qualityIndex += change;
  if (selectedIdea.qualityIndex < 0) selectedIdea.qualityIndex = 0;
  if (selectedIdea.qualityIndex > 2) selectedIdea.qualityIndex = 2;
  console.log(selectedIdea.qualityIndex);
  $(e.target).siblings('.quality-value').text(selectedIdea.quality[selectedIdea.qualityIndex])
  selectedIdea.returnItem();
}

function updateIdeaContent(e) {
  var key = $(e.target).parents('.new-idea').attr("id");
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

function updateIdeaOnEnter(e) {
  if(e.which == 13) {
    $('p, h2').blur();
		updateIdeaContent(e);
  }
}

/// IDEABOX CONSTRUCTOR + METHODS + CORE RETRIEVE/RETURN FROM STORAGE FUNCTIONS

function IdeaBox (title, body, tags) {
	this.title = title;
	this.body = body;
  this.timestamp = Date.now();
  this.quality = ['swill', 'plausible', 'genius'];
  this.qualityIndex = 0;
  this.tags = tags.split(',');
}

function addIdea() {
	var idea = new IdeaBox($('.title-input').val(), $('.body-input').val(), $('.tags-input').val());
	$('.title-input').val('');
  $('.body-input').val('');
  $('.tags-input').val('');
  disableSaveButton();
  idea.addGlobalTags();
  idea.AddToPage();
  idea.sendToStorage();
}

IdeaBox.prototype.AddToPage = function() {
  var item =  `<article class="new-idea" id="${this.timestamp}">
  <div class="idea-header-container">
    <h2 class="edit-idea idea-title" contenteditable="true">${this.title}</h2>
    <img class="x-icon" src="images/delete.svg" alt="Delete Button"
       onmouseover='hover(this)'
       onmouseout='unhover(this)'>
  </div>
  <p class="edit-idea idea-body" contenteditable="true">${this.body}</p>
  <div class="idea-rating-container">
    <img class="arrow up-arrow-icon" src="images/upvote.svg" alt="Upvote Button"
      onmouseover='hover(this)'
      onmouseout='unhover(this)'>
    <img class="arrow down-arrow-icon" src="images/downvote.svg" alt="Downvote Button"
      onmouseover='hover(this)'
      onmouseout='unhover(this)'>
    <h3 class="quality">quality: </h3>
    <h3 class="quality-value">${this.quality[this.qualityIndex]}</h3>
  </div>
  <div class="tags-container">
    <h3 class="tags-title">Tags: </h3>
  </div>
</article>`
  $(item).insertAfter('.ideas-container');
  for(var i = 0; i < this.tags.length; i++) {
    var tag = `<h3 class="tag">${this.tags[i].trim()}</h3>`
    $(tag).appendTo($(`#${this.timestamp}`).children('.tags-container'))
  }
};

IdeaBox.prototype.addGlobalTags = function() {
  var currentGlobalTags = JSON.parse(localStorage.getItem("globalTags"));
  for(var i = 0; i < this.tags.length; i++){
    if(currentGlobalTags.indexOf(this.tags[i].trim()) === -1) {
      currentGlobalTags.push(this.tags[i].trim());
      var globalTag = `<h3 class="global-tag">${this.tags[i]}</h3>`
      $(globalTag).appendTo($('.global-tags-container'))
    }
  localStorage.setItem("globalTags", JSON.stringify(currentGlobalTags));
  }
}

IdeaBox.prototype.sendToStorage = function(){
  var storedIdeas = JSON.parse(localStorage.getItem("ideas"));
  storedIdeas.push(this);
  localStorage.setItem("ideas", JSON.stringify(storedIdeas));
}

IdeaBox.prototype.returnItem = function() {
  var storedIdeas = JSON.parse(localStorage.getItem("ideas"));
  var ideaToReplace = storedIdeas.indexOf(this.timestamp);
  storedIdeas.splice(ideaToReplace, 1, this);
  localStorage.setItem("ideas", JSON.stringify(storedIdeas));
}

function retreiveIdeas(key) {
  var storedIdeas = JSON.parse(localStorage.getItem("ideas"));
  for (var i = 0; i < storedIdeas.length; i++) {
    Object.setPrototypeOf(storedIdeas[i], IdeaBox.prototype);
  }
  var selectedIdea = storedIdeas.find(function(element) {
    return element.timestamp === parseInt(key);
    });
  return selectedIdea;
}

function sort() {
  var storedIdeas = JSON.parse(localStorage.getItem('ideas'));
  console.log(storedIdeas)
  storedIdeas.sort(function(a, b) {
    if (a.qualityIndex < b.qualityIndex) 
      return -1;
    if (a.qualityIndex > b.qualityIndex) 
      return 1;
    return 0;
  });
  return storedIdeas;
}



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

/////DISABLE SAVE FUNCTION

function disableSaveButton() {
	$('.save-button').prop('disabled', $('.title-input').val() === '' || $('.body-input').val() === '' ||  $('.tags-input').val() === '')
};

////LOADING CONTENT ON PAGE LOAD
window.onload = function() {
  if (localStorage.key('ideas') === null && localStorage.key('globalTags') === null) {
    localStorage.setItem("globalTags", "[]");
    localStorage.setItem("ideas", "[]");
  }
  var storedIdeas = JSON.parse(localStorage.getItem('ideas'));
  for (var i = 0; i < storedIdeas.length; i++) {
    Object.setPrototypeOf(storedIdeas[i], IdeaBox.prototype);
    storedIdeas[i].AddToPage();
  }
  var currentGlobalTags = JSON.parse(localStorage.getItem('globalTags'));
  for(var i = 0; i < currentGlobalTags.length; i++){
      var globalTag = `<h3 class="global-tag">${currentGlobalTags[i]}</h3>`
      $(globalTag).appendTo($('.global-tags-container'))
    }
}

///HOVER FUNCTIONS 

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