/************************ Read this shit
Functions Index:
- initDB
- dumpAllTables
- createTables
- insertAssessorBatches
- insertAssessorCentres
- insertCandidatesInAssessorBatches
- selectAssessorBatches
- selectAssessorCentres
- selectCandidatesInAssessorBatches
****/

var dbName = "assessorData.db"
var db = null;

function initDB() {
    db = window.sqlitePlugin.openDatabase({
        name: dbName
        , location: 'default'
    });
    createTables()
}

function dumpAllTables() {
    db.transaction(function (tx) {
        tx.executeSql('DROP TABLE IF EXISTS AssessorBatches');
        tx.executeSql('DROP TABLE IF EXISTS AssessorCentres');
        tx.executeSql('DROP TABLE IF EXISTS CandidatesInAssessorBatches');
		tx.executeSql('DROP TABLE IF EXISTS CandidatesNosesMapping');
		tx.executeSql('DROP TABLE IF EXISTS AssessmentResultsStaging');
		tx.executeSql('DROP TABLE IF EXISTS ComputeResultsWithGrades');
    })
}

function createTables() {   
    db.transaction(function (tx) {

        tx.executeSql('CREATE TABLE IF NOT EXISTS AssessorBatches (AssessmentID,AssessorID,BatchID,DateOfAssignment,DateOfAssessorEvaluation,BatchName,SmartCentreBatchID,PreferedAssessmentDate,JobRoleID,CentreID,CentreName,JobRole,SectorName,SubSectorName,CandidateCount,DateModifed,SectorID,IsReAssessment,ExtendedClosureDate,TrainingTypeValue,JobRoleTypeValue,AssessmentPeriodValue,AssessmentClosureDate,JobRoleLevel,Islocation,ProjectTypeValue,ProjectType,StartLatitude,StartLongitude,EndLatitude,EndLongitude)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS AssessorCentres (CentreID,CentreName,CentreType,Longitude,Latitude,PartnerName,Address,Constituency,CentreSPOCDesignation,CentreSPOCAadhaar,CentreSPOCEmail,CentreSPOCMobNo,NameAsOnBank,BankAccountNo,IFSCCode,BranchName,SPOCName,Islocation)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS CandidatesInAssessorBatches (AssessmentID,BatchID,BatchName,SmartCentreBatchID,JobRoleID,CentreID,IsReAssessment,CandidateName,SDMSCandidateID,CandID,JobRoleCode,JobRoleTypeValue,TrainingTypeValue,JobRoleLevel,CentreCandID,Attendance,AadhaarNumber,AlternateIDType,AlternateIDNumber,CentreCandIDImage)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS CandidatesNosesMapping (CandID,CentreID,BatchID,JobRoleID,NOSID,NOSTypeName,AssessmentID,NOSName,NOSCode,MaxMarksTheory,MaxMarksPractical,TotalMarks,PassingPercentage,PassingPercentageTheory,PassingPercentagePractical)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS AssessmentResultsStaging (IsSubmitted,AssessorID,AssessmentID,CentreID,BatchID,AssessmentDate,CandidateAssessedOn,JobroleID,CandidateCount,FailedCandidateCount,ClosureDate,ExtendedClosureDate,SectorID,TrainingTypeValue,JobroleTypeValue,NosID,TheoryMarks,PracticalMarks,TotalMarks,UpdatedAt,IsReassessment,Result,Grade,JobroleLevel,Attendance,CandidateId,SdmsCandidateId,MarkPercent,CandidateName, CandidateAttendance,StartLatitude,StartLongitude,EndLatitude,EndLongitude)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS ComputeResultsWithGrades (GradeID,JobRoleLevel,JobRoleType,FromMark,ToMark,GradeName,IsActive,JobRoleTypeValue)');
    }, function (error) {
        console.log('Transaction ERROR: ' + error.message);
    }, function () {
        console.log('tables created OK');
    });
}

