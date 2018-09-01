///EVENT LISTENERS

$('.save-button').on("click", addIdea)
$('main').on("click", ideaButtonDelagator)


////EVENT DELAGATION & FUNCTIONS

function ideaButtonDelagator(e) {
  if (e.target.classList.contains('x-icon')) {
    deleteIdea(e);
  } 
  if (e.target.classList.contains('up-arrow-icon')) {
    upVote(e);
  }
  if (e.target.classList.contains('down-arrow-icon')) {
    downVote(e);
  }
}

function deleteIdea(e) {
    var parent = $(e.target).parents('.new-idea')
    parent.remove();
    localStorage.removeItem($(e.target).parents('.new-idea').attr('id'))
}

function upVote(e) {
   
}

function downVote(e) {
    console.log('down');
}

////ADD NEW IDEA FUNCTION

function addIdea() {
	var idea = new IdeaBox($('.title-input').val(), $('.body-input').val());
	idea.createHtml();
}

/// IDEABOX CONSTRUCTOR

function IdeaBox(title, body) {
	this.title = title;
	this.body = body;
  this.timestamp = Date.now();
  this.quality = ['swill', 'plausible', 'genius']
  this.qualityIndex = 0;
  this.html = `<article class="new-idea" id="${this.timestamp}">
  <div class="idea-header-container">
    <h2 class="idea-title">${this.title}</h2>
    <i class="fas fa-times-circle x-icon"></i>
  </div>
  <p class="idea-body">${this.body}</p>
  <div class="idea-rating-container">
    <i class="fas fa-arrow-circle-up up-arrow-icon"></i>
    <i class="fas fa-arrow-circle-down down-arrow-icon"></i>
    <h3 class="quality">quality: </h3>
    <h3 class="quality-value">${this.quality[this.qualityIndex]}</h3>
  </div>
</article>`
}

//// CREATE HTML METHOD

IdeaBox.prototype.createHtml = function() {
	$(this.html).insertAfter('.ideas-container');
  localStorage.setItem(this.timestamp, this.html);
};

////getting items on page load;

for (i = 0; i < localStorage.length; i++) {
  var key = localStorage.key(i);
  $(localStorage.getItem(key)).insertAfter('.ideas-container');
}