
//funciones para la gestion del paginado
function pagelist(elem, opts) {
	opts = opts || {};
	opts.items = opts.items || 0;
	opts.itemsOnPage = opts.itemsOnPage || 1;
	opts.currentPage =  opts.currentPage || 1;
	opts.displayedPages = opts.displayedPages || 3;
	opts.prevText = opts.prevText || "<";
	opts.nextText = opts.nextText || ">";

	var _range = function(val, min, max) {
		return Math.min(Math.max(val, min), max);
	};

	var _click = function(pages, page) {
		opts.currentPage = _range(page, 1, pages);
		opts.onClick && opts.onClick(opts.currentPage);
		_self.draw(opts.currentPage);
	};

	var _append = function(elem, pages, page, text) {
		var li = $('<li name="' + page + '"></li>');
		var a = $('<a href="#page-' + page + '">' + (text || page) + '</a>');
		$(elem).append(li.append(a.click(function() { _click(pages, page); })));
	};

	var _self = {
		numItems: function() { return opts.items; },
		setItems: function(i) { opts.items = i; return this; },
		currentPage: function() { return opts.currentPage; },
		setCurrentPage: function(p) { opts.currentPage = p; return this; },
		itemsOnPage: function() { return opts.itemsOnPage; },
		setItemsOnPage: function(l) { opts.itemsOnPage = l; return this; },
		numPages: function() { return Math.ceil(opts.items / opts.itemsOnPage); },
		firstItemOnPage: function(page) { return page ? ((page - 1) * opts.itemsOnPage) : 0; },
		getPageFromIndex: function(i) { return i ? Math.ceil(i / opts.itemsOnPage) : 1; },

		draw: function(page) {
			//inicialize page and sub-treee DOM
			opts.currentPage = page || opts.currentPage;
			while (elem.firstChild) elem.removeChild(elem.firstChild);
			var ul = elem.appendChild(document.createElement("ul"));

			//calc the iterator index and range limits
			var pages = this.numPages();
			opts.currentPage = _range(opts.currentPage, 1, pages);
			var end = _range(opts.currentPage + opts.displayedPages, 0, pages);
			var start = _range(opts.currentPage - opts.displayedPages - 1, 0, end);
			var range = (opts.displayedPages * 2) + 1;
			start = (end == pages) ? Math.max(end - range, 0) : start;
			end = (start == 0) ? Math.min(range, pages) : end;

			//add prev button and first page (if is necesary)
			_append(ul, pages, opts.currentPage - 1, opts.prevText);
			(start > 0) && _append(ul, pages, 1);
			(start > 1) && _append(ul, pages, opts.currentPage - range, "...");

			//iterate over displayed pages
			var i = start * opts.itemsOnPage;
			while ((i < opts.items) && (start < end)) {
				_append(ul, pages, ++start);
				i += opts.itemsOnPage;
			}

			//add next button and last page (if is necesary)
			(end < (pages - 1)) && _append(ul, pages, opts.currentPage + range, "...");
			(end < pages) && _append(ul, pages, pages);
			_append(ul, pages, opts.currentPage + 1, opts.nextText);

			ul.setAttribute("class", "page-list");
			$("li[name='" + opts.currentPage + "']", ul).html(opts.currentPage);
			return this;
		}
	};
	return _self;
};