function getKeyArray(o) {
    var arr = Object.keys(o).map(function (k) {
        var x = String(o[k]);
        if(x == "null" ) return "0"
        return x
    });
    return arr;
}
/* Indvidual table insertion crap */
function insertAssessorBatches(o) {


db.executeSql('SELECT count(*) AS mycount FROM AssessorBatches WHERE AssessmentID = "' + o.AssessmentID + '"', [], function(rs) {
	console.log('Record count (expected to be 2): ' + rs.rows.item(0).mycount);

		if(rs.rows.item(0).mycount > 0){

			db.transaction(function (tx) {

                var query = "UPDATE AssessorBatches SET AssessmentID = '?', AssessorID = '?', BatchID = '?', DateOfAssignment = '?', DateOfAssessorEvaluation = '?', BatchName = '?', SmartCentreBatchID = '?', PreferedAssessmentDate = '?', JobRoleID = '?', CentreID = '?', CentreName = '?', JobRole = '?', SectorName = '?', SubSectorName = '?', CandidateCount = '?', DateModifed = '?', SectorID = '?', IsReAssessment = '?', ExtendedClosureDate = '?', TrainingTypeValue = '?', JobRoleTypeValue = '?', AssessmentPeriodValue = '?', AssessmentClosureDate = '?', JobRoleLevel = '?' , Islocation = '?', ProjectTypeValue = '?', ProjectType = '?' , StartLongitude  = '' , StartLatitude = '' , EndLongitude  = '', EndLatitude = '' WHERE  AssessmentID = '?' "; //
                var vals = getKeyArray(o);
					vals[vals.length] = o.AssessmentID;
					console.log(vals.length)
					jQuery.each(vals,function(v, k) {
						query = query.replace("?",k)
					})

				tx.executeSql(query, [], function(tx, res) {
					console.log("insertId: " + res.insertId);
					console.log("rowsAffected: " + res.rowsAffected);
                    totalSyncTransactionsHappened += 1
                    console.log(o.AssessmentID)
                    deleteAssessmentCompleted(o.AssessmentID)
                    console.log("deleteAssessmentResultsStagingTable")
                        deleteolddata(o)
                    console.log("deleteolddata")

				},
				function(tx, error) {
					console.log('UPDATE error: ' + error.message);
				});
			}, function(error) {
				console.log('transaction error: ' + error.message);
			}, function() {
				console.log('transaction ok');
			});

		} else {
			db.transaction(function (tx) {
                tx.executeSql("insert into AssessorBatches values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", getKeyArray(o));
            }, function (error) {
				console.log('Transaction ERROR: ' + error.message);
			}, function () {
				console.log('rows inserted: OK');
				totalSyncTransactionsHappened += 1
			});


		}


  }, function(error) {
    console.log('SELECT SQL statement ERROR: ' + error.message);
  });
}

function insertAssessorCentres(o) {
    db.transaction(function (tx) {
        tx.executeSql("insert into AssessorCentres values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", getKeyArray(o));
    }, function (error) {
        console.log('Transaction ERROR: ' + error.message);
    }, function () {
        console.log('rows inserted: OK');
        totalSyncTransactionsHappened += 1
    });
}

function insertCandidatesInAssessorBatches(o) {
    db.transaction(function (tx) {
        tx.executeSql("insert into CandidatesInAssessorBatches values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", getKeyArray(o));
    }, function (error) {
        console.log('Transaction ERROR: ' + error.message);
    }, function () {
        console.log('rows inserted: OK');
        totalSyncTransactionsHappened += 1
    });
}

