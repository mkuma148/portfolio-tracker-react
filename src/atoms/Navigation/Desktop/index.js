import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SidebarMenu from "./SidebarMenu";
import "./sidebar.scss";
import { Icons } from "../../Icons";
// import { MEMBERTYPE } from "../../../constants/constants";
// import { useSelector } from "react-redux";
// import { isHybridMember } from "../../../helpers/helpers";
import kasfolio from "../../../assets/kasfolio_transparent.png";
const routes = [
    {
        path: "/dashboard",
        name: "Dashboard",
        icon: "dashboard-solid",
        visible: false,
    },
    {
        path: "/market",
        name: "Market",
        icon: "market",
        iconBlue: "market",
        visible: false,
        subRoutes: [
            {
                path: "/market?tab=crypto",
                name: "Crypto",
            },
            // TODO - Hiding track my value, as its considered as not a day1 requirement
            // {
            //   path: "/savings?tab=trackMyValue",
            //   name: "Performance",
            // },
            {
                path: "/market?tab=stocks",
                name: "Stocks",
            },
        ],
    },
    {
        path: "/portfolio",
        name: "Portfolio",
        icon: "portfolio",
        iconBlue: "portfolio",
        visible: false,
        subRoutes: [
            {
                path: "/portfolio?tab=crypto",
                name: "Crypto",
            },
            {
                path: "/portfolio?tab=stocks",
                name: "Stocks",
            },
        ],
    },
    {
        path: "/watchlist",
        name: "Watchlist",
        icon: "watchlist",
        iconBlue: "watchlist",
        visible: false,
        subRoutes: [
            {
                path: "/watchlist?tab=crypto",
                name: "Crypto",
            },
            {
                path: "/watchlist?tab=stocks",
                name: "Stocks",
            },
        ],
    },
    {
        path: "/notifications",
        name: "Notifications",
        icon: "notifications",
        iconBlue: "notifications",
        visible: false,
    },
    {
        path: "/news",
        name: "News",
        icon: "news",
        visible: false,
    },
    {
        path: "/account-details",
        name: "Account",
        icon: "account",
        iconBlue: "account",
        visible: false,
        subRoutes: [
            {
                path: "/account-details",
                name: "Account details",
            },
            {
                path: "/account-settings",
                name: "Account settings",
            },
        ],
    },
];

