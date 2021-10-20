import moment from 'moment';

const useTimelineStatus = (timelineItem) => {
  const time = moment(timelineItem.created).format('YYYY-MM-DD hh:mm');

  switch (timelineItem.action) {
    case 'RUN_UPLOAD_RAW_FILE': {
      return `Upload raw file by ${timelineItem.email} (at ${time})`;
    }
    case 'RUN_CREATE': {
      return `Run created by ${timelineItem.email} (at ${time})`;
    }
    case 'RUN_PUBLISH': {
      return `Run published by ${timelineItem.email} at ${time}}`;
    }
    case 'RUN_UPDATE_ACTIVE_PHASE': {
      return `Run updated by ${timelineItem.email}  at ${time}`;
    }
    case 'RUN_ANALYSIS_CONFIRM': {
      return `Analysis confirmed published by ${timelineItem.email} at ${time}`;
    }
    default:
      return null;
  }
};

export default useTimelineStatus;