function insertCandidatesNosesMapping(o) {
//    db.transaction(function (tx) {
//        tx.executeSql("insert into CandidatesNosesMapping values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", getKeyArray(o));
//    }, function (error) {
//        console.log('Transaction ERROR: ' + error.message);
//    }, function () {
//        console.log('rows inserted: OK');
//        totalSyncTransactionsHappened += 1
//    });


    db.executeSql('SELECT count(*) AS mycount FROM CandidatesNosesMapping WHERE   AssessmentID = "' + o.AssessmentID + '" AND BatchID = "' + o.BatchID + '" AND CentreID = "' + o.CentreID + '" AND CandID = "' + o.CandID + '" AND NOSID = "' + o.NOSID + '"', [], function(rs) {
        console.log('Record count (expected to be 2): ' + rs.rows.item(0).mycount);

            if(rs.rows.item(0).mycount > 0){


                db.transaction(function (tx) {

                        var query = "UPDATE CandidatesNosesMapping SET CandID = '?', CentreID = '?', BatchID = '?', JobRoleID = '?', NOSID = '?', NOSTypeName = '?', AssessmentID = '?', NOSName = '?', NOSCode = '?', MaxMarksTheory = '?', MaxMarksPractical = '?', TotalMarks = '?', PassingPercentage = '?', PassingPercentageTheory = '?', PassingPercentagePractical = '?' WHERE  AssessmentID = '?' AND  BatchID = '?' AND  CentreID = '?' AND  CandID = '?'  AND  NOSID = '?' ";
                        var vals = getKeyArray(o);
                        vals[vals.length] = o.AssessmentID;
                        vals[vals.length] = o.BatchID;
                        vals[vals.length] = o.CentreID;
                        vals[vals.length] = o.CandID;
                        vals[vals.length] = o.NOSID;
                        console.log(vals.length)
                        jQuery.each(vals,function(v, k) {
                            query = query.replace("?",k)
                        })

                    tx.executeSql(query, [], function(tx, res) {
                        console.log("insertId: " + res.insertId);
                        console.log("rowsAffected: " + res.rowsAffected);
                    totalSyncTransactionsHappened += 1
                    },
                    function(tx, error) {
                        console.log('UPDATE error: ' + error.message);
                    });
                }, function(error) {
                    console.log('transaction error: ' + error.message);
                }, function() {
                    console.log('transaction ok');
                });

            } else {



                db.transaction(function (tx) {
                    tx.executeSql("insert into CandidatesNosesMapping values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", getKeyArray(o));
                }, function (error) {
                    console.log('Transaction ERROR: ' + error.message);
                }, function () {
                    console.log('rows inserted: OK');
                    totalSyncTransactionsHappened += 1
                });


            }


      }, function(error) {
        console.log('SELECT SQL statement ERROR: ' + error.message);
      });
}

function insertComputeResultsWithGrades(o) {
//    db.transaction(function (tx) {
//        tx.executeSql("insert into ComputeResultsWithGrades values(?,?,?,?,?,?,?,?)", getKeyArray(o));
//    }, function (error) {
//        console.log('Transaction ERROR: ' + error.message);
//    }, function () {
//        console.log('rows inserted: OK');
//        totalSyncTransactionsHappened += 1
//    });
    
    
    db.executeSql('SELECT count(*) AS mycount FROM ComputeResultsWithGrades WHERE   GradeID = "' + o.GradeID + '"', [], function(rs) {
        console.log('Record count (expected to be 2): ' + rs.rows.item(0).mycount);

            if(rs.rows.item(0).mycount > 0){


                db.transaction(function (tx) {

                        var query = "UPDATE ComputeResultsWithGrades SET GradeID = '?', JobRoleLevel = '?', JobRoleType = '?', FromMark = '?', ToMark = '?', GradeName = '?', IsActive = '?', JobRoleTypeValue = '?' WHERE  GradeID = '?' ";
                        var vals = getKeyArray(o);
                        vals[vals.length] = o.GradeID;
                        console.log(vals.length)
                        jQuery.each(vals,function(v, k) {
                            query = query.replace("?",k)
                        })

                    tx.executeSql(query, [], function(tx, res) {
                        console.log("insertId: " + res.insertId);
                        console.log("rowsAffected: " + res.rowsAffected);
                    totalSyncTransactionsHappened += 1
                    },
                    function(tx, error) {
                        console.log('UPDATE error: ' + error.message);
                    });
                }, function(error) {
                    console.log('transaction error: ' + error.message);
                }, function() {
                    console.log('transaction ok');
                });				

            } else {


                db.transaction(function (tx) {
                    tx.executeSql("insert into ComputeResultsWithGrades values(?,?,?,?,?,?,?,?)", getKeyArray(o));
                }, function (error) {
                    console.log('Transaction ERROR: ' + error.message);
                }, function () {
                    console.log('rows inserted: OK');
                    totalSyncTransactionsHappened += 1
                });


            }


      }, function(error) {
        console.log('SELECT SQL statement ERROR: ' + error.message);
      });
}



