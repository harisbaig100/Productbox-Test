const http = require("http");

module.exports = {
    getTitleFromUrl: function (address, sendTitle) {
        // Regular expression to extract the title from the HTML content of the URL
        const regex = /(<\s*title[^>]*>(.+?)<\s*\/\s*title)>/gi;
		// Ensure that "www." and "http://" are included in the URL to prevent invalid URLs
        const addWww = address.includes("www.") ? '' : 'www.';
        const addHttp = address.includes("http://") ? '' : 'http://';
        const url = `${addHttp}${addWww}${address}`;

        if (url.includes(".com")) {
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
                    sendTitle((response.statusCode == 200 ? title : "Title Not Found") + " - " + address);
                });
			// return call back with error if get request having issues
            }).on('error', function (e) {
                sendTitle("Error: " + e.message);
            });
		// return call back with error in case of bad URL
        } else {
            sendTitle("Bad URL || Bad Query");
        }
    }
};
