/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateGoal = /* GraphQL */ `
  subscription OnCreateGoal($owner: String!) {
    onCreateGoal(owner: $owner) {
      id
      sy
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
        year
        val
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
      aiper
      aisy
      dr
      sa
      pg {
        year
        val
      }
      pl {
        year
        val
      }
      ra
      rachg
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
        year
        val
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
      aiper
      aisy
      dr
      sa
      pg {
        year
        val
      }
      pl {
        year
        val
      }
      ra
      rachg
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
        year
        val
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
      aiper
      aisy
      dr
      sa
      pg {
        year
        val
      }
      pl {
        year
        val
      }
      ra
      rachg
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
        year
        val
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
        tdli
        tbr
        name
        type
        ccy
        cp
        chg
        achg
        tgts {
          year
          val
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
        aiper
        aisy
        dr
        sa
        pg {
          year
          val
        }
        pl {
          year
          val
        }
        ra
        rachg
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
        year
        val
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
        tdli
        tbr
        name
        type
        ccy
        cp
        chg
        achg
        tgts {
          year
          val
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
        aiper
        aisy
        dr
        sa
        pg {
          year
          val
        }
        pl {
          year
          val
        }
        ra
        rachg
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
        year
        val
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
        tdli
        tbr
        name
        type
        ccy
        cp
        chg
        achg
        tgts {
          year
          val
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
        aiper
        aisy
        dr
        sa
        pg {
          year
          val
        }
        pl {
          year
          val
        }
        ra
        rachg
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
export const onCreateRegistration = /* GraphQL */ `
  subscription OnCreateRegistration {
    onCreateRegistration {
      email
      status
      code
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
      createdAt
      updatedAt
    }
  }
`;
