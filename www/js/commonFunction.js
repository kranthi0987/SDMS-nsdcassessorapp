// CONSTANTS
//sanjay time
// var date1= new date();
// getDBDate(date1)


var loginURL = "http://192.168.2.56:3000/api/assessor/login/?assessorId="
// Adding extra abilities to JQUERY
jQuery.expr[':'].Contains = function (a, i, m) {
    return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
};
/* LOGIN Related  functions */
function SetLogin(token, assessorID, assessorName) {
    localStorage[LOGGED_IN_STATUS_NAME] = true;
    localStorage[TOKEN_NAME] = token;
    localStorage[ASSESSOR_ID_NAME] = assessorID;
    localStorage[ASSESSOR_NAME_NAME] = assessorName;
}

function SetLogout() {
    localStorage[LOGGED_IN_STATUS_NAME] = false;
    localStorage[TOKEN_NAME] = "";
    localStorage[ASSESSOR_ID_NAME] = "";
    localStorage[ASSESSOR_NAME_NAME] = "";


    localStorage[DOWN_SYNC_TIME] = undefined

}
//function getTokenKey() {
//    return localStorage[ASSESSOR_ID_NAME] + "$" + localStorage[TOKEN_NAME]
//}
function setInitialSyncCompleted() {
    localStorage[INITIAL_SYNC_COMPLETED_NAME] = true;
}

function getInitialSyncCompleted() {
    return localStorage[INITIAL_SYNC_COMPLETED_NAME] == "true";
}

function startAssessmentAlert() {
    var message = "Are you at the training centre location ?";
    var title = "Confirmation!";
    var buttonLabels = "Cancel,OK";
    navigator.notification.confirm(message, confirmCallback, title, buttonLabels);
    function confirmCallback(buttonIndex) {
        // alert('You selected button cancel ' + buttonIndex);
        if (buttonIndex == 1) {

        }
        if (buttonIndex == 2) {
            document.querySelector('#myNavigator').pushPage('html/home/schedule_candidates.html');

        }
    }
}


function successmarksupdate() {
    var message = "Marks Updated successfully";
    var title = "Success";
    var buttonName = "Ok";
    alert(message)
    document.querySelector('#myNavigator').popPage();
    //    navigator.notification.alert(message, alertCallback, title, buttonName);
    //
    //    function alertCallback() {
    //        document.querySelector('#myNavigator').popPage();
    //    }
}

function setAssessmentReopened(AssessmentID) {
    var data = localStorage["AssessmentReopened"]
    var dataToAppend = AssessmentID + ";" + (new Date()).toString()
    if (data) {
        localStorage["AssessmentReopened"] = localStorage["AssessmentReopened"] + "," + dataToAppend
    } else {
        localStorage["AssessmentReopened"] = dataToAppend
    }
}


function getAssessmentReopenedID() {
    var data = localStorage["AssessmentReopened"]
    if (!data)  return ""
    var dataArray = data.split(",")
    var idArray = []
    for (i = 0; i < dataArray.length; i++) {
        idArray.push(dataArray[i].split(";")[0])
    }
    return idArray
}
function getAssessmentReopenedJSON() {
    var data = localStorage["AssessmentReopened"]
    if (!data)  return ""
    var dataArray = data.split(",")
    var json = {}

    for (i = 0; i < dataArray.length; i++) {
        var temp = dataArray[i].split(";")
        var currentDay = new Date()
        var diff = getDayDifference(currentDay, new Date(temp[1]))
        if (diff >= -1) {
            json[temp[0]] = true;
        } else {
            json[temp[0]] = false;
        }

    }
    return json
}

function setAssessmentCompleted(AssessmentID) {
    var data = localStorage["AssessmentCompleted"]
    if (data) {
        localStorage["AssessmentCompleted"] = localStorage["AssessmentCompleted"] + "," + AssessmentID
    } else {
        localStorage["AssessmentCompleted"] = AssessmentID
    }
}

function getAssessmentCompleted() {
    var data = localStorage["AssessmentCompleted"]
    if (!data)  return ""
    return data
}

