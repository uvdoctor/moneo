/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
export const createUserInfo = /* GraphQL */ `
  mutation CreateUserInfo(
    $input: CreateUserInfoInput!
    $condition: ModelUserInfoConditionInput
  ) {
    createUserInfo(input: $input, condition: $condition) {
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
export const updateUserInfo = /* GraphQL */ `
  mutation UpdateUserInfo(
    $input: UpdateUserInfoInput!
    $condition: ModelUserInfoConditionInput
  ) {
    updateUserInfo(input: $input, condition: $condition) {
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
export const deleteUserInfo = /* GraphQL */ `
  mutation DeleteUserInfo(
    $input: DeleteUserInfoInput!
    $condition: ModelUserInfoConditionInput
  ) {
    deleteUserInfo(input: $input, condition: $condition) {
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
export const createUserHoldings = /* GraphQL */ `
  mutation CreateUserHoldings(
    $input: CreateUserHoldingsInput!
    $condition: ModelUserHoldingsConditionInput
  ) {
    createUserHoldings(input: $input, condition: $condition) {
      uname
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
        fId
        curr
        chg
        chgF
        type
        subt
      }
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
export const updateUserHoldings = /* GraphQL */ `
  mutation UpdateUserHoldings(
    $input: UpdateUserHoldingsInput!
    $condition: ModelUserHoldingsConditionInput
  ) {
    updateUserHoldings(input: $input, condition: $condition) {
      uname
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
        fId
        curr
        chg
        chgF
        type
        subt
      }
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
export const deleteUserHoldings = /* GraphQL */ `
  mutation DeleteUserHoldings(
    $input: DeleteUserHoldingsInput!
    $condition: ModelUserHoldingsConditionInput
  ) {
    deleteUserHoldings(input: $input, condition: $condition) {
      uname
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
        fId
        curr
        chg
        chgF
        type
        subt
      }
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
export const createUniverse = /* GraphQL */ `
  mutation CreateUniverse(
    $input: CreateUniverseInput!
    $condition: ModelUniverseConditionInput
  ) {
    createUniverse(input: $input, condition: $condition) {
      id
      sid
      exchg
      createdAt
      updatedAt
    }
  }
`;
export const updateUniverse = /* GraphQL */ `
  mutation UpdateUniverse(
    $input: UpdateUniverseInput!
    $condition: ModelUniverseConditionInput
  ) {
    updateUniverse(input: $input, condition: $condition) {
      id
      sid
      exchg
      createdAt
      updatedAt
    }
  }
`;
export const deleteUniverse = /* GraphQL */ `
  mutation DeleteUniverse(
    $input: DeleteUniverseInput!
    $condition: ModelUniverseConditionInput
  ) {
    deleteUniverse(input: $input, condition: $condition) {
      id
      sid
      exchg
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
export const createInExchgPrice = /* GraphQL */ `
  mutation CreateInExchgPrice(
    $input: CreateINExchgPriceInput!
    $condition: ModelINExchgPriceConditionInput
  ) {
    createINExchgPrice(input: $input, condition: $condition) {
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
export const updateInExchgPrice = /* GraphQL */ `
  mutation UpdateInExchgPrice(
    $input: UpdateINExchgPriceInput!
    $condition: ModelINExchgPriceConditionInput
  ) {
    updateINExchgPrice(input: $input, condition: $condition) {
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
export const deleteInExchgPrice = /* GraphQL */ `
  mutation DeleteInExchgPrice(
    $input: DeleteINExchgPriceInput!
    $condition: ModelINExchgPriceConditionInput
  ) {
    deleteINExchgPrice(input: $input, condition: $condition) {
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
export const createInsMeta = /* GraphQL */ `
  mutation CreateInsMeta(
    $input: CreateInsMetaInput!
    $condition: ModelInsMetaConditionInput
  ) {
    createInsMeta(input: $input, condition: $condition) {
      id
      mcap
      ind
      createdAt
      updatedAt
    }
  }
`;
export const updateInsMeta = /* GraphQL */ `
  mutation UpdateInsMeta(
    $input: UpdateInsMetaInput!
    $condition: ModelInsMetaConditionInput
  ) {
    updateInsMeta(input: $input, condition: $condition) {
      id
      mcap
      ind
      createdAt
      updatedAt
    }
  }
`;
export const deleteInsMeta = /* GraphQL */ `
  mutation DeleteInsMeta(
    $input: DeleteInsMetaInput!
    $condition: ModelInsMetaConditionInput
  ) {
    deleteInsMeta(input: $input, condition: $condition) {
      id
      mcap
      ind
      createdAt
      updatedAt
    }
  }
`;
export const createAllIndices = /* GraphQL */ `
  mutation CreateAllIndices(
    $input: CreateAllIndicesInput!
    $condition: ModelAllIndicesConditionInput
  ) {
    createAllIndices(input: $input, condition: $condition) {
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
export const updateAllIndices = /* GraphQL */ `
  mutation UpdateAllIndices(
    $input: UpdateAllIndicesInput!
    $condition: ModelAllIndicesConditionInput
  ) {
    updateAllIndices(input: $input, condition: $condition) {
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
export const deleteAllIndices = /* GraphQL */ `
  mutation DeleteAllIndices(
    $input: DeleteAllIndicesInput!
    $condition: ModelAllIndicesConditionInput
  ) {
    deleteAllIndices(input: $input, condition: $condition) {
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
export const createInBondPrice = /* GraphQL */ `
  mutation CreateInBondPrice(
    $input: CreateINBondPriceInput!
    $condition: ModelINBondPriceConditionInput
  ) {
    createINBondPrice(input: $input, condition: $condition) {
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
export const updateInBondPrice = /* GraphQL */ `
  mutation UpdateInBondPrice(
    $input: UpdateINBondPriceInput!
    $condition: ModelINBondPriceConditionInput
  ) {
    updateINBondPrice(input: $input, condition: $condition) {
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
export const deleteInBondPrice = /* GraphQL */ `
  mutation DeleteInBondPrice(
    $input: DeleteINBondPriceInput!
    $condition: ModelINBondPriceConditionInput
  ) {
    deleteINBondPrice(input: $input, condition: $condition) {
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
export const createInmfPrice = /* GraphQL */ `
  mutation CreateInmfPrice(
    $input: CreateINMFPriceInput!
    $condition: ModelINMFPriceConditionInput
  ) {
    createINMFPrice(input: $input, condition: $condition) {
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
export const updateInmfPrice = /* GraphQL */ `
  mutation UpdateInmfPrice(
    $input: UpdateINMFPriceInput!
    $condition: ModelINMFPriceConditionInput
  ) {
    updateINMFPrice(input: $input, condition: $condition) {
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
export const deleteInmfPrice = /* GraphQL */ `
  mutation DeleteInmfPrice(
    $input: DeleteINMFPriceInput!
    $condition: ModelINMFPriceConditionInput
  ) {
    deleteINMFPrice(input: $input, condition: $condition) {
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
export const createNpsPrice = /* GraphQL */ `
  mutation CreateNpsPrice(
    $input: CreateNPSPriceInput!
    $condition: ModelNPSPriceConditionInput
  ) {
    createNPSPrice(input: $input, condition: $condition) {
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
export const updateNpsPrice = /* GraphQL */ `
  mutation UpdateNpsPrice(
    $input: UpdateNPSPriceInput!
    $condition: ModelNPSPriceConditionInput
  ) {
    updateNPSPrice(input: $input, condition: $condition) {
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
export const deleteNpsPrice = /* GraphQL */ `
  mutation DeleteNpsPrice(
    $input: DeleteNPSPriceInput!
    $condition: ModelNPSPriceConditionInput
  ) {
    deleteNPSPrice(input: $input, condition: $condition) {
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
