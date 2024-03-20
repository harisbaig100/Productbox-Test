const helper = require('../utils/helper.js');
const responseWriter = require('../responses/htmlResponseWriter.js');
const Async = require('async');
const RSVP = require('rsvp');
const { from, Observable} = require('rxjs');
const { concatMap, toArray } = require('rxjs/operators');

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

exports.getWebsiteTitleUsingRsvp = function (request, response) {
    // Check if "address=" string is present in the requested URL
    if (!request.url.includes("address=")) {
        // Render error message in HTML and send it back in the response
        responseWriter.noAddressInUrl(response);
        return;
    }

    // Add header to HTML response
    responseWriter.writeHeader(response);
	// Iterate over the array of addresses if multiple addresses are provided.
	const addresses = request.query.address;
	const promises = [];
	if (Array.isArray(request.query.address)) {
		const addressesLength = request.query.address.length;

        addresses.forEach(address => {
            // Push promises for each address
			promises.push(new RSVP.Promise(function(resolve,reject){
				helper.getTitleFromUrl(address,function(title){
					resolve(title);
				});
			}));
        });

        // Resolve all promises and handle responses
		RSVP.all(promises).then(function(responseText){
			responseText.map(function(title){
				// Write the website title in the HTML response
				responseWriter.writeUrlTitle(response, title);
			});
			// Write the footer to end the HTML document
			responseWriter.writeFooter(response);
		});
    } else {
		// promise for single address
		const promise = new RSVP.Promise(function(resolve,reject){
			helper.getTitleFromUrl(addresses,function(title){
				resolve(title);
			});
		});

		// Handle response for single address
		promise.then(function(responseText){
			// Write the website title in the HTML response
			responseWriter.writeUrlTitle(response, responseText);
			// Write the footer to end the HTML document
			responseWriter.writeFooter(response);
		});
	}
};

exports.getWebsiteTitleUsingRxjs = function (request, response) {
    // Check if "address=" string is present in the requested URL
    if (!request.url.includes("address=")) {
        // Render error message in HTML and send it back in the response
        responseWriter.noAddressInUrl(response);
        return;
    }

    // Add header to HTML response
    responseWriter.writeHeader(response);

    // Get the addresses from the request query
    const addresses = Array.isArray(request.query.address) ? request.query.address : [request.query.address];

    // Create an observable from the array of addresses
    const addresses$ = from(addresses);

    // Use concatMap operator to sequentially process each address
    addresses$
        .pipe(
            concatMap(address => {
                // Convert the getTitleFromUrl function into an observable
                return new Observable(observer => {
                    helper.getTitleFromUrl(address, title => {
                        observer.next(title);
                        observer.complete();
                    });
                });
            }),
            // Convert the resulting titles into an array
            toArray()
        )
        .subscribe({
            next: titles => {
                // Write each title to the HTML response
                titles.forEach(title => {
                    responseWriter.writeUrlTitle(response, title);
                });
            },
            complete: () => {
                // Write the footer to end the HTML document
                responseWriter.writeFooter(response);
            },
            error: err => {
                console.error("Error:", err);
            }
        });
};