function updateCandidatesNosesMapping(o){

    db.transaction(function (tx) {
        var query = "UPDATE CandidatesNosesMapping SET CandID = '?', CentreID = '?', BatchID = '?', JobRoleID = '?', NOSID = '?', NOSTypeName = '?', AssessmentID = '?', NOSName = '?', NOSCode = '?', MaxMarksTheory = '?', MaxMarksPractical = '?', TotalMarks = '?', PassingPercentage = '?', PassingPercentageTheory = '?', PassingPercentagePractical = ? WHERE  CandID = '?' AND NOSID = '?' ";
        var vals = getKeyArray(o);
        vals[vals.length] = o.CandID;
        vals[vals.length] = o.NOSID;
        console.log(vals.length)
        jQuery.each(vals,function(v, k) {
            query = query.replace("?",k)
        })
        tx.executeSql(query, [] , function(tx, res) {
            console.log("insertId: " + res.insertId);
            console.log("rowsAffected: " + res.rowsAffected);
                    totalSyncTransactionsHappened += 1
        },
        function(tx, error) {
            console.log('UPDATE error: ' + error.message);
        });
    }, function(error) {
        console.log('transaction error: ' + error.message);
    }, function() {
        console.log('transaction ok');
    });
    
}

function insertAssessmentResultsStaging(o,action, successFunction) {
//    deleteAssessmentResultsStaging(o, function(){    
//         
//    })
    console.log(o)
    
    
    
    if(action == "insert"){                    
                console.log("insert into AssessmentResultsStaging (IsSubmitted,AssessorID,AssessmentID,CentreID,BatchID,AssessmentDate,CandidateAssessedOn,JobroleID,CandidateCount,FailedCandidateCount,ClosureDate,ExtendedClosureDate,SectorID,TrainingTypeValue,JobroleTypeValue,NosID,TheoryMarks,PracticalMarks,TotalMarks,UpdatedAt,IsReassessment,Result,Grade,JobroleLevel,Attendance,CandidateId,SdmsCandidateId,MarkPercent,CandidateName,CandidateAttendance,StartLatitude,StartLongitude,EndLatitude,EndLongitude) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)")
                db.transaction(function (tx) {
                    tx.executeSql("insert into AssessmentResultsStaging (IsSubmitted,AssessorID,AssessmentID,CentreID,BatchID,AssessmentDate,CandidateAssessedOn,JobroleID,CandidateCount,FailedCandidateCount,ClosureDate,ExtendedClosureDate,SectorID,TrainingTypeValue,JobroleTypeValue,NosID,TheoryMarks,PracticalMarks,TotalMarks,UpdatedAt,IsReassessment,Result,Grade,JobroleLevel,Attendance,CandidateId,SdmsCandidateId,MarkPercent,CandidateName,CandidateAttendance,StartLatitude,StartLongitude,EndLatitude,EndLongitude) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", getKeyArray(o));
                }, function(tx,rs){
                    console.log("inserted")
                }, function (tx,error) {
                    console.log('Transaction ERROR: ' + error.message);
                });           
            } else {                    
                console.log("update AssessmentResultsStaging SET  TheoryMarks = '"+ o.TheoryMarks +"', PracticalMarks = '"+ o.PracticalMarks +"', TotalMarks = '"+ o.TotalMarks +"', 'CandidateAttendance = '" + o.CandidateAttendance +"' WHERE  CentreID = '" + o.CentreID + "' AND AssessmentID = '" + o.AssessmentID + "' AND BatchID ='" + o.BatchID + "' AND NosId ='" + o.NosId + "'")
                db.transaction(function (tx) {
                    tx.executeSql("update AssessmentResultsStaging SET  TheoryMarks = '"+ o.TheoryMarks +"', PracticalMarks = '"+ o.PracticalMarks +"', TotalMarks = '"+ o.TotalMarks +"', CandidateAttendance = '" + o.CandidateAttendance +"' WHERE  CandidateId = '" + o.CandidateId + "' AND CentreID = '" + o.CentreID + "' AND AssessmentID = '" + o.AssessmentID + "' AND BatchID ='" + o.BatchID + "' AND NosId ='" + o.NosId + "'", []);
                }, function(tx,rs){
                    console.log("updated")
                }, function (error) {
                    console.log('Transaction ERROR: ' + error.message);
                });           
            }
            
    
}


