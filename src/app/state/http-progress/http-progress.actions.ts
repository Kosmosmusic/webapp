import { getActionCreator } from 'src/app/utils/ngxs.util';

import { HTTP_PROGRESS_STATE_TOKEN, THttpProgressPayload } from './http-progress.interface';

const createAction = getActionCreator(HTTP_PROGRESS_STATE_TOKEN.toString());

export const startProgress = createAction<THttpProgressPayload>('start');
export const stopProgress = createAction<THttpProgressPayload>('stop');
