const helper = require("../utils/helper.js");
const responseWriter = require("../responses/htmlResponseWriter.js");

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
		const totalAddresses = addresses.length;
		addresses.forEach((address, index) => {
			// Get the website title from the URL
			helper.getTitleFromUrl(address, function (title) {
				// Write the website title in the HTML response
				responseWriter.writeUrlTitle(response, title);
				if (index === totalAddresses) {
					console.log(address)
					// Write the footer to end the HTML document if its last element in the Array
					responseWriter.writeFooter(response);
				}
			});
		});
	} 
	else {
		// Get the website title from the URL
		helper.getTitleFromUrl(request.query.address, function (title) {
			// Write the website title in the HTML response
			responseWriter.writeUrlTitle(response, title);
			// Write the footer to end the HTML document
			responseWriter.writeFooter(response);
		});
	}
};