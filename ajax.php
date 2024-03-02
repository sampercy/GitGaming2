<?php


$env = ($_SERVER["HTTP_HOST"] == "localhost") ? "local" : "web";
$homedir = ($env == "local") ? "C:/OneDrive/Dev/GamingSite/" : "/home/lincp354/gaming/";

include_once($homedir."php/globals.php");
include_once($homedir."php/appquery.php");

$qry = new AppQuery($env);

$ret = "";

function ajaxerror($errno, $errstr, $errfile, $errline) {
  sendmailsam("Error: [$errno] $errstr on line $errline of $errfile,", "Ajax global error",  "Gaming", "ffl@footy.rocks");
  die();
}

// Setting set_error_handler
set_error_handler("ajaxerror");

$results = array();


try {
  
  $controllername = en("ajax_%s", $_POST["command"]);
  
  if (function_exists($controllername)) {
    //ajax prefixed functions should return an array
    $results = $controllername($qry); 
    // sendmailsam(ea($results), "Testing 5", "Gaming", "ffl@footy.rocks");
  } else {
    $results = array("Invalid" => $_POST);
  }
  
} catch (Exception $e) {
  sendmailsam("Error", "Ajax error", "FFL", "ffl@footy.rocks");
}

// sendmailsam(ea($results), "Testing 7", "Gaming", "ffl@footy.rocks");
echo json_encode($results);

// echo "{'abc':'def'}";
// echo json_encode(array(1,2,3,4,55));

/* *************************************************
**********   Generic data queries
************************************************* */


function ajax_blank() 
{
  $ret = array();
  $ret["error"] = false;
  $ret["input"] = $_POST;
  return $ret;
}


/* *************************************************
**********   
************************************************* */


function ajax_updatetags($qry)
{
  
  $ret = ajax_blank();  

  // Caching
  $cch = $qry->getcache("tags");
  $ret["precache"] = $cch;
  $cch = $qry->incrementcache("tags", 0, true);
  $ret["postcache"] = $cch; 

  $results = array();
  foreach ($_POST["updates"] as $u) {
    $tagkey = 0;
    if (isset($u["tagkey"])) $tagkey = $u["tagkey"];
    $result = array("error" => false, "input" => $u);
    if ($tagkey > 0) {
      if (isset($u["tobedeleted"])) {
        $result["delete"] = $qry->exec("deletetag", $tagkey);
      } else {
        $result["update"] = $qry->exec("updatetag", $u["itemcode"], $u["itemsource"], $u["sequence"], $u["tagname"], $u["tagvalue"], $tagkey);
        if ($result["update"] == 0) {
          $result["error"] = true;
          $result["lastexecerror"] = $qry->lastexecerror;
          $ret["error"] = true;
        }
      }
      if (isset($u["changes"])) $result["changes"] = $qry->exec("inserttagchanges", $tagkey, $cch, json_encode($u["changes"]));
    } else {
      if (isset($u["tobedeleted"])) {
        // Cannot insert and delete in the same operation, just do nothing and say we did
      } else {
        $result["insert"] = $qry->exec("inserttemplate", $u["itemcode"], $u["itemsource"], $u["sequence"], $u["tagname"], $u["tagvalue"]);
        if ($result["insert"] == 0) {
          $result["error"] = true;
          $result["lastexecerror"] = $qry->lastexecerror;
          $ret["error"] = true;
        } else {
          $result["key"] = $qry->lastinsertid();
        }
      }
      if (isset($u["changes"])) $result["changes"] = $qry->exec("inserttagchanges", $result["key"], $cch, json_encode($u["changes"]));
    }
    $results[] = $result;
  }
  $ret["results"] = $results;

  return $ret;

}




/*

Fields in tags: tagkey, itemcode, itemsource, sequence, tagname, tagvalue

itemsource=general
tagkey=40276
itemcode=templates
sequence=0
tagname=:tempname
tagvalue=z<<#surround|bold|<<Name>>>><<:br>><<Level>> <<School>> , sortlevel=99, 
changes=[]

Update object passed in: (Jan 2024)

0={itemsource=general, tagkey=40276, itemcode=templates, sequence=0, tagname=:tempname, tagvalue=z<<#surround|bold|<<Name>>>><<:br>><<Level>> <<School>> , sortlevel=99, 
changes=[{change=value, key=40276, newvalue=z<<#surround|bold|<<Name>>>><<:br>><<Level>> <<School>> ,   oldvalue=<<#surround|bold|<<Name>>>><<:br>><<Level>> <<School>> }]}

1={itemsource=general, tagkey=0, itemcode=templates, sequence=0, tagname=:abc2, tagvalue=pqr, 
changes=[{change=add, name=:abc, value=new}, {change=value, key=0, newvalue=def, oldvalue=new}, {change=value, key=0,   newvalue=defgh, oldvalue=def}, {change=name, key=0, newname=:abc2, oldname=:abc}, {change=value, key=0, newvalue=pqr,   oldvalue=defgh}]}

2={itemsource=general, tagkey=0, itemcode=templates, sequence=0, tagname=:sam, tagvalue=percy, 
  changes=[{change=add, name=:sam, value=new}, {change=value, key=0, newvalue=percy, oldvalue=new}]}

Update queries:

    case "updatetag":
      return "UPDATE tags SET itemcode = ?, itemsource = ?, sequence = ?, tagname = ?, tagvalue = ? WHERE tagkey = ?;";




{
    "error": false,
    "input": {
        "command": "updatetags",
        "updates": [
            {
                "name": ":br",
                "value": "new"
            }
        ]
    },
    "precache": "13",
    "postcache": "14",
    "results": [
        {
            "input": {
                "name": ":br",
                "value": "new"
            },
            "insert": 1,
            "key": "40282",
            "cache": 1
        }
    ]
}


 [
  app.tags.uploadchanges.push({"name" : t.tagname, "value" : t.tagvalue})
  app.tags.uploadchanges.push({"key" : t.tagkey, "new" : t.tagvalue, "old" : t.tagvalueorig})
// ]
lastinsertid
case "updatetag":
  return "UPDATE tags SET tagvalue = ? WHERE tagkey = ?;";

case "inserttemplatetag":
  return "INSERT INTO tags SET tagname = ?, tagvalue = ?, itemcode = 'templates', itemsource = 'general', sequence = 0;";

case "inserttaghistory":
  return "INSERT INTO tags SET tagkey = ?, version = ?, oldtag = ?, newtag = ?;";

  */