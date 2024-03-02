
class item {

  constructor(parenttags, code) {
    this.parent = parenttags
    this.code = code
    this.type = ""
    this.name = ""
    this.selectedtag = ""
    this.tags = {}
    this.templates = {}
    this.templatesloaded = false
    this.loaditem()
  }

  loaditem(forceTemplateUpdate = false) {

    if (forceTemplateUpdate || !this.templatesloaded) this.loadtemplates()

    if (this.code.length == 0) {
      this.tags = []
      this.type = "No type"
      this.name = "No name"  
    } else {
      this.tags = this.remodeltags(app.data.tags.filter(i => (i.itemcode == this.code)))
      this.type = (this.tags.hasOwnProperty("#itemtype")) ? this.tags["#itemtype"].tagvalue : "No type"
      this.name = this.tags["Name"].tagvalue ?? "No name"
    }
  }

  loadtemplates() {
    this.templates = this.remodeltags(app.data.tags.filter(i => (i.itemcode == "templates")))
    this.templatesloaded = true
  }

  tagselect(tagname = "") {
    if (tagname != "") this.selectedtag = tagname
    app.out.singletagpage(this, this.selectedtag)
  }

  elementselect(key) {
    app.out.singleelementpage(this, key)
  }

  outputelement(key) {
    app.out.templateoutput(this, key)
  }

  remodeltags(inputobj) {

    let tmp = {}
    inputobj.forEach(t => {
      ensureproperty(tmp, t.tagname, {"sequences": {}})
      ensureproperty(tmp[t.tagname].sequences, t.sequence, {"records": []})
      let {tagname, sequence, itemcode, ...rest} = t;
      tmp[t.tagname].sequences[t.sequence].records.push(rest)
    })

    Object.entries(tmp).forEach(([tagname, fulltagobject]) => {
      tmp[tagname].seqkeys = Object.keys(fulltagobject.sequences)
      tmp[tagname].seqcount = tmp[tagname].seqkeys.length

      Object.entries(fulltagobject.sequences).forEach(([seq, rec]) => {
        let seqvalue = ""
        tmp[tagname].seqmaximum = seq
        tmp[tagname].sequences[seq].recordcount = rec.records.length
        tmp[tagname].sequences[seq].maxsortlevel = -1
        tmp[tagname].sequences[seq].maxsortlevelix = -1

        rec.records.forEach((r, idx) => {
        // rec.records.forEach(r => {
          if (r.sortlevel > tmp[tagname].sequences[seq].maxsortlevel) {
            tmp[tagname].sequences[seq].maxsortlevel = r.sortlevel
            tmp[tagname].sequences[seq].maxsortlevelix = idx
            seqvalue = r.tagvalue
          }
          tmp[tagname].sequences[seq].seqvalue = seqvalue

          if (r.hasOwnProperty("changes")) {
            ensureproperty(tmp[tagname], "changecount", 0)
            tmp[tagname].changecount += r.changes.length
          }

        })
      })
    })

    Object.entries(tmp).forEach(([tagname, fulltagobject]) => {
      Object.entries(fulltagobject.sequences).forEach(([seq, seqobject]) => {
        tmp[tagname].sequences[seq].selected = {...seqobject.records[seqobject.maxsortlevelix]}

        if (seqobject.recordcount > 1) {
          tmp[tagname].sequences[seq].overridden = []
          seqobject.records.forEach(r => {
            if (r.sortlevel < seqobject.maxsortlevel) tmp[tagname].sequences[seq].overridden.push({...r})
          })
        }

      })
    })

    Object.entries(tmp).forEach(([tagname, fulltagobject]) => {

      if (fulltagobject.seqcount == 1) {
        let seqmax = tmp[tagname].seqmaximum
        tmp[tagname].tagvalue = fulltagobject.sequences[seqmax].selected.tagvalue
        tmp[tagname].type = "single"
        tmp[tagname].overridecount = fulltagobject.sequences[seqmax].recordcount - 1
      } else {
        tmp[tagname].type = "list"
        tmp[tagname].listvalues = []
        tmp[tagname].seqkeys.forEach(sqk => {
          tmp[tagname].listvalues.push(tmp[tagname].sequences[sqk].seqvalue)
        })
      }

      Object.entries(fulltagobject.sequences).forEach(([seq, seqobject]) => {
        delete tmp[tagname].sequences[seq].records
      })
    })

    return sortObj(tmp)

  }

