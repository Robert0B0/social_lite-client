import React, { useState, useEffect } from "react";
import { Button, Label, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import MyPopup from "../util/MyPopup";
import gql from "graphql-tag";

export default function EditButton() {
	return (
		<MyPopup content="Edit Comment">
			<Button color="orange" floated="right" basic>
				<Icon name="pencil" style={{ margin: 0 }} />
			</Button>
		</MyPopup>
	);
}
