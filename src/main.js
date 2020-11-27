import './styles/global.css';
import App from './apps/App.svelte';
import GLApp from './apps/GLApp.svelte';
import VizRApp from './apps/VizRApp.svelte';
import QuestLogApp from './apps/QuestLogApp.svelte';
import TechApp from './apps/TechApp.svelte';

const appId = 'svelte-app';
const appElement = document.getElementById(appId);
export default ( // Check if app id exists in DOM
    appElement !== null &&
    (appElement.constructor.name === 'HTMLElement' ||
        appElement.constructor.name === 'HTMLDivElement')
    ) ?
    new App({
        target: appElement,
        props: {
            greeting:
`Hooray 🎉 - you've built this with <a href='https://github.com/dancingfrog/sveltr' target='_blank'>Sveltr</a>!`
        }
    }) : {};


const questAppId = 'quest-log-app';
const questAppElement = document.getElementById(questAppId);
export const questApp = (
    questAppElement !== null &&
    (questAppElement.constructor.name === 'HTMLElement' ||
        questAppElement.constructor.name === 'HTMLDivElement')
    ) ?
    new QuestLogApp({
        target: questAppElement,
        props: {
            title: '🦊 Welcome to QuestLog!'
        }
    }) : {};


const techAppId = 'tech-app';
const techAppElement = document.getElementById(techAppId);
export const techApp = (
    techAppElement !== null &&
    (techAppElement.constructor.name === 'HTMLElement' ||
        techAppElement.constructor.name === 'HTMLDivElement')
    ) ?
    new TechApp({
        target: techAppElement,
        props: {
            title: '🦊 Hello Svelte!'
        }
    }) : {};


const glAppId = 'gl-app';
const glAppElement = document.getElementById(glAppId);
export const glApp = (
    glAppElement !== null &&
    (glAppElement.constructor.name === 'HTMLElement' ||
        glAppElement.constructor.name === 'HTMLDivElement')
    ) ?
    new GLApp({
        target: glAppElement,
        props: {
            title: '🦊 Hello SvelteGL!'
        }
    }) : {};


const vizrAppId = 'uni-sol';
const vizrAppElement = document.getElementById(vizrAppId);
export const vizrApp = (
    vizrAppElement !== null &&
    (vizrAppElement.constructor.name === 'HTMLElement' ||
        vizrAppElement.constructor.name === 'HTMLDivElement')
    ) ?
    new VizRApp({
        target: vizrAppElement,
        props: {
            title: 'Visualizing R Data with Sveltr'
        }
    }) : {};
