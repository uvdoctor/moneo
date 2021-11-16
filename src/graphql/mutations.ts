/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const deleteFeedback = /* GraphQL */ `
  mutation DeleteFeedback(
    $input: DeleteFeedbackInput!
    $condition: ModelFeedbackConditionInput
  ) {
    deleteFeedback(input: $input, condition: $condition) {
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
export const deleteRating = /* GraphQL */ `
  mutation DeleteRating(
    $input: DeleteRatingInput!
    $condition: ModelRatingConditionInput
  ) {
    deleteRating(input: $input, condition: $condition) {
      id
      type
      rating
      feedbackId
      createdAt
      updatedAt
    }
  }
`;
export const createGoal = /* GraphQL */ `
  mutation CreateGoal(
    $input: CreateGoalInput!
    $condition: ModelGoalConditionInput
  ) {
    createGoal(input: $input, condition: $condition) {
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
export const updateGoal = /* GraphQL */ `
  mutation UpdateGoal(
    $input: UpdateGoalInput!
    $condition: ModelGoalConditionInput
  ) {
    updateGoal(input: $input, condition: $condition) {
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
export const deleteGoal = /* GraphQL */ `
  mutation DeleteGoal(
    $input: DeleteGoalInput!
    $condition: ModelGoalConditionInput
  ) {
    deleteGoal(input: $input, condition: $condition) {
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
export const updateContacts = /* GraphQL */ `
  mutation UpdateContacts(
    $input: UpdateContactsInput!
    $condition: ModelContactsConditionInput
  ) {
    updateContacts(input: $input, condition: $condition) {
      email
      im
      mob
      notify
      createdAt
      updatedAt
    }
  }
`;
export const deleteContacts = /* GraphQL */ `
  mutation DeleteContacts(
    $input: DeleteContactsInput!
    $condition: ModelContactsConditionInput
  ) {
    deleteContacts(input: $input, condition: $condition) {
      email
      im
      mob
      notify
      createdAt
      updatedAt
    }
  }
`;
export const createFamily = /* GraphQL */ `
  mutation CreateFamily(
    $input: CreateFamilyInput!
    $condition: ModelFamilyConditionInput
  ) {
    createFamily(input: $input, condition: $condition) {
      id
      tid
      name
      createdAt
      updatedAt
      owner
    }
  }
`;
export const updateFamily = /* GraphQL */ `
  mutation UpdateFamily(
    $input: UpdateFamilyInput!
    $condition: ModelFamilyConditionInput
  ) {
    updateFamily(input: $input, condition: $condition) {
      id
      tid
      name
      createdAt
      updatedAt
      owner
    }
  }
`;
export const deleteFamily = /* GraphQL */ `
  mutation DeleteFamily(
    $input: DeleteFamilyInput!
    $condition: ModelFamilyConditionInput
  ) {
    deleteFamily(input: $input, condition: $condition) {
      id
      tid
      name
      createdAt
      updatedAt
      owner
    }
  }
`;
export const createHoldings = /* GraphQL */ `
  mutation CreateHoldings(
    $input: CreateHoldingsInput!
    $condition: ModelHoldingsConditionInput
  ) {
    createHoldings(input: $input, condition: $condition) {
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
        curr
        city
        country
        district
        state
        own {
          fId
          per
        }
        rate
        mv
        mvy
        mvm
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
export const updateHoldings = /* GraphQL */ `
  mutation UpdateHoldings(
    $input: UpdateHoldingsInput!
    $condition: ModelHoldingsConditionInput
  ) {
    updateHoldings(input: $input, condition: $condition) {
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
        curr
        city
        country
        district
        state
        own {
          fId
          per
        }
        rate
        mv
        mvy
        mvm
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
export const deleteHoldings = /* GraphQL */ `
  mutation DeleteHoldings(
    $input: DeleteHoldingsInput!
    $condition: ModelHoldingsConditionInput
  ) {
    deleteHoldings(input: $input, condition: $condition) {
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
        curr
        city
        country
        district
        state
        own {
          fId
          per
        }
        rate
        mv
        mvy
        mvm
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
export const createFeedback = /* GraphQL */ `
  mutation CreateFeedback(
    $input: CreateFeedbackInput!
    $condition: ModelFeedbackConditionInput
  ) {
    createFeedback(input: $input, condition: $condition) {
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
export const updateFeedback = /* GraphQL */ `
  mutation UpdateFeedback(
    $input: UpdateFeedbackInput!
    $condition: ModelFeedbackConditionInput
  ) {
    updateFeedback(input: $input, condition: $condition) {
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
export const createRating = /* GraphQL */ `
  mutation CreateRating(
    $input: CreateRatingInput!
    $condition: ModelRatingConditionInput
  ) {
    createRating(input: $input, condition: $condition) {
      id
      type
      rating
      feedbackId
      createdAt
      updatedAt
    }
  }
`;
export const updateRating = /* GraphQL */ `
  mutation UpdateRating(
    $input: UpdateRatingInput!
    $condition: ModelRatingConditionInput
  ) {
    updateRating(input: $input, condition: $condition) {
      id
      type
      rating
      feedbackId
      createdAt
      updatedAt
    }
  }
`;
export const createContacts = /* GraphQL */ `
  mutation CreateContacts(
    $input: CreateContactsInput!
    $condition: ModelContactsConditionInput
  ) {
    createContacts(input: $input, condition: $condition) {
      email
      im
      mob
      notify
      createdAt
      updatedAt
    }
  }
`;
export const createFeeds = /* GraphQL */ `
  mutation CreateFeeds(
    $input: CreateFeedsInput!
    $condition: ModelFeedsConditionInput
  ) {
    createFeeds(input: $input, condition: $condition) {
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
export const updateFeeds = /* GraphQL */ `
  mutation UpdateFeeds(
    $input: UpdateFeedsInput!
    $condition: ModelFeedsConditionInput
  ) {
    updateFeeds(input: $input, condition: $condition) {
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
export const deleteFeeds = /* GraphQL */ `
  mutation DeleteFeeds(
    $input: DeleteFeedsInput!
    $condition: ModelFeedsConditionInput
  ) {
    deleteFeeds(input: $input, condition: $condition) {
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
export const createInExchg = /* GraphQL */ `
  mutation CreateInExchg(
    $input: CreateINExchgInput!
    $condition: ModelINExchgConditionInput
  ) {
    createINExchg(input: $input, condition: $condition) {
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
export const updateInExchg = /* GraphQL */ `
  mutation UpdateInExchg(
    $input: UpdateINExchgInput!
    $condition: ModelINExchgConditionInput
  ) {
    updateINExchg(input: $input, condition: $condition) {
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
export const deleteInExchg = /* GraphQL */ `
  mutation DeleteInExchg(
    $input: DeleteINExchgInput!
    $condition: ModelINExchgConditionInput
  ) {
    deleteINExchg(input: $input, condition: $condition) {
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
export const createInExchgMeta = /* GraphQL */ `
  mutation CreateInExchgMeta(
    $input: CreateINExchgMetaInput!
    $condition: ModelINExchgMetaConditionInput
  ) {
    createINExchgMeta(input: $input, condition: $condition) {
      id
      mcap
      ind
      createdAt
      updatedAt
    }
  }
`;
export const updateInExchgMeta = /* GraphQL */ `
  mutation UpdateInExchgMeta(
    $input: UpdateINExchgMetaInput!
    $condition: ModelINExchgMetaConditionInput
  ) {
    updateINExchgMeta(input: $input, condition: $condition) {
      id
      mcap
      ind
      createdAt
      updatedAt
    }
  }
`;
export const deleteInExchgMeta = /* GraphQL */ `
  mutation DeleteInExchgMeta(
    $input: DeleteINExchgMetaInput!
    $condition: ModelINExchgMetaConditionInput
  ) {
    deleteINExchgMeta(input: $input, condition: $condition) {
      id
      mcap
      ind
      createdAt
      updatedAt
    }
  }
`;
export const createIndices = /* GraphQL */ `
  mutation CreateIndices(
    $input: CreateIndicesInput!
    $condition: ModelIndicesConditionInput
  ) {
    createIndices(input: $input, condition: $condition) {
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
export const updateIndices = /* GraphQL */ `
  mutation UpdateIndices(
    $input: UpdateIndicesInput!
    $condition: ModelIndicesConditionInput
  ) {
    updateIndices(input: $input, condition: $condition) {
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
export const deleteIndices = /* GraphQL */ `
  mutation DeleteIndices(
    $input: DeleteIndicesInput!
    $condition: ModelIndicesConditionInput
  ) {
    deleteIndices(input: $input, condition: $condition) {
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
export const createInBond = /* GraphQL */ `
  mutation CreateInBond(
    $input: CreateINBondInput!
    $condition: ModelINBondConditionInput
  ) {
    createINBond(input: $input, condition: $condition) {
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
export const updateInBond = /* GraphQL */ `
  mutation UpdateInBond(
    $input: UpdateINBondInput!
    $condition: ModelINBondConditionInput
  ) {
    updateINBond(input: $input, condition: $condition) {
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
export const deleteInBond = /* GraphQL */ `
  mutation DeleteInBond(
    $input: DeleteINBondInput!
    $condition: ModelINBondConditionInput
  ) {
    deleteINBond(input: $input, condition: $condition) {
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
export const createInMutual = /* GraphQL */ `
  mutation CreateInMutual(
    $input: CreateINMutualInput!
    $condition: ModelINMutualConditionInput
  ) {
    createINMutual(input: $input, condition: $condition) {
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
export const updateInMutual = /* GraphQL */ `
  mutation UpdateInMutual(
    $input: UpdateINMutualInput!
    $condition: ModelINMutualConditionInput
  ) {
    updateINMutual(input: $input, condition: $condition) {
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
export const deleteInMutual = /* GraphQL */ `
  mutation DeleteInMutual(
    $input: DeleteINMutualInput!
    $condition: ModelINMutualConditionInput
  ) {
    deleteINMutual(input: $input, condition: $condition) {
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
export const createNps = /* GraphQL */ `
  mutation CreateNps(
    $input: CreateNPSInput!
    $condition: ModelNPSConditionInput
  ) {
    createNPS(input: $input, condition: $condition) {
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
export const updateNps = /* GraphQL */ `
  mutation UpdateNps(
    $input: UpdateNPSInput!
    $condition: ModelNPSConditionInput
  ) {
    updateNPS(input: $input, condition: $condition) {
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
export const deleteNps = /* GraphQL */ `
  mutation DeleteNps(
    $input: DeleteNPSInput!
    $condition: ModelNPSConditionInput
  ) {
    deleteNPS(input: $input, condition: $condition) {
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
export const createEodPrices = /* GraphQL */ `
  mutation CreateEodPrices(
    $input: CreateEODPricesInput!
    $condition: ModelEODPricesConditionInput
  ) {
    createEODPrices(input: $input, condition: $condition) {
      id
      price
      name
      createdAt
      updatedAt
    }
  }
`;
export const updateEodPrices = /* GraphQL */ `
  mutation UpdateEodPrices(
    $input: UpdateEODPricesInput!
    $condition: ModelEODPricesConditionInput
  ) {
    updateEODPrices(input: $input, condition: $condition) {
      id
      price
      name
      createdAt
      updatedAt
    }
  }
`;
export const deleteEodPrices = /* GraphQL */ `
  mutation DeleteEodPrices(
    $input: DeleteEODPricesInput!
    $condition: ModelEODPricesConditionInput
  ) {
    deleteEODPrices(input: $input, condition: $condition) {
      id
      price
      name
      createdAt
      updatedAt
    }
  }
`;
