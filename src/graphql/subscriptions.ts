/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateFeedback = /* GraphQL */ `
  subscription OnCreateFeedback {
    onCreateFeedback {
      id
      type
      email
      name {
        fn
        ln
      }
      feedback
      uname
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateFeedback = /* GraphQL */ `
  subscription OnUpdateFeedback {
    onUpdateFeedback {
      id
      type
      email
      name {
        fn
        ln
      }
      feedback
      uname
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteFeedback = /* GraphQL */ `
  subscription OnDeleteFeedback {
    onDeleteFeedback {
      id
      type
      email
      name {
        fn
        ln
      }
      feedback
      uname
      createdAt
      updatedAt
    }
  }
`;
export const onCreateRating = /* GraphQL */ `
  subscription OnCreateRating {
    onCreateRating {
      id
      type
      rating
      feedbackId
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateRating = /* GraphQL */ `
  subscription OnUpdateRating {
    onUpdateRating {
      id
      type
      rating
      feedbackId
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteRating = /* GraphQL */ `
  subscription OnDeleteRating {
    onDeleteRating {
      id
      type
      rating
      feedbackId
      createdAt
      updatedAt
    }
  }
`;
export const onCreateGoal = /* GraphQL */ `
  subscription OnCreateGoal($owner: String!) {
    onCreateGoal(owner: $owner) {
      id
      sy
      sm
      ey
      by
      btr
      tdr
      tdl
      tbi
      tdli
      tbr
      name
      type
      ccy
      cp
      chg
      achg
      tgts {
        num
        val
      }
      loan {
        type
        per
        rate
        dur
        ry
        pp {
          num
          val
        }
        ira {
          num
          val
        }
        emi
        pmi
        peper
      }
      imp
      met
      prob
      manual
      amper
      amsy
      aiper
      aisy
      dr
      sa
      pg {
        num
        val
      }
      pl {
        num
        val
      }
      ra
      rachg
      img
      pp {
        cash
        ltdep
        mtb
        imtb
        hyb
        ihyb
        teb
        reit
        ireit
        reitETF
        ireitETF
        re
        gold
        goldb
        lcs
        lcetf
        ilcs
        ilcetf
        mscs
        imscs
        dgs
        uc
        crypto
        p2p
      }
      rp
      bt
      rc
      rcchg
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateGoal = /* GraphQL */ `
  subscription OnUpdateGoal($owner: String!) {
    onUpdateGoal(owner: $owner) {
      id
      sy
      sm
      ey
      by
      btr
      tdr
      tdl
      tbi
      tdli
      tbr
      name
      type
      ccy
      cp
      chg
      achg
      tgts {
        num
        val
      }
      loan {
        type
        per
        rate
        dur
        ry
        pp {
          num
          val
        }
        ira {
          num
          val
        }
        emi
        pmi
        peper
      }
      imp
      met
      prob
      manual
      amper
      amsy
      aiper
      aisy
      dr
      sa
      pg {
        num
        val
      }
      pl {
        num
        val
      }
      ra
      rachg
      img
      pp {
        cash
        ltdep
        mtb
        imtb
        hyb
        ihyb
        teb
        reit
        ireit
        reitETF
        ireitETF
        re
        gold
        goldb
        lcs
        lcetf
        ilcs
        ilcetf
        mscs
        imscs
        dgs
        uc
        crypto
        p2p
      }
      rp
      bt
      rc
      rcchg
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteGoal = /* GraphQL */ `
  subscription OnDeleteGoal($owner: String!) {
    onDeleteGoal(owner: $owner) {
      id
      sy
      sm
      ey
      by
      btr
      tdr
      tdl
      tbi
      tdli
      tbr
      name
      type
      ccy
      cp
      chg
      achg
      tgts {
        num
        val
      }
      loan {
        type
        per
        rate
        dur
        ry
        pp {
          num
          val
        }
        ira {
          num
          val
        }
        emi
        pmi
        peper
      }
      imp
      met
      prob
      manual
      amper
      amsy
      aiper
      aisy
      dr
      sa
      pg {
        num
        val
      }
      pl {
        num
        val
      }
      ra
      rachg
      img
      pp {
        cash
        ltdep
        mtb
        imtb
        hyb
        ihyb
        teb
        reit
        ireit
        reitETF
        ireitETF
        re
        gold
        goldb
        lcs
        lcetf
        ilcs
        ilcetf
        mscs
        imscs
        dgs
        uc
        crypto
        p2p
      }
      rp
      bt
      rc
      rcchg
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onCreateFamily = /* GraphQL */ `
  subscription OnCreateFamily($owner: String!) {
    onCreateFamily(owner: $owner) {
      id
      tid
      name
      tax
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateFamily = /* GraphQL */ `
  subscription OnUpdateFamily($owner: String!) {
    onUpdateFamily(owner: $owner) {
      id
      tid
      name
      tax
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteFamily = /* GraphQL */ `
  subscription OnDeleteFamily($owner: String!) {
    onDeleteFamily(owner: $owner) {
      id
      tid
      name
      tax
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onCreateUserInfo = /* GraphQL */ `
  subscription OnCreateUserInfo {
    onCreateUserInfo {
      uname
      email
      dob
      im
      mob
      notify
      tax
      rp
      dr
      tc
      ta
      tid
      exp
      invest
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateUserInfo = /* GraphQL */ `
  subscription OnUpdateUserInfo {
    onUpdateUserInfo {
      uname
      email
      dob
      im
      mob
      notify
      tax
      rp
      dr
      tc
      ta
      tid
      exp
      invest
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteUserInfo = /* GraphQL */ `
  subscription OnDeleteUserInfo {
    onDeleteUserInfo {
      uname
      email
      dob
      im
      mob
      notify
      tax
      rp
      dr
      tc
      ta
      tid
      exp
      invest
      createdAt
      updatedAt
    }
  }
`;
export const onCreateInsAnalytics = /* GraphQL */ `
  subscription OnCreateInsAnalytics {
    onCreateInsAnalytics {
      id
      analytics
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateInsAnalytics = /* GraphQL */ `
  subscription OnUpdateInsAnalytics {
    onUpdateInsAnalytics {
      id
      analytics
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteInsAnalytics = /* GraphQL */ `
  subscription OnDeleteInsAnalytics {
    onDeleteInsAnalytics {
      id
      analytics
      createdAt
      updatedAt
    }
  }
`;
export const onCreateFeeds = /* GraphQL */ `
  subscription OnCreateFeeds {
    onCreateFeeds {
      id
      tname
      exchg
      url
      count
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateFeeds = /* GraphQL */ `
  subscription OnUpdateFeeds {
    onUpdateFeeds {
      id
      tname
      exchg
      url
      count
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteFeeds = /* GraphQL */ `
  subscription OnDeleteFeeds {
    onDeleteFeeds {
      id
      tname
      exchg
      url
      count
      createdAt
      updatedAt
    }
  }
`;
export const onCreateINExchgFun = /* GraphQL */ `
  subscription OnCreateINExchgFun {
    onCreateINExchgFun {
      id
      isin
      exchg
      sector
      ind
      tech
      val
      risk
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateINExchgFun = /* GraphQL */ `
  subscription OnUpdateINExchgFun {
    onUpdateINExchgFun {
      id
      isin
      exchg
      sector
      ind
      tech
      val
      risk
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteINExchgFun = /* GraphQL */ `
  subscription OnDeleteINExchgFun {
    onDeleteINExchgFun {
      id
      isin
      exchg
      sector
      ind
      tech
      val
      risk
      createdAt
      updatedAt
    }
  }
`;
export const onCreateINExchgPrice = /* GraphQL */ `
  subscription OnCreateINExchgPrice {
    onCreateINExchgPrice {
      id
      sid
      name
      exchg
      type
      subt
      itype
      price
      prev
      fv
      under
      yhigh
      yhighd
      ylow
      ylowd
      split
      div
      splitd
      divdd
      divrd
      divpd
      beta
      mcap
      mcapt
      sector
      ind
      risk
      vol
      prevol
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateINExchgPrice = /* GraphQL */ `
  subscription OnUpdateINExchgPrice {
    onUpdateINExchgPrice {
      id
      sid
      name
      exchg
      type
      subt
      itype
      price
      prev
      fv
      under
      yhigh
      yhighd
      ylow
      ylowd
      split
      div
      splitd
      divdd
      divrd
      divpd
      beta
      mcap
      mcapt
      sector
      ind
      risk
      vol
      prevol
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteINExchgPrice = /* GraphQL */ `
  subscription OnDeleteINExchgPrice {
    onDeleteINExchgPrice {
      id
      sid
      name
      exchg
      type
      subt
      itype
      price
      prev
      fv
      under
      yhigh
      yhighd
      ylow
      ylowd
      split
      div
      splitd
      divdd
      divrd
      divpd
      beta
      mcap
      mcapt
      sector
      ind
      risk
      vol
      prevol
      createdAt
      updatedAt
    }
  }
`;
export const onCreateAllIndices = /* GraphQL */ `
  subscription OnCreateAllIndices {
    onCreateAllIndices {
      id
      name
      exchg
      price
      prev
      ylow
      yhigh
      pe
      pb
      type
      subt
      curr
      ind
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateAllIndices = /* GraphQL */ `
  subscription OnUpdateAllIndices {
    onUpdateAllIndices {
      id
      name
      exchg
      price
      prev
      ylow
      yhigh
      pe
      pb
      type
      subt
      curr
      ind
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteAllIndices = /* GraphQL */ `
  subscription OnDeleteAllIndices {
    onDeleteAllIndices {
      id
      name
      exchg
      price
      prev
      ylow
      yhigh
      pe
      pb
      type
      subt
      curr
      ind
      createdAt
      updatedAt
    }
  }
`;
export const onCreateInsHistPerf = /* GraphQL */ `
  subscription OnCreateInsHistPerf {
    onCreateInsHistPerf {
      id
      p1y
      p3y
      p5y
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateInsHistPerf = /* GraphQL */ `
  subscription OnUpdateInsHistPerf {
    onUpdateInsHistPerf {
      id
      p1y
      p3y
      p5y
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteInsHistPerf = /* GraphQL */ `
  subscription OnDeleteInsHistPerf {
    onDeleteInsHistPerf {
      id
      p1y
      p3y
      p5y
      createdAt
      updatedAt
    }
  }
`;
export const onCreateIndiceHistPerf = /* GraphQL */ `
  subscription OnCreateIndiceHistPerf {
    onCreateIndiceHistPerf {
      name
      p1m
      p3m
      p1y
      p3y
      p5y
      vol
      beta
      corr
      rsq
      pe
      pb
      div
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateIndiceHistPerf = /* GraphQL */ `
  subscription OnUpdateIndiceHistPerf {
    onUpdateIndiceHistPerf {
      name
      p1m
      p3m
      p1y
      p3y
      p5y
      vol
      beta
      corr
      rsq
      pe
      pb
      div
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteIndiceHistPerf = /* GraphQL */ `
  subscription OnDeleteIndiceHistPerf {
    onDeleteIndiceHistPerf {
      name
      p1m
      p3m
      p1y
      p3y
      p5y
      vol
      beta
      corr
      rsq
      pe
      pb
      div
      createdAt
      updatedAt
    }
  }
`;
export const onCreateIndexConst = /* GraphQL */ `
  subscription OnCreateIndexConst {
    onCreateIndexConst {
      name
      const
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateIndexConst = /* GraphQL */ `
  subscription OnUpdateIndexConst {
    onUpdateIndexConst {
      name
      const
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteIndexConst = /* GraphQL */ `
  subscription OnDeleteIndexConst {
    onDeleteIndexConst {
      name
      const
      createdAt
      updatedAt
    }
  }
`;
export const onCreateINBondPrice = /* GraphQL */ `
  subscription OnCreateINBondPrice {
    onCreateINBondPrice {
      id
      sid
      name
      type
      subt
      price
      prev
      exchg
      sm
      sy
      mm
      my
      rate
      fv
      cr
      crstr
      ytm
      risk
      itype
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateINBondPrice = /* GraphQL */ `
  subscription OnUpdateINBondPrice {
    onUpdateINBondPrice {
      id
      sid
      name
      type
      subt
      price
      prev
      exchg
      sm
      sy
      mm
      my
      rate
      fv
      cr
      crstr
      ytm
      risk
      itype
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteINBondPrice = /* GraphQL */ `
  subscription OnDeleteINBondPrice {
    onDeleteINBondPrice {
      id
      sid
      name
      type
      subt
      price
      prev
      exchg
      sm
      sy
      mm
      my
      rate
      fv
      cr
      crstr
      ytm
      risk
      itype
      createdAt
      updatedAt
    }
  }
`;
export const onCreateINMFPrice = /* GraphQL */ `
  subscription OnCreateINMFPrice {
    onCreateINMFPrice {
      id
      sid
      tid
      dir
      name
      type
      subt
      price
      prev
      mftype
      mcapt
      tf
      risk
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateINMFPrice = /* GraphQL */ `
  subscription OnUpdateINMFPrice {
    onUpdateINMFPrice {
      id
      sid
      tid
      dir
      name
      type
      subt
      price
      prev
      mftype
      mcapt
      tf
      risk
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteINMFPrice = /* GraphQL */ `
  subscription OnDeleteINMFPrice {
    onDeleteINMFPrice {
      id
      sid
      tid
      dir
      name
      type
      subt
      price
      prev
      mftype
      mcapt
      tf
      risk
      createdAt
      updatedAt
    }
  }
`;
export const onCreateNPSPrice = /* GraphQL */ `
  subscription OnCreateNPSPrice {
    onCreateNPSPrice {
      id
      pfm
      st
      name
      type
      subt
      price
      prev
      risk
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateNPSPrice = /* GraphQL */ `
  subscription OnUpdateNPSPrice {
    onUpdateNPSPrice {
      id
      pfm
      st
      name
      type
      subt
      price
      prev
      risk
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteNPSPrice = /* GraphQL */ `
  subscription OnDeleteNPSPrice {
    onDeleteNPSPrice {
      id
      pfm
      st
      name
      type
      subt
      price
      prev
      risk
      createdAt
      updatedAt
    }
  }
`;
export const onCreateUserHoldings = /* GraphQL */ `
  subscription OnCreateUserHoldings($owner: String) {
    onCreateUserHoldings(owner: $owner) {
      uname
      dep {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
        pur {
          amt
          day
          month
          year
          qty
        }
      }
      ltdep {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
        pur {
          amt
          day
          month
          year
          qty
        }
      }
      p2p {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
        pur {
          amt
          day
          month
          year
          qty
        }
      }
      loans {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
        pur {
          amt
          day
          month
          year
          qty
        }
      }
      credit {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
        pur {
          amt
          day
          month
          year
          qty
        }
      }
      savings {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
        pur {
          amt
          day
          month
          year
          qty
        }
      }
      property {
        type
        name
        pin
        purchase {
          amt
          day
          month
          year
          qty
        }
        address
        curr
        city
        country
        state
        own {
          fId
          per
        }
        rate
        mv
        mvy
        mvm
        res
      }
      vehicles {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
        pur {
          amt
          day
          month
          year
          qty
        }
      }
      pm {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
        pur {
          amt
          day
          month
          year
          qty
        }
      }
      pf {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
        pur {
          amt
          day
          month
          year
          qty
        }
      }
      nps {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
        pur {
          amt
          day
          month
          year
          qty
        }
      }
      crypto {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
        pur {
          amt
          day
          month
          year
          qty
        }
      }
      ins {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
        pur {
          amt
          day
          month
          year
          qty
        }
      }
      other {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
        pur {
          amt
          day
          month
          year
          qty
        }
      }
      angel {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
        pur {
          amt
          day
          month
          year
          qty
        }
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateUserHoldings = /* GraphQL */ `
  subscription OnUpdateUserHoldings($owner: String) {
    onUpdateUserHoldings(owner: $owner) {
      uname
      dep {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
        pur {
          amt
          day
          month
          year
          qty
        }
      }
      ltdep {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
        pur {
          amt
          day
          month
          year
          qty
        }
      }
      p2p {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
        pur {
          amt
          day
          month
          year
          qty
        }
      }
      loans {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
        pur {
          amt
          day
          month
          year
          qty
        }
      }
      credit {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
        pur {
          amt
          day
          month
          year
          qty
        }
      }
      savings {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
        pur {
          amt
          day
          month
          year
          qty
        }
      }
      property {
        type
        name
        pin
        purchase {
          amt
          day
          month
          year
          qty
        }
        address
        curr
        city
        country
        state
        own {
          fId
          per
        }
        rate
        mv
        mvy
        mvm
        res
      }
      vehicles {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
        pur {
          amt
          day
          month
          year
          qty
        }
      }
      pm {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
        pur {
          amt
          day
          month
          year
          qty
        }
      }
      pf {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
        pur {
          amt
          day
          month
          year
          qty
        }
      }
      nps {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
        pur {
          amt
          day
          month
          year
          qty
        }
      }
      crypto {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
        pur {
          amt
          day
          month
          year
          qty
        }
      }
      ins {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
        pur {
          amt
          day
          month
          year
          qty
        }
      }
      other {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
        pur {
          amt
          day
          month
          year
          qty
        }
      }
      angel {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
        pur {
          amt
          day
          month
          year
          qty
        }
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteUserHoldings = /* GraphQL */ `
  subscription OnDeleteUserHoldings($owner: String) {
    onDeleteUserHoldings(owner: $owner) {
      uname
      dep {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
        pur {
          amt
          day
          month
          year
          qty
        }
      }
      ltdep {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
        pur {
          amt
          day
          month
          year
          qty
        }
      }
      p2p {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
        pur {
          amt
          day
          month
          year
          qty
        }
      }
      loans {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
        pur {
          amt
          day
          month
          year
          qty
        }
      }
      credit {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
        pur {
          amt
          day
          month
          year
          qty
        }
      }
      savings {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
        pur {
          amt
          day
          month
          year
          qty
        }
      }
      property {
        type
        name
        pin
        purchase {
          amt
          day
          month
          year
          qty
        }
        address
        curr
        city
        country
        state
        own {
          fId
          per
        }
        rate
        mv
        mvy
        mvm
        res
      }
      vehicles {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
        pur {
          amt
          day
          month
          year
          qty
        }
      }
      pm {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
        pur {
          amt
          day
          month
          year
          qty
        }
      }
      pf {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
        pur {
          amt
          day
          month
          year
          qty
        }
      }
      nps {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
        pur {
          amt
          day
          month
          year
          qty
        }
      }
      crypto {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
        pur {
          amt
          day
          month
          year
          qty
        }
      }
      ins {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
        pur {
          amt
          day
          month
          year
          qty
        }
      }
      other {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
        pur {
          amt
          day
          month
          year
          qty
        }
      }
      angel {
        id
        qty
        name
        fId
        curr
        chg
        chgF
        payF
        type
        subt
        sm
        sy
        em
        ey
        amt
        pur {
          amt
          day
          month
          year
          qty
        }
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onCreateUserIns = /* GraphQL */ `
  subscription OnCreateUserIns($owner: String) {
    onCreateUserIns(owner: $owner) {
      uname
      ins {
        id
        sid
        exchg
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        fId
        curr
        type
        subt
      }
      watch {
        id
        sid
        hight
        lowt
        type
        subt
        itype
        curr
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateUserIns = /* GraphQL */ `
  subscription OnUpdateUserIns($owner: String) {
    onUpdateUserIns(owner: $owner) {
      uname
      ins {
        id
        sid
        exchg
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        fId
        curr
        type
        subt
      }
      watch {
        id
        sid
        hight
        lowt
        type
        subt
        itype
        curr
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteUserIns = /* GraphQL */ `
  subscription OnDeleteUserIns($owner: String) {
    onDeleteUserIns(owner: $owner) {
      uname
      ins {
        id
        sid
        exchg
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        fId
        curr
        type
        subt
      }
      watch {
        id
        sid
        hight
        lowt
        type
        subt
        itype
        curr
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onCreateCoachingReq = /* GraphQL */ `
  subscription OnCreateCoachingReq($owner: String) {
    onCreateCoachingReq(owner: $owner) {
      id
      dur
      text
      page
      type
      status
      payment
      curr
      paid
      pt
      email
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateCoachingReq = /* GraphQL */ `
  subscription OnUpdateCoachingReq($owner: String) {
    onUpdateCoachingReq(owner: $owner) {
      id
      dur
      text
      page
      type
      status
      payment
      curr
      paid
      pt
      email
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteCoachingReq = /* GraphQL */ `
  subscription OnDeleteCoachingReq($owner: String) {
    onDeleteCoachingReq(owner: $owner) {
      id
      dur
      text
      page
      type
      status
      payment
      curr
      paid
      pt
      email
      createdAt
      updatedAt
      owner
    }
  }
`;
