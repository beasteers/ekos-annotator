import habitat from 'preact-habitat';
import Task from './components';

// habitat render docs: https://github.com/zouhir/preact-habitat#api-docs
const { render } = habitat(Task);
render({ clientSpecified: true });