function deleteAllAssessmentResultsStaging(o, successFunction) {
    
        db.transaction(function (tx) {
            // tx.executeSql("DELETE * from  AssessorBatches ", []);
            tx.executeSql("DELETE * from  AssessmentResultsStaging WHERE AssessmentID = ?" , [o.AssessmentID]);
        }, successFunction, function (error) {
            console.log('Transaction ERROR: ' + error.message);
        }, function () {
            console.log('rows Flushed: OK');
        }); 
    
}
function deleteAllAssessmentResultsStagingass(o, successFunction) {

    db.transaction(function (tx) {
        // tx.executeSql("DELETE * from  AssessorBatches ", []);
        tx.executeSql("DELETE * from  AssessorBatches WHERE AssessmentID = ?" , [o.AssessmentID]);
    }, successFunction, function (error) {
        console.log('Transaction ERROR: ' + error.message);
    }, function () {
        console.log('rows Flushed: OK');
    });

}
function deleteAssessmentResultsStaging(o, successFunction) {
    console.log('DELETE from AssessmentResultsStaging WHERE  CentreID = "' + o.CentreID + '" AND AssessmentID = "' + o.AssessmentID + '" AND BatchID ="' + o.BatchID + '" AND NosId ="' + o.NosId + '"')
      db.transaction(function (tx) {
       tx.executeSql('DELETE from AssessmentResultsStaging WHERE  CentreID = "' + o.CentreID + '" AND AssessmentID = "' + o.AssessmentID + '" AND BatchID ="' + o.BatchID + '" AND NosId ="' + o.NosId + '"', []);
   }, successFunction, function (error) {
       console.log('Transaction ERROR: ' + error.message);
   });
}
//sanjay
// function deleteAssessmentResultsStagingTable(AssessmentID) {
//     console.log("DELETE FROM AssessmentResultsStaging WHERE AssessmentID = '" + AssessmentID + "'")
//
//     db.transaction(function (tx) {
//
//         var query = "DELETE FROM AssessmentResultsStaging WHERE AssessmentID = '" + AssessmentID + "'";
//
//         tx.executeSql(query, [], function (tx, res) {
//                 console.log("removeId: " + res.insertId);
//                 console.log("rowsAffected: " + res.rowsAffected);
//             },
//             function (tx, error) {
//                 console.log('DELETE error: ' + error.message);
//             });
//     }, function (error) {
//         console.log('transaction error: ' + error.message);
//     }, function () {
//         console.log('transaction ok');
//     });
// }
function deleteAssessmentResultsStagingTable(o, successFunction) {
    console.log('DELETE from AssessmentResultsStaging WHERE  CentreID = "' + o.CentreID + '" AND AssessmentID = "' + o.AssessmentID + '" AND BatchID ="' + o.BatchID + '" ')
    db.transaction(function (tx) {
        tx.executeSql('DELETE * from AssessmentResultsStaging WHERE  CentreID = "' + o.CentreID + '" AND AssessmentID = "' + o.AssessmentID + '" AND BatchID ="' + o.BatchID + '"', []);
    }, successFunction, function (error) {
        console.log('Transaction ERROR: ' + error.message);
    });
}
function deleteolddata(o,successFunction) {
   db.transaction(function (tx) {
       tx.executeSql("DELETE FROM AssessmentResultsStaging WHERE AssessmentID = '" + o.AssessmentID + "'", [], successFunction, function (tx, error) {
           console.log('SELECT error: ' + error.message);
       });
   });
}
/* Update method */



