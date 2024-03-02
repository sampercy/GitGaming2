<?php

class AppQuery
{
  // PDO version

  private $conn;
  public $statement;  //PDOStatement
  private $fetchtype;  //https://www.php.net/manual/en/pdostatement.fetch.php
  public $env;
  public $lastexecerror;  //Array

  function __construct($env = "web")
  {
    $this->env = $env;
    if ($env == "local") {
      // $this->conn = new PDO("mysql:host=localhost:3306;dbname=local_gaming");
      // $this->conn = new PDO("mysql:host=localhost:3306;dbname=local_gaming", "root", "secret");
      $this->conn = new PDO("mysql:host=localhost:3306;dbname=local_gaming", "root", "");
    } else {
      $this->conn = new PDO("mysql:host=localhost;dbname=lincp354_gaming", "lincp354_gaminguser", "85kbA=S%E1_c");
    }
    $this->fetchtype = PDO::FETCH_ASSOC;
  }

  function error($mode = 0)
  {
    switch ($mode) {
      case 0:
        if (!$this->lastexecerror) return "";
        return ea($this->lastexecerror);
      case 1:
        if ($this->lastexecerror) return true;
        return false;
    }
  }

  private function resetvars()
  {
    // $this->lastid = 0;
    $this->lastexecerror = "";
  }

  private function executequery($sql, ...$params)
  {
    $this->resetvars();
    if (strpos($sql, " ") === false) $sql = $this->repo($sql);
    $this->statement = $this->conn->prepare($sql);
    if (count($params) > 0 && is_array($params[0])) {
      $this->lastexecerror = ($this->statement->execute($params[0])) ? "" : $this->statement->errorInfo();
    } else {
      $this->lastexecerror = ($this->statement->execute($params)) ? "" : $this->statement->errorInfo();
    }
    if ($this->lastexecerror) {
      $this->lastexecerror["sql"] = $sql;
    }
  }

  function exec($sql, ...$params)
  {
    $this->executequery($sql, ...$params);
    return $this->statement->rowCount();
  }

  function prerun($sql, ...$params)
  {
    $this->executequery($sql, ...$params);
    return $this;
  }

  function fetch($sql, ...$params)
  {
    $this->executequery($sql, ...$params);
    return $this->statement->fetch($this->fetchtype);
  }

  function fetchrow($sql, ...$params)
  {
    return $this->fetch($sql, ...$params);
  }

  function fetchall($sql, ...$params)
  {
    $this->executequery($sql, ...$params);
    return $this->statement->fetchall($this->fetchtype);
  }

  function fetchvalue($sql, ...$params)
  {
    $this->executequery($sql, ...$params);
    if ($row = $this->statement->fetch(PDO::FETCH_NUM)) return $row[0];
  }

  function rowcount()
  {
    return $this->statement->rowCount();
  }

  function lastinsertid()
  {
    return $this->conn->lastInsertId();
  }

  function begintrans()
  {
    return $this->conn->beginTransaction();
  }

  function commit()
  {
    return $this->conn->commit();
  }

  function rollback()
  {
    return $this->conn->rollBack();
  }

  function fetchcolumn($sql, ...$params)
  {
    //Returns the values in the first column of the query as an array
    $this->fetchtype = PDO::FETCH_NUM;
    $rows = $this->fetchall($sql, ...$params);
    $this->fetchtype = PDO::FETCH_ASSOC;
    $ret = array();
    foreach ($rows as $row) $ret[] = $row[0];
    return $ret;
  }

  function fetchquerymap($sql, ...$params)
  {
    //Two field query, first is key, other is value
    $this->fetchtype = PDO::FETCH_NUM;
    $rows = $this->fetchall($sql, ...$params);
    $this->fetchtype = PDO::FETCH_ASSOC;
    $ret = array();
    foreach ($rows as $row) $ret[$row[0]] = $row[1];
    return $ret;
  }

  function fetchlist($sql, ...$params)
  {
    //Two field query, first is key, other is value
    $this->fetchtype = PDO::FETCH_NUM;
    $rows = $this->fetchall($sql, ...$params);
    $this->fetchtype = PDO::FETCH_ASSOC;
    $ret = array();
    foreach ($rows as $row) $ret[] = $row[0];
    return $ret;
  }

  function smartqueryarray($sql, $pivotfield, $solorows, ...$params)
  {
    //get query results pivoted from the pivotfield onwards
    // set $solorows=1 if you know the pivots will be unique and so the rows within can be flattened

    $fieldset = "";
    $fields = array("pre" => array(), "post" => array());
    $ret = array();
    $prevpivotvalue = false;
    $rows = $this->fetchall($sql, ...$params);
    foreach ($rows as $row) {

      //Sort all fields into pre or post pivot field. If pivot not found exit.
      if ($fieldset == "") {
        $fieldset = "pre";
        foreach ($row as $fld => $value) {
          $fields[$fieldset][$fld] = $fld;
          if ($fld == $pivotfield) $fieldset = "post";
        }
        if ($fieldset != "post") return;
      }

      //Loop through data and populate results
      if ($row[$pivotfield] !== $prevpivotvalue) {
        $prevpivotvalue = $row[$pivotfield];
        $ret[$prevpivotvalue] = array();
        foreach ($fields["pre"] as $fld) {
          $ret[$prevpivotvalue][$fld] = $row[$fld];
          unset($row[$fld]);
        }
      }
      if ($solorows) {
        if ($row) $ret[$prevpivotvalue] = $row;
      } else {
        if ($row) $ret[$prevpivotvalue]["rows"][] = $row;
      }
    }

    return $ret;
  }

