// import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Icons } from "../../Icons";
import SubMenu from "./subMenu";
import { Col, Row } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
// import "./navbar.scss";
// import Buttons from "../../Buttons";
// import { IWantToCombo } from "../../../molecules/IWantToCombo";
// import { MEMBERTYPE } from "../../../constants/constants";
// import { useSelector } from "react-redux";
// import { isHybridMember } from "../../../helpers/helpers";
import kasfolio from "../../../assets/kasfolio_transparent.png";

export function MobileNavigation({ badgeCount, memberTypeObj, logoutUser }) {
    // const { potData } = useSelector((state) => state.totalPotInfo);

    const token = localStorage.getItem("token");

    let profilePic = null;
    let username = null;

    if (token) {
        const decoded = jwtDecode(token);
        profilePic = decoded.picture;
        username = decoded.name;
    }

    const navigate = useNavigate();
    const savingsSubmenu = {
        heading: "Market",
        menu: [
            { menu: "Crypto", link: "/market?tab=crypto" },
            // TODO - Hiding track my value, as its considered as not a day1 requirement
            // { menu: "Performance", link: "/savings?tab=trackMyValue" },
            { menu: "Stocks", link: "/market?tab=stocks" },
        ],
    };

    const manageSubmenu = {
        heading: "Portfolio",
        menu: [
            { menu: "Portfolio", link: "/portfolio" },
            { menu: "Crypto", link: "/portfolio?tab=crypto" },
            { menu: "Stocks", link: "/portfolio?tab=stocks" },
        ],
    };

    const planSubmenu = {
        heading: "Watchlist",
        menu: [
            { menu: "Crypto", link: "/watchlist?tab=crypto" },
            { menu: "Stocks", link: "/watchlist?tab=stocks" },
        ],
    };

    // if (isHybridMember(memberTypeObj?.membershipType)) {
    //     planSubmenu.menu = planSubmenu.menu.filter(
    //         (item) =>
    //             item.menu !== "Retirement explorer" &&
    //             item.menu !== "Plan your future calculator" // eslint-disable-line
    //     );
    // }

    // if (
    //     memberTypeObj?.memberType === MEMBERTYPE.ACTIVE ||
    //     memberTypeObj?.memberType === MEMBERTYPE.ACTIVE_SAVINGS ||
    //     memberTypeObj?.memberType === MEMBERTYPE.DEFERRED ||
    //     memberTypeObj?.memberType === MEMBERTYPE.DEFERRED_SAVINGS
    // ) {
    //     manageSubmenu.menu = manageSubmenu.menu.filter((item) => {
    //         return item.menu !== "Withdrawals";
    //     });
    // }

    // if (memberTypeObj?.memberType === MEMBERTYPE.INACTIVE) {
    //     if (savingsSubmenu.heading.toLocaleLowerCase() === "savings") {
    //         savingsSubmenu.menu = savingsSubmenu.menu.filter((item) => {
    //             return item.menu !== "Summary" && item.menu !== "Performance";
    //         });
    //     }
    // }

    // if (manageSubmenu.heading.toLocaleLowerCase() === "manage") {
    //     manageSubmenu.menu = manageSubmenu.menu.filter((item) => {
    //         return (
    //             item.menu !== "Contributions" &&
    //             item.menu !== "Investments" &&
    //             item.menu !== "Withdrawals"
    //         );
    //     });
    //     if (potData?.data?.drawdownPots?.totalDrawdownValue > 0) {
    //         manageSubmenu.menu.push({ menu: "Withdrawals" });
    //     }
    // }
    // if (planSubmenu.heading.toLowerCase() === "plan") {
    //     planSubmenu.menu = planSubmenu.menu.filter((item) => {
    //         return (
    //             item.menu !== "Target retirement age" &&
    //             item.menu !== "Retirement explorer" &&
    //             item.menu !== "Retirement application" &&
    //             item.menu !== "Leaving TPT"
    //         );
    //     });
    //   }
    // }
    // if (memberTypeObj?.memberType === MEMBERTYPE.PENSIONER_DRAWDOWN) {
    //     planSubmenu.menu = planSubmenu.menu.filter(
    //         (item) => item.menu !== "Target retirement age" // eslint-disable-line
    //     );
    // }

    // if (
    //     memberTypeObj?.memberType === MEMBERTYPE.PENSIONER_DRAWDOWN ||
    //     memberTypeObj?.memberType === MEMBERTYPE.DEPENDENT_PENSIONER_DRAWDOWN
    // ) {
    //     planSubmenu.menu = planSubmenu.menu.filter(
    //         (item) => item.menu !== "Plan your future calculator" // eslint-disable-line
    //     );
    // }
    const accountSubmenu = {
        heading: "Account",
        menu: [
            { menu: "Account details", link: "/account-details" },
            { menu: "Account settings", link: "/account-settings" },
        ],
    };
    const [showSubmenu, setShowSubmenu] = useState({});
    const [expanded, setExpanded] = useState(false);
    const [submenu, setSubmenu] = useState(true);
    const [mainMenu, setMainMenu] = useState(true);

    const closeNavbar = () => {
        setExpanded(false);
    };

    const savingsHandle = (e) => {
        setShowSubmenu(savingsSubmenu);
        setSubmenu(!submenu);
        setMainMenu(false);
        e.stopPropagation();
    };

    const manageHandle = (e) => {
        setShowSubmenu(manageSubmenu);
        setSubmenu(!submenu);
        setMainMenu(false);
        e.stopPropagation();
    };

    const planHandle = (e) => {
        setShowSubmenu(planSubmenu);
        setSubmenu(!submenu);
        setMainMenu(false);
        e.stopPropagation();
    };

    const accountHandle = (e) => {
        setShowSubmenu(accountSubmenu);
        setSubmenu(!submenu);
        setMainMenu(false);
        e.stopPropagation();
    };

    const backButton = (e) => {
        setSubmenu(!submenu);
        setMainMenu(true);
        e.stopPropagation();
    };
    const navigateHome = () => {
        navigate("/");
    };

    return (
        <>
            {
                <Navbar
                    expand={false}
                    expanded={expanded}
                    className="bg-body-tertiary mb-3 d-block d-sm-none fixed-top"
                >
                    <Container fluid>
                        <Navbar.Brand href="" className="tpt-brand">
                            {/* <Icons
                                iconname="logo-white"
                                variant="logo"
                                clickHandler={navigateHome}
                            /> */}
                            <img src={kasfolio} className="logo-pic" alt="profile" onClick={navigateHome} />
                        </Navbar.Brand>

                        <Navbar.Toggle
                            aria-controls={"offcanvasNavbar-expand"}
                            onClick={() => setExpanded(!expanded)}
                        >
                            <Icons
                                iconname="hamburger"
                                variant="icon-sixty-four-px"
                            />
                        </Navbar.Toggle>

                        <Navbar.Offcanvas
                            id={"offcanvasNavbar-expand"}
                            aria-labelledby={"offcanvasNavbarLabel-expand"}
                            placement="end"
                        >
                            {mainMenu ? (
                                <>
                                    <Offcanvas.Header closeButton onClick={closeNavbar}>
                                        <Offcanvas.Title
                                            id={"offcanvasNavbarLabel-expand"}
                                            className="tpt-title"
                                        >
                                            <div>
                                                <Icons
                                                    iconname="logo-white"
                                                    variant="logo"
                                                    clickHandler={navigateHome}
                                                />
                                            </div>
                                        </Offcanvas.Title>
                                    </Offcanvas.Header>

                                    <Offcanvas.Body>
                                        <Nav
                                            activeKey={null}
                                            className="justify-content-end flex-grow-1 pe-3"
                                            onClick={closeNavbar}
                                        >
                                            <Nav.Link as={Link} to="/dashboard" forceRefresh={false}>
                                                <div className="container">
                                                    <div className="menuSpacing">
                                                        <Icons
                                                            iconname="dashboard"
                                                            variant="icon-twenty-four-px"
                                                        />
                                                        <span className="spacing">Dashboard</span>
                                                    </div>
                                                </div>
                                            </Nav.Link>
                                            <Nav.Link onClick={savingsHandle}>
                                                <div className="container">
                                                    <div className="menuSpacing">
                                                        <Icons
                                                            iconname="market"
                                                            variant="icon-twenty-four-px"
                                                        />
                                                        <span className="spacing">Market</span>
                                                    </div>
                                                    <div className="arrow">
                                                        <Icons
                                                            iconname="chevron-right-mobile"
                                                            variant="icon-twenty-four-px"
                                                        />
                                                    </div>
                                                </div>
                                            </Nav.Link>

                                            <Nav.Link onClick={manageHandle}>
                                                <div className="container">
                                                    <div className="menuSpacing">
                                                        <Icons
                                                            iconname="portfolio"
                                                            variant="icon-twenty-four-px"
                                                        />
                                                        <span className="spacing">Portfolio</span>
                                                    </div>
                                                    <div className="arrow">
                                                        <Icons
                                                            iconname="chevron-right-mobile"
                                                            variant="icon-twenty-four-px"
                                                        />
                                                    </div>
                                                </div>
                                            </Nav.Link>

                                            <Nav.Link onClick={planHandle}>
                                                <div className="container">
                                                    <div className="menuSpacing">
                                                        <Icons
                                                            iconname="watchlist"
                                                            variant="icon-twenty-four-px"
                                                        />
                                                        <span className="spacing">Watchlist</span>
                                                    </div>
                                                    <div className="arrow">
                                                        <Icons
                                                            iconname="chevron-right-mobile"
                                                            variant="icon-twenty-four-px"
                                                        />
                                                    </div>
                                                </div>
                                            </Nav.Link>
                                            <Nav.Link as={Link} to="/learn">
                                                <div className="container">
                                                    <div>
                                                        <Icons
                                                            iconname="notifications"
                                                            variant="icon-twenty-four-px"
                                                        />
                                                        <span className="spacing">Notifications</span>
                                                    </div>
                                                </div>
                                            </Nav.Link>

                                            <hr style={{ color: "white", marginLeft: "15px" }} />

                                            <Nav.Link
                                                as={Link}
                                                to="/messages-and-documents?tab=messages"
                                            >
                                                <div className="container">
                                                    <div className="menuSpacing">
                                                        <Icons
                                                            iconname="news"
                                                            variant="icon-twenty-four-px"
                                                            badgeCount={badgeCount}
                                                        />
                                                        <span className="spacing">News</span>
                                                    </div>
                                                </div>
                                            </Nav.Link>
                                            <Nav.Link onClick={accountHandle}>
                                                <div className="container">
                                                    <div className="menuSpacing">
                                                        <Icons
                                                            iconname="account"
                                                            variant="icon-twenty-four-px"
                                                        />
                                                        <span className="spacing">Account</span>
                                                    </div>
                                                    <div className="arrow">
                                                        <Icons
                                                            iconname="chevron-right-mobile"
                                                            variant="icon-twenty-four-px"
                                                        />
                                                    </div>
                                                </div>
                                            </Nav.Link>
                                        </Nav>
                                        <div style={{ paddingTop: "60px", paddingLeft: "10px" }}>
                                            <Container className="d-flex mb-3">
                                                {/* <IWantToCombo
                                                closeNabar={closeNavbar}
                                                memberObj={memberTypeObj}
                                            /> */}
                                            </Container>

                                            <Container className="d-flex justify-content-center mb-4 mobile-profile">
                                                <Row style={{ paddingTop: "20px" }}>
                                                    <Col md={12}>
                                                        <div className="user-actions">

                                                            <div className="profile-wrapper">
                                                                {profilePic ? (
                                                                    <img src={profilePic} className="profile-pic" alt="profile" />
                                                                ) : (
                                                                    <div className="profile-placeholder">
                                                                        {username ? username.charAt(0).toUpperCase() : "U"}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <span className="user-name">{username}</span>

                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row style={{ paddingTop: "20px" }}>
                                                    <Col md={12}>
                                                        <div className="user-actions">
                                                            <div className="user-actions">
                                                                <NavLink
                                                                    onClick={logoutUser}
                                                                    to="/login"
                                                                    className="logout-button"
                                                                >
                                                                    <Icons iconname="logout-round" variant="logo" />
                                                                </NavLink>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Container>
                                        </div>
                                    </Offcanvas.Body>
                                </>
                            ) : (
                                ""
                            )}

                            {submenu ? (
                                ""
                            ) : (
                                <>
                                    <SubMenu
                                        backButton={backButton}
                                        items={showSubmenu}
                                        closeNavbar={closeNavbar}
                                    />
                                </>
                            )}
                        </Navbar.Offcanvas>
                    </Container>
                </Navbar>
            }
        </>
    );

}
