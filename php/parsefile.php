<?php


class ParseFile
{
  // PDO version

  public $data;
  public $fromfile;
  public $loadnotes;

  function __construct($fileroot = "")
  {
    $this->data["fileroot"] = ($fileroot) ?: $_SERVER["DOCUMENT_ROOT"];
    $this->fromfile = "";
    $this->loadnotes = "";
    $this->data["test"] = 678;
  }

  //  function setlocalfile($file, $delete = 0) {
  //    
  //    $fullname = $_SERVER["DOCUMENT_ROOT"]."/$file";
  //    if ($delete and file_exists($fullname)) unlink($fullname);    
  //    $this->data["localfile"] = $fullname;
  //    
  //  }


  function loadfile($url, $context, $file, $filemethod)
  {

    // $filemethod = DELETE: Use this to remove any existing file first, so the URL is always used, and the new page saved.
    // $filemethod = USE: Use this to only go to the URL if the file does not exist.
    // $context is provided to file_get_contents if needed. Allows for a stream to be used I think.

    $target = $url;

    if ($file) {
      $fullname = $this->data["fileroot"] . "/$file";
    } else {
      $filemethod = "";
    }

    //Delete the file if it exists, if so intructed
    if ($filemethod == "DELETE") {
      if (file_exists($fullname)) unlink($fullname);
      $filemethod = "";
    }

    //If the file exists then use it rather than the url
    if ($filemethod == "USE") {
      if (file_exists($fullname)) {
        $target = $fullname;
        $this->fromfile = $target;
      } else {
        $filemethod = "";
      }
    }

    libxml_use_internal_errors(true);

    //Ready to start
    $this->loadnotes .= e1("URL: %s", $url);
    $this->loadnotes .= e1("Fullfile name: %s", $fullname);
    $this->loadnotes .= e1("Method: %s", $filemethod);

    if ($context and $url and $filemethod == "") {
      $this->data["text"] = file_get_contents($target, 0, $context);
      $this->loadnotes .= e1("Debug file get method: file_get_contents: $target");
    } elseif ($filemethod == "USE") {
      $this->data["text"] =  file_get_contents($target);
      $this->loadnotes .= e1("Debug file get method: file_get_contents short: $target");
    } else {
      $this->data["text"] = filegetcontentswrapper($target);
      $this->loadnotes .= e1("Debug file get method: filegetcontentswrapper: $target");
    }

    if (!$this->data["text"]) {
      $this->loadnotes .= e1("Error in parsepage: no file input");
      return;
    }

    $doc = new DOMDocument();
    $doc->loadHTML($this->data["text"]);
    $doc->normalizeDocument();
    $this->data["doc"] = $doc;  //DOMDocument
    $this->data["url"] = $url;
    $this->data["file"] = $file;
    if ($url and $filemethod != "USE") $doc->saveHTMLFile($fullname);
    return true;
  }

  /***********************************************************************************
   **********          General functions
   ***********************************************************************************/

  function elementsfilteredbyattribute($coll, $elementname, $attribute, $filter, $invert = 0)
  {

    if (!$coll) $coll = $this->data["doc"];
    if ($elementname) $coll = $coll->getElementsByTagName($elementname);
    $ret = array();
    
    foreach ($coll as $key => $element) {
      if ($element->hasAttributes()) {
        if ($element->attributes->getNamedItem($attribute)->nodeValue == $filter) {
          if ($invert == 0) $ret[] = $element;
        } else {
          if ($invert == 1) $ret[] = $element;
        }
      }
    }
    return $ret;
  }

  function elementswithclass($coll, $elementname, $class)
  {

    if (!$coll) $coll = $this->data["doc"];
    if ($elementname) $coll = $coll->getElementsByTagName($elementname);
    $ret = array();
        
    foreach ($coll as $key => $element) {
      if ($element->hasAttributes()) {
        if ($classes = $element->getAttribute("class")) {
          $classesarray = explode(" ", $classes);
          foreach($classesarray as $classname) {
            if ($classname == $class) {
              $ret[] = $element;
            }
          }
        }
      }
    }
    return $ret;
  }  

