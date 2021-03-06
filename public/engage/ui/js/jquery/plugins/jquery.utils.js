/**
 *  Copyright 2009-2011 The Regents of the University of California
 *  Licensed under the Educational Community License, Version 2.0
 *  (the "License"); you may not use this file except in compliance
 *  with the License. You may obtain a copy of the License at
 *
 *  http://www.osedu.org/licenses/ECL-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an "AS IS"
 *  BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 *  or implied. See the License for the specific language governing
 *  permissions and limitations under the License.
 *
 */

/**
 * @description jQuery plugin for useful utility functions
 */
(function ($)
{
    var loggingEnabled = false;
    var asciiAlphabet;
    var asciiAlphabetCashed = false;
    
    /**
     * @description Returns the ascii alphabet lower case (internal function for cashing)
     * @return the alphabet lower case
     */
    function getAsciiAlphabet_internal()
    {
        var fullAscii = new Array();
        for(var i = 0; i <= 255; ++i)
        {
            fullAscii[String.fromCharCode(i)] = i;
        }
        return fullAscii;
    }
    
    /**
     * @description Returns the ascii alphabet lower case
     * @return the alphabet lower case
     */
    $.getAsciiAlphabet = function()
    {
        if(!asciiAlphabetCashed)
        {
            // Cashe ASCII alphabet
            asciiAlphabet = getAsciiAlphabet_internal();
            asciiAlphabetCashed = true;
        }
        return asciiAlphabet;
    }
    
    /**
     * @description Returns the ASCII value of char
     * @param char Character to get the ASCII value from
     * @return the ASCII value of char
     */
    $.toAscii = function(charToConvert)
    {
        return $.getAsciiAlphabet()[charToConvert]||'';
    }
   
    /**
     * @description Returns a time in the URL time format, e.g. 30m10s
     * @param data Time in the format ab:cd:ef
     * @return data in the URl time format when data correct, 0 else
     */
    $.getURLTimeFormat = function(data)
    {
        if ((data !== undefined) && (data !== null) && (data != 0) && (data.length) && (data.indexOf(':') != -1))
        {
            var values = data.split(':');
            // If the Format is correct
            if (values.length == 3)
            {
                // Try to convert to Numbers
                var val0 = values[0] * 1;
                var val1 = values[1] * 1;
                var val2 = values[2] * 1;
                // Check and parse
                if (!isNaN(val0) && !isNaN(val1) && !isNaN(val2))
                {
		    var valMin = val0 * 60 + val1;
		    return valMin + "m" + val2 + "s";
		}
	    }
	}
	return 0;
    }
        
    /**
     * @description Returns the Input Time in Milliseconds
     * @param data Data in the Format ab:cd:ef
     * @return Time from the Data in Milliseconds
     */
    $.getTimeInMilliseconds = function(data)
    {
        if ((data !== undefined) && (data !== null) && (data != 0) && (data.length) && (data.indexOf(':') != -1))
        {
            var values = data.split(':');
            // If the Format is correct
            if (values.length == 3)
            {
                // Try to convert to Numbers
                var val0 = values[0] * 1;
                var val1 = values[1] * 1;
                var val2 = values[2] * 1;
                // Check and parse the Seconds
                if (!isNaN(val0) && !isNaN(val1) && !isNaN(val2))
                {
                    // Convert Hours, Minutes and Seconds to Milliseconds
                    val0 *= 60 * 60 * 1000; // 1 Hour = 60 Minutes = 60 * 60 Seconds = 60 * 60 * 1000 Milliseconds
                    val1 *= 60 * 1000; // 1 Minute = 60 Seconds = 60 * 1000 Milliseconds
                    val2 *= 1000; // 1 Second = 1000 Milliseconds
                    // Add the Milliseconds and return it
                    return val0 + val1 + val2;
                }
            }
        }
        return 0;
    }
    
    /**
     * @description Returns formatted Seconds
     * @param seconds Seconds to format
     * @return formatted Seconds
     */
    $.formatSeconds = function(seconds)
    {
        if (seconds === null)
        {
            seconds = 0;
        }
        var result = "";
        seconds = (seconds < 0) ? 0 : seconds;
        if (parseInt(seconds / 3600) < 10)
        {
            result += "0";
        }
        result += parseInt(seconds / 3600);
        result += ":";
        if ((parseInt(seconds / 60) - parseInt(seconds / 3600) * 60) < 10)
        {
            result += "0";
        }
        result += parseInt(seconds / 60) - parseInt(seconds / 3600) * 60;
        result += ":";
        if (seconds % 60 < 10)
        {
            result += "0";
        }
        result += seconds % 60;
        return result;
    }
    
    /**
     * @description Converts a date to a human readable date string
     * @param date
     * @return formatted date string
     */
    $.getDateString = function(date)
    {
        var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var daySeparator = ", ";
        var dateSeparator = " ";
        var yearSeparator = " ";
        var d = date;
        var datestring = days[(d.getDate() + 1) % 7];
        datestring += daySeparator;
        datestring += months[d.getMonth() % 12];
        datestring += dateSeparator;
        datestring += (d.getDate() >= 10) ? d.getDate() : "0".concat(d.getDate());
        datestring += yearSeparator;
        datestring += d.getFullYear();
        return datestring;
    }
    
    /**
     * @description Converts a date to a human readable time string
     * @param date
     * @return formatted time string
     */
    $.getTimeString = function(date)
    {
        var timeSeparator = ":";
        var d = date;
        var h = (d.getHours() >= 10) ? d.getHours() : "0".concat(d.getHours());
        var m = (d.getMinutes() >= 10) ? d.getMinutes() : "0".concat(d.getMinutes());
        var s = (d.getSeconds() >= 10) ? d.getSeconds() : "0".concat(d.getSeconds());
        return (h + timeSeparator + m);
    }
    
    /**
     * @description Converts a UTC date string to date
     * @param dcc UTC date string, e.g. dcc = 2011-03-07T00:00:00+01:00
     * @return date
     */
    $.dateStringToDate = function(dcc)
    {
        var date = new Date(0);
        if (dcc.indexOf('T') != -1)
        {
            var dateTime = dcc.slice(0, -1).split("T");
            if (dateTime.length >= 2)
            {
                var ymd = dateTime[0].split("-");
                if (ymd.length >= 3)
                {
                    date.setUTCFullYear(parseInt(ymd[0], 10));
                    date.setUTCMonth(parseInt(ymd[1], 10) - 1);
                    date.setUTCDate(parseInt(ymd[2], 10));
                }
                var hms = dateTime[1].split(":");
                if (hms.length >= 3)
                {
                    date.setUTCMilliseconds(0);
                    date.setUTCHours(parseInt(hms[0], 10));
                    date.setUTCMinutes(parseInt(hms[1], 10));
                    date.setUTCSeconds(parseInt(hms[2], 10));
                }
            }
        }
        return date;
    }
    
    /**
     * @description Returns an Array of URL Arguments
     * @return an Array of URL Arguments if successful, [] else
     */
    $.parseURL = function()
    {
        var vars = [],
            hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        if ($.isArray(hashes))
        {
            for (var i = 0; i < hashes.length; i++)
            {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
        }
        return vars;
    }
    
    /**
     * @description Removes the duplicates of a given array
     * @param arr Array to remove the duplicates of
     * @return a copy of arr wihout its duplicates if arr is a valid array, [] else
     */
    $.removeDuplicates = function(arr)
    {
        var newArr = [];
        // check whether arr is an Array
        if ($.isArray(arr))
        {
            var ni = 0;
            var dupl = false;
            for (var i = 0; i < arr.length; ++i)
            {
                for (var j = i + 1;
                (j < arr.length) && !dupl; ++j)
                {
                    if (arr[i] == arr[j])
                    {
                        dupl = true;
                    }
                }
                if (!dupl)
                {
                    newArr[ni] = arr[i];
                    ++ni;
                }
                dupl = false;
            }
        }
        return newArr;
    }
    
    /**
     * @description Returns the url array to string, connected via links
     * @param arr URL Array (e.g. created via parseURL())
     * @param link11 first link (e.g. comes directly after the .html: ?)
     * @param link12 second link, connects the parameters (e.g. &)
     * @param link2 third link, connects the first and the second value of an URL parameter (e.g. =)
     * @return the url array to string, connected via links, if arr is a valid array, '' else
     */
    $.urlArrayToString = function(arr, link11, link12, link2)
    {
        var str = '';
        // check whether arr is an Array
        if ($.isArray(arr))
        {
            // Set default values if nothings given
            link11 = link11 || '?';
            link12 = link12 || '&';
            link2 = link2 || '=';
            for (var i = 0; i < arr.length; ++i)
            {
                var parsedUrlAt = $.getURLParameter(arr[i]);
                if ((parsedUrlAt !== undefined) && (parsedUrlAt !== null))
                {
                    var l = (i == 0) ? link11 : link12;
                    str += l + arr[i] + link2 + $.parseURL()[arr[i]];
                }
            }
        }
        return str;
    }
    
    /**
     * @description Removes the duplicate URL parameters, e.g. url?a=b&a=c&a=d => url?a=d
     * @return a cleaned URL
     */
    $.getCleanedURL = function()
    {
        var urlArr = $.removeDuplicates($.parseURL());
        var windLoc = window.location.href;
        windLoc = (windLoc.indexOf('?') != -1) ? window.location.href.substring(0, window.location.href.indexOf('?')) : windLoc;
        return windLoc + $.urlArrayToString(urlArr, "?", "&", "=");
    }
    
    /**
     * @description Checks whether URL parameters are duplicate and cleans it if appropriate (clean => page reload)
     */
    $.gotoCleanedURL = function()
    {
        var loc = window.location;
        var newLoc = $.getCleanedURL();
        // If necessary: remove duplicate URL parameters
        if (loc != newLoc)
        {
            window.location = newLoc;
        }
    }

    /**
     * @description Returns a clean URL only containing the ID
     * @return a clean URL only containing the ID
     */
    $.getCleanURL = function()
    {
	var url = window.location.href;
	var id = $.getURLParameter('id');
	url = url.substring(0, url.indexOf('?')) + "?id=" + id;
	return url;
    }
    
    /**
     * @description Checks whether URL parameters are duplicate and cleans it if appropriate and returns the cleaned URL afterwards
     * @param embed true if watch.html should be replaced with embed.html, false if embed.html should be replaced with watch.html
     * @param withTime true if adding the current Time, false else
     * @param videoQuality the videoQuality if available, false else
     * @param okay true if play URL parameter sould be set to true, false else
     */
    $.getCleanedURLAdvanced = function(embed, withTime, videoQuality, play)
    {
        embed = embed||false;
        withTime = withTime||false;
        videoQuality = videoQuality||false;
        play = (play == true) ? true : false;
        if(withTime)
        {
            // add time to link "open in advanced player"
            var seconds = parseInt($.getTimeInMilliseconds(Opencast.Player.getCurrentTime())) / 1000;
        }
        // parse URL string -- modified version of $.parseURL-module
        var vars = [],
            hash,
            str = window.location.href + ((videoQuality != false) ? ("&quality=" + videoQuality) : '') + (withTime ? ("&t=" +  seconds) : '');
        var hashes = str.slice(str.indexOf('?') + 1).split('&');
        if ($.isArray(hashes))
        {
            for (var i = 0; i < hashes.length; i++)
            {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
        }
        var urlArr = $.removeDuplicates(vars);
        var windLoc = window.location.href;
        windLoc = (windLoc.indexOf('?') != -1) ? window.location.href.substring(0, window.location.href.indexOf('?')) : windLoc;
        // URL parameter array to string
        var str = '';
        for (var i = 0; i < urlArr.length; ++i)
        {
            var l = (i == 0) ? '?' : '&';
            var parsedUrlAt = $.getURLParameter(urlArr[i]);
            if ((parsedUrlAt !== undefined) && (parsedUrlAt !== null) && (urlArr[i] != 'quality') && (urlArr[i] != 't') && (urlArr[i] != 'play'))
            {
                str += l + urlArr[i] + '=' + $.parseURL()[urlArr[i]];
            } else if((videoQuality != false) && (urlArr[i] == 'quality'))
            {
                str += l + urlArr[i] + "=" + videoQuality;
            } else if(urlArr[i] == 'play')
            {
                str += l + urlArr[i] + "=" + (play ? "true" : "false");
            } else if(withTime && (urlArr[i] == 't'))
            {
                str += l + urlArr[i] + "=" + seconds;
            }
        }
        return (embed ? windLoc.replace(/watch.html/g, 'embed.html') : windLoc.replace(/embed.html/g, 'watch.html')) + str;
    }
    
    /**
     * @description Returns the value of URL-Parameter 'name'
     *              Current used URL Parameters:
     *                  - id:               the current media package id
     *                  - user:             the user id
     *                  - play:             autoplay, true or false
     *                  - videoUrl:         the current url for video (1)
     *                  - videoUrl2:        the current url for video 2
     *                  - coverUrl:         the current url for cover (preview image)
     *                  - t:                jump to given time
     *                                          Valid Parameter Formats (as seen at $.parseSeconds):
     *                                              - Minutes and seconds:  XmYs    or    YsXm    or    XmY
     *                                              - Minutes only:         Xm
     *                                              - Seconds only:         Ys      or    Y
     *                  - videomode/vmode:  The Video Mode (videomode preferred to vmode)
     *                                          Valid Parameters:
     *                                              - streaming (default)
     *                                              - progressive
     *                  - display:          the display alignment
     *                                          Valid Parameter:
     *                                              - invert
     *                  - quality:          the video quality
     *                                          Valid Parameters:
     *                                              - low
     *                                              - medium
     *                                              - high
     *                                              - hd
     * @return the value of URL-Parameter 'name' or null if not defined
     */
    $.getURLParameter = function(name)
    {
        var urlParam = $.parseURL()[name];
        if ((urlParam === undefined) || (urlParam === ''))
        {
            return null;
        }
        return urlParam;
    }
    
    /**
     * @description Parses Seconds
     *
     * Format: Minutes and seconds:  XmYs    or    YsXm    or    XmY
     *         Minutes only:         Xm
     *         Seconds only:         Ys      or    Y
     *
     * @return parsed Seconds if parsing was successfully, 0 else
     */
    $.parseSeconds = function(val)
    {
        if ((val !== undefined) && !(val == ""))
        {
            // Only Seconds given
            if (!isNaN(val))
            {
                return val;
            }
            var tmpVal = val + "";
            var min = -1,
                sec = -1;
            var charArr = tmpVal.split("");
            var tmp = "";
            for (var i = 0; i < charArr.length; ++i)
            {
                // If Minutes-Suffix detected
                if (charArr[i] == "m")
                {
                    if (!isNaN(tmp))
                    {
                        min = parseInt(tmp);
                    }
                    else
                    {
                        min = 0;
                    }
                    tmp = "";
                }
                // If Seconds-Suffix detected
                else if (charArr[i] == "s")
                {
                    if (!isNaN(tmp))
                    {
                        sec = parseInt(tmp);
                    }
                    else
                    {
                        sec = 0;
                    }
                    tmp = "";
                }
                // If any Number detected
                else if (!isNaN(charArr[i]))
                {
                    tmp += charArr[i];
                }
            }
            if (min < 0)
            {
                min = 0;
            }
            if (sec < 0)
            {
                // If Seconds without 's'-Suffix
                if (tmp != "")
                {
                    if (!isNaN(tmp))
                    {
                        sec = parseInt(tmp);
                    }
                    else
                    {
                        sec = 0;
                    }
                }
                else
                {
                    sec = 0;
                }
            }
            var ret = min * 60 + sec;
            if (!isNaN(ret))
            {
                return ret;
            }
        }
        return 0;
    }
    
    /**
     * @description create date in format MM/DD/YYYY
     * @param timeDate Time and Date
     */
    $.getLocaleDate = function(timeDate)
    {
        timeDate = (typeof timeDate === 'string') ? timeDate.substring(0, 10) : "n.a.";
        return timeDate;
    }
    
    /**
     * @description Returns a random Number in between [min, max]
     * @param min Min Value
     * @param max Max Value
     * @return a random Number in between [min, max]
     */
    $.getRandom = function(min, max)
    {
        if (min > max)
        {
            return max;
        }
        if (min == max)
        {
            return min;
        }
        return (min + parseInt(Math.random() * (max - min + 1)));
    }
    
    /**
     * @description Returns if 'haystack' starts with 'start'
     * @param haystack String to search in
     * @param start String to search for
     * @return true if 'haystack' starts with 'start', false else
     */
    $.startsWith = function(haystack, start)
    {
        if ((typeof(haystack) == 'string') && (typeof(start) == 'string'))
        {
            return (haystack.substring(0, start.length).indexOf(start) != -1);
        }
        return false;
    }
    
    /**
     * @description Enables or disables the Logs
     * @param true for enabling Logs, false else
     */
    $.enableLogging = function(logEnabled)
    {
        loggingEnabled = logEnabled||false;
    }
    
    /**
     * @description Returns whether logging is enabled or not
     * @param true for logging is enabled, false else
     */
    $.loggingEnabled = function()
    {
        return loggingEnabled;
    }
    
    /**
     * @description Logs given arguments -- uses console.log; does NOT check loggingEnabled
     * @param any arguments console.log-valid
     * @return true if window.console exists and arguments had been logged, false else
     */
    $.logX = function()
    {
        if(window.console)
        {
            try
            {
                window.console && console.log.apply(console, Array.prototype.slice.call(arguments));
            }
            catch(err)
            {
                console.log(err);
            }
            return true;
        }
        return false;
    }
    
    /**
     * @description Logs given arguments -- uses console.log
     * @param any arguments console.log-valid
     * @return true if window.console exists and arguments had been logged, false else
     */
    $.log = function()
    {
        if(loggingEnabled && window.console)
        {
            try
            {
                window.console && console.log.apply(console, Array.prototype.slice.call(arguments));
            }
            catch(err)
            {
                console.log(err);
            }
            return true;
        }
        return false;
    }
})(jQuery);
