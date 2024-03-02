<?php

/* ****************************************************************************************** 
******************************  AppFile     *************************************************
****************************************************************************************** 

adddfileinposition3 <- addsavedfilegroups

addsavedfilegroups <- preparejs_local (C:\Sam\VSCode\FFLLP2\code\general\framework\modelhome.php)

*/


class AppPage
{

  // currently far more hard-coded that its predecessor but once settled can be made more generic 

  private $app;
  public $jslines;
  public $params;
  // public $locations;  //array of locations loaded from a site specific function - allows easier sharing of classes

  function __construct(AppSession $inputapp) {
    $this->app = $inputapp;
    $this->jslines = array();
    $this->checkparams();
  }
  
  function checkparams() {
    
    $this->params = array();
    foreach(explode("&", $_SERVER["QUERY_STRING"]) as $item) {
      $pos = strpos($item, "=");
      if ($pos > 0) $this->params[substr($item, 0, $pos)] = substr($item, $pos+1);
    }

  }

  function getpage() {

    if (isset($this->params["template"])) return $this->templatepage($this->params["template"]);

    $pg = $this->gethtml();
    $md = $this->getmodel();
    $pg = str_replace("<<jsextras>>", $md["js"], $pg);

    return $pg;

  }

  function templatepage($template) {

    $pg = $this->getblankhtml();
    $md = $this->getmodel($template);
    $pg = str_replace("<<jsextras>>", $md["js"], $pg);

    return $pg;

  }


  function getmodel($template = "") {
    
    $ret = array();

    //enure tags file exists
    $vsn = 6;
    $cch = $this->app->qry->getcache("tags");
    $filename = $this->app->file->requiredfilename("tags", $vsn, $cch);
    $fileoutput = $this->app->file->gettagsfilejs($cch);
    if ($filename) {
      $handle = fopen($filename, 'w') or die('Cannot open file:  ' . $filename);
      fwrite($handle, $fileoutput);
      fclose($handle);      
    }

    //htmldom.js
    $this->app->file->addjsfileincludescript("htmldom9.js", "js", true);

    //generalfns.js
    $this->app->file->addjsfileincludescript("generalfns2.js", "js", true);

    $this->addjs(e("<script>\n%s\n</script>", "let selectedtemplate = \"" . $template . "\""));

    //page.js
    $this->app->file->addjsfileincludescript("page.js", "js", $this->app->env == "localx");

    //itemutilities.js
    $this->app->file->addjsfileincludescript("itemutilities.js", "js", $this->app->env == "localx");

    //tags.js
    $this->app->file->addjsfileincludescript("tags.js", "js", $this->app->env == "localx");

    //scripts.js
    // $filename = $this->app->file->backendfilename("scripts.js", "js");
    // if (file_exists($filename)) $this->addjs(e("<script>\n%s\n</script>", file_get_contents($filename)));

    if ($this->app->env == "local") {
      $this->addjs(e("<script>\n%s\n</script>", "app.page.env = \"local\""));
    }


    $ret["js"] = $this->getjs();

    return $ret;

  }

  function addjs($js) {
    $this->jslines[] = $js;
  }

  function getjs() {
    return implode(" ", $this->jslines);
  }

