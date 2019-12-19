// Copyright (c) Microsoft Corporation
// All rights reserved. 
// BSD License
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
// disclaimer in the documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE

// Seadragon2.js
// Defines the Seadragon namespace.

/*global Seadragon2: true */
/*jshint strict: false */

/**
 *  The global Seadragon namespace. All Seadragon objects are defined within
 *  this namespace, and this is the only global variable created by Seadragon2.
 *  @module Seadragon2
 */

/**
 *  @class Seadragon2
 *  @private
 *  @static
 */
if (typeof Seadragon2 === "undefined") {
    window.Seadragon2 = {};
}

var SD = Seadragon2, // local reference for the global Seadragon object

    /**
     *  The version string of the currently loaded Seadragon Ajax library.
     *  This takes the form "{major}.{minor}.{bugfix}", e.g. "2.0.3".
     *  @property VERSION
     *  @final
     *  @type string
     */
    SD_VERSION = SD.VERSION = "2.0.pre";  // TODO set dynamically during build

// no documentation necessary, I don't think. this is meant only for cases
// where someone alerts or logs the Seadragon object during debugging.
SD.toString = function () {
    return "Seadragon Ajax v" + SD_VERSION +
        "\nCopyright (c) Microsoft Corp.";
};

// Copyright (c) Microsoft Corporation
// All rights reserved. 
// BSD License
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
// disclaimer in the documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE

// Debug.js
// Defines the Seadragon2.Debug class.

/*global alert, console, SD, SDString_format */
/*jshint strict: false */

var

    /**
     *  A utility class for logging debugging information, warnings and error
     *  messages. Uses the Javascript console if one is present, otherwise
     *  optionally alerts the messages. Supports string formatting and fail-fast
     *  error throwing, and can be fully enabled or disabled.
     *  @class Debug
     *  @namespace Seadragon2
     *  @static
     */
    SDDebug = SD.Debug = {
    
        /**
         *  Whether messages should be alerted, in the case that there's no Javascript
         *  console. The value corresponds to message importance; 1 is errors only, 2
         *  includes warnings, and 3 includes logs.
         *  @property alert
         *  @type boolean
         *  @default 0
         */
        alert: 0,
        
        /**
         *  Whether any messages should be logged or not. If this is zero, all calls
         *  to all methods of this class do nothing, returning immediately. The value
         *  corresponds to message importance; 1 is errors only, 2 includes warnings,
         *  and 3 includes logs.
         *  @property enabled
         *  @type number
         *  @default 3
         */
        enabled: 3
    },

    /**
     *  Logs the given message, optionally formatted with the given arguments, as
     *  an informational message.
     *  @method log
     *  @param {string} msg The message to log.
     *  @param {object*} ...? Any format arguments to apply to the given message.
     */
    SDDebug_log = SDDebug.log = function (msg, varargs) {
        if (SDDebug.enabled < 3) {
            return;
        }

        if (arguments.length > 1) {
            msg = SDString_format.apply(this, arguments);
        }
            
        if ((typeof console !== "undefined") && console.log) {
            console.log(msg);
        } else if (SDDebug.alert >= 3) {
            alert(msg);
        }
    },

    /**
     *  Logs the given message, optionally formatted with the given arguments, as a
     *  warning message.
     *  @method warn
     *  @param {string} msg The message to log.
     *  @param {object*} ...? Any format arguments to apply to the given message.
     */
    SDDebug_warn = SDDebug.warn = function (msg/*, ...*/) {
        if (SDDebug.enabled < 2) {
            return;
        }

        if (arguments.length > 1) {
            msg = SDString_format.apply(this, arguments);
        }

        if ((typeof console !== "undefined") && console.warn) {
            console.warn(msg);
        } else if (SDDebug.alert >= 2) {
            alert(msg);
        }
    },

    /**
     *  Logs the given message as an error message, and throws either the given
     *  error object or a new, empty one, to provide fail-fast behavior.
     *  @method error
     *  @param {string} msg The message to log.
     *  @param {Error} e? The specific error object to throw. If not supplied, a
     *  new, empty error is thrown.
     */
    SDDebug_error = SDDebug.error = function (msg, e) {
        if (SDDebug.enabled < 1) {
            return;
        }
        
        if ((typeof console !== "undefined") && console.error) {
            console.error(msg);
        } else if (SDDebug.alert >= 1) {
            alert(msg);
        }

        throw e || new Error(msg);
    };

