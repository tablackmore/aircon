/******************************************************************
Copyright (c) 2011 Tom Blackmore
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:

1. Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.
3. The name of the author may not be used to endorse or promote products
   derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
********************************************************************/
var ac = (function() {

    if(window.applicationCache) {
        var appCache = window.applicationCache;
        
        var log = (function() {
            var cacheEvents = [];
            /* event comments taken from
            http://dev.opera.com/articles/view/offline-applications-html5-appcache/ */

            // cached: This is fired when all the resources have finished downloading, and
            // application is cached.
            cacheEvents[0] = 'cached';
            // checking: This gets fired when browser is checking for attempting to download the
            // manifest for the first time, or is checking if there is an updated version of the
            // manifest file.
            cacheEvents[1] = 'checking';
            // downloading: If the browser is downloading the cache for the first time, or if is
            // downloading an updated cache, then this is fired.
            cacheEvents[2] = 'downloading';
            // error: This can be fired for a number of reasons. If the manifest file can't be
            // found, then the application cache download process has to be aborted, in which case
            // this event can be fired. It can also be fired in case the manifest file is present,
            // but any of the files mentioned in the manifest file can't be downloaded properly.
            // It can even be fired in case the manifest file changes while the update is being run
            // (in which case the browser will wait a while before trying again), or in any other
            // case where there is a fatal error.
            cacheEvents[3] = 'error';
            // noupdate: If there is no updated version of the manifest file on the server, then
            // noupdate is fired.
            cacheEvents[4] = 'noupdate';
            // obsolete: This is fired if the manifest file cannot be found (404 error or 410 error).
            cacheEvents[5] = 'obsolete';
            // progress: This is fired for each and every file which is downloaded as part of the
            // AppCache.
            cacheEvents[6] = 'progress';
            // updateready: Once resources have finished re-downloading for an updated cached file,
            // then updateready is called. Once this happens, then we can use swapCache() (as
            // explained later in the article) to make the browser to use this newly updated cache.
            cacheEvents[6] = 'updateready';

            var cacheStatusValues = [];
            /* status comments taken from
            http://dev.opera.com/articles/view/offline-applications-html5-appcache/ */

            // uncached: If the page is not linked to the application cache.
            // Also, the the very first time the application cache is being downloaded,
            // then during the time it is being downloaded, the AppCache will have a status of uncached.
            cacheStatusValues[0] = 'uncached';
            // idle: When the browser has the latest version of the AppCache,
            // and there aren no updated versions to download, then the status is set to Idle.
            cacheStatusValues[1] = 'idle';
            // checking: The duration of when the page is checking for an updated manifest file,
            // then the status is set to Checking.
            cacheStatusValues[2] = 'checking';
            // downloading: The duration of when the page is actually downloading a new cache
            // (if an updated manifest file has been detected), the status is set to downloading
            cacheStatusValues[3] = 'downloading';
            // updateready: Once the browser finishes downloading that new cache,
            // it is ready to be used (but still not being used yet).
            // During this time, the status is set as updateready
            cacheStatusValues[4] = 'updateready';
            // obsolete: In case the manifest file cannot be found, then the status is set to
            // obsolete and the application cache gets deleted. It is important to know, that
            // in case the manifest file (or any file mentioned in the manifest file except
            // those which have a fallback) fail to load, then it will be counted as an error
            // and the old application cache will continue to be used.
            cacheStatusValues[5] = 'obsolete';

            var log = function(s) {
                console.log(s);
            };
            var start = function(func) {
                if(typeof(func) === "function") {
                    log = func;
                }
                var message;
                if(document.getElementsByTagName("HTML")[0].hasAttribute('manifest')) {
                    message = "using: " + document.getElementsByTagName("HTML")[0].manifest;
                } else {
                    message = "No manifest specified in HTML tag";
                }

                log("AC: - logging started -");
                log("AC: "  + message);

                for(var i=0; i < cacheEvents.length; i++) {
                    appCache.addEventListener(cacheEvents[i], logEvent, false);
                }
            };
            var stop = function() {
                log("AC: - logging stoped -");
                for(var i=0; i < cacheEvents.length; i++) {
                    appCache.removeEventListener(cacheEvents[i], null, false);
                }
            };
            var isOnline = function() {
                return navigator.onLine;
            };
            var logEvent = function(e) {
                var online, status, type, message;
                online = (isOnline()) ? 'yes' : 'no';
                status = cacheStatusValues[appCache.status];
                type = e.type;
                //message = 'o: ' + online;
                message=  type;
                //message+= ', s: ' + status;
                log('AC: '+ message);

                if (type == 'error' && navigator.onLine) {
                    message = ' There was an unknown error, check your Cache Manifest.';
                    log('AC: Error')
                    log("AC: " + message);
                }
            };
            return {
                start: start,
                stop: stop
            }
        })();
        return {
            log : log
        };
    } else {
        return {
            log : (function() {
                return {
                    start: function() {
                    }
                };
            })()
        };
    }
})();
ac.log.start();