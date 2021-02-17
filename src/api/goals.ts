/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type DeleteFeedbackInput = {
  id?: string | null,
};

export type ModelFeedbackConditionInput = {
  type?: ModelFeedbackTypeInput | null,
  email?: ModelStringInput | null,
  feedback?: ModelStringInput | null,
  and?: Array< ModelFeedbackConditionInput | null > | null,
  or?: Array< ModelFeedbackConditionInput | null > | null,
  not?: ModelFeedbackConditionInput | null,
};

export type ModelFeedbackTypeInput = {
  eq?: FeedbackType | null,
  ne?: FeedbackType | null,
};

export enum FeedbackType {
  C = "C",
  S = "S",
  Q = "Q",
}


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


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type DeleteRatingInput = {
  id?: string | null,
};

export type ModelRatingConditionInput = {
  type?: ModelCalcTypeInput | null,
  rating?: ModelIntInput | null,
  feedbackId?: ModelStringInput | null,
  and?: Array< ModelRatingConditionInput | null > | null,
  or?: Array< ModelRatingConditionInput | null > | null,
  not?: ModelRatingConditionInput | null,
};

export type ModelCalcTypeInput = {
  eq?: CalcType | null,
  ne?: CalcType | null,
};

export enum CalcType {
  BR = "BR",
  FI = "FI",
  LOAN = "LOAN",
  EDU_LOAN = "EDU_LOAN",
  DR = "DR",
  TC = "TC",
}


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

export type CreateGoalInput = {
  id?: string | null,
  sy: number,
  sm?: number | null,
  ey: number,
  by: number,
  btr?: number | null,
  tdr: number,
  tdl: number,
  tbi?: number | null,
  tdli?: number | null,
  tbr?: number | null,
  name: string,
  type: GoalType,
  ccy: string,
  cp?: number | null,
  chg?: number | null,
  achg?: number | null,
  tgts?: Array< TargetInput > | null,
  loan?: LoanInput | null,
  imp: LMH,
  met?: YN | null,
  prob?: LMH | null,
  manual: number,
  amper?: number | null,
  amsy?: number | null,
  aiper?: number | null,
  aisy?: number | null,
  dr?: number | null,
  sa?: number | null,
  pg?: Array< TargetInput | null > | null,
  pl?: Array< TargetInput | null > | null,
  ra?: number | null,
  rachg?: number | null,
};

export enum GoalType {
  B = "B",
  S = "S",
  R = "R",
  E = "E",
  X = "X",
  C = "C",
  FF = "FF",
  D = "D",
  O = "O",
  T = "T",
}


export type TargetInput = {
  num: number,
  val: number,
};

export type LoanInput = {
  type: LoanType,
  per: number,
  rate?: number | null,
  dur: number,
  ry: number,
  pp?: Array< TargetInput > | null,
  ira?: Array< TargetInput > | null,
  emi?: number | null,
  pmi?: number | null,
  peper?: number | null,
};

export enum LoanType {
  A = "A",
  B = "B",
}


export enum LMH {
  L = "L",
  M = "M",
  H = "H",
}


export enum YN {
  Y = "Y",
  N = "N",
}


export type ModelGoalConditionInput = {
  sy?: ModelIntInput | null,
  sm?: ModelIntInput | null,
  ey?: ModelIntInput | null,
  by?: ModelIntInput | null,
  btr?: ModelFloatInput | null,
  tdr?: ModelFloatInput | null,
  tdl?: ModelIntInput | null,
  tbi?: ModelIntInput | null,
  tdli?: ModelIntInput | null,
  tbr?: ModelFloatInput | null,
  name?: ModelStringInput | null,
  type?: ModelGoalTypeInput | null,
  ccy?: ModelStringInput | null,
  cp?: ModelIntInput | null,
  chg?: ModelFloatInput | null,
  achg?: ModelFloatInput | null,
  imp?: ModelLMHInput | null,
  met?: ModelYNInput | null,
  prob?: ModelLMHInput | null,
  manual?: ModelIntInput | null,
  amper?: ModelFloatInput | null,
  amsy?: ModelIntInput | null,
  aiper?: ModelFloatInput | null,
  aisy?: ModelIntInput | null,
  dr?: ModelFloatInput | null,
  sa?: ModelIntInput | null,
  ra?: ModelIntInput | null,
  rachg?: ModelFloatInput | null,
  and?: Array< ModelGoalConditionInput | null > | null,
  or?: Array< ModelGoalConditionInput | null > | null,
  not?: ModelGoalConditionInput | null,
};

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
  sm?: number | null,
  ey?: number | null,
  by?: number | null,
  btr?: number | null,
  tdr?: number | null,
  tdl?: number | null,
  tbi?: number | null,
  tdli?: number | null,
  tbr?: number | null,
  name?: string | null,
  type?: GoalType | null,
  ccy?: string | null,
  cp?: number | null,
  chg?: number | null,
  achg?: number | null,
  tgts?: Array< TargetInput > | null,
  loan?: LoanInput | null,
  imp?: LMH | null,
  met?: YN | null,
  prob?: LMH | null,
  manual?: number | null,
  amper?: number | null,
  amsy?: number | null,
  aiper?: number | null,
  aisy?: number | null,
  dr?: number | null,
  sa?: number | null,
  pg?: Array< TargetInput | null > | null,
  pl?: Array< TargetInput | null > | null,
  ra?: number | null,
  rachg?: number | null,
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

export type CreateItemInput = {
  id?: string | null,
  p_at: string,
  p_id: string,
  p_instid: string,
  instname: string,
  status: string,
};

