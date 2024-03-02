<?php

/* ***************************************************************************
******************************  Misc fns
*************************************************************************** */

use function PHPSTORM_META\map;

function echobase($text, $breaks, $endlines, ...$params)
{
  if (is_array($text)) $text = "Array:" . ea($text);
  if (count($params) == 0) return $text . str_repeat("<br />", $breaks) . str_repeat("\n", $endlines);
  return vsprintf($text, $params) . str_repeat("<br />", $breaks) . str_repeat("\n", $endlines);
}


function en($text, ...$params)
{
  return echobase($text, 0, 0, ...$params);
}

// function e($text, ...$params) { return echobase($text, 0, 1, ...$params); }
// function e1($text, ...$params) { return echobase($text, 1, 1, ...$params); } 
// function e2($text, ...$params) { return echobase($text, 2, 1, ...$params); } 

function e($text, ...$params)
{
  return $text ? echobase($text, 0, 1, ...$params) : "";
}
function e1($text, ...$params)
{
  return $text ? echobase($text, 1, 1, ...$params) : "";
}
function e2($text, ...$params)
{
  return $text ? echobase($text, 2, 1, ...$params) : "";
}

function ehtml($text, ...$params)
{
  return $text ? echobase($text, 0, 1, ...$params) : "";
}

function br($breaks)
{
  return echobase("", $breaks, 1);
}

function ea($a)
{
  if (is_array($a)) return e1("<pre>" . htmlspecialchars(print_r($a, true)) . "</pre>");
  return $a;
}


function bold($s, ...$params)
{
  return e("<span style='font-weight:bold'>$s</span>", ...$params);
}
function bold1($s, ...$params)
{
  return e1("<span style='font-weight:bold'>$s</span>", ...$params);
}
function bold2($s, ...$params)
{
  return e2("<span style='font-weight:bold'>$s</span>", ...$params);
}

function pre($s, ...$params)
{
  return e("<pre>$s</pre>", ...$params);
}

function color($s, $color, ...$params)
{
  return e("<span style='color:$color'>$s</span>", ...$params);
}
function blue($s, ...$params)
{
  return color($s, "blue", ...$params);
}
function red($s, ...$params)
{
  return color($s, "red", ...$params);
}

function h2($s, ...$params)
{
  return e("<h2>$s</h2>", ...$params);
}
function h3($s, ...$params)
{
  return e("<h3>$s</h3>", ...$params);
}

function a2s($a, $newlinelevel = -1)
{
  return arraytostring($a, " ", "=", 0, $newlinelevel);
}

function arraytostring($a, $sep = " ", $kvsep = "=", $depth = 0, $newlinelevel = -1)
{
  $s = "";
  $deptharray = array("blue", "red", "green", "purple", "magenta", "cyan", "gold", "red", "blue");
  $depthcolor = $deptharray[$depth];
  if (is_array($a)) {
    foreach ($a as $k => $raw) {
      $v = ((is_object($raw)) ? "Obj(" . get_class($raw) . ")" : ((is_array($raw)) ? arraytostring($raw, $sep, $kvsep, $depth + 1, $newlinelevel) : $raw));
      if ($kvsep) {
        $s .= $sep . $k . $kvsep . color($v, $depthcolor);
      } else {
        $s .= $sep . color($v, $depthcolor);
      }
      if ($depth == $newlinelevel) $s .= br(1);
    }
  }
  return $s;
}


/********************************************************************
 **************    Email Functions
 *******************************************************************/


 function sendmailsam($text, $subject, $name = "FFL", $address = "ffl@footy.rocks")
 {
   sendmail("sam@sampercy.com", $text, $subject, $name, $address);
 }
 
 function sendmail($recipient, $text, $subject, $fromname = "", $fromaddress = "", $cc = "")
 {
   if (!$text) return;
   $headers = "";
   $text = converttohtmlmail($text, $headers);
   if ($cc) $headers .= 'Cc: sam@sampercy.com';
   if ($fromname) addfromheader($fromname, $fromaddress, $headers);
   mail($recipient, $subject, wordwrap($text, 70, "\r\n"), $headers);
 }

function converttohtmlmail($text, &$headers)
{

  $headers  = 'MIME-Version: 1.0' . "\r\n";
  $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";

  return "<html>
<head>
<title>Test Title</title>
</head>
<body>
$text
</body>
</html>";
}

function addfromheader($name, $address, &$headers)
{
  $headers .= "From: $name <$address> \r\n";
}



function filegetcontentswrapper($url)
{

  $c = curl_init();
  curl_setopt($c, CURLOPT_URL, $url);
  curl_setopt($c, CURLOPT_RETURNTRANSFER, true);
  $data = curl_exec($c);
  curl_close($c);
  if ($data) return $data;

  $data = file_get_contents($url);
  return $data;
}
