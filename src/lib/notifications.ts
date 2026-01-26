import { toast } from 'sonner'

import type { Notice, NoticeTone } from '@/types/notice'

export const notify = (message: string, tone: NoticeTone = 'info') => {
  if (tone === 'success') {
    toast.success(message)
    return
  }
  if (tone === 'error') {
    toast.error(message)
    return
  }
  toast(message)
}

export const notifyNotice = (notice: Notice) => {
  notify(notice.message, notice.tone)
}

