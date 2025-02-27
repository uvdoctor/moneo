/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type UpdateFeedbackInput = {
  id: string,
  type?: FeedbackType | null,
  email?: string | null,
  name?: NameInput | null,
  feedback?: string | null,
  uname?: string | null,
};

export enum FeedbackType {
  C = "C",
  S = "S",
  Q = "Q",
}


export type NameInput = {
  fn: string,
  ln?: string | null,
};

export type ModelFeedbackConditionInput = {
  type?: ModelFeedbackTypeInput | null,
  email?: ModelStringInput | null,
  feedback?: ModelStringInput | null,
  uname?: ModelStringInput | null,
  and?: Array< ModelFeedbackConditionInput | null > | null,
  or?: Array< ModelFeedbackConditionInput | null > | null,
  not?: ModelFeedbackConditionInput | null,
};

export type ModelFeedbackTypeInput = {
  eq?: FeedbackType | null,
  ne?: FeedbackType | null,
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
  id: string,
  type: FeedbackType,
  email: string,
  name: Name,
  feedback: string,
  uname?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type Name = {
  __typename: "Name",
  fn: string,
  ln?: string | null,
};

export type DeleteFeedbackInput = {
  id: string,
};

export type UpdateRatingInput = {
  id: string,
  type?: CalcType | null,
  rating?: number | null,
  feedbackId?: string | null,
};

export enum CalcType {
  BR = "BR",
  FI = "FI",
  LOAN = "LOAN",
  EDU_LOAN = "EDU_LOAN",
  DR = "DR",
  TC = "TC",
}


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
  id: string,
  type: CalcType,
  rating: number,
  feedbackId?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type DeleteRatingInput = {
  id: string,
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
  met?: boolean | null,
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
  pp?: PPInput | null,
  rp?: RiskProfile | null,
  bt?: BuyType | null,
  rc?: number | null,
  rcchg?: number | null,
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


export type PPInput = {
  cash: number,
  ltdep: number,
  mtb?: number | null,
  imtb?: number | null,
  hyb?: number | null,
  ihyb?: number | null,
  teb?: number | null,
  reit?: number | null,
  ireit?: number | null,
  reitETF?: number | null,
  ireitETF?: number | null,
  re?: number | null,
  gold?: number | null,
  goldb?: number | null,
  lcs?: number | null,
  lcetf?: number | null,
  ilcs?: number | null,
  ilcetf?: number | null,
  mscs?: number | null,
  imscs?: number | null,
  dgs?: number | null,
  uc?: number | null,
  crypto?: number | null,
  p2p?: number | null,
};

export enum RiskProfile {
  VC = "VC",
  C = "C",
  M = "M",
  A = "A",
  VA = "VA",
}


export enum BuyType {
  P = "P",
  V = "V",
  O = "O",
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
  met?: ModelBooleanInput | null,
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
  rp?: ModelRiskProfileInput | null,
  bt?: ModelBuyTypeInput | null,
  rc?: ModelIntInput | null,
  rcchg?: ModelFloatInput | null,
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

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelRiskProfileInput = {
  eq?: RiskProfile | null,
  ne?: RiskProfile | null,
};

export type ModelBuyTypeInput = {
  eq?: BuyType | null,
  ne?: BuyType | null,
};

export type Goal = {
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
  tgts?:  Array<Target > | null,
  loan?: Loan | null,
  imp: LMH,
  met?: boolean | null,
  prob?: LMH | null,
  manual: number,
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
  pp?: PP | null,
  rp?: RiskProfile | null,
  bt?: BuyType | null,
  rc?: number | null,
  rcchg?: number | null,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type Target = {
  __typename: "Target",
  num: number,
  val: number,
};

export type Loan = {
  __typename: "Loan",
  type: LoanType,
  per: number,
  rate?: number | null,
  dur: number,
  ry: number,
  pp?:  Array<Target > | null,
  ira?:  Array<Target > | null,
  emi?: number | null,
  pmi?: number | null,
  peper?: number | null,
};

export type PP = {
  __typename: "PP",
  cash: number,
  ltdep: number,
  mtb?: number | null,
  imtb?: number | null,
  hyb?: number | null,
  ihyb?: number | null,
  teb?: number | null,
  reit?: number | null,
  ireit?: number | null,
  reitETF?: number | null,
  ireitETF?: number | null,
  re?: number | null,
  gold?: number | null,
  goldb?: number | null,
  lcs?: number | null,
  lcetf?: number | null,
  ilcs?: number | null,
  ilcetf?: number | null,
  mscs?: number | null,
  imscs?: number | null,
  dgs?: number | null,
  uc?: number | null,
  crypto?: number | null,
  p2p?: number | null,
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
  met?: boolean | null,
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
  pp?: PPInput | null,
  rp?: RiskProfile | null,
  bt?: BuyType | null,
  rc?: number | null,
  rcchg?: number | null,
};

export type DeleteGoalInput = {
  id: string,
};

export type CreateUserInfoInput = {
  uname: string,
  email: string,
  dob: string,
  im?: number | null,
  mob?: number | null,
  notify: boolean,
  tax: TaxLiability,
  rp: RiskProfile,
  dr: number,
  tc: string,
  ta?: number | null,
  tid?: string | null,
  exp?: number | null,
  invest?: number | null,
};

export enum TaxLiability {
  NIL = "NIL",
  L = "L",
  M = "M",
  H = "H",
  VH = "VH",
}


export type ModelUserInfoConditionInput = {
  email?: ModelStringInput | null,
  dob?: ModelStringInput | null,
  im?: ModelFloatInput | null,
  mob?: ModelFloatInput | null,
  notify?: ModelBooleanInput | null,
  tax?: ModelTaxLiabilityInput | null,
  rp?: ModelRiskProfileInput | null,
  dr?: ModelFloatInput | null,
  tc?: ModelStringInput | null,
  ta?: ModelFloatInput | null,
  tid?: ModelStringInput | null,
  exp?: ModelIntInput | null,
  invest?: ModelIntInput | null,
  and?: Array< ModelUserInfoConditionInput | null > | null,
  or?: Array< ModelUserInfoConditionInput | null > | null,
  not?: ModelUserInfoConditionInput | null,
};

export type ModelTaxLiabilityInput = {
  eq?: TaxLiability | null,
  ne?: TaxLiability | null,
};

export type UserInfo = {
  __typename: "UserInfo",
  uname: string,
  email: string,
  dob: string,
  im?: number | null,
  mob?: number | null,
  notify: boolean,
  tax: TaxLiability,
  rp: RiskProfile,
  dr: number,
  tc: string,
  ta?: number | null,
  tid?: string | null,
  exp?: number | null,
  invest?: number | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateUserInfoInput = {
  uname: string,
  email?: string | null,
  dob?: string | null,
  im?: number | null,
  mob?: number | null,
  notify?: boolean | null,
  tax?: TaxLiability | null,
  rp?: RiskProfile | null,
  dr?: number | null,
  tc?: string | null,
  ta?: number | null,
  tid?: string | null,
  exp?: number | null,
  invest?: number | null,
};

export type DeleteUserInfoInput = {
  uname: string,
};

export type CreateFamilyInput = {
  id?: string | null,
  tid: string,
  name: string,
  tax: TaxLiability,
};

export type ModelFamilyConditionInput = {
  tid?: ModelStringInput | null,
  name?: ModelStringInput | null,
  tax?: ModelTaxLiabilityInput | null,
  and?: Array< ModelFamilyConditionInput | null > | null,
  or?: Array< ModelFamilyConditionInput | null > | null,
  not?: ModelFamilyConditionInput | null,
};

export type Family = {
  __typename: "Family",
  id: string,
  tid: string,
  name: string,
  tax: TaxLiability,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type UpdateFamilyInput = {
  id: string,
  tid?: string | null,
  name?: string | null,
  tax?: TaxLiability | null,
};

export type DeleteFamilyInput = {
  id: string,
};

export type CreateUserHoldingsInput = {
  uname: string,
  dep?: Array< HoldingInput > | null,
  ltdep?: Array< HoldingInput > | null,
  p2p?: Array< HoldingInput > | null,
  loans?: Array< HoldingInput > | null,
  credit?: Array< HoldingInput > | null,
  savings?: Array< HoldingInput > | null,
  property?: Array< PropertyInput > | null,
  vehicles?: Array< HoldingInput > | null,
  pm?: Array< HoldingInput > | null,
  pf?: Array< HoldingInput > | null,
  nps?: Array< HoldingInput > | null,
  crypto?: Array< HoldingInput > | null,
  ins?: Array< HoldingInput > | null,
  other?: Array< HoldingInput > | null,
  angel?: Array< HoldingInput > | null,
};

export type HoldingInput = {
  id: string,
  qty: number,
  name?: string | null,
  fId: string,
  curr: string,
  chg?: number | null,
  chgF?: number | null,
  payF?: number | null,
  type?: string | null,
  subt?: string | null,
  sm?: number | null,
  sy?: number | null,
  em?: number | null,
  ey?: number | null,
  amt?: number | null,
  pur?: Array< PurchaseInput > | null,
};

export type PurchaseInput = {
  amt: number,
  day?: number | null,
  month: number,
  year: number,
  qty: number,
};

export type PropertyInput = {
  type: PropertyType,
  name?: string | null,
  pin?: number | null,
  purchase?: PurchaseInput | null,
  address?: string | null,
  curr: string,
  city?: string | null,
  country?: string | null,
  state?: string | null,
  own: Array< OwnershipInput >,
  rate: number,
  mv?: number | null,
  mvy?: number | null,
  mvm?: number | null,
  res: boolean,
};

export enum PropertyType {
  P = "P",
  A = "A",
  H = "H",
  C = "C",
  COMM = "COMM",
  T = "T",
  OTHER = "OTHER",
}


export type OwnershipInput = {
  fId: string,
  per: number,
};

export type ModelUserHoldingsConditionInput = {
  and?: Array< ModelUserHoldingsConditionInput | null > | null,
  or?: Array< ModelUserHoldingsConditionInput | null > | null,
  not?: ModelUserHoldingsConditionInput | null,
};

export type UserHoldings = {
  __typename: "UserHoldings",
  uname: string,
  dep?:  Array<Holding > | null,
  ltdep?:  Array<Holding > | null,
  p2p?:  Array<Holding > | null,
  loans?:  Array<Holding > | null,
  credit?:  Array<Holding > | null,
  savings?:  Array<Holding > | null,
  property?:  Array<Property > | null,
  vehicles?:  Array<Holding > | null,
  pm?:  Array<Holding > | null,
  pf?:  Array<Holding > | null,
  nps?:  Array<Holding > | null,
  crypto?:  Array<Holding > | null,
  ins?:  Array<Holding > | null,
  other?:  Array<Holding > | null,
  angel?:  Array<Holding > | null,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type Holding = {
  __typename: "Holding",
  id: string,
  qty: number,
  name?: string | null,
  fId: string,
  curr: string,
  chg?: number | null,
  chgF?: number | null,
  payF?: number | null,
  type?: string | null,
  subt?: string | null,
  sm?: number | null,
  sy?: number | null,
  em?: number | null,
  ey?: number | null,
  amt?: number | null,
  pur?:  Array<Purchase > | null,
};

export type Purchase = {
  __typename: "Purchase",
  amt: number,
  day?: number | null,
  month: number,
  year: number,
  qty: number,
};

export type Property = {
  __typename: "Property",
  type: PropertyType,
  name?: string | null,
  pin?: number | null,
  purchase?: Purchase | null,
  address?: string | null,
  curr: string,
  city?: string | null,
  country?: string | null,
  state?: string | null,
  own:  Array<Ownership >,
  rate: number,
  mv?: number | null,
  mvy?: number | null,
  mvm?: number | null,
  res: boolean,
};

export type Ownership = {
  __typename: "Ownership",
  fId: string,
  per: number,
};

export type UpdateUserHoldingsInput = {
  uname: string,
  dep?: Array< HoldingInput > | null,
  ltdep?: Array< HoldingInput > | null,
  p2p?: Array< HoldingInput > | null,
  loans?: Array< HoldingInput > | null,
  credit?: Array< HoldingInput > | null,
  savings?: Array< HoldingInput > | null,
  property?: Array< PropertyInput > | null,
  vehicles?: Array< HoldingInput > | null,
  pm?: Array< HoldingInput > | null,
  pf?: Array< HoldingInput > | null,
  nps?: Array< HoldingInput > | null,
  crypto?: Array< HoldingInput > | null,
  ins?: Array< HoldingInput > | null,
  other?: Array< HoldingInput > | null,
  angel?: Array< HoldingInput > | null,
};

export type DeleteUserHoldingsInput = {
  uname: string,
};

export type CreateUserInsInput = {
  uname: string,
  ins: Array< InstrumentInput >,
  watch?: Array< InsWatchInput > | null,
};

export type InstrumentInput = {
  id: string,
  sid?: string | null,
  exchg?: string | null,
  qty: number,
  pur?: Array< PurchaseInput > | null,
  fId: string,
  curr: string,
  type?: AssetType | null,
  subt?: AssetSubType | null,
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
  P2P = "P2P",
  War = "War",
}


export type InsWatchInput = {
  id: string,
  sid?: string | null,
  hight?: number | null,
  lowt?: number | null,
  type?: AssetType | null,
  subt?: AssetSubType | null,
  itype?: InsType | null,
  curr?: string | null,
};

export enum InsType {
  ETF = "ETF",
  REIT = "REIT",
  InvIT = "InvIT",
  DEB = "DEB",
  CP = "CP",
  TB = "TB",
  CD = "CD",
  PB = "PB",
  IB = "IB",
  TFB = "TFB",
  FRB = "FRB",
  CB = "CB",
}


export type ModelUserInsConditionInput = {
  and?: Array< ModelUserInsConditionInput | null > | null,
  or?: Array< ModelUserInsConditionInput | null > | null,
  not?: ModelUserInsConditionInput | null,
};

export type UserIns = {
  __typename: "UserIns",
  uname: string,
  ins:  Array<Instrument >,
  watch?:  Array<InsWatch > | null,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type Instrument = {
  __typename: "Instrument",
  id: string,
  sid?: string | null,
  exchg?: string | null,
  qty: number,
  pur?:  Array<Purchase > | null,
  fId: string,
  curr: string,
  type?: AssetType | null,
  subt?: AssetSubType | null,
};

export type InsWatch = {
  __typename: "InsWatch",
  id: string,
  sid?: string | null,
  hight?: number | null,
  lowt?: number | null,
  type?: AssetType | null,
  subt?: AssetSubType | null,
  itype?: InsType | null,
  curr?: string | null,
};

export type UpdateUserInsInput = {
  uname: string,
  ins?: Array< InstrumentInput > | null,
  watch?: Array< InsWatchInput > | null,
};

export type DeleteUserInsInput = {
  uname: string,
};

export type DeleteCoachingReqInput = {
  id: string,
};

export type ModelCoachingReqConditionInput = {
  dur?: ModelIntInput | null,
  text?: ModelStringInput | null,
  page?: ModelStringInput | null,
  type?: ModelCoachingTypeInput | null,
  status?: ModelCoachingStatusInput | null,
  payment?: ModelIntInput | null,
  curr?: ModelStringInput | null,
  paid?: ModelBooleanInput | null,
  pt?: ModelPaymentTypeInput | null,
  email?: ModelStringInput | null,
  and?: Array< ModelCoachingReqConditionInput | null > | null,
  or?: Array< ModelCoachingReqConditionInput | null > | null,
  not?: ModelCoachingReqConditionInput | null,
};

export type ModelCoachingTypeInput = {
  eq?: CoachingType | null,
  ne?: CoachingType | null,
};

export enum CoachingType {
  Inv = "Inv",
  Ins = "Ins",
  FI = "FI",
}


export type ModelCoachingStatusInput = {
  eq?: CoachingStatus | null,
  ne?: CoachingStatus | null,
};

export enum CoachingStatus {
  P = "P",
  B = "B",
  C = "C",
  D = "D",
}


export type ModelPaymentTypeInput = {
  eq?: PaymentType | null,
  ne?: PaymentType | null,
};

export enum PaymentType {
  D = "D",
  C = "C",
  UPI = "UPI",
  B = "B",
}


export type CoachingReq = {
  __typename: "CoachingReq",
  id: string,
  dur: number,
  text?: string | null,
  page: string,
  type: CoachingType,
  status: CoachingStatus,
  payment: number,
  curr: string,
  paid: boolean,
  pt?: PaymentType | null,
  email?: string | null,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type CreateFeedbackInput = {
  id?: string | null,
  type: FeedbackType,
  email: string,
  name: NameInput,
  feedback: string,
  uname?: string | null,
};

export type CreateRatingInput = {
  id?: string | null,
  type: CalcType,
  rating: number,
  feedbackId?: string | null,
};

export type CreateInsAnalyticsInput = {
  id: string,
  analytics: string,
};

export type ModelInsAnalyticsConditionInput = {
  analytics?: ModelStringInput | null,
  and?: Array< ModelInsAnalyticsConditionInput | null > | null,
  or?: Array< ModelInsAnalyticsConditionInput | null > | null,
  not?: ModelInsAnalyticsConditionInput | null,
};

export type InsAnalytics = {
  __typename: "InsAnalytics",
  id: string,
  analytics: string,
  createdAt: string,
  updatedAt: string,
};

export type UpdateInsAnalyticsInput = {
  id: string,
  analytics?: string | null,
};

export type DeleteInsAnalyticsInput = {
  id: string,
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
  id: string,
  tname: string,
  exchg?: Exchange | null,
  url?: string | null,
  count: number,
  createdAt: string,
  updatedAt: string,
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

export type CreateINExchgFunInput = {
  id: string,
  isin?: string | null,
  exchg: Exchange,
  sector?: string | null,
  ind?: string | null,
  tech?: string | null,
  val?: string | null,
  risk?: RiskProfile | null,
};

export type ModelINExchgFunConditionInput = {
  isin?: ModelStringInput | null,
  exchg?: ModelExchangeInput | null,
  sector?: ModelStringInput | null,
  ind?: ModelStringInput | null,
  tech?: ModelStringInput | null,
  val?: ModelStringInput | null,
  risk?: ModelRiskProfileInput | null,
  and?: Array< ModelINExchgFunConditionInput | null > | null,
  or?: Array< ModelINExchgFunConditionInput | null > | null,
  not?: ModelINExchgFunConditionInput | null,
};

export type INExchgFun = {
  __typename: "INExchgFun",
  id: string,
  isin?: string | null,
  exchg: Exchange,
  sector?: string | null,
  ind?: string | null,
  tech?: string | null,
  val?: string | null,
  risk?: RiskProfile | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateINExchgFunInput = {
  id: string,
  isin?: string | null,
  exchg?: Exchange | null,
  sector?: string | null,
  ind?: string | null,
  tech?: string | null,
  val?: string | null,
  risk?: RiskProfile | null,
};

export type DeleteINExchgFunInput = {
  id: string,
};

export type CreateINExchgPriceInput = {
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
  yhighd?: string | null,
  ylow?: number | null,
  ylowd?: string | null,
  split?: string | null,
  div?: number | null,
  splitd?: string | null,
  divdd?: string | null,
  divrd?: string | null,
  divpd?: string | null,
  beta?: number | null,
  mcap?: number | null,
  mcapt?: MCap | null,
  sector?: string | null,
  ind?: string | null,
  risk?: RiskProfile | null,
  vol?: number | null,
  prevol?: number | null,
};

export enum MCap {
  Small = "Small",
  Mid = "Mid",
  Large = "Large",
  Hybrid = "Hybrid",
}


export type ModelINExchgPriceConditionInput = {
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
  yhighd?: ModelStringInput | null,
  ylow?: ModelFloatInput | null,
  ylowd?: ModelStringInput | null,
  split?: ModelStringInput | null,
  div?: ModelFloatInput | null,
  splitd?: ModelStringInput | null,
  divdd?: ModelStringInput | null,
  divrd?: ModelStringInput | null,
  divpd?: ModelStringInput | null,
  beta?: ModelFloatInput | null,
  mcap?: ModelFloatInput | null,
  mcapt?: ModelMCapInput | null,
  sector?: ModelStringInput | null,
  ind?: ModelStringInput | null,
  risk?: ModelRiskProfileInput | null,
  vol?: ModelFloatInput | null,
  prevol?: ModelFloatInput | null,
  and?: Array< ModelINExchgPriceConditionInput | null > | null,
  or?: Array< ModelINExchgPriceConditionInput | null > | null,
  not?: ModelINExchgPriceConditionInput | null,
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

export type ModelMCapInput = {
  eq?: MCap | null,
  ne?: MCap | null,
};

export type INExchgPrice = {
  __typename: "INExchgPrice",
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
  yhighd?: string | null,
  ylow?: number | null,
  ylowd?: string | null,
  split?: string | null,
  div?: number | null,
  splitd?: string | null,
  divdd?: string | null,
  divrd?: string | null,
  divpd?: string | null,
  beta?: number | null,
  mcap?: number | null,
  mcapt?: MCap | null,
  sector?: string | null,
  ind?: string | null,
  risk?: RiskProfile | null,
  vol?: number | null,
  prevol?: number | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateINExchgPriceInput = {
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
  yhighd?: string | null,
  ylow?: number | null,
  ylowd?: string | null,
  split?: string | null,
  div?: number | null,
  splitd?: string | null,
  divdd?: string | null,
  divrd?: string | null,
  divpd?: string | null,
  beta?: number | null,
  mcap?: number | null,
  mcapt?: MCap | null,
  sector?: string | null,
  ind?: string | null,
  risk?: RiskProfile | null,
  vol?: number | null,
  prevol?: number | null,
};

export type DeleteINExchgPriceInput = {
  id: string,
};

export type CreateAllIndicesInput = {
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
  IM = "IM",
  F = "F",
  CG = "CG",
  CC = "CC",
  CH = "CH",
  CS = "CS",
  FP = "FP",
  C = "C",
  H = "H",
  PH = "PH",
  IT = "IT",
  MED = "MED",
  MET = "MET",
  OG = "OG",
  POW = "POW",
  S = "S",
  TC = "TC",
  TEX = "TEX",
  CAPG = "CAPG",
  TECH = "TECH",
  CD = "CD",
  E = "E",
  CDGS = "CDGS",
  BASM = "BASM",
  U = "U",
}


export type ModelAllIndicesConditionInput = {
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
  and?: Array< ModelAllIndicesConditionInput | null > | null,
  or?: Array< ModelAllIndicesConditionInput | null > | null,
  not?: ModelAllIndicesConditionInput | null,
};

export type ModelIndustryInput = {
  eq?: Industry | null,
  ne?: Industry | null,
};

export type AllIndices = {
  __typename: "AllIndices",
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
};

export type UpdateAllIndicesInput = {
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

export type DeleteAllIndicesInput = {
  id: string,
};

export type CreateInsHistPerfInput = {
  id: string,
  p1y: number,
  p3y: number,
  p5y: number,
};

export type ModelInsHistPerfConditionInput = {
  p1y?: ModelFloatInput | null,
  p3y?: ModelFloatInput | null,
  p5y?: ModelFloatInput | null,
  and?: Array< ModelInsHistPerfConditionInput | null > | null,
  or?: Array< ModelInsHistPerfConditionInput | null > | null,
  not?: ModelInsHistPerfConditionInput | null,
};

export type InsHistPerf = {
  __typename: "InsHistPerf",
  id: string,
  p1y: number,
  p3y: number,
  p5y: number,
  createdAt: string,
  updatedAt: string,
};

export type UpdateInsHistPerfInput = {
  id: string,
  p1y?: number | null,
  p3y?: number | null,
  p5y?: number | null,
};

export type DeleteInsHistPerfInput = {
  id: string,
};

export type CreateIndiceHistPerfInput = {
  name: string,
  p1m: number,
  p3m: number,
  p1y: number,
  p3y: number,
  p5y: number,
  vol: number,
  beta: number,
  corr: number,
  rsq: number,
  pe: number,
  pb: number,
  div: number,
};

export type ModelIndiceHistPerfConditionInput = {
  p1m?: ModelFloatInput | null,
  p3m?: ModelFloatInput | null,
  p1y?: ModelFloatInput | null,
  p3y?: ModelFloatInput | null,
  p5y?: ModelFloatInput | null,
  vol?: ModelFloatInput | null,
  beta?: ModelFloatInput | null,
  corr?: ModelFloatInput | null,
  rsq?: ModelFloatInput | null,
  pe?: ModelFloatInput | null,
  pb?: ModelFloatInput | null,
  div?: ModelFloatInput | null,
  and?: Array< ModelIndiceHistPerfConditionInput | null > | null,
  or?: Array< ModelIndiceHistPerfConditionInput | null > | null,
  not?: ModelIndiceHistPerfConditionInput | null,
};

export type IndiceHistPerf = {
  __typename: "IndiceHistPerf",
  name: string,
  p1m: number,
  p3m: number,
  p1y: number,
  p3y: number,
  p5y: number,
  vol: number,
  beta: number,
  corr: number,
  rsq: number,
  pe: number,
  pb: number,
  div: number,
  createdAt: string,
  updatedAt: string,
};

export type UpdateIndiceHistPerfInput = {
  name: string,
  p1m?: number | null,
  p3m?: number | null,
  p1y?: number | null,
  p3y?: number | null,
  p5y?: number | null,
  vol?: number | null,
  beta?: number | null,
  corr?: number | null,
  rsq?: number | null,
  pe?: number | null,
  pb?: number | null,
  div?: number | null,
};

export type DeleteIndiceHistPerfInput = {
  name: string,
};

export type CreateIndexConstInput = {
  name: string,
  const: Array< string >,
};

export type ModelIndexConstConditionInput = {
  const?: ModelStringInput | null,
  and?: Array< ModelIndexConstConditionInput | null > | null,
  or?: Array< ModelIndexConstConditionInput | null > | null,
  not?: ModelIndexConstConditionInput | null,
};

export type IndexConst = {
  __typename: "IndexConst",
  name: string,
  const: Array< string >,
  createdAt: string,
  updatedAt: string,
};

export type UpdateIndexConstInput = {
  name: string,
  const?: Array< string > | null,
};

export type DeleteIndexConstInput = {
  name: string,
};

export type CreateINBondPriceInput = {
  id: string,
  sid: string,
  name: string,
  type: AssetType,
  subt: AssetSubType,
  price: number,
  prev?: number | null,
  exchg: Exchange,
  sm?: number | null,
  sy?: number | null,
  mm?: number | null,
  my?: number | null,
  rate: number,
  fv?: number | null,
  cr?: CreditRating | null,
  crstr?: string | null,
  ytm?: number | null,
  risk?: RiskProfile | null,
  itype?: InsType | null,
};

export enum CreditRating {
  E = "E",
  H = "H",
  M = "M",
  L = "L",
  J = "J",
}


export type ModelINBondPriceConditionInput = {
  sid?: ModelStringInput | null,
  name?: ModelStringInput | null,
  type?: ModelAssetTypeInput | null,
  subt?: ModelAssetSubTypeInput | null,
  price?: ModelFloatInput | null,
  prev?: ModelFloatInput | null,
  exchg?: ModelExchangeInput | null,
  sm?: ModelIntInput | null,
  sy?: ModelIntInput | null,
  mm?: ModelIntInput | null,
  my?: ModelIntInput | null,
  rate?: ModelFloatInput | null,
  fv?: ModelIntInput | null,
  cr?: ModelCreditRatingInput | null,
  crstr?: ModelStringInput | null,
  ytm?: ModelFloatInput | null,
  risk?: ModelRiskProfileInput | null,
  itype?: ModelInsTypeInput | null,
  and?: Array< ModelINBondPriceConditionInput | null > | null,
  or?: Array< ModelINBondPriceConditionInput | null > | null,
  not?: ModelINBondPriceConditionInput | null,
};

export type ModelCreditRatingInput = {
  eq?: CreditRating | null,
  ne?: CreditRating | null,
};

export type INBondPrice = {
  __typename: "INBondPrice",
  id: string,
  sid: string,
  name: string,
  type: AssetType,
  subt: AssetSubType,
  price: number,
  prev?: number | null,
  exchg: Exchange,
  sm?: number | null,
  sy?: number | null,
  mm?: number | null,
  my?: number | null,
  rate: number,
  fv?: number | null,
  cr?: CreditRating | null,
  crstr?: string | null,
  ytm?: number | null,
  risk?: RiskProfile | null,
  itype?: InsType | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateINBondPriceInput = {
  id: string,
  sid?: string | null,
  name?: string | null,
  type?: AssetType | null,
  subt?: AssetSubType | null,
  price?: number | null,
  prev?: number | null,
  exchg?: Exchange | null,
  sm?: number | null,
  sy?: number | null,
  mm?: number | null,
  my?: number | null,
  rate?: number | null,
  fv?: number | null,
  cr?: CreditRating | null,
  crstr?: string | null,
  ytm?: number | null,
  risk?: RiskProfile | null,
  itype?: InsType | null,
};

export type DeleteINBondPriceInput = {
  id: string,
};

export type CreateINMFPriceInput = {
  id: string,
  sid: string,
  tid?: string | null,
  dir?: string | null,
  name: string,
  type: AssetType,
  subt: AssetSubType,
  price: number,
  prev?: number | null,
  mftype: MFSchemeType,
  mcapt?: MCap | null,
  tf?: boolean | null,
  risk?: RiskProfile | null,
};

export enum MFSchemeType {
  O = "O",
  C = "C",
  I = "I",
}


export type ModelINMFPriceConditionInput = {
  sid?: ModelStringInput | null,
  tid?: ModelStringInput | null,
  dir?: ModelStringInput | null,
  name?: ModelStringInput | null,
  type?: ModelAssetTypeInput | null,
  subt?: ModelAssetSubTypeInput | null,
  price?: ModelFloatInput | null,
  prev?: ModelFloatInput | null,
  mftype?: ModelMFSchemeTypeInput | null,
  mcapt?: ModelMCapInput | null,
  tf?: ModelBooleanInput | null,
  risk?: ModelRiskProfileInput | null,
  and?: Array< ModelINMFPriceConditionInput | null > | null,
  or?: Array< ModelINMFPriceConditionInput | null > | null,
  not?: ModelINMFPriceConditionInput | null,
};

export type ModelMFSchemeTypeInput = {
  eq?: MFSchemeType | null,
  ne?: MFSchemeType | null,
};

export type INMFPrice = {
  __typename: "INMFPrice",
  id: string,
  sid: string,
  tid?: string | null,
  dir?: string | null,
  name: string,
  type: AssetType,
  subt: AssetSubType,
  price: number,
  prev?: number | null,
  mftype: MFSchemeType,
  mcapt?: MCap | null,
  tf?: boolean | null,
  risk?: RiskProfile | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateINMFPriceInput = {
  id: string,
  sid?: string | null,
  tid?: string | null,
  dir?: string | null,
  name?: string | null,
  type?: AssetType | null,
  subt?: AssetSubType | null,
  price?: number | null,
  prev?: number | null,
  mftype?: MFSchemeType | null,
  mcapt?: MCap | null,
  tf?: boolean | null,
  risk?: RiskProfile | null,
};

export type DeleteINMFPriceInput = {
  id: string,
};

export type CreateNPSPriceInput = {
  id: string,
  pfm: NPSPFM,
  st: NPSSchemeType,
  name: string,
  type: AssetType,
  subt: AssetSubType,
  price: number,
  prev?: number | null,
  risk?: RiskProfile | null,
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


export type ModelNPSPriceConditionInput = {
  pfm?: ModelNPSPFMInput | null,
  st?: ModelNPSSchemeTypeInput | null,
  name?: ModelStringInput | null,
  type?: ModelAssetTypeInput | null,
  subt?: ModelAssetSubTypeInput | null,
  price?: ModelFloatInput | null,
  prev?: ModelFloatInput | null,
  risk?: ModelRiskProfileInput | null,
  and?: Array< ModelNPSPriceConditionInput | null > | null,
  or?: Array< ModelNPSPriceConditionInput | null > | null,
  not?: ModelNPSPriceConditionInput | null,
};

export type ModelNPSPFMInput = {
  eq?: NPSPFM | null,
  ne?: NPSPFM | null,
};

export type ModelNPSSchemeTypeInput = {
  eq?: NPSSchemeType | null,
  ne?: NPSSchemeType | null,
};

export type NPSPrice = {
  __typename: "NPSPrice",
  id: string,
  pfm: NPSPFM,
  st: NPSSchemeType,
  name: string,
  type: AssetType,
  subt: AssetSubType,
  price: number,
  prev?: number | null,
  risk?: RiskProfile | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateNPSPriceInput = {
  id: string,
  pfm?: NPSPFM | null,
  st?: NPSSchemeType | null,
  name?: string | null,
  type?: AssetType | null,
  subt?: AssetSubType | null,
  price?: number | null,
  prev?: number | null,
  risk?: RiskProfile | null,
};

export type DeleteNPSPriceInput = {
  id: string,
};

export type CreateCoachingReqInput = {
  id?: string | null,
  dur: number,
  text?: string | null,
  page: string,
  type: CoachingType,
  status: CoachingStatus,
  payment: number,
  curr: string,
  paid: boolean,
  pt?: PaymentType | null,
  email?: string | null,
};

export type UpdateCoachingReqInput = {
  id: string,
  dur?: number | null,
  text?: string | null,
  page?: string | null,
  type?: CoachingType | null,
  status?: CoachingStatus | null,
  payment?: number | null,
  curr?: string | null,
  paid?: boolean | null,
  pt?: PaymentType | null,
  email?: string | null,
};

export type ModelFeedbackFilterInput = {
  id?: ModelIDInput | null,
  type?: ModelFeedbackTypeInput | null,
  email?: ModelStringInput | null,
  feedback?: ModelStringInput | null,
  uname?: ModelStringInput | null,
  and?: Array< ModelFeedbackFilterInput | null > | null,
  or?: Array< ModelFeedbackFilterInput | null > | null,
  not?: ModelFeedbackFilterInput | null,
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

export type ModelFeedbackConnection = {
  __typename: "ModelFeedbackConnection",
  items:  Array<Feedback | null >,
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
  items:  Array<Rating | null >,
  nextToken?: string | null,
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
  met?: ModelBooleanInput | null,
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
  rp?: ModelRiskProfileInput | null,
  bt?: ModelBuyTypeInput | null,
  rc?: ModelIntInput | null,
  rcchg?: ModelFloatInput | null,
  and?: Array< ModelGoalFilterInput | null > | null,
  or?: Array< ModelGoalFilterInput | null > | null,
  not?: ModelGoalFilterInput | null,
};

export type ModelGoalConnection = {
  __typename: "ModelGoalConnection",
  items:  Array<Goal | null >,
  nextToken?: string | null,
};

export type ModelFamilyFilterInput = {
  id?: ModelIDInput | null,
  tid?: ModelStringInput | null,
  name?: ModelStringInput | null,
  tax?: ModelTaxLiabilityInput | null,
  and?: Array< ModelFamilyFilterInput | null > | null,
  or?: Array< ModelFamilyFilterInput | null > | null,
  not?: ModelFamilyFilterInput | null,
};

export type ModelFamilyConnection = {
  __typename: "ModelFamilyConnection",
  items:  Array<Family | null >,
  nextToken?: string | null,
};

export type ModelUserInfoFilterInput = {
  uname?: ModelStringInput | null,
  email?: ModelStringInput | null,
  dob?: ModelStringInput | null,
  im?: ModelFloatInput | null,
  mob?: ModelFloatInput | null,
  notify?: ModelBooleanInput | null,
  tax?: ModelTaxLiabilityInput | null,
  rp?: ModelRiskProfileInput | null,
  dr?: ModelFloatInput | null,
  tc?: ModelStringInput | null,
  ta?: ModelFloatInput | null,
  tid?: ModelStringInput | null,
  exp?: ModelIntInput | null,
  invest?: ModelIntInput | null,
  and?: Array< ModelUserInfoFilterInput | null > | null,
  or?: Array< ModelUserInfoFilterInput | null > | null,
  not?: ModelUserInfoFilterInput | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelUserInfoConnection = {
  __typename: "ModelUserInfoConnection",
  items:  Array<UserInfo | null >,
  nextToken?: string | null,
};

export type ModelInsAnalyticsFilterInput = {
  id?: ModelStringInput | null,
  analytics?: ModelStringInput | null,
  and?: Array< ModelInsAnalyticsFilterInput | null > | null,
  or?: Array< ModelInsAnalyticsFilterInput | null > | null,
  not?: ModelInsAnalyticsFilterInput | null,
};

export type ModelInsAnalyticsConnection = {
  __typename: "ModelInsAnalyticsConnection",
  items:  Array<InsAnalytics | null >,
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
  items:  Array<Feeds | null >,
  nextToken?: string | null,
};

export type ModelINExchgFunFilterInput = {
  id?: ModelStringInput | null,
  isin?: ModelStringInput | null,
  exchg?: ModelExchangeInput | null,
  sector?: ModelStringInput | null,
  ind?: ModelStringInput | null,
  tech?: ModelStringInput | null,
  val?: ModelStringInput | null,
  risk?: ModelRiskProfileInput | null,
  and?: Array< ModelINExchgFunFilterInput | null > | null,
  or?: Array< ModelINExchgFunFilterInput | null > | null,
  not?: ModelINExchgFunFilterInput | null,
};

export type ModelINExchgFunConnection = {
  __typename: "ModelINExchgFunConnection",
  items:  Array<INExchgFun | null >,
  nextToken?: string | null,
};

export type ModelINExchgPriceFilterInput = {
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
  yhighd?: ModelStringInput | null,
  ylow?: ModelFloatInput | null,
  ylowd?: ModelStringInput | null,
  split?: ModelStringInput | null,
  div?: ModelFloatInput | null,
  splitd?: ModelStringInput | null,
  divdd?: ModelStringInput | null,
  divrd?: ModelStringInput | null,
  divpd?: ModelStringInput | null,
  beta?: ModelFloatInput | null,
  mcap?: ModelFloatInput | null,
  mcapt?: ModelMCapInput | null,
  sector?: ModelStringInput | null,
  ind?: ModelStringInput | null,
  risk?: ModelRiskProfileInput | null,
  vol?: ModelFloatInput | null,
  prevol?: ModelFloatInput | null,
  and?: Array< ModelINExchgPriceFilterInput | null > | null,
  or?: Array< ModelINExchgPriceFilterInput | null > | null,
  not?: ModelINExchgPriceFilterInput | null,
};

export type ModelINExchgPriceConnection = {
  __typename: "ModelINExchgPriceConnection",
  items:  Array<INExchgPrice | null >,
  nextToken?: string | null,
};

export type ModelAllIndicesFilterInput = {
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
  and?: Array< ModelAllIndicesFilterInput | null > | null,
  or?: Array< ModelAllIndicesFilterInput | null > | null,
  not?: ModelAllIndicesFilterInput | null,
};

export type ModelAllIndicesConnection = {
  __typename: "ModelAllIndicesConnection",
  items:  Array<AllIndices | null >,
  nextToken?: string | null,
};

export type ModelInsHistPerfFilterInput = {
  id?: ModelStringInput | null,
  p1y?: ModelFloatInput | null,
  p3y?: ModelFloatInput | null,
  p5y?: ModelFloatInput | null,
  and?: Array< ModelInsHistPerfFilterInput | null > | null,
  or?: Array< ModelInsHistPerfFilterInput | null > | null,
  not?: ModelInsHistPerfFilterInput | null,
};

export type ModelInsHistPerfConnection = {
  __typename: "ModelInsHistPerfConnection",
  items:  Array<InsHistPerf | null >,
  nextToken?: string | null,
};

export type ModelIndiceHistPerfFilterInput = {
  name?: ModelStringInput | null,
  p1m?: ModelFloatInput | null,
  p3m?: ModelFloatInput | null,
  p1y?: ModelFloatInput | null,
  p3y?: ModelFloatInput | null,
  p5y?: ModelFloatInput | null,
  vol?: ModelFloatInput | null,
  beta?: ModelFloatInput | null,
  corr?: ModelFloatInput | null,
  rsq?: ModelFloatInput | null,
  pe?: ModelFloatInput | null,
  pb?: ModelFloatInput | null,
  div?: ModelFloatInput | null,
  and?: Array< ModelIndiceHistPerfFilterInput | null > | null,
  or?: Array< ModelIndiceHistPerfFilterInput | null > | null,
  not?: ModelIndiceHistPerfFilterInput | null,
};

export type ModelIndiceHistPerfConnection = {
  __typename: "ModelIndiceHistPerfConnection",
  items:  Array<IndiceHistPerf | null >,
  nextToken?: string | null,
};

export type ModelIndexConstFilterInput = {
  name?: ModelStringInput | null,
  const?: ModelStringInput | null,
  and?: Array< ModelIndexConstFilterInput | null > | null,
  or?: Array< ModelIndexConstFilterInput | null > | null,
  not?: ModelIndexConstFilterInput | null,
};

export type ModelIndexConstConnection = {
  __typename: "ModelIndexConstConnection",
  items:  Array<IndexConst | null >,
  nextToken?: string | null,
};

export type ModelINBondPriceFilterInput = {
  id?: ModelStringInput | null,
  sid?: ModelStringInput | null,
  name?: ModelStringInput | null,
  type?: ModelAssetTypeInput | null,
  subt?: ModelAssetSubTypeInput | null,
  price?: ModelFloatInput | null,
  prev?: ModelFloatInput | null,
  exchg?: ModelExchangeInput | null,
  sm?: ModelIntInput | null,
  sy?: ModelIntInput | null,
  mm?: ModelIntInput | null,
  my?: ModelIntInput | null,
  rate?: ModelFloatInput | null,
  fv?: ModelIntInput | null,
  cr?: ModelCreditRatingInput | null,
  crstr?: ModelStringInput | null,
  ytm?: ModelFloatInput | null,
  risk?: ModelRiskProfileInput | null,
  itype?: ModelInsTypeInput | null,
  and?: Array< ModelINBondPriceFilterInput | null > | null,
  or?: Array< ModelINBondPriceFilterInput | null > | null,
  not?: ModelINBondPriceFilterInput | null,
};

export type ModelINBondPriceConnection = {
  __typename: "ModelINBondPriceConnection",
  items:  Array<INBondPrice | null >,
  nextToken?: string | null,
};

export type ModelINMFPriceFilterInput = {
  id?: ModelStringInput | null,
  sid?: ModelStringInput | null,
  tid?: ModelStringInput | null,
  dir?: ModelStringInput | null,
  name?: ModelStringInput | null,
  type?: ModelAssetTypeInput | null,
  subt?: ModelAssetSubTypeInput | null,
  price?: ModelFloatInput | null,
  prev?: ModelFloatInput | null,
  mftype?: ModelMFSchemeTypeInput | null,
  mcapt?: ModelMCapInput | null,
  tf?: ModelBooleanInput | null,
  risk?: ModelRiskProfileInput | null,
  and?: Array< ModelINMFPriceFilterInput | null > | null,
  or?: Array< ModelINMFPriceFilterInput | null > | null,
  not?: ModelINMFPriceFilterInput | null,
};

export type ModelINMFPriceConnection = {
  __typename: "ModelINMFPriceConnection",
  items:  Array<INMFPrice | null >,
  nextToken?: string | null,
};

export type ModelNPSPriceFilterInput = {
  id?: ModelStringInput | null,
  pfm?: ModelNPSPFMInput | null,
  st?: ModelNPSSchemeTypeInput | null,
  name?: ModelStringInput | null,
  type?: ModelAssetTypeInput | null,
  subt?: ModelAssetSubTypeInput | null,
  price?: ModelFloatInput | null,
  prev?: ModelFloatInput | null,
  risk?: ModelRiskProfileInput | null,
  and?: Array< ModelNPSPriceFilterInput | null > | null,
  or?: Array< ModelNPSPriceFilterInput | null > | null,
  not?: ModelNPSPriceFilterInput | null,
};

export type ModelNPSPriceConnection = {
  __typename: "ModelNPSPriceConnection",
  items:  Array<NPSPrice | null >,
  nextToken?: string | null,
};

export type ModelUserHoldingsFilterInput = {
  uname?: ModelStringInput | null,
  and?: Array< ModelUserHoldingsFilterInput | null > | null,
  or?: Array< ModelUserHoldingsFilterInput | null > | null,
  not?: ModelUserHoldingsFilterInput | null,
};

export type ModelUserHoldingsConnection = {
  __typename: "ModelUserHoldingsConnection",
  items:  Array<UserHoldings | null >,
  nextToken?: string | null,
};

export type ModelUserInsFilterInput = {
  uname?: ModelStringInput | null,
  and?: Array< ModelUserInsFilterInput | null > | null,
  or?: Array< ModelUserInsFilterInput | null > | null,
  not?: ModelUserInsFilterInput | null,
};

export type ModelUserInsConnection = {
  __typename: "ModelUserInsConnection",
  items:  Array<UserIns | null >,
  nextToken?: string | null,
};

export type ModelCoachingReqFilterInput = {
  id?: ModelIDInput | null,
  dur?: ModelIntInput | null,
  text?: ModelStringInput | null,
  page?: ModelStringInput | null,
  type?: ModelCoachingTypeInput | null,
  status?: ModelCoachingStatusInput | null,
  payment?: ModelIntInput | null,
  curr?: ModelStringInput | null,
  paid?: ModelBooleanInput | null,
  pt?: ModelPaymentTypeInput | null,
  email?: ModelStringInput | null,
  and?: Array< ModelCoachingReqFilterInput | null > | null,
  or?: Array< ModelCoachingReqFilterInput | null > | null,
  not?: ModelCoachingReqFilterInput | null,
};

export type ModelCoachingReqConnection = {
  __typename: "ModelCoachingReqConnection",
  items:  Array<CoachingReq | null >,
  nextToken?: string | null,
};

export type UpdateFeedbackMutationVariables = {
  input: UpdateFeedbackInput,
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
    uname?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteFeedbackMutationVariables = {
  input: DeleteFeedbackInput,
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
    uname?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateRatingMutationVariables = {
  input: UpdateRatingInput,
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

export type DeleteRatingMutationVariables = {
  input: DeleteRatingInput,
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
  input: CreateGoalInput,
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
    met?: boolean | null,
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
    pp?:  {
      __typename: "PP",
      cash: number,
      ltdep: number,
      mtb?: number | null,
      imtb?: number | null,
      hyb?: number | null,
      ihyb?: number | null,
      teb?: number | null,
      reit?: number | null,
      ireit?: number | null,
      reitETF?: number | null,
      ireitETF?: number | null,
      re?: number | null,
      gold?: number | null,
      goldb?: number | null,
      lcs?: number | null,
      lcetf?: number | null,
      ilcs?: number | null,
      ilcetf?: number | null,
      mscs?: number | null,
      imscs?: number | null,
      dgs?: number | null,
      uc?: number | null,
      crypto?: number | null,
      p2p?: number | null,
    } | null,
    rp?: RiskProfile | null,
    bt?: BuyType | null,
    rc?: number | null,
    rcchg?: number | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type UpdateGoalMutationVariables = {
  input: UpdateGoalInput,
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
    met?: boolean | null,
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
    pp?:  {
      __typename: "PP",
      cash: number,
      ltdep: number,
      mtb?: number | null,
      imtb?: number | null,
      hyb?: number | null,
      ihyb?: number | null,
      teb?: number | null,
      reit?: number | null,
      ireit?: number | null,
      reitETF?: number | null,
      ireitETF?: number | null,
      re?: number | null,
      gold?: number | null,
      goldb?: number | null,
      lcs?: number | null,
      lcetf?: number | null,
      ilcs?: number | null,
      ilcetf?: number | null,
      mscs?: number | null,
      imscs?: number | null,
      dgs?: number | null,
      uc?: number | null,
      crypto?: number | null,
      p2p?: number | null,
    } | null,
    rp?: RiskProfile | null,
    bt?: BuyType | null,
    rc?: number | null,
    rcchg?: number | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type DeleteGoalMutationVariables = {
  input: DeleteGoalInput,
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
    met?: boolean | null,
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
    pp?:  {
      __typename: "PP",
      cash: number,
      ltdep: number,
      mtb?: number | null,
      imtb?: number | null,
      hyb?: number | null,
      ihyb?: number | null,
      teb?: number | null,
      reit?: number | null,
      ireit?: number | null,
      reitETF?: number | null,
      ireitETF?: number | null,
      re?: number | null,
      gold?: number | null,
      goldb?: number | null,
      lcs?: number | null,
      lcetf?: number | null,
      ilcs?: number | null,
      ilcetf?: number | null,
      mscs?: number | null,
      imscs?: number | null,
      dgs?: number | null,
      uc?: number | null,
      crypto?: number | null,
      p2p?: number | null,
    } | null,
    rp?: RiskProfile | null,
    bt?: BuyType | null,
    rc?: number | null,
    rcchg?: number | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type CreateUserInfoMutationVariables = {
  input: CreateUserInfoInput,
  condition?: ModelUserInfoConditionInput | null,
};

export type CreateUserInfoMutation = {
  createUserInfo?:  {
    __typename: "UserInfo",
    uname: string,
    email: string,
    dob: string,
    im?: number | null,
    mob?: number | null,
    notify: boolean,
    tax: TaxLiability,
    rp: RiskProfile,
    dr: number,
    tc: string,
    ta?: number | null,
    tid?: string | null,
    exp?: number | null,
    invest?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateUserInfoMutationVariables = {
  input: UpdateUserInfoInput,
  condition?: ModelUserInfoConditionInput | null,
};

export type UpdateUserInfoMutation = {
  updateUserInfo?:  {
    __typename: "UserInfo",
    uname: string,
    email: string,
    dob: string,
    im?: number | null,
    mob?: number | null,
    notify: boolean,
    tax: TaxLiability,
    rp: RiskProfile,
    dr: number,
    tc: string,
    ta?: number | null,
    tid?: string | null,
    exp?: number | null,
    invest?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteUserInfoMutationVariables = {
  input: DeleteUserInfoInput,
  condition?: ModelUserInfoConditionInput | null,
};

export type DeleteUserInfoMutation = {
  deleteUserInfo?:  {
    __typename: "UserInfo",
    uname: string,
    email: string,
    dob: string,
    im?: number | null,
    mob?: number | null,
    notify: boolean,
    tax: TaxLiability,
    rp: RiskProfile,
    dr: number,
    tc: string,
    ta?: number | null,
    tid?: string | null,
    exp?: number | null,
    invest?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateFamilyMutationVariables = {
  input: CreateFamilyInput,
  condition?: ModelFamilyConditionInput | null,
};

export type CreateFamilyMutation = {
  createFamily?:  {
    __typename: "Family",
    id: string,
    tid: string,
    name: string,
    tax: TaxLiability,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type UpdateFamilyMutationVariables = {
  input: UpdateFamilyInput,
  condition?: ModelFamilyConditionInput | null,
};

export type UpdateFamilyMutation = {
  updateFamily?:  {
    __typename: "Family",
    id: string,
    tid: string,
    name: string,
    tax: TaxLiability,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type DeleteFamilyMutationVariables = {
  input: DeleteFamilyInput,
  condition?: ModelFamilyConditionInput | null,
};

export type DeleteFamilyMutation = {
  deleteFamily?:  {
    __typename: "Family",
    id: string,
    tid: string,
    name: string,
    tax: TaxLiability,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type CreateUserHoldingsMutationVariables = {
  input: CreateUserHoldingsInput,
  condition?: ModelUserHoldingsConditionInput | null,
};

export type CreateUserHoldingsMutation = {
  createUserHoldings?:  {
    __typename: "UserHoldings",
    uname: string,
    dep?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    ltdep?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    p2p?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    loans?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    credit?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    savings?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    property?:  Array< {
      __typename: "Property",
      type: PropertyType,
      name?: string | null,
      pin?: number | null,
      purchase?:  {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } | null,
      address?: string | null,
      curr: string,
      city?: string | null,
      country?: string | null,
      state?: string | null,
      own:  Array< {
        __typename: "Ownership",
        fId: string,
        per: number,
      } >,
      rate: number,
      mv?: number | null,
      mvy?: number | null,
      mvm?: number | null,
      res: boolean,
    } > | null,
    vehicles?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    pm?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    pf?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    nps?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    crypto?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    ins?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    other?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    angel?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type UpdateUserHoldingsMutationVariables = {
  input: UpdateUserHoldingsInput,
  condition?: ModelUserHoldingsConditionInput | null,
};

export type UpdateUserHoldingsMutation = {
  updateUserHoldings?:  {
    __typename: "UserHoldings",
    uname: string,
    dep?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    ltdep?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    p2p?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    loans?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    credit?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    savings?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    property?:  Array< {
      __typename: "Property",
      type: PropertyType,
      name?: string | null,
      pin?: number | null,
      purchase?:  {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } | null,
      address?: string | null,
      curr: string,
      city?: string | null,
      country?: string | null,
      state?: string | null,
      own:  Array< {
        __typename: "Ownership",
        fId: string,
        per: number,
      } >,
      rate: number,
      mv?: number | null,
      mvy?: number | null,
      mvm?: number | null,
      res: boolean,
    } > | null,
    vehicles?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    pm?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    pf?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    nps?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    crypto?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    ins?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    other?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    angel?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type DeleteUserHoldingsMutationVariables = {
  input: DeleteUserHoldingsInput,
  condition?: ModelUserHoldingsConditionInput | null,
};

export type DeleteUserHoldingsMutation = {
  deleteUserHoldings?:  {
    __typename: "UserHoldings",
    uname: string,
    dep?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    ltdep?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    p2p?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    loans?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    credit?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    savings?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    property?:  Array< {
      __typename: "Property",
      type: PropertyType,
      name?: string | null,
      pin?: number | null,
      purchase?:  {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } | null,
      address?: string | null,
      curr: string,
      city?: string | null,
      country?: string | null,
      state?: string | null,
      own:  Array< {
        __typename: "Ownership",
        fId: string,
        per: number,
      } >,
      rate: number,
      mv?: number | null,
      mvy?: number | null,
      mvm?: number | null,
      res: boolean,
    } > | null,
    vehicles?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    pm?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    pf?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    nps?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    crypto?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    ins?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    other?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    angel?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type CreateUserInsMutationVariables = {
  input: CreateUserInsInput,
  condition?: ModelUserInsConditionInput | null,
};

export type CreateUserInsMutation = {
  createUserIns?:  {
    __typename: "UserIns",
    uname: string,
    ins:  Array< {
      __typename: "Instrument",
      id: string,
      sid?: string | null,
      exchg?: string | null,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      fId: string,
      curr: string,
      type?: AssetType | null,
      subt?: AssetSubType | null,
    } >,
    watch?:  Array< {
      __typename: "InsWatch",
      id: string,
      sid?: string | null,
      hight?: number | null,
      lowt?: number | null,
      type?: AssetType | null,
      subt?: AssetSubType | null,
      itype?: InsType | null,
      curr?: string | null,
    } > | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type UpdateUserInsMutationVariables = {
  input: UpdateUserInsInput,
  condition?: ModelUserInsConditionInput | null,
};

export type UpdateUserInsMutation = {
  updateUserIns?:  {
    __typename: "UserIns",
    uname: string,
    ins:  Array< {
      __typename: "Instrument",
      id: string,
      sid?: string | null,
      exchg?: string | null,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      fId: string,
      curr: string,
      type?: AssetType | null,
      subt?: AssetSubType | null,
    } >,
    watch?:  Array< {
      __typename: "InsWatch",
      id: string,
      sid?: string | null,
      hight?: number | null,
      lowt?: number | null,
      type?: AssetType | null,
      subt?: AssetSubType | null,
      itype?: InsType | null,
      curr?: string | null,
    } > | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type DeleteUserInsMutationVariables = {
  input: DeleteUserInsInput,
  condition?: ModelUserInsConditionInput | null,
};

export type DeleteUserInsMutation = {
  deleteUserIns?:  {
    __typename: "UserIns",
    uname: string,
    ins:  Array< {
      __typename: "Instrument",
      id: string,
      sid?: string | null,
      exchg?: string | null,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      fId: string,
      curr: string,
      type?: AssetType | null,
      subt?: AssetSubType | null,
    } >,
    watch?:  Array< {
      __typename: "InsWatch",
      id: string,
      sid?: string | null,
      hight?: number | null,
      lowt?: number | null,
      type?: AssetType | null,
      subt?: AssetSubType | null,
      itype?: InsType | null,
      curr?: string | null,
    } > | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type DeleteCoachingReqMutationVariables = {
  input: DeleteCoachingReqInput,
  condition?: ModelCoachingReqConditionInput | null,
};

export type DeleteCoachingReqMutation = {
  deleteCoachingReq?:  {
    __typename: "CoachingReq",
    id: string,
    dur: number,
    text?: string | null,
    page: string,
    type: CoachingType,
    status: CoachingStatus,
    payment: number,
    curr: string,
    paid: boolean,
    pt?: PaymentType | null,
    email?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type CreateFeedbackMutationVariables = {
  input: CreateFeedbackInput,
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
    uname?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateRatingMutationVariables = {
  input: CreateRatingInput,
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

export type CreateInsAnalyticsMutationVariables = {
  input: CreateInsAnalyticsInput,
  condition?: ModelInsAnalyticsConditionInput | null,
};

export type CreateInsAnalyticsMutation = {
  createInsAnalytics?:  {
    __typename: "InsAnalytics",
    id: string,
    analytics: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateInsAnalyticsMutationVariables = {
  input: UpdateInsAnalyticsInput,
  condition?: ModelInsAnalyticsConditionInput | null,
};

export type UpdateInsAnalyticsMutation = {
  updateInsAnalytics?:  {
    __typename: "InsAnalytics",
    id: string,
    analytics: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteInsAnalyticsMutationVariables = {
  input: DeleteInsAnalyticsInput,
  condition?: ModelInsAnalyticsConditionInput | null,
};

export type DeleteInsAnalyticsMutation = {
  deleteInsAnalytics?:  {
    __typename: "InsAnalytics",
    id: string,
    analytics: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateFeedsMutationVariables = {
  input: CreateFeedsInput,
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
  input: UpdateFeedsInput,
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
  input: DeleteFeedsInput,
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

export type CreateINExchgFunMutationVariables = {
  input: CreateINExchgFunInput,
  condition?: ModelINExchgFunConditionInput | null,
};

export type CreateINExchgFunMutation = {
  createINExchgFun?:  {
    __typename: "INExchgFun",
    id: string,
    isin?: string | null,
    exchg: Exchange,
    sector?: string | null,
    ind?: string | null,
    tech?: string | null,
    val?: string | null,
    risk?: RiskProfile | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateINExchgFunMutationVariables = {
  input: UpdateINExchgFunInput,
  condition?: ModelINExchgFunConditionInput | null,
};

export type UpdateINExchgFunMutation = {
  updateINExchgFun?:  {
    __typename: "INExchgFun",
    id: string,
    isin?: string | null,
    exchg: Exchange,
    sector?: string | null,
    ind?: string | null,
    tech?: string | null,
    val?: string | null,
    risk?: RiskProfile | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteINExchgFunMutationVariables = {
  input: DeleteINExchgFunInput,
  condition?: ModelINExchgFunConditionInput | null,
};

export type DeleteINExchgFunMutation = {
  deleteINExchgFun?:  {
    __typename: "INExchgFun",
    id: string,
    isin?: string | null,
    exchg: Exchange,
    sector?: string | null,
    ind?: string | null,
    tech?: string | null,
    val?: string | null,
    risk?: RiskProfile | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateINExchgPriceMutationVariables = {
  input: CreateINExchgPriceInput,
  condition?: ModelINExchgPriceConditionInput | null,
};

export type CreateINExchgPriceMutation = {
  createINExchgPrice?:  {
    __typename: "INExchgPrice",
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
    yhighd?: string | null,
    ylow?: number | null,
    ylowd?: string | null,
    split?: string | null,
    div?: number | null,
    splitd?: string | null,
    divdd?: string | null,
    divrd?: string | null,
    divpd?: string | null,
    beta?: number | null,
    mcap?: number | null,
    mcapt?: MCap | null,
    sector?: string | null,
    ind?: string | null,
    risk?: RiskProfile | null,
    vol?: number | null,
    prevol?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateINExchgPriceMutationVariables = {
  input: UpdateINExchgPriceInput,
  condition?: ModelINExchgPriceConditionInput | null,
};

export type UpdateINExchgPriceMutation = {
  updateINExchgPrice?:  {
    __typename: "INExchgPrice",
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
    yhighd?: string | null,
    ylow?: number | null,
    ylowd?: string | null,
    split?: string | null,
    div?: number | null,
    splitd?: string | null,
    divdd?: string | null,
    divrd?: string | null,
    divpd?: string | null,
    beta?: number | null,
    mcap?: number | null,
    mcapt?: MCap | null,
    sector?: string | null,
    ind?: string | null,
    risk?: RiskProfile | null,
    vol?: number | null,
    prevol?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteINExchgPriceMutationVariables = {
  input: DeleteINExchgPriceInput,
  condition?: ModelINExchgPriceConditionInput | null,
};

export type DeleteINExchgPriceMutation = {
  deleteINExchgPrice?:  {
    __typename: "INExchgPrice",
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
    yhighd?: string | null,
    ylow?: number | null,
    ylowd?: string | null,
    split?: string | null,
    div?: number | null,
    splitd?: string | null,
    divdd?: string | null,
    divrd?: string | null,
    divpd?: string | null,
    beta?: number | null,
    mcap?: number | null,
    mcapt?: MCap | null,
    sector?: string | null,
    ind?: string | null,
    risk?: RiskProfile | null,
    vol?: number | null,
    prevol?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateAllIndicesMutationVariables = {
  input: CreateAllIndicesInput,
  condition?: ModelAllIndicesConditionInput | null,
};

export type CreateAllIndicesMutation = {
  createAllIndices?:  {
    __typename: "AllIndices",
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

export type UpdateAllIndicesMutationVariables = {
  input: UpdateAllIndicesInput,
  condition?: ModelAllIndicesConditionInput | null,
};

export type UpdateAllIndicesMutation = {
  updateAllIndices?:  {
    __typename: "AllIndices",
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

export type DeleteAllIndicesMutationVariables = {
  input: DeleteAllIndicesInput,
  condition?: ModelAllIndicesConditionInput | null,
};

export type DeleteAllIndicesMutation = {
  deleteAllIndices?:  {
    __typename: "AllIndices",
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

export type CreateInsHistPerfMutationVariables = {
  input: CreateInsHistPerfInput,
  condition?: ModelInsHistPerfConditionInput | null,
};

export type CreateInsHistPerfMutation = {
  createInsHistPerf?:  {
    __typename: "InsHistPerf",
    id: string,
    p1y: number,
    p3y: number,
    p5y: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateInsHistPerfMutationVariables = {
  input: UpdateInsHistPerfInput,
  condition?: ModelInsHistPerfConditionInput | null,
};

export type UpdateInsHistPerfMutation = {
  updateInsHistPerf?:  {
    __typename: "InsHistPerf",
    id: string,
    p1y: number,
    p3y: number,
    p5y: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteInsHistPerfMutationVariables = {
  input: DeleteInsHistPerfInput,
  condition?: ModelInsHistPerfConditionInput | null,
};

export type DeleteInsHistPerfMutation = {
  deleteInsHistPerf?:  {
    __typename: "InsHistPerf",
    id: string,
    p1y: number,
    p3y: number,
    p5y: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateIndiceHistPerfMutationVariables = {
  input: CreateIndiceHistPerfInput,
  condition?: ModelIndiceHistPerfConditionInput | null,
};

export type CreateIndiceHistPerfMutation = {
  createIndiceHistPerf?:  {
    __typename: "IndiceHistPerf",
    name: string,
    p1m: number,
    p3m: number,
    p1y: number,
    p3y: number,
    p5y: number,
    vol: number,
    beta: number,
    corr: number,
    rsq: number,
    pe: number,
    pb: number,
    div: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateIndiceHistPerfMutationVariables = {
  input: UpdateIndiceHistPerfInput,
  condition?: ModelIndiceHistPerfConditionInput | null,
};

export type UpdateIndiceHistPerfMutation = {
  updateIndiceHistPerf?:  {
    __typename: "IndiceHistPerf",
    name: string,
    p1m: number,
    p3m: number,
    p1y: number,
    p3y: number,
    p5y: number,
    vol: number,
    beta: number,
    corr: number,
    rsq: number,
    pe: number,
    pb: number,
    div: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteIndiceHistPerfMutationVariables = {
  input: DeleteIndiceHistPerfInput,
  condition?: ModelIndiceHistPerfConditionInput | null,
};

export type DeleteIndiceHistPerfMutation = {
  deleteIndiceHistPerf?:  {
    __typename: "IndiceHistPerf",
    name: string,
    p1m: number,
    p3m: number,
    p1y: number,
    p3y: number,
    p5y: number,
    vol: number,
    beta: number,
    corr: number,
    rsq: number,
    pe: number,
    pb: number,
    div: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateIndexConstMutationVariables = {
  input: CreateIndexConstInput,
  condition?: ModelIndexConstConditionInput | null,
};

export type CreateIndexConstMutation = {
  createIndexConst?:  {
    __typename: "IndexConst",
    name: string,
    const: Array< string >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateIndexConstMutationVariables = {
  input: UpdateIndexConstInput,
  condition?: ModelIndexConstConditionInput | null,
};

export type UpdateIndexConstMutation = {
  updateIndexConst?:  {
    __typename: "IndexConst",
    name: string,
    const: Array< string >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteIndexConstMutationVariables = {
  input: DeleteIndexConstInput,
  condition?: ModelIndexConstConditionInput | null,
};

export type DeleteIndexConstMutation = {
  deleteIndexConst?:  {
    __typename: "IndexConst",
    name: string,
    const: Array< string >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateINBondPriceMutationVariables = {
  input: CreateINBondPriceInput,
  condition?: ModelINBondPriceConditionInput | null,
};

export type CreateINBondPriceMutation = {
  createINBondPrice?:  {
    __typename: "INBondPrice",
    id: string,
    sid: string,
    name: string,
    type: AssetType,
    subt: AssetSubType,
    price: number,
    prev?: number | null,
    exchg: Exchange,
    sm?: number | null,
    sy?: number | null,
    mm?: number | null,
    my?: number | null,
    rate: number,
    fv?: number | null,
    cr?: CreditRating | null,
    crstr?: string | null,
    ytm?: number | null,
    risk?: RiskProfile | null,
    itype?: InsType | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateINBondPriceMutationVariables = {
  input: UpdateINBondPriceInput,
  condition?: ModelINBondPriceConditionInput | null,
};

export type UpdateINBondPriceMutation = {
  updateINBondPrice?:  {
    __typename: "INBondPrice",
    id: string,
    sid: string,
    name: string,
    type: AssetType,
    subt: AssetSubType,
    price: number,
    prev?: number | null,
    exchg: Exchange,
    sm?: number | null,
    sy?: number | null,
    mm?: number | null,
    my?: number | null,
    rate: number,
    fv?: number | null,
    cr?: CreditRating | null,
    crstr?: string | null,
    ytm?: number | null,
    risk?: RiskProfile | null,
    itype?: InsType | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteINBondPriceMutationVariables = {
  input: DeleteINBondPriceInput,
  condition?: ModelINBondPriceConditionInput | null,
};

export type DeleteINBondPriceMutation = {
  deleteINBondPrice?:  {
    __typename: "INBondPrice",
    id: string,
    sid: string,
    name: string,
    type: AssetType,
    subt: AssetSubType,
    price: number,
    prev?: number | null,
    exchg: Exchange,
    sm?: number | null,
    sy?: number | null,
    mm?: number | null,
    my?: number | null,
    rate: number,
    fv?: number | null,
    cr?: CreditRating | null,
    crstr?: string | null,
    ytm?: number | null,
    risk?: RiskProfile | null,
    itype?: InsType | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateINMFPriceMutationVariables = {
  input: CreateINMFPriceInput,
  condition?: ModelINMFPriceConditionInput | null,
};

export type CreateINMFPriceMutation = {
  createINMFPrice?:  {
    __typename: "INMFPrice",
    id: string,
    sid: string,
    tid?: string | null,
    dir?: string | null,
    name: string,
    type: AssetType,
    subt: AssetSubType,
    price: number,
    prev?: number | null,
    mftype: MFSchemeType,
    mcapt?: MCap | null,
    tf?: boolean | null,
    risk?: RiskProfile | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateINMFPriceMutationVariables = {
  input: UpdateINMFPriceInput,
  condition?: ModelINMFPriceConditionInput | null,
};

export type UpdateINMFPriceMutation = {
  updateINMFPrice?:  {
    __typename: "INMFPrice",
    id: string,
    sid: string,
    tid?: string | null,
    dir?: string | null,
    name: string,
    type: AssetType,
    subt: AssetSubType,
    price: number,
    prev?: number | null,
    mftype: MFSchemeType,
    mcapt?: MCap | null,
    tf?: boolean | null,
    risk?: RiskProfile | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteINMFPriceMutationVariables = {
  input: DeleteINMFPriceInput,
  condition?: ModelINMFPriceConditionInput | null,
};

export type DeleteINMFPriceMutation = {
  deleteINMFPrice?:  {
    __typename: "INMFPrice",
    id: string,
    sid: string,
    tid?: string | null,
    dir?: string | null,
    name: string,
    type: AssetType,
    subt: AssetSubType,
    price: number,
    prev?: number | null,
    mftype: MFSchemeType,
    mcapt?: MCap | null,
    tf?: boolean | null,
    risk?: RiskProfile | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateNPSPriceMutationVariables = {
  input: CreateNPSPriceInput,
  condition?: ModelNPSPriceConditionInput | null,
};

export type CreateNPSPriceMutation = {
  createNPSPrice?:  {
    __typename: "NPSPrice",
    id: string,
    pfm: NPSPFM,
    st: NPSSchemeType,
    name: string,
    type: AssetType,
    subt: AssetSubType,
    price: number,
    prev?: number | null,
    risk?: RiskProfile | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateNPSPriceMutationVariables = {
  input: UpdateNPSPriceInput,
  condition?: ModelNPSPriceConditionInput | null,
};

export type UpdateNPSPriceMutation = {
  updateNPSPrice?:  {
    __typename: "NPSPrice",
    id: string,
    pfm: NPSPFM,
    st: NPSSchemeType,
    name: string,
    type: AssetType,
    subt: AssetSubType,
    price: number,
    prev?: number | null,
    risk?: RiskProfile | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteNPSPriceMutationVariables = {
  input: DeleteNPSPriceInput,
  condition?: ModelNPSPriceConditionInput | null,
};

export type DeleteNPSPriceMutation = {
  deleteNPSPrice?:  {
    __typename: "NPSPrice",
    id: string,
    pfm: NPSPFM,
    st: NPSSchemeType,
    name: string,
    type: AssetType,
    subt: AssetSubType,
    price: number,
    prev?: number | null,
    risk?: RiskProfile | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateCoachingReqMutationVariables = {
  input: CreateCoachingReqInput,
  condition?: ModelCoachingReqConditionInput | null,
};

export type CreateCoachingReqMutation = {
  createCoachingReq?:  {
    __typename: "CoachingReq",
    id: string,
    dur: number,
    text?: string | null,
    page: string,
    type: CoachingType,
    status: CoachingStatus,
    payment: number,
    curr: string,
    paid: boolean,
    pt?: PaymentType | null,
    email?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type UpdateCoachingReqMutationVariables = {
  input: UpdateCoachingReqInput,
  condition?: ModelCoachingReqConditionInput | null,
};

export type UpdateCoachingReqMutation = {
  updateCoachingReq?:  {
    __typename: "CoachingReq",
    id: string,
    dur: number,
    text?: string | null,
    page: string,
    type: CoachingType,
    status: CoachingStatus,
    payment: number,
    curr: string,
    paid: boolean,
    pt?: PaymentType | null,
    email?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type GetFeedbackQueryVariables = {
  id: string,
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
    uname?: string | null,
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
    items:  Array< {
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
      uname?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetRatingQueryVariables = {
  id: string,
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
    items:  Array< {
      __typename: "Rating",
      id: string,
      type: CalcType,
      rating: number,
      feedbackId?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetGoalQueryVariables = {
  id: string,
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
    met?: boolean | null,
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
    pp?:  {
      __typename: "PP",
      cash: number,
      ltdep: number,
      mtb?: number | null,
      imtb?: number | null,
      hyb?: number | null,
      ihyb?: number | null,
      teb?: number | null,
      reit?: number | null,
      ireit?: number | null,
      reitETF?: number | null,
      ireitETF?: number | null,
      re?: number | null,
      gold?: number | null,
      goldb?: number | null,
      lcs?: number | null,
      lcetf?: number | null,
      ilcs?: number | null,
      ilcetf?: number | null,
      mscs?: number | null,
      imscs?: number | null,
      dgs?: number | null,
      uc?: number | null,
      crypto?: number | null,
      p2p?: number | null,
    } | null,
    rp?: RiskProfile | null,
    bt?: BuyType | null,
    rc?: number | null,
    rcchg?: number | null,
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
    items:  Array< {
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
      met?: boolean | null,
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
      pp?:  {
        __typename: "PP",
        cash: number,
        ltdep: number,
        mtb?: number | null,
        imtb?: number | null,
        hyb?: number | null,
        ihyb?: number | null,
        teb?: number | null,
        reit?: number | null,
        ireit?: number | null,
        reitETF?: number | null,
        ireitETF?: number | null,
        re?: number | null,
        gold?: number | null,
        goldb?: number | null,
        lcs?: number | null,
        lcetf?: number | null,
        ilcs?: number | null,
        ilcetf?: number | null,
        mscs?: number | null,
        imscs?: number | null,
        dgs?: number | null,
        uc?: number | null,
        crypto?: number | null,
        p2p?: number | null,
      } | null,
      rp?: RiskProfile | null,
      bt?: BuyType | null,
      rc?: number | null,
      rcchg?: number | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetFamilyQueryVariables = {
  id: string,
};

export type GetFamilyQuery = {
  getFamily?:  {
    __typename: "Family",
    id: string,
    tid: string,
    name: string,
    tax: TaxLiability,
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
    items:  Array< {
      __typename: "Family",
      id: string,
      tid: string,
      name: string,
      tax: TaxLiability,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetUserInfoQueryVariables = {
  uname: string,
};

export type GetUserInfoQuery = {
  getUserInfo?:  {
    __typename: "UserInfo",
    uname: string,
    email: string,
    dob: string,
    im?: number | null,
    mob?: number | null,
    notify: boolean,
    tax: TaxLiability,
    rp: RiskProfile,
    dr: number,
    tc: string,
    ta?: number | null,
    tid?: string | null,
    exp?: number | null,
    invest?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListUserInfosQueryVariables = {
  uname?: string | null,
  filter?: ModelUserInfoFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListUserInfosQuery = {
  listUserInfos?:  {
    __typename: "ModelUserInfoConnection",
    items:  Array< {
      __typename: "UserInfo",
      uname: string,
      email: string,
      dob: string,
      im?: number | null,
      mob?: number | null,
      notify: boolean,
      tax: TaxLiability,
      rp: RiskProfile,
      dr: number,
      tc: string,
      ta?: number | null,
      tid?: string | null,
      exp?: number | null,
      invest?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type RegByIMQueryVariables = {
  im?: number | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserInfoFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type RegByIMQuery = {
  regByIM?:  {
    __typename: "ModelUserInfoConnection",
    items:  Array< {
      __typename: "UserInfo",
      uname: string,
      email: string,
      dob: string,
      im?: number | null,
      mob?: number | null,
      notify: boolean,
      tax: TaxLiability,
      rp: RiskProfile,
      dr: number,
      tc: string,
      ta?: number | null,
      tid?: string | null,
      exp?: number | null,
      invest?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type RegByMobQueryVariables = {
  mob?: number | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserInfoFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type RegByMobQuery = {
  regByMob?:  {
    __typename: "ModelUserInfoConnection",
    items:  Array< {
      __typename: "UserInfo",
      uname: string,
      email: string,
      dob: string,
      im?: number | null,
      mob?: number | null,
      notify: boolean,
      tax: TaxLiability,
      rp: RiskProfile,
      dr: number,
      tc: string,
      ta?: number | null,
      tid?: string | null,
      exp?: number | null,
      invest?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type RegByEmailQueryVariables = {
  email?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserInfoFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type RegByEmailQuery = {
  regByEmail?:  {
    __typename: "ModelUserInfoConnection",
    items:  Array< {
      __typename: "UserInfo",
      uname: string,
      email: string,
      dob: string,
      im?: number | null,
      mob?: number | null,
      notify: boolean,
      tax: TaxLiability,
      rp: RiskProfile,
      dr: number,
      tc: string,
      ta?: number | null,
      tid?: string | null,
      exp?: number | null,
      invest?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type RegByDOBQueryVariables = {
  dob?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserInfoFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type RegByDOBQuery = {
  regByDOB?:  {
    __typename: "ModelUserInfoConnection",
    items:  Array< {
      __typename: "UserInfo",
      uname: string,
      email: string,
      dob: string,
      im?: number | null,
      mob?: number | null,
      notify: boolean,
      tax: TaxLiability,
      rp: RiskProfile,
      dr: number,
      tc: string,
      ta?: number | null,
      tid?: string | null,
      exp?: number | null,
      invest?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type RegByTaxIdQueryVariables = {
  tid?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserInfoFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type RegByTaxIdQuery = {
  regByTaxId?:  {
    __typename: "ModelUserInfoConnection",
    items:  Array< {
      __typename: "UserInfo",
      uname: string,
      email: string,
      dob: string,
      im?: number | null,
      mob?: number | null,
      notify: boolean,
      tax: TaxLiability,
      rp: RiskProfile,
      dr: number,
      tc: string,
      ta?: number | null,
      tid?: string | null,
      exp?: number | null,
      invest?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetInsAnalyticsQueryVariables = {
  id: string,
};

export type GetInsAnalyticsQuery = {
  getInsAnalytics?:  {
    __typename: "InsAnalytics",
    id: string,
    analytics: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListInsAnalyticssQueryVariables = {
  id?: string | null,
  filter?: ModelInsAnalyticsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListInsAnalyticssQuery = {
  listInsAnalyticss?:  {
    __typename: "ModelInsAnalyticsConnection",
    items:  Array< {
      __typename: "InsAnalytics",
      id: string,
      analytics: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetFeedsQueryVariables = {
  id: string,
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
    items:  Array< {
      __typename: "Feeds",
      id: string,
      tname: string,
      exchg?: Exchange | null,
      url?: string | null,
      count: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetINExchgFunQueryVariables = {
  id: string,
};

export type GetINExchgFunQuery = {
  getINExchgFun?:  {
    __typename: "INExchgFun",
    id: string,
    isin?: string | null,
    exchg: Exchange,
    sector?: string | null,
    ind?: string | null,
    tech?: string | null,
    val?: string | null,
    risk?: RiskProfile | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListINExchgFunsQueryVariables = {
  id?: string | null,
  filter?: ModelINExchgFunFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListINExchgFunsQuery = {
  listINExchgFuns?:  {
    __typename: "ModelINExchgFunConnection",
    items:  Array< {
      __typename: "INExchgFun",
      id: string,
      isin?: string | null,
      exchg: Exchange,
      sector?: string | null,
      ind?: string | null,
      tech?: string | null,
      val?: string | null,
      risk?: RiskProfile | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetINExchgPriceQueryVariables = {
  id: string,
};

export type GetINExchgPriceQuery = {
  getINExchgPrice?:  {
    __typename: "INExchgPrice",
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
    yhighd?: string | null,
    ylow?: number | null,
    ylowd?: string | null,
    split?: string | null,
    div?: number | null,
    splitd?: string | null,
    divdd?: string | null,
    divrd?: string | null,
    divpd?: string | null,
    beta?: number | null,
    mcap?: number | null,
    mcapt?: MCap | null,
    sector?: string | null,
    ind?: string | null,
    risk?: RiskProfile | null,
    vol?: number | null,
    prevol?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListINExchgPricesQueryVariables = {
  id?: string | null,
  filter?: ModelINExchgPriceFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListINExchgPricesQuery = {
  listINExchgPrices?:  {
    __typename: "ModelINExchgPriceConnection",
    items:  Array< {
      __typename: "INExchgPrice",
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
      yhighd?: string | null,
      ylow?: number | null,
      ylowd?: string | null,
      split?: string | null,
      div?: number | null,
      splitd?: string | null,
      divdd?: string | null,
      divrd?: string | null,
      divpd?: string | null,
      beta?: number | null,
      mcap?: number | null,
      mcapt?: MCap | null,
      sector?: string | null,
      ind?: string | null,
      risk?: RiskProfile | null,
      vol?: number | null,
      prevol?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetAllIndicesQueryVariables = {
  id: string,
};

export type GetAllIndicesQuery = {
  getAllIndices?:  {
    __typename: "AllIndices",
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

export type ListAllIndicessQueryVariables = {
  id?: string | null,
  filter?: ModelAllIndicesFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListAllIndicessQuery = {
  listAllIndicess?:  {
    __typename: "ModelAllIndicesConnection",
    items:  Array< {
      __typename: "AllIndices",
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
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetInsHistPerfQueryVariables = {
  id: string,
};

export type GetInsHistPerfQuery = {
  getInsHistPerf?:  {
    __typename: "InsHistPerf",
    id: string,
    p1y: number,
    p3y: number,
    p5y: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListInsHistPerfsQueryVariables = {
  id?: string | null,
  filter?: ModelInsHistPerfFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListInsHistPerfsQuery = {
  listInsHistPerfs?:  {
    __typename: "ModelInsHistPerfConnection",
    items:  Array< {
      __typename: "InsHistPerf",
      id: string,
      p1y: number,
      p3y: number,
      p5y: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetIndiceHistPerfQueryVariables = {
  name: string,
};

export type GetIndiceHistPerfQuery = {
  getIndiceHistPerf?:  {
    __typename: "IndiceHistPerf",
    name: string,
    p1m: number,
    p3m: number,
    p1y: number,
    p3y: number,
    p5y: number,
    vol: number,
    beta: number,
    corr: number,
    rsq: number,
    pe: number,
    pb: number,
    div: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListIndiceHistPerfsQueryVariables = {
  name?: string | null,
  filter?: ModelIndiceHistPerfFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListIndiceHistPerfsQuery = {
  listIndiceHistPerfs?:  {
    __typename: "ModelIndiceHistPerfConnection",
    items:  Array< {
      __typename: "IndiceHistPerf",
      name: string,
      p1m: number,
      p3m: number,
      p1y: number,
      p3y: number,
      p5y: number,
      vol: number,
      beta: number,
      corr: number,
      rsq: number,
      pe: number,
      pb: number,
      div: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetIndexConstQueryVariables = {
  name: string,
};

export type GetIndexConstQuery = {
  getIndexConst?:  {
    __typename: "IndexConst",
    name: string,
    const: Array< string >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListIndexConstsQueryVariables = {
  name?: string | null,
  filter?: ModelIndexConstFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListIndexConstsQuery = {
  listIndexConsts?:  {
    __typename: "ModelIndexConstConnection",
    items:  Array< {
      __typename: "IndexConst",
      name: string,
      const: Array< string >,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetINBondPriceQueryVariables = {
  id: string,
};

export type GetINBondPriceQuery = {
  getINBondPrice?:  {
    __typename: "INBondPrice",
    id: string,
    sid: string,
    name: string,
    type: AssetType,
    subt: AssetSubType,
    price: number,
    prev?: number | null,
    exchg: Exchange,
    sm?: number | null,
    sy?: number | null,
    mm?: number | null,
    my?: number | null,
    rate: number,
    fv?: number | null,
    cr?: CreditRating | null,
    crstr?: string | null,
    ytm?: number | null,
    risk?: RiskProfile | null,
    itype?: InsType | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListINBondPricesQueryVariables = {
  id?: string | null,
  filter?: ModelINBondPriceFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListINBondPricesQuery = {
  listINBondPrices?:  {
    __typename: "ModelINBondPriceConnection",
    items:  Array< {
      __typename: "INBondPrice",
      id: string,
      sid: string,
      name: string,
      type: AssetType,
      subt: AssetSubType,
      price: number,
      prev?: number | null,
      exchg: Exchange,
      sm?: number | null,
      sy?: number | null,
      mm?: number | null,
      my?: number | null,
      rate: number,
      fv?: number | null,
      cr?: CreditRating | null,
      crstr?: string | null,
      ytm?: number | null,
      risk?: RiskProfile | null,
      itype?: InsType | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetINMFPriceQueryVariables = {
  id: string,
};

export type GetINMFPriceQuery = {
  getINMFPrice?:  {
    __typename: "INMFPrice",
    id: string,
    sid: string,
    tid?: string | null,
    dir?: string | null,
    name: string,
    type: AssetType,
    subt: AssetSubType,
    price: number,
    prev?: number | null,
    mftype: MFSchemeType,
    mcapt?: MCap | null,
    tf?: boolean | null,
    risk?: RiskProfile | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListINMFPricesQueryVariables = {
  id?: string | null,
  filter?: ModelINMFPriceFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListINMFPricesQuery = {
  listINMFPrices?:  {
    __typename: "ModelINMFPriceConnection",
    items:  Array< {
      __typename: "INMFPrice",
      id: string,
      sid: string,
      tid?: string | null,
      dir?: string | null,
      name: string,
      type: AssetType,
      subt: AssetSubType,
      price: number,
      prev?: number | null,
      mftype: MFSchemeType,
      mcapt?: MCap | null,
      tf?: boolean | null,
      risk?: RiskProfile | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetNPSPriceQueryVariables = {
  id: string,
};

export type GetNPSPriceQuery = {
  getNPSPrice?:  {
    __typename: "NPSPrice",
    id: string,
    pfm: NPSPFM,
    st: NPSSchemeType,
    name: string,
    type: AssetType,
    subt: AssetSubType,
    price: number,
    prev?: number | null,
    risk?: RiskProfile | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListNPSPricesQueryVariables = {
  id?: string | null,
  filter?: ModelNPSPriceFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListNPSPricesQuery = {
  listNPSPrices?:  {
    __typename: "ModelNPSPriceConnection",
    items:  Array< {
      __typename: "NPSPrice",
      id: string,
      pfm: NPSPFM,
      st: NPSSchemeType,
      name: string,
      type: AssetType,
      subt: AssetSubType,
      price: number,
      prev?: number | null,
      risk?: RiskProfile | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetUserHoldingsQueryVariables = {
  uname: string,
};

export type GetUserHoldingsQuery = {
  getUserHoldings?:  {
    __typename: "UserHoldings",
    uname: string,
    dep?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    ltdep?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    p2p?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    loans?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    credit?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    savings?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    property?:  Array< {
      __typename: "Property",
      type: PropertyType,
      name?: string | null,
      pin?: number | null,
      purchase?:  {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } | null,
      address?: string | null,
      curr: string,
      city?: string | null,
      country?: string | null,
      state?: string | null,
      own:  Array< {
        __typename: "Ownership",
        fId: string,
        per: number,
      } >,
      rate: number,
      mv?: number | null,
      mvy?: number | null,
      mvm?: number | null,
      res: boolean,
    } > | null,
    vehicles?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    pm?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    pf?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    nps?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    crypto?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    ins?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    other?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    angel?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type ListUserHoldingssQueryVariables = {
  uname?: string | null,
  filter?: ModelUserHoldingsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListUserHoldingssQuery = {
  listUserHoldingss?:  {
    __typename: "ModelUserHoldingsConnection",
    items:  Array< {
      __typename: "UserHoldings",
      uname: string,
      dep?:  Array< {
        __typename: "Holding",
        id: string,
        qty: number,
        name?: string | null,
        fId: string,
        curr: string,
        chg?: number | null,
        chgF?: number | null,
        payF?: number | null,
        type?: string | null,
        subt?: string | null,
        sm?: number | null,
        sy?: number | null,
        em?: number | null,
        ey?: number | null,
        amt?: number | null,
      } > | null,
      ltdep?:  Array< {
        __typename: "Holding",
        id: string,
        qty: number,
        name?: string | null,
        fId: string,
        curr: string,
        chg?: number | null,
        chgF?: number | null,
        payF?: number | null,
        type?: string | null,
        subt?: string | null,
        sm?: number | null,
        sy?: number | null,
        em?: number | null,
        ey?: number | null,
        amt?: number | null,
      } > | null,
      p2p?:  Array< {
        __typename: "Holding",
        id: string,
        qty: number,
        name?: string | null,
        fId: string,
        curr: string,
        chg?: number | null,
        chgF?: number | null,
        payF?: number | null,
        type?: string | null,
        subt?: string | null,
        sm?: number | null,
        sy?: number | null,
        em?: number | null,
        ey?: number | null,
        amt?: number | null,
      } > | null,
      loans?:  Array< {
        __typename: "Holding",
        id: string,
        qty: number,
        name?: string | null,
        fId: string,
        curr: string,
        chg?: number | null,
        chgF?: number | null,
        payF?: number | null,
        type?: string | null,
        subt?: string | null,
        sm?: number | null,
        sy?: number | null,
        em?: number | null,
        ey?: number | null,
        amt?: number | null,
      } > | null,
      credit?:  Array< {
        __typename: "Holding",
        id: string,
        qty: number,
        name?: string | null,
        fId: string,
        curr: string,
        chg?: number | null,
        chgF?: number | null,
        payF?: number | null,
        type?: string | null,
        subt?: string | null,
        sm?: number | null,
        sy?: number | null,
        em?: number | null,
        ey?: number | null,
        amt?: number | null,
      } > | null,
      savings?:  Array< {
        __typename: "Holding",
        id: string,
        qty: number,
        name?: string | null,
        fId: string,
        curr: string,
        chg?: number | null,
        chgF?: number | null,
        payF?: number | null,
        type?: string | null,
        subt?: string | null,
        sm?: number | null,
        sy?: number | null,
        em?: number | null,
        ey?: number | null,
        amt?: number | null,
      } > | null,
      property?:  Array< {
        __typename: "Property",
        type: PropertyType,
        name?: string | null,
        pin?: number | null,
        address?: string | null,
        curr: string,
        city?: string | null,
        country?: string | null,
        state?: string | null,
        rate: number,
        mv?: number | null,
        mvy?: number | null,
        mvm?: number | null,
        res: boolean,
      } > | null,
      vehicles?:  Array< {
        __typename: "Holding",
        id: string,
        qty: number,
        name?: string | null,
        fId: string,
        curr: string,
        chg?: number | null,
        chgF?: number | null,
        payF?: number | null,
        type?: string | null,
        subt?: string | null,
        sm?: number | null,
        sy?: number | null,
        em?: number | null,
        ey?: number | null,
        amt?: number | null,
      } > | null,
      pm?:  Array< {
        __typename: "Holding",
        id: string,
        qty: number,
        name?: string | null,
        fId: string,
        curr: string,
        chg?: number | null,
        chgF?: number | null,
        payF?: number | null,
        type?: string | null,
        subt?: string | null,
        sm?: number | null,
        sy?: number | null,
        em?: number | null,
        ey?: number | null,
        amt?: number | null,
      } > | null,
      pf?:  Array< {
        __typename: "Holding",
        id: string,
        qty: number,
        name?: string | null,
        fId: string,
        curr: string,
        chg?: number | null,
        chgF?: number | null,
        payF?: number | null,
        type?: string | null,
        subt?: string | null,
        sm?: number | null,
        sy?: number | null,
        em?: number | null,
        ey?: number | null,
        amt?: number | null,
      } > | null,
      nps?:  Array< {
        __typename: "Holding",
        id: string,
        qty: number,
        name?: string | null,
        fId: string,
        curr: string,
        chg?: number | null,
        chgF?: number | null,
        payF?: number | null,
        type?: string | null,
        subt?: string | null,
        sm?: number | null,
        sy?: number | null,
        em?: number | null,
        ey?: number | null,
        amt?: number | null,
      } > | null,
      crypto?:  Array< {
        __typename: "Holding",
        id: string,
        qty: number,
        name?: string | null,
        fId: string,
        curr: string,
        chg?: number | null,
        chgF?: number | null,
        payF?: number | null,
        type?: string | null,
        subt?: string | null,
        sm?: number | null,
        sy?: number | null,
        em?: number | null,
        ey?: number | null,
        amt?: number | null,
      } > | null,
      ins?:  Array< {
        __typename: "Holding",
        id: string,
        qty: number,
        name?: string | null,
        fId: string,
        curr: string,
        chg?: number | null,
        chgF?: number | null,
        payF?: number | null,
        type?: string | null,
        subt?: string | null,
        sm?: number | null,
        sy?: number | null,
        em?: number | null,
        ey?: number | null,
        amt?: number | null,
      } > | null,
      other?:  Array< {
        __typename: "Holding",
        id: string,
        qty: number,
        name?: string | null,
        fId: string,
        curr: string,
        chg?: number | null,
        chgF?: number | null,
        payF?: number | null,
        type?: string | null,
        subt?: string | null,
        sm?: number | null,
        sy?: number | null,
        em?: number | null,
        ey?: number | null,
        amt?: number | null,
      } > | null,
      angel?:  Array< {
        __typename: "Holding",
        id: string,
        qty: number,
        name?: string | null,
        fId: string,
        curr: string,
        chg?: number | null,
        chgF?: number | null,
        payF?: number | null,
        type?: string | null,
        subt?: string | null,
        sm?: number | null,
        sy?: number | null,
        em?: number | null,
        ey?: number | null,
        amt?: number | null,
      } > | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetUserInsQueryVariables = {
  uname: string,
};

export type GetUserInsQuery = {
  getUserIns?:  {
    __typename: "UserIns",
    uname: string,
    ins:  Array< {
      __typename: "Instrument",
      id: string,
      sid?: string | null,
      exchg?: string | null,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      fId: string,
      curr: string,
      type?: AssetType | null,
      subt?: AssetSubType | null,
    } >,
    watch?:  Array< {
      __typename: "InsWatch",
      id: string,
      sid?: string | null,
      hight?: number | null,
      lowt?: number | null,
      type?: AssetType | null,
      subt?: AssetSubType | null,
      itype?: InsType | null,
      curr?: string | null,
    } > | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type ListUserInssQueryVariables = {
  uname?: string | null,
  filter?: ModelUserInsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListUserInssQuery = {
  listUserInss?:  {
    __typename: "ModelUserInsConnection",
    items:  Array< {
      __typename: "UserIns",
      uname: string,
      ins:  Array< {
        __typename: "Instrument",
        id: string,
        sid?: string | null,
        exchg?: string | null,
        qty: number,
        fId: string,
        curr: string,
        type?: AssetType | null,
        subt?: AssetSubType | null,
      } >,
      watch?:  Array< {
        __typename: "InsWatch",
        id: string,
        sid?: string | null,
        hight?: number | null,
        lowt?: number | null,
        type?: AssetType | null,
        subt?: AssetSubType | null,
        itype?: InsType | null,
        curr?: string | null,
      } > | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetCoachingReqQueryVariables = {
  id: string,
};

export type GetCoachingReqQuery = {
  getCoachingReq?:  {
    __typename: "CoachingReq",
    id: string,
    dur: number,
    text?: string | null,
    page: string,
    type: CoachingType,
    status: CoachingStatus,
    payment: number,
    curr: string,
    paid: boolean,
    pt?: PaymentType | null,
    email?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type ListCoachingReqsQueryVariables = {
  filter?: ModelCoachingReqFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListCoachingReqsQuery = {
  listCoachingReqs?:  {
    __typename: "ModelCoachingReqConnection",
    items:  Array< {
      __typename: "CoachingReq",
      id: string,
      dur: number,
      text?: string | null,
      page: string,
      type: CoachingType,
      status: CoachingStatus,
      payment: number,
      curr: string,
      paid: boolean,
      pt?: PaymentType | null,
      email?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
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
    uname?: string | null,
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
    uname?: string | null,
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
    uname?: string | null,
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

export type OnCreateGoalSubscriptionVariables = {
  owner: string,
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
    met?: boolean | null,
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
    pp?:  {
      __typename: "PP",
      cash: number,
      ltdep: number,
      mtb?: number | null,
      imtb?: number | null,
      hyb?: number | null,
      ihyb?: number | null,
      teb?: number | null,
      reit?: number | null,
      ireit?: number | null,
      reitETF?: number | null,
      ireitETF?: number | null,
      re?: number | null,
      gold?: number | null,
      goldb?: number | null,
      lcs?: number | null,
      lcetf?: number | null,
      ilcs?: number | null,
      ilcetf?: number | null,
      mscs?: number | null,
      imscs?: number | null,
      dgs?: number | null,
      uc?: number | null,
      crypto?: number | null,
      p2p?: number | null,
    } | null,
    rp?: RiskProfile | null,
    bt?: BuyType | null,
    rc?: number | null,
    rcchg?: number | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnUpdateGoalSubscriptionVariables = {
  owner: string,
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
    met?: boolean | null,
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
    pp?:  {
      __typename: "PP",
      cash: number,
      ltdep: number,
      mtb?: number | null,
      imtb?: number | null,
      hyb?: number | null,
      ihyb?: number | null,
      teb?: number | null,
      reit?: number | null,
      ireit?: number | null,
      reitETF?: number | null,
      ireitETF?: number | null,
      re?: number | null,
      gold?: number | null,
      goldb?: number | null,
      lcs?: number | null,
      lcetf?: number | null,
      ilcs?: number | null,
      ilcetf?: number | null,
      mscs?: number | null,
      imscs?: number | null,
      dgs?: number | null,
      uc?: number | null,
      crypto?: number | null,
      p2p?: number | null,
    } | null,
    rp?: RiskProfile | null,
    bt?: BuyType | null,
    rc?: number | null,
    rcchg?: number | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnDeleteGoalSubscriptionVariables = {
  owner: string,
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
    met?: boolean | null,
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
    pp?:  {
      __typename: "PP",
      cash: number,
      ltdep: number,
      mtb?: number | null,
      imtb?: number | null,
      hyb?: number | null,
      ihyb?: number | null,
      teb?: number | null,
      reit?: number | null,
      ireit?: number | null,
      reitETF?: number | null,
      ireitETF?: number | null,
      re?: number | null,
      gold?: number | null,
      goldb?: number | null,
      lcs?: number | null,
      lcetf?: number | null,
      ilcs?: number | null,
      ilcetf?: number | null,
      mscs?: number | null,
      imscs?: number | null,
      dgs?: number | null,
      uc?: number | null,
      crypto?: number | null,
      p2p?: number | null,
    } | null,
    rp?: RiskProfile | null,
    bt?: BuyType | null,
    rc?: number | null,
    rcchg?: number | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnCreateFamilySubscriptionVariables = {
  owner: string,
};

export type OnCreateFamilySubscription = {
  onCreateFamily?:  {
    __typename: "Family",
    id: string,
    tid: string,
    name: string,
    tax: TaxLiability,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnUpdateFamilySubscriptionVariables = {
  owner: string,
};

export type OnUpdateFamilySubscription = {
  onUpdateFamily?:  {
    __typename: "Family",
    id: string,
    tid: string,
    name: string,
    tax: TaxLiability,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnDeleteFamilySubscriptionVariables = {
  owner: string,
};

export type OnDeleteFamilySubscription = {
  onDeleteFamily?:  {
    __typename: "Family",
    id: string,
    tid: string,
    name: string,
    tax: TaxLiability,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnCreateUserInfoSubscription = {
  onCreateUserInfo?:  {
    __typename: "UserInfo",
    uname: string,
    email: string,
    dob: string,
    im?: number | null,
    mob?: number | null,
    notify: boolean,
    tax: TaxLiability,
    rp: RiskProfile,
    dr: number,
    tc: string,
    ta?: number | null,
    tid?: string | null,
    exp?: number | null,
    invest?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateUserInfoSubscription = {
  onUpdateUserInfo?:  {
    __typename: "UserInfo",
    uname: string,
    email: string,
    dob: string,
    im?: number | null,
    mob?: number | null,
    notify: boolean,
    tax: TaxLiability,
    rp: RiskProfile,
    dr: number,
    tc: string,
    ta?: number | null,
    tid?: string | null,
    exp?: number | null,
    invest?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteUserInfoSubscription = {
  onDeleteUserInfo?:  {
    __typename: "UserInfo",
    uname: string,
    email: string,
    dob: string,
    im?: number | null,
    mob?: number | null,
    notify: boolean,
    tax: TaxLiability,
    rp: RiskProfile,
    dr: number,
    tc: string,
    ta?: number | null,
    tid?: string | null,
    exp?: number | null,
    invest?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateInsAnalyticsSubscription = {
  onCreateInsAnalytics?:  {
    __typename: "InsAnalytics",
    id: string,
    analytics: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateInsAnalyticsSubscription = {
  onUpdateInsAnalytics?:  {
    __typename: "InsAnalytics",
    id: string,
    analytics: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteInsAnalyticsSubscription = {
  onDeleteInsAnalytics?:  {
    __typename: "InsAnalytics",
    id: string,
    analytics: string,
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

export type OnCreateINExchgFunSubscription = {
  onCreateINExchgFun?:  {
    __typename: "INExchgFun",
    id: string,
    isin?: string | null,
    exchg: Exchange,
    sector?: string | null,
    ind?: string | null,
    tech?: string | null,
    val?: string | null,
    risk?: RiskProfile | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateINExchgFunSubscription = {
  onUpdateINExchgFun?:  {
    __typename: "INExchgFun",
    id: string,
    isin?: string | null,
    exchg: Exchange,
    sector?: string | null,
    ind?: string | null,
    tech?: string | null,
    val?: string | null,
    risk?: RiskProfile | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteINExchgFunSubscription = {
  onDeleteINExchgFun?:  {
    __typename: "INExchgFun",
    id: string,
    isin?: string | null,
    exchg: Exchange,
    sector?: string | null,
    ind?: string | null,
    tech?: string | null,
    val?: string | null,
    risk?: RiskProfile | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateINExchgPriceSubscription = {
  onCreateINExchgPrice?:  {
    __typename: "INExchgPrice",
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
    yhighd?: string | null,
    ylow?: number | null,
    ylowd?: string | null,
    split?: string | null,
    div?: number | null,
    splitd?: string | null,
    divdd?: string | null,
    divrd?: string | null,
    divpd?: string | null,
    beta?: number | null,
    mcap?: number | null,
    mcapt?: MCap | null,
    sector?: string | null,
    ind?: string | null,
    risk?: RiskProfile | null,
    vol?: number | null,
    prevol?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateINExchgPriceSubscription = {
  onUpdateINExchgPrice?:  {
    __typename: "INExchgPrice",
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
    yhighd?: string | null,
    ylow?: number | null,
    ylowd?: string | null,
    split?: string | null,
    div?: number | null,
    splitd?: string | null,
    divdd?: string | null,
    divrd?: string | null,
    divpd?: string | null,
    beta?: number | null,
    mcap?: number | null,
    mcapt?: MCap | null,
    sector?: string | null,
    ind?: string | null,
    risk?: RiskProfile | null,
    vol?: number | null,
    prevol?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteINExchgPriceSubscription = {
  onDeleteINExchgPrice?:  {
    __typename: "INExchgPrice",
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
    yhighd?: string | null,
    ylow?: number | null,
    ylowd?: string | null,
    split?: string | null,
    div?: number | null,
    splitd?: string | null,
    divdd?: string | null,
    divrd?: string | null,
    divpd?: string | null,
    beta?: number | null,
    mcap?: number | null,
    mcapt?: MCap | null,
    sector?: string | null,
    ind?: string | null,
    risk?: RiskProfile | null,
    vol?: number | null,
    prevol?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateAllIndicesSubscription = {
  onCreateAllIndices?:  {
    __typename: "AllIndices",
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

export type OnUpdateAllIndicesSubscription = {
  onUpdateAllIndices?:  {
    __typename: "AllIndices",
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

export type OnDeleteAllIndicesSubscription = {
  onDeleteAllIndices?:  {
    __typename: "AllIndices",
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

export type OnCreateInsHistPerfSubscription = {
  onCreateInsHistPerf?:  {
    __typename: "InsHistPerf",
    id: string,
    p1y: number,
    p3y: number,
    p5y: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateInsHistPerfSubscription = {
  onUpdateInsHistPerf?:  {
    __typename: "InsHistPerf",
    id: string,
    p1y: number,
    p3y: number,
    p5y: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteInsHistPerfSubscription = {
  onDeleteInsHistPerf?:  {
    __typename: "InsHistPerf",
    id: string,
    p1y: number,
    p3y: number,
    p5y: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateIndiceHistPerfSubscription = {
  onCreateIndiceHistPerf?:  {
    __typename: "IndiceHistPerf",
    name: string,
    p1m: number,
    p3m: number,
    p1y: number,
    p3y: number,
    p5y: number,
    vol: number,
    beta: number,
    corr: number,
    rsq: number,
    pe: number,
    pb: number,
    div: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateIndiceHistPerfSubscription = {
  onUpdateIndiceHistPerf?:  {
    __typename: "IndiceHistPerf",
    name: string,
    p1m: number,
    p3m: number,
    p1y: number,
    p3y: number,
    p5y: number,
    vol: number,
    beta: number,
    corr: number,
    rsq: number,
    pe: number,
    pb: number,
    div: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteIndiceHistPerfSubscription = {
  onDeleteIndiceHistPerf?:  {
    __typename: "IndiceHistPerf",
    name: string,
    p1m: number,
    p3m: number,
    p1y: number,
    p3y: number,
    p5y: number,
    vol: number,
    beta: number,
    corr: number,
    rsq: number,
    pe: number,
    pb: number,
    div: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateIndexConstSubscription = {
  onCreateIndexConst?:  {
    __typename: "IndexConst",
    name: string,
    const: Array< string >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateIndexConstSubscription = {
  onUpdateIndexConst?:  {
    __typename: "IndexConst",
    name: string,
    const: Array< string >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteIndexConstSubscription = {
  onDeleteIndexConst?:  {
    __typename: "IndexConst",
    name: string,
    const: Array< string >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateINBondPriceSubscription = {
  onCreateINBondPrice?:  {
    __typename: "INBondPrice",
    id: string,
    sid: string,
    name: string,
    type: AssetType,
    subt: AssetSubType,
    price: number,
    prev?: number | null,
    exchg: Exchange,
    sm?: number | null,
    sy?: number | null,
    mm?: number | null,
    my?: number | null,
    rate: number,
    fv?: number | null,
    cr?: CreditRating | null,
    crstr?: string | null,
    ytm?: number | null,
    risk?: RiskProfile | null,
    itype?: InsType | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateINBondPriceSubscription = {
  onUpdateINBondPrice?:  {
    __typename: "INBondPrice",
    id: string,
    sid: string,
    name: string,
    type: AssetType,
    subt: AssetSubType,
    price: number,
    prev?: number | null,
    exchg: Exchange,
    sm?: number | null,
    sy?: number | null,
    mm?: number | null,
    my?: number | null,
    rate: number,
    fv?: number | null,
    cr?: CreditRating | null,
    crstr?: string | null,
    ytm?: number | null,
    risk?: RiskProfile | null,
    itype?: InsType | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteINBondPriceSubscription = {
  onDeleteINBondPrice?:  {
    __typename: "INBondPrice",
    id: string,
    sid: string,
    name: string,
    type: AssetType,
    subt: AssetSubType,
    price: number,
    prev?: number | null,
    exchg: Exchange,
    sm?: number | null,
    sy?: number | null,
    mm?: number | null,
    my?: number | null,
    rate: number,
    fv?: number | null,
    cr?: CreditRating | null,
    crstr?: string | null,
    ytm?: number | null,
    risk?: RiskProfile | null,
    itype?: InsType | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateINMFPriceSubscription = {
  onCreateINMFPrice?:  {
    __typename: "INMFPrice",
    id: string,
    sid: string,
    tid?: string | null,
    dir?: string | null,
    name: string,
    type: AssetType,
    subt: AssetSubType,
    price: number,
    prev?: number | null,
    mftype: MFSchemeType,
    mcapt?: MCap | null,
    tf?: boolean | null,
    risk?: RiskProfile | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateINMFPriceSubscription = {
  onUpdateINMFPrice?:  {
    __typename: "INMFPrice",
    id: string,
    sid: string,
    tid?: string | null,
    dir?: string | null,
    name: string,
    type: AssetType,
    subt: AssetSubType,
    price: number,
    prev?: number | null,
    mftype: MFSchemeType,
    mcapt?: MCap | null,
    tf?: boolean | null,
    risk?: RiskProfile | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteINMFPriceSubscription = {
  onDeleteINMFPrice?:  {
    __typename: "INMFPrice",
    id: string,
    sid: string,
    tid?: string | null,
    dir?: string | null,
    name: string,
    type: AssetType,
    subt: AssetSubType,
    price: number,
    prev?: number | null,
    mftype: MFSchemeType,
    mcapt?: MCap | null,
    tf?: boolean | null,
    risk?: RiskProfile | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateNPSPriceSubscription = {
  onCreateNPSPrice?:  {
    __typename: "NPSPrice",
    id: string,
    pfm: NPSPFM,
    st: NPSSchemeType,
    name: string,
    type: AssetType,
    subt: AssetSubType,
    price: number,
    prev?: number | null,
    risk?: RiskProfile | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateNPSPriceSubscription = {
  onUpdateNPSPrice?:  {
    __typename: "NPSPrice",
    id: string,
    pfm: NPSPFM,
    st: NPSSchemeType,
    name: string,
    type: AssetType,
    subt: AssetSubType,
    price: number,
    prev?: number | null,
    risk?: RiskProfile | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteNPSPriceSubscription = {
  onDeleteNPSPrice?:  {
    __typename: "NPSPrice",
    id: string,
    pfm: NPSPFM,
    st: NPSSchemeType,
    name: string,
    type: AssetType,
    subt: AssetSubType,
    price: number,
    prev?: number | null,
    risk?: RiskProfile | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateUserHoldingsSubscriptionVariables = {
  owner?: string | null,
};

export type OnCreateUserHoldingsSubscription = {
  onCreateUserHoldings?:  {
    __typename: "UserHoldings",
    uname: string,
    dep?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    ltdep?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    p2p?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    loans?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    credit?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    savings?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    property?:  Array< {
      __typename: "Property",
      type: PropertyType,
      name?: string | null,
      pin?: number | null,
      purchase?:  {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } | null,
      address?: string | null,
      curr: string,
      city?: string | null,
      country?: string | null,
      state?: string | null,
      own:  Array< {
        __typename: "Ownership",
        fId: string,
        per: number,
      } >,
      rate: number,
      mv?: number | null,
      mvy?: number | null,
      mvm?: number | null,
      res: boolean,
    } > | null,
    vehicles?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    pm?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    pf?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    nps?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    crypto?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    ins?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    other?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    angel?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnUpdateUserHoldingsSubscriptionVariables = {
  owner?: string | null,
};

export type OnUpdateUserHoldingsSubscription = {
  onUpdateUserHoldings?:  {
    __typename: "UserHoldings",
    uname: string,
    dep?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    ltdep?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    p2p?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    loans?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    credit?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    savings?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    property?:  Array< {
      __typename: "Property",
      type: PropertyType,
      name?: string | null,
      pin?: number | null,
      purchase?:  {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } | null,
      address?: string | null,
      curr: string,
      city?: string | null,
      country?: string | null,
      state?: string | null,
      own:  Array< {
        __typename: "Ownership",
        fId: string,
        per: number,
      } >,
      rate: number,
      mv?: number | null,
      mvy?: number | null,
      mvm?: number | null,
      res: boolean,
    } > | null,
    vehicles?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    pm?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    pf?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    nps?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    crypto?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    ins?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    other?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    angel?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnDeleteUserHoldingsSubscriptionVariables = {
  owner?: string | null,
};

export type OnDeleteUserHoldingsSubscription = {
  onDeleteUserHoldings?:  {
    __typename: "UserHoldings",
    uname: string,
    dep?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    ltdep?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    p2p?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    loans?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    credit?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    savings?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    property?:  Array< {
      __typename: "Property",
      type: PropertyType,
      name?: string | null,
      pin?: number | null,
      purchase?:  {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } | null,
      address?: string | null,
      curr: string,
      city?: string | null,
      country?: string | null,
      state?: string | null,
      own:  Array< {
        __typename: "Ownership",
        fId: string,
        per: number,
      } >,
      rate: number,
      mv?: number | null,
      mvy?: number | null,
      mvm?: number | null,
      res: boolean,
    } > | null,
    vehicles?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    pm?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    pf?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    nps?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    crypto?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    ins?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    other?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    angel?:  Array< {
      __typename: "Holding",
      id: string,
      qty: number,
      name?: string | null,
      fId: string,
      curr: string,
      chg?: number | null,
      chgF?: number | null,
      payF?: number | null,
      type?: string | null,
      subt?: string | null,
      sm?: number | null,
      sy?: number | null,
      em?: number | null,
      ey?: number | null,
      amt?: number | null,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
    } > | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnCreateUserInsSubscriptionVariables = {
  owner?: string | null,
};

export type OnCreateUserInsSubscription = {
  onCreateUserIns?:  {
    __typename: "UserIns",
    uname: string,
    ins:  Array< {
      __typename: "Instrument",
      id: string,
      sid?: string | null,
      exchg?: string | null,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      fId: string,
      curr: string,
      type?: AssetType | null,
      subt?: AssetSubType | null,
    } >,
    watch?:  Array< {
      __typename: "InsWatch",
      id: string,
      sid?: string | null,
      hight?: number | null,
      lowt?: number | null,
      type?: AssetType | null,
      subt?: AssetSubType | null,
      itype?: InsType | null,
      curr?: string | null,
    } > | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnUpdateUserInsSubscriptionVariables = {
  owner?: string | null,
};

export type OnUpdateUserInsSubscription = {
  onUpdateUserIns?:  {
    __typename: "UserIns",
    uname: string,
    ins:  Array< {
      __typename: "Instrument",
      id: string,
      sid?: string | null,
      exchg?: string | null,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      fId: string,
      curr: string,
      type?: AssetType | null,
      subt?: AssetSubType | null,
    } >,
    watch?:  Array< {
      __typename: "InsWatch",
      id: string,
      sid?: string | null,
      hight?: number | null,
      lowt?: number | null,
      type?: AssetType | null,
      subt?: AssetSubType | null,
      itype?: InsType | null,
      curr?: string | null,
    } > | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnDeleteUserInsSubscriptionVariables = {
  owner?: string | null,
};

export type OnDeleteUserInsSubscription = {
  onDeleteUserIns?:  {
    __typename: "UserIns",
    uname: string,
    ins:  Array< {
      __typename: "Instrument",
      id: string,
      sid?: string | null,
      exchg?: string | null,
      qty: number,
      pur?:  Array< {
        __typename: "Purchase",
        amt: number,
        day?: number | null,
        month: number,
        year: number,
        qty: number,
      } > | null,
      fId: string,
      curr: string,
      type?: AssetType | null,
      subt?: AssetSubType | null,
    } >,
    watch?:  Array< {
      __typename: "InsWatch",
      id: string,
      sid?: string | null,
      hight?: number | null,
      lowt?: number | null,
      type?: AssetType | null,
      subt?: AssetSubType | null,
      itype?: InsType | null,
      curr?: string | null,
    } > | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnCreateCoachingReqSubscriptionVariables = {
  owner?: string | null,
};

export type OnCreateCoachingReqSubscription = {
  onCreateCoachingReq?:  {
    __typename: "CoachingReq",
    id: string,
    dur: number,
    text?: string | null,
    page: string,
    type: CoachingType,
    status: CoachingStatus,
    payment: number,
    curr: string,
    paid: boolean,
    pt?: PaymentType | null,
    email?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnUpdateCoachingReqSubscriptionVariables = {
  owner?: string | null,
};

export type OnUpdateCoachingReqSubscription = {
  onUpdateCoachingReq?:  {
    __typename: "CoachingReq",
    id: string,
    dur: number,
    text?: string | null,
    page: string,
    type: CoachingType,
    status: CoachingStatus,
    payment: number,
    curr: string,
    paid: boolean,
    pt?: PaymentType | null,
    email?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnDeleteCoachingReqSubscriptionVariables = {
  owner?: string | null,
};

export type OnDeleteCoachingReqSubscription = {
  onDeleteCoachingReq?:  {
    __typename: "CoachingReq",
    id: string,
    dur: number,
    text?: string | null,
    page: string,
    type: CoachingType,
    status: CoachingStatus,
    payment: number,
    curr: string,
    paid: boolean,
    pt?: PaymentType | null,
    email?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};
