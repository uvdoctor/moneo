/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

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
  vpf?: Array< HoldingInput > | null,
  nps?: Array< HoldingInput > | null,
  crypto?: Array< HoldingInput > | null,
  ins?: Array< InsuranceInput > | null,
  mem?: Array< HoldingInput > | null,
  angel?: Array< HoldingInput > | null,
  other?: Array< HoldingInput > | null,
};

export type HoldingInput = {
  id: string,
  qty: number,
  pur?: Array< PurchaseInput > | null,
  name?: string | null,
  fIds: Array< string >,
  curr?: string | null,
  chg?: number | null,
  chgF?: number | null,
  type?: string | null,
  subt?: string | null,
};

export type PurchaseInput = {
  amt: number,
  day?: number | null,
  month: number,
  year: number,
  qty: number,
};

export type DepositInput = {
  amt: number,
  sm: number,
  sy: number,
  months: number,
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
  fIds: Array< string >,
};

export type PropertyInput = {
  type: PropertyType,
  pin: number,
  purchase?: PurchaseInput | null,
  address?: string | null,
  fIds: Array< string >,
  curr: string,
  country: string,
  own?: Array< OwnershipInput > | null,
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


export type OwnershipInput = {
  fId: string,
  per: number,
};

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
  vpf?:  Array<Holding > | null,
  nps?:  Array<Holding > | null,
  crypto?:  Array<Holding > | null,
  ins?:  Array<Insurance > | null,
  mem?:  Array<Holding > | null,
  angel?:  Array<Holding > | null,
  other?:  Array<Holding > | null,
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
  chgF?: number | null,
  type?: string | null,
  subt?: string | null,
};

export type Purchase = {
  __typename: "Purchase",
  amt?: number,
  day?: number | null,
  month?: number,
  year?: number,
  qty?: number,
};

export type Deposit = {
  __typename: "Deposit",
  amt?: number,
  sm?: number,
  sy?: number,
  months?: number,
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
  fIds?: Array< string >,
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
  own?:  Array<Ownership > | null,
};

