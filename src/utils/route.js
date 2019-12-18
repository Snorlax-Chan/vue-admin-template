import { deepClone } from '@/utils'

export function assRoute(routeList) {
  // const List = deepClone(routeList)
  // const Route = []
  // // eslint-disable-next-line no-unused-vars
  // for (const j of List) {
  //   if (j.f_pr_parentId === 0) {
  //     Route.push(j)
  //   }
  // }
  // // eslint-disable-next-line no-unused-vars
  // for (const i of routeList) {
  //   if (i.f_pr_parentId !== 0) {
  //     for (let n = 0; n < Route; n++) {
  //       if (i.f_pr_parentId === Route[n].f_pr_id) {
  //         if (Route.children) {
  //           Route.children.push(i)
  //         } else {
  //           Route.children = []
  //           Route.children.push(i)
  //         }
  //       }
  //     }
  //   }
  // }
  function tree(id) {
    const arr = []
    routeList.filter(item => {
      return item.f_pr_parentId === id
    }).forEach(item => {
      const ob = {
        path: item.f_pr_path,
        component: item.f_pr_component,
        redirect: item.f_pr_redirect,
        name: item.f_pr_name,
        meta: {
          title: item.f_pr_meta_title,
          icon: item.f_pr_meta_icon
        }
      }
      let children = []
      const mode = routeList.filter(jtem => {
        return jtem.f_pr_parentId === item.f_pr_id
      })
      // if (id === 0 && mode.length === 1) {
      //   ob.meta = {
      //     title: '',
      //     icon: ''
      //   }
      // } else {
      //   ob.meta = {
      //     title: item.f_pr_meta_title,
      //     icon: item.f_pr_meta_icon
      //   }
      // }
      mode.forEach(jtem => {
        children = tree(jtem.f_pr_parentId)
      })
      // if (!item.children) {
      ob.children = deepClone(children)
      if (ob.children.length === 0) {
        delete ob.children
      }
      arr.push(ob)
      // } else {
      //   children.forEach(otem => {
      //     item.children.push(otem)
      //   })
      // }
    })
    return arr
  }
  return tree(0)
}

export function assAttribute(resList, attList) {
  const arr = []
  resList.forEach(item => {
    const obj = {
      name: item.f_pr_name,
      title: item.f_pr_meta_title
    }
    const hasBPMS = []
    const realBPMS = []
    attList.filter(jtem => {
      return item.f_pr_id === jtem.f_pa_resourceId
    }).forEach(jtem => {
      realBPMS.push({
        name: jtem.f_pa_name,
        title: jtem.f_pa_title,
        attach: jtem.f_pa_attach
      })
      hasBPMS.push(jtem.f_pa_name)
    })
    obj.hasBPMS = hasBPMS
    obj.realBPMS = realBPMS
    arr.push(obj)
  })
  return arr
}
