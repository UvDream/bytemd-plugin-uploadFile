/*
 * @Author: wangzhongjie
 * @Date: 2021-07-26 10:22:44
 * @LastEditors: wangzhongjie
 * @LastEditTime: 2021-07-26 11:49:22
 * @Description:上传文件
 * @Email: UvDream@163.com
 */
import type { BytemdPlugin } from 'bytemd'
import { icons } from './icons'
import en from './locales/en.json'
import selectFiles from 'select-files'
import type { EditorProps } from "bytemd/lib/types"


export interface BytemdPluginUploadFileOptions {
    locale?: Partial<typeof en>,
    uploadFile?: EditorProps['uploadFile']
}

export default function UploadFile({
    locale: _locale,
    uploadFile
}: BytemdPluginUploadFileOptions = {}): BytemdPlugin {

    const locale = { ...en, ..._locale } as typeof en

    return {
        actions: [
            {
                title: locale.uploadFile,
                icon: icons.uploadFile,
                handler: {
                    type: 'action',
                    shortcut: '哈哈',
                    async click(ctx) {
                        const fileList = await selectFiles({
                            accept: '*',
                            multiple: true,
                        })
                        console.log(fileList);
                        if (fileList?.length) {
                            const files = await uploadFile(Array.from(fileList))
                            const pos = ctx.appendBlock(
                                files
                                    .map(({ url, alt, title }, i) => {
                                        alt = alt ?? files[i].name
                                        return `[${alt}](${url}${title ? ` "${title}"` : ''})`
                                    })
                                    .join('\n\n')
                            )
                            ctx.editor.setSelection(pos, ctx.codemirror.Pos(pos.line + files.length * 2 - 2))
                            ctx.editor.focus()

                        }
                    }
                }
            }
        ],
    }
}