export type Ownership = {
  __typename: "Ownership",
  fId?: string,
  per?: number,
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
  vpf?: Array< HoldingInput > | null,
  nps?: Array< HoldingInput > | null,
  crypto?: Array< HoldingInput > | null,
  ins?: Array< InsuranceInput > | null,
  mem?: Array< HoldingInput > | null,
  angel?: Array< HoldingInput > | null,
  other?: Array< HoldingInput > | null,
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

export type CreateFeedsInput = {
  id: string,
  tname: string,
  exchg?: Exchange | null,
  url?: string | null,
  count: number,
};

export enum Exchange {
  NSE = "NSE",
  BSE = "BSE",
}


export type ModelFeedsConditionInput = {
  tname?: ModelStringInput | null,
  exchg?: ModelExchangeInput | null,
  url?: ModelStringInput | null,
  count?: ModelIntInput | null,
  and?: Array< ModelFeedsConditionInput | null > | null,
  or?: Array< ModelFeedsConditionInput | null > | null,
  not?: ModelFeedsConditionInput | null,
};

export type ModelExchangeInput = {
  eq?: Exchange | null,
  ne?: Exchange | null,
};

export type Feeds = {
  __typename: "Feeds",
  id?: string,
  tname?: string,
  exchg?: Exchange | null,
  url?: string | null,
  count?: number,
  createdAt?: string,
  updatedAt?: string,
};

export type UpdateFeedsInput = {
  id: string,
  tname?: string | null,
  exchg?: Exchange | null,
  url?: string | null,
  count?: number | null,
};

export type DeleteFeedsInput = {
  id: string,
};

export type CreateINExchgInput = {
  id: string,
  sid: string,
  name: string,
  exchg: Exchange,
  type: AssetType,
  subt: AssetSubType,
  itype?: InsType | null,
  price: number,
  prev: number,
  fv?: number | null,
  under?: string | null,
  yhigh?: number | null,
  ylow?: number | null,
};

export enum AssetType {
  E = "E",
  F = "F",
  A = "A",
  H = "H",
}


export enum AssetSubType {
  S = "S",
  A = "A",
  CB = "CB",
  GB = "GB",
  HB = "HB",
  GBO = "GBO",
  GoldB = "GoldB",
  Gold = "Gold",
  I = "I",
  L = "L",
  R = "R",
  C = "C",
  M = "M",
  O = "O",
  V = "V",
  Cash = "Cash",
}


export enum InsType {
  ETF = "ETF",
  REIT = "REIT",
  InvIT = "InvIT",
}


export type ModelINExchgConditionInput = {
  sid?: ModelStringInput | null,
  name?: ModelStringInput | null,
  exchg?: ModelExchangeInput | null,
  type?: ModelAssetTypeInput | null,
  subt?: ModelAssetSubTypeInput | null,
  itype?: ModelInsTypeInput | null,
  price?: ModelFloatInput | null,
  prev?: ModelFloatInput | null,
  fv?: ModelIntInput | null,
  under?: ModelStringInput | null,
  yhigh?: ModelFloatInput | null,
  ylow?: ModelFloatInput | null,
  and?: Array< ModelINExchgConditionInput | null > | null,
  or?: Array< ModelINExchgConditionInput | null > | null,
  not?: ModelINExchgConditionInput | null,
};

export type ModelAssetTypeInput = {
  eq?: AssetType | null,
  ne?: AssetType | null,
};

export type ModelAssetSubTypeInput = {
  eq?: AssetSubType | null,
  ne?: AssetSubType | null,
};

export type ModelInsTypeInput = {
  eq?: InsType | null,
  ne?: InsType | null,
};

export type INExchg = {
  __typename: "INExchg",
  id?: string,
  sid?: string,
  name?: string,
  exchg?: Exchange,
  type?: AssetType,
  subt?: AssetSubType,
  itype?: InsType | null,
  price?: number,
  prev?: number,
  meta?: INExchgMeta,
  fv?: number | null,
  under?: string | null,
  yhigh?: number | null,
  ylow?: number | null,
  createdAt?: string,
  updatedAt?: string,
};

export type INExchgMeta = {
  __typename: "INExchgMeta",
  id?: string,
  mcap?: MCap | null,
  ind?: string | null,
  createdAt?: string,
  updatedAt?: string,
};

export enum MCap {
  S = "S",
  M = "M",
  L = "L",
  H = "H",
}


export type UpdateINExchgInput = {
  id: string,
  sid?: string | null,
  name?: string | null,
  exchg?: Exchange | null,
  type?: AssetType | null,
  subt?: AssetSubType | null,
  itype?: InsType | null,
  price?: number | null,
  prev?: number | null,
  fv?: number | null,
  under?: string | null,
  yhigh?: number | null,
  ylow?: number | null,
};

export type DeleteINExchgInput = {
  id: string,
};

export type CreateINExchgMetaInput = {
  id: string,
  mcap?: MCap | null,
  ind?: string | null,
};

export type ModelINExchgMetaConditionInput = {
  mcap?: ModelMCapInput | null,
  ind?: ModelStringInput | null,
  and?: Array< ModelINExchgMetaConditionInput | null > | null,
  or?: Array< ModelINExchgMetaConditionInput | null > | null,
  not?: ModelINExchgMetaConditionInput | null,
};

export type ModelMCapInput = {
  eq?: MCap | null,
  ne?: MCap | null,
};

export type UpdateINExchgMetaInput = {
  id: string,
  mcap?: MCap | null,
  ind?: string | null,
};

export type DeleteINExchgMetaInput = {
  id: string,
};

export type CreateIndicesInput = {
  id: string,
  name: string,
  exchg: Exchange,
  price: number,
  prev?: number | null,
  ylow?: number | null,
  yhigh?: number | null,
  pe?: number | null,
  pb?: number | null,
  type?: AssetType | null,
  subt?: AssetSubType | null,
  curr: string,
  ind?: Industry | null,
};

export enum Industry {
  A = "A",
  B = "B",
  CG = "CG",
  H = "H",
  FMCG = "FMCG",
  IT = "IT",
  MET = "MET",
  OG = "OG",
  PSB = "PSB",
  R = "R",
  MED = "MED",
  TECH = "TECH",
  TC = "TC",
  CD = "CD",
  POW = "POW",
  U = "U",
  I = "I",
  F = "F",
  E = "E",
  CDGS = "CDGS",
  BASM = "BASM",
  PH = "PH",
  PB = "PB",
}


export type ModelIndicesConditionInput = {
  name?: ModelStringInput | null,
  exchg?: ModelExchangeInput | null,
  price?: ModelFloatInput | null,
  prev?: ModelFloatInput | null,
  ylow?: ModelFloatInput | null,
  yhigh?: ModelFloatInput | null,
  pe?: ModelFloatInput | null,
  pb?: ModelFloatInput | null,
  type?: ModelAssetTypeInput | null,
  subt?: ModelAssetSubTypeInput | null,
  curr?: ModelStringInput | null,
  ind?: ModelIndustryInput | null,
  and?: Array< ModelIndicesConditionInput | null > | null,
  or?: Array< ModelIndicesConditionInput | null > | null,
  not?: ModelIndicesConditionInput | null,
};

export type ModelIndustryInput = {
  eq?: Industry | null,
  ne?: Industry | null,
};

export type Indices = {
  __typename: "Indices",
  id?: string,
  name?: string,
  exchg?: Exchange,
  price?: number,
  prev?: number | null,
  ylow?: number | null,
  yhigh?: number | null,
  pe?: number | null,
  pb?: number | null,
  type?: AssetType | null,
  subt?: AssetSubType | null,
  curr?: string,
  ind?: Industry | null,
  createdAt?: string,
  updatedAt?: string,
};

export type UpdateIndicesInput = {
  id: string,
  name?: string | null,
  exchg?: Exchange | null,
  price?: number | null,
  prev?: number | null,
  ylow?: number | null,
  yhigh?: number | null,
  pe?: number | null,
  pb?: number | null,
  type?: AssetType | null,
  subt?: AssetSubType | null,
  curr?: string | null,
  ind?: Industry | null,
};

export type DeleteIndicesInput = {
  id: string,
};

export type CreateINBondInput = {
  id: string,
  sid: string,
  name: string,
  subt: AssetSubType,
  price: number,
  exchg: Exchange,
  sm?: number | null,
  sy?: number | null,
  mm?: number | null,
  my?: number | null,
  rate: number,
  fr: YN,
  tf: YN,
  fv?: number | null,
  cr?: CreditRating | null,
  crstr?: string | null,
  ytm?: number | null,
};

export enum CreditRating {
  E = "E",
  H = "H",
  M = "M",
  L = "L",
  J = "J",
}


export type ModelINBondConditionInput = {
  sid?: ModelStringInput | null,
  name?: ModelStringInput | null,
  subt?: ModelAssetSubTypeInput | null,
  price?: ModelFloatInput | null,
  exchg?: ModelExchangeInput | null,
  sm?: ModelIntInput | null,
  sy?: ModelIntInput | null,
  mm?: ModelIntInput | null,
  my?: ModelIntInput | null,
  rate?: ModelFloatInput | null,
  fr?: ModelYNInput | null,
  tf?: ModelYNInput | null,
  fv?: ModelIntInput | null,
  cr?: ModelCreditRatingInput | null,
  crstr?: ModelStringInput | null,
  ytm?: ModelFloatInput | null,
  and?: Array< ModelINBondConditionInput | null > | null,
  or?: Array< ModelINBondConditionInput | null > | null,
  not?: ModelINBondConditionInput | null,
};

export type ModelCreditRatingInput = {
  eq?: CreditRating | null,
  ne?: CreditRating | null,
};

export type INBond = {
  __typename: "INBond",
  id?: string,
  sid?: string,
  name?: string,
  subt?: AssetSubType,
  price?: number,
  exchg?: Exchange,
  sm?: number | null,
  sy?: number | null,
  mm?: number | null,
  my?: number | null,
  rate?: number,
  fr?: YN,
  tf?: YN,
  fv?: number | null,
  cr?: CreditRating | null,
  crstr?: string | null,
  ytm?: number | null,
  createdAt?: string,
  updatedAt?: string,
};

export type UpdateINBondInput = {
  id: string,
  sid?: string | null,
  name?: string | null,
  subt?: AssetSubType | null,
  price?: number | null,
  exchg?: Exchange | null,
  sm?: number | null,
  sy?: number | null,
  mm?: number | null,
  my?: number | null,
  rate?: number | null,
  fr?: YN | null,
  tf?: YN | null,
  fv?: number | null,
  cr?: CreditRating | null,
  crstr?: string | null,
  ytm?: number | null,
};

export type DeleteINBondInput = {
  id: string,
};

export type CreateINMutualInput = {
  id: string,
  sid: string,
  tid?: string | null,
  dir?: string | null,
  name: string,
  type: AssetType,
  subt: AssetSubType,
  price: number,
  mftype: MFSchemeType,
  mcap?: MCap | null,
  tf?: YN | null,
};

export enum MFSchemeType {
  O = "O",
  C = "C",
  I = "I",
}


export type ModelINMutualConditionInput = {
  sid?: ModelStringInput | null,
  tid?: ModelStringInput | null,
  dir?: ModelStringInput | null,
  name?: ModelStringInput | null,
  type?: ModelAssetTypeInput | null,
  subt?: ModelAssetSubTypeInput | null,
  price?: ModelFloatInput | null,
  mftype?: ModelMFSchemeTypeInput | null,
  mcap?: ModelMCapInput | null,
  tf?: ModelYNInput | null,
  and?: Array< ModelINMutualConditionInput | null > | null,
  or?: Array< ModelINMutualConditionInput | null > | null,
  not?: ModelINMutualConditionInput | null,
};

export type ModelMFSchemeTypeInput = {
  eq?: MFSchemeType | null,
  ne?: MFSchemeType | null,
};

export type INMutual = {
  __typename: "INMutual",
  id?: string,
  sid?: string,
  tid?: string | null,
  dir?: string | null,
  name?: string,
  type?: AssetType,
  subt?: AssetSubType,
  price?: number,
  mftype?: MFSchemeType,
  mcap?: MCap | null,
  tf?: YN | null,
  createdAt?: string,
  updatedAt?: string,
};

export type UpdateINMutualInput = {
  id: string,
  sid?: string | null,
  tid?: string | null,
  dir?: string | null,
  name?: string | null,
  type?: AssetType | null,
  subt?: AssetSubType | null,
  price?: number | null,
  mftype?: MFSchemeType | null,
  mcap?: MCap | null,
  tf?: YN | null,
};

export type DeleteINMutualInput = {
  id: string,
};

export type CreateNPSInput = {
  id: string,
  pfm: NPSPFM,
  st: NPSSchemeType,
  name: string,
  type: AssetType,
  subt: AssetSubType,
  price: number,
};

export enum NPSPFM {
  L = "L",
  H = "H",
  S = "S",
  A = "A",
  I = "I",
  U = "U",
  K = "K",
}


export enum NPSSchemeType {
  T1 = "T1",
  T2 = "T2",
  Lite = "Lite",
  APY = "APY",
  CG = "CG",
  SG = "SG",
  CCG = "CCG",
}


export type ModelNPSConditionInput = {
  pfm?: ModelNPSPFMInput | null,
  st?: ModelNPSSchemeTypeInput | null,
  name?: ModelStringInput | null,
  type?: ModelAssetTypeInput | null,
  subt?: ModelAssetSubTypeInput | null,
  price?: ModelFloatInput | null,
  and?: Array< ModelNPSConditionInput | null > | null,
  or?: Array< ModelNPSConditionInput | null > | null,
  not?: ModelNPSConditionInput | null,
};

export type ModelNPSPFMInput = {
  eq?: NPSPFM | null,
  ne?: NPSPFM | null,
};

export type ModelNPSSchemeTypeInput = {
  eq?: NPSSchemeType | null,
  ne?: NPSSchemeType | null,
};

export type NPS = {
  __typename: "NPS",
  id?: string,
  pfm?: NPSPFM,
  st?: NPSSchemeType,
  name?: string,
  type?: AssetType,
  subt?: AssetSubType,
  price?: number,
  createdAt?: string,
  updatedAt?: string,
};

export type UpdateNPSInput = {
  id: string,
  pfm?: NPSPFM | null,
  st?: NPSSchemeType | null,
  name?: string | null,
  type?: AssetType | null,
  subt?: AssetSubType | null,
  price?: number | null,
};

export type DeleteNPSInput = {
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

export type ModelFeedsFilterInput = {
  id?: ModelStringInput | null,
  tname?: ModelStringInput | null,
  exchg?: ModelExchangeInput | null,
  url?: ModelStringInput | null,
  count?: ModelIntInput | null,
  and?: Array< ModelFeedsFilterInput | null > | null,
  or?: Array< ModelFeedsFilterInput | null > | null,
  not?: ModelFeedsFilterInput | null,
};

export type ModelFeedsConnection = {
  __typename: "ModelFeedsConnection",
  items?:  Array<Feeds | null > | null,
  nextToken?: string | null,
};

export type ModelINExchgFilterInput = {
  id?: ModelStringInput | null,
  sid?: ModelStringInput | null,
  name?: ModelStringInput | null,
  exchg?: ModelExchangeInput | null,
  type?: ModelAssetTypeInput | null,
  subt?: ModelAssetSubTypeInput | null,
  itype?: ModelInsTypeInput | null,
  price?: ModelFloatInput | null,
  prev?: ModelFloatInput | null,
  fv?: ModelIntInput | null,
  under?: ModelStringInput | null,
  yhigh?: ModelFloatInput | null,
  ylow?: ModelFloatInput | null,
  and?: Array< ModelINExchgFilterInput | null > | null,
  or?: Array< ModelINExchgFilterInput | null > | null,
  not?: ModelINExchgFilterInput | null,
};

export type ModelINExchgConnection = {
  __typename: "ModelINExchgConnection",
  items?:  Array<INExchg | null > | null,
  nextToken?: string | null,
};

export type ModelINExchgMetaFilterInput = {
  id?: ModelStringInput | null,
  mcap?: ModelMCapInput | null,
  ind?: ModelStringInput | null,
  and?: Array< ModelINExchgMetaFilterInput | null > | null,
  or?: Array< ModelINExchgMetaFilterInput | null > | null,
  not?: ModelINExchgMetaFilterInput | null,
};

export type ModelINExchgMetaConnection = {
  __typename: "ModelINExchgMetaConnection",
  items?:  Array<INExchgMeta | null > | null,
  nextToken?: string | null,
};

export type ModelIndicesFilterInput = {
  id?: ModelStringInput | null,
  name?: ModelStringInput | null,
  exchg?: ModelExchangeInput | null,
  price?: ModelFloatInput | null,
  prev?: ModelFloatInput | null,
  ylow?: ModelFloatInput | null,
  yhigh?: ModelFloatInput | null,
  pe?: ModelFloatInput | null,
  pb?: ModelFloatInput | null,
  type?: ModelAssetTypeInput | null,
  subt?: ModelAssetSubTypeInput | null,
  curr?: ModelStringInput | null,
  ind?: ModelIndustryInput | null,
  and?: Array< ModelIndicesFilterInput | null > | null,
  or?: Array< ModelIndicesFilterInput | null > | null,
  not?: ModelIndicesFilterInput | null,
};

export type ModelIndicesConnection = {
  __typename: "ModelIndicesConnection",
  items?:  Array<Indices | null > | null,
  nextToken?: string | null,
};

export type ModelINBondFilterInput = {
  id?: ModelStringInput | null,
  sid?: ModelStringInput | null,
  name?: ModelStringInput | null,
  subt?: ModelAssetSubTypeInput | null,
  price?: ModelFloatInput | null,
  exchg?: ModelExchangeInput | null,
  sm?: ModelIntInput | null,
  sy?: ModelIntInput | null,
  mm?: ModelIntInput | null,
  my?: ModelIntInput | null,
  rate?: ModelFloatInput | null,
  fr?: ModelYNInput | null,
  tf?: ModelYNInput | null,
  fv?: ModelIntInput | null,
  cr?: ModelCreditRatingInput | null,
  crstr?: ModelStringInput | null,
  ytm?: ModelFloatInput | null,
  and?: Array< ModelINBondFilterInput | null > | null,
  or?: Array< ModelINBondFilterInput | null > | null,
  not?: ModelINBondFilterInput | null,
};

export type ModelINBondConnection = {
  __typename: "ModelINBondConnection",
  items?:  Array<INBond | null > | null,
  nextToken?: string | null,
};

export type ModelINMutualFilterInput = {
  id?: ModelStringInput | null,
  sid?: ModelStringInput | null,
  tid?: ModelStringInput | null,
  dir?: ModelStringInput | null,
  name?: ModelStringInput | null,
  type?: ModelAssetTypeInput | null,
  subt?: ModelAssetSubTypeInput | null,
  price?: ModelFloatInput | null,
  mftype?: ModelMFSchemeTypeInput | null,
  mcap?: ModelMCapInput | null,
  tf?: ModelYNInput | null,
  and?: Array< ModelINMutualFilterInput | null > | null,
  or?: Array< ModelINMutualFilterInput | null > | null,
  not?: ModelINMutualFilterInput | null,
};

export type ModelINMutualConnection = {
  __typename: "ModelINMutualConnection",
  items?:  Array<INMutual | null > | null,
  nextToken?: string | null,
};

export type ModelNPSFilterInput = {
  id?: ModelStringInput | null,
  pfm?: ModelNPSPFMInput | null,
  st?: ModelNPSSchemeTypeInput | null,
  name?: ModelStringInput | null,
  type?: ModelAssetTypeInput | null,
  subt?: ModelAssetSubTypeInput | null,
  price?: ModelFloatInput | null,
  and?: Array< ModelNPSFilterInput | null > | null,
  or?: Array< ModelNPSFilterInput | null > | null,
  not?: ModelNPSFilterInput | null,
};

export type ModelNPSConnection = {
  __typename: "ModelNPSConnection",
  items?:  Array<NPS | null > | null,
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
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    deposits?:  Array< {
      __typename: "Deposit",
      amt: number,
      sm: number,
      sy: number,
      months: number,
      rate: number,
      fIds: Array< string >,
      curr: string,
    } > | null,
    lendings?:  Array< {
      __typename: "Deposit",
      amt: number,
      sm: number,
      sy: number,
      months: number,
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
      fIds: Array< string >,
    } > | null,
    property?:  Array< {
      __typename: "Property",
      type: PropertyType,
      pin: number,
      purchase?:  {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } | null,
      address?: string | null,
      fIds: Array< string >,
      curr: string,
      country: string,
      own?:  Array< {
        __typename: "Ownership",
        fId: string,
        per: number,
      } > | null,
    } > | null,
    vehicles?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
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
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
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
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
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
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    vpf?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
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
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
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
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
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
    mem?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    angel?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    other?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
      type?: string | null,
      subt?: string | null,
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
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    deposits?:  Array< {
      __typename: "Deposit",
      amt: number,
      sm: number,
      sy: number,
      months: number,
      rate: number,
      fIds: Array< string >,
      curr: string,
    } > | null,
    lendings?:  Array< {
      __typename: "Deposit",
      amt: number,
      sm: number,
      sy: number,
      months: number,
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
      fIds: Array< string >,
    } > | null,
    property?:  Array< {
      __typename: "Property",
      type: PropertyType,
      pin: number,
      purchase?:  {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } | null,
      address?: string | null,
      fIds: Array< string >,
      curr: string,
      country: string,
      own?:  Array< {
        __typename: "Ownership",
        fId: string,
        per: number,
      } > | null,
    } > | null,
    vehicles?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
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
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
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
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
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
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    vpf?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
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
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
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
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
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
    mem?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    angel?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    other?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
      type?: string | null,
      subt?: string | null,
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
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    deposits?:  Array< {
      __typename: "Deposit",
      amt: number,
      sm: number,
      sy: number,
      months: number,
      rate: number,
      fIds: Array< string >,
      curr: string,
    } > | null,
    lendings?:  Array< {
      __typename: "Deposit",
      amt: number,
      sm: number,
      sy: number,
      months: number,
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
      fIds: Array< string >,
    } > | null,
    property?:  Array< {
      __typename: "Property",
      type: PropertyType,
      pin: number,
      purchase?:  {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } | null,
      address?: string | null,
      fIds: Array< string >,
      curr: string,
      country: string,
      own?:  Array< {
        __typename: "Ownership",
        fId: string,
        per: number,
      } > | null,
    } > | null,
    vehicles?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
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
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
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
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
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
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    vpf?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
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
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
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
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
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
    mem?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    angel?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    other?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
      type?: string | null,
      subt?: string | null,
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

export type CreateFeedsMutationVariables = {
  input?: CreateFeedsInput,
  condition?: ModelFeedsConditionInput | null,
};

export type CreateFeedsMutation = {
  createFeeds?:  {
    __typename: "Feeds",
    id: string,
    tname: string,
    exchg?: Exchange | null,
    url?: string | null,
    count: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateFeedsMutationVariables = {
  input?: UpdateFeedsInput,
  condition?: ModelFeedsConditionInput | null,
};

export type UpdateFeedsMutation = {
  updateFeeds?:  {
    __typename: "Feeds",
    id: string,
    tname: string,
    exchg?: Exchange | null,
    url?: string | null,
    count: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteFeedsMutationVariables = {
  input?: DeleteFeedsInput,
  condition?: ModelFeedsConditionInput | null,
};

export type DeleteFeedsMutation = {
  deleteFeeds?:  {
    __typename: "Feeds",
    id: string,
    tname: string,
    exchg?: Exchange | null,
    url?: string | null,
    count: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateInExchgMutationVariables = {
  input?: CreateINExchgInput,
  condition?: ModelINExchgConditionInput | null,
};

export type CreateInExchgMutation = {
  createINExchg?:  {
    __typename: "INExchg",
    id: string,
    sid: string,
    name: string,
    exchg: Exchange,
    type: AssetType,
    subt: AssetSubType,
    itype?: InsType | null,
    price: number,
    prev: number,
    meta?:  {
      __typename: "INExchgMeta",
      id: string,
      mcap?: MCap | null,
      ind?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    fv?: number | null,
    under?: string | null,
    yhigh?: number | null,
    ylow?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateInExchgMutationVariables = {
  input?: UpdateINExchgInput,
  condition?: ModelINExchgConditionInput | null,
};

export type UpdateInExchgMutation = {
  updateINExchg?:  {
    __typename: "INExchg",
    id: string,
    sid: string,
    name: string,
    exchg: Exchange,
    type: AssetType,
    subt: AssetSubType,
    itype?: InsType | null,
    price: number,
    prev: number,
    meta?:  {
      __typename: "INExchgMeta",
      id: string,
      mcap?: MCap | null,
      ind?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    fv?: number | null,
    under?: string | null,
    yhigh?: number | null,
    ylow?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteInExchgMutationVariables = {
  input?: DeleteINExchgInput,
  condition?: ModelINExchgConditionInput | null,
};

export type DeleteInExchgMutation = {
  deleteINExchg?:  {
    __typename: "INExchg",
    id: string,
    sid: string,
    name: string,
    exchg: Exchange,
    type: AssetType,
    subt: AssetSubType,
    itype?: InsType | null,
    price: number,
    prev: number,
    meta?:  {
      __typename: "INExchgMeta",
      id: string,
      mcap?: MCap | null,
      ind?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    fv?: number | null,
    under?: string | null,
    yhigh?: number | null,
    ylow?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateInExchgMetaMutationVariables = {
  input?: CreateINExchgMetaInput,
  condition?: ModelINExchgMetaConditionInput | null,
};

export type CreateInExchgMetaMutation = {
  createINExchgMeta?:  {
    __typename: "INExchgMeta",
    id: string,
    mcap?: MCap | null,
    ind?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateInExchgMetaMutationVariables = {
  input?: UpdateINExchgMetaInput,
  condition?: ModelINExchgMetaConditionInput | null,
};

export type UpdateInExchgMetaMutation = {
  updateINExchgMeta?:  {
    __typename: "INExchgMeta",
    id: string,
    mcap?: MCap | null,
    ind?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteInExchgMetaMutationVariables = {
  input?: DeleteINExchgMetaInput,
  condition?: ModelINExchgMetaConditionInput | null,
};

export type DeleteInExchgMetaMutation = {
  deleteINExchgMeta?:  {
    __typename: "INExchgMeta",
    id: string,
    mcap?: MCap | null,
    ind?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateIndicesMutationVariables = {
  input?: CreateIndicesInput,
  condition?: ModelIndicesConditionInput | null,
};

export type CreateIndicesMutation = {
  createIndices?:  {
    __typename: "Indices",
    id: string,
    name: string,
    exchg: Exchange,
    price: number,
    prev?: number | null,
    ylow?: number | null,
    yhigh?: number | null,
    pe?: number | null,
    pb?: number | null,
    type?: AssetType | null,
    subt?: AssetSubType | null,
    curr: string,
    ind?: Industry | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateIndicesMutationVariables = {
  input?: UpdateIndicesInput,
  condition?: ModelIndicesConditionInput | null,
};

export type UpdateIndicesMutation = {
  updateIndices?:  {
    __typename: "Indices",
    id: string,
    name: string,
    exchg: Exchange,
    price: number,
    prev?: number | null,
    ylow?: number | null,
    yhigh?: number | null,
    pe?: number | null,
    pb?: number | null,
    type?: AssetType | null,
    subt?: AssetSubType | null,
    curr: string,
    ind?: Industry | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteIndicesMutationVariables = {
  input?: DeleteIndicesInput,
  condition?: ModelIndicesConditionInput | null,
};

export type DeleteIndicesMutation = {
  deleteIndices?:  {
    __typename: "Indices",
    id: string,
    name: string,
    exchg: Exchange,
    price: number,
    prev?: number | null,
    ylow?: number | null,
    yhigh?: number | null,
    pe?: number | null,
    pb?: number | null,
    type?: AssetType | null,
    subt?: AssetSubType | null,
    curr: string,
    ind?: Industry | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateInBondMutationVariables = {
  input?: CreateINBondInput,
  condition?: ModelINBondConditionInput | null,
};

export type CreateInBondMutation = {
  createINBond?:  {
    __typename: "INBond",
    id: string,
    sid: string,
    name: string,
    subt: AssetSubType,
    price: number,
    exchg: Exchange,
    sm?: number | null,
    sy?: number | null,
    mm?: number | null,
    my?: number | null,
    rate: number,
    fr: YN,
    tf: YN,
    fv?: number | null,
    cr?: CreditRating | null,
    crstr?: string | null,
    ytm?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateInBondMutationVariables = {
  input?: UpdateINBondInput,
  condition?: ModelINBondConditionInput | null,
};

export type UpdateInBondMutation = {
  updateINBond?:  {
    __typename: "INBond",
    id: string,
    sid: string,
    name: string,
    subt: AssetSubType,
    price: number,
    exchg: Exchange,
    sm?: number | null,
    sy?: number | null,
    mm?: number | null,
    my?: number | null,
    rate: number,
    fr: YN,
    tf: YN,
    fv?: number | null,
    cr?: CreditRating | null,
    crstr?: string | null,
    ytm?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteInBondMutationVariables = {
  input?: DeleteINBondInput,
  condition?: ModelINBondConditionInput | null,
};

export type DeleteInBondMutation = {
  deleteINBond?:  {
    __typename: "INBond",
    id: string,
    sid: string,
    name: string,
    subt: AssetSubType,
    price: number,
    exchg: Exchange,
    sm?: number | null,
    sy?: number | null,
    mm?: number | null,
    my?: number | null,
    rate: number,
    fr: YN,
    tf: YN,
    fv?: number | null,
    cr?: CreditRating | null,
    crstr?: string | null,
    ytm?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateInMutualMutationVariables = {
  input?: CreateINMutualInput,
  condition?: ModelINMutualConditionInput | null,
};

export type CreateInMutualMutation = {
  createINMutual?:  {
    __typename: "INMutual",
    id: string,
    sid: string,
    tid?: string | null,
    dir?: string | null,
    name: string,
    type: AssetType,
    subt: AssetSubType,
    price: number,
    mftype: MFSchemeType,
    mcap?: MCap | null,
    tf?: YN | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateInMutualMutationVariables = {
  input?: UpdateINMutualInput,
  condition?: ModelINMutualConditionInput | null,
};

export type UpdateInMutualMutation = {
  updateINMutual?:  {
    __typename: "INMutual",
    id: string,
    sid: string,
    tid?: string | null,
    dir?: string | null,
    name: string,
    type: AssetType,
    subt: AssetSubType,
    price: number,
    mftype: MFSchemeType,
    mcap?: MCap | null,
    tf?: YN | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteInMutualMutationVariables = {
  input?: DeleteINMutualInput,
  condition?: ModelINMutualConditionInput | null,
};

export type DeleteInMutualMutation = {
  deleteINMutual?:  {
    __typename: "INMutual",
    id: string,
    sid: string,
    tid?: string | null,
    dir?: string | null,
    name: string,
    type: AssetType,
    subt: AssetSubType,
    price: number,
    mftype: MFSchemeType,
    mcap?: MCap | null,
    tf?: YN | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateNpsMutationVariables = {
  input?: CreateNPSInput,
  condition?: ModelNPSConditionInput | null,
};

export type CreateNpsMutation = {
  createNPS?:  {
    __typename: "NPS",
    id: string,
    pfm: NPSPFM,
    st: NPSSchemeType,
    name: string,
    type: AssetType,
    subt: AssetSubType,
    price: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateNpsMutationVariables = {
  input?: UpdateNPSInput,
  condition?: ModelNPSConditionInput | null,
};

export type UpdateNpsMutation = {
  updateNPS?:  {
    __typename: "NPS",
    id: string,
    pfm: NPSPFM,
    st: NPSSchemeType,
    name: string,
    type: AssetType,
    subt: AssetSubType,
    price: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteNpsMutationVariables = {
  input?: DeleteNPSInput,
  condition?: ModelNPSConditionInput | null,
};

export type DeleteNpsMutation = {
  deleteNPS?:  {
    __typename: "NPS",
    id: string,
    pfm: NPSPFM,
    st: NPSSchemeType,
    name: string,
    type: AssetType,
    subt: AssetSubType,
    price: number,
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

export type GetFeedsQueryVariables = {
  id?: string,
};

export type GetFeedsQuery = {
  getFeeds?:  {
    __typename: "Feeds",
    id: string,
    tname: string,
    exchg?: Exchange | null,
    url?: string | null,
    count: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListFeedssQueryVariables = {
  id?: string | null,
  filter?: ModelFeedsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListFeedssQuery = {
  listFeedss?:  {
    __typename: "ModelFeedsConnection",
    items?:  Array< {
      __typename: "Feeds",
      id: string,
      tname: string,
      exchg?: Exchange | null,
      url?: string | null,
      count: number,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetInExchgQueryVariables = {
  id?: string,
};

export type GetInExchgQuery = {
  getINExchg?:  {
    __typename: "INExchg",
    id: string,
    sid: string,
    name: string,
    exchg: Exchange,
    type: AssetType,
    subt: AssetSubType,
    itype?: InsType | null,
    price: number,
    prev: number,
    meta?:  {
      __typename: "INExchgMeta",
      id: string,
      mcap?: MCap | null,
      ind?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    fv?: number | null,
    under?: string | null,
    yhigh?: number | null,
    ylow?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListInExchgsQueryVariables = {
  id?: string | null,
  filter?: ModelINExchgFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListInExchgsQuery = {
  listINExchgs?:  {
    __typename: "ModelINExchgConnection",
    items?:  Array< {
      __typename: "INExchg",
      id: string,
      sid: string,
      name: string,
      exchg: Exchange,
      type: AssetType,
      subt: AssetSubType,
      itype?: InsType | null,
      price: number,
      prev: number,
      meta?:  {
        __typename: "INExchgMeta",
        id: string,
        mcap?: MCap | null,
        ind?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      fv?: number | null,
      under?: string | null,
      yhigh?: number | null,
      ylow?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetInExchgMetaQueryVariables = {
  id?: string,
};

export type GetInExchgMetaQuery = {
  getINExchgMeta?:  {
    __typename: "INExchgMeta",
    id: string,
    mcap?: MCap | null,
    ind?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListInExchgMetasQueryVariables = {
  id?: string | null,
  filter?: ModelINExchgMetaFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListInExchgMetasQuery = {
  listINExchgMetas?:  {
    __typename: "ModelINExchgMetaConnection",
    items?:  Array< {
      __typename: "INExchgMeta",
      id: string,
      mcap?: MCap | null,
      ind?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetIndicesQueryVariables = {
  id?: string,
};

export type GetIndicesQuery = {
  getIndices?:  {
    __typename: "Indices",
    id: string,
    name: string,
    exchg: Exchange,
    price: number,
    prev?: number | null,
    ylow?: number | null,
    yhigh?: number | null,
    pe?: number | null,
    pb?: number | null,
    type?: AssetType | null,
    subt?: AssetSubType | null,
    curr: string,
    ind?: Industry | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListIndicessQueryVariables = {
  id?: string | null,
  filter?: ModelIndicesFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListIndicessQuery = {
  listIndicess?:  {
    __typename: "ModelIndicesConnection",
    items?:  Array< {
      __typename: "Indices",
      id: string,
      name: string,
      exchg: Exchange,
      price: number,
      prev?: number | null,
      ylow?: number | null,
      yhigh?: number | null,
      pe?: number | null,
      pb?: number | null,
      type?: AssetType | null,
      subt?: AssetSubType | null,
      curr: string,
      ind?: Industry | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetInBondQueryVariables = {
  id?: string,
};

export type GetInBondQuery = {
  getINBond?:  {
    __typename: "INBond",
    id: string,
    sid: string,
    name: string,
    subt: AssetSubType,
    price: number,
    exchg: Exchange,
    sm?: number | null,
    sy?: number | null,
    mm?: number | null,
    my?: number | null,
    rate: number,
    fr: YN,
    tf: YN,
    fv?: number | null,
    cr?: CreditRating | null,
    crstr?: string | null,
    ytm?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListInBondsQueryVariables = {
  id?: string | null,
  filter?: ModelINBondFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListInBondsQuery = {
  listINBonds?:  {
    __typename: "ModelINBondConnection",
    items?:  Array< {
      __typename: "INBond",
      id: string,
      sid: string,
      name: string,
      subt: AssetSubType,
      price: number,
      exchg: Exchange,
      sm?: number | null,
      sy?: number | null,
      mm?: number | null,
      my?: number | null,
      rate: number,
      fr: YN,
      tf: YN,
      fv?: number | null,
      cr?: CreditRating | null,
      crstr?: string | null,
      ytm?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetInMutualQueryVariables = {
  id?: string,
};

export type GetInMutualQuery = {
  getINMutual?:  {
    __typename: "INMutual",
    id: string,
    sid: string,
    tid?: string | null,
    dir?: string | null,
    name: string,
    type: AssetType,
    subt: AssetSubType,
    price: number,
    mftype: MFSchemeType,
    mcap?: MCap | null,
    tf?: YN | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListInMutualsQueryVariables = {
  id?: string | null,
  filter?: ModelINMutualFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListInMutualsQuery = {
  listINMutuals?:  {
    __typename: "ModelINMutualConnection",
    items?:  Array< {
      __typename: "INMutual",
      id: string,
      sid: string,
      tid?: string | null,
      dir?: string | null,
      name: string,
      type: AssetType,
      subt: AssetSubType,
      price: number,
      mftype: MFSchemeType,
      mcap?: MCap | null,
      tf?: YN | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetNpsQueryVariables = {
  id?: string,
};

export type GetNpsQuery = {
  getNPS?:  {
    __typename: "NPS",
    id: string,
    pfm: NPSPFM,
    st: NPSSchemeType,
    name: string,
    type: AssetType,
    subt: AssetSubType,
    price: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListNpSsQueryVariables = {
  id?: string | null,
  filter?: ModelNPSFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListNpSsQuery = {
  listNPSs?:  {
    __typename: "ModelNPSConnection",
    items?:  Array< {
      __typename: "NPS",
      id: string,
      pfm: NPSPFM,
      st: NPSSchemeType,
      name: string,
      type: AssetType,
      subt: AssetSubType,
      price: number,
      createdAt: string,
      updatedAt: string,
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
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    deposits?:  Array< {
      __typename: "Deposit",
      amt: number,
      sm: number,
      sy: number,
      months: number,
      rate: number,
      fIds: Array< string >,
      curr: string,
    } > | null,
    lendings?:  Array< {
      __typename: "Deposit",
      amt: number,
      sm: number,
      sy: number,
      months: number,
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
      fIds: Array< string >,
    } > | null,
    property?:  Array< {
      __typename: "Property",
      type: PropertyType,
      pin: number,
      purchase?:  {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } | null,
      address?: string | null,
      fIds: Array< string >,
      curr: string,
      country: string,
      own?:  Array< {
        __typename: "Ownership",
        fId: string,
        per: number,
      } > | null,
    } > | null,
    vehicles?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
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
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
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
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
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
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    vpf?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
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
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
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
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
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
    mem?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    angel?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    other?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
      type?: string | null,
      subt?: string | null,
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
        chgF?: number | null,
        type?: string | null,
        subt?: string | null,
      } > | null,
      deposits?:  Array< {
        __typename: "Deposit",
        amt: number,
        sm: number,
        sy: number,
        months: number,
        rate: number,
        fIds: Array< string >,
        curr: string,
      } > | null,
      lendings?:  Array< {
        __typename: "Deposit",
        amt: number,
        sm: number,
        sy: number,
        months: number,
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
        fIds: Array< string >,
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
        chgF?: number | null,
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
        chgF?: number | null,
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
        chgF?: number | null,
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
        chgF?: number | null,
        type?: string | null,
        subt?: string | null,
      } > | null,
      vpf?:  Array< {
        __typename: "Holding",
        id: string,
        qty: number,
        name?: string | null,
        fIds: Array< string >,
        curr?: string | null,
        chg?: number | null,
        chgF?: number | null,
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
        chgF?: number | null,
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
        chgF?: number | null,
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
      mem?:  Array< {
        __typename: "Holding",
        id: string,
        qty: number,
        name?: string | null,
        fIds: Array< string >,
        curr?: string | null,
        chg?: number | null,
        chgF?: number | null,
        type?: string | null,
        subt?: string | null,
      } > | null,
      angel?:  Array< {
        __typename: "Holding",
        id: string,
        qty: number,
        name?: string | null,
        fIds: Array< string >,
        curr?: string | null,
        chg?: number | null,
        chgF?: number | null,
        type?: string | null,
        subt?: string | null,
      } > | null,
      other?:  Array< {
        __typename: "Holding",
        id: string,
        qty: number,
        name?: string | null,
        fIds: Array< string >,
        curr?: string | null,
        chg?: number | null,
        chgF?: number | null,
        type?: string | null,
        subt?: string | null,
      } > | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
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

export type OnCreateFeedsSubscription = {
  onCreateFeeds?:  {
    __typename: "Feeds",
    id: string,
    tname: string,
    exchg?: Exchange | null,
    url?: string | null,
    count: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateFeedsSubscription = {
  onUpdateFeeds?:  {
    __typename: "Feeds",
    id: string,
    tname: string,
    exchg?: Exchange | null,
    url?: string | null,
    count: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteFeedsSubscription = {
  onDeleteFeeds?:  {
    __typename: "Feeds",
    id: string,
    tname: string,
    exchg?: Exchange | null,
    url?: string | null,
    count: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateInExchgSubscription = {
  onCreateINExchg?:  {
    __typename: "INExchg",
    id: string,
    sid: string,
    name: string,
    exchg: Exchange,
    type: AssetType,
    subt: AssetSubType,
    itype?: InsType | null,
    price: number,
    prev: number,
    meta?:  {
      __typename: "INExchgMeta",
      id: string,
      mcap?: MCap | null,
      ind?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    fv?: number | null,
    under?: string | null,
    yhigh?: number | null,
    ylow?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateInExchgSubscription = {
  onUpdateINExchg?:  {
    __typename: "INExchg",
    id: string,
    sid: string,
    name: string,
    exchg: Exchange,
    type: AssetType,
    subt: AssetSubType,
    itype?: InsType | null,
    price: number,
    prev: number,
    meta?:  {
      __typename: "INExchgMeta",
      id: string,
      mcap?: MCap | null,
      ind?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    fv?: number | null,
    under?: string | null,
    yhigh?: number | null,
    ylow?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteInExchgSubscription = {
  onDeleteINExchg?:  {
    __typename: "INExchg",
    id: string,
    sid: string,
    name: string,
    exchg: Exchange,
    type: AssetType,
    subt: AssetSubType,
    itype?: InsType | null,
    price: number,
    prev: number,
    meta?:  {
      __typename: "INExchgMeta",
      id: string,
      mcap?: MCap | null,
      ind?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    fv?: number | null,
    under?: string | null,
    yhigh?: number | null,
    ylow?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateInExchgMetaSubscription = {
  onCreateINExchgMeta?:  {
    __typename: "INExchgMeta",
    id: string,
    mcap?: MCap | null,
    ind?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateInExchgMetaSubscription = {
  onUpdateINExchgMeta?:  {
    __typename: "INExchgMeta",
    id: string,
    mcap?: MCap | null,
    ind?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteInExchgMetaSubscription = {
  onDeleteINExchgMeta?:  {
    __typename: "INExchgMeta",
    id: string,
    mcap?: MCap | null,
    ind?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateIndicesSubscription = {
  onCreateIndices?:  {
    __typename: "Indices",
    id: string,
    name: string,
    exchg: Exchange,
    price: number,
    prev?: number | null,
    ylow?: number | null,
    yhigh?: number | null,
    pe?: number | null,
    pb?: number | null,
    type?: AssetType | null,
    subt?: AssetSubType | null,
    curr: string,
    ind?: Industry | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateIndicesSubscription = {
  onUpdateIndices?:  {
    __typename: "Indices",
    id: string,
    name: string,
    exchg: Exchange,
    price: number,
    prev?: number | null,
    ylow?: number | null,
    yhigh?: number | null,
    pe?: number | null,
    pb?: number | null,
    type?: AssetType | null,
    subt?: AssetSubType | null,
    curr: string,
    ind?: Industry | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteIndicesSubscription = {
  onDeleteIndices?:  {
    __typename: "Indices",
    id: string,
    name: string,
    exchg: Exchange,
    price: number,
    prev?: number | null,
    ylow?: number | null,
    yhigh?: number | null,
    pe?: number | null,
    pb?: number | null,
    type?: AssetType | null,
    subt?: AssetSubType | null,
    curr: string,
    ind?: Industry | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateInBondSubscription = {
  onCreateINBond?:  {
    __typename: "INBond",
    id: string,
    sid: string,
    name: string,
    subt: AssetSubType,
    price: number,
    exchg: Exchange,
    sm?: number | null,
    sy?: number | null,
    mm?: number | null,
    my?: number | null,
    rate: number,
    fr: YN,
    tf: YN,
    fv?: number | null,
    cr?: CreditRating | null,
    crstr?: string | null,
    ytm?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateInBondSubscription = {
  onUpdateINBond?:  {
    __typename: "INBond",
    id: string,
    sid: string,
    name: string,
    subt: AssetSubType,
    price: number,
    exchg: Exchange,
    sm?: number | null,
    sy?: number | null,
    mm?: number | null,
    my?: number | null,
    rate: number,
    fr: YN,
    tf: YN,
    fv?: number | null,
    cr?: CreditRating | null,
    crstr?: string | null,
    ytm?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteInBondSubscription = {
  onDeleteINBond?:  {
    __typename: "INBond",
    id: string,
    sid: string,
    name: string,
    subt: AssetSubType,
    price: number,
    exchg: Exchange,
    sm?: number | null,
    sy?: number | null,
    mm?: number | null,
    my?: number | null,
    rate: number,
    fr: YN,
    tf: YN,
    fv?: number | null,
    cr?: CreditRating | null,
    crstr?: string | null,
    ytm?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateInMutualSubscription = {
  onCreateINMutual?:  {
    __typename: "INMutual",
    id: string,
    sid: string,
    tid?: string | null,
    dir?: string | null,
    name: string,
    type: AssetType,
    subt: AssetSubType,
    price: number,
    mftype: MFSchemeType,
    mcap?: MCap | null,
    tf?: YN | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateInMutualSubscription = {
  onUpdateINMutual?:  {
    __typename: "INMutual",
    id: string,
    sid: string,
    tid?: string | null,
    dir?: string | null,
    name: string,
    type: AssetType,
    subt: AssetSubType,
    price: number,
    mftype: MFSchemeType,
    mcap?: MCap | null,
    tf?: YN | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteInMutualSubscription = {
  onDeleteINMutual?:  {
    __typename: "INMutual",
    id: string,
    sid: string,
    tid?: string | null,
    dir?: string | null,
    name: string,
    type: AssetType,
    subt: AssetSubType,
    price: number,
    mftype: MFSchemeType,
    mcap?: MCap | null,
    tf?: YN | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateNpsSubscription = {
  onCreateNPS?:  {
    __typename: "NPS",
    id: string,
    pfm: NPSPFM,
    st: NPSSchemeType,
    name: string,
    type: AssetType,
    subt: AssetSubType,
    price: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateNpsSubscription = {
  onUpdateNPS?:  {
    __typename: "NPS",
    id: string,
    pfm: NPSPFM,
    st: NPSSchemeType,
    name: string,
    type: AssetType,
    subt: AssetSubType,
    price: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteNpsSubscription = {
  onDeleteNPS?:  {
    __typename: "NPS",
    id: string,
    pfm: NPSPFM,
    st: NPSSchemeType,
    name: string,
    type: AssetType,
    subt: AssetSubType,
    price: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateHoldingsSubscriptionVariables = {
  owner?: string | null,
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
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    deposits?:  Array< {
      __typename: "Deposit",
      amt: number,
      sm: number,
      sy: number,
      months: number,
      rate: number,
      fIds: Array< string >,
      curr: string,
    } > | null,
    lendings?:  Array< {
      __typename: "Deposit",
      amt: number,
      sm: number,
      sy: number,
      months: number,
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
      fIds: Array< string >,
    } > | null,
    property?:  Array< {
      __typename: "Property",
      type: PropertyType,
      pin: number,
      purchase?:  {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } | null,
      address?: string | null,
      fIds: Array< string >,
      curr: string,
      country: string,
      own?:  Array< {
        __typename: "Ownership",
        fId: string,
        per: number,
      } > | null,
    } > | null,
    vehicles?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
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
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
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
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
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
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    vpf?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
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
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
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
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
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
    mem?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    angel?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    other?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnUpdateHoldingsSubscriptionVariables = {
  owner?: string | null,
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
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    deposits?:  Array< {
      __typename: "Deposit",
      amt: number,
      sm: number,
      sy: number,
      months: number,
      rate: number,
      fIds: Array< string >,
      curr: string,
    } > | null,
    lendings?:  Array< {
      __typename: "Deposit",
      amt: number,
      sm: number,
      sy: number,
      months: number,
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
      fIds: Array< string >,
    } > | null,
    property?:  Array< {
      __typename: "Property",
      type: PropertyType,
      pin: number,
      purchase?:  {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } | null,
      address?: string | null,
      fIds: Array< string >,
      curr: string,
      country: string,
      own?:  Array< {
        __typename: "Ownership",
        fId: string,
        per: number,
      } > | null,
    } > | null,
    vehicles?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
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
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
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
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
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
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    vpf?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
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
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
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
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
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
    mem?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    angel?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    other?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnDeleteHoldingsSubscriptionVariables = {
  owner?: string | null,
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
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    deposits?:  Array< {
      __typename: "Deposit",
      amt: number,
      sm: number,
      sy: number,
      months: number,
      rate: number,
      fIds: Array< string >,
      curr: string,
    } > | null,
    lendings?:  Array< {
      __typename: "Deposit",
      amt: number,
      sm: number,
      sy: number,
      months: number,
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
      fIds: Array< string >,
    } > | null,
    property?:  Array< {
      __typename: "Property",
      type: PropertyType,
      pin: number,
      purchase?:  {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } | null,
      address?: string | null,
      fIds: Array< string >,
      curr: string,
      country: string,
      own?:  Array< {
        __typename: "Ownership",
        fId: string,
        per: number,
      } > | null,
    } > | null,
    vehicles?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
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
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
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
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
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
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    vpf?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
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
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
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
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
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
    mem?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    angel?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    other?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      name?: string | null,
      fIds: Array< string >,
      curr?: string | null,
      chg?: number | null,
      chgF?: number | null,
      type?: string | null,
      subt?: string | null,
    } > | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
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
