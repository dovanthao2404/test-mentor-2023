import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { NoticeType } from 'antd/es/message/interface';

interface MessageCommon{
    type: NoticeType,
    content: string,
}

export interface Message extends MessageCommon{
    isShow: boolean,
    id: number
}
export type MessagePayload = MessageCommon

const initialState: Message = {
    type: 'success',
    content: '',
    isShow: false,
    id: 0
};

const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        showMessage: (state, action: PayloadAction<MessagePayload>) => {
            for (const [key, value] of Object.entries(action.payload)) {
                state[key] = value;
            }
            state.isShow = true;
            state.id = Date.now()
        },
        hideMessage: (state) => {
            state.isShow = false;
        }
    },
},
);

export const { showMessage, hideMessage } = messageSlice.actions;
export default messageSlice.reducer;