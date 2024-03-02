/*

//





  // loadtemplates() {



  //   // let tmp = {}
  //   // app.data.tags.filter(i => (i.itemcode == "templates")).forEach(t => {
  //   //   ensureproperty(tmp, t.tagname)
  //   //   ensureproperty(tmp[t.tagname], t.sequence, {"maxlevel": 0, "allsortlevels": [], "allsortsources": {}})
  //   //   ensureproperty(tmp[t.tagname][t.sequence], t.sortlevel, t.tagvalue)
  //   //   tmp[t.tagname][t.sequence].allsortlevels.push(t.sortlevel)
  //   //   tmp[t.tagname][t.sequence].allsortsources[t.sortlevel] = t.itemsource
  //   //   if (t.sortlevel > tmp[t.tagname][t.sequence].maxlevel) tmp[t.tagname][t.sequence].maxlevel = t.sortlevel
  //   // })

  //   // Object.entries(tmp).forEach(([key, value]) => {
  //   //   let ks = Object.keys(value)
  //   //   if (ks.length == 1) {
  //   //     let mx = value[ks[0]]
  //   //     tmp[key].value = mx[mx.maxlevel]
  //   //   }
  //   //   tmp[key].seqcount = ks.length
  //   //   tmp[key].allsequencekeys = ks
  //   // })

  //   // this.templates = sortObj(tmp)

  //   // console.log(this.tags)

  // }
  
  tagsoutpputneatold() {

    let simple = ""
    let other = ""
    let s = ""
    Object.entries(this.tags).forEach(([tagname, tagobject]) => {
      if (tagobject.hasOwnProperty("simple")) {
        simple += red(tagname + "=") + this.shortstring(tagobject.tagvalue) + em()
      } else {
        let {sequences, tagvalue, ...rest} = tagobject
        s = ""
        s += red(tagname + "=")
        s += o2sc(rest, -1) + ", "
        s += blue("tagvalue=") + this.shortstring(tagvalue)
        s += green(" sequences=") + br(1)
        Object.entries(sequences).forEach(([seq, seqobject]) => {
          let {records, seqvalue, ...rest2} = seqobject
          s += em() + green("seq=" + seq + ": ") + o2sc(rest2, -1) + blue(", seqvalue=") + this.shortstring(seqvalue)
          s += ", " + colour("records= ", "orange")
          if (seqobject.recordcount == 1) {
            s += magenta(" tag record 0: ") + e1(this.showrecord(records[0]))
          } else {
            s += br(1)
            records.forEach((r, idx) => {
              s += em("", 1) + magenta("tag record " + idx + ": ") + e1(this.showrecord(r))
            })
          }
        })
        other += s
      }
    })    
    return e2(simple) + e2(other)

  }


  tagsoutput() {

    let s = ""
    Object.entries(this.tags).forEach(([tagname, tagobject]) => {
      let {sequences, tagvalue, ...rest} = tagobject
      s += red(tagname + "=")
      s += o2sc(rest, -1) + ", "
      s += blue("tagvalue=") + this.shortstring(tagvalue)
      s += green(" sequences=") + br(1)
      Object.entries(sequences).forEach(([seq, seqobject]) => {
        let {records, seqvalue, ...rest2} = seqobject
        s += em() + green("seq=" + seq + ": ") + o2sc(rest2, -1) + blue(", seqvalue=") + this.shortstring(seqvalue)
        s += ", " + colour("records= ", "orange")
        if (seqobject.recordcount == 1) {
          s += magenta(" tag record 0: ") + e1(this.showrecord(records[0]))
        } else {
          s += br(1)
          records.forEach((r, idx) => {
            s += em("", 1) + magenta("tag record " + idx + ": ") + e1(this.showrecord(r))
          })
        }
      })
    })
    return e2(s) + o2sc(this.tags)

  }

  viewtags() {
    let s = {"tag": "", "template": ""}
    let t
    Object.entries(this.tags).forEach(([k, v]) => {
      t = this.tag.tagtype(k)
      s[t] += green("<span onclick='app.page.change(" + quoted("tag") + ", " + quoted(k) + ")'><i class='bi bi-search'></i></span>") + em()
      s[t] += blue(k)
      if (v.hasOwnProperty("value")) {
        s[t] += " = " + red(v.value.replaceAll("<", "&lt;"))
      } else {
        s[t] += " = " + green(v.seqcount + " tags")
        Object.entries(v).forEach(([kk, vv]) => {
          if (vv.hasOwnProperty("maxlevel")) s[t] += " - " + colour(kk, "magenta") + " = " + red(vv[vv.maxlevel].replaceAll("<", "&lt;"))
        })
      }
      s[t] += e1()
    })

    return s
  }

  showrecord(r) {
    let s = ""
    s += blue("itemsource=") + r.itemsource + ", "
    s += blue("tagkey=") + r.tagkey + ", "
    s += blue("sortlevel=") + r.sortlevel + ", "
    s += blue("tagvalue=") + this.shortstring(r.tagvalue)
    return s
  }

  loadditemold(r) {
    // let tmp = {}
    // app.data.tags.filter(i => (i.itemcode == this.code)).forEach(t => {
    //   ensureproperty(tmp, t.tagname)
    //   ensureproperty(tmp[t.tagname], t.sequence, {"maxlevel": 0, "allsortlevels": [], "allsortsources": {}})
    //   ensureproperty(tmp[t.tagname][t.sequence], t.sortlevel, t.tagvalue)
    //   tmp[t.tagname][t.sequence].allsortlevels.push(t.sortlevel)
    //   tmp[t.tagname][t.sequence].allsortsources[t.sortlevel] = t.itemsource
    //   if (t.sortlevel > tmp[t.tagname][t.sequence].maxlevel) tmp[t.tagname][t.sequence].maxlevel = t.sortlevel
    // })

    // Object.entries(tmp).forEach(([key, value]) => {
    //   let ks = Object.keys(value)
    //   if (ks.length == 1) {
    //     let mx = value[ks[0]]
    //     tmp[key].value = mx[mx.maxlevel]
    //   }
    //   tmp[key].seqcount = ks.length
    //   tmp[key].allsequencekeys = ks
    // })

    // this.tags = sortObj(tmp)
  }

  applyitempageold(prnt, code) {

    if (!this.setup) {
      domaddelemid(prnt, "itempagebuttons")
      app.page.visibleinset("itempages", "itempagetagview", prnt, false, "itembuttontagview")
      // app.page.visibleinset("itempages", "itempagetemplatelist", prnt, false, "itembuttontemplatetags")
      app.page.visibleinset("itempages", "itempagesaveall", prnt, app.tags.saveallreset, "itembuttonsaveall")
      app.page.visibleinset("itempages", "itempagetaglist", prnt, false, "itembuttonitemtags")  // Do last so visible first
      this.setup = true
    } else {
      app.page.visibleinset("itempages", "itempagetaglist")
    }

    this.loadtag(code)
    app.page.setheading(this.item.type + " : " + this.item.name)

    let s = ""
    let onclick = "app.page.change(" + quoted("items") + ")"
    s += this.genbutton("primary", onclick, "Back to Items")

    onclick = "app.page.visibleinset(" + quoted("itempages") + ", " + quoted("itempagetaglist") + ")"
    s += em(this.genbutton("info", onclick, "Item Tags", "itembuttonitemtags"))

    // onclick = "app.page.visibleinset(" + quoted("itempages") + ", " + quoted("itempagetemplatelist") + ")"
    // s += em(this.genbutton("info", onclick, "Template Tags", "itembuttontemplatetags"))

    onclick = "app.page.visibleinset(" + quoted("itempages") + ", " + quoted("itempagetagview") + ")"
    s += em(this.genbutton("info", onclick, "Tag View", ""))

    onclick = "app.page.visibleinset(" + quoted("itempages") + ", " + quoted("itempagesaveall") + ")"
    s += em(this.genbutton("info", onclick, "Save All", "itembuttonsaveall"))

    s += br(2)

    let e = domgetelement("itempagebuttons")
    e.innerHTML = s

    // this.tagspagerefresh()

    e = domgetelement("itempagetagview")
    e.innerHTML = this.item.tag.output()

  }

// class tag {

//   constructor(parentitem) {
//     this.parent = parentitem
//     this.tagname = ""
//   }

//   loadtag(tagname = "") {
//     this.tagname = tagname
//    // console.log("Tag set to:" + tagname + ": with type: " + this.tagtype())
//   }

//   // *********    Outputs

//   // output() {
//   //   if (this.tagtype() == "tag") return this.taginfo()
//   //   return app.out.templateinfo(this.parent, this.tagname)
//   // }

// //   taginfo() {

// //     // return o2sc(this.parent.tags[this.tagname])

// //     let s = ""
// //     let optn
// //     s += e1("<h4>Item Tag: " + this.tagname + "</h4>")

// //     let tag = this.parent.tags[this.tagname]
// //     if (tag.seqcount > 1) s += e1("Tag has " + tag.seqcount + " values")

// //     let fn = () => alert(8)

// //     // Object.entries(tag.sequences).forEach(([seq, seqobject]) => {

// //     //   s += "<div class='btn-group' role='group' style='padding:3px'>"
// //     //   if (tag.seqcount > 1)  s += "  <button type='button' " + fn + " class='btn btn-sm btn-secondary'>" + seq + "</button>"
// //     //   s += " <button type='button' " + fn + " class='btn btn-sm btn-secondary'>" + this.tagname + "</button>"
// //     //   if (tag.hasOwnProperty("changecount")) s += "  <button type='button' " + fn + " class='btn btn-sm btn-warning'>" + tagobject.changecount + "</button>"
// //     //   s += " <button type='button' " + fn + " class='btn btn-sm btn-primary'>" + tagname + "</button>"
// //     //   tagobject.seqkeys.forEach(seq => {
// //     //     clr = (tagobject.sequences[seq].recordcount > 1) ? "warning" : "info"
// //     //     s += "  <button type='button' " + fn + " class='btn btn-sm btn-" + clr + "'>" + app.out.shortstring(tagobject.sequences[seq].seqvalue) + "</button>"  
// //     //   })
// //     //   s += "</div>"

// //     // })


// // /*    sequences={0={recordcount=1, maxsortlevel=10, maxsortlevelix=0, seqvalue=1 Action, selected={itemsource=5e, tagkey=76510, tagvalue=1 Action, sortlevel=10}}}
// // seqkeys=[0]
// // seqcount=1
// // seqmaximum=0
// // tagvalue=1 Action
// // type=single
// // overridecount=0

// // sequences={6={recordcount=1, maxsortlevel=10, maxsortlevelix=0, seqvalue=Sorcerer, selected={itemsource=5e, tagkey=76513, tagvalue=Sorcerer, sortlevel=10}}, 8={recordcount=1, maxsortlevel=10, maxsortlevelix=0, seqvalue=Wizard, selected={itemsource=5e, tagkey=76512, tagvalue=Wizard, sortlevel=10}}}
// // seqkeys=[6, 8]
// // seqcount=2
// // seqmaximum=8
// // type=list

// // */

