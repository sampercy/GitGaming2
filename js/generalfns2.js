// Start of generalfns.js 5

function e0(s = "", indent = 0) { return "-".repeat(indent) + s }
function e1(s = "", indent = 0) { return "-".repeat(indent) + s + "<br />" }
function e2(s = "", indent = 0) { return "-".repeat(indent) + s + "<br />" + "<br />" }
function eo(obj) { return JSON.stringify(obj) }
function b(s) { return "<span style='font-weight:bold'>" + s + "</span>" }
function bold(s) { return b(s) }
function red(s) { return colour(s, "red") }
function blue(s) { return colour(s, "blue") }
function green(s) { return colour(s, "green") }
function magenta(s) { return colour(s, "magenta") }
function colour(s, clr) { return "<span style='color:" + clr + "'>" + s + "</span>" }
function linethrough(s, clr = "gray") { return "<span style='text-decoration: line-through;" + ((clr) ? " color:" + clr : "") + "'>" + s + "</span>" }
function italics(s) { return "<span style='font-style: italic'>" + s + "</span>" }
function espan(id) { return "<span id='" + id + "'></span>" }
function ediv(id) { return "<div id='" + id + "'></div>" }
function em(s = "", emafter = 0) { return "&emsp;" + s + ((emafter == 0 || s === "") ? "" : "&emsp;")}
function ems(s = "") { return em(s, 1)}
function quoted(s, q = "\"") {return q + s + q}
function br(x) {return "<br/>".repeat(x) }
function pre(s) { return "<pre>" + s + "</pre>" }

function en(s) { return e0(s) }  //php copy

function yn(bln, fmt = "true") {
  if (fmt == "true") return (bln ? "true" : "false");
  if (fmt == "True") return (bln ? "True" : "False");
  if (fmt == "Yes") return (bln ? "Yes" : "No");
  return (bln ? "Y" : "N");
}

function aliststr(...prms) {
  let s = ""
  for (let p of prms) s += p + " : "
  return s
}
function alist(...prms) {
  let s = ""
  for (let p of prms) s += p + " : "
  alert(s)
}
function alistif(cond, ...prms) {
  if (cond) alist(...prms)
}
function alertif(cond, s) {
  if (cond) alert(s)
}
function alerta(s) {
  if (app.user.security) alert(s)
}
function alertbool(cond) {
  alert(cond ? "yes" : "no")
}
function aa() {
  s = ""
  for (i = 0; i < arguments.length; i++) s += ((i) ? ":" : "") + (arguments[i])
  alert(s)
}
function ao(obj) {
  alert(JSON.stringify(obj))
}
function o2slimit(limit, obj, resetDepth = 0, depth = 0) {
  if (obj === null) return "null";
  let s = typeof (obj)
  if (s === "object") { 
    var c = Object.keys(obj).length
    return (c <= limit ? "" : colour("Showing " + limit + " of " + c + ": ", "orange")) + o2s(obj, resetDepth, depth, limit)
  }
  return o2s(obj, resetDepth, depth, limit)
}

function o2s(obj, resetDepth = 0, depth = 0, limit = -1, nokeys = false) {
  if (obj === null) return "null";
  let s = typeof (obj)
  if (s === "object") { 
    s = ""
    Object.entries(obj).forEach(([key, value]) => {
      if (limit != 0) {
        if (limit > 0) limit--
        let kvpair = ""
        if (!nokeys) kvpair = colour(key + "=", getcolour(depth))
        if (value == null) value = colour(italics("null"), "gray")
        switch (typeof value) {
          case "function":
            kvpair += "function"
            break
          case "object":
            if (Array.isArray(value))
              kvpair += "[" + o2s(value, resetDepth, depth + 1, limit, true) + "]"
            else
              kvpair += "{" + o2s(value, resetDepth, depth + 1) + "}"
            break
          case "string":
            kvpair += value.tagSafe()
            break
          default:
            kvpair += value
            break
        }
        if (resetDepth == depth) { if (s) s += e1("") } else { if (s) s += ", " }
        s += kvpair
      }
    })
  }
  return s

  function getcolour(depth) {
    switch (depth) {
      case 0: return "blue"
      case 1: return "red"
      case 2: return "green"
      case 3: return "magenta"
      case 4: return "orange"
      default: return "black"
    }
  }

}



function ensureproperty(obj, prop, value = {}) {
  //obj should be an object, prop a string
  if (!obj.hasOwnProperty(prop)) obj[prop] = value
}
function jsonclone(o) {
  //clones objects with values able to be converted to json, which is all of our team and player data
  return JSON.parse(JSON.stringify(o))
}

