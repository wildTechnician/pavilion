import Component from '../Component';
import Events from '../events';
import {
  UI_EVENT_NAME,
  STATIC_LOADED,
  LOAD_PROCESS,
  ACTION_EVENT_NAME,
} from '@/configs';
import changeImage from '@/assets/images/change.png';
import jumpImage from '@/assets/images/jump.png';

import type UIEvents from '../events/UIEvents';
import type ActionEvent from '../events/ActionEvent';
export default class UI extends Component {
  private _event: UIEvents;
  private _actionEvent: ActionEvent;
  private _loadingHandle: HTMLElement;
  public name: string = 'ui';
  constructor() {
    super();
    this._event = Events.getStance().getEvent(UI_EVENT_NAME);
    this._actionEvent = Events.getStance().getEvent(
      ACTION_EVENT_NAME
    ) as ActionEvent;
    this._loadingHandle = document.getElementById('loading')!;

    this._manageLoad();
    this._setupEvents();
  }

  _setupEvents() {}

  initialize() {
    const controlHandle = this._createControl();

    this._createAction();

    this._actionEvent.bindEvent(controlHandle);
    this._loadingHandle.style.display = 'none';
  }

  set weaponTip(visible: boolean) {
    const el = document.querySelector<HTMLElement>('.weapon')!;
    this.mask = visible;
    this.tip = visible;
    el.style.display = visible ? 'block' : 'none';
  }
  get weaponTip() {
    const el = document.querySelector<HTMLElement>('.weapon')!;
    return el.style.display === 'block';
  }

  set mask(visible: boolean) {
    const el = document.querySelector<HTMLElement>('#mask')!;
    el.style.display = visible ? 'block' : 'none';
  }
  get mask() {
    const el = document.querySelector<HTMLElement>('#mask')!;
    return el.style.display === 'block';
  }

  set tip(visible: boolean) {
    const el = document.querySelector<HTMLElement>('#tips')!;
    el.style.display = visible ? 'block' : 'none';
  }
  get tip() {
    const el = document.querySelector<HTMLElement>('#tips')!;
    return el.style.display === 'block';
  }

  _manageLoad() {
    const loadingText: HTMLElement = document.getElementById('loading-text')!;
    const loadName = document.createElement('p');
    loadingText.innerHTML = `<div class="g-progress" id="g-progress" style="--progress: 0%"></div>`;
    loadingText.appendChild(loadName);
    loadName.style.lineHeight = '30px';
    const progress: HTMLElement = document.getElementById('g-progress')!;
    this._event.addEventListener(LOAD_PROCESS, ({ message }) => {
      const { url, itemsLoaded, itemsTotal } = message;
      if (itemsLoaded / itemsTotal >= 1) {
        progress.setAttribute('style', `--progress: 0%`);
      } else {
        progress.setAttribute(
          'style',
          `--progress: ${(itemsLoaded / itemsTotal) * 100}%`
        );
      }
      loadName.innerText = `正在加载${url.split('/').pop()}`;
    });
  }

  private _createControl() {
    const control = document.createElement('div');
    control.setAttribute('class', 'position-control');
    document.body.appendChild(control);
    return control;
  }

  private _createAction() {
    const control = document.createElement('div');
    const change = document.createElement('div');
    control.setAttribute('class', 'jump-control');
    control.innerHTML = `<img src="${jumpImage}" height="100%" width="100%"/>`;
    change.innerHTML = `<img src="${changeImage}" height="100%" width="100%"/>`;
    document.body.appendChild(control);
    change.setAttribute('class', 'change-control');
    document.body.appendChild(change);
    control.onclick = () => {
      this._actionEvent.actionEvent('Space');
    };
    change.onclick = () => {
      this._actionEvent.actionEvent('KeyV');
    };
  }
}
