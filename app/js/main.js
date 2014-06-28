;(function() {

	var $newItem 	= $('#new-item'),
			$list 		= $('#item-list'),
			$completedList = $('#completed-list');

	window.todolist = {
		initMain: function() {
			window.todolist.attachEvents();
			window.todolist.loadTasks();
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

		loadTasks: function() {
			window.connection.getTasks(function(tasks) {
				window.todolist.renderTasks(tasks);
			});
		},

		saveHandler: function() {
			if($newItem.val() != "") {
				todolist.saveItem($newItem.val());
				$newItem.val("");
			}
		},

		saveItem: function(item) {
			connection.addTask({text: item}, function(insertId) {
				window.connection.getTaskById(insertId, function(item) {
					window.todolist.renderTasks([item]);
				});
			});
		},

		renderTasks: function(tasks) {
			var li;
			for(var i=0; i<tasks.length; i++) {
				li = document.createElement('li');
				li.innerHTML = tasks[i].text + todolist.buildCompleteCheckbox();
				$list.append(li);
			}
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
	window.connection.getTasks();
});
