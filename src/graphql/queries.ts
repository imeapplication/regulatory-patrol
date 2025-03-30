
import { gql } from '@apollo/client';

export const GET_COMPANIES = gql`
  query GetCompanies {
    companies {
      id
      name
      logo
    }
  }
`;

export const GET_DOMAINS = gql`
  query GetDomains {
    domains {
      id
      title
      description
      documentLink
      startDate
      endDate
      mandays
      responsible {
        id
        firstName
        lastName
        role
      }
    }
  }
`;

export const GET_DOMAIN = gql`
  query GetDomain($id: ID!) {
    domain(id: $id) {
      id
      title
      description
      documentLink
      startDate
      endDate
      mandays
      responsible {
        id
        firstName
        lastName
        role
      }
      tasks {
        id
        title
        description
        documentLink
        startDate
        endDate
        mandays
        status
        owner {
          id
          firstName
          lastName
          role
        }
      }
    }
  }
`;

export const GET_TASKS = gql`
  query GetTasks {
    tasks {
      id
      title
      description
      documentLink
      startDate
      endDate
      mandays
      status
      owner {
        id
        firstName
        lastName
        role
      }
    }
  }
`;

export const GET_TASK = gql`
  query GetTask($id: ID!) {
    task(id: $id) {
      id
      title
      description
      documentLink
      startDate
      endDate
      mandays
      status
      owner {
        id
        firstName
        lastName
        role
      }
      subtasks {
        id
        title
        description
        documentLink
        startDate
        endDate
        mandays
        status
        owner {
          id
          firstName
          lastName
          role
        }
      }
      actions {
        id
        title
        description
        status
        startDate
        endDate
      }
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      firstName
      lastName
      role
    }
  }
`;
