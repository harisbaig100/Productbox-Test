import { assert } from 'chai';
import sinon from 'sinon';
import responseWriter from '../responses/htmlResponseWriter.js';

describe("HTML Response Writer", function () {
    let response;

    beforeEach(function () {
        response = {
            writeHead: sinon.spy(),
            write: sinon.spy(),
            end: sinon.spy(),
            finished: false
        };
    });

    afterEach(function () {
        response = null;
    });

    describe("writeHeader", function () {
        it("should write header to the response", function () {
            responseWriter.writeHeader(response);

            assert(response.writeHead.calledOnceWith(200, { 'Content-Type': 'text/html' }));
            assert(response.write.calledOnce);
            assert(response.write.calledWithMatch(/<html>/));
            assert(response.write.calledWithMatch(/<head>/));
            assert(response.write.calledWithMatch(/<title>Full stack challenge<\/title>/));
            assert(response.write.calledWithMatch(/<\/head>/));
            assert(response.write.calledWithMatch(/<body>/));
            assert(response.write.calledWithMatch(/<h1>Following are the titles of given websites: <\/h1>/));
            assert(response.write.calledWithMatch(/<ul>/));
        });

        it("should not write header if response is already finished", function () {
            response.finished = true;
            responseWriter.writeHeader(response);

            assert(response.writeHead.notCalled);
            assert(response.write.notCalled);
        });
    });

    describe("writeUrlTitle", function () {
        it("should write URL title to the response", function () {
            const title = "Example Title";
            responseWriter.writeUrlTitle(response, title);

            assert(response.write.calledOnceWith(`<li>${title}</li>`));
        });

        it("should not write URL title if response is already finished", function () {
            response.finished = true;
            responseWriter.writeUrlTitle(response, "Example Title");

            assert(response.write.notCalled);
        });
    });

    describe("writeFooter", function () {
        it("should write footer to the response", function () {
            responseWriter.writeFooter(response);

            assert(response.write.calledOnceWithMatch(/<\/ul>/));
            assert(response.write.calledWithMatch(/<\/body>/));
            assert(response.write.calledWithMatch(/<\/html>/));
            assert(response.end.calledOnce);
        });

        it("should not write footer if response is already finished", function () {
            response.finished = true;
            responseWriter.writeFooter(response);

            assert(response.write.notCalled);
            assert(response.end.notCalled);
        });
    });

    describe("noAddressInUrl", function () {
        it("should write message for no address in URL to the response", function () {
            responseWriter.noAddressInUrl(response);

            assert(response.writeHead.calledOnceWith(200, { 'Content-Type': 'text/html' }));
            assert(response.write.calledOnceWithMatch(/No Address Found:/));
            assert(response.write.calledWithMatch(/Please enter address in URL/));
            assert(response.write.calledWithMatch(/<\/ul>/));
            assert(response.end.calledOnce);
        });

        it("should not write message if response is already finished", function () {
            response.finished = true;
            responseWriter.noAddressInUrl(response);

            assert(response.writeHead.notCalled);
            assert(response.write.notCalled);
            assert(response.end.notCalled);
        });
    });
});
