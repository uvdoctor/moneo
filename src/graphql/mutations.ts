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
      uname
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
      uname
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
      ta
      tid
      exp
      invest
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
      ta
      tid
      exp
      invest
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
      ta
      tid
      exp
      invest
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
export const deleteCoachingReq = /* GraphQL */ `
  mutation DeleteCoachingReq(
    $input: DeleteCoachingReqInput!
    $condition: ModelCoachingReqConditionInput
  ) {
    deleteCoachingReq(input: $input, condition: $condition) {
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
      uname
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
export const createINExchgFun = /* GraphQL */ `
  mutation CreateINExchgFun(
    $input: CreateINExchgFunInput!
    $condition: ModelINExchgFunConditionInput
  ) {
    createINExchgFun(input: $input, condition: $condition) {
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
export const updateINExchgFun = /* GraphQL */ `
  mutation UpdateINExchgFun(
    $input: UpdateINExchgFunInput!
    $condition: ModelINExchgFunConditionInput
  ) {
    updateINExchgFun(input: $input, condition: $condition) {
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
export const deleteINExchgFun = /* GraphQL */ `
  mutation DeleteINExchgFun(
    $input: DeleteINExchgFunInput!
    $condition: ModelINExchgFunConditionInput
  ) {
    deleteINExchgFun(input: $input, condition: $condition) {
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
export const createINExchgPrice = /* GraphQL */ `
  mutation CreateINExchgPrice(
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
export const updateINExchgPrice = /* GraphQL */ `
  mutation UpdateINExchgPrice(
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
export const deleteINExchgPrice = /* GraphQL */ `
  mutation DeleteINExchgPrice(
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
export const createInsHistPerf = /* GraphQL */ `
  mutation CreateInsHistPerf(
    $input: CreateInsHistPerfInput!
    $condition: ModelInsHistPerfConditionInput
  ) {
    createInsHistPerf(input: $input, condition: $condition) {
      id
      p1y
      p3y
      p5y
      createdAt
      updatedAt
    }
  }
`;
export const updateInsHistPerf = /* GraphQL */ `
  mutation UpdateInsHistPerf(
    $input: UpdateInsHistPerfInput!
    $condition: ModelInsHistPerfConditionInput
  ) {
    updateInsHistPerf(input: $input, condition: $condition) {
      id
      p1y
      p3y
      p5y
      createdAt
      updatedAt
    }
  }
`;
export const deleteInsHistPerf = /* GraphQL */ `
  mutation DeleteInsHistPerf(
    $input: DeleteInsHistPerfInput!
    $condition: ModelInsHistPerfConditionInput
  ) {
    deleteInsHistPerf(input: $input, condition: $condition) {
      id
      p1y
      p3y
      p5y
      createdAt
      updatedAt
    }
  }
`;
export const createIndiceHistPerf = /* GraphQL */ `
  mutation CreateIndiceHistPerf(
    $input: CreateIndiceHistPerfInput!
    $condition: ModelIndiceHistPerfConditionInput
  ) {
    createIndiceHistPerf(input: $input, condition: $condition) {
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
export const updateIndiceHistPerf = /* GraphQL */ `
  mutation UpdateIndiceHistPerf(
    $input: UpdateIndiceHistPerfInput!
    $condition: ModelIndiceHistPerfConditionInput
  ) {
    updateIndiceHistPerf(input: $input, condition: $condition) {
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
export const deleteIndiceHistPerf = /* GraphQL */ `
  mutation DeleteIndiceHistPerf(
    $input: DeleteIndiceHistPerfInput!
    $condition: ModelIndiceHistPerfConditionInput
  ) {
    deleteIndiceHistPerf(input: $input, condition: $condition) {
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
export const createIndexConst = /* GraphQL */ `
  mutation CreateIndexConst(
    $input: CreateIndexConstInput!
    $condition: ModelIndexConstConditionInput
  ) {
    createIndexConst(input: $input, condition: $condition) {
      name
      const
      createdAt
      updatedAt
    }
  }
`;
export const updateIndexConst = /* GraphQL */ `
  mutation UpdateIndexConst(
    $input: UpdateIndexConstInput!
    $condition: ModelIndexConstConditionInput
  ) {
    updateIndexConst(input: $input, condition: $condition) {
      name
      const
      createdAt
      updatedAt
    }
  }
`;
export const deleteIndexConst = /* GraphQL */ `
  mutation DeleteIndexConst(
    $input: DeleteIndexConstInput!
    $condition: ModelIndexConstConditionInput
  ) {
    deleteIndexConst(input: $input, condition: $condition) {
      name
      const
      createdAt
      updatedAt
    }
  }
`;
export const createINBondPrice = /* GraphQL */ `
  mutation CreateINBondPrice(
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
export const updateINBondPrice = /* GraphQL */ `
  mutation UpdateINBondPrice(
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
export const deleteINBondPrice = /* GraphQL */ `
  mutation DeleteINBondPrice(
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
export const createINMFPrice = /* GraphQL */ `
  mutation CreateINMFPrice(
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
export const updateINMFPrice = /* GraphQL */ `
  mutation UpdateINMFPrice(
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
export const deleteINMFPrice = /* GraphQL */ `
  mutation DeleteINMFPrice(
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
export const createNPSPrice = /* GraphQL */ `
  mutation CreateNPSPrice(
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
      prev
      risk
      createdAt
      updatedAt
    }
  }
`;
export const updateNPSPrice = /* GraphQL */ `
  mutation UpdateNPSPrice(
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
      prev
      risk
      createdAt
      updatedAt
    }
  }
`;
export const deleteNPSPrice = /* GraphQL */ `
  mutation DeleteNPSPrice(
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
      prev
      risk
      createdAt
      updatedAt
    }
  }
`;
export const createCoachingReq = /* GraphQL */ `
  mutation CreateCoachingReq(
    $input: CreateCoachingReqInput!
    $condition: ModelCoachingReqConditionInput
  ) {
    createCoachingReq(input: $input, condition: $condition) {
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
export const updateCoachingReq = /* GraphQL */ `
  mutation UpdateCoachingReq(
    $input: UpdateCoachingReqInput!
    $condition: ModelCoachingReqConditionInput
  ) {
    updateCoachingReq(input: $input, condition: $condition) {
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
