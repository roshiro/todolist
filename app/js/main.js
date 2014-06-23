;(function() {

	var $newItem 	= $('#new-item'),
			$list 		= $('#item-list');

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
			li.innerHTML = item;
			$list.append(li);
		},

		deleteItem: function() {

		},

		buildDeleteLink: function() {
			var div = document.createElement('div');
			var link = document.createElement('a');
			link.setAttribute('href', '#');
			link.innerHTML = 'Delete';
			div.appendChild(link);
			return div;
		}
	}

})();

$(function() {
	window.todolist.initMain();
});