function deleteAssessmentCompleted(AssessmentID) {
    AssessmentID = AssessmentID + ""
    var data = localStorage["AssessmentCompleted"]
    if (data) {
        var arr = data.split(",")
        if(contains.call(arr, AssessmentID)) {
            var str = ""
            for (var j = 0; j < arr.length; j++) {
                console.log(arr[j])
                console.log(arr[j] != AssessmentID)
                if(arr[j] != AssessmentID) {
                    if(str == "") {
                        str += arr[j]
                    } else {
                        str += "," + arr[j]
                    }
                }
            }
            localStorage["AssessmentCompleted"] = str
        }
    }
}
function isLoggedIn() {
    if (localStorage["loggedInStatus"] && localStorage["loggedInStatus"] == "true") return true;
    console.log("is logged out user")
    return false;
}

function checkConnection() {
    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.CELL] = 'Cell generic connection';
    states[Connection.NONE] = 'No network connection';
    //    alert('Connection type: ' + states[networkState]);
    if (states[networkState] == 'No network connection') {
        showInternetNotAvailable()
        return false
    }
    return true;
}

function showInternetNotAvailable() {
    alert("No Internet Connectivity");
}

function convertDBDateToJSDate(x) {
    //    var t = "2010-06-09 13:12:01".split(/[- p:]/);
    //
    //// Apply each element to the Date function
    //var d = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));
    //console.log(d);
    //    return d;
    return new Date(Date.parse(x.replace("T", " "), "yyyy-MM-dd HH:mm:ss"));
}

function GetFormattedDate(date) {
    var month = (date.getMonth() + 1);
    var day = (date.getDate());
    var year = (date.getFullYear());
    return month + "/" + day + "/" + year;
}

function getFormattedDateForscreen(date) {
    var d = date
    var f = date
    var m = date
    var dateString = f.getDate() + "-" + month[m.getMonth()].substring(0, 3) + "-" + f.getFullYear()
//    $(".currentDate").html(dateString);
    return dateString
}

function getOverDueText(a, b) {
    dayDiff = getDayDifference(a, b)
    dayDiff = dayDiff + 1
    var overDueText = ""
    if (dayDiff < 0) overDueText = "by " + Math.abs(dayDiff) + " days"
    if (dayDiff > 0) overDueText = "in " + dayDiff + " days"
    if (dayDiff == 1) {
        overDueText = "in " + dayDiff + " day"
        if ((b.getDate() - a.getDate()) == 1) {
            overDueText = "in 2 day"
        }

    }
    if (dayDiff == -1) overDueText = "by " + Math.abs(dayDiff) + " day"
    if (dayDiff == 0) overDueText = "Today"

    return overDueText
}
function getDayDifference(firstDate, secondDate) {
    firstDate.setHours(01)
    secondDate.setHours(01)    
    var oneDay = 24 * 60 * 60 * 1000;
    var diff = ((-firstDate.getTime() + secondDate.getTime()) / (oneDay))
    if (diff > -1 && diff < 1) return 0
    if (diff > 0) return Math.ceil(diff);
    if (diff < 0) return Math.floor(diff)
//    return Math.round(diff);
}
function getDayDifferencev2(firstDate, secondDate) {
    firstDate.setHours(12)
    secondDate.setHours(12)
    var oneDay = 24 * 60 * 60 * 1000;
    var diff = ((-firstDate.getTime() + secondDate.getTime()) / (oneDay))
//    if (diff > -1 && diff < 1) return 0
//    if (diff > 0) return Math.ceil(diff);
//    if (diff < 0) return Math.floor(diff)
    return Math.round(diff);
}
var month = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function dateForShowingCurrentDay() {
    var d = new Date();
    var f = new Date();
    var m = new Date();
    var dateString = days[d.getDay()] + ", " + f.getDate() + " " + month[m.getMonth()]
    $(".currentDate").html(dateString);
    return dateString
}

function getFormattedDate(date) {
    var d = date
    var f = date
    var m = date
    var dateString = days[d.getDay()] + ", " + f.getDate() + " " + month[m.getMonth()]
//    $(".currentDate").html(dateString);
    return dateString
}

function getDateForSyncStat(date) {
    return month[date.getMonth()] + ", " + date.getFullYear();
}

function colorClassGenerator(elementDate) {
    var diff = getDayDifference(new Date(), elementDate);
    if (diff < 0) {
        return "red"
    }
    return "green"
//    else if (diff = 1) {
//        return "green"
//    }
//    else {
//        return "orange"
//    }
}


