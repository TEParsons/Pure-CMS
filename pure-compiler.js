class Post extends Element {
	/// Class for a "post" - the contents of an md or html file, represented as html within a <post></post> tag

	constructor(source) {
		super();
		this.setTag("post") // Set custom tag name
		this.setAttribute("src", source); // Store link to file in html object attrs
		this.text = ""; // Read in file and store contents [[[[[[[[HELP]]]]]]]]
		this.innerHTML = this.mdparse(this.text); // Replace contents of this html element with contents of text file
	}
} 

function populate(feed) {
	var source = feed.getAttribute("src"); // Folder containing files to use for posts
	var files = [] // Get list of files in specified folder (this.source) [[[[[[[[HELP]]]]]]]]
	for (var i = 0; i < files.length; i++) {
		feed.appendChild(Post(file)); // For each file, create a Post from it and append it to this html element
	}
}



window.onload = function() {
	var raw = document.getElementsByTagName("feed") // Get all "feed" tags
	for (var i = 0; i < raw.length; i++) {
		populate(raw[i]); // Populate each feed
	}
}