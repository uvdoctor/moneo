/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateGoal = /* GraphQL */ `
  subscription OnCreateGoal($owner: String!) {
    onCreateGoal(owner: $owner) {
      id
      name
      targets {
        month
        year
        val
        met
        prob
      }
      milestones {
        month
        year
        val
        met
        prob
      }
      imp
      met
      prob
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
      name
      targets {
        month
        year
        val
        met
        prob
      }
      milestones {
        month
        year
        val
        met
        prob
      }
      imp
      met
      prob
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
      name
      targets {
        month
        year
        val
        met
        prob
      }
      milestones {
        month
        year
        val
        met
        prob
      }
      imp
      met
      prob
      createdAt
      updatedAt
      owner
    }
  }
`;
