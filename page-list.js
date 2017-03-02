
(function($) {
	var self; //all page-lists reference
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
	function draw(elem, page) {
		//inicialize page and sub-treee DOM
		while (elem.firstChild) elem.removeChild(elem.firstChild);
		var ul = elem.appendChild(document.createElement("ul"));

		//calc the iterator index and range limits
		var pages = actions.numPages(); //total number of pages
		page = page || settings.currentPage; //set default page number
		settings.currentPage = range(page, 1, pages); //page 0 not allowed
		var end = range(settings.currentPage + settings.displayedPages, 0, pages); //last page
		var start = range(settings.currentPage - settings.displayedPages - 1, 0, end);
		var group = (settings.displayedPages * 2) + 1;
		start = (end == pages) ? Math.max(end - group, 0) : start;
		end = (start == 0) ? Math.min(group, pages) : end;

		//add prev button and first page (if is necesary)
		append(ul, settings.currentPage - 1, settings.prevText);
		(start > 0) && append(ul, 1);
		(start > 1) && append(ul, settings.currentPage - group, settings.rangeText);

		//iterate over displayed pages
		var i = start * settings.itemsOnPage;
		while ((i < settings.items) && (start < end)) {
			append(ul, ++start);
			i += settings.itemsOnPage;
		}

		//add next button and last page (if is necesary)
		(end < (pages - 1)) && append(ul, settings.currentPage + group, settings.rangeText);
		(end < pages) && append(ul, pages);
		append(ul, settings.currentPage + 1, settings.nextText);

		ul.setAttribute("class", settings.className);
		$("li[name='" + settings.currentPage + "']", ul).text(settings.currentPage);
	};

	function clickOn(page) {
		actions.draw(page); //update list page
		settings.onClick && settings.onClick(settings.currentPage);
	};

	function append(elem, page, text) {
		var li = $('<li name="' + page + '"></li>');
		var a = $('<a href="#page-' + page + '">' + (text || page) + '</a>');
		$(elem).append(li.append(a.click(function() { clickOn(page); })));
	};

	var actions = {
		currentPage: function() { return settings.currentPage; },
		setCurrentPage: function(p) { settings.currentPage = p; return this; },
		numItems: function() { return settings.items; },
		setItems: function(i) { settings.items = i; return this; },
		itemsOnPage: function() { return settings.itemsOnPage; },
		setItemsOnPage: function(l) { settings.itemsOnPage = l; return this; },
		firstItemOnPage: function(page) { return page ? ((page - 1) * settings.itemsOnPage) : 0; },
		getPageFromIndex: function(i) { return i ? Math.ceil(i / settings.itemsOnPage) : 1; },
		numPages: function() { return Math.ceil(settings.items / settings.itemsOnPage); },
		draw: function(page) { self.each(function() { draw(this, page); }); return this; },
		click: function(page) { clickOn(page); return this; },
		end: function() { return self; }
	};

	$.fn.pagelist = function(opts, value) {
		self = this; //global reference to the jquery list
		opts && $.extend(settings, opts); //inicialize settings
		return actions; //return actions page-list object
	};
}(jQuery));