/* Select crap for individuals*/
function selectAssessorBatches(successFunction) {
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM AssessorBatches', [], successFunction , function (tx, error) {
            console.log('SELECT error: ' + error.message);
        });
    });
}


        




function selectAssessorCentres(CentreID,successFunction) {
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM AssessorCentres WHERE CentreID = "' + CentreID + '"' , [], successFunction, function (tx, error) {
            console.log('SELECT error: ' + error.message);
        });
    });
}

function selectCandidatesInAssessorBatches(AssessmentID, BatchID, CentreID, successFunction) {
    db.transaction(function (tx) {
        var q1='select cab.AssessmentID, cab.BatchID, cab.BatchName, cab.SmartCentreBatchID, cab.JobRoleID, cab.CentreID, cab.IsReAssessment, cab.CandidateName, cab.SDMSCandidateID, cab.CandID, cab.JobRoleCode, cab.JobRoleTypeValue, cab.TrainingTypeValue, cab.JobRoleLevel, cab.CentreCandID, cab.Attendance, cab.AadhaarNumber, cab.AlternateIDType, cab.AlternateIDNumber, cab.CentreCandIDImage, IFNULL(ars.IsSubmitted,0) as IsSubmitted from CandidatesInAssessorBatches as cab LEFT JOIN AssessmentResultsStaging as ars on ' +
        ' cab.CandID = ars.CandidateId AND cab.CentreID = ars.CentreID AND cab.AssessmentID=ars.AssessmentID AND cab.BatchID=ars.BatchID '+
                ' WHERE  cab.CentreID = "' + CentreID + '" AND cab.AssessmentID = "'+ AssessmentID +'" AND cab.BatchID ="'+ BatchID +'" GROUP BY cab.CandID';
        

        var q1old='SELECT * FROM CandidatesInAssessorBatches WHERE CentreID = "' + CentreID + '" AND AssessmentID = "'+ AssessmentID +'" AND BatchID ="'+ BatchID +'"';
        tx.executeSql(q1, [], successFunction, function (tx, error) {
            console.log('SELECT error: ' + error.message);
        });
    });
}
//sanjay
function updatestartlocation(AssessmentID, startlong, startlat,  successFunction) {
    db.transaction(function (tx) {
        tx.executeSql('UPDATE AssessmentResultsStaging SET StartLongitude = "' + startlong + '", StartLatitude = "' + startlat + '" WHERE AssessmentID = "' + AssessmentID + '"', [], successFunction, function (tx, error) {
            console.log('SELECT error: ' + error.message);
        });
    });
}
function selectstartlocation(AssessmentID, startlong, startlat,  successFunction) {
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM AssessorBatches WHERE  StartLongitude = "' + startlong + '" AND StartLatitude = "' + startlat + '" AND AssessmentID = "' + AssessmentID + '"', [], successFunction, function (tx, error) {
            console.log('SELECT error: ' + error.message);
        });
    });
}
function updateendlocation(AssessmentID, endlong, endlat,  successFunction) {
    db.transaction(function (tx) {
        tx.executeSql('UPDATE AssessmentResultsStaging SET EndLongitude = "' + endlong + '", EndLatitude = "' + endlat + '" WHERE AssessmentID = "' + AssessmentID + '"', [], successFunction, function (tx, error) {
            console.log('SELECT error: ' + error.message);
        });
    });
}
function selectendlocation(AssessmentID, endlong, endlat,  successFunction) {
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM AssessorBatches WHERE  EndLongitude = "' + endlong + '" AND EndLatitude = "' + endlat + '" AND AssessmentID = "' + AssessmentID + '"', [], successFunction, function (tx, error) {
            console.log('SELECT error: ' + error.message);
        });
    });
}
//sanjay
function colorfunction(AssessmentID, BatchID, CentreID, successFunction){
    db.transaction(function (tx) {
        tx.executeSql('SELECT COUNT(*) FROM AssessmentResultsStaging WHERE CentreID = "' + CentreID + '" AND AssessmentID = "'+ AssessmentID +'" AND BatchID ="'+ BatchID +'"', [] , successFunction, function (tx, error) {
            console.log('SELECT error: ' + error.message);

        });
    });
}
//

