import { NoticeType } from 'antd/es/message/interface';
import { MessagePayload } from '../../redux/message/slice';

export class Message implements MessagePayload {
  type: NoticeType;
  content: string;
  constructor(type: NoticeType = 'success', content: string = '') {
    this.type = type;
    this.content = content;
  }
}
