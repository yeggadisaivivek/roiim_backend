const { base64encode, base64decode } = require('nodejs-base64');

const str =
	"private-7751:B-qa2-0-5f031cdd-0-302d0214496be84732a01f690268d3b8eb72e5b8ccf94e2202150085913117f2e1a8531505ee8ccfc8e98df3cf1748";
const KEY = base64encode(str);


exports.key= KEY