function getDBDate(date) {
    //2016-10-16T00:00:00
    var month = date.getMonth() + 1
    var sec = date.getSeconds();
    if (sec <= 9) sec = "0" + sec
    var min = date.getMinutes();
    if (min <= 9) min = "0" + min
    var hou = date.getHours();
    if (hou <= 9) hou = "0" + hou
    return date.getFullYear() + "-" + month + "-" + date.getDate() + "T" + hou + ":" + min + ":" + sec;
}


function showSpinner() {
    $("#loadingSpinner").show()
}

function hideSpinner() {
    $("#loadingSpinner").hide()
}

function futureFeatureMessage() {
    alert("Will be available in future releases.")
}


function calculateGrade(globalGradesObject, percentage, JobRoleLevel, JobRoleTypeValue) {
    console.log("we are here")
//    var result = jlinq.from(globalGradesObject.Grades).greaterEquals("ToMark", percentage).lesserEquals("FromMark", percentage).equals("JobRoleLevel", JobRoleLevel).equals("JobRoleTypeValue", JobRoleTypeValue).select();
    var result = jlinq.from(globalGradesObject.Grades).greaterEquals(percentage, "FromMark").equals("JobRoleLevel", JobRoleLevel).equals("JobRoleTypeValue", JobRoleTypeValue).select();
    var grade = "";
    if (result.length === 0) {
        result = jlinq.from(globalGradesObject.Grades).equals("ToMark", percentage).equals("JobRoleLevel", JobRoleLevel).equals("JobRoleTypeValue", JobRoleTypeValue).select();
    } else if (result.length === 1) {
        grade = result.length === 0 ? "" : result[0].GradeName;
    } else {
        for (i = 0; i < result.length; i++) {
            var currentResult = result[i];
            if (percentage >= currentResult.FromMark && percentage < currentResult.ToMark) {
                grade = result[i].GradeName;
            } else if (percentage == 100 && currentResult.ToMark == 100) {
                grade = result[i].GradeName;
            }
        }
    }

    return grade;
}