  gettag(t, displayonly = false) {
    if (this.tags.hasOwnProperty(t)) {
      if (this.tags[t].hasOwnProperty("tagvalue")) return this.tags[t].tagvalue
      if (this.tags[t].hasOwnProperty("listvalues")) {
        if (!displayonly) return this.tags[t].listvalues;
        let s = green("List (" + this.tags[t].listvalues.length + "):")
        let x = 0
        this.tags[t].listvalues.forEach(li => {
          s += " " + li.shortString(x++ % 2 ? "blue" : "red")
        })
        return s
      }
    }
    if (this.templates.hasOwnProperty(t)) {
      if (this.templates[t].hasOwnProperty("tagvalue")) return this.templates[t].tagvalue
    }
    return ""
  }

  tagvalueupdate() {

    let e = domgetelement("newTemplateCode")
    let e2 = app.page.sets["main"].selectelement("itemview")
    let changed = this.parent.tagchange_updatevalue(this.selectedtag, e.value)   // changes value in main list: app.data.tags
    if (changed) {
      this.loadtemplates()                                           // reload the templates
      this.tagselect(this.selectedtag)                           // reload the tag edit page
    }
    
  }

  tagnameupdate() {

    let e = domgetelement("newTemplateName")
    let e2 = app.page.sets["main"].selectelement("itemview")
    let newname = e.value
    let changed = this.parent.tagchange_updatename(this.selectedtag, newname)  // changes value in main list: app.data.tags
    if (changed) {
      this.loadtemplates()                                           // reload the templates
      this.tagselect(newname)                                    // reload the tag edit page
    }

  }

  tagdelete(del = true) {

    let changed = this.parent.tagchange_delete(this.selectedtag, del)  // changes value in main list: app.data.tags
    if (changed) {
      this.loadtemplates()                                           // reload the templates
      this.tagselect()                                    // reload the tag edit page
    }
    
  }

  //   ****************  Helper

  tagtype(tagname) {
    if (tagname != "" && /[A-Za-z]/.test(tagname.substring(0,1))) return "Tag";
    return "Template"
  }

  //   ****************  De-tagging

  detag(s, depth = -1) {

    if (depth == -1) {
      depth = 1
      this.steps = {}
    }
    
    let stt = s.indexOf("<<")
    let end = s.indexOf(">>")
    if (depth == 999 || stt == -1 || end == -1 || stt > end) return s;
    
    let nxt = s.substring(stt+2, end).indexOf("<<")
    while (nxt >= 0) {
      stt += nxt+2
      nxt = s.substring(stt+2, end).indexOf("<<")
    }
    
    // let ret = this.detag(s.substring(0, stt) + this.eval(s.substring(stt+2, end)) + s.substring(end+2), depth+1)
    // this.steps[depth] = s
    // return ret

    let ptn2 = s.substring(stt+2, end)

    let ret1 = s.substring(0, stt) 
    let ret2 = this.eval(ptn2)
    let ret3 = s.substring(end+2)
    let ret = this.detag(ret1 + ret2 + ret3, depth+1)
    // if (ret2 == "y") console.log([ret1, ret2, ret3, s, stt, end, ptn2])
    this.steps[depth] = s
    return ret


  }

  eval(s) {

    let v = this.gettag(s)
    if (Array.isArray(v)) return v.join("|");
    if (v) return v;

    if (s.indexOf("|") > -1) {
      let a = s.split("|")
      return this.evalspecial(a)
    }

    let spec = ":#"
    if (spec.indexOf(s.substring(0,1)) > -1) {
      let pos = s.indexOf(" ")
      if (pos > 0) {
        return this.evalspecial(array(s.substring(0, pos)), array(s.substring(pos+1)))
      }
    }

    console.log("Uncaught tag:" + s + ":")
    return ""
  }

