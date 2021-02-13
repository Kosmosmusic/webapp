import { getActionCreator } from '../../utils/ngxs.util';
import { SOUNDCLOUD_STATE_TOKEN, TSoundcloudPayload } from './soundcloud.interface';

const createAction = getActionCreator(SOUNDCLOUD_STATE_TOKEN.toString());

export const setSoundcloudState = createAction<TSoundcloudPayload>('set state');
