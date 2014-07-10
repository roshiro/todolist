;(function() {

	var $newItem 	= $('#new-item'),
			$list 		= $('#item-list'),
			$completedList = $('#completed-list'),
			$menu = $('#left-menu');

	window.todolist = {
		initMain: function() {
			window.todolist.attachEvents();
			window.todolist.loadTasks();
			window.todolist.attachLeftMenuEvents();
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

		attachLeftMenuEvents: function() {
			$menu.find('li').delegate('a','click', function(ev) {
				ev.preventDefault();
				var $li = $(this).parent('li');

				if(!$li.hasClass('active')) {
					$menu.find('li').removeClass('active');
					$li.addClass('active');
					todolist.loadTasks();
				}
			});
		},

		loadTasks: function() {
			var activeListId = todolist.getSelectedListId();

			window.connection.getTasksByList(activeListId, function(tasks) {
				window.todolist.clearTasks();
				window.todolist.renderTasks(tasks);
			});
		},

		getSelectedListId: function() {
			return $menu.find('li.active').attr('data-id');
		},

		saveHandler: function() {
			if($newItem.val() != "") {
				todolist.saveItem($newItem.val(), todolist.getSelectedListId());
				$newItem.val("");
			}
		},

		saveItem: function(item, listId) {
			connection.addTask({text: item, list_id: listId}, function(insertId) {
				window.connection.getTaskById(insertId, function(item) {
					window.todolist.renderTasks([item]);
				});
			});
		},

		renderTasks: function(tasks) {
			var li;
			for(var i=0; i<tasks.length; i++) {
				li = document.createElement('li');
				li.setAttribute('data-id', tasks[i].id);
				if(tasks[i].completed == 0) {
					li.innerHTML = tasks[i].text + todolist.buildCompleteCheckbox(false);
					$list.append(li);
				} else {
					li.innerHTML = tasks[i].text + todolist.buildCompleteCheckbox(true);
					$completedList.append(li);
				}
			}
		},

		clearTasks: function() {
			$list.empty();
			$completedList.empty();
		},

		/**
 		 * Marks the task as completed and move it to the completed list.
		 * @param {HTMLElement} the <li> element of the completed task
		 */
		markAsComplete: function($elem) {
			var id = $elem.attr('data-id');
			window.connection.markAsCompleted(id, (function($elem) {
				$elem.remove();
				$completedList.append($elem);
			})($elem));
		},

		/**
		 * Marks the task as completed and move it to the completed list.
		 * @param {HTMLElement} the <li> element of the completed task
		 */
		markAsIncomplete: function($elem) {
			$elem.remove();
			$list.append($elem);
		},

		/**
		 * Returns a string representing a checkbox DOM element.
		 * @param {Boolean} indicates if the checkbox is checked
		 * @return {String}
		 */
		buildCompleteCheckbox: function(checked) {
			if(checked) {
				return "<input type='checkbox' name='complete' class='completed-chk' checked />"
			} else {
				return "<input type='checkbox' name='complete' class='completed-chk' />"
			}

		}
	}

})();

$(function() {
	window.todolist.initMain();
});
