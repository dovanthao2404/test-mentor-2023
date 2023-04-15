import { MessageEnum } from "../../common/enum/message";

export class BuildMessage {
    static buildMessageById(id: string, param: string[]): string {
        let message: string = MessageEnum[id]
        const replaceChar = '$';
        const positionReplace: number[] = []
        for(let i = 0; i < message.length; i++) {
            if (message[i] === replaceChar) {
                positionReplace.push(i)
            }
        }
        for (let i = 0; i < param.length; i++) {
            message = message.replace(replaceChar, param[i])
        }
        return message
    }
}