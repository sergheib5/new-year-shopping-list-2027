import { useNewYearCountdown } from '../hooks/useNewYearCountdown';
import './NewYearCountdown.css';

const NewYearCountdown = () => {
  const { days, hours, minutes, seconds, targetYear } = useNewYearCountdown();

  return (
    <div className="countdown-container">
      <div className="countdown-heading">
        <span className="countdown-label">🎉 New Year {targetYear}</span>
        <time className="countdown-date" dateTime={`${targetYear}-01-01`}>Jan 1, {targetYear}</time>
      </div>
      <div className="countdown-time" aria-label={`Countdown to January 1, ${targetYear}`}>
        <span className="time-unit">
          <span className="time-value">{String(days).padStart(2, '0')}</span>
          <span className="time-label">Days</span>
        </span>
        <span className="time-separator">:</span>
        <span className="time-unit">
          <span className="time-value">{String(hours).padStart(2, '0')}</span>
          <span className="time-label">Hours</span>
        </span>
        <span className="time-separator">:</span>
        <span className="time-unit">
          <span className="time-value">{String(minutes).padStart(2, '0')}</span>
          <span className="time-label">Min</span>
        </span>
        <span className="time-separator">:</span>
        <span className="time-unit">
          <span className="time-value">{String(seconds).padStart(2, '0')}</span>
          <span className="time-label">Sec</span>
        </span>
      </div>
    </div>
  );
};

export default NewYearCountdown;

