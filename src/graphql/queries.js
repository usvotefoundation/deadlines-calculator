/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getState = /* GraphQL */ `
  query GetState($id: ID!) {
    getState(id: $id) {
      id
      stateName
      registrationDeadlineType
      dateType
      edRelation
      time
      laws
      updater
      updateDate
      updatedLegal
      updatedNotes
      createdAt
      updatedAt
    }
  }
`;
export const listStates = /* GraphQL */ `
  query ListStates(
    $filter: ModelStateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStates(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        stateName
        registrationDeadlineType
        dateType
        edRelation
        time
        laws
        updater
        updateDate
        updatedLegal
        updatedNotes
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
