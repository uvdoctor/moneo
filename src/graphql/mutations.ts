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
export const createUserInfo = /* GraphQL */ `
  mutation CreateUserInfo(
    $input: CreateUserInfoInput!
    $condition: ModelUserInfoConditionInput
  ) {
    createUserInfo(input: $input, condition: $condition) {
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
      le
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
      dob
      im
      mob
      notify
      tax
      rp
      dr
      tc
      le
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
      dob
      im
      mob
      notify
      tax
      rp
      dr
      tc
      le
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
      tax
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
      tax
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
      tax
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
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const createUserIns = /* GraphQL */ `
  mutation CreateUserIns(
    $input: CreateUserInsInput!
    $condition: ModelUserInsConditionInput
  ) {
    createUserIns(input: $input, condition: $condition) {
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
export const updateUserIns = /* GraphQL */ `
  mutation UpdateUserIns(
    $input: UpdateUserInsInput!
    $condition: ModelUserInsConditionInput
  ) {
    updateUserIns(input: $input, condition: $condition) {
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
export const deleteUserIns = /* GraphQL */ `
  mutation DeleteUserIns(
    $input: DeleteUserInsInput!
    $condition: ModelUserInsConditionInput
  ) {
    deleteUserIns(input: $input, condition: $condition) {
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
export const createAa = /* GraphQL */ `
  mutation CreateAa($input: CreateAAInput!, $condition: ModelAAConditionInput) {
    createAA(input: $input, condition: $condition) {
      uname
      curr
      tgt
      createdAt
      updatedAt
      owner
    }
  }
`;
export const updateAa = /* GraphQL */ `
  mutation UpdateAa($input: UpdateAAInput!, $condition: ModelAAConditionInput) {
    updateAA(input: $input, condition: $condition) {
      uname
      curr
      tgt
      createdAt
      updatedAt
      owner
    }
  }
`;
export const deleteAa = /* GraphQL */ `
  mutation DeleteAa($input: DeleteAAInput!, $condition: ModelAAConditionInput) {
    deleteAA(input: $input, condition: $condition) {
      uname
      curr
      tgt
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
export const createInsAnalytics = /* GraphQL */ `
  mutation CreateInsAnalytics(
    $input: CreateInsAnalyticsInput!
    $condition: ModelInsAnalyticsConditionInput
  ) {
    createInsAnalytics(input: $input, condition: $condition) {
      id
      analytics
      createdAt
      updatedAt
    }
  }
`;
export const updateInsAnalytics = /* GraphQL */ `
  mutation UpdateInsAnalytics(
    $input: UpdateInsAnalyticsInput!
    $condition: ModelInsAnalyticsConditionInput
  ) {
    updateInsAnalytics(input: $input, condition: $condition) {
      id
      analytics
      createdAt
      updatedAt
    }
  }
`;
export const deleteInsAnalytics = /* GraphQL */ `
  mutation DeleteInsAnalytics(
    $input: DeleteInsAnalyticsInput!
    $condition: ModelInsAnalyticsConditionInput
  ) {
    deleteInsAnalytics(input: $input, condition: $condition) {
      id
      analytics
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
      type
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
      type
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
      type
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
