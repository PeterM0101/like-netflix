import {MagicUserMetadata} from "magic-sdk";

export interface HasuraMetadata {
    userId: string,
    videoId: string,
    watched?: boolean,
    favourited?: null | number
}

export const isNewUserQuery = async (token: string, issuer: string) => {
    const operationsDoc = `
      query isNewUserQuery($issuer: String!) {
        users(where: {issuer: {_eq: $issuer}}) {
          id
          issuer
          email
          publicAddress
        }
      }
    `;
    const response = await queryHasuraGraphQL(
        operationsDoc,
        "isNewUserQuery",
        {issuer},
        token
    );
    return !response?.data?.users?.length
}

export const createNewUser = async (token: string, metadata: MagicUserMetadata) => {
    const operationsDoc = `
      mutation createNewUserMutation($email: String!, $issuer: String!, $publicAddress: String!) {
        insert_users(objects: {email: $email, issuer: $issuer, publicAddress: $publicAddress}) {
          affected_rows
        }
      }
    `;
    const {issuer, publicAddress, email} = metadata;
    const response = await queryHasuraGraphQL(
        operationsDoc,
        "createNewUserMutation",
        {email, issuer, publicAddress},
        token
    );
    return response
}

async function queryHasuraGraphQL(operationsDoc: string, operationName: string, variables: object, token: string) {
    const result = await fetch(
        process.env.NEXT_PUBLIC_HASURA_ADMIN_URL!,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: operationsDoc,
                variables: variables,
                operationName: operationName
            })
        }
    );

    return await result.json();
}

export const findVideoIdByUserId = async (userId: string, videoId: string, token: string) => {
    const operationsDoc = `
      query findVideoIdByUserIdQuery($userId: String!, $videoId: String!) {
        stats(where: {userId: {_eq: $userId}, videoId: {_eq: $videoId}}) {
          id
          userId
          videoId
          watched
          favourited
        }
      }`;
    const response = await queryHasuraGraphQL(
        operationsDoc,
        "findVideoIdByUserIdQuery",
        {userId, videoId},
        token
    );

    return response?.data?.stats
}

export const insertNewStat = async (metadata: HasuraMetadata, token: string) => {
    const {userId, videoId, watched, favourited} = metadata;

    const operationsDoc = ` 
      mutation insertNewStatMutation($userId: String!, $videoId: String!, $watched: Boolean!, $favourited: Int!) {
        insert_stats_one(object: {favourited: $favourited, userId: $userId, videoId: $videoId, watched: $watched}) {
              favourited
              id
              userId
              videoId
              watched
        }
      }
    `;

    const response = await queryHasuraGraphQL(
        operationsDoc,
        "insertNewStatMutation",
        {userId, videoId, watched, favourited},
        token
    );

    return response
}


export const updateStatWatched = async (metadata: HasuraMetadata, token: string) => {
    const {userId, videoId, watched, favourited} = metadata;
    const operationsDoc = `
      mutation updateStatWatchedMutation($userId: String!, $videoId: String!, $watched: Boolean!, $favourited: Int!) {
        update_stats(where: {userId: {_eq: $userId}, videoId: {_eq: $videoId}}, _set: {watched: $watched, favourited: $favourited}) {
            returning {
              id
              userId
              videoId
              watched
              favourited
            }
        }
      }
    `;

    const response = await queryHasuraGraphQL(
        operationsDoc,
        "updateStatWatchedMutation",
        {userId, videoId, watched, favourited},
        token
    );

    return response
}

export const getWatchedVideosQuery = async (token: string, userId: string) => {

    const operationsDoc = `
      query getWatchedVideosQuery($userId: String!) {
        stats(where: {watched: {_eq: true}, userId: {_eq: $userId}}) {
          favourited
          id
          userId
          videoId
          watched
        }
      }
    `;

    const response = await queryHasuraGraphQL(
        operationsDoc,
        "getWatchedVideosQuery",
        {userId},
        token
    );

    return  response?.data?.stats;
}

export const getMyListVideosQuery = async (token: string, userId: string) => {

    const operationsDoc = `
      query getMyListVideosQuery($userId: String!) {
        stats(where: {favourited: {_eq: 1}, userId: {_eq: $userId}}) {
          videoId
        }
      }
    `;

    const response = await queryHasuraGraphQL(
        operationsDoc,
        "getMyListVideosQuery",
        {userId},
        token
    );

    return  response?.data?.stats;
}

