import React from "react";
import IconStyles from "./index.scss";
import { Badge } from "react-bootstrap";

export const Icons = ({
  clickHandler,
  iconname,
  variant,
  badgeCount,
  getUpdatedAge,
  testId,
}) => {
  return (
    <>
      <IconStyles
        onClick={clickHandler}
        className={variant}
        getUpdatedAge={getUpdatedAge}
        xmlnsXlink="http://www.w3.org/1999/xlink"
        role="img"
        aria-label={iconname}
        data-testid={testId}
      >
        <use
          xlinkHref={`svg-sprite.svg#${iconname}`}
          data-testid={`${testId}-use`}
        ></use>
      </IconStyles>
    </>
  );
};