export type ModelItemConditionInput = {
  p_at?: ModelStringInput | null,
  p_id?: ModelStringInput | null,
  p_instid?: ModelStringInput | null,
  instname?: ModelStringInput | null,
  status?: ModelStringInput | null,
  and?: Array< ModelItemConditionInput | null > | null,
  or?: Array< ModelItemConditionInput | null > | null,
  not?: ModelItemConditionInput | null,
};

export type UpdateItemInput = {
  id: string,
  p_at?: string | null,
  p_id?: string | null,
  p_instid?: string | null,
  instname?: string | null,
  status?: string | null,
};

export type DeleteItemInput = {
  id?: string | null,
};

export type CreateAccountInput = {
  id?: string | null,
  p_id: string,
  name: string,
  mask: string,
  offname: string,
  currbal: number,
  availbal: number,
  curr: string,
  uncurr?: string | null,
  type: string,
  subtype: string,
};

export type ModelAccountConditionInput = {
  p_id?: ModelStringInput | null,
  name?: ModelStringInput | null,
  mask?: ModelStringInput | null,
  offname?: ModelStringInput | null,
  currbal?: ModelIntInput | null,
  availbal?: ModelIntInput | null,
  curr?: ModelStringInput | null,
  uncurr?: ModelStringInput | null,
  type?: ModelStringInput | null,
  subtype?: ModelStringInput | null,
  and?: Array< ModelAccountConditionInput | null > | null,
  or?: Array< ModelAccountConditionInput | null > | null,
  not?: ModelAccountConditionInput | null,
};

export type UpdateAccountInput = {
  id: string,
  p_id?: string | null,
  name?: string | null,
  mask?: string | null,
  offname?: string | null,
  currbal?: number | null,
  availbal?: number | null,
  curr?: string | null,
  uncurr?: string | null,
  type?: string | null,
  subtype?: string | null,
};

export type DeleteAccountInput = {
  id?: string | null,
};

export type DeleteRegistrationInput = {
  email: string,
};

export type ModelRegistrationConditionInput = {
  status?: ModelStatusInput | null,
  code?: ModelStringInput | null,
  country?: ModelStringInput | null,
  lat?: ModelFloatInput | null,
  long?: ModelFloatInput | null,
  and?: Array< ModelRegistrationConditionInput | null > | null,
  or?: Array< ModelRegistrationConditionInput | null > | null,
  not?: ModelRegistrationConditionInput | null,
};

export type ModelStatusInput = {
  eq?: Status | null,
  ne?: Status | null,
};

export enum Status {
  Y = "Y",
  N = "N",
  P = "P",
}


export type CreateFeedbackInput = {
  id?: string | null,
  type: FeedbackType,
  email: string,
  name: NameInput,
  feedback: string,
};

export type NameInput = {
  fn: string,
  ln?: string | null,
};

export type UpdateFeedbackInput = {
  id: string,
  type?: FeedbackType | null,
  email?: string | null,
  name?: NameInput | null,
  feedback?: string | null,
};

export type CreateRatingInput = {
  id?: string | null,
  type: CalcType,
  rating: number,
  feedbackId?: string | null,
};

export type UpdateRatingInput = {
  id: string,
  type?: CalcType | null,
  rating?: number | null,
  feedbackId?: string | null,
};

export type CreateRegistrationInput = {
  email: string,
  status: Status,
  code: string,
  country: string,
  lat?: number | null,
  long?: number | null,
};

export type UpdateRegistrationInput = {
  email: string,
  status?: Status | null,
  code?: string | null,
  country?: string | null,
  lat?: number | null,
  long?: number | null,
};

