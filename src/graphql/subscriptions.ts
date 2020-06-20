/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateGoal = /* GraphQL */ `
  subscription OnCreateGoal($owner: String!) {
    onCreateGoal(owner: $owner) {
      id
      sy
      ey
      btr
      str
      tdr
      tdl
      name
      type
      ccy
      cp
      chg
      tgts {
        month
        year
        val
        curr
        fx
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
      ra
      met
      prob
      manual
      amper
      amsy
      dr
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
      ey
      btr
      str
      tdr
      tdl
      name
      type
      ccy
      cp
      chg
      tgts {
        month
        year
        val
        curr
        fx
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
      ra
      met
      prob
      manual
      amper
      amsy
      dr
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
      ey
      btr
      str
      tdr
      tdl
      name
      type
      ccy
      cp
      chg
      tgts {
        month
        year
        val
        curr
        fx
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
      ra
      met
      prob
      manual
      amper
      amsy
      dr
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
        month
        year
        val
        curr
        fx
        met
        prob
      }
      attr
      goals {
        id
        sy
        ey
        btr
        str
        tdr
        tdl
        name
        type
        ccy
        cp
        chg
        tgts {
          month
          year
          val
          curr
          fx
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
        ra
        met
        prob
        manual
        amper
        amsy
        dr
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
        month
        year
        val
        curr
        fx
        met
        prob
      }
      attr
      goals {
        id
        sy
        ey
        btr
        str
        tdr
        tdl
        name
        type
        ccy
        cp
        chg
        tgts {
          month
          year
          val
          curr
          fx
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
        ra
        met
        prob
        manual
        amper
        amsy
        dr
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
        month
        year
        val
        curr
        fx
        met
        prob
      }
      attr
      goals {
        id
        sy
        ey
        btr
        str
        tdr
        tdl
        name
        type
        ccy
        cp
        chg
        tgts {
          month
          year
          val
          curr
          fx
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
        ra
        met
        prob
        manual
        amper
        amsy
        dr
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
