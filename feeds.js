var xhttp = new XMLHttpRequest();
var fileStruct
xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
   		fileStruct = JSON.parse(xhttp.responseText); // Get file structure as json
	}
}
xhttp.open("GET", "struct.php", true);
xhttp.send();

// Assuming a 'markdown-it' global
const md = window.markdownit({
html: true,
xhtmlOut: true,
breaks: false,
linkify: false,
typographer: false,
// highlight: function (/*str, lang*/) { return ''; }
})

function populatePost(text, lang, post) {
	/// Extract parameters from file contents

	// Blank list for output
	var children = []
	if (lang == "md") {
		if (text.startsWith("```")) {
			// If text begin with formatted text block, extract this block's contents
			var splitTxt = text.slice(3).split("```")
			var params = splitTxt[0].replace("\n", "")
			// Create & append markdown object with parsed text
			text = splitTxt.splice(1).join("```")
			post.innerHTML = md.render(text)
			// Parse formatted text block as JSON
			if (params.startsWith("json")) { params = params.slice(4) }
			params = JSON.parse(params)
			// Iterate through each JSON param
			for (var key in params) {
				// Convert JSON param to an HTML param element
				let param = document.createElement("attr");
				param.setAttribute("class", key);
				param.innerHTML = params[key];
				post.appendChild(param)
			}
		}
	} else if (lang == "html") {
		// Get a list of all <param> tags
		var paramStrs = [...text.matchAll(/\<param .*\>/g)]
		// Create & append html object with text
		text = text.replaceAll(/\<param .*\>/g, "")
		post.innerHTML = text
		for (var key in paramStrs) {
			// Extract text content of each tag
			let paramStr = paramStrs[key][0].replace("<param ", "").replace(">", "")
			// Find attributes within each tag
			let attrs = [...paramStr.matchAll(/[^ ]*\=[\"\'].*[\"\']/g)]
			for (var subkey in attrs) {
				// For each attribute, create param element
				let param = document.createElement("attr")
				// Assign attributes
				let attrStr = attrs[subkey][0]
				param.setAttribute("class", attrStr.match(/.*[^ ](?= *\=)/)[0]);
				param.innerHTML = attrStr.match(/.(?<=\= *[\"\'].).*.(?=[\"\'])/)[0];
				// Append param object to output
				post.appendChild(param);
			}
		}
	}
	// Return
	return children
}

class Post {
	/// Class for a "post" - the contents of an md or html file, represented as html within a <post></post> tag

	constructor(source) {
		this.element = document.createElement("post"); // Create post element
		this.element.setAttribute("src", source)
		var contentGetter = new XMLHttpRequest(); // Create xhttp socket
		var content // Initialise variable to store output in
		var obj = this.element // Store handle of current object in semi-global var
		contentGetter.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				// Get content language
				var lang
   				if (source.endsWith(".md")) {
   					lang = "md"
				} else if (source.endsWith(".html")) {
					lang = "html"
				}
				// Populate
				populatePost(this.responseText, lang, obj)
			}
		}
		// Read in file
		contentGetter.open("GET", source, true);
		contentGetter.send();
	}
}

function populate() {
	/// Populate all feeds on the current page

	var raw = document.getElementsByTagName("feed") // Get all "feed" tags
	for (var i = 0; i < raw.length; i++) {
		var feed = raw[i];
		var source = feed.getAttribute("src"); // Folder containing files to use for posts
		var posts = fileStruct[source]; // Get list of files in specified folder (this.source)
		for (var i = 0; i < posts.length; i++) {
			if (posts[i].endsWith(".md") || posts[i].endsWith(".html")) {
				let obj = new Post(`${source}\\${posts[i]}`);
				feed.appendChild(obj.element); // For each file, create a Post from it and append it to this html element
			}
		}
	}
}