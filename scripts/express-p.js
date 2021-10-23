const express = require('express');

function handleP(verb) {
    return function (...args) {
        function wrap(fn) {
            return async function (req, res, next) {
                try {
                    await fn(req, res, next);
                } catch (e) {
                    next(e);
                }
            }
        }

        let newArgs = args.map(arg => {
            if (typeof arg === "function") {
                return wrap(arg);
            } else {
                return arg;
            }
        });
        this[verb](...newArgs);
    }
}
["use", "all", "get", "post", "options", "delete"].forEach(verb => {
    let handler = handleP(verb);
    express.Router[verb + "P"] = handler;
    express.application[verb + "P"] = handler;
});

module.exports = express;