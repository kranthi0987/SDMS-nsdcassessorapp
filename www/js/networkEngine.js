
// Sample code

//LoginRequest(username, password);
//var userID = localStorage.getItem('assessorID');
//var apikey = localStorage.getItem('apiKey');
//console.log("LocalStorage:" + userID);
//console.log("LocalStorage:" + apikey);
//console.log("token encoded :" + getTokenKey(userID, apikey));





function LoginRequest(username, password, relogin) {
    
    if(testing) {        
        username = "16A18969F"
        password = "pass123$";
    }
    showSpinner()
    $.ajax({
        url: getLoginURL(username, password)
        , dataType: 'json'
        , success: function (response) {
            hideSpinner()
            var result = $.parseJSON(JSON.stringify(response));
            console.log(result)
            localStorage.assessorID = result.assessorID
            localStorage.userName = result.userName
            localStorage.apiKey = result.apiKey
            localStorage["username"] = username
            localStorage["password"] = password
            SetLogin(result.apiKey, result.assessorID, result.userName);
            
                            
            var userID = localStorage.getItem('assessorID');
            var apikey = localStorage.getItem('apiKey');
            console.log("LocalStorage:" + userID);
            console.log("LocalStorage:" + apikey);
            console.log("token encoded :" + getTokenKey(userID, apikey));
            
            
            $("#username").val("")
            $("#password").val("");
            // move to next
            document.querySelector('#myNavigator').pushPage('html/synchronizeAll.html');
        }
        , error: function (xhr, ajaxOptions, thrownError) {
            hideSpinner()
            $("#password").val("")
            console.log("error");
            console.log(xhr.readyState);
            networkErrorHandler(xhr, ajaxOptions, thrownError)
        }
    });
}




function reloginSuccessCommon(response) {
    hideSpinner()
    var result = $.parseJSON(JSON.stringify(response));
    console.log(result)
    localStorage.assessorID = result.assessorID
    localStorage.userName = result.userName
    localStorage.apiKey = result.apiKey
    localStorage["username"] = username
    localStorage["password"] = password
    SetLogin(result.apiKey, result.assessorID, result.userName);


    var userID = localStorage.getItem('assessorID');
    var apikey = localStorage.getItem('apiKey');
    console.log("LocalStorage:" + userID);
    console.log("LocalStorage:" + apikey);
    console.log("token encoded :" + getTokenKey(userID, apikey));


}

function ReLoginRequest(successFunction) {
     
    var username = localStorage["username"]
    var password = localStorage["password"]
    
    showSpinner()
    $.ajax({
        url: getLoginURL(username, password)
        , dataType: 'json'
        , success: successFunction
        , error: function (xhr, ajaxOptions, thrownError) {
            hideSpinner()
            $("#password").val("")
            console.log("error");
            console.log(xhr.readyState);
            networkErrorHandler(xhr, ajaxOptions, thrownError)
        }
    });
}