// Copyright (c) Microsoft Corporation
// All rights reserved. 
// BSD License
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
// disclaimer in the documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE

// Function.js
// Defines the Seadragon2.Function class.

/*global SD */
/*jshint strict: false, plusplus: false */

var

    /**
     *  A utility class for working with Javascript functions.
     *  @class Function
     *  @namespace Seadragon2
     *  @static
     */
    SDFunction = SD.Function = {},
    
    SDFunction_EMPTY = SDFunction.EMPTY = function () {
        // nothing to do, simply returns undefined
    },

    /**
     *  <p>
     *  Returns a function that, when called, calls the given function, with the
     *  given object bound to the <code>this</code> keyword. That is, the value of
     *  <code>this</code> inside the given function will be the given object. In
     *  addition, the returned function passes along any given arguments, in the
     *  order that they were given.
     *  </p>
     *  @method bind
     *  @param {object} obj The object that the given function should bind to; i.e.
     *  the object that should become <code>this</code>.
     *  @param {function} func The function to bind.
     *  @param {varargs} ...? Any arguments that should be passed to the given
     *  function. They will be prepended to any arguments passsed to the returned
     *  function.
     *  @return {function} A function that, when called, calls the given function
     *  with the given object bound to <code>this</code>, passing along all given
     *  arguments in the order they were given.
     */
    /**
     *  Calls <code>bind</code> with a method on the given object, using the given
     *  method name to get the method. For example, calling
     *  <code>bind(obj, "toString")</code> is equivalent to, but less verbose and
     *  redundant than, calling <code>bind(obj, obj.toString)</code>.
     *  @method bind&nbsp;
     *  @param {object} obj See above.
     *  @param {string} methodName The name of the method on the given object to
     *  bind.
     *  @param {object*} ...? See above.
     *  @return {function} See above.
     */
    SDFunction_bind = SDFunction.bind = function (obj, func, varargs) {
        var args = new Array(arguments.length - 2), i, numArgs = args.length;

        for (i = 0; i < numArgs; i++) {
            args[i] = arguments[i + 2];
        }

        // support string method names also
        if (typeof func === "string") {
            func = obj[func];
        }

        return function () {
            var i, numArguments = arguments.length;

            for (i = 0; i < numArguments; i++) {
                args.push(arguments[i]);
            }

            func.apply(obj, args);
        };
    },

    /**
     *  Returns a function that, when called, will execute the given function
     *  with the given arguments. Similar to bind, but without the first
     *  argument.
     *  @method callback
     *  @param {function} func The function.
     *  @param {object*} ...? Any arguments to pass when calling the function.
     *  @return {function} A new function that encapsulates the call.
     */
    SDFunction_callback = SDFunction.callback = function (func, varargs) {
        // just bind() without the first object arg...
        var numArguments = arguments.length,
            args = new Array(numArguments + 1),
            i;

        // ...so copy the args with the object arg set to null (that gets
        // translated to the global object in Function.apply)...
        args[0] = null;
        for (i = 0; i < numArguments; i++) {
            args[i + 1] = arguments[i];
        }

        //...and call bind() with the expanded args.
        return SDFunction_bind.apply(SDFunction, args);
    },

    /**
     *  Delay execution of the given function by the given timeout.
     *  @method delay
     *  @param {function} func The function
     *  @param {number} msecs The length of delay, in milliseconds.
     *  @return {function} A function that, when executed, will start the
     *  requested timeout.
     */
    SDFunction_delay = SDFunction.delay = function (func, msecs) {
        return function () {
            setTimeout(SDFunction_bind(this, func), msecs);
        };
    };

// Copyright (c) Microsoft Corporation
// All rights reserved. 
// BSD License
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
// disclaimer in the documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE

// Xml.js
// Defines the Seadragon2.Xml class.