  evalspecial(a) {
    let cmd = a.shift()
    let ret = ""
    switch (cmd) {
      case '#surround':
        if (a.length == 2) {
          let typ = a[0].trim()
          return "<<:" + typ + "start>>" + a[1] + "<<:" + typ + "end>>"
        }
        break;
      case '#ifvalue':
        if (a.length == 2) {
          let testval = this.detag(a.shift())
          // console.log([testval, testval.length])
          if (testval.length == 0) return "";
          return a[0].replaceAll("%1", testval)
        }
        break;
      case '#listjoin':
        if (a.length > 1) {
          let sep = a.shift()
          if (sep == "pipecharacter") return a.join("|");
          return a.join(sep)
        }
        break;
      case '#listnonblank':
        while (a.length > 0) {
          let nxt = a.shift()
          if (nxt.trim().length > 0) {
            ret += (ret.length == 0 ? "" : "|") + nxt
          }
        }
        return ret;
      case '#listapply':
        if (a.length > 1) {
          let template = a.shift().trim()
          console.log("template:" + template.lateChanges() + ":")
          if (template.length == 0) return "";
          if (!template.includes("%1")) return "";
          let out = []
          while (a.length > 0) {
            out.push(template.lateChanges().replaceAll("%1", a.shift()))
          }
          console.log(out)
          return out.join("|")
        }
        break;
      case '#listmod':
        if (a.length > 2) {
          let cycle = parseInt(a.shift())
          if (!cycle) return "";
          if (cycle < 1) return "";
          let sep = a.shift()
          let s = ""
          let lcount = 0
          for (let x = 0; x < a.length; x++) {
            let lst = a[x];
            if (lst.length > 0) {
              if (lcount > 0) s += sep.replace("%1", (lcount % cycle))
              s += lst
              lcount++
            }
          }
          return s.replaceAll("<-<", "<<").replaceAll(">->", ">>")
        }
        break;


      case '#applyallincontext':
        // <<#applyallincontext|:fullspell|<<#nocontext|Kanji>>>>
        if (a.length > 1) {
          let evalname = a.shift().trim()
          if (evalname.length == 0) return "";
          while (a.length > 0) {
            let context = a.shift().trim()
            if (context.length > 0) {
              let tempitem = new item(this.parent, context)
              ret += tempitem.detag("<<" + evalname + ">>")
            }
          }
          return ret;
        }
        break;
      case '#nocontext':
        // <<#nocontext|Kanji>>
        if (a.length == 1) {
          let tagname = a.shift()
          return app.data.tags.filter(t2 => t2.tagname == tagname).map(t => t.itemcode).join("|")
        }
        break;
    }
    return ""
  }

}

class tags {

  constructor() {
    this.loadtagsummary()
    this.item = {}
    this.setup = false
  }

  // *********  Set up objects

  loadtagsummary() {

    let res = {}
    app.data.tags.filter(i => i.tagname == "#itemtype").forEach(t => {
      res[t.itemcode] = {"type": t.tagvalue}
      let ix = app.data.tags.findIndex(i => (i.itemcode == t.itemcode && i.tagname == "Name"))
      if (ix >= 0) res[t.itemcode]["name"] = app.data.tags[ix].tagvalue
    })
    app.data.tagsummary = res

  }

  showitem(e, code) {
    console.log("showitem " + code)
    this.loaditem(code)
    e.innerHTML = app.out.singleitempage(this.item)
  }

  loaditem(code) {
    if (this.item && this.item.hasOwnProperty("code") && this.item.code == code) return;
    this.item = new item(this, code)
  }

  showtag(tag) {
    this.item.tagselect(tag)
  }

  showelement(key) {
    this.item.elementselect(key)
  }

  outputelement(key) {
    this.loaditem("")
    this.item.outputelement(key)
  }

  // *********  Changes

  templateinsert() {
    // The 'Add a new template' button was hit
    let e = domgetelement("newTemplateTag")
    let tnm = this.tagchange_newtemplate(e.value)
    if (tnm.length > 0) this.item.loadtemplates()
    // console.log("templateinsert reloaded templates, new object next:")
    // console.log(this.item.templates)
    this.item.tagselect(tnm)
  }

  saveall() {

    let sp = domgetelement("spinner_uploadchanges")
    if (sp) sp.style.display = 'inline-block'
    
    var p = {}
    p.command = "updatetags"
    p.updates = this.uploadchanges
    
    console.log(p)
    console.log("Sending")

    postAjax(p, (ret) => {
      if (sp) sp.style.display = 'none'
      app.tags.saveall_return(ret)
    })
  }

  saveall_return(ret) {

    app.page.setheading("Applied Changes")
    console.log(ret)
    app.data.cachecurrent = ret.postcache

    let s = e2(app.page.lastbreadcrumbs + " -- " + app.out.genbutton("info", "", "Changes"))
    let ct = 0
    let i = 0
    
    let ix
    ret.results.forEach(u => {
      s += bold(++i) + ": "
      if (u.hasOwnProperty("insert")) {
        //Find tag with the matching name and make it look like a normal item 
        ix = app.data.tags.findIndex(t => t.tagname == u.input.tagname)
        if (ix == -1) {
          s += e1(red("Something unusual happened updating tag on insert: " + u.input.tagname))
          ct++
        } else {
          app.data.tags[ix].tagkey = u.key
          delete app.data.tags[ix].changes
          s += e1("New tag " + quoted(u.input.tagname) + " added and given key: " + u.key)
        }
      } else {
        ix = app.data.tags.findIndex(t => t.tagkey == u.input.tagkey)
        if (ix == -1) {
          s += e1(red("Something unusual happened updating tag after update: " + u.input.tagkey))
          ct++
        } else {
          delete app.data.tags[ix].changes
          s += e1("Updated tag " + app.data.tags[ix].tagname + " (" + u.input.tagkey+ ").")
        }
      }
    })

    app.page.setchanges(ct)
    this.item.loadtemplates()

    s += br(4) + e2(o2s(ret)) + e2(o2s(this.item.templates)) + e2(o2s(app.data.tags[ix]))
  
    app.page.sets["main"].setinnerhtml("changeview", s)

  }


