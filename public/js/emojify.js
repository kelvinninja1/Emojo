// Code for Updating login/logout button //

function main() {
	get('/api/whoami', {}, function(user) {
		updateButton(user);
		window.user = user;
	});

	get('/api/emoji', {}, function(emojis) {
		renderEmojiDB(emojis);
	  });
}


function updateButton(user) {
	if (user._id !== undefined) {
		document.getElementById('log').innerText="LOGOUT😘";
		document.getElementById('log').href="/logout";
		document.getElementById('postBtn').innerText="POST📌";
	}
	else {
		document.getElementById('log').innerText="LOGIN📂";
		document.getElementById('log').href="./auth/google";
		document.getElementById('postBtn').innerText="POST📌 (LOG IN FIRST)";
	}
}

main();

// CODE FOR IMPLEMENTING EMOJIFIER //

window.emojis;
function renderEmojiDB(emojis) {
	window.emojis = emojis;
	// console.log("something");

}

var punct='\\['+ '\\!'+ '\\"'+ '\\#'+ '\\$'+              // since javascript does not
		  '\\%'+ '\\&'+ '\\\''+ '\\('+ '\\)'+             // support POSIX character
		  '\\*'+ '\\+'+ '\\,'+ '\\\\'+ '\\-'+             // classes, we'll need our
		  '\\.'+ '\\/'+ '\\:'+ '\\;'+ '\\<'+              // own version of [:punct:]
		  '\\='+ '\\>'+ '\\?'+ '\\@'+ '\\['+
		  '\\]'+ '\\^'+ '\\_'+ '\\`'+ '\\{'+
		  '\\|'+ '\\}'+ '\\~'+ '\\]';


// FIXME make sure user gives page 2s to get emojiDB before clicking emojifyMyText


// trigger on button click
// let emojifyBtn = document.getElementById("emojifyBtn");
function emojifyMyText() { // function name also used in emojify.html (change carefully)
	// get user plaintext
	let emojifyInputTextbox = document.getElementById("emojify-input");
	let emojifyInput = emojifyInputTextbox.value;
	console.log("user input: ", emojifyInput);
	


	// get toggle state: false = replace; true = add
	let toggleState = document.getElementById("toggle-box").checked;
	console.log("button checked: ", toggleState);

	// console.log("partial: ", fuzzball.partial_ratio("smile", "smiley face"));

	// for each word, find if word in keywords for emoji???
	// for each word, calculate ratio(word, keyword in keywords). return emoji with highest avg ratio???

	// split string into array of words & punctuations
	emojifyInput = emojifyInput.trim(); // remove whitespace on both sides
	emojifyInputArray = tokenize(emojifyInput); // FIXME skip punctuations when searching
	
	console.log("input: ", emojifyInput);
	console.log("array: ", emojifyInputArray);

	console.log(window.emojis);

	addArray	 = [];
	replaceArray = [];

	for (elt in emojifyInputArray) {
		// elt is word or punctuation
		addArray.push(elt);
		console.log("elt: ", elt);		

		if (!punct.includes(elt)) { // elt is word
			for (let emojiDoc in window.emojis) {
				console.log("emojiDoc: ", emojiDoc);
				for (let keyword in emojiDoc['keywords']) {
					console.log("keyword: ", keyword);
					match_partial_ratio = fuzzball.partial_ratio(elt, keyword);
					console.log("partial ratio: ", partial_ratio);
					// TODO generate array of all emoji who fit criteria for word
					if (match_partial_ratio > 95) {
						console.log("add character", emojiDoc['character']);
						addArray.push(emojiDoc['character']);
						// replaceArray.push(emojiDoc['character']);
						// break; // use the 1st emoji that matches word
					}
				}

			}

		}
	}

	// TODO: dropdown list of highest ranking emoji / emoji with partial ratio = 100
	// TODO：when button is toggled / switch text in real time (both texts generated ahead of time)
	// IF REPLACE 
	if (!toggleState) {
		// FIXME: concat(ReplaceArray)
		emojifyInputTextbox.value = "replace";
	}
	// IF ADD
	else {
		// FIXME
		emojifyInputTextbox.value = addArray;
	}
}


function postStory() {
	//TODO: Post to feed. 
	// id="postBtn"
	// store post (copy from catbook)
		// add post to db
		// get timestamp
		// parse tags into array
	let postContent = document.getElementById("emojify-input").value;
	let tags = document.getElementById('choices-text-remove-button').value;
	let tagsArray = tags.split(',');
	//TODO FIX TIME ZONES 
	let currentTime = new Date();
	let currentTimeString = currentTime.toLocaleString();
	data = {
		content: postContent,
		timestamp: currentTimeString,
		tags: tagsArray
	};
	if (window.user._id !== undefined) {
		post('/api/story', data);
		document.getElementById("emojify-input").value="";
		//TODO Does not work properly with the tags input object
		//document.getElementById('choices-text-remove-button').value="";
		alert("You posted Successfully🔥🔥🔥, see your new post🔥🔥🔥 in the FEED or SEARCH page🔥🔥🔥!!!")
	}
	else {
		alert("You must be logged in to post!");
	}
}



	// tokenize(str)
// extracts semantically useful tokens from a string containing English-language sentences
// @param {String}    the string to tokenize
// @returns {Array}   contains extracted tokens


// source: https://gist.github.com/raisch/1018823
function tokenize(str) {

	// var punct='\\['+ '\\!'+ '\\"'+ '\\#'+ '\\$'+              // since javascript does not
	// 		  '\\%'+ '\\&'+ '\\\''+ '\\('+ '\\)'+             // support POSIX character
	// 		  '\\*'+ '\\+'+ '\\,'+ '\\\\'+ '\\-'+             // classes, we'll need our
	// 		  '\\.'+ '\\/'+ '\\:'+ '\\;'+ '\\<'+              // own version of [:punct:]
	// 		  '\\='+ '\\>'+ '\\?'+ '\\@'+ '\\['+
	// 		  '\\]'+ '\\^'+ '\\_'+ '\\`'+ '\\{'+
	// 		  '\\|'+ '\\}'+ '\\~'+ '\\]',
 
		re=new RegExp(                                        // tokenizer
		   '\\s*'+            // discard possible leading whitespace
		   '('+               // start capture group #1
			 '\\.{3}'+            // ellipsis (must appear before punct)
		   '|'+               // alternator
			 '\\w+\\-\\w+'+       // hyphenated words (must appear before punct)
		   '|'+               // alternator
			 '\\w+\'(?:\\w+)?'+   // compound words (must appear before punct)
		   '|'+               // alternator
			 '\\w+'+              // other words
		   '|'+               // alternator
			 '['+punct+']'+        // punct
		   ')'                // end capture group
		 );
 
	// grep(ary[,filt]) - filters an array
	//   note: could use jQuery.grep() instead
	// @param {Array}    ary    array of members to filter
	// @param {Function} filt   function to test truthiness of member,
	//   if omitted, "function(member){ if(member) return member; }" is assumed
	// @returns {Array}  all members of ary where result of filter is truthy
 
	function grep(ary,filt) {
	  var result=[];
	  for(var i=0,len=ary.length;i++<len;) {
		var member=ary[i]||'';
		if(filt && (typeof filt === 'Function') ? filt(member) : member) {
		  result.push(member);
		}
	  }
	  return result;
	}
 
	return grep( str.split(re) );   // note: filter function omitted 
									//       since all we need to test 
									//       for is truthiness
 } // end tokenize()