  function querytotree($sql, $options, ...$params)
  {
    //This is smartquery remade, as there was an error in that.
    //This creates an array where the fields up to and including pivotfield are a tree of values, 
    //  and then each leaf contains the remaining fields as a numbered array.

    /* $options can be a string or an array. If it is a string then it is the pivotfield and the rest are defaulted.
     - flattenpost can be used when only one field will be in the set of post fields, and so a key-value pair is unnecessary:
         [{pk:1234}, {pk:2090}] would become [1234, 2090]
     - solorow can be used when the pre fields define a unique key on the data so the leaf can contain a single object:
         [{sh:Adel, tm:ADEL, nm:Adelaide]}...] would become [Adel=>{tm:ADEL, nm:Adelaide},...] if pivoted on 'sh'

     -  Example: $options = array("pivotfield" => "aflteam", "flattenpost" => true);
     -  Example: $options = array("pivotfield" => "aflteam", "solorows" => true);
    */

    $flattenpost = false;
    $solorows = false;
    if (is_array($options)) {
      $pivotfield = $options["pivotfield"];
      if (isset($options["flattenpost"])) $flattenpost = true;
      if (isset($options["solorows"])) $solorows = true;
    } else {
      $pivotfield = $options;
    }

    $flattenfield = "";
    $fieldset = "";
    $fields = array("pre" => array(), "post" => array());
    $ret = array();

    $rows = $this->fetchall($sql, ...$params);
    foreach ($rows as $row) {

      //First time through - sort all fields into pre or post pivot field. If pivot not found exit.
      if ($fieldset == "") {
        $fieldset = "pre";
        foreach ($row as $fld => $value) {
          $fields[$fieldset][$fld] = $fld;
          if ($fld == $pivotfield) $fieldset = "post";
        }
        if ($fieldset != "post") return array();
        if ($flattenpost && count($fields["post"]) > 1) $flattenpost = false;
        if ($flattenpost) $flattenfield = array_keys($fields["post"])[0];
      }

      //Loop through row and populate results. $ptr points to the end of the tree as we traverse down
      $ptr = &$ret;
      foreach ($fields["pre"] as $fld) {
        if (!isset($ptr[$row[$fld]])) $ptr[$row[$fld]] = array();
        $ptr = &$ptr[$row[$fld]];
      }
      if ($flattenpost) {
        $post = $row[$flattenfield];
      } else {
        $post = array();
        foreach ($fields["post"] as $fld) $post[$fld] = $row[$fld];
      }
      if ($solorows) {
        $ptr = $post;
      } else {
        $ptr[] = $post;
      }
    }

    return $ret;
  }

  function questionmarks($num)
  {
    return "(" . substr(str_repeat(",?", $num), 1) . ")";
  }

  // ************************************************************************   Caching queries

  function incrementallcaches()
  {
    return $this->exec("UPDATE caches SET version = version + 1");

  }

  function incrementcache($name, $fkey = 0, $returnvalue = false)
  {
    $ct = $this->exec("UPDATE caches SET version = version + 1 WHERE cachename = ? AND fkey IN (0, ?)", $name, $fkey);
    if ($fkey > 0 and $ct < 2) {
      $this->exec("INSERT INTO caches SET cachename = ?, fkey = ?, version = 1", $name, $fkey);
    }
    if ($returnvalue) return $this->getcache($name, $fkey);
  }

  function getcache($name, $fkey = 0, $addifnone = true)
  {
    if ($val = $this->fetchvalue("SELECT version FROM caches WHERE cachename = ? AND fkey = ?", $name, $fkey)) return $val;
    if ($val === 0) return 0;
    if ($addifnone) {
      $this->exec("INSERT INTO caches (cachename, fkey, version) VALUES (?, ?, 1)", $name, $fkey);
      return 1;
    }
    return 0;
  }

  // ************************************************************************   Repository of SQL
  // Ideally all queries should be in here 

  function repo($name, ...$params)
  {


    switch ($name) {

      case "alltags":
        return "SELECT * FROM tags NATURAL JOIN itemsources ORDER BY itemcode, itemsource, sequence";

      case "updatetag":
        return "UPDATE tags SET itemcode = ?, itemsource = ?, sequence = ?, tagname = ?, tagvalue = ? WHERE tagkey = ?;";

      case "deletetag":
        return "DELETE FROM tags WHERE tagkey = ?;";

      case "inserttemplate":
        return "INSERT INTO tags SET itemcode = ?, itemsource = ?, sequence = ?, tagname = ?, tagvalue = ?;";
        
      case "inserttagchanges":
        return "INSERT INTO taghistory SET tagkey = ?, version = ?, changes = ?;";


      // case "inserttemplatetag":
      //   return "INSERT INTO tags SET tagname = ?, tagvalue = ?, itemcode = 'templates', itemsource = 'general', sequence = 0;";

      // case "inserttaghistory":
      //   return "INSERT INTO taghistory SET tagkey = ?, version = ?, oldtag = ?, newtag = ?;";
      
    }

  }
  
}
