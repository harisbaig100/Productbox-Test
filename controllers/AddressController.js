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

    // Get the website title from the URL
    helper.getTitleFromUrl(request.query.address, function (title) {
        // Write the website title in the HTML response
        responseWriter.writeUrlTitle(response, title);
        // Write the footer to end the HTML document
        responseWriter.writeFooter(response);
    });
};