<?php

/* ****************************************************************************************** 
******************************  AppFile     *************************************************
****************************************************************************************** 

adddfileinposition3 <- addsavedfilegroups

addsavedfilegroups <- preparejs_local (C:\Sam\VSCode\FFLLP2\code\general\framework\modelhome.php)

*/


class AppFile
{

  private $app;
  public $filegroups;
  // public $locations;  //array of locations loaded from a site specific function - allows easier sharing of classes

  function __construct(AppSession $inputapp)
  {
    $this->app = $inputapp;
    $this->filegroups = array();
  }

  function toplevel()
  {    
    if ($this->app->env == "web") return "/home/lincp354/gaming/";
    return "C:/OneDrive/Dev/GamingSite/";
  }
  function backendfilename($file, $folders)
  {    
    return $this->toplevel() . $folders . "/" . $file;
  }
  function frontendfilename($file, $folders)
  {    
    return $folders . "/" . $file;
  }

  function addjsfileincludescript($file, $folder, $link = false) {
    $filename = $this->frontendfilename($file, $folder);
    $befilename = $this->backendfilename($file, $folder);
    if (file_exists($befilename)) {
      if ($link) {
        $this->app->page->addjs(e("<script src='%s'></script>", $filename));
      } else {
        $this->app->page->addjs(e("<script>\n%s\n</script>", file_get_contents($filename)));
      }
    }
  }

  function requiredfilename($name, ...$params)
  {
    //returns filename if it needs to be created, and calling code must ensure data is applied
    $filename = en($name . str_repeat("_%s", count($params)), ...$params) . ".js";
    $backendfile = $this->backendfilename($filename, "files/tags");
    $frontendfile = $this->frontendfilename($filename, "files/tags");
    $js = e("<script src='%s'></script>", $frontendfile);
    $this->app->page->addjs($js);
    if (!file_exists($backendfile)) return $backendfile;
    // $ret["js"] = e("<script type='text/javascript' src='%s'></script>", $filename);

  }

  function gettagsfilejs($cache) {

    $ret = "";

    $tags = $this->app->qry->fetchall("alltags");
    // $cache = $this->app->qry->getcache("tags");

    $ret .= "function gettagsinital() {";
    $ret .= "  return " . json_encode($tags);
    $ret .= "}";
    $ret .= "function gettagsinitalcachevalue() { return " . $cache . "}";

    return $ret;

  }


  // function requiredfilename_includedat55($pos, $name, ...$params)
  // {
  //   //  http://fantasy.footy.rocks/live/static2teamplayers_v4_r_c8.js


  //   //returns filename if it needs to be created, but the created file will be included by this fn
  //   $filename = en($name . str_repeat("_%s", count($params)), ...$params) . ".js";
  //   $fullfile = "live/static2/". $filename;
  //   $js = e("<script src='http://%s/%s'></script>", "fantasy.footy.rocks", $fullfile);
  //   // $this->app->page->addjs($js, true, $pos);
  //   if (!file_exists($fullfile)) {
  //     // $this->app->addlog("Generic file does NOT exist: %s", $fullfile);
  //     return $fullfile;
  //   }
  //   // $this->app->addlog("Generic file does exist: %s", $fullfile);
  // }


  // function tempfilename($folder, $file)
  // {
  //   $tempfilefolder = $this->gettempfilesfolder55();
  //   if (!file_exists($tempfilefolder."/".$folder)) mkdir($tempfilefolder."/".$folder);
  //   return $tempfilefolder.$folder."/".$file;
  // }
  // function tempfilelinkatpos($pos, $tempfilename) {
  //   $js = e("<script src='http://%s/%s'></script>", "fantasy.footy.rocks", $tempfilename);
  //   // $this->app->page->addjs($js, true, $pos);
  // }


  // function testjsfile55()
  // {
  //   return "/home/lincp354/ffl2022/live/code/sitescripts/test.js";
  //   //   $this->app->file->getfile("sitescriptsfromhome", "testjs")
  // }
  // function getcsslink55()
  // {
  //   return en("<link rel='stylesheet' href='http://%s'>", "fantasy.footy.rocks/live/code/fflcss/ffl2.css");
  //   //   $css = $this->app->file->getcsslink("css", "ffl");
  // }
  // function gettempfilesfolder55()
  // {
  //   return "live/code/tempfiles/";
  // }



  // function getstandardfiles55()
  // {

    // $this->filegroups = array();

    // $linkteals = true;
    // $tealmode = true;

    // //js
    // $grp = array();

    // //Files under here embed for everyone
    // $link = 0;
    // $mod = 0;
    // $grp[] = array("version" => (1 + $mod), "required" => true, "level" => 2, "link" => $link, "filetype" => "conditionals");
    // $grp[] = array("version" => (23 + $mod), "required" => true, "level" => 2, "link" => $link, "filetype" => "dataloader");
    // $grp[] = array("version" => (7 + $mod), "required" => $admin, "level" => 2, "link" => $link, "filetype" => "admin");
    
    // //Files under here embedded for Sam - with care heavy js work only! Increment before saving this file. 
    // $link = !$admin;
    // $mod = ($admin) ? 1 : 0;
    // $grp[] = array("version" => (18 + $mod), "required" => true, "level" => 2, "link" => $link, "filetype" => "scorer");  
    
