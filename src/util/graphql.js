import gql from "graphql-tag";

export const FETCH_POSTS_QUERY = gql`
	{
		getPosts {
			id
			body
			createdAt
			username
			tags
			likeCount
			likes {
				username
			}
			commentCount
			comments {
				id
				username
				createdAt
				body
			}
		}
	}
`;

export const FETCH_USERS_QUERY = gql`
	{
		getUsers {
			username
			imageUrl
		}
	}
`;

export const FETCH_SERACH_QUERY = gql`
	query getSearchPosts($content: String!) {
		getSearchPosts(content: $content) {
			id
			body
			createdAt
			username
			imageUrl
			tags
			likeCount
			likes {
				username
			}
			commentCount
			comments {
				id
				username
				createdAt
				body
			}
		}
	}
`;

export const FETCH_USER_POSTS_QUERY = gql`
	query getUserPosts($userName: String!) {
		getUserPosts(userName: $userName) {
			id
			body
			createdAt
			username
			tags
			likeCount
			likes {
				username
			}
			commentCount
			comments {
				id
				username
				createdAt
				body
			}
		}
	}
`;
