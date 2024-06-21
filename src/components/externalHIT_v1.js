/**
 * Gets a URL parameter from the query string
 */
export function turkGetParam( name, defaultValue ) { 
    var regexS = "[\?&]"+name+"=([^&#]*)"; 
    var regex = new RegExp( regexS ); 
    var tmpURL = window.location.href; 
    var results = regex.exec( tmpURL ); 
    console.log(name, results, defaultValue)
    if( results == null ) { 
      return defaultValue; 
    } else { 
      return results[1];    
    } 
 }
 
 /**
  * URL decode a parameter
  */
 function decode(strToDecode)
 {
   var encoded = strToDecode;
   return unescape(encoded.replace(/\+/g,  " "));
 }
 
 
 /**
  * Returns the Mechanical Turk Site to post the HIT to (sandbox. prod)
  */
export function turkGetSubmitToHost() {
     var host = "https://www.mturk.com";
     var submitToHost = decode(turkGetParam("turkSubmitTo", host));
     if (stringStartsWith(submitToHost, "https://")) {
         host = submitToHost;
     }
     if (stringStartsWith(submitToHost, "http://")) {
         host = submitToHost;
     }
     if (stringStartsWith(submitToHost, "//")) {
         host = submitToHost;
     }
     console.log('host', host)
     return host + "/mturk/externalSubmit";
 }
 
 
 /**
  * Sets the assignment ID in the form. Defaults to use mturk_form and submitButton
  */ 
export function turkSetAssignmentID( form_name, button_name ) {
    if (window.location.hostname === "localhost") {
      return;
    }
 
   if (form_name == null) {
     form_name = "mturk_form";
   }
 
   if (button_name == null) {
     button_name = "submitButton";
   }
 
   assignmentID = turkGetParam('assignmentId', "");
   document.getElementById('assignmentId').value = assignmentID;
 
   if (assignmentID == "ASSIGNMENT_ID_NOT_AVAILABLE") { 
     // If we're previewing, disable the button and give it a helpful message
     btn = document.getElementById(button_name);
     if (btn) {
       btn.disabled = true; 
       btn.value = "You must ACCEPT the HIT before you can submit the results.";
     } 
   }
 
   form = document.getElementById(form_name); 
   if (form) {
      form.action = turkGetSubmitToHost(); 
   }
 }
 
 // Inlined functionality for String.startsWith as IE does not support that method.
 // Function body from:
 // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith#Polyfill
 function stringStartsWith(str, search, pos) {
     pos = (!pos || pos < 0) ? 0 : +pos;
     return str.substring(pos, pos + search.length) === search;
 }
 