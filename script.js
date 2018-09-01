///EVENT LISTENERS

$('.save-button').on("click", addIdea)
$('.body-input').on("keypress", disableSaveButton)
$('.title-input').on("keypress", disableSaveButton)
$('main').on("click", ideaButtonDelagator)



////EVENT DELAGATION & FUNCTIONS

function ideaButtonDelagator(e) {
  var idea = JSON.parse(localStorage.getItem($(e.target).parents('.new-idea').attr('id')))
  if (e.target.classList.contains('x-icon')) {
    deleteIdea(e);
  } 
  if (e.target.classList.contains('up-arrow-icon')) {
    changeQuality(e, idea, 1);
  }
  if (e.target.classList.contains('down-arrow-icon')) {
    changeQuality(e, idea, -1);
  }
}

function deleteIdea(e) {
    var parent = $(e.target).parents('.new-idea')
    parent.remove();
    localStorage.removeItem($(e.target).parents('.new-idea').attr('id'))
};

function changeQuality(e, idea, change) {
  idea.qualityIndex += change;
  if (idea.qualityIndex < 0) idea.qualityIndex = 0;
  if (idea.qualityIndex > 2) idea.qualityIndex = 2;
  $(e.target).siblings('.quality-value').text(idea.quality[idea.qualityIndex])
  localStorage.setItem(idea.timestamp, JSON.stringify(idea))
}

function disableSaveButton() {
	if ($('.title-input').val() === '' || $('.body-input').val() === '') {
		$('.save-button').prop('disabled', true);
	} else {
		$('.save-button').prop('disabled', false);
	}
};

////ADD NEW IDEA FUNCTION

function addIdea() {
	var idea = new IdeaBox($('.title-input').val(), $('.body-input').val());
	idea.createHtml();
	$('.title-input').val('');
	$('.body-input').val('');
	disableSaveButton();
	createHtml(idea);
}

/// IDEABOX CONSTRUCTOR

function IdeaBox(title, body) {
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
    <h2 class="idea-title">${idea.title}</h2>
    <i class="fas fa-times-circle x-icon"></i>
  </div>
  <p class="idea-body">${idea.body}</p>
  <div class="idea-rating-container">
    <i class="fas fa-arrow-circle-up up-arrow-icon"></i>
    <i class="fas fa-arrow-circle-down down-arrow-icon"></i>
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