function getTokenKey() {
    
    var userID = localStorage.getItem('assessorID');
    var apikey = localStorage.getItem('apiKey');
    
    var token = userID + "$" + apikey + "$" + Math.floor(Date.now() / 1000);
    console.log("Token decoded :" + token);
    // Create Base64 Object
    var Base64 = {
            _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
            , encode: function (e) {
                var t = "";
                var n, r, i, s, o, u, a;
                var f = 0;
                e = Base64._utf8_encode(e);
                while (f < e.length) {
                    n = e.charCodeAt(f++);
                    r = e.charCodeAt(f++);
                    i = e.charCodeAt(f++);
                    s = n >> 2;
                    o = (n & 3) << 4 | r >> 4;
                    u = (r & 15) << 2 | i >> 6;
                    a = i & 63;
                    if (isNaN(r)) {
                        u = a = 64
                    }
                    else if (isNaN(i)) {
                        a = 64
                    }
                    t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
                }
                return t
            }
            , decode: function (e) {
                var t = "";
                var n, r, i;
                var s, o, u, a;
                var f = 0;
                e = e.replace(/[^A-Za-z0-9+/=]/g, "");
                while (f < e.length) {
                    s = this._keyStr.indexOf(e.charAt(f++));
                    o = this._keyStr.indexOf(e.charAt(f++));
                    u = this._keyStr.indexOf(e.charAt(f++));
                    a = this._keyStr.indexOf(e.charAt(f++));
                    n = s << 2 | o >> 4;
                    r = (o & 15) << 4 | u >> 2;
                    i = (u & 3) << 6 | a;
                    t = t + String.fromCharCode(n);
                    if (u != 64) {
                        t = t + String.fromCharCode(r)
                    }
                    if (a != 64) {
                        t = t + String.fromCharCode(i)
                    }
                }
                t = Base64._utf8_decode(t);
                return t
            }
            , _utf8_encode: function (e) {
                e = e.replace(/rn/g, "n");
                var t = "";
                for (var n = 0; n < e.length; n++) {
                    var r = e.charCodeAt(n);
                    if (r < 128) {
                        t += String.fromCharCode(r)
                    }
                    else if (r > 127 && r < 2048) {
                        t += String.fromCharCode(r >> 6 | 192);
                        t += String.fromCharCode(r & 63 | 128)
                    }
                    else {
                        t += String.fromCharCode(r >> 12 | 224);
                        t += String.fromCharCode(r >> 6 & 63 | 128);
                        t += String.fromCharCode(r & 63 | 128)
                    }
                }
                return t
            }
            , _utf8_decode: function (e) {
                var t = "";
                var n = 0;
                var r = c1 = c2 = 0;
                while (n < e.length) {
                    r = e.charCodeAt(n);
                    if (r < 128) {
                        t += String.fromCharCode(r);
                        n++
                    }
                    else if (r > 191 && r < 224) {
                        c2 = e.charCodeAt(n + 1);
                        t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                        n += 2
                    }
                    else {
                        c2 = e.charCodeAt(n + 1);
                        c3 = e.charCodeAt(n + 2);
                        t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                        n += 3
                    }
                }
                return t
            }
        }
        // Encode the token to base 64
    var token64 = Base64.encode(token);
    return token64;
}
var username = "16A18969F"
    , password = "pass123$";


function getAllDataAjax(){
//    syncInitData(allDataTest)
    var token = getTokenKey();
    showSpinner()
    var lastSyncDate = "2014-10-08T13:19:50.727";

    if (getDownSync() != "undefined" && getDownSync() != undefined) {
        // var date1=new Date()
        // var date2=new Date(date1)
        // date2.setMinutes ( date1.getMinutes() - 5 );
        lastSyncDate = getDBDate(new Date(getDownSync()))// + ".727"
        console.log("lastSyncDate: " +  lastSyncDate)
    }

    $.ajax({
        url: getAllData(localStorage.getItem('assessorID'), lastSyncDate)
        // url:testJSON.js
        , dataType: 'json'
        , headers: {
            "Authorization-Token" : token       
        } 
        , success: function (response) {
            hideSpinner()
            var result = $.parseJSON(JSON.stringify(response));
            console.log(result)
            if(lastSyncDate == "2014-10-08T13:19:50.727") {
                syncInitData(result, true)
                //  syncInitData(allDataTest, true)
            } else {
                syncInitData(result, false)
                // deleteAssessmentCompleted(currentAssessorBatch.AssessmentID)
                // syncInitData(allDataTest, false)
            }
        }
        , error: function (xhr, ajaxOptions, thrownError) {
            hideSpinner()
            console.log("error");
            console.log(xhr.readyState);
            networkErrorHandler(xhr, ajaxOptions, thrownError)
        }
    });   
}

