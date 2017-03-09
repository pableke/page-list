(function($) {
	var settings = { //global config
		items: 0,
		itemsOnPage: 1,
		currentPage: 1,
		displayedPages: 3,
		className: "page-list",
		rangeText: "&hellip;",
		prevText: "&lt;",
		nextText: "&gt;"
	};

	function range(val, min, max) { return Math.min(Math.max(val, min), max); };
	function append(elem, page, actions, text) {
		var li = elem.appendChild(document.createElement("li"));
		var a = $('<a href="#page-' + page + '">' + (text || page) + '</a>');
		$(li).attr("id", "p" + page).append(a.click(function() { actions.click(page); }));
	};

	$.fn.pagelist = function(opts) {
		var self = this; //global reference to jquery list
		opts = $.extend({}, settings, opts || {});
		return { //return actions page-list object
			currentPage: function() { return opts.currentPage; },
			setCurrentPage: function(p) { opts.currentPage = p; return this; },
			numItems: function() { return opts.items; },
			setItems: function(i) { opts.items = i; return this; },
			itemsOnPage: function() { return opts.itemsOnPage; },
			setItemsOnPage: function(l) { opts.itemsOnPage = l; return this; },
			firstItemOnPage: function(page) { return page ? ((page - 1) * opts.itemsOnPage) : 0; },
			getPageFromIndex: function(i) { return i ? Math.ceil(i / opts.itemsOnPage) : 1; },
			numPages: function() { return Math.ceil(opts.items / opts.itemsOnPage); },
			draw: function(page) {
				//get iterator index and range limits
				var pages = this.numPages(); //number of pages
				page = page || opts.currentPage; //set default page number
				page = opts.currentPage = range(page, 1, pages); //page starts in 1
				var end = range(page + opts.displayedPages, 0, pages); //last page
				var start = range(page - opts.displayedPages - 1, 0, end);
				var group = (opts.displayedPages * 2) + 1;
				start = (end == pages) ? Math.max(end - group, 0) : start;
				end = (start == 0) ? Math.min(group, pages) : end;
				var actions = this;

				self.each(function() {
					//inicialize page and sub-treee DOM
					while (this.firstChild) this.removeChild(this.firstChild);
					var ul = this.appendChild(document.createElement("ul"));

					//add prev button and first page (if is necesary)
					append(ul, page - 1, actions, opts.prevText);
					(start > 0) && append(ul, 1, actions);
					(start > 1) && append(ul, page - group, actions, opts.rangeText);

					//iterate over displayed pages
					var i = start * opts.itemsOnPage;
					for (var j = start; (i < opts.items) && (j < end); ) {
						append(ul, ++j, actions);
						i += opts.itemsOnPage;
					}

					//add next button and last page (if is necesary)
					(end < (pages - 1)) && append(ul, page + group, actions, opts.rangeText);
					(end < pages) && append(ul, pages, actions);
					append(ul, page + 1, actions, opts.nextText);

					ul.setAttribute("class", opts.className);
					$("li#p" + page, ul).text(page);
				});
				return this;
			},
			click: function(page) { opts.onClick && opts.onClick(page); return this.draw(page); },
			end: function() { return self; }
		};
	};
}(jQuery));
