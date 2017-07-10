function saveToken(x) {
    localStorage[TOKEN_NAME] = x;
}

function setAssessorID(assessorID) {
    localStorage[ASSESSOR_ID_NAME] = assessorID;
}

function getLoginURL(username, password) {
    return SERVER_URL_HEAD + "/login/?assessorId=" + username + "&password=" + password + "&deviceuuid=" + device.uuid;
}

function getForgotPassword(emailID) {
    return SERVER_URL_HEAD + "/forgotpassword?userid=" + emailID
}

function getAllData(assessorId, lastSync) {
    return SERVER_URL_HEAD + "/all?assessorId=" + assessorId + "&lastSync=" + lastSync;
}

function setAssessmentResults() {
//    return "http://192.168.2.115:3000/api/assessormobile/SetAssessmentResults"
    return SERVER_URL_HEAD + "/SetAssessmentResults";
}

function getAssessorProfileURL() {
//    return "http://kranthi0987-001-site1.itempurl.com/api/assessormobile/GetAssessorProfile/?AssessorId=" + AssessorID;
    return SERVER_URL_HEAD + "/GetAssessorProfile/?AssessorId=" + AssessorID;
}

function getAgencyProfileURL() {
//    return "http://kranthi0987-001-site1.itempurl.com/api/assessormobile/GetAssessorAgency/?AssessorId=" + AssessorID;
    return SERVER_URL_HEAD + "/GetAssessorAgency/?AssessorId=" + AssessorID;
}

function getDropDown(){
//    return "http://kranthi0987-001-site1.itempurl.com/api/assessormobile/GetDropDowns";
    return SERVER_URL_HEAD + "/GetDropDowns/?AssessorId=" + AssessorID;
}

function getStateLookUpURL(){
//    return "http://kranthi0987-001-site1.itempurl.com/api/assessormobile/GetStates";
    return SERVER_URL_HEAD + "/GetStates";
}

function getDistrictLookUpURL(stateId){
//    return "http://kranthi0987-001-site1.itempurl.com/api/assessormobile/GetDistricts/?stateId=" + stateId;
    return SERVER_URL_HEAD + "/GetDistricts/?stateId=" + stateId;
}

function getSubDistrictLookUpURL(stateId, distId){
//    return "http://kranthi0987-001-site1.itempurl.com/api/assessormobile/GetDistricts/?stateId=" + stateId;
    return SERVER_URL_HEAD + "/GetSubDistricts/?stateId=" + stateId + "&districtId=" + distId;
}

function getAddressLookUpURL(pin){
//    return "http://kranthi0987-001-site1.itempurl.com/api/assessormobile/GetAddress/?Pincode=" + pin;
    return SERVER_URL_HEAD + "/GetAddress/?Pincode=" + pin;
}

function getUpdateAssessorProfileURL(){
//    return "http://kranthi0987-001-site1.itempurl.com/api/assessormobile/UpdateAssessorProfile";
    return SERVER_URL_HEAD + "/UpdateAssessorProfile";
}
