<?php

//AppSession
//AppUser
//AppTeam

class AppSession
{

  // public $website; //Normally true for a page load, false when a cron job is running the code
  public $qry;
  public $file;
  public $page;
  public $env;

  function __construct($env)
  {

    $this->env = $env;
    $this->qry = new AppQuery($env);
    $this->file = new AppFile($this);
    $this->page = new AppPage($this);

  }

}
