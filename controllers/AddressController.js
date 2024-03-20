const helper = require("../utils/helper.js");
const responseWriter = require("../responses/htmlResponseWriter.js");
const Async = require("async");

exports.getWebsiteTitleUsingNode = function (request, response) {
    // Check if "address=" string is present in the requested URL
    if (!request.url.includes("address=")) {
        // Render error message in HTML and send it back in the response
        responseWriter.noAddressInUrl(response);
        return;
    }

    // Add header to HTML response
    responseWriter.writeHeader(response);
	// Iterate over the array of addresses if multiple addresses are provided.
	if (Array.isArray(request.query.address)) {
		const addresses = request.query.address;
		const addressesLength = addresses.length;
		addresses.forEach((address, index) => {
			// Get the website title from the URL
			helper.getTitleFromUrl(address, function (title) {
				// Write the website title in the HTML response
				responseWriter.writeUrlTitle(response, title);
				if (index === addressesLength) {
					// Write the footer to end the HTML document if its last element in the Array
					responseWriter.writeFooter(response);
				}
			});
		});
	} else {
		// Get the website title from the URL
		helper.getTitleFromUrl(request.query.address, function (title) {
			// Write the website title in the HTML response
			responseWriter.writeUrlTitle(response, title);
			// Write the footer to end the HTML document
			responseWriter.writeFooter(response);
		});
	}
};

exports.getWebsiteTitleUsingAsync = function (request, response) {
    // Check if "address=" string is present in the requested URL
    if (!request.url.includes("address=")) {
        // Render error message in HTML and send it back in the response
        responseWriter.noAddressInUrl(response);
        return;
    }

    // Add header to HTML response
    responseWriter.writeHeader(response);
	// Iterate over the array of addresses if multiple addresses are provided.
	const stack = [];
	if (Array.isArray(request.query.address)) {
		const addresses = request.query.address;

        addresses.forEach(address => {
			// push the callbacks in stack Array for execution in async.parallel
            stack.push(callback => {
                helper.resolveUrl(address, cb => {
                    helper.getTitleFromUrl(cb, title => {
                        callback(null, title);
                    });
                });
            });
        });
    } else {
		// push single call back to stack
		stack.push(callback => {
            helper.getTitleFromUrl(request.query.address, title => {
                callback(null, title);
            });
        });

		// Get the website title from the URL
		helper.getTitleFromUrl(request.query.address, function (title) {
			// Write the website title in the HTML response
			responseWriter.writeUrlTitle(response, title);
			// Write the footer to end the HTML document
			responseWriter.writeFooter(response);
		});
	}

	// Perform asynchronous calls using Async.parallel
    Async.parallel(stack, function (err, titles) {
        if (err) {
            console.error("Error: executing call backs" + err);
            return;
        }

        // Write titles to the HTML response
        titles.forEach(title => {
            responseWriter.writeUrlTitle(response, title);
        });

        // Write the footer to end the HTML document
        responseWriter.writeFooter(response);
    });
};
