/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateGoalInput = {
  id?: string | null,
  sy: number,
  ey: number,
  by: number,
  btr: number,
  tdr: number,
  tdl: number,
  tbi?: number | null,
  tbr?: number | null,
  name: string,
  type: GoalType,
  ccy: string,
  cp?: number | null,
  chg?: number | null,
  achg?: number | null,
  tgts?: Array< TargetInput > | null,
  emi?: EmiInput | null,
  imp: LMH,
  ra: LMH,
  met?: YN | null,
  prob?: LMH | null,
  manual?: number | null,
  amper?: number | null,
  amsy?: number | null,
  dr?: number | null,
  sa?: number | null,
};

export enum GoalType {
  B = "B",
  R = "R",
  L = "L",
  X = "X",
  C = "C",
  F = "F",
  FF = "FF",
  D = "D",
  O = "O",
}


export type TargetInput = {
  month?: number | null,
  year: number,
  val: number,
  curr: string,
  fx: number,
  met?: YN | null,
  prob?: LMH | null,
};

export enum YN {
  Y = "Y",
  N = "N",
}


export enum LMH {
  L = "L",
  M = "M",
  H = "H",
}


export type EmiInput = {
  per: number,
  rate: number,
  dur: number,
  ry: number,
};

export type ModelGoalConditionInput = {
  sy?: ModelIntInput | null,
  ey?: ModelIntInput | null,
  by?: ModelIntInput | null,
  btr?: ModelFloatInput | null,
  tdr?: ModelIntInput | null,
  tdl?: ModelIntInput | null,
  tbi?: ModelIntInput | null,
  tbr?: ModelIntInput | null,
  name?: ModelStringInput | null,
  type?: ModelGoalTypeInput | null,
  ccy?: ModelStringInput | null,
  cp?: ModelIntInput | null,
  chg?: ModelFloatInput | null,
  achg?: ModelFloatInput | null,
  imp?: ModelLMHInput | null,
  ra?: ModelLMHInput | null,
  met?: ModelYNInput | null,
  prob?: ModelLMHInput | null,
  manual?: ModelIntInput | null,
  amper?: ModelFloatInput | null,
  amsy?: ModelIntInput | null,
  dr?: ModelFloatInput | null,
  sa?: ModelIntInput | null,
  and?: Array< ModelGoalConditionInput | null > | null,
  or?: Array< ModelGoalConditionInput | null > | null,
  not?: ModelGoalConditionInput | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelGoalTypeInput = {
  eq?: GoalType | null,
  ne?: GoalType | null,
};

export type ModelLMHInput = {
  eq?: LMH | null,
  ne?: LMH | null,
};

export type ModelYNInput = {
  eq?: YN | null,
  ne?: YN | null,
};

export type UpdateGoalInput = {
  id: string,
  sy?: number | null,
  ey?: number | null,
  by?: number | null,
  btr?: number | null,
  tdr?: number | null,
  tdl?: number | null,
  tbi?: number | null,
  tbr?: number | null,
  name?: string | null,
  type?: GoalType | null,
  ccy?: string | null,
  cp?: number | null,
  chg?: number | null,
  achg?: number | null,
  tgts?: Array< TargetInput > | null,
  emi?: EmiInput | null,
  imp?: LMH | null,
  ra?: LMH | null,
  met?: YN | null,
  prob?: LMH | null,
  manual?: number | null,
  amper?: number | null,
  amsy?: number | null,
  dr?: number | null,
  sa?: number | null,
};

export type DeleteGoalInput = {
  id?: string | null,
};

export type CreateMilestoneInput = {
  id?: string | null,
  tgt: TargetInput,
  attr: MilestoneAttr,
};

export enum MilestoneAttr {
  NW = "NW",
  D = "D",
  AS = "AS",
  C = "C",
  R = "R",
}


export type ModelMilestoneConditionInput = {
  attr?: ModelMilestoneAttrInput | null,
  and?: Array< ModelMilestoneConditionInput | null > | null,
  or?: Array< ModelMilestoneConditionInput | null > | null,
  not?: ModelMilestoneConditionInput | null,
};

export type ModelMilestoneAttrInput = {
  eq?: MilestoneAttr | null,
  ne?: MilestoneAttr | null,
};

export type UpdateMilestoneInput = {
  id: string,
  tgt?: TargetInput | null,
  attr?: MilestoneAttr | null,
};

export type DeleteMilestoneInput = {
  id?: string | null,
};

export type CreateProfileInput = {
  id?: string | null,
  citizen: string,
  tr: string,
  itr: number,
  cgtr: number,
  curr: string,
};

export type ModelProfileConditionInput = {
  citizen?: ModelStringInput | null,
  tr?: ModelStringInput | null,
  itr?: ModelIntInput | null,
  cgtr?: ModelIntInput | null,
  curr?: ModelStringInput | null,
  and?: Array< ModelProfileConditionInput | null > | null,
  or?: Array< ModelProfileConditionInput | null > | null,
  not?: ModelProfileConditionInput | null,
};

export type UpdateProfileInput = {
  id: string,
  citizen?: string | null,
  tr?: string | null,
  itr?: number | null,
  cgtr?: number | null,
  curr?: string | null,
};

export type DeleteProfileInput = {
  id?: string | null,
};

export type ModelGoalFilterInput = {
  id?: ModelIDInput | null,
  sy?: ModelIntInput | null,
  ey?: ModelIntInput | null,
  by?: ModelIntInput | null,
  btr?: ModelFloatInput | null,
  tdr?: ModelIntInput | null,
  tdl?: ModelIntInput | null,
  tbi?: ModelIntInput | null,
  tbr?: ModelIntInput | null,
  name?: ModelStringInput | null,
  type?: ModelGoalTypeInput | null,
  ccy?: ModelStringInput | null,
  cp?: ModelIntInput | null,
  chg?: ModelFloatInput | null,
  achg?: ModelFloatInput | null,
  imp?: ModelLMHInput | null,
  ra?: ModelLMHInput | null,
  met?: ModelYNInput | null,
  prob?: ModelLMHInput | null,
  manual?: ModelIntInput | null,
  amper?: ModelFloatInput | null,
  amsy?: ModelIntInput | null,
  dr?: ModelFloatInput | null,
  sa?: ModelIntInput | null,
  and?: Array< ModelGoalFilterInput | null > | null,
  or?: Array< ModelGoalFilterInput | null > | null,
  not?: ModelGoalFilterInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelMilestoneFilterInput = {
  id?: ModelIDInput | null,
  attr?: ModelMilestoneAttrInput | null,
  and?: Array< ModelMilestoneFilterInput | null > | null,
  or?: Array< ModelMilestoneFilterInput | null > | null,
  not?: ModelMilestoneFilterInput | null,
};

export type ModelProfileFilterInput = {
  id?: ModelIDInput | null,
  citizen?: ModelStringInput | null,
  tr?: ModelStringInput | null,
  itr?: ModelIntInput | null,
  cgtr?: ModelIntInput | null,
  curr?: ModelStringInput | null,
  and?: Array< ModelProfileFilterInput | null > | null,
  or?: Array< ModelProfileFilterInput | null > | null,
  not?: ModelProfileFilterInput | null,
};

export type CreateGoalMutationVariables = {
  input: CreateGoalInput,
  condition?: ModelGoalConditionInput | null,
};

export type CreateGoalMutation = {
  createGoal:  {
    __typename: "Goal",
    id: string,
    sy: number,
    ey: number,
    by: number,
    btr: number,
    tdr: number,
    tdl: number,
    tbi: number | null,
    tbr: number | null,
    name: string,
    type: GoalType,
    ccy: string,
    cp: number | null,
    chg: number | null,
    achg: number | null,
    tgts:  Array< {
      __typename: "Target",
      month: number | null,
      year: number,
      val: number,
      curr: string,
      fx: number,
      met: YN | null,
      prob: LMH | null,
    } > | null,
    emi:  {
      __typename: "Emi",
      per: number,
      rate: number,
      dur: number,
      ry: number,
    } | null,
    imp: LMH,
    ra: LMH,
    met: YN | null,
    prob: LMH | null,
    manual: number | null,
    amper: number | null,
    amsy: number | null,
    dr: number | null,
    sa: number | null,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type UpdateGoalMutationVariables = {
  input: UpdateGoalInput,
  condition?: ModelGoalConditionInput | null,
};

export type UpdateGoalMutation = {
  updateGoal:  {
    __typename: "Goal",
    id: string,
    sy: number,
    ey: number,
    by: number,
    btr: number,
    tdr: number,
    tdl: number,
    tbi: number | null,
    tbr: number | null,
    name: string,
    type: GoalType,
    ccy: string,
    cp: number | null,
    chg: number | null,
    achg: number | null,
    tgts:  Array< {
      __typename: "Target",
      month: number | null,
      year: number,
      val: number,
      curr: string,
      fx: number,
      met: YN | null,
      prob: LMH | null,
    } > | null,
    emi:  {
      __typename: "Emi",
      per: number,
      rate: number,
      dur: number,
      ry: number,
    } | null,
    imp: LMH,
    ra: LMH,
    met: YN | null,
    prob: LMH | null,
    manual: number | null,
    amper: number | null,
    amsy: number | null,
    dr: number | null,
    sa: number | null,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type DeleteGoalMutationVariables = {
  input: DeleteGoalInput,
  condition?: ModelGoalConditionInput | null,
};

export type DeleteGoalMutation = {
  deleteGoal:  {
    __typename: "Goal",
    id: string,
    sy: number,
    ey: number,
    by: number,
    btr: number,
    tdr: number,
    tdl: number,
    tbi: number | null,
    tbr: number | null,
    name: string,
    type: GoalType,
    ccy: string,
    cp: number | null,
    chg: number | null,
    achg: number | null,
    tgts:  Array< {
      __typename: "Target",
      month: number | null,
      year: number,
      val: number,
      curr: string,
      fx: number,
      met: YN | null,
      prob: LMH | null,
    } > | null,
    emi:  {
      __typename: "Emi",
      per: number,
      rate: number,
      dur: number,
      ry: number,
    } | null,
    imp: LMH,
    ra: LMH,
    met: YN | null,
    prob: LMH | null,
    manual: number | null,
    amper: number | null,
    amsy: number | null,
    dr: number | null,
    sa: number | null,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type CreateMilestoneMutationVariables = {
  input: CreateMilestoneInput,
  condition?: ModelMilestoneConditionInput | null,
};

export type CreateMilestoneMutation = {
  createMilestone:  {
    __typename: "Milestone",
    id: string,
    tgt:  {
      __typename: "Target",
      month: number | null,
      year: number,
      val: number,
      curr: string,
      fx: number,
      met: YN | null,
      prob: LMH | null,
    },
    attr: MilestoneAttr,
    goals:  Array< {
      __typename: "Goal",
      id: string,
      sy: number,
      ey: number,
      by: number,
      btr: number,
      tdr: number,
      tdl: number,
      tbi: number | null,
      tbr: number | null,
      name: string,
      type: GoalType,
      ccy: string,
      cp: number | null,
      chg: number | null,
      achg: number | null,
      tgts:  Array< {
        __typename: "Target",
        month: number | null,
        year: number,
        val: number,
        curr: string,
        fx: number,
        met: YN | null,
        prob: LMH | null,
      } > | null,
      emi:  {
        __typename: "Emi",
        per: number,
        rate: number,
        dur: number,
        ry: number,
      } | null,
      imp: LMH,
      ra: LMH,
      met: YN | null,
      prob: LMH | null,
      manual: number | null,
      amper: number | null,
      amsy: number | null,
      dr: number | null,
      sa: number | null,
      createdAt: string,
      updatedAt: string,
      owner: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type UpdateMilestoneMutationVariables = {
  input: UpdateMilestoneInput,
  condition?: ModelMilestoneConditionInput | null,
};

export type UpdateMilestoneMutation = {
  updateMilestone:  {
    __typename: "Milestone",
    id: string,
    tgt:  {
      __typename: "Target",
      month: number | null,
      year: number,
      val: number,
      curr: string,
      fx: number,
      met: YN | null,
      prob: LMH | null,
    },
    attr: MilestoneAttr,
    goals:  Array< {
      __typename: "Goal",
      id: string,
      sy: number,
      ey: number,
      by: number,
      btr: number,
      tdr: number,
      tdl: number,
      tbi: number | null,
      tbr: number | null,
      name: string,
      type: GoalType,
      ccy: string,
      cp: number | null,
      chg: number | null,
      achg: number | null,
      tgts:  Array< {
        __typename: "Target",
        month: number | null,
        year: number,
        val: number,
        curr: string,
        fx: number,
        met: YN | null,
        prob: LMH | null,
      } > | null,
      emi:  {
        __typename: "Emi",
        per: number,
        rate: number,
        dur: number,
        ry: number,
      } | null,
      imp: LMH,
      ra: LMH,
      met: YN | null,
      prob: LMH | null,
      manual: number | null,
      amper: number | null,
      amsy: number | null,
      dr: number | null,
      sa: number | null,
      createdAt: string,
      updatedAt: string,
      owner: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type DeleteMilestoneMutationVariables = {
  input: DeleteMilestoneInput,
  condition?: ModelMilestoneConditionInput | null,
};

export type DeleteMilestoneMutation = {
  deleteMilestone:  {
    __typename: "Milestone",
    id: string,
    tgt:  {
      __typename: "Target",
      month: number | null,
      year: number,
      val: number,
      curr: string,
      fx: number,
      met: YN | null,
      prob: LMH | null,
    },
    attr: MilestoneAttr,
    goals:  Array< {
      __typename: "Goal",
      id: string,
      sy: number,
      ey: number,
      by: number,
      btr: number,
      tdr: number,
      tdl: number,
      tbi: number | null,
      tbr: number | null,
      name: string,
      type: GoalType,
      ccy: string,
      cp: number | null,
      chg: number | null,
      achg: number | null,
      tgts:  Array< {
        __typename: "Target",
        month: number | null,
        year: number,
        val: number,
        curr: string,
        fx: number,
        met: YN | null,
        prob: LMH | null,
      } > | null,
      emi:  {
        __typename: "Emi",
        per: number,
        rate: number,
        dur: number,
        ry: number,
      } | null,
      imp: LMH,
      ra: LMH,
      met: YN | null,
      prob: LMH | null,
      manual: number | null,
      amper: number | null,
      amsy: number | null,
      dr: number | null,
      sa: number | null,
      createdAt: string,
      updatedAt: string,
      owner: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type CreateProfileMutationVariables = {
  input: CreateProfileInput,
  condition?: ModelProfileConditionInput | null,
};

export type CreateProfileMutation = {
  createProfile:  {
    __typename: "Profile",
    id: string,
    citizen: string,
    tr: string,
    itr: number,
    cgtr: number,
    curr: string,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type UpdateProfileMutationVariables = {
  input: UpdateProfileInput,
  condition?: ModelProfileConditionInput | null,
};

export type UpdateProfileMutation = {
  updateProfile:  {
    __typename: "Profile",
    id: string,
    citizen: string,
    tr: string,
    itr: number,
    cgtr: number,
    curr: string,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type DeleteProfileMutationVariables = {
  input: DeleteProfileInput,
  condition?: ModelProfileConditionInput | null,
};

export type DeleteProfileMutation = {
  deleteProfile:  {
    __typename: "Profile",
    id: string,
    citizen: string,
    tr: string,
    itr: number,
    cgtr: number,
    curr: string,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type GetGoalQueryVariables = {
  id: string,
};

export type GetGoalQuery = {
  getGoal:  {
    __typename: "Goal",
    id: string,
    sy: number,
    ey: number,
    by: number,
    btr: number,
    tdr: number,
    tdl: number,
    tbi: number | null,
    tbr: number | null,
    name: string,
    type: GoalType,
    ccy: string,
    cp: number | null,
    chg: number | null,
    achg: number | null,
    tgts:  Array< {
      __typename: "Target",
      month: number | null,
      year: number,
      val: number,
      curr: string,
      fx: number,
      met: YN | null,
      prob: LMH | null,
    } > | null,
    emi:  {
      __typename: "Emi",
      per: number,
      rate: number,
      dur: number,
      ry: number,
    } | null,
    imp: LMH,
    ra: LMH,
    met: YN | null,
    prob: LMH | null,
    manual: number | null,
    amper: number | null,
    amsy: number | null,
    dr: number | null,
    sa: number | null,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type ListGoalsQueryVariables = {
  filter?: ModelGoalFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListGoalsQuery = {
  listGoals:  {
    __typename: "ModelGoalConnection",
    items:  Array< {
      __typename: "Goal",
      id: string,
      sy: number,
      ey: number,
      by: number,
      btr: number,
      tdr: number,
      tdl: number,
      tbi: number | null,
      tbr: number | null,
      name: string,
      type: GoalType,
      ccy: string,
      cp: number | null,
      chg: number | null,
      achg: number | null,
      tgts:  Array< {
        __typename: "Target",
        month: number | null,
        year: number,
        val: number,
        curr: string,
        fx: number,
        met: YN | null,
        prob: LMH | null,
      } > | null,
      emi:  {
        __typename: "Emi",
        per: number,
        rate: number,
        dur: number,
        ry: number,
      } | null,
      imp: LMH,
      ra: LMH,
      met: YN | null,
      prob: LMH | null,
      manual: number | null,
      amper: number | null,
      amsy: number | null,
      dr: number | null,
      sa: number | null,
      createdAt: string,
      updatedAt: string,
      owner: string | null,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetMilestoneQueryVariables = {
  id: string,
};

export type GetMilestoneQuery = {
  getMilestone:  {
    __typename: "Milestone",
    id: string,
    tgt:  {
      __typename: "Target",
      month: number | null,
      year: number,
      val: number,
      curr: string,
      fx: number,
      met: YN | null,
      prob: LMH | null,
    },
    attr: MilestoneAttr,
    goals:  Array< {
      __typename: "Goal",
      id: string,
      sy: number,
      ey: number,
      by: number,
      btr: number,
      tdr: number,
      tdl: number,
      tbi: number | null,
      tbr: number | null,
      name: string,
      type: GoalType,
      ccy: string,
      cp: number | null,
      chg: number | null,
      achg: number | null,
      tgts:  Array< {
        __typename: "Target",
        month: number | null,
        year: number,
        val: number,
        curr: string,
        fx: number,
        met: YN | null,
        prob: LMH | null,
      } > | null,
      emi:  {
        __typename: "Emi",
        per: number,
        rate: number,
        dur: number,
        ry: number,
      } | null,
      imp: LMH,
      ra: LMH,
      met: YN | null,
      prob: LMH | null,
      manual: number | null,
      amper: number | null,
      amsy: number | null,
      dr: number | null,
      sa: number | null,
      createdAt: string,
      updatedAt: string,
      owner: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type ListMilestonesQueryVariables = {
  filter?: ModelMilestoneFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListMilestonesQuery = {
  listMilestones:  {
    __typename: "ModelMilestoneConnection",
    items:  Array< {
      __typename: "Milestone",
      id: string,
      tgt:  {
        __typename: "Target",
        month: number | null,
        year: number,
        val: number,
        curr: string,
        fx: number,
        met: YN | null,
        prob: LMH | null,
      },
      attr: MilestoneAttr,
      goals:  Array< {
        __typename: "Goal",
        id: string,
        sy: number,
        ey: number,
        by: number,
        btr: number,
        tdr: number,
        tdl: number,
        tbi: number | null,
        tbr: number | null,
        name: string,
        type: GoalType,
        ccy: string,
        cp: number | null,
        chg: number | null,
        achg: number | null,
        imp: LMH,
        ra: LMH,
        met: YN | null,
        prob: LMH | null,
        manual: number | null,
        amper: number | null,
        amsy: number | null,
        dr: number | null,
        sa: number | null,
        createdAt: string,
        updatedAt: string,
        owner: string | null,
      } | null > | null,
      createdAt: string,
      updatedAt: string,
      owner: string | null,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetProfileQueryVariables = {
  id: string,
};

export type GetProfileQuery = {
  getProfile:  {
    __typename: "Profile",
    id: string,
    citizen: string,
    tr: string,
    itr: number,
    cgtr: number,
    curr: string,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type ListProfilesQueryVariables = {
  filter?: ModelProfileFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListProfilesQuery = {
  listProfiles:  {
    __typename: "ModelProfileConnection",
    items:  Array< {
      __typename: "Profile",
      id: string,
      citizen: string,
      tr: string,
      itr: number,
      cgtr: number,
      curr: string,
      createdAt: string,
      updatedAt: string,
      owner: string | null,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type OnCreateGoalSubscriptionVariables = {
  owner: string,
};

export type OnCreateGoalSubscription = {
  onCreateGoal:  {
    __typename: "Goal",
    id: string,
    sy: number,
    ey: number,
    by: number,
    btr: number,
    tdr: number,
    tdl: number,
    tbi: number | null,
    tbr: number | null,
    name: string,
    type: GoalType,
    ccy: string,
    cp: number | null,
    chg: number | null,
    achg: number | null,
    tgts:  Array< {
      __typename: "Target",
      month: number | null,
      year: number,
      val: number,
      curr: string,
      fx: number,
      met: YN | null,
      prob: LMH | null,
    } > | null,
    emi:  {
      __typename: "Emi",
      per: number,
      rate: number,
      dur: number,
      ry: number,
    } | null,
    imp: LMH,
    ra: LMH,
    met: YN | null,
    prob: LMH | null,
    manual: number | null,
    amper: number | null,
    amsy: number | null,
    dr: number | null,
    sa: number | null,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type OnUpdateGoalSubscriptionVariables = {
  owner: string,
};

export type OnUpdateGoalSubscription = {
  onUpdateGoal:  {
    __typename: "Goal",
    id: string,
    sy: number,
    ey: number,
    by: number,
    btr: number,
    tdr: number,
    tdl: number,
    tbi: number | null,
    tbr: number | null,
    name: string,
    type: GoalType,
    ccy: string,
    cp: number | null,
    chg: number | null,
    achg: number | null,
    tgts:  Array< {
      __typename: "Target",
      month: number | null,
      year: number,
      val: number,
      curr: string,
      fx: number,
      met: YN | null,
      prob: LMH | null,
    } > | null,
    emi:  {
      __typename: "Emi",
      per: number,
      rate: number,
      dur: number,
      ry: number,
    } | null,
    imp: LMH,
    ra: LMH,
    met: YN | null,
    prob: LMH | null,
    manual: number | null,
    amper: number | null,
    amsy: number | null,
    dr: number | null,
    sa: number | null,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type OnDeleteGoalSubscriptionVariables = {
  owner: string,
};

export type OnDeleteGoalSubscription = {
  onDeleteGoal:  {
    __typename: "Goal",
    id: string,
    sy: number,
    ey: number,
    by: number,
    btr: number,
    tdr: number,
    tdl: number,
    tbi: number | null,
    tbr: number | null,
    name: string,
    type: GoalType,
    ccy: string,
    cp: number | null,
    chg: number | null,
    achg: number | null,
    tgts:  Array< {
      __typename: "Target",
      month: number | null,
      year: number,
      val: number,
      curr: string,
      fx: number,
      met: YN | null,
      prob: LMH | null,
    } > | null,
    emi:  {
      __typename: "Emi",
      per: number,
      rate: number,
      dur: number,
      ry: number,
    } | null,
    imp: LMH,
    ra: LMH,
    met: YN | null,
    prob: LMH | null,
    manual: number | null,
    amper: number | null,
    amsy: number | null,
    dr: number | null,
    sa: number | null,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type OnCreateMilestoneSubscriptionVariables = {
  owner: string,
};

export type OnCreateMilestoneSubscription = {
  onCreateMilestone:  {
    __typename: "Milestone",
    id: string,
    tgt:  {
      __typename: "Target",
      month: number | null,
      year: number,
      val: number,
      curr: string,
      fx: number,
      met: YN | null,
      prob: LMH | null,
    },
    attr: MilestoneAttr,
    goals:  Array< {
      __typename: "Goal",
      id: string,
      sy: number,
      ey: number,
      by: number,
      btr: number,
      tdr: number,
      tdl: number,
      tbi: number | null,
      tbr: number | null,
      name: string,
      type: GoalType,
      ccy: string,
      cp: number | null,
      chg: number | null,
      achg: number | null,
      tgts:  Array< {
        __typename: "Target",
        month: number | null,
        year: number,
        val: number,
        curr: string,
        fx: number,
        met: YN | null,
        prob: LMH | null,
      } > | null,
      emi:  {
        __typename: "Emi",
        per: number,
        rate: number,
        dur: number,
        ry: number,
      } | null,
      imp: LMH,
      ra: LMH,
      met: YN | null,
      prob: LMH | null,
      manual: number | null,
      amper: number | null,
      amsy: number | null,
      dr: number | null,
      sa: number | null,
      createdAt: string,
      updatedAt: string,
      owner: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type OnUpdateMilestoneSubscriptionVariables = {
  owner: string,
};

export type OnUpdateMilestoneSubscription = {
  onUpdateMilestone:  {
    __typename: "Milestone",
    id: string,
    tgt:  {
      __typename: "Target",
      month: number | null,
      year: number,
      val: number,
      curr: string,
      fx: number,
      met: YN | null,
      prob: LMH | null,
    },
    attr: MilestoneAttr,
    goals:  Array< {
      __typename: "Goal",
      id: string,
      sy: number,
      ey: number,
      by: number,
      btr: number,
      tdr: number,
      tdl: number,
      tbi: number | null,
      tbr: number | null,
      name: string,
      type: GoalType,
      ccy: string,
      cp: number | null,
      chg: number | null,
      achg: number | null,
      tgts:  Array< {
        __typename: "Target",
        month: number | null,
        year: number,
        val: number,
        curr: string,
        fx: number,
        met: YN | null,
        prob: LMH | null,
      } > | null,
      emi:  {
        __typename: "Emi",
        per: number,
        rate: number,
        dur: number,
        ry: number,
      } | null,
      imp: LMH,
      ra: LMH,
      met: YN | null,
      prob: LMH | null,
      manual: number | null,
      amper: number | null,
      amsy: number | null,
      dr: number | null,
      sa: number | null,
      createdAt: string,
      updatedAt: string,
      owner: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type OnDeleteMilestoneSubscriptionVariables = {
  owner: string,
};

export type OnDeleteMilestoneSubscription = {
  onDeleteMilestone:  {
    __typename: "Milestone",
    id: string,
    tgt:  {
      __typename: "Target",
      month: number | null,
      year: number,
      val: number,
      curr: string,
      fx: number,
      met: YN | null,
      prob: LMH | null,
    },
    attr: MilestoneAttr,
    goals:  Array< {
      __typename: "Goal",
      id: string,
      sy: number,
      ey: number,
      by: number,
      btr: number,
      tdr: number,
      tdl: number,
      tbi: number | null,
      tbr: number | null,
      name: string,
      type: GoalType,
      ccy: string,
      cp: number | null,
      chg: number | null,
      achg: number | null,
      tgts:  Array< {
        __typename: "Target",
        month: number | null,
        year: number,
        val: number,
        curr: string,
        fx: number,
        met: YN | null,
        prob: LMH | null,
      } > | null,
      emi:  {
        __typename: "Emi",
        per: number,
        rate: number,
        dur: number,
        ry: number,
      } | null,
      imp: LMH,
      ra: LMH,
      met: YN | null,
      prob: LMH | null,
      manual: number | null,
      amper: number | null,
      amsy: number | null,
      dr: number | null,
      sa: number | null,
      createdAt: string,
      updatedAt: string,
      owner: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type OnCreateProfileSubscriptionVariables = {
  owner: string,
};

export type OnCreateProfileSubscription = {
  onCreateProfile:  {
    __typename: "Profile",
    id: string,
    citizen: string,
    tr: string,
    itr: number,
    cgtr: number,
    curr: string,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type OnUpdateProfileSubscriptionVariables = {
  owner: string,
};

export type OnUpdateProfileSubscription = {
  onUpdateProfile:  {
    __typename: "Profile",
    id: string,
    citizen: string,
    tr: string,
    itr: number,
    cgtr: number,
    curr: string,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type OnDeleteProfileSubscriptionVariables = {
  owner: string,
};

export type OnDeleteProfileSubscription = {
  onDeleteProfile:  {
    __typename: "Profile",
    id: string,
    citizen: string,
    tr: string,
    itr: number,
    cgtr: number,
    curr: string,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};
