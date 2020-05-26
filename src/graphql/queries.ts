/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getGoal = /* GraphQL */ `
  query GetGoal($id: ID!) {
    getGoal(id: $id) {
      id
      name
      targets {
        month
        year
        val
        curr
        met
        prob
      }
      milestones {
        month
        year
        val
        curr
        met
        prob
      }
      imp
      ra
      met
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
          month
          year
          val
          curr
          met
          prob
        }
        milestones {
          month
          year
          val
          curr
          met
          prob
        }
        imp
        ra
        met
        prob
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