/*global SD */
/*jshint strict: false */

var

    /**
     *  A utility class for fetching and parsing XML.
     *  @class Xml
     *  @namespace Seadragon2
     *  @static
     */
    SDXml = SD.Xml = {};

// Copyright (c) Microsoft Corporation
// All rights reserved. 
// BSD License
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
// disclaimer in the documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE

// Xml_fetch.js
// Defines the Seadragon2.Xml.fetch() method.

/*global SD, SDXml, SDDebug_warn, SDDebug_error, SDFunction_EMPTY, ActiveXObject, XDomainRequest */
/*jshint strict: false */

var

    /**
     *  If the browser supports asynchronous XML requests, asynchronously fetches
     *  the XML at the given URL, calling either the given success callback or the
     *  given failure callback on completion, and returns the browser-specific
     *  XmlHttpRequest object. Otherwise, does nothing and returns null.
     *  @method fetch
     *  @static
     *  @param {string} url The URL of the XML.
     *  @param {function} onSuccess The callback function to use when the XML is
     *  successfully fetched. It will be called with the XmlHttpRequest object set
     *  to "this".
     *  @param {function} onFailure The callback function to use when the XML is
     *  unsuccessfully fetched. It will be called with the XmlHttpRequest object set
     *  to "this".
     *  @param {string} postData Optional. If supplied, this function will do a POST
     *  instead of a GET, and the provided post data will be sent to the server.
     *  @param {string} mimeType Optional. If postData is supplied, then this function
     *  will set the Content-Type request header to the mimeType string if possible.
     *  @return {XmlHttpRequest} The browser-specific XmlHttpRequest object if the
     *  browser supports asynchronous XML requests and the XML is being fetched,
     *  otherwise null.
     */
    SDXml_fetch = SDXml.fetch = (function () {

        // using a closure so that we do the cross-browser (i.e. IE) checks
        // only and exactly once instead of on every request.

        // step 1: create a cross-browser (i.e. IE6) XmlHttpRequest constructor
        var ieOpts = ["Msxml2.XMLHTTP", "Microsoft.XMLHTTP", "Msxml3.XMLHTTP"],
            ieOpt, i, XhrObject, xhrArg,
            hasXDR = typeof XDomainRequest !== "undefined";

        // case 1: W3C standard object
        if (typeof XMLHttpRequest !== "undefined") {
            XhrObject = XMLHttpRequest;
        }

        // case 2: IE6 ActiveX object, but there are multiple options
        else if (typeof ActiveXObject !== "undefined") {
            for (i = 0; i < ieOpts.length; i++) {
                ieOpt = ieOpts[i];
                try {
                    /*jshint nonew: false */
                    new ActiveXObject(ieOpt);
                    /*jshint nonew: true */
                    XhrObject = ActiveXObject;
                    xhrArg = ieOpt;
                    break;
                } catch (e) {
                    SDDebug_warn("Seadragon2.Xml: {0} ActiveX failed.", ieOpt);
                }
            }

            // if no ActiveX worked, we'll fall through to the null function
            if (i >= ieOpts.length) {
                SDDebug_error("Seadragon2.Xml: no ActiveX worked.");
            }
        }

        // case 3: nothing!
        else {
            SDDebug_error("Seadragon2.Xml: no fetching ability.");
        }

        // if nothing, return empty function that signals no request is made
        if (!XhrObject) {
            return SDFunction_EMPTY;
        }

        // note how these functions' closures have no reference to XHR objects;
        // this prevents memory leaks in IE.
        function generateOnXhrReadyStateChange(onSuccess, onFailure) {
            return function () {
                // inside here, "this" refers to the calling XHR object.
                // readyState of 4 means complete
                if (this.readyState !== 4) {
                    return;
                }

                // according to "the" spec (and prototype.js documentation),
                // "success" is defined as empty status or 2xy status.
                // call the appropriate success or failure handler here.
                // Setting xhr to "this" instead of passing it as arg;
                // doing this only for convenience (SDNetwork handler).
                // this may need changing as we port this to other libraries.
                if (this.status === 0 ||
                    (this.status >= 200 && this.status < 300)) {
                    onSuccess.call(this);
                } else {
                    onFailure.call(this);
                }
            };
        }

        // step 2: return the function to actually make the request!
        return function (url, onSuccess, onFailure, postData, mimeType) {
            var xhr = new XhrObject(xhrArg),
                verb = postData ? "POST" : "GET",
                usingXdr = false;

            xhr.onreadystatechange =
                generateOnXhrReadyStateChange(onSuccess, onFailure);

            // remove the fragment, if any (for better caching, but also because
            // IE8- incorrectly send it to the server, resulting in a 404!).
            url = url.replace(/#.*/, '');

            try {
                xhr.open(verb, url, true);     // true for async
            } catch (e) {
                // one possible reason for an exception here is that the request
                // is cross-domain and we're running IE 8 or 9. In that case, we
                // must use XDomainRequest instead of XMLHttpRequest. Note that
                // we can't just use XDRs all the time, since they check the
                // Access-Control-Allow-Origin header even on same-origin requests.
                if (hasXDR) {
                    xhr = new XDomainRequest();
                    xhr.onload = onSuccess;
                    xhr.onerror = onFailure;
                    xhr.timeout = 30000;
                    xhr.ontimeout = function () {};
                    xhr.onprogress = function () {};
                    xhr.open(verb, url);
                    usingXdr = true;
                } else {
                    // we don't know what to do with this exception
                    throw e;
                }
            }

            if (postData && xhr.setRequestHeader) {
                xhr.setRequestHeader("Content-Type", mimeType || "text/plain");
            }

            // I have no clue whatsoever why this makes XDRs work right, but they fail
            // randomly if you don't put them on a new cycle of the event loop like this.
            if (usingXdr) {
                setTimeout(function(){
                    xhr.send(postData || null);     // null for no message body (e.g. POST data)
                }, 0);
            } else {
                xhr.send(postData || null);
            }

            return xhr;
        };

    }());

// Copyright (c) Microsoft Corporation
// All rights reserved. 
// BSD License
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
// disclaimer in the documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE

// Xml_parse.js
// Defines the Seadragon2.Xml.parse() method.

/*global SD, SDXml, SDDebug_error, SDFunction_EMPTY, DOMParser, ActiveXObject */
/*jshint strict: false */

var

    /**
     *  If the browser supports XML, parses the given XML string and returns the
     *  resulting XML Document object. If the browser does not support XML, or if
     *  the given XML string is not well-formed XML, returns null.
     *  @method parse
     *  @static
     *  @param {string} xml The XML string to parse.
     *  @return {XML Document} The resulting XML Document object if the browser
     *  supports XML and the XML was successfully parsed, otherwise null.
     */
    SDXml_parse = SDXml.parse = (function () {
        
        // using a closure so that we do the cross-browser (i.e. IE) checks
        // only and exactly once instead of on every call to this method.
        
        // parsing is very different across browsers (i.e. IE), so returning
        // entirely different functions depending on the browser.
        
        // case 1: W3C DOMParser object
        if (typeof DOMParser !== "undefined") {
            return function (xml) {
                var parser = new DOMParser(),
                    xmlDoc = parser.parseFromString(xml, "text/xml"),
                    xmlRoot = xmlDoc && xmlDoc.documentElement;
                
                // may still silently parse even if not well-formed, but the
                // parsed XML will be <parsererror> XML.
                if (!xmlRoot || xmlRoot.nodeName === "parsererror") {
                    return null;
                }
                
                return xmlDoc;
            };
        }
        
        // case 2: IE ActiveX object
        else if (typeof ActiveXObject !== "undefined") {
            return function (xml) {
                var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                
                xmlDoc.async = false;
                
                // the loadXML() function returns true if successfully parsed,
                // otherwise false, e.g. not well-formed.
                return xmlDoc.loadXML(xml) && xmlDoc;
            };
        }
        
        // case 3: browser doesn't support parsing XML!
        // return empty function that does no parsing
        SDDebug_error("Seadragon2.Xml: no parsing ability.");
        return SDFunction_EMPTY;
        
    }());
