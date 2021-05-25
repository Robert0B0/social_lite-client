import React, { useContext } from "react";
import { Card, Icon, Label, Image, Button, Popup } from "semantic-ui-react";
import { Link } from "react-router-dom";
import moment from "moment";

import { AuthContext } from "../context/auth";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";
import MyPopup from "../util/MyPopup";

export default function PostCard({
	post: { body, createdAt, id, username, tags, likeCount, commentCount, likes },
	image,
}) {
	const { user } = useContext(AuthContext);

	return (
		<Card fluid>
			<Card.Content>
				<Image floated="right" size="mini" src={image} />
				<Card.Header>{username}</Card.Header>
				<Card.Meta as={Link} to={`/posts/${id}`}>
					{moment(new Date(createdAt)).fromNow(true)}
				</Card.Meta>
				{tags && (
					<Card.Meta>
						{tags.map((tag, index) => {
							return (
								<h4 style={{ display: "inline-block" }} key={index}>
									{tag},{" "}
								</h4>
							);
						})}
					</Card.Meta>
				)}
				<Card.Description>
					{" "}
					<p style={{ fontSize: "large" }}>{body}</p>{" "}
				</Card.Description>
			</Card.Content>
			<Card.Content extra>
				<LikeButton user={user} post={{ id, likeCount, likes }} />
				<MyPopup content="Comment on Post">
					<Button labelPosition="right" as={Link} to={`/posts/${id}`}>
						<Button color="blue" basic>
							<Icon name="comments" />
						</Button>
						<Label basic color="blue" pointing="left">
							{commentCount}
						</Label>
					</Button>
				</MyPopup>
				{user && user.username === username && <DeleteButton postId={id} />}
			</Card.Content>
		</Card>
	);
}
