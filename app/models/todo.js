var mongoose = require('mongoose');


// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Todo', 
	{	title :   String,
		date  :   String,
		priority : 	{ 
			id : String,
			name : String },
		done  :   Boolean
	}
);