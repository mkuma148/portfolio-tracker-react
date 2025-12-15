import { AnimatePresence, motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import "./sidebar.scss";
import { Icons } from "../../Icons";

const SidebarMenu = ({
    route,
    isOpen,
    setIsOpen,
    labelDisable,
    toggle,
    index,
    handleDropdown,
    activeMainMenuItem,
    onSubmenuClick,
    activeSubmenu,
    setActiveSubmenu,
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeState, setActiveState] = useState(false);
    const [textBold, setTextBold] = useState(false);
    const [textColor, setTextColor] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        setIsOpen(true);
        setActiveState(!activeState);
        setTextBold(!textBold);
        setTextColor(!textColor);
    };

    useEffect(() => {
        if (!isOpen) {
            setIsMenuOpen(false);
            setActiveState(false);
        }
    }, [isOpen]);

    const handleSubmenuClick = (submenu) => {
        setActiveSubmenu(submenu);
    };

    const getMarginLeft = (nameLength) => {
        if (nameLength === 9) return "-10px";
        if (nameLength === 7) return "-9px";
        if (nameLength === 6) return "-10px";
        if (nameLength === 4) return "0px";
        return "0px";
    };

    return (
        <>
            <NavLink
                className={
                    activeMainMenuItem === route.name
                        ? "sidebar-container active"
                        : "sidebar-container"
                }
                to={route.path}
                style={{ textDecoration: "none" }}
            >
                <div onClick={() => handleDropdown(index)}>
                    <div
                        style={{
                            backgroundColor: route.visible ? "rgba(255,255,255,0.6)" : "",
                            fontWeight: isOpen ? (route.visible ? "bold" : "") : "",
                            color: route.visible ? "black" : "black",
                        }}
                        className={
                            labelDisable
                                ? isOpen
                                    ? "menu-sidebar "
                                    : "menu-sidebar label-align "
                                : "menu-sidebar"
                        }
                        onClick={toggleMenu}
                    >
                        <div key={index} className="menu-item">
                            <div className="icon">
                                {route.visible ? (
                                    <Icons clickHandler={toggle} iconname={route.iconBlue} variant="icon-twenty-four-px" />
                                ) : (
                                    <Icons clickHandler={toggle} iconname={route.icon} variant="icon-twenty-four-px" />
                                )}

                                {labelDisable && !isOpen ? (
                                    <div
                                        onClick={toggle}
                                        style={{
                                            fontSize: "12px",
                                        }}
                                    >
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
                                    <motion.div className="link-text">{route.name}</motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        {isOpen && (
                            <div>
                                {route.visible ? (
                                    <Icons iconname="chevron-up" variant="icon-twenty-four-px" />
                                ) : (
                                    <Icons iconname="chevron-down" variant="icon-twenty-four-px" />
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    {route.visible && (
                        <div className="menu-container ">
                            {route.subRoutes.map((subRoute, i) => (
                                <motion.div key={i} custom={i}>
                                    <Link
                                        onClick={() => {
                                            handleSubmenuClick(subRoute.name);
                                            onSubmenuClick(route.name);
                                        }}
                                        style={{
                                            fontWeight:
                                                activeSubmenu === subRoute.name ? "bold" : "",
                                        }}
                                        to={subRoute.path}
                                        className="link-subRoute"
                                    >
                                        <span className="icon">{subRoute.icon}</span>
                                        <motion.span className="link-text">
                                            {subRoute.name}
                                        </motion.span>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </NavLink>
        </>
    );
};

export default SidebarMenu;