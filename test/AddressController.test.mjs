import { assert } from 'chai';
import sinon from 'sinon';
import http from 'http';
import * as AddressController from '../controllers/AddressController.js';

describe("getWebsiteTitleUsingNode", function () {
    it("should write website titles in HTML response", function () {
        // Mock request and response objects
        const request = { 
            url: "http://example.com/?address=google.com",
            query: {
                address: "google.com"
            }
        };

        const response = {
            writeHead: sinon.spy(),
            writeUrlTitle: sinon.spy(),
            writeFooter: sinon.spy(),
            write: sinon.spy(),
            end: sinon.spy()
        };

        AddressController.getWebsiteTitleUsingNode(request, response);
        assert(response.writeHead.calledOnce);
    });
});