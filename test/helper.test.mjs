import { assert } from 'chai';
import sinon from 'sinon';
import http from 'http';
import * as helper from '../utils/helper.js';

describe("resolveUrl", function () {
    it("should return the input URL", function () {
        const url = "https://www.example.com";
        const result = helper.resolveUrl(url, function (resolvedUrl) {
            return resolvedUrl;
        });
        assert.strictEqual(result, url);
    });
});

describe("getTitleFromUrl", function () {
    let httpGetStub;

    beforeEach(function () {
        httpGetStub = sinon.stub(http, "get");
    });

    afterEach(function () {
        httpGetStub.restore();
    });

    it("should return the title for a valid URL that returns a title", function (done) {
        const address = "google.com";
        const expectedTitle = "Google";
        const responseStub = {
            statusCode: 200,
            on: function (event, callback) {
                if (event === "data") {
                    callback(`<title>${expectedTitle}</title>`);
                } else if (event === "end") {
                    callback();
                }
            }
        };

        httpGetStub.callsFake(function (url, callback) {
            callback(responseStub);
            return {
                on: function () { }
            };
        });

        helper.default.getTitleFromUrl(address, function (title) {
            assert.strictEqual(title, `${address} - "${expectedTitle}"`);
            done();
        });
    });
});
