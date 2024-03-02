<?php

/* ***************************************************************************
******************************  Page output
*************************************************************************** */

function pageoutput()
{
  //The result of this function is the page output, so should be an HTML page.
  
  global $app;

  // $ret = gethtml();
  // $ret = matchlists();
  // $ret .= listspells();

  return $app->page->getpage();

}

function listspells()
{

  global $app;
  $ret = "";
  $x = 0;

  $sql = "SELECT spellcode, tagvalue FROM spelltags WHERE tagname = 'Name' GROUP BY spellcode, tagvalue ORDER BY tagvalue";
  $allspells = $app->qry->fetchall($sql);

  foreach($allspells as $spgrp) {
    $ret .= e1("%s: %s", $spgrp["spellcode"], $spgrp["tagvalue"]);
    $spell = loadspell($spgrp["spellcode"]);

    $ret .= e1(ea($spell));
    // if ($x++==20) break;
  }

  return $ret;


}

function loadspell($spellcode)
{

  global $app;
  $sql = "SELECT * FROM spelltags WHERE spellcode = '$spellcode'";
  $rows = $app->qry->fetchall($sql);
  $spell = array("Code" => $spellcode, "Classes" => array());

  // Area,Attack,Casting Time,Casting Time Short,Class,Components Short,Concentration,
  // Damage,Duration,Duration Short,Effect,Level,Level Short,Name,Range,Save,School,School Short
  
  foreach($rows as $r) {
    if ($r["tagname"] == "Class") {
      $spell["Classes"][] = $r["tagvalue"];
    } else {
      $spell[$r["tagname"]] = $r["tagvalue"];
    }
  }

  
  $spell["texts"] = array();

  $sql = "SELECT * FROM spelltexts WHERE spellcode = '$spellcode'";
  $rows = $app->qry->fetchall($sql);
  
  foreach($rows as $r) {
    if ($r["tagname"] == "Components Blurb") {
      $spell["ComponentsBlurb"] = trim($r["tagvalue"]);
    } else if ($r["tagname"] == "Casting Time Blurb") {
      $spell["CastingTimeBlurb"] = trim($r["tagvalue"]);
    } else if ($r["tagname"] == "Higher Levels") {
      $spell["HigherLevels"] = trim($r["tagvalue"]);
    } elseif (substr($r["tagvalue"], 0, 24) == "<strong>At Higher Levels") {
      $spell["HigherLevels"] = trim(substr($r["tagvalue"], strpos($r["tagvalue"], "</strong>")+9));
    } else {
      $spell["texts"][$r["sequence"]] = trim($r["tagvalue"]);
    }
  }

  return $spell;
}

function matchlists() {

  global $app;
  $ret = "";

  $sql = "SELECT sd.spellcode
    FROM spelltags sd
      INNER JOIN spelltags sw ON sd.spellcode = sw.spellcode AND sd.tagname = sw.tagname AND sd.tagvalue = sw.tagvalue
    WHERE sd.source = 'db'
      AND sw.source = 'wkdt'
    ";

  $rows = $app->qry->fetchcolumn($sql);
  $ret .= e2(bold("All match (").count($rows)."): ".implode(", ", $rows));

  $sql = "SELECT CONCAT(sd.spellcode, ': ',  sd.tagvalue, ' != ',  sw.tagvalue) txt
    FROM spelltags sd
      INNER JOIN spelltags sw ON sd.spellcode = sw.spellcode AND sd.tagname = sw.tagname 
    WHERE sd.source = 'db'
      AND sw.source = 'wkdt'
      AND sd.tagvalue <> sw.tagvalue
    ";

  $rows = $app->qry->fetchcolumn($sql);
  $ret .= e2(bold("Codes match (").count($rows)."): ".implode(", ", $rows));

  $sql = "SELECT CONCAT(sd.tagvalue, ': ',  sd.spellcode, ' != ',  sw.spellcode) txt
    FROM spelltags sd
      INNER JOIN spelltags sw ON sd.tagvalue = sw.tagvalue AND sd.tagname = sw.tagname 
    WHERE sd.source = 'db'
      AND sw.source = 'wkdt'
      AND sd.spellcode <> sw.spellcode
    ";

  $rows = $app->qry->fetchcolumn($sql);
  $ret .= e2(bold("Name match (").count($rows)."): ".implode(", ", $rows));

  $sql = "SELECT CONCAT(sd.spellcode, ': ', sw.tagvalue) txt
    FROM spelltags sd
      INNER JOIN spelltags sw ON sd.spellcode = sw.spellcode
    WHERE sd.source = 'db'
      AND sw.source = 'wkdt'
      AND sd.tagname = 'Source Book'
      AND sw.tagname = 'Name'
    ";

  $rows = $app->qry->fetchcolumn($sql);
  $ret .= e2(bold("Codes matching source book (").count($rows)."): ".implode(", ", $rows));

  $sql = "SELECT sd.spellcode
    FROM spelltags sd
      INNER JOIN spelltags sw ON sd.spellcode = sw.spellcode
    WHERE sd.source = 'db'
      AND sw.source = 'wkdt'
      AND sd.tagname = 'Source Book'
      AND sw.tagname = 'Name'
    ";

  $rows = $app->qry->fetchcolumn($sql);
  $ret .= e2(bold("Codes matching source book (").count($rows)."): ".implode(", ", $rows));


  $sql = "SELECT sd.spellcode
    FROM spelltags sd
    WHERE sd.source = 'db'
      AND sd.tagname = 'Source Book'
      AND sd.spellcode NOT IN (SELECT spellcode FROM spelltags WHERE source = 'wkdt')
    ";

  $rows = $app->qry->fetchcolumn($sql);
  $ret .= e2(bold("Source Book codes not in wkdt (").count($rows)."): ".implode(", ", $rows));

  return $ret;

}

function gettagfilename($vsn) {

  global $app;

  $cch = $app->qry->getcache("tags");



}