var contains = function (needle) {
    // Per spec, the way to identify NaN is that it is not equal to itself
    var findNaN = needle !== needle;
    var indexOf;

    if (!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function (needle) {
            var i = -1, index = -1;

            for (i = 0; i < this.length; i++) {
                var item = this[i];

                if ((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }

            return index;
        };
    }

    return indexOf.call(this, needle) > -1;
};
// function onSuccess(imageData) {
//     var image = document.getElementsByClassName('studentImage');
//     image.src = "data:image/jpeg;base64," + imageData;
//     document.getElementsByClassName("text1").innerHTML = imageData;
//     alert(image.src);
//     console.log(image.src);
// }
// image download code
// var Folder_Name="nsdc";
// function download(URL, Folder_Name, File_Name) {
//
//     //step to request a file system
//     window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess, fileSystemFail);
//
//     function fileSystemSuccess(fileSystem) {
//         var download_link = encodeURI(URL);
//         var ext = download_link.substring(download_link.lastIndexOf('.') + 1); //Get extension of URL
//         var directoryEntry = fileSystem.root; // to get root path of directory
//         directoryEntry.getDirectory(Folder_Name, { create: true, exclusive: false }, onDirectorySuccess, onDirectoryFail); // creating folder in sdcard
//         var rootdir = fileSystem.root;
//         var fp = rootdir.toURL(); // Returns Fulpath of local directory
//         console.log(rootdir);
//         fp = fp + "/" + Folder_Name + "/" + File_Name; // fullpath and name of the file which we want to give
//         // download function call
//         filetransfer(download_link, fp);
//     }
//
//     function onDirectorySuccess(parent) {
//         //alert("Sucesso");
//     }
//
//     function onDirectoryFail(error) {
//         //Error while creating directory
//         alert("Unable to create new directory: " + error.code);
//     }
//
//     function fileSystemFail(evt) {
//         //Unable to access file system
//         alert(evt.target.error.code);
//     }
// }
// function filetransfer(download_link, fp) {
//     var fileTransfer = new FileTransfer();
//     console.log(fp);
//     // File download function with URL and local path
//     fileTransfer.download(download_link, fp,
//         function (entry) {
//             //alert("download complete: " + entry.fullPath);
//         },
//         function (error) {
//             //Download abort errors or download failed errors
//             console.log(error);
//             alert(error.exception);
//             alert("download error source " + error.source);
//             //alert("download error target " + error.target);
//             //alert("upload error code" + error.code);
//         }
//     );
// }
var URL = $('.studentImage').attr('src');
function imgdwn() {
    // if (URL == 'null') {
    //     alert("yes");
    //     $('.studentImage').attr('src', "imgs/back.jpg");
    // }
    // else {
    //     alert("no");
    console.log("in image download");
    var imgurl = $('.studentImage').attr('src');
    var fileTransfer = new FileTransfer();
    var randomValue = Math.random().toString(36).substr(5, 8);
    var uri = encodeURI(imgurl);
    ext = uri.substr(uri.lastIndexOf('.') + 1);
    var fileURL = "cdvfile://localhost/persistent/nsdc/" + randomValue + "." + ext;
    // console.log(URL);
    console.log(randomValue);
    fileTransfer.download(
        uri,
        fileURL,
        function (entry) {
            console.log("download complete: " + entry.toURL());
            localStorage.setItem("imgurls", entry.toURL());
            var imgur = new Array(localStorage.getItem("imgurls"));
            console.log(imgur);
            // $('.studentImage').attr('src', "imgs/back.jpg");
            // alert("imagechanged");
            // console.log($('.studentImage').attr('src', "imgs/back.jpg"));
            // setTimeout(fun, 3000);
            // function fun() {
            //     console.log("changed");
            //     $('.studentImage').attr('src', localStorage.getItem("imgurls"));
            //     console.log("again");
            // }
        },
        function (error) {
            console.log("download error source " + error.source);
            console.log("download error target " + error.target);
            console.log("download error code" + error.code);
        },
        null, {}
    );
    // }
}
//enter code here

$('.studentImage').attr('src', "http://www.nhsbsa.nhs.uk/i/Students/welcome.jpg");
var URl = $('.studentImage').attr('src');

function download(URL, nsdc, File_Name) {
//step to request a file system
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess, fileSystemFail);

    function fileSystemSuccess(fileSystem) {
        var download_link = encodeURI(URL);
        ext = download_link.substr(download_link.lastIndexOf('.') + 1); //Get extension of URL

        var directoryEntry = fileSystem.root; // to get root path of directory
        directoryEntry.getDirectory(nsdc, {create: true, exclusive: false}, onDirectorySuccess, onDirectoryFail); // creating folder in sdcard
        var File_Name = obj.SDMSCandidateID;
        var rootdir = fileSystem.root;
        var fp = rootdir.fullPath; // Returns Fulpath of local directory

        fp = fp + "/" + nsdc + "/" + File_Name + "." + ext; // fullpath and name of the file which we want to give
        // download function call
        filetransfer(download_link, fp);
    }

    function onDirectorySuccess(parent) {
        // Directory created successfuly
    }

    function onDirectoryFail(error) {
        //Error while creating directory
        alert("Unable to create new directory: " + error.code);
    }

    function fileSystemFail(evt) {
        //Unable to access file system
        alert(evt.target.error.code);
    }
}
function filetransfer(download_link, fp) {
    var fileTransfer = new FileTransfer();
// File download function with URL and local path
    fileTransfer.download(download_link, fp,
        function (entry) {
            alert("download complete: " + entry.fullPath);
        },
        function (error) {
            //Download abort errors or download failed errors
            alert("download error source " + error.source);
            //alert("download error target " + error.target);
            //alert("upload error code" + error.code);
        }
    );
}
function camerasam(){
    navigator.camera.getPicture(onSuccess, onFail, {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI
    });

    function onSuccess() {
        alert("image taken");
        // var image = document.getElementById('myImage');
        // image.src = imageURI;
    }

    function onFail(message) {
        alert('Failed because: ' + message);
    }
}

//base64toimage code
/**
 * Convert a base64 string in a Blob according to the data and contentType.
 *
 * @param b64Data {String} Pure base64 string without contentType
 * @param contentType {String} the content type of the file i.e (image/jpeg - image/png - text/plain)
 * @param sliceSize {Int} SliceSize to process the byteCharacters
 * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
 * @return Blob
 */
function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
}

/**
 * Create a Image file according to its database64 content only.
 *
 * @param folderpath {String} The folder where the file will be created
 * @param filename {String} The name of the file that will be created
 * @param content {Base64 String} Important : The content can't contain the following string (data:image/png[or any other format];base64,). Only the base64 string is expected.
 */