function updateMarksinServer(dataToPost, successFunction){
    
    var token = getTokenKey();
    showSpinner();
    $.ajax({
        type: "POST"
        ,data: dataToPost
        ,url: setAssessmentResults()
        , dataType: 'json'
        , headers: {
            "Authorization-Token" : token,
            "Content-Type" : "application/json"
        } 
        , success: successFunction
        , error: function (xhr, ajaxOptions, thrownError) {
            hideSpinner()
            console.log("error");
            console.log(xhr.readyState);
            networkErrorHandler(xhr, ajaxOptions, thrownError)
        }
    });
}


function updateUpdateAssessorProfileinServer(dataToPost, successFunction){
    
    var token = getTokenKey();
    showSpinner();
    $.ajax({
        type: "POST"
        ,data: dataToPost
        ,url: getUpdateAssessorProfileURL()
        , dataType: 'json'
        , headers: {
            "Authorization-Token" : token,
            "Content-Type" : "application/json"
        } 
        , success: successFunction
        , error: function (xhr, ajaxOptions, thrownError) {
            hideSpinner()
            console.log("error");
            console.log(xhr.readyState);
            networkErrorHandler(xhr, ajaxOptions, thrownError)
        }
    });
}

function getAgencyProfile(dataToPost, successFunction){
    
    var token = getTokenKey();
    showSpinner();
    $.ajax({
        type: "GET"
        ,url: getAgencyProfileURL()
        , dataType: 'json'
        , headers: {
            "Authorization-Token" : token,
            "Content-Type" : "application/json"
        } 
        , success: successFunction
        , error: function (xhr, ajaxOptions, thrownError) {
            hideSpinner()
            console.log("error");
            console.log(xhr.readyState);
            networkErrorHandler(xhr, ajaxOptions, thrownError)
        }
    });
}

function getAssessorProfile(dataToPost, successFunction){    
    var token = getTokenKey();
    showSpinner();
    $.ajax({
        type: "GET"
        ,url: getAssessorProfileURL()
        , dataType: 'json'
        , headers: {
            "Authorization-Token" : token,
            "Content-Type" : "application/json"
        } 
        , success: successFunction
        , error: function (xhr, ajaxOptions, thrownError) {
            hideSpinner()
            console.log("error");
            console.log(xhr.readyState);
            networkErrorHandler(xhr, ajaxOptions, thrownError)
        }
    });
}

function getDropDowns(dataToPost, successFunction){    
    var token = getTokenKey();
    showSpinner();
    $.ajax({
        type: "GET"
        ,url: getDropDown()
        , dataType: 'json'
        , headers: {
            "Authorization-Token" : token,
            "Content-Type" : "application/json"
        } 
        , success: successFunction
        , error: function (xhr, ajaxOptions, thrownError) {
            hideSpinner()
            
            if (xhr.readyState == 0) {
                alert('can\'t edit with out internet Connection');
                document.querySelector('#myNavigator').popPage();
            } else {           
                
                alert('Something went wrong');
                document.querySelector('#myNavigator').popPage();
                console.log("error");
                console.log(xhr.readyState);
                networkErrorHandler(xhr, ajaxOptions, thrownError)   
            }
        }
    });
}

function addressLookUp(successFunction, pin){    
    var token = getTokenKey();
    showSpinner();
    $.ajax({
        type: "GET"
        ,url: getAddressLookUpURL(pin)
        , dataType: 'json'
        , headers: {
            "Authorization-Token" : token,
            "Content-Type" : "application/json"
        } 
        , success: successFunction
        , error: function (xhr, ajaxOptions, thrownError) {
            hideSpinner()
            
            if (xhr.readyState == 0) {
                alert('can\'t edit with out internet Connection');
                document.querySelector('#myNavigator').popPage();
            } else {           
                
                alert('Something went wrong');
                document.querySelector('#myNavigator').popPage();
                console.log("error");
                console.log(xhr.readyState);
                networkErrorHandler(xhr, ajaxOptions, thrownError)   
            }
        }
    });
}