export type ModelGoalFilterInput = {
  id?: ModelIDInput | null,
  sy?: ModelIntInput | null,
  sm?: ModelIntInput | null,
  ey?: ModelIntInput | null,
  by?: ModelIntInput | null,
  btr?: ModelFloatInput | null,
  tdr?: ModelFloatInput | null,
  tdl?: ModelIntInput | null,
  tbi?: ModelIntInput | null,
  tdli?: ModelIntInput | null,
  tbr?: ModelFloatInput | null,
  name?: ModelStringInput | null,
  type?: ModelGoalTypeInput | null,
  ccy?: ModelStringInput | null,
  cp?: ModelIntInput | null,
  chg?: ModelFloatInput | null,
  achg?: ModelFloatInput | null,
  imp?: ModelLMHInput | null,
  met?: ModelYNInput | null,
  prob?: ModelLMHInput | null,
  manual?: ModelIntInput | null,
  amper?: ModelFloatInput | null,
  amsy?: ModelIntInput | null,
  aiper?: ModelFloatInput | null,
  aisy?: ModelIntInput | null,
  dr?: ModelFloatInput | null,
  sa?: ModelIntInput | null,
  ra?: ModelIntInput | null,
  rachg?: ModelFloatInput | null,
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

export type ModelItemFilterInput = {
  id?: ModelIDInput | null,
  p_at?: ModelStringInput | null,
  p_id?: ModelStringInput | null,
  p_instid?: ModelStringInput | null,
  instname?: ModelStringInput | null,
  status?: ModelStringInput | null,
  and?: Array< ModelItemFilterInput | null > | null,
  or?: Array< ModelItemFilterInput | null > | null,
  not?: ModelItemFilterInput | null,
};

export type ModelAccountFilterInput = {
  id?: ModelIDInput | null,
  p_id?: ModelStringInput | null,
  name?: ModelStringInput | null,
  mask?: ModelStringInput | null,
  offname?: ModelStringInput | null,
  currbal?: ModelIntInput | null,
  availbal?: ModelIntInput | null,
  curr?: ModelStringInput | null,
  uncurr?: ModelStringInput | null,
  type?: ModelStringInput | null,
  subtype?: ModelStringInput | null,
  and?: Array< ModelAccountFilterInput | null > | null,
  or?: Array< ModelAccountFilterInput | null > | null,
  not?: ModelAccountFilterInput | null,
};

export type ModelFeedbackFilterInput = {
  id?: ModelIDInput | null,
  type?: ModelFeedbackTypeInput | null,
  email?: ModelStringInput | null,
  feedback?: ModelStringInput | null,
  and?: Array< ModelFeedbackFilterInput | null > | null,
  or?: Array< ModelFeedbackFilterInput | null > | null,
  not?: ModelFeedbackFilterInput | null,
};

export type ModelRatingFilterInput = {
  id?: ModelIDInput | null,
  type?: ModelCalcTypeInput | null,
  rating?: ModelIntInput | null,
  feedbackId?: ModelStringInput | null,
  and?: Array< ModelRatingFilterInput | null > | null,
  or?: Array< ModelRatingFilterInput | null > | null,
  not?: ModelRatingFilterInput | null,
};

export type ModelRegistrationFilterInput = {
  email?: ModelStringInput | null,
  status?: ModelStatusInput | null,
  code?: ModelStringInput | null,
  country?: ModelStringInput | null,
  lat?: ModelFloatInput | null,
  long?: ModelFloatInput | null,
  and?: Array< ModelRegistrationFilterInput | null > | null,
  or?: Array< ModelRegistrationFilterInput | null > | null,
  not?: ModelRegistrationFilterInput | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type DeleteFeedbackMutationVariables = {
  input: DeleteFeedbackInput,
  condition?: ModelFeedbackConditionInput | null,
};

export type DeleteFeedbackMutation = {
  deleteFeedback:  {
    __typename: "Feedback",
    id: string,
    type: FeedbackType,
    email: string,
    name:  {
      __typename: "Name",
      fn: string,
      ln: string | null,
    },
    feedback: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteRatingMutationVariables = {
  input: DeleteRatingInput,
  condition?: ModelRatingConditionInput | null,
};

export type DeleteRatingMutation = {
  deleteRating:  {
    __typename: "Rating",
    id: string,
    type: CalcType,
    rating: number,
    feedbackId: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
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
    sm: number | null,
    ey: number,
    by: number,
    btr: number | null,
    tdr: number,
    tdl: number,
    tbi: number | null,
    tdli: number | null,
    tbr: number | null,
    name: string,
    type: GoalType,
    ccy: string,
    cp: number | null,
    chg: number | null,
    achg: number | null,
    tgts:  Array< {
      __typename: "Target",
      num: number,
      val: number,
    } > | null,
    loan:  {
      __typename: "Loan",
      type: LoanType,
      per: number,
      rate: number | null,
      dur: number,
      ry: number,
      pp:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      ira:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      emi: number | null,
      pmi: number | null,
      peper: number | null,
    } | null,
    imp: LMH,
    met: YN | null,
    prob: LMH | null,
    manual: number,
    amper: number | null,
    amsy: number | null,
    aiper: number | null,
    aisy: number | null,
    dr: number | null,
    sa: number | null,
    pg:  Array< {
      __typename: "Target",
      num: number,
      val: number,
    } | null > | null,
    pl:  Array< {
      __typename: "Target",
      num: number,
      val: number,
    } | null > | null,
    ra: number | null,
    rachg: number | null,
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
    sm: number | null,
    ey: number,
    by: number,
    btr: number | null,
    tdr: number,
    tdl: number,
    tbi: number | null,
    tdli: number | null,
    tbr: number | null,
    name: string,
    type: GoalType,
    ccy: string,
    cp: number | null,
    chg: number | null,
    achg: number | null,
    tgts:  Array< {
      __typename: "Target",
      num: number,
      val: number,
    } > | null,
    loan:  {
      __typename: "Loan",
      type: LoanType,
      per: number,
      rate: number | null,
      dur: number,
      ry: number,
      pp:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      ira:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      emi: number | null,
      pmi: number | null,
      peper: number | null,
    } | null,
    imp: LMH,
    met: YN | null,
    prob: LMH | null,
    manual: number,
    amper: number | null,
    amsy: number | null,
    aiper: number | null,
    aisy: number | null,
    dr: number | null,
    sa: number | null,
    pg:  Array< {
      __typename: "Target",
      num: number,
      val: number,
    } | null > | null,
    pl:  Array< {
      __typename: "Target",
      num: number,
      val: number,
    } | null > | null,
    ra: number | null,
    rachg: number | null,
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
    sm: number | null,
    ey: number,
    by: number,
    btr: number | null,
    tdr: number,
    tdl: number,
    tbi: number | null,
    tdli: number | null,
    tbr: number | null,
    name: string,
    type: GoalType,
    ccy: string,
    cp: number | null,
    chg: number | null,
    achg: number | null,
    tgts:  Array< {
      __typename: "Target",
      num: number,
      val: number,
    } > | null,
    loan:  {
      __typename: "Loan",
      type: LoanType,
      per: number,
      rate: number | null,
      dur: number,
      ry: number,
      pp:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      ira:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      emi: number | null,
      pmi: number | null,
      peper: number | null,
    } | null,
    imp: LMH,
    met: YN | null,
    prob: LMH | null,
    manual: number,
    amper: number | null,
    amsy: number | null,
    aiper: number | null,
    aisy: number | null,
    dr: number | null,
    sa: number | null,
    pg:  Array< {
      __typename: "Target",
      num: number,
      val: number,
    } | null > | null,
    pl:  Array< {
      __typename: "Target",
      num: number,
      val: number,
    } | null > | null,
    ra: number | null,
    rachg: number | null,
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
      num: number,
      val: number,
    },
    attr: MilestoneAttr,
    goals:  Array< {
      __typename: "Goal",
      id: string,
      sy: number,
      sm: number | null,
      ey: number,
      by: number,
      btr: number | null,
      tdr: number,
      tdl: number,
      tbi: number | null,
      tdli: number | null,
      tbr: number | null,
      name: string,
      type: GoalType,
      ccy: string,
      cp: number | null,
      chg: number | null,
      achg: number | null,
      tgts:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      loan:  {
        __typename: "Loan",
        type: LoanType,
        per: number,
        rate: number | null,
        dur: number,
        ry: number,
        emi: number | null,
        pmi: number | null,
        peper: number | null,
      } | null,
      imp: LMH,
      met: YN | null,
      prob: LMH | null,
      manual: number,
      amper: number | null,
      amsy: number | null,
      aiper: number | null,
      aisy: number | null,
      dr: number | null,
      sa: number | null,
      pg:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } | null > | null,
      pl:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } | null > | null,
      ra: number | null,
      rachg: number | null,
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
      num: number,
      val: number,
    },
    attr: MilestoneAttr,
    goals:  Array< {
      __typename: "Goal",
      id: string,
      sy: number,
      sm: number | null,
      ey: number,
      by: number,
      btr: number | null,
      tdr: number,
      tdl: number,
      tbi: number | null,
      tdli: number | null,
      tbr: number | null,
      name: string,
      type: GoalType,
      ccy: string,
      cp: number | null,
      chg: number | null,
      achg: number | null,
      tgts:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      loan:  {
        __typename: "Loan",
        type: LoanType,
        per: number,
        rate: number | null,
        dur: number,
        ry: number,
        emi: number | null,
        pmi: number | null,
        peper: number | null,
      } | null,
      imp: LMH,
      met: YN | null,
      prob: LMH | null,
      manual: number,
      amper: number | null,
      amsy: number | null,
      aiper: number | null,
      aisy: number | null,
      dr: number | null,
      sa: number | null,
      pg:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } | null > | null,
      pl:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } | null > | null,
      ra: number | null,
      rachg: number | null,
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
      num: number,
      val: number,
    },
    attr: MilestoneAttr,
    goals:  Array< {
      __typename: "Goal",
      id: string,
      sy: number,
      sm: number | null,
      ey: number,
      by: number,
      btr: number | null,
      tdr: number,
      tdl: number,
      tbi: number | null,
      tdli: number | null,
      tbr: number | null,
      name: string,
      type: GoalType,
      ccy: string,
      cp: number | null,
      chg: number | null,
      achg: number | null,
      tgts:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      loan:  {
        __typename: "Loan",
        type: LoanType,
        per: number,
        rate: number | null,
        dur: number,
        ry: number,
        emi: number | null,
        pmi: number | null,
        peper: number | null,
      } | null,
      imp: LMH,
      met: YN | null,
      prob: LMH | null,
      manual: number,
      amper: number | null,
      amsy: number | null,
      aiper: number | null,
      aisy: number | null,
      dr: number | null,
      sa: number | null,
      pg:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } | null > | null,
      pl:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } | null > | null,
      ra: number | null,
      rachg: number | null,
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