  // *************      Modify app.data.tags

  tagchange_newtemplate(tnm) {
    
    if (tnm.substring(0, 1) != ":") tnm = ":" + tnm

    let ix = app.data.tags.findIndex(t => (t.tagname == tnm && t.itemsource == "general" && t.itemcode == "templates"))
    if(ix == -1) {
      let nw = {}
      nw.itemsource = "general",
      nw.tagkey = "0"
      nw.itemcode = "templates",
      nw.sequence = "0",
      nw.tagname = tnm
      nw.tagvalue = "new"
      nw.sortlevel = "99"
      nw.changes = [{"change": "add", "name": tnm, "value": "new"}]
      app.data.tags.push(nw)
      app.page.addchange()
      console.log("tagchange_newtemplate added template:" + tnm)
      return tnm
    } else {
      return ""
    }
  }

  tagchange_updatevalue(name, newvalue) {

    let ix = app.data.tags.findIndex(t => t.tagname == name)
    if (ix >= 0) {
      let oldvalue = app.data.tags[ix].tagvalue
      if (oldvalue != newvalue) {
        app.data.tags[ix].tagvalue = newvalue
        ensureproperty(app.data.tags[ix], "changes", [])
        app.data.tags[ix].changes.push({"change": "value", "key": app.data.tags[ix].tagkey, "newvalue": newvalue, "oldvalue": oldvalue})
        app.page.addchange()
        return true
      }
    }
    return false
  }

  tagchange_updatename(name, newname) {

    let ix = app.data.tags.findIndex(t => t.tagname == name)
    if (ix >= 0) {
      let oldname = app.data.tags[ix].tagname
      if (oldname != newname) {
        app.data.tags[ix].tagname = newname
        ensureproperty(app.data.tags[ix], "changes", [])
        app.data.tags[ix].changes.push({"change": "name", "key": app.data.tags[ix].tagkey, "newname": newname, "oldname": oldname})
        app.page.addchange()
        return true
      }
    }
    return false
  }

  tagchange_delete(name, del) {

    let ix = app.data.tags.findIndex(t => t.tagname == name)
    if (ix >= 0) {
      if (del) {
        //normal case, deleting the template
        ensureproperty(app.data.tags[ix], "changes", [])
        app.data.tags[ix].changes.push({"change": "delete", "key": app.data.tags[ix].tagkey, "name": name, "value": app.data.tags[ix].tagvalue})
        app.data.tags[ix].tobedeleted = true
        app.page.addchange()
        return true
      } else {
        //undeleting the template
        let ixdel = app.data.tags[ix].changes.findIndex(ch => ch.change == "delete")
        if (ixdel > -1) {
          app.data.tags[ix].changes.splice(ixdel, 1);
          delete app.data.tags[ix].tobedeleted
          return true
        }
      }
    }
    return false
  }

}

// ************************************************************   Outputter



class outputter {

  allitembuttons(e) {

    let s = ""

    let bc = new breadcrumbs()
    bc.add("primary", this.getchangecode("items"), "All Spells")
    bc.output()
    
    s += e2(this.hiddensection("Filters", "Filters go here", "setitemfilters", "primary"))
    
    Object.entries(app.data.tagsummary).forEach(([k, v]) => {
      let onclick = "app.page.change(" + quoted("spell") + ", " + quoted(k) + ")"
      s += this.genbutton((app.page.visited.includes(k) ? "warning" : "info"), onclick, v.name, "allbtns-" + k, 2)
    })


    //Debug extras
    s += br(2)

    let ss = ""
    let x = 0
    Object.values(app.data.tags).forEach(v => {
      if (v.itemcode == 'sp-fireball') ss += e1(++x + ": " + o2s(v, -1))
    })
    s += this.hiddensection("Fireball Tags", ss, "top5tagvals")

    ss = ""
    x = 0
    Object.values(app.data.tagsummary).forEach(v => {
      if (v.itemcode == 'sp-fireball') ss += e1(++x + ": " + o2s(v, -1))
    })
    s += this.hiddensection("Fireball Tags", ss, "top5tagvals")
    
    e.innerHTML = s

    document.getElementById("setitemfiltersbutton").addEventListener("click", () => app.page.filter.filterclick());

  }

