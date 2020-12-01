import { createSelector } from 'reselect';

const userRole = state => {
  return state.user.profile;
};

const getRole = createSelector(userRole, role => {
  return role;
});

export default getRole;
