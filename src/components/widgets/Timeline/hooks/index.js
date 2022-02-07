import moment from 'moment';
import { constants } from 'utils/constants';

const useTimelineStatus = (timelineItem) => {
  const time = moment(timelineItem.created).format(constants.dateTimeFormat);

  switch (timelineItem.action) {
    case 'RUN_UPLOAD_RAW_FILE': {
      return `Upload raw file by ${timelineItem.email} (at ${time})`;
    }
    case 'RUN_CREATE': {
      return `Run created by ${timelineItem.email} (at ${time})`;
    }
    case 'RUN_PUBLISH': {
      return `Run finalized by ${timelineItem.email} at ${time}}`;
    }
    case 'RUN_UPDATE_ACTIVE_PHASE': {
      return `Run updated by ${timelineItem.email}  at ${time}`;
    }
    case 'RUN_ANALYSIS_CONFIRM': {
      return `Analysis confirmed finalized by ${timelineItem.email} at ${time}`;
    }
    default:
      return null;
  }
};

export default useTimelineStatus;