function createdir() {
    window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (fileSystem) {
        console.log("Root = " + cordova.file.externalRootDirectory);
        fileSystem.getDirectory("nsdc", {create: true, exclusive: false},
            function () {
                console.log("success");
            });
    }, function (error) {
        alert(error.code);
    });
}
function savebase64AsImageFile(folderpath,filename,content,contentType){
    // Convert the base64 string in a Blob
    var DataBlob = b64toBlob(content,contentType);
    console.log("Starting to write the file :3");
    window.resolveLocalFileSystemURL(folderpath, function(dir) {
        console.log("Access to the directory granted succesfully");
        dir.getFile(filename, {create:true}, function(file) {
            console.log("File created succesfully.");
            file.createWriter(function(fileWriter) {
                console.log("Writing content to file");
                fileWriter.write(DataBlob);
            }, function(){
                alert('Unable to save file in path '+ folderpath);
            });
        });
    });
}

function frameAgencyProfilesList(agencyProfilesList) {
    console.log(agencyProfilesList)   
    var datacontent = ""
    for(var j = 0; j < agencyProfilesList.length; j++){
        datacontent += '<div id="schduleList" class="">' + ' <div class="card green agency waves-effect ' + agencyProfilesList[j].AgencyProfile[0].AgencyName + '" component="button/assesmentDetailsPage" agencyRowID = "' + j + '"> <h3 class ="nameof" id="nameofbatch">' + agencyProfilesList[j].AgencyProfile[0].AgencyName + '</h3>' + '<div>' + '<span  class="1more" id="1moreday"> ' + agencyProfilesList[j].AgencyProfile[0].AgencyId + '</span>' + ' ' + ' </div> </div></div>';   
    }
    
    $("#AgencyList").html(datacontent) 
    $("#schduleList .agency").unbind("click").click(function(){
        document.querySelector('#myNavigator').pushPage('html/agency_profile.html',{data: agencyProfilesList[parseInt($(this).attr("agencyRowID"))]});
    })

}
function frameAgencyProfile(response){
    if(response.AgencyProfile[0]){
        $("#AgencyName").html(response.AgencyProfile[0].AgencyName)
        $("#AgencyId").html(response.AgencyProfile[0].AgencyId)
        $("#Address").html(response.AgencyProfile[0].Address)
        $("#SPOCName").html(response.AgencyProfile[0].SPOCName)
        $("#SPOCMobile").html(response.AgencyProfile[0].SPOCContactNo)
        $("#SPOCEmail").html(response.AgencyProfile[0].SPOCEmail)
    }
    if(response.AgencyHistory[0]){
        $("#NumOfBatchesAssessed").html(response.AgencyHistory[0].NumOfBatchesAssessed)
        $("#NumOfCandidatesAssessed").html(response.AgencyHistory[0].NumOfCandidatesAssessed)
        $("#AsOn").html(response.AgencyHistory[0].AsOn)
    }
    var html = ""
    if(response.AgencySectors.length > 0){
        for(var x = 0; x < response.AgencySectors.length; x++){
            html += '<div class="row"><div class="col s6 value">'+ response.AgencySectors[0].SectorName +'</div></div>'
        }
    }
    console.log(html)
    $("#SectorList").html(html)
}

function frameAssessorProfile(response){
    if(response.AssessorProfile.length > 0){        
        $("#AssessorName").html(response.AssessorProfile[0].AssessorName)
        $("#AssessorID").html(response.AssessorProfile[0].AssessorID)
        $("#Gender").html(response.AssessorProfile[0].Gender)
        $("#IDType").html(response.AssessorProfile[0].IDType)
        $("#IDNumber").html(response.AssessorProfile[0].IDNumber)
        $("#EducationAttained").html(response.AssessorProfile[0].EducationAttained)
        $("#Languages").html(response.AssessorProfile[0].Languages)
        $("#Address").html(response.AssessorProfile[0].Address)
        $("#AssessorImage").attr("src","data:image/jpeg;base64," + response.AssessorProfile[0].AssessorImage)
    }
    var html = ""
    if(response.AssessorJobs.length > 0){
        for(var x = 0; x < response.AssessorJobs.length; x++){
            html += '<div class="row">' +
                '<div class="col s6 value">'+ response.AssessorJobs[0].SectorName +'</div>' +
                '<div class="col s3 value" id="">'+ response.AssessorJobs[0].Status +'</div>' +
                // '<div class="col s3 value" id="">'+ response.AssessorJobs[0].UpdatedOn +'</div>' +
            '</div>'
            
            //GetFormattedDate(convertDBDateToJSDate(response.AssessorJobs[0].UpdatedOn))
        }
    }
    console.log(html)
    $("#SectorList").html(html)
    
    if(response.AssessorHistory.length > 0){
        $("#TotalAssessedStudents2").html(response.AssessorHistory[0].TotalAssessedStudents)
        $("#TotalAssessments2").html(response.AssessorHistory[0].TotalAssessments)        
    }
}