function arrofobjs(obj, title, keys = []) {
  if (!Array.isArray(obj)) return e1(title + ": Not an array.")
  var s = ""
  var ms = ""
  var i = obj.length
  if (keys.length == 0) {
    s += JSON.stringify(obj)
  } else {
    obj.forEach((o, idx) => {
      s += e1(b(idx) + ": " + stringifyobjectbyspecifickeys(o, keys, "magenta"))
      if (!ms) ms = getmissingkeys(o, keys)
    });
  }
  if (title) return e1(b(title) + ": (Array with entries: " + i + ")") + s + e1(ms);
  return e1(s);
}
function objofobjs(obj, title, keys = []) {
  var s = ""
  var ms = ""
  var i = 0
  if (keys.length == 0) {
    s += JSON.stringify(obj)
    i = Object.keys(obj).length
  } else {
    Object.entries(obj).forEach(([key, o]) => {
      s += e1(b(key) + ": " + stringifyobjectbyspecifickeys(o, keys))
      i++
      if (!ms) ms = getmissingkeys(o, keys)
    })
  }
  return e1(b(title) + ": (Object with entries: " + i + ")") + s + e1(ms)
}
function getmissingkeys(o, keys) {
  //intended for use by objofobjs and arrofobjs only
  var ms = ""
  Object.keys(o).forEach(ok => {
    if (!keys.includes(ok)) {
      ms += (ms) ? ", " : ""
      ms += ok
    }
  })
  if (ms) return e1("Keys not shown: " + ms);
  return e1("All keys shown");

}
function stringifyobjectbyspecifickeys(o, keys, clr = "blue") {
  //intended for use by objofobjs and arrofobjs only
  var ln = ""
  keys.forEach(k => {
    if (o.hasOwnProperty(k)) {
      ln += " " + colour(k, clr) + ":" + o[k]
    } else {
      ln += " " + red(k)
    }
  })
  return ln
}

function twodigitnumber(nbr, digits = 2) {
  return ("0".repeat(digits) + (nbr)).slice(-digits);
}



// ******************************************** Misc - need moving

function sortObj(obj) {
  return Object.keys(obj).sort().reduce(function (result, key) {
    result[key] = obj[key];
    return result;
  }, {});
}

function ensureproperty(obj, prop, value = {}) {
  //obj should be an object, prop a string
  if (!obj.hasOwnProperty(prop)) obj[prop] = value
}


// ******************************************** Messing with prototypes


String.prototype.tagSafe = function() { return this.replaceAll("<", "&lt;") }

String.prototype.shortString = function(clr="", nochangelength=25, spacecutoffdelta=7) { 
  if (!this) return "";
  let s = this.tagSafe()
  if (s.length <= nochangelength) return s;
  let p = s.indexOf(" ", nochangelength-spacecutoffdelta)
  if (p == -1) p = nochangelength-spacecutoffdelta
  if (clr) return colour(s.substring(0,p), clr) + colour("...length (" + s.length + ")", "gray")
  return s.substring(0,p) + colour("...length (" + s.length + ")", "gray")
}

String.prototype.lateChanges = function() { return this.replaceAll("<-<", "<<").replaceAll(">->", ">>").replaceAll("pipecharacter", "|") }


// ******************************************** Ajax helpers

function postAjax(inputObject, fn, spinner = 1) {

  //alert(app.page.ajaxlocs[app.page.env])

  $.ajax({
    type: "POST",
    url: app.page.ajaxlocs[app.page.env],
    data: inputObject,
    dataType: "json",
    success: fn
  });
  // if (spinner) app.setSpinnerVisible(true)

}

function makeemptyrow(colcount) {

  var tr = document.createElement("tr");
  for (let i = 0; i < colcount; i++) {
    var td = document.createElement("td");
    tr.appendChild(td);
  }
  return tr;

}

// ******************************************** Array helpers

function tempgroupcount(arr, fn) {
  var ret = {}
  arr.forEach(a => {
    res = fn(a)
    if (!ret.hasOwnProperty(res)) ret[res] = 1; else ret[res]++;
  })
  return ret
}

// ******************************************** Object helpers

function ensurechild(childname, obj) {
  if (typeof (obj) === "object") {
    if (!obj.hasOwnProperty(childname)) obj[childname] = {}
  }
}

function ensurechildarray(childname, obj) {
  if (typeof (obj) === "object") {
    if (!obj.hasOwnProperty(childname)) obj[childname] = []
  }
}