  singleitempage(itm) {

    app.page.setheading(itm.type + " : " + itm.name)

    let s = ""
    // s += e2(app.out.genbutton("primary", app.out.getchangecode("items"), "All Spells") + " > " + itm.name)

    let bc = new breadcrumbs()
    bc.add("primary", this.getchangecode("items"), "All Spells")
    bc.add("info", this.getchangecode("spell", itm.code), itm.name)
    s += e2(bc.output())

    s += "<h6>Item Tags</h6>" + e2(this.tagsoutputneat(itm.tags)) //+ e1(o2s(itm.tags))
    s += "<h6>Template Tags</h6>" + e2(this.tagsoutputneat(itm.templates))

    s += "<div class='row'>"
    s += e2(this.newtemplatenameform())
    s += "</div>"

    //Debug extras
    let ss = e1("itm.tags")
    ss += e2(o2s(itm.tags))
    ss += e1("itm.templates")
    ss += e2(o2s(itm.templates))
    s += this.hiddensection("Debug", ss, "debugsection")

    return s

  }

  singletagpage(itm, tagname) {
    
    app.page.setheading(itm.tagtype(tagname) + ": " + blue(tagname))

    let e = app.page.sets["main"].selectelement("itemview")    
    if (!e) return;

    let s = ""
    // s += this.genbutton("primary", this.getchangecode("items"), "All Spells") + " > "
    // s += e2(this.genbutton("primary", this.getchangecode("spell", itm.code), itm.name) + " > " + tagname)
  
    let bc = new breadcrumbs()
    bc.add("primary", app.out.getchangecode("items"), "All Spells")
    bc.add("primary", app.out.getchangecode("spell", itm.code), itm.name)
    bc.add("info", app.out.getchangecode("tag", tagname), tagname)
    s += e2(bc.output())

    if (itm.tagtype(tagname) == "Tag") 
      s += this.taginfo(itm, tagname)
    else
      s += this.templateinfo(itm, tagname)

    e.innerHTML = s  

  }

  singleelementpage(itm, key) {

    let e = app.page.sets["main"].selectelement("elementview")    
    if (!e) return

    let s = ""
    let appdatatag = app.data.tags.find(i => i.tagkey == key)

    if (appdatatag) {

      let seqcount = itm.tags[itm.selectedtag].seqcount
      let nm = appdatatag.tagname + " (" + ((seqcount > 1) ? (appdatatag.sequence & ", ") : "") + appdatatag.itemsource +  ")"

      app.page.setheading("Element: " + blue(nm))

      let bc = new breadcrumbs()
      bc.add("primary", app.out.getchangecode("items"), "All Spells")
      bc.add("primary", app.out.getchangecode("spell", itm.code), itm.name)
      bc.add("primary", app.out.getchangecode("tag", appdatatag.tagname), appdatatag.tagname)
      bc.add("info", app.out.getchangecode("element", key), key)
      s += e2(bc.output())
      
      // s += app.out.genbutton("primary", app.out.getchangecode("items"), "All Spells") + " > "
      // s += app.out.genbutton("primary", app.out.getchangecode("spell", itm.code), itm.name) + " > "
      // s += e2(app.out.genbutton("primary", app.out.getchangecode("tag", appdatatag.tagname), appdatatag.tagname) + " > " + key)

      s += e2(o2s(appdatatag))

    } else {
      s = "Key not found"
    }

    if (itm.selectedtag) {
      s += e1(itm.selectedtag)
      s += e2(o2s(itm.tags[itm.selectedtag]))
    }

    e.innerHTML = s

  }