function frameAssessorProfileEdit(response, assessorProfilePageData){
    console.log(response);
    console.log(assessorProfilePageData);
    if(assessorProfilePageData.AssessorProfile.length > 0) {
        
        $(".AssessorImageEdit").attr("src","data:image/jpeg;base64," + assessorProfilePageData.AssessorProfile[0].AssessorImage)
        $("#proofOptions").html(frameOptions(response["ID Type"]))
        $("#genderOptions").html(frameOptions(response["SPOC Gender"]))
        $("#eduOptions").html(frameOptions(response["Education Attained"]))
        var x = assessorProfilePageData.AssessorProfile[0]
        $("#proofOptions").val(x.IDType)
        $("#genderOptions").val(x.Gender)
        $("#eduOptions").val(x.EducationAttained)
        $("#assessorProfilePageEdit #IDNumber").val(x.IDNumber)
        $("#langOptions").val(x.Languages.split(","))
        $('select').material_select();
        $("#Pincode").val(x.Pincode)

        // adress
        $("#stateOptions").html('<option val="' + response.AssessorAddress[0]["State Name"] + '" selected>'+ response.AssessorAddress[0]["State Name"] +'</option>')
        $("#districtOptions").html('<option val="' + response.AssessorAddress[0].DistrictName + '" selected>'+ response.AssessorAddress[0].DistrictName +'</option>')
        $("#SubDistrictOptions").html('<option val="' + response.AssessorAddress[0].SubDistrict + '" selected>'+ response.AssessorAddress[0].SubDistrict +'</option>')
        $('select').material_select();
    //    $("#stateOptions").val(response.AssessorAddress[0]["State Name"])
    //    $("#districtOptions").val(response.AssessorAddress[0].DistrictName)
    //    $("#SubDistrictOptions").val(response.AssessorAddress[0].SubDistrict)
        $("#CityVillage").val(response.AssessorAddress[0].VTC)
        $("#Pincode").val(response.AssessorAddress[0].Pincode)
        $("#AddressLine").val(response.AssessorAddress[0].AddressLine1)
   
    }
    
        $("#Pincode").unbind("change").change(function(){        
            addressLookUp(function(result){
                hideSpinner()
                if(result != "Pincode not found") {

                    $("#stateOptions").html('<option val="' + result.State[0]["State Name"] + '" selected>'+ result.State[0]["State Name"] +'</option>')
                    $("#districtOptions").html('<option val="' + result.District[0].DistrictName + '" selected>'+ result.District[0].DistrictName +'</option>')
                    $("#SubDistrictOptions").html('<option val="' + result["Sub District"][0].SubDistrict + '" selected>'+ result["Sub District"][0].SubDistrict +'</option>')
                    $("#CityVillage").removeAttr("disabled")
                    $("#AddressLine").removeAttr("disabled")
                    $('select').material_select();

                } else {
                    // load states from server
                    stateLookUp(function(result){
                        hideSpinner()
                        $("#stateOptions").removeAttr("disabled")
                        $("#stateOptions").html(frameOptionsCommon(result.States, "SLRCID" ,"State Name"));
                        $('select').material_select();
                        $("#stateOptions").unbind("change").change(function(){
                            districtLookUp(function(result){
                                hideSpinner()
                                $("#districtOptions").removeAttr("disabled")
                                $("#districtOptions").html(frameOptionsCommon(result.Districts, "DLRCID" ,"District"));
                                $('select').material_select();
                                $("#districtOptions").unbind("change").change(function(){
                                    subDistrictLookUp(function(result){
                                        hideSpinner()
                                        $("#SubDistrictOptions").removeAttr("disabled")
                                        $("#SubDistrictOptions").html(frameOptionsCommon(result.SubDistricts, "Subdistrict ID" ,"SubDistrict"));
                                        $("#CityVillage, #AddressLine").removeAttr("disabled")
                                        $('select').material_select();
                                    }, $("#stateOptions option:selected").attr("idvalue"), $("[value='" +$(this).val() + "']").attr("idvalue"))
                                })
                            }, $("[value='" +$(this).val() + "']").attr("idvalue"));
                        })
                    })  
                }

                console.log(result)
            }, $(this).val())
        }) 
    
}

