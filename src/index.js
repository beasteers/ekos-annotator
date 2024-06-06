import habitat from 'preact-habitat';
import Widget from './app';
import Task from './components';

// habitat render docs: https://github.com/zouhir/preact-habitat#api-docs
const { render } = habitat(Task);
// const { render } = habitat(Widget);
/**
 * option 1: render inline - just add the script inside the HTML element that you want to render in. 
 * 
 * Use this when: you only have a single or a few widgets and want something super easy.
 * 
 * Usage:
 * <div class="beautiful-container">
 *  <script async src="build/bundle.js" data-prop-name="something" data-prop-color="blue"></script>
 * </div>
*/
// render({ inline: true });

/**
 * option 2: render in hard-coded selector
 * 
 * Use this when: You have multiple widgets, or you are comfortable with a hard coded selector.
 * 
 * Usage:
 * <div class="my-widget-container" data-prop-name="something" data-prop-color="blue"></div>
 * <script async src="/build/bundle.js" type="text/javascript"></script>
*/
// render({ selector: ".my-widget-container", clean: true });

/**
 * option 3: specify the html selector later when you embed it
 * 
 * Use this when: You want to customize the selector when you add it to HTML. NOTE: I'm pretty sure this won't work if you try 
 *      to do this with two or more widgets (I'm not sure how you would specify multiple data-mount-in attributes?)
 * 
 * this gives you the most flexibility. You need to add `data-mount-in=".my-container"`
 * as an attribute to the script tag when you include the bundle.js
 * e.g. `<script async src="build/bundle.js" data-mount-in=".my-container"></script>`
 * 
 * Usage:
 * <div class="super-cool-widget" data-prop-name="Bisecting Universe" data-prop-color="purple"></div>
 * <script async src="/build/bundle.js" data-mount-in=".super-cool-widget" type="text/javascript"></script>
*/
render({ clientSpecified: true });


// // you can include a second widget like this
// import { GoodnightMoon } from './components';
// const otherWidget = habitat(GoodnightMoon);
// otherWidget.render({ selector: ".goodnight-widget", clean: true });