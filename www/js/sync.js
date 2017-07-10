function syncInitData(allData, firstTime) {
    
    initDB()
    if(firstTime==true) {
        dumpAllTables()
        createTables()   
    }
        syncAllData(allData)

    }

function syncAllData(allData) {
    console.log(allData)
    jQuery.each(allData.AssessorBatches, function (i, AssessorBatch) {
        insertAssessorBatches(AssessorBatch)        
    });
    jQuery.each(allData.AssessorCentres, function (i, AssessorCentre) {
        insertAssessorCentres(AssessorCentre)
    });
    jQuery.each(allData.CandidatesInAssessorBatches, function (i, CandidatesInAssessorBatch) {
        insertCandidatesInAssessorBatches(CandidatesInAssessorBatch)
    });
    jQuery.each(allData.CandidatesNosesMapping, function (i, CandidatesNosesMap) {
        insertCandidatesNosesMapping(CandidatesNosesMap)
    });
    jQuery.each(allData.ComputeResultsWithGrades, function (i, ComputeResultsWithGrade) {
        insertComputeResultsWithGrades(ComputeResultsWithGrade)
    });
    localStorage["HistoryDetails"] = JSON.stringify(allData.HistoryDetails)
    console.log('localStorage["HistoryDetails"]: ' + localStorage["HistoryDetails"])
    
    var totalTrasactionsAre = allData.AssessorBatches.length + allData.AssessorCentres.length + allData.CandidatesInAssessorBatches.length + allData.CandidatesNosesMapping.length + allData.ComputeResultsWithGrades.length; 
    totalSyncTransactionsHappened = 0
    var timer = setInterval(function(){
        console.log("totalTrasactionsAre: " + totalTrasactionsAre)
        console.log("totalSyncTransactionsHappened: " + totalSyncTransactionsHappened)
        if(totalTrasactionsAre <= totalSyncTransactionsHappened) {
            console.log("we are moving");
            clearInterval(timer);
            document.querySelector('#myNavigator').replacePage('html/splitter.html');
        }
    }, 1000)
    
    setDownSync()
    
//    updateAllData();
    setUpSync();
//    
//    selectAssessorBatches()
//    selectAssessorCentres()
//    selectCandidatesInAssessorBatches()
//    selectCandidatesInAssessorBatches()
//    selectCandidatesNosesMapping()
    
}
var UP_SYNC_TIME = "upSyncTime"
var DOWN_SYNC_TIME = "downSyncTime"

function setUpSync() {
    localStorage[UP_SYNC_TIME] = new Date();
}

function getUpSync() {
    return localStorage[UP_SYNC_TIME]
}

function setDownSync() {
    localStorage[DOWN_SYNC_TIME] = new Date();
}

function getDownSync() {
    return localStorage[DOWN_SYNC_TIME]
}

function updateAllData(AssessmentID, BatchID, CentreID) {
    selectAssessmentResultsStaging(AssessmentID, BatchID, CentreID,function (tx, rs) {
        
        var data = []
        console.log(rs)
        for(var i = 0; i < rs.rows.length; i++){
            rs.rows.item(i)["EndAssessmentDate"] = getDBDate(new Date());
            data[data.length] = rs.rows.item(i);
        }
        if(data.length == 0) {
            alert("You have not entered any marks to update");
            document.querySelector('#myNavigator').popPage(); 
            return false;
        } else {            
            
            var x = '{"Results" : ' + JSON.stringify(data) + "}"
            console.log("see here")
            console.log(x)
            updateMarksinServer(x, function(response){            
                hideSpinner();
                var result = $.parseJSON(JSON.stringify(response));
                console.log(result)
                console.log("selectAssessmentResultsStaging");
                console.log(rs.rows);
                if(result.indexOf("Succe") > -1 ){
                    document.querySelector('#myNavigator').popPage();        
                } else {
                     // alert(result);
                    navigator.notification.alert("Duplicate batch Id",success,"Duplicate Batch","ok")
                    function success(){}
                }
                setAssessmentCompleted(AssessmentID)
                // localStorage.removeItem("AssessmentCompleted");
//                deleteAllAssessmentResultsStaging()
//                document.querySelector('#myNavigator').popPage();        

            })     
        }      
    })
    return true;
}

function showSyncTimeOnScreen() {
    if (getDownSync()) {
        tempText = getFormattedDate(new Date(getDownSync()))
    }
    else {
        tempText = "never Synced"
    }
    $(".downSyncTime").html(tempText)
    if (getUpSync()) {
        tempText = getFormattedDate(new Date(getUpSync()))
    }
    else {
        tempText = "never Synced"
    }
    $(".upSyncTime").html(tempText)
    
    
    
    if (getDownSync()) {
        var tempDate = new Date(getDownSync())
        $("#SyncStatDateValue").html(tempDate.getDate())
        $("#SyncStatMonthYearValue").html(getDateForSyncStat(tempDate))
    }
    else {
        $("#SyncStatDateValue").html("N/A")
        $("#SyncStatMonthYearValue").html("Sync Now")
    }
}