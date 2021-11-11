/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
export const onCreateRegMob = /* GraphQL */ `
  subscription OnCreateRegMob($owner: String) {
    onCreateRegMob(owner: $owner) {
      mob
      cc
      notify
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateRegMob = /* GraphQL */ `
  subscription OnUpdateRegMob($owner: String) {
    onUpdateRegMob(owner: $owner) {
      mob
      cc
      notify
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteRegMob = /* GraphQL */ `
  subscription OnDeleteRegMob($owner: String) {
    onDeleteRegMob(owner: $owner) {
      mob
      cc
      notify
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onCreateRegEmail = /* GraphQL */ `
  subscription OnCreateRegEmail {
    onCreateRegEmail {
      email
      notify
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateRegEmail = /* GraphQL */ `
  subscription OnUpdateRegEmail {
    onUpdateRegEmail {
      email
      notify
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteRegEmail = /* GraphQL */ `
  subscription OnDeleteRegEmail {
    onDeleteRegEmail {
      email
      notify
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
export const onCreateInExchg = /* GraphQL */ `
  subscription OnCreateInExchg {
    onCreateINExchg {
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
export const onUpdateInExchg = /* GraphQL */ `
  subscription OnUpdateInExchg {
    onUpdateINExchg {
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
export const onDeleteInExchg = /* GraphQL */ `
  subscription OnDeleteInExchg {
    onDeleteINExchg {
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
export const onCreateInExchgMeta = /* GraphQL */ `
  subscription OnCreateInExchgMeta {
    onCreateINExchgMeta {
      id
      mcap
      ind
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateInExchgMeta = /* GraphQL */ `
  subscription OnUpdateInExchgMeta {
    onUpdateINExchgMeta {
      id
      mcap
      ind
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteInExchgMeta = /* GraphQL */ `
  subscription OnDeleteInExchgMeta {
    onDeleteINExchgMeta {
      id
      mcap
      ind
      createdAt
      updatedAt
    }
  }
`;
export const onCreateIndices = /* GraphQL */ `
  subscription OnCreateIndices {
    onCreateIndices {
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
export const onUpdateIndices = /* GraphQL */ `
  subscription OnUpdateIndices {
    onUpdateIndices {
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
export const onDeleteIndices = /* GraphQL */ `
  subscription OnDeleteIndices {
    onDeleteIndices {
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
export const onCreateInBond = /* GraphQL */ `
  subscription OnCreateInBond {
    onCreateINBond {
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
export const onUpdateInBond = /* GraphQL */ `
  subscription OnUpdateInBond {
    onUpdateINBond {
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
export const onDeleteInBond = /* GraphQL */ `
  subscription OnDeleteInBond {
    onDeleteINBond {
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
export const onCreateInMutual = /* GraphQL */ `
  subscription OnCreateInMutual {
    onCreateINMutual {
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
export const onUpdateInMutual = /* GraphQL */ `
  subscription OnUpdateInMutual {
    onUpdateINMutual {
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
export const onDeleteInMutual = /* GraphQL */ `
  subscription OnDeleteInMutual {
    onDeleteINMutual {
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
export const onCreateNps = /* GraphQL */ `
  subscription OnCreateNps {
    onCreateNPS {
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
export const onUpdateNps = /* GraphQL */ `
  subscription OnUpdateNps {
    onUpdateNPS {
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
export const onDeleteNps = /* GraphQL */ `
  subscription OnDeleteNps {
    onDeleteNPS {
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
export const onCreateHoldings = /* GraphQL */ `
  subscription OnCreateHoldings($owner: String) {
    onCreateHoldings(owner: $owner) {
      id
      instruments {
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
        fIds
        curr
        chg
        chgF
        type
        subt
      }
      deposits {
        amt
        sm
        sy
        months
        rate
        fIds
        curr
        cum
        cumf
      }
      lendings {
        amt
        sm
        sy
        months
        rate
        fIds
        curr
        cum
        cumf
      }
      loans {
        loan {
          type
          per
          rate
          dur
          ry
          emi
          pmi
          peper
        }
        fIds
        curr
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
        fIds
        curr
        chg
        chgF
        type
        subt
      }
      property {
        type
        pin
        purchase {
          amt
          day
          month
          year
          qty
        }
        address
        fIds
        curr
        country
        own {
          fId
          per
        }
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
        fIds
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
        fIds
        curr
        chg
        chgF
        type
        subt
      }
      ppf {
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
        fIds
        curr
        chg
        chgF
        type
        subt
      }
      epf {
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
        fIds
        curr
        chg
        chgF
        type
        subt
      }
      vpf {
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
        fIds
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
        fIds
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
        fIds
        curr
        chg
        chgF
        type
        subt
      }
      ins {
        premium
        sy
        ey
        yearly
        fIds
        curr
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
        fIds
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
        fIds
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
export const onUpdateHoldings = /* GraphQL */ `
  subscription OnUpdateHoldings($owner: String) {
    onUpdateHoldings(owner: $owner) {
      id
      instruments {
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
        fIds
        curr
        chg
        chgF
        type
        subt
      }
      deposits {
        amt
        sm
        sy
        months
        rate
        fIds
        curr
        cum
        cumf
      }
      lendings {
        amt
        sm
        sy
        months
        rate
        fIds
        curr
        cum
        cumf
      }
      loans {
        loan {
          type
          per
          rate
          dur
          ry
          emi
          pmi
          peper
        }
        fIds
        curr
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
        fIds
        curr
        chg
        chgF
        type
        subt
      }
      property {
        type
        pin
        purchase {
          amt
          day
          month
          year
          qty
        }
        address
        fIds
        curr
        country
        own {
          fId
          per
        }
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
        fIds
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
        fIds
        curr
        chg
        chgF
        type
        subt
      }
      ppf {
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
        fIds
        curr
        chg
        chgF
        type
        subt
      }
      epf {
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
        fIds
        curr
        chg
        chgF
        type
        subt
      }
      vpf {
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
        fIds
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
        fIds
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
        fIds
        curr
        chg
        chgF
        type
        subt
      }
      ins {
        premium
        sy
        ey
        yearly
        fIds
        curr
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
        fIds
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
        fIds
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
export const onDeleteHoldings = /* GraphQL */ `
  subscription OnDeleteHoldings($owner: String) {
    onDeleteHoldings(owner: $owner) {
      id
      instruments {
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
        fIds
        curr
        chg
        chgF
        type
        subt
      }
      deposits {
        amt
        sm
        sy
        months
        rate
        fIds
        curr
        cum
        cumf
      }
      lendings {
        amt
        sm
        sy
        months
        rate
        fIds
        curr
        cum
        cumf
      }
      loans {
        loan {
          type
          per
          rate
          dur
          ry
          emi
          pmi
          peper
        }
        fIds
        curr
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
        fIds
        curr
        chg
        chgF
        type
        subt
      }
      property {
        type
        pin
        purchase {
          amt
          day
          month
          year
          qty
        }
        address
        fIds
        curr
        country
        own {
          fId
          per
        }
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
        fIds
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
        fIds
        curr
        chg
        chgF
        type
        subt
      }
      ppf {
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
        fIds
        curr
        chg
        chgF
        type
        subt
      }
      epf {
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
        fIds
        curr
        chg
        chgF
        type
        subt
      }
      vpf {
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
        fIds
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
        fIds
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
        fIds
        curr
        chg
        chgF
        type
        subt
      }
      ins {
        premium
        sy
        ey
        yearly
        fIds
        curr
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
        fIds
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
        fIds
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