  function displaynode($node, $indent = 0)
  {

    $name = $node->nodeName;
    $type = $node->nodeType;
    $hasc = $node->hasChildNodes() ? "Y" : "N";
    if ($node->hasAttributes()) {
      $id = $node->attributes->getNamedItem("id")->nodeValue;
      $class = $node->attributes->getNamedItem("class")->nodeValue;
    }
    $nodeCount = $node->childNodes->length;
    $value = trim($node->nodeValue);

    $line = str_repeat("- ", $indent / 2);
    $line .= "name:$name, ";
    $line .= "type:$type, ";
    if ($id) $line .= "id:$id, ";
    if ($class) $line .= "class:$class, ";
    if ($nodeCount) $line .= "count:$nodeCount, ";
    if (strlen($value) > 0) {
      $line .= (strlen($value) <= 20) ? "value:$value, " : ("value(10):" . substr($value, 0, 10));
    }

    $ret = e1($line);
    if ($node->hasChildNodes())
      foreach ($node->childNodes as $child) $ret .= $this->displaynode($child, $indent + 2);

    return $ret;
  }

  function findnodechildrenwithclass($node, $class)
  {

    $ret = array();
    if ($node->hasChildNodes()) {
      foreach ($node->childNodes as $child) {
        if ($child->hasAttributes()) {
          if ($child->attributes->getNamedItem("class")->nodeValue == $class) $ret[] = $child;
        }
      }
    }
    return $ret;
  }

  function findnodechildrenwithname($node, $name)
  {

    $ret = array();
    if ($node->hasChildNodes()) {
      foreach ($node->childNodes as $child) {
        if ($child->nodeName == $name) $ret[] = $child;
      }
    }
    return $ret;
  }

  /***********************************************************************************
   **********          Table functions
   ***********************************************************************************/

  function findtables($needle = false)
  {
    $ret = array();
    $this->loadtables();
    if (!is_array($this->data["tables"])) return;
    foreach ($this->data["tables"] as $key => $table) {
      if ($needle) {
        if ($this->in_array_recursive($needle, $table, 1)) {
          $ret[] = $table;
        }
      } else {
        $ret[] = $table;
      }
    }
    return $ret;
  }

  private function in_array_recursive($needle, $haystack, $debug = 0)
  {
    if (is_array($haystack)) {
      foreach ($haystack as $hay) {
        if ($this->in_array_recursive($needle, $hay)) return 1;
      }
    } else {
      if ($debug) e1("$needle === $haystack: " . ($needle === $haystack ? "Y" : "N"));
      return ($needle === $haystack);
    }
  }

  function loadtables()
  {
    //Grab all the tables to an array and neaten the rows and data.
    //Modify with care. Used in loadtues_functions at the moment
    
    $this->loadnotes .= en("Table load: ");

    if (isset($this->data["tables"])) return;
    $this->data["tables"] = array();
    $tables = $this->data["doc"]->getElementsByTagName('table');
    if (!is_null($tables)) {
      foreach ($tables as $table) {
        $ret = array();
        if ($table->hasChildNodes()) {
          $this->loadnotes .= en("C");
          $tablenode = $this->shownode($table);
          $trimmed = $this->trimnode($tablenode, array("tr", "td", "th"));
          $this->loadnotes .= e1(":%s", ea($trimmed));
          $this->flattentotype($ret, $trimmed, "tr");
          $ret = $this->rowtovalues($ret);
        } else {
          $this->loadnotes .= en("N");
        }
        $this->data["tables"][] = $ret;
        //$this->data["tablesraw"][] = $tablenode;
      }
    }
    if (!$this->data["tables"]) $this->data["tables"] = array();
    
    $this->loadnotes .= e2("X");
  }


  /* Form functions */

  function findforms($needle)
  {

    $this->loadforms();
    if (!is_array($this->data["forms"])) return;
    foreach ($this->data["forms"] as $form) {
      if ($this->in_array_recursive($needle, $form)) $ret[] = $form;
    }
    return $ret;
  }

