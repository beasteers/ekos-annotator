import habitat from 'preact-habitat';
import Widget from './app';

// habitat render docs: https://github.com/zouhir/preact-habitat#api-docs
const { render } = habitat(Widget);
render({ clientSpecified: true });
