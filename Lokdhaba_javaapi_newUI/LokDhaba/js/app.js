

$(document).foundation();

/*------------------------------------------------------------------
                    		Pop Up [Header]
------------------------------------------------------------------*/

// on click over header links showHeaderPopUp would execute
$('#contact-us, #how-to-cite').click(showHeaderPopUp);

// clicking close button would close the popup
$('#header-pop-up .pu-close').click(closeHeaderPopUp);

// this function changes the selected header pop up tile
$('#header-pop-up .pu-tile').click(changeSelectedHeaderPopUpSection);

// determines intended section & displays the section and glass
function showHeaderPopUp() {
	var tile = 'pu-t-' + $(this).attr('data-pop-up'),
		bodyBlock = 'pu-b-' + $(this).attr('data-pop-up');

	$('#'+tile).addClass('tile-selected');

	$('#header-pop-up .pu-body').children().each(function() {
		if ($(this).attr('id') != bodyBlock) {$(this).addClass('hide')};
	});

	// position the pop-up
	positionPopUp($('#header-pop-up'));

	$('#glass, #header-pop-up').removeClass('hide');
}

// resets all the added classes to default markup 
function closeHeaderPopUp() {
	$('#glass, #header-pop-up').addClass('hide');
	$('#header-pop-up .pu-tile').removeClass('tile-selected');
	$('#header-pop-up .pu-body').children().removeClass('hide');
}

// shows the proper section on click
function changeSelectedHeaderPopUpSection() {
	var tile = $(this).attr('id');
	$(this).parent().children('.pu-tile').each(function() {
		if ($(this).attr('id') != tile) {$(this).removeClass('tile-selected')}
		else {$(this).addClass('tile-selected')};
	});

	var bodyBlock = 'pu-b-' + $(this).attr('id').slice(5);
	$('#header-pop-up .pu-body').children().each(function() {
		if ($(this).attr('id') != bodyBlock) {$(this).addClass('hide')}
		else {$(this).removeClass('hide')};
	});
}

// positions the pop-up leaving gap of header height amount
function positionPopUp(el) {
	var headerHeight = $('#header').outerHeight();

	el.css({
		'top' : 0,
		'opacity': 0,
		'margin-bottom': headerHeight
	});

	el.animate({
		top: headerHeight,
		opacity: 1
	});
}

/*------------------------------------------------------------------
                    	Pop Up [Get Started]
------------------------------------------------------------------*/

// shows the get started pop-up
$('#get-started').click(showIntroPopUp);

// clicking close button would close the pop-up
$('#get-started-pu .pu-close').click(closeIntroPopUp);

// clicking previous/next button traverses through steps
$('#get-started-pu .button').click(traverseSteps);

// adds step-active to first step-no & shows first step-section
function showIntroPopUp() {
	$('#get-started-pu .step-no:eq(0)').addClass('step-active');
	$('#get-started-pu .step-section:gt(0)').addClass('hide');

	// position the pop-up
	positionPopUp($('#get-started-pu'));

	$('#get-started-pu, #glass').removeClass('hide');
}

// removes the markup to original state
function closeIntroPopUp() {
	$('#get-started-pu, #glass').addClass('hide');
	$('#get-started-pu .step-no').removeClass('step-active');
	$('#get-started-pu .step-section').removeClass('hide');
}

// checkes which button is clicked and shows next/previous step
function traverseSteps() {
	var currentStep = 0,
		stepsObj = $('#get-started-pu .step-no');

	// determines the current step
	stepsObj.each(function(i) {
		if ($(this).hasClass('step-active') == true) {
			currentStep = i;
			return false;
		};
	});

	if ($(this).attr('data-traverse-dir') == 'forward') {
		if (currentStep+1 < stepsObj.length) {
			// shifts 'step-active' to the next step-no
			$('#get-started-pu .step-no:eq('+currentStep+')').removeClass('step-active').next().addClass('step-active');

			// adds/removes 'hide' to corresponding step-section
			$('#get-started-pu .step-section').each(function(i) {
				if (i == currentStep+1) {
					$(this).removeClass('hide');
				}
				else {
					$(this).addClass('hide');
				}
			});

			// current step first step, remove 'disabled' class of button
			if (currentStep == 0) {
				$(this).prev().removeClass('disabled');
			}

			// current step is the 2nd last step, change text to 'Proceed'
			if (currentStep+1 == stepsObj.length-1) {
				$('#get-started-pu .pu-buttons-wrap .button').last().text('Proceed');
			}
		}
	}
	else if ($(this).attr('data-traverse-dir') == 'backward') {
		if (currentStep > 0) {
			// shifts 'step-active' to the previous step-no
			$('#get-started-pu .step-no:eq('+currentStep+')').removeClass('step-active').prev().addClass('step-active');

			// adds/removes 'hide' to corresponding step-section
			$('#get-started-pu .step-section').each(function(i) {
				if (i == currentStep-1) {
					$(this).removeClass('hide');
				}
				else {
					$(this).addClass('hide');
				}
			});

			//current step 2nd step, add 'disabled' class to button
			if (currentStep == 1) {
				$(this).addClass('disabled');
			} 

			// current step is the last step, change text to 'Next'
			if (currentStep+1 == stepsObj.length) {
				$('#get-started-pu .pu-buttons-wrap .button').last().text('Next');
			}
		}		
	}
}

/*------------------------------------------------------------------
                    	Wide Filter Minimizer
------------------------------------------------------------------*/

$('#wf-minimizer').click(toggleFilterOptions);

function toggleFilterOptions() {
	if ($(this).hasClass('collapsed') == false) {
		$('.wide-filter .buttons-wrap, .wide-filter .filter-block:eq(1)').slideUp();
		$(this).addClass('collapsed');
	}
	else {
		$('.wide-filter .buttons-wrap, .wide-filter .filter-block:eq(1)').slideDown();
		$(this).removeClass('collapsed');
	}
}

/*------------------------------------------------------------------
                    	Edit Result Heading
------------------------------------------------------------------*/

$('.result-heading .r-h-icon').click(toggleHeadingEdit);

function toggleHeadingEdit() {
	if ($(this).hasClass('save') == false) {
		$(this).parent().find('[name="result-title"]').val($(this).parent().find('.r-h-title').text());
		$(this).parent().find('[name="result-context"]').val($(this).parent().find('.r-h-context').text());

		$(this).parent().find('.r-h-text').addClass('hide');
		$(this).parent().find('.r-h-edit').removeClass('hide');

		$(this).addClass('save');
	}
	else {
		$(this).parent().find('.r-h-title').text($(this).parent().find('[name="result-title"]').val());
		$(this).parent().find('.r-h-context').text($(this).parent().find('[name="result-context"]').val());

		$(this).parent().find('.r-h-edit').addClass('hide');
		$(this).parent().find('.r-h-text').removeClass('hide');

		$(this).removeClass('save');
	}
}

/*------------------------------------------------------------------
                    	  Temporary Stuff
------------------------------------------------------------------*/




dropdownUpdate('default-drop li');

function dropdownUpdate(txt) {
	var id;
	
	if(txt != 'default-drop li') {
		id = '#' + txt;
	} else {
		id = '.' + txt;
	}
	
	$(id +' li a').attr('href', 'javascript:void(0)').unbind('click').click(function(){		
	//console.log(id);
		$(this).parents('.selectpicker').removeClass('js-dropdown-active').prev().html($(this).text());	
		$(id +' li').removeClass('selected');
		$(this).parent().addClass('selected');
		//$(this).parents('.selectpicker').removeclass('js-dropdown-active').html($(this).text());	
		
	});
	
}