  function loadforms()
  {
    if ($this->data["forms"]) return;
    $forms = $this->data["doc"]->getElementsByTagName('form');
    if (!is_null($forms)) {
      foreach ($forms as $form) {
        $formnode = $this->shownode($form);
        $trimmed = $this->trimnode($formnode, array("input", "button", "select", "option"));
        $this->data["forms"][] = $trimmed;
      }
    }
    if (!$this->data["forms"]) $this->data["forms"] = "None";
  }




  /* Array functions */

  function trimnode($parent, $find, $retainparent = 1)
  {
    //$parent is an array as made by shownode
    $ret = array();
    if ($retainparent) {
      $ret["details"] = $parent["details"];
      $ret["attributes"] = $parent["attributes"];
    }
    foreach ($parent as $key => $child) {
      if (is_numeric($key)) {
        // if (is_array($child) and is_array($child["details"]) and is_array($child["details"]["name"])) {
        if (is_array($child)) {
          if (in_array($child["details"]["name"], $find)) {
            $ret[] = $this->trimnode($child, $find);
          } else {
            $val = $this->trimnode($child, $find, 0);
            if ($val) $ret[] = $val;
          }
        }
      }
    }
    if (count($ret) == 1) return $ret[0];
    return $ret;
  }

  function flattentotype(&$ret, $parent, $find)
  {
    //$parent is an array as made by shownode

    foreach ($parent as $key => $child) {
      if (is_numeric($key)) {
        if ($child["details"]["name"] == $find) {
          $ret[] = $child;
        } else {
          $this->flattentotype($ret, $child, $find);
        }
      }
    }
  }

  function rowtovalues($parent)
  {
    //Ditch all the td or th data and replace it with the value only
    //$parent is an array as made by shownode

    $ret = array();
    foreach ($parent as $rownumber => $tr) {
      foreach ($tr as $key => $td) {
        if (isset($td["details"])) $ret[$rownumber][] = $td["details"]["value"];
      }
    }
    return $ret;
  }

  function shownode($parent, $level = 0)
  {

    $ret["details"]["level"] = $level;
    //if ($parent->nodeName == "div") return "div";
    $ret["details"]["name"] = $parent->nodeName;
    $ret["details"]["type"] = $parent->nodeType;
    if ($ret["details"]["type"] == 3) {
      if ($parent->isWhitespaceInElementContent()) return "whitespace";
      $ret["details"]["text"] = $parent->wholeText;
    }
    $ret["details"]["value"] = substr(trim($parent->nodeValue), 0, 40);

    $ret["attributes"] = ($parent->hasAttributes()) ? $this->getattributes($parent->attributes) : "None";

    if ($parent->hasChildNodes()) {
      foreach ($parent->childNodes as $node) {
        $ret[] = $this->shownode($node, $level + 1);
      };
    }

    return $ret;
  }

  function getattributes($atts)
  {
    foreach ($atts as $att) {
      $ret[$att->name] = $att->value;
    }
    return $ret;
  }

  function getnodeclass($node)
  {
    return $this->getnodeattribute($node, "class");
  }

  function getnodeattribute($node, $attribue)
  {
    $atts = $this->getattributes($node->attributes);
    return $atts[$attribue];
  }





  /* Table functions */


  function getsimpletable($table)
  {

    if (!is_null($table->childNodes)) {
      foreach ($table->childNodes as $tr) {
        if ($tr->nodeName == "tbody") return $this->getsimpletable($tr);
        $ret[] = $this->getsimplerow($tr);
      }
      return $ret;
    }
  }

  function getsimplerow($tr)
  {
    if (!is_null($tr->childNodes)) {
      foreach ($tr->childNodes as $td) $ret[] = $td->nodeValue;
      return $ret;
    }
  }

  function gettableheaders($table)
  {
    if (!is_null($table->childNodes)) {
      foreach ($table->childNodes as $tr) {
        if ($tr->nodeName == "thead") return $this->gettableheaders($tr);
        $ret = $this->getsimplerow($tr);
      }
      return $ret;
    }
  }


