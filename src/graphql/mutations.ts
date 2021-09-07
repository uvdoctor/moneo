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
export const deleteRegistration = /* GraphQL */ `
  mutation DeleteRegistration(
    $input: DeleteRegistrationInput!
    $condition: ModelRegistrationConditionInput
  ) {
    deleteRegistration(input: $input, condition: $condition) {
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
      vpf {
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
      mem {
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
      angel {
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
      other {
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
      vpf {
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
      mem {
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
      angel {
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
      other {
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
      vpf {
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
      mem {
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
      angel {
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
      other {
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
export const createRegistration = /* GraphQL */ `
  mutation CreateRegistration(
    $input: CreateRegistrationInput!
    $condition: ModelRegistrationConditionInput
  ) {
    createRegistration(input: $input, condition: $condition) {
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
export const updateRegistration = /* GraphQL */ `
  mutation UpdateRegistration(
    $input: UpdateRegistrationInput!
    $condition: ModelRegistrationConditionInput
  ) {
    updateRegistration(input: $input, condition: $condition) {
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
      mcap
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
      mcap
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
      mcap
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