const SideBar = ({ children, badgeCount, memberTypeObj }) => {

    const [labelDisable, setLabelDisable] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [subMenuIsOpen, setSubMenuIsOpen] = useState(false);
    const navbarRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const [activeMainMenuItem, setActiveMainMenuItem] = useState(null);
    const [activeSubmenu, setActiveSubmenu] = useState(null);

    const handleSubmenuClick = (mainMenuName) => {
        setActiveMainMenuItem(
            (prevActive) => (prevActive === mainMenuName ? null : mainMenuName) // eslint-disable-line
        );
    };

    // if (isHybridMember(memberTypeObj?.membershipType)) {
    //     routes.map((item) => {
    //         if (item.name.toLocaleLowerCase() === "plan") {
    //             item.subRoutes = item.subRoutes.filter((path) => {
    //                 return (
    //                     path.name !== "Retirement explorer" &&
    //                     path.name !== "Plan your future calculator"
    //                 );
    //             });
    //         }
    //     });
    // }

    // if (memberTypeObj?.memberType === MEMBERTYPE.PENSIONER_DRAWDOWN) {
    //     routes.map((item) => {
    //         if (item.name.toLocaleLowerCase() === "plan") {
    //             item.subRoutes = item.subRoutes.filter((path) => {
    //                 return path.name !== "Target retirement age";
    //             });
    //         }
    //     });
    // }

    // if (
    //     memberTypeObj?.memberType === MEMBERTYPE.ACTIVE ||
    //     memberTypeObj?.memberType === MEMBERTYPE.ACTIVE_SAVINGS ||
    //     memberTypeObj?.memberType === MEMBERTYPE.DEFERRED ||
    //     memberTypeObj?.memberType === MEMBERTYPE.DEFERRED_SAVINGS
    // ) {
    //     routes.map((item) => {
    //         if (item.name.toLocaleLowerCase() === "manage") {
    //             item.subRoutes = item.subRoutes.filter((path) => {
    //                 return path.name !== "Withdrawals";
    //             });
    //         }
    //     });
    // }

    // if (memberTypeObj?.memberType === MEMBERTYPE.INACTIVE) {
    //     routes.map((item) => {
    //         if (item.name.toLocaleLowerCase() === "savings") {
    //             item.subRoutes = item.subRoutes.filter((path) => {
    //                 return path.name !== "Summary" && path.name !== "Performance";
    //             });
    //         }
    //     });
    // }

    // if (
    //     memberTypeObj?.memberType === MEMBERTYPE.PENSIONER_DRAWDOWN ||
    //     memberTypeObj?.memberType === MEMBERTYPE.DEPENDENT_PENSIONER_DRAWDOWN
    // ) {
    //     routes.map((item) => {
    //         if (item.name.toLocaleLowerCase() === "plan") {
    //             item.subRoutes = item.subRoutes.filter((path) => {
    //                 return path.name !== "Plan your future calculator";
    //             });
    //         }
    //     });
    // }

    // if (memberTypeObj?.memberType === MEMBERTYPE.ACTIVE_SAVINGS) {
    //     routes.map((item) => {
    //         if (item.name.toLocaleLowerCase() === "savings") {
    //             item.subRoutes = item.subRoutes.filter((path) => {
    //                 return path.name === "Summary" || path.name === "Transactions";
    //             });
    //         }
    //     });
    // }

    // if (memberTypeObj?.memberType === MEMBERTYPE.PENSIONER_DRAWDOWN) {
    //     routes.map((item) => {
    //         if (item.name.toLocaleLowerCase() === "manage") {
    //             item.subRoutes = item.subRoutes.filter((path) => {
    //                 return (
    //                     path.name !== "Contributions" &&
    //                     path.name !== "Investments" &&
    //                     path.name !== "Withdrawals"
    //                 );
    //             });
    //         }
    //     });
    //     if (potData?.data?.drawdownPots?.totalDrawdownValue > 0) {
    //         routes
    //             .find((item) => item.name.toLocaleLowerCase() === "manage")
    //             ?.subRoutes.push({ name: "Withdrawals" });
    //     }
    // }

    const toggle = () => {
        setIsOpen(!isOpen);
        setLabelDisable(!labelDisable);
        document.body.classList.toggle("sidebar-expanded", !isOpen);
        document.body.classList.toggle("sidebar-collapsed", isOpen);
        for (let i = 0; i < routes.length; i++) {
            routes[i].visible = false;
        }
        setSubMenuIsOpen(false);
    };

    useEffect(() => {
        if (isOpen) {
            if (window.innerWidth >= 1440) {
                document.body.style.overflowY = "scroll";
            } else {
                document.body.style.overflowY = "hidden";
            }
        } else {
            document.body.style.overflowY = "scroll";
        }
    }, [isOpen]);

    const navigateHome = () => {
        navigate("/dashboard");
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (navbarRef.current && !navbarRef.current.contains(event.target)) {
                setIsOpen(false);
                setLabelDisable(true);
                for (let i = 0; i < routes.length; i++) {
                    routes[i].visible = false;
                }
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [navbarRef]);

    const handleDropdown = (index) => {
        setActiveMainMenuItem(null);
        setActiveSubmenu(null);
        for (let i = 0; i < routes.length; i++) {
            if (index === i) {
                routes[index].visible = !routes[index].visible;
                setSubMenuIsOpen(routes[index].visible);
            } else {
                routes[i].visible = false;
            }
        }
        if (index === 0 || index === 5) {
            setSubMenuIsOpen(false);
        }
    };

    const handleScroll = () => {
        setIsScrolled(isOpen ? true : false);
    };

    const getMarginLeft = (nameLength) => {
        if (nameLength === 13) return "-24px";
        if (nameLength === 9) return "-18px";
        if (nameLength === 8) return "-16px";
        if (nameLength === 5) return "-3px";
        if (nameLength === 4) return "-5px";
        return "0px";
    };

    useEffect(() => {
        routes.forEach((route) => {
            if (location.pathname.startsWith(route.path)) {
                setActiveMainMenuItem(route.name);
            }
        });
    }, [location.pathname]);

    return (
        <div ref={navbarRef}>
            <div className="sidebar-container d-none d-xl-block d-lg-block d-md-block d-sm-block">
                <motion.div
                    animate={{ width: isOpen ? "318px" : "80px" }}
                    className="sidebar"
                    onScroll={handleScroll}
                >
                    <motion.div
                        className={
                            isScrolled && isOpen && subMenuIsOpen
                                ? "top-section item-scrolled"
                                : "top-section"
                        }
                        animate={{ width: isOpen ? "304px" : "80px" }}
                    >
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div style={{marginLeft: "-40px"}}>
                                    <img src={kasfolio} className="logo-pic" alt="profile" onClick={navigateHome}/>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <div>
                            {isOpen ? (
                                <Icons
                                    clickHandler={toggle}
                                    iconname="cross"
                                    variant="icon-twenty-four-px"
                                />
                            ) : (
                                <Icons
                                    clickHandler={toggle}
                                    iconname="chevron-right"
                                    variant="icon-twenty-four-px"
                                />
                            )}
                        </div>
                    </motion.div>

                    <section className="routes-sidebar">
                        {routes.map((route, index) => {
                            if (route.subRoutes) {
                                return (
                                    <div key={index}>
                                        <SidebarMenu
                                            index={index}
                                            toggle={toggle}
                                            labelDisable={labelDisable}
                                            setIsOpen={setIsOpen}
                                            route={route}
                                            isOpen={isOpen}
                                            handleDropdown={handleDropdown}
                                            activeMainMenuItem={activeMainMenuItem}
                                            onSubmenuClick={handleSubmenuClick}
                                            activeSubmenu={activeSubmenu}
                                            setActiveSubmenu={setActiveSubmenu}
                                        />
                                        {route.name === "Learn" ? (
                                            <hr className="horizontal-Line" />
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                );
                            }

                            return (
                                <div key={index}>
                                    <NavLink
                                        onClick={() => handleDropdown(index)}
                                        to={route.path}
                                        className={
                                            labelDisable
                                                ? isOpen
                                                    ? "link-subRoute"
                                                    : "link-subRoute label-align"
                                                : "link-subRoute"
                                        }
                                    >
                                        <div>
                                            <Icons
                                                iconname={route.icon}
                                                variant="icon-twenty-four-px"
                                                badgeCount={
                                                    route.icon === "navigation-messages"
                                                        ? badgeCount
                                                        : ""
                                                }
                                            />


                                            {labelDisable && !isOpen ? (
                                                <div style={{ fontSize: "12px" }}>
                                                    <span
                                                        style={{
                                                            marginLeft: getMarginLeft(route.name.length),
                                                        }}
                                                    >
                                                        {route.name}
                                                    </span>
                                                </div>
                                            ) : (
                                                ""
                                            )}
                                        </div>
                                        <AnimatePresence>
                                            {isOpen && (
                                                <motion.div className="link-text">
                                                    {route.name}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </NavLink>
                                </div>
                            );
                        })}
                    </section>
                </motion.div>

                <main
                    className="main-child"
                    style={{
                        marginLeft: isOpen ? "287px" : "63px",
                        transition: "margin-left 0.6s ease",
                        ...(window.innerWidth <= 1440 && isOpen
                            ? { marginLeft: "1" }
                            : {}),
                    }}
                >
                    {children}
                </main>
            </div>
        </div>
    );
}

export default SideBar;