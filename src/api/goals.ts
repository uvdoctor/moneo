/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateGoalInput = {
  id?: string | null,
  name: string,
  targets: Array< TargetInput >,
  milestones?: Array< MilestoneInput | null > | null,
  imp: LMH,
  prob?: LMH | null,
};

export type TargetInput = {
  year: number,
  val: number,
};

export type MilestoneInput = {
  month: number,
  year: number,
  val: number,
  prob?: LMH | null,
};

export enum LMH {
  L = "L",
  M = "M",
  H = "H",
}


export type ModelGoalConditionInput = {
  name?: ModelStringInput | null,
  imp?: ModelLMHInput | null,
  prob?: ModelLMHInput | null,
  and?: Array< ModelGoalConditionInput | null > | null,
  or?: Array< ModelGoalConditionInput | null > | null,
  not?: ModelGoalConditionInput | null,
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

export type ModelLMHInput = {
  eq?: LMH | null,
  ne?: LMH | null,
};

export type UpdateGoalInput = {
  id: string,
  name?: string | null,
  targets?: Array< TargetInput > | null,
  milestones?: Array< MilestoneInput | null > | null,
  imp?: LMH | null,
  prob?: LMH | null,
};

export type DeleteGoalInput = {
  id?: string | null,
};

export type ModelGoalFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  imp?: ModelLMHInput | null,
  prob?: ModelLMHInput | null,
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

export type CreateGoalMutationVariables = {
  input: CreateGoalInput,
  condition?: ModelGoalConditionInput | null,
};

export type CreateGoalMutation = {
  createGoal:  {
    __typename: "Goal",
    id: string,
    name: string,
    targets:  Array< {
      __typename: "Target",
      year: number,
      val: number,
    } >,
    milestones:  Array< {
      __typename: "Milestone",
      month: number,
      year: number,
      val: number,
      prob: LMH | null,
    } | null > | null,
    imp: LMH,
    prob: LMH | null,
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
    name: string,
    targets:  Array< {
      __typename: "Target",
      year: number,
      val: number,
    } >,
    milestones:  Array< {
      __typename: "Milestone",
      month: number,
      year: number,
      val: number,
      prob: LMH | null,
    } | null > | null,
    imp: LMH,
    prob: LMH | null,
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
    name: string,
    targets:  Array< {
      __typename: "Target",
      year: number,
      val: number,
    } >,
    milestones:  Array< {
      __typename: "Milestone",
      month: number,
      year: number,
      val: number,
      prob: LMH | null,
    } | null > | null,
    imp: LMH,
    prob: LMH | null,
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
    name: string,
    targets:  Array< {
      __typename: "Target",
      year: number,
      val: number,
    } >,
    milestones:  Array< {
      __typename: "Milestone",
      month: number,
      year: number,
      val: number,
      prob: LMH | null,
    } | null > | null,
    imp: LMH,
    prob: LMH | null,
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
      name: string,
      targets:  Array< {
        __typename: "Target",
        year: number,
        val: number,
      } >,
      milestones:  Array< {
        __typename: "Milestone",
        month: number,
        year: number,
        val: number,
        prob: LMH | null,
      } | null > | null,
      imp: LMH,
      prob: LMH | null,
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
    name: string,
    targets:  Array< {
      __typename: "Target",
      year: number,
      val: number,
    } >,
    milestones:  Array< {
      __typename: "Milestone",
      month: number,
      year: number,
      val: number,
      prob: LMH | null,
    } | null > | null,
    imp: LMH,
    prob: LMH | null,
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
    name: string,
    targets:  Array< {
      __typename: "Target",
      year: number,
      val: number,
    } >,
    milestones:  Array< {
      __typename: "Milestone",
      month: number,
      year: number,
      val: number,
      prob: LMH | null,
    } | null > | null,
    imp: LMH,
    prob: LMH | null,
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
    name: string,
    targets:  Array< {
      __typename: "Target",
      year: number,
      val: number,
    } >,
    milestones:  Array< {
      __typename: "Milestone",
      month: number,
      year: number,
      val: number,
      prob: LMH | null,
    } | null > | null,
    imp: LMH,
    prob: LMH | null,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};
