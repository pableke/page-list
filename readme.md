# page-list

Very simply and minified JavaScript closure to implement pagination list.

## Usage

A simple example:
```js
//page-list container
<div id="paginate"></div>

<script type="text/javascript">
	var pl = pagelist($("div#paginate")[0], {
		items: 50,
		itemsOnPage: 5,
		onClick: function(p) {alert("page="+p);}
	}).draw();

	//change the items number listed on page
	setInterval(function() {
		pl.setItemsOnPage(2).draw();
	}, 2000);
</script>
```
## License

(c) 2015-2016 Pablo Rosique, GitHub Inc.
