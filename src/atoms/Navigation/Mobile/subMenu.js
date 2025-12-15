import Nav from "react-bootstrap/Nav";
import Offcanvas from "react-bootstrap/Offcanvas";
import "./navbar.scss";
// import tptlogo from "../assets/tpt-logo.png";
import { Icons } from "../../Icons";
import { Link } from "react-router-dom";
// import{ Button } from "react-bootstrap";

function SubMenu(props) {
    const { items } = props;

    return (
        <div>
            <Offcanvas.Header
                closeButton
                onClick={props.closeNavbar}
                className="back-button"
            >
                <Offcanvas.Title
                    id={"offcanvasNavbarLabel-expand"}
                    onClick={props.backButton}
                >
                    <div to="" className="back-button-anchor">
                        <Icons
                            iconname="chevron-left"
                            variant="icon-twenty-four-px"
                        />
                        {" "}
                        Back
                    </div>
                </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <div className="submenu-container">
                    <div style={{ marginLeft: "30px" }}>
                        <Icons
                            iconname={items.heading?.toLowerCase()}
                            variant="icon-twenty-four-px"
                        />
                    </div>
                    <div className="submenu-heading">{items.heading}</div>
                </div>
                <hr className="line"></hr>
                <Nav
                    className="justify-content-end flex-grow-1 pe-3"
                    onClick={props.closeNavbar}
                    style={{ marginTop: "30px" }}
                >
                    {items.menu?.map((item, index) => (
                        <Nav.Link key={index} as={Link} to={item.link}>
                            <div className="submenu-container">
                                <div className="menuSpacing">
                                    <Icons
                                        iconname="arrow-right-white"
                                        variant="icon-sixteen-px"
                                    />
                                </div>
                                <div className="submenu-text-margin">{item.menu}</div>
                            </div>
                        </Nav.Link>
                    ))}
                </Nav>
            </Offcanvas.Body>
        </div>
    );
}

export default SubMenu;