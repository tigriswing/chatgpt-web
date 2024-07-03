export function chatContextUtils() {
  function lenTokens(text: string): number {
    const trimmedText = text.trim()
    if (trimmedText.length === 0)
      return 0

    let count = 0
    const tokens = trimmedText.split(/\s+/)
    for (const value of tokens)
      count += value.length * 1.42 // token * 0.7 = text.length

    return Math.floor(count)
  }

  function adjustChatLen(chatMsg: string, maxHistoryTokens: number, index: number, limitStartIndex: number): string {
    let ratio = 0.2
    if (index === limitStartIndex - 1) { // 倒数第2条
      ratio = 0.5
    }

    if (lenTokens(chatMsg) < maxHistoryTokens * ratio) { // 如果字数小，则直接返回，不用截断
      return chatMsg
    }
    else if (index === limitStartIndex - 1) {
      // 倒数第二条是重要上下文，必须上送
      return chatMsg.substring(Math.floor(chatMsg.length * ratio))
    }

    const paragraphs: string[] = chatMsg.split('\n\n') // 将文本分隔成多个段落
    let lastParagraph = paragraphs[paragraphs.length - 1]
    const tokenLen = lenTokens(lastParagraph)

    if (tokenLen >= maxHistoryTokens) {
      const needLen = Math.floor(lastParagraph.length * 0.5)
      lastParagraph = lastParagraph.substring(needLen)
    }

    return lastParagraph
  }

  function askQuestionWithContext(
    dataList: Chat.Chat[], maxHistoryTokens = 1500): Chat.ChatAskBean {
    const limitStartIndex: number = dataList.length - 1
    const systemArray: Chat.ChatMessage[] = []
    const assArray: Chat.ChatMessage[] = []
    let userQuery = ''

    let conversationTokens = 0
    let index = 0

    while (index < dataList.length) {
      const value = dataList[index]

      if (index > limitStartIndex)
        break

      const chatMsg: Chat.ChatMessage = { role: '', content: '' }

      if (index === 0) {
        chatMsg.role = 'system'
        chatMsg.content = dataList[0].text
        systemArray.push(chatMsg)
        conversationTokens += lenTokens(chatMsg.content)
      }
      else if (index === limitStartIndex) {
        chatMsg.role = 'user'
        chatMsg.content = dataList[index].text
        userQuery = chatMsg.content
        conversationTokens += lenTokens(chatMsg.content)
      }
      else {
        const valueMsg = adjustChatLen(value.text, maxHistoryTokens, index, limitStartIndex)
        conversationTokens += lenTokens(valueMsg)

        if (conversationTokens > maxHistoryTokens && index !== limitStartIndex - 1) {
          index++
          continue
        }

        chatMsg.role = value.inversion ? 'user' : 'assistant'
        chatMsg.content = valueMsg
        assArray.push(chatMsg)
      }

      index++
    }

    return { systemArray, assArray, userQuery }
  }

  return {
    askQuestionWithContext,
  }
}