function ensurechildandaddtoarray(obj, key, item) {
  if (obj.hasOwnProperty(key)) {
    if (typeof item !== "object") {
      if (!obj[key].includes(item)) obj[key].push(item)
    } else {
      obj[key].push(item)
    }
  } else {
    obj[key] = [item]
  }
}

// ******************************************** Header display

function setpageheader(hdr) {
  setdiv("pageheadertext", hdr)
}
// ******************************************** Original function for dealing with activating block buttons

function activeElementsRegister(groupName, elementNamesArray, classValue, alreadySet = "") {
  //handles the highlighting of the clickable buttons
  activeElementsTemp[groupName] = null
  for (let elementName of elementNamesArray) {
    let e = document.getElementById(elementName)
    if (e != null) {
      if (alreadySet == elementName) activeElementsTemp[groupName] = e
      e.addEventListener("click", () => {
        //alert(classValue + "_" + groupName + "_" + elementName)
        if (activeElementsTemp[groupName] != null) activeElementsTemp[groupName].classList.remove(classValue)
        activeElementsTemp[groupName] = e
        e.classList.add(classValue)
      });

    }
  }
}

// ******************************************** Toast display

function showtoast(colour, heading, smalltext, mainmessage, time) {

  //showtoast("#008040", "Selections", "Small text", "Main message", 500)

  // document.getElementById('toastrect').attributes()

  $("#toastrect").attr("fill", colour);
  $("#toastheading").text(heading);
  $("#toastsmall").text(smalltext);
  $("#toastmsg").text(mainmessage);

  if (time) {
    $('#toastelement').attr('data-autohide', 'true');
    $('#toastelement').attr('data-delay', time);
  } else {
    $('#toastelement').attr('data-autohide', 'false');
    $('#toastelement').attr('data-delay', 500);
  }
  $('#toastelement').toast('show');

}

function errortoast(msg) {
  let toast = {colour : "#ff0000", heading : "Error", smalltext : "", mainmessage : msg, time : 5000}
  showtoastobject(toast)
}

function successtoast(msg) {
  let toast = {colour : "#00ff00", heading : "Success", smalltext : "", mainmessage : msg, time : 3000}
  showtoastobject(toast)
}

function showtoastobject(toast) {

  let obj = {colour : "#008040", heading : "A Short Header", smalltext : "", mainmessage : "Can be longer", time : 5000}

  toast.colour = toast.colour || obj.colour
  toast.heading = toast.heading || obj.heading
  toast.smalltext = toast.smalltext || obj.smalltext
  toast.mainmessage = toast.mainmessage || obj.mainmessage
  toast.time = toast.time || obj.time

  showtoast(toast.colour, toast.heading, toast.smalltext, toast.mainmessage, toast.time)

}


// ******************************************** Date helpers

function ensureMonths() {
  if (!app.data.months) {
    app.data.months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    app.data.longmonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    app.data.days = ["Sun", "Mon", "Tues", "Weds", "Thur", "Fri", "Sat"];
    app.data.longdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  }
}

function datefromsqldatetime(datestring) {
  // var s = "2022-05-20 03:24:41"
  var d = new Date(datestring)
  if (d) return d
}

function isdateobject(d) {
  return d instanceof Date
}

function makeDate(dt) {
  if (isdateobject(dt)) return dt;
  if (typeof dt == "string") {
    return datefromsqldatetime(dt)
  }
  return false;
}

function getdateoptionslongdate() {
  return { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'}
}

function formatDateLongNoYear(dt, options = false) {
  ensureMonths()
  dt = makeDate(dt)
  if (!options) return app.data.months[dt.getMonth()] + " " + dt.getDate() + ", " + this.show12Htime(dt)
  if (options == "longdate") options = getdateoptionslongdate()
  return dt.toLocaleDateString("en-US", options)
}

function formatDateOnly(dt) {
  ensureMonths()
  return app.data.months[dt.getMonth()] + " " + dt.getDate()
}

function show12Htime(dt) {
  // dt is a Date object, assumed to be in UTC, so this is a generic fn with no conversion made 
  if (dt.getUTCHours() < 12) return dt.getUTCHours() + ":" + twodigitnumber(dt.getUTCMinutes()) + "am";
  if (dt.getUTCHours() == 12 && dt.getUTCMinutes() == 0) return "noon";
  if (dt.getUTCHours() == 12) return dt.getUTCHours() + ":" + twodigitnumber(dt.getUTCMinutes()) + "pm";
  return (dt.getUTCHours() - 12) + ":" + twodigitnumber(dt.getUTCMinutes()) + "pm";
}



// End of generalfns.js