  tagsoutputneat(obj) {

    let simple = ""
    let other = ""

    Object.entries(obj).forEach(([tagname, tagobject]) => {
      // maindata = app.data.tags[tagname]
      
      let tbg = new tagbuttongroup(this.getchangecode("tag", tagname, true))

      if (tagobject.type == "single") {

        tbg.add("primary", tagname)
        if (tagobject.hasOwnProperty("changecount")) tbg.add("warning", tagobject.changecount)
        tbg.add((tagobject.overridecount) ? "warning" : "info", tagobject.tagvalue.shortString())
        simple += tbg.output()

      } else {

        tbg.add("secondary", "List")
        if (tagobject.hasOwnProperty("changecount")) tbg.add("warning", tagobject.changecount)
        tbg.add("primary", tagname)
        let ct = 0
        tagobject.seqkeys.forEach(seq => {
          if (++ct < 5 || (ct == 5 && tagobject.seqkeys.length == 5)) {
            let clr = (tagobject.sequences[seq].recordcount > 1) ? "warning" : "info"
            tbg.add(clr, tagobject.sequences[seq].seqvalue.shortString())
          } else if (ct == 5 && tagobject.seqkeys.length > 5) {
            tbg.add("secondary", "+" + (tagobject.seqkeys.length - ct + 1) + " more")
          }
        })
        other += tbg.output()

      }
    })    
    return simple + other

  }

  showsingletagsequence(tagname, seqobject, seq = "") {

    let s = ""
    let tbg

    // if (seq !== "") {
    //   tbg = new tagbuttongroup("")
    //   tbg.add("secondary", "List")
    //   tbg.add("primary", seq)
    //   s += e1(tbg.output())
    // }

    let nm = (seq === "") ? tagname : tagname + " (" + seq + ")"
    // let fn = "onclick='app.page.change(" + seqobject.selected.tagkey + ")'"
    // let fn = this.getchangecode("element", seqobject.selected.tagkey + " " + tagname, true)
    let fn = this.getchangecode("element", seqobject.selected.tagkey, true)
    // let fn = this.getchangecode("element", JSON.stringify([seqobject.selected.tagkey, tagname]), true)
    console.log(fn)

    tbg = new tagbuttongroup(fn)
    tbg.add("secondary", nm)
    tbg.add("primary", seqobject.selected.itemsource + " (" + seqobject.selected.sortlevel + ")")
    tbg.add("success", seqobject.selected.tagvalue.shortString())
    s += tbg.output()

    if (seqobject.hasOwnProperty("overridden")) {
      let lvls = {}
      seqobject.overridden.forEach(ovrobject => {
        fn = "onclick='alert(" + ovrobject.tagkey + ")'"
        tbg = new tagbuttongroup(fn)
        tbg.add("secondary", nm)
        tbg.add("warning", ovrobject.itemsource + " (" + ovrobject.sortlevel + ")")
        tbg.add("warning", ovrobject.tagvalue.shortString())
        lvls[ovrobject.sortlevel] = tbg.output()
      })
      Object.keys(lvls).sort(function(a, b){return b - a}).forEach(k => { s += lvls[k] })
    }

    return s

  }

  taginfo(itm, tagname) {

    let s = ""
    // s += e1("<h4>Item Tag: " + tagname + "</h4>")
    
    let tag = itm.tags[tagname]
    let islist = (tag.seqcount > 1)

    if (islist) {      
      s += e2("Tag is a list with " + tag.seqcount + " values")
      Object.entries(tag.sequences).forEach(([seq, seqobject]) => { s += e2(this.showsingletagsequence(tagname, seqobject, seq)) })
    } else {
      s += e2(this.showsingletagsequence(tagname, tag.sequences[tag.seqmaximum]))
    }
    
    s += br(2) + e2(o2s(tag))
    return s

  }

  templateinfo(itm, tagname) {

    let tagfind = app.data.tags.filter(i => (i.itemcode == "templates" && i.tagname == tagname))
    
    let s = ""
    s += "<h4>Template " + blue(tagname) + "</h4>" 
    
    let tk = itm.templates[tagname].sequences[0].selected.tagkey
    s += ((tk) ? e1("TagKey = " + blue(tk)) : s += e1("New template"))

    // console.log("Looking up tagname " + tagname)
    let foundtagvalue = itm.gettag(tagname)
    s += e1("Value = " + blue(foundtagvalue.tagSafe()))
    // console.log(foundtagvalue)

    let tv = itm.detag("<<" + tagname + ">>").trim()
    let show = tv
    let txtequiv = ""
    if (tv.length == 0) {
      show = "Empty string"
    } else {
      let etmp = domaddelem(0)
      etmp.innerHTML = tv
      if (etmp.innerText.length == 0) show = "No visible component"
      txtequiv = etmp.innerText
    }
    let sametext = (txtequiv == show)

    if (show != "Empty string") s += e1("Show in new tab: <a href='index.php?template=" + tagname + "' target='_blank'>" + tagname + "</a>")
    s += br(1)

    s += "<hr class='border border-danger border-2 opacity-50'>"
    s += e1(colour("HTML", "red"))
    s += show
    s += "<hr class='border border-danger border-2 opacity-50'>"
    if (!sametext) {
      s += e1(colour("Actual text", "red"))
      s += tv.tagSafe()
      s += "<hr class='border border-danger border-2 opacity-50'>"
    }

    // Show modification forms
    s += "<div class='row'>"
    s += this.tagvalueupdateform(itm.gettag(tagname))
    s += this.tagnameupdateform(tagname)
    s += this.tagdeleteform(tagfind.length == 1 && tagfind[0].hasOwnProperty("tobedeleted"))
    s += "</div>"

    // Show changes list
    if (tagfind.length == 1 && tagfind[0].hasOwnProperty("changes")) {
      s += e1(bold("Changes not yet sent to the server:"))
      s += e1(this.changelist(tagfind[0].changes))
    }

    //Debug extras
    s += br(2)

    let ss = e1("itm.steps")
    Object.entries(itm.steps).forEach(([step, stepval]) => {
      ss += e1(red(step) + ": " + stepval.tagSafe())
    })
    s += this.hiddensection("Steps", ss, "stepsection")
    
    ss = ""
    if (tagfind.length > 0) ss += o2s(tagfind) 
    ss += br(1) + "itm.templates[tagname]: " + o2s(itm.templates[tagname])
    s += this.hiddensection("Debug", ss, "debugsection")
    
    return s

  }