  function gethtml() {

    return <<<html
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="description" content="" />
      <meta name="author" content="" />
      <title>Cauldron</title>

      <!-- Favicon-->
      <link rel="icon" type="image/x-icon" href="assets/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="assets/apple-touch-icon.png">
      <link rel="icon" type="image/png" sizes="32x32" href="assets/favicon-32x32.png">
      <link rel="icon" type="image/png" sizes="16x16" href="assets/favicon-16x16.png">
      <link rel="manifest" href="assets/site.webmanifest">

      <!-- Core theme CSS (includes Bootstrap)-->
      <link href="css/styles.css" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.min.css">
      <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>

    </head>
    
    <body>
      <div class="d-flex" id="wrapper">
        <!-- Page content wrapper-->
        <div id="page-content-wrapper">
          <!-- Top navigation-->
          <nav class="navbar navbar-expand-lg border-bottom" style="background-color:pink;--bs-border-width: 0px">
            <div class="container-fluid">
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav ms-auto mt-2 mt-lg-0">
                  <li class="nav-item active" onclick="app.page.spinnertoggle()"><a class="nav-link">Home</a></li>
                  <li class="nav-item"><a class="nav-link" href="#!">Link</a></li>
                  <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown"
                      aria-haspopup="true" aria-expanded="false">Dropdown</a>
                    <div class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                      <a class="dropdown-item" href="#!">Action</a>
                      <a class="dropdown-item" href="#!">Another action</a>
                      <div class="dropdown-divider"></div>
                      <a class="dropdown-item" href="#!">Something else here</a>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          <!-- Page content-->
          <div class="container-fluid">
          <div class="row" style="background-color:pink;">
            <div class="col-sm-1">
              <p></p>
            </div>
            <div class="col-sm-1" style="background-color:#FFEEEE; border-radius: 100% 0 0 0;'}">
            </div>
            <div class="col-sm-8 text-center" style="background-color:#FFEEEE;">
              <h4 id="pageheading">Heading</g4>
            </div>
            <div class="col-sm-1" style="background-color:#FFEEEE; border-radius: 0 100% 0 0;'}">
            </div>
            <div class="col-sm-1 text-right" style="background-color:pink;">
              <p id='dev1' style="color:#FFEEEE;"></p>
            </div>
          </div> 
          <div class="row">
              <div class="col-sm-1" style="background-color:pink;">
                <p></p>
              </div>
              <div id="maincontent" class="col-sm-10" style="background-color:#FFEEEE;">
                <div id="container1">
                </div>
              </div>
              <div class="col-sm-1" style="background-color:pink;">
                <p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>
                <p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>
              </div>
            </div> 
          </div>
        </div>
      </div>
    
      <!-- Bootstrap core JS-->
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
    
      <!-- JS-->
      <<jsextras>>
    
    </body>
    
    </html>
    
    html;
  }

  function gethtmlpinkwithnav() {

    return <<<html
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="description" content="" />
      <meta name="author" content="" />
      <title>Cauldron</title>
      <!-- Favicon-->
      <link rel="icon" type="image/x-icon" href="assets/favicon.ico" />
      <!-- Core theme CSS (includes Bootstrap)-->
      <link href="css/styles.css" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.min.css">
    </head>
    
    <body>
      <div class="d-flex" id="wrapper">
        <!-- Page content wrapper-->
        <div id="page-content-wrapper">
          <!-- Top navigation-->
          <nav class="navbar navbar-expand-lg border-bottom" style="background-color:pink;--bs-border-width: 0px">
            <div class="container-fluid">
            <h4 id='pageheading' class='text-right' style='min-width:300px;'>Cauldron</h4>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav ms-auto mt-2 mt-lg-0">
                  <li class="nav-item active"><a class="nav-link" href="#!">Home</a></li>
                  <li class="nav-item"><a class="nav-link" href="#!">Link</a></li>
                  <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown"
                      aria-haspopup="true" aria-expanded="false">Dropdown</a>
                    <div class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                      <a class="dropdown-item" href="#!">Action</a>
                      <a class="dropdown-item" href="#!">Another action</a>
                      <div class="dropdown-divider"></div>
                      <a class="dropdown-item" href="#!">Something else here</a>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          <!-- Page content-->
          <div class="container-fluid">
            <div class="row">
              <div class="col-sm-1" style="background-color:pink;">
                <p></p>
              </div>
              <div id="maincontent" class="col-sm-10" style="background-color:#FFEEEE;">
                <div id="quickelement">
                  <h1 class="mt-4">Simple Sidebar</h1>
                  <p>abc</p>
                </div>
              </div>
              <div class="col-sm-1" style="background-color:pink;">
                <p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>
                <p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>
              </div>
            </div>
  
          </div>
        </div>
      </div>
    
      <!-- Bootstrap core JS-->
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
    
      <!-- JS-->
      <script src='js/htmldom9.js'></script>
      <<jsextras>>
    
    </body>
    
    </html>
    
    html;
  }