function stateLookUp(successFunction){    
    var token = getTokenKey();
    showSpinner();
    $.ajax({
        type: "GET"
        ,url: getStateLookUpURL()
        , dataType: 'json'
        , headers: {
            "Authorization-Token" : token,
            "Content-Type" : "application/json"
        } 
        , success: successFunction
        , error: function (xhr, ajaxOptions, thrownError) {
            hideSpinner()
            
            if (xhr.readyState == 0) {
                alert('can\'t edit with out internet Connection');
                document.querySelector('#myNavigator').popPage();
            } else {           
                
                alert('Something went wrong');
                document.querySelector('#myNavigator').popPage();
                console.log("error");
                console.log(xhr.readyState);
                networkErrorHandler(xhr, ajaxOptions, thrownError)   
            }
        }
    });
}



function districtLookUp(successFunction, stateId){    
    var token = getTokenKey();
    showSpinner();
    $.ajax({
        type: "GET"
        ,url: getDistrictLookUpURL(stateId)
        , dataType: 'json'
        , headers: {
            "Authorization-Token" : token,
            "Content-Type" : "application/json"
        } 
        , success: successFunction
        , error: function (xhr, ajaxOptions, thrownError) {
            hideSpinner()
            
            if (xhr.readyState == 0) {
                alert('can\'t edit with out internet Connection');
                document.querySelector('#myNavigator').popPage();
            } else {           
                
                alert('Something went wrong');
                document.querySelector('#myNavigator').popPage();
                console.log("error");
                console.log(xhr.readyState);
                networkErrorHandler(xhr, ajaxOptions, thrownError)   
            }
        }
    });
}




function subDistrictLookUp(successFunction, stateId, distId){    
    var token = getTokenKey();
    showSpinner();
    $.ajax({
        type: "GET"
        ,url: getSubDistrictLookUpURL(stateId, distId)
        , dataType: 'json'
        , headers: {
            "Authorization-Token" : token,
            "Content-Type" : "application/json"
        } 
        , success: successFunction
        , error: function (xhr, ajaxOptions, thrownError) {
            hideSpinner()
            
            if (xhr.readyState == 0) {
                alert('can\'t edit with out internet Connection');
                document.querySelector('#myNavigator').popPage();
            } else {           
                
                alert('Something went wrong');
                document.querySelector('#myNavigator').popPage();
                console.log("error");
                console.log(xhr.readyState);
                networkErrorHandler(xhr, ajaxOptions, thrownError)   
            }
        }
    });
}


function networkErrorHandler(xhr, ajaxOptions, thrownError){
    if (xhr.readyState == 4) {
                // HTTP error (can be checked by xhr.status and xhr.statusText)
                if (xhr.status == 0) {
                    alert('Network Connection Error');
                }
                else if (xhr.status == 400) {
                    if(xhr.responseJSON == "Bad Request. No User Found") {
                        alert("UserName/Password is in correct");
                    }
                }
                else if (xhr.status == 404) {
                    alert('Requested page not found. [404]');
                }
                else if(xhr.status == 403) {
//                    ReLoginRequest(function(){
//                        showSpinner()
//                        reloginSuccessCommon();
//                        updateMarksinServer(dataToPost, successFunction)
//                    })
                    
                    
                    SetLogout()
                    alert("Attention: Same account has been logged in from another device.")
                    document.querySelector('#myNavigator').resetToPage('html/login_page.html');
                }
                else if (xhr.status == 500) {
                    alert('Internal Server Error [500].');
                }
                else if (thrownError === 'parsererror') {
                    alert('Requested JSON parse failed.');
                }
                else if (thrownError === 'timeout') {
                    alert('Time out error.');
                }
                else if (thrownError === 'abort') {
                    alert('Ajax request aborted.');
                }
                else {
                    alert('Uncaught Error.n');
                }
            }
            else if (xhr.readyState == 0) {
                alert('No internet Network Connection Error');
            }
            else {
                console.log("something went wrong");
            }
}