export type CreateItemMutationVariables = {
  input: CreateItemInput,
  condition?: ModelItemConditionInput | null,
};

export type CreateItemMutation = {
  createItem:  {
    __typename: "Item",
    id: string,
    p_at: string,
    p_id: string,
    p_instid: string,
    instname: string,
    status: string,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type UpdateItemMutationVariables = {
  input: UpdateItemInput,
  condition?: ModelItemConditionInput | null,
};

export type UpdateItemMutation = {
  updateItem:  {
    __typename: "Item",
    id: string,
    p_at: string,
    p_id: string,
    p_instid: string,
    instname: string,
    status: string,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type DeleteItemMutationVariables = {
  input: DeleteItemInput,
  condition?: ModelItemConditionInput | null,
};

export type DeleteItemMutation = {
  deleteItem:  {
    __typename: "Item",
    id: string,
    p_at: string,
    p_id: string,
    p_instid: string,
    instname: string,
    status: string,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type CreateAccountMutationVariables = {
  input: CreateAccountInput,
  condition?: ModelAccountConditionInput | null,
};

export type CreateAccountMutation = {
  createAccount:  {
    __typename: "Account",
    id: string,
    item:  {
      __typename: "Item",
      id: string,
      p_at: string,
      p_id: string,
      p_instid: string,
      instname: string,
      status: string,
      createdAt: string,
      updatedAt: string,
      owner: string | null,
    } | null,
    p_id: string,
    name: string,
    mask: string,
    offname: string,
    currbal: number,
    availbal: number,
    curr: string,
    uncurr: string | null,
    type: string,
    subtype: string,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type UpdateAccountMutationVariables = {
  input: UpdateAccountInput,
  condition?: ModelAccountConditionInput | null,
};

export type UpdateAccountMutation = {
  updateAccount:  {
    __typename: "Account",
    id: string,
    item:  {
      __typename: "Item",
      id: string,
      p_at: string,
      p_id: string,
      p_instid: string,
      instname: string,
      status: string,
      createdAt: string,
      updatedAt: string,
      owner: string | null,
    } | null,
    p_id: string,
    name: string,
    mask: string,
    offname: string,
    currbal: number,
    availbal: number,
    curr: string,
    uncurr: string | null,
    type: string,
    subtype: string,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type DeleteAccountMutationVariables = {
  input: DeleteAccountInput,
  condition?: ModelAccountConditionInput | null,
};

export type DeleteAccountMutation = {
  deleteAccount:  {
    __typename: "Account",
    id: string,
    item:  {
      __typename: "Item",
      id: string,
      p_at: string,
      p_id: string,
      p_instid: string,
      instname: string,
      status: string,
      createdAt: string,
      updatedAt: string,
      owner: string | null,
    } | null,
    p_id: string,
    name: string,
    mask: string,
    offname: string,
    currbal: number,
    availbal: number,
    curr: string,
    uncurr: string | null,
    type: string,
    subtype: string,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type DeleteRegistrationMutationVariables = {
  input: DeleteRegistrationInput,
  condition?: ModelRegistrationConditionInput | null,
};

export type DeleteRegistrationMutation = {
  deleteRegistration:  {
    __typename: "Registration",
    email: string,
    status: Status,
    code: string,
    country: string,
    lat: number | null,
    long: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateFeedbackMutationVariables = {
  input: CreateFeedbackInput,
  condition?: ModelFeedbackConditionInput | null,
};

export type CreateFeedbackMutation = {
  createFeedback:  {
    __typename: "Feedback",
    id: string,
    type: FeedbackType,
    email: string,
    name:  {
      __typename: "Name",
      fn: string,
      ln: string | null,
    },
    feedback: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateFeedbackMutationVariables = {
  input: UpdateFeedbackInput,
  condition?: ModelFeedbackConditionInput | null,
};

export type UpdateFeedbackMutation = {
  updateFeedback:  {
    __typename: "Feedback",
    id: string,
    type: FeedbackType,
    email: string,
    name:  {
      __typename: "Name",
      fn: string,
      ln: string | null,
    },
    feedback: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateRatingMutationVariables = {
  input: CreateRatingInput,
  condition?: ModelRatingConditionInput | null,
};

export type CreateRatingMutation = {
  createRating:  {
    __typename: "Rating",
    id: string,
    type: CalcType,
    rating: number,
    feedbackId: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateRatingMutationVariables = {
  input: UpdateRatingInput,
  condition?: ModelRatingConditionInput | null,
};

export type UpdateRatingMutation = {
  updateRating:  {
    __typename: "Rating",
    id: string,
    type: CalcType,
    rating: number,
    feedbackId: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateRegistrationMutationVariables = {
  input: CreateRegistrationInput,
  condition?: ModelRegistrationConditionInput | null,
};

export type CreateRegistrationMutation = {
  createRegistration:  {
    __typename: "Registration",
    email: string,
    status: Status,
    code: string,
    country: string,
    lat: number | null,
    long: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateRegistrationMutationVariables = {
  input: UpdateRegistrationInput,
  condition?: ModelRegistrationConditionInput | null,
};

export type UpdateRegistrationMutation = {
  updateRegistration:  {
    __typename: "Registration",
    email: string,
    status: Status,
    code: string,
    country: string,
    lat: number | null,
    long: number | null,
    createdAt: string,
    updatedAt: string,
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
    sm: number | null,
    ey: number,
    by: number,
    btr: number | null,
    tdr: number,
    tdl: number,
    tbi: number | null,
    tdli: number | null,
    tbr: number | null,
    name: string,
    type: GoalType,
    ccy: string,
    cp: number | null,
    chg: number | null,
    achg: number | null,
    tgts:  Array< {
      __typename: "Target",
      num: number,
      val: number,
    } > | null,
    loan:  {
      __typename: "Loan",
      type: LoanType,
      per: number,
      rate: number | null,
      dur: number,
      ry: number,
      pp:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      ira:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      emi: number | null,
      pmi: number | null,
      peper: number | null,
    } | null,
    imp: LMH,
    met: YN | null,
    prob: LMH | null,
    manual: number,
    amper: number | null,
    amsy: number | null,
    aiper: number | null,
    aisy: number | null,
    dr: number | null,
    sa: number | null,
    pg:  Array< {
      __typename: "Target",
      num: number,
      val: number,
    } | null > | null,
    pl:  Array< {
      __typename: "Target",
      num: number,
      val: number,
    } | null > | null,
    ra: number | null,
    rachg: number | null,
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
      sm: number | null,
      ey: number,
      by: number,
      btr: number | null,
      tdr: number,
      tdl: number,
      tbi: number | null,
      tdli: number | null,
      tbr: number | null,
      name: string,
      type: GoalType,
      ccy: string,
      cp: number | null,
      chg: number | null,
      achg: number | null,
      tgts:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      loan:  {
        __typename: "Loan",
        type: LoanType,
        per: number,
        rate: number | null,
        dur: number,
        ry: number,
        emi: number | null,
        pmi: number | null,
        peper: number | null,
        pp:  Array< {
          __typename: "Target",
          num: number,
          val: number,
        } > | null,
        ira:  Array< {
          __typename: "Target",
          num: number,
          val: number,
        } > | null
      } | null,
      imp: LMH,
      met: YN | null,
      prob: LMH | null,
      manual: number,
      amper: number | null,
      amsy: number | null,
      aiper: number | null,
      aisy: number | null,
      dr: number | null,
      sa: number | null,
      pg:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } | null > | null,
      pl:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } | null > | null,
      ra: number | null,
      rachg: number | null,
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
      num: number,
      val: number,
    },
    attr: MilestoneAttr,
    goals:  Array< {
      __typename: "Goal",
      id: string,
      sy: number,
      sm: number | null,
      ey: number,
      by: number,
      btr: number | null,
      tdr: number,
      tdl: number,
      tbi: number | null,
      tdli: number | null,
      tbr: number | null,
      name: string,
      type: GoalType,
      ccy: string,
      cp: number | null,
      chg: number | null,
      achg: number | null,
      tgts:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      loan:  {
        __typename: "Loan",
        type: LoanType,
        per: number,
        rate: number | null,
        dur: number,
        ry: number,
        emi: number | null,
        pmi: number | null,
        peper: number | null,
      } | null,
      imp: LMH,
      met: YN | null,
      prob: LMH | null,
      manual: number,
      amper: number | null,
      amsy: number | null,
      aiper: number | null,
      aisy: number | null,
      dr: number | null,
      sa: number | null,
      pg:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } | null > | null,
      pl:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } | null > | null,
      ra: number | null,
      rachg: number | null,
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
        num: number,
        val: number,
      },
      attr: MilestoneAttr,
      goals:  Array< {
        __typename: "Goal",
        id: string,
        sy: number,
        sm: number | null,
        ey: number,
        by: number,
        btr: number | null,
        tdr: number,
        tdl: number,
        tbi: number | null,
        tdli: number | null,
        tbr: number | null,
        name: string,
        type: GoalType,
        ccy: string,
        cp: number | null,
        chg: number | null,
        achg: number | null,
        imp: LMH,
        met: YN | null,
        prob: LMH | null,
        manual: number,
        amper: number | null,
        amsy: number | null,
        aiper: number | null,
        aisy: number | null,
        dr: number | null,
        sa: number | null,
        ra: number | null,
        rachg: number | null,
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

export type GetItemQueryVariables = {
  id: string,
};

export type GetItemQuery = {
  getItem:  {
    __typename: "Item",
    id: string,
    p_at: string,
    p_id: string,
    p_instid: string,
    instname: string,
    status: string,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type ListItemsQueryVariables = {
  filter?: ModelItemFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListItemsQuery = {
  listItems:  {
    __typename: "ModelItemConnection",
    items:  Array< {
      __typename: "Item",
      id: string,
      p_at: string,
      p_id: string,
      p_instid: string,
      instname: string,
      status: string,
      createdAt: string,
      updatedAt: string,
      owner: string | null,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetAccountQueryVariables = {
  id: string,
};

export type GetAccountQuery = {
  getAccount:  {
    __typename: "Account",
    id: string,
    item:  {
      __typename: "Item",
      id: string,
      p_at: string,
      p_id: string,
      p_instid: string,
      instname: string,
      status: string,
      createdAt: string,
      updatedAt: string,
      owner: string | null,
    } | null,
    p_id: string,
    name: string,
    mask: string,
    offname: string,
    currbal: number,
    availbal: number,
    curr: string,
    uncurr: string | null,
    type: string,
    subtype: string,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type ListAccountsQueryVariables = {
  filter?: ModelAccountFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAccountsQuery = {
  listAccounts:  {
    __typename: "ModelAccountConnection",
    items:  Array< {
      __typename: "Account",
      id: string,
      item:  {
        __typename: "Item",
        id: string,
        p_at: string,
        p_id: string,
        p_instid: string,
        instname: string,
        status: string,
        createdAt: string,
        updatedAt: string,
        owner: string | null,
      } | null,
      p_id: string,
      name: string,
      mask: string,
      offname: string,
      currbal: number,
      availbal: number,
      curr: string,
      uncurr: string | null,
      type: string,
      subtype: string,
      createdAt: string,
      updatedAt: string,
      owner: string | null,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetFeedbackQueryVariables = {
  id: string,
};

export type GetFeedbackQuery = {
  getFeedback:  {
    __typename: "Feedback",
    id: string,
    type: FeedbackType,
    email: string,
    name:  {
      __typename: "Name",
      fn: string,
      ln: string | null,
    },
    feedback: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListFeedbacksQueryVariables = {
  filter?: ModelFeedbackFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListFeedbacksQuery = {
  listFeedbacks:  {
    __typename: "ModelFeedbackConnection",
    items:  Array< {
      __typename: "Feedback",
      id: string,
      type: FeedbackType,
      email: string,
      name:  {
        __typename: "Name",
        fn: string,
        ln: string | null,
      },
      feedback: string,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetRatingQueryVariables = {
  id: string,
};

export type GetRatingQuery = {
  getRating:  {
    __typename: "Rating",
    id: string,
    type: CalcType,
    rating: number,
    feedbackId: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListRatingsQueryVariables = {
  filter?: ModelRatingFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListRatingsQuery = {
  listRatings:  {
    __typename: "ModelRatingConnection",
    items:  Array< {
      __typename: "Rating",
      id: string,
      type: CalcType,
      rating: number,
      feedbackId: string | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetRegistrationQueryVariables = {
  email: string,
};

export type GetRegistrationQuery = {
  getRegistration:  {
    __typename: "Registration",
    email: string,
    status: Status,
    code: string,
    country: string,
    lat: number | null,
    long: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListRegistrationsQueryVariables = {
  email?: string | null,
  filter?: ModelRegistrationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListRegistrationsQuery = {
  listRegistrations:  {
    __typename: "ModelRegistrationConnection",
    items:  Array< {
      __typename: "Registration",
      email: string,
      status: Status,
      code: string,
      country: string,
      lat: number | null,
      long: number | null,
      createdAt: string,
      updatedAt: string,
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
    sm: number | null,
    ey: number,
    by: number,
    btr: number | null,
    tdr: number,
    tdl: number,
    tbi: number | null,
    tdli: number | null,
    tbr: number | null,
    name: string,
    type: GoalType,
    ccy: string,
    cp: number | null,
    chg: number | null,
    achg: number | null,
    tgts:  Array< {
      __typename: "Target",
      num: number,
      val: number,
    } > | null,
    loan:  {
      __typename: "Loan",
      type: LoanType,
      per: number,
      rate: number | null,
      dur: number,
      ry: number,
      pp:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      ira:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      emi: number | null,
      pmi: number | null,
      peper: number | null,
    } | null,
    imp: LMH,
    met: YN | null,
    prob: LMH | null,
    manual: number,
    amper: number | null,
    amsy: number | null,
    aiper: number | null,
    aisy: number | null,
    dr: number | null,
    sa: number | null,
    pg:  Array< {
      __typename: "Target",
      num: number,
      val: number,
    } | null > | null,
    pl:  Array< {
      __typename: "Target",
      num: number,
      val: number,
    } | null > | null,
    ra: number | null,
    rachg: number | null,
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
    sm: number | null,
    ey: number,
    by: number,
    btr: number | null,
    tdr: number,
    tdl: number,
    tbi: number | null,
    tdli: number | null,
    tbr: number | null,
    name: string,
    type: GoalType,
    ccy: string,
    cp: number | null,
    chg: number | null,
    achg: number | null,
    tgts:  Array< {
      __typename: "Target",
      num: number,
      val: number,
    } > | null,
    loan:  {
      __typename: "Loan",
      type: LoanType,
      per: number,
      rate: number | null,
      dur: number,
      ry: number,
      pp:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      ira:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      emi: number | null,
      pmi: number | null,
      peper: number | null,
    } | null,
    imp: LMH,
    met: YN | null,
    prob: LMH | null,
    manual: number,
    amper: number | null,
    amsy: number | null,
    aiper: number | null,
    aisy: number | null,
    dr: number | null,
    sa: number | null,
    pg:  Array< {
      __typename: "Target",
      num: number,
      val: number,
    } | null > | null,
    pl:  Array< {
      __typename: "Target",
      num: number,
      val: number,
    } | null > | null,
    ra: number | null,
    rachg: number | null,
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
    sm: number | null,
    ey: number,
    by: number,
    btr: number | null,
    tdr: number,
    tdl: number,
    tbi: number | null,
    tdli: number | null,
    tbr: number | null,
    name: string,
    type: GoalType,
    ccy: string,
    cp: number | null,
    chg: number | null,
    achg: number | null,
    tgts:  Array< {
      __typename: "Target",
      num: number,
      val: number,
    } > | null,
    loan:  {
      __typename: "Loan",
      type: LoanType,
      per: number,
      rate: number | null,
      dur: number,
      ry: number,
      pp:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      ira:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      emi: number | null,
      pmi: number | null,
      peper: number | null,
    } | null,
    imp: LMH,
    met: YN | null,
    prob: LMH | null,
    manual: number,
    amper: number | null,
    amsy: number | null,
    aiper: number | null,
    aisy: number | null,
    dr: number | null,
    sa: number | null,
    pg:  Array< {
      __typename: "Target",
      num: number,
      val: number,
    } | null > | null,
    pl:  Array< {
      __typename: "Target",
      num: number,
      val: number,
    } | null > | null,
    ra: number | null,
    rachg: number | null,
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
      num: number,
      val: number,
    },
    attr: MilestoneAttr,
    goals:  Array< {
      __typename: "Goal",
      id: string,
      sy: number,
      sm: number | null,
      ey: number,
      by: number,
      btr: number | null,
      tdr: number,
      tdl: number,
      tbi: number | null,
      tdli: number | null,
      tbr: number | null,
      name: string,
      type: GoalType,
      ccy: string,
      cp: number | null,
      chg: number | null,
      achg: number | null,
      tgts:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      loan:  {
        __typename: "Loan",
        type: LoanType,
        per: number,
        rate: number | null,
        dur: number,
        ry: number,
        emi: number | null,
        pmi: number | null,
        peper: number | null,
      } | null,
      imp: LMH,
      met: YN | null,
      prob: LMH | null,
      manual: number,
      amper: number | null,
      amsy: number | null,
      aiper: number | null,
      aisy: number | null,
      dr: number | null,
      sa: number | null,
      pg:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } | null > | null,
      pl:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } | null > | null,
      ra: number | null,
      rachg: number | null,
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
      num: number,
      val: number,
    },
    attr: MilestoneAttr,
    goals:  Array< {
      __typename: "Goal",
      id: string,
      sy: number,
      sm: number | null,
      ey: number,
      by: number,
      btr: number | null,
      tdr: number,
      tdl: number,
      tbi: number | null,
      tdli: number | null,
      tbr: number | null,
      name: string,
      type: GoalType,
      ccy: string,
      cp: number | null,
      chg: number | null,
      achg: number | null,
      tgts:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      loan:  {
        __typename: "Loan",
        type: LoanType,
        per: number,
        rate: number | null,
        dur: number,
        ry: number,
        emi: number | null,
        pmi: number | null,
        peper: number | null,
      } | null,
      imp: LMH,
      met: YN | null,
      prob: LMH | null,
      manual: number,
      amper: number | null,
      amsy: number | null,
      aiper: number | null,
      aisy: number | null,
      dr: number | null,
      sa: number | null,
      pg:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } | null > | null,
      pl:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } | null > | null,
      ra: number | null,
      rachg: number | null,
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
      num: number,
      val: number,
    },
    attr: MilestoneAttr,
    goals:  Array< {
      __typename: "Goal",
      id: string,
      sy: number,
      sm: number | null,
      ey: number,
      by: number,
      btr: number | null,
      tdr: number,
      tdl: number,
      tbi: number | null,
      tdli: number | null,
      tbr: number | null,
      name: string,
      type: GoalType,
      ccy: string,
      cp: number | null,
      chg: number | null,
      achg: number | null,
      tgts:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      loan:  {
        __typename: "Loan",
        type: LoanType,
        per: number,
        rate: number | null,
        dur: number,
        ry: number,
        emi: number | null,
        pmi: number | null,
        peper: number | null,
      } | null,
      imp: LMH,
      met: YN | null,
      prob: LMH | null,
      manual: number,
      amper: number | null,
      amsy: number | null,
      aiper: number | null,
      aisy: number | null,
      dr: number | null,
      sa: number | null,
      pg:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } | null > | null,
      pl:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } | null > | null,
      ra: number | null,
      rachg: number | null,
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

export type OnCreateItemSubscriptionVariables = {
  owner: string,
};

export type OnCreateItemSubscription = {
  onCreateItem:  {
    __typename: "Item",
    id: string,
    p_at: string,
    p_id: string,
    p_instid: string,
    instname: string,
    status: string,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type OnUpdateItemSubscriptionVariables = {
  owner: string,
};

export type OnUpdateItemSubscription = {
  onUpdateItem:  {
    __typename: "Item",
    id: string,
    p_at: string,
    p_id: string,
    p_instid: string,
    instname: string,
    status: string,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type OnDeleteItemSubscriptionVariables = {
  owner: string,
};

export type OnDeleteItemSubscription = {
  onDeleteItem:  {
    __typename: "Item",
    id: string,
    p_at: string,
    p_id: string,
    p_instid: string,
    instname: string,
    status: string,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type OnCreateAccountSubscriptionVariables = {
  owner: string,
};

export type OnCreateAccountSubscription = {
  onCreateAccount:  {
    __typename: "Account",
    id: string,
    item:  {
      __typename: "Item",
      id: string,
      p_at: string,
      p_id: string,
      p_instid: string,
      instname: string,
      status: string,
      createdAt: string,
      updatedAt: string,
      owner: string | null,
    } | null,
    p_id: string,
    name: string,
    mask: string,
    offname: string,
    currbal: number,
    availbal: number,
    curr: string,
    uncurr: string | null,
    type: string,
    subtype: string,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type OnUpdateAccountSubscriptionVariables = {
  owner: string,
};

export type OnUpdateAccountSubscription = {
  onUpdateAccount:  {
    __typename: "Account",
    id: string,
    item:  {
      __typename: "Item",
      id: string,
      p_at: string,
      p_id: string,
      p_instid: string,
      instname: string,
      status: string,
      createdAt: string,
      updatedAt: string,
      owner: string | null,
    } | null,
    p_id: string,
    name: string,
    mask: string,
    offname: string,
    currbal: number,
    availbal: number,
    curr: string,
    uncurr: string | null,
    type: string,
    subtype: string,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type OnDeleteAccountSubscriptionVariables = {
  owner: string,
};

export type OnDeleteAccountSubscription = {
  onDeleteAccount:  {
    __typename: "Account",
    id: string,
    item:  {
      __typename: "Item",
      id: string,
      p_at: string,
      p_id: string,
      p_instid: string,
      instname: string,
      status: string,
      createdAt: string,
      updatedAt: string,
      owner: string | null,
    } | null,
    p_id: string,
    name: string,
    mask: string,
    offname: string,
    currbal: number,
    availbal: number,
    curr: string,
    uncurr: string | null,
    type: string,
    subtype: string,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type OnCreateFeedbackSubscription = {
  onCreateFeedback:  {
    __typename: "Feedback",
    id: string,
    type: FeedbackType,
    email: string,
    name:  {
      __typename: "Name",
      fn: string,
      ln: string | null,
    },
    feedback: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateFeedbackSubscription = {
  onUpdateFeedback:  {
    __typename: "Feedback",
    id: string,
    type: FeedbackType,
    email: string,
    name:  {
      __typename: "Name",
      fn: string,
      ln: string | null,
    },
    feedback: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteFeedbackSubscription = {
  onDeleteFeedback:  {
    __typename: "Feedback",
    id: string,
    type: FeedbackType,
    email: string,
    name:  {
      __typename: "Name",
      fn: string,
      ln: string | null,
    },
    feedback: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateRatingSubscription = {
  onCreateRating:  {
    __typename: "Rating",
    id: string,
    type: CalcType,
    rating: number,
    feedbackId: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateRatingSubscription = {
  onUpdateRating:  {
    __typename: "Rating",
    id: string,
    type: CalcType,
    rating: number,
    feedbackId: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteRatingSubscription = {
  onDeleteRating:  {
    __typename: "Rating",
    id: string,
    type: CalcType,
    rating: number,
    feedbackId: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateRegistrationSubscription = {
  onCreateRegistration:  {
    __typename: "Registration",
    email: string,
    status: Status,
    code: string,
    country: string,
    lat: number | null,
    long: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateRegistrationSubscription = {
  onUpdateRegistration:  {
    __typename: "Registration",
    email: string,
    status: Status,
    code: string,
    country: string,
    lat: number | null,
    long: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteRegistrationSubscription = {
  onDeleteRegistration:  {
    __typename: "Registration",
    email: string,
    status: Status,
    code: string,
    country: string,
    lat: number | null,
    long: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};
