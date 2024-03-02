<?php

ini_set("display_errors", 1);
session_start();
error_reporting(E_ALL & ~E_NOTICE);

// echo print_r($_SERVER, true);

//php 8 code to remove the annoying errors 
// set_error_handler(function($errno, $error){
//   return str_starts_with($error, 'Undefined array key');
// }, E_WARNING);

$env = ($_SERVER["HTTP_HOST"] == "localhost") ? "local" : "web";
$homedir = ($env == "local") ? "C:/OneDrive/Dev/GamingSite/" : "/home/lincp354/gaming/";

// $homedir = "/home/lincp354/gaming/";

include_once($homedir."php/globals.php");
include_once($homedir."php/appsession.php");
include_once($homedir."php/appquery.php");
include_once($homedir."php/appfile.php");
include_once($homedir."php/apppage.php");
include_once($homedir."php/parsefile.php");
// include_once($homedir."php/tempmain.php");

$app = new AppSession($env);
echo $app->page->getpage();


/*
Web

Array ( 
[PATH] => /usr/local/bin:/usr/bin:/bin 
[TEMP] => /tmp 
[TMP] => /tmp 
[TMPDIR] => /tmp 
[PWD] => / 
[HTTP_ACCEPT] => text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*\*;q=0.8,application/signed-exchange;v=b3;q=0.7 
[HTTP_ACCEPT_ENCODING] => gzip, deflate, br 
[HTTP_ACCEPT_LANGUAGE] => en-GB,en;q=0.9,en-US;q=0.8 
[CONTENT_LENGTH] => 0 
[HTTP_HOST] => gaming.sampercy.com 
[HTTP_REFERER] => https://sampercy.com/ 
[HTTP_USER_AGENT] => Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0 
[HTTP_SEC_CH_UA] => "Not A(Brand";v="99", "Microsoft Edge";v="121", "Chromium";v="121" 
[HTTP_SEC_CH_UA_MOBILE] => ?0 
[HTTP_SEC_CH_UA_PLATFORM] => "Windows" 
[HTTP_UPGRADE_INSECURE_REQUESTS] => 1 
[HTTP_SEC_FETCH_SITE] => same-site 
[HTTP_SEC_FETCH_MODE] => navigate 
[HTTP_SEC_FETCH_USER] => ?1 
[HTTP_SEC_FETCH_DEST] => document 
[UNIQUE_ID] => Zbh54oJ5QLQHDvbmP_7HdAAAhAg 
[HTTPS] => on 
[SSL_TLS_SNI] => gaming.sampercy.com 
[HTTP2] => on 
[H2PUSH] => off 
[H2_PUSH] => off 
[H2_PUSHED] => 
[H2_PUSHED_ON] => 
[H2_STREAM_ID] => 1 
[H2_STREAM_TAG] => 3835147-90-1 
[SERVER_SIGNATURE] => 
[SERVER_SOFTWARE] => Apache 
[SERVER_NAME] => gaming.sampercy.com 
[SERVER_ADDR] => 64.34.75.146 
[SERVER_PORT] => 443 
[REMOTE_ADDR] => 202.65.83.245 
[DOCUMENT_ROOT] => /home/lincp354/gaming 
[REQUEST_SCHEME] => https 
[CONTEXT_PREFIX] => 
[CONTEXT_DOCUMENT_ROOT] => /home/lincp354/gaming 
[SERVER_ADMIN] => webmaster@gaming.sampercy.com 
[SCRIPT_FILENAME] => /home/lincp354/gaming/index.php 
[REMOTE_PORT] => 56743 
[SERVER_PROTOCOL] => HTTP/2.0 
[REQUEST_METHOD] => GET 
[QUERY_STRING] => 
[REQUEST_URI] => / 
[SCRIPT_NAME] => /index.php 
[PHP_SELF] => /index.php 
[REQUEST_TIME_FLOAT] => 1706588643.435 
[REQUEST_TIME] => 1706588643 )

Local

Array ( 
  [MIBDIRS] => C:/xampp/php/extras/mibs 
  [MYSQL_HOME] => \xampp\mysql\bin 
  [OPENSSL_CONF] => C:/xampp/apache/bin/openssl.cnf 
  [PHP_PEAR_SYSCONF_DIR] => \xampp\php 
  [PHPRC] => \xampp\php 
  [TMP] => \xampp\tmp 
  [HTTP_HOST] => localhost 
  [HTTP_CONNECTION] => keep-alive 
  [HTTP_CACHE_CONTROL] => max-age=0 
  [HTTP_SEC_CH_UA] => "Not A(Brand";v="99", "Microsoft Edge";v="121", "Chromium";v="121" 
  [HTTP_SEC_CH_UA_MOBILE] => ?0 
  [HTTP_SEC_CH_UA_PLATFORM] => "Windows" 
  [HTTP_UPGRADE_INSECURE_REQUESTS] => 1 
  [HTTP_USER_AGENT] => Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0 
  [HTTP_ACCEPT] => text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*\*;q=0.8,application/signed-exchange;v=b3;q=0.7 
  [HTTP_SEC_FETCH_SITE] => none 
  [HTTP_SEC_FETCH_MODE] => navigate 
  [HTTP_SEC_FETCH_USER] => ?1 
  [HTTP_SEC_FETCH_DEST] => document 
  [HTTP_ACCEPT_ENCODING] => gzip, deflate, br 
  [HTTP_ACCEPT_LANGUAGE] => en-GB,en;q=0.9,en-US;q=0.8 
  [HTTP_COOKIE] => PHPSESSID=ng6fjkgb8ngi7ttn5r8d578uef 
  [PATH] => C:\WINDOWS\system32;C:\WINDOWS;C:\WINDOWS\System32\Wbem;C:\WINDOWS\System32\WindowsPowerShell\v1.0\;C:\WINDOWS\System32\OpenSSH\;C:\Users\sammo\AppData\Local\Microsoft\WindowsApps;C:\Users\sammo\AppData\Local\Programs\Microsoft VS Code\bin 
  [SystemRoot] => C:\WINDOWS 
  [COMSPEC] => C:\WINDOWS\system32\cmd.exe 
  [PATHEXT] => .COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JS;.JSE;.WSF;.WSH;.MSC 
  [WINDIR] => C:\WINDOWS 
  [SERVER_SIGNATURE] =>
  Apache/2.4.58 (Win64) OpenSSL/3.1.3 PHP/8.0.30 Server at localhost Port 80
  
  [SERVER_SOFTWARE] => Apache/2.4.58 (Win64) OpenSSL/3.1.3 PHP/8.0.30 
  [SERVER_NAME] => localhost 
  [SERVER_ADDR] => ::1 
  [SERVER_PORT] => 80 
  [REMOTE_ADDR] => ::1 
  [DOCUMENT_ROOT] => C:/xampp/htdocs 
  [REQUEST_SCHEME] => http 
  [CONTEXT_PREFIX] => 
  [CONTEXT_DOCUMENT_ROOT] => C:/xampp/htdocs 
  [SERVER_ADMIN] => postmaster@localhost 
  [SCRIPT_FILENAME] => C:/xampp/htdocs/demo.php 
  [REMOTE_PORT] => 54447 
  [GATEWAY_INTERFACE] => CGI/1.1 
  [SERVER_PROTOCOL] => HTTP/1.1 
  [REQUEST_METHOD] => GET 
  [QUERY_STRING] => 
  [REQUEST_URI] => /demo.php 
  [SCRIPT_NAME] => /demo.php 
  [PHP_SELF] => /demo.php 
  [REQUEST_TIME_FLOAT] => 1706529293.6133 
  [REQUEST_TIME] => 1706529293 )

  */

  ?>