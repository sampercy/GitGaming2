// Start of htmldom.js

function domgetelement(e) {
  if (typeof e == "string") e = document.getElementById(e)
  return e  
}

function domaddtextnodetoelement(e, text) {
  e = domgetelement(e)
  if (!e) return;
  e.appendChild(document.createTextNode(text));
}

function domcleardiv(e) {
  e = domgetelement(e)
  if (e) e.innerHTML = ""
  return e
}

function domaddelemid(parent, id, type="div") {
  if (parent !== 0) {
    parent = domgetelement(parent)
    if (!parent) return;
  }
  let newelem = document.createElement(type)
  if (id) newelem.setAttribute("id", id)
  if (parent) parent.appendChild(newelem)
  return newelem
}

function domaddelem(parent, type="div") {
  return domaddelemid(parent, "", type)
}

function domaddeleminnertext(parent, txt, type="div") {
  let e = domaddelemid(parent, "", type)
  e.innerText = txt
  return e
} 

function domaddeleminnerhtml(parent, html, type="div") {
  let e = domaddelemid(parent, "", type)
  e.innerHTML = html
  return e
}

function domaddclassestoelement(e, classes = "") {
  if (!classes) return;
  if (!Array.isArray(classes)) classes = classes.split(" ")
  classes.forEach(c => e.classList.add(c))
}

function domsetactiveclass(e, value, classname = "active") {
  e = domgetelement(e)
  if (e) {
    if (value) e.classList.add(classname); else e.classList.remove(classname);
  }
}

function domaddbuttontoelement(e, id, caption, classes = "btn btn-sm btn-secondary", icon = "") {
  
  e = domgetelement(e)
  if (!e) return;
  let btn = document.createElement("button")
  if (id) btn.setAttribute("id", id)

  if (icon) {
    let iconelem = document.createElement('i')
    iconelem.classList.add("fas")
    iconelem.classList.add("fa-" + icon)
    btn.appendChild(iconelem)
    caption = " " + caption
  }

  if (caption) btn.appendChild(document.createTextNode(caption))
  domaddclassestoelement(btn, classes)
  e.appendChild(btn)
  return btn

}

function domaddbuttontoelement_filter(e, id, caption) {
  return domaddbuttontoelement(e, id, caption, "btn btn-displayblock")  //cyan button (active/inactive = dark)
}

function domaddbuttontoelement_function(e, id, caption) {
  return domaddbuttontoelement(e, id, caption, "btn btn-function")  //grey with cyan text
}

function domaddbuttontoelement_admin(e, id, caption, icon = "") {
  return domaddbuttontoelement(e, id, caption, "btn btn-sm btn-secondary", icon) // big ugly grey buttons
}

function domaddicontoelement(parent, icon = "") {

  let iconelem = document.createElement('i')
  iconelem.classList.add("fas")
  iconelem.classList.add("fa-" + icon)
  parent.appendChild(iconelem)

  return iconelem

}

function domiconbuttonspan(parent, icon = "times", fn = false) {
  // function domiconbuttonspan(parent, icon = "times", marginleft = "", marginright = "", fn = false) {
  let e = domaddelem(parent, "span")
  domaddicontoelement(e, icon)
  e.style.cursor = "pointer"
  if (fn) e.onclick = fn
  // if (marginleft) e.style.marginLeft = marginleft
  // if (marginright) e.style.marginRight = marginright
  return e  
}

function dom2elementdisplayleft(eleft, eright, leftcond, block = "block") {
  eleft.style.display = (leftcond) ? block : "none"
  eright.style.display = (leftcond) ? "none" : block
}

function domconditionalcolour(e, cond, colourtrue, colourfalse) {
  e = domgetelement(e)
  e.style.color = (cond) ? colourtrue : colourfalse
}




function domaddcollapsingdiv(parent, header, text, headerclr = "blue") {

  let ehdr = domaddelem(parent)
  let etxt = domaddelem(parent)
  let espc = domaddelem(parent)

  // Header
  let spn1 = domaddelem(ehdr, "span")
  let spn2 = domaddelem(ehdr, "span")

  domaddicontoelement(spn1, "eye")
  spn1.classList.add("redgreentextbutton")
  spn1.style.marginRight = "10px"
  spn1.onclick = () => {
    if (spn1.classList.contains("active")) {
      spn1.classList.remove("active")
      etxt.style.display = "none"
    } else {
      spn1.classList.add("active")
      etxt.style.display = "block"
    }
  }

  spn2.innerHTML = header
  spn2.style.color = headerclr
  
  // Main
  etxt.innerHTML = text
  etxt.style.display = "none"

  //Spacer
  espc.innerHTML = e1()

}

