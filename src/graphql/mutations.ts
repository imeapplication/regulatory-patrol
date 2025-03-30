
import { gql } from '@apollo/client';

export const CREATE_TASK = gql`
  mutation CreateTask(
    $title: String!,
    $ownerId: ID!,
    $startDate: Date!,
    $endDate: Date!,
    $domainId: ID,
    $parentTaskId: ID,
    $description: String,
    $documentLink: String,
    $mandays: Float!
  ) {
    createTask(
      title: $title,
      ownerId: $ownerId,
      startDate: $startDate,
      endDate: $endDate,
      domainId: $domainId,
      parentTaskId: $parentTaskId,
      description: $description,
      documentLink: $documentLink,
      mandays: $mandays
    ) {
      id
      title
      description
    }
  }
`;

export const UPDATE_TASK_STATUS = gql`
  mutation UpdateTaskStatus($taskId: ID!, $status: Int!) {
    updateTaskStatus(taskId: $taskId, status: $status) {
      id
      title
      status
    }
  }
`;

export const CREATE_DOMAIN = gql`
  mutation CreateDomain(
    $companyId: ID!,
    $title: String!,
    $responsibleId: ID!,
    $startDate: Date!,
    $endDate: Date!,
    $description: String,
    $documentLink: String
  ) {
    createDomain(
      companyId: $companyId,
      title: $title,
      responsibleId: $responsibleId,
      startDate: $startDate,
      endDate: $endDate,
      description: $description,
      documentLink: $documentLink
    ) {
      id
      title
    }
  }
`;
