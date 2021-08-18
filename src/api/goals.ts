/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateBatchInstrument = {
  id: string,
  sid?: string | null,
  name: string,
  exchg?: string | null,
  country: string,
  curr: string,
  type: InsType,
  subt: InsSubType,
  price: number,
  prev?: number | null,
  sm?: number | null,
  sy?: number | null,
  mm?: number | null,
  my?: number | null,
  rate?: number | null,
};

export enum InsType {
  E = "E",
  F = "F",
  A = "A",
  H = "H",
}


export enum InsSubType {
  S = "S",
  CB = "CB",
  GB = "GB",
  MB = "MB",
  ETF = "ETF",
  M = "M",
  GoldB = "GoldB",
  REIT = "REIT",
}


export type Instrument = {
  __typename: "Instrument",
  id?: string,
  sid?: string | null,
  name?: string,
  exchg?: string | null,
  country?: string,
  curr?: string,
  type?: InsType,
  subt?: InsSubType,
  price?: number,
  prev?: number | null,
  sm?: number | null,
  sy?: number | null,
  mm?: number | null,
  my?: number | null,
  rate?: number | null,
  createdAt?: string,
  updatedAt?: string,
};

export type DeleteFeedbackInput = {
  id: string,
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

export type Feedback = {
  __typename: "Feedback",
  id?: string,
  type?: FeedbackType,
  email?: string,
  name?: Name,
  feedback?: string,
  createdAt?: string,
  updatedAt?: string,
};

export type Name = {
  __typename: "Name",
  fn?: string,
  ln?: string | null,
};

export type DeleteRatingInput = {
  id: string,
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

export type Rating = {
  __typename: "Rating",
  id?: string,
  type?: CalcType,
  rating?: number,
  feedbackId?: string | null,
  createdAt?: string,
  updatedAt?: string,
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
  img?: string | null,
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
  img?: ModelStringInput | null,
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

export type Goal = {
  __typename: "Goal",
  id?: string,
  sy?: number,
  sm?: number | null,
  ey?: number,
  by?: number,
  btr?: number | null,
  tdr?: number,
  tdl?: number,
  tbi?: number | null,
  tdli?: number | null,
  tbr?: number | null,
  name?: string,
  type?: GoalType,
  ccy?: string,
  cp?: number | null,
  chg?: number | null,
  achg?: number | null,
  tgts?:  Array<Target > | null,
  loan?: Loan,
  imp?: LMH,
  met?: YN | null,
  prob?: LMH | null,
  manual?: number,
  amper?: number | null,
  amsy?: number | null,
  aiper?: number | null,
  aisy?: number | null,
  dr?: number | null,
  sa?: number | null,
  pg?:  Array<Target | null > | null,
  pl?:  Array<Target | null > | null,
  ra?: number | null,
  rachg?: number | null,
  img?: string | null,
  createdAt?: string,
  updatedAt?: string,
  owner?: string | null,
};

export type Target = {
  __typename: "Target",
  num?: number,
  val?: number,
};

export type Loan = {
  __typename: "Loan",
  type?: LoanType,
  per?: number,
  rate?: number | null,
  dur?: number,
  ry?: number,
  pp?:  Array<Target > | null,
  ira?:  Array<Target > | null,
  emi?: number | null,
  pmi?: number | null,
  peper?: number | null,
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
  img?: string | null,
};

export type DeleteGoalInput = {
  id: string,
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

export type Milestone = {
  __typename: "Milestone",
  id?: string,
  tgt?: Target,
  attr?: MilestoneAttr,
  goals?:  Array<Goal | null > | null,
  createdAt?: string,
  updatedAt?: string,
  owner?: string | null,
};

export type UpdateMilestoneInput = {
  id: string,
  tgt?: TargetInput | null,
  attr?: MilestoneAttr | null,
};

export type DeleteMilestoneInput = {
  id: string,
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

export type Profile = {
  __typename: "Profile",
  id?: string,
  citizen?: string,
  tr?: string,
  itr?: number,
  cgtr?: number,
  curr?: string,
  createdAt?: string,
  updatedAt?: string,
  owner?: string | null,
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
  id: string,
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

export type Item = {
  __typename: "Item",
  id?: string,
  p_at?: string,
  p_id?: string,
  p_instid?: string,
  instname?: string,
  status?: string,
  createdAt?: string,
  updatedAt?: string,
  owner?: string | null,
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
  id: string,
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

export type Account = {
  __typename: "Account",
  id?: string,
  item?: Item,
  p_id?: string,
  name?: string,
  mask?: string,
  offname?: string,
  currbal?: number,
  availbal?: number,
  curr?: string,
  uncurr?: string | null,
  type?: string,
  subtype?: string,
  createdAt?: string,
  updatedAt?: string,
  owner?: string | null,
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
  id: string,
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


export type Registration = {
  __typename: "Registration",
  email?: string,
  status?: Status,
  code?: string,
  country?: string,
  lat?: number | null,
  long?: number | null,
  createdAt?: string,
  updatedAt?: string,
};

export type CreateFamilyInput = {
  id?: string | null,
  tid: string,
  name: string,
};

export type ModelFamilyConditionInput = {
  tid?: ModelStringInput | null,
  name?: ModelStringInput | null,
  and?: Array< ModelFamilyConditionInput | null > | null,
  or?: Array< ModelFamilyConditionInput | null > | null,
  not?: ModelFamilyConditionInput | null,
};

export type Family = {
  __typename: "Family",
  id?: string,
  tid?: string,
  name?: string,
  createdAt?: string,
  updatedAt?: string,
  owner?: string | null,
};

export type UpdateFamilyInput = {
  id: string,
  tid?: string | null,
  name?: string | null,
};

export type DeleteFamilyInput = {
  id: string,
};

export type CreateHoldingsInput = {
  id?: string | null,
  instruments?: Array< HoldingInput > | null,
  deposits?: Array< DepositInput > | null,
  lendings?: Array< DepositInput > | null,
  loans?: Array< LiabilityInput > | null,
  savings?: Array< BalanceInput > | null,
  property?: Array< PropertyInput > | null,
  vehicles?: Array< HoldingInput > | null,
  pm?: Array< HoldingInput > | null,
  ppf?: Array< HoldingInput > | null,
  epf?: Array< HoldingInput > | null,
  nps?: Array< HoldingInput > | null,
  crypto?: Array< HoldingInput > | null,
  ins?: Array< InsuranceInput > | null,
};

export type HoldingInput = {
  id: string,
  qty: number,
  pur?: Array< PurchaseInput > | null,
  name?: string | null,
  fIds: Array< string >,
  curr?: string | null,
  chg?: number | null,
  type?: string | null,
  subt?: string | null,
};

export type PurchaseInput = {
  amt: number,
  date: number,
  qty: number,
};

export type DepositInput = {
  amt: number,
  start: number,
  end: number,
  rate: number,
  fIds: Array< string >,
  curr: string,
};

export type LiabilityInput = {
  loan?: LoanInput | null,
  fIds: Array< string >,
  curr: string,
};

export type BalanceInput = {
  amt: number,
  curr: string,
  name?: string | null,
};

export type PropertyInput = {
  type: PropertyType,
  pin: number,
  purchase?: PurchaseInput | null,
  address?: string | null,
  fIds: Array< string >,
  curr: string,
  country: string,
};

export enum PropertyType {
  P = "P",
  A = "A",
  H = "H",
  C = "C",
  O = "O",
  T = "T",
  OTHER = "OTHER",
}


export type InsuranceInput = {
  premium: number,
  years: number,
  fIds: Array< string >,
  curr: string,
};

export type ModelHoldingsConditionInput = {
  and?: Array< ModelHoldingsConditionInput | null > | null,
  or?: Array< ModelHoldingsConditionInput | null > | null,
  not?: ModelHoldingsConditionInput | null,
};

export type Holdings = {
  __typename: "Holdings",
  id?: string,
  instruments?:  Array<Holding > | null,
  deposits?:  Array<Deposit > | null,
  lendings?:  Array<Deposit > | null,
  loans?:  Array<Liability > | null,
  savings?:  Array<Balance > | null,
  property?:  Array<Property > | null,
  vehicles?:  Array<Holding > | null,
  pm?:  Array<Holding > | null,
  ppf?:  Array<Holding > | null,
  epf?:  Array<Holding > | null,
  nps?:  Array<Holding > | null,
  crypto?:  Array<Holding > | null,
  ins?:  Array<Insurance > | null,
  createdAt?: string,
  updatedAt?: string,
  owner?: string | null,
};

export type Holding = {
  __typename: "Holding",
  id?: string,
  qty?: number,
  pur?:  Array<Purchase > | null,
  name?: string | null,
  fIds?: Array< string >,
  curr?: string | null,
  chg?: number | null,
  type?: string | null,
  subt?: string | null,
};

export type Purchase = {
  __typename: "Purchase",
  amt?: number,
  date?: number,
  qty?: number,
};

export type Deposit = {
  __typename: "Deposit",
  amt?: number,
  start?: number,
  end?: number,
  rate?: number,
  fIds?: Array< string >,
  curr?: string,
};

export type Liability = {
  __typename: "Liability",
  loan?: Loan,
  fIds?: Array< string >,
  curr?: string,
};

export type Balance = {
  __typename: "Balance",
  amt?: number,
  curr?: string,
  name?: string | null,
};

export type Property = {
  __typename: "Property",
  type?: PropertyType,
  pin?: number,
  purchase?: Purchase,
  address?: string | null,
  fIds?: Array< string >,
  curr?: string,
  country?: string,
};

export type Insurance = {
  __typename: "Insurance",
  premium?: number,
  years?: number,
  fIds?: Array< string >,
  curr?: string,
};

export type UpdateHoldingsInput = {
  id: string,
  instruments?: Array< HoldingInput > | null,
  deposits?: Array< DepositInput > | null,
  lendings?: Array< DepositInput > | null,
  loans?: Array< LiabilityInput > | null,
  savings?: Array< BalanceInput > | null,
  property?: Array< PropertyInput > | null,
  vehicles?: Array< HoldingInput > | null,
  pm?: Array< HoldingInput > | null,
  ppf?: Array< HoldingInput > | null,
  epf?: Array< HoldingInput > | null,
  nps?: Array< HoldingInput > | null,
  crypto?: Array< HoldingInput > | null,
  ins?: Array< InsuranceInput > | null,
};

export type DeleteHoldingsInput = {
  id: string,
};

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

export type CreateInstrumentInput = {
  id: string,
  sid?: string | null,
  name: string,
  exchg?: string | null,
  country: string,
  curr: string,
  type: InsType,
  subt: InsSubType,
  price: number,
  prev?: number | null,
  sm?: number | null,
  sy?: number | null,
  mm?: number | null,
  my?: number | null,
  rate?: number | null,
};

export type ModelInstrumentConditionInput = {
  sid?: ModelStringInput | null,
  name?: ModelStringInput | null,
  exchg?: ModelStringInput | null,
  country?: ModelStringInput | null,
  curr?: ModelStringInput | null,
  type?: ModelInsTypeInput | null,
  subt?: ModelInsSubTypeInput | null,
  price?: ModelFloatInput | null,
  prev?: ModelFloatInput | null,
  sm?: ModelIntInput | null,
  sy?: ModelIntInput | null,
  mm?: ModelIntInput | null,
  my?: ModelIntInput | null,
  rate?: ModelFloatInput | null,
  and?: Array< ModelInstrumentConditionInput | null > | null,
  or?: Array< ModelInstrumentConditionInput | null > | null,
  not?: ModelInstrumentConditionInput | null,
};

export type ModelInsTypeInput = {
  eq?: InsType | null,
  ne?: InsType | null,
};

export type ModelInsSubTypeInput = {
  eq?: InsSubType | null,
  ne?: InsSubType | null,
};

export type UpdateInstrumentInput = {
  id: string,
  sid?: string | null,
  name?: string | null,
  exchg?: string | null,
  country?: string | null,
  curr?: string | null,
  type?: InsType | null,
  subt?: InsSubType | null,
  price?: number | null,
  prev?: number | null,
  sm?: number | null,
  sy?: number | null,
  mm?: number | null,
  my?: number | null,
  rate?: number | null,
};

export type DeleteInstrumentInput = {
  id: string,
};

export type CreateEODPricesInput = {
  id: string,
  price: number,
  name?: string | null,
};

export type ModelEODPricesConditionInput = {
  price?: ModelFloatInput | null,
  name?: ModelStringInput | null,
  and?: Array< ModelEODPricesConditionInput | null > | null,
  or?: Array< ModelEODPricesConditionInput | null > | null,
  not?: ModelEODPricesConditionInput | null,
};

export type EODPrices = {
  __typename: "EODPrices",
  id?: string,
  price?: number,
  name?: string | null,
  createdAt?: string,
  updatedAt?: string,
};

export type UpdateEODPricesInput = {
  id: string,
  price?: number | null,
  name?: string | null,
};

export type DeleteEODPricesInput = {
  id: string,
};

export type CreateMFPricesInput = {
  id: string,
  sid: string,
  stype: MFSchemeType,
  rid?: string | null,
  nav: number,
  name: string,
  amc: string,
  country: string,
  curr: string,
  type: InsType,
};

export enum MFSchemeType {
  O = "O",
  C = "C",
  I = "I",
}


export type ModelMFPricesConditionInput = {
  sid?: ModelStringInput | null,
  stype?: ModelMFSchemeTypeInput | null,
  rid?: ModelStringInput | null,
  nav?: ModelFloatInput | null,
  name?: ModelStringInput | null,
  amc?: ModelStringInput | null,
  country?: ModelStringInput | null,
  curr?: ModelStringInput | null,
  type?: ModelInsTypeInput | null,
  and?: Array< ModelMFPricesConditionInput | null > | null,
  or?: Array< ModelMFPricesConditionInput | null > | null,
  not?: ModelMFPricesConditionInput | null,
};

export type ModelMFSchemeTypeInput = {
  eq?: MFSchemeType | null,
  ne?: MFSchemeType | null,
};

export type MFPrices = {
  __typename: "MFPrices",
  id?: string,
  sid?: string,
  stype?: MFSchemeType,
  rid?: string | null,
  nav?: number,
  name?: string,
  amc?: string,
  country?: string,
  curr?: string,
  type?: InsType,
  createdAt?: string,
  updatedAt?: string,
};

export type UpdateMFPricesInput = {
  id: string,
  sid?: string | null,
  stype?: MFSchemeType | null,
  rid?: string | null,
  nav?: number | null,
  name?: string | null,
  amc?: string | null,
  country?: string | null,
  curr?: string | null,
  type?: InsType | null,
};

export type DeleteMFPricesInput = {
  id: string,
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
  img?: ModelStringInput | null,
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

export type ModelGoalConnection = {
  __typename: "ModelGoalConnection",
  items?:  Array<Goal | null > | null,
  nextToken?: string | null,
};

export type ModelMilestoneFilterInput = {
  id?: ModelIDInput | null,
  attr?: ModelMilestoneAttrInput | null,
  and?: Array< ModelMilestoneFilterInput | null > | null,
  or?: Array< ModelMilestoneFilterInput | null > | null,
  not?: ModelMilestoneFilterInput | null,
};

export type ModelMilestoneConnection = {
  __typename: "ModelMilestoneConnection",
  items?:  Array<Milestone | null > | null,
  nextToken?: string | null,
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

export type ModelProfileConnection = {
  __typename: "ModelProfileConnection",
  items?:  Array<Profile | null > | null,
  nextToken?: string | null,
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

export type ModelItemConnection = {
  __typename: "ModelItemConnection",
  items?:  Array<Item | null > | null,
  nextToken?: string | null,
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

export type ModelAccountConnection = {
  __typename: "ModelAccountConnection",
  items?:  Array<Account | null > | null,
  nextToken?: string | null,
};

export type ModelFamilyFilterInput = {
  id?: ModelIDInput | null,
  tid?: ModelStringInput | null,
  name?: ModelStringInput | null,
  and?: Array< ModelFamilyFilterInput | null > | null,
  or?: Array< ModelFamilyFilterInput | null > | null,
  not?: ModelFamilyFilterInput | null,
};

export type ModelFamilyConnection = {
  __typename: "ModelFamilyConnection",
  items?:  Array<Family | null > | null,
  nextToken?: string | null,
};

export type ModelHoldingsFilterInput = {
  id?: ModelIDInput | null,
  and?: Array< ModelHoldingsFilterInput | null > | null,
  or?: Array< ModelHoldingsFilterInput | null > | null,
  not?: ModelHoldingsFilterInput | null,
};

export type ModelHoldingsConnection = {
  __typename: "ModelHoldingsConnection",
  items?:  Array<Holdings | null > | null,
  nextToken?: string | null,
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

export type ModelFeedbackConnection = {
  __typename: "ModelFeedbackConnection",
  items?:  Array<Feedback | null > | null,
  nextToken?: string | null,
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

export type ModelRatingConnection = {
  __typename: "ModelRatingConnection",
  items?:  Array<Rating | null > | null,
  nextToken?: string | null,
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


export type ModelRegistrationConnection = {
  __typename: "ModelRegistrationConnection",
  items?:  Array<Registration | null > | null,
  nextToken?: string | null,
};

export type ModelInstrumentFilterInput = {
  id?: ModelStringInput | null,
  sid?: ModelStringInput | null,
  name?: ModelStringInput | null,
  exchg?: ModelStringInput | null,
  country?: ModelStringInput | null,
  curr?: ModelStringInput | null,
  type?: ModelInsTypeInput | null,
  subt?: ModelInsSubTypeInput | null,
  price?: ModelFloatInput | null,
  prev?: ModelFloatInput | null,
  sm?: ModelIntInput | null,
  sy?: ModelIntInput | null,
  mm?: ModelIntInput | null,
  my?: ModelIntInput | null,
  rate?: ModelFloatInput | null,
  and?: Array< ModelInstrumentFilterInput | null > | null,
  or?: Array< ModelInstrumentFilterInput | null > | null,
  not?: ModelInstrumentFilterInput | null,
};

export type ModelInstrumentConnection = {
  __typename: "ModelInstrumentConnection",
  items?:  Array<Instrument | null > | null,
  nextToken?: string | null,
};

export type ModelEODPricesFilterInput = {
  id?: ModelStringInput | null,
  price?: ModelFloatInput | null,
  name?: ModelStringInput | null,
  and?: Array< ModelEODPricesFilterInput | null > | null,
  or?: Array< ModelEODPricesFilterInput | null > | null,
  not?: ModelEODPricesFilterInput | null,
};

export type ModelEODPricesConnection = {
  __typename: "ModelEODPricesConnection",
  items?:  Array<EODPrices | null > | null,
  nextToken?: string | null,
};

export type ModelMFPricesFilterInput = {
  id?: ModelStringInput | null,
  sid?: ModelStringInput | null,
  stype?: ModelMFSchemeTypeInput | null,
  rid?: ModelStringInput | null,
  nav?: ModelFloatInput | null,
  name?: ModelStringInput | null,
  amc?: ModelStringInput | null,
  country?: ModelStringInput | null,
  curr?: ModelStringInput | null,
  type?: ModelInsTypeInput | null,
  and?: Array< ModelMFPricesFilterInput | null > | null,
  or?: Array< ModelMFPricesFilterInput | null > | null,
  not?: ModelMFPricesFilterInput | null,
};

export type ModelMFPricesConnection = {
  __typename: "ModelMFPricesConnection",
  items?:  Array<MFPrices | null > | null,
  nextToken?: string | null,
};

export type BatchAddInstrumentsMutationVariables = {
  input?: Array< CreateBatchInstrument | null > | null,
};

export type BatchAddInstrumentsMutation = {
  batchAddInstruments?:  Array< {
    __typename: "Instrument",
    id: string,
    sid?: string | null,
    name: string,
    exchg?: string | null,
    country: string,
    curr: string,
    type: InsType,
    subt: InsSubType,
    price: number,
    prev?: number | null,
    sm?: number | null,
    sy?: number | null,
    mm?: number | null,
    my?: number | null,
    rate?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null > | null,
};

export type DeleteFeedbackMutationVariables = {
  input?: DeleteFeedbackInput,
  condition?: ModelFeedbackConditionInput | null,
};

export type DeleteFeedbackMutation = {
  deleteFeedback?:  {
    __typename: "Feedback",
    id: string,
    type: FeedbackType,
    email: string,
    name:  {
      __typename: "Name",
      fn: string,
      ln?: string | null,
    },
    feedback: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteRatingMutationVariables = {
  input?: DeleteRatingInput,
  condition?: ModelRatingConditionInput | null,
};

export type DeleteRatingMutation = {
  deleteRating?:  {
    __typename: "Rating",
    id: string,
    type: CalcType,
    rating: number,
    feedbackId?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateGoalMutationVariables = {
  input?: CreateGoalInput,
  condition?: ModelGoalConditionInput | null,
};

export type CreateGoalMutation = {
  createGoal?:  {
    __typename: "Goal",
    id: string,
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
    tgts?:  Array< {
      __typename: "Target",
      num: number,
      val: number,
    } > | null,
    loan?:  {
      __typename: "Loan",
      type: LoanType,
      per: number,
      rate?: number | null,
      dur: number,
      ry: number,
      pp?:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      ira?:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      emi?: number | null,
      pmi?: number | null,
      peper?: number | null,
    } | null,
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
    pg?:  Array< {
      __typename: "Target",
      num: number,
      val: number,
    } | null > | null,
    pl?:  Array< {
      __typename: "Target",
      num: number,
      val: number,
    } | null > | null,
    ra?: number | null,
    rachg?: number | null,
    img?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type UpdateGoalMutationVariables = {
  input?: UpdateGoalInput,
  condition?: ModelGoalConditionInput | null,
};

export type UpdateGoalMutation = {
  updateGoal?:  {
    __typename: "Goal",
    id: string,
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
    tgts?:  Array< {
      __typename: "Target",
      num: number,
      val: number,
    } > | null,
    loan?:  {
      __typename: "Loan",
      type: LoanType,
      per: number,
      rate?: number | null,
      dur: number,
      ry: number,
      pp?:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      ira?:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      emi?: number | null,
      pmi?: number | null,
      peper?: number | null,
    } | null,
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
    pg?:  Array< {
      __typename: "Target",
      num: number,
      val: number,
    } | null > | null,
    pl?:  Array< {
      __typename: "Target",
      num: number,
      val: number,
    } | null > | null,
    ra?: number | null,
    rachg?: number | null,
    img?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type DeleteGoalMutationVariables = {
  input?: DeleteGoalInput,
  condition?: ModelGoalConditionInput | null,
};

export type DeleteGoalMutation = {
  deleteGoal?:  {
    __typename: "Goal",
    id: string,
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
    tgts?:  Array< {
      __typename: "Target",
      num: number,
      val: number,
    } > | null,
    loan?:  {
      __typename: "Loan",
      type: LoanType,
      per: number,
      rate?: number | null,
      dur: number,
      ry: number,
      pp?:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      ira?:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      emi?: number | null,
      pmi?: number | null,
      peper?: number | null,
    } | null,
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
    pg?:  Array< {
      __typename: "Target",
      num: number,
      val: number,
    } | null > | null,
    pl?:  Array< {
      __typename: "Target",
      num: number,
      val: number,
    } | null > | null,
    ra?: number | null,
    rachg?: number | null,
    img?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type CreateMilestoneMutationVariables = {
  input?: CreateMilestoneInput,
  condition?: ModelMilestoneConditionInput | null,
};

export type CreateMilestoneMutation = {
  createMilestone?:  {
    __typename: "Milestone",
    id: string,
    tgt:  {
      __typename: "Target",
      num: number,
      val: number,
    },
    attr: MilestoneAttr,
    goals?:  Array< {
      __typename: "Goal",
      id: string,
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
      tgts?:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      loan?:  {
        __typename: "Loan",
        type: LoanType,
        per: number,
        rate?: number | null,
        dur: number,
        ry: number,
        emi?: number | null,
        pmi?: number | null,
        peper?: number | null,
      } | null,
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
      pg?:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } | null > | null,
      pl?:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } | null > | null,
      ra?: number | null,
      rachg?: number | null,
      img?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type UpdateMilestoneMutationVariables = {
  input?: UpdateMilestoneInput,
  condition?: ModelMilestoneConditionInput | null,
};

export type UpdateMilestoneMutation = {
  updateMilestone?:  {
    __typename: "Milestone",
    id: string,
    tgt:  {
      __typename: "Target",
      num: number,
      val: number,
    },
    attr: MilestoneAttr,
    goals?:  Array< {
      __typename: "Goal",
      id: string,
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
      tgts?:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      loan?:  {
        __typename: "Loan",
        type: LoanType,
        per: number,
        rate?: number | null,
        dur: number,
        ry: number,
        emi?: number | null,
        pmi?: number | null,
        peper?: number | null,
      } | null,
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
      pg?:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } | null > | null,
      pl?:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } | null > | null,
      ra?: number | null,
      rachg?: number | null,
      img?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type DeleteMilestoneMutationVariables = {
  input?: DeleteMilestoneInput,
  condition?: ModelMilestoneConditionInput | null,
};

export type DeleteMilestoneMutation = {
  deleteMilestone?:  {
    __typename: "Milestone",
    id: string,
    tgt:  {
      __typename: "Target",
      num: number,
      val: number,
    },
    attr: MilestoneAttr,
    goals?:  Array< {
      __typename: "Goal",
      id: string,
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
      tgts?:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      loan?:  {
        __typename: "Loan",
        type: LoanType,
        per: number,
        rate?: number | null,
        dur: number,
        ry: number,
        emi?: number | null,
        pmi?: number | null,
        peper?: number | null,
      } | null,
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
      pg?:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } | null > | null,
      pl?:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } | null > | null,
      ra?: number | null,
      rachg?: number | null,
      img?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type CreateProfileMutationVariables = {
  input?: CreateProfileInput,
  condition?: ModelProfileConditionInput | null,
};

export type CreateProfileMutation = {
  createProfile?:  {
    __typename: "Profile",
    id: string,
    citizen: string,
    tr: string,
    itr: number,
    cgtr: number,
    curr: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type UpdateProfileMutationVariables = {
  input?: UpdateProfileInput,
  condition?: ModelProfileConditionInput | null,
};

export type UpdateProfileMutation = {
  updateProfile?:  {
    __typename: "Profile",
    id: string,
    citizen: string,
    tr: string,
    itr: number,
    cgtr: number,
    curr: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type DeleteProfileMutationVariables = {
  input?: DeleteProfileInput,
  condition?: ModelProfileConditionInput | null,
};

export type DeleteProfileMutation = {
  deleteProfile?:  {
    __typename: "Profile",
    id: string,
    citizen: string,
    tr: string,
    itr: number,
    cgtr: number,
    curr: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type CreateItemMutationVariables = {
  input?: CreateItemInput,
  condition?: ModelItemConditionInput | null,
};

export type CreateItemMutation = {
  createItem?:  {
    __typename: "Item",
    id: string,
    p_at: string,
    p_id: string,
    p_instid: string,
    instname: string,
    status: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type UpdateItemMutationVariables = {
  input?: UpdateItemInput,
  condition?: ModelItemConditionInput | null,
};

export type UpdateItemMutation = {
  updateItem?:  {
    __typename: "Item",
    id: string,
    p_at: string,
    p_id: string,
    p_instid: string,
    instname: string,
    status: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type DeleteItemMutationVariables = {
  input?: DeleteItemInput,
  condition?: ModelItemConditionInput | null,
};

export type DeleteItemMutation = {
  deleteItem?:  {
    __typename: "Item",
    id: string,
    p_at: string,
    p_id: string,
    p_instid: string,
    instname: string,
    status: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type CreateAccountMutationVariables = {
  input?: CreateAccountInput,
  condition?: ModelAccountConditionInput | null,
};

export type CreateAccountMutation = {
  createAccount?:  {
    __typename: "Account",
    id: string,
    item?:  {
      __typename: "Item",
      id: string,
      p_at: string,
      p_id: string,
      p_instid: string,
      instname: string,
      status: string,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
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
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type UpdateAccountMutationVariables = {
  input?: UpdateAccountInput,
  condition?: ModelAccountConditionInput | null,
};

export type UpdateAccountMutation = {
  updateAccount?:  {
    __typename: "Account",
    id: string,
    item?:  {
      __typename: "Item",
      id: string,
      p_at: string,
      p_id: string,
      p_instid: string,
      instname: string,
      status: string,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
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
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type DeleteAccountMutationVariables = {
  input?: DeleteAccountInput,
  condition?: ModelAccountConditionInput | null,
};

export type DeleteAccountMutation = {
  deleteAccount?:  {
    __typename: "Account",
    id: string,
    item?:  {
      __typename: "Item",
      id: string,
      p_at: string,
      p_id: string,
      p_instid: string,
      instname: string,
      status: string,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
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
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type DeleteRegistrationMutationVariables = {
  input?: DeleteRegistrationInput,
  condition?: ModelRegistrationConditionInput | null,
};

export type DeleteRegistrationMutation = {
  deleteRegistration?:  {
    __typename: "Registration",
    email: string,
    status: Status,
    code: string,
    country: string,
    lat?: number | null,
    long?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateFamilyMutationVariables = {
  input?: CreateFamilyInput,
  condition?: ModelFamilyConditionInput | null,
};

export type CreateFamilyMutation = {
  createFamily?:  {
    __typename: "Family",
    id: string,
    tid: string,
    name: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type UpdateFamilyMutationVariables = {
  input?: UpdateFamilyInput,
  condition?: ModelFamilyConditionInput | null,
};

export type UpdateFamilyMutation = {
  updateFamily?:  {
    __typename: "Family",
    id: string,
    tid: string,
    name: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type DeleteFamilyMutationVariables = {
  input?: DeleteFamilyInput,
  condition?: ModelFamilyConditionInput | null,
};

export type DeleteFamilyMutation = {
  deleteFamily?:  {
    __typename: "Family",
    id: string,
    tid: string,
    name: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type CreateHoldingsMutationVariables = {
  input?: CreateHoldingsInput,
  condition?: ModelHoldingsConditionInput | null,
};

export type CreateHoldingsMutation = {
  createHoldings?:  {
    __typename: "Holdings",
    id: string,
    instruments?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    deposits?:  Array< {
      __typename: "Deposit",
      amt: number,
      start: number,
      end: number,
      rate: number,
      fIds: Array< string >,
      curr: string,
    } > | null,
    lendings?:  Array< {
      __typename: "Deposit",
      amt: number,
      start: number,
      end: number,
      rate: number,
      fIds: Array< string >,
      curr: string,
    } > | null,
    loans?:  Array< {
      __typename: "Liability",
      loan?:  {
        __typename: "Loan",
        type: LoanType,
        per: number,
        rate?: number | null,
        dur: number,
        ry: number,
        emi?: number | null,
        pmi?: number | null,
        peper?: number | null,
      } | null,
      fIds: Array< string >,
      curr: string,
    } > | null,
    savings?:  Array< {
      __typename: "Balance",
      amt: number,
      curr: string,
      name?: string | null,
    } > | null,
    property?:  Array< {
      __typename: "Property",
      type: PropertyType,
      pin: number,
      purchase?:  {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } | null,
      address?: string | null,
      fIds: Array< string >,
      curr: string,
      country: string,
    } > | null,
    vehicles?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    pm?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    ppf?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    epf?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    nps?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    crypto?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    ins?:  Array< {
      __typename: "Insurance",
      premium: number,
      years: number,
      fIds: Array< string >,
      curr: string,
    } > | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type UpdateHoldingsMutationVariables = {
  input?: UpdateHoldingsInput,
  condition?: ModelHoldingsConditionInput | null,
};

export type UpdateHoldingsMutation = {
  updateHoldings?:  {
    __typename: "Holdings",
    id: string,
    instruments?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    deposits?:  Array< {
      __typename: "Deposit",
      amt: number,
      start: number,
      end: number,
      rate: number,
      fIds: Array< string >,
      curr: string,
    } > | null,
    lendings?:  Array< {
      __typename: "Deposit",
      amt: number,
      start: number,
      end: number,
      rate: number,
      fIds: Array< string >,
      curr: string,
    } > | null,
    loans?:  Array< {
      __typename: "Liability",
      loan?:  {
        __typename: "Loan",
        type: LoanType,
        per: number,
        rate?: number | null,
        dur: number,
        ry: number,
        emi?: number | null,
        pmi?: number | null,
        peper?: number | null,
      } | null,
      fIds: Array< string >,
      curr: string,
    } > | null,
    savings?:  Array< {
      __typename: "Balance",
      amt: number,
      curr: string,
      name?: string | null,
    } > | null,
    property?:  Array< {
      __typename: "Property",
      type: PropertyType,
      pin: number,
      purchase?:  {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } | null,
      address?: string | null,
      fIds: Array< string >,
      curr: string,
      country: string,
    } > | null,
    vehicles?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    pm?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    ppf?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    epf?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    nps?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    crypto?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    ins?:  Array< {
      __typename: "Insurance",
      premium: number,
      years: number,
      fIds: Array< string >,
      curr: string,
    } > | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type DeleteHoldingsMutationVariables = {
  input?: DeleteHoldingsInput,
  condition?: ModelHoldingsConditionInput | null,
};

export type DeleteHoldingsMutation = {
  deleteHoldings?:  {
    __typename: "Holdings",
    id: string,
    instruments?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    deposits?:  Array< {
      __typename: "Deposit",
      amt: number,
      start: number,
      end: number,
      rate: number,
      fIds: Array< string >,
      curr: string,
    } > | null,
    lendings?:  Array< {
      __typename: "Deposit",
      amt: number,
      start: number,
      end: number,
      rate: number,
      fIds: Array< string >,
      curr: string,
    } > | null,
    loans?:  Array< {
      __typename: "Liability",
      loan?:  {
        __typename: "Loan",
        type: LoanType,
        per: number,
        rate?: number | null,
        dur: number,
        ry: number,
        emi?: number | null,
        pmi?: number | null,
        peper?: number | null,
      } | null,
      fIds: Array< string >,
      curr: string,
    } > | null,
    savings?:  Array< {
      __typename: "Balance",
      amt: number,
      curr: string,
      name?: string | null,
    } > | null,
    property?:  Array< {
      __typename: "Property",
      type: PropertyType,
      pin: number,
      purchase?:  {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } | null,
      address?: string | null,
      fIds: Array< string >,
      curr: string,
      country: string,
    } > | null,
    vehicles?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    pm?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    ppf?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    epf?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    nps?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    crypto?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    ins?:  Array< {
      __typename: "Insurance",
      premium: number,
      years: number,
      fIds: Array< string >,
      curr: string,
    } > | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type CreateFeedbackMutationVariables = {
  input?: CreateFeedbackInput,
  condition?: ModelFeedbackConditionInput | null,
};

export type CreateFeedbackMutation = {
  createFeedback?:  {
    __typename: "Feedback",
    id: string,
    type: FeedbackType,
    email: string,
    name:  {
      __typename: "Name",
      fn: string,
      ln?: string | null,
    },
    feedback: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateFeedbackMutationVariables = {
  input?: UpdateFeedbackInput,
  condition?: ModelFeedbackConditionInput | null,
};

export type UpdateFeedbackMutation = {
  updateFeedback?:  {
    __typename: "Feedback",
    id: string,
    type: FeedbackType,
    email: string,
    name:  {
      __typename: "Name",
      fn: string,
      ln?: string | null,
    },
    feedback: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateRatingMutationVariables = {
  input?: CreateRatingInput,
  condition?: ModelRatingConditionInput | null,
};

export type CreateRatingMutation = {
  createRating?:  {
    __typename: "Rating",
    id: string,
    type: CalcType,
    rating: number,
    feedbackId?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateRatingMutationVariables = {
  input?: UpdateRatingInput,
  condition?: ModelRatingConditionInput | null,
};

export type UpdateRatingMutation = {
  updateRating?:  {
    __typename: "Rating",
    id: string,
    type: CalcType,
    rating: number,
    feedbackId?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateRegistrationMutationVariables = {
  input?: CreateRegistrationInput,
  condition?: ModelRegistrationConditionInput | null,
};

export type CreateRegistrationMutation = {
  createRegistration?:  {
    __typename: "Registration",
    email: string,
    status: Status,
    code: string,
    country: string,
    lat?: number | null,
    long?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateRegistrationMutationVariables = {
  input?: UpdateRegistrationInput,
  condition?: ModelRegistrationConditionInput | null,
};

export type UpdateRegistrationMutation = {
  updateRegistration?:  {
    __typename: "Registration",
    email: string,
    status: Status,
    code: string,
    country: string,
    lat?: number | null,
    long?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateInstrumentMutationVariables = {
  input?: CreateInstrumentInput,
  condition?: ModelInstrumentConditionInput | null,
};

export type CreateInstrumentMutation = {
  createInstrument?:  {
    __typename: "Instrument",
    id: string,
    sid?: string | null,
    name: string,
    exchg?: string | null,
    country: string,
    curr: string,
    type: InsType,
    subt: InsSubType,
    price: number,
    prev?: number | null,
    sm?: number | null,
    sy?: number | null,
    mm?: number | null,
    my?: number | null,
    rate?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateInstrumentMutationVariables = {
  input?: UpdateInstrumentInput,
  condition?: ModelInstrumentConditionInput | null,
};

export type UpdateInstrumentMutation = {
  updateInstrument?:  {
    __typename: "Instrument",
    id: string,
    sid?: string | null,
    name: string,
    exchg?: string | null,
    country: string,
    curr: string,
    type: InsType,
    subt: InsSubType,
    price: number,
    prev?: number | null,
    sm?: number | null,
    sy?: number | null,
    mm?: number | null,
    my?: number | null,
    rate?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteInstrumentMutationVariables = {
  input?: DeleteInstrumentInput,
  condition?: ModelInstrumentConditionInput | null,
};

export type DeleteInstrumentMutation = {
  deleteInstrument?:  {
    __typename: "Instrument",
    id: string,
    sid?: string | null,
    name: string,
    exchg?: string | null,
    country: string,
    curr: string,
    type: InsType,
    subt: InsSubType,
    price: number,
    prev?: number | null,
    sm?: number | null,
    sy?: number | null,
    mm?: number | null,
    my?: number | null,
    rate?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateEodPricesMutationVariables = {
  input?: CreateEODPricesInput,
  condition?: ModelEODPricesConditionInput | null,
};

export type CreateEodPricesMutation = {
  createEODPrices?:  {
    __typename: "EODPrices",
    id: string,
    price: number,
    name?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateEodPricesMutationVariables = {
  input?: UpdateEODPricesInput,
  condition?: ModelEODPricesConditionInput | null,
};

export type UpdateEodPricesMutation = {
  updateEODPrices?:  {
    __typename: "EODPrices",
    id: string,
    price: number,
    name?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteEodPricesMutationVariables = {
  input?: DeleteEODPricesInput,
  condition?: ModelEODPricesConditionInput | null,
};

export type DeleteEodPricesMutation = {
  deleteEODPrices?:  {
    __typename: "EODPrices",
    id: string,
    price: number,
    name?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateMfPricesMutationVariables = {
  input?: CreateMFPricesInput,
  condition?: ModelMFPricesConditionInput | null,
};

export type CreateMfPricesMutation = {
  createMFPrices?:  {
    __typename: "MFPrices",
    id: string,
    sid: string,
    stype: MFSchemeType,
    rid?: string | null,
    nav: number,
    name: string,
    amc: string,
    country: string,
    curr: string,
    type: InsType,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateMfPricesMutationVariables = {
  input?: UpdateMFPricesInput,
  condition?: ModelMFPricesConditionInput | null,
};

export type UpdateMfPricesMutation = {
  updateMFPrices?:  {
    __typename: "MFPrices",
    id: string,
    sid: string,
    stype: MFSchemeType,
    rid?: string | null,
    nav: number,
    name: string,
    amc: string,
    country: string,
    curr: string,
    type: InsType,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteMfPricesMutationVariables = {
  input?: DeleteMFPricesInput,
  condition?: ModelMFPricesConditionInput | null,
};

export type DeleteMfPricesMutation = {
  deleteMFPrices?:  {
    __typename: "MFPrices",
    id: string,
    sid: string,
    stype: MFSchemeType,
    rid?: string | null,
    nav: number,
    name: string,
    amc: string,
    country: string,
    curr: string,
    type: InsType,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetGoalQueryVariables = {
  id?: string,
};

export type GetGoalQuery = {
  getGoal?:  {
    __typename: "Goal",
    id: string,
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
    tgts?:  Array< {
      __typename: "Target",
      num: number,
      val: number,
    } > | null,
    loan?:  {
      __typename: "Loan",
      type: LoanType,
      per: number,
      rate?: number | null,
      dur: number,
      ry: number,
      pp?:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      ira?:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      emi?: number | null,
      pmi?: number | null,
      peper?: number | null,
    } | null,
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
    pg?:  Array< {
      __typename: "Target",
      num: number,
      val: number,
    } | null > | null,
    pl?:  Array< {
      __typename: "Target",
      num: number,
      val: number,
    } | null > | null,
    ra?: number | null,
    rachg?: number | null,
    img?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type ListGoalsQueryVariables = {
  filter?: ModelGoalFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListGoalsQuery = {
  listGoals?:  {
    __typename: "ModelGoalConnection",
    items?:  Array< {
      __typename: "Goal",
      id: string,
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
      tgts?:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      loan?:  {
        __typename: "Loan",
        type: LoanType,
        per: number,
        rate?: number | null,
        dur: number,
        ry: number,
        emi?: number | null,
        pmi?: number | null,
        peper?: number | null,
      } | null,
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
      pg?:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } | null > | null,
      pl?:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } | null > | null,
      ra?: number | null,
      rachg?: number | null,
      img?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetMilestoneQueryVariables = {
  id?: string,
};

export type GetMilestoneQuery = {
  getMilestone?:  {
    __typename: "Milestone",
    id: string,
    tgt:  {
      __typename: "Target",
      num: number,
      val: number,
    },
    attr: MilestoneAttr,
    goals?:  Array< {
      __typename: "Goal",
      id: string,
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
      tgts?:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      loan?:  {
        __typename: "Loan",
        type: LoanType,
        per: number,
        rate?: number | null,
        dur: number,
        ry: number,
        emi?: number | null,
        pmi?: number | null,
        peper?: number | null,
      } | null,
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
      pg?:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } | null > | null,
      pl?:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } | null > | null,
      ra?: number | null,
      rachg?: number | null,
      img?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type ListMilestonesQueryVariables = {
  filter?: ModelMilestoneFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListMilestonesQuery = {
  listMilestones?:  {
    __typename: "ModelMilestoneConnection",
    items?:  Array< {
      __typename: "Milestone",
      id: string,
      tgt:  {
        __typename: "Target",
        num: number,
        val: number,
      },
      attr: MilestoneAttr,
      goals?:  Array< {
        __typename: "Goal",
        id: string,
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
        ra?: number | null,
        rachg?: number | null,
        img?: string | null,
        createdAt: string,
        updatedAt: string,
        owner?: string | null,
      } | null > | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetProfileQueryVariables = {
  id?: string,
};

export type GetProfileQuery = {
  getProfile?:  {
    __typename: "Profile",
    id: string,
    citizen: string,
    tr: string,
    itr: number,
    cgtr: number,
    curr: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type ListProfilesQueryVariables = {
  filter?: ModelProfileFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListProfilesQuery = {
  listProfiles?:  {
    __typename: "ModelProfileConnection",
    items?:  Array< {
      __typename: "Profile",
      id: string,
      citizen: string,
      tr: string,
      itr: number,
      cgtr: number,
      curr: string,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetItemQueryVariables = {
  id?: string,
};

export type GetItemQuery = {
  getItem?:  {
    __typename: "Item",
    id: string,
    p_at: string,
    p_id: string,
    p_instid: string,
    instname: string,
    status: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type ListItemsQueryVariables = {
  filter?: ModelItemFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListItemsQuery = {
  listItems?:  {
    __typename: "ModelItemConnection",
    items?:  Array< {
      __typename: "Item",
      id: string,
      p_at: string,
      p_id: string,
      p_instid: string,
      instname: string,
      status: string,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetAccountQueryVariables = {
  id?: string,
};

export type GetAccountQuery = {
  getAccount?:  {
    __typename: "Account",
    id: string,
    item?:  {
      __typename: "Item",
      id: string,
      p_at: string,
      p_id: string,
      p_instid: string,
      instname: string,
      status: string,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
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
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type ListAccountsQueryVariables = {
  filter?: ModelAccountFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAccountsQuery = {
  listAccounts?:  {
    __typename: "ModelAccountConnection",
    items?:  Array< {
      __typename: "Account",
      id: string,
      item?:  {
        __typename: "Item",
        id: string,
        p_at: string,
        p_id: string,
        p_instid: string,
        instname: string,
        status: string,
        createdAt: string,
        updatedAt: string,
        owner?: string | null,
      } | null,
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
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetFamilyQueryVariables = {
  id?: string,
};

export type GetFamilyQuery = {
  getFamily?:  {
    __typename: "Family",
    id: string,
    tid: string,
    name: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type ListFamilysQueryVariables = {
  filter?: ModelFamilyFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListFamilysQuery = {
  listFamilys?:  {
    __typename: "ModelFamilyConnection",
    items?:  Array< {
      __typename: "Family",
      id: string,
      tid: string,
      name: string,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetHoldingsQueryVariables = {
  id?: string,
};

export type GetHoldingsQuery = {
  getHoldings?:  {
    __typename: "Holdings",
    id: string,
    instruments?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    deposits?:  Array< {
      __typename: "Deposit",
      amt: number,
      start: number,
      end: number,
      rate: number,
      fIds: Array< string >,
      curr: string,
    } > | null,
    lendings?:  Array< {
      __typename: "Deposit",
      amt: number,
      start: number,
      end: number,
      rate: number,
      fIds: Array< string >,
      curr: string,
    } > | null,
    loans?:  Array< {
      __typename: "Liability",
      loan?:  {
        __typename: "Loan",
        type: LoanType,
        per: number,
        rate?: number | null,
        dur: number,
        ry: number,
        emi?: number | null,
        pmi?: number | null,
        peper?: number | null,
      } | null,
      fIds: Array< string >,
      curr: string,
    } > | null,
    savings?:  Array< {
      __typename: "Balance",
      amt: number,
      curr: string,
      name?: string | null,
    } > | null,
    property?:  Array< {
      __typename: "Property",
      type: PropertyType,
      pin: number,
      purchase?:  {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } | null,
      address?: string | null,
      fIds: Array< string >,
      curr: string,
      country: string,
    } > | null,
    vehicles?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    pm?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    ppf?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    epf?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    nps?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    crypto?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    ins?:  Array< {
      __typename: "Insurance",
      premium: number,
      years: number,
      fIds: Array< string >,
      curr: string,
    } > | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type ListHoldingssQueryVariables = {
  filter?: ModelHoldingsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListHoldingssQuery = {
  listHoldingss?:  {
    __typename: "ModelHoldingsConnection",
    items?:  Array< {
      __typename: "Holdings",
      id: string,
      instruments?:  Array< {
        __typename: "Holding",
        id: string,
        qty: number,
        name?: string | null,
        fIds: Array< string >,
        curr?: string | null,
        chg?: number | null,
        type?: string | null,
        subt?: string | null,
      } > | null,
      deposits?:  Array< {
        __typename: "Deposit",
        amt: number,
        start: number,
        end: number,
        rate: number,
        fIds: Array< string >,
        curr: string,
      } > | null,
      lendings?:  Array< {
        __typename: "Deposit",
        amt: number,
        start: number,
        end: number,
        rate: number,
        fIds: Array< string >,
        curr: string,
      } > | null,
      loans?:  Array< {
        __typename: "Liability",
        fIds: Array< string >,
        curr: string,
      } > | null,
      savings?:  Array< {
        __typename: "Balance",
        amt: number,
        curr: string,
        name?: string | null,
      } > | null,
      property?:  Array< {
        __typename: "Property",
        type: PropertyType,
        pin: number,
        address?: string | null,
        fIds: Array< string >,
        curr: string,
        country: string,
      } > | null,
      vehicles?:  Array< {
        __typename: "Holding",
        id: string,
        qty: number,
        name?: string | null,
        fIds: Array< string >,
        curr?: string | null,
        chg?: number | null,
        type?: string | null,
        subt?: string | null,
      } > | null,
      pm?:  Array< {
        __typename: "Holding",
        id: string,
        qty: number,
        name?: string | null,
        fIds: Array< string >,
        curr?: string | null,
        chg?: number | null,
        type?: string | null,
        subt?: string | null,
      } > | null,
      ppf?:  Array< {
        __typename: "Holding",
        id: string,
        qty: number,
        name?: string | null,
        fIds: Array< string >,
        curr?: string | null,
        chg?: number | null,
        type?: string | null,
        subt?: string | null,
      } > | null,
      epf?:  Array< {
        __typename: "Holding",
        id: string,
        qty: number,
        name?: string | null,
        fIds: Array< string >,
        curr?: string | null,
        chg?: number | null,
        type?: string | null,
        subt?: string | null,
      } > | null,
      nps?:  Array< {
        __typename: "Holding",
        id: string,
        qty: number,
        name?: string | null,
        fIds: Array< string >,
        curr?: string | null,
        chg?: number | null,
        type?: string | null,
        subt?: string | null,
      } > | null,
      crypto?:  Array< {
        __typename: "Holding",
        id: string,
        qty: number,
        name?: string | null,
        fIds: Array< string >,
        curr?: string | null,
        chg?: number | null,
        type?: string | null,
        subt?: string | null,
      } > | null,
      ins?:  Array< {
        __typename: "Insurance",
        premium: number,
        years: number,
        fIds: Array< string >,
        curr: string,
      } > | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetFeedbackQueryVariables = {
  id?: string,
};

export type GetFeedbackQuery = {
  getFeedback?:  {
    __typename: "Feedback",
    id: string,
    type: FeedbackType,
    email: string,
    name:  {
      __typename: "Name",
      fn: string,
      ln?: string | null,
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
  listFeedbacks?:  {
    __typename: "ModelFeedbackConnection",
    items?:  Array< {
      __typename: "Feedback",
      id: string,
      type: FeedbackType,
      email: string,
      name:  {
        __typename: "Name",
        fn: string,
        ln?: string | null,
      },
      feedback: string,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetRatingQueryVariables = {
  id?: string,
};

export type GetRatingQuery = {
  getRating?:  {
    __typename: "Rating",
    id: string,
    type: CalcType,
    rating: number,
    feedbackId?: string | null,
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
  listRatings?:  {
    __typename: "ModelRatingConnection",
    items?:  Array< {
      __typename: "Rating",
      id: string,
      type: CalcType,
      rating: number,
      feedbackId?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetRegistrationQueryVariables = {
  email?: string,
};

export type GetRegistrationQuery = {
  getRegistration?:  {
    __typename: "Registration",
    email: string,
    status: Status,
    code: string,
    country: string,
    lat?: number | null,
    long?: number | null,
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
  listRegistrations?:  {
    __typename: "ModelRegistrationConnection",
    items?:  Array< {
      __typename: "Registration",
      email: string,
      status: Status,
      code: string,
      country: string,
      lat?: number | null,
      long?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetInstrumentQueryVariables = {
  id?: string,
};

export type GetInstrumentQuery = {
  getInstrument?:  {
    __typename: "Instrument",
    id: string,
    sid?: string | null,
    name: string,
    exchg?: string | null,
    country: string,
    curr: string,
    type: InsType,
    subt: InsSubType,
    price: number,
    prev?: number | null,
    sm?: number | null,
    sy?: number | null,
    mm?: number | null,
    my?: number | null,
    rate?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListInstrumentsQueryVariables = {
  id?: string | null,
  filter?: ModelInstrumentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListInstrumentsQuery = {
  listInstruments?:  {
    __typename: "ModelInstrumentConnection",
    items?:  Array< {
      __typename: "Instrument",
      id: string,
      sid?: string | null,
      name: string,
      exchg?: string | null,
      country: string,
      curr: string,
      type: InsType,
      subt: InsSubType,
      price: number,
      prev?: number | null,
      sm?: number | null,
      sy?: number | null,
      mm?: number | null,
      my?: number | null,
      rate?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetEodPricesQueryVariables = {
  id?: string,
};

export type GetEodPricesQuery = {
  getEODPrices?:  {
    __typename: "EODPrices",
    id: string,
    price: number,
    name?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListEodPricessQueryVariables = {
  id?: string | null,
  filter?: ModelEODPricesFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListEodPricessQuery = {
  listEODPricess?:  {
    __typename: "ModelEODPricesConnection",
    items?:  Array< {
      __typename: "EODPrices",
      id: string,
      price: number,
      name?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetMfPricesQueryVariables = {
  id?: string,
};

export type GetMfPricesQuery = {
  getMFPrices?:  {
    __typename: "MFPrices",
    id: string,
    sid: string,
    stype: MFSchemeType,
    rid?: string | null,
    nav: number,
    name: string,
    amc: string,
    country: string,
    curr: string,
    type: InsType,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListMfPricessQueryVariables = {
  id?: string | null,
  filter?: ModelMFPricesFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListMfPricessQuery = {
  listMFPricess?:  {
    __typename: "ModelMFPricesConnection",
    items?:  Array< {
      __typename: "MFPrices",
      id: string,
      sid: string,
      stype: MFSchemeType,
      rid?: string | null,
      nav: number,
      name: string,
      amc: string,
      country: string,
      curr: string,
      type: InsType,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type OnCreateGoalSubscriptionVariables = {
  owner?: string,
};

export type OnCreateGoalSubscription = {
  onCreateGoal?:  {
    __typename: "Goal",
    id: string,
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
    tgts?:  Array< {
      __typename: "Target",
      num: number,
      val: number,
    } > | null,
    loan?:  {
      __typename: "Loan",
      type: LoanType,
      per: number,
      rate?: number | null,
      dur: number,
      ry: number,
      pp?:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      ira?:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      emi?: number | null,
      pmi?: number | null,
      peper?: number | null,
    } | null,
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
    pg?:  Array< {
      __typename: "Target",
      num: number,
      val: number,
    } | null > | null,
    pl?:  Array< {
      __typename: "Target",
      num: number,
      val: number,
    } | null > | null,
    ra?: number | null,
    rachg?: number | null,
    img?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnUpdateGoalSubscriptionVariables = {
  owner?: string,
};

export type OnUpdateGoalSubscription = {
  onUpdateGoal?:  {
    __typename: "Goal",
    id: string,
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
    tgts?:  Array< {
      __typename: "Target",
      num: number,
      val: number,
    } > | null,
    loan?:  {
      __typename: "Loan",
      type: LoanType,
      per: number,
      rate?: number | null,
      dur: number,
      ry: number,
      pp?:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      ira?:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      emi?: number | null,
      pmi?: number | null,
      peper?: number | null,
    } | null,
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
    pg?:  Array< {
      __typename: "Target",
      num: number,
      val: number,
    } | null > | null,
    pl?:  Array< {
      __typename: "Target",
      num: number,
      val: number,
    } | null > | null,
    ra?: number | null,
    rachg?: number | null,
    img?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnDeleteGoalSubscriptionVariables = {
  owner?: string,
};

export type OnDeleteGoalSubscription = {
  onDeleteGoal?:  {
    __typename: "Goal",
    id: string,
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
    tgts?:  Array< {
      __typename: "Target",
      num: number,
      val: number,
    } > | null,
    loan?:  {
      __typename: "Loan",
      type: LoanType,
      per: number,
      rate?: number | null,
      dur: number,
      ry: number,
      pp?:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      ira?:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      emi?: number | null,
      pmi?: number | null,
      peper?: number | null,
    } | null,
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
    pg?:  Array< {
      __typename: "Target",
      num: number,
      val: number,
    } | null > | null,
    pl?:  Array< {
      __typename: "Target",
      num: number,
      val: number,
    } | null > | null,
    ra?: number | null,
    rachg?: number | null,
    img?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnCreateMilestoneSubscriptionVariables = {
  owner?: string,
};

export type OnCreateMilestoneSubscription = {
  onCreateMilestone?:  {
    __typename: "Milestone",
    id: string,
    tgt:  {
      __typename: "Target",
      num: number,
      val: number,
    },
    attr: MilestoneAttr,
    goals?:  Array< {
      __typename: "Goal",
      id: string,
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
      tgts?:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      loan?:  {
        __typename: "Loan",
        type: LoanType,
        per: number,
        rate?: number | null,
        dur: number,
        ry: number,
        emi?: number | null,
        pmi?: number | null,
        peper?: number | null,
      } | null,
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
      pg?:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } | null > | null,
      pl?:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } | null > | null,
      ra?: number | null,
      rachg?: number | null,
      img?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnUpdateMilestoneSubscriptionVariables = {
  owner?: string,
};

export type OnUpdateMilestoneSubscription = {
  onUpdateMilestone?:  {
    __typename: "Milestone",
    id: string,
    tgt:  {
      __typename: "Target",
      num: number,
      val: number,
    },
    attr: MilestoneAttr,
    goals?:  Array< {
      __typename: "Goal",
      id: string,
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
      tgts?:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      loan?:  {
        __typename: "Loan",
        type: LoanType,
        per: number,
        rate?: number | null,
        dur: number,
        ry: number,
        emi?: number | null,
        pmi?: number | null,
        peper?: number | null,
      } | null,
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
      pg?:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } | null > | null,
      pl?:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } | null > | null,
      ra?: number | null,
      rachg?: number | null,
      img?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnDeleteMilestoneSubscriptionVariables = {
  owner?: string,
};

export type OnDeleteMilestoneSubscription = {
  onDeleteMilestone?:  {
    __typename: "Milestone",
    id: string,
    tgt:  {
      __typename: "Target",
      num: number,
      val: number,
    },
    attr: MilestoneAttr,
    goals?:  Array< {
      __typename: "Goal",
      id: string,
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
      tgts?:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } > | null,
      loan?:  {
        __typename: "Loan",
        type: LoanType,
        per: number,
        rate?: number | null,
        dur: number,
        ry: number,
        emi?: number | null,
        pmi?: number | null,
        peper?: number | null,
      } | null,
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
      pg?:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } | null > | null,
      pl?:  Array< {
        __typename: "Target",
        num: number,
        val: number,
      } | null > | null,
      ra?: number | null,
      rachg?: number | null,
      img?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnCreateProfileSubscriptionVariables = {
  owner?: string,
};

export type OnCreateProfileSubscription = {
  onCreateProfile?:  {
    __typename: "Profile",
    id: string,
    citizen: string,
    tr: string,
    itr: number,
    cgtr: number,
    curr: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnUpdateProfileSubscriptionVariables = {
  owner?: string,
};

export type OnUpdateProfileSubscription = {
  onUpdateProfile?:  {
    __typename: "Profile",
    id: string,
    citizen: string,
    tr: string,
    itr: number,
    cgtr: number,
    curr: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnDeleteProfileSubscriptionVariables = {
  owner?: string,
};

export type OnDeleteProfileSubscription = {
  onDeleteProfile?:  {
    __typename: "Profile",
    id: string,
    citizen: string,
    tr: string,
    itr: number,
    cgtr: number,
    curr: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnCreateItemSubscriptionVariables = {
  owner?: string,
};

export type OnCreateItemSubscription = {
  onCreateItem?:  {
    __typename: "Item",
    id: string,
    p_at: string,
    p_id: string,
    p_instid: string,
    instname: string,
    status: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnUpdateItemSubscriptionVariables = {
  owner?: string,
};

export type OnUpdateItemSubscription = {
  onUpdateItem?:  {
    __typename: "Item",
    id: string,
    p_at: string,
    p_id: string,
    p_instid: string,
    instname: string,
    status: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnDeleteItemSubscriptionVariables = {
  owner?: string,
};

export type OnDeleteItemSubscription = {
  onDeleteItem?:  {
    __typename: "Item",
    id: string,
    p_at: string,
    p_id: string,
    p_instid: string,
    instname: string,
    status: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnCreateAccountSubscriptionVariables = {
  owner?: string,
};

export type OnCreateAccountSubscription = {
  onCreateAccount?:  {
    __typename: "Account",
    id: string,
    item?:  {
      __typename: "Item",
      id: string,
      p_at: string,
      p_id: string,
      p_instid: string,
      instname: string,
      status: string,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
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
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnUpdateAccountSubscriptionVariables = {
  owner?: string,
};

export type OnUpdateAccountSubscription = {
  onUpdateAccount?:  {
    __typename: "Account",
    id: string,
    item?:  {
      __typename: "Item",
      id: string,
      p_at: string,
      p_id: string,
      p_instid: string,
      instname: string,
      status: string,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
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
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnDeleteAccountSubscriptionVariables = {
  owner?: string,
};

export type OnDeleteAccountSubscription = {
  onDeleteAccount?:  {
    __typename: "Account",
    id: string,
    item?:  {
      __typename: "Item",
      id: string,
      p_at: string,
      p_id: string,
      p_instid: string,
      instname: string,
      status: string,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
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
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnCreateFamilySubscriptionVariables = {
  owner?: string,
};

export type OnCreateFamilySubscription = {
  onCreateFamily?:  {
    __typename: "Family",
    id: string,
    tid: string,
    name: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnUpdateFamilySubscriptionVariables = {
  owner?: string,
};

export type OnUpdateFamilySubscription = {
  onUpdateFamily?:  {
    __typename: "Family",
    id: string,
    tid: string,
    name: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnDeleteFamilySubscriptionVariables = {
  owner?: string,
};

export type OnDeleteFamilySubscription = {
  onDeleteFamily?:  {
    __typename: "Family",
    id: string,
    tid: string,
    name: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnCreateHoldingsSubscriptionVariables = {
  owner?: string,
};

export type OnCreateHoldingsSubscription = {
  onCreateHoldings?:  {
    __typename: "Holdings",
    id: string,
    instruments?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    deposits?:  Array< {
      __typename: "Deposit",
      amt: number,
      start: number,
      end: number,
      rate: number,
      fIds: Array< string >,
      curr: string,
    } > | null,
    lendings?:  Array< {
      __typename: "Deposit",
      amt: number,
      start: number,
      end: number,
      rate: number,
      fIds: Array< string >,
      curr: string,
    } > | null,
    loans?:  Array< {
      __typename: "Liability",
      loan?:  {
        __typename: "Loan",
        type: LoanType,
        per: number,
        rate?: number | null,
        dur: number,
        ry: number,
        emi?: number | null,
        pmi?: number | null,
        peper?: number | null,
      } | null,
      fIds: Array< string >,
      curr: string,
    } > | null,
    savings?:  Array< {
      __typename: "Balance",
      amt: number,
      curr: string,
      name?: string | null,
    } > | null,
    property?:  Array< {
      __typename: "Property",
      type: PropertyType,
      pin: number,
      purchase?:  {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } | null,
      address?: string | null,
      fIds: Array< string >,
      curr: string,
      country: string,
    } > | null,
    vehicles?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    pm?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    ppf?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    epf?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    nps?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    crypto?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    ins?:  Array< {
      __typename: "Insurance",
      premium: number,
      years: number,
      fIds: Array< string >,
      curr: string,
    } > | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnUpdateHoldingsSubscriptionVariables = {
  owner?: string,
};

export type OnUpdateHoldingsSubscription = {
  onUpdateHoldings?:  {
    __typename: "Holdings",
    id: string,
    instruments?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    deposits?:  Array< {
      __typename: "Deposit",
      amt: number,
      start: number,
      end: number,
      rate: number,
      fIds: Array< string >,
      curr: string,
    } > | null,
    lendings?:  Array< {
      __typename: "Deposit",
      amt: number,
      start: number,
      end: number,
      rate: number,
      fIds: Array< string >,
      curr: string,
    } > | null,
    loans?:  Array< {
      __typename: "Liability",
      loan?:  {
        __typename: "Loan",
        type: LoanType,
        per: number,
        rate?: number | null,
        dur: number,
        ry: number,
        emi?: number | null,
        pmi?: number | null,
        peper?: number | null,
      } | null,
      fIds: Array< string >,
      curr: string,
    } > | null,
    savings?:  Array< {
      __typename: "Balance",
      amt: number,
      curr: string,
      name?: string | null,
    } > | null,
    property?:  Array< {
      __typename: "Property",
      type: PropertyType,
      pin: number,
      purchase?:  {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } | null,
      address?: string | null,
      fIds: Array< string >,
      curr: string,
      country: string,
    } > | null,
    vehicles?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    pm?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    ppf?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    epf?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    nps?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    crypto?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    ins?:  Array< {
      __typename: "Insurance",
      premium: number,
      years: number,
      fIds: Array< string >,
      curr: string,
    } > | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnDeleteHoldingsSubscriptionVariables = {
  owner?: string,
};

export type OnDeleteHoldingsSubscription = {
  onDeleteHoldings?:  {
    __typename: "Holdings",
    id: string,
    instruments?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    deposits?:  Array< {
      __typename: "Deposit",
      amt: number,
      start: number,
      end: number,
      rate: number,
      fIds: Array< string >,
      curr: string,
    } > | null,
    lendings?:  Array< {
      __typename: "Deposit",
      amt: number,
      start: number,
      end: number,
      rate: number,
      fIds: Array< string >,
      curr: string,
    } > | null,
    loans?:  Array< {
      __typename: "Liability",
      loan?:  {
        __typename: "Loan",
        type: LoanType,
        per: number,
        rate?: number | null,
        dur: number,
        ry: number,
        emi?: number | null,
        pmi?: number | null,
        peper?: number | null,
      } | null,
      fIds: Array< string >,
      curr: string,
    } > | null,
    savings?:  Array< {
      __typename: "Balance",
      amt: number,
      curr: string,
      name?: string | null,
    } > | null,
    property?:  Array< {
      __typename: "Property",
      type: PropertyType,
      pin: number,
      purchase?:  {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } | null,
      address?: string | null,
      fIds: Array< string >,
      curr: string,
      country: string,
    } > | null,
    vehicles?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    pm?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    ppf?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    epf?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    nps?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    crypto?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        date: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    ins?:  Array< {
      __typename: "Insurance",
      premium: number,
      years: number,
      fIds: Array< string >,
      curr: string,
    } > | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnCreateFeedbackSubscription = {
  onCreateFeedback?:  {
    __typename: "Feedback",
    id: string,
    type: FeedbackType,
    email: string,
    name:  {
      __typename: "Name",
      fn: string,
      ln?: string | null,
    },
    feedback: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateFeedbackSubscription = {
  onUpdateFeedback?:  {
    __typename: "Feedback",
    id: string,
    type: FeedbackType,
    email: string,
    name:  {
      __typename: "Name",
      fn: string,
      ln?: string | null,
    },
    feedback: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteFeedbackSubscription = {
  onDeleteFeedback?:  {
    __typename: "Feedback",
    id: string,
    type: FeedbackType,
    email: string,
    name:  {
      __typename: "Name",
      fn: string,
      ln?: string | null,
    },
    feedback: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateRatingSubscription = {
  onCreateRating?:  {
    __typename: "Rating",
    id: string,
    type: CalcType,
    rating: number,
    feedbackId?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateRatingSubscription = {
  onUpdateRating?:  {
    __typename: "Rating",
    id: string,
    type: CalcType,
    rating: number,
    feedbackId?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteRatingSubscription = {
  onDeleteRating?:  {
    __typename: "Rating",
    id: string,
    type: CalcType,
    rating: number,
    feedbackId?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateRegistrationSubscription = {
  onCreateRegistration?:  {
    __typename: "Registration",
    email: string,
    status: Status,
    code: string,
    country: string,
    lat?: number | null,
    long?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateRegistrationSubscription = {
  onUpdateRegistration?:  {
    __typename: "Registration",
    email: string,
    status: Status,
    code: string,
    country: string,
    lat?: number | null,
    long?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteRegistrationSubscription = {
  onDeleteRegistration?:  {
    __typename: "Registration",
    email: string,
    status: Status,
    code: string,
    country: string,
    lat?: number | null,
    long?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateInstrumentSubscription = {
  onCreateInstrument?:  {
    __typename: "Instrument",
    id: string,
    sid?: string | null,
    name: string,
    exchg?: string | null,
    country: string,
    curr: string,
    type: InsType,
    subt: InsSubType,
    price: number,
    prev?: number | null,
    sm?: number | null,
    sy?: number | null,
    mm?: number | null,
    my?: number | null,
    rate?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateInstrumentSubscription = {
  onUpdateInstrument?:  {
    __typename: "Instrument",
    id: string,
    sid?: string | null,
    name: string,
    exchg?: string | null,
    country: string,
    curr: string,
    type: InsType,
    subt: InsSubType,
    price: number,
    prev?: number | null,
    sm?: number | null,
    sy?: number | null,
    mm?: number | null,
    my?: number | null,
    rate?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteInstrumentSubscription = {
  onDeleteInstrument?:  {
    __typename: "Instrument",
    id: string,
    sid?: string | null,
    name: string,
    exchg?: string | null,
    country: string,
    curr: string,
    type: InsType,
    subt: InsSubType,
    price: number,
    prev?: number | null,
    sm?: number | null,
    sy?: number | null,
    mm?: number | null,
    my?: number | null,
    rate?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateEodPricesSubscription = {
  onCreateEODPrices?:  {
    __typename: "EODPrices",
    id: string,
    price: number,
    name?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateEodPricesSubscription = {
  onUpdateEODPrices?:  {
    __typename: "EODPrices",
    id: string,
    price: number,
    name?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteEodPricesSubscription = {
  onDeleteEODPrices?:  {
    __typename: "EODPrices",
    id: string,
    price: number,
    name?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateMfPricesSubscription = {
  onCreateMFPrices?:  {
    __typename: "MFPrices",
    id: string,
    sid: string,
    stype: MFSchemeType,
    rid?: string | null,
    nav: number,
    name: string,
    amc: string,
    country: string,
    curr: string,
    type: InsType,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateMfPricesSubscription = {
  onUpdateMFPrices?:  {
    __typename: "MFPrices",
    id: string,
    sid: string,
    stype: MFSchemeType,
    rid?: string | null,
    nav: number,
    name: string,
    amc: string,
    country: string,
    curr: string,
    type: InsType,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteMfPricesSubscription = {
  onDeleteMFPrices?:  {
    __typename: "MFPrices",
    id: string,
    sid: string,
    stype: MFSchemeType,
    rid?: string | null,
    nav: number,
    name: string,
    amc: string,
    country: string,
    curr: string,
    type: InsType,
    createdAt: string,
    updatedAt: string,
  } | null,
};
