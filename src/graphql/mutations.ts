/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createGoal = /* GraphQL */ `
  mutation CreateGoal(
    $input: CreateGoalInput!
    $condition: ModelGoalConditionInput
  ) {
    createGoal(input: $input, condition: $condition) {
      id
      sy
      ey
      by
      btr
      tdr
      tdl
      tbi
      tbr
      name
      type
      ccy
      cp
      chg
      achg
      tgts {
        month
        year
        val
        met
        prob
      }
      emi {
        per
        rate
        dur
        ry
      }
      imp
      met
      prob
      manual
      amper
      amsy
      dr
      sa
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
      ey
      by
      btr
      tdr
      tdl
      tbi
      tbr
      name
      type
      ccy
      cp
      chg
      achg
      tgts {
        month
        year
        val
        met
        prob
      }
      emi {
        per
        rate
        dur
        ry
      }
      imp
      met
      prob
      manual
      amper
      amsy
      dr
      sa
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
      ey
      by
      btr
      tdr
      tdl
      tbi
      tbr
      name
      type
      ccy
      cp
      chg
      achg
      tgts {
        month
        year
        val
        met
        prob
      }
      emi {
        per
        rate
        dur
        ry
      }
      imp
      met
      prob
      manual
      amper
      amsy
      dr
      sa
      createdAt
      updatedAt
      owner
    }
  }
`;
export const createMilestone = /* GraphQL */ `
  mutation CreateMilestone(
    $input: CreateMilestoneInput!
    $condition: ModelMilestoneConditionInput
  ) {
    createMilestone(input: $input, condition: $condition) {
      id
      tgt {
        month
        year
        val
        met
        prob
      }
      attr
      goals {
        id
        sy
        ey
        by
        btr
        tdr
        tdl
        tbi
        tbr
        name
        type
        ccy
        cp
        chg
        achg
        tgts {
          month
          year
          val
          met
          prob
        }
        emi {
          per
          rate
          dur
          ry
        }
        imp
        met
        prob
        manual
        amper
        amsy
        dr
        sa
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
export const updateMilestone = /* GraphQL */ `
  mutation UpdateMilestone(
    $input: UpdateMilestoneInput!
    $condition: ModelMilestoneConditionInput
  ) {
    updateMilestone(input: $input, condition: $condition) {
      id
      tgt {
        month
        year
        val
        met
        prob
      }
      attr
      goals {
        id
        sy
        ey
        by
        btr
        tdr
        tdl
        tbi
        tbr
        name
        type
        ccy
        cp
        chg
        achg
        tgts {
          month
          year
          val
          met
          prob
        }
        emi {
          per
          rate
          dur
          ry
        }
        imp
        met
        prob
        manual
        amper
        amsy
        dr
        sa
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
export const deleteMilestone = /* GraphQL */ `
  mutation DeleteMilestone(
    $input: DeleteMilestoneInput!
    $condition: ModelMilestoneConditionInput
  ) {
    deleteMilestone(input: $input, condition: $condition) {
      id
      tgt {
        month
        year
        val
        met
        prob
      }
      attr
      goals {
        id
        sy
        ey
        by
        btr
        tdr
        tdl
        tbi
        tbr
        name
        type
        ccy
        cp
        chg
        achg
        tgts {
          month
          year
          val
          met
          prob
        }
        emi {
          per
          rate
          dur
          ry
        }
        imp
        met
        prob
        manual
        amper
        amsy
        dr
        sa
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
export const createProfile = /* GraphQL */ `
  mutation CreateProfile(
    $input: CreateProfileInput!
    $condition: ModelProfileConditionInput
  ) {
    createProfile(input: $input, condition: $condition) {
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
export const updateProfile = /* GraphQL */ `
  mutation UpdateProfile(
    $input: UpdateProfileInput!
    $condition: ModelProfileConditionInput
  ) {
    updateProfile(input: $input, condition: $condition) {
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
export const deleteProfile = /* GraphQL */ `
  mutation DeleteProfile(
    $input: DeleteProfileInput!
    $condition: ModelProfileConditionInput
  ) {
    deleteProfile(input: $input, condition: $condition) {
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
