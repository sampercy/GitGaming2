
/*

Adding functionality tofilter items on main items screen. 

Want to add level filter, class, and perhaps 'items with tag = ?'

Then add functionality to bulk add/edit tags

Need to determine functionality for editing tags too - permissions.

*/


class itemgrid {

  constructor() {
    this.fields = []
    this.sorter = ""
    this.filters = []
  }

  setfields(...p) {
    this.fields = p
  }

  setsorter(s) {
    this.sorter = s
  }

  addfilter(fld, val) {
    let obj = {"type": "simple", "field": fld, "value": val}
    this.filters.push(obj)
  }

  addfilter_nameandvalue(tagname, tagvalue) {
    let obj = {"type": "nameandvalue", "tagname": tagname, "tagvalue": tagvalue}
    this.filters.push(obj)
  }

  grid() {

    let filteredset = []
    let firstrun = true

    this.filters.filter(f2 => f2.type == "nameandvalue").forEach(f => {
      let itemcodes = app.data.tags.filter(t => (t.tagname == f.tagname && t.tagvalue == f.tagvalue)).map(t => t.itemcode)
      if (firstrun) {
        firstrun = false
        filteredset = itemcodes
      } else {
        filteredset = filteredset.filter(element => itemcodes.includes(element));
      }
    })

    let grid = {}

    filteredset.forEach(code => {
      let itm = {}

      this.fields.forEach(fld => {
        let tag = app.data.tags.find(t => (t.itemcode == code && t.tagname == fld))
        if (tag) itm[fld] = tag.tagvalue
      })

      grid[code] = itm
    })

    // let s= ""
    // let x = 0
    // Object.entries(app.data.tagsummary).forEach(([key, value]) => {
    //   if (++x < 5) s += e1(x + ": " + key + " = " + o2s(value, -1))
    // })

    return e2(o2s(filteredset)) + e2(o2s(grid)) + this.gridsetuptext()
  }

  gridsetuptext() {
    let s = ""
    s += e1(bold("Fields: ") + o2s(this.fields))
    s += e1(bold("Filters: ") + o2s(this.filters))
    s += e1(bold("Sort: ") + this.sorter)
    return s
  }


}


class itemlistsinglefilter {

  constructor(name) {
    this.name = name
  }

  setuplevel() {

    // let levels = app.data.

    Object.values(app.data.tags).forEach(v => {
      if (v.itemcode == 'sp-fireball') ss += e1(++x + ": " + o2s(v, -1))
    })


  }




}

class itemlistfilter {

  constructor() {
    this.setup()
  }

  setup() {
    this.itemlistsinglefilters = []

    let sf = new itemlistsinglefilter("Levels")

  }

  filterclick() {

    let e = domgetelement("setitemfiltersdiv")
    if (!e) return;
    if (e.style.display == "none") return;

    e.innerHTML = this.currentform()

  }

  currentform() {

    let s = ""

    s += e2(bold("Current filter: ") + this.currentfilter())

    s += e2(bold("Test: "))

    // let g = app.page.factory.getitemgrid("itemcode", "tagname")

    let g = new itemgrid()
    g.setfields("Level Number", "Class", "Duration")
    g.addfilter_nameandvalue("Level Number", "0")
    g.addfilter_nameandvalue("Class", "Bard")

    s += g.grid()


    return s

  }

  currentfilter() {

    let s = ""

    s += "Not implemented yet"

    return s

  }


}



class itemfactory {


  getitemgrid(...p) {

    let res = []

    p.forEach(param => {
      res.push(param)
    })

    return res

  }




}
