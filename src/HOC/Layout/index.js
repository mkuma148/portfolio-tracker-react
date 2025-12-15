import React from "react";
import { Container } from "react-bootstrap";

export const Layout = ({ children }) => {
    return <Container fluid>{children}</Container>
}