  function gethtmlorig() {

    return <<<html
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="description" content="" />
      <meta name="author" content="" />
      <title>Simple Sidebar - Start Bootstrap Template</title>
      <!-- Favicon-->
      <link rel="icon" type="image/x-icon" href="assets/favicon.ico" />
      <!-- Core theme CSS (includes Bootstrap)-->
      <link href="css/styles.css" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.min.css">
    </head>
    
    <body>
      <div class="d-flex" id="wrapper">
        <!-- Sidebar-->
        <div class="border-end bg-white" id="sidebar-wrapper">
          <div class="sidebar-heading border-bottom bg-light">Start Bootstrap</div>
          <div class="list-group list-group-flush">
            <a class="list-group-item list-group-item-action list-group-item-light p-3" onclick="app.page.change('dashboard')">Dashboard</a>
            <a class="list-group-item list-group-item-action list-group-item-light p-3" onclick="app.page.change('items')">Items</a>
            <a class="list-group-item list-group-item-action list-group-item-light p-3" onclick="app.page.change('overview')">Overview</a>
            <a class="list-group-item list-group-item-action list-group-item-light p-3" onclick="app.page.change('events')">Events</a>
            <a class="list-group-item list-group-item-action list-group-item-light p-3" onclick="app.page.change('profile')">Profile</a>
            <a class="list-group-item list-group-item-action list-group-item-light p-3" onclick="app.page.change('status')">Status</a>
          </div>
        </div>
        <!-- Page content wrapper-->
        <div id="page-content-wrapper">
          <!-- Top navigation-->
          <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
            <div class="container-fluid">
              <button class="btn btn-primary btn-sm" id="sidebarToggle">Toggle Menu</button>
              <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
              <h4 id='pageheading' style='margin-left:30px'>Cauldron</h4>
              <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav ms-auto mt-2 mt-lg-0">
                  <li class="nav-item active"><a class="nav-link" href="#!">Home</a></li>
                  <li class="nav-item"><a class="nav-link" href="#!">Link</a></li>
                  <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown"
                      aria-haspopup="true" aria-expanded="false">Dropdown</a>
                    <div class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                      <a class="dropdown-item" href="#!">Action</a>
                      <a class="dropdown-item" href="#!">Another action</a>
                      <div class="dropdown-divider"></div>
                      <a class="dropdown-item" href="#!">Something else here</a>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          <!-- Page content-->
          <div id="maincontent" class="container-fluid">
            <div id="quickelement">
              <h1 class="mt-4">Simple Sidebar</h1>
              <p>The starting state of the menu will appear collapsed on smaller screens, and will appear non-collapsed on
                larger screens. When toggled using the button below, the menu will change.</p>
              <p>
                Make sure to keep all page content within the
                <code>#page-content-wrapper</code>
                . The top navbar is optional, and just for demonstration. Just create an element with the
                <code>#sidebarToggle</code>
                ID which will toggle the menu when clicked.
              </p>
              <p>abc</p>
            </div>
          </div>
        </div>
      </div>
    
      <!-- Bootstrap core JS-->
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
    
      <!-- JS-->
      <script src='js/htmldom9.js'></script>
      <<jsextras>>
    
    </body>
    
    </html>
    
    html;
  }



  function getblankhtml() {

    return <<<html
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="description" content="" />
      <meta name="author" content="" />
      <title>Cauldron</title>

      <!-- Favicon-->
      <link rel="icon" type="image/x-icon" href="assets/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="assets/apple-touch-icon.png">
      <link rel="icon" type="image/png" sizes="32x32" href="assets/favicon-32x32.png">
      <link rel="icon" type="image/png" sizes="16x16" href="assets/favicon-16x16.png">
      <link rel="manifest" href="assets/site.webmanifest">

      <!-- Core theme CSS (includes Bootstrap)-->
      <link href="css/styles.css" rel="stylesheet" />
      <link href="css/styles_print.css" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.min.css">
      <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>

    </head>
    
    <body>
      <div id="container1" class="three">
      </div>
    
      <<jsextras>>
    
    </body>
    
    </html>
    
    html;
  }

}


// <div id="spinner" class="d-flex justify-content-center" style="display:none">
// <div class="spinner-border" role="status">
//   <span class="visually-hidden">Loading...</span>
// </div>
// </div>
