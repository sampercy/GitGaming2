/*

//


  // setdev1() {
  //   let e = domgetelement("dev1")
  //   if (e) {
  //     e.innerText = app.data.cacheinitial + " -> " + app.data.cachecurrent
  //   }
  // }



  
  // visibleinset(pageset, elementname, parent = false, fn = false, btn="") {

  //   let e = domgetelement(elementname)
  //   let makevisible = true
  //   let result
  //   let runfn = false
    
  //   //Add div element if not already on page
  //   if (!e) {
  //     ensureproperty(this.sets, pageset)
  //     if (!parent) parent = this.main
  //     e = domaddelemid(parent, elementname)
  //     let itms = {"element": e, "visible": 1}
  //     if (fn) itms.fn = fn
  //     if (btn) itms.btn = btn
  //     this.sets[pageset][elementname] = itms
  //     makevisible = false
  //   }
    
  //   Object.entries(this.sets[pageset]).forEach(([key, value]) => {
  //     if (key == elementname) {
  //       result = value.element
  //       if (makevisible) {
  //         this.sets[pageset][key].element.style.display = "block"
  //         this.sets[pageset][key].visible = 1
  //         runfn = this.sets[pageset][key].fn
  //       }
  //       // if (value.hasOwnProperty("btn")) {
  //       //   let btne = domgetelement(value.btn)
  //       //   if (btne) {
  //       //     btne.classList.add("btn-info")
  //       //     btne.classList.remove("btn-secondary")
  //       //   }
  //       // }
  //     } else if (value.visible == 1) {
  //       this.sets[pageset][key].element.style.display = "none"
  //       this.sets[pageset][key].visible = 0
  //       // if (value.hasOwnProperty("btn")) {
  //       //   let btne = domgetelement(value.btn)
  //       //   if (btne) {
  //       //     btne.classList.add("btn-secondary")
  //       //     btne.classList.remove("btn-info")
  //       //   }
  //       // }
  //     }
  //   })

  //   // console.log(this.sets[pageset])

  //   // Object.entries(this.sets[pageset]).forEach(([key, value]) => {
  //   //   if (value.hasOwnProperty("btn")) {
  //   //     let btne = domgetelement(value.btn)
  //   //     if (btne) {
  //   //       btne.classList.remove("btn-info")
  //   //       btne.classList.remove("btn-secondary")
  //   //       btne.classList.add((value.visible) ? "btn-info" : "btn-secondary")
  //   //     }
  //   //   }
  //   // })    

  //   // console.log(this.sets[pageset])

  //   if (runfn) runfn()
  //   return result

  // }

  */

  //