  templateoutput(itm, key) {

    let e = app.page.main
    if (!e) return

    let s = ""
   
    s += "<h5>Template " + blue(key) + "</h5>"     

    let tv = itm.detag("<<" + key + ">>").trim()
    let show = tv
    let txtequiv = ""
    if (tv.length == 0) {
      show = "Empty string"
    } else {
      let etmp = domaddelem(0)
      etmp.innerHTML = tv
      if (etmp.innerText.length == 0) show = "No visible component"
      txtequiv = etmp.innerText
    }

    s += "<hr class='border border-danger border-2 opacity-50'>"
    s += show
    s += "<hr class='border border-danger border-2 opacity-50'>"

    e.innerHTML = s

  }

  // changes

  changes() {

    app.page.setheading("Pending Changes")
    let e = app.page.sets["main"].selectelement("changeview")
    let s = e2(app.page.lastbreadcrumbs + " -- " + this.genbutton("info", "", "Changes"))

    app.tags.uploadchanges = app.data.tags.filter(t2 => t2.hasOwnProperty("changes"))
    app.tags.uploadchanges.forEach(t => {

      if (t.tagkey == 0) {
        s += e1(bold(t.tagname) + " (new tag)")
      } else {
        s += e1(bold(t.tagname) + " (key=" + t.tagkey + ")")
      }

      s += this.changelist(t.changes)

    })

    app.page.setchanges(app.tags.uploadchanges.length) 

    if (app.tags.uploadchanges.length > 0) {
      s += "<button type='submit' class='btn btn-primary btn-sm' onclick='app.tags.saveall()'>"
      // s += "<span id='spinner_uploadchanges' class='spinner-border spinner-border-sm me-2' role='status' aria-hidden='true'></span>"
      s += "<span id='spinner_uploadchanges' class='spinner-border spinner-border-sm me-2' role='status' aria-hidden='true' style='display:none'></span>"
      s += "Save</button>"
    } else {
      s += "No changes made since last page load or save."
    }

    e.innerHTML = s + br(4) + o2s(app.tags.uploadchanges)

  }

  changelist(chlist) {
    let s = ""

    let del = false
    let snml = ""

    chlist.forEach(c => {
      switch (c.change) {
        case "add":
          snml += e1("New item: Name: " + red(c.name.tagSafe()) + " Value: " + red(c.value.tagSafe()))
          break;
        case "value":
          snml += e1("Changed value: From: " + red(c.oldvalue.tagSafe()) + " To: " + red(c.newvalue.tagSafe()))
          break;
        case "name":
          snml += e1("Changed name: From: " + red(c.oldname.tagSafe()) + " To: " + red(c.newname.tagSafe()))
          break;
        case "delete":
          del = true
          break;
      }
    })

    if (del) s += e1(red("Tag deleted") + ((snml == "") ? "" : ", and irrelevantly:"))
    s += e1(snml)
    return s
  }

  // forms

  newtemplatenameform() {
    let s = ""
    s += "<div class='col-sm-4 m-2 p-1 bg-info rounded border border-primary'>"
    s += "<label for='newTemplateTag' class='form-label'>New template name</label>"
    s += "<input type='text' class='form-control' id='newTemplateTag'>"
    s += "<div class='form-text'>Must not be the same as an existing template.</div>"
    s += "<button type='submit' class='btn btn-primary btn-sm float-end' onclick='app.tags.templateinsert()'>Submit</button>"
    s += "</div>"
    return s
  }

