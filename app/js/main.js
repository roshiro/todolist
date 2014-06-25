;(function() {

	var $newItem 	= $('#new-item'),
			$list 		= $('#item-list'),
			$completedList = $('#completed-list');

	window.todolist = {
		initMain: function() {
			todolist.attachEvents();
		},

		attachEvents: function() {
			$newItem.keyup(function(event){
				if(event.keyCode == 13){
					todolist.saveHandler();
				}
			});

			$list.delegate('li input.completed-chk', 'change', function() {
				if($(this).is(":checked")) {
					todolist.markAsComplete($(this).closest('li'));
				}
			});

			$completedList.delegate('li input.completed-chk', 'change', function() {
				if(!$(this).is(":checked")) {
					todolist.markAsIncomplete($(this).closest('li'));
				}
			});

			$newItem.focus();
		},

		saveHandler: function() {
			if($newItem.val() != "") {
				todolist.saveItem($newItem.val());
				$newItem.val("");
			}
		},

		saveItem: function(item) {
			var li = document.createElement('li');
			li.innerHTML = item + todolist.buildCompleteCheckbox();
			$list.append(li);
		},

		markAsComplete: function($elem) {
			$elem.remove();
			$completedList.append($elem);
		},

		markAsIncomplete: function($elem) {
			$elem.remove();
			$list.append($elem);
		},

		buildCompleteCheckbox: function() {
			return "<input type='checkbox' name='complete' class='completed-chk' />"
		}
	}

})();

$(function() {
	window.todolist.initMain();
});