function selectCandidatesNosesMapping(AssessmentID, BatchID, CentreID, CandID,successFunction) {
//    db.transaction(function (tx) {
//        tx.executeSql('SELECT * FROM CandidatesNosesMapping WHERE CandID = "'+ CandID +'" AND CentreID = "' + CentreID + '" AND AssessmentID = "'+ AssessmentID +'" AND BatchID ="'+ BatchID +'"', [], successFunction, function (tx, error) {
//            console.log('SELECT error: ' + error.message);
//        });
//    });
    
    //ars.CandidateId ="'+ CandID +'" AND
    
    db.transaction(function (tx) {
        tx.executeSql('SELECT cns.CandID, cns.CentreID, cns.BatchID, cns.JobRoleID, cns.NOSID, cns.NOSTypeName, cns.AssessmentID, cns.NOSName, cns.NOSCode, cns.MaxMarksTheory, cns.MaxMarksPractical, cns.TotalMarks, cns.PassingPercentage, cns.PassingPercentageTheory, cns.PassingPercentagePractical, ars.TheoryMarks, ars.PracticalMarks, ars.CandidateAttendance FROM CandidatesNosesMapping cns LEFT JOIN AssessmentResultsStaging ars ON  cns.CandID = ars.CandidateId  AND cns.CentreID = ars.CentreID AND cns.AssessmentID = ars.AssessmentID AND cns.BatchID = ars.BatchID AND cns.NOSID = ars.NOSID WHERE  cns.CandID = "'+ CandID +'" AND cns.CentreID = "' + CentreID + '" AND cns.AssessmentID = "'+ AssessmentID +'" AND cns.BatchID ="'+ BatchID +'"', [], successFunction, function (tx, error) {
            console.log('SELECT error: ' + error.message);
        });
    });
}
    

function selectComputeResultsWithGrades(successFunction) {
    db.transaction(function (tx) {
        var query = 'SELECT * FROM ComputeResultsWithGrades ';
        tx.executeSql(query, [], successFunction, function (tx, error) {
            console.log('SELECT error: ' + error.message);
        });
    });
}

function selectAssessmentResultsStaging(AssessmentID, BatchID, CentreID, successFunction) {
    db.transaction(function (tx) {
        var query = 'SELECT * FROM AssessmentResultsStaging ';
        if(AssessmentID && BatchID && CentreID && AssessmentID != 0 ) query += 'WHERE CentreID = "' + CentreID + '" AND AssessmentID = "' + AssessmentID + '" AND BatchID ="' + BatchID + '"';
        tx.executeSql(query, [], successFunction, function (tx, error) {
            console.log('SELECT error: ' + error.message);
        });
    });
}


function GetCount(query){
    db.transaction(function (tx) {
        tx.executeSql(query, [], function (tx, rs) {
            console.log(rs.rows.item("count"));
            return rs.rows.item("count")
        }, function (tx, error) {
            console.log('SELECT error: ' + error.message);
        });
    });
}