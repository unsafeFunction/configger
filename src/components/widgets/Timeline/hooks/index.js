const useTimelineStatus = (timelineItem) => {
  switch (timelineItem.action) {
    case 'RUN_UPLOAD_RAW_FILE': {
      return `Upload raw file by ${timelineItem.email}`;
    }
    case 'RUN_CREATE': {
      return `Run created by ${timelineItem.email}`;
    }
    case 'RUN_PUBLISH': {
      return `Run published by ${timelineItem.email}`;
    }
    case 'RUN_UPDATE_ACTIVE_PHASE': {
      return `Run updated by ${timelineItem.email}`;
    }
    case 'RUN_ANALYSIS_CONFIRM': {
      return `Analysis confirmed published by ${timelineItem.email}`;
    }
    default:
      return null;
  }
};

export default useTimelineStatus;
