var xhttp = new XMLHttpRequest();
var fileStruct
xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
   		fileStruct = xhttp.responseText; // Get file structure as json
	}
};
xhttp.open("GET", "struct.php", true);
xhttp.send();

function mdparse(text) {
	/// Function to parse markdown
	return `<markdown>${text}</markdown>`
}

class Post {
	/// Class for a "post" - the contents of an md or html file, represented as html within a <post></post> tag

	constructor(source) {
		this.element = document.createElement("post"); // Create post element
		this.element.setAttribute("src", source)
		var contentGetter = new XMLHttpRequest(); // Create xhttp socket
		var content // Initialise variable to store output in
		var obj = this // Store handle of current object in semi-global var
		contentGetter.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				console.log(source)
   				if (source.endsWith(".md")) {
					// If content is markdown, parse it then add to the HTML node
					obj.element.innerHTML = mdparse(this.responseText); 
				} else {
					// Otherwise, add it verbatim
					obj.element.innerHTML = this.responseText
				}
			}
		};
		// Read in file
		contentGetter.open("GET", source, true);
		contentGetter.send();


	}
} 

function populate(feed) {
	var source = feed.getAttribute("src"); // Folder containing files to use for posts
	var struct = JSON.parse(fileStruct); // Get list of files in specified folder (this.source)
	var posts = struct[source]
	for (var i = 0; i < posts.length; i++) {
		if (posts[i].endsWith(".md") || posts[i].endsWith(".html")) {
			let obj = new Post(`${source}\\${posts[i]}`);
			feed.appendChild(obj.element); // For each file, create a Post from it and append it to this html element
		}
	}
}



window.onload = function() {
	var raw = document.getElementsByTagName("feed") // Get all "feed" tags
	for (var i = 0; i < raw.length; i++) {
		populate(raw[i]); // Populate each feed
	}
}