function IdeaBox(title, body) {
	this.title = title;
	this.body = body;
	this.timestamp = Date.now();
}

IdeaBox.prototype.createHtml = function() {
	$(`<article id="${this.timestamp}">
        <div class="idea-header-container">
          <h2 class="idea-title">${this.title}</h2>
          <i class="fas fa-times-circle x-icon"></i>
        </div>
        <p class="idea-body">${this.body}</p>
        <div class="idea-rating-container">
          <i class="fas fa-arrow-circle-up up-arrow-icon"></i>
          <i class="fas fa-arrow-circle-down down-arrow-icon"></i>
          <h3 class="quality">quality: </h3>
          <h3 class="quality-value">swill</h3>
        </div>
      </article>`).insertAfter('.ideas-container')
};

function addIdea() {
	var idea = new IdeaBox($('.title-input').val(), $('.body-input').val());
	idea.createHtml();
}

$('.save-button').on("click", addIdea)
