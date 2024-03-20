const http = require("http");

module.exports = {
	resolveUrl: function(url, callback) {
		return callback(url);
	},
	isValidURL: function(url) {
		// Regular expression to match URLs
		const urlPattern = new RegExp('^(https?:\\/\\/)?' + // protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
			'(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
		
		// Test the URL against the pattern
		return urlPattern.test(url);
	},
    getTitleFromUrl: function (address, sendTitle) {
        // Regular expression to extract the title from the HTML content of the URL
        const regex = /(<\s*title[^>]*>(.+?)<\s*\/\s*title)>/gi;
		// Ensure that "www." and "http://" are included in the URL to prevent invalid URLs
        const addWww = address.includes("www.") ? '' : 'www.';
        const addHttp = address.includes("http://") ? '' : 'http://';
        const url = `${addHttp}${addWww}${address}`;
        if (url.includes(".com") || this.isValidURL(address)) {
			// Using the URL string directly with http.get simplifies the request without custom options
			// because we don't dynamically modify host, path, or port, nor include additional headers.

            http.get(url, function (response) {
                let data = '';
				// if url is accessible get packet and match it to regex to get title
                response.on('data', function (chunk) {
                    data += chunk;
                });

                response.on('end', function () {
                    const match = regex.exec(data);
                    const title = match && match[2] ? match[2] : "Title Not Found";
					// if match[2] is there send that as a title other wise show no title found
                    sendTitle(address + ' - ' + (response.statusCode == 200 ? `"${title}"` : "Title Not Found"));
                });
			// return call back with error if get request having issues
            }).on('error', function (e) {
                sendTitle("Error: " + e.message);
            });
		// return call back with error in case of bad URL
        } else {
            sendTitle(`${address} - NO RESPONSE`);
        }
    }
};
