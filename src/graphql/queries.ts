/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getGoal = /* GraphQL */ `
  query GetGoal($id: ID!) {
    getGoal(id: $id) {
      id
      name
      targets {
        year
        val
      }
      milestones {
        month
        year
        val
        prob
      }
      imp
      prob
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listGoals = /* GraphQL */ `
  query ListGoals(
    $filter: ModelGoalFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGoals(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        targets {
          year
          val
        }
        milestones {
          month
          year
          val
          prob
        }
        imp
        prob
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