    // //Files under here always link 
    // $link = true;
    // $mod = 0;
    // $grp[] = array("version" => (13 + $mod), "required" => true, "level" => 2, "link" => $link, "filetype" => "afl");
    // $grp[] = array("version" => (16 + $mod), "required" => true, "level" => 1, "link" => $link, "filetype" => "pageobjects");
    // $grp[] = array("version" => (9 + $mod), "required" => true, "level" => 2, "link" => $link, "filetype" => "htmldom");
    // $grp[] = array("version" => (8 + $mod), "required" => true, "level" => 2, "link" => $link, "filetype" => "generalfns");
    // $grp[] = array("version" => (7 + $mod), "required" => true, "level" => 2, "link" => $link, "filetype" => "squads");
    // $grp[] = array("version" => (17 + $mod), "required" => true, "level" => 2, "link" => $link, "filetype" => "teamdata");
    // $grp[] = array("version" => (21 + $mod), "required" => true, "level" => 2, "link" => $link, "filetype" => "opendraft");

    // //Experimental site layouts
    // $grp[] = array("version" => 1, "required" => ($mode == "navbartest"), "level" => 9, "link" => false, "filetype" => "navbartest");
    // $grp[] = array("version" => 1, "required" => ($mode == "codepen"), "level" => 9, "link" => false, "filetype" => "codepen");
    // $grp[] = array("version" => 1, "required" => ($tealmode), "level" => 9, "link" => $linkteals, "filetype" => "tealtest");
    // $this->filegroups["mainjsgroup"] = array("files" => $grp, "ext" => "js", "folder" => "sitescripts", "template" => "%s%d.js");
    
    
    // // //Are we using a test html mode?
    // // if ($app->page->htmlmode != "normal") {
    // //   // $s = e(file_get_contents($app->file->getfile("sitescripts", $app->page->htmlmode))); 
    // //   $app->file->addfiletopos(9, "sitescripts", $app->page->htmlmode, false); 
    // // }

    // //css
    // $grp = array();
    // $grp[] = array("version" => 2, "required" => (!$tealmode), "level" => 0, "link" => true, "filetype" => "ffl");
    // $grp[] = array("version" => 4, "required" => (!$tealmode), "level" => 0, "link" => true, "filetype" => "tabulator_ffl");
    // //Experimental site layouts
    // $grp[] = array("version" => 1, "required" => ($mode == "navbartest"), "level" => 0, "link" => false, "filetype" => "navbartest");
    // $grp[] = array("version" => 1, "required" => ($mode == "codepen"), "level" => 0, "link" => false, "filetype" => "codepen");
    // // $grp[] = array("version" => 1, "required" => ($tealmode), "level" => 0, "link" => false, "filetype" => "tealtest");
    // $grp[] = array("version" => 2, "required" => ($tealmode), "level" => 0, "link" => $linkteals, "filetype" => "tealtest");
    // $grp[] = array("version" => 1, "required" => ($tealmode), "level" => 0, "link" => $linkteals, "filetype" => "tabulator_teal");
    // $this->filegroups["maincssgroup"] = array("files" => $grp, "ext" => "css", "folder" => "css", "template" => "%s%d.css");


  // }


  // function addsavedfilegroups55($groupname)
  // {

  //   if (!$this->filegroups) $this->getstandardfiles55();

  //   $grp = $this->filegroups[$groupname];
  //   foreach ($grp["files"] as $file) {   // embedded code first
  //     if ($file["required"] and !$file["link"]) {
  //       $s = $this->adddfileinposition55($file, $grp);
  //       $this->app->page->addjs($s, true, $file["level"]);
  //     }
  //   }
  //   foreach ($grp["files"] as $file) {   // then links
  //     if ($file["required"] and $file["link"]) {
  //       $s = $this->adddfileinposition55($file, $grp);
  //       $this->app->page->addjs($s, true, $file["level"]);
  //     }
  //   } 
  // }

  // function adddfileinposition55($file, $grp)
  // {
  //   //Used once in this file: addsavedfilegroups
  //   $type = isset($file["ext"]) ? $file["ext"] : $grp["ext"];
  //   $folder = $grp["folder"];   // sitescripts or css

  //   // $filename = en($grp["template"], $file["filetype"], $file["version"], $type);
  //   $filename = en($grp["template"], $file["filetype"], $file["version"]);

  //   $loc = (($folder == "sitescripts") ? "live/code/sitescripts" : "live/code/fflcss") . "/" . $filename;
  //   // $loc = $this->locations["folders"][$folder] . "/" . $filename;
    
  //   $template = "a";

  //   if ($file["link"]) {
  //     $pagetext = $loc;
  //     $template = ($type == "js") ? "<script type='text/javascript' src='%s'></script>" : "<link href='%s' rel='stylesheet'>";
  //   } elseif ($type == "js") {
  //     $homedir = "/home/lincp354/ffl2022/";
  //     $pageobjectssource = $homedir . $loc;
  //     // $pageobjectssource = ($this->locations["root"]["filefromtoptoindex"]) . $loc;
  //     $pagetext = file_get_contents($pageobjectssource);
  //     $template = "<script>\n%s\n</script>";
  //   } else {
  //     $homedir = "/home/lincp354/ffl2022/";
  //     $pageobjectssource = $homedir . $loc; 
  //     $pagetext = file_get_contents($pageobjectssource);
  //     $template = "<style>\n%s\n</style>";
  //   }
  //   return e($template, $pagetext);
  // }
 
  // function libraryfile55($file)
  // {
  //   return "/home/lincp354/ffl2022/live/code/general/libraries/" . $file;
  //   // include_once($app->file->anyfile("libraries", "setup_aflfixfromfw.php"));
  //   // include_once($app->file->anyfile("libraries", "setup_players.php"));
  //   // include_once($app->file->anyfile("libraries", "setup_drafts.php"));
  // }
  

}
