import React, { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// Make "data" available on our any child component
// eslint-disable-next-line arrow-body-style
const renderChildren = (children, data) => {
  return Children.map(children, child => cloneElement(child, { data }));
};

const ExpanderRowStyle = styled.div`
  width: 100%;
  box-sizing: border-box;
  ${props => props.theme.expanderRow.style};
`;

const ExpanderRow = ({
  data,
  children,
}) => (
  <ExpanderRowStyle className="rdt_ExpanderRow">
    {renderChildren(children, data)}
  </ExpanderRowStyle>
);

ExpanderRow.propTypes = {
  data: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

ExpanderRow.defaultProps = {
  data: {},
  children: null,
};

export default ExpanderRow;
