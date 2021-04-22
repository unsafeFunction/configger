export const getSelectedCode = (state) =>
  state.scanSessions?.singleSession.selectedCode;

export const getEmptyPositions = (state) =>
  state.scanSessions.scan.empty_positions;

export const getIncorrectPositions = (state) =>
  state.scanSessions.scan.incorrect_positions;
