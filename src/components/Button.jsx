import React from "react";
import styled from "styled-components";
import { variant } from "styled-system";

import { Spinner } from "./Spinner";

const variants = {
  primary: {
    backgroundColor: "#00e8af",
  },
  secondary: {
    border: "solid 2px",
    borderColor: "primary",
    color: "primary",
  },
  warning: {
    backgroundColor: "secondary",
  },
  disabled: {
    backgroundColor: "grey50",
    color: "grey200",
    border: "1px solid",
    borderColor: "grey100",
    fontWeight: "regular",
    cursor: "not-allowed",
  },
  unstyled: {
    color: "grey800",
    padding: 0,
    minWidth: 0,
  },
};

const StyledButton = styled.button`
  padding: 8px;
  padding-left: 24px;
  padding-right: 24px;
  min-width: 160px;
  border-radius: 6px;
  height: 40px;
  color: white;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  border: 0px;
  ${variant({ variants })}
`;

export const Button = ({ children, variant = "primary", ...props }) => {
  const spinnerColor = variant === "secondary" ? "#00e8af" : "currentColor";
  const Icon = props.icon;
  return (
    <StyledButton variant={variant} {...props}>
      {props.loading ? (
        <>
          <span style={{ marginRight: 20 }}>Mining {"  "}</span>
          <Spinner color={spinnerColor} size={16} style={{ marginBottom: 3 }} />
        </>
      ) : (
        <>
          {children}
          {Icon && (
            <Icon
              style={{
                marginLeft: children && 8,
                height: children ? 20 : 24,
                width: children ? 20 : 24,
                color: spinnerColor,
              }}
            />
          )}
        </>
      )}
    </StyledButton>
  );
};
