import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const PrivateRoute = ({ 
  children, 
  isAuthenticated, 
  isAuthorized, 
  unauthorizedRedirectTo 
}) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAuthorized) {
    return <Navigate to={unauthorizedRedirectTo} replace />;
  }
  
  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  unauthorizedRedirectTo: PropTypes.string
};

PrivateRoute.defaultProps = {
  unauthorizedRedirectTo: '/unauthorized'
};

export default PrivateRoute;