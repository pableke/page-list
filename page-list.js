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
	function drawPageList(elem, pages, page, actions, settings) {
		//inicialize page and sub-treee DOM
		while (elem.firstChild) elem.removeChild(elem.firstChild);
		var ul = elem.appendChild(document.createElement("ul"));

		//calc the iterator index and range limits
		page = page || settings.currentPage; //set default page number
		page = settings.currentPage = range(page, 1, pages); //page starts in 1
		var end = range(page + settings.displayedPages, 0, pages); //last page
		var start = range(page - settings.displayedPages - 1, 0, end);
		var group = (settings.displayedPages * 2) + 1;
		start = (end == pages) ? Math.max(end - group, 0) : start;
		end = (start == 0) ? Math.min(group, pages) : end;

		//add prev button and first page (if is necesary)
		append(ul, page - 1, actions, settings.prevText);
		(start > 0) && append(ul, 1, actions);
		(start > 1) && append(ul, page - group, actions, settings.rangeText);

		//iterate over displayed pages
		var i = start * settings.itemsOnPage;
		while ((i < settings.items) && (start < end)) {
			append(ul, ++start, actions);
			i += settings.itemsOnPage;
		}

		//add next button and last page (if is necesary)
		(end < (pages - 1)) && append(ul, page + group, actions, settings.rangeText);
		(end < pages) && append(ul, pages, actions);
		append(ul, page + 1, actions, settings.nextText);

		ul.setAttribute("class", settings.className);
		$("li#p" + page, ul).text(page);
	};

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
				var pages = this.numPages();
				self.each(function(i, e) { drawPageList(e, pages, page, this, opts); });
				return this;
			},
			click: function(page) { opts.onClick && opts.onClick(page); return this.draw(page); },
			end: function() { return self; }
		};
	};
}(jQuery));
