import React, { useState, useEffect } from 'react';
import { Typography } from 'antd';
import moment from 'moment';

const Countdown = ({ startTime }) => {
  const min = moment(moment().diff(startTime)).format('m');
  const sec = moment(moment().diff(startTime)).format('s');

  const sessionMinutes = 30 - +min;
  const sessionSeconds = 60 - +sec;
  const [minutes, setMinutes] = useState(30 - +min);
  const [seconds, setSeconds] = useState(60 - +sec);

  useEffect(() => {
    setMinutes(min);
    setSeconds(sec);
  }, [startTime]);

  useEffect(() => {
    const myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (sessionMinutes === 0) {
          clearInterval(myInterval);
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  return (
    <div>
      {sessionMinutes === 0 && sessionSeconds === 0 ? null : (
        <Typography.Title size="11">
          {`${sessionMinutes} : ${
            sessionSeconds < 10 ? `0${sessionSeconds}` : sessionSeconds
          }`}
        </Typography.Title>
      )}
    </div>
  );
};

export default Countdown;