function domaddteamicon(parent, tm) {
  var img = domaddelem(parent, "img")
  img.setAttribute("src", teamicon(tm))
  img.setAttribute("alt", tm)
  img.setAttribute("width", "16px")
  img.setAttribute("height", "16px")
  return img
}

// ************

function addelementifneeded(required, parent, prehtml = "", posthtml = "") {
  //pass in id strings, also allows for html elements to be added before and after. Quite specific, and intended for initial block pages

  let elem = document.getElementById(required)
  if (!elem) {
    let prnt = document.getElementById(parent)
    if (!prnt) {
      console.log("Unable to find page element: " + parent + " to create child " + required)
      return
    }
    let elemtxt = document.createElement("div")
    elemtxt.setAttribute("id", required + '_pre')
    elemtxt.innerHTML = prehtml
    prnt.appendChild(elemtxt)

    elem = document.createElement("div")
    elem.setAttribute("id", required)
    prnt.appendChild(elem)

    elemtxt = document.createElement("div")
    elemtxt.setAttribute("id", required + '_post')
    elemtxt.innerHTML = posthtml
    prnt.appendChild(elemtxt)

  }
  return elem;

}

function addmainelement(required, parent, header) {
  return addelementifneeded(required, parent, "<br/><h4>" + header + "</h4>", "<br/><br/>")
}

function addbutton(parent, buttonid, caption, icon = "", bscol = "btn-secondary") {
  let elem = domgetelement(parent)
  if (!elem) {
    console.log("Unable to find page element: " + parent + " to create button " + buttonid)
    return
  }
  let btn = document.createElement("button")
  btn.setAttribute("id", buttonid)

  if (icon) {
    let iconelem = document.createElement('i')
    iconelem.classList.add("fas")
    iconelem.classList.add("fa-" + icon)
    btn.appendChild(iconelem)
    caption = " " + caption
  }

  btn.appendChild(document.createTextNode(caption))

  btn.classList.add("btn")
  btn.classList.add("btn-sm")
  btn.classList.add(bscol)

  elem.appendChild(btn)

  // button.onclick = splitsquadbutton
  return btn

}

function showelement(id, show = true) {
  let e = domgetelement(id)
  if (e) e.style.display = (show ? "block" : "none")
}

function hidebutton(id) {
  // let e = document.getElementById(id)
  // if (e) e.style.display = "none"
  showelement(id, false)
}

function adddiv(parent, id = "", html = "") {
  //pass in id strings

  let e
  if (id) e = document.getElementById(id)

  if (!e) {
    let prnt = document.getElementById(parent)
    if (!prnt) return false;
    e = document.createElement("div")
    if (id) e.setAttribute("id", id)
    prnt.appendChild(e)
  }

  if (html) e.innerHTML = html

  return e;

}

function setdiv(id, html = "") {

  let e
  if (id) e = document.getElementById(id)

  if (e) e.innerHTML = html
  return e;

}

function addhtml(parent, html, id="") {

  let prnt = document.getElementById(parent)

  if (prnt) {
    let e = document.createElement("div")
    if (id) e.setAttribute("id", id)
    e.innerHTML = html
    prnt.appendChild(e)
    return e;
  }

}


function movekeyuptokey(obj, move, before) {
  // Creates a new object
  // Given a target object, move the item indicate with the key (move) to the position just before the other. 

  let ks = Object.keys(obj)
  let k1 = ks.findIndex(k => (k == move))
  let k2 = ks.findIndex(k => (k == before))
  ks.splice(k2, 0, ks.splice(k1, 1)[0])
  let out = {}
  ks.forEach(k => {
    out[k] = obj[k]
  })
  return out;
}


//  ***************************  Array filtering help

function sortnumericobjectfield(fld, dir = "asc") {
  if (dir == "asc") return (b, a) => (b[fld] - a[fld])
  return (a, b) => (b[fld] - a[fld])  
}


// End of htmldom.js