  function tablescontaintext($tablecoll, $text, $entireonly = 0)
  {
    if (is_null($tablecoll)) return false;
    foreach ($tablecoll as $tableobj) {
      $rowscoll = $tableobj->getElementsByTagName('tr');
      if ($this->rowscontaintext($rowscoll, $text, $entireonly)) return true;
    }
  }

  function rowscontaintext($rowscoll, $text, $entireonly = 0)
  {
    if (is_null($rowscoll)) return false;
    foreach ($rowscoll as $rowobj) {
      $datacoll = $rowobj->getElementsByTagName('td');
      if ($this->dataitemscontaintext($datacoll, $text, $entireonly)) return true;
    }
  }


  function dataitemscontaintext($datacoll, $text, $entireonly = 0)
  {
    if (is_null($datacoll)) return false;
    foreach ($datacoll as $dataobj) {
      if ($entireonly) {
        if ($dataobj->nodeValue === $text) return true;
      } else {
        if (strpos($dataobj->nodeValue, $text)) return true;
      }
    }
  }


  function tablecontainstable($tableobj)
  {
    return ($tableobj->getElementsByTagName('table')->length > 0);
  }


  function findbasictablewithtext($text, $entireonly = 0)
  {
    //look for text in the elements of the tables on the current document. 
    //Only find tables without subtables

    $tablecoll = $this->data["doc"]->getElementsByTagName('table');
    if (!is_null($tablecoll)) {
      foreach ($tablecoll as $key => $tableobj) {
        $rowscoll = $tableobj->getElementsByTagName('tr');
        if ($this->rowscontaintext($rowscoll, $text, $entireonly)) {
          if (!$this->tablecontainstable($tableobj)) {
            $found[$key] = $tableobj;
          }
        }
      }
    }
    return $found;
  }

  function showbasictable($tableobj, $rowmax = -1)
  {
    $rowscoll = $tableobj->getElementsByTagName('tr');
    if (is_null($rowscoll)) return "";
    $ret = "<table style='border: 1px solid blue'>";
    foreach ($rowscoll as $rowobj) {
      $datacoll = $rowobj->getElementsByTagName('td');
      $ret .= $this->showbasicrow($datacoll);
      if (--$rowmax == 0) break;
    }
    $ret .= "</table>";
    return $ret;
  }

  function showbasicrow($datacoll)
  {
    $ret = "<tr style='border: 1px solid red'>";
    foreach ($datacoll as $dataobj) {
      $ret .= "<td style='border: 1px solid black'>" . htmlspecialchars($dataobj->nodeValue) . "</td>";
    }
    $ret .= "</tr>";
    return $ret;
  }


  function findtablelinks($tableobj)
  {
    if (is_null($tableobj)) return false;
    return $this->findrowlinks($tableobj->getElementsByTagName('tr'));
  }

  function findrowlinks($rowscoll)
  {

    if (is_null($rowscoll)) return false;
    foreach ($rowscoll as $rowobj) {
      $i = 0;
      $row = array();
      $datacoll = $rowobj->getElementsByTagName('td');
      foreach ($datacoll as $dataobj) {
        $acoll = $dataobj->getElementsByTagName('a');
        $acount = $acoll->length;
        $row[++$i]["data"] = htmlspecialchars($dataobj->nodeValue);
        if ($acount) {
          $row[$i]["links"]["count"] = $acount;
          foreach ($acoll as $key => $aobj) {
            if ($aobj->hasAttributes()) {
              $row[$i]["links"][$key]["href"] = $aobj->attributes->getNamedItem("href")->nodeValue;
              $row[$i]["links"][$key]["name"] = $aobj->attributes->getNamedItem("name")->nodeValue;
              $row[$i]["links"][$key]["value"] = $aobj->nodeValue;
            }
          }
        }
      }
      $rows[] = $row;
    }
    return $rows;
  }

}
