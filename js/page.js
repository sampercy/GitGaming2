class pageset{

  constructor(setname, e) {
    this.name = setname
    this.parent = domgetelement(e)
    this.elements = {}
    this.selectedname = ""
  }

  selectelement(elementname, starthidden = false) {
    if (!this.elements.hasOwnProperty(elementname)) this.elements[elementname] = domaddelemid(this.parent, this.autoname(elementname))
    if (!starthidden) {
      Object.entries(this.elements).forEach(([ename, e]) => {
        if (ename == this.selectedname) e.style.display = "none"
        if (ename == elementname) e.style.display = "block"
      })
      this.selectedname = elementname
    }
    return this.elements[elementname]
  }

  setinnerhtml(elementname, html) {
    let e = this.selectelement(elementname)
    e.innerHTML = html
  }

  autoname(s) {
    return (this.name + "_" + s).replaceAll(" ", "")
  }

}


class page {

  constructor() {
    this.main = domgetelement("container1")
    this.heading = domgetelement("pageheading")
    this.sets = {}
    this.addpageset("main", this.main)

    this.changecount = -1
    this.lastbreadcrumbs = ""
    this.spinnervisible = false
    this.spinnerelement = null

    this.visited = ["sp-fireball", "sp-spirit-guardians", "sp-phantasmal-killer"]
    this.filter = new itemlistfilter()
    this.factory = new itemfactory()
    
    this.setchanges(0)
  }

  addpageset(name, parentelement, firstelementname = "") {
    if (this.sets.hasOwnProperty(name)) return;
    this.sets[name] = new pageset(name, parentelement)
    if (firstelementname) return this.sets[name].addelement(firstelementname)
  }

  setheading(s) {
    this.heading.innerHTML = s
  }



  addchange() {
    this.setchanges(this.changecount + 1)
  }

  setchanges(c) {

    if (this.changecount == c) return;

    this.changecount = c
    let e = domgetelement("dev1")
    if (!e) return;

    let fn = app.out.getchangecode("changes")
    // let tbg = new tagbuttongroup(fn)
    // tbg.add("primary", "Changes:")
    // tbg.add("secondary", c)

    let s = ""
    s += "<button type='button' onclick='" + fn + "'class='btn btn-sm btn-secondary'>"
    if (c)
      s += "Changes <span class='badge bg-danger'>" + c + "</span>"
    else
      s += "Changes <span class='badge bg-secondary'>0</span>"
    s += "</button>"

    e.innerHTML = s
  }

  // Set up objects

  firstpage() {
    if (app.data.template.length == 0) {
      this.change("items")
    } else {
      this.change("template", app.data.template)
    }
  }

  change(type, code = "") {

    // console.log("change " + type + " " + code)
    if (type == "items") {
      app.page.setheading("Items")
      let e = this.sets["main"].selectelement("itemslist")
      app.out.allitembuttons(e)
    } else if (type == "spell") {
      this.buttonswitchvisited("allbtns-" + code)
      let e = this.sets["main"].selectelement("itemview")
      app.tags.showitem(e, code)
    } else if (type == "tag") {
      let e = this.sets["main"].selectelement("tagview")      
      app.tags.showtag(code)
    } else if (type == "element") {
      let e = this.sets["main"].selectelement("elementview")      
      app.tags.showelement(code)
    } else if (type == "changes") {
      this.sets["main"].selectelement("changeview")
      app.out.changes()
    } else if (type == "template") {
      this.sets["main"].selectelement("changeview")
      app.tags.outputelement(code)
    } else {
      alert(type)
    }
  
  }

  buttonswitchvisited(e) {
    let btn = domgetelement(e)
    if (btn) {
      btn.classList.remove("btn-info");
      btn.classList.add("btn-warning");    
    }
  }

  spinnertoggle() {
    if (!this.spinnerelement) this.spinnerelement = domgetelement("spinner")
    this.spinnervisible = !this.spinnervisible
    this.spinnerelement.style.display = (this.spinnervisible ? "block" : "none")
    alert(9)
  }

  setexists(set) {
    return this.sets.hasOwnProperty(set)
  }


}

class tagbuttongroup {

  constructor(fn, sizeclass = "btn-sm") {
    this.function = fn
    this.sizeclass = sizeclass
    this.buttons = []
  }

  add(clr, value) {
    this.buttons.push({"colour": clr, "value": value})
  }

  output() {

    let s = ""
    s += "<div class='btn-group' role='group' style='padding:3px'>"
    this.buttons.forEach(b => {
      s += "  <button type='button' " + this.function + " class='btn btn-sm btn-" + b.colour + "'>" + b.value + "</button>"
    })
    s += "</div>"
    return s

  }
}

class breadcrumbs {

  constructor() {
    this.buttons = []
  }

  add(clr, fn, txt) {
    this.buttons.push({"colour": clr, "function": fn, "text": txt})
  }

  output() {

    let s = ""
    let ct = 0
    this.buttons.forEach(b => {
      s += app.out.genbutton(b.colour, b.function, b.text)
      if (++ct < this.buttons.length) s += " > "
    })
    app.page.lastbreadcrumbs = s
    return s

  }
}
