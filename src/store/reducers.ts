import { combineReducers } from '@reduxjs/toolkit';

import account from './account/reducers';
import ui from './ui/reducers';
import { accessLevelReducers } from './account/useAcessLevel'
import { setCongifReducers } from './account/setConfig'


export default combineReducers({
  account,
  ui,
  acessLevel: accessLevelReducers,
  config: setCongifReducers,
});