// //     // if (tag.seqcount == 1)  {
// //     //   let seq = tag.seqkeys[0]
// //     //   optn = tag[seq]
// //     //   if (optn.allsortlevels.length == 1) {
// //     //     s += e1("Single-level, single-source tag: " + optn.allsortsources[optn.allsortlevels[0]])
// //     //   } else {
// //     //     s += e1("Single-level tag, with multiple sources:")
// //     //     optn.allsortlevels.sort(function(a, b){return a - b}).forEach(stlvl => {
// //     //       s += e1(stlvl + ": (" + optn.allsortsources[stlvl] + ") = " + optn[stlvl])
// //     //     })
// //     //   }
// //     //   s += e1("Value = " + tag.value)
// //     // } else {
// //     //   s += e1("Multiple levels exist for this tag:")
// //     //   tag.seqkeys.forEach(seq => {
// //     //     optn = tag[seq]
// //     //     if (optn.allsortlevels.length == 1) {
// //     //       let lvl = optn.allsortlevels[0]
// //     //       s += e1("Multi-level, single-source tag: " + seq + ": (" + optn.allsortsources[lvl] + ") = " + optn[lvl])
// //     //     } else {
// //     //       s += e1("Multi-level tag, with multiple sources: (incomplete)")
// //     //       // optn.allsortlevels.sort(function(a, b){return a - b}).forEach(stlvl => {
// //     //       //   s += e1(stlvl + ": (" + optn.allsortsources[stlvl] + ") = " + optn[stlvl])
// //     //       // })
// //     //       // s += e1("Value = " + tag.value)
// //     //     }
// //     //   })
// //     // }

// //     // s += o2s(this.parent.tags[this.tagname])
// //     return s
// //   }


//   // tagtype(tagname = "") {
//   //   let s = tagname || this.tagname
//   //   // console.log(quoted(s))
//   //   if (s != "" && /[A-Za-z]/.test(s.substring(0,1))) return "tag";
//   //   return "template"
//   // }

// }
