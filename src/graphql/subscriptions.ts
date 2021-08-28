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
export const onCreateMilestone = /* GraphQL */ `
  subscription OnCreateMilestone($owner: String!) {
    onCreateMilestone(owner: $owner) {
      id
      tgt {
        num
        val
      }
      attr
      goals {
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
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateMilestone = /* GraphQL */ `
  subscription OnUpdateMilestone($owner: String!) {
    onUpdateMilestone(owner: $owner) {
      id
      tgt {
        num
        val
      }
      attr
      goals {
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
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteMilestone = /* GraphQL */ `
  subscription OnDeleteMilestone($owner: String!) {
    onDeleteMilestone(owner: $owner) {
      id
      tgt {
        num
        val
      }
      attr
      goals {
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
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onCreateProfile = /* GraphQL */ `
  subscription OnCreateProfile($owner: String!) {
    onCreateProfile(owner: $owner) {
      id
      citizen
      tr
      itr
      cgtr
      curr
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateProfile = /* GraphQL */ `
  subscription OnUpdateProfile($owner: String!) {
    onUpdateProfile(owner: $owner) {
      id
      citizen
      tr
      itr
      cgtr
      curr
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteProfile = /* GraphQL */ `
  subscription OnDeleteProfile($owner: String!) {
    onDeleteProfile(owner: $owner) {
      id
      citizen
      tr
      itr
      cgtr
      curr
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onCreateItem = /* GraphQL */ `
  subscription OnCreateItem($owner: String!) {
    onCreateItem(owner: $owner) {
      id
      p_at
      p_id
      p_instid
      instname
      status
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateItem = /* GraphQL */ `
  subscription OnUpdateItem($owner: String!) {
    onUpdateItem(owner: $owner) {
      id
      p_at
      p_id
      p_instid
      instname
      status
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteItem = /* GraphQL */ `
  subscription OnDeleteItem($owner: String!) {
    onDeleteItem(owner: $owner) {
      id
      p_at
      p_id
      p_instid
      instname
      status
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onCreateAccount = /* GraphQL */ `
  subscription OnCreateAccount($owner: String!) {
    onCreateAccount(owner: $owner) {
      id
      item {
        id
        p_at
        p_id
        p_instid
        instname
        status
        createdAt
        updatedAt
        owner
      }
      p_id
      name
      mask
      offname
      currbal
      availbal
      curr
      uncurr
      type
      subtype
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateAccount = /* GraphQL */ `
  subscription OnUpdateAccount($owner: String!) {
    onUpdateAccount(owner: $owner) {
      id
      item {
        id
        p_at
        p_id
        p_instid
        instname
        status
        createdAt
        updatedAt
        owner
      }
      p_id
      name
      mask
      offname
      currbal
      availbal
      curr
      uncurr
      type
      subtype
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteAccount = /* GraphQL */ `
  subscription OnDeleteAccount($owner: String!) {
    onDeleteAccount(owner: $owner) {
      id
      item {
        id
        p_at
        p_id
        p_instid
        instname
        status
        createdAt
        updatedAt
        owner
      }
      p_id
      name
      mask
      offname
      currbal
      availbal
      curr
      uncurr
      type
      subtype
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
export const onCreateHoldings = /* GraphQL */ `
  subscription OnCreateHoldings($owner: String!) {
    onCreateHoldings(owner: $owner) {
      id
      instruments {
        id
        qty
        pur {
          amt
          date
          qty
        }
        name
        fIds
        curr
        chg
        type
        subt
      }
      deposits {
        amt
        start
        end
        rate
        fIds
        curr
      }
      lendings {
        amt
        start
        end
        rate
        fIds
        curr
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
        amt
        curr
        name
      }
      property {
        type
        pin
        purchase {
          amt
          date
          qty
        }
        address
        fIds
        curr
        country
      }
      vehicles {
        id
        qty
        pur {
          amt
          date
          qty
        }
        name
        fIds
        curr
        chg
        type
        subt
      }
      pm {
        id
        qty
        pur {
          amt
          date
          qty
        }
        name
        fIds
        curr
        chg
        type
        subt
      }
      ppf {
        id
        qty
        pur {
          amt
          date
          qty
        }
        name
        fIds
        curr
        chg
        type
        subt
      }
      epf {
        id
        qty
        pur {
          amt
          date
          qty
        }
        name
        fIds
        curr
        chg
        type
        subt
      }
      nps {
        id
        qty
        pur {
          amt
          date
          qty
        }
        name
        fIds
        curr
        chg
        type
        subt
      }
      crypto {
        id
        qty
        pur {
          amt
          date
          qty
        }
        name
        fIds
        curr
        chg
        type
        subt
      }
      ins {
        premium
        years
        fIds
        curr
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateHoldings = /* GraphQL */ `
  subscription OnUpdateHoldings($owner: String!) {
    onUpdateHoldings(owner: $owner) {
      id
      instruments {
        id
        qty
        pur {
          amt
          date
          qty
        }
        name
        fIds
        curr
        chg
        type
        subt
      }
      deposits {
        amt
        start
        end
        rate
        fIds
        curr
      }
      lendings {
        amt
        start
        end
        rate
        fIds
        curr
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
        amt
        curr
        name
      }
      property {
        type
        pin
        purchase {
          amt
          date
          qty
        }
        address
        fIds
        curr
        country
      }
      vehicles {
        id
        qty
        pur {
          amt
          date
          qty
        }
        name
        fIds
        curr
        chg
        type
        subt
      }
      pm {
        id
        qty
        pur {
          amt
          date
          qty
        }
        name
        fIds
        curr
        chg
        type
        subt
      }
      ppf {
        id
        qty
        pur {
          amt
          date
          qty
        }
        name
        fIds
        curr
        chg
        type
        subt
      }
      epf {
        id
        qty
        pur {
          amt
          date
          qty
        }
        name
        fIds
        curr
        chg
        type
        subt
      }
      nps {
        id
        qty
        pur {
          amt
          date
          qty
        }
        name
        fIds
        curr
        chg
        type
        subt
      }
      crypto {
        id
        qty
        pur {
          amt
          date
          qty
        }
        name
        fIds
        curr
        chg
        type
        subt
      }
      ins {
        premium
        years
        fIds
        curr
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteHoldings = /* GraphQL */ `
  subscription OnDeleteHoldings($owner: String!) {
    onDeleteHoldings(owner: $owner) {
      id
      instruments {
        id
        qty
        pur {
          amt
          date
          qty
        }
        name
        fIds
        curr
        chg
        type
        subt
      }
      deposits {
        amt
        start
        end
        rate
        fIds
        curr
      }
      lendings {
        amt
        start
        end
        rate
        fIds
        curr
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
        amt
        curr
        name
      }
      property {
        type
        pin
        purchase {
          amt
          date
          qty
        }
        address
        fIds
        curr
        country
      }
      vehicles {
        id
        qty
        pur {
          amt
          date
          qty
        }
        name
        fIds
        curr
        chg
        type
        subt
      }
      pm {
        id
        qty
        pur {
          amt
          date
          qty
        }
        name
        fIds
        curr
        chg
        type
        subt
      }
      ppf {
        id
        qty
        pur {
          amt
          date
          qty
        }
        name
        fIds
        curr
        chg
        type
        subt
      }
      epf {
        id
        qty
        pur {
          amt
          date
          qty
        }
        name
        fIds
        curr
        chg
        type
        subt
      }
      nps {
        id
        qty
        pur {
          amt
          date
          qty
        }
        name
        fIds
        curr
        chg
        type
        subt
      }
      crypto {
        id
        qty
        pur {
          amt
          date
          qty
        }
        name
        fIds
        curr
        chg
        type
        subt
      }
      ins {
        premium
        years
        fIds
        curr
      }
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
export const onCreateRegistration = /* GraphQL */ `
  subscription OnCreateRegistration {
    onCreateRegistration {
      email
      status
      code
      country
      lat
      long
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateRegistration = /* GraphQL */ `
  subscription OnUpdateRegistration {
    onUpdateRegistration {
      email
      status
      code
      country
      lat
      long
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteRegistration = /* GraphQL */ `
  subscription OnDeleteRegistration {
    onDeleteRegistration {
      email
      status
      code
      country
      lat
      long
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
      mcap
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
      mcap
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
      mcap
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
export const onCreateInmf = /* GraphQL */ `
  subscription OnCreateInmf {
    onCreateINMF {
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
export const onUpdateInmf = /* GraphQL */ `
  subscription OnUpdateInmf {
    onUpdateINMF {
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
export const onDeleteInmf = /* GraphQL */ `
  subscription OnDeleteInmf {
    onDeleteINMF {
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
