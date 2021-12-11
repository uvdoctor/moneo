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
      im
      mob
      notify
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
      im
      mob
      notify
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
      im
      mob
      notify
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
export const onCreateInExchgPrice = /* GraphQL */ `
  subscription OnCreateInExchgPrice {
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
      meta {
        id
        mcap
        ind
        createdAt
        updatedAt
      }
      fv
      under
      yhigh
      ylow
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateInExchgPrice = /* GraphQL */ `
  subscription OnUpdateInExchgPrice {
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
      meta {
        id
        mcap
        ind
        createdAt
        updatedAt
      }
      fv
      under
      yhigh
      ylow
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteInExchgPrice = /* GraphQL */ `
  subscription OnDeleteInExchgPrice {
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
      meta {
        id
        mcap
        ind
        createdAt
        updatedAt
      }
      fv
      under
      yhigh
      ylow
      createdAt
      updatedAt
    }
  }
`;
export const onCreateInsMeta = /* GraphQL */ `
  subscription OnCreateInsMeta {
    onCreateInsMeta {
      id
      mcap
      ind
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateInsMeta = /* GraphQL */ `
  subscription OnUpdateInsMeta {
    onUpdateInsMeta {
      id
      mcap
      ind
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteInsMeta = /* GraphQL */ `
  subscription OnDeleteInsMeta {
    onDeleteInsMeta {
      id
      mcap
      ind
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
export const onCreateInBondPrice = /* GraphQL */ `
  subscription OnCreateInBondPrice {
    onCreateINBondPrice {
      id
      sid
      name
      subt
      price
      exchg
      sm
      sy
      mm
      my
      rate
      fr
      tf
      fv
      cr
      crstr
      ytm
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateInBondPrice = /* GraphQL */ `
  subscription OnUpdateInBondPrice {
    onUpdateINBondPrice {
      id
      sid
      name
      subt
      price
      exchg
      sm
      sy
      mm
      my
      rate
      fr
      tf
      fv
      cr
      crstr
      ytm
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteInBondPrice = /* GraphQL */ `
  subscription OnDeleteInBondPrice {
    onDeleteINBondPrice {
      id
      sid
      name
      subt
      price
      exchg
      sm
      sy
      mm
      my
      rate
      fr
      tf
      fv
      cr
      crstr
      ytm
      createdAt
      updatedAt
    }
  }
`;
export const onCreateInmfPrice = /* GraphQL */ `
  subscription OnCreateInmfPrice {
    onCreateINMFPrice {
      id
      sid
      tid
      dir
      name
      type
      subt
      price
      mftype
      mcap
      tf
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateInmfPrice = /* GraphQL */ `
  subscription OnUpdateInmfPrice {
    onUpdateINMFPrice {
      id
      sid
      tid
      dir
      name
      type
      subt
      price
      mftype
      mcap
      tf
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteInmfPrice = /* GraphQL */ `
  subscription OnDeleteInmfPrice {
    onDeleteINMFPrice {
      id
      sid
      tid
      dir
      name
      type
      subt
      price
      mftype
      mcap
      tf
      createdAt
      updatedAt
    }
  }
`;
export const onCreateNpsPrice = /* GraphQL */ `
  subscription OnCreateNpsPrice {
    onCreateNPSPrice {
      id
      pfm
      st
      name
      type
      subt
      price
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateNpsPrice = /* GraphQL */ `
  subscription OnUpdateNpsPrice {
    onUpdateNPSPrice {
      id
      pfm
      st
      name
      type
      subt
      price
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteNpsPrice = /* GraphQL */ `
  subscription OnDeleteNpsPrice {
    onDeleteNPSPrice {
      id
      pfm
      st
      name
      type
      subt
      price
      createdAt
      updatedAt
    }
  }
`;
export const onCreateUserHoldings = /* GraphQL */ `
  subscription OnCreateUserHoldings($owner: String) {
    onCreateUserHoldings(owner: $owner) {
      uname
      lendings {
        id
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fId
        curr
        chg
        chgF
        type
        subt
      }
      loans {
        id
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fId
        curr
        chg
        chgF
        type
        subt
      }
      credit {
        id
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fId
        curr
        chg
        chgF
        type
        subt
      }
      savings {
        id
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fId
        curr
        chg
        chgF
        type
        subt
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
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fId
        curr
        chg
        chgF
        type
        subt
      }
      pm {
        id
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fId
        curr
        chg
        chgF
        type
        subt
      }
      pf {
        id
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fId
        curr
        chg
        chgF
        type
        subt
      }
      nps {
        id
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fId
        curr
        chg
        chgF
        type
        subt
      }
      crypto {
        id
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fId
        curr
        chg
        chgF
        type
        subt
      }
      ins {
        id
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fId
        curr
        chg
        chgF
        type
        subt
      }
      other {
        id
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fId
        curr
        chg
        chgF
        type
        subt
      }
      angel {
        id
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fId
        curr
        chg
        chgF
        type
        subt
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
      lendings {
        id
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fId
        curr
        chg
        chgF
        type
        subt
      }
      loans {
        id
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fId
        curr
        chg
        chgF
        type
        subt
      }
      credit {
        id
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fId
        curr
        chg
        chgF
        type
        subt
      }
      savings {
        id
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fId
        curr
        chg
        chgF
        type
        subt
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
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fId
        curr
        chg
        chgF
        type
        subt
      }
      pm {
        id
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fId
        curr
        chg
        chgF
        type
        subt
      }
      pf {
        id
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fId
        curr
        chg
        chgF
        type
        subt
      }
      nps {
        id
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fId
        curr
        chg
        chgF
        type
        subt
      }
      crypto {
        id
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fId
        curr
        chg
        chgF
        type
        subt
      }
      ins {
        id
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fId
        curr
        chg
        chgF
        type
        subt
      }
      other {
        id
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fId
        curr
        chg
        chgF
        type
        subt
      }
      angel {
        id
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fId
        curr
        chg
        chgF
        type
        subt
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
      lendings {
        id
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fId
        curr
        chg
        chgF
        type
        subt
      }
      loans {
        id
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fId
        curr
        chg
        chgF
        type
        subt
      }
      credit {
        id
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fId
        curr
        chg
        chgF
        type
        subt
      }
      savings {
        id
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fId
        curr
        chg
        chgF
        type
        subt
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
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fId
        curr
        chg
        chgF
        type
        subt
      }
      pm {
        id
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fId
        curr
        chg
        chgF
        type
        subt
      }
      pf {
        id
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fId
        curr
        chg
        chgF
        type
        subt
      }
      nps {
        id
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fId
        curr
        chg
        chgF
        type
        subt
      }
      crypto {
        id
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fId
        curr
        chg
        chgF
        type
        subt
      }
      ins {
        id
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fId
        curr
        chg
        chgF
        type
        subt
      }
      other {
        id
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fId
        curr
        chg
        chgF
        type
        subt
      }
      angel {
        id
        qty
        pur {
          amt
          day
          month
          year
          qty
        }
        name
        fId
        curr
        chg
        chgF
        type
        subt
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
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onCreateEodPrices = /* GraphQL */ `
  subscription OnCreateEodPrices {
    onCreateEODPrices {
      id
      price
      name
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateEodPrices = /* GraphQL */ `
  subscription OnUpdateEodPrices {
    onUpdateEODPrices {
      id
      price
      name
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteEodPrices = /* GraphQL */ `
  subscription OnDeleteEodPrices {
    onDeleteEODPrices {
      id
      price
      name
      createdAt
      updatedAt
    }
  }
`;