  tagvalueupdateform(txt) {
    let s = ""
    s += "<div class='col-sm-4 m-2 p-1 bg-info rounded border border-primary'>"
    s += "<label for='newTemplateCode' class='form-label'>Change the value of this template</label>"
    s += "<textarea class='form-control' id='newTemplateCode' rows='3'>" + txt + "</textarea>"
    s += "<div class='form-text'>Only changes values locally.</div>"
    s += "<button type='submit' class='btn btn-primary btn-sm float-end' onclick='app.tags.item.tagvalueupdate()'>Submit</button>"    
    s += "</div>"
    return s
  }

  tagnameupdateform(txt) {
    let s = ""
    s += "<div class='col-sm-2 m-2 p-1 bg-info rounded border border-primary'>"
    s += "<label for='newTemplateName' class='form-label'>Change tag name for this template</label>"
    s += "<input type='text' class='form-control' id='newTemplateName' value='" + txt + "'>"
    s += "<div class='form-text'>Only changes values locally.</div>"
    s += "<button type='submit' class='btn btn-primary btn-sm float-end' onclick='app.tags.item.tagnameupdate()'>Submit</button>"
    s += "</div>"    
    return s
  }

  tagdeleteform(alreadydeleting) {

    let s = ""
    s += "<div class='col-sm-2 m-2 p-1 bg-info rounded border border-primary'>"
    if (!alreadydeleting) {
      s += "<label for='deleteTemplate' class='form-label'>Delete this template</label>"
      s += "<div class='form-text'>Will not be actively deleted until changes are saved.</div>"
      s += "<button type='submit' class='btn btn-primary btn-sm float-end' onclick='app.tags.item.tagdelete(true)'>Submit</button>"
    } else {
      s += "<label for='deleteTemplate' class='form-label'>Undelete this template</label>"
      s += "<div class='form-text'>Removes instruction to delete this tag.</div>"
      s += "<button type='submit' class='btn btn-primary btn-sm float-end' onclick='app.tags.item.tagdelete(false)'>Submit</button>"
    }
    s += "</div>"    
    return s
  }

  // helpers

  getchangecode(a, b = "", includeonclick = false) {
    if (includeonclick) return "onclick='" + this.getchangecode(a, b) + "'"
    if (b) return "app.page.change(" + quoted(a) + "," + quoted(b) + ")";
    return "app.page.change(" + quoted(a) + ")";
  }

  genbutton(colorclass, onclick, caption, id="", xpadding=8) {
    if (id == "") return "<button type='button' class='btn btn-" + colorclass + "  btn-sm' style='--bs-btn-line-height: 1; --bs-btn-padding-y: 2px; --bs-btn-padding-x: " + xpadding + "px; --bs-btn-font-weight: 700; --bs-btn-font-size: .75rem; margin-right: 2px; margin-bottom: 3px; margin-top:5px' onclick='" + onclick + "'>" + caption + "</button>"
    return "<button type='button' id='" + id + "' class='btn btn-" + colorclass + "  btn-sm' style='--bs-btn-line-height: 1; --bs-btn-padding-y: 2px; --bs-btn-padding-x: " + xpadding + "px; --bs-btn-font-weight: 700; --bs-btn-font-size: .75rem; margin-right: 2px; margin-bottom: 3px; margin-top:5px' onclick='" + onclick + "'>" + caption + "</button>"
  }

  hiddensection(caption, txt, code, colour = "danger") {
    let s = ""
    let f = "app.out.toggleblock(\"" + code + "div\")"
    s += this.genbutton(colour, f, caption, code + "button")
    s += "<div style='display:none' id='" + code + "div'>" + txt + "</div>"
    return s
  }

  toggleblock(x) {
    let e = domgetelement(x)
    if (!e) return;
    if (e.style.display == "block" || e.style.display == "") e.style.display = "none"; else e.style.display = "block"; 
  }
  

}



let app = {}
app.data = {}
app.data.tags = gettagsinital()
app.data.template = selectedtemplate
app.data.cacheinitial = gettagsinitalcachevalue()
app.data.cachecurrent = app.data.cacheinitial
app.out = new outputter()
app.tags = new tags()
app.page = new page()
app.page.firstpage()

app.page.ajaxlocs = {}
app.page.ajaxlocs.web = "http://gaming.sampercy.com/php/ajax.php"
app.page.ajaxlocs.local = "ajax.php"
app.page.env = "web"