function frameOptions(list){
    var options = '<option value="0" disabled selected>Select one</option>';
    for(var j = 0; j < list.length; j++) {
        options += '<option idvalue="'+ list[j].ID +'" value="' + list[j].TEXT + '">' + list[j].TEXT + '</option>';
    }
    return options;
}

function frameOptionsCommon(list, name, key){
    var options = '<option value="0" disabled selected>Select one</option>';
    for(var j = 0; j < list.length; j++) {
        options += '<option idvalue="'+ list[j][name] +'" value="' + list[j][key] + '">' + list[j][key] + '</option>';
    }
    return options;
}


function openFilePicker(imageId) {
    function onConfirm(buttonIndex) {
        if(buttonIndex==1){
            navigator.camera.getPicture(onSuccess, onFail, { quality: 25,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                destinationType: Camera.DestinationType.DATA_URL
            });

            function onSuccess(imageData) {
                var image = document.getElementById(imageId);
                image.src = "data:image/jpeg;base64," + imageData;
            }

            function onFail(message) {
                console.log('Failed because: ' + message);
            }
        }
        if(buttonIndex==2){
            navigator.camera.getPicture(onSuccess, onFail, { quality: 25,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA
        });

            function onSuccess(imageData) {

                var image = document.getElementById(imageId);
                image.src = "data:image/jpeg;base64," + imageData;
            }

            function onFail(message) {
                 console.log('Failed because: ' + message);
            }

        }       console.log('You selected button ' + buttonIndex);
    }

    navigator.notification.confirm(
        'select picture from ', // message
        onConfirm,            // callback to invoke with index of button pressed
        'profile picture',           // title
        ['gallery','camera']     // buttonLabels
    );
}

function buildUpdateAssessorProfile(){
//{  
//   "AssessorID":119,
//   "Image":"Base 64 string",
//   "Gender":2,
//   "IDType":693,
//   "IDNumber":"",
//   "EducationAttained":985,
//   "Languages":"Hindi,English,Tamil",
//   "StateID":33,
//   "DistrictID":604,
//   "SubDistrictID":3096,
//   "CityID":7929,
//   "VTC":"",
//   "AddressLine":"Plot12, Near KFC",
//   "Pincode":600097,
//
//}

    var body = {}
    body.AssessorID = AssessorID;
    body.Image = $(".AssessorImageEdit").attr("src").replace("data:image/jpeg;base64,","")
    body.Gender = $("#genderOptions").val();
    body.IDType = $("#proofOptions").val();
    body.IDNumber = $("#assessorProfilePageEdit #IDNumber").val()
    body.EducationAttained = $("#eduOptions").val();
    body.Languages = $("#langOptions").val().toString();
    body.StateID = $("#stateOptions").val();
    body.DistrictID = $("#districtOptions").val();
    body.SubDistrictID = $("#SubDistrictOptions").val();
    body.VTC = $("#CityVillage").val();
    body.AddressLine = $("#AddressLine").val();
    body.Pincode = $("#Pincode").val();
    body.CityID = "";
    
    console.log(body)
    return JSON.stringify(body)
    
}

function AssessorValidate(pinChanged){
    if($("#genderOptions").val() == "null") {
        alert("Gender is not selected.")
    } else if($("#proofOptions").val() == "null") {
        alert("ID type is not selected.")
    } else if($("#assessorProfilePageEdit #IDNumber").val() == "") {
        alert("ID cannot be empty.")
    } else if($("#eduOptions").val() == "") {
        alert("ID cannot be empty.")
    } else if($("#langOptions").val().length == 0) {
        alert("language is not selected.")
    } else if($("#Pincode").val() == "") {
        alert("pincode cannot be empty.")
    }
    if(pinChanged) {
        if($("#stateOptions").val() == "") {
            alert("State is not selected.")
        } else if($("#Pincode").val() == "") {
            alert("pincode cannot be empty.")
